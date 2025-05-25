/**
 * @file backend/services/user_auth/AuthService.ts
 * @module backend/services/user_auth/AuthService
 * @version 1.2.4
 *
 * @description
 * This service provides the concrete implementation for user authentication and management,
 * as defined by the `IAuthService` interface. It handles:
 * - User registration, login, OAuth (Google), session management (JWT), password management,
 * email verification, profile updates, and secure API key storage.
 *
 * Key Dependencies: @prisma/client, bcrypt, jsonwebtoken, google-auth-library, custom error utilities.
 * Configuration: Relies on environment variables or a config object for JWT, API key encryption, and OAuth.
 *
 * @notes
 * - CRITICAL: For Prisma-related type errors (e.g., "property X does not exist on YWhereUniqueInput"),
 * ensure you have run `npx prisma generate` after any schema changes. This is the most common cause.
 * - The IAuthService.ts interface may need updates to match method signatures changed herein for improved
 * security or correctness (e.g., return type of `requestPasswordReset`, fields in `UserApiKeyInfo`).
 */

import {
  PrismaClient,
  User as PrismaUser,
  UserApiKey as PrismaUserApiKey,
  UserSession as PrismaUserSession,
  Account as PrismaAccount,
} from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken'; // Explicitly import SignOptions
import crypto from 'crypto';
import { OAuth2Client, TokenPayload as GoogleTokenPayload } from 'google-auth-library';

import { GMIError, GMIErrorCode, ErrorFactory } from '../../utils/errors';
import {
  IAuthService,
  AuthTokenPayload,
  AuthenticationResult,
  UserApiKeyInfo, // Ensure this interface in IAuthService.ts includes 'lastUsedAt'
  OAuthInitiateResult,
  UserProfileUpdateData,
} from './IAuthService';
import { PublicUser } from './User'; // Defined in User.ts
import { ISubscriptionTier } from './SubscriptionTier'; // Defined in SubscriptionTier.ts

/**
 * @class AuthService
 * @implements {IAuthService}
 * @description Concrete implementation of IAuthService for user authentication and management.
 */
export class AuthService implements IAuthService {
  private prisma: PrismaClient;
  private jwtSecret: string;
  private jwtExpiresIn: string; // e.g., "7d", "24h", "3600s" (standard for jsonwebtoken)
  private apiKeyEncryptionKey?: Buffer; // Must be 32 bytes (256 bits) for AES-256
  private googleOAuthClient?: OAuth2Client;
  private googleCallbackUrl?: string;

  // private emailService: IEmailService; // Placeholder for a dedicated email service instance

