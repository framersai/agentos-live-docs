// File: backend/api/authRoutes.ts
/**
 * @fileoverview Defines SOTA Express routes for user authentication, session management,
 * API key management, and related account operations within AgentOS.
 * These routes leverage the AuthService and SubscriptionService for their core logic,
 * ensuring secure and robust handling of all authentication and authorization concerns.
 *
 * @module backend/api/authRoutes
 */

import { Router, Request, Response } from 'express';
import { IAuthService, AuthenticationResult, UserApiKeyInfo, AuthTokenPayload } from '../services/user_auth/IAuthService';
import { ISubscriptionService, ISubscriptionTier } from '../services/user_auth/SubscriptionService';
import { PublicUser } from '../services/user_auth/User';
import { AuthenticatedRequest, authenticateToken } from '../middleware/authenticateTokenMiddleware';
import { GMIError, GMIErrorCode } from '../utils/errors'; // For consistent error handling

// --- Data Transfer Object (DTO) Interfaces for Request Bodies ---

/** DTO for user registration. */
interface RegisterUserDto {
  username?: string;
  email?: string;
  password?: string;
}

/** DTO for user login. */
interface LoginUserDto {
  identifier?: string; // Can be username or email
  password?: string;
}

/** DTO for changing password. */
interface ChangePasswordDto {
  oldPassword?: string;
  newPassword?: string;
}

/** DTO for requesting a password reset. */
interface RequestPasswordResetDto {
  email?: string;
}

/** DTO for resetting password with a token. */
interface ResetPasswordDto {
  resetToken?: string;
  newPassword?: string;
}

/** DTO for saving/updating a user's LLM API key. */
interface UserApiKeyDto {
  providerId?: string;
  apiKey?: string;
  keyName?: string;
}

/** DTO for assigning a subscription tier to a user (admin or webhook triggered). */
interface AssignTierDto {
    newTierId?: string;
}


/**
 * Creates and configures the Express router for authentication and user account management.
 *
 * @param {IAuthService} authService - The authentication service instance.
 * @param {ISubscriptionService} subscriptionService - The subscription service instance.
 * @param {PrismaClient} prisma - (Currently unused directly in routes, but often passed to services)
 * @returns {Router} The configured Express router for authentication.
 */
