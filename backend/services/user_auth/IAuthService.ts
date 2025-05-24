/**
 * @file backend/services/user_auth/IAuthService.ts
 * @module backend/services/user_auth/IAuthService
 * @version 1.2.1 - Enhanced JSDoc and method descriptions.
 *
 * @description
 * This module defines the interface (`IAuthService`) for the Authentication Service.
 * It outlines the contract for managing all aspects of user identity, including:
 * - Email/password registration and login.
 * - OAuth 2.0 authentication flows (e.g., with Google).
 * - Secure session management using JSON Web Tokens (JWTs).
 * - Password change and reset functionalities.
 * - Email verification processes.
 * - User profile updates.
 * - Management of user-provided API keys for external services.
 * - Retrieval of user and subscription information.
 *
 * Implementations of this interface are central to the application's security and user management capabilities.
 *
 * Key Dependencies: `@prisma/client` for Prisma-generated types, local type definitions from `./User` and `./SubscriptionTier`.
 */

import {
  User as PrismaUser,
  UserApiKey as PrismaUserApiKey,
  UserSession as PrismaUserSession,
  // Account as PrismaAccount, // Used by AuthService implementation, not directly exposed in IAuthService method signatures
} from '@prisma/client';
import { PublicUser } from './User';
import { ISubscriptionTier } from './SubscriptionTier';

/**
 * @interface AuthTokenPayload
 * @description Represents the payload typically encoded within a JSON Web Token (JWT).
 * This data is embedded in the token and used to identify the user and session upon successful validation.
 *
 * @property {string} userId - The unique identifier (UUID) of the authenticated user.
 * @property {string} username - The username of the authenticated user.
 * @property {string} sessionId - The unique identifier for this specific user session, linking the JWT to a session record in the database.
 * @property {string[]} [roles] - Optional: An array of strings representing user roles (e.g., "ADMIN", "USER") for implementing Role-Based Access Control (RBAC).
 * @property {Record<string, any>} [claims] - Optional: A record for any custom claims or additional non-standard data to be included in the JWT payload.
 */
export interface AuthTokenPayload {
  userId: string;
  username: string;
  sessionId: string;
  roles?: string[];
  claims?: Record<string, any>;
}

/**
 * @interface AuthenticationResult
 * @description Represents the structured result of a successful authentication attempt (e.g., via credentials or OAuth).
 * It includes the user's public information, the generated session token (JWT), details about the token's expiry, and the created session record.
 *
 * @property {PublicUser} user - The public representation of the authenticated user, excluding sensitive information like password hashes.
 * @property {string} token - The JSON Web Token (JWT) generated for the user's session, to be used for authenticating subsequent API requests.
 * @property {Date} tokenExpiresAt - The exact date and time when the JWT will expire. Clients can use this for proactive token refresh or session management.
 * @property {PrismaUserSession} session - The database record for the created user session, containing details like session ID, device info, and expiry.
 */
export interface AuthenticationResult {
  user: PublicUser;
  token: string;
  tokenExpiresAt: Date;
  session: PrismaUserSession;
}

/**
 * @interface UserApiKeyInfo
 * @description Represents a user-provided API key for an external LLM provider, detailing its properties and status.
 * This interface is used for displaying API key information to the user without exposing the actual encrypted key itself.
 *
 * @property {string} id - The unique database ID of the API key record.
 * @property {string} providerId - The identifier of the LLM provider (e.g., "openai", "anthropic", "openrouter").
 * @property {string | null} [keyName] - An optional, user-friendly name or label assigned by the user to this API key for easier identification.
 * @property {boolean} isActive - Indicates whether the API key is currently active and usable by the system for making requests to the provider.
 * @property {Date} createdAt - Timestamp indicating when the API key record was initially created.
 * @property {Date} updatedAt - Timestamp indicating the last time the API key record was updated (e.g., key value changed, status changed).
 * @property {string} [maskedKeyPreview] - An optional masked preview of the API key (e.g., "sk-xxxx...xxxx") for display purposes, helping users identify the key without revealing its full value.
 */
export interface UserApiKeyInfo {
  id: string;
  providerId: string;
  keyName?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  maskedKeyPreview?: string;
}

