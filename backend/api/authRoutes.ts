/**
 * @file backend/api/authRoutes.ts
 * @module backend/api/authRoutes
 * @version 1.2.2
 *
 * @description
 * This module defines the Express router for all authentication-related API endpoints.
 * It handles a comprehensive set of authentication operations including:
 * - User registration (email/password).
 * - User login (email/password and Google OAuth 2.0).
 * - User logout and session invalidation.
 * - Email verification.
 * - User profile retrieval and updates.
 * - Password change and password reset flows.
 * - Management of user-provided API keys for external LLM services.
 * - Retrieval of subscription information (current tier, usage stats).
 * - Administrative actions like assigning subscription tiers and listing users (role-protected).
 *
 * Routes are designed to be RESTful and use services (`IAuthService`, `ISubscriptionService`)
 * for business logic. Protected routes leverage an authentication middleware (`authenticateToken`).
 * Input validation is performed for request bodies, and standardized error responses are generated
 * using `GMIError` and `ErrorFactory`.
 *
 * Key Dependencies:
 * - `express`: For router creation and request/response handling.
 * - `../services/user_auth/IAuthService`: Service contract for authentication logic.
 * - `../services/user_auth/ISubscriptionService`: Service contract for subscription logic.
 * - `../middleware/authenticateTokenMiddleware`: For protecting routes.
 * - `../utils/errors`: For standardized error handling.
 * - `../services/user_auth/User`: For `PublicUser` type definition.
 * - `@prisma/client`: For `PrismaUser` type definition.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { User as PrismaUser } from '@prisma/client'; // Import PrismaUser for type consistency
import {
  IAuthService,
  AuthenticationResult,
  UserApiKeyInfo,
  AuthTokenPayload,
  OAuthInitiateResult,
  UserProfileUpdateData,
} from '../services/user_auth/IAuthService';
import { ISubscriptionService, ISubscriptionTier } from '../services/user_auth/SubscriptionService';
import { User as DomainUser, PublicUser } from '../services/user_auth/User'; // Renamed import to DomainUser to avoid conflict
import { AuthenticatedRequest, authenticateToken } from '../middleware/authenticateTokenMiddleware';
import { GMIError, GMIErrorCode, ErrorFactory } from '../utils/errors';

// --- Data Transfer Object (DTO) Interfaces ---
// These define the expected shape of incoming data for various authentication operations.

/**
 * @interface RegisterUserDto
 * @description Data Transfer Object for user registration request body.
 * @property {string} [username] - The desired username for the new user.
 * @property {string} [email] - The user's email address.
 * @property {string} [password] - The user's plain-text password.
 */
interface RegisterUserDto { username?: string; email?: string; password?: string; }

/**
 * @interface LoginUserDto
 * @description Data Transfer Object for user login request body.
 * @property {string} [identifier] - The user's username or email address.
 * @property {string} [password] - The user's plain-text password.
 * @property {boolean} [rememberMe=false] - Optional flag indicating if the session should be persisted longer (e.g., via a persistent cookie).
 */
interface LoginUserDto { identifier?: string; password?: string; rememberMe?: boolean; }

/**
 * @interface ChangePasswordDto
 * @description Data Transfer Object for the change password request body.
 * @property {string} [oldPassword] - The user's current (old) password for verification.
 * @property {string} [newPassword] - The new password the user wishes to set.
 */
interface ChangePasswordDto { oldPassword?: string; newPassword?: string; }

/**
 * @interface RequestPasswordResetDto
 * @description Data Transfer Object for initiating a password reset request.
 * @property {string} [email] - The email address associated with the account for which the password reset is requested.
 */
interface RequestPasswordResetDto { email?: string; }

/**
 * @interface ResetPasswordDto
 * @description Data Transfer Object for completing a password reset using a token.
 * @property {string} [resetToken] - The password reset token received by the user (typically via email).
 * @property {string} [newPassword] - The new password to be set for the account.
 */
interface ResetPasswordDto { resetToken?: string; newPassword?: string; }

/**
 * @interface UserApiKeyDto
 * @description Data Transfer Object for creating or updating a user's API key for an external provider.
 * @property {string} [providerId] - A unique identifier for the LLM provider (e.g., "openai", "anthropic").
 * @property {string} [apiKey] - The actual API key value provided by the user.
 * @property {string} [keyName] - An optional, user-friendly name or label for the API key.
 */
