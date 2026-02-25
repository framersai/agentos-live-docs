/**
 * @file tunnel.service.ts
 * @description Stores per-user Cloudflare tunnel registrations for local Ollama.
 *
 * Security model:
 * - Tunnel scripts authenticate with `X-Tunnel-Token` (stored in user_api_keys as credential_type=tunnel_token).
 * - Tokens are high-entropy and validated by decrypting the stored vault key.
 * - To avoid scanning all users, the token format encodes the user id:
 *     rht.<base64url(userId)>.<64-hex>
 *   Legacy tokens (rht_ + 64hex) are supported via masked-value narrowing.
 */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { VaultService } from '../wunderland/vault/vault.service.js';

export type TunnelStatus = {
  connected: boolean;
  ollamaUrl: string | null;
  models: string[];
  lastHeartbeat: number | null;
  version: string | null;
};

export type TunnelTokenResolution = {
  userId: string;
  keyId: string;
};

const PROVIDER_ID = 'ollama';
const CREDENTIAL_TYPE = 'tunnel_token';
const LABEL = 'Ollama Tunnel';

const DEFAULT_TTL_MS = 90_000;

function safeJsonParseArray(value: unknown): string[] {
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function normalizeModels(models: unknown): string[] {
  if (!Array.isArray(models)) return [];
  return models
    .filter((m) => typeof m === 'string')
    .map((m) => m.trim())
    .filter(Boolean)
    .slice(0, 200);
}

function normalizeOllamaUrl(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    const allowAnyHost = process.env.RABBITHOLE_TUNNEL_ALLOW_ANY_HOST === 'true';
    const host = url.hostname.toLowerCase();
    const isLocal =
      host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.localhost');
    if (!allowAnyHost) {
      // Default: only accept Cloudflare quick tunnels to reduce SSRF risk.
      if (!host.endsWith('.trycloudflare.com')) return null;
      if (url.protocol !== 'https:') return null;
    } else if (!isLocal && url.protocol !== 'https:') {
      // If allowing arbitrary hosts, still require HTTPS for non-local hosts.
      return null;
    }
    // Avoid storing paths/query; we only need an origin.
    return url.origin;
  } catch {
    return null;
  }
}

function decodeUserIdFromTunnelToken(token: string): string | null {
  const trimmed = token.trim();
  if (!trimmed.startsWith('rht.')) return null;
  const parts = trimmed.split('.');
  if (parts.length !== 3) return null;
  const [, encodedUserId, nonce] = parts;
  if (!encodedUserId || !nonce) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(encodedUserId)) return null;
  if (!/^[a-f0-9]{64}$/i.test(nonce)) return null;
  try {
    const userId = Buffer.from(encodedUserId, 'base64url').toString('utf8');
    if (!userId || userId.length > 128) return null;
    return userId;
  } catch {
    return null;
  }
}

function isLabelMatch(label: unknown, expected: string): boolean {
  if (typeof label !== 'string') return false;
  return label.trim().toLowerCase() === expected.trim().toLowerCase();
}

@Injectable()
export class TunnelService {
  private schemaReady = false;

  public constructor(
    private readonly db: DatabaseService,
    private readonly vault: VaultService
  ) {}

