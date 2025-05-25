// File: backend/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env variables from the root of the project
dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // Ensure this path is correct for your project structure

/**
 * Authentication middleware for Express routes
 * Validates Bearer tokens and auth cookies
 */


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Allow all requests to /api/auth to pass through.
  // req.path for /api/auth/login would be /auth/login if router is mounted at /api
  // A simpler check if all /api/auth sub-routes are for authentication:
  if (req.originalUrl.startsWith('/api/auth')) { // More robust check for any /api/auth subpath
    return next();
  }

  const authHeader = req.headers.authorization;
  const correctPassword = process.env.PASSWORD; // Loaded from .env

  if (!correctPassword) {
    console.error('SERVER ERROR: AuthMiddleware: PASSWORD not set in environment.');
    return res.status(500).json({ message: 'Server auth not configured.', error: 'AUTH_NOT_CONFIGURED'});
  }

  let authenticatedUser: { authenticated: boolean; id: string } | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
      const parts = decodedToken.split(':'); // Expects "userId:password"

      if (parts.length >= 2) {
        const userIdFromToken = parts[0];
        const passwordFromToken = parts.slice(1).join(':'); // Handles potential colons in password, though unlikely here

        if (passwordFromToken === correctPassword) {
          authenticatedUser = { authenticated: true, id: userIdFromToken || 'default_user' };
        } else {
          console.warn(`AuthMiddleware: Bearer token password mismatch for user '${userIdFromToken}'.`);
        }
      } else {
        console.warn(`AuthMiddleware: Invalid Bearer token format after decoding: ${decodedToken}`);
      }
    } catch (e) {
      console.warn("AuthMiddleware: Error decoding Bearer token:", e);
    }
  }

  if (authenticatedUser) {
    (req as any).user = authenticatedUser;
    return next();
  }

  console.warn(`AuthMiddleware: Unauthorized access to ${req.method} ${req.originalUrl}. IP: ${req.ip}. Auth Header: ${authHeader ? 'Present' : 'Missing'}`);
  return res.status(401).json({
    message: 'Unauthorized: Authentication required.',
    error: 'AUTHENTICATION_REQUIRED'
  });
};