interface UserApiKeyDto { providerId?: string; apiKey?: string; keyName?: string; }

/**
 * @interface AssignTierDto
 * @description Data Transfer Object for assigning a subscription tier, typically an administrative action.
 * @property {string} [userId] - The ID of the user to whom the tier is being assigned (used by admins).
 * @property {string} [newTierId] - The unique identifier of the new subscription tier to assign.
 */
interface AssignTierDto { userId?: string; newTierId?: string; }

/**
 * @interface VerifyEmailDto
 * @description Data Transfer Object for verifying a user's email address.
 * @property {string} [verificationToken] - The unique token sent to the user's email for verification.
 */
interface VerifyEmailDto { verificationToken?: string; }


/**
 * Creates and configures the Express router for all authentication-related API endpoints.
 * This function wires up all authentication-related endpoints to their respective
 * service methods in `IAuthService` and `ISubscriptionService`.
 * It applies authentication middleware (`authenticateToken`) to routes that require an authenticated user session.
 * Basic input validation is performed directly in the route handlers, with more complex validation
 * potentially handled within the service layer. Standardized error responses are generated using `GMIError` and `ErrorFactory`.
 *
 * @function createAuthRoutes
 * @param {IAuthService} authService - An instance of the authentication service, conforming to `IAuthService`.
 * @param {ISubscriptionService} subscriptionService - An instance of the subscription service, conforming to `ISubscriptionService`.
 * @returns {Router} The configured Express router for authentication and user management.
 *
 * @example
 * // In server.ts or your main application setup file:
 * // const authServiceInstance = new AuthService(prismaClient, authConfig);
 * // const subscriptionServiceInstance = new SubscriptionService(prismaClient, authServiceInstance, paymentServiceInstance);
 * // const authApiRouter = createAuthRoutes(authServiceInstance, subscriptionServiceInstance);
 * // app.use('/api/v1/auth', authApiRouter); // Mount the auth router
 */
