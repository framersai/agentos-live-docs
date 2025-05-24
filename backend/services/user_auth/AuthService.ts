/**
 * @fileoverview Authentication Service (AuthService) implementation for the Voice Chat Assistant.
 * This service provides concrete logic for user registration, login (email/password and Google OAuth),
 * session management via JWTs, password recovery, and secure handling of user-provided API keys
 * for external Large Language Model (LLM) providers. It leverages Prisma for database interactions,
 * bcrypt for password hashing, jsonwebtoken for JWTs, and google-auth-library for Google OAuth.
 *
 * Core functionalities include:
 * - Secure user registration with password hashing and email verification hooks (conceptual).
 * - Login mechanisms for traditional credentials and Google OAuth 2.0.
 * - Generation and validation of JWTs for stateless session management.
 * - Secure encryption (AES-256-CBC) and decryption of user-provided API keys.
 * - Management of user sessions, including creation, validation, and invalidation (logout).
 * - Password change and reset functionalities.
 * - Linking OAuth identities to local user accounts.
 * - Adherence to SOTA security practices for authentication and data handling.
 *
 * @module backend/services/user_auth/AuthService
 * @version 1.1.0
 * @see IAuthService For the service contract.
 * @see GMIError For custom error handling.
 */

import {
  PrismaClient,
  User as PrismaUser,
  UserApiKey as PrismaUserApiKey,
  UserSession as PrismaUserSession,
  Account as PrismaAccount, // Used for OAuth account linking
  // SubscriptionTier as PrismaSubscriptionTier, // Not directly manipulated here beyond reading
} from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client, TokenPayload as GoogleTokenPayload } from 'google-auth-library';

import { GMIError, GMIErrorCode, ErrorFactory } from '../../utils/errors';
import {
  IAuthService,
  AuthTokenPayload,
  AuthenticationResult,
  UserApiKeyInfo,
  OAuthInitiateResult,
} from './IAuthService';
import { PublicUser } from './User'; // Using PublicUser from your User.ts
import { ISubscriptionTier } from './SubscriptionTier'; // Using your SubscriptionTier.ts

// Alias for PrismaUser for internal use when full user object is needed.
type InternalUserType = PrismaUser;

export class AuthService implements IAuthService {
  private prisma: PrismaClient;
  private jwtSecret: string;
  private jwtExpiresIn: string;
  private apiKeyEncryptionKey?: Buffer; // Must be 32 bytes for AES-256
  private googleOAuthClient?: OAuth2Client;
  private googleCallbackUrl?: string;

  // private emailService: IEmailService; // Placeholder for a dedicated email service

