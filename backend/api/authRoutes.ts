// File: backend/api/authRoutes.ts
/**
 * @fileoverview Comprehensive authentication routes implementation for the Voice Chat Assistant.
 * This module provides a complete suite of authentication endpoints including user registration,
 * login, OAuth flows, password management, profile management, and API key management.
 * All routes are designed with enterprise-grade security, validation, and error handling.
 *
 * Key Features:
 * - JWT-based authentication with configurable expiration
 * - Rate limiting for security-sensitive operations
 * - Comprehensive input validation using express-validator
 * - OAuth 2.0 integration (Google, GitHub)
 * - Secure password reset flow with time-limited tokens
 * - Email verification system
 * - User API key management with encryption
 * - Subscription tier integration
 * - Comprehensive error handling and logging
 *
 * @module backend/api/authRoutes
 * @requires express
 * @requires express-validator
 * @requires express-rate-limit
 * @requires ../services/user_auth/IAuthService
 * @requires ../services/user_auth/ISubscriptionService
 * @requires ../middleware/jwtAuthMiddleware
 * @requires ../utils/errors
 * @author Voice Chat Assistant Team
 * @version 1.0.0
 */

import { Router, Request, Response, NextFunction } from 'express';
import { body, query, param, validationResult, ValidationError } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { IAuthService } from '../services/user_auth/IAuthService';
import { ISubscriptionService } from '../services/user_auth/ISubscriptionService';
import { AuthenticatedRequest, createJwtAuthMiddleware } from '../middleware/jwtAuthMiddleware';
import { GMIError, GMIErrorCode, createGMIErrorFromError } from '../utils/errors';

/**
 * Interface representing the structure of validation error details.
 * Used to standardize validation error responses across all endpoints.
 *
 * @interface ValidationErrorDetails
 */
interface ValidationErrorDetails {
  [field: string]: string;
}

/**
 * Interface for standardized API error responses.
 * Ensures consistent error structure across all authentication endpoints.
 *
 * @interface ApiErrorResponse
 */
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ValidationErrorDetails | Record<string, any>;
    timestamp: string;
  };
}

/**
 * Interface for successful authentication responses.
 * Standardizes the structure of successful auth operations.
 *
 * @interface AuthSuccessResponse
 * @template T - The type of additional data included in the response
 */
interface AuthSuccessResponse<T = any> {
  success: boolean;
  message: string;
  user?: any;
  token?: string;
  tokenExpiresAt?: string;
  subscription?: any;
  data?: T;
}

/**
 * Validation middleware that processes express-validator results and returns
 * standardized error responses for invalid input data.
 *
 * @function handleValidationErrors
 * @param {Request} req - Express request object containing validation results
 * @param {Response} res - Express response object for sending error responses
 * @param {NextFunction} next - Express next function to continue middleware chain
 * @returns {void | Response} Either continues to next middleware or returns error response
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void | Response => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors: ValidationErrorDetails = errors.array().reduce(
      (acc: ValidationErrorDetails, error: ValidationError) => {
        const field = 'path' in error ? error.path : 'unknown';
        acc[field] = error.msg;
        return acc;
      },
      {}
    );

    const errorResponse: ApiErrorResponse = {
      error: {
        code: GMIErrorCode.VALIDATION_ERROR,
        message: 'Input validation failed. Please check your data and try again.',
        details: validationErrors,
        timestamp: new Date().toISOString(),
      },
    };

    return res.status(400).json(errorResponse);
  }
  next();
};

/**
 * Comprehensive rate limiting configurations for different types of authentication operations.
 * These limits are designed to prevent abuse while allowing legitimate usage patterns.
 *
 * @namespace authRateLimits
 */
