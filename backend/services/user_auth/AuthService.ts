/**
 * @file backend/services/user_auth/AuthService.ts
 * @module backend/services/user_auth/AuthService
 * @version 1.2.1
 *
 * @description
 * This service provides the concrete implementation for user authentication and management,
 * as defined by the `IAuthService` interface. It handles:
 * - User registration with email/password, including secure password hashing and email verification token generation.
 * - User login with traditional credentials (email/username and password).
 * - Google OAuth 2.0 integration for user sign-in and sign-up.
 * - Secure session management using JSON Web Tokens (JWTs), including token generation and validation against database sessions.
 * - Password management features: changing passwords and handling password reset requests (token generation and reset).
 * - Email verification handling.
 * - User profile updates (username, email).
 * - Secure storage (AES-256-CBC encryption) and retrieval of user-provided API keys for external LLM services.
 *
 * It utilizes Prisma for database operations, `bcrypt` for password hashing, `jsonwebtoken` for JWTs,
 * and `google-auth-library` for Google OAuth interactions. All error handling is standardized through `GMIError`
 * and the `ErrorFactory`.
 *
 * Key Dependencies:
 * - `@prisma/client`: For database interaction.
 * - `bcrypt`: For password hashing.
 * - `jsonwebtoken`: For JWT creation and verification.
 * - `google-auth-library`: For Google OAuth 2.0 flows.
 * - `../../utils/errors`: For custom error classes and factory.
 * - `./IAuthService`, `./User`, `./SubscriptionTier`: For service contracts and related types.
 *
 * Configuration for JWT, API key encryption, and OAuth providers is expected to be available
 * via environment variables or a configuration object passed to the constructor/initializer.
 */

import {
  PrismaClient,
  User as PrismaUser,
  UserApiKey as PrismaUserApiKey,
  UserSession as PrismaUserSession,
  Account as PrismaAccount,
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
  UserProfileUpdateData,
} from './IAuthService';
import { PublicUser } from './User'; // Assuming PublicUser is from your User.ts
import { ISubscriptionTier } from './SubscriptionTier';

export class AuthService implements IAuthService {
  private prisma: PrismaClient;
  private jwtSecret: string;
  private jwtExpiresIn: string;
  private apiKeyEncryptionKey?: Buffer; // Must be 32 bytes for AES-256
  private googleOAuthClient?: OAuth2Client;
  private googleCallbackUrl?: string;

  // private emailService: IEmailService; // Placeholder for a dedicated email service instance

