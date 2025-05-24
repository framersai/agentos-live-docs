// File: backend/services/user_auth/AuthService.ts
/**
 * @fileoverview Implements the Authentication Service (AuthService) for AgentOS.
 * This service handles user registration, login, session management (JWT-based),
 * password security (hashing, reset), and management of user-provided API keys
 * for LLM providers, with secure encryption for keys. It leverages Prisma for
 * database interaction and follows SOTA security practices.
 *
 * Key security considerations:
 * - Password Hashing: Uses bcrypt for strong, salted password hashing.
 * - JWT Security: Uses JWTs for stateless session management, signed with a strong secret.
 * JWTs have an expiration time. HTTPS is mandatory for transmitting tokens.
 * - API Key Encryption: User-provided API keys are encrypted at rest using AES-256-CBC.
 * The encryption key must be managed securely (e.g., via environment variables or a secrets manager).
 * - Input Validation: Assumes basic input validation (e.g., presence of fields) is done
 * at the route handler level. More complex validation (e.g., password strength, email format)
 * is handled here.
 * - Error Handling: Uses custom `AuthServiceError` with specific error codes for clear error reporting.
 * - Session Management: Creates session records in the database tied to JWTs, allowing for
 * server-side session invalidation (logout) and activity tracking.
 *
 * @module backend/services/user_auth/AuthService
 */

import { PrismaClient, User as PrismaUser, UserApiKey as PrismaUserApiKey, UserSession as PrismaUserSession, SubscriptionTier as PrismaSubscriptionTier } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IAuthService, AuthTokenPayload, AuthenticationResult, UserApiKeyInfo } from './IAuthService';
import { PublicUser, User } from './User';
import { ISubscriptionTier, SubscriptionTier } from './SubscriptionTier';
import { GMIError, GMIErrorCode } from '../../utils/errors'; // Using a centralized error system

// Configuration defaults - ensure these are robust for production or overridden via environment variables.
const DEFAULT_SALT_ROUNDS = 12; // Increased salt rounds for better security
const DEFAULT_JWT_SECRET = 'YOUR_VERY_SECURE_AND_REPLACEABLE_DEFAULT_JWT_SECRET_KEY_MIN_32_CHARS_LONG';
const DEFAULT_JWT_EXPIRES_IN = '1d'; // Standard JWT expiry (e.g., "1d", "7h", "30m")
const DEFAULT_SESSION_EXPIRES_IN_MS = 24 * 60 * 60 * 1000; // 1 day for DB session record validity
const DEFAULT_API_KEY_ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const DEFAULT_PASSWORD_RESET_TOKEN_BYTES = 32; // Size of the raw reset token
const DEFAULT_PASSWORD_RESET_EXPIRY_MS = 1 * 60 * 60 * 1000; // 1 hour for reset token validity
const DEFAULT_EMAIL_VERIFICATION_TOKEN_BYTES = 32;
const DEFAULT_EMAIL_VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours for email verification

/**
 * Custom error class for Authentication Service specific errors, extending GMIError.
 * This allows for more granular error handling and identification.
 * @class AuthServiceError
 * @extends {GMIError}
 */
class AuthServiceError extends GMIError {
  /**
   * Creates an instance of AuthServiceError.
   * @param {string} message - The human-readable error message.
   * @param {GMIErrorCode} code - A specific error code from GMIErrorCode.
   * @param {any} [details] - Optional additional context or the underlying error.
   */
  constructor(message: string, code: GMIErrorCode, details?: any) {
    super(message, code, details);
    this.name = 'AuthServiceError';
    Object.setPrototypeOf(this, AuthServiceError.prototype);
  }
}

// --- Conceptual Email Service ---
// In a real application, this would be a fully implemented service using a provider like SendGrid, Nodemailer, etc.
interface IEmailService {
  sendPasswordResetEmail(to: string, resetLink: string, username: string): Promise<void>;
  sendEmailVerificationEmail(to: string, verificationLink: string, username: string): Promise<void>;
}

