// backend/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

// Load .env variables from the root of the project
dotenv.config({ path: new URL('../../.env', import.meta.url).pathname });


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip auth check for a dedicated auth route, if you create one (e.g., /api/auth/login)
  // Example: if (req.path.startsWith('/auth')) {
  // return next();
  // }

  const authHeader = req.headers.authorization;
  // Ensure cookie-parser middleware is used in server.ts for req.cookies to be available
  const authCookie = req.cookies?.auth; 
  const password = process.env.PASSWORD;

  if (!password) {
    // This is a server configuration issue.
    // In a production environment, you might want to deny access if no password is configured.
    console.error('SERVER ERROR: Authentication password is not set in environment variables. Denying access.');
    return res.status(500).json({ message: 'Server configuration error: Auth not set up.'});
  }

  // Check Bearer token first (more common for API clients)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token === password) {
      // console.log('Auth successful via Bearer token');
      return next(); // Authenticated
    }
  }

  // Check cookie as fallback (more common for browser sessions after login)
  if (authCookie && authCookie === password) {
    // console.log('Auth successful via cookie');
    return next(); // Authenticated
  }
  
  // console.warn(`Unauthorized access attempt to ${req.path}. Header: ${authHeader}, Cookie: ${authCookie}`);
  return res.status(401).json({ message: 'Unauthorized: Authentication required' });
};