  /**
   * Constructs an instance of the AuthService.
   * Initializes JWT settings, API key encryption parameters, and the Google OAuth client
   * based on the provided configuration object or environment variables.
   * It performs initial checks for critical security configurations.
   *
   * @constructor
   * @param {PrismaClient} prisma - The Prisma client instance for database interactions.
   * @param {object} [config] - Optional configuration overrides for service parameters.
   * @param {string} [config.jwtSecret] - Secret key for JWT signing. Defaults to `process.env.JWT_SECRET`.
   * @param {string} [config.jwtExpiresIn] - Expiration duration for JWTs (e.g., "7d"). Defaults to `process.env.JWT_EXPIRES_IN`.
   * @param {string} [config.apiKeyEncryptionKeyHex] - 32-byte HEX string for AES-256 encryption of API keys. Defaults to `process.env.API_KEY_ENCRYPTION_KEY_HEX`.
   * @param {string} [config.googleClientId] - Google OAuth Client ID. Defaults to `process.env.GOOGLE_CLIENT_ID`.
   * @param {string} [config.googleClientSecret] - Google OAuth Client Secret. Defaults to `process.env.GOOGLE_CLIENT_SECRET`.
   * @param {string} [config.googleCallbackUrl] - Google OAuth Callback URL. Defaults to `process.env.GOOGLE_CALLBACK_URL`.
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
    // emailService?: IEmailService, // Future: inject email service for DI
  ) {
    this.prisma = prisma;
    // this.emailService = emailService;

    // Initialize JWT settings
    this.jwtSecret = config?.jwtSecret || process.env.JWT_SECRET || 'UNSAFE_DEFAULT_JWT_SECRET_CHANGE_ME_PLEASE_!@#$%^&*()_+';
    this.jwtExpiresIn = config?.jwtExpiresIn || process.env.JWT_EXPIRES_IN || '7d';

    if (this.jwtSecret === 'UNSAFE_DEFAULT_JWT_SECRET_CHANGE_ME_PLEASE_!@#$%^&*()_+' || (this.jwtSecret || '').length < 64) {
      if (process.env.NODE_ENV === 'production') {
        console.error("CRITICAL SECURITY WARNING: JWT_SECRET is weak or using default. This is highly insecure for production. Please set a strong, random secret of at least 64 characters in your environment variables.");
        // Consider throwing a GMIError.configuration here in production to halt startup
        // throw ErrorFactory.configuration("JWT_SECRET is insecure for production and must be set to a strong random string of at least 64 characters.");
      } else {
        console.warn("⚠️ Development Warning: JWT_SECRET is weak or using default. This is fine for development, but ensure it is changed for any staging or production environment with a strong, random secret of at least 64 characters.");
      }
    }

    // Initialize API Key Encryption
    const apiKeyHex = config?.apiKeyEncryptionKeyHex || process.env.API_KEY_ENCRYPTION_KEY_HEX;
    if (apiKeyHex) {
      try {
        const keyBuffer = Buffer.from(apiKeyHex, 'hex');
        if (keyBuffer.length !== 32) { // AES-256 requires a 32-byte key
          console.warn(`⚠️ API_KEY_ENCRYPTION_KEY_HEX is not 32 bytes long (is ${keyBuffer.length} bytes). AES-256 encryption will be compromised or fail. Ensure it's a 64-character hex string.`);
        } else {
          this.apiKeyEncryptionKey = keyBuffer;
          console.log("✅ API Key Encryption key loaded successfully.");
        }
      } catch (e) {
        console.warn(`⚠️ Invalid API_KEY_ENCRYPTION_KEY_HEX format. It must be a valid hex string. API key encryption will be disabled: ${(e as Error).message}`);
      }
    } else {
      console.warn("⚠️ API_KEY_ENCRYPTION_KEY_HEX is not set in environment variables or config. User API key storage will be unencrypted and is highly insecure.");
    }

    // Initialize Google OAuth Client
    this._initializeGoogleClient(config);
  }

  /**
   * Initializes or re-initializes the Google OAuth client.
   * This method centralizes the logic for setting up the OAuth2Client instance,
   * allowing it to be called from the constructor and the main `initialize` method.
   *
   * @private
   * @method _initializeGoogleClient
   * @param {object} [config] - Optional configuration containing Google OAuth credentials.
   * @param {string} [config.googleClientId]
   * @param {string} [config.googleClientSecret]
   * @param {string} [config.googleCallbackUrl]
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
      console.log("✅ Google OAuth client configured and ready.");
    } else {
      const missing: string[] = [];
      if (!googleClientId) missing.push("GOOGLE_CLIENT_ID");
      if (!googleClientSecret) missing.push("GOOGLE_CLIENT_SECRET");
      if (!callbackUrl) missing.push("GOOGLE_CALLBACK_URL");
      console.warn(`⚠️ Google OAuth client not configured due to missing variables: ${missing.join(', ')}. Google OAuth login will be unavailable.`);
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
             console.warn("⚠️ API_KEY_ENCRYPTION_KEY_HEX provided in initialize config is not 32 bytes long. Encryption may be compromised.");
        }
      } catch (e) {
          console.warn(`⚠️ Invalid API_KEY_ENCRYPTION_KEY_HEX format in initialize config: ${(e as Error).message}. Encryption may be disabled.`);
      }
    }
    this._initializeGoogleClient(config); // Re-initialize Google client with potentially new config
    console.log("AuthService has been initialized or re-configured.");
  }

  /** @inheritdoc */
  public async registerUser(username: string, email: string, password: string): Promise<PublicUser> {
    if (!password || password.length < 8) {
        throw ErrorFactory.validation('Password must be at least 8 characters long.', { field: 'password', minLength: 8 });
    }
    const normalizedEmail = email.toLowerCase(); // Store and check emails in lowercase for consistency

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: username, mode: 'insensitive' } }, // Case-insensitive username check
          { email: normalizedEmail }
        ]
      }
    });

    if (existingUser) {
      const code = existingUser.username.toLowerCase() === username.toLowerCase() ? GMIErrorCode.REGISTRATION_USERNAME_EXISTS : GMIErrorCode.REGISTRATION_EMAIL_EXISTS;
      const message = code === GMIErrorCode.REGISTRATION_USERNAME_EXISTS ? 'This username is already taken. Please choose a different one.' : 'An account with this email address already exists. Try logging in.';
      throw ErrorFactory.authentication(message, { field: code === GMIErrorCode.REGISTRATION_USERNAME_EXISTS ? 'username' : 'email' }, code);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    // Generate a token for email verification
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        username,
        email: normalizedEmail,
        passwordHash,
        emailVerified: false, // Email starts as unverified
        emailVerificationToken: verificationToken
      }
    });

    // TODO: Implement actual email sending logic via an EmailService.
    // This is a critical step for production readiness.
    // Example:
    // try {
    //   await this.emailService.sendVerificationEmail(user.email, verificationToken, user.username);
    // } catch (emailError) {
    //   console.error(`[AuthService] Failed to send verification email to ${user.email}:`, emailError);
    //   // Potentially log this for ops to monitor, but don't fail the registration itself.
    // }
    console.log(`INFO: User ${user.username} registered. Verification token: ${verificationToken}. (Actual email sending for verification is not implemented in this AuthService stub)`);

    return this.toPublicUser(user);
  }

  /** @inheritdoc */
  public async loginUser(identifier: string, password: string, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult> {
    const normalizedIdentifier = identifier.includes('@') ? identifier.toLowerCase() : identifier;
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }] }
    });

    if (!user) {
      throw ErrorFactory.authentication('Invalid username/email or password.');
    }
    if (!user.passwordHash) {
      throw ErrorFactory.authentication('Password login is not enabled for this account. Please try logging in with Google or another available method.');
    }

    // Optional: Enforce email verification before allowing login
    // if (!user.emailVerified && process.env.REQUIRE_EMAIL_VERIFICATION_FOR_LOGIN === 'true') {
    //   throw ErrorFactory.authentication(
    //     'Your email address has not been verified. Please check your inbox for a verification link, or request a new one.',
    //     { userId: user.id },
    //     GMIErrorCode.AUTHENTICATION_EMAIL_NOT_VERIFIED
    //   );
    // }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw ErrorFactory.authentication('Invalid username/email or password.');
    }

    return this._generateAuthResult(user, deviceInfo, ipAddress);
  }

  /**
   * Generates an authentication result (JWT, session) for a given user.
   * This private helper is used by both password login and OAuth callback handling.
   *
   * @private
   * @method _generateAuthResult
   * @param {PrismaUser} user - The authenticated user object from Prisma.
   * @param {string} [deviceInfo] - Information about the client device.
   * @param {string} [ipAddress] - The client's IP address.
   * @returns {Promise<AuthenticationResult>} The authentication result.
   */
  private async _generateAuthResult(user: PrismaUser, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult> {
    const sessionId = crypto.randomUUID(); // Unique ID for the session record
    const expiresInMs = this._parseJwtExpiresIn(this.jwtExpiresIn);
    const jwtExpiresAtDate = new Date(Date.now() + expiresInMs);

    // Create a new session in the database
    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        token: sessionId, // This 'token' field in UserSession is used as the session's own unique ID.
        deviceInfo: deviceInfo ? deviceInfo.substring(0, 255) : undefined, // Truncate if necessary
        ipAddress,
        expiresAt: jwtExpiresAtDate, // Session DB record expiry should match JWT expiry
        lastAccessed: new Date(), // Set on creation
      }
    });

    // Create JWT payload
    const tokenPayload: AuthTokenPayload = {
      userId: user.id,
      username: user.username,
      sessionId: session.id, // Embed the DB session ID in the JWT
      // roles: user.roles || [], // If you add roles to your User model
    };
    const token = jwt.sign(tokenPayload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });

    // Update last login time for the user
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return { user: this.toPublicUser(user), token, tokenExpiresAt: jwtExpiresAtDate, session };
  }

  /**
   * Parses a JWT expiration string (e.g., "7d", "1h") into milliseconds.
   * @private
   */
  private _parseJwtExpiresIn(expiresInString: string): number {
    const unit = expiresInString.slice(-1).toLowerCase();
    const valueString = expiresInString.slice(0, -1);
    const value = parseInt(valueString, 10);

    if (isNaN(value) || value <= 0) {
        console.warn(`[AuthService] Invalid JWT_EXPIRES_IN value: "${expiresInString}". Defaulting to 7 days (604800000 ms).`);
        return 7 * 24 * 60 * 60 * 1000; // Default to 7 days
    }

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default:
            // If no unit or unknown unit, and the original string was just a number, assume seconds.
            if (valueString === expiresInString) {
                console.warn(`[AuthService] JWT_EXPIRES_IN ("${expiresInString}") has no unit, assuming seconds.`);
                return value * 1000;
            }
            console.warn(`[AuthService] Unknown unit in JWT_EXPIRES_IN: "${unit}" for value "${expiresInString}". Defaulting to 7 days.`);
            return 7 * 24 * 60 * 60 * 1000;
    }
  }

  /** @inheritdoc */
  public async logoutUser(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as AuthTokenPayload;
      // Ensure sessionId is present in the decoded token payload.
      if (decoded?.sessionId) {
        await this.prisma.userSession.updateMany({
          where: { id: decoded.sessionId, userId: decoded.userId, isActive: true },
          data: { isActive: false, expiresAt: new Date() } // Mark as inactive and expire immediately
        });
      }
    } catch (error) {
      // Log the error but don't let it fail the client's attempt to "logout" (i.e., discard their token).
      // The token might be already invalid or expired, in which case verify would throw.
      console.warn('[AuthService] Error during server-side session invalidation on logout (token might be already invalid):', (error as Error).message);
    }
  }

  /** @inheritdoc */
  public async validateToken(token: string): Promise<AuthTokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as AuthTokenPayload;

      // After JWT validation, also check if the corresponding session in the DB is still active and valid.
      const session = await this.prisma.userSession.findUnique({
        where: {
          id: decoded.sessionId, // Assuming sessionId in JWT payload matches UserSession.id
          userId: decoded.userId,
          isActive: true,
          expiresAt: { gt: new Date() }, // Session should not be past its DB expiry
        }
      });

      return session ? decoded : null; // If session not found or invalid, treat token as invalid.
    } catch (error) {
      // Handles JWT errors: TokenExpiredError, JsonWebTokenError (malformed, invalid signature)
      return null;
    }
  }

  /** @inheritdoc */
  public async verifyEmail(verificationToken: string): Promise<PrismaUser> {
    if (!verificationToken || typeof verificationToken !== 'string' || verificationToken.length === 0) {
        throw ErrorFactory.validation("A valid email verification token is required.");
    }
    const user = await this.prisma.user.findUnique({
        where: { emailVerificationToken: verificationToken },
    });

    if (!user) {
        // To prevent token scanning or information leakage, avoid confirming token invalidity too specifically if it might be simply expired or already used.
        throw ErrorFactory.validation("The email verification link is invalid or has expired. Please request a new verification email if needed.", {}, GMIErrorCode.EMAIL_VERIFICATION_TOKEN_INVALID);
    }

    // Optional: Add a check for token expiry if you implement time-limited verification tokens.
    // if (user.emailVerificationTokenExpiresAt && new Date() > user.emailVerificationTokenExpiresAt) {
    //   throw ErrorFactory.validation("The email verification link has expired.", {}, GMIErrorCode.EMAIL_VERIFICATION_TOKEN_INVALID);
    // }

    if (user.emailVerified) {
        // Email is already verified. Optionally, clear the token.
        // Depending on flow, this could be an info message rather than an error.
        // For now, return the user.
        // await this.prisma.user.update({ where: { id: user.id }, data: { emailVerificationToken: null } });
        console.log(`[AuthService] Email for user ${user.id} is already verified.`);
        return user;
    }

    return this.prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: true,
            emailVerificationToken: null, // Important: Invalidate the token after use
            updatedAt: new Date(),
        },
    });
  }

  /** @inheritdoc */
  public async updateUserProfile(userId: string, data: UserProfileUpdateData): Promise<PublicUser> {
    const user = await this.getUserById(userId);
    if (!user) {
        throw ErrorFactory.notFound("User not found. Profile update failed.");
    }

    const updatePayload: {
        username?: string;
        email?: string;
        emailVerified?: boolean;
        emailVerificationToken?: string | null;
        updatedAt: Date;
    } = { updatedAt: new Date() };

    let emailChangedRequiresVerification = false;

    // Validate and prepare username update
    if (data.username && typeof data.username === 'string' && data.username.trim() !== user.username) {
        const newUsername = data.username.trim();
        if (newUsername.length < 3) throw ErrorFactory.validation("Username must be at least 3 characters.", { field: "username" });
        const existingByUsername = await this.prisma.user.findFirst({ where: { username: { equals: newUsername, mode: 'insensitive' }, NOT: { id: userId } } });
        if (existingByUsername) {
            throw ErrorFactory.validation("This username is already taken. Please choose another.", { field: "username" }, GMIErrorCode.REGISTRATION_USERNAME_EXISTS);
        }
        updatePayload.username = newUsername;
    }

    // Validate and prepare email update
    if (data.email && typeof data.email === 'string' && data.email.toLowerCase() !== user.email) {
        const newEmail = data.email.toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) throw ErrorFactory.validation("Invalid email format provided.", { field: "email" });

        const existingByEmail = await this.prisma.user.findFirst({ where: { email: newEmail, NOT: { id: userId } } });
        if (existingByEmail) {
            throw ErrorFactory.validation("This email address is already associated with another account.", { field: "email" }, GMIErrorCode.REGISTRATION_EMAIL_EXISTS);
        }
        updatePayload.email = newEmail;
        updatePayload.emailVerified = false; // New email requires new verification
        updatePayload.emailVerificationToken = crypto.randomBytes(32).toString('hex');
        emailChangedRequiresVerification = true;
    }

    // Only proceed with update if there are actual changes other than just 'updatedAt'
    if (Object.keys(updatePayload).length <= 1 && !emailChangedRequiresVerification && !updatePayload.username) {
        console.log(`[AuthService] No actual profile changes detected for user ${userId}.`);
        return this.toPublicUser(user); // Return current public user if no changes
    }

    const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updatePayload,
    });

    if (emailChangedRequiresVerification && updatedUser.emailVerificationToken) {
        // TODO: Send new verification email to updatedUser.email with updatedUser.emailVerificationToken
        // await this.emailService.sendVerificationEmail(updatedUser.email, updatedUser.emailVerificationToken, updatedUser.username);
        console.log(`INFO: User ${updatedUser.username}'s email changed to ${updatedUser.email}. New verification token: ${updatedUser.emailVerificationToken}. (Actual email sending not implemented)`);
    }

    return this.toPublicUser(updatedUser);
  }


  // --- OAuth Methods ---
  /** @inheritdoc */
  public async initiateGoogleOAuth(): Promise<OAuthInitiateResult> {
    if (!this.googleOAuthClient || !this.googleCallbackUrl) {
      throw ErrorFactory.configuration(
        'Google OAuth is not configured on the server. Please check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL environment variables.',
        { provider: 'google' },
        GMIErrorCode.OAUTH_PROVIDER_NOT_CONFIGURED
      );
    }
    const scopes = [
      'openid', // Standard OIDC scope for basic profile info
      'https://www.googleapis.com/auth/userinfo.profile', // Access user's basic profile (name, picture)
      'https://www.googleapis.com/auth/userinfo.email',   // Access user's primary email address
    ];
    // Ensure redirect_uri is explicitly passed and matches one configured in Google Cloud Console.
    const redirectUrl = this.googleOAuthClient.generateAuthUrl({
      access_type: 'offline', // 'offline' to request a refresh token, useful for long-term access if needed by the app.
      scope: scopes,
      // prompt: 'consent', // Optional: forces the consent screen every time. Good for development/testing, usually removed for production for better UX.
      redirect_uri: this.googleCallbackUrl,
    });
    return { redirectUrl };
  }

  /** @inheritdoc */
  public async handleGoogleOAuthCallback(code: string, deviceInfo?: string, ipAddress?: string): Promise<AuthenticationResult> {
    if (!this.googleOAuthClient) { // Should be initialized by constructor or initialize()
      throw ErrorFactory.configuration('Google OAuth client is not initialized.', { provider: 'google' }, GMIErrorCode.OAUTH_PROVIDER_NOT_CONFIGURED);
    }

    try {
      // Exchange authorization code for tokens
      const { tokens } = await this.googleOAuthClient.getToken(code);
      this.googleOAuthClient.setCredentials(tokens); // Use tokens for subsequent Google API calls if needed

      if (!tokens.id_token) {
        throw ErrorFactory.authentication('Google OAuth authentication failed: ID token was not returned by Google.', { provider: 'google' }, GMIErrorCode.OAUTH_ID_TOKEN_MISSING);
      }

      // Verify the ID token and get user profile information
      const ticket = await this.googleOAuthClient.verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of your application
      });
      const payload: GoogleTokenPayload | undefined = ticket.getPayload();

      if (!payload || !payload.sub || !payload.email) {
        throw ErrorFactory.authentication('Google OAuth authentication failed: Invalid ID token payload received from Google.', { provider: 'google', payloadKeys: payload ? Object.keys(payload) : null }, GMIErrorCode.OAUTH_INVALID_TOKEN_PAYLOAD);
      }

      const googleUserId: string = payload.sub; // Google's unique ID for the user
      const email: string = payload.email.toLowerCase(); // Normalize email
      const emailVerified: boolean = payload.email_verified || false;
      let username: string = payload.name || payload.given_name || email.split('@')[0].replace(/[^a-zA-Z0-9_.-]/g, ''); // Sanitize username derived from email
      if (username.length > 30) username = username.substring(0, 30); // Ensure username length constraints

      // Find or create local user account linked to this Google identity
      let account = await this.prisma.account.findUnique({
        where: { provider_providerAccountId: { provider: 'google', providerAccountId: googleUserId } },
        include: { user: true } // Eager load the associated user
      });

      let localUser: PrismaUser;

      if (account && account.user) { // Case 1: Existing Google Account linked to an existing User
        localUser = account.user;
        // Optionally update stored OAuth tokens in the Account model if they are being stored and have changed
        await this.prisma.account.update({
            where: { id: account.id },
            data: {
                access_token: tokens.access_token || undefined, // Store new access token if available
                refresh_token: tokens.refresh_token || account.refresh_token, // Preserve old refresh token if new one isn't provided by this flow
                expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : account.expires_at, // Update expiry timestamp
                scope: tokens.scope || account.scope, // Update scopes if they changed
                updatedAt: new Date(),
            }
        });
      } else { // Case 2: No existing Google Account record for this specific googleUserId
        // Try to find an existing local user by email (they might have registered with email/password before)
        const existingUserByEmail = await this.prisma.user.findUnique({ where: { email } });

        if (existingUserByEmail) { // Case 2a: User with this email already exists
          localUser = existingUserByEmail;
          // If Google says email is verified and our record doesn't, update our record
          if (!localUser.emailVerified && emailVerified) {
            localUser = await this.prisma.user.update({ where: {id: localUser.id }, data: { emailVerified: true, updatedAt: new Date() }});
          }
        } else { // Case 2b: No user with this email; create a new local user
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

        // Create the Account record to link this Google identity to the localUser (either existing by email or newly created)
        await this.prisma.account.create({
          data: {
            userId: localUser.id,
            provider: 'google',
            providerAccountId: googleUserId,
            access_token: tokens.access_token || undefined,
            refresh_token: tokens.refresh_token || undefined,
            expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : undefined,
            token_type: tokens.token_type || undefined, // e.g., 'Bearer'
            scope: tokens.scope || undefined,
          }
        });
      }

      // Generate local application session (JWT) for the authenticated localUser
      return this._generateAuthResult(localUser, deviceInfo, ipAddress);

    } catch (error: any) {
      console.error('[AuthService] Google OAuth Callback Error:', error.response?.data || error.message, error.stack);
      if (error instanceof GMIError) throw error; // Re-throw known GMIError
      // Wrap unknown errors from google-auth-library or other issues
      throw ErrorFactory.authentication('Google OAuth authentication process failed unexpectedly.', { provider: 'google', details: error.message }, GMIErrorCode.OAUTH_AUTHENTICATION_FAILED);
    }
  }


  /**
   * Generates a unique username by appending a counter if the base username is taken.
   * @private
   */
  private async _generateUniqueUsername(baseUsername: string): Promise<string> {
    let attempt = 0;
    let currentUsername = baseUsername.replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 30); // Sanitize and limit length
    if (!currentUsername) currentUsername = "user"; // Default if sanitization results in empty string

    while (true) {
        const usernameToTest = attempt === 0 ? currentUsername : `${currentUsername}${attempt}`;
        const existing = await this.prisma.user.findUnique({ where: { username: usernameToTest }});
        if (!existing) return usernameToTest;
        attempt++;
        if (attempt > 100) { // Safety break to prevent infinite loops in extreme cases
            return `${currentUsername}_${Date.now()}`; // Fallback to a highly unique name
        }
    }
  }

  // ... Other methods (changePassword, requestPasswordReset, etc.) with JSDoc ...

  /** @inheritdoc */
  public async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.getUserById(userId); // Re-uses the public getter from the interface
    if (!user) {
      throw ErrorFactory.notFound('User not found. Cannot change password.');
    }
    if (!user.passwordHash) {
      throw ErrorFactory.authentication(
        'Password-based login is not set up for this account. Password cannot be changed through this method.',
        { userId },
        GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS // Or a more specific code like PWD_LOGIN_NOT_ENABLED
      );
    }

    const isValidCurrentPassword = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValidCurrentPassword) {
      throw ErrorFactory.authentication('Incorrect current password.', { userId }, GMIErrorCode.AUTHENTICATION_INVALID_CREDENTIALS);
    }

    if (!newPassword || newPassword.length < 8) {
      throw ErrorFactory.validation('New password must be at least 8 characters long.', { field: 'newPassword', minLength: 8 });
    }
    // Add more password complexity rules if needed (e.g., regex for uppercase, number, symbol)

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
        resetPasswordToken: null, // Invalidate any pending password reset tokens
        resetPasswordExpires: null,
      }
    });
    console.log(`[AuthService] Password changed successfully for user ${userId}.`);
  }

  /** @inheritdoc */
  public async requestPasswordReset(email: string): Promise<{ resetToken: string }> {
    const normalizedEmail = email.toLowerCase();
    const user = await this.getUserByEmail(normalizedEmail);

    if (!user) {
      // To prevent email enumeration attacks, do not explicitly state that the email was not found.
      // Log this event server-side for monitoring.
      console.info(`[AuthService] Password reset requested for an email not found in the system: ${normalizedEmail}`);
      // Still return a (dummy) token structure to make the response indistinguishable for non-existent users.
      // The email sending step (if implemented) would simply not send an email.
      return { resetToken: 'simulated_token_for_non_existent_user_not_sent' };
    }

    // Optional: Check if the user account has a passwordHash. If not (e.g., OAuth-only user),
    // the password reset flow might not be applicable, or it could be used to set an initial password.
    // For this implementation, we'll allow it, effectively enabling password setup for OAuth users.
    // if (!user.passwordHash) {
    //   console.info(`[AuthService] Password reset requested for OAuth-only user: ${normalizedEmail}. This will allow them to set a password.`);
    // }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // Token valid for 1 hour (3,600,000 ms)

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken, resetPasswordExpires, updatedAt: new Date() }
    });

    // TODO: Implement actual email sending via an EmailService.
    // Example:
    // try {
    //   await this.emailService.sendPasswordResetEmail(user.email, resetToken, user.username);
    //   console.log(`[AuthService] Password reset email successfully sent to ${user.email}.`);
    // } catch (emailError) {
    //   console.error(`[AuthService] Failed to send password reset email to ${user.email}:`, emailError);
    //   // This is a critical failure. Decide if the operation should throw or if logging is sufficient.
    //   // For now, we'll proceed and return the token for dev/testing, but in prod this would be an issue.
    // }
    console.log(`INFO: Password reset token generated for ${user.email}: ${resetToken}. (Actual email sending is not implemented in this AuthService stub)`);
    // IMPORTANT: In a production app, the token should ONLY be sent via email, not returned in the API response.
    return { resetToken };
  }

  /** @inheritdoc */
  public async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    if (!newPassword || newPassword.length < 8) {
      throw ErrorFactory.validation('New password must be at least 8 characters long.');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: { gt: new Date() } // Check if token is not expired
      }
    });

    if (!user) {
      throw ErrorFactory.authentication('Password reset token is invalid, has expired, or has already been used.', {}, GMIErrorCode.PASSWORD_RESET_TOKEN_INVALID);
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetPasswordToken: null, // Invalidate the token after successful use
        resetPasswordExpires: null,
        emailVerified: user.emailVerified || true, // Consider email verified if they successfully reset password
        updatedAt: new Date()
      }
    });
    console.log(`[AuthService] Password successfully reset for user ${user.id}.`);
  }

  /** @inheritdoc */
  public async getUserById(userId: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  /** @inheritdoc */
  public async getPublicUserById(userId: string): Promise<PublicUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user ? this.toPublicUser(user) : null;
  }

  /** @inheritdoc */
  public async getUserByUsername(username: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  /** @inheritdoc */
  public async getUserByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  /** @inheritdoc */
  public async isUserValid(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    // Add more checks if needed, e.g., !user.isBanned, user.isActive (if such fields exist)
    return !!user; // && (user.emailVerified || process.env.SKIP_EMAIL_VERIFICATION_CHECK === 'true');
  }

  /** @inheritdoc */
  public async validateUserSession(sessionId: string, userId: string): Promise<PrismaUserSession | null> {
    return this.prisma.userSession.findFirst({
      where: { id: sessionId, userId: userId, isActive: true, expiresAt: { gt: new Date() } }
    });
  }

  /** @inheritdoc */
  public async getUserSubscriptionTier(userId: string): Promise<ISubscriptionTier | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionTier: true }
    });
    // This assumes that the PrismaSubscriptionTier type is assignable to ISubscriptionTier.
    // If not, a mapping function would be required here.
    return user?.subscriptionTier as ISubscriptionTier ?? null;
  }

  /** @inheritdoc */
  public async saveUserApiKey(userId: string, providerId: string, apiKey: string, keyName?: string): Promise<UserApiKeyInfo> {
    if (!this.apiKeyEncryptionKey) {
      throw ErrorFactory.configuration('API key encryption service is not properly configured. Cannot save API key.', { detail: "API_KEY_ENCRYPTION_KEY_HEX is missing or invalid." });
    }

    const iv = crypto.randomBytes(16); // Generate a new, unique IV for each encryption
    const cipher = crypto.createCipheriv('aes-256-cbc', this.apiKeyEncryptionKey, iv);
    let encryptedPayload = cipher.update(apiKey, 'utf8', 'hex');
    encryptedPayload += cipher.final('hex');
    // Store IV along with the encrypted key, separated by a delimiter (e.g., ':')
    const storedEncryptedKey = `${iv.toString('hex')}:${encryptedPayload}`;

    // Upsert based on the unique constraint (userId, providerId) from your schema
    // This means if a key for this user and provider already exists, it will be updated.
    // The keyName is purely descriptive in this scenario.
    const userApiKey = await this.prisma.userApiKey.upsert({
      where: { userId_providerId: { userId, providerId } },
      update: { encryptedKey: storedEncryptedKey, keyName: keyName || null, isActive: true, updatedAt: new Date() },
      create: { userId, providerId, encryptedKey: storedEncryptedKey, keyName: keyName || null, isActive: true, lastUsedAt: null },
    });
    return this.toPublicUserApiKeyInfo(userApiKey, apiKey); // Pass original key for masking
  }

  /** @inheritdoc */
  public async getUserApiKeys(userId: string): Promise<UserApiKeyInfo[]> {
    const apiKeys = await this.prisma.userApiKey.findMany({ where: { userId } });
    // When listing keys, we don't pass the original key for masking, so a generic mask will be used.
    return apiKeys.map(k => this.toPublicUserApiKeyInfo(k));
  }

  /** @inheritdoc */
  public async getDecryptedUserApiKey(userId: string, providerId: string, keyName?: string | null): Promise<string | null> {
    // Note: `keyName` is currently not part of the primary lookup due to the `@@unique([userId, providerId])` constraint.
    // If the schema changes to allow multiple named keys for the same provider, this lookup must be adjusted.
    if (!this.apiKeyEncryptionKey) {
        console.warn("[AuthService] API key decryption attempted, but API_KEY_ENCRYPTION_KEY_HEX is not configured. Decryption is not possible.");
        // Depending on policy, either return null or throw a configuration error.
        // For safety and to prevent unexpected behavior, throwing might be better if encryption is expected.
        throw ErrorFactory.configuration('API key decryption service is not configured.');
    }

    const userApiKey = await this.prisma.userApiKey.findUnique({
      where: { userId_providerId: { userId, providerId }, isActive: true } // Fetch the active key for this user/provider
    });

    if (!userApiKey || !userApiKey.isActive) {
      return null; // Key not found, not active, or (if keyName were used for lookup) specific named key not found.
    }

    try {
      const parts = userApiKey.encryptedKey.split(':');
      if (parts.length !== 2) { // Expected format: "ivHex:encryptedTextHex"
        throw new Error("Invalid stored encrypted API key format: IV is missing or format is incorrect.");
      }
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = parts[1];
      const decipher = crypto.createDecipheriv('aes-256-cbc', this.apiKeyEncryptionKey, iv);
      let decryptedKey = decipher.update(encryptedText, 'hex', 'utf8');
      decryptedKey += decipher.final('utf8');

      // Optional: Update lastUsedAt timestamp (consider performance if this is called very frequently)
      // await this.prisma.userApiKey.update({ where: { id: userApiKey.id }, data: { lastUsedAt: new Date() }});
      return decryptedKey;
    } catch (error: any) {
      console.error(`[AuthService] Failed to decrypt API key (ID: ${userApiKey.id}) for user ${userId}, provider ${providerId}: ${error.message}`);
      // Do not expose underlying crypto error details to the client.
      throw ErrorFactory.internal('Failed to access API key due to a decryption error. Please check server logs.', { keyId: userApiKey.id }, GMIErrorCode.API_KEY_DECRYPTION_FAILED);
    }
  }

  /** @inheritdoc */
  public async deleteUserApiKey(userId: string, apiKeyRecordId: string): Promise<void> {
    // Verify the key belongs to the user making the request before deletion.
    const result = await this.prisma.userApiKey.deleteMany({
      where: { id: apiKeyRecordId, userId: userId }
    });

    if (result.count === 0) {
      // Key not found or didn't belong to the user.
      throw ErrorFactory.notFound('API key not found or you do not have permission to delete this key.');
    }
    console.log(`[AuthService] API key record ${apiKeyRecordId} deleted for user ${userId}.`);
  }

  /**
   * Converts a PrismaUser object (from database) to a PublicUser object,
   * which is safe for client-side exposure as it omits sensitive fields.
   *
   * @private
   * @method toPublicUser
   * @param {PrismaUser} user - The Prisma user object.
   * @returns {PublicUser} The public representation of the user.
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
   * Converts a PrismaUserApiKey object (from database) to a UserApiKeyInfo object,
   * which is safe for client-side exposure. It includes a masked preview of the key.
   *
   * @private
   * @method toPublicUserApiKeyInfo
   * @param {PrismaUserApiKey} apiKey - The Prisma API key object.
   * @param {string} [originalKeyForMasking] - Optional: The original plain-text key, if available (e.g., immediately after saving).
   * Used to create a more informative mask. If not provided, a generic mask is used.
   * @returns {UserApiKeyInfo} The public representation of the API key.
   */
  private toPublicUserApiKeyInfo(apiKey: PrismaUserApiKey, originalKeyForMasking?: string): UserApiKeyInfo {
    let maskedKeyPreview = '••••••••••••••••'; // Default generic mask
    if (originalKeyForMasking) {
      if (originalKeyForMasking.length > 8) {
        maskedKeyPreview = `${originalKeyForMasking.substring(0, 4)}...${originalKeyForMasking.substring(originalKeyForMasking.length - 4)}`;
      } else if (originalKeyForMasking.length > 0) { // For very short keys, show first few chars
        maskedKeyPreview = `${originalKeyForMasking.substring(0, Math.min(originalKeyForMasking.length, 4))}...`;
      }
    }
    // If originalKeyForMasking is not provided (e.g., when listing keys from DB), the default generic mask is used.

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