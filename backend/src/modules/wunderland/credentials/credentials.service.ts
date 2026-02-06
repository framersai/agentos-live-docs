/**
 * @file credentials.service.ts
 * @description Persistent credential vault for agent integrations.
 */

import { createCipheriv, createHash, randomBytes } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service.js';
import { appConfig } from '../../../config/appConfig.js';
import type { CreateCredentialDto, ListCredentialsQueryDto } from '../dto/credentials.dto.js';

type CredentialRecord = {
  credentialId: string;
  seedId: string;
  ownerUserId: string;
  type: string;
  label: string;
  maskedValue: string;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

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

@Injectable()
export class CredentialsService {
  private readonly encryptionKey: Buffer;

  constructor(private readonly db: DatabaseService) {
    const keyMaterial =
      process.env.WUNDERLAND_CREDENTIALS_ENCRYPTION_KEY || String(appConfig.auth.jwtSecret);
    this.encryptionKey = createHash('sha256').update(keyMaterial).digest();
  }

  private async assertOwnedAgent(userId: string, seedId: string): Promise<void> {
    const agent = await this.db.get<{ seed_id: string }>(
      `SELECT seed_id
         FROM wunderland_agents
        WHERE owner_user_id = ?
          AND seed_id = ?
          AND status != ?
        LIMIT 1`,
      [userId, seedId, 'archived']
    );
    if (!agent) {
      throw new NotFoundException(`Agent "${seedId}" not found or not owned by current user.`);
    }
  }

  private maskSecret(secret: string): string {
    const trimmed = secret.trim();
    if (!trimmed) return '••••••••';
    if (trimmed.length <= 4) return '••••••••';
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

  private mapCredential(row: any): CredentialRecord {
    return {
      credentialId: String(row.credential_id),
      seedId: String(row.seed_id),
      ownerUserId: String(row.owner_user_id),
      type: String(row.credential_type),
      label: String(row.label ?? ''),
      maskedValue: String(row.masked_value ?? '••••••••'),
      lastUsedAt: toIso(toEpochMs(row.last_used_at)),
      createdAt: toIso(toEpochMs(row.created_at)) ?? new Date().toISOString(),
      updatedAt: toIso(toEpochMs(row.updated_at)) ?? new Date().toISOString(),
    };
  }

  async listCredentials(
    userId: string,
    query: ListCredentialsQueryDto = {}
  ): Promise<{ items: CredentialRecord[] }> {
    const where: string[] = ['owner_user_id = ?'];
    const params: Array<string | number> = [userId];

    if (query.seedId) {
      const seedId = query.seedId.trim();
      await this.assertOwnedAgent(userId, seedId);
      where.push('seed_id = ?');
      params.push(seedId);
    }

    const rows = await this.db.all<any>(
      `
        SELECT
          credential_id,
          seed_id,
          owner_user_id,
          credential_type,
          label,
          masked_value,
          last_used_at,
          created_at,
          updated_at
        FROM wunderland_agent_credentials
        WHERE ${where.join(' AND ')}
        ORDER BY created_at DESC
      `,
      params
    );

    return {
      items: rows.map((row) => this.mapCredential(row)),
    };
  }

  async createCredential(
    userId: string,
    dto: CreateCredentialDto
  ): Promise<{ credential: CredentialRecord }> {
    const seedId = dto.seedId.trim();
    await this.assertOwnedAgent(userId, seedId);

    const type = dto.type.trim();
    const label = dto.label?.trim() || type;
    const value = dto.value.trim();
    const now = Date.now();
    const credentialId = this.db.generateId();

    await this.db.run(
      `
        INSERT INTO wunderland_agent_credentials (
          credential_id,
          seed_id,
          owner_user_id,
          credential_type,
          label,
          encrypted_value,
          masked_value,
          last_used_at,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)
      `,
      [
        credentialId,
        seedId,
        userId,
        type,
        label,
        this.encryptSecret(value),
        this.maskSecret(value),
        now,
        now,
      ]
    );

    const row = await this.db.get<any>(
      `
        SELECT
          credential_id,
          seed_id,
          owner_user_id,
          credential_type,
          label,
          masked_value,
          last_used_at,
          created_at,
          updated_at
        FROM wunderland_agent_credentials
        WHERE credential_id = ?
          AND owner_user_id = ?
        LIMIT 1
      `,
      [credentialId, userId]
    );

    if (!row) {
      throw new NotFoundException('Credential could not be created.');
    }

    return { credential: this.mapCredential(row) };
  }

  async deleteCredential(
    userId: string,
    credentialId: string
  ): Promise<{ credentialId: string; deleted: boolean }> {
    const existing = await this.db.get<{ credential_id: string }>(
      `
        SELECT credential_id
          FROM wunderland_agent_credentials
         WHERE credential_id = ?
           AND owner_user_id = ?
         LIMIT 1
      `,
      [credentialId, userId]
    );
    if (!existing) {
      throw new NotFoundException(`Credential "${credentialId}" not found.`);
    }

    await this.db.run(
      'DELETE FROM wunderland_agent_credentials WHERE credential_id = ? AND owner_user_id = ?',
      [credentialId, userId]
    );

    return { credentialId, deleted: true };
  }
}
