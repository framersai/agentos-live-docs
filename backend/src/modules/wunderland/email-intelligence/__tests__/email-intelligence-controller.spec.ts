/**
 * @file email-intelligence-controller.spec.ts
 * @description Unit tests for EmailIntelligenceController.
 *              Tests controller methods directly with mocked services/DB.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import {
  initializeAppDatabase,
  closeAppDatabase,
  generateId,
  __setAppDatabaseAdapterResolverForTests,
} from '../../../../core/database/appDatabase.js';
import { resolveStorageAdapter } from '@framers/sql-storage-adapter';
import { DatabaseService } from '../../../../database/database.service.js';
import { EmailIntelligenceController } from '../email-intelligence.controller.js';
import { EmailSyncService } from '../services/email-sync.service.js';
import { EmailThreadService } from '../services/email-thread.service.js';

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

let db: DatabaseService;
let syncService: EmailSyncService;
let threadService: EmailThreadService;
let controller: EmailIntelligenceController;

const TEST_SEED_ID = 'test-seed-001';
const TEST_USER_ID = 'test-user-001';

function makePaidUser(id = TEST_USER_ID) {
  return { id, subscriptionStatus: 'active', authenticated: true };
}

function makeReq(internalSecret?: string): any {
  return {
    headers: internalSecret ? { 'x-internal-secret': internalSecret } : {},
  };
}

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();
  threadService = new EmailThreadService(db);
  syncService = new EmailSyncService(db, threadService);
  controller = new EmailIntelligenceController(db, syncService, threadService);
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
});

// ---------------------------------------------------------------------------
// Helpers: seed test data
// ---------------------------------------------------------------------------

async function createTestAccount(overrides: Record<string, any> = {}): Promise<string> {
  const id = overrides.id ?? generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_accounts
      (id, seed_id, owner_user_id, provider, email_address, credential_id,
       sync_enabled, sync_state, sync_cursor, sync_progress_json,
       total_messages_synced, last_sync_error, last_full_sync_at,
       sync_interval_ms, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      overrides.seed_id ?? TEST_SEED_ID,
      overrides.owner_user_id ?? TEST_USER_ID,
      overrides.provider ?? 'gmail',
      overrides.email_address ?? `test-${id}@example.com`,
      overrides.credential_id ?? `cred-${id}`,
      overrides.sync_enabled ?? 1,
      overrides.sync_state ?? 'idle',
      overrides.sync_cursor ?? null,
      overrides.sync_progress_json ?? null,
      overrides.total_messages_synced ?? 0,
      overrides.last_sync_error ?? null,
      overrides.last_full_sync_at ?? null,
      overrides.sync_interval_ms ?? 300000,
      overrides.is_active ?? 1,
      now,
      now,
    ]
  );
  return id;
}

async function createTestMessage(
  accountId: string,
  overrides: Record<string, any> = {}
): Promise<string> {
  const id = overrides.id ?? generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_synced_messages
      (id, provider_message_id, account_id, thread_id, message_id_header,
       subject, from_address, from_name, to_addresses, cc_addresses, bcc_addresses,
       body_text, body_html, snippet, internal_date, received_date,
       labels, is_read, is_starred, is_draft,
       in_reply_to, references_header,
       has_attachments, attachment_count, size_bytes,
       created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      overrides.provider_message_id ?? `gmail-${id}`,
      accountId,
      overrides.thread_id ?? `thread-${id}`,
      overrides.message_id_header ?? `<${id}@example.com>`,
      overrides.subject ?? 'Test subject',
      overrides.from_address ?? 'sender@example.com',
      overrides.from_name ?? 'Sender',
      overrides.to_addresses ?? JSON.stringify([{ email: 'to@example.com', name: 'To' }]),
      overrides.cc_addresses ?? '[]',
      overrides.bcc_addresses ?? '[]',
      overrides.body_text ?? 'Body text',
      overrides.body_html ?? '<p>Body</p>',
      overrides.snippet ?? 'Body text snippet',
      overrides.internal_date ?? now,
      overrides.received_date ?? now,
      overrides.labels ?? '["INBOX"]',
      overrides.is_read ?? 0,
      overrides.is_starred ?? 0,
      overrides.is_draft ?? 0,
      overrides.in_reply_to ?? null,
      overrides.references_header ?? null,
      overrides.has_attachments ?? 0,
      overrides.attachment_count ?? 0,
      overrides.size_bytes ?? 1024,
      now,
      now,
    ]
  );
  return id;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('EmailIntelligenceController', () => {
  describe('listAccounts', () => {
    it('should return active accounts for the seedId', async () => {
      const accountId = await createTestAccount();

      const result = await controller.listAccounts(makeReq(), makePaidUser(), {
        seedId: TEST_SEED_ID,
      });

      expect(result.accounts).toBeDefined();
      expect(Array.isArray(result.accounts)).toBe(true);
      const found = result.accounts.find((a: any) => a.id === accountId);
      expect(found).toBeDefined();
      expect(found!.provider).toBe('gmail');
      expect(found!.syncEnabled).toBe(true);
    });

    it('should not return inactive accounts', async () => {
      const inactiveSeed = `inactive-seed-${generateId()}`;
      await createTestAccount({ seed_id: inactiveSeed, is_active: 0 });

      const result = await controller.listAccounts(makeReq(), makePaidUser(), {
        seedId: inactiveSeed,
      });

      expect(result.accounts).toHaveLength(0);
    });
  });

  describe('getAccountStatus', () => {
    it('should return sync state from DB columns', async () => {
      const accountId = await createTestAccount({
        sync_state: 'syncing',
        total_messages_synced: 42,
        sync_progress_json: JSON.stringify({ type: 'full', syncedMessages: 42 }),
        last_sync_error: null,
      });

      const result = await controller.getAccountStatus(makeReq(), makePaidUser(), accountId, {
        seedId: TEST_SEED_ID,
      });

      expect(result.syncState).toBe('syncing');
      expect(result.totalMessagesSynced).toBe(42);
      expect(result.syncProgress).toEqual({ type: 'full', syncedMessages: 42 });
      expect(result.lastSyncError).toBeNull();
    });

    it('should throw NotFoundException for unknown account', async () => {
      await expect(
        controller.getAccountStatus(makeReq(), makePaidUser(), 'nonexistent-account', {
          seedId: TEST_SEED_ID,
        })
      ).rejects.toThrow('Account not found');
    });
  });

  describe('listMessages', () => {
    it('should return paginated messages', async () => {
      const msgSeed = `msg-seed-${generateId()}`;
      const accountId = await createTestAccount({ seed_id: msgSeed });
      await createTestMessage(accountId, { subject: 'First' });
      await createTestMessage(accountId, { subject: 'Second' });

      const result = await controller.listMessages(makeReq(), makePaidUser(), {
        seedId: msgSeed,
        page: 1,
        limit: 10,
      });

      expect(result.messages.length).toBeGreaterThanOrEqual(2);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should filter by accountId', async () => {
      const filterSeed = `filter-seed-${generateId()}`;
      const account1 = await createTestAccount({ seed_id: filterSeed });
      const account2 = await createTestAccount({ seed_id: filterSeed });
      await createTestMessage(account1, { subject: 'Account1 msg' });
      await createTestMessage(account2, { subject: 'Account2 msg' });

      const result = await controller.listMessages(makeReq(), makePaidUser(), {
        seedId: filterSeed,
        accountId: account1,
        page: 1,
        limit: 10,
      });

      expect(result.messages.every((m: any) => m.accountId === account1)).toBe(true);
    });
  });

  describe('getThread', () => {
    it('should call threadService.reconstructThread and return hierarchy', async () => {
      const threadSeed = `thread-seed-${generateId()}`;
      const accountId = await createTestAccount({ seed_id: threadSeed });
      const threadId = `thread-${generateId()}`;

      // Create two messages in the same thread
      const msg1Id = await createTestMessage(accountId, {
        thread_id: threadId,
        subject: 'Thread subject',
        message_id_header: `<msg1-${threadId}@example.com>`,
        internal_date: Date.now() - 1000,
      });
      await createTestMessage(accountId, {
        thread_id: threadId,
        subject: 'Re: Thread subject',
        message_id_header: `<msg2-${threadId}@example.com>`,
        in_reply_to: `<msg1-${threadId}@example.com>`,
        internal_date: Date.now(),
      });

      const result = await controller.getThread(makeReq(), makePaidUser(), threadId, {
        seedId: threadSeed,
        accountId,
      });

      expect(result.thread).toBeDefined();
      expect(result.thread.threadId).toBe(threadId);
      expect(result.thread.messageCount).toBe(2);
      expect(result.thread.rootMessages.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('triggerSync', () => {
    it('should return accepted and fire async sync', async () => {
      const syncSeed = `sync-seed-${generateId()}`;
      const accountId = await createTestAccount({ seed_id: syncSeed, sync_state: 'idle' });

      // Mock syncAccount to avoid real sync
      const syncSpy = vi.spyOn(syncService, 'syncAccount').mockResolvedValueOnce(undefined);

      const result = await controller.triggerSync(makeReq(), makePaidUser(), accountId, {
        seedId: syncSeed,
      });

      expect(result.status).toBe('accepted');
      expect(result.accountId).toBe(accountId);

      // Allow the async call to fire
      await new Promise((r) => setTimeout(r, 50));
      expect(syncSpy).toHaveBeenCalledWith(accountId);

      syncSpy.mockRestore();
    });

    it('should return already_syncing if account is already syncing', async () => {
      const syncSeed2 = `sync-seed-${generateId()}`;
      const accountId = await createTestAccount({
        seed_id: syncSeed2,
        sync_state: 'syncing',
      });

      const result = await controller.triggerSync(makeReq(), makePaidUser(), accountId, {
        seedId: syncSeed2,
      });

      expect(result.status).toBe('already_syncing');
    });
  });

  describe('deleteAccount', () => {
    it('should set is_active=0 and sync_enabled=0', async () => {
      const delSeed = `del-seed-${generateId()}`;
      const accountId = await createTestAccount({ seed_id: delSeed });

      const result = await controller.deleteAccount(makeReq(), makePaidUser(), accountId, {
        seedId: delSeed,
      });

      expect(result.ok).toBe(true);

      // Verify DB state
      const row = await db.get<{ is_active: number; sync_enabled: number }>(
        `SELECT is_active, sync_enabled FROM wunderland_email_accounts WHERE id = ?`,
        [accountId]
      );
      expect(row?.is_active).toBe(0);
      expect(row?.sync_enabled).toBe(0);
    });

    it('should throw NotFoundException for unknown account', async () => {
      await expect(
        controller.deleteAccount(makeReq(), makePaidUser(), 'nonexistent', { seedId: TEST_SEED_ID })
      ).rejects.toThrow('Account not found');
    });
  });

  describe('assertAccess', () => {
    it('should reject unpaid users', () => {
      const freeUser = { id: 'user1', subscriptionStatus: 'none', authenticated: true };
      expect(() => {
        controller.assertAccess(makeReq(), freeUser, TEST_SEED_ID);
      }).toThrow('Active paid subscription required');
    });

    it('should allow access via internal secret', () => {
      const oldSecret = process.env.INTERNAL_API_SECRET;
      process.env.INTERNAL_API_SECRET = 'test-secret-123';

      expect(() => {
        controller.assertAccess(makeReq('test-secret-123'), null, TEST_SEED_ID);
      }).not.toThrow();

      process.env.INTERNAL_API_SECRET = oldSecret;
    });

    it('should reject invalid internal secret', () => {
      const oldSecret = process.env.INTERNAL_API_SECRET;
      process.env.INTERNAL_API_SECRET = 'correct-secret';

      expect(() => {
        controller.assertAccess(makeReq('wrong-secret'), null, TEST_SEED_ID);
      }).toThrow();

      process.env.INTERNAL_API_SECRET = oldSecret;
    });
  });
});
