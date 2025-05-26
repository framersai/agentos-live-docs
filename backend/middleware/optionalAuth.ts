// File: backend/middleware/optionalAuth.ts
/**
 * @file Optional Authentication Middleware
 * @description Attempts to authenticate a user based on a Bearer token if present.
 * Populates `req.user` if authentication is successful but does NOT reject
 * the request if authentication fails or no token is provided. This allows routes
 * to be "authentication-aware" for features like rate limiting or personalization,
 * while still being publicly accessible if stricter auth is not enforced later.
 * @version 1.0.0
 */
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Determine project root for .env loading (assuming this file is in backend/middleware)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..'); // backend/middleware -> project root

dotenv.config({ path: path.join(projectRoot, '.env') });

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const correctPassword = process.env.PASSWORD;

  // Ensure req.user is clear unless we authenticate successfully
  // @ts-ignore Express.User might not be defined globally by default
  req.user = undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (correctPassword) {
      try {
        // Your existing token decoding and validation logic
        const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
        const parts = decodedToken.split(':'); // Expects "userId:password"

        if (parts.length >= 2) {
          const userIdFromToken = parts[0];
          const passwordFromToken = parts.slice(1).join(':');

          if (passwordFromToken === correctPassword) {
            // @ts-ignore
            req.user = { authenticated: true, id: userIdFromToken || 'default_user_optional_auth' };
            // console.log(`OptionalAuthMiddleware: User ${userIdFromToken || 'default_user_optional_auth'} identified.`);
          } else {
            // Token present, but password mismatch - do not set req.user
            // console.warn(`OptionalAuthMiddleware: Bearer token password mismatch. Token ignored.`);
          }
        } else {
          // console.warn(`OptionalAuthMiddleware: Invalid Bearer token format. Token ignored.`);
        }
      } catch (e) {
        // console.warn("OptionalAuthMiddleware: Error decoding Bearer token. Token ignored.");
      }
    } else {
      // console.warn("OptionalAuthMiddleware: SERVER PASSWORD not set in .env. Cannot validate token.");
    }
  }
  next(); // Always call next, regardless of authentication outcome
};