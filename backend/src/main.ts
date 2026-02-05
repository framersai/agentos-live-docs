/**
 * @file main.ts
 * @description NestJS bootstrap entry point. Replaces the legacy Express server.ts.
 * Initializes the NestJS application with CORS, cookie-parser, validation,
 * and all global middleware/filters/interceptors.
 */

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { NotFoundFilter } from './common/filters/not-found.filter.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import { initializeAppDatabase, closeAppDatabase } from './core/database/appDatabase.js';
import { initializeLlmServices } from './core/llm/llm.factory.js';
import { NoLlmProviderConfiguredError, LlmConfigService } from './core/llm/llm.config.service.js';
import {
  setLlmBootstrapStatus,
  getLlmBootstrapStatus,
  mapAvailabilityToStatus,
} from './core/llm/llm.status.js';
import { sqliteMemoryAdapter } from './core/memory/SqliteMemoryAdapter.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { rateLimiter } from '../middleware/ratelimiter.js';
import { createLogger, getErrorMessage } from '../utils/logger.js';

const logger = createLogger('NestServer');

/**
 * Bootstrap the NestJS application.
 */
async function bootstrap(): Promise<void> {
  logger.info('Initializing application services...');

  // ── Pre-NestJS service initialization ──────────────────────────────────
  setLlmBootstrapStatus({
    ready: false,
    code: 'BOOTSTRAP_PENDING',
    message: 'LLM services are initializing.',
    timestamp: new Date().toISOString(),
    providers: {},
  });

  try {
    await initializeAppDatabase();
    await initializeLlmServices();
    const snapshot = LlmConfigService.getInstance().getProviderAvailabilitySnapshot();
    setLlmBootstrapStatus({
      ready: true,
      code: 'LLM_READY',
      message: 'LLM services initialized successfully.',
      timestamp: new Date().toISOString(),
      providers: mapAvailabilityToStatus(snapshot),
    });
  } catch (error) {
    if (error instanceof NoLlmProviderConfiguredError) {
      logger.error('No configured providers detected. Running in degraded mode.');
      setLlmBootstrapStatus({
        ready: false,
        code: 'NO_LLM_PROVIDER',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
        providers: mapAvailabilityToStatus((error as NoLlmProviderConfiguredError).availability),
      });
    } else {
      const msg = (error as Error)?.message || 'Failed to initialize LLM services.';
      logger.error('LLM initialization failed, continuing in degraded mode: %s', msg);
      setLlmBootstrapStatus({
        ready: false,
        code: 'LLM_INIT_FAILURE',
        message: msg,
        timestamp: new Date().toISOString(),
        providers: {},
      });
    }
  }

  await sqliteMemoryAdapter.initialize();
  await rateLimiter.initialize();
  logger.info('Core services initialized.');

  // ── Create NestJS app ──────────────────────────────────────────────────
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // ── Global prefix ─────────────────────────────────────────────────────
  app.setGlobalPrefix('api', {
    exclude: ['health'],
  });

  // ── Trust proxy (for rate limiting behind reverse proxies) ─────────────
  app.set('trust proxy', 1);

  // ── CORS ───────────────────────────────────────────────────────────────
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: [
      frontendUrl,
      'http://localhost:5173',
      'http://localhost:5175',
      ...(process.env.ADDITIONAL_CORS_ORIGINS
        ? process.env.ADDITIONAL_CORS_ORIGINS.split(',')
        : []),
    ],
    credentials: true,
    exposedHeaders: [
      'X-RateLimit-Limit-Day-IP',
      'X-RateLimit-Remaining-Day-IP',
      'X-RateLimit-Reset-Day-IP',
      'X-RateLimit-Status',
    ],
  });

  // ── Middleware ──────────────────────────────────────────────────────────
  app.use(cookieParser());

  // ── Global pipes ───────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // ── Global filters ─────────────────────────────────────────────────────
  app.useGlobalFilters(new NotFoundFilter(), new HttpExceptionFilter());

  // ── Global interceptors ────────────────────────────────────────────────
  app.useGlobalInterceptors(new LoggingInterceptor());

  // ── Swagger / OpenAPI ───────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Voice Chat Assistant API')
    .setDescription(
      'Backend API for the voice coding assistant with AgentOS and Wunderland integration.'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('system', 'Health checks and diagnostics')
    .addTag('auth', 'Authentication and user management')
    .addTag('chat', 'Conversation and LLM routing')
    .addTag('wunderland', 'Agent social network')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDoc);
  logger.info('Swagger docs available at /api/docs');

  // ── Body parsing limits ────────────────────────────────────────────────
  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '50mb' });

  // ── Start listening ────────────────────────────────────────────────────
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);

  const llmStatus = getLlmBootstrapStatus();
  if (!llmStatus.ready) {
    logger.warn('Server running without an active LLM provider.');
  }

  logger.info('Ready at http://localhost:%s', PORT);
  logger.info('Node ENV: %s', process.env.NODE_ENV || 'development');

  // ── Quick links ────────────────────────────────────────────────────────
  const base = `http://localhost:${PORT}`;
  const links = [
    `${base}/health`,
    `${base}/api/test`,
    `${base}/api/system/llm-status`,
    `${base}/api/docs`,
    `${base}/api/agentos/personas`,
  ];
  console.log('\n\x1b[36m\u203a Quick links:\x1b[0m');
  for (const url of links) console.log('  -', url);

  // ── Graceful shutdown ──────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    logger.info('Received %s. Starting graceful shutdown...', signal);
    try {
      await rateLimiter.disconnectStore();
    } catch {
      /* ignore */
    }
    try {
      await sqliteMemoryAdapter.disconnect();
    } catch {
      /* ignore */
    }
    try {
      await closeAppDatabase();
    } catch {
      /* ignore */
    }
    await app.close();
    logger.info('Graceful shutdown complete.');
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// ── Auto-start when run directly ───────────────────────────────────────────
const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, '/')}`;

if (isMainModule) {
  bootstrap().catch((error: unknown) => {
    logger.error('Failed to start server: %s', getErrorMessage(error));
    process.exit(1);
  });
}

export { bootstrap };
