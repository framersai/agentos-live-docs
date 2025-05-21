import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Updated authentication middleware to check both cookies and auth header
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip auth check for login route
  if (req.path === '/auth') {
    return next();
  }

  const authHeader = req.headers.authorization;
  const authCookie = req.cookies?.auth;
  const password = process.env.PASSWORD;

  if (!password) {
    console.warn('No password set in environment variables');
    return next();
  }

  // Check cookie first
  if (authCookie && authCookie === password) {
    return next();
  }

  // Check authorization header as fallback
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    if (token === password) {
      return next();
    }
  }

  return res.status(401).json({ message: 'Unauthorized: Authentication required' });
};