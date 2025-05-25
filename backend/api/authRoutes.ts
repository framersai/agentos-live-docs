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
import { body, query, param, validationResult, ValidationError, Meta } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { IAuthService, UserApiKeyInfo } from '../services/user_auth/IAuthService'; // Assuming UserApiKeyInfo is exported
import { ISubscriptionService } from '../services/user_auth/SubscriptionService';
import { AuthenticatedRequest, createJwtAuthMiddleware } from '../middleware/jwtAuthMiddleware';
import { GMIError, GMIErrorCode, createGMIErrorFromError } from '../utils/errors';

// Define UserSessionInfo if not available from IAuthService
interface UserSessionInfo {
  id: string;
  deviceInfo?: string | null;
  ipAddress?: string | null;
  lastActiveAt: Date;
  createdAt: Date;
  isCurrent?: boolean;
}


/**
 * Interface representing the structure of validation error details.
 */
interface ValidationErrorDetails {
  [field: string]: string;
}

/**
 * Interface for standardized API error responses.
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
 * Validation middleware
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void | Response => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors: ValidationErrorDetails = errors.array().reduce(
      (acc: ValidationErrorDetails, error: ValidationError) => {
        const field = (error as any).path || (error as any).param || 'unknown_field';
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
 * Rate limiting configurations
 */
const authRateLimits = {
  strict: rateLimit({
    windowMs: 15 * 60 * 1000, max: 5,
    message: { error: { code: GMIErrorCode.RATE_LIMIT_EXCEEDED, message: 'Too many authentication attempts. Please wait 15 minutes before trying again.', details: { retryAfter: '15 minutes' }, timestamp: new Date().toISOString(), }},
    standardHeaders: true, legacyHeaders: false,
  }),
  moderate: rateLimit({
    windowMs: 15 * 60 * 1000, max: 20,
    message: { error: { code: GMIErrorCode.RATE_LIMIT_EXCEEDED, message: 'Too many requests. Please slow down and try again later.', details: { retryAfter: '15 minutes' }, timestamp: new Date().toISOString(), }},
    standardHeaders: true, legacyHeaders: false,
  }),
  lenient: rateLimit({
    windowMs: 5 * 60 * 1000, max: 100,
    message: { error: { code: GMIErrorCode.RATE_LIMIT_EXCEEDED, message: 'Too many requests. Please wait a few minutes before trying again.', details: { retryAfter: '5 minutes' }, timestamp: new Date().toISOString(), }},
    standardHeaders: true, legacyHeaders: false,
  }),
};

/**
 * Registration validation rules
 */
const registerValidation = [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters long')
    .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Username can only contain letters, numbers, dots, hyphens, and underscores')
    .custom(async (value: string) => { if (value.toLowerCase().includes('admin') || value.toLowerCase().includes('system')) throw new Error('Username cannot contain reserved words'); return true; }),
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail().isLength({ max: 254 }).withMessage('Email address is too long'),
  body('passwordPlainText').isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)'),
  body('confirmPassword').custom((value: string, { req }: Meta) => { if (value !== req.body.passwordPlainText) throw new Error('Password confirmation does not match password'); return true; }),
  body('acceptTerms').isBoolean().withMessage('Terms acceptance must be a boolean value')
    .custom((value: boolean) => { if (!value) throw new Error('You must accept the terms of service to register'); return true; }),
];

/**
 * Login validation rules
 */
const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('passwordPlainText').notEmpty().withMessage('Password is required').isLength({ min: 1, max: 128 }).withMessage('Password length is invalid'),
  body('rememberMe').optional().isBoolean().withMessage('Remember me must be a boolean value'),
];

/**
 * Password change validation rules
 */
const passwordChangeValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required').isLength({ min: 1, max: 128 }).withMessage('Current password length is invalid'),
  body('newPassword').isLength({ min: 8, max: 128 }).withMessage('New password must be between 8 and 128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
    .custom((value: string, { req }: Meta) => { if (value === req.body.currentPassword) throw new Error('New password must be different from current password'); return true; }),
  body('confirmNewPassword').custom((value: string, { req }: Meta) => { if (value !== req.body.newPassword) throw new Error('New password confirmation does not match new password'); return true; }),
];

