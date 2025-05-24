// File: backend/services/user_auth/IAuthService.ts
/**
 * @fileoverview Defines the interface for the Authentication Service (AuthService).
 * This service is responsible for all aspects of user authentication, session management,
 * API key management for user-provided LLM keys, and secure password handling.
 * It acts as the definitive authority for verifying user identity and managing
 * authentication-related user data.
 *
 * @module backend/services/user_auth/IAuthService
 */

import { User as PrismaUser, UserApiKey as PrismaUserApiKey, UserSession as PrismaUserSession } from '@prisma/client';
import { PublicUser } from './User';
import { ISubscriptionTier } from './SubscriptionTier'; // Added for getUserSubscriptionTier

/**
 * Represents the payload typically encoded within a JWT (JSON Web Token).
 *
 * @interface AuthTokenPayload
 * @property {string} userId - The unique identifier of the user.
 * @property {string} username - The username of the user.
 * @property {string} sessionId - The unique identifier for this specific session.
 * @property {string[]} [roles] - Optional array of user roles for basic RBAC (Role-Based Access Control).
 * @property {Record<string, any>} [claims] - Optional custom claims.
 */
export interface AuthTokenPayload {
  userId: string;
  username: string;
  sessionId: string;
  roles?: string[];
  claims?: Record<string, any>;
}

/**
 * Represents the result of a successful authentication attempt (e.g., login).
 *
 * @interface AuthenticationResult
 * @property {PublicUser} user - The public representation of the authenticated user.
 * @property {string} token - The JWT or session token generated for the user.
 * @property {Date} tokenExpiresAt - The expiration date of the token.
 * @property {PrismaUserSession} session - The created user session record.
 */
export interface AuthenticationResult {
  user: PublicUser;
  token: string;
  tokenExpiresAt: Date;
  session: PrismaUserSession;
}

/**
 * Represents a user-provided API key, detailing its provider and status.
 * This is a safe representation, not exposing the encrypted key directly.
 *
 * @interface UserApiKeyInfo
 * @property {string} id - The unique ID of the API key record.
 * @property {string} providerId - The ID of the LLM provider (e.g., "openai", "anthropic").
 * @property {string | null} keyName - A user-friendly name for the key.
 * @property {boolean} isActive - Whether the key is currently active for use.
 * @property {Date} createdAt - Timestamp of when the key was added.
 * @property {Date} updatedAt - Timestamp of the last update.
 * @property {string} [maskedKeyPreview] - A preview of the key, e.g., first 4 and last 4 chars.
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
 * @interface IAuthService
 * @description
 * Defines the contract for the Authentication Service. This service handles
 * all user authentication processes, including registration, login, token validation,
 * session management, password hashing and comparison, and management of user-provided
 * API keys for LLM providers. It interacts with the persistence layer (Prisma)
 * to store and retrieve user credentials and session information securely.
 */
export interface IAuthService {
  /**
   * Initializes the AuthService.
   * This might involve setting up cryptographic keys or other security parameters.
   *
   * @async
   * @param {object} [config] - Optional configuration for the auth service (e.g., JWT secret, token expiry, API key encryption key).
   * @property {string} [config.jwtSecret] - Secret for JWT signing.
   * @property {string} [config.jwtExpiresIn] - Expiration time for JWTs (e.g., "1d", "7h").
   * @property {string} [config.apiKeyEncryptionKeyHex] - HEX encoded 32-byte key for AES-256 encryption.
   * @returns {Promise<void>}
   */
  initialize?(config?: { jwtSecret?: string; jwtExpiresIn?: string, apiKeyEncryptionKeyHex?: string }): Promise<void>;

  /**
   * Registers a new user in the system.
   * Hashes the password before storing it.
   *
   * @async
   * @param {string} username - The desired username. Must be unique.
   * @param {string} email - The user's email address. Must be unique.
   * @param {string} password - The user's plain-text password.
   * @returns {Promise<PublicUser>} The newly created public user object.
   * @throws {Error} If username or email already exists, or if password criteria are not met. Specific error codes preferred.
   */
  registerUser(username: string, email: string, password: string): Promise<PublicUser>;

