// backend/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env variables from the root of the project
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

/**
 * Authentication middleware for Express routes
 * Validates Bearer tokens and auth cookies
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip auth check for the auth route itself
  if (req.path === '/auth') {
    return next();
  }

  const authHeader = req.headers.authorization;
  const authCookie = req.cookies?.auth; 
  const password = process.env.PASSWORD;

  if (!password) {
    console.error('SERVER ERROR: Authentication password is not set in environment variables. Denying access.');
    return res.status(500).json({ 
      message: 'Server configuration error: Authentication not configured.',
      error: 'AUTH_NOT_CONFIGURED'
    });
  }

  // Check Bearer token first (more common for API clients)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token === password) {
      // Add user info to request for downstream use
      (req as any).user = { authenticated: true, id: 'default_user' };
      return next(); // Authenticated
    }
  }

  // Check cookie as fallback (more common for browser sessions after login)
  if (authCookie && authCookie === password) {
    // Add user info to request for downstream use
    (req as any).user = { authenticated: true, id: 'default_user' };
    return next(); // Authenticated
  }
  
  // Log unauthorized attempts for debugging
  console.warn(`Unauthorized access attempt to ${req.method} ${req.path}. IP: ${req.ip}`);
  
  return res.status(401).json({ 
    message: 'Unauthorized: Authentication required',
    error: 'AUTHENTICATION_REQUIRED'
  });
};