/**
 * @interface OAuthInitiateResult
 * @description Represents the information returned after successfully initiating an OAuth 2.0 authentication flow.
 * It primarily contains the URL to which the user's browser should be redirected to authenticate with the OAuth provider.
 *
 * @property {string} redirectUrl - The URL of the OAuth provider's authorization server (consent screen or login page). The user will be sent here to grant permissions.
 */
export interface OAuthInitiateResult {
  redirectUrl: string;
}

/**
 * @interface UserProfileUpdateData
 * @description Defines the structure for data used to update a user's profile.
 * Only includes fields that are typically updatable by the user.
 *
 * @property {string} [username] - The new username, if the user intends to change it. Subject to uniqueness constraints.
 * @property {string} [email] - The new email address, if the user intends to change it. Changing email typically requires re-verification.
 * @property {string} [fullName] - Optional: The user's full name, if this field is part of the profile.
 * @property {string} [profilePictureUrl] - Optional: A URL to the user's new profile picture.
 * @property {Record<string, any>} [preferences] - Optional: User-specific preferences or settings.
 */
export interface UserProfileUpdateData {
  username?: string;
  email?: string;
  // Example additional fields:
  // fullName?: string;
  // profilePictureUrl?: string;
  // preferences?: Record<string, any>;
}


/**
 * @interface IAuthService
 * @description Defines the comprehensive contract for the Authentication Service.
 * Implementations of this interface are responsible for managing all aspects of user authentication,
 * authorization, session handling, and related data persistence with the highest standards of security and SOTA practices.
 */
export interface IAuthService {
  /**
   * Initializes the Authentication Service. This method is crucial for setting up necessary configurations
   * such as JWT secrets, API key encryption parameters, and OAuth client credentials. It should be called
   * once at application startup to ensure the service is fully operational. The configuration can be sourced
   * from environment variables or a direct configuration object. Failure to initialize correctly with secure
   * parameters can lead to security vulnerabilities.
   *
   * @async
   * @method initialize
   * @param {object} [config] - Optional configuration object for the authentication service.
   * @param {string} [config.jwtSecret] - The secret key for signing and verifying JWTs. Must be strong and unique. Defaults to `process.env.JWT_SECRET`.
   * @param {string} [config.jwtExpiresIn] - The validity duration for JWTs (e.g., "7d", "24h"). Defaults to `process.env.JWT_EXPIRES_IN`.
   * @param {string} [config.apiKeyEncryptionKeyHex] - A 32-byte (64-character) HEX-encoded key for AES-256 encryption of user-provided API keys. Defaults to `process.env.API_KEY_ENCRYPTION_KEY_HEX`.
   * @param {string} [config.googleClientId] - Client ID for Google OAuth 2.0 integration. Defaults to `process.env.GOOGLE_CLIENT_ID`.
   * @param {string} [config.googleClientSecret] - Client Secret for Google OAuth 2.0. Defaults to `process.env.GOOGLE_CLIENT_SECRET`.
   * @param {string} [config.googleCallbackUrl] - The registered callback URL for Google OAuth 2.0. Defaults to `process.env.GOOGLE_CALLBACK_URL`.
   * @returns {Promise<void>} A promise that resolves when the service has been successfully initialized.
   * @throws {GMIError} If critical configuration parameters (e.g., `JWT_SECRET` in a production environment) are missing, malformed, or insecure.
   *
   * @example
   * // In server.ts, during application startup:
   * // await authService.initialize({
   * //   jwtSecret: process.env.JWT_SECRET,
   * //   googleClientId: process.env.GOOGLE_CLIENT_ID,
   * //   // ... other config from env
   * // });
   */
  initialize?(config?: {
    jwtSecret?: string;
    jwtExpiresIn?: string;
    apiKeyEncryptionKeyHex?: string;
    googleClientId?: string;
    googleClientSecret?: string;
    googleCallbackUrl?: string;
  }): Promise<void>;

  // --- Email/Password Authentication ---

