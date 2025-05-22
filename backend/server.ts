// backend/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // Added for req.cookies
import { configureRouter } from './config/router.js';
import { authMiddleware } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory
// Ensure this is loaded early, especially before authMiddleware might be initialized or used indirectly
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Adjusted path to root .env

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(cookieParser()); // Added to parse cookies for authMiddleware
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Added common methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Added common headers
  credentials: true // If you plan to use cookies across domains
}));

// Handle OPTIONS requests for CORS preflight
app.options('*', cors());

// Set up API routes with authentication middleware
const setupRoutes = async () => {
  const router = await configureRouter();
  // All /api routes will go through authMiddleware
  app.use('/api', authMiddleware, router);
  
  // Serve static frontend in production
  if (process.env.NODE_ENV === 'production') {
    const frontendDistPath = path.join(__dirname, '../../frontend/dist'); // Adjusted path
    app.use(express.static(frontendDistPath));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  }
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend URL configured for CORS: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    if (!process.env.PASSWORD) {
      console.warn('WARNING: SERVER_PASSWORD is not set in the .env file. Authentication will likely fail.');
    }
  });
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
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;