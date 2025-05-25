// File: backend/server.ts
/**
 * @fileoverview Updated server integration with proper route mounting and service initialization.
 * This file orchestrates the complete Voice Chat Assistant backend system with full
 * AgentOS integration, authentication, and API route configuration.
 * 
 * Key Updates:
 * - Proper route factory function calls with required parameters
 * - Correct service dependency injection
 * - Enhanced error handling and logging
 * - Complete middleware chain setup
 * - Production-ready configuration
 * 
 * @module backend/server
 * @author Voice Chat Assistant Team
 * @version 1.0.0
 */

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs';

// Database utilities
import prismaInstance, { connectToDatabase, disconnectFromDatabase } from './db';

// Core AgentOS Services and Managers
import { IAuthService } from './services/user_auth/IAuthService';
import { AuthService } from './services/user_auth/AuthService';
import { ISubscriptionService, SubscriptionService } from './services/user_auth/SubscriptionService';
import { ILemonSqueezyService, LemonSqueezyService, LemonSqueezyConfig } from './services/payment/LemonSqueezyService';

// AgentOS Core System
import { AgentOS } from './agentos/api/AgentOS';
import { IAgentOS } from './agentos/api/interfaces/IAgentOS';

// API Route Factories
import { createAuthRoutes } from './api/authRoutes';
import { createAgentOSRoutes } from './api/agentosRoutes';
import { createPersonaRoutes } from './api/personaRoutes';
import { createLemonSqueezyWebhooksRoutes } from './api/webhooks/lemonSqueezyWebhooksRoutes';

// Error handling utilities
import { GMIError, GMIErrorCode } from './utils/errors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// =============================================================================
// MIDDLEWARE SETUP
// Essential middleware for security, parsing, and request handling
// =============================================================================

// Security middleware with production-ready configuration
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false, // Required for some AI model APIs
}));

// CORS configuration with environment-specific settings
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, process.env.APP_URL].filter(Boolean)
    : [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'X-Request-ID',
    'Accept',
    'Origin'
  ],
  credentials: true,
  maxAge: 86400, // 24 hours preflight cache
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Request parsing and logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); // Increased limit for potential file uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID middleware for tracking
app.use((req: Request, res: Response, next: NextFunction) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.headers['x-request-id']);
  next();
});

// =============================================================================
// GLOBAL SERVICE INSTANCES
// Core services that will be initialized during startup
// =============================================================================

let authServiceInstance: IAuthService;
let subscriptionServiceInstance: ISubscriptionService;
let lemonSqueezyServiceInstance: ILemonSqueezyService;
let agentOSInstance: IAgentOS;

/**
 * Initializes all global services required for the Voice Chat Assistant backend.
 * Services are initialized in dependency order to ensure proper integration.
 * 
 * @async
 * @function initializeGlobalServices
 * @throws {Error} If any critical service fails to initialize
 */
async function initializeGlobalServices(): Promise<void> {
  console.log('🚀 Voice Chat Assistant Backend: Initializing global services...');

  // Connect to database first
  await connectToDatabase();

  // 1. Initialize Payment Service (LemonSqueezy)
  console.log('📦 Initializing LemonSqueezy payment service...');
  const lsConfig: LemonSqueezyConfig = {
    apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
    storeId: process.env.LEMONSQUEEZY_STORE_ID || '',
    webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '',
  };

  if (!lsConfig.apiKey || !lsConfig.storeId || !lsConfig.webhookSecret) {
    console.warn("⚠️ LemonSqueezy configuration incomplete. Payment features will be limited.");
  }

  lemonSqueezyServiceInstance = new LemonSqueezyService(prismaInstance, lsConfig);
  if (lemonSqueezyServiceInstance.initialize) {
    await lemonSqueezyServiceInstance.initialize();
  }
  console.log('✅ LemonSqueezy service initialized');

  // 2. Initialize Authentication Service
  console.log('🔐 Initializing authentication service...');
  authServiceInstance = new AuthService(prismaInstance, undefined, {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    apiKeyEncryptionKeyHex: process.env.API_KEY_ENCRYPTION_KEY_HEX,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  });

  if (authServiceInstance.initialize) {
    await authServiceInstance.initialize();
  }
  console.log('✅ Authentication service initialized');

  // 3. Initialize Subscription Service
  console.log('💳 Initializing subscription service...');
  subscriptionServiceInstance = new SubscriptionService(
    prismaInstance, 
    authServiceInstance, 
    lemonSqueezyServiceInstance
  );
  await subscriptionServiceInstance.initialize();
  console.log('✅ Subscription service initialized');

  // 4. Initialize AgentOS System
  console.log('🧠 Initializing AgentOS system...');
  const agentOSConfig = {
    defaultPersonaId: process.env.DEFAULT_PERSONA_ID || 'default_assistant_persona',
    personaDefinitionsPath: process.env.PERSONA_DEFINITIONS_PATH || './backend/agentos/cognitive_substrate/personas/definitions',
    modelProviders: {
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        defaultModel: process.env.MODEL_PREF_GENERAL_CHAT || 'gpt-4o-mini',
      },
      openrouter: {
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultModel: process.env.MODEL_PREF_GENERAL_CHAT || 'openai/gpt-4o-mini',
        siteUrl: process.env.APP_URL,
        appName: 'Voice Chat Assistant',
      },
      ollama: {
        baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        defaultModel: 'llama3.2:3b',
      },
    },
    database: prismaInstance,
    authService: authServiceInstance,
    subscriptionService: subscriptionServiceInstance,
  };

  agentOSInstance = new AgentOS();
  await agentOSInstance.initialize(agentOSConfig);
  console.log('✅ AgentOS system initialized');

  console.log('🎉 All global services initialized successfully!');
}