  /**
   * Registers a new user with the provided username, email, and password.
   * This method handles input validation (e.g., username/email uniqueness, password strength),
   * securely hashes the password, and persists the new user to the database.
   * It should also initiate an email verification process by generating a token and (conceptually) sending a verification email.
   *
   * @async
   * @method registerUser
   * @param {string} username - The desired username. Must be unique and adhere to naming policies.
   * @param {string} email - The user's email address. Must be unique and valid.
   * @param {string} password - The user's plain-text password. It will be securely hashed before storage.
   * @returns {Promise<PublicUser>} A promise that resolves with the publicly safe representation of the newly created user.
   * @throws {GMIError} If validation fails (e.g., `GMIErrorCode.VALIDATION_ERROR` for weak password, `GMIErrorCode.REGISTRATION_USERNAME_EXISTS`, `GMIErrorCode.REGISTRATION_EMAIL_EXISTS`) or if a database error occurs.
   *
   * @example
   * try {
   * const newUser = await authService.registerUser('new_user', 'user@example.com', 'SecureP@sswOrd1');
   * console.log('User registered:', newUser.id);
   * } catch (error) {
   * // Handle GMIError, e.g., display error.getUserFriendlyMessage()
   * }
   */
  registerUser(username: string, email: string, password: string): Promise<PublicUser>;

