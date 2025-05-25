// File: backend/middleware/jwtAuthMiddleware.ts
/**
 * @fileoverview Complete JWT Authentication Middleware for Voice Chat Assistant.
 * This module provides robust JWT token validation, session management, and user context
 * for protected API endpoints. Designed to work seamlessly with the AuthService implementation.
 * 
 * Key Features:
 * - JWT token extraction from Authorization header (Bearer scheme)
 * - Session validation with database lookup for active sessions
 * - Type-safe user context attachment to requests
 * - Comprehensive error handling with standardized responses
 * - Security logging and monitoring
 * - Support for token invalidation and session management
 * 
 * @module backend/middleware/jwtAuthMiddleware
 * @requires ../services/user_auth/IAuthService
 * @requires ../utils/errors
 * @author Voice Chat Assistant Team
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from 'express';
import { GMIErrorCode } from '../utils/errors';

/**
 * Interface for the authenticated user token payload.
 * This matches the AuthTokenPayload from IAuthService.
 */
export interface AuthTokenPayload {
  /** Unique user identifier */
  userId: string;
  /** User's username */
  username: string;
  /** Session ID for this authentication token */
  sessionId: string;
  /** Token issued at timestamp (optional) */
  iat?: number;
  /** Token expiration timestamp (optional) */
  exp?: number;
  /** JWT ID for token tracking (optional) */
  jti?: string;
}

/**
 * Interface for the AuthService dependency.
 * Defines the minimum required methods for token validation.
 */
export interface IAuthService {
  /**
   * Validates a JWT token and returns the payload if valid.
   * @param token - JWT token to validate
   * @returns Promise resolving to token payload or null if invalid
   */
  validateToken(token: string): Promise<AuthTokenPayload | null>;
}

/**
 * Extended Express Request interface that includes authenticated user information.
 * This interface is used throughout protected routes to access user context.
 * 
 * @interface AuthenticatedRequest
 * @extends Request
 */
export interface AuthenticatedRequest extends Request {
  /** Authenticated user information from validated JWT token */
  user?: AuthTokenPayload;
}

/**
 * Standard error response structure for authentication failures.
 * Provides consistent error format across all authentication endpoints.
 * 
 * @interface AuthErrorResponse
 */
interface AuthErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

/**
 * Creates a JWT authentication middleware function.
 * This factory pattern allows for dependency injection of the AuthService
 * and provides a clean, reusable authentication solution.
 * 
 * @function createJwtAuthMiddleware
 * @param {IAuthService} authService - Authentication service instance for token validation
 * @returns {Function} Express middleware function for JWT authentication
 * @throws {Error} If authService is not provided
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const requireAuth = createJwtAuthMiddleware(authService);
 * router.get('/protected', requireAuth, handler);
 * 
 * // In route handler
 * async function handler(req: AuthenticatedRequest, res: Response) {
 *   console.log(`Authenticated user: ${req.user?.username}`);
 *   res.json({ message: `Hello, ${req.user?.username}!` });
 * }
 * ```
 */