class MockEmailService implements IEmailService {
  async sendPasswordResetEmail(to: string, resetLink: string, username: string): Promise<void> {
    console.log(`AuthService (MockEmailService): Sending password reset email to ${to} for user ${username}.`);
    console.log(`Reset Link (Mock): ${resetLink}`);
    // Simulate email sending
  }
  async sendEmailVerificationEmail(to: string, verificationLink: string, username: string): Promise<void> {
    console.log(`AuthService (MockEmailService): Sending email verification to ${to} for user ${username}.`);
    console.log(`Verification Link (Mock): ${verificationLink}`);
  }
}
// --- End Conceptual Email Service ---


/**
 * Implements IAuthService for managing user authentication, sessions, API keys, and password operations.
 * It integrates with Prisma for data persistence and uses standard cryptographic libraries for security.
 *
 * @class AuthService
 * @implements {IAuthService}
 */
export class AuthService implements IAuthService {
  private prisma: PrismaClient;
  private jwtSecret: string;
  private jwtExpiresIn: string;
  private sessionExpiresInMs: number;
  private apiKeyEncryptionKey: Buffer; // Ensure this is a Buffer for crypto functions
  private emailService: IEmailService; // For password resets and email verification

  /**
   * Creates an instance of AuthService.
   * @param {PrismaClient} prisma - The Prisma client for database interaction.
   * @param {IEmailService} [emailService] - Optional email service. Defaults to MockEmailService.
   * @param {object} [config] - Optional configuration for JWT and API key encryption.
   * @param {string} [config.jwtSecret] - Secret key for signing JWTs. Defaults to `process.env.JWT_SECRET` or a placeholder.
   * @param {string} [config.jwtExpiresIn] - How long JWTs are valid (e.g., "1d"). Defaults to `process.env.JWT_EXPIRES_IN` or a placeholder.
   * @param {string} [config.apiKeyEncryptionKeyHex] - HEX encoded 32-byte key for AES-256 encryption of API keys.
   * Defaults to `process.env.API_KEY_ENCRYPTION_KEY_HEX` or a generated (insecure) key.
   * @param {number} [config.sessionExpiresInMs] - Duration in milliseconds for database session records to be considered valid.
   */
  constructor(
    prisma: PrismaClient,
    emailService?: IEmailService,
    config?: { jwtSecret?: string; jwtExpiresIn?: string; apiKeyEncryptionKeyHex?: string, sessionExpiresInMs?: number }
  ) {
    this.prisma = prisma;
    this.jwtSecret = config?.jwtSecret || process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
    this.jwtExpiresIn = config?.jwtExpiresIn || process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN;
    this.sessionExpiresInMs = config?.sessionExpiresInMs || DEFAULT_SESSION_EXPIRES_IN_MS;
    this.emailService = emailService || new MockEmailService(); 

    const envEncryptionKeyHex = process.env.API_KEY_ENCRYPTION_KEY_HEX;
    const configEncryptionKeyHex = config?.apiKeyEncryptionKeyHex;

    if (configEncryptionKeyHex && configEncryptionKeyHex.length === 64) {
        this.apiKeyEncryptionKey = Buffer.from(configEncryptionKeyHex, 'hex');
    } else if (envEncryptionKeyHex && envEncryptionKeyHex.length === 64) {
        this.apiKeyEncryptionKey = Buffer.from(envEncryptionKeyHex, 'hex');
    } else {
        console.warn(
        "AuthService WARNING: API_KEY_ENCRYPTION_KEY_HEX not provided or invalid (must be 64 hex chars for a 32-byte key). " +
        "A default, insecure key will be used. THIS IS NOT SAFE FOR PRODUCTION. " +
        "Please set API_KEY_ENCRYPTION_KEY_HEX environment variable or provide in config."
        );
        this.apiKeyEncryptionKey = crypto.createHash('sha256').update('default_insecure_dev_key_!@#_CHANGE_ME_IN_ENV').digest(); // Creates a 32-byte buffer
    }

    if (this.jwtSecret === DEFAULT_JWT_SECRET && process.env.NODE_ENV === 'production') {
      console.error("AuthService CRITICAL SECURITY WARNING: Using default JWT secret in production. This is highly insecure. Set a strong, unique JWT_SECRET environment variable.");
      // Consider throwing an error in production if default secret is used to enforce secure configuration.
      // throw new AuthServiceError("CRITICAL: Default JWT secret used in production.", GMIErrorCode.SECURITY_RISK);
    }
     console.log("AuthService instantiated.");
  }

