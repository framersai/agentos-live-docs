// File: backend/middleware/authenticateTokenMiddleware.ts
/**
 * @fileoverview Defines the SOTA JWT authentication middleware for AgentOS API routes.
 * This middleware is responsible for validating JWTs provided in the Authorization header,
 * ensuring that the token is valid, not expired, and corresponds to an active user session.
 * If valid, it attaches the authenticated user's token payload to the request object.
 *
 * @module backend/middleware/authenticateTokenMiddleware
 */

import { Request, Response, NextFunction } from 'express';
import { IAuthService, AuthTokenPayload } from '../services/user_auth/IAuthService';
import { GMIErrorCode } from '../utils/errors';

/**
 * Extends the Express Request interface to include the authenticated user's payload.
 * This provides type safety for accessing `req.user` in protected route handlers.
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload; // Make user property optional but typed
}

/**
 * Creates an authentication middleware function.
 * This middleware extracts a JWT from the 'Authorization' header (Bearer scheme),
 * validates it using the provided AuthService, and if valid, attaches the
 * decoded token payload to `req.user`.
 *
 * @param {IAuthService} authService - An instance of the AuthService to validate tokens.
 * @returns {Function} The Express middleware function.
 *
 * @example
 * // In your Express router setup:
 * // import { authenticateToken } from './middleware/authenticateTokenMiddleware';
 * // import { authService } from './services'; // Assuming authService is initialized
 * //
 * // router.get('/protected-route', authenticateToken(authService), (req: AuthenticatedRequest, res) => {
 * //   // req.user is now available and typed as AuthTokenPayload
 * //   res.json({ message: `Hello user ${req.user?.userId}` });
 * // });
 */
export const authenticateToken = (authService: IAuthService) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      res.status(401).json({
        error: {
          code: GMIErrorCode.AUTHENTICATION_TOKEN_MISSING,
          message: 'Unauthorized: No authentication token provided.',
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    try {
      const userPayload = await authService.validateToken(token);
      if (!userPayload) {
        res.status(403).json({
          error: {
            code: GMIErrorCode.AUTHENTICATION_TOKEN_INVALID,
            message: 'Forbidden: Invalid or expired token, or inactive session.',
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }
      req.user = userPayload; // Attach validated user payload to the request
      next();
    } catch (error: any) {
      console.error("AuthMiddleware: Token validation internal error:", error);
      res.status(500).json({
        error: {
          code: GMIErrorCode.INTERNAL_SERVER_ERROR,
          message: 'Internal server error during token validation.',
          details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
          timestamp: new Date().toISOString(),
        },
      });
    }
  };