// =============================================================================
// HEALTH CHECK ENDPOINT
// Provides system status information for monitoring and load balancers
// =============================================================================

app.get('/health', async (req: Request, res: Response) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: false,
      agentOS: false,
      authentication: false,
      subscription: false,
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
  };

  // Check database connectivity
  try {
    await prismaInstance.$queryRaw`SELECT 1`;
    healthCheck.services.database = true;
  } catch (error) {
    console.error('Health check - Database error:', error);
  }

  // Check service availability
  healthCheck.services.agentOS = !!agentOSInstance;
  healthCheck.services.authentication = !!authServiceInstance;
  healthCheck.services.subscription = !!subscriptionServiceInstance;

  const allServicesHealthy = Object.values(healthCheck.services).every(service => service === true);
  const statusCode = allServicesHealthy ? 200 : 503;

  res.status(statusCode).json(healthCheck);
});

// =============================================================================
// API ROUTES SETUP
// Mount all API routes with proper service dependencies
// =============================================================================

/**
 * Service availability middleware that ensures required services are initialized
 * before allowing access to API endpoints.
 */
const ensureServicesReady = (requiredServices: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const serviceMap: Record<string, any> = {
      auth: authServiceInstance,
      subscription: subscriptionServiceInstance,
      agentOS: agentOSInstance,
      payment: lemonSqueezyServiceInstance,
    };

    const missingServices = requiredServices.filter(service => !serviceMap[service]);
    
    if (missingServices.length > 0) {
      const errorResponse = {
        error: {
          code: GMIErrorCode.SERVICE_UNAVAILABLE,
          message: `Required services not available: ${missingServices.join(', ')}`,
          details: { missingServices, requiredServices },
          timestamp: new Date().toISOString(),
        },
      };
      return res.status(503).json(errorResponse);
    }

    next();
  };
};

// Authentication Routes
app.use('/api/v1/auth', 
  ensureServicesReady(['auth', 'subscription']),
  (req, res, next) => {
    const authRouter = createAuthRoutes(authServiceInstance, subscriptionServiceInstance);
    authRouter(req, res, next);
  }
);

// AgentOS Core Routes
app.use('/api/v1/agentos',
  ensureServicesReady(['agentOS', 'auth']),
  (req, res, next) => {
    const agentOSRouter = createAgentOSRoutes(agentOSInstance, authServiceInstance);
    agentOSRouter(req, res, next);
  }
);

// Persona Management Routes
app.use('/api/v1/personas',
  ensureServicesReady(['agentOS', 'auth']),
  (req, res, next) => {
    const personaRouter = createPersonaRoutes(agentOSInstance, authServiceInstance);
    personaRouter(req, res, next);
  }
);

// Payment Webhook Routes
app.use('/api/webhooks',
  ensureServicesReady(['payment', 'subscription']),
  (req, res, next) => {
    const webhookRouter = createLemonSqueezyWebhooksRoutes(
      prismaInstance, 
      subscriptionServiceInstance, 
      lemonSqueezyServiceInstance
    );
    webhookRouter(req, res, next);
  }
);

// =============================================================================
// API ERROR HANDLING
// Catch-all for API routes and comprehensive error handling
// =============================================================================