const authRateLimits = {
  /**
   * Strict rate limiting for high-security operations like login, registration, and password reset.
   * Applied to prevent brute force attacks and account enumeration.
   */
  strict: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes sliding window
    max: 5, // Maximum 5 attempts per window per IP
    message: {
      error: {
        code: GMIErrorCode.RATE_LIMIT_EXCEEDED,
        message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
        details: { retryAfter: '15 minutes' },
        timestamp: new Date().toISOString(),
      },
    },
    standardHeaders: true, // Include standard rate limit headers
    legacyHeaders: false, // Disable legacy X-RateLimit headers
    skipSuccessfulRequests: false, // Count both successful and failed requests
    skipFailedRequests: false,
  }),

  /**
   * Moderate rate limiting for general authentication endpoints like profile updates.
   * Allows more frequent legitimate operations while still preventing abuse.
   */
  moderate: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes sliding window
    max: 20, // Maximum 20 requests per window per IP
    message: {
      error: {
        code: GMIErrorCode.RATE_LIMIT_EXCEEDED,
        message: 'Too many requests. Please slow down and try again later.',
        details: { retryAfter: '15 minutes' },
        timestamp: new Date().toISOString(),
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),

  /**
   * Lenient rate limiting for read-only operations and general API access.
   * Designed to prevent excessive API usage without hindering normal operation.
   */
  lenient: rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes sliding window
    max: 100, // Maximum 100 requests per window per IP
    message: {
      error: {
        code: GMIErrorCode.RATE_LIMIT_EXCEEDED,
        message: 'Too many requests. Please wait a few minutes before trying again.',
        details: { retryAfter: '5 minutes' },
        timestamp: new Date().toISOString(),
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),
};

/**
 * Comprehensive validation rules for user registration.
 * Ensures data integrity, security, and consistent user experience.
 *
 * @constant {ValidationChain[]} registerValidation
 */
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters long')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Username can only contain letters, numbers, dots, hyphens, and underscores')
    .custom(async (value) => {
      if (value.toLowerCase().includes('admin') || value.toLowerCase().includes('system')) {
        throw new Error('Username cannot contain reserved words');
      }
      return true;
    }),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
    })
    .isLength({ max: 254 })
    .withMessage('Email address is too long'),

  body('passwordPlainText')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.passwordPlainText) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),

  body('acceptTerms')
    .isBoolean()
    .withMessage('Terms acceptance must be a boolean value')
    .custom((value) => {
      if (!value) {
        throw new Error('You must accept the terms of service to register');
      }
      return true;
    }),
];

/**
 * Validation rules for user login operations.
 * Balances security with user experience for authentication flow.
 *
 * @constant {ValidationChain[]} loginValidation
 */
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('passwordPlainText')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1, max: 128 }) // Min 1 to allow any non-empty password for validation, actual strength checked by service/db
    .withMessage('Password length is invalid'),

  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('Remember me must be a boolean value'),
];

/**
 * Validation rules for password change operations.
 * Ensures secure password updates with proper verification.
 *
 * @constant {ValidationChain[]} passwordChangeValidation
 */
const passwordChangeValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .isLength({ min: 1, max: 128 })
    .withMessage('Current password length is invalid'),

  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    }),

  body('confirmNewPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New password confirmation does not match new password');
      }
      return true;
    }),
];

/**
 * Validation rules for API key management operations.
 * Ensures proper handling of sensitive API credentials.
 *
 * @constant {ValidationChain[]} apiKeyValidation
 */
const apiKeyValidation = [
  body('providerId')
    .trim()
    .notEmpty()
    .withMessage('Provider ID is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Provider ID must be between 1 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Provider ID can only contain letters, numbers, underscores, and hyphens'),

  body('apiKey')
    .trim()
    .notEmpty()
    .withMessage('API key is required')
    .isLength({ min: 10, max: 500 }) // Adjusted max length for potentially long API keys
    .withMessage('API key length is invalid'),

  body('keyName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Key name cannot exceed 100 characters')
    .matches(/^[a-zA-Z0-9\s._-]*$/) // Allow spaces, dots, underscores, hyphens in key name
    .withMessage('Key name contains invalid characters'),
];

/**
 * Creates and configures the complete authentication router with all endpoints.
 * This function serves as the main factory for the authentication system,
 * integrating all services and middleware into a cohesive API.
 *
 * @function createAuthRoutes
 * @param {IAuthService} authService - Initialized authentication service instance
 * @param {ISubscriptionService} subscriptionService - Initialized subscription management service
 * @returns {Router} Fully configured Express router with all authentication endpoints
 * @throws {Error} If required services are not provided or are invalid
 *
 * @example
 * ```typescript
 * const authRouter = createAuthRoutes(authService, subscriptionService);
 * app.use('/api/v1/auth', authRouter);
 * ```
 */
