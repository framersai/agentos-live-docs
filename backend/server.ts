// backend/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { configureRouter } from './config/router.js';
import { authMiddleware } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Handle OPTIONS requests for CORS preflight
app.options('*', cors());

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

// Set up API routes with authentication middleware
const setupRoutes = async () => {
  try {
    const router = await configureRouter();
    
    // All /api routes will go through authMiddleware
    app.use('/api', authMiddleware, router);
    
    // Add a catch-all for unmatched API routes
    app.use('/api/*', (req, res) => {
      res.status(404).json({
        message: `API endpoint not found: ${req.method} ${req.path}`,
        error: 'ENDPOINT_NOT_FOUND',
        availableEndpoints: [
          'POST /api/auth',
          'POST /api/chat', 
          'GET /api/cost',
          'POST /api/cost',
          'POST /api/speech',
          'GET /api/speech'
        ]
      });
    });
    
    // Serve static frontend in production
    if (process.env.NODE_ENV === 'production') {
      const frontendDistPath = path.join(__dirname, '../../frontend/dist');
      app.use(express.static(frontendDistPath));
      
      app.get('*', (req, res) => {
        res.sendFile(path.join(frontendDistPath, 'index.html'));
      });
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Frontend URL configured for CORS: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`🔑 Auth password configured: ${process.env.PASSWORD ? 'Yes' : 'No'}`);
      
      if (!process.env.PASSWORD) {
        console.warn('⚠️  WARNING: PASSWORD is not set in the .env file. Authentication will fail.');
      }
      
      // Log available routes
      console.log('📋 Available API endpoints:');
      console.log('   POST /api/auth - Authentication');
      console.log('   POST /api/chat - Chat with AI');
      console.log('   GET  /api/cost - Get session cost');
      console.log('   POST /api/cost - Reset session cost');
      console.log('   POST /api/speech - Transcribe audio');
      console.log('   GET  /api/speech - Get speech stats');
    });
  } catch (error) {
    console.error('❌ Failed to configure routes:', error);
    throw error;
  }
};

// Global error handling middleware (should be last)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong on the server.',
    error: process.env.NODE_ENV === 'production' ? {} : { message: err.message, stack: err.stack }
  });
});

// Initialize routes and start server
setupRoutes().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

export default app;