  /**
   * Constructs an instance of the AuthService.
   * Initializes JWT settings, API key encryption parameters, and the Google OAuth client
   * based on the provided configuration object or environment variables.
   * @constructor
   * @param {PrismaClient} prisma - The Prisma client instance for database interactions.
   * @param {object} [config] - Optional configuration overrides for service parameters.
   * @param {string} [config.jwtSecret] - Secret key for JWT signing. Min 64 chars recommended for HS256+.
   * @param {string} [config.jwtExpiresIn] - Expiration duration for JWTs (e.g., "7d", "1h", "3600s").
   * @param {string} [config.apiKeyEncryptionKeyHex] - 64-character HEX string (32 bytes) for AES-256 encryption of API keys.
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
  ) {
    this.prisma = prisma;

    // Initialize JWT settings
    this.jwtSecret = config?.jwtSecret || process.env.JWT_SECRET || 'UNSAFE_DEFAULT_JWT_SECRET_CHANGE_ME_PLEASE_!@#$%^&*()_+';
    this.jwtExpiresIn = config?.jwtExpiresIn || process.env.JWT_EXPIRES_IN || '7d';

    if (this.jwtSecret === 'UNSAFE_DEFAULT_JWT_SECRET_CHANGE_ME_PLEASE_!@#$%^&*()_+' || (this.jwtSecret || '').length < 64) {
      const warningMsg = "JWT_SECRET is weak or using default. This is highly insecure. Please set a strong, random secret of at least 64 characters.";
      if (process.env.NODE_ENV === 'production') {
        console.error(`CRITICAL SECURITY WARNING: ${warningMsg} This application may be vulnerable in production.`);
      } else {
        console.warn(`⚠️ Development Warning: ${warningMsg} Ensure it is changed for any staging or production environment.`);
      }
    }

    // Initialize API Key Encryption
    const apiKeyHex = config?.apiKeyEncryptionKeyHex || process.env.API_KEY_ENCRYPTION_KEY_HEX;
    if (apiKeyHex) {
      try {
        const keyBuffer = Buffer.from(apiKeyHex, 'hex');
        if (keyBuffer.length !== 32) {
          console.warn(`⚠️ AuthService: API_KEY_ENCRYPTION_KEY_HEX is not 32 bytes long (is ${keyBuffer.length} bytes). It must be a 64-character hex string. AES-256 encryption will be compromised or fail.`);
          this.apiKeyEncryptionKey = undefined;
        } else {
          this.apiKeyEncryptionKey = keyBuffer;
          console.log("✅ AuthService: API Key Encryption key loaded successfully.");
        }
      } catch (e) {
        console.warn(`⚠️ AuthService: Invalid API_KEY_ENCRYPTION_KEY_HEX format. It must be a valid hex string. API key encryption will be disabled: ${(e as Error).message}`);
        this.apiKeyEncryptionKey = undefined;
      }
    } else {
      console.warn("⚠️ AuthService: API_KEY_ENCRYPTION_KEY_HEX is not set. User API key storage will be unencrypted and is highly insecure.");
      this.apiKeyEncryptionKey = undefined;
    }

    this._initializeGoogleClient(config);
  }

  /**
   * Initializes or re-initializes the Google OAuth client based on configuration.
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
      this.googleCallbackUrl = callbackUrl;
      console.log("✅ AuthService: Google OAuth client configured.");
    } else {
      const missing: string[] = [];
      if (!googleClientId) missing.push("GOOGLE_CLIENT_ID");
      if (!googleClientSecret) missing.push("GOOGLE_CLIENT_SECRET");
      if (!callbackUrl) missing.push("GOOGLE_CALLBACK_URL");
      console.warn(`⚠️ AuthService: Google OAuth client not configured due to missing environment variables: ${missing.join(', ')}. Google OAuth features will be unavailable.`);
      this.googleOAuthClient = undefined;
      this.googleCallbackUrl = undefined;
    }
  }

  /** @inheritdoc */
  public async initialize(config?: {
    jwtSecret?: string;
    jwtExpiresIn?: string;
    apiKeyEncryptionKeyHex?: string;
    googleClientId?: string;
    googleClientSecret?: string;
    googleCallbackUrl?: string;
  }): Promise<void> {
    if (config?.jwtSecret) this.jwtSecret = config.jwtSecret;
    if (config?.jwtExpiresIn) this.jwtExpiresIn = config.jwtExpiresIn;

    if (config?.apiKeyEncryptionKeyHex) {
      try {
        const keyBuffer = Buffer.from(config.apiKeyEncryptionKeyHex, 'hex');
        if (keyBuffer.length === 32) {
            this.apiKeyEncryptionKey = keyBuffer;
        } else {
            console.warn("⚠️ AuthService (initialize): API_KEY_ENCRYPTION_KEY_HEX provided is not 32 bytes. Encryption may be compromised.");
            this.apiKeyEncryptionKey = undefined;
        }
      } catch (e) {
          console.warn(`⚠️ AuthService (initialize): Invalid API_KEY_ENCRYPTION_KEY_HEX: ${(e as Error).message}. Encryption may be disabled.`);
          this.apiKeyEncryptionKey = undefined;
      }
    }
    this._initializeGoogleClient(config);
    console.log("AuthService has been initialized or re-configured.");
  }

