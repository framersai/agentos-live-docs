/**
 * @fileoverview OAuth Service for handling multiple OAuth providers.
 * Supports Google, GitHub, and is extensible for additional providers.
 * @module backend/services/user_auth/OAuthService
 * @version 1.0.0
 */

// ACTION REQUIRED: Install Octokit if you haven't already:
// npm install @octokit/rest
// or
// yarn add @octokit/rest
import { OAuth2Client, TokenPayload as GoogleTokenPayload } from 'google-auth-library';
import { Octokit } from '@octokit/rest'; // Ensure this package is installed
import { PrismaClient, User as PrismaUser, Account as PrismaAccount } from '@prisma/client';
import { GMIError, GMIErrorCode, ErrorFactory } from '../../utils/errors'; // Assuming ErrorFactory is correctly defined in errors.ts
import { IAuthService, AuthenticationResult, OAuthInitiateResult } from './IAuthService';
import crypto from 'crypto';

/**
 * @interface OAuthProvider
 * @description Configuration for an OAuth provider.
 * @property {string} id - Unique identifier for the provider (e.g., "google", "github").
 * @property {string} name - Display name for the provider (e.g., "Google", "GitHub").
 * @property {boolean} enabled - Whether this provider is currently enabled.
 * @property {string} clientId - OAuth client ID obtained from the provider.
 * @property {string} clientSecret - OAuth client secret obtained from the provider.
 * @property {string} callbackUrl - The callback URL registered with the provider.
 * @property {string[]} scopes - Array of scopes to request from the provider.
 */
export interface OAuthProvider {
  id: string;
  name: string;
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  scopes: string[];
}

/**
 * @interface OAuthUserInfo
 * @description Standardized structure for user information retrieved from an OAuth provider.
 * @property {string} providerId - Identifier of the OAuth provider (e.g., "google").
 * @property {string} providerUserId - User's unique ID within the OAuth provider.
 * @property {string} email - User's email address.
 * @property {boolean} emailVerified - Whether the email address is verified by the provider.
 * @property {string} [name] - User's full name.
 * @property {string} [username] - User's username or login name on the provider.
 * @property {string} [avatarUrl] - URL to the user's avatar image.
 */
export interface OAuthUserInfo {
  providerId: string;
  providerUserId: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  username?: string;
  avatarUrl?: string;
}

/**
 * @interface IOAuthService
 * @description Defines the contract for the OAuthService.
 */
export interface IOAuthService {
  /** Initializes the service with a list of provider configurations. */
  initialize(providers: OAuthProvider[]): Promise<void>;
  /** Initiates the OAuth flow for a given provider, returning a redirect URL. */
  initiateOAuth(providerId: string, state?: string): Promise<OAuthInitiateResult>;
  /** Handles the OAuth callback from the provider, processes the authorization code, and returns an authentication result. */
  handleOAuthCallback(
    providerId: string, 
    code: string, 
    state?: string, // Optional: For state validation
    deviceInfo?: string,
    ipAddress?: string
  ): Promise<AuthenticationResult>;
  /** Fetches standardized user information from a provider using an access token. */
  getUserInfo(providerId: string, accessToken: string, idToken?:string): Promise<OAuthUserInfo>; // Added idToken for Google
  /** Refreshes an access token using a refresh token for a given provider. */
  refreshToken(providerId: string, refreshToken: string): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: number }>;
  /** Gets a list of currently enabled OAuth providers. */
  getEnabledProviders(): Pick<OAuthProvider, 'id' | 'name' | 'enabled'>[]; // Return only public info
  /** Checks if a specific provider is enabled. */
  isProviderEnabled(providerId: string): boolean;
}

/**
 * @class OAuthService
 * @implements {IOAuthService}
 * @description Service for managing OAuth 2.0 authentication with various providers.
 */
export class OAuthService implements IOAuthService {
  private providers: Map<string, OAuthProvider> = new Map();
  private googleClient?: OAuth2Client;
  // GitHub Octokit client is typically instantiated per-request with the user's token,
  // or with app credentials for app-level interactions. For user OAuth, client_id/secret are used for token exchange.
  // We don't need a persistent githubClient instance here for user OAuth flow if using fetch for token exchange.

