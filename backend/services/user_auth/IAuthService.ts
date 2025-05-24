/**
 * @fileoverview Defines the interface for the Authentication Service (AuthService).
 * This service is responsible for all aspects of user identity management,
 * including registration via email/password, login with credentials or OAuth providers,
 * session validation, password management, and handling of user-specific API keys
 * for external LLM providers. It serves as the primary contract for authentication
 * logic within the Voice Chat Assistant backend.
 *
 * Key Responsibilities:
 * - User registration and credential verification.
 * - Secure password hashing and comparison.
 * - JWT generation and validation for session management.
 * - OAuth 2.0 flow initiation and callback handling (e.g., for Google).
 * - Secure storage and retrieval of user-provided API keys.
 * - Association of users with subscription tiers and providing relevant user data.
 *
 * @module backend/services/user_auth/IAuthService
 * @version 1.1.0
 */

import {
  User as PrismaUser,
  UserApiKey as PrismaUserApiKey,
  UserSession as PrismaUserSession,
  // Account as PrismaAccount, // Not directly returned by IAuthService methods, but used internally by AuthService
} from '@prisma/client';
// Assuming PublicUser is defined in './User.ts' as per your provided file structure.
// If not, it should be defined here or imported from a common types location.
import { PublicUser } from './User';
import { ISubscriptionTier } from './SubscriptionTier'; // Assuming SubscriptionTier.ts exports this as an interface

/**
 * Represents the payload typically encoded within a JSON Web Token (JWT).
 * This data is embedded in the token and used to identify the user and session upon successful validation.
 *
 * @interface AuthTokenPayload
 * @property {string} userId - The unique identifier (UUID) of the authenticated user.
 * @property {string} username - The username of the authenticated user.
 * @property {string} sessionId - The unique identifier for this specific user session, linking the JWT to a session record in the database.
 * @property {string[]} [roles] - Optional array of user roles (e.g., "admin", "user") for basic Role-Based Access Control (RBAC).
 * @property {Record<string, any>} [claims] - Optional custom claims or additional data to include in the JWT payload.
 */
export interface AuthTokenPayload {
  userId: string;
  username: string;
  sessionId: string;
  roles?: string[];
  claims?: Record<string, any>;
}

/**
 * Represents the structured result of a successful authentication attempt (e.g., login via credentials or OAuth).
 * It includes the user's public information, the generated session token (JWT), and details about the token's expiry and the created session.
 *
 * @interface AuthenticationResult
 * @property {PublicUser} user - The public representation of the authenticated user, excluding sensitive information like password hashes.
 * @property {string} token - The JSON Web Token (JWT) generated for the user's session.
 * @property {Date} tokenExpiresAt - The exact date and time when the JWT will expire.
 * @property {PrismaUserSession} session - The database record for the created user session.
 */
export interface AuthenticationResult {
  user: PublicUser;
  token: string;
  tokenExpiresAt: Date;
  session: PrismaUserSession;
}

/**
 * Represents a user-provided API key for an external LLM provider, detailing its properties and status.
 * This interface is used for displaying API key information to the user without exposing the actual encrypted key.
 *
 * @interface UserApiKeyInfo
 * @property {string} id - The unique database ID of the API key record.
 * @property {string} providerId - The identifier of the LLM provider (e.g., "openai", "anthropic", "openrouter").
 * @property {string | null} keyName - An optional, user-friendly name or label for the API key.
 * @property {boolean} isActive - Indicates whether the API key is currently active and usable by the system.
 * @property {Date} createdAt - Timestamp of when the API key record was created.
 * @property {Date} updatedAt - Timestamp of the last update to the API key record.
 * @property {string} [maskedKeyPreview] - A masked preview of the API key (e.g., "sk-xxxx...xxxx") for display purposes.
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
 * Represents the information returned after successfully initiating an OAuth 2.0 authentication flow.
 * It contains the URL to which the user should be redirected to authenticate with the OAuth provider.
 *
 * @interface OAuthInitiateResult
 * @property {string} redirectUrl - The URL of the OAuth provider's consent screen or login page.
 */
export interface OAuthInitiateResult {
  redirectUrl: string;
}

/**
 * @interface IAuthService
 * @description Defines the comprehensive contract for the Authentication Service.
 * Implementations of this interface are responsible for managing all aspects of user authentication,
 * authorization, session handling, and related data persistence.
 */
