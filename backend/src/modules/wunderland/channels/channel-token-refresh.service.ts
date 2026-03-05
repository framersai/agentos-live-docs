/**
 * @file channel-token-refresh.service.ts
 * @description Proactive OAuth token refresh service for channel connections.
 *
 * Periodically checks for OAuth tokens that are nearing expiration and
 * attempts to refresh them before they expire. This prevents service
 * interruptions when agents are connected to platforms that use expiring
 * access tokens (e.g., Meta/Facebook, LinkedIn, Google/YouTube).
 *
 * Platforms with non-expiring tokens (Telegram bot tokens, Discord bot tokens)
 * are skipped during the refresh cycle.
 */

import { Inject, Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from '../../../database/database.service.js';

/** Platforms that use OAuth refresh tokens. */
const REFRESHABLE_CREDENTIAL_TYPES = [
  'meta_oauth_token',
  'facebook_oauth_token',
  'instagram_oauth_token',
  'threads_oauth_token',
  'linkedin_oauth_token',
  'google_oauth_token',
  'youtube_oauth_token',
] as const;

/** How far in advance (ms) to attempt token refresh. */
const REFRESH_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

interface CredentialRow {
  credential_id: string;
  owner_user_id: string;
  seed_id: string;
  credential_type: string;
  credential_value: string;
  metadata: string | null;
  expires_at: number | null;
}

interface RefreshMetadata {
  refreshToken?: string;
  expiresAt?: number;
  refreshNeeded?: boolean;
  lastRefreshAttempt?: string;
  lastRefreshError?: string;
}

@Injectable()
export class ChannelTokenRefreshService implements OnModuleInit {
  private readonly logger = new Logger(ChannelTokenRefreshService.name);
  private readonly refreshEnabled =
    process.env.WUNDERLAND_CHANNEL_TOKEN_REFRESH_ENABLED !== 'false';
  private readonly runOnBoot = process.env.WUNDERLAND_CHANNEL_TOKEN_REFRESH_RUN_ON_BOOT !== 'false';

  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  async onModuleInit(): Promise<void> {
    if (!this.refreshEnabled) {
      this.logger.log(
        'OAuth token refresh cron is disabled via WUNDERLAND_CHANNEL_TOKEN_REFRESH_ENABLED=false.'
      );
      return;
    }

    if (!this.runOnBoot) return;

    // Warm-start refresh pass so newly booted instances do not wait for the next cron tick.
    void this.refreshExpiringTokens().catch((err) => {
      this.logger.error(`Initial token refresh pass failed: ${err}`);
    });
  }

  /**
   * Runs every 30 minutes to check for expiring OAuth tokens.
   * Attempts to refresh tokens that expire within the next 30 minutes.
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async refreshExpiringTokens(): Promise<void> {
    if (!this.refreshEnabled) return;

    this.logger.debug('Checking for expiring OAuth tokens...');

    try {
      const now = Date.now();
      const expirationThreshold = now + REFRESH_WINDOW_MS;

      // Find credentials with refresh tokens that are expiring soon.
      // We look for credentials whose metadata contains an expiresAt timestamp
      // within the refresh window.
      const allRefreshable = await this.db.all<CredentialRow>(
        `SELECT credential_id, owner_user_id, seed_id, credential_type, credential_value, metadata, expires_at
         FROM wunderbot_credentials
         WHERE credential_type IN (${REFRESHABLE_CREDENTIAL_TYPES.map(() => '?').join(', ')})`,
        [...REFRESHABLE_CREDENTIAL_TYPES]
      );

      let refreshedCount = 0;
      let failedCount = 0;

      for (const cred of allRefreshable) {
        const metadata = this.parseMetadata(cred.metadata);

        // Skip if already marked as needing manual re-auth
        if (metadata.refreshNeeded) continue;

        // Skip if no expiration info or not expiring soon
        const expiresAt = metadata.expiresAt ?? cred.expires_at;
        if (!expiresAt || expiresAt > expirationThreshold) continue;

        // Skip if already expired (needs manual re-auth)
        if (expiresAt < now) {
          this.logger.warn(
            `Credential ${cred.credential_id} (${cred.credential_type}) has already expired. Marking as needing re-auth.`
          );
          await this.markRefreshNeeded(cred.credential_id);
          failedCount++;
          continue;
        }

        // Attempt refresh
        this.logger.log(
          `Attempting to refresh ${cred.credential_type} token for credential ${cred.credential_id} (expires in ${Math.round((expiresAt - now) / 60_000)} min)`
        );

        const success = await this.refreshToken(cred.credential_id);
        if (success) {
          refreshedCount++;
        } else {
          failedCount++;
        }
      }

      if (refreshedCount > 0 || failedCount > 0) {
        this.logger.log(
          `Token refresh cycle complete: ${refreshedCount} refreshed, ${failedCount} failed.`
        );
      }
    } catch (err) {
      this.logger.error(`Error in token refresh cron: ${err}`);
    }
  }

  /**
   * Attempt to refresh a specific credential's OAuth token.
   *
   * Platform-specific refresh logic:
   * - Meta (Facebook/Instagram/Threads): Exchange long-lived token
   * - LinkedIn: POST /oauth/v2/accessToken with grant_type=refresh_token
   * - Google (YouTube/GMB): POST /oauth2/v4/token with refresh_token
   *
   * @returns true if refresh succeeded, false otherwise.
   */
  async refreshToken(credentialId: string): Promise<boolean> {
    try {
      const cred = await this.db.get<CredentialRow>(
        `SELECT credential_id, owner_user_id, seed_id, credential_type, credential_value, metadata
         FROM wunderbot_credentials WHERE credential_id = ? LIMIT 1`,
        [credentialId]
      );

      if (!cred) {
        this.logger.warn(`Credential ${credentialId} not found during refresh attempt.`);
        return false;
      }

      const metadata = this.parseMetadata(cred.metadata);
      if (!metadata.refreshToken) {
        this.logger.warn(
          `Credential ${credentialId} (${cred.credential_type}) has no refresh token. Marking as needing re-auth.`
        );
        await this.markRefreshNeeded(credentialId);
        return false;
      }

      // Platform-specific refresh — each handler returns { accessToken, expiresIn, refreshToken? }
      // or throws on failure.
      let result: { accessToken: string; expiresIn: number; refreshToken?: string } | null = null;

      switch (cred.credential_type) {
        case 'meta_oauth_token':
        case 'facebook_oauth_token':
        case 'instagram_oauth_token':
        case 'threads_oauth_token':
          result = await this.refreshMetaToken(metadata.refreshToken);
          break;

        case 'linkedin_oauth_token':
          result = await this.refreshLinkedInToken(metadata.refreshToken);
          break;

        case 'google_oauth_token':
        case 'youtube_oauth_token':
          result = await this.refreshGoogleToken(metadata.refreshToken);
          break;

        default:
          this.logger.warn(`Unsupported credential type for refresh: ${cred.credential_type}`);
          return false;
      }

      if (!result) {
        await this.markRefreshNeeded(credentialId);
        return false;
      }

      // Update the stored credential with the new access token and expiration
      const newExpiresAt = Date.now() + result.expiresIn * 1000;
      const updatedMetadata: RefreshMetadata = {
        ...metadata,
        expiresAt: newExpiresAt,
        refreshToken: result.refreshToken ?? metadata.refreshToken,
        refreshNeeded: false,
        lastRefreshAttempt: new Date().toISOString(),
        lastRefreshError: undefined,
      };

      await this.db.run(
        `UPDATE wunderbot_credentials
         SET credential_value = ?, metadata = ?, expires_at = ?, updated_at = ?
         WHERE credential_id = ?`,
        [
          result.accessToken,
          JSON.stringify(updatedMetadata),
          newExpiresAt,
          Date.now(),
          credentialId,
        ]
      );

      this.logger.log(
        `Successfully refreshed ${cred.credential_type} token for credential ${credentialId}. New expiry: ${new Date(newExpiresAt).toISOString()}`
      );
      return true;
    } catch (err) {
      this.logger.error(`Failed to refresh credential ${credentialId}: ${err}`);

      // Record the failure in metadata
      try {
        const cred = await this.db.get<{ metadata: string | null }>(
          `SELECT metadata FROM wunderbot_credentials WHERE credential_id = ? LIMIT 1`,
          [credentialId]
        );
        const metadata = this.parseMetadata(cred?.metadata ?? null);
        metadata.lastRefreshAttempt = new Date().toISOString();
        metadata.lastRefreshError = err instanceof Error ? err.message : String(err);

        await this.db.run(`UPDATE wunderbot_credentials SET metadata = ? WHERE credential_id = ?`, [
          JSON.stringify(metadata),
          credentialId,
        ]);
      } catch {
        // Best effort metadata update
      }

      return false;
    }
  }

  /**
   * Mark a credential as needing manual re-authentication.
   * The user will be prompted to re-connect the channel in the dashboard.
   */
  async markRefreshNeeded(credentialId: string): Promise<void> {
    this.logger.warn(`Credential ${credentialId} needs manual re-authentication.`);

    try {
      const cred = await this.db.get<{ metadata: string | null }>(
        `SELECT metadata FROM wunderbot_credentials WHERE credential_id = ? LIMIT 1`,
        [credentialId]
      );
      const metadata = this.parseMetadata(cred?.metadata ?? null);
      metadata.refreshNeeded = true;
      metadata.lastRefreshAttempt = new Date().toISOString();

      await this.db.run(`UPDATE wunderbot_credentials SET metadata = ? WHERE credential_id = ?`, [
        JSON.stringify(metadata),
        credentialId,
      ]);
    } catch (err) {
      this.logger.error(`Failed to mark credential ${credentialId} as needing refresh: ${err}`);
    }
  }

  // ── Platform-specific refresh handlers ────────────────────────────────────
  // These are stubs that will be fully implemented as each platform adapter
  // is wired up. For now they perform the standard OAuth2 refresh flow.

  private async refreshMetaToken(
    refreshToken: string
  ): Promise<{ accessToken: string; expiresIn: number; refreshToken?: string } | null> {
    const appId = process.env.META_APP_ID ?? process.env.FACEBOOK_APP_ID ?? '';
    const appSecret = process.env.META_APP_SECRET ?? process.env.FACEBOOK_APP_SECRET ?? '';
    if (!appId || !appSecret) {
      this.logger.warn('Meta OAuth credentials not configured. Cannot refresh token.');
      return null;
    }

    try {
      const params = new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: refreshToken,
      });

      const res = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?${params}`);
      if (!res.ok) {
        const errBody = await res.text();
        this.logger.error(`Meta token refresh failed (${res.status}): ${errBody}`);
        return null;
      }

      const data = (await res.json()) as {
        access_token: string;
        token_type: string;
        expires_in?: number;
      };

      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in ?? 5184000, // Default 60 days for long-lived tokens
      };
    } catch (err) {
      this.logger.error(`Meta token refresh error: ${err}`);
      return null;
    }
  }

  private async refreshLinkedInToken(
    refreshToken: string
  ): Promise<{ accessToken: string; expiresIn: number; refreshToken?: string } | null> {
    const clientId = process.env.LINKEDIN_CLIENT_ID ?? '';
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET ?? '';
    if (!clientId || !clientSecret) {
      this.logger.warn('LinkedIn OAuth credentials not configured. Cannot refresh token.');
      return null;
    }

    try {
      const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        this.logger.error(`LinkedIn token refresh failed (${res.status}): ${errBody}`);
        return null;
      }

      const data = (await res.json()) as {
        access_token: string;
        expires_in: number;
        refresh_token?: string;
      };

      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token,
      };
    } catch (err) {
      this.logger.error(`LinkedIn token refresh error: ${err}`);
      return null;
    }
  }

  private async refreshGoogleToken(
    refreshToken: string
  ): Promise<{ accessToken: string; expiresIn: number; refreshToken?: string } | null> {
    const clientId = process.env.GOOGLE_CLIENT_ID ?? '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';
    if (!clientId || !clientSecret) {
      this.logger.warn('Google OAuth credentials not configured. Cannot refresh token.');
      return null;
    }

    try {
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        this.logger.error(`Google token refresh failed (${res.status}): ${errBody}`);
        return null;
      }

      const data = (await res.json()) as {
        access_token: string;
        expires_in: number;
        refresh_token?: string;
      };

      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token,
      };
    } catch (err) {
      this.logger.error(`Google token refresh error: ${err}`);
      return null;
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private parseMetadata(raw: string | null): RefreshMetadata {
    if (!raw) return {};
    try {
      return JSON.parse(raw) as RefreshMetadata;
    } catch {
      return {};
    }
  }
}
