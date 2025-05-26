// File: backend/server.ts
/**
 * @file Main backend server setup for Voice Chat Assistant.
 * @description Initializes Express app, configures middleware, sets up routes,
 * and starts the HTTP server.
 * @version 1.2.2 - Correctly imported and applied i18n middleware setup.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { configureRouter }  from './config/router';
import { optionalAuthMiddleware } from './middleware/optionalAuth'; // Assuming you created this
import { rateLimiter } from './middleware/ratelimiter';
// Import setupI18nMiddleware instead of a non-existent i18nMiddleware
import { setupI18nMiddleware } from './middleware/i18n';
import { initializeLlmServices } from './src/core/llm/llm.factory';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const envPath = path.join(projectRoot, '.env');
dotenv.config({ path: envPath });

const PORT = process.env.PORT || 3001;
const app: Express = express();

// --- Middleware Configuration ---
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: [
    frontendUrl,
    'http://localhost:5173',
    ...(process.env.ADDITIONAL_CORS_ORIGINS ? process.env.ADDITIONAL_CORS_ORIGINS.split(',') : [])
  ],
  credentials: true,
  exposedHeaders: ['X-RateLimit-Limit-Day-IP', 'X-RateLimit-Remaining-Day-IP', 'X-RateLimit-Reset-Day-IP', 'X-RateLimit-Status'],
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- Server Initialization and Middleware Application ---
async function startServer() {
  // Initialize services that need async setup BEFORE routes or request-dependent middleware
  await initializeLlmServices();

  // Setup i18n middleware (which itself initializes i18next)
  // This returns an array of handler functions.
  const i18nHandlers = await setupI18nMiddleware();
  app.use(i18nHandlers); // Apply all i18n handlers globally or to specific paths

  // Apply other application-specific middleware AFTER i18n if they depend on req.t, etc.
  // or before if i18n needs things they set up. Current order seems fine.

  // Optional Authentication Middleware (for /api routes)
  app.use('/api', optionalAuthMiddleware); // You need to create optionalAuth.ts

  // Rate Limiter (for /api routes)
  app.use('/api', rateLimiter.middleware());

  // Setup API routes
  const apiRouter = await configureRouter();
  app.use('/api', apiRouter);
  console.log('🚀 API Routes configured under /api');

  // Health check endpoint (can be outside /api if preferred)
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
  });

  // Optional: Serve static files from frontend build
  if (process.env.SERVE_FRONTEND === 'true') {
    const frontendBuildPath = path.join(projectRoot, 'frontend', 'dist');
    if (require('fs').existsSync(frontendBuildPath)) { // Use require('fs') for synchronous check
      app.use(express.static(frontendBuildPath));
      app.get('*', (req, res) => { // Catch-all for SPA routing
        if (!req.path.startsWith('/api/')) { // Avoid conflicts with API routes
             res.sendFile(path.join(frontendBuildPath, 'index.html'));
        } else {
            // If it's an API path not caught by apiRouter, let 404 handler catch it
            // This else block might not be strictly necessary if apiRouter is comprehensive
        }
      });
      console.log(`Serving frontend from ${frontendBuildPath}`);
    } else {
      console.warn(`SERVE_FRONTEND is true, but frontend build directory not found at ${frontendBuildPath}`);
    }
  }

  // Not Found Handler (must be after all route definitions)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!res.headersSent) {
      res.status(404).json({ message: 'Resource not found on this server.' });
    } else {
      next(); // Should not happen if previous handlers correctly finish responses
    }
  });

  // Global Error Handler (must be the last piece of middleware)
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled application error:', err.stack || err);
    if (!res.headersSent) {
      res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? { message: err.message, stack: err.stack } : { message: 'An unexpected error occurred.'}
      });
    } else {
      // If headers already sent, delegate to default Express error handler
      // This is important for streaming responses or other cases where part of response is sent.
      next(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`✅ Server is listening on port ${PORT}`);
    console.log(`🔗 Frontend URL: ${frontendUrl}`);
    console.log(`🔧 Node ENV: ${process.env.NODE_ENV || 'development'}`);
    if (process.env.DISABLE_COST_LIMITS === 'true') {
        console.warn('💰 Cost limits are DISABLED.');
    }
    if (process.env.REDIS_URL) {
        console.log('📦 Rate limiter and/or cache potentially using Redis.');
    } else {
        console.warn('📦 REDIS_URL not found. Rate limiter using in-memory store.');
    }
  }).on('error', (error: NodeJS.ErrnoException) => {
    console.error('❌ Server failed to start:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
    }
    process.exit(1);
  });
}

startServer();