export interface IAuthService {
  /**
   * Initializes the AuthService, potentially configuring JWT secrets, encryption keys, and OAuth clients.
   * This method should be called once at application startup to ensure the service is ready.
   * Configuration can be drawn from environment variables or a passed-in config object.
   *
   * @async
   * @method initialize
   * @param {object} [config] - Optional configuration object for the auth service.
   * @param {string} [config.jwtSecret] - The secret key used for signing and verifying JWTs. Falls back to `process.env.JWT_SECRET`.
   * @param {string} [config.jwtExpiresIn] - The duration for which JWTs remain valid (e.g., "7d", "1h"). Falls back to `process.env.JWT_EXPIRES_IN`.
   * @param {string} [config.apiKeyEncryptionKeyHex] - A 32-byte HEX-encoded key for AES-256 encryption of user API keys. Falls back to `process.env.API_KEY_ENCRYPTION_KEY_HEX`.
   * @param {string} [config.googleClientId] - Client ID for Google OAuth 2.0. Falls back to `process.env.GOOGLE_CLIENT_ID`.
   * @param {string} [config.googleClientSecret] - Client Secret for Google OAuth 2.0. Falls back to `process.env.GOOGLE_CLIENT_SECRET`.
   * @param {string} [config.googleCallbackUrl] - Registered callback URL for Google OAuth 2.0. Falls back to `process.env.GOOGLE_CALLBACK_URL`.
   * @returns {Promise<void>} A promise that resolves when initialization is complete.
   * @throws {GMIError} If critical configuration (e.g., JWT_SECRET in production) is missing or invalid.
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
   * Registers a new user in the system using email, username, and password.
   * Performs validation, hashes the password, and stores the new user.
   * Typically, this would also trigger an email verification process.
   *
   * @async
   * @method registerUser
   * @param {string} username - The desired username for the new user. Must be unique.
   * @param {string} email - The user's email address. Must be unique and valid.
   * @param {string} password - The user's plain-text password. Will be securely hashed.
   * @returns {Promise<PublicUser>} A promise that resolves with the public representation of the newly created user.
   * @throws {GMIError} If validation fails (e.g., username/email taken, weak password) or if a database error occurs.
   * @example
   * const newUser = await authService.registerUser('johndoe', 'john.doe@example.com', 'P@sswOrd123!');
   */
  registerUser(username: string, email: string, password: string): Promise<PublicUser>;

