/**
 * @file email-retention.spec.ts
 * @description Tests for EmailRetentionService — data retention cleanup logic.
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
import { EmailRetentionService } from '../services/email-retention.service.js';
import { EmailVectorMemoryService } from '../services/email-vector-memory.service.js';

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

let db: DatabaseService;
let retentionService: EmailRetentionService;
let vectorMemory: EmailVectorMemoryService;

const TEST_SEED_ID = 'test-seed-retention';
const TEST_USER_ID = 'test-user-retention';

let removeDocumentsSpy: ReturnType<typeof vi.fn>;

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();
  vectorMemory = new EmailVectorMemoryService(db);

  // Mock removeDocuments to track calls without requiring real FTS
  removeDocumentsSpy = vi.fn().mockResolvedValue(undefined);
  vectorMemory.removeDocuments = removeDocumentsSpy;

  retentionService = new EmailRetentionService(db, vectorMemory);
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
});

beforeEach(() => {
  removeDocumentsSpy.mockClear();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function insertAccount(seedId: string): Promise<string> {
  const id = generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_accounts
      (id, seed_id, owner_user_id, provider, email_address, credential_id, is_active, created_at, updated_at)
     VALUES (?, ?, ?, 'gmail', ?, ?, 1, ?, ?)`,
    [id, seedId, TEST_USER_ID, `${id}@example.com`, generateId(), now, now]
  );
  return id;
}

async function insertMessage(opts: {
  accountId: string;
  threadId: string;
  subject?: string;
  internalDate: number;
}): Promise<string> {
  const id = generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_synced_messages
      (id, provider_message_id, account_id, thread_id, message_id_header,
       subject, from_address, from_name, snippet, internal_date,
       has_attachments, attachment_count, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'test@example.com', 'Test User', 'Snippet',
             ?, 0, 0, ?, ?)`,
    [
      id,
      `prov-${id}`,
      opts.accountId,
      opts.threadId,
      `<${id}@test.com>`,
      opts.subject ?? 'Subject',
      opts.internalDate,
      now,
      now,
    ]
  );
  return id;
}

async function insertAttachment(messageId: string, accountId: string): Promise<string> {
  const id = generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_attachments
      (id, message_id, account_id, filename, mime_type, size_bytes, is_inline, extraction_status, created_at, updated_at)
     VALUES (?, ?, ?, 'file.pdf', 'application/pdf', 1024, 0, 'pending', ?, ?)`,
    [id, messageId, accountId, now, now]
  );
  return id;
}

async function insertRateLimit(seedId: string, windowStart: number): Promise<void> {
  await db.run(
    `INSERT INTO wunderland_email_rate_limits (seed_id, endpoint, window_start, count)
     VALUES (?, 'test_endpoint', ?, 1)
     ON CONFLICT(seed_id, endpoint, window_start) DO UPDATE SET count = count + 1`,
    [seedId, windowStart]
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('EmailRetentionService', () => {
  it('deletes messages older than retention period', async () => {
    const seedId = `${TEST_SEED_ID}-${generateId().slice(0, 6)}`;
    const accountId = await insertAccount(seedId);

    const oldDate = Date.now() - 400 * 86400000; // 400 days ago
    const recentDate = Date.now() - 100 * 86400000; // 100 days ago

    await insertMessage({ accountId, threadId: 'thread-old', internalDate: oldDate });
    await insertMessage({ accountId, threadId: 'thread-recent', internalDate: recentDate });

    const result = await retentionService.cleanupExpiredData(seedId, 365);

    expect(result.messagesDeleted).toBe(1);

    // Verify old message is gone
    const remaining = await db.all<{ id: string }>(
      `SELECT id FROM wunderland_email_synced_messages WHERE account_id = ?`,
      [accountId]
    );
    expect(remaining.length).toBe(1);
  });

  it('deletes attachments for old messages', async () => {
    const seedId = `${TEST_SEED_ID}-${generateId().slice(0, 6)}`;
    const accountId = await insertAccount(seedId);

    const oldDate = Date.now() - 400 * 86400000;
    const msgId = await insertMessage({ accountId, threadId: 'thread-att', internalDate: oldDate });
    await insertAttachment(msgId, accountId);
    await insertAttachment(msgId, accountId);

    const result = await retentionService.cleanupExpiredData(seedId, 365);

    expect(result.messagesDeleted).toBe(1);
    expect(result.attachmentsDeleted).toBeGreaterThanOrEqual(2);

    // Verify attachments are gone
    const remaining = await db.all<{ id: string }>(
      `SELECT id FROM wunderland_email_attachments WHERE message_id = ?`,
      [msgId]
    );
    expect(remaining.length).toBe(0);
  });

  it('calls removeDocuments for FTS cleanup', async () => {
    const seedId = `${TEST_SEED_ID}-${generateId().slice(0, 6)}`;
    const accountId = await insertAccount(seedId);

    const oldDate = Date.now() - 400 * 86400000;
    const msgId = await insertMessage({ accountId, threadId: 'thread-fts', internalDate: oldDate });
    const attId = await insertAttachment(msgId, accountId);

    await retentionService.cleanupExpiredData(seedId, 365);

    // Should have been called for the message FTS entry
    expect(removeDocumentsSpy).toHaveBeenCalledWith(seedId, `email_${msgId}`);
    // Should have been called for the attachment FTS entry
    expect(removeDocumentsSpy).toHaveBeenCalledWith(seedId, `attachment_${attId}`);
  });

  it('keeps messages within retention period', async () => {
    const seedId = `${TEST_SEED_ID}-${generateId().slice(0, 6)}`;
    const accountId = await insertAccount(seedId);

    const recentDate = Date.now() - 100 * 86400000; // 100 days ago
    const msgId = await insertMessage({
      accountId,
      threadId: 'thread-keep',
      internalDate: recentDate,
    });

    const result = await retentionService.cleanupExpiredData(seedId, 365);

    expect(result.messagesDeleted).toBe(0);

    // Message should still exist
    const msg = await db.get<{ id: string }>(
      `SELECT id FROM wunderland_email_synced_messages WHERE id = ?`,
      [msgId]
    );
    expect(msg).toBeDefined();
  });

  it('cleans up old rate limit windows', async () => {
    const seedId = `${TEST_SEED_ID}-${generateId().slice(0, 6)}`;
    await insertAccount(seedId);

    // Insert old rate limit (3 hours ago)
    const oldWindow = Math.floor((Date.now() - 3 * 3600000) / 3600000) * 3600000;
    await insertRateLimit(seedId, oldWindow);

    // Insert recent rate limit (current hour)
    const currentWindow = Math.floor(Date.now() / 3600000) * 3600000;
    await insertRateLimit(seedId, currentWindow);

    const result = await retentionService.cleanupExpiredData(seedId, 365);

    expect(result.rateLimitsDeleted).toBeGreaterThanOrEqual(1);

    // Recent rate limit should still exist
    const recent = await db.get<{ count: number }>(
      `SELECT count FROM wunderland_email_rate_limits WHERE seed_id = ? AND window_start = ?`,
      [seedId, currentWindow]
    );
    expect(recent).toBeDefined();
  });

  it('succeeds with empty data (no messages to clean)', async () => {
    const seedId = `${TEST_SEED_ID}-empty-${generateId().slice(0, 6)}`;
    await insertAccount(seedId);

    const result = await retentionService.cleanupExpiredData(seedId, 365);

    expect(result.messagesDeleted).toBe(0);
    expect(result.attachmentsDeleted).toBe(0);
    // rateLimitsDeleted may be 0 or positive depending on other tests
    expect(result.rateLimitsDeleted).toBeGreaterThanOrEqual(0);
  });
});
