// File: backend/api/authRoutes.ts
/**
 * @fileoverview Complete authentication routes with all import fixes and return statements
 */

import { Router, Request, Response } from 'express';
import { IAuthService, AuthenticationResult, UserApiKeyInfo, AuthTokenPayload } from '../services/user_auth/IAuthService';
// Assuming ISubscriptionService and ISubscriptionTier are correctly exported from SubscriptionService
import { ISubscriptionService, ISubscriptionTier } from '../services/user_auth/SubscriptionService';
// Use the locally defined User and PublicUser types
import { User, PublicUser } from '../services/user_auth/User';
import { AuthenticatedRequest, authenticateToken } from '../middleware/authenticateTokenMiddleware';
import { GMIError, GMIErrorCode } from '../utils/errors'; // Ensure GMIErrorCode is exported

// DTOs (assuming these are fine as per original)
interface RegisterUserDto { username?: string; email?: string; password?: string; }
interface LoginUserDto { identifier?: string; password?: string; }
interface ChangePasswordDto { oldPassword?: string; newPassword?: string; }
interface RequestPasswordResetDto { email?: string; }
interface ResetPasswordDto { resetToken?: string; newPassword?: string; }
interface UserApiKeyDto { providerId?: string; apiKey?: string; keyName?: string; }
interface AssignTierDto { newTierId?: string; }
interface UpdateUserProfileDto { username?: string; email?: string; }
interface VerifyEmailDto { verificationToken?: string; }