export function createJwtAuthMiddleware(authService: IAuthService) {
  // Validate required dependency
  if (!authService) {
    throw new Error('AuthService instance is required for JWT authentication middleware');
  }

  if (typeof authService.validateToken !== 'function') {
    throw new Error('AuthService must implement validateToken method');
  }

  /**
   * Express middleware function that handles JWT authentication.
   * Extracts JWT from Authorization header, validates it using AuthService,
   * and populates req.user with authenticated user information.
   * 
   * @param {AuthenticatedRequest} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   * @returns {Promise<void>}
   */
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract token from Authorization header
      const token = extractTokenFromRequest(req);

      if (!token) {
        const errorResponse: AuthErrorResponse = {
          error: {
            code: GMIErrorCode.AUTHENTICATION_TOKEN_MISSING,
            message: 'Authentication required. Please provide a valid Bearer token in the Authorization header.',
            details: {
              expectedFormat: 'Authorization: Bearer <your-jwt-token>',
              route: req.originalUrl,
              method: req.method,
            },
            timestamp: new Date().toISOString(),
          },
        };

        logAuthenticationAttempt(req, false, 'No token provided');
        return res.status(401).json(errorResponse);
      }

      // Validate token using AuthService
      const userPayload = await authService.validateToken(token);

      if (!userPayload) {
        const errorResponse: AuthErrorResponse = {
          error: {
            code: GMIErrorCode.AUTHENTICATION_TOKEN_INVALID,
            message: 'Authentication failed. The provided token is invalid, expired, or the associated session is no longer active.',
            details: {
              tokenPreview: maskToken(token),
              route: req.originalUrl,
              method: req.method,
            },
            timestamp: new Date().toISOString(),
          },
        };

        logAuthenticationAttempt(req, false, 'Token validation failed', token);
        return res.status(403).json(errorResponse);
      }

      // Successfully authenticated - attach user to request
      req.user = userPayload;

      logAuthenticationAttempt(req, true, 'Authentication successful', token, userPayload.userId);

      // Continue to next middleware
      next();

    } catch (error: any) {
      console.error('[JWTAuthMiddleware] Unexpected error during authentication:', {
        error: error.message,
        stack: error.stack,
        route: req.originalUrl,
        method: req.method,
        userAgent: req.headers['user-agent'],
        ip: getClientIpAddress(req),
        timestamp: new Date().toISOString(),
      });

      const errorResponse: AuthErrorResponse = {
        error: {
          code: GMIErrorCode.INTERNAL_SERVER_ERROR,
          message: 'Internal server error occurred during authentication. Please try again.',
          details: process.env.NODE_ENV !== 'production' ? {
            originalError: error.message,
            route: req.originalUrl,
          } : undefined,
          timestamp: new Date().toISOString(),
        },
      };

      res.status(500).json(errorResponse);
    }
  };
}

/**
 * Extracts JWT token from the Authorization header.
 * Supports the standard Bearer token format: "Authorization: Bearer <token>"
 * 
 * @function extractTokenFromRequest
 * @param {Request} req - Express request object
 * @returns {string | null} Extracted JWT token or null if not found
 * @private
 */
function extractTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  // Check for Bearer token format
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  // Extract token (everything after "Bearer ")
  const token = authHeader.substring(7).trim();

  if (!token || token.length === 0) {
    return null;
  }

  return token;
}

/**
 * Masks a JWT token for safe logging.
 * Shows only the first and last few characters to help with debugging
 * while protecting the sensitive token data.
 * 
 * @function maskToken
 * @param {string} token - JWT token to mask
 * @returns {string} Masked token string
 * @private
 */
function maskToken(token: string): string {
  if (!token || token.length < 20) {
    return '••••••••••••••••';
  }

  const start = token.substring(0, 8);
  const end = token.substring(token.length - 8);
  const middle = '•'.repeat(Math.min(16, token.length - 16));

  return `${start}${middle}${end}`;
}

/**
 * Gets the client IP address from the request.
 * Handles various proxy configurations and forwarded headers.
 * 
 * @function getClientIpAddress
 * @param {Request} req - Express request object
 * @returns {string} Client IP address
 * @private
 */
function getClientIpAddress(req: Request): string {
  // Check various headers that might contain the real IP
  const forwardedFor = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const clientIp = req.headers['x-client-ip'];

  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    return ips.split(',')[0].trim();
  }

  if (realIp && typeof realIp === 'string') {
    return realIp;
  }

  if (clientIp && typeof clientIp === 'string') {
    return clientIp;
  }

  // Fallback to connection remote address
  return req.ip || req.connection.remoteAddress || 'unknown';
}

/**
 * Logs authentication attempts for security monitoring and debugging.
 * Records both successful and failed authentication attempts with relevant context.
 * 
 * @function logAuthenticationAttempt
 * @param {Request} req - Express request object
 * @param {boolean} success - Whether authentication was successful
 * @param {string} reason - Reason for success/failure
 * @param {string} [token] - JWT token (will be masked in logs)
 * @param {string} [userId] - User ID if authentication was successful
 * @private
 */
function logAuthenticationAttempt(
  req: Request, 
  success: boolean, 
  reason: string, 
  token?: string, 
  userId?: string
): void {
  const logData = {
    success,
    reason,
    route: req.originalUrl,
    method: req.method,
    userAgent: req.headers['user-agent'],
    ip: getClientIpAddress(req),
    tokenPreview: token ? maskToken(token) : undefined,
    userId: success ? userId : undefined,
    timestamp: new Date().toISOString(),
  };

  if (success) {
    console.log('[JWTAuthMiddleware] Authentication successful:', logData);
  } else {
    console.warn('[JWTAuthMiddleware] Authentication failed:', logData);
  }
}