  /**
   * Constructs an instance of the AuthService.
   * Initializes JWT settings, API key encryption, and the Google OAuth client based on provided
   * configuration or environment variables.
   *
   * @constructor
   * @param {PrismaClient} prisma - The Prisma client instance for database interactions.
   * @param {object} [config] - Optional configuration overrides.
   * @param {string} [config.jwtSecret] - JWT signing secret.
   * @param {string} [config.jwtExpiresIn] - JWT expiration duration string.
   * @param {string} [config.apiKeyEncryptionKeyHex] - Hex-encoded AES-256 key for API key encryption.
   * @param {string} [config.googleClientId] - Google OAuth Client ID.
   * @param {string} [config.googleClientSecret] - Google OAuth Client Secret.
   * @param {string} [config.googleCallbackUrl] - Google OAuth Callback URL.
   */
  constructor(
    prisma: PrismaClient,
    config?: {
      jwtSecret?: string;
      jwtExpiresIn?: string;
      apiKeyEncryptionKeyHex?: string;
      googleClientId?: string;
      googleClientSecret?: string;
      googleCallbackUrl?: string;
    }
    // emailService?: IEmailService, // Future: inject email service
  ) {
    this.prisma = prisma;
    // this.emailService = emailService;

    this.jwtSecret = config?.jwtSecret || process.env.JWT_SECRET || 'UNSAFE_DEFAULT_JWT_SECRET_CHANGE_ME_PLEASE_!@#$%^&*()_+';
    this.jwtExpiresIn = config?.jwtExpiresIn || process.env.JWT_EXPIRES_IN || '7d';

    if (this.jwtSecret === 'UNSAFE_DEFAULT_JWT_SECRET_CHANGE_ME_PLEASE_!@#$%^&*()_+' || (this.jwtSecret || '').length < 64) {
      if (process.env.NODE_ENV === 'production') {
        console.error("CRITICAL SECURITY WARNING: JWT_SECRET is weak or using default. This is highly insecure for production. Please set a strong, random secret of at least 64 characters.");
        // throw ErrorFactory.configuration("JWT_SECRET is insecure for production."); // Consider throwing in prod
      } else {
        console.warn("⚠️ JWT_SECRET is weak or using default. Fine for dev, but CHANGE for production with a strong, random secret of at least 64 characters.");
      }
    }

    const apiKeyHex = config?.apiKeyEncryptionKeyHex || process.env.API_KEY_ENCRYPTION_KEY_HEX;
    if (apiKeyHex) {
      try {
        const keyBuffer = Buffer.from(apiKeyHex, 'hex');
        if (keyBuffer.length !== 32) { // AES-256 requires a 32-byte key
          console.warn(`⚠️ API_KEY_ENCRYPTION_KEY_HEX is not 32 bytes (is ${keyBuffer.length} bytes). AES-256 encryption will fail or be compromised. Ensure it's a 64-character hex string.`);
        } else {
          this.apiKeyEncryptionKey = keyBuffer;
          console.log("✅ API Key Encryption configured.");
        }
      } catch (e) {
        console.warn(`⚠️ Invalid API_KEY_ENCRYPTION_KEY_HEX format. Must be a valid hex string. Encryption disabled: ${(e as Error).message}`);
      }
    } else {
      console.warn("⚠️ API_KEY_ENCRYPTION_KEY_HEX is not set. User API key storage will be unencrypted and insecure.");
    }

    // Initialize Google OAuth Client
    this._initializeGoogleClient(config);
  }

  /**
   * Helper to initialize or re-initialize the Google OAuth client.
   * @private
   */
  private _initializeGoogleClient(config?: {
    googleClientId?: string;
    googleClientSecret?: string;
    googleCallbackUrl?: string;
  }): void {
    const googleClientId = config?.googleClientId || process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = config?.googleClientSecret || process.env.GOOGLE_CLIENT_SECRET;
    const callbackUrl = config?.googleCallbackUrl || process.env.GOOGLE_CALLBACK_URL;

    if (googleClientId && googleClientSecret && callbackUrl) {
      this.googleOAuthClient = new OAuth2Client(googleClientId, googleClientSecret, callbackUrl);
      this.googleCallbackUrl = callbackUrl; // Store for use in generateAuthUrl
      console.log("✅ Google OAuth client configured.");
    } else {
      console.warn("⚠️ Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL) not fully configured. Google OAuth will be unavailable.");
      this.googleOAuthClient = undefined;
      this.googleCallbackUrl = undefined;
    }
  }


  /** @inheritdoc */
  async initialize(config?: { /* Same as constructor config */ }): Promise<void> {
    // Re-apply config if provided during explicit initialization (e.g., in server.ts)
    if (config?.jwtSecret) this.jwtSecret = config.jwtSecret;
    if (config?.jwtExpiresIn) this.jwtExpiresIn = config.jwtExpiresIn;

    if (config?.apiKeyEncryptionKeyHex) {
      try {
        const keyBuffer = Buffer.from(config.apiKeyEncryptionKeyHex, 'hex');
        if (keyBuffer.length === 32) {
            this.apiKeyEncryptionKey = keyBuffer;
        } else {
             console.warn("⚠️ API_KEY_ENCRYPTION_KEY_HEX in initialize config must be a 32-byte hex string.");
        }
      } catch (e) {
          console.warn(`⚠️ Invalid API_KEY_ENCRYPTION_KEY_HEX format in initialize config: ${(e as Error).message}`);
      }
    }
    // Re-initialize Google OAuth client if new config details are provided that differ or were missing
    this._initializeGoogleClient(config);
    console.log("AuthService initialized/re-configured.");
  }