export function createAuthRoutes(
  authService: IAuthService,
  subscriptionService: ISubscriptionService
): Router {
  // Validate required dependencies
  if (!authService) {
    throw new Error('AuthService instance is required to create authentication routes');
  }
  if (!subscriptionService) {
    throw new Error('SubscriptionService instance is required to create authentication routes');
  }

  const router = Router();
  const requireAuth = createJwtAuthMiddleware(authService);

  // =============================================================================
  // PUBLIC AUTHENTICATION ENDPOINTS
  // These endpoints do not require authentication and are available to all users
  // =============================================================================

  /**
   * @route POST /api/v1/auth/register
   * @description Register a new user account with comprehensive validation and security checks.
   * Creates a new user, sends verification email, and returns authentication token.
   * @access Public
   * @rateLimit Strict (5 requests per 15 minutes)
   * @validation Full registration validation with password strength and email format checks
   */
  router.post('/register',
    authRateLimits.strict,
    registerValidation,
    handleValidationErrors,
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { username, email, passwordPlainText, acceptTerms } = req.body;
        const clientInfo = {
          userAgent: req.headers['user-agent'] || 'Unknown',
          ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
          acceptLanguage: req.headers['accept-language'],
        };

        const registrationEnabled = process.env.REGISTRATION_ENABLED !== 'false';
        if (!registrationEnabled) {
          const errorResponse: ApiErrorResponse = {
            error: {
              code: GMIErrorCode.FEATURE_DISABLED,
              message: 'New user registration is currently disabled. Please contact support for assistance.',
              details: { feature: 'registration', status: 'disabled' },
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(403).json(errorResponse);
        }

        console.log(`[AuthRoutes] Registration attempt for email: ${email}, username: ${username}`);

        const user = await authService.registerUser(username, email, passwordPlainText, {
          acceptedTerms: acceptTerms,
          clientInfo,
        });

        const subscription = await subscriptionService.getUserSubscription(user.id);
        console.log(`[AuthRoutes] User registered successfully: ${user.id} (${username})`);

        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'Registration successful! Please check your email to verify your account.',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
          },
          subscription: subscription ? {
            id: subscription.id,
            name: subscription.name,
            level: subscription.level,
            features: subscription.features,
          } : null,
        };
        return res.status(201).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Registration error:', error);
        if (error instanceof GMIError) {
          const statusCode =
            error.code === GMIErrorCode.REGISTRATION_EMAIL_EXISTS ||
            error.code === GMIErrorCode.REGISTRATION_USERNAME_EXISTS ? 409 : 400;
          const errorResponse: ApiErrorResponse = {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(statusCode).json(errorResponse);
        }
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Registration failed due to an internal error. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  /**
   * @route POST /api/v1/auth/login
   * @description Authenticate user with email and password, returning JWT token and user information.
   * Supports "remember me" functionality for extended session duration.
   * @access Public
   * @rateLimit Strict (5 requests per 15 minutes)
   * @validation Email format and password presence validation
   */
  router.post('/login',
    authRateLimits.strict,
    loginValidation,
    handleValidationErrors,
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { email, passwordPlainText, rememberMe = false } = req.body;
        const clientInfo = {
          userAgent: req.headers['user-agent'] || 'Unknown',
          ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
          acceptLanguage: req.headers['accept-language'],
        };

        console.log(`[AuthRoutes] Login attempt for email: ${email}`);

        const authResult = await authService.loginUser(
          email,
          passwordPlainText,
          clientInfo.userAgent,
          clientInfo.ipAddress,
          { rememberMe }
        );

        const subscription = await subscriptionService.getUserSubscription(authResult.user.id);
        console.log(`[AuthRoutes] User logged in successfully: ${authResult.user.id} (${authResult.user.username})`);

        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'Login successful',
          user: {
            id: authResult.user.id,
            username: authResult.user.username,
            email: authResult.user.email,
            emailVerified: authResult.user.emailVerified,
            subscriptionTierId: authResult.user.subscriptionTierId,
          },
          token: authResult.token,
          tokenExpiresAt: authResult.tokenExpiresAt,
          subscription: subscription ? {
            id: subscription.id,
            name: subscription.name,
            level: subscription.level,
            features: subscription.features,
            maxGmiInstances: subscription.maxGmiInstances,
            dailyCostLimitUsd: subscription.dailyCostLimitUsd,
            monthlyCostLimitUsd: subscription.monthlyCostLimitUsd,
          } : null,
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Login error:', error);
        if (error instanceof GMIError) {
          const statusCode = error.code === GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS ? 401 : 400;
          const errorResponse: ApiErrorResponse = {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(statusCode).json(errorResponse);
        }
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Login failed due to an internal error. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  /**
   * @route GET /api/v1/auth/google
   * @description Initiate Google OAuth 2.0 authentication flow.
   * Redirects user to Google's authentication server with appropriate scopes.
   * @access Public
   * @rateLimit Moderate (20 requests per 15 minutes)
   */
  router.get('/google',
    authRateLimits.moderate,
    async (req: Request, res: Response): Promise<Response | void> => {
      try {
        const state = req.query.state as string || undefined;
        const redirectUri = req.query.redirect_uri as string || undefined;
        console.log('[AuthRoutes] Initiating Google OAuth flow');
        const oauthResult = await authService.initiateGoogleOAuth(state, redirectUri);
        return res.redirect(oauthResult.redirectUrl);
      } catch (error: any) {
        console.error('[AuthRoutes] Google OAuth initiation error:', error);
        if (error instanceof GMIError) {
          const errorResponse: ApiErrorResponse = {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(400).json(errorResponse);
        }
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.OAUTH_AUTHENTICATION_FAILED,
            message: 'Failed to initiate Google OAuth. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  /**
   * @route GET /api/v1/auth/google/callback
   * @description Handle Google OAuth 2.0 callback and complete authentication.
   * Processes authorization code and creates or logs in user account.
   * @access Public
   * @rateLimit Moderate (20 requests per 15 minutes)
   * @validation Authorization code presence validation
   */
  router.get('/google/callback',
    authRateLimits.moderate,
    query('code').notEmpty().withMessage('Authorization code is required'),
    query('state').optional().isString(),
    handleValidationErrors,
    async (req: Request, res: Response): Promise<Response | void> => {
      try {
        const { code, state } = req.query;
        const clientInfo = {
          userAgent: req.headers['user-agent'] || 'Unknown',
          ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
        };
        console.log('[AuthRoutes] Processing Google OAuth callback');
        const authResult = await authService.handleGoogleOAuthCallback(
          code as string,
          clientInfo.userAgent,
          clientInfo.ipAddress,
          state as string
        );
        const subscription = await subscriptionService.getUserSubscription(authResult.user.id);
        console.log(`[AuthRoutes] Google OAuth successful for user: ${authResult.user.id}`);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const redirectUrl = `${frontendUrl}/auth/callback?token=${authResult.token}&success=true`;
        return res.redirect(redirectUrl);
      } catch (error: any) {
        console.error('[AuthRoutes] Google OAuth callback error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const errorRedirectUrl = `${frontendUrl}/auth/callback?error=oauth_failed`;
        return res.redirect(errorRedirectUrl);
      }
    }
  );

  /**
   * @route POST /api/v1/auth/forgot-password
   * @description Request password reset token via email.
   * Always returns success to prevent email enumeration attacks.
   * @access Public
   * @rateLimit Strict (5 requests per 15 minutes)
   * @validation Email format validation
   */
  router.post('/forgot-password',
    authRateLimits.strict,
    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email address is required')
      .normalizeEmail(),
    handleValidationErrors,
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { email } = req.body;
        const clientInfo = {
          userAgent: req.headers['user-agent'] || 'Unknown',
          ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
        };
        console.log(`[AuthRoutes] Password reset requested for email: ${email}`);
        await authService.requestPasswordReset(email, clientInfo);
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'If an account with that email address exists, a password reset link has been sent.',
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Password reset request error:', error);
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'If an account with that email address exists, a password reset link has been sent.',
        };
        return res.status(200).json(successResponse);
      }
    }
  );

  /**
   * @route POST /api/v1/auth/reset-password
   * @description Reset password using valid reset token.
   * Validates token and updates user password with new secure hash.
   * @access Public
   * @rateLimit Strict (5 requests per 15 minutes)
   * @validation Token presence and new password strength validation
   */
  router.post('/reset-password',
    authRateLimits.strict,
    [
      body('token')
        .trim()
        .notEmpty()
        .withMessage('Reset token is required')
        .isLength({ min: 32, max: 128 })
        .withMessage('Invalid reset token format'),
      body('newPassword')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
      body('confirmPassword')
        .custom((value, { req }) => {
          if (value !== req.body.newPassword) {
            throw new Error('Password confirmation does not match new password');
          }
          return true;
        }),
    ],
    handleValidationErrors,
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { token, newPassword } = req.body;
        const clientInfo = {
          userAgent: req.headers['user-agent'] || 'Unknown',
          ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
        };
        console.log('[AuthRoutes] Password reset attempt with token');
        await authService.resetPassword(token, newPassword, clientInfo);
        console.log('[AuthRoutes] Password reset successful');
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'Password has been reset successfully. You can now log in with your new password.',
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Password reset error:', error);
        if (error instanceof GMIError) {
          const statusCode =
            error.code === GMIErrorCode.PASSWORD_RESET_TOKEN_INVALID ||
            error.code === GMIErrorCode.PASSWORD_RESET_TOKEN_EXPIRED ? 400 : 500;
          const errorResponse: ApiErrorResponse = {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(statusCode).json(errorResponse);
        }
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Password reset failed due to an internal error. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  /**
   * @route GET /api/v1/auth/verify-email
   * @description Verify user email address using verification token.
   * Confirms email ownership and activates account features.
   * @access Public
   * @rateLimit Moderate (20 requests per 15 minutes)
   * @validation Verification token presence validation
   */
  router.get('/verify-email',
    authRateLimits.moderate,
    query('token')
      .trim()
      .notEmpty()
      .withMessage('Verification token is required')
      .isLength({ min: 32, max: 128 })
      .withMessage('Invalid verification token format'),
    handleValidationErrors,
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { token } = req.query;
        console.log('[AuthRoutes] Email verification attempt');
        const user = await authService.verifyEmail(token as string);
        console.log(`[AuthRoutes] Email verified successfully for user: ${user.id}`);
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'Email address verified successfully! Your account is now fully activated.',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            emailVerified: user.emailVerified,
          },
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Email verification error:', error);
        if (error instanceof GMIError) {
          const statusCode =
            error.code === GMIErrorCode.EMAIL_VERIFICATION_TOKEN_INVALID ||
            error.code === GMIErrorCode.EMAIL_VERIFICATION_TOKEN_EXPIRED ? 400 : 500;
          const errorResponse: ApiErrorResponse = {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(statusCode).json(errorResponse);
        }
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Email verification failed due to an internal error. Please try again later.', // Completed message
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  // =============================================================================
  // AUTHENTICATED USER ENDPOINTS
  // These endpoints require valid JWT authentication
  // =============================================================================

  /**
   * @route GET /api/v1/auth/me
   * @description Get current authenticated user's profile, subscription, and API keys.
   * Returns comprehensive user information for dashboard and profile management.
   * @access Private (Requires Authentication)
   * @rateLimit Lenient (100 requests per 5 minutes)
   */
  router.get('/me',
    requireAuth,
    authRateLimits.lenient,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        console.log(`[AuthRoutes] Profile request for user: ${userId}`);

        const [user, subscription, apiKeys] = await Promise.all([
          authService.getPublicUserById(userId),
          subscriptionService.getUserSubscription(userId),
          authService.getUserApiKeys(userId),
        ]);

        if (!user) {
          const errorResponse: ApiErrorResponse = {
            error: {
              code: GMIErrorCode.USER_NOT_FOUND,
              message: 'User profile not found. Please log in again.',
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(404).json(errorResponse);
        }

        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'Profile retrieved successfully',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            emailVerified: user.emailVerified,
            subscriptionTierId: user.subscriptionTierId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          subscription: subscription ? {
            id: subscription.id,
            name: subscription.name,
            description: subscription.description,
            level: subscription.level,
            features: subscription.features,
            maxGmiInstances: subscription.maxGmiInstances,
            maxApiKeys: subscription.maxApiKeys,
            maxConversationHistoryTurns: subscription.maxConversationHistoryTurns,
            dailyCostLimitUsd: subscription.dailyCostLimitUsd,
            monthlyCostLimitUsd: subscription.monthlyCostLimitUsd,
            priceMonthlyUsd: subscription.priceMonthlyUsd,
            priceYearlyUsd: subscription.priceYearlyUsd,
          } : null,
          data: {
            apiKeys: apiKeys.map(key => ({
              id: key.id,
              providerId: key.providerId,
              keyName: key.keyName,
              isActive: key.isActive,
              createdAt: key.createdAt,
              updatedAt: key.updatedAt,
            })),
            totalApiKeys: apiKeys.length,
          },
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Get profile error:', error);
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Failed to retrieve user profile. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  /**
   * @route PUT /api/v1/auth/me
   * @description Update authenticated user's profile information.
   * Allows updating username, email, and other profile fields with validation.
   * @access Private (Requires Authentication)
   * @rateLimit Moderate (20 requests per 15 minutes)
   * @validation Optional username and email validation
   */
  router.put('/me',
    requireAuth,
    authRateLimits.moderate,
    [
      body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_.-]+$/)
        .withMessage('Username can only contain letters, numbers, dots, hyphens, and underscores'),
      body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
      body('displayName')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Display name cannot exceed 100 characters'),
      body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters'),
    ],
    handleValidationErrors,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const updateData = req.body;
        const clientInfo = {
          userAgent: req.headers['user-agent'] || 'Unknown',
          ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
        };
        console.log(`[AuthRoutes] Profile update request for user: ${userId}`);
        const { password, passwordPlainText, id, createdAt, updatedAt, ...safeUpdateData } = updateData;
        const updatedUser = await authService.updateUserProfile(userId, safeUpdateData, clientInfo);
        console.log(`[AuthRoutes] Profile updated successfully for user: ${userId}`);
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'Profile updated successfully.',
          user: {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            emailVerified: updatedUser.emailVerified,
            displayName: updatedUser.displayName,
            bio: updatedUser.bio,
            updatedAt: updatedUser.updatedAt,
          },
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Profile update error:', error);
        if (error instanceof GMIError) {
          const statusCode = error.code.includes('EXISTS') ? 409 : 400;
          const errorResponse: ApiErrorResponse = {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(statusCode).json(errorResponse);
        }
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Failed to update profile. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  /**
   * @route POST /api/v1/auth/change-password
   * @description Change authenticated user's password with current password verification.
   * Requires current password for security and validates new password strength.
   * @access Private (Requires Authentication)
   * @rateLimit Strict (5 requests per 15 minutes)
   * @validation Current password verification and new password strength validation
   */
  router.post('/change-password',
    requireAuth,
    authRateLimits.strict,
    passwordChangeValidation,
    handleValidationErrors,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const { currentPassword, newPassword } = req.body;
        const clientInfo = {
          userAgent: req.headers['user-agent'] || 'Unknown',
          ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
        };
        console.log(`[AuthRoutes] Password change request for user: ${userId}`);
        await authService.changePassword(userId, currentPassword, newPassword, clientInfo);
        console.log(`[AuthRoutes] Password changed successfully for user: ${userId}`);
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'Password changed successfully. Please log in again with your new password.',
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Password change error:', error);
        if (error instanceof GMIError) {
          const statusCode = error.code === GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS ? 400 : 500;
          const errorResponse: ApiErrorResponse = {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(statusCode).json(errorResponse);
        }
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Failed to change password. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  /**
   * @route POST /api/v1/auth/logout
   * @description Logout current authenticated session and invalidate token.
   * Cleans up server-side session data and blacklists the current token.
   * @access Private (Requires Authentication)
   * @rateLimit Lenient (100 requests per 5 minutes)
   */
  router.post('/logout',
    requireAuth,
    authRateLimits.lenient,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const token = req.headers.authorization?.split(' ')[1];
        console.log(`[AuthRoutes] Logout request for user: ${userId}`);
        if (token) {
          await authService.logoutUser(token);
          console.log(`[AuthRoutes] User logged out successfully: ${userId}`);
        }
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'Logged out successfully.',
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Logout error:', error);
        const successResponse: AuthSuccessResponse = { // Still return success for UX
          success: true,
          message: 'Logged out successfully.',
        };
        return res.status(200).json(successResponse);
      }
    }
  );

  // =============================================================================
  // API KEY MANAGEMENT ENDPOINTS
  // These endpoints manage user's API keys for external services
  // =============================================================================

  /**
   * @route GET /api/v1/auth/api-keys
   * @description Get all API keys for the authenticated user.
   * Returns list of user's API keys without exposing the actual key values.
   * @access Private (Requires Authentication)
   * @rateLimit Lenient (100 requests per 5 minutes)
   */
  router.get('/api-keys',
    requireAuth,
    authRateLimits.lenient,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        console.log(`[AuthRoutes] API keys request for user: ${userId}`);
        const apiKeys = await authService.getUserApiKeys(userId);
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'API keys retrieved successfully',
          data: {
            apiKeys: apiKeys.map(key => ({
              id: key.id,
              providerId: key.providerId,
              keyName: key.keyName || `${key.providerId} Key`,
              isActive: key.isActive,
              createdAt: key.createdAt,
              updatedAt: key.updatedAt,
            })),
            totalKeys: apiKeys.length,
          },
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Get API keys error:', error);
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Failed to retrieve API keys. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  /**
   * @route POST /api/v1/auth/api-keys
   * @description Add or update an API key for external service integration.
   * Encrypts and securely stores the API key for the user's account.
   * @access Private (Requires Authentication)
   * @rateLimit Moderate (20 requests per 15 minutes)
   * @validation Provider ID, API key, and optional key name validation
   */
  router.post('/api-keys',
    requireAuth,
    authRateLimits.moderate,
    apiKeyValidation,
    handleValidationErrors,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const { providerId, apiKey, keyName } = req.body;
        console.log(`[AuthRoutes] API key creation request for user: ${userId}, provider: ${providerId}`);

        const subscription = await subscriptionService.getUserSubscription(userId);
        if (subscription) {
          const currentApiKeys = await authService.getUserApiKeys(userId);
          if (currentApiKeys.length >= subscription.maxApiKeys) {
            const errorResponse: ApiErrorResponse = {
              error: {
                code: GMIErrorCode.SUBSCRIPTION_LIMIT_EXCEEDED,
                message: `API key limit exceeded. Your ${subscription.name} plan allows up to ${subscription.maxApiKeys} API keys.`,
                details: {
                  currentCount: currentApiKeys.length,
                  maxAllowed: subscription.maxApiKeys,
                  subscriptionTier: subscription.name,
                },
                timestamp: new Date().toISOString(),
              },
            };
            return res.status(403).json(errorResponse);
          }
        }

        const savedKey = await authService.saveUserApiKey(userId, providerId, apiKey, keyName);
        console.log(`[AuthRoutes] API key saved successfully for user: ${userId}, provider: ${providerId}`);
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: `API key for ${providerId} saved successfully.`,
          data: {
            apiKey: {
              id: savedKey.id,
              providerId: savedKey.providerId,
              keyName: savedKey.keyName || `${savedKey.providerId} Key`,
              isActive: savedKey.isActive,
              createdAt: savedKey.createdAt,
            },
          },
        };
        return res.status(201).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Save API key error:', error);
        if (error instanceof GMIError) {
          const statusCode = error.code === GMIErrorCode.API_KEY_DUPLICATE ? 409 : 400;
          const errorResponse: ApiErrorResponse = {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(statusCode).json(errorResponse);
        }
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Failed to save API key. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  /**
   * @route PUT /api/v1/auth/api-keys/:keyId
   * @description Update an existing API key's metadata (name, active status).
   * Allows users to manage their API key configurations without exposing key values.
   * @access Private (Requires Authentication)
   * @rateLimit Moderate (20 requests per 15 minutes)
   * @validation Key ID parameter and optional update fields validation
   */
  router.put('/api-keys/:keyId',
    requireAuth,
    authRateLimits.moderate,
    [
      param('keyId')
        .trim()
        .notEmpty()
        .withMessage('API key ID is required')
        .isUUID()
        .withMessage('Invalid API key ID format'),
      body('keyName')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Key name cannot exceed 100 characters'),
      body('isActive')
        .optional()
        .isBoolean()
        .withMessage('Active status must be a boolean value'),
    ],
    handleValidationErrors,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const { keyId } = req.params;
        const updateData = req.body;
        console.log(`[AuthRoutes] API key update request for user: ${userId}, key: ${keyId}`);
        const updatedKey = await authService.updateUserApiKey(userId, keyId, updateData);
        console.log(`[AuthRoutes] API key updated successfully for user: ${userId}, key: ${keyId}`);
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'API key updated successfully.',
          data: {
            apiKey: {
              id: updatedKey.id,
              providerId: updatedKey.providerId,
              keyName: updatedKey.keyName,
              isActive: updatedKey.isActive,
              updatedAt: updatedKey.updatedAt,
            },
          },
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Update API key error:', error);
        if (error instanceof GMIError) {
          const statusCode = error.code === GMIErrorCode.NOT_FOUND ? 404 : 400;
          const errorResponse: ApiErrorResponse = {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(statusCode).json(errorResponse);
        }
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Failed to update API key. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  /**
   * @route DELETE /api/v1/auth/api-keys/:keyId
   * @description Delete an API key from the user's account.
   * Permanently removes the API key and its encrypted data from the system.
   * @access Private (Requires Authentication)
   * @rateLimit Moderate (20 requests per 15 minutes)
   * @validation Key ID parameter validation
   */
  router.delete('/api-keys/:keyId',
    requireAuth,
    authRateLimits.moderate,
    param('keyId')
      .trim()
      .notEmpty()
      .withMessage('API key ID is required')
      .isUUID()
      .withMessage('Invalid API key ID format'),
    handleValidationErrors,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const { keyId } = req.params;
        console.log(`[AuthRoutes] API key deletion request for user: ${userId}, key: ${keyId}`);
        await authService.deleteUserApiKey(userId, keyId);
        console.log(`[AuthRoutes] API key deleted successfully for user: ${userId}, key: ${keyId}`);
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'API key deleted successfully.',
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Delete API key error:', error);
        if (error instanceof GMIError) {
          const statusCode = error.code === GMIErrorCode.NOT_FOUND ? 404 : 400;
          const errorResponse: ApiErrorResponse = {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(statusCode).json(errorResponse);
        }
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Failed to delete API key. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  // =============================================================================
  // ACCOUNT MANAGEMENT ENDPOINTS
  // Additional endpoints for comprehensive account management
  // =============================================================================

  /**
   * @route POST /api/v1/auth/resend-verification
   * @description Resend email verification token for unverified accounts.
   * Allows users to request a new verification email if the original was lost or expired.
   * @access Private (Requires Authentication)
   * @rateLimit Strict (5 requests per 15 minutes)
   */
  router.post('/resend-verification',
    requireAuth,
    authRateLimits.strict,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        console.log(`[AuthRoutes] Resend verification request for user: ${userId}`);
        await authService.resendEmailVerification(userId);
        console.log(`[AuthRoutes] Verification email resent for user: ${userId}`);
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'Verification email has been resent. Please check your inbox.',
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Resend verification error:', error);
        if (error instanceof GMIError) {
          const errorResponse: ApiErrorResponse = {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(400).json(errorResponse); // Or appropriate status code based on error type
        }
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Failed to resend verification email. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  /**
   * @route GET /api/v1/auth/sessions
   * @description Get list of active sessions for the authenticated user.
   * Allows users to view and manage their active login sessions across devices.
   * @access Private (Requires Authentication)
   * @rateLimit Lenient (100 requests per 5 minutes)
   */
  router.get('/sessions',
    requireAuth,
    authRateLimits.lenient,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        console.log(`[AuthRoutes] Sessions request for user: ${userId}`);
        const sessions = await authService.getUserSessions(userId);
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'Active sessions retrieved successfully',
          data: {
            sessions: sessions.map(session => ({
              id: session.id,
              deviceInfo: session.deviceInfo,
              ipAddress: session.ipAddress,
              lastActiveAt: session.lastActiveAt,
              createdAt: session.createdAt,
              isCurrent: session.id === req.user!.sessionId,
            })),
            totalSessions: sessions.length,
          },
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Get sessions error:', error);
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Failed to retrieve sessions. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  /**
   * @route DELETE /api/v1/auth/sessions/:sessionId
   * @description Terminate a specific user session.
   * Allows users to log out from specific devices/sessions for security.
   * @access Private (Requires Authentication)
   * @rateLimit Moderate (20 requests per 15 minutes)
   * @validation Session ID parameter validation
   */
  router.delete('/sessions/:sessionId',
    requireAuth,
    authRateLimits.moderate,
    param('sessionId')
      .trim()
      .notEmpty()
      .withMessage('Session ID is required')
      .isUUID()
      .withMessage('Invalid session ID format'),
    handleValidationErrors,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const { sessionId } = req.params;
        console.log(`[AuthRoutes] Session termination request for user: ${userId}, session: ${sessionId}`);
        await authService.terminateUserSession(userId, sessionId);
        console.log(`[AuthRoutes] Session terminated successfully for user: ${userId}, session: ${sessionId}`);
        const successResponse: AuthSuccessResponse = {
          success: true,
          message: 'Session terminated successfully.',
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Terminate session error:', error);
        if (error instanceof GMIError) {
          const statusCode = error.code === GMIErrorCode.NOT_FOUND ? 404 : 400;
          const errorResponse: ApiErrorResponse = {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              timestamp: new Date().toISOString(),
            },
          };
          return res.status(statusCode).json(errorResponse);
        }
        const errorResponse: ApiErrorResponse = {
          error: {
            code: GMIErrorCode.INTERNAL_SERVER_ERROR,
            message: 'Failed to terminate session. Please try again later.',
            timestamp: new Date().toISOString(),
          },
        };
        return res.status(500).json(errorResponse);
      }
    }
  );

  return router;
}