// File: backend/server.ts
/**
 * @file Main backend server setup for Voice Chat Assistant.
 * @description Initializes Express app, configures middleware, sets up routes,
 * and starts the HTTP server.
 * @version 1.3.0 - Added rateLimiter initialization and graceful shutdown.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http'; // Added for graceful shutdown
import fs from 'fs'; // Import fs for file system operations

import { configureRouter } from './config/router';
import { optionalAuthMiddleware } from './middleware/optionalAuth';
import { rateLimiter } from './middleware/ratelimiter'; // Import the instance
import { setupI18nMiddleware } from './middleware/i18n';
import { initializeLlmServices } from './src/core/llm/llm.factory';
import { sqliteMemoryAdapter } from './src/core/memory/SqliteMemoryAdapter'; // Import for shutdown

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const envPath = path.join(projectRoot, '.env');
dotenv.config({ path: envPath }); // Load .env variables first

const PORT = process.env.PORT || 3001;
const app: Express = express();
let server: http.Server; // To store the server instance for graceful shutdown

// --- Middleware Configuration ---
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: [
    frontendUrl,
    'http://localhost:5173', // Default Vite dev port, useful for flexibility
    ...(process.env.ADDITIONAL_CORS_ORIGINS ? process.env.ADDITIONAL_CORS_ORIGINS.split(',') : [])
  ],
  credentials: true,
  exposedHeaders: ['X-RateLimit-Limit-Day-IP', 'X-RateLimit-Remaining-Day-IP', 'X-RateLimit-Reset-Day-IP', 'X-RateLimit-Status'],
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '50mb' })); // For parsing application/json
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // For parsing application/x-www-form-urlencoded

// --- Server Initialization and Middleware Application ---
async function startServer() {
  console.log('🔄 Initializing application services...');
  // Initialize services that need async setup BEFORE routes or request-dependent middleware
  await initializeLlmServices();
  await sqliteMemoryAdapter.initialize(); // Initialize SQLite Adapter
  await rateLimiter.initialize();     // Initialize Rate Limiter (Redis connection etc.)
  console.log('✅ Core services initialized.');

  // Setup i18n middleware
  const i18nHandlers = await setupI18nMiddleware();
  app.use(i18nHandlers);
  console.log('🌍 i18n middleware configured.');

  // Optional Authentication Middleware (for /api routes)
  app.use('/api', optionalAuthMiddleware);

  // Rate Limiter (for /api routes) - Should come after auth if auth affects rate limits
  app.use('/api', rateLimiter.middleware());
  console.log('🛡️ Authentication and Rate Limiting middleware configured for /api.');

  // Setup API routes
  const apiRouter = await configureRouter();
  app.use('/api', apiRouter);
  console.log('🚀 API Routes configured under /api');

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
  });

  // Optional: Serve static files from frontend build
  if (process.env.SERVE_FRONTEND === 'true') {
    const frontendBuildPath = path.join(projectRoot, 'frontend', 'dist');
    const indexPath = path.join(frontendBuildPath, 'index.html');
    if (fs.existsSync(indexPath)) { // Check for index.html specifically
      app.use(express.static(frontendBuildPath));
      app.get('*', (req, res, next) => { // Catch-all for SPA routing
        if (req.path.startsWith('/api/')) { // Avoid conflicts with API routes
          return next(); // Pass to API 404 handler if not caught by apiRouter
        }
        if (req.headers.accept && req.headers.accept.includes('text/html')) {
          res.sendFile(indexPath);
        } else {
          // For non-HTML requests that are not API calls and not static files,
          // let them fall through to the 404 handler.
          next();
        }
      });
      console.log(`🌐 Serving frontend from ${frontendBuildPath}`);
    } else {
      console.warn(`🔔 SERVE_FRONTEND is true, but frontend 'index.html' not found at ${indexPath}`);
    }
  }

  // Not Found Handler (must be after all route definitions and static serving)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!res.headersSent) {
      // Check if it was likely an API call
      if (req.path.startsWith('/api/')) {
        res.status(404).json({ message: `API endpoint not found: ${req.method} ${req.originalUrl}` });
      } else {
        // For non-API routes, if SPA serving didn't catch it, then it's a true 404 for a file perhaps
        res.status(404).type('text/plain').send('Resource not found on this server.');
      }
    } else {
      next();
    }
  });

  // Global Error Handler (must be the last piece of middleware)
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('💥 Unhandled application error:', err.stack || err);
    if (!res.headersSent) {
      res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? { name: err.name, message: err.message, stack: err.stack } : { message: 'An unexpected error occurred.'}
      });
    } else {
      next(err);
    }
  });

  server = app.listen(PORT, () => {
    console.log(`\n✅ Server is listening on port ${PORT}`);
    console.log(`🔗 Frontend URL (configured): ${frontendUrl}`);
    console.log(`🔧 Node ENV: ${process.env.NODE_ENV || 'development'}`);
    if (process.env.ENABLE_SQLITE_MEMORY === 'true') {
      console.log('💾 SQLite Memory Persistence: ENABLED');
    } else {
      console.warn('💾 SQLite Memory Persistence: DISABLED (server is stateless regarding conversation history)');
    }
    if (process.env.DISABLE_COST_LIMITS === 'true') {
      console.warn('💰 Cost limits: DISABLED.');
    }
    if (process.env.REDIS_URL) {
      console.log(`📦 Rate limiter: Configured to attempt Redis connection at ${process.env.REDIS_URL}.`);
    } else {
      console.warn('📦 Rate limiter: REDIS_URL not found, using in-memory store.');
    }
    console.log(`👉 App running at http://localhost:${PORT}\n`);
  }).on('error', (error: NodeJS.ErrnoException) => {
    console.error('❌ Server failed to start:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
    }
    process.exit(1);
  });
}

/**
 * @function gracefulShutdown
 * @description Handles graceful shutdown of the server and related services.
 * @param {string} signal - The signal received (e.g., 'SIGINT', 'SIGTERM').
 */
async function gracefulShutdown(signal: string) {
  console.log(`\n🚦 Received ${signal}. Starting graceful shutdown...`);
  
  // Stop accepting new connections
  if (server) {
    server.close(async () => {
      console.log('🔌 HTTP server closed.');
      
      // Disconnect services
      try {
        await rateLimiter.disconnectStore();
        console.log('🛡️ Rate limiter store disconnected.');
      } catch (e) {
        console.error('Error disconnecting rate limiter:', e);
      }
      
      try {
        await sqliteMemoryAdapter.disconnect(); // Assuming it has a disconnect method
        console.log('💾 SQLite Memory Adapter disconnected.');
      } catch (e) {
        console.error('Error disconnecting SQLite adapter:', e);
      }
      
      // Add any other service disconnections here
      
      console.log('👋 Graceful shutdown complete. Exiting.');
      process.exit(0);
    });

    // If server hasn't finished in a timeout, force close
    setTimeout(() => {
      console.error('⏰ Graceful shutdown timeout. Forcing exit.');
      process.exit(1);
    }, 10000); // 10 seconds timeout
  } else {
    process.exit(0); // If server wasn't even started
  }
}

// Listen for termination signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer().catch(error => {
  console.error('💥 Failed to start server due to unhandled error during initialization:', error);
  process.exit(1);
});