/**
 * @file email-tables.spec.ts
 * @description Verifies that all 7 email intelligence tables are created
 *              and that unique constraints are enforced.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  initializeAppDatabase,
  closeAppDatabase,
  generateId,
  __setAppDatabaseAdapterResolverForTests,
} from '../../../../core/database/appDatabase.js';
import { resolveStorageAdapter } from '@framers/sql-storage-adapter';
import { DatabaseService } from '../../../../database/database.service.js';

let db: DatabaseService;

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
});

const EMAIL_TABLES = [
  'wunderland_email_accounts',
  'wunderland_email_synced_messages',
  'wunderland_email_attachments',
  'wunderland_email_projects',
  'wunderland_email_project_threads',
  'wunderland_email_digests',
  'wunderland_email_rate_limits',
] as const;

describe('email intelligence tables', () => {
  it.each(EMAIL_TABLES)('table %s exists in sqlite_master', async (table) => {
    const row = await db.get<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      [table]
    );
    expect(row).toBeDefined();
    expect(row!.name).toBe(table);
  });

  it('enforces UNIQUE(seed_id, email_address) on wunderland_email_accounts', async () => {
    const now = Date.now();
    const seedId = generateId();
    const email = `unique-test-${generateId()}@example.com`;
    const base = {
      seed_id: seedId,
      owner_user_id: generateId(),
      provider: 'gmail',
      email_address: email,
      credential_id: generateId(),
      created_at: now,
      updated_at: now,
    };

    // First insert succeeds
    await db.run(
      `INSERT INTO wunderland_email_accounts (id, seed_id, owner_user_id, provider, email_address, credential_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        generateId(),
        base.seed_id,
        base.owner_user_id,
        base.provider,
        base.email_address,
        base.credential_id,
        base.created_at,
        base.updated_at,
      ]
    );

    // Duplicate (same seed_id + email_address) must throw
    await expect(
      db.run(
        `INSERT INTO wunderland_email_accounts (id, seed_id, owner_user_id, provider, email_address, credential_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          generateId(),
          base.seed_id,
          base.owner_user_id,
          base.provider,
          base.email_address,
          base.credential_id,
          base.created_at,
          base.updated_at,
        ]
      )
    ).rejects.toThrow(/UNIQUE/);
  });

  it('enforces UNIQUE(project_id, thread_id, account_id) on wunderland_email_project_threads', async () => {
    const now = Date.now();
    const projectId = generateId();
    const threadId = generateId();
    const accountId = generateId();

    await db.run(
      `INSERT INTO wunderland_email_project_threads (id, project_id, thread_id, account_id, added_by, added_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [generateId(), projectId, threadId, accountId, 'user', now]
    );

    await expect(
      db.run(
        `INSERT INTO wunderland_email_project_threads (id, project_id, thread_id, account_id, added_by, added_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [generateId(), projectId, threadId, accountId, 'user', now]
      )
    ).rejects.toThrow(/UNIQUE/);
  });

  it('enforces UNIQUE index on wunderland_email_synced_messages(account_id, provider_message_id)', async () => {
    const now = Date.now();
    const accountId = generateId();
    const providerMsgId = `msg-${generateId()}`;

    await db.run(
      `INSERT INTO wunderland_email_synced_messages
        (id, provider_message_id, account_id, thread_id, from_address, internal_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [generateId(), providerMsgId, accountId, generateId(), 'a@b.com', now, now, now]
    );

    await expect(
      db.run(
        `INSERT INTO wunderland_email_synced_messages
          (id, provider_message_id, account_id, thread_id, from_address, internal_date, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [generateId(), providerMsgId, accountId, generateId(), 'c@d.com', now, now, now]
      )
    ).rejects.toThrow(/UNIQUE/);
  });
});
