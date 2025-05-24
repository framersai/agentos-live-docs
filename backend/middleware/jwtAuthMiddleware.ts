// File: backend/middleware/jwtAuthMiddleware.ts
/**
 * @fileoverview Implements JWT-based authentication middleware for Express applications.
 * This middleware extracts JWTs from the Authorization header, validates them using
 * the AuthService, and attaches the authenticated user's payload to the request object.
 *
 * @module backend/middleware/jwtAuthMiddleware
 */

import { Request, Response, NextFunction } from 'express';
import { IAuthService, AuthTokenPayload } from '../services/user_auth/IAuthService';
import { GMIErrorCode } from '../utils/errors'; // For consistent error codes

/**
 * Extends the Express Request interface to include the authenticated user payload.
 * This allows downstream handlers to access user information type-safely.
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload; // Payload from the validated JWT
}

/**
 * Creates an Express middleware function for JWT authentication.
 *
 * @param {IAuthService} authService - An instance of the IAuthService used to validate tokens.
 * @returns {Function} The Express middleware function.
 *
 * @example
 * // In your Express app setup (e.g., server.ts or route file):
 * // import { createJwtAuthMiddleware } from './middleware/jwtAuthMiddleware';
 * // import { authService } from './services'; // Assuming authService is initialized and exported
 * //
 * // const requireAuth = createJwtAuthMiddleware(authService);
 * // app.get('/api/protected-route', requireAuth, (req: AuthenticatedRequest, res: Response) => {
 * //   res.json({ message: `Hello, user ${req.user?.userId}!` });
 * // });
 */
export const createJwtAuthMiddleware = (authService: IAuthService) => {
  /**
   * Express middleware to authenticate requests using JWT.
   * It expects a JWT in the 'Authorization' header with the 'Bearer' scheme.
   * If the token is valid and the associated session is active, `req.user` is populated
   * with the token payload, and the request proceeds. Otherwise, a 401 or 403 error is returned.
   *
   * @param {AuthenticatedRequest} req - The Express request object, potentially augmented with `user`.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The next middleware function in the stack.
   */
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      res.status(401).json({
        code: GMIErrorCode.AUTHENTICATION_TOKEN_MISSING,
        message: 'Unauthorized: No authentication token provided.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const userPayload = await authService.validateToken(token);
      if (!userPayload) {
        res.status(403).json({
          code: GMIErrorCode.AUTHENTICATION_TOKEN_INVALID,
          message: 'Forbidden: Authentication token is invalid, expired, or session is inactive.',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      req.user = userPayload; // Attach validated user payload to the request
      next();
    } catch (error: any) {
      console.error('JWT Authentication Middleware: Error during token validation:', error);
      res.status(500).json({
        code: GMIErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error during token validation.',
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
        timestamp: new Date().toISOString(),
      });
    }
  };
};