  /**
   * Authenticates an existing user based on their identifier (username or email) and password.
   * Verifies credentials against stored hashes. If successful, and other criteria like email verification are met (if enforced),
   * it creates a new user session and issues a JWT.
   *
   * @async
   * @method loginUser
   * @param {string} identifier - The user's username or email address.
   * @param {string} password - The user's plain-text password.
   * @param {string} [deviceInfo] - Optional: Information about the client device (e.g., User-Agent) for session auditing and security.
   * @param {string} [ipAddress] - Optional: The IP address of the client making the login request, for security logging and session auditing.
   * @returns {Promise<AuthenticationResult>} A promise that resolves with an object containing the user's public data, the JWT, token expiration time, and session details.
   * @throws {GMIError} If authentication fails (e.g., `GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS`, `GMIErrorCode.USER_NOT_FOUND`, `GMIErrorCode.AUTHENTICATION_EMAIL_NOT_VERIFIED`).
   */
  loginUser(identifier: string, password: string, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult>;

  /**
   * Invalidates the user's current session associated with the provided JWT.
   * This usually involves marking the corresponding session record in the database as inactive or expired.
   * The client is then responsible for discarding the JWT.
   *
   * @async
   * @method logoutUser
   * @param {string} token - The JWT of the session to be terminated.
   * @returns {Promise<void>} A promise that resolves when the logout process on the server-side is complete.
   * @throws {GMIError} (Typically not thrown to client, but logged) If the token is invalid or the session cannot be updated.
   */
  logoutUser(token: string): Promise<void>;

  /**
   * Validates a JWT. It checks the token's signature, expiration, and ensures that the
   * session it refers to is still active and valid in the database.
   *
   * @async
   * @method validateToken
   * @param {string} token - The JWT to be validated.
   * @returns {Promise<AuthTokenPayload | null>} A promise that resolves with the decoded `AuthTokenPayload` if the token is valid and the session is active; otherwise, resolves to `null`.
   */
  validateToken(token: string): Promise<AuthTokenPayload | null>;

  /**
   * Allows an authenticated user to change their password. Requires verification of the current (old) password.
   * The new password must meet defined complexity/strength requirements.
   *
   * @async
   * @method changePassword
   * @param {string} userId - The ID of the user whose password is being changed.
   * @param {string} oldPassword - The user's current plain-text password, for verification.
   * @param {string} newPassword - The new plain-text password to be set.
   * @returns {Promise<void>} A promise that resolves when the password has been successfully updated.
   * @throws {GMIError} If the user is not found (`GMIErrorCode.USER_NOT_FOUND`), `oldPassword` is incorrect (`GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS`), or `newPassword` is invalid (`GMIErrorCode.VALIDATION_ERROR`).
   */
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;

  /**
   * Initiates the password reset process for a user who has forgotten their password.
   * Generates a secure, time-limited reset token, associates it with the user's account,
   * and (conceptually) triggers an email containing a password reset link with this token.
   *
   * @async
   * @method requestPasswordReset
   * @param {string} email - The email address of the user requesting the password reset.
   * @returns {Promise<{ resetToken: string }>} A promise that resolves with an object containing the generated `resetToken`.
   * **Note:** In a production environment, this token should *not* be returned in the API response but sent via a secure channel (email).
   * Returning it here might be for development/testing or specific internal workflows.
   * @throws {GMIError} If no user account is found with the provided email (`GMIErrorCode.USER_NOT_FOUND`) or if there's an issue generating or storing the token.
   */
  requestPasswordReset(email: string): Promise<{ resetToken: string }>;

  /**
   * Completes the password reset process using a valid reset token provided by the user and their desired new password.
   * This method verifies the token's validity and expiration, updates the user's password to the new one (after hashing),
   * and invalidates the used reset token.
   *
   * @async
   * @method resetPassword
   * @param {string} resetToken - The password reset token received by the user (typically from a password reset email).
   * @param {string} newPassword - The new plain-text password to set. Must meet complexity requirements.
   * @returns {Promise<void>} A promise that resolves when the password has been successfully reset.
   * @throws {GMIError} If the `resetToken` is invalid or expired (`GMIErrorCode.PASSWORD_RESET_TOKEN_INVALID`), or if the `newPassword` is weak (`GMIErrorCode.VALIDATION_ERROR`).
   */
  resetPassword(resetToken: string, newPassword: string): Promise<void>;

  /**
   * Verifies a user's email address using a unique verification token.
   * This method typically finds the user associated with the token, marks their email as verified,
   * and invalidates the token to prevent reuse.
   *
   * @async
   * @method verifyEmail
   * @param {string} verificationToken - The verification token sent to the user's email address upon registration or email change.
   * @returns {Promise<PrismaUser>} A promise that resolves to the `PrismaUser` object whose email has been verified.
   * @throws {GMIError} If the `verificationToken` is invalid, expired, or no user is found associated with it (`GMIErrorCode.EMAIL_VERIFICATION_TOKEN_INVALID`).
   */
  verifyEmail(verificationToken: string): Promise<PrismaUser>;


  // --- User Management ---

  /**
   * Retrieves the complete user object from the database by their unique ID.
   * This includes all fields, including potentially sensitive ones like `passwordHash`.
   * Primarily intended for internal service-to-service communication or administrative purposes
   * where the full user entity is required.
   *
   * @async
   * @method getUserById
   * @param {string} userId - The unique identifier (UUID) of the user to retrieve.
   * @returns {Promise<PrismaUser | null>} A promise that resolves with the full `PrismaUser` object if found, or `null` if no user exists with that ID.
   */
  getUserById(userId: string): Promise<PrismaUser | null>;

  /**
   * Retrieves a publicly safe representation of a user by their unique ID.
   * Excludes sensitive information like password hashes and internal tokens.
   * Suitable for returning user information in general API responses.
   *
   * @async
   * @method getPublicUserById
   * @param {string} userId - The unique identifier (UUID) of the user.
   * @returns {Promise<PublicUser | null>} A promise that resolves with the `PublicUser` object if found, or `null` otherwise.
   */
  getPublicUserById(userId: string): Promise<PublicUser | null>;

  /**
   * Retrieves the complete user object by their username.
   * Username lookups should ideally be case-insensitive or follow a defined normalization strategy.
   *
   * @async
   * @method getUserByUsername
   * @param {string} username - The username of the user to retrieve.
   * @returns {Promise<PrismaUser | null>} A promise that resolves with the full `PrismaUser` object if found, or `null` otherwise.
   */
  getUserByUsername(username: string): Promise<PrismaUser | null>;

  /**
   * Retrieves the complete user object by their email address.
   * Email lookups should be case-insensitive by normalizing the email before querying.
   *
   * @async
   * @method getUserByEmail
   * @param {string} email - The email address of the user to retrieve.
   * @returns {Promise<PrismaUser | null>} A promise that resolves with the full `PrismaUser` object if found, or `null` otherwise.
   */
  getUserByEmail(email: string): Promise<PrismaUser | null>;

  /**
   * Updates the profile information for a specified user.
   * Allows modification of fields like username and email. If the email is changed,
   * it should typically trigger a re-verification process for the new email address.
   *
   * @async
   * @method updateUserProfile
   * @param {string} userId - The ID of the user whose profile is to be updated.
   * @param {UserProfileUpdateData} data - An object containing the profile fields to be updated (e.g., `username`, `email`).
   * @returns {Promise<PublicUser>} A promise that resolves to the updated `PublicUser` object.
   * @throws {GMIError} If the user is not found (`GMIErrorCode.USER_NOT_FOUND`), if validation of the new data fails (e.g., username/email already taken - `GMIErrorCode.REGISTRATION_USERNAME_EXISTS` or `GMIErrorCode.REGISTRATION_EMAIL_EXISTS`), or if a database error occurs.
   */
  updateUserProfile(userId: string, data: UserProfileUpdateData): Promise<PublicUser>;

  /**
   * Checks if a user account is considered valid for operations.
   * This might involve checking if the user exists, if their email is verified (if required),
   * or if the account is active (not banned or suspended).
   *
   * @async
   * @method isUserValid
   * @param {string} userId - The ID of the user to validate.
   * @returns {Promise<boolean>} A promise resolving to `true` if the user is valid, `false` otherwise.
   */
  isUserValid(userId: string): Promise<boolean>;

  /**
   * Validates a user session against the database using the session ID and associated user ID.
   * This confirms that the session record exists, is marked as active, and has not passed its expiration time.
   *
   * @async
   * @method validateUserSession
   * @param {string} sessionId - The unique ID of the session (often found within a JWT claim like `jti`).
   * @param {string} userId - The ID of the user to whom the session should belong.
   * @returns {Promise<PrismaUserSession | null>} A promise resolving to the `PrismaUserSession` object if the session is valid and active, or `null` otherwise.
   */
  validateUserSession(sessionId: string, userId: string): Promise<PrismaUserSession | null>;

  /**
   * Retrieves the subscription tier details associated with a given user.
   * This is crucial for determining user entitlements, feature access, and usage limits.
   *
   * @async
   * @method getUserSubscriptionTier
   * @param {string} userId - The ID of the user whose subscription tier is being requested.
   * @returns {Promise<ISubscriptionTier | null>} A promise resolving to the `ISubscriptionTier` object for the user, or `null` if the user has no tier assigned or the tier is not found.
   */
  getUserSubscriptionTier(userId: string): Promise<ISubscriptionTier | null>;

  // --- User-Provided API Key Management for LLMs ---

  /**
   * Securely saves (adds or updates) a user-provided API key for a specific LLM provider.
   * The key is encrypted using AES-256-CBC before storage. If a key for the same user and provider
   * already exists, it is updated; otherwise, a new record is created.
   *
   * @async
   * @method saveUserApiKey
   * @param {string} userId - The ID of the user who owns the API key.
   * @param {string} providerId - A unique identifier for the LLM provider (e.g., "openai", "anthropic").
   * @param {string} apiKey - The plain-text API key provided by the user.
   * @param {string} [keyName] - An optional, user-friendly name or label for this API key.
   * @returns {Promise<UserApiKeyInfo>} A promise resolving to a `UserApiKeyInfo` object representing the saved key (excluding sensitive encrypted data).
   * @throws {GMIError} If encryption fails (e.g., `API_KEY_ENCRYPTION_KEY_HEX` not configured - `GMIErrorCode.CONFIGURATION_ERROR`), the user is not found, or a database operation fails.
   */
  saveUserApiKey(userId: string, providerId: string, apiKey: string, keyName?: string): Promise<UserApiKeyInfo>;

  /**
   * Retrieves summary information for all API keys associated with a given user.
   * This method returns a list of `UserApiKeyInfo` objects, which include masked previews
   * of the keys but not the actual encrypted or decrypted keys.
   *
   * @async
   * @method getUserApiKeys
   * @param {string} userId - The ID of the user whose API keys are to be retrieved.
   * @returns {Promise<UserApiKeyInfo[]>} A promise resolving to an array of `UserApiKeyInfo` objects.
   */
  getUserApiKeys(userId: string): Promise<UserApiKeyInfo[]>;

  /**
   * Retrieves and decrypts a user-provided API key for a specific provider.
   * The `keyName` parameter is included for potential future use where a user might have multiple named keys per provider,
   * but current implementations based on `@@unique([userId, providerId])` will typically fetch the single key for that provider.
   * This method should be used with extreme caution and only by trusted internal services (e.g., an `AIModelProviderManager`)
   * that need to make calls to external LLMs on behalf of the user.
   *
   * @async
   * @method getDecryptedUserApiKey
   * @param {string} userId - The ID of the user.
   * @param {string} providerId - The identifier of the LLM provider.
   * @param {string | null} [keyName] - Optional: The name of the key (currently descriptive, may not be used for unique lookup if schema enforces one key per provider).
   * @returns {Promise<string | null>} The decrypted plain-text API key if found, active, and decryption is successful; otherwise `null`.
   * @throws {GMIError} If decryption fails (`GMIErrorCode.API_KEY_DECRYPTION_FAILED`), the key is not found, or if `API_KEY_ENCRYPTION_KEY_HEX` is not configured (`GMIErrorCode.CONFIGURATION_ERROR`).
   */
  getDecryptedUserApiKey(userId: string, providerId: string, keyName?: string | null): Promise<string | null>;

  /**
   * Deletes a user-provided API key, identified by its unique database record ID.
   * This method ensures that the key belongs to the specified user before deletion to prevent unauthorized actions.
   *
   * @async
   * @method deleteUserApiKey
   * @param {string} userId - The ID of the user who owns the API key to be deleted.
   * @param {string} apiKeyRecordId - The database ID of the `UserApiKey` record to delete.
   * @returns {Promise<void>} A promise that resolves when the key has been successfully deleted.
   * @throws {GMIError} If the API key is not found (`GMIErrorCode.RESOURCE_NOT_FOUND`), the user does not own it (`GMIErrorCode.PERMISSION_DENIED`), or a database operation fails.
   */
  deleteUserApiKey(userId: string, apiKeyRecordId: string): Promise<void>;

  // --- OAuth Authentication (Google Example) ---

  /**
   * Initiates the Google OAuth 2.0 authentication flow.
   * This method constructs the authorization URL for Google's OAuth consent screen. The client application
   * should redirect the user's browser to this URL to begin the Google sign-in process.
   *
   * @async
   * @method initiateGoogleOAuth
   * @returns {Promise<OAuthInitiateResult>} A promise resolving to an object containing the `redirectUrl`.
   * @throws {GMIError} If Google OAuth is not properly configured on the server (e.g., missing client ID, secret, or callback URL - `GMIErrorCode.OAUTH_PROVIDER_NOT_CONFIGURED`).
   */
  initiateGoogleOAuth(): Promise<OAuthInitiateResult>;

  /**
   * Handles the callback from Google after the user has attempted authentication via OAuth.
   * This method receives an authorization `code` from Google, exchanges it for access and ID tokens,
   * verifies the ID token, and fetches the user's profile information from Google.
   * It then attempts to find an existing local user account associated with this Google identity (either by Google ID or email).
   * If no local user is found, a new one is created. The Google account is then linked to the local user account.
   * Finally, a local application-specific session (JWT) is generated and returned.
   *
   * @async
   * @method handleGoogleOAuthCallback
   * @param {string} code - The authorization code received from Google as a query parameter in the callback URL.
   * @param {string} [deviceInfo] - Optional: Information about the client device (e.g., User-Agent string) for session auditing.
   * @param {string} [ipAddress] - Optional: The IP address of the client making the request, for security logging and session auditing.
   * @returns {Promise<AuthenticationResult>} A promise resolving to the standard `AuthenticationResult` object, containing local user information and a new session JWT.
   * @throws {GMIError} If any step of the OAuth callback handling fails, such as code exchange failure (`GMIErrorCode.OAUTH_AUTHENTICATION_FAILED`),
   * ID token missing or invalid (`GMIErrorCode.OAUTH_ID_TOKEN_MISSING`, `GMIErrorCode.OAUTH_INVALID_TOKEN_PAYLOAD`),
   * or issues with local user creation/linking.
   */
  handleGoogleOAuthCallback(code: string, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult>;
}