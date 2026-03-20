/**
 * @file credentials-metadata.spec.ts
 * @description Verifies that metadata and expires_at columns work on wunderbot_credentials.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  initializeAppDatabase,
  getAppDatabase,
  closeAppDatabase,
  generateId,
  __setAppDatabaseAdapterResolverForTests,
} from '../../../../core/database/appDatabase.js';
import { resolveStorageAdapter, type StorageAdapter } from '@framers/sql-storage-adapter';
import { CredentialsService } from '../credentials.service.js';
import { DatabaseService } from '../../../../database/database.service.js';

let db: DatabaseService;
let service: CredentialsService;
let userId: string;
let seedId: string;

beforeAll(async () => {
  // Force in-memory SQLite for tests
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();

  db = new DatabaseService();
  service = new CredentialsService(db);

  // Create test user (FK constraint)
  userId = generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO app_users (id, email, password_hash, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, `test-${userId}@example.com`, 'hash', now, now]
  );

  // Create test wunderbot (FK constraint)
  seedId = generateId();
  await db.run(
    `INSERT INTO wunderbots (seed_id, owner_user_id, display_name, hexaco_traits, security_profile, inference_hierarchy, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [seedId, userId, 'test-agent', '{}', '{}', '[]', 'active', now, now]
  );
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
});

describe('wunderbot_credentials metadata & expires_at', () => {
  it('creates a credential with metadata and expiresAt', async () => {
    const metadata = JSON.stringify({ refreshToken: 'rt_abc123', scopes: ['email', 'calendar'] });
    const expiresAt = Date.now() + 3600_000; // 1 hour from now

    const result = await service.createCredential(userId, {
      seedId,
      type: 'gmail_oauth',
      label: 'Gmail Token',
      value: 'access_token_xyz',
      metadata,
      expiresAt,
    });

    expect(result.credential).toBeDefined();
    expect(result.credential.credentialId).toBeTruthy();

    // Verify the columns are stored in the database
    const row = await db.get<{ metadata: string | null; expires_at: number | null }>(
      `SELECT metadata, expires_at FROM wunderbot_credentials WHERE credential_id = ?`,
      [result.credential.credentialId]
    );

    expect(row).toBeDefined();
    expect(row!.metadata).toBe(metadata);
    expect(row!.expires_at).toBe(expiresAt);
  });

  it('creates a credential without metadata and expiresAt (backward compat)', async () => {
    const result = await service.createCredential(userId, {
      seedId,
      type: 'slack_bot_token',
      label: 'Slack Bot',
      value: 'dummy-bot-token-value',
    });

    expect(result.credential).toBeDefined();

    const row = await db.get<{ metadata: string | null; expires_at: number | null }>(
      `SELECT metadata, expires_at FROM wunderbot_credentials WHERE credential_id = ?`,
      [result.credential.credentialId]
    );

    expect(row).toBeDefined();
    expect(row!.metadata).toBeNull();
    expect(row!.expires_at).toBeNull();
  });

  it('stores valid JSON metadata that can be parsed back', async () => {
    const metaObj = { refreshToken: 'rt_999', provider: 'google', scopes: ['mail.read'] };
    const metadata = JSON.stringify(metaObj);

    const result = await service.createCredential(userId, {
      seedId,
      type: 'google_oauth',
      label: 'Google OAuth',
      value: 'access_tok',
      metadata,
      expiresAt: 0, // epoch zero is a valid value
    });

    const row = await db.get<{ metadata: string | null; expires_at: number | null }>(
      `SELECT metadata, expires_at FROM wunderbot_credentials WHERE credential_id = ?`,
      [result.credential.credentialId]
    );

    expect(row).toBeDefined();
    const parsed = JSON.parse(row!.metadata!);
    expect(parsed.refreshToken).toBe('rt_999');
    expect(parsed.scopes).toEqual(['mail.read']);
    expect(row!.expires_at).toBe(0);
  });
});