  private async ensureSchema(): Promise<void> {
    if (this.schemaReady) return;
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_tunnels (
        user_id TEXT NOT NULL,
        provider_id TEXT NOT NULL,
        base_url TEXT,
        models_json TEXT,
        version TEXT,
        last_heartbeat_at BIGINT,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        PRIMARY KEY (user_id, provider_id),
        FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
      );
    `);
    await this.db.exec(
      'CREATE INDEX IF NOT EXISTS idx_user_tunnels_heartbeat ON user_tunnels(provider_id, last_heartbeat_at DESC);'
    );
    this.schemaReady = true;
  }

  /**
   * Immediately clears any stored tunnel registration for a user. Useful when
   * rotating/revoking tokens so stale heartbeats aren't treated as connected.
   */
  public async disconnectForUser(userId: string): Promise<void> {
    await this.ensureSchema();
    await this.db.run(`DELETE FROM user_tunnels WHERE user_id = ? AND provider_id = ?`, [
      userId,
      PROVIDER_ID,
    ]);
  }

  public getTtlMs(): number {
    const raw = process.env.RABBITHOLE_TUNNEL_TTL_MS;
    const parsed = raw ? Number(raw) : Number.NaN;
    return Number.isFinite(parsed) && parsed > 5_000 ? parsed : DEFAULT_TTL_MS;
  }

  private async assertEligibleTunnelUser(
    userId: string
  ): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
    const row = await this.db.get<any>(
      `SELECT id, is_active, subscription_status, subscription_plan_id
         FROM app_users
        WHERE id = ?
        LIMIT 1`,
      [userId]
    );
    if (!row) {
      return { ok: false, status: 403, message: 'User not found' };
    }
    if (row.is_active === 0) {
      return { ok: false, status: 403, message: 'Account inactive' };
    }
    const status = String(row.subscription_status ?? '')
      .trim()
      .toLowerCase();
    const planId = String(row.subscription_plan_id ?? '')
      .trim()
      .toLowerCase();

    const isActive = ['active', 'trialing', 'unlimited'].includes(status);
    const isProOrEnterprise = ['pioneer', 'enterprise'].includes(planId);

    if (!isActive) {
      return { ok: false, status: 403, message: 'Active subscription required' };
    }
    if (!isProOrEnterprise) {
      return {
        ok: false,
        status: 403,
        message: 'Pro or Enterprise plan required for Ollama Tunnel',
      };
    }
    return { ok: true };
  }

  /**
   * Resolve a tunnel token to the owning user id + key id.
   */
  public async resolveTunnelToken(tokenRaw: string): Promise<TunnelTokenResolution | null> {
    const token = String(tokenRaw || '').trim();
    if (!token) return null;

    // New format: rht.<b64(userId)>.<hex>
    const userIdFromToken = decodeUserIdFromTunnelToken(token);
    if (userIdFromToken) {
      const canonical = await this.getCanonicalTunnelKeyForUser(userIdFromToken);
      if (!canonical) return null;
      const decrypted = this.vault.decryptSecret(String(canonical.encrypted_value ?? ''));
      if (decrypted && decrypted === token) {
        return { userId: userIdFromToken, keyId: String(canonical.id) };
      }
      return null;
    }

    // Legacy format fallback: rht_ + 64hex
    if (!token.startsWith('rht_')) return null;
    if (token.length < 12) return null;
    const suffix = token.slice(-4);
    const like = `%${suffix}`;
    const candidates = await this.db.all<any>(
      `SELECT id, user_id, encrypted_value
         FROM user_api_keys
        WHERE credential_type = ?
          AND masked_value LIKE ?
        ORDER BY created_at DESC
        LIMIT 50`,
      [CREDENTIAL_TYPE, like]
    );
    for (const row of candidates) {
      const decrypted = this.vault.decryptSecret(String(row.encrypted_value ?? ''));
      if (decrypted && decrypted === token) {
        const userId = String(row.user_id);
        const canonical = await this.getCanonicalTunnelKeyForUser(userId);
        if (canonical && String(canonical.id) === String(row.id)) {
          return { userId, keyId: String(row.id) };
        }
      }
    }
    return null;
  }

  private async getCanonicalTunnelKeyForUser(
    userId: string
  ): Promise<{ id: string; encrypted_value: string; label: string | null } | null> {
    const rows = await this.db.all<any>(
      `SELECT id, encrypted_value, label, created_at
         FROM user_api_keys
        WHERE user_id = ?
          AND credential_type = ?
        ORDER BY created_at DESC`,
      [userId, CREDENTIAL_TYPE]
    );
    if (!rows.length) return null;
    const labeled = rows.find((r) => isLabelMatch(r.label, LABEL));
    const canonical = labeled ?? rows[0];
    return canonical
      ? {
          id: String(canonical.id),
          encrypted_value: String(canonical.encrypted_value ?? ''),
          label:
            canonical.label === null || canonical.label === undefined
              ? null
              : String(canonical.label),
        }
      : null;
  }

  public async upsertHeartbeat(options: {
    tunnelToken: string;
    ollamaUrl: string | null;
    models: unknown;
    version?: unknown;
    disconnecting?: boolean;
  }): Promise<{ ok: true; status: TunnelStatus } | { ok: false; status: number; message: string }> {
    await this.ensureSchema();

    const tunnelToken = String(options.tunnelToken || '').trim();
    if (!tunnelToken) {
      return { ok: false, status: 401, message: 'Missing X-Tunnel-Token header' };
    }

    const resolution = await this.resolveTunnelToken(tunnelToken);
    if (!resolution) {
      return { ok: false, status: 401, message: 'Invalid tunnel token' };
    }

    const eligible = await this.assertEligibleTunnelUser(resolution.userId);
    if (!eligible.ok) {
      return { ok: false, status: eligible.status, message: eligible.message };
    }

    const now = Date.now();

    // Mark token as used
    await this.db.run(`UPDATE user_api_keys SET last_used_at = ? WHERE id = ? AND user_id = ?`, [
      now,
      resolution.keyId,
      resolution.userId,
    ]);

    const disconnecting = options.disconnecting === true;
    const normalizedUrl = disconnecting ? null : normalizeOllamaUrl(options.ollamaUrl);

    if (!disconnecting && !normalizedUrl) {
      return { ok: false, status: 400, message: 'Invalid ollamaUrl' };
    }

    if (disconnecting || !normalizedUrl) {
      await this.db.run(`DELETE FROM user_tunnels WHERE user_id = ? AND provider_id = ?`, [
        resolution.userId,
        PROVIDER_ID,
      ]);
      return {
        ok: true,
        status: {
          connected: false,
          ollamaUrl: null,
          models: [],
          lastHeartbeat: null,
          version: null,
        },
      };
    }

    const models = normalizeModels(options.models);
    const version =
      typeof options.version === 'string' && options.version.trim().length > 0
        ? options.version.trim()
        : null;

    const existing = await this.db.get<any>(
      `SELECT user_id FROM user_tunnels WHERE user_id = ? AND provider_id = ? LIMIT 1`,
      [resolution.userId, PROVIDER_ID]
    );

    if (existing) {
      await this.db.run(
        `UPDATE user_tunnels
            SET base_url = ?, models_json = ?, version = ?, last_heartbeat_at = ?, updated_at = ?
          WHERE user_id = ? AND provider_id = ?`,
        [normalizedUrl, JSON.stringify(models), version, now, now, resolution.userId, PROVIDER_ID]
      );
    } else {
      await this.db.run(
        `INSERT INTO user_tunnels
          (user_id, provider_id, base_url, models_json, version, last_heartbeat_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          resolution.userId,
          PROVIDER_ID,
          normalizedUrl,
          JSON.stringify(models),
          version,
          now,
          now,
          now,
        ]
      );
    }

    return {
      ok: true,
      status: {
        connected: true,
        ollamaUrl: normalizedUrl,
        models,
        lastHeartbeat: now,
        version,
      },
    };
  }

  public async getStatusForUser(userId: string): Promise<TunnelStatus> {
    await this.ensureSchema();
    const row = await this.db.get<any>(
      `SELECT base_url, models_json, last_heartbeat_at, version
         FROM user_tunnels
        WHERE user_id = ? AND provider_id = ?
        LIMIT 1`,
      [userId, PROVIDER_ID]
    );
    if (!row) {
      return { connected: false, ollamaUrl: null, models: [], lastHeartbeat: null, version: null };
    }

    const lastHeartbeat =
      typeof row.last_heartbeat_at === 'number' && Number.isFinite(row.last_heartbeat_at)
        ? row.last_heartbeat_at
        : typeof row.last_heartbeat_at === 'string'
          ? Number(row.last_heartbeat_at)
          : null;

    const baseUrl = typeof row.base_url === 'string' ? row.base_url.trim() : '';
    const models = safeJsonParseArray(row.models_json);
    const version =
      typeof row.version === 'string' && row.version.trim().length > 0 ? row.version.trim() : null;

    const connected =
      Boolean(baseUrl) &&
      typeof lastHeartbeat === 'number' &&
      Date.now() - lastHeartbeat <= this.getTtlMs();

    return {
      connected,
      ollamaUrl: connected ? baseUrl : null,
      models: connected ? models : [],
      lastHeartbeat: typeof lastHeartbeat === 'number' ? lastHeartbeat : null,
      version,
    };
  }
}