// 404 handler for API routes
app.use('/api/v1/*', (req: Request, res: Response) => {
  const errorResponse = {
    error: {
      code: GMIErrorCode.ENDPOINT_NOT_FOUND,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
      details: { 
        method: req.method, 
        path: req.originalUrl,
        availableEndpoints: [
          'POST /api/v1/auth/login',
          'POST /api/v1/auth/register',
          'GET /api/v1/auth/me',
          'POST /api/v1/agentos/process',
          'GET /api/v1/agentos/personas',
          'GET /api/v1/personas',
        ],
      },
      timestamp: new Date().toISOString(),
    },
  };
  
  res.status(404).json(errorResponse);
});

// =============================================================================
// FRONTEND SERVING (PRODUCTION)
// Serve static frontend files and handle SPA routing
// =============================================================================

async function setupFrontendServing() {
  if (process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true') {
    const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
    
    if (fs.existsSync(path.join(frontendDistPath, 'index.html'))) {
      // Serve static files with proper caching headers
      app.use(express.static(frontendDistPath, {
        maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
        etag: true,
        lastModified: true,
      }));

      // SPA fallback - serve index.html for non-API routes
      app.get('*', (req: Request, res: Response, next: NextFunction) => {
        // Skip API routes and websocket connections
        if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/socket.io')) {
          return next();
        }
        
        res.sendFile(path.join(frontendDistPath, 'index.html'));
      });

      console.log(`📦 Serving frontend static files from: ${frontendDistPath}`);
    } else {
      console.warn(`⚠️ Frontend 'dist' folder not found at ${frontendDistPath}. Frontend will not be served by this backend.`);
    }
  }
}

// =============================================================================
// GLOBAL ERROR HANDLER
// Comprehensive error handling for all routes and middleware
// =============================================================================

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string || `error-${Date.now()}`;
  
  console.error(`🚨 Global Error Handler [${requestId}] - ${req.method} ${req.originalUrl}:`, {
    error: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    userId: (req as any).user?.userId,
    body: req.method !== 'GET' ? req.body : undefined,
  });

  // If response headers already sent, delegate to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let errorCode: string = GMIErrorCode.INTERNAL_SERVER_ERROR;
  let message = 'An unexpected internal server error occurred.';
  let details: any = undefined;

  // Handle different error types
  if (err instanceof GMIError) {
    statusCode = err.recommendedHttpStatusCode || 400;
    errorCode = err.code;
    message = err.message;
    details = err.details;
  } else if (err.status || err.statusCode) {
    statusCode = err.status || err.statusCode;
    message = err.message || message;
    errorCode = `HTTP_${statusCode}`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = GMIErrorCode.VALIDATION_ERROR;
    message = 'Request validation failed';
    details = err.details || err.errors;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorCode = GMIErrorCode.AUTHENTICATION_REQUIRED;
    message = 'Authentication required';
  } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    statusCode = 503;
    errorCode = GMIErrorCode.SERVICE_UNAVAILABLE;
    message = 'External service unavailable';
    details = { serviceError: err.code };
  }

  const errorResponse = {
    error: {
      code: errorCode,
      message: message,
      details: process.env.NODE_ENV !== 'production' ? details : undefined,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
      timestamp: new Date().toISOString(),
      requestId,
    },
  };

  res.status(statusCode).json(errorResponse);
});

// =============================================================================
// SERVER STARTUP AND SHUTDOWN HANDLING
// Graceful startup and shutdown with proper cleanup
// =============================================================================

/**
 * Starts the Voice Chat Assistant server with all services initialized.
 * Handles graceful startup, service initialization, and error recovery.
 */