  /** @inheritdoc */
  public async initialize(config?: { jwtSecret?: string; jwtExpiresIn?: string, apiKeyEncryptionKeyHex?: string }): Promise<void> {
    // Re-apply config if provided during initialize (e.g., for deferred setup or testing)
    if (config?.jwtSecret) this.jwtSecret = config.jwtSecret;
    if (config?.jwtExpiresIn) this.jwtExpiresIn = config.jwtExpiresIn;
    if (config?.apiKeyEncryptionKeyHex && config.apiKeyEncryptionKeyHex.length === 64) {
        this.apiKeyEncryptionKey = Buffer.from(config.apiKeyEncryptionKeyHex, 'hex');
    }
    // Potentially re-check critical configurations like JWT secret and encryption key for production readiness.
    if (this.jwtSecret === DEFAULT_JWT_SECRET && process.env.NODE_ENV === 'production') {
      console.error("AuthService CRITICAL SECURITY WARNING (post-initialize): Using default JWT secret in production.");
    }
    const keySource = config?.apiKeyEncryptionKeyHex || process.env.API_KEY_ENCRYPTION_KEY_HEX;
    if ((!keySource || keySource.length !== 64) && process.env.NODE_ENV === 'production') {
         console.error("AuthService CRITICAL SECURITY WARNING (post-initialize): API Key Encryption Key is not securely configured for production.");
    }
    console.log("AuthService initialized/re-configured.");
  }

  /** @inheritdoc */
  public async registerUser(username: string, email: string, password: string): Promise<PublicUser> {
    if (!username || !email || !password) {
      throw new AuthServiceError("Username, email, and password are required.", GMIErrorCode.VALIDATION_ERROR, { fields: ['username', 'email', 'password'] });
    }
    if (password.length < 8) { // Example: Basic password policy
      throw new AuthServiceError("Password must be at least 8 characters long.", GMIErrorCode.VALIDATION_ERROR, { field: 'password', reason: 'length_too_short' });
    }
    const lowerEmail = email.toLowerCase();
    // Basic email format validation (more comprehensive validation might use a library)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lowerEmail)) {
        throw new AuthServiceError("Invalid email format.", GMIErrorCode.VALIDATION_ERROR, { field: 'email' });
    }

    const existingUserByEmail = await this.prisma.user.findUnique({ where: { email: lowerEmail } });
    if (existingUserByEmail) {
      throw new AuthServiceError("Email address is already registered.", GMIErrorCode.REGISTRATION_EMAIL_EXISTS, { email });
    }
    const existingUserByUsername = await this.prisma.user.findUnique({ where: { username } });
    if (existingUserByUsername) {
      throw new AuthServiceError("Username is already taken.", GMIErrorCode.REGISTRATION_USERNAME_EXISTS, { username });
    }

    const passwordHash = await bcrypt.hash(password, DEFAULT_SALT_ROUNDS);
    const emailVerificationToken = crypto.randomBytes(DEFAULT_EMAIL_VERIFICATION_TOKEN_BYTES).toString('hex');