/**
 * Type guard to check if a request has been authenticated.
 * Useful for TypeScript type narrowing in route handlers.
 * 
 * @function isAuthenticatedRequest
 * @param {Request} req - Express request object
 * @returns {req is AuthenticatedRequest} Type predicate
 * 
 * @example
 * ```typescript
 * function handler(req: Request, res: Response) {
 *   if (isAuthenticatedRequest(req)) {
 *     // TypeScript now knows req.user is available
 *     console.log(`User ID: ${req.user.userId}`);
 *   }
 * }
 * ```
 */
export function isAuthenticatedRequest(req: Request): req is AuthenticatedRequest {
  return !!(req as AuthenticatedRequest).user;
}

/**
 * Middleware for optional authentication.
 * If a valid token is provided, the user context is added to the request.
 * If no token or an invalid token is provided, the request continues without user context.
 * 
 * @function createOptionalAuthMiddleware
 * @param {IAuthService} authService - Authentication service instance
 * @returns {Function} Express middleware function
 * 
 * @example
 * ```typescript
 * const optionalAuth = createOptionalAuthMiddleware(authService);
 * router.get('/public-or-private', optionalAuth, handler);
 * 
 * function handler(req: Request, res: Response) {
 *   if (isAuthenticatedRequest(req)) {
 *     res.json({ message: `Hello, ${req.user.username}!` });
 *   } else {
 *     res.json({ message: 'Hello, anonymous user!' });
 *   }
 * }
 * ```
 */
export function createOptionalAuthMiddleware(authService: IAuthService) {
  if (!authService) {
    throw new Error('AuthService instance is required for optional authentication middleware');
  }

  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract token from request
      const token = extractTokenFromRequest(req);

      if (!token) {
        // No token provided - continue without authentication
        return next();
      }

      // Validate token using AuthService
      const userPayload = await authService.validateToken(token);

      if (userPayload) {
        // Token is valid - attach user to request
        req.user = userPayload;
        logAuthenticationAttempt(req, true, 'Optional authentication successful', token, userPayload.userId);
      } else {
        // Token is invalid - continue without authentication (don't throw error)
        logAuthenticationAttempt(req, false, 'Optional authentication failed - invalid token', token);
      }

      next();

    } catch (error: any) {
      console.error('[JWTAuthMiddleware] Error in optional authentication:', {
        error: error.message,
        route: req.originalUrl,
        method: req.method,
      });

      // For optional auth, continue even if there's an error
      next();
    }
  };
}

/**
 * Higher-order function that creates role-based authorization middleware.
 * Should be used after authentication middleware to check user permissions.
 * 
 * @function requireRole
 * @param {string[]} allowedRoles - Array of subscription tier names that are allowed
 * @returns {Function} Express middleware function for role authorization
 * 
 * @example
 * ```typescript
 * router.delete('/admin-only', 
 *   createJwtAuthMiddleware(authService), 
 *   requireRole(['Pro', 'Enterprise']), 
 *   handler
 * );
 * ```
 */
export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthenticatedRequest(req)) {
      const errorResponse: AuthErrorResponse = {
        error: {
          code: GMIErrorCode.AUTHENTICATION_REQUIRED,
          message: 'Authentication required for role-based access control.',
          details: { requiredRoles: allowedRoles },
          timestamp: new Date().toISOString(),
        },
      };
      return res.status(401).json(errorResponse);
    }

    // For now, we'll use a simple role check
    // In a more complex system, you'd fetch user roles from the database
    const userRole = 'Free'; // This would come from user's subscription tier
    
    if (!allowedRoles.includes(userRole)) {
      const errorResponse: AuthErrorResponse = {
        error: {
          code: GMIErrorCode.AUTHORIZATION_INSUFFICIENT_PERMISSIONS,
          message: 'Insufficient permissions to access this resource.',
          details: { 
            userRole,
            requiredRoles: allowedRoles,
            userId: req.user.userId,
          },
          timestamp: new Date().toISOString(),
        },
      };
      return res.status(403).json(errorResponse);
    }

    next();
  };
}

/**
 * Default export provides the main authentication middleware factory.
 * This is the primary function that should be used in most cases.
 */
export default createJwtAuthMiddleware;