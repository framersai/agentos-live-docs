/**
 * @file vault.service.ts
 * @description User-level API key vault — CRUD, bulk import, per-agent
 * assignment overrides, and per-key rate limit enforcement.
 */

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service.js';
import { appConfig } from '../../../config/appConfig.js';
import type { CreateVaultKeyDto, UpdateVaultKeyDto, RotateVaultKeyDto } from '../dto/vault.dto.js';

/* ── Public types ──────────────────────────────────────────────────────────── */

export type VaultKey = {
  id: string;
  userId: string;
  credentialType: string;
  label: string;
  maskedValue: string;
  rpmLimit: number | null;
  creditsRemaining: number | null;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VaultKeyAssignment = {
  keyId: string;
  seedId: string;
  enabled: boolean;
  credentialType: string;
  label: string;
  maskedValue: string;
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterMs?: number;
};

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function toIso(value: number | null | undefined): string | null {
  return typeof value === 'number' && Number.isFinite(value) ? new Date(value).toISOString() : null;
}

function toEpochMs(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/* ── Service ───────────────────────────────────────────────────────────────── */

@Injectable()
export class VaultService {
  private readonly encryptionKey: Buffer;

  constructor(private readonly db: DatabaseService) {
    const keyMaterial =
      process.env.WUNDERLAND_CREDENTIALS_ENCRYPTION_KEY || String(appConfig.auth.jwtSecret);
    this.encryptionKey = createHash('sha256').update(keyMaterial).digest();
  }

  /* ── Encryption (same algo as CredentialsService) ──────────────────────── */

  private maskSecret(secret: string): string {
    const trimmed = secret.trim();
    if (!trimmed || trimmed.length <= 4) return '••••••••';
    return `••••••••${trimmed.slice(-4)}`;
  }

  private encryptSecret(secret: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return [
      'v1',
      iv.toString('base64url'),
      tag.toString('base64url'),
      ciphertext.toString('base64url'),
    ].join('.');
  }

  decryptSecret(encrypted: string): string | null {
    try {
      const parts = encrypted.split('.');
      if (parts.length !== 4) return null;
      const [version, ivRaw, tagRaw, ciphertextRaw] = parts;
      if (version !== 'v1') return null;
      const iv = Buffer.from(ivRaw ?? '', 'base64url');
      const tag = Buffer.from(tagRaw ?? '', 'base64url');
      const ciphertext = Buffer.from(ciphertextRaw ?? '', 'base64url');
      if (iv.length !== 12 || tag.length !== 16 || ciphertext.length === 0) return null;
      const decipher = createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
      decipher.setAuthTag(tag);
      return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
    } catch {
      return null;
    }
  }

  /* ── Row mapper ────────────────────────────────────────────────────────── */

  private mapKey(row: any): VaultKey {
    return {
      id: String(row.id),
      userId: String(row.user_id),
      credentialType: String(row.credential_type),
      label: String(row.label ?? ''),
      maskedValue: String(row.masked_value ?? '••••••••'),
      rpmLimit: typeof row.rpm_limit === 'number' ? row.rpm_limit : null,
      creditsRemaining: typeof row.credits_remaining === 'number' ? row.credits_remaining : null,
      lastUsedAt: toIso(toEpochMs(row.last_used_at)),
      createdAt: toIso(toEpochMs(row.created_at)) ?? new Date().toISOString(),
      updatedAt: toIso(toEpochMs(row.updated_at)) ?? new Date().toISOString(),
    };
  }

  /* ── CRUD ───────────────────────────────────────────────────────────────── */

  async listKeys(userId: string): Promise<{ items: VaultKey[] }> {
    const rows = await this.db.all<any>(
      `SELECT * FROM user_api_keys WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return { items: rows.map((r) => this.mapKey(r)) };
  }

  async createKey(userId: string, dto: CreateVaultKeyDto): Promise<{ key: VaultKey }> {
    const credentialType = dto.credentialType.trim();
    const label = dto.label?.trim() || credentialType;
    const value = dto.value.trim();
    const now = Date.now();
    const id = this.db.generateId();

    try {
      await this.db.run(
        `INSERT INTO user_api_keys
          (id, user_id, credential_type, label, encrypted_value, masked_value,
           rpm_limit, credits_remaining, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          userId,
          credentialType,
          label,
          this.encryptSecret(value),
          this.maskSecret(value),
          dto.rpmLimit ?? null,
          dto.creditsRemaining ?? null,
          now,
          now,
        ]
      );
    } catch (err: any) {
      if (err?.message?.includes('UNIQUE constraint')) {
        throw new ConflictException(
          `A vault key with type "${credentialType}" and label "${label}" already exists.`
        );
      }
      throw err;
    }

    const row = await this.db.get<any>(
      'SELECT * FROM user_api_keys WHERE id = ? AND user_id = ? LIMIT 1',
      [id, userId]
    );
    if (!row) throw new NotFoundException('Key could not be created.');
    return { key: this.mapKey(row) };
  }

  async updateKey(
    userId: string,
    keyId: string,
    dto: UpdateVaultKeyDto
  ): Promise<{ key: VaultKey }> {
    const existing = await this.db.get<any>(
      'SELECT id FROM user_api_keys WHERE id = ? AND user_id = ? LIMIT 1',
      [keyId, userId]
    );
    if (!existing) throw new NotFoundException(`Vault key "${keyId}" not found.`);

    const sets: string[] = [];
    const params: Array<string | number | null> = [];

    if (dto.label !== undefined) {
      sets.push('label = ?');
      params.push(dto.label.trim());
    }
    if (dto.rpmLimit !== undefined) {
      sets.push('rpm_limit = ?');
      params.push(dto.rpmLimit);
    }
    if (dto.creditsRemaining !== undefined) {
      sets.push('credits_remaining = ?');
      params.push(dto.creditsRemaining);
    }

    if (sets.length > 0) {
      sets.push('updated_at = ?');
      params.push(Date.now());
      params.push(keyId, userId);
      await this.db.run(
        `UPDATE user_api_keys SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`,
        params
      );
    }

    const row = await this.db.get<any>(
      'SELECT * FROM user_api_keys WHERE id = ? AND user_id = ? LIMIT 1',
      [keyId, userId]
    );
    if (!row) throw new NotFoundException(`Vault key "${keyId}" not found.`);
    return { key: this.mapKey(row) };
  }

  async rotateKey(
    userId: string,
    keyId: string,
    dto: RotateVaultKeyDto
  ): Promise<{ key: VaultKey }> {
    const existing = await this.db.get<any>(
      'SELECT id FROM user_api_keys WHERE id = ? AND user_id = ? LIMIT 1',
      [keyId, userId]
    );
    if (!existing) throw new NotFoundException(`Vault key "${keyId}" not found.`);

    const value = dto.value.trim();
    const now = Date.now();
    await this.db.run(
      `UPDATE user_api_keys SET encrypted_value = ?, masked_value = ?, updated_at = ? WHERE id = ? AND user_id = ?`,
      [this.encryptSecret(value), this.maskSecret(value), now, keyId, userId]
    );

    const row = await this.db.get<any>(
      'SELECT * FROM user_api_keys WHERE id = ? AND user_id = ? LIMIT 1',
      [keyId, userId]
    );
    if (!row) throw new NotFoundException(`Vault key "${keyId}" not found.`);
    return { key: this.mapKey(row) };
  }

  async deleteKey(userId: string, keyId: string): Promise<{ deleted: boolean }> {
    const existing = await this.db.get<any>(
      'SELECT id FROM user_api_keys WHERE id = ? AND user_id = ? LIMIT 1',
      [keyId, userId]
    );
    if (!existing) throw new NotFoundException(`Vault key "${keyId}" not found.`);

    await this.db.run('DELETE FROM user_api_keys WHERE id = ? AND user_id = ?', [keyId, userId]);
    return { deleted: true };
  }

  /* ── Bulk import ────────────────────────────────────────────────────────── */

  async bulkCreate(
    userId: string,
    keys: CreateVaultKeyDto[]
  ): Promise<{ keys: VaultKey[]; errors: string[] }> {
    const created: VaultKey[] = [];
    const errors: string[] = [];

    for (const dto of keys) {
      try {
        const result = await this.createKey(userId, dto);
        created.push(result.key);
      } catch (err: any) {
        errors.push(`${dto.credentialType}: ${err?.message ?? 'Unknown error'}`);
      }
    }

    return { keys: created, errors };
  }

  /* ── Agent assignments ──────────────────────────────────────────────────── */

  async getAssignments(
    userId: string,
    seedId: string
  ): Promise<{ assignments: VaultKeyAssignment[] }> {
    // Return all user vault keys with their assignment status for this agent.
    // No row in assignments table = enabled (default).
    const rows = await this.db.all<any>(
      `SELECT
         k.id AS key_id,
         k.credential_type,
         k.label,
         k.masked_value,
         COALESCE(a.enabled, 1) AS enabled
       FROM user_api_keys k
       LEFT JOIN user_api_key_agent_assignments a
         ON a.key_id = k.id AND a.seed_id = ?
       WHERE k.user_id = ?
       ORDER BY k.credential_type, k.created_at DESC`,
      [seedId, userId]
    );

    return {
      assignments: rows.map((r: any) => ({
        keyId: String(r.key_id),
        seedId,
        enabled: r.enabled === 1 || r.enabled === true,
        credentialType: String(r.credential_type),
        label: String(r.label ?? ''),
        maskedValue: String(r.masked_value ?? '••••••••'),
      })),
    };
  }

  async bulkSetAssignments(
    userId: string,
    seedId: string,
    assignments: Array<{ keyId: string; enabled: boolean }>
  ): Promise<void> {
    // Verify user owns the agent
    const agent = await this.db.get<{ seed_id: string }>(
      `SELECT seed_id FROM wunderbots WHERE owner_user_id = ? AND seed_id = ? AND status != 'archived' LIMIT 1`,
      [userId, seedId]
    );
    if (!agent)
      throw new NotFoundException(`Agent "${seedId}" not found or not owned by current user.`);

    const now = Date.now();
    for (const { keyId, enabled } of assignments) {
      // Verify user owns the key
      const key = await this.db.get<any>(
        'SELECT id FROM user_api_keys WHERE id = ? AND user_id = ? LIMIT 1',
        [keyId, userId]
      );
      if (!key) continue; // skip keys not owned

      if (enabled) {
        // Default is enabled — delete override row if exists
        await this.db.run(
          'DELETE FROM user_api_key_agent_assignments WHERE key_id = ? AND seed_id = ?',
          [keyId, seedId]
        );
      } else {
        // Insert/update disabled override
        const existing = await this.db.get<any>(
          'SELECT id FROM user_api_key_agent_assignments WHERE key_id = ? AND seed_id = ? LIMIT 1',
          [keyId, seedId]
        );
        if (existing) {
          await this.db.run(
            'UPDATE user_api_key_agent_assignments SET enabled = 0 WHERE key_id = ? AND seed_id = ?',
            [keyId, seedId]
          );
        } else {
          await this.db.run(
            `INSERT INTO user_api_key_agent_assignments (id, key_id, seed_id, enabled, created_at)
             VALUES (?, ?, ?, 0, ?)`,
            [this.db.generateId(), keyId, seedId, now]
          );
        }
      }
    }
  }

  /* ── Credential resolution (server-side only) ──────────────────────────── */

  /**
   * Find the best vault key for a given agent + credential type.
   * Returns null if no enabled vault key is available (or all are rate-limited/exhausted).
   */
  async resolveKey(
    userId: string,
    seedId: string,
    credentialType: string
  ): Promise<{ value: string; keyId: string } | null> {
    // Find vault keys of this type that are enabled for this agent
    const rows = await this.db.all<any>(
      `SELECT k.id, k.encrypted_value, k.credits_remaining
       FROM user_api_keys k
       LEFT JOIN user_api_key_agent_assignments a
         ON a.key_id = k.id AND a.seed_id = ?
       WHERE k.user_id = ?
         AND k.credential_type = ?
         AND COALESCE(a.enabled, 1) = 1
       ORDER BY k.created_at ASC`,
      [seedId, userId, credentialType]
    );

    for (const row of rows) {
      // Skip exhausted keys
      if (typeof row.credits_remaining === 'number' && row.credits_remaining <= 0) continue;

      // Check rate limit
      const rl = await this.checkAndConsumeRateLimit(String(row.id));
      if (!rl.allowed) continue;

      const value = this.decryptSecret(String(row.encrypted_value ?? ''));
      if (!value) continue;

      // Update last_used_at
      await this.db.run('UPDATE user_api_keys SET last_used_at = ? WHERE id = ?', [
        Date.now(),
        row.id,
      ]);

      return { value, keyId: String(row.id) };
    }

    return null;
  }

  /* ── Rate limit enforcement ─────────────────────────────────────────────── */

  async checkAndConsumeRateLimit(keyId: string): Promise<RateLimitResult> {
    const key = await this.db.get<any>(
      'SELECT rpm_limit, rpm_window_start, rpm_window_count FROM user_api_keys WHERE id = ?',
      [keyId]
    );
    if (!key || !key.rpm_limit) return { allowed: true };

    const now = Date.now();
    const windowMs = 60_000;

    if (!key.rpm_window_start || now - key.rpm_window_start > windowMs) {
      await this.db.run(
        'UPDATE user_api_keys SET rpm_window_start = ?, rpm_window_count = 1 WHERE id = ?',
        [now, keyId]
      );
      return { allowed: true };
    }

    if (key.rpm_window_count >= key.rpm_limit) {
      const retryAfterMs = windowMs - (now - key.rpm_window_start);
      return { allowed: false, retryAfterMs };
    }

    await this.db.run(
      'UPDATE user_api_keys SET rpm_window_count = rpm_window_count + 1 WHERE id = ?',
      [keyId]
    );
    return { allowed: true };
  }

  async consumeCredits(keyId: string, amount: number): Promise<{ remaining: number | null }> {
    const key = await this.db.get<any>('SELECT credits_remaining FROM user_api_keys WHERE id = ?', [
      keyId,
    ]);
    if (!key || key.credits_remaining === null || key.credits_remaining === undefined) {
      return { remaining: null };
    }

    const newRemaining = Math.max(0, key.credits_remaining - amount);
    await this.db.run('UPDATE user_api_keys SET credits_remaining = ? WHERE id = ?', [
      newRemaining,
      keyId,
    ]);
    return { remaining: newRemaining };
  }
}