    try {
      const newUser = await this.prisma.user.create({
        data: {
          username,
          email: lowerEmail,
          passwordHash,
          emailVerified: false, // Require email verification
          emailVerificationToken: crypto.createHash('sha256').update(emailVerificationToken).digest('hex'), // Store hashed token
          // Default subscriptionTierId logic:
          // Assign 'Free' tier by default. Assumes 'Free' tier exists (seeded).
          subscriptionTier: { connect: { name: 'Free' } }, // Example: Connect to Free tier by name
        },
      });
      
      // Conceptually send verification email
      // In a real app, construct verificationLink with base URL + token
      // const verificationLink = `${process.env.APP_BASE_URL}/verify-email?token=${emailVerificationToken}`;
      // await this.emailService.sendEmailVerificationEmail(newUser.email, verificationLink, newUser.username);

      return User.fromPrisma(newUser).toPublicUser();
    } catch (error: any) {
      console.error("AuthService: Error during user registration in database:", error);
      if (error.code === 'P2002') { // Prisma unique constraint violation
          if (error.meta?.target?.includes('email')) {
              throw new AuthServiceError("Email address is already registered.", GMIErrorCode.REGISTRATION_EMAIL_EXISTS, { email });
          }
          if (error.meta?.target?.includes('username')) {
             throw new AuthServiceError("Username is already taken.", GMIErrorCode.REGISTRATION_USERNAME_EXISTS, { username });
          }
      }
      throw new AuthServiceError("User registration failed due to a server error.", GMIErrorCode.DATABASE_ERROR, { underlyingError: error.message });
    }
  }

  /** @inheritdoc */
  public async loginUser(identifier: string, password: string, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult> {
    const lowerIdentifier = identifier.toLowerCase();
    const userRecord = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: lowerIdentifier },
          { username: identifier }, 
        ],
      },
    });

    if (!userRecord) {
      throw new AuthServiceError("Invalid username/email or password.", GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS);
    }
    if (!userRecord.emailVerified) { // Enforce email verification
        // Conceptually: Resend verification email option could be offered
        // await this.resendVerificationEmail(userRecord.email); 
        throw new AuthServiceError("Please verify your email address to log in.", GMIErrorCode.AUTHENTICATION_EMAIL_NOT_VERIFIED, {userId: userRecord.id});
    }
    if (!(await bcrypt.compare(password, userRecord.passwordHash))) {
      throw new AuthServiceError("Invalid username/email or password.", GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS);
    }

    const sessionId = crypto.randomBytes(16).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + this.sessionExpiresInMs);

    const tokenPayload: AuthTokenPayload = {
      userId: userRecord.id,
      username: userRecord.username,
      sessionId: sessionId,
      // roles: userRecord.roles || [], // If User model had roles
    };
    const token = jwt.sign(tokenPayload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });

    try {
      const session = await this.prisma.userSession.create({
        data: {
          id: sessionId,
          userId: userRecord.id,
          token: token, // Storing for reference/audit, not for validation if JWT is self-contained
          deviceInfo: deviceInfo || 'Unknown Device',
          ipAddress: ipAddress || 'Unknown IP',
          expiresAt: tokenExpiresAt,
          isActive: true,
        },
      });

      await this.prisma.user.update({
        where: { id: userRecord.id },
        data: { lastLoginAt: new Date() },
      });
      const appUser = User.fromPrisma(userRecord);
      return {
        user: appUser.toPublicUser(),
        token,
        tokenExpiresAt,
        session,
      };
    } catch (error: any) {
      console.error("AuthService: Error creating session or updating last login:", error);
      throw new AuthServiceError("Login failed due to a server error during session creation.", GMIErrorCode.SESSION_ERROR, { underlyingError: error.message });
    }
  }

  /** @inheritdoc */
  public async logoutUser(token: string): Promise<void> {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as AuthTokenPayload; // Throws if invalid/expired
      if (payload && payload.sessionId) {
        const updatedSessions = await this.prisma.userSession.updateMany({
          where: { id: payload.sessionId, userId: payload.userId, isActive: true },
          data: { isActive: false, updatedAt: new Date() },
        });
        if (updatedSessions.count === 0) {
            console.warn(`AuthService: No active session found to invalidate for sessionId ${payload.sessionId} and userId ${payload.userId}. Logout might be for an already inactive/invalid session.`);
        }
      } else {
        console.warn("AuthService: Logout attempted for token without a valid sessionId in payload. Cannot invalidate DB session record.");
      }
    } catch (error: any) {
      // If token is invalid (e.g., expired, tampered), it's effectively "logged out" from a stateless JWT perspective.
      // Log the error but don't necessarily throw to the client, as their goal (being logged out) is met.
      console.warn(`AuthService: Error during JWT validation or session update on logout: ${error.message}. Token may have already been invalid.`);
    }
  }

  /** @inheritdoc */
  public async validateToken(token: string): Promise<AuthTokenPayload | null> {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as AuthTokenPayload;
      if (!payload.userId || !payload.sessionId) {
        console.warn("AuthService: Token payload missing userId or sessionId.");
        return null;
      }
      const session = await this.prisma.userSession.findUnique({
        where: { id: payload.sessionId },
      });
      if (!session || !session.isActive || session.userId !== payload.userId || new Date() > session.expiresAt) {
        console.log(`AuthService: Session validation failed for sessionId ${payload.sessionId}. Session found: ${!!session}, isActive: ${session?.isActive}, userIdMatch: ${session?.userId === payload.userId}, notExpired: ${session ? new Date() <= session.expiresAt : 'N/A'}`);
        return null;
      }
      return payload;
    } catch (error: any) { // Catches JWT errors like TokenExpiredError, JsonWebTokenError
      console.log(`AuthService: JWT validation failed: ${error.message}`);
      return null;
    }
  }

  /** @inheritdoc */
  public async getUserById(userId: string): Promise<PrismaUser | null> {
    if (!userId) return null;
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  /** @inheritdoc */
  public async getPublicUserById(userId: string): Promise<PublicUser | null> {
    const userRecord = await this.getUserById(userId);
    return userRecord ? User.fromPrisma(userRecord).toPublicUser() : null;
  }

  /** @inheritdoc */
  public async getUserByUsername(username: string): Promise<PrismaUser | null> {
    if (!username) return null;
    return this.prisma.user.findUnique({ where: { username } });
  }

  /** @inheritdoc */
  public async getUserByEmail(email: string): Promise<PrismaUser | null> {
    if (!email) return null;
    return this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  /** @inheritdoc */
  public async changePassword(userId: string, oldPasswordPlainText: string, newPasswordPlainText: string): Promise<void> {
    const userRecord = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userRecord) {
      throw new AuthServiceError("User not found.", GMIErrorCode.USER_NOT_FOUND, { userId });
    }
    if (!(await bcrypt.compare(oldPasswordPlainText, userRecord.passwordHash))) {
      throw new AuthServiceError("Incorrect old password.", GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS);
    }
    if (newPasswordPlainText.length < 8) { // Consistent password policy
      throw new AuthServiceError("New password must be at least 8 characters long.", GMIErrorCode.VALIDATION_ERROR, { field: 'newPassword', reason: 'length_too_short' });
    }
    const newPasswordHash = await bcrypt.hash(newPasswordPlainText, DEFAULT_SALT_ROUNDS);
    try {
        await this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash, updatedAt: new Date(), resetPasswordToken: null, resetPasswordExpires: null }, // Clear any pending reset tokens
        });
    } catch (error: any) {
        console.error(`AuthService: Error updating password for user ${userId}:`, error);
        throw new AuthServiceError("Failed to change password due to a server error.", GMIErrorCode.DATABASE_ERROR, { underlyingError: error.message });
    }
  }

  /** @inheritdoc */
  public async requestPasswordReset(email: string): Promise<{ resetToken: string }> {
    const userRecord = await this.getUserByEmail(email.toLowerCase());
    if (!userRecord) {
      console.warn(`AuthService: Password reset requested for non-existent email: ${email}. Responding as if successful to prevent email enumeration.`);
      // To prevent email enumeration, we don't reveal if the email exists.
      // Generate a dummy token for consistent response time, though it won't be sent or usable.
      return { resetToken: crypto.randomBytes(DEFAULT_PASSWORD_RESET_TOKEN_BYTES).toString('hex') };
    }

    const resetToken = crypto.randomBytes(DEFAULT_PASSWORD_RESET_TOKEN_BYTES).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + DEFAULT_PASSWORD_RESET_EXPIRY_MS);

    try {
        await this.prisma.user.update({
            where: { id: userRecord.id },
            data: {
                resetPasswordToken: crypto.createHash('sha256').update(resetToken).digest('hex'), // Store hashed token
                resetPasswordExpires,
                updatedAt: new Date(),
            },
        });

        // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`; // Construct actual link
        // await this.emailService.sendPasswordResetEmail(userRecord.email, resetLink, userRecord.username);
        // For now, returning the plain token for testing/simulation. In production, this token is part of the link sent via email.
        return { resetToken };
    } catch (error: any) {
        console.error(`AuthService: Error processing password reset request for ${email}:`, error);
        throw new AuthServiceError("Failed to initiate password reset due to a server error.", GMIErrorCode.PASSWORD_RESET_ERROR, { underlyingError: error.message });
    }
  }

  /** @inheritdoc */
  public async resetPassword(resetToken: string, newPasswordPlainText: string): Promise<void> {
    if (!resetToken || !newPasswordPlainText) {
        throw new AuthServiceError("Reset token and new password are required.", GMIErrorCode.VALIDATION_ERROR);
    }
    if (newPasswordPlainText.length < 8) {
      throw new AuthServiceError("New password must be at least 8 characters long.", GMIErrorCode.VALIDATION_ERROR, { field: 'newPassword', reason: 'length_too_short' });
    }
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const userRecord = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { gt: new Date() }, // Check if token is not expired
      },
    });

    if (!userRecord) {
      throw new AuthServiceError("Password reset token is invalid or has expired.", GMIErrorCode.PASSWORD_RESET_TOKEN_INVALID);
    }

    const newPasswordHash = await bcrypt.hash(newPasswordPlainText, DEFAULT_SALT_ROUNDS);
    try {
        await this.prisma.user.update({
            where: { id: userRecord.id },
            data: {
                passwordHash: newPasswordHash,
                resetPasswordToken: null, // Clear the token after use
                resetPasswordExpires: null,
                emailVerified: userRecord.emailVerified || true, // Optionally verify email on password reset
                updatedAt: new Date(),
            },
        });
    } catch (error: any) {
        console.error(`AuthService: Error resetting password for user ${userRecord.id}:`, error);
        throw new AuthServiceError("Failed to reset password due to a server error.", GMIErrorCode.DATABASE_ERROR, { underlyingError: error.message });
    }
  }

  // --- User-Provided API Key Management ---

  /**
   * Encrypts an API key using AES-256-CBC.
   * @param apiKey The plain-text API key.
   * @returns The IV and encrypted key, colon-separated, in hex format.
   */
  private encryptApiKey(apiKey: string): string {
    const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
    const cipher = crypto.createCipheriv(DEFAULT_API_KEY_ENCRYPTION_ALGORITHM, this.apiKeyEncryptionKey, iv);
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`; // Prepend IV for use during decryption
  }

  /**
   * Decrypts an API key previously encrypted with `encryptApiKey`.
   * @param encryptedData The IV:encryptedKey string.
   * @returns The decrypted API key.
   * @throws {AuthServiceError} If decryption fails.
   */
  private decryptApiKey(encryptedData: string): string {
    try {
        const parts = encryptedData.split(':');
        if (parts.length !== 2) {
            throw new Error("Invalid encrypted data format for API key (IV missing or malformed).");
        }
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = parts[1];
        const decipher = crypto.createDecipheriv(DEFAULT_API_KEY_ENCRYPTION_ALGORITHM, this.apiKeyEncryptionKey, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error: any) {
        console.error("AuthService: API Key Decryption failed.", error);
        throw new AuthServiceError("API Key decryption failed. The key may be corrupted or the system's encryption key may have changed.", GMIErrorCode.ENCRYPTION_DECRYPTION_ERROR, { underlyingError: error.message });
    }
  }

  /** @inheritdoc */
  public async saveUserApiKey(userId: string, providerId: string, apiKey: string, keyName?: string): Promise<UserApiKeyInfo> {
    const userRecord = await this.getUserById(userId); // Ensures user exists
    if (!userRecord) {
      throw new AuthServiceError("User not found. Cannot save API key.", GMIErrorCode.USER_NOT_FOUND, { userId });
    }
    if (!providerId || !apiKey) {
        throw new AuthServiceError("Provider ID and API key are required.", GMIErrorCode.VALIDATION_ERROR);
    }

    const encryptedKey = this.encryptApiKey(apiKey);
    const effectiveKeyName = keyName || providerId; // Default keyName to providerId if not given

    try {
        const upsertedApiKey = await this.prisma.userApiKey.upsert({
            where: { userId_providerId: { userId, providerId } },
            update: { encryptedKey, keyName: effectiveKeyName, isActive: true, updatedAt: new Date() },
            create: {
                userId,
                providerId,
                encryptedKey,
                keyName: effectiveKeyName,
                isActive: true,
            },
        });
        return {
            id: upsertedApiKey.id,
            providerId: upsertedApiKey.providerId,
            keyName: upsertedApiKey.keyName,
            isActive: upsertedApiKey.isActive,
            createdAt: upsertedApiKey.createdAt,
            updatedAt: upsertedApiKey.updatedAt,
            maskedKeyPreview: apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : undefined,
        };
    } catch (error: any) {
        console.error(`AuthService: Error saving API key for user ${userId}, provider ${providerId}:`, error);
        throw new AuthServiceError("Failed to save API key due to a server error.", GMIErrorCode.DATABASE_ERROR, { underlyingError: error.message });
    }
  }

  /** @inheritdoc */
  public async getUserApiKeys(userId: string): Promise<UserApiKeyInfo[]> {
    const apiKeyRecords = await this.prisma.userApiKey.findMany({
      where: { userId, isActive: true }, // Optionally filter by isActive, or return all and indicate status
      orderBy: { providerId: 'asc' },
    });

    return apiKeyRecords.map(k => {
      let maskedKeyPreview: string | undefined = "[Encrypted]"; // Default if decryption fails or not attempted for list view
      // For a list view, we typically don't decrypt all keys just for a preview.
      // A more secure preview might be stored (e.g., last 4 chars) or not shown at all.
      // If a preview of the actual key is desired for this list:
      // try {
      //   const decrypted = this.decryptApiKey(k.encryptedKey);
      //   maskedKeyPreview = `${decrypted.substring(0, Math.min(4, decrypted.length))}...${decrypted.substring(Math.max(0, decrypted.length - 4))}`;
      // } catch (e) { /* maskedKeyPreview remains "[Encrypted]" or "[Error]" */ }
      
      return {
        id: k.id,
        providerId: k.providerId,
        keyName: k.keyName,
        isActive: k.isActive,
        createdAt: k.createdAt,
        updatedAt: k.updatedAt,
        maskedKeyPreview: k.encryptedKey ? "••••••••••••" : undefined, // Generic mask for list
      };
    });
  }

  /** @inheritdoc */
  public async getDecryptedUserApiKey(userId: string, providerId: string): Promise<string | null> {
    const apiKeyRecord = await this.prisma.userApiKey.findUnique({
      where: { userId_providerId: { userId, providerId }, isActive: true },
    });
    if (!apiKeyRecord) {
      return null; // Key not found or not active
    }
    try {
        return this.decryptApiKey(apiKeyRecord.encryptedKey);
    } catch (error) {
        console.error(`AuthService: Failed to decrypt API key for user ${userId}, provider ${providerId}.`, error);
        // Depending on policy, either return null or re-throw a specific error.
        // Returning null might be safer to prevent leaking info about decryption issues.
        return null;
    }
  }

  /** @inheritdoc */
  public async deleteUserApiKey(userId: string, apiKeyRecordId: string): Promise<void> {
    // First, verify the key belongs to the user to prevent unauthorized deletion
    const keyRecord = await this.prisma.userApiKey.findUnique({ where: { id: apiKeyRecordId } });
    if (!keyRecord) {
      throw new AuthServiceError("API key record not found.", GMIErrorCode.RESOURCE_NOT_FOUND, { apiKeyRecordId });
    }
    if (keyRecord.userId !== userId) {
      throw new AuthServiceError("User not authorized to delete this API key.", GMIErrorCode.PERMISSION_DENIED, { userId, apiKeyRecordId });
    }
    try {
        await this.prisma.userApiKey.delete({ where: { id: apiKeyRecordId } });
    } catch (error: any) {
        console.error(`AuthService: Error deleting API key ${apiKeyRecordId} for user ${userId}:`, error);
        if (error.code === 'P2025') { // Prisma's "Record to delete does not exist"
            throw new AuthServiceError("API key record not found for deletion.", GMIErrorCode.RESOURCE_NOT_FOUND, { apiKeyRecordId });
        }
        throw new AuthServiceError("Failed to delete API key due to a server error.", GMIErrorCode.DATABASE_ERROR, { underlyingError: error.message });
    }
  }

  /** @inheritdoc */
  public async isUserValid(userId: string): Promise<boolean> {
    const userRecord = await this.getUserById(userId);
    if (!userRecord) return false;
    // Add more checks as needed, e.g., user.isBanned, user.isActive (if such fields exist)
    return userRecord.emailVerified; // Example: require email verification for user to be "valid"
  }

  /** @inheritdoc */
  public async validateUserSession(sessionId: string, userId: string): Promise<PrismaUserSession | null> {
    if (!sessionId || !userId) return null;
    const session = await this.prisma.userSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) return null; // Session ID does not exist
    if (session.userId !== userId) return null; // Session belongs to a different user
    if (!session.isActive) return null; // Session has been logged out/invalidated
    if (new Date() > session.expiresAt) { // Session has expired
      // Optionally, mark as inactive if found expired
      await this.prisma.userSession.update({ where: {id: sessionId}, data: {isActive: false}});
      return null;
    }
    return session;
  }

  /** @inheritdoc */
  public async getUserSubscriptionTier(userId: string): Promise<ISubscriptionTier | null> {
    const userWithTier = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionTier: true },
    });

    if (!userWithTier || !userWithTier.subscriptionTier) {
      // Attempt to assign 'Free' tier if no tier is assigned and user exists
      if (userWithTier) {
        const freeTier = await this.prisma.subscriptionTier.findUnique({where: {name: 'Free'}});
        if (freeTier) {
          try {
            await this.prisma.user.update({
              where: {id: userId},
              data: {subscriptionTierId: freeTier.id}
            });
            return SubscriptionTier.fromPrisma(freeTier);
          } catch (error) {
            console.error(`AuthService: Failed to assign Free tier to user ${userId}:`, error);
            return null;
          }
        }
      }
      return null;
    }
    return SubscriptionTier.fromPrisma(userWithTier.subscriptionTier);
  }
}