export const createAuthRoutes = (
  authService: IAuthService,
  subscriptionService: ISubscriptionService
): Router => {
  const router = Router();

  // --- Public Authentication Endpoints ---

  /**
   * @route POST /auth/register
   * @description Registers a new user.
   * @access Public
   * @body {RegisterUserDto} registrationData - Username, email, and password.
   * @returns {PublicUser} The created public user object upon success.
   * @throws {400} If input is invalid.
   * @throws {409} If username or email already exists.
   * @throws {500} For internal server errors.
   */
  router.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body as RegisterUserDto;
    if (!username || !email || !password) {
      return res.status(400).json({
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Username, email, and password are required.' },
      });
    }
    try {
      const publicUser = await authService.registerUser(username, email, password);
      res.status(201).json(publicUser);
    } catch (error: any) {
      console.error(`AuthRoutes: /register error for ${email}:`, error.message);
      if (error instanceof GMIError) {
        const statusCode = error.code === GMIErrorCode.REGISTRATION_EMAIL_EXISTS || error.code === GMIErrorCode.REGISTRATION_USERNAME_EXISTS ? 409 :
                           error.code === GMIErrorCode.VALIDATION_ERROR ? 400 : 500;
        return res.status(statusCode).json({ error: { code: error.code, message: error.message, details: error.details } });
      }
      res.status(500).json({ error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Registration failed due to an internal server error.' }});
    }
  });

  /**
   * @route POST /auth/login
   * @description Logs in an existing user.
   * @access Public
   * @body {LoginUserDto} loginData - User identifier (username or email) and password.
   * @returns {AuthenticationResult} User object, JWT token, and session details upon success.
   * @throws {400} If input is invalid.
   * @throws {401} If credentials are invalid.
   * @throws {500} For internal server errors.
   */
  router.post('/login', async (req: Request, res: Response) => {
    const { identifier, password } = req.body as LoginUserDto;
    if (!identifier || !password) {
      return res.status(400).json({
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Username/email and password are required.' },
      });
    }
    try {
      const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
      const ipAddress = req.ip; // Express provides req.ip
      const authResult = await authService.loginUser(identifier, password, deviceInfo, ipAddress);
      
      // For web clients, consider setting an HTTP-Only cookie for the token or a refresh token
      // For API clients, returning the token in the response body is standard.
      res.status(200).json(authResult);
    } catch (error: any) {
      console.error(`AuthRoutes: /login error for ${identifier}:`, error.message);
      if (error instanceof GMIError) {
        const statusCode = error.code === GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS ? 401 :
                           error.code === GMIErrorCode.AUTHENTICATION_EMAIL_NOT_VERIFIED ? 403 : 500;
        return res.status(statusCode).json({ error: { code: error.code, message: error.message, details: error.details } });
      }
      res.status(500).json({ error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Login failed due to an internal server error.' }});
    }
  });

  /**
   * @route POST /auth/logout
   * @description Logs out the currently authenticated user by invalidating their session.
   * @access Protected (requires Bearer token)
   * @returns {200} Success message.
   * @throws {401} If no token is provided.
   * @throws {500} For internal server errors during logout process.
   */
  router.post('/logout', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) { // Should be caught by middleware, but as a safeguard
        return res.status(401).json({ error: { code: GMIErrorCode.AUTHENTICATION_TOKEN_MISSING, message: 'No token provided for logout.' }});
    }
    try {
      await authService.logoutUser(token);
      res.status(200).json({ message: 'Logout successful.' });
    } catch (error: any) {
      console.error(`AuthRoutes: /logout error:`, error.message);
      if (error instanceof GMIError) {
        return res.status(500).json({ error: { code: error.code, message: error.message, details: error.details } });
      }
      res.status(500).json({ error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Logout failed due to an internal server error.' }});
    }
  });

  // --- Protected User Account Management Endpoints ---

  /**
   * @route GET /auth/me
   * @description Retrieves the public profile and subscription tier of the currently authenticated user.
   * @access Protected
   * @returns {object} Contains `user: PublicUser` and `tier: ISubscriptionTier | null`.
   * @throws {401/403} If not authenticated.
   * @throws {500} If user data or tier cannot be retrieved.
   */
  router.get('/me', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const tokenPayload = req.user!; // Middleware ensures this exists
    try {
      const publicUser = await authService.getPublicUserById(tokenPayload.userId);
      if (!publicUser) {
        // This case should ideally not happen if token is valid and user exists
        return res.status(404).json({ error: { code: GMIErrorCode.USER_NOT_FOUND, message: 'Authenticated user not found.' }});
      }
      const tier = await authService.getUserSubscriptionTier(tokenPayload.userId);
      res.status(200).json({ user: publicUser, tier });
    } catch (error: any) {
      console.error(`AuthRoutes: /me error for user ${tokenPayload.userId}:`, error.message);
      if (error instanceof GMIError) {
        return res.status(500).json({ error: { code: error.code, message: error.message, details: error.details } });
      }
      res.status(500).json({ error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to retrieve user profile.' }});
    }
  });

  /**
   * @route POST /auth/me/change-password
   * @description Allows an authenticated user to change their password.
   * @access Protected
   * @body {ChangePasswordDto} passwords - Old and new passwords.
   * @returns {200} Success message.
   * @throws {400} If input is invalid.
   * @throws {401} If old password incorrect.
   * @throws {500} For internal server errors.
   */
  router.post('/me/change-password', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body as ChangePasswordDto;
    const userId = req.user!.userId;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Old and new passwords are required.' }});
    }
    try {
      await authService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error: any) {
      console.error(`AuthRoutes: /me/change-password error for user ${userId}:`, error.message);
      if (error instanceof GMIError) {
        const statusCode = error.code === GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS ? 401 :
                           error.code === GMIErrorCode.VALIDATION_ERROR ? 400 : 500;
        return res.status(statusCode).json({ error: { code: error.code, message: error.message, details: error.details } });
      }
      res.status(500).json({ error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to change password.' }});
    }
  });

  // --- Password Reset Endpoints ---

  /**
   * @route POST /auth/request-password-reset
   * @description Initiates the password reset process for a user by their email.
   * @access Public
   * @body {RequestPasswordResetDto} data - User's email address.
   * @returns {200} Success message (even if email doesn't exist, to prevent enumeration).
   * @throws {400} If email is not provided.
   * @throws {500} For internal server errors.
   */
  router.post('/request-password-reset', async (req: Request, res: Response) => {
    const { email } = req.body as RequestPasswordResetDto;
    if (!email) {
      return res.status(400).json({ error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Email is required.' }});
    }
    try {
      await authService.requestPasswordReset(email);
      // For security, always return a generic success message to prevent email enumeration.
      res.status(200).json({ message: 'If your email address is registered, you will receive a password reset link shortly.' });
    } catch (error: any) {
      console.error(`AuthRoutes: /request-password-reset error for email ${email}:`, error.message);
      // Even on internal error, a generic message can be good for security.
      // However, for debugging, a 500 might be more appropriate.
      res.status(500).json({ error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to process password reset request.' }});
    }
  });

  /**
   * @route POST /auth/reset-password
   * @description Resets a user's password using a valid reset token.
   * @access Public
   * @body {ResetPasswordDto} data - Reset token and new password.
   * @returns {200} Success message.
   * @throws {400} If input is invalid.
   * @throws {401} If token is invalid or expired.
   * @throws {500} For internal server errors.
   */
  router.post('/reset-password', async (req: Request, res: Response) => {
    const { resetToken, newPassword } = req.body as ResetPasswordDto;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Reset token and new password are required.' }});
    }
    try {
      await authService.resetPassword(resetToken, newPassword);
      res.status(200).json({ message: 'Password has been reset successfully. You can now log in with your new password.' });
    } catch (error: any) {
      console.error(`AuthRoutes: /reset-password error:`, error.message);
      if (error instanceof GMIError) {
         const statusCode = error.code === GMIErrorCode.PASSWORD_RESET_TOKEN_INVALID ? 401 :
                            error.code === GMIErrorCode.VALIDATION_ERROR ? 400 : 500;
        return res.status(statusCode).json({ error: { code: error.code, message: error.message, details: error.details } });
      }
      res.status(500).json({ error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to reset password.' }});
    }
  });

  // --- User API Key Management Endpoints ---

  /**
   * @route POST /auth/me/api-keys
   * @description Adds or updates a user-provided API key for a specific LLM provider.
   * @access Protected
   * @body {UserApiKeyDto} apiKeyData - Provider ID, API key, and optional key name.
   * @returns {UserApiKeyInfo} Information about the saved API key.
   * @throws {400} If input is invalid.
   * @throws {500} For internal server errors.
   */
  router.post('/me/api-keys', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const { providerId, apiKey, keyName } = req.body as UserApiKeyDto;
    const userId = req.user!.userId;

    if (!providerId || !apiKey) {
      return res.status(400).json({ error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Provider ID and API key are required.' }});
    }
    try {
      const apiKeyInfo = await authService.saveUserApiKey(userId, providerId, apiKey, keyName);
      res.status(201).json(apiKeyInfo);
    } catch (error: any) {
      console.error(`AuthRoutes: /me/api-keys POST error for user ${userId}, provider ${providerId}:`, error.message);
       if (error instanceof GMIError) {
        return res.status(500).json({ error: { code: error.code, message: error.message, details: error.details } });
      }
      res.status(500).json({ error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to save API key.' }});
    }
  });

  /**
   * @route GET /auth/me/api-keys
   * @description Retrieves a list of the authenticated user's saved API key information (masked keys).
   * @access Protected
   * @returns {UserApiKeyInfo[]} An array of API key information.
   * @throws {500} For internal server errors.
   */
  router.get('/me/api-keys', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;
    try {
      const apiKeys = await authService.getUserApiKeys(userId);
      res.status(200).json(apiKeys);
    } catch (error: any) {
      console.error(`AuthRoutes: /me/api-keys GET error for user ${userId}:`, error.message);
      if (error instanceof GMIError) {
        return res.status(500).json({ error: { code: error.code, message: error.message, details: error.details } });
      }
      res.status(500).json({ error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to retrieve API keys.' }});
    }
  });

  /**
   * @route DELETE /auth/me/api-keys/:apiKeyRecordId
   * @description Deletes a specific user-provided API key.
   * @access Protected
   * @param {string} apiKeyRecordId - The ID of the UserApiKey record to delete.
   * @returns {204} No content on successful deletion.
   * @throws {404} If API key record not found or not owned by user.
   * @throws {500} For internal server errors.
   */
  router.delete('/me/api-keys/:apiKeyRecordId', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;
    const { apiKeyRecordId } = req.params;
    try {
      await authService.deleteUserApiKey(userId, apiKeyRecordId);
      res.status(204).send();
    } catch (error: any) {
      console.error(`AuthRoutes: /me/api-keys DELETE error for user ${userId}, key ID ${apiKeyRecordId}:`, error.message);
      if (error instanceof GMIError) {
        const statusCode = error.code === GMIErrorCode.RESOURCE_NOT_FOUND || error.code === GMIErrorCode.PERMISSION_DENIED ? 404 : 500;
        return res.status(statusCode).json({ error: { code: error.code, message: error.message, details: error.details } });
      }
      res.status(500).json({ error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to delete API key.' }});
    }
  });


  /**
   * @route POST /auth/me/assign-tier
   * @description Assigns a subscription tier to the authenticated user.
   * This is typically an admin action or follows a payment webhook, but exposed here for completeness.
   * @access Protected
   * @body {AssignTierDto} tierData - The ID of the new tier.
   * @returns {object} Confirmation message and updated user/tier info.
   * @throws {400} If newTierId is invalid.
   * @throws {404} If user or tier not found.
   * @throws {500} For internal server errors.
   */
  router.post('/me/assign-tier', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;
    const { newTierId } = req.body as AssignTierDto;

    if (!newTierId || typeof newTierId !== 'string') {
      return res.status(400).json({ error: { code: GMIErrorCode.VALIDATION_ERROR, message: "newTierId is required and must be a string." }});
    }

    try {
      const updatedUserRecord = await subscriptionService.assignTierToUser(userId, newTierId);
      const publicUser = User.fromPrisma(updatedUserRecord).toPublicUser();
      const newTier = await authService.getUserSubscriptionTier(userId); // Fetch the updated tier info

      res.status(200).json({
        message: `Subscription tier '${newTier?.name || newTierId}' assigned successfully.`,
        user: publicUser,
        tier: newTier
      });
    } catch (error: any) {
      console.error(`AuthRoutes: /me/assign-tier error for user ${userId}, tier ${newTierId}:`, error.message);
      if (error instanceof GMIError) {
        const statusCode = error.code === GMIErrorCode.USER_NOT_FOUND || error.code === GMIErrorCode.RESOURCE_NOT_FOUND ? 404 : 500;
        return res.status(statusCode).json({ error: { code: error.code, message: error.message, details: error.details } });
      }
      res.status(500).json({ error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to assign subscription tier.' }});
    }
  });

  return router;
};