  /**
   * Constructs an OAuthService instance.
   * @param {PrismaClient} prisma - The Prisma client for database operations.
   * @param {IAuthService} authService - The local authentication service for linking accounts and generating sessions.
   */
  constructor(
    private prisma: PrismaClient,
    private authService: IAuthService // Used for final local session generation
  ) {}

  /** @inheritdoc */
  async initialize(providers: OAuthProvider[]): Promise<void> {
    console.log('[OAuthService] Initializing OAuth providers...');
    this.providers.clear(); // Clear existing providers if re-initializing

    for (const provider of providers) {
      if (provider.enabled && provider.clientId && provider.clientSecret && provider.callbackUrl) {
        this.providers.set(provider.id, provider);
        await this.initializeProviderClient(provider);
      } else if (provider.enabled) {
        console.warn(`[OAuthService] ⚠️ Provider '${provider.id}' is enabled but missing critical configuration (clientId, clientSecret, or callbackUrl). It will be disabled.`);
      }
    }
    console.log(`[OAuthService] Initialized ${this.providers.size} OAuth provider(s).`);
  }

  /**
   * Initializes the client instance for a specific OAuth provider.
   * @private
   */
  private async initializeProviderClient(provider: OAuthProvider): Promise<void> {
    switch (provider.id) {
      case 'google':
        this.googleClient = new OAuth2Client(
          provider.clientId,
          provider.clientSecret,
          provider.callbackUrl
        );
        console.log('✅ [OAuthService] Google OAuth client initialized.');
        break;
      case 'github':
        // No persistent client needed here for user OAuth if using fetch for token exchange.
        // Octokit would be new Octokit({ auth: accessToken }) for API calls post-auth.
        console.log('✅ [OAuthService] GitHub OAuth provider configured (token exchange via fetch).');
        break;
      default:
        console.warn(`[OAuthService] ⚠️ No specific client initialization for OAuth provider: ${provider.id}`);
    }
  }