  /** @inheritdoc */
  async registerUser(username: string, email: string, password: string): Promise<PublicUser> {
    if (!password || password.length < 8) { // Basic password policy
        throw ErrorFactory.validation('Password must be at least 8 characters long.', { field: 'password' });
    }
    // Normalize email to lowercase for consistent uniqueness checks
    const normalizedEmail = email.toLowerCase();

    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ username: { equals: username, mode: 'insensitive' } }, { email: normalizedEmail }] }
    });

    if (existingUser) {
      if (existingUser.username.toLowerCase() === username.toLowerCase()) {
        throw ErrorFactory.authentication('Username already exists. Please choose a different one.', { username }, GMIErrorCode.REGISTRATION_USERNAME_EXISTS);
      } else { // Email must be the match
        throw ErrorFactory.authentication('An account with this email address already exists.', { email }, GMIErrorCode.REGISTRATION_EMAIL_EXISTS);
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex'); // For email verification

    const user = await this.prisma.user.create({
      data: { username, email: normalizedEmail, passwordHash, emailVerified: false, emailVerificationToken: verificationToken }
    });

    // TODO: Implement actual email sending for verification
    // try {
    //   await this.emailService.sendVerificationEmail(user.email, verificationToken);
    // } catch (emailError) {
    //   console.error(`Failed to send verification email to ${user.email}:`, emailError);
    //   // Decide if registration should fail or proceed with unverified email. For now, proceed.
    // }
    console.log(`INFO: User ${user.username} registered. Verification token: ${verificationToken}. (Email sending not implemented)`);

    return this.toPublicUser(user);
  }

  /** @inheritdoc */
  async loginUser(identifier: string, password: string, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult> {
    const normalizedIdentifier = identifier.includes('@') ? identifier.toLowerCase() : identifier;
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedIdentifier },
          { username: normalizedIdentifier }
        ]
      }
    });

    if (!user) {
      throw ErrorFactory.authentication('Invalid username/email or password.');
    }
    if (!user.passwordHash) { // User might exist but only through OAuth
      throw ErrorFactory.authentication('Password login is not enabled for this account. Try an alternative login method.');
    }

    // TODO: Implement email verification check if desired
    // if (!user.emailVerified) {
    //   throw ErrorFactory.authentication('Please verify your email address before logging in.', {}, GMIErrorCode.AUTHENTICATION_EMAIL_NOT_VERIFIED);
    // }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw ErrorFactory.authentication('Invalid username/email or password.');
    }

    return this._generateAuthResult(user, deviceInfo, ipAddress);
  }

  /**
   * Generates an authentication result (JWT, session) for a given user.
   * @private
   */
  private async _generateAuthResult(user: PrismaUser, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult> {
    const sessionId = crypto.randomUUID();
    const expiresInMs = this._parseJwtExpiresIn(this.jwtExpiresIn);
    const expiresAt = new Date(Date.now() + expiresInMs);

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        token: sessionId, // This 'token' field in UserSession is the session's own ID, not the JWT itself.
        deviceInfo: deviceInfo?.substring(0, 255), // Truncate if too long
        ipAddress,
        expiresAt,
        lastAccessed: new Date(), // Set on creation
      }
    });

    const tokenPayload: AuthTokenPayload = { userId: user.id, username: user.username, sessionId: session.id };
    const token = jwt.sign(tokenPayload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return { user: this.toPublicUser(user), token, tokenExpiresAt: expiresAt, session };
  }

  /** @inheritdoc */
  async logoutUser(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as AuthTokenPayload;
      if (decoded?.sessionId) {
        await this.prisma.userSession.updateMany({
          where: { id: decoded.sessionId, userId: decoded.userId, isActive: true },
          data: { isActive: false, expiresAt: new Date() } // Mark inactive and effectively expire now
        });
      }
    } catch (error) {
      // Log error but don't fail the client-side logout. Token might be already invalid.
      console.warn('[AuthService] Error during server-side session invalidation on logout:', (error as Error).message);
    }
  }

  /** @inheritdoc */
  async validateToken(token: string): Promise<AuthTokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as AuthTokenPayload;
      // Check if the session associated with this token is still active and not expired
      const session = await this.prisma.userSession.findUnique({
        where: { id: decoded.sessionId, userId: decoded.userId, isActive: true, expiresAt: { gt: new Date() } }
      });
      return session ? decoded : null;
    } catch (error) {
      // Catches invalid signature, malformed token, expired token (by JWT's own exp claim)
      return null;
    }
  }

  /** @inheritdoc */
  async initiateGoogleOAuth(): Promise<OAuthInitiateResult> {
    if (!this.googleOAuthClient || !this.googleCallbackUrl) {
      throw ErrorFactory.configuration(
        'Google OAuth is not configured on the server. Please check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL environment variables.',
        { provider: 'google' }
      );
    }
    const scopes = [
      'openid', // Standard OIDC scope
      'https://www.googleapis.com/auth/userinfo.profile', // Access user's basic profile info
      'https://www.googleapis.com/auth/userinfo.email',   // Access user's email address
    ];
    const redirectUrl = this.googleOAuthClient.generateAuthUrl({
      access_type: 'offline', // Request a refresh token for long-term access if needed.
      scope: scopes,
      // prompt: 'consent', // Optional: forces consent screen every time. Good for dev, remove for prod.
      redirect_uri: this.googleCallbackUrl, // Must match one of the authorized redirect URIs in Google Cloud Console
    });
    return { redirectUrl };
  }

  /** @inheritdoc */
  async handleGoogleOAuthCallback(code: string, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult> {
    if (!this.googleOAuthClient) {
      throw ErrorFactory.configuration('Google OAuth is not configured.', { provider: 'google' });
    }

    try {
      const { tokens } = await this.googleOAuthClient.getToken(code);
      this.googleOAuthClient.setCredentials(tokens); // Allows client to make authenticated requests if needed

      if (!tokens.id_token) {
        throw ErrorFactory.authentication('Google OAuth did not return an ID token.', { provider: 'google' }, GMIErrorCode.OAUTH_ID_TOKEN_MISSING);
      }

      const ticket = await this.googleOAuthClient.verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.GOOGLE_CLIENT_ID, // Verifies the token was issued to your client
      });
      const payload = ticket.getPayload();

      if (!payload || !payload.sub || !payload.email) {
        throw ErrorFactory.authentication('Invalid Google ID token payload.', { provider: 'google', missingFields: !payload?.sub ? 'sub' : !payload?.email ? 'email' : 'unknown' }, GMIErrorCode.OAUTH_INVALID_TOKEN_PAYLOAD);
      }

      const googleUserId = payload.sub;
      const email = payload.email.toLowerCase(); // Normalize email
      const emailVerified = payload.email_verified || false;
      // Construct username: prefer 'name', then 'given_name', then derive from email.
      let username = payload.name || payload.given_name || email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');

      // Find existing OAuth account or local user by email
      let account = await this.prisma.account.findUnique({
        where: { provider_providerAccountId: { provider: 'google', providerAccountId: googleUserId } },
        include: { user: true } // Include the user linked to this account
      });

      let localUser: PrismaUser;

      if (account?.user) { // OAuth account and linked user already exist
        localUser = account.user;
        // Optionally update stored OAuth tokens if changed (e.g., new access_token)
        await this.prisma.account.update({
            where: { id: account.id },
            data: {
                access_token: tokens.access_token || undefined, // Store new access token
                refresh_token: tokens.refresh_token || account.refresh_token, // Preserve old refresh token if new one isn't provided
                expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : account.expires_at, // Update expiry
                scope: tokens.scope || account.scope,
            }
        });
      } else { // No existing Google Account record for this googleUserId
        // Check if a user with this email already exists (e.g., signed up via email/password)
        const existingUserByEmail = await this.prisma.user.findUnique({ where: { email } });

        if (existingUserByEmail) { // User exists, link this Google OAuth account to them
          localUser = existingUserByEmail;
          if (!localUser.emailVerified && emailVerified) { // If Google says email is verified, update our record
            await this.prisma.user.update({ where: {id: localUser.id }, data: { emailVerified: true }});
            localUser.emailVerified = true;
          }
        } else { // New user: create local user record
          username = await this._generateUniqueUsername(username); // Ensure username is unique
          localUser = await this.prisma.user.create({
            data: {
              email,
              username,
              emailVerified, // Trust Google's verification status
              passwordHash: null, // No local password for OAuth-only signup initially
            }
          });
        }

        // Create the Account record to link Google ID to the localUser
        await this.prisma.account.create({
          data: {
            userId: localUser.id,
            provider: 'google',
            providerAccountId: googleUserId,
            access_token: tokens.access_token || undefined,
            refresh_token: tokens.refresh_token || undefined,
            expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : undefined,
            token_type: tokens.token_type || undefined,
            scope: tokens.scope || undefined,
          }
        });
      }

      // Generate local session and JWT for the (found or created) localUser
      return this._generateAuthResult(localUser, deviceInfo, ipAddress);

    } catch (error: any) {
      console.error('[AuthService] Google OAuth Callback Error:', error.response?.data || error.message, error.stack);
      if (error instanceof GMIError) throw error; // Re-throw known GMIError
      // Wrap unknown errors
      throw ErrorFactory.authentication('Google OAuth authentication process failed.', { provider: 'google', details: error.message }, GMIErrorCode.OAUTH_AUTHENTICATION_FAILED);
    }
  }

  /** @inheritdoc */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) throw ErrorFactory.notFound('User not found.');
    if (!user.passwordHash) { // Check if user has a password set (might be OAuth only)
      throw ErrorFactory.authentication('Password-based login is not set up for this account. Cannot change password.');
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValidPassword) {
      throw ErrorFactory.authentication('Incorrect current password.');
    }
    if (newPassword.length < 8) { // Enforce minimum password length
      throw ErrorFactory.validation('New password must be at least 8 characters long.');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash, updatedAt: new Date(), resetPasswordToken: null, resetPasswordExpires: null } // Clear any pending reset tokens
    });
  }

  /** @inheritdoc */
  async requestPasswordReset(email: string): Promise<{ resetToken: string }> {
    const normalizedEmail = email.toLowerCase();
    const user = await this.getUserByEmail(normalizedEmail);
    if (!user) {
      // To prevent email enumeration, don't reveal if user exists. Log it server-side.
      console.info(`Password reset requested for non-existent email: ${normalizedEmail}`);
      // Simulate success to the client
      return { resetToken: 'simulated_token_email_not_sent_if_user_does_not_exist' };
    }
    if (!user.passwordHash) {
      // User exists but is OAuth-only, guide them differently or allow setting a password.
      // For now, we'll proceed as if they could set one.
      console.info(`Password reset requested for OAuth-only user: ${normalizedEmail}. Allowing password setup.`);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // Token valid for 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken, resetPasswordExpires, updatedAt: new Date() }
    });

    // TODO: Implement actual email sending using an EmailService
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken, user.username);
    console.log(`INFO: Password reset token for ${user.email}: ${resetToken} (Actual email sending not implemented)`);
    // In a real app, you would not return the token here. This is for dev/testing.
    return { resetToken };
  }

  /** @inheritdoc */
  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    if (newPassword.length < 8) {
      throw ErrorFactory.validation('New password must be at least 8 characters long.');
    }

    const user = await this.prisma.user.findFirst({
      where: { resetPasswordToken: resetToken, resetPasswordExpires: { gt: new Date() } }
    });

    if (!user) {
      throw ErrorFactory.authentication('Password reset token is invalid or has expired.', {}, GMIErrorCode.PASSWORD_RESET_TOKEN_INVALID);
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash, // Set the new password
        resetPasswordToken: null, // Invalidate the token
        resetPasswordExpires: null,
        emailVerified: user.emailVerified || true, // Consider user verified if they complete password reset
        updatedAt: new Date()
      }
    });
  }

  /** @inheritdoc */
  async getUserById(userId: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  /** @inheritdoc */
  async getPublicUserById(userId: string): Promise<PublicUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user ? this.toPublicUser(user) : null;
  }

  /** @inheritdoc */
  async getUserByUsername(username: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  /** @inheritdoc */
  async getUserByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  /** @inheritdoc */
  async isUserValid(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    // Add additional checks like user.isActive, !user.isBanned if those fields exist
    return !!user; // && user.emailVerified; (optional strict check)
  }

  /** @inheritdoc */
  async validateUserSession(sessionId: string, userId: string): Promise<PrismaUserSession | null> {
    return this.prisma.userSession.findFirst({
      where: { id: sessionId, userId: userId, isActive: true, expiresAt: { gt: new Date() } }
    });
  }

  /** @inheritdoc */
  async getUserSubscriptionTier(userId: string): Promise<ISubscriptionTier | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionTier: true } // Eager load the tier
    });
    // Ensure the PrismaSubscriptionTier is compatible with ISubscriptionTier or perform mapping
    return user?.subscriptionTier as ISubscriptionTier ?? null;
  }

  /** @inheritdoc */
  async saveUserApiKey(userId: string, providerId: string, apiKey: string, keyName?: string): Promise<UserApiKeyInfo> {
    if (!this.apiKeyEncryptionKey) {
      throw ErrorFactory.configuration('API key encryption service is not configured.', { detail: "API_KEY_ENCRYPTION_KEY_HEX is missing or invalid." });
    }

    const iv = crypto.randomBytes(16); // Initialization Vector for AES-CBC
    const cipher = crypto.createCipheriv('aes-256-cbc', this.apiKeyEncryptionKey, iv);
    let encryptedPayload = cipher.update(apiKey, 'utf8', 'hex');
    encryptedPayload += cipher.final('hex');
    const storedEncryptedKey = `${iv.toString('hex')}:${encryptedPayload}`; // Prepend IV for decryption

    // Upsert based on the unique constraint (userId, providerId)
    // keyName is descriptive. If a user saves a new key for the same provider, it updates the existing one.
    const userApiKey = await this.prisma.userApiKey.upsert({
      where: { userId_providerId: { userId, providerId } },
      update: { encryptedKey: storedEncryptedKey, keyName: keyName || null, isActive: true, updatedAt: new Date() },
      create: { userId, providerId, encryptedKey: storedEncryptedKey, keyName: keyName || null, isActive: true, lastUsedAt: null },
    });
    return this.toUserApiKeyInfo(userApiKey, apiKey); // Pass original key for masking in the info object
  }

  /** @inheritdoc */
  async getUserApiKeys(userId: string): Promise<UserApiKeyInfo[]> {
    const apiKeys = await this.prisma.userApiKey.findMany({ where: { userId } });
    // When listing, we don't have the original key, so maskedKeyPreview will be generic or based on stored partial data if any.
    return apiKeys.map(k => this.toUserApiKeyInfo(k));
  }

  /** @inheritdoc */
  async getDecryptedUserApiKey(userId: string, providerId: string, keyName?: string | null): Promise<string | null> {
    // Note: keyName is currently not part of the unique constraint `@@unique([userId, providerId])`.
    // This method will fetch the single key associated with userId and providerId.
    // If the schema were to change to allow multiple named keys per provider, this lookup would need adjustment.
    if (!this.apiKeyEncryptionKey) {
        console.warn("[AuthService] API key decryption was attempted, but the API_KEY_ENCRYPTION_KEY_HEX is not configured. Decryption is not possible.");
        return null; // Or throw an error if this is considered a critical misconfiguration for this operation.
                     // throw ErrorFactory.configuration('API key encryption service is not configured.');
    }

    const userApiKey = await this.prisma.userApiKey.findUnique({
      where: { userId_providerId: { userId, providerId }, isActive: true }
    });

    if (!userApiKey || !userApiKey.isActive) {
      return null; // Key not found or not active
    }

    try {
      const parts = userApiKey.encryptedKey.split(':');
      if (parts.length !== 2) { // IV:EncryptedKey
        throw new Error("Invalid stored encrypted API key format: missing IV separator.");
      }
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = parts[1];
      const decipher = crypto.createDecipheriv('aes-256-cbc', this.apiKeyEncryptionKey, iv);
      let decryptedKey = decipher.update(encryptedText, 'hex', 'utf8');
      decryptedKey += decipher.final('utf8');

      // Optionally, update lastUsedAt timestamp (consider performance implications if called frequently)
      // await this.prisma.userApiKey.update({ where: { id: userApiKey.id }, data: { lastUsedAt: new Date() }});
      return decryptedKey;
    } catch (error: any) {
      console.error(`[AuthService] Failed to decrypt API key (ID: ${userApiKey.id}) for user ${userId}, provider ${providerId}: ${error.message}`);
      // Do not expose details of decryption failure to client, but log them.
      throw ErrorFactory.internal('Failed to access API key due to a decryption error.', { keyId: userApiKey.id });
    }
  }

  /** @inheritdoc */
  async deleteUserApiKey(userId: string, apiKeyRecordId: string): Promise<void> {
    // First, verify the key belongs to the user to prevent unauthorized deletion
    const apiKey = await this.prisma.userApiKey.findUnique({
      where: { id: apiKeyRecordId }
    });

    if (!apiKey || apiKey.userId !== userId) {
      throw ErrorFactory.notFound('API key not found or you do not have permission to delete it.');
    }

    await this.prisma.userApiKey.delete({
      where: { id: apiKeyRecordId }
    });
  }

  /**
   * Converts a PrismaUser object to a PublicUser object, omitting sensitive fields.
   * @private
   */
  private toPublicUser(user: PrismaUser): PublicUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
      subscriptionTierId: user.subscriptionTierId,
    };
  }

  /**
   * Converts a PrismaUserApiKey object to a UserApiKeyInfo object for safe display.
   * @private
   */
  private toUserApiKeyInfo(apiKey: PrismaUserApiKey, originalKeyForMasking?: string): UserApiKeyInfo {
    let maskedKeyPreview = '••••••••••••••••'; // Default generic mask if original key isn't available
    if (originalKeyForMasking && originalKeyForMasking.length > 8) {
        // Show first 4 and last 4 characters for a more informative mask
        maskedKeyPreview = `${originalKeyForMasking.substring(0, 4)}...${originalKeyForMasking.substring(originalKeyForMasking.length - 4)}`;
    } else if (originalKeyForMasking) { // Shorter keys, just show first few
        maskedKeyPreview = `${originalKeyForMasking.substring(0, Math.min(originalKeyForMasking.length, 4))}...`;
    }
    // If no originalKeyForMasking, the default generic mask is used.

    return {
      id: apiKey.id,
      providerId: apiKey.providerId,
      keyName: apiKey.keyName,
      isActive: apiKey.isActive,
      createdAt: apiKey.createdAt,
      updatedAt: apiKey.updatedAt,
      maskedKeyPreview,
    };
  }
}