  /**
   * Authenticates a user with their credentials (e.g., username/email and password).
   * If successful, generates a session token (JWT) and creates a user session record.
   *
   * @async
   * @param {string} identifier - The username or email of the user.
   * @param {string} password - The user's plain-text password.
   * @param {string} [deviceInfo] - Optional information about the device logging in (e.g., User-Agent).
   * @param {string} [ipAddress] - Optional IP address of the login attempt for auditing.
   * @returns {Promise<AuthenticationResult>} An object containing the public user representation, the token, token expiration, and session details.
   * @throws {Error} If authentication fails (e.g., invalid credentials, user not found, account locked). Specific error codes preferred.
   */
  loginUser(identifier: string, password: string, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult>;

  /**
   * Logs out a user by invalidating their current session token by marking the session record in the database as inactive.
   * The client is also expected to discard the token.
   *
   * @async
   * @param {string} token - The session token (JWT) whose associated database session should be invalidated.
   * @returns {Promise<void>}
   * @throws {Error} If the token is invalid or the session cannot be found or updated.
   */
  logoutUser(token: string): Promise<void>;

  /**
   * Validates a session token (JWT) and returns its payload if valid and the associated session is active in the database.
   *
   * @async
   * @param {string} token - The session token to validate.
   * @returns {Promise<AuthTokenPayload | null>} The decoded token payload if valid and session active, otherwise null.
   */
  validateToken(token: string): Promise<AuthTokenPayload | null>;

  /**
   * Retrieves a full user object by their ID. Primarily for internal service use.
   *
   * @async
   * @param {string} userId - The ID of the user to retrieve.
   * @returns {Promise<PrismaUser | null>} The full Prisma User object or null if not found.
   */
  getUserById(userId: string): Promise<PrismaUser | null>;

  /**
   * Retrieves a user's public information by their ID. Excludes sensitive data like password hash.
   *
   * @async
   * @param {string} userId - The ID of the user.
   * @returns {Promise<PublicUser | null>} The public user object or null if not found.
   */
  getPublicUserById(userId: string): Promise<PublicUser | null>;
  
  /**
   * Retrieves a full user object by their username. Primarily for internal service use (e.g., during login).
   *
   * @async
   * @param {string} username - The username of the user to retrieve.
   * @returns {Promise<PrismaUser | null>} The full Prisma User object or null if not found.
   */
  getUserByUsername(username: string): Promise<PrismaUser | null>;

  /**
   * Retrieves a full user object by their email address. Primarily for internal service use.
   *
   * @async
   * @param {string} email - The email address of the user to retrieve.
   * @returns {Promise<PrismaUser | null>} The full Prisma User object or null if not found.
   */
  getUserByEmail(email: string): Promise<PrismaUser | null>;

  /**
   * Updates a user's password. Requires current password for verification.
   *
   * @async
   * @param {string} userId - The ID of the user.
   * @param {string} oldPassword - The user's current plain-text password.
   * @param {string} newPassword - The new plain-text password to set.
   * @returns {Promise<void>}
   * @throws {Error} If old password does not match, new password criteria are not met, or user not found.
   */
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;

  /**
   * Initiates a password reset process for a user (e.g., generates a reset token and conceptually sends it via email).
   *
   * @async
   * @param {string} email - The email address of the user requesting a password reset.
   * @returns {Promise<{ resetToken: string }>} An object containing the generated reset token (for testing/simulation; in prod, this token is emailed).
   * @throws {Error} If the email is not found or if there's an issue generating the token.
   */
  requestPasswordReset(email: string): Promise<{ resetToken: string }>;

  /**
   * Resets a user's password using a valid reset token.
   *
   * @async
   * @param {string} resetToken - The password reset token received by the user.
   * @param {string} newPassword - The new plain-text password to set.
   * @returns {Promise<void>}
   * @throws {Error} If the token is invalid, expired, new password criteria are not met, or user not found.
   */
  resetPassword(resetToken: string, newPassword: string): Promise<void>;

  // --- User-Provided API Key Management for LLMs ---

  /**
   * Adds or updates a user-provided API key for a specific LLM provider.
   * The key is encrypted before storage.
   *
   * @async
   * @param {string} userId - The ID of the user owning the API key.
   * @param {string} providerId - The identifier of the LLM provider (e.g., "openai", "anthropic").
   * @param {string} apiKey - The plain-text API key.
   * @param {string} [keyName] - An optional user-friendly name for the key.
   * @returns {Promise<UserApiKeyInfo>} Information about the added/updated key, excluding the encrypted key.
   * @throws {Error} If encryption fails, user not found, or database operation fails.
   */
  saveUserApiKey(userId: string, providerId: string, apiKey: string, keyName?: string): Promise<UserApiKeyInfo>;

  /**
   * Retrieves summary information for all API keys for a given user. Does not return the actual keys.
   *
   * @async
   * @param {string} userId - The ID of the user.
   * @returns {Promise<UserApiKeyInfo[]>} An array of API key information objects.
   */
  getUserApiKeys(userId: string): Promise<UserApiKeyInfo[]>;

  /**
   * Retrieves a decrypted user-provided API key for a specific provider.
   * This method should be used with extreme care and only by trusted internal services
   * (like AIModelProviderManager) that need to make calls on behalf of the user.
   * The key is decrypted on-the-fly and not stored in decrypted form.
   *
   * @async
   * @param {string} userId - The ID of the user.
   * @param {string} providerId - The identifier of the LLM provider.
   * @returns {Promise<string | null>} The decrypted API key if found and active, or null otherwise.
   * @throws {Error} If decryption fails or key not found.
   */
  getDecryptedUserApiKey(userId: string, providerId: string): Promise<string | null>;

  /**
   * Deletes a user-provided API key specified by its database ID.
   * Ensures the key belongs to the specified user before deletion.
   *
   * @async
   * @param {string} userId - The ID of the user owning the key.
   * @param {string} apiKeyRecordId - The database ID of the `UserApiKey` record to delete.
   * @returns {Promise<void>}
   * @throws {Error} If the key is not found, the user does not own it, or database operation fails.
   */
  deleteUserApiKey(userId: string, apiKeyRecordId: string): Promise<void>;

  /**
   * Verifies if a user exists and is considered active/valid (e.g., not banned, email verified if required).
   * This is a general check for user validity beyond just token authentication.
   *
   * @async
   * @param {string} userId - The ID of the user to verify.
   * @returns {Promise<boolean>} True if the user is valid and active, false otherwise.
   */
  isUserValid(userId: string): Promise<boolean>;
  
  /**
   * Validates a user session based on session ID and associated user ID.
   * This method checks if the session record exists in the database, is active, and has not expired.
   *
   * @async
   * @param {string} sessionId - The session ID from the client (likely from the JWT payload).
   * @param {string} userId - The user ID associated with the session (also from JWT payload).
   * @returns {Promise<PrismaUserSession | null>} The active session object if valid, otherwise null.
   */
  validateUserSession(sessionId: string, userId: string): Promise<PrismaUserSession | null>;

  /**
   * Retrieves the subscription tier for a given user.
   * This is essential for the SubscriptionService and other parts of the system
   * to determine user entitlements.
   *
   * @async
   * @param {string} userId - The ID of the user.
   * @returns {Promise<ISubscriptionTier | null>} The user's subscription tier, or null if not found or no tier assigned.
   */
  getUserSubscriptionTier(userId: string): Promise<ISubscriptionTier | null>;
}