/**
 * API key validation rules
 */
const apiKeyValidation = [
  body('providerId').trim().notEmpty().withMessage('Provider ID is required').isLength({ min: 1, max: 50 }).withMessage('Provider ID must be between 1 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Provider ID can only contain letters, numbers, underscores, and hyphens'),
  body('apiKey').trim().notEmpty().withMessage('API key is required').isLength({ min: 10, max: 500 }).withMessage('API key length is invalid'),
  body('keyName').optional().trim().isLength({ max: 100 }).withMessage('Key name cannot exceed 100 characters')
    .matches(/^[a-zA-Z0-9\s._-]*$/).withMessage('Key name contains invalid characters'),
];

export function createAuthRoutes(
  authService: IAuthService,
  subscriptionService: ISubscriptionService
): Router {
  if (!authService) throw new Error('AuthService instance is required');
  if (!subscriptionService) throw new Error('SubscriptionService instance is required');

  const router = Router();
  const requireAuth = createJwtAuthMiddleware(authService);

  // PUBLIC AUTHENTICATION ENDPOINTS
  router.post('/register',
    authRateLimits.strict, registerValidation, handleValidationErrors,
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { username, email, passwordPlainText } = req.body;
        const registrationEnabled = process.env.REGISTRATION_ENABLED !== 'false';
        if (!registrationEnabled) {
          // TODO: Add GMIErrorCode.FEATURE_DISABLED to errors.ts for better semantics. Using OPERATION_FAILED as placeholder.
          const gmiErr = new GMIError('New user registration is currently disabled.', GMIErrorCode.OPERATION_FAILED, { feature: 'registration', status: 'disabled' });
          const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
          return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
        }
        console.log(`[AuthRoutes] Registration attempt for email: ${email}, username: ${username}`);
        const user = await authService.registerUser(username, email, passwordPlainText);
        const subscription = await subscriptionService.getUserSubscriptionTier(user.id);
        console.log(`[AuthRoutes] User registered successfully: ${user.id} (${username})`);
        const successResponse: AuthSuccessResponse = {
          success: true, message: 'Registration successful! Please check your email to verify your account.',
          user: { id: user.id, username: user.username, email: user.email, emailVerified: user.emailVerified, createdAt: user.createdAt },
          subscription: subscription ? { id: subscription.id, name: subscription.name, level: subscription.level, features: subscription.features } : null,
        };
        return res.status(201).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Registration error:', error);
        if (error instanceof GMIError) {
          const apiErrorResponse: ApiErrorResponse = { error: { code: error.code, message: error.getUserFriendlyMessage(), details: error.details, timestamp: error.timestamp.toISOString() }};
          return res.status(error.getHttpStatusCode()).json(apiErrorResponse);
        }
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Registration failed due to an internal error.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  router.post('/login',
    authRateLimits.strict, loginValidation, handleValidationErrors,
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { email, passwordPlainText } = req.body;
        const clientInfo = { userAgent: req.headers['user-agent'] || 'Unknown', ipAddress: req.ip || req.connection.remoteAddress || 'Unknown' };
        console.log(`[AuthRoutes] Login attempt for email: ${email}`);
        const authResult = await authService.loginUser(email, passwordPlainText, clientInfo.userAgent, clientInfo.ipAddress);
        const subscription = await subscriptionService.getUserSubscriptionTier(authResult.user.id);
        console.log(`[AuthRoutes] User logged in successfully: ${authResult.user.id} (${authResult.user.username})`);
        const successResponse: AuthSuccessResponse = {
          success: true, message: 'Login successful', user: authResult.user, token: authResult.token, tokenExpiresAt: authResult.tokenExpiresAt.toISOString(),
          subscription: subscription ? { id: subscription.id, name: subscription.name, level: subscription.level } : null,
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Login error:', error);
        if (error instanceof GMIError) {
          const apiErrorResponse: ApiErrorResponse = { error: { code: error.code, message: error.getUserFriendlyMessage(), details: error.details, timestamp: error.timestamp.toISOString() }};
          return res.status(error.getHttpStatusCode()).json(apiErrorResponse);
        }
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Login failed due to an internal error.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  router.get('/google',
    authRateLimits.moderate,
    async (req: Request, res: Response): Promise<Response | void> => {
      try {
        console.log('[AuthRoutes] Initiating Google OAuth flow');
        const oauthResult = await authService.initiateGoogleOAuth();
        return res.redirect(oauthResult.redirectUrl);
      } catch (error: any) {
        console.error('[AuthRoutes] Google OAuth initiation error:', error);
        if (error instanceof GMIError) {
          const apiErrorResponse: ApiErrorResponse = { error: { code: error.code, message: error.getUserFriendlyMessage(), details: error.details, timestamp: error.timestamp.toISOString() }};
          return res.status(error.getHttpStatusCode()).json(apiErrorResponse);
        }
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.OAUTH_AUTHENTICATION_FAILED, undefined, 'Failed to initiate Google OAuth.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  router.get('/google/callback',
    authRateLimits.moderate, query('code').notEmpty().withMessage('Authorization code is required'), query('state').optional().isString(), handleValidationErrors,
    async (req: Request, res: Response): Promise<Response | void> => {
      try {
        const { code } = req.query;
        const clientInfo = { userAgent: req.headers['user-agent'] || 'Unknown', ipAddress: req.ip || req.connection.remoteAddress || 'Unknown' };
        console.log('[AuthRoutes] Processing Google OAuth callback');
        const authResult = await authService.handleGoogleOAuthCallback(code as string, clientInfo.userAgent, clientInfo.ipAddress);
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

  router.post('/forgot-password',
    authRateLimits.strict, body('email').trim().isEmail().withMessage('Valid email address is required').normalizeEmail(), handleValidationErrors,
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { email } = req.body;
        console.log(`[AuthRoutes] Password reset requested for email: ${email}`);
        await authService.requestPasswordReset(email);
        return res.status(200).json({ success: true, message: 'If an account with that email address exists, a password reset link has been sent.' });
      } catch (error: any) {
        console.error('[AuthRoutes] Password reset request error:', error);
        return res.status(200).json({ success: true, message: 'If an account with that email address exists, a password reset link has been sent.' });
      }
    }
  );

  router.post('/reset-password',
    authRateLimits.strict,
    [
      body('token').trim().notEmpty().withMessage('Reset token is required').isLength({ min: 32, max: 128 }).withMessage('Invalid reset token format'),
      body('newPassword').isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('Password must contain correct characters'),
      body('confirmPassword').custom((value: string, { req }: Meta) => { if (value !== req.body.newPassword) throw new Error('Password confirmation does not match'); return true; }),
    ],
    handleValidationErrors,
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { token, newPassword } = req.body;
        console.log('[AuthRoutes] Password reset attempt with token');
        await authService.resetPassword(token, newPassword);
        console.log('[AuthRoutes] Password reset successful');
        return res.status(200).json({ success: true, message: 'Password has been reset successfully.' });
      } catch (error: any) {
        console.error('[AuthRoutes] Password reset error:', error);
        if (error instanceof GMIError) {
          const apiErrorResponse: ApiErrorResponse = { error: { code: error.code, message: error.getUserFriendlyMessage(), details: error.details, timestamp: error.timestamp.toISOString() }};
          return res.status(error.getHttpStatusCode()).json(apiErrorResponse);
        }
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Password reset failed due to an internal error.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  router.get('/verify-email',
    authRateLimits.moderate, query('token').trim().notEmpty().withMessage('Verification token is required').isLength({ min: 32, max: 128 }).withMessage('Invalid verification token format'), handleValidationErrors,
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { token } = req.query;
        console.log('[AuthRoutes] Email verification attempt');
        const user = await authService.verifyEmail(token as string);
        console.log(`[AuthRoutes] Email verified successfully for user: ${user.id}`);
        return res.status(200).json({ success: true, message: 'Email address verified successfully!', user: { id: user.id, username: user.username, email: user.email, emailVerified: user.emailVerified }});
      } catch (error: any) {
        console.error('[AuthRoutes] Email verification error:', error);
        if (error instanceof GMIError) {
          const apiErrorResponse: ApiErrorResponse = { error: { code: error.code, message: error.getUserFriendlyMessage(), details: error.details, timestamp: error.timestamp.toISOString() }};
          return res.status(error.getHttpStatusCode()).json(apiErrorResponse);
        }
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Email verification failed due to an internal error.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  // AUTHENTICATED USER ENDPOINTS
  router.get('/me',
    requireAuth, authRateLimits.lenient,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        console.log(`[AuthRoutes] Profile request for user: ${userId}`);
        const [user, subscription, apiKeys] = await Promise.all([
          authService.getPublicUserById(userId),
          subscriptionService.getUserSubscriptionTier(userId),
          authService.getUserApiKeys(userId),
        ]);
        if (!user) {
          const gmiErr = new GMIError('User profile not found.', GMIErrorCode.USER_NOT_FOUND);
          const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
          return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
        }
        const successResponse: AuthSuccessResponse = {
          success: true, message: 'Profile retrieved successfully', user, subscription,
          data: { apiKeys: apiKeys.map((key: UserApiKeyInfo) => ({ id: key.id, providerId: key.providerId, keyName: key.keyName, isActive: key.isActive, createdAt: key.createdAt, updatedAt: key.updatedAt })), totalApiKeys: apiKeys.length },
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Get profile error:', error);
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Failed to retrieve user profile.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  router.put('/me',
    requireAuth, authRateLimits.moderate,
    [
      body('username').optional().trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 chars').matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Invalid username chars'),
      body('email').optional().trim().isEmail().withMessage('Valid email required').normalizeEmail(),
      body('displayName').optional().trim().isLength({ max: 100 }).withMessage('Display name max 100 chars'),
      body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio max 500 chars'),
    ],
    handleValidationErrors,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const { password, passwordPlainText, id, createdAt, updatedAt, ...safeUpdateData } = req.body;
        console.log(`[AuthRoutes] Profile update request for user: ${userId}`);
        const updatedUser = await authService.updateUserProfile(userId, safeUpdateData);
        console.log(`[AuthRoutes] Profile updated successfully for user: ${userId}`);
        const successResponse: AuthSuccessResponse = {
          success: true, message: 'Profile updated successfully.',
          user: { id: updatedUser.id, username: updatedUser.username, email: updatedUser.email, emailVerified: updatedUser.emailVerified, updatedAt: updatedUser.updatedAt }
        };
        return res.status(200).json(successResponse);
      } catch (error: any) {
        console.error('[AuthRoutes] Profile update error:', error);
        if (error instanceof GMIError) {
          const apiErrorResponse: ApiErrorResponse = { error: { code: error.code, message: error.getUserFriendlyMessage(), details: error.details, timestamp: error.timestamp.toISOString() }};
          return res.status(error.getHttpStatusCode()).json(apiErrorResponse);
        }
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Failed to update profile.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  router.post('/change-password',
    requireAuth, authRateLimits.strict, passwordChangeValidation, handleValidationErrors,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const { currentPassword, newPassword } = req.body;
        console.log(`[AuthRoutes] Password change request for user: ${userId}`);
        await authService.changePassword(userId, currentPassword, newPassword);
        console.log(`[AuthRoutes] Password changed successfully for user: ${userId}`);
        return res.status(200).json({ success: true, message: 'Password changed successfully.' });
      } catch (error: any) {
        console.error('[AuthRoutes] Password change error:', error);
        if (error instanceof GMIError) {
          const apiErrorResponse: ApiErrorResponse = { error: { code: error.code, message: error.getUserFriendlyMessage(), details: error.details, timestamp: error.timestamp.toISOString() }};
          return res.status(error.getHttpStatusCode()).json(apiErrorResponse);
        }
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Failed to change password.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  router.post('/logout',
    requireAuth, authRateLimits.lenient,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const token = req.headers.authorization?.split(' ')[1];
        console.log(`[AuthRoutes] Logout request for user: ${userId}`);
        if (token) await authService.logoutUser(token);
        console.log(`[AuthRoutes] User logged out successfully: ${userId}`);
        return res.status(200).json({ success: true, message: 'Logged out successfully.' });
      } catch (error: any) {
        console.error('[AuthRoutes] Logout error:', error);
        return res.status(200).json({ success: true, message: 'Logged out successfully.' });
      }
    }
  );

  // API KEY MANAGEMENT
  router.get('/api-keys',
    requireAuth, authRateLimits.lenient,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        console.log(`[AuthRoutes] API keys request for user: ${userId}`);
        const apiKeys = await authService.getUserApiKeys(userId);
        return res.status(200).json({ success: true, message: 'API keys retrieved successfully', data: { apiKeys: apiKeys.map((key: UserApiKeyInfo) => ({ id: key.id, providerId: key.providerId, keyName: key.keyName || `${key.providerId} Key`, isActive: key.isActive, createdAt: key.createdAt, updatedAt: key.updatedAt })), totalKeys: apiKeys.length }});
      } catch (error: any) {
        console.error('[AuthRoutes] Get API keys error:', error);
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Failed to retrieve API keys.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  router.post('/api-keys',
    requireAuth, authRateLimits.moderate, apiKeyValidation, handleValidationErrors,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const { providerId, apiKey, keyName } = req.body;
        console.log(`[AuthRoutes] API key creation for user: ${userId}, provider: ${providerId}`);
        const subscription = await subscriptionService.getUserSubscriptionTier(userId);
        if (subscription) {
          const currentApiKeys = await authService.getUserApiKeys(userId);
          if (subscription.maxApiKeys !== undefined && currentApiKeys.length >= subscription.maxApiKeys) {
            const gmiErr = new GMIError( `API key limit exceeded. Your ${subscription.name} plan allows ${subscription.maxApiKeys} keys.`, GMIErrorCode.USAGE_LIMIT_EXCEEDED, { current: currentApiKeys.length, max: subscription.maxApiKeys, tier: subscription.name });
            const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
            return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
          }
        }
        const savedKey = await authService.saveUserApiKey(userId, providerId, apiKey, keyName);
        console.log(`[AuthRoutes] API key saved for user: ${userId}, provider: ${providerId}`);
        return res.status(201).json({ success: true, message: `API key for ${providerId} saved.`, data: { apiKey: savedKey }});
      } catch (error: any) {
        console.error('[AuthRoutes] Save API key error:', error);
        if (error instanceof GMIError) {
          // TODO: Consider adding GMIErrorCode.API_KEY_DUPLICATE (e.g., 'RES_API_KEY_DUPLICATE') to errors.ts
          const statusCode = error.code === GMIErrorCode.RESOURCE_ALREADY_EXISTS /* Check for duplicate */ ? 409 : error.getHttpStatusCode();
          const apiErrorResponse: ApiErrorResponse = { error: { code: error.code, message: error.getUserFriendlyMessage(), details: error.details, timestamp: error.timestamp.toISOString() }};
          return res.status(statusCode).json(apiErrorResponse);
        }
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Failed to save API key.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  router.put('/api-keys/:keyId',
    requireAuth, authRateLimits.moderate,
    [
      param('keyId').trim().notEmpty().withMessage('API key ID required').isUUID().withMessage('Invalid API key ID'),
      body('keyName').optional().trim().isLength({ max: 100 }).withMessage('Key name max 100 chars'),
      body('isActive').optional().isBoolean().withMessage('Active status must be boolean'),
    ],
    handleValidationErrors,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const { keyId } = req.params;
        const updateData = req.body as { keyName?: string; isActive?: boolean };
        console.log(`[AuthRoutes] API key update for user: ${userId}, key: ${keyId}`);
        // TODO: Implement 'updateUserApiKeyMetadata' in IAuthService and AuthService
        const updatedKey = await (authService as any).updateUserApiKeyMetadata(userId, keyId, updateData);
        console.log(`[AuthRoutes] API key updated for user: ${userId}, key: ${keyId}`);
        return res.status(200).json({ success: true, message: 'API key updated.', data: { apiKey: updatedKey }});
      } catch (error: any) {
        console.error('[AuthRoutes] Update API key error:', error);
        if (error instanceof GMIError) {
          const apiErrorResponse: ApiErrorResponse = { error: { code: error.code, message: error.getUserFriendlyMessage(), details: error.details, timestamp: error.timestamp.toISOString() }};
          return res.status(error.getHttpStatusCode()).json(apiErrorResponse);
        }
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Failed to update API key.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  router.delete('/api-keys/:keyId',
    requireAuth, authRateLimits.moderate, param('keyId').trim().notEmpty().withMessage('API key ID required').isUUID().withMessage('Invalid API key ID'), handleValidationErrors,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const { keyId } = req.params;
        console.log(`[AuthRoutes] API key deletion for user: ${userId}, key: ${keyId}`);
        await authService.deleteUserApiKey(userId, keyId);
        console.log(`[AuthRoutes] API key deleted for user: ${userId}, key: ${keyId}`);
        return res.status(200).json({ success: true, message: 'API key deleted.' });
      } catch (error: any) {
        console.error('[AuthRoutes] Delete API key error:', error);
        if (error instanceof GMIError) {
          const apiErrorResponse: ApiErrorResponse = { error: { code: error.code, message: error.getUserFriendlyMessage(), details: error.details, timestamp: error.timestamp.toISOString() }};
          return res.status(error.getHttpStatusCode()).json(apiErrorResponse);
        }
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Failed to delete API key.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  // ACCOUNT MANAGEMENT
  router.post('/resend-verification',
    requireAuth, authRateLimits.strict,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        console.log(`[AuthRoutes] Resend verification for user: ${userId}`);
        await (authService as any).resendEmailVerification(userId); // TODO: Implement in AuthService
        console.log(`[AuthRoutes] Verification email resent for user: ${userId}`);
        return res.status(200).json({ success: true, message: 'Verification email resent.' });
      } catch (error: any) {
        console.error('[AuthRoutes] Resend verification error:', error);
        if (error instanceof GMIError) {
          const apiErrorResponse: ApiErrorResponse = { error: { code: error.code, message: error.getUserFriendlyMessage(), details: error.details, timestamp: error.timestamp.toISOString() }};
          return res.status(error.getHttpStatusCode()).json(apiErrorResponse);
        }
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Failed to resend verification email.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  router.get('/sessions',
    requireAuth, authRateLimits.lenient,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        console.log(`[AuthRoutes] Sessions request for user: ${userId}`);
        const sessions: UserSessionInfo[] = await (authService as any).getUserSessions(userId); // TODO: Implement in AuthService
        return res.status(200).json({ success: true, message: 'Active sessions retrieved', data: { sessions: sessions.map((session: UserSessionInfo) => ({ id: session.id, deviceInfo: session.deviceInfo, ipAddress: session.ipAddress, lastActiveAt: session.lastActiveAt, createdAt: session.createdAt, isCurrent: session.id === req.user!.sessionId })), totalSessions: sessions.length }});
      } catch (error: any) {
        console.error('[AuthRoutes] Get sessions error:', error);
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Failed to retrieve sessions.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  router.delete('/sessions/:sessionId',
    requireAuth, authRateLimits.moderate, param('sessionId').trim().notEmpty().withMessage('Session ID required').isUUID().withMessage('Invalid session ID'), handleValidationErrors,
    async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
      try {
        const userId = req.user!.userId;
        const { sessionId } = req.params;
        console.log(`[AuthRoutes] Session termination for user: ${userId}, session: ${sessionId}`);
        await (authService as any).terminateUserSession(userId, sessionId); // TODO: Implement in AuthService
        console.log(`[AuthRoutes] Session terminated for user: ${userId}, session: ${sessionId}`);
        return res.status(200).json({ success: true, message: 'Session terminated.' });
      } catch (error: any) {
        console.error('[AuthRoutes] Terminate session error:', error);
        if (error instanceof GMIError) {
          const apiErrorResponse: ApiErrorResponse = { error: { code: error.code, message: error.getUserFriendlyMessage(), details: error.details, timestamp: error.timestamp.toISOString() }};
          return res.status(error.getHttpStatusCode()).json(apiErrorResponse);
        }
        const gmiErr = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, undefined, 'Failed to terminate session.');
        const apiErrorResponse: ApiErrorResponse = { error: { code: gmiErr.code, message: gmiErr.getUserFriendlyMessage(), details: gmiErr.details, timestamp: gmiErr.timestamp.toISOString() }};
        return res.status(gmiErr.getHttpStatusCode()).json(apiErrorResponse);
      }
    }
  );

  return router;
}