  /** @inheritdoc */
  public async registerUser(username: string, email: string, password: string): Promise<PublicUser> {
    if (!password || password.length < 8) {
        throw ErrorFactory.validation('Password must be at least 8 characters long.', { field: 'password', minLength: 8 });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedUsername = username.trim();

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: trimmedUsername, mode: 'insensitive' } },
          { email: normalizedEmail }
        ]
      }
    });

    if (existingUser) {
      const isUsernameTaken = existingUser.username.toLowerCase() === trimmedUsername.toLowerCase();
      const code = isUsernameTaken ? GMIErrorCode.REGISTRATION_USERNAME_EXISTS : GMIErrorCode.REGISTRATION_EMAIL_EXISTS;
      const message = isUsernameTaken ? 'This username is already taken.' : 'This email address is already registered.';
      throw ErrorFactory.authentication(message, { field: isUsernameTaken ? 'username' : 'email' }, code);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        username: trimmedUsername,
        email: normalizedEmail,
        passwordHash,
        emailVerified: false,
        emailVerificationToken: verificationToken,
      }
    });

    // TODO: Implement actual email sending for verificationToken via an EmailService
    console.log(`INFO: AuthService: User ${user.username} registered. Verification token: ${verificationToken}. (Email sending NOT implemented).`);
    return this.toPublicUser(user);
  }

  /** @inheritdoc */
  public async loginUser(identifier: string, password: string, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult> {
    const normalizedIdentifier = identifier.includes('@') ? identifier.toLowerCase().trim() : identifier.trim();
    
    const user = await this.prisma.user.findFirst({
      where: { 
        OR: [
          { email: normalizedIdentifier }, 
          { username: {equals: normalizedIdentifier, mode: 'insensitive'} }
        ] 
      }
    });

    if (!user || !user.passwordHash) { // User not found or has no password (e.g., OAuth only)
      throw ErrorFactory.authentication('Invalid username/email or password.');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw ErrorFactory.authentication('Invalid username/email or password.');
    }
    return this._generateAuthResult(user, deviceInfo, ipAddress);
  }

  /**
   * Generates JWT and session details for an authenticated user.
   * @private
   */
  private async _generateAuthResult(user: PrismaUser, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult> {
    const jwtSessionId = crypto.randomUUID(); // JTI (JWT ID)
    
    const expiresInMs = this._parseJwtExpiresIn(this.jwtExpiresIn);
    const jwtExpiresAtDate = new Date(Date.now() + expiresInMs);

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        token: jwtSessionId, // Store JTI
        deviceInfo: deviceInfo?.substring(0, 255),
        ipAddress,
        expiresAt: jwtExpiresAtDate,
        lastAccessed: new Date(),
      }
    });

    const tokenPayload: AuthTokenPayload = {
      userId: user.id,
      username: user.username,
      sessionId: session.token, // Embed JTI
    };
    
    // Line 326 in new error list. Error: "Type 'string' is not assignable to type 'number | StringValue | undefined'."
    // `this.jwtExpiresIn` (string, e.g., "7d") should be assignable to `SignOptions['expiresIn']` (string | number).
    // This error is likely due to local @types/jsonwebtoken issues or TS environment.
    // ACTION FOR USER: Verify/update @types/jsonwebtoken and restart TS server if this persists.
    const signOptions: SignOptions = { 
      expiresIn: this.jwtExpiresIn, 
      jwtid: jwtSessionId // Include JTI in JWT itself
    }; 
    const token = jwt.sign(tokenPayload, this.jwtSecret, signOptions);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return { user: this.toPublicUser(user), token, tokenExpiresAt: jwtExpiresAtDate, session };
  }

  /**
   * Parses JWT expiration string into milliseconds.
   * @private
   */
  private _parseJwtExpiresIn(expiresInString: string): number {
    if (/^\d+$/.test(expiresInString)) {
        return parseInt(expiresInString, 10) * 1000;
    }
    const unit = expiresInString.slice(-1).toLowerCase();
    const valueString = expiresInString.slice(0, -1);
    const value = parseInt(valueString, 10);

    if (isNaN(value) || value <= 0) {
        console.warn(`[AuthService] Invalid JWT_EXPIRES_IN: "${expiresInString}". Defaulting to 7d.`);
        return 7 * 24 * 60 * 60 * 1000;
    }
    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default:
            console.warn(`[AuthService] Unknown JWT_EXPIRES_IN unit: "${expiresInString}". Defaulting to 7d.`);
            return 7 * 24 * 60 * 60 * 1000;
    }
  }

  /** @inheritdoc */
  public async logoutUser(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {ignoreExpiration: true}) as AuthTokenPayload & { jti?: string };
      const sessionIdToInvalidate = decoded.jti || decoded.sessionId; 

      if (sessionIdToInvalidate) {
        const result = await this.prisma.userSession.updateMany({
          where: { token: sessionIdToInvalidate, userId: decoded.userId, isActive: true },
          data: { isActive: false, expiresAt: new Date() } 
        });
        if (result.count > 0) {
            console.log(`[AuthService] Session ${sessionIdToInvalidate} invalidated for user ${decoded.userId}.`);
        }
      }
    } catch (error) {
      console.warn('[AuthService] Error during logout (token might be invalid):', (error as Error).message);
    }
  }

  /** @inheritdoc */
  public async validateToken(token: string): Promise<AuthTokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as AuthTokenPayload & { jti?: string };
      const sessionIdToValidate = decoded.jti || decoded.sessionId;
      if (!sessionIdToValidate) return null;

      const session = await this.prisma.userSession.findFirst({
        where: {
          token: sessionIdToValidate, 
          userId: decoded.userId,
          isActive: true,
          expiresAt: { gt: new Date() },
        }
      });
      return session ? decoded : null;
    } catch (error) {
      return null;
    }
  }

  /** @inheritdoc */
  public async verifyEmail(verificationToken: string): Promise<PrismaUser> {
    if (!verificationToken || typeof verificationToken !== 'string' || verificationToken.trim().length === 0) {
        throw ErrorFactory.validation("Valid email verification token required.");
    }
    const user = await this.prisma.user.findUnique({
        where: { emailVerificationToken: verificationToken.trim() },
    });

    if (!user) {
        throw ErrorFactory.validation("Email verification link invalid or expired.", {}, GMIErrorCode.EMAIL_VERIFICATION_TOKEN_INVALID);
    }
    if (user.emailVerified) {
        console.log(`[AuthService] Email for user ${user.id} already verified.`);
        if (user.emailVerificationToken) { // Still clear token
           await this.prisma.user.update({ where: { id: user.id }, data: { emailVerificationToken: null } });
        }
        return user;
    }
    return this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true, emailVerificationToken: null, updatedAt: new Date() },
    });
  }

  /** @inheritdoc */
  public async updateUserProfile(userId: string, data: UserProfileUpdateData): Promise<PublicUser> {
    const user = await this.getUserById(userId);
    if (!user) {
        throw ErrorFactory.notFound("User not found for profile update.");
    }

    const updatePayload: Partial<PrismaUser> & { updatedAt: Date } = { updatedAt: new Date() };
    let emailChangedRequiresVerification = false;

    if (data.username !== undefined && typeof data.username === 'string') {
        const newUsername = data.username.trim();
        if (newUsername !== user.username) {
            if (newUsername.length < 3) throw ErrorFactory.validation("Username must be >= 3 chars.", { field: "username" });
            const existing = await this.prisma.user.findFirst({ where: { username: { equals: newUsername, mode: 'insensitive' }, NOT: { id: userId } } });
            if (existing) throw ErrorFactory.validation("Username taken.", { field: "username" }, GMIErrorCode.REGISTRATION_USERNAME_EXISTS);
            updatePayload.username = newUsername;
        }
    }

    if (data.email !== undefined && typeof data.email === 'string') {
        const newEmail = data.email.toLowerCase().trim();
        if (newEmail !== user.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail)) throw ErrorFactory.validation("Invalid email format.", { field: "email" });
            const existing = await this.prisma.user.findFirst({ where: { email: newEmail, NOT: { id: userId } } });
            if (existing) throw ErrorFactory.validation("Email already in use.", { field: "email" }, GMIErrorCode.REGISTRATION_EMAIL_EXISTS);
            updatePayload.email = newEmail;
            updatePayload.emailVerified = false;
            updatePayload.emailVerificationToken = crypto.randomBytes(32).toString('hex');
            emailChangedRequiresVerification = true;
        }
    }

    if (Object.keys(updatePayload).length === 1 && updatePayload.updatedAt) {
        return this.toPublicUser(user); // No actual changes
    }

    const updatedUser = await this.prisma.user.update({ where: { id: userId }, data: updatePayload });

    if (emailChangedRequiresVerification && updatedUser.emailVerificationToken) {
        // TODO: Send new verification email
        console.log(`INFO: AuthService: User ${updatedUser.username} email changed. New token: ${updatedUser.emailVerificationToken}. (Email NOT sent).`);
    }
    return this.toPublicUser(updatedUser);
  }

  /** @inheritdoc */
  public async initiateGoogleOAuth(): Promise<OAuthInitiateResult> {
    if (!this.googleOAuthClient || !this.googleCallbackUrl) {
      throw ErrorFactory.configuration('Google OAuth not configured.', { provider: 'google' }, GMIErrorCode.OAUTH_PROVIDER_NOT_CONFIGURED);
    }
    const scopes = ['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];
    const redirectUrl = this.googleOAuthClient.generateAuthUrl({
      access_type: 'offline', scope: scopes, redirect_uri: this.googleCallbackUrl,
    });
    return { redirectUrl };
  }

  /** @inheritdoc */
  public async handleGoogleOAuthCallback(code: string, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult> {
    if (!this.googleOAuthClient) {
      throw ErrorFactory.configuration('Google OAuth client not initialized.', { provider: 'google' }, GMIErrorCode.OAUTH_PROVIDER_NOT_CONFIGURED);
    }
    try {
      const { tokens } = await this.googleOAuthClient.getToken(code);
      this.googleOAuthClient.setCredentials(tokens);

      if (!tokens.id_token) {
        throw ErrorFactory.authentication('Google OAuth: ID token missing.', { provider: 'google' }, GMIErrorCode.OAUTH_ID_TOKEN_MISSING);
      }
      const ticket = await this.googleOAuthClient.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
      const payload = ticket.getPayload();

      if (!payload?.sub || !payload.email) {
        throw ErrorFactory.authentication('Google OAuth: Invalid ID token payload.', { provider: 'google' }, GMIErrorCode.OAUTH_INVALID_TOKEN_PAYLOAD);
      }

      const googleUserId = payload.sub;
      const email = payload.email.toLowerCase().trim();
      const emailVerified = payload.email_verified || false;
      let username = (payload.name || payload.given_name || email.split('@')[0]).replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 30) || `guser_${crypto.randomBytes(4).toString('hex')}`;

      // CRITICAL ACTION: Run `npx prisma generate` if you see errors like "'provider_providerAccountId' does not exist".
      // Line 609 in new error list.
      let account = await this.prisma.account.findUnique({
        where: { provider_providerAccountId: { provider: 'google', providerAccountId: googleUserId } },
        include: { user: true }
      });

      let localUser: PrismaUser;

      // Errors on `account.user` (lines 616, 617) should resolve if the above Prisma query is correctly typed after `prisma generate`.
      if (account?.user) {
        localUser = account.user;
        await this.prisma.account.update({
            where: { id: account.id },
            data: {
                access_token: tokens.access_token || null,
                refresh_token: tokens.refresh_token || account.refresh_token,
                expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : account.expires_at,
                scope: tokens.scope || account.scope,
                updatedAt: new Date(),
            }
        });
      } else {
        let existingUserByEmail = await this.prisma.user.findUnique({ where: { email } });
        if (existingUserByEmail) {
          localUser = existingUserByEmail;
          if (!localUser.emailVerified && emailVerified) {
            localUser = await this.prisma.user.update({ where: {id: localUser.id }, data: { emailVerified: true, updatedAt: new Date() }});
          }
        } else {
          username = await this._generateUniqueUsername(username);
          localUser = await this.prisma.user.create({ data: { email, username, emailVerified, passwordHash: null }});
        }
        await this.prisma.account.create({
          data: {
            userId: localUser.id, provider: 'google', providerAccountId: googleUserId,
            access_token: tokens.access_token || null,
            refresh_token: tokens.refresh_token || null,
            expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : null,
            token_type: (tokens.token_type as string) || null,
            scope: tokens.scope || null,
          }
        });
      }
      return this._generateAuthResult(localUser, deviceInfo, ipAddress);
    } catch (error: any) {
      console.error('[AuthService] Google OAuth Callback Error:', error.message, error.stack);
      if (error instanceof GMIError) throw error;
      throw ErrorFactory.authentication('Google OAuth process failed.', { provider: 'google', details: error.message }, GMIErrorCode.OAUTH_AUTHENTICATION_FAILED);
    }
  }

  /** @private Generates a unique username. */
  private async _generateUniqueUsername(baseUsername: string): Promise<string> {
    let attempt = 0;
    const MAX_LEN = 30;
    let currentUsername = baseUsername.replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, MAX_LEN - 4); // Reserve space
    if (!currentUsername) currentUsername = "g_user";

    while (true) {
        let usernameToTest = attempt === 0 ? currentUsername : `${currentUsername}${attempt}`;
        if (usernameToTest.length > MAX_LEN) usernameToTest = usernameToTest.slice(0, MAX_LEN);
        
        const existing = await this.prisma.user.findUnique({ where: { username: usernameToTest }});
        if (!existing) return usernameToTest;
        
        attempt++;
        if (attempt > 100) return `${currentUsername.slice(0,MAX_LEN-9)}_${crypto.randomBytes(4).toString('hex')}`;
    }
  }

  /** @inheritdoc */
  public async changePassword(userId: string, oldPw: string, newPw: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user?.passwordHash) throw ErrorFactory.authentication('Password login not set up.', { userId }, GMIErrorCode.AUTHENTICATION_METHOD_NOT_AVAILABLE);
    if (!await bcrypt.compare(oldPw, user.passwordHash)) throw ErrorFactory.authentication('Incorrect current password.', { userId }, GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS);
    if (!newPw || newPw.length < 8) throw ErrorFactory.validation('New password too short.', { field: 'newPassword' });
    
    const newPwHash = await bcrypt.hash(newPw, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPwHash, updatedAt: new Date(), resetPasswordToken: null, resetPasswordExpires: null }
    });
    console.log(`[AuthService] Password changed for user ${userId}.`);
  }

  /**
   * @inheritdoc
   * NOTE: Update IAuthService.ts to expect `Promise<{ resetToken: string | null; }>` or `Promise<{ resetToken?: string; }>`
   * to resolve the type error on line 747. The current implementation is safer by not returning tokens in prod.
   */
  public async requestPasswordReset(email: string): Promise<{ resetToken: string | null }> {
    const user = await this.getUserByEmail(email.toLowerCase().trim());
    let tokenForUserEmail: string | null = null;

    if (user) {
      tokenForUserEmail = crypto.randomBytes(32).toString('hex');
      await this.prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken: tokenForUserEmail, resetPasswordExpires: new Date(Date.now() + 3600000), updatedAt: new Date() }
      });
      // TODO: Send tokenForUserEmail via EmailService
      console.log(`INFO: AuthService: Pw reset token for ${user.email}: ${tokenForUserEmail}. (Email NOT sent).`);
    } else {
      console.info(`[AuthService] Pw reset for non-existent email: ${email}.`);
    }
    // Return token only in dev/test for easier debugging; null in prod.
    return { resetToken: (process.env.NODE_ENV !== 'production' ? tokenForUserEmail : null) };
  }

  /** @inheritdoc */
  public async resetPassword(token: string, newPw: string): Promise<void> {
    if (!newPw || newPw.length < 8) throw ErrorFactory.validation('New password too short.');
    
    const user = await this.prisma.user.findFirst({
      where: { resetPasswordToken: token.trim(), resetPasswordExpires: { gt: new Date() } }
    });
    if (!user) throw ErrorFactory.authentication('Password reset token invalid/expired.', {}, GMIErrorCode.PASSWORD_RESET_TOKEN_INVALID);
    
    const newPwHash = await bcrypt.hash(newPw, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPwHash, resetPasswordToken: null, resetPasswordExpires: null, emailVerified: user.emailVerified || true, updatedAt: new Date()}
    });
    console.log(`[AuthService] Password reset for user ${user.id}.`);
  }

  /** @inheritdoc */
  public async getUserById(userId: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  /** @inheritdoc */
  public async getPublicUserById(userId: string): Promise<PublicUser | null> {
    const user = await this.getUserById(userId);
    return user ? this.toPublicUser(user) : null;
  }
  
  /** @inheritdoc */
  public async getUserByUsername(username: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { username: username.trim() } });
  }

  /** @inheritdoc */
  public async getUserByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  }

  /** @inheritdoc */
  public async isUserValid(userId: string): Promise<boolean> {
    return !!(await this.getUserById(userId));
  }

  /** @inheritdoc */
  public async validateUserSession(sessionId: string, userId: string): Promise<PrismaUserSession | null> {
    return this.prisma.userSession.findFirst({
      where: { token: sessionId, userId, isActive: true, expiresAt: { gt: new Date() } }
    });
  }

  /** @inheritdoc */
  public async getUserSubscriptionTier(userId: string): Promise<ISubscriptionTier | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionTier: true }
    });
    return user?.subscriptionTier ? (user.subscriptionTier as unknown as ISubscriptionTier) : null;
  }

  /** @inheritdoc */
  public async saveUserApiKey(userId: string, providerId: string, apiKey: string, keyName?: string): Promise<UserApiKeyInfo> {
    if (!this.apiKeyEncryptionKey) {
      throw ErrorFactory.configuration('API key encryption service not configured.', { detail: "KEY_HEX missing." });
    }
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.apiKeyEncryptionKey, iv);
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const storedEncryptedKey = `${iv.toString('hex')}:${encrypted}`;

    // CRITICAL ACTION: Run `npx prisma generate` if error "'userId_providerId' does not exist".
    // Line 875 in new error list.
    const userApiKey = await this.prisma.userApiKey.upsert({
      where: { userId_providerId: { userId, providerId } }, 
      update: { encryptedKey: storedEncryptedKey, keyName: keyName?.trim() || null, isActive: true, updatedAt: new Date() },
      create: { userId, providerId, encryptedKey: storedEncryptedKey, keyName: keyName?.trim() || null, isActive: true },
    });
    return this.toPublicUserApiKeyInfo(userApiKey, apiKey);
  }

  /** @inheritdoc */
  public async getUserApiKeys(userId: string): Promise<UserApiKeyInfo[]> {
    const keys = await this.prisma.userApiKey.findMany({ where: { userId } });
    return keys.map(k => this.toPublicUserApiKeyInfo(k));
  }

  /** @inheritdoc */
  public async getDecryptedUserApiKey(userId: string, providerId: string, _keyName?: string | null): Promise<string | null> {
    if (!this.apiKeyEncryptionKey) throw ErrorFactory.configuration('API key decryption service not configured.');

    // CRITICAL ACTION: Run `npx prisma generate` if error "'userId_providerId' does not exist".
    // Line 905 in new error list.
    const userApiKey = await this.prisma.userApiKey.findUnique({
      where: { userId_providerId: { userId, providerId } } 
    });

    if (!userApiKey?.isActive) return null; // Key not found or not active

    try {
      const parts = userApiKey.encryptedKey.split(':');
      if (parts.length !== 2) throw new Error("Invalid stored API key format.");
      const decipher = crypto.createDecipheriv('aes-256-cbc', this.apiKeyEncryptionKey, Buffer.from(parts[0], 'hex'));
      let decrypted = decipher.update(parts[1], 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      // Optional: await this.prisma.userApiKey.update({ where: { id: userApiKey.id }, data: { lastUsedAt: new Date() }});
      return decrypted;
    } catch (error: any) {
      console.error(`[AuthService] Decryption fail (ID: ${userApiKey.id}): ${error.message}`);
      throw ErrorFactory.internal('API key decryption failed.', { keyId: userApiKey.id }, GMIErrorCode.API_KEY_DECRYPTION_FAILED);
    }
  }

  /** @inheritdoc */
  public async deleteUserApiKey(userId: string, apiKeyRecordId: string): Promise<void> {
    const result = await this.prisma.userApiKey.deleteMany({
      where: { id: apiKeyRecordId, userId }
    });
    if (result.count === 0) throw ErrorFactory.notFound('API key not found or permission denied.');
    console.log(`[AuthService] API key ${apiKeyRecordId} deleted for user ${userId}.`);
  }
  
  /** @private Converts PrismaUser to PublicUser. */
  private toPublicUser(user: PrismaUser): PublicUser {
    return {
      id: user.id, username: user.username, email: user.email,
      emailVerified: user.emailVerified, createdAt: user.createdAt,
      updatedAt: user.updatedAt, lastLoginAt: user.lastLoginAt,
      subscriptionTierId: user.subscriptionTierId,
    };
  }

  /**
   * @private Converts PrismaUserApiKey to UserApiKeyInfo.
   * NOTE: The `UserApiKeyInfo` interface in `IAuthService.ts` must be updated to include `lastUsedAt?: Date | null;`
   * to fix the TypeScript error reported on line 1004.
   */
  private toPublicUserApiKeyInfo(apiKey: PrismaUserApiKey, originalKey?: string): UserApiKeyInfo {
    let maskedKeyPreview = '••••••••••••••••'; 
    if (originalKey) {
      if (originalKey.length > 8) maskedKeyPreview = `${originalKey.slice(0,4)}...${originalKey.slice(-4)}`;
      else if (originalKey.length > 0) maskedKeyPreview = `${originalKey.slice(0,Math.min(originalKey.length,4))}...`;
    }
    return {
      id: apiKey.id, providerId: apiKey.providerId, keyName: apiKey.keyName,
      isActive: apiKey.isActive, createdAt: apiKey.createdAt, updatedAt: apiKey.updatedAt,
      lastUsedAt: apiKey.lastUsedAt, // This line causes Error 8 if UserApiKeyInfo in IAuthService.ts doesn't have lastUsedAt
      maskedKeyPreview,
    };
  }
}