async function startServer() {
  try {
    console.log('🚀 Starting Voice Chat Assistant Backend Server...');
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);

    // Initialize all global services
    await initializeGlobalServices();

    // Setup frontend serving if configured
    await setupFrontendServing();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`✨ Voice Chat Assistant Backend is live on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📡 API Base: http://localhost:${PORT}/api/v1`);
      console.log(`   ├── 🔐 /auth/* (Authentication & user management)`);
      console.log(`   ├── 🧠 /agentos/* (AI interactions & streaming)`);
      console.log(`   ├── 🎭 /personas/* (AI persona management)`);
      console.log(`   └── 🪝 /webhooks/* (Payment & external integrations)`);
      
      // Log feature flags and configuration
      const features = {
        registration: process.env.REGISTRATION_ENABLED !== 'false',
        oauth: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        payments: !!(process.env.LEMONSQUEEZY_API_KEY && process.env.LEMONSQUEEZY_STORE_ID),
        ollama: !!process.env.OLLAMA_BASE_URL,
        frontendServing: process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true',
      };
      
      console.log(`🎛️ Features: ${Object.entries(features).filter(([_, enabled]) => enabled).map(([name]) => name).join(', ')}`);
    });

    // Configure server timeouts for long-running AI requests
    server.timeout = 300000; // 5 minutes
    server.keepAliveTimeout = 65000; // 65 seconds
    server.headersTimeout = 66000; // 66 seconds

    // =============================================================================
    // GRACEFUL SHUTDOWN HANDLING
    // Ensures proper cleanup of resources and connections
    // =============================================================================

    const gracefulShutdown = async (signal: string) => {
      console.log(`\n👋 ${signal} received. Initiating graceful shutdown...`);
      
      // Stop accepting new connections
      server.close(async () => {
        console.log('✅ HTTP server closed to new connections');
        
        try {
          // Shutdown AgentOS system
          if (agentOSInstance && agentOSInstance.shutdown) {
            console.log('🧠 Shutting down AgentOS system...');
            await agentOSInstance.shutdown();
            console.log('✅ AgentOS system shutdown complete');
          }

          // Cleanup authentication service
          if (authServiceInstance && authServiceInstance.cleanup) {
            console.log('🔐 Cleaning up authentication service...');
            await authServiceInstance.cleanup();
            console.log('✅ Authentication service cleanup complete');
          }

          // Cleanup subscription service
          if (subscriptionServiceInstance && subscriptionServiceInstance.cleanup) {
            console.log('💳 Cleaning up subscription service...');
            await subscriptionServiceInstance.cleanup();
            console.log('✅ Subscription service cleanup complete');
          }

          // Disconnect from database
          console.log('🗄️ Disconnecting from database...');
          await disconnectFromDatabase();
          console.log('✅ Database disconnection complete');

          console.log('🚪 Voice Chat Assistant backend shutdown complete');
          process.exit(0);
          
        } catch (shutdownError) {
          console.error('❌ Error during graceful shutdown:', shutdownError);
          process.exit(1);
        }
      });

      // Force shutdown if graceful shutdown takes too long
      setTimeout(() => {
        console.error('⚠️ Graceful shutdown timed out after 15 seconds. Forcing exit.');
        process.exit(1);
      }, 15000);
    };

    // Handle different shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // Nodemon restart

    // Handle uncaught exceptions and unhandled rejections
    process.on('uncaughtException', (error) => {
      console.error('❌ FATAL: Uncaught Exception:', error);
      console.error('Stack:', error.stack);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ FATAL: Unhandled Promise Rejection at:', promise);
      console.error('Reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

    // Log successful startup
    console.log('🎉 Voice Chat Assistant Backend started successfully!');
    
  } catch (startupError) {
    console.error('❌ FATAL: Failed to start Voice Chat Assistant Backend:', startupError);
    console.error('Stack:', startupError instanceof Error ? startupError.stack : 'No stack trace available');
    
    // Attempt cleanup even on startup failure
    try {
      if (prismaInstance) {
        await disconnectFromDatabase();
        console.log('✅ Database disconnected during startup failure cleanup');
      }
    } catch (cleanupError) {
      console.error('❌ Error during startup failure cleanup:', cleanupError);
    }
    
    process.exit(1);
  }
}

// =============================================================================
// APPLICATION BOOTSTRAP
// Start the server and handle any bootstrap errors
// =============================================================================

// Validate critical environment variables before starting
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'API_KEY_ENCRYPTION_KEY_HEX',
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ FATAL: Missing required environment variables:');
  missingEnvVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n📝 Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Validate JWT secret strength
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.error('❌ FATAL: JWT_SECRET must be at least 32 characters long for security.');
  process.exit(1);
}

// Validate API key encryption key format
if (process.env.API_KEY_ENCRYPTION_KEY_HEX && !/^[0-9a-fA-F]{64}$/.test(process.env.API_KEY_ENCRYPTION_KEY_HEX)) {
  console.error('❌ FATAL: API_KEY_ENCRYPTION_KEY_HEX must be a 64-character hexadecimal string (32 bytes).');
  console.error('💡 Generate one using: openssl rand -hex 32');
  process.exit(1);
}

// Start the server
startServer().catch((bootstrapError) => {
  console.error('❌ FATAL: Server bootstrap failed:', bootstrapError);
  console.error('Stack:', bootstrapError instanceof Error ? bootstrapError.stack : 'No stack trace available');
  process.exit(1);
});

// Export app for testing purposes
export default app;