export const createAuthRoutes = (
  authService: IAuthService,
  subscriptionService: ISubscriptionService
): Router => {
  const router = Router();

  // --- User Registration ---
  /**
   * @route POST /api/v1/auth/register
   * @description Registers a new user account.
   * Validates input (username, email, password), creates the user record, hashes the password,
   * and typically initiates an email verification process by generating a token.
   * Upon successful registration, a default subscription tier (e.g., "Free") is assigned to the new user.
   * @access Public
   * @body {RegisterUserDto} Requires `username`, `email`, and `password`.
   * Username must be 3-30 characters, alphanumeric with `_.-`.
   * Password must be at least 8 characters. Email must be a valid format.
   * @response {201} Created - Returns the `PublicUser` object and a success message indicating email verification is pending.
   * @response {400} Bad Request - If validation fails (e.g., missing fields, weak password, invalid email format). Provides `GMIErrorCode.VALIDATION_ERROR`.
   * @response {409} Conflict - If the chosen username or email address already exists in the system. Provides `GMIErrorCode.REGISTRATION_USERNAME_EXISTS` or `GMIErrorCode.REGISTRATION_EMAIL_EXISTS`.
   * @response {500} Internal Server Error - If an unexpected error occurs during the registration process. Provides `GMIErrorCode.INTERNAL_SERVER_ERROR`.
   */
  router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body as RegisterUserDto;

    if (!username || !email || !password) {
      return next(ErrorFactory.validation('Username, email, and password are required fields.'));
    }
    if (username.length < 3 || username.length > 30) {
      return next(ErrorFactory.validation('Username must be between 3 and 30 characters long.', { field: 'username' }));
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) { // Stricter username validation
        return next(ErrorFactory.validation('Username can only contain letters, numbers, and the characters "_", ".", "-".', { field: 'username' }));
    }
    if (password.length < 8) {
      return next(ErrorFactory.validation('Password must be at least 8 characters long.', { field: 'password' }));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(ErrorFactory.validation('Invalid email address format.', { field: 'email' }));
    }

    try {
      const publicUser: PublicUser = await authService.registerUser(username, email, password);
      const freeTier = await subscriptionService.getTierByName('Free');
      if (freeTier && publicUser?.id) {
        await subscriptionService.assignTierToUser(publicUser.id, freeTier.id);
      } else {
        console.warn(`[AuthRoutes] Default 'Free' tier not found for new user ${publicUser?.id} or user ID was null after registration.`);
      }
      return res.status(201).json({
        user: publicUser,
        message: 'User registered successfully. Please check your email for a verification link to activate your account.'
      });
    } catch (error) {
      return next(error); // Delegate to centralized error handler
    }
  });

  // --- Email/Password Login ---
  /**
   * @route POST /api/v1/auth/login
   * @description Authenticates an existing user using their identifier (username or email) and password.
   * On successful authentication, it issues a JWT and creates a user session record.
   * The JWT is set as an HttpOnly cookie to mitigate XSS risks.
   * @access Public
   * @body {LoginUserDto} Requires `identifier` (username or email) and `password`. Optionally accepts `rememberMe` (boolean) to extend cookie persistence.
   * @response {200} OK - Login successful. Returns `PublicUser` data and `tokenExpiresAt`. Sets an `authToken` HttpOnly cookie.
   * @response {400} Bad Request - If `identifier` or `password` are missing. See `GMIErrorCode.VALIDATION_ERROR`.
   * @response {401} Unauthorized - If credentials are invalid. See `GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS`.
   * @response {403} Forbidden - If email verification is required and not completed. See `GMIErrorCode.AUTHENTICATION_EMAIL_NOT_VERIFIED`.
   * @response {500} Internal Server Error - For unexpected server issues during login. See `GMIErrorCode.INTERNAL_SERVER_ERROR`.
   */
  router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, password, rememberMe = false } = req.body as LoginUserDto; // Default rememberMe to false
    if (!identifier || !password) {
      return next(ErrorFactory.validation('Both username/email (identifier) and password are required.'));
    }

    try {
      const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
      const ipAddress = req.ip; // Note: Ensure Express 'trust proxy' is configured if behind a reverse proxy.
      const authResult: AuthenticationResult = await authService.loginUser(identifier, password, deviceInfo, ipAddress);

      res.cookie('authToken', authResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        maxAge: rememberMe ? (authResult.tokenExpiresAt.getTime() - Date.now()) : undefined, // Persistent if rememberMe, session-only otherwise
        sameSite: 'lax', // Good balance for CSRF protection
        path: '/',
      });

      return res.status(200).json({
        user: authResult.user,
        tokenExpiresAt: authResult.tokenExpiresAt, // Useful for client to know session duration
        message: 'Login successful.'
      });
    } catch (error) {
      return next(error);
    }
  });

  // --- Google OAuth Routes ---
  /**
   * @route GET /api/v1/auth/google
   * @description Initiates the Google OAuth 2.0 authentication flow.
   * This endpoint generates the Google authorization URL (consent screen) and redirects the user's browser to it.
   * @access Public
   * @response {302} Found - Redirects the client to Google's OAuth consent screen.
   * @response {500} Internal Server Error or {503} Service Unavailable - If Google OAuth is not configured server-side or if there's an issue generating the URL. Relevant `GMIErrorCode` will be provided.
   */
  router.get('/google', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { redirectUrl }: OAuthInitiateResult = await authService.initiateGoogleOAuth();
      res.redirect(redirectUrl); // HTTP 302 Redirect
    } catch (error) {
      console.error('[AuthRoutes] /google - Error initiating Google OAuth flow:', error);
      return next(error);
    }
  });

  /**
   * @route GET /api/v1/auth/google/callback
   * @description Handles the callback from Google after a user attempts OAuth authentication.
   * It exchanges the received authorization `code` for Google tokens, verifies the ID token,
   * retrieves user information from Google, and then either finds an existing local user account
   * (by matching Google ID or email) or creates a new local user account. The Google identity is
   * linked to this local user. Finally, a local application-specific session JWT is issued (via HttpOnly cookie).
   * @access Public
   * @query {string} code - The authorization code provided by Google upon successful user authentication and consent.
   * @query {string} [state] - Optional: The state parameter, if one was included in the initial authorization request (for CSRF protection or context). Not explicitly used in this basic flow but good to be aware of.
   * @query {string} [error] - Optional: An error code provided by Google if the authentication failed at Google's end (e.g., "access_denied").
   * @query {string} [error_description] - Optional: A human-readable description of the error from Google.
   * @response {200} OK - Google OAuth successful, and the user is logged into the application. Returns `PublicUser` data and `tokenExpiresAt`. Sets an `authToken` HttpOnly cookie.
   * Alternatively, this endpoint might redirect to a frontend URL (e.g., `/oauth-success`) which then fetches user data.
   * @response {400} Bad Request - If the `code` is missing or an `error` is returned from Google. See `GMIErrorCode.OAUTH_MISSING_AUTH_CODE` or `GMIErrorCode.OAUTH_AUTHENTICATION_FAILED`.
   * @response {500} Internal Server Error - If there's an issue processing the callback on the server-side (e.g., token exchange failure, database error). See `GMIErrorCode.OAUTH_AUTHENTICATION_FAILED` or `GMIErrorCode.INTERNAL_SERVER_ERROR`.
   */
  router.get('/google/callback', async (req: Request, res: Response, next: NextFunction) => {
    const { code, error: oauthProviderError, error_description: oauthProviderErrorDescription } = req.query;

    if (oauthProviderError) {
      // An error occurred at the OAuth provider (e.g., user denied consent)
      return next(ErrorFactory.authentication(
        `Google OAuth authentication failed at provider: ${oauthProviderError} (${oauthProviderErrorDescription || 'No additional description provided.'})`,
        { provider: 'google', providerErrorCode: oauthProviderError as string },
        GMIErrorCode.OAUTH_AUTHENTICATION_FAILED
      ));
    }

    if (!code || typeof code !== 'string') {
      return next(ErrorFactory.authentication(
        'Google OAuth callback is missing the required authorization code.',
        { provider: 'google' },
        GMIErrorCode.OAUTH_MISSING_AUTH_CODE
      ));
    }

    try {
      const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
      const ipAddress = req.ip;
      const authResult: AuthenticationResult = await authService.handleGoogleOAuthCallback(code, deviceInfo, ipAddress);

      res.cookie('authToken', authResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: authResult.tokenExpiresAt.getTime() - Date.now(), // Cookie lifetime matches JWT expiry
        sameSite: 'lax',
        path: '/',
      });

      // Option: Redirect to a frontend page that handles post-OAuth logic
      // (e.g., closes a popup, navigates to dashboard, fetches user data via /me).
      // This is often preferred for Single Page Applications.
      // Example: return res.redirect(`${process.env.FRONTEND_URL}/auth/oauth/success`);

      // For now, returning JSON consistent with the password login flow for API-based clients:
      return res.status(200).json({
        user: authResult.user,
        tokenExpiresAt: authResult.tokenExpiresAt,
        message: 'Google OAuth authentication successful. User is now logged in.',
      });

    } catch (error) {
      console.error('[AuthRoutes] /google/callback - Error processing Google OAuth callback in backend:', error);
      // Handle errors that occur during backend processing of the callback (e.g., token exchange, user creation)
      // A redirect to a frontend error page can be more user-friendly here.
      // Example:
      // const clientErrorCode = (error instanceof GMIError) ? error.code : GMIErrorCode.OAUTH_AUTHENTICATION_FAILED;
      // return res.redirect(`${process.env.FRONTEND_URL}/auth/oauth/error?code=${encodeURIComponent(clientErrorCode)}`);
      return next(error); // Let the global error handler provide a structured JSON error response
    }
  });


  // --- Logout ---
  /**
   * @route POST /api/v1/auth/logout
   * @description Logs out the currently authenticated user by invalidating their server-side session
   * and instructing the client to clear any stored authentication tokens (e.g., by clearing the HttpOnly cookie).
   * @access Protected (Requires a valid JWT via `authenticateToken` middleware)
   * @response {200} OK - Logout successful. Includes a confirmation message.
   * @response {401} Unauthorized - If no valid authentication token is provided (should be handled by middleware, but included for completeness).
   * @response {500} Internal Server Error - If an unexpected error occurs during server-side session invalidation.
   */
  router.post('/logout', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // `authenticateToken` middleware ensures `req.user` is populated if token is valid.
    // The token used by the middleware is what needs to be associated with the session to invalidate.
    const tokenToInvalidate = req.headers.authorization?.split(' ')[1] || req.cookies?.authToken;

    if (!tokenToInvalidate) {
      // This case should ideally not be reached if `authenticateToken` middleware is correctly applied and functioning.
      return next(ErrorFactory.authentication('No active session token found for logout. This should not happen if route is protected.', {}, GMIErrorCode.AUTHENTICATION_TOKEN_MISSING));
    }

    try {
      await authService.logoutUser(tokenToInvalidate); // Pass the actual JWT string for session invalidation
      // Instruct client to clear the HttpOnly cookie
      res.clearCookie('authToken', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return res.status(200).json({ message: 'Logout successful. Your session has been terminated.' });
    } catch (error) {
      // Even if server-side invalidation has an issue, client should still clear its token.
      // The error here is primarily for server logging.
      return next(error);
    }
  });

  // --- Email Verification ---
  /**
   * @route POST /api/v1/auth/verify-email
   * @description Verifies a user's email address using a provided verification token.
   * This is typically called when a user clicks a verification link sent to their email.
   * @access Public
   * @body {VerifyEmailDto} Requires `verificationToken`.
   * @response {200} OK - Email verified successfully. User can now log in (if verification was a prerequisite).
   * @response {400} Bad Request - If the `verificationToken` is missing, malformed, invalid, or expired. See `GMIErrorCode.VALIDATION_ERROR` or `GMIErrorCode.EMAIL_VERIFICATION_TOKEN_INVALID`.
   * @response {500} Internal Server Error - For unexpected server issues during the verification process.
   */
  router.post('/verify-email', async (req: Request, res: Response, next: NextFunction) => {
    const { verificationToken } = req.body as VerifyEmailDto;
    if (!verificationToken || typeof verificationToken !== 'string') {
      return next(ErrorFactory.validation('A valid email verification token is required.'));
    }

    try {
      await authService.verifyEmail(verificationToken); // This method was added to IAuthService/AuthService
      return res.status(200).json({ message: 'Email verified successfully. Your account is now active.' });
    } catch (error) {
      // If error is GMIError and specifically EMAIL_VERIFICATION_TOKEN_INVALID, use that.
      if (error instanceof GMIError && error.code === GMIErrorCode.EMAIL_VERIFICATION_TOKEN_INVALID) {
        // The ErrorFactory.validation doesn't take a GMIErrorCode as a third parameter.
        // We should pass the original GMIError to next() to preserve its code and status.
        return next(error);
      }
      return next(error); // For other types of errors.
    }
  });


  // --- Protected Routes (all routes below require a valid JWT via `authenticateToken` middleware) ---
  // The middleware is applied once here for all subsequent route definitions in this router instance.
  router.use(authenticateToken(authService));

  /**
   * @route GET /api/v1/auth/me
   * @description Retrieves the profile (PublicUser) and current subscription tier of the authenticated user.
   * @access Protected
   * @response {200} OK - Returns an object containing `user` (`PublicUser` data) and `tier` (`ISubscriptionTier` data or null).
   * @response {404} Not Found - If the authenticated user's profile cannot be found in the database (e.g., data inconsistency). See `GMIErrorCode.USER_NOT_FOUND`.
   * @response {500} Internal Server Error - For other unexpected server issues.
   */
  router.get('/me', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.userId; // `req.user` is guaranteed by `authenticateToken`
    try {
      const publicUser = await authService.getPublicUserById(userId);
      if (!publicUser) {
        // This scenario (valid token but user not found) indicates a data integrity issue or a race condition post-deletion.
        return next(ErrorFactory.notFound(`Authenticated user profile for ID ${userId} could not be retrieved. The account may have been recently deactivated.`, { userId }));
      }
      const tier: ISubscriptionTier | null = await authService.getUserSubscriptionTier(userId);
      return res.status(200).json({ user: publicUser, tier });
    } catch (error) {
      return next(error);
    }
  });

  /**
   * @route PUT /api/v1/auth/me
   * @description Updates the profile (e.g., username, email) of the currently authenticated user.
   * If the email address is changed, it typically triggers a re-verification process for the new email.
   * @access Protected
   * @body {UserProfileUpdateData} An object containing the fields to update (e.g., `username`, `email`). At least one field must be provided.
   * @response {200} OK - Profile updated successfully. Returns the updated `PublicUser` object and a success message.
   * @response {400} Bad Request - If no update data is provided, or if validation fails for provided fields (e.g., invalid email format, username too short/long or already taken). See `GMIErrorCode.VALIDATION_ERROR`.
   * @response {409} Conflict - If the new username or email is already in use by another account. See `GMIErrorCode.REGISTRATION_USERNAME_EXISTS` or `GMIErrorCode.REGISTRATION_EMAIL_EXISTS`.
   * @response {500} Internal Server Error - For unexpected server issues during the update.
   */
  router.put('/me', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const updateData = req.body as UserProfileUpdateData; // Type assertion for request body
    const userId = req.user!.userId;

    if (Object.keys(updateData).length === 0 || (updateData.username === undefined && updateData.email === undefined)) {
      return next(ErrorFactory.validation('No update data provided. At least one field (e.g., username, email) must be specified for update.'));
    }
    // More specific validation (e.g., username length, email format) should be handled by the AuthService.updateUserProfile method.

    try {
      const updatedUser: PublicUser = await authService.updateUserProfile(userId, updateData);
      return res.status(200).json({ user: updatedUser, message: 'User profile updated successfully.' });
    } catch (error) {
      return next(error);
    }
  });

  /**
   * @route POST /api/v1/auth/me/change-password
   * @description Allows the currently authenticated user to change their password.
   * Requires the user's current (old) password for verification before setting the new password.
   * @access Protected
   * @body {ChangePasswordDto} Requires `oldPassword` and `newPassword`. New password must meet complexity requirements (e.g., min 8 characters).
   * @response {200} OK - Password changed successfully.
   * @response {400} Bad Request - If required fields are missing or the new password is too weak. See `GMIErrorCode.VALIDATION_ERROR`.
   * @response {401} Unauthorized - If the provided `oldPassword` is incorrect. See `GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS`.
   * @response {500} Internal Server Error - For unexpected server issues.
   */
  router.post('/me/change-password', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body as ChangePasswordDto;
    const userId = req.user!.userId;

    if (!oldPassword || !newPassword) {
      return next(ErrorFactory.validation('Both old password and new password are required fields.'));
    }
    if (newPassword.length < 8) { // Consistent password length validation with registration
      return next(ErrorFactory.validation('New password must be at least 8 characters long.'));
    }

    try {
      await authService.changePassword(userId, oldPassword, newPassword);
      return res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
      return next(error);
    }
  });


  // --- User API Key Management (Protected) ---
  /**
   * @route POST /api/v1/auth/me/api-keys
   * @description Adds a new API key for the authenticated user, associated with a specific LLM provider.
   * The API key value is encrypted before storage.
   * @access Protected
   * @body {UserApiKeyDto} Requires `providerId` and `apiKey`. Optional `keyName` for labeling the key.
   * @response {201} Created - API key saved successfully. Returns `UserApiKeyInfo` (with masked key) and a success message.
   * @response {400} Bad Request - Missing required fields or invalid `providerId`. See `GMIErrorCode.VALIDATION_ERROR`.
   * @response {500} Internal Server Error - If encryption fails or due to other server issues. See `GMIErrorCode.CONFIGURATION_ERROR` or `GMIErrorCode.INTERNAL_SERVER_ERROR`.
   */
  router.post('/me/api-keys', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { providerId, apiKey, keyName } = req.body as UserApiKeyDto;
    const userId = req.user!.userId;

    if (!providerId || !apiKey) {
      return next(ErrorFactory.validation('Both providerId and apiKey value are required.'));
    }
    // Consider adding validation for `providerId` against a list of known/supported providers if applicable.

    try {
      const apiKeyInfo: UserApiKeyInfo = await authService.saveUserApiKey(userId, providerId, apiKey, keyName);
      return res.status(201).json({
        apiKey: apiKeyInfo, // Contains maskedKeyPreview, id, providerId, keyName, etc.
        message: 'API key saved successfully.'
      });
    } catch (error) {
      return next(error);
    }
  });

  /**
   * @route GET /api/v1/auth/me/api-keys
   * @description Retrieves a list of all API keys registered by the currently authenticated user.
   * Returns `UserApiKeyInfo` objects, which include masked previews, not the actual keys.
   * @access Protected
   * @response {200} OK - Returns an object containing an array of `apiKeys` (`UserApiKeyInfo[]`).
   * @response {500} Internal Server Error.
   */
  router.get('/me/api-keys', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    try {
      const apiKeys: UserApiKeyInfo[] = await authService.getUserApiKeys(userId);
      return res.status(200).json({ apiKeys });
    } catch (error) {
      return next(error);
    }
  });

  /**
   * @route DELETE /api/v1/auth/me/api-keys/:apiKeyRecordId
   * @description Deletes a specific API key record owned by the authenticated user.
   * The `apiKeyRecordId` is the UUID of the `UserApiKey` database record.
   * @access Protected
   * @param {string} apiKeyRecordId - The UUID of the API key record to delete, passed as a URL parameter.
   * @response {200} OK - API key deleted successfully. Includes a confirmation message. (Alternatively, 204 No Content).
   * @response {400} Bad Request - If `apiKeyRecordId` is missing or malformed. See `GMIErrorCode.VALIDATION_ERROR`.
   * @response {404} Not Found - If the API key record is not found or not owned by the authenticated user. See `GMIErrorCode.RESOURCE_NOT_FOUND`.
   * @response {500} Internal Server Error.
   */
  router.delete('/me/api-keys/:apiKeyRecordId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    const { apiKeyRecordId } = req.params;

    if (!apiKeyRecordId) { // Basic check; further validation (e.g., UUID format) could be added.
      return next(ErrorFactory.validation('API key record ID (apiKeyRecordId) path parameter is required.'));
    }

    try {
      await authService.deleteUserApiKey(userId, apiKeyRecordId);
      return res.status(200).json({ message: 'API key deleted successfully.' });
      // Or, for a typical DELETE success with no content to return:
      // return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });


  // --- Subscription Info (Protected) ---
  /**
   * @route GET /api/v1/auth/me/subscription
   * @description Retrieves the current subscription tier details and relevant usage statistics for the authenticated user.
   * @access Protected
   * @response {200} OK - Returns an object containing `tier` (`ISubscriptionTier` or null) and `usage` (user-specific usage statistics object).
   * @response {500} Internal Server Error.
   */
  router.get('/me/subscription', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.userId;
    try {
      const tier: ISubscriptionTier | null = await authService.getUserSubscriptionTier(userId);
      // `getUserUsageStats` would be part of ISubscriptionService contract
      const usageStats = await subscriptionService.getUserUsageStats(userId);
      return res.status(200).json({
        tier,
        usage: usageStats, // Structure of usageStats depends on ISubscriptionService.getUserUsageStats()
        message: tier ? `Current subscription tier: ${tier.name}` : 'No active subscription found or user is on a default plan.'
      });
    } catch (error) {
      return next(error);
    }
  });


  // --- Admin Routes (Example - Require 'ADMIN' role, checked within handler) ---
  // These routes demonstrate administrative actions and should have robust role-based authorization.

  /**
   * @route POST /api/v1/auth/admin/assign-tier
   * @description (Admin Only) Assigns a specified subscription tier to a target user.
   * Requires the caller to have an 'ADMIN' role.
   * @access Protected (Admin)
   * @body {AssignTierDto} Requires `newTierId`. Optionally `userId` if admin is assigning to another user; otherwise, defaults to authenticated admin's own ID (less common for this action).
   * @response {200} OK - Tier assigned successfully. Returns the updated `PublicUser` and their new `ISubscriptionTier`.
   * @response {400} Bad Request - Missing `userId` (if admin context) or `newTierId`. See `GMIErrorCode.VALIDATION_ERROR`.
   * @response {403} Forbidden - If the authenticated user is not an admin. See `GMIErrorCode.PERMISSION_DENIED`.
   * @response {404} Not Found - If the target `userId` or `newTierId` does not exist. See `GMIErrorCode.USER_NOT_FOUND` or `GMIErrorCode.RESOURCE_NOT_FOUND`.
   * @response {500} Internal Server Error.
   */
  router.post('/admin/assign-tier', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Robust role check from JWT payload (assuming roles are part of AuthTokenPayload)
    if (!req.user?.roles?.includes('ADMIN')) {
      return next(ErrorFactory.permissionDenied('Administrative privileges are required to assign subscription tiers.'));
    }

    const { userId: targetUserIdParam, newTierId } = req.body as AssignTierDto;
    // Admin must specify the target user ID for this operation.
    if (!targetUserIdParam || typeof targetUserIdParam !== 'string') {
      return next(ErrorFactory.validation('Target User ID (userId) is required for tier assignment by an administrator.'));
    }
    if (!newTierId || typeof newTierId !== 'string') {
      return next(ErrorFactory.validation('New Tier ID (newTierId) is required.'));
    }

    try {
      // `assignTierToUser` is part of ISubscriptionService
      const updatedPrismaUser: PrismaUser = await subscriptionService.assignTierToUser(targetUserIdParam, newTierId);
      // Convert PrismaUser to PublicUser for response. Assuming `authService` can do this or `DomainUser` class is used.
      const publicUser: PublicUser = (authService as any).toPublicUser?.(updatedPrismaUser) || DomainUser.fromPrisma(updatedPrismaUser).toPublicUser();
      const newTierDetails = await authService.getUserSubscriptionTier(targetUserIdParam);

      return res.status(200).json({
        message: `Subscription tier '${newTierDetails?.name || newTierId}' successfully assigned to user ${targetUserIdParam}.`,
        user: publicUser,
        tier: newTierDetails
      });
    } catch (error) {
      return next(error);
    }
  });

  /**
   * @route GET /api/v1/auth/admin/users
   * @description (Admin Only) Lists all users in the system. Requires ADMIN role.
   * This is a placeholder; a full implementation would include pagination, filtering, and sorting.
   * @access Protected (Admin)
   * @query {number} [page=1] - Page number for pagination.
   * @query {number} [limit=20] - Number of users per page.
   * @query {string} [search] - Search term for filtering users.
   * @response {501} Not Implemented - Indicates the feature is planned but not yet available.
   * @response {403} Forbidden - If the authenticated user is not an admin. See `GMIErrorCode.PERMISSION_DENIED`.
   */
  router.get('/admin/users', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.roles?.includes('ADMIN')) {
      return next(ErrorFactory.permissionDenied('Administrative privileges required to list users.'));
    }
    // TODO: Implement robust user listing logic in AuthService or a dedicated UserService.
    // This would involve querying users with pagination, search, and sorting.
    // Example:
    // const { page = 1, limit = 20, search = '' } = req.query;
    // const usersListResult = await authService.listAllUsers({ page: +page, limit: +limit, search: search as string });
    // return res.status(200).json(usersListResult);
    return next(new GMIError('Admin user listing feature is not yet implemented.', GMIErrorCode.NOT_IMPLEMENTED, undefined, undefined, 501));
  });


  // --- Publicly Accessible Routes for Tier Information (No Auth Middleware directly on this specific route) ---
  // These are defined outside the `router.use(authenticateToken(authService));` block if it were placed earlier to protect all subsequent routes.
  // If this route itself does not need authentication, it should be defined before any `router.use(authenticateToken)`.
  // Given the current structure where `authenticateToken` is applied to individual routes or route groups,
  // this route is effectively public unless `authenticateToken` is applied to it specifically or to a parent router.

  /**
   * @route GET /api/v1/auth/tiers
   * @description Retrieves a list of all publicly available subscription tiers.
   * This might be used for a pricing page or for users to see available upgrade options.
   * @access Public (or protected, depending on application requirements for viewing tiers)
   * @response {200} OK - Returns an array of `ISubscriptionTier` objects.
   * @response {500} Internal Server Error - If an error occurs while fetching tiers.
   */
  router.get('/tiers', async (req: Request, res: Response, next: NextFunction) => {
    // If this route needs to be protected (e.g., only logged-in users can see tiers),
    // apply `authenticateToken(authService)` middleware here.
    // For a public pricing page, it might remain unprotected.
    try {
      // `getAllTiers` might filter for only publicly visible tiers if such a distinction exists.
      const tiers: ISubscriptionTier[] = await subscriptionService.getAllTiers();
      return res.status(200).json({ tiers });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};