  /** @inheritdoc */
  async initiateOAuth(providerId: string, state?: string): Promise<OAuthInitiateResult> {
    const provider = this.providers.get(providerId);
    if (!provider || !provider.enabled) {
      throw ErrorFactory.notFound(`OAuth provider '${providerId}' not found or not enabled.`);
    }

    const oAuthState = state || crypto.randomBytes(16).toString('hex');

    switch (providerId) {
      case 'google':
        if (!this.googleClient) throw ErrorFactory.configuration('Google OAuth client not initialized.');
        const googleAuthUrl = this.googleClient.generateAuthUrl({
          access_type: 'offline', // To get a refresh_token
          scope: provider.scopes,
          state: oAuthState,
          prompt: 'consent', // Useful to ensure refresh_token is issued, can be removed for better UX later
          redirect_uri: provider.callbackUrl, // Explicitly set redirect_uri
        });
        return { redirectUrl: googleAuthUrl, state: oAuthState };

      case 'github':
        const githubScopes = provider.scopes.join(' ');
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(provider.clientId)}&redirect_uri=${encodeURIComponent(provider.callbackUrl)}&scope=${encodeURIComponent(githubScopes)}&state=${encodeURIComponent(oAuthState)}`;
        return { redirectUrl: githubAuthUrl, state: oAuthState };

      default:
        // ACTION REQUIRED: Define `ErrorFactory.notImplemented` or use `new GMIError(...)`
        throw new GMIError(`OAuth provider '${providerId}' not implemented.`, GMIErrorCode.NOT_IMPLEMENTED);
    }
  }
  
  /** @inheritdoc */
  async handleOAuthCallback(
    providerId: string,
    code: string,
    state?: string, // Optional: for state validation if you implement it
    deviceInfo?: string,
    ipAddress?: string
  ): Promise<AuthenticationResult> {
    const provider = this.providers.get(providerId);
    if (!provider || !provider.enabled) {
      throw ErrorFactory.notFound(`OAuth provider '${providerId}' not found or disabled.`);
    }

    // Optional: Validate the 'state' parameter here if you're using it to prevent CSRF.

    // 1. Exchange authorization code for tokens
    const tokens = await this.exchangeCodeForTokens(provider, code);
    if (!tokens.access_token) {
        throw ErrorFactory.authentication(`Failed to get access token from ${provider.name}.`, { provider: providerId }, GMIErrorCode.OAUTH_TOKEN_EXCHANGE_FAILED);
    }
    
    // 2. Get user info from the OAuth provider using the access token (and ID token for Google)
    const userInfo = await this.getUserInfo(provider.id, tokens.access_token, tokens.id_token);
    
    // 3. Find or create a local user in your database
    const localUser = await this.findOrCreateUser(userInfo, provider);
    
    // 4. Create or update the linked OAuth account in your database
    await this.createOrUpdateAccountLink(localUser.id, userInfo, tokens);
    
    // 5. Generate a local session for your application (e.g., JWT)
    // The IAuthService's loginUser usually takes identifier and password.
    // For OAuth, we bypass password check. We need a method in IAuthService or AuthService
    // that can generate a session for an already authenticated user.
    // Assuming `this.authService._generateAuthResult` exists and is accessible or a similar public method.
    // If `this.authService` is an instance of `AuthService` from previous examples:
    if (typeof (this.authService as any)._generateAuthResult === 'function') {
         return (this.authService as any)._generateAuthResult(localUser, deviceInfo, ipAddress);
    } else {
        // Fallback or throw error if direct session generation isn't available.
        // This part requires AuthService to have a way to create a session for an externally validated user.
        console.error("[OAuthService] _generateAuthResult not found on authService. Manual session creation needed or update AuthService.");
        throw new GMIError("Failed to generate local session after OAuth.", GMIErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Exchanges an authorization code for access and refresh tokens.
   * @private
   */
  private async exchangeCodeForTokens(provider: OAuthProvider, code: string): Promise<{access_token: string, refresh_token?: string, id_token?: string, expires_in?: number, scope?: string, token_type?: string}> {
    switch (provider.id) {
      case 'google':
        if (!this.googleClient) throw ErrorFactory.configuration('Google OAuth client not initialized.');
        try {
            const { tokens } = await this.googleClient.getToken({ code, redirect_uri: provider.callbackUrl }); // ensure redirect_uri is passed if required by your client setup
            return tokens as any; // Cast needed as getToken can return various token shapes
        } catch (error: any) {
            console.error('[OAuthService] Google token exchange error:', error.response?.data || error.message);
            throw ErrorFactory.authentication('Failed to exchange Google authorization code.', {provider: 'google', details: error.message}, GMIErrorCode.OAUTH_TOKEN_EXCHANGE_FAILED);
        }

      case 'github':
        try {
            const response = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                client_id: provider.clientId,
                client_secret: provider.clientSecret,
                code: code,
                redirect_uri: provider.callbackUrl, // GitHub often requires this
                }),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error('[OAuthService] GitHub token exchange error:', response.status, errorBody);
                throw ErrorFactory.authentication(`Failed to exchange GitHub authorization code: ${response.statusText}`, {provider: 'github', status: response.status, body: errorBody}, GMIErrorCode.OAUTH_TOKEN_EXCHANGE_FAILED);
            }
            return await response.json();
        } catch (error: any) {
            if (error instanceof GMIError) throw error;
            console.error('[OAuthService] GitHub token exchange network/fetch error:', error.message);
            throw ErrorFactory.authentication('Network error during GitHub token exchange.', {provider: 'github', details: error.message}, GMIErrorCode.OAUTH_TOKEN_EXCHANGE_FAILED);
        }
      default:
        // ACTION REQUIRED: Define `ErrorFactory.notImplemented` or use `new GMIError(...)`
        throw new GMIError(`Token exchange for OAuth provider '${provider.id}' not implemented.`, GMIErrorCode.NOT_IMPLEMENTED);
    }
  }

  /** @inheritdoc */
  async getUserInfo(providerId: string, accessToken: string, idToken?: string): Promise<OAuthUserInfo> {
    const provider = this.providers.get(providerId);
    if (!provider) throw ErrorFactory.notFound(`OAuth provider '${providerId}' not configured.`);

    switch (providerId) {
      case 'google':
        if (!this.googleClient) throw ErrorFactory.configuration('Google OAuth client not initialized.');
        if (!idToken && !accessToken) throw ErrorFactory.validation("Google user info requires an ID token or access token.");

        try {
            // Prefer ID token for user info as it's self-contained and verified
            if (idToken) {
                const ticket = await this.googleClient.verifyIdToken({ idToken, audience: provider.clientId });
                const payload = ticket.getPayload();
                if (!payload?.sub || !payload.email) throw ErrorFactory.authentication('Invalid Google ID token payload.');
                return {
                    providerId: 'google', providerUserId: payload.sub, email: payload.email.toLowerCase(),
                    emailVerified: payload.email_verified || false, name: payload.name,
                    username: payload.given_name || payload.email.split('@')[0], avatarUrl: payload.picture,
                };
            } else if (accessToken) { // Fallback to userinfo endpoint if only access token is available (less common for OIDC-style flows)
                this.googleClient.setCredentials({ access_token: accessToken });
                const oauth2 = google.oauth2({ version: 'v2', auth: this.googleClient }); // Requires `googleapis` package
                const res = await oauth2.userinfo.get();
                const payload = res.data;
                if (!payload?.id || !payload.email) throw ErrorFactory.authentication('Failed to fetch Google user info with access token.');
                 return {
                    providerId: 'google', providerUserId: payload.id, email: payload.email.toLowerCase(),
                    emailVerified: payload.verified_email || false, name: payload.name,
                    username: payload.given_name || payload.email.split('@')[0], avatarUrl: payload.picture,
                };
            }
            throw ErrorFactory.internal("No token provided for Google user info.");
        } catch (error: any) {
            console.error('[OAuthService] Get Google UserInfo Error:', error.message);
            throw ErrorFactory.authentication('Failed to retrieve/verify Google user information.', {provider: 'google', details: error.message}, GMIErrorCode.OAUTH_USER_INFO_FAILED);
        }

      case 'github':
        try {
            const octokit = new Octokit({ auth: accessToken });
            const { data: user } = await octokit.users.getAuthenticated();
            
            // Fetch emails to find primary verified email
            const { data: emails } = await octokit.users.listEmailsForAuthenticatedUser();
            // Parameter 'e' implicitly has an 'any' type. (Error 7)
            const primaryEmailObj = emails.find((e: { primary?: boolean; verified?: boolean; email: string }) => e.primary && e.verified);
            
            if (!primaryEmailObj) throw ErrorFactory.authentication('No verified primary email found for GitHub user. Please verify an email on GitHub.', {provider: 'github'}, GMIErrorCode.OAUTH_EMAIL_NOT_VERIFIED);

            return {
                providerId: 'github', providerUserId: user.id.toString(), email: primaryEmailObj.email.toLowerCase(),
                emailVerified: primaryEmailObj.verified || false, name: user.name || undefined,
                username: user.login, avatarUrl: user.avatar_url || undefined,
            };
        } catch (error: any) {
            console.error('[OAuthService] Get GitHub UserInfo Error:', error.message);
            throw ErrorFactory.authentication('Failed to retrieve GitHub user information.', {provider: 'github', details: error.message}, GMIErrorCode.OAUTH_USER_INFO_FAILED);
        }
      default:
        // ACTION REQUIRED: Define `ErrorFactory.notImplemented` or use `new GMIError(...)`
        throw new GMIError(`User info retrieval for OAuth provider '${providerId}' not implemented.`, GMIErrorCode.NOT_IMPLEMENTED);
    }
  }

  /**
   * Finds an existing user or creates a new one based on OAuth user information.
   * Links the OAuth identity if the user exists by email but not yet by this OAuth provider.
   * @private
   */
  private async findOrCreateUser(userInfo: OAuthUserInfo, provider: OAuthProvider): Promise<PrismaUser> {
    // CRITICAL ACTION: Run `npx prisma generate` if errors about 'provider_providerAccountId' occur.
    // Error for this line was on line 279.
    const existingAccount = await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: { // This field name is generated by Prisma for the @@unique constraint
          provider: userInfo.providerId,
          providerAccountId: userInfo.providerUserId,
        },
      },
      include: { user: true }, // Eager load the user
    });

    // Error `Property 'user' does not exist` (line 288) should resolve if above query types correctly after `prisma generate`.
    if (existingAccount?.user) {
      return existingAccount.user; // User already linked to this OAuth account
    }

    // If no direct account link, check if a user exists with the same email
    const userByEmail = await this.prisma.user.findUnique({
      where: { email: userInfo.email.toLowerCase() },
    });

    if (userByEmail) {
      // User exists with this email, but not linked to this specific OAuth account yet.
      // We will link it in `createOrUpdateAccountLink`.
      // Optionally, update emailVerified status if provider says it's verified and our record doesn't.
      if (userInfo.emailVerified && !userByEmail.emailVerified) {
        return this.prisma.user.update({
            where: { id: userByEmail.id },
            data: { emailVerified: true, updatedAt: new Date() }
        });
      }
      return userByEmail;
    }

    // No existing user by this OAuth ID or email, so create a new user
    const usernameBase = userInfo.username || userInfo.name || userInfo.email.split('@')[0];
    const uniqueUsername = await this.generateUniqueUsername(usernameBase);
    
    return this.prisma.user.create({
      data: {
        username: uniqueUsername,
        email: userInfo.email.toLowerCase(),
        emailVerified: userInfo.emailVerified, // Trust provider's verification status for new user
        passwordHash: null, // No password for OAuth-only user initially
        // TODO: Assign default subscription tier
      },
    });
  }

  /**
   * Generates a unique username by appending a counter if the base username is taken.
   * @private
   */
  private async generateUniqueUsername(baseUsername: string): Promise<string> {
    let attempt = 0;
    const MAX_LEN = 30; // As per Prisma schema for User.username
    let username = baseUsername.replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, MAX_LEN - 4); // Reserve space for suffix
    if (!username) username = 'oauth_user';

    while (attempt < 100) { // Limit attempts
      const testUsername = attempt === 0 ? username : `${username}${attempt}`;
      const finalUsername = testUsername.slice(0, MAX_LEN); // Ensure final length
      
      const existing = await this.prisma.user.findUnique({ where: { username: finalUsername } });
      if (!existing) {
        return finalUsername;
      }
      attempt++;
    }
    // Fallback to a more random username if many attempts fail
    return `${username.slice(0, MAX_LEN - 9)}_${crypto.randomBytes(4).toString('hex')}`.slice(0, MAX_LEN);
  }

  /**
   * Creates or updates the OAuth account link in the database.
   * @private
   */
  private async createOrUpdateAccountLink(
    userId: string,
    userInfo: OAuthUserInfo,
    tokens: {access_token: string, refresh_token?: string, id_token?: string, expires_in?: number, scope?: string, token_type?: string}
  ): Promise<PrismaAccount> {
    const expiresAtTimestamp = tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null;

    // CRITICAL ACTION: Run `npx prisma generate` if errors about 'provider_providerAccountId' occur.
    // Error for this line was on line 340.
    return this.prisma.account.upsert({
      where: {
        provider_providerAccountId: { // This field name is generated by Prisma
          provider: userInfo.providerId,
          providerAccountId: userInfo.providerUserId,
        },
      },
      update: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null, // Ensure null if undefined
        id_token: tokens.id_token || null, // Store ID token if available
        expires_at: expiresAtTimestamp,
        token_type: tokens.token_type || 'Bearer',
        scope: tokens.scope || null,
        updatedAt: new Date(),
      },
      create: {
        userId,
        provider: userInfo.providerId,
        providerAccountId: userInfo.providerUserId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null,
        id_token: tokens.id_token || null,
        expires_at: expiresAtTimestamp,
        token_type: tokens.token_type || 'Bearer',
        scope: tokens.scope || null,
      },
    });
  }

  /** @inheritdoc */
  async refreshToken(providerId: string, refreshTokenValue: string): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: number }> {
    const provider = this.providers.get(providerId);
    if (!provider || !provider.enabled) throw ErrorFactory.notFound(`OAuth provider '${providerId}' not found or disabled.`);

    switch (providerId) {
      case 'google':
        if (!this.googleClient) throw ErrorFactory.configuration('Google OAuth client not initialized.');
        try {
            this.googleClient.setCredentials({ refresh_token: refreshTokenValue });
            const { credentials } = await this.googleClient.refreshAccessToken();
            if (!credentials.access_token) {
                throw ErrorFactory.authentication("Failed to refresh Google access token: no new access token received.", {provider: 'google'}, GMIErrorCode.OAUTH_TOKEN_REFRESH_FAILED);
            }
            // Update the stored account with new tokens
            const account = await this.prisma.account.findFirst({where: {provider: 'google', refresh_token: refreshTokenValue}});
            if(account) {
                await this.prisma.account.update({
                    where: {id: account.id},
                    data: {
                        access_token: credentials.access_token,
                        refresh_token: credentials.refresh_token || refreshTokenValue, // Keep old if new one not provided
                        expires_at: credentials.expiry_date ? Math.floor(credentials.expiry_date / 1000) : null,
                        id_token: credentials.id_token || undefined,
                    }
                });
            }
            return {
                accessToken: credentials.access_token,
                refreshToken: credentials.refresh_token || undefined,
                expiresAt: credentials.expiry_date ? Math.floor(credentials.expiry_date / 1000) : undefined,
            };
        } catch (error: any) {
            console.error('[OAuthService] Google Token Refresh Error:', error.response?.data || error.message);
            // If refresh token is invalid/revoked, it might need to be cleared from DB and user re-auth.
            if (error.response?.data?.error === 'invalid_grant') {
                 await this.prisma.account.updateMany({
                    where: {provider: 'google', refresh_token: refreshTokenValue},
                    data: {refresh_token: null, access_token: null, id_token: null} // Nullify tokens
                 });
                 throw ErrorFactory.authentication('Google refresh token invalid or revoked. Please re-authenticate.', {provider: 'google', details: 'invalid_grant'}, GMIErrorCode.OAUTH_REFRESH_TOKEN_INVALID);
            }
            throw ErrorFactory.authentication('Failed to refresh Google access token.', {provider: 'google', details: error.message}, GMIErrorCode.OAUTH_TOKEN_REFRESH_FAILED);
        }
      case 'github':
        // GitHub access tokens typically don't expire by default, or have very long expiry.
        // If using GitHub App JWTs, those expire and need refresh, but user OAuth tokens usually don't.
        // If your GitHub app issues expiring user tokens, this needs implementation.
        // ACTION REQUIRED: Define `ErrorFactory.notImplemented` or use `new GMIError(...)`
        throw new GMIError('GitHub token refresh is not typically required or supported for standard user OAuth tokens.', GMIErrorCode.NOT_IMPLEMENTED);
      default:
        // ACTION REQUIRED: Define `ErrorFactory.notImplemented` or use `new GMIError(...)`
        throw new GMIError(`Token refresh for OAuth provider '${providerId}' not implemented.`, GMIErrorCode.NOT_IMPLEMENTED);
    }
  }

  /** @inheritdoc */
  getEnabledProviders(): Pick<OAuthProvider, 'id' | 'name' | 'enabled'>[] {
    return Array.from(this.providers.values())
      .filter(p => p.enabled)
      .map(p => ({ id: p.id, name: p.name, enabled: p.enabled }));
  }

  /** @inheritdoc */
  isProviderEnabled(providerId: string): boolean {
    const provider = this.providers.get(providerId);
    return !!provider?.enabled;
  }
}