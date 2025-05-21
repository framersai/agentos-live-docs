import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Simple password authentication middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip auth check for login route
  if (req.path === '/auth') {
    return next();
  }

  const authHeader = req.headers.authorization;
  const password = process.env.PASSWORD;

  if (!password) {
    console.warn('No password set in environment variables');
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing authentication token' });
  }

  const token = authHeader.split(' ')[1];
  
  if (token !== password) {
    return res.status(401).json({ message: 'Unauthorized: Invalid authentication token' });
  }

  next();
};