export const createAuthRoutes = (
  authService: IAuthService,
  subscriptionService: ISubscriptionService
): Router => {
  const router = Router();

  router.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body as RegisterUserDto;
    if (!username || !email || !password) {
      return res.status(400).json({
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Username, email, and password are required.' },
      });
    }
    if (username.length < 3) {
      return res.status(400).json({
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Username must be at least 3 characters long.' },
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Password must be at least 8 characters long.' },
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Invalid email format.' },
      });
    }

    try {
      const publicUser = await authService.registerUser(username, email, password);
      return res.status(201).json({
        user: publicUser,
        message: 'User registered successfully. Please check your email for verification.'
      });
    } catch (error: any) {
      console.error(`AuthRoutes: /register error for ${email}:`, error.message);
      if (error instanceof GMIError) {
        const statusCode = error.code === GMIErrorCode.REGISTRATION_EMAIL_EXISTS || 
                           error.code === GMIErrorCode.REGISTRATION_USERNAME_EXISTS ? 409 :
                           error.code === GMIErrorCode.VALIDATION_ERROR ? 400 : 
                           (error.httpStatusCode || 500);
        return res.status(statusCode).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Registration failed due to an internal server error.' }
      });
    }
  });

  router.post('/login', async (req: Request, res: Response) => {
    const { identifier, password } = req.body as LoginUserDto;
    if (!identifier || !password) {
      return res.status(400).json({
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Username/email and password are required.' },
      });
    }

    try {
      const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
      const ipAddress = req.ip;
      const authResult = await authService.loginUser(identifier, password, deviceInfo, ipAddress);
      return res.status(200).json({
        ...authResult,
        message: 'Login successful.'
      });
    } catch (error: any) {
      console.error(`AuthRoutes: /login error for ${identifier}:`, error.message);
      if (error instanceof GMIError) {
        const statusCode = error.code === GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS ? 401 :
                           error.code === GMIErrorCode.AUTHENTICATION_EMAIL_NOT_VERIFIED ? 403 : 
                           (error.httpStatusCode || 500);
        return res.status(statusCode).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Login failed due to an internal server error.' }
      });
    }
  });

  router.post('/logout', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ 
        error: { code: GMIErrorCode.AUTHENTICATION_TOKEN_MISSING, message: 'No token provided for logout.' }
      });
    }

    try {
      await authService.logoutUser(token);
      return res.status(200).json({ message: 'Logout successful.' });
    } catch (error: any) {
      console.error(`AuthRoutes: /logout error:`, error.message);
      if (error instanceof GMIError) {
        return res.status(error.httpStatusCode || 500).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Logout failed due to an internal server error.' }
      });
    }
  });

  router.post('/verify-email', async (req: Request, res: Response) => {
    const { verificationToken } = req.body as VerifyEmailDto;
    if (!verificationToken) {
      return res.status(400).json({
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Verification token is required.' }
      });
    }

    try {
      await authService.verifyEmail(verificationToken); // Assuming this method exists
      return res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error: any) {
      console.error(`AuthRoutes: /verify-email error:`, error.message);
      if (error instanceof GMIError) {
        // Ensure GMIErrorCode.EMAIL_VERIFICATION_TOKEN_INVALID exists or use appropriate code
        const statusCode = error.code === GMIErrorCode.EMAIL_VERIFICATION_TOKEN_INVALID ? 400 : 
                           (error.httpStatusCode || 500);
        return res.status(statusCode).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Email verification failed.' }
      });
    }
  });

  router.get('/me', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const tokenPayload = req.user!;
    try {
      const publicUser = await authService.getPublicUserById(tokenPayload.userId);
      if (!publicUser) {
        return res.status(404).json({ 
          error: { code: GMIErrorCode.USER_NOT_FOUND, message: 'Authenticated user not found.' }
        });
      }
      const tier = await authService.getUserSubscriptionTier(tokenPayload.userId);
      return res.status(200).json({ user: publicUser, tier });
    } catch (error: any) {
      console.error(`AuthRoutes: /me error for user ${tokenPayload.userId}:`, error.message);
      if (error instanceof GMIError) {
        return res.status(error.httpStatusCode || 500).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to retrieve user profile.' }
      });
    }
  });

  router.put('/me', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const { username, email } = req.body as UpdateUserProfileDto;
    const userId = req.user!.userId;

    if (!username && !email) {
      return res.status(400).json({
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'At least username or email must be provided.' }
      });
    }

    try {
      const updatedUser = await authService.updateUserProfile(userId, { username, email }); // Assuming this method exists
      return res.status(200).json({ user: updatedUser, message: 'Profile updated successfully.' });
    } catch (error: any) {
      console.error(`AuthRoutes: /me PUT error for user ${userId}:`, error.message);
      if (error instanceof GMIError) {
        const statusCode = error.code === GMIErrorCode.VALIDATION_ERROR ? 400 : 
                           (error.httpStatusCode || 500);
        return res.status(statusCode).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to update profile.' }
      });
    }
  });

  router.post('/me/change-password', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body as ChangePasswordDto;
    const userId = req.user!.userId;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ 
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Old and new passwords are required.' }
      });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'New password must be at least 8 characters long.' }
      });
    }

    try {
      await authService.changePassword(userId, oldPassword, newPassword);
      return res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error: any) {
      console.error(`AuthRoutes: /me/change-password error for user ${userId}:`, error.message);
      if (error instanceof GMIError) {
        const statusCode = error.code === GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS ? 401 :
                           error.code === GMIErrorCode.VALIDATION_ERROR ? 400 : 
                           (error.httpStatusCode || 500);
        return res.status(statusCode).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to change password.' }
      });
    }
  });

  router.post('/request-password-reset', async (req: Request, res: Response) => {
    const { email } = req.body as RequestPasswordResetDto;
    if (!email) {
      return res.status(400).json({ 
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Email is required.' }
      });
    }

    try {
      await authService.requestPasswordReset(email);
      return res.status(200).json({ 
        message: 'If your email address is registered, you will receive a password reset link shortly.' 
      });
    } catch (error: any) {
      console.error(`AuthRoutes: /request-password-reset error for email ${email}:`, error.message);
      // Avoid revealing if email exists for security, always return generic success or log specific error
      return res.status(200).json({ 
        message: 'If your email address is registered, you will receive a password reset link shortly.' 
      });
    }
  });

  router.post('/reset-password', async (req: Request, res: Response) => {
    const { resetToken, newPassword } = req.body as ResetPasswordDto;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ 
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Reset token and new password are required.' }
      });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'New password must be at least 8 characters long.' }
      });
    }

    try {
      await authService.resetPassword(resetToken, newPassword);
      return res.status(200).json({ 
        message: 'Password has been reset successfully. You can now log in with your new password.' 
      });
    } catch (error: any) {
      console.error(`AuthRoutes: /reset-password error:`, error.message);
      if (error instanceof GMIError) {
        const statusCode = error.code === GMIErrorCode.PASSWORD_RESET_TOKEN_INVALID ? 401 : // Ensure this code exists
                           error.code === GMIErrorCode.VALIDATION_ERROR ? 400 : 
                           (error.httpStatusCode || 500);
        return res.status(statusCode).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to reset password.' }
      });
    }
  });

  router.post('/me/api-keys', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const { providerId, apiKey, keyName } = req.body as UserApiKeyDto;
    const userId = req.user!.userId;

    if (!providerId || !apiKey) {
      return res.status(400).json({ 
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Provider ID and API key are required.' }
      });
    }
    const validProviders = ['openai', 'anthropic', 'openrouter', 'ollama']; // Consider making this configurable
    if (!validProviders.includes(providerId)) {
      return res.status(400).json({
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: `Invalid provider ID. Supported providers: ${validProviders.join(', ')}` }
      });
    }

    try {
      const apiKeyInfo = await authService.saveUserApiKey(userId, providerId, apiKey, keyName);
      return res.status(201).json({
        apiKey: apiKeyInfo,
        message: 'API key saved successfully.'
      });
    } catch (error: any) {
      console.error(`AuthRoutes: /me/api-keys POST error for user ${userId}, provider ${providerId}:`, error.message);
      if (error instanceof GMIError) {
        return res.status(error.httpStatusCode || 500).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to save API key.' }
      });
    }
  });

  router.get('/me/api-keys', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;
    try {
      const apiKeys = await authService.getUserApiKeys(userId);
      return res.status(200).json({ apiKeys });
    } catch (error: any) {
      console.error(`AuthRoutes: /me/api-keys GET error for user ${userId}:`, error.message);
       if (error instanceof GMIError) {
        return res.status(error.httpStatusCode || 500).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to retrieve API keys.' }
      });
    }
  });

  router.delete('/me/api-keys/:apiKeyRecordId', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;
    const { apiKeyRecordId } = req.params;

    if (!apiKeyRecordId) {
      return res.status(400).json({
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'API key record ID is required.' }
      });
    }

    try {
      await authService.deleteUserApiKey(userId, apiKeyRecordId);
      return res.status(200).json({ message: 'API key deleted successfully.' });
    } catch (error: any) {
      console.error(`AuthRoutes: /me/api-keys DELETE error for user ${userId}, key ID ${apiKeyRecordId}:`, error.message);
      if (error instanceof GMIError) {
        const statusCode = error.code === GMIErrorCode.RESOURCE_NOT_FOUND || 
                           error.code === GMIErrorCode.PERMISSION_DENIED ? 404 : 
                           (error.httpStatusCode || 500);
        return res.status(statusCode).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to delete API key.' }
      });
    }
  });

  router.get('/me/subscription', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;
    try {
      const tier = await authService.getUserSubscriptionTier(userId);
      const usageStats = await subscriptionService.getUserUsageStats(userId);
      return res.status(200).json({ 
        tier, 
        usage: usageStats,
        message: tier ? `Current subscription: ${tier.name}` : 'No active subscription'
      });
    } catch (error: any) {
      console.error(`AuthRoutes: /me/subscription error for user ${userId}:`, error.message);
      if (error instanceof GMIError) {
        return res.status(error.httpStatusCode || 500).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to retrieve subscription information.' }
      });
    }
  });

  router.post('/me/assign-tier', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;
    const { newTierId } = req.body as AssignTierDto;

    if (!newTierId || typeof newTierId !== 'string') {
      return res.status(400).json({ 
        error: { code: GMIErrorCode.VALIDATION_ERROR, message: "newTierId is required and must be a string." }
      });
    }

    try {
      // Assuming assignTierToUser returns the full Prisma User model
      const updatedPrismaUser = await subscriptionService.assignTierToUser(userId, newTierId);
      const appUser = User.fromPrisma(updatedPrismaUser); // Convert Prisma model to your app's User model
      const publicUser = appUser.toPublicUser();
      const newTier = await authService.getUserSubscriptionTier(userId);

      return res.status(200).json({
        message: `Subscription tier '${newTier?.name || newTierId}' assigned successfully.`,
        user: publicUser,
        tier: newTier
      });
    } catch (error: any) {
      console.error(`AuthRoutes: /me/assign-tier error for user ${userId}, tier ${newTierId}:`, error.message);
      if (error instanceof GMIError) {
        const statusCode = error.code === GMIErrorCode.USER_NOT_FOUND || 
                           error.code === GMIErrorCode.RESOURCE_NOT_FOUND ? 404 : 
                           (error.httpStatusCode || 500);
        return res.status(statusCode).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to assign subscription tier.' }
      });
    }
  });

  router.get('/users', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    // Add admin role check from req.user here
    if (req.user?.role !== 'ADMIN') { // Example role check
         return res.status(403).json({
            error: { code: GMIErrorCode.PERMISSION_DENIED, message: 'Admin access required.' }
         });
    }
    // Actual implementation to list users for admin
    return res.status(501).json({ message: 'Admin user listing not implemented.' });
  });

  router.get('/tiers', async (req: Request, res: Response) => {
    try {
      const tiers = await subscriptionService.getAllTiers();
      return res.status(200).json({ tiers });
    } catch (error: any) {
      console.error(`AuthRoutes: /tiers error:`, error.message);
      if (error instanceof GMIError) {
        return res.status(error.httpStatusCode || 500).json({ 
          error: { code: error.code, message: error.message, details: error.details } 
        });
      }
      return res.status(500).json({ 
        error: { code: GMIErrorCode.INTERNAL_SERVER_ERROR, message: 'Failed to retrieve subscription tiers.' }
      });
    }
  });

  return router;
};