  /**
   * Authenticates an existing user using their identifier (username or email) and password.
   * If credentials are valid and the user meets any other login criteria (e.g., email verified),
   * a new session is created, and an authentication token (JWT) is issued.
   *
   * @async
   * @method loginUser
   * @param {string} identifier - The user's username or email address.
   * @param {string} password - The user's plain-text password.
   * @param {string} [deviceInfo] - Optional: Information about the client device (e.g., User-Agent string) for session auditing.
   * @param {string} [ipAddress] - Optional: The IP address of the client making the login attempt, for session auditing.
   * @returns {Promise<AuthenticationResult>} A promise that resolves with an object containing the user's public info, JWT, token expiry, and session details.
   * @throws {GMIError} If authentication fails (e.g., invalid credentials, user not found, email not verified).
   */
  loginUser(identifier: string, password: string, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult>;

  /**
   * Logs out a user by invalidating their current session associated with the provided token.
   * This typically involves marking the session record in the database as inactive.
   * The client is responsible for discarding the token upon successful logout.
   *
   * @async
   * @method logoutUser
   * @param {string} token - The JWT of the session to be terminated.
   * @returns {Promise<void>} A promise that resolves when the logout process is complete.
   * @throws {GMIError} If the token is invalid or the session cannot be updated. Errors are typically logged server-side without failing the client's logout attempt.
   */
  logoutUser(token: string): Promise<void>;

  /**
   * Validates a given session token (JWT). Checks for signature validity, expiration,
   * and ensures the associated user session is still active in the database.
   *
   * @async
   * @method validateToken
   * @param {string} token - The JWT to validate.
   * @returns {Promise<AuthTokenPayload | null>} A promise that resolves with the decoded token payload if valid and session active, otherwise null.
   */
  validateToken(token: string): Promise<AuthTokenPayload | null>;

  /**
   * Allows a user to change their password after verifying their current password.
   *
   * @async
   * @method changePassword
   * @param {string} userId - The ID of the user changing their password.
   * @param {string} oldPassword - The user's current plain-text password for verification.
   * @param {string} newPassword - The new plain-text password to set. Must meet complexity requirements.
   * @returns {Promise<void>} A promise that resolves when the password has been successfully changed.
   * @throws {GMIError} If the user is not found, `oldPassword` is incorrect, or `newPassword` is invalid.
   */
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;

  /**
   * Initiates a password reset process for a user identified by their email address.
   * Generates a unique, time-limited password reset token and (conceptually) sends it to the user's email.
   *
   * @async
   * @method requestPasswordReset
   * @param {string} email - The email address of the user requesting the password reset.
   * @returns {Promise<{ resetToken: string }>} A promise resolving with an object containing the reset token. In production, this token is emailed, not returned.
   * @throws {GMIError} If no user is found with the given email or if token generation fails.
   */
  requestPasswordReset(email: string): Promise<{ resetToken: string }>;

  /**
   * Completes the password reset process using a valid reset token and a new password.
   * Verifies the token, updates the user's password, and invalidates the token.
   *
   * @async
   * @method resetPassword
   * @param {string} resetToken - The password reset token received by the user.
   * @param {string} newPassword - The new plain-text password to set. Must meet complexity requirements.
   * @returns {Promise<void>} A promise that resolves when the password has been successfully reset.
   * @throws {GMIError} If the token is invalid/expired or the new password is weak.
   */
  resetPassword(resetToken: string, newPassword: string): Promise<void>;

  // --- User Management ---

  /**
   * Retrieves the full user object (including potentially sensitive fields like password hash) by user ID.
   * This method is primarily intended for internal service use where the full user object is necessary.
   *
   * @async
   * @method getUserById
   * @param {string} userId - The unique ID of the user to retrieve.
   * @returns {Promise<PrismaUser | null>} A promise that resolves with the full Prisma User object, or null if not found.
   */
  getUserById(userId: string): Promise<PrismaUser | null>;

  /**
   * Retrieves a user's public information (excluding sensitive data) by user ID.
   * Suitable for scenarios where user details need to be displayed or returned in API responses.
   *
   * @async
   * @method getPublicUserById
   * @param {string} userId - The unique ID of the user.
   * @returns {Promise<PublicUser | null>} A promise that resolves with the public user object, or null if not found.
   */
  getPublicUserById(userId: string): Promise<PublicUser | null>;

  /**
   * Retrieves the full user object by username. Case-insensitive lookup might be preferred.
   * Useful for login processes or admin lookups.
   *
   * @async
   * @method getUserByUsername
   * @param {string} username - The username of the user to retrieve.
   * @returns {Promise<PrismaUser | null>} A promise that resolves with the full Prisma User object, or null if not found.
   */
  getUserByUsername(username: string): Promise<PrismaUser | null>;

  /**
   * Retrieves the full user object by email address. Case-insensitive lookup is standard.
   * Useful for login, registration checks, or password reset initiation.
   *
   * @async
   * @method getUserByEmail
   * @param {string} email - The email address of the user to retrieve.
   * @returns {Promise<PrismaUser | null>} A promise that resolves with the full Prisma User object, or null if not found.
   */
  getUserByEmail(email: string): Promise<PrismaUser | null>;

  /**
   * Verifies if a user exists and is considered valid (e.g., not banned, email verified if required by policy).
   * This offers a general check for user status beyond simple token authentication.
   *
   * @async
   * @method isUserValid
   * @param {string} userId - The ID of the user to verify.
   * @returns {Promise<boolean>} True if the user is considered valid and active, false otherwise.
   */
  isUserValid(userId: string): Promise<boolean>;

  /**
   * Validates a user session based on its ID and the associated user ID.
   * Checks if the session record exists in the database, is marked as active, and has not expired.
   *
   * @async
   * @method validateUserSession
   * @param {string} sessionId - The session ID (typically from a JWT payload's `jti` or a dedicated session claim).
   * @param {string} userId - The user ID associated with the session.
   * @returns {Promise<PrismaUserSession | null>} The active session object if valid, otherwise null.
   */
  validateUserSession(sessionId: string, userId: string): Promise<PrismaUserSession | null>;

  /**
   * Retrieves the subscription tier details for a given user.
   * Essential for services needing to check user entitlements and limits (e.g., SubscriptionService, GMIManager).
   *
   * @async
   * @method getUserSubscriptionTier
   * @param {string} userId - The ID of the user.
   * @returns {Promise<ISubscriptionTier | null>} The user's subscription tier object, or null if no tier is assigned or found.
   */
  getUserSubscriptionTier(userId: string): Promise<ISubscriptionTier | null>;

  // --- User-Provided API Key Management for LLMs ---

  /**
   * Securely adds or updates a user-provided API key for a specific LLM provider.
   * The API key is encrypted before being stored in the database.
   *
   * @async
   * @method saveUserApiKey
   * @param {string} userId - The ID of the user owning the API key.
   * @param {string} providerId - The identifier of the LLM provider (e.g., "openai").
   * @param {string} apiKey - The plain-text API key to be encrypted and stored.
   * @param {string} [keyName] - An optional, user-friendly name/label for the key.
   * @returns {Promise<UserApiKeyInfo>} Information about the saved API key, excluding the actual encrypted key.
   * @throws {GMIError} If encryption fails, user not found, database error, or if `API_KEY_ENCRYPTION_KEY_HEX` is not configured.
   */
  saveUserApiKey(userId: string, providerId: string, apiKey: string, keyName?: string): Promise<UserApiKeyInfo>;

  /**
   * Retrieves summary information for all API keys associated with a given user.
   * Does not return the actual encrypted or decrypted keys, only safe-to-display info.
   *
   * @async
   * @method getUserApiKeys
   * @param {string} userId - The ID of the user whose API keys are to be retrieved.
   * @returns {Promise<UserApiKeyInfo[]>} An array of API key information objects.
   */
  getUserApiKeys(userId: string): Promise<UserApiKeyInfo[]>;

  /**
   * Retrieves and decrypts a user-provided API key for a specific provider and optional key name.
   * This method should be used with extreme caution and only by trusted internal services
   * (like an AIModelProviderManager) that need to make calls to external LLMs on behalf of the user.
   * The key is decrypted on-the-fly and not stored in decrypted form persistently.
   *
   * @async
   * @method getDecryptedUserApiKey
   * @param {string} userId - The ID of the user.
   * @param {string} providerId - The identifier of the LLM provider.
   * @param {string | null} [keyName] - The optional name of the key. If the schema enforces one key per provider, this might be ignored.
   * @returns {Promise<string | null>} The decrypted API key if found, active, and decryption is successful; otherwise null.
   * @throws {GMIError} If decryption fails, key not found, or if `API_KEY_ENCRYPTION_KEY_HEX` is not configured.
   */
  getDecryptedUserApiKey(userId: string, providerId: string, keyName?: string | null): Promise<string | null>;

  /**
   * Deletes a user-provided API key, identified by its database record ID.
   * Ensures that the key belongs to the specified user before deletion for security.
   *
   * @async
   * @method deleteUserApiKey
   * @param {string} userId - The ID of the user who owns the API key.
   * @param {string} apiKeyRecordId - The database ID of the `UserApiKey` record to be deleted.
   * @returns {Promise<void>} A promise that resolves when the key has been successfully deleted.
   * @throws {GMIError} If the API key is not found, the user does not own it, or a database error occurs.
   */
  deleteUserApiKey(userId: string, apiKeyRecordId: string): Promise<void>;

  // --- OAuth Authentication (Google Example) ---

  /**
   * Initiates the Google OAuth 2.0 authentication flow.
   * Generates the URL for Google's OAuth consent screen to which the user's browser should be redirected.
   *
   * @async
   * @method initiateGoogleOAuth
   * @returns {Promise<OAuthInitiateResult>} A promise resolving to an object containing the `redirectUrl`.
   * @throws {GMIError} If Google OAuth is not configured on the server (missing client ID, secret, or callback URL).
   */
  initiateGoogleOAuth(): Promise<OAuthInitiateResult>;

  /**
   * Handles the callback from Google after successful (or failed) user authentication via OAuth.
   * It exchanges the received authorization `code` for tokens, fetches the user's profile from Google,
   * then finds an existing local user (by Google ID or email) or creates a new local user account.
   * The Google account is then linked to the local user. Finally, a local session JWT is issued.
   *
   * @async
   * @method handleGoogleOAuthCallback
   * @param {string} code - The authorization code received from Google as a query parameter in the callback.
   * @param {string} [deviceInfo] - Optional: Information about the client device for session auditing.
   * @param {string} [ipAddress] - Optional: The IP address of the client for session auditing.
   * @returns {Promise<AuthenticationResult>} A promise resolving to the standard `AuthenticationResult` (local user info, JWT, etc.).
   * @throws {GMIError} If any step of the OAuth callback handling fails (e.g., code exchange, token verification, user profile fetch, database operation).
   */
  handleGoogleOAuthCallback(code: string, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult>;
}