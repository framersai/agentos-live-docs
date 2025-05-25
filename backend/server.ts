// File: backend/server.ts
/**
 * @file Main backend server setup for the Voice Coding Assistant.
 * @version 1.0.1 - Added fs import for existsSync.
 * @description Initializes an Express application, configures middleware (CORS, Helmet, Morgan, etc.),
 * sets up API routes, serves the frontend in production, and handles global errors.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs'; // <-- Added import for 'fs' module

// Assuming these are compiled to .js in the same directory structure or tsx/ts-node is used
import { configureRouter } from './config/router.js';
import { authMiddleware } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the project root directory
// This assumes .env file is in the parent directory of the 'backend' folder (i.e., project root)
// If server.ts is in 'backend/src/', this should be path.resolve(__dirname, '../../.env')
// Given the current path, it implies server.ts is in 'backend/server.ts'
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Core Middleware
app.use(helmet()); // Secure app by setting various HTTP headers
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined')); // HTTP request logger
app.use(cookieParser()); // Parse Cookie header
app.use(express.json({ limit: '50mb' })); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded request bodies

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Default to common Vue dev port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-Client-Version' // <-- Added this header
  ],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));
// Explicitly handle OPTIONS preflight requests for all routes
app.options('*', cors(corsOptions));

// Health Check Endpoint (Publicly Accessible)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: `Backend server is healthy on port ${PORT}.`,
    environment: NODE_ENV,
  });
});

// API Routes Setup
const setupApiRoutes = async (): Promise<void> => {
  try {
    const apiRouter = await configureRouter(); // configureRouter should return an express.Router instance

    // Apply authentication middleware to all /api routes.
    // The authMiddleware should have its own logic to exclude specific paths like /api/auth/login if needed.
    app.use('/api', authMiddleware, apiRouter);

    // Centralized 404 handler for API routes not matched by apiRouter
    // This should be the last middleware for the /api path.
    app.use('/api', (req: Request, res: Response) => {
      const availableEndpoints = [ // This list should be dynamically generated or maintained carefully
        'POST /api/auth (Login)',
        'GET /api/auth (Check Status)',
        'DELETE /api/auth (Logout)',
        'POST /api/chat (Process Chat)',
        'POST /api/diagram (Generate Diagram)',
        'POST /api/stt (Transcribe Audio - formerly /api/speech)', // Assuming new path
        'GET /api/stt/stats (STT Stats - formerly /api/speech/stats)',
        'POST /api/tts (Synthesize Speech)',
        'GET /api/tts/voices (List TTS Voices)',
        'GET /api/cost (Get Session Cost)',
        'POST /api/cost (Reset Session Cost)',
      ];
      res.status(404).json({
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
        error: 'ENDPOINT_NOT_FOUND',
        availableApiRoutes: availableEndpoints, // More descriptive key
      });
    });

  } catch (error) {
    console.error('❌ Failed to configure API routes:', error);
    throw error; // Propagate error to be caught by main startup
  }
};


// Static Frontend Serving (Production Only)
if (NODE_ENV === 'production') {
  // Path assumes server.ts is in 'backend/', and 'frontend/' is a sibling directory
  const frontendDistPath = path.join(__dirname, '../frontend/dist');
  console.log(`Production mode: Attempting to serve frontend from ${frontendDistPath}`);

  if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
    // SPA Fallback: For any GET request not handled by API or static files, serve index.html
    app.get('*', (req: Request, res: Response) => {
      // Check if the request looks like an API call to avoid SPA fallback for missing API endpoints
      if (req.originalUrl.startsWith('/api/')) {
        // This case should ideally be handled by the API 404 handler above
        res.status(404).json({ message: 'API endpoint not found via SPA fallback.' });
      } else {
        res.sendFile(path.resolve(frontendDistPath, 'index.html'));
      }
    });
    console.log(`Serving static files from ${frontendDistPath} and SPA fallback enabled.`);
  } else {
    console.warn(`⚠️ WARNING: Production mode detected, but frontend distribution path not found at ${frontendDistPath}. Frontend will not be served by this server.`);
  }
}

// Global Error Handling Middleware
// This must be the last piece of middleware added.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global Error Handler:', err.name, '-', err.message);
  if (NODE_ENV === 'development' && err.stack) {
    console.error(err.stack);
  }

  // If headers have already been sent, delegate to the default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || err.statusCode || 500;
  const errorResponse = {
    message: err.message || 'An unexpected internal server error occurred.',
    error: err.code || err.name || 'INTERNAL_SERVER_ERROR',
    ...(NODE_ENV === 'development' && { stack: err.stack }), // Include stack in dev
  };

  res.status(statusCode).json(errorResponse);
});

// Start the Server
const startServer = async () => {
  try {
    await setupApiRoutes(); // Ensure API routes are configured before listening

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode.`);
      console.log(`📡 Frontend URL for CORS: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      if (process.env.PASSWORD) {
        console.log('🔑 Basic authentication password is configured.');
      } else {
        console.warn('⚠️ CRITICAL SECURITY WARNING: MASTER PASSWORD (process.env.PASSWORD) is NOT SET. API endpoints will be unprotected or authentication will fail.');
      }
      // Add more startup logs as needed, e.g., database connection status
    });
  } catch (error) {
    console.error('❌ Critical failure during server startup sequence:', error);
    process.exit(1); // Exit if server cannot initialize routes or start
  }
};

startServer();

export default app;