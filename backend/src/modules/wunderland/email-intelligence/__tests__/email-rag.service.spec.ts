/**
 * @file email-rag.service.spec.ts
 * @description Tests for EmailRagService — indexing messages, indexing
 *              attachments, batch indexing, and query with filtering.
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import {
  initializeAppDatabase,
  closeAppDatabase,
  generateId,
  __setAppDatabaseAdapterResolverForTests,
} from '../../../../core/database/appDatabase.js';
import { resolveStorageAdapter } from '@framers/sql-storage-adapter';
import { DatabaseService } from '../../../../database/database.service.js';
import { EmailVectorMemoryService } from '../services/email-vector-memory.service.js';
import { EmailRagService } from '../services/email-rag.service.js';

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

let db: DatabaseService;
let vectorMemory: EmailVectorMemoryService;
let service: EmailRagService;

const SEED_ID = 'rag-test-seed';
const ACCOUNT_ID = generateId();

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();
  vectorMemory = new EmailVectorMemoryService(db);
  service = new EmailRagService(db, vectorMemory);

  // Insert a test account so JOIN queries work
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_accounts
      (id, seed_id, owner_user_id, provider, email_address, credential_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [ACCOUNT_ID, SEED_ID, 'user-1', 'gmail', 'test@example.com', 'cred-1', now, now]
  );
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function insertMessage(
  overrides: Partial<{
    id: string;
    accountId: string;
    threadId: string;
    subject: string;
    fromAddress: string;
    fromName: string;
    toAddresses: string;
    bodyText: string;
    internalDate: number;
    ragIndexedAt: number | null;
  }> = {}
): Promise<string> {
  const id = overrides.id || generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_synced_messages
      (id, provider_message_id, account_id, thread_id, subject,
       from_address, from_name, to_addresses, body_text, internal_date,
       is_read, is_starred, is_draft, has_attachments, attachment_count,
       rag_indexed_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, ?, ?, ?)`,
    [
      id,
      `provider_${id}`,
      overrides.accountId || ACCOUNT_ID,
      overrides.threadId || `thread_${id}`,
      overrides.subject || 'Test Subject',
      overrides.fromAddress || 'sender@example.com',
      overrides.fromName || 'Sender Name',
      overrides.toAddresses || '["recipient@example.com"]',
      overrides.bodyText || 'This is the email body text for testing.',
      overrides.internalDate || now,
      overrides.ragIndexedAt ?? null,
      now,
      now,
    ]
  );
  return id;
}

async function insertAttachment(
  messageId: string,
  overrides: Partial<{
    id: string;
    accountId: string;
    filename: string;
    mimeType: string;
    extractionStatus: string;
    extractedText: string | null;
    multimodalDescription: string | null;
    ragIndexedAt: number | null;
  }> = {}
): Promise<string> {
  const id = overrides.id || generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_attachments
      (id, message_id, account_id, filename, mime_type, size_bytes,
       is_inline, extraction_status, extracted_text, multimodal_description,
       rag_indexed_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      messageId,
      overrides.accountId || ACCOUNT_ID,
      overrides.filename || 'document.pdf',
      overrides.mimeType || 'application/pdf',
      1024,
      overrides.extractionStatus || 'pending',
      overrides.extractedText ?? null,
      overrides.multimodalDescription ?? null,
      overrides.ragIndexedAt ?? null,
      now,
      now,
    ]
  );
  return id;
}

// ---------------------------------------------------------------------------
// 1. indexMessage builds correct document text and calls vectorMemory
// ---------------------------------------------------------------------------

describe('indexMessage', () => {
  it('should build document text and ingest via vectorMemory', async () => {
    const ingestSpy = vi.spyOn(vectorMemory, 'ingestEmailBody');

    const msgId = await insertMessage({
      subject: 'Weekly Report',
      fromAddress: 'alice@corp.com',
      fromName: 'Alice',
      toAddresses: '["bob@corp.com"]',
      bodyText: 'Here are the weekly metrics for the engineering team.',
      internalDate: 1700000000000,
    });

    await service.indexMessage(SEED_ID, msgId);

    expect(ingestSpy).toHaveBeenCalledOnce();
    const [seedId, docId, content, metadata] = ingestSpy.mock.calls[0];
    expect(seedId).toBe(SEED_ID);
    expect(docId).toBe(`email_${msgId}`);
    expect(content).toContain('From: alice@corp.com (Alice)');
    expect(content).toContain('Subject: Weekly Report');
    expect(content).toContain('weekly metrics');
    expect(metadata).toMatchObject({
      messageId: msgId,
      from: 'alice@corp.com',
      subject: 'Weekly Report',
    });

    ingestSpy.mockRestore();
  });

  it('should update rag_indexed_at on the message row', async () => {
    const msgId = await insertMessage({ subject: 'Indexed test' });

    // Verify not indexed yet
    const before = await db.get<{ rag_indexed_at: number | null }>(
      `SELECT rag_indexed_at FROM wunderland_email_synced_messages WHERE id = ?`,
      [msgId]
    );
    expect(before!.rag_indexed_at).toBeNull();

    await service.indexMessage(SEED_ID, msgId);

    const after = await db.get<{ rag_indexed_at: number | null }>(
      `SELECT rag_indexed_at FROM wunderland_email_synced_messages WHERE id = ?`,
      [msgId]
    );
    expect(after!.rag_indexed_at).toBeTypeOf('number');
    expect(after!.rag_indexed_at).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 2. indexAttachment — extracted text (PDF)
// ---------------------------------------------------------------------------

describe('indexAttachment', () => {
  it('should index extracted_text for PDF attachments', async () => {
    const ingestSpy = vi.spyOn(vectorMemory, 'ingestAttachment');
    const msgId = await insertMessage();

    const attId = await insertAttachment(msgId, {
      filename: 'report.pdf',
      mimeType: 'application/pdf',
      extractionStatus: 'extracted',
      extractedText: 'Q3 financial results show 15% growth in revenue.',
    });

    await service.indexAttachment(SEED_ID, attId);

    expect(ingestSpy).toHaveBeenCalledOnce();
    const [seedId, docId, content, metadata] = ingestSpy.mock.calls[0];
    expect(seedId).toBe(SEED_ID);
    expect(docId).toBe(`attachment_${attId}`);
    expect(content).toContain('Q3 financial results');
    expect(metadata).toMatchObject({
      attachmentId: attId,
      messageId: msgId,
      filename: 'report.pdf',
      mimeType: 'application/pdf',
    });

    ingestSpy.mockRestore();
  });

  it('should index multimodal_description for transcribed images', async () => {
    const ingestSpy = vi.spyOn(vectorMemory, 'ingestAttachment');
    const msgId = await insertMessage();

    const attId = await insertAttachment(msgId, {
      filename: 'chart.png',
      mimeType: 'image/png',
      extractionStatus: 'transcribed',
      multimodalDescription: 'Bar chart showing monthly sales figures from January to June.',
    });

    await service.indexAttachment(SEED_ID, attId);

    expect(ingestSpy).toHaveBeenCalledOnce();
    const [, , content] = ingestSpy.mock.calls[0];
    expect(content).toContain('Bar chart showing monthly sales');

    ingestSpy.mockRestore();
  });

  it('should skip attachments with no text (extraction_status=pending)', async () => {
    const ingestSpy = vi.spyOn(vectorMemory, 'ingestAttachment');
    const msgId = await insertMessage();

    const attId = await insertAttachment(msgId, {
      filename: 'unknown.bin',
      extractionStatus: 'pending',
      extractedText: null,
      multimodalDescription: null,
    });

    await service.indexAttachment(SEED_ID, attId);

    expect(ingestSpy).not.toHaveBeenCalled();

    // rag_indexed_at should remain null
    const row = await db.get<{ rag_indexed_at: number | null }>(
      `SELECT rag_indexed_at FROM wunderland_email_attachments WHERE id = ?`,
      [attId]
    );
    expect(row!.rag_indexed_at).toBeNull();

    ingestSpy.mockRestore();
  });

  it('should update rag_indexed_at on the attachment row', async () => {
    const msgId = await insertMessage();
    const attId = await insertAttachment(msgId, {
      extractionStatus: 'extracted',
      extractedText: 'Some extracted content.',
    });

    await service.indexAttachment(SEED_ID, attId);

    const row = await db.get<{ rag_indexed_at: number | null }>(
      `SELECT rag_indexed_at FROM wunderland_email_attachments WHERE id = ?`,
      [attId]
    );
    expect(row!.rag_indexed_at).toBeTypeOf('number');
    expect(row!.rag_indexed_at).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 3. indexPendingMessages
// ---------------------------------------------------------------------------

describe('indexPendingMessages', () => {
  it('should find and index all un-indexed messages for the seed', async () => {
    // Insert messages — some already indexed, some not
    const msg1 = await insertMessage({
      subject: 'Pending msg 1',
      bodyText: 'Pending content alpha zeppelin.',
      ragIndexedAt: null,
    });
    const msg2 = await insertMessage({
      subject: 'Pending msg 2',
      bodyText: 'Pending content beta zeppelin.',
      ragIndexedAt: null,
    });
    // Already indexed
    await insertMessage({
      subject: 'Already indexed',
      bodyText: 'Already indexed content.',
      ragIndexedAt: Date.now(),
    });

    const result = await service.indexPendingMessages(SEED_ID);
    // At least these 2 newly inserted unindexed messages
    expect(result.indexed).toBeGreaterThanOrEqual(2);

    // Verify they are now indexed
    for (const id of [msg1, msg2]) {
      const row = await db.get<{ rag_indexed_at: number | null }>(
        `SELECT rag_indexed_at FROM wunderland_email_synced_messages WHERE id = ?`,
        [id]
      );
      expect(row!.rag_indexed_at).not.toBeNull();
    }
  });
});

// ---------------------------------------------------------------------------
// 4. query returns results with enriched message metadata
// ---------------------------------------------------------------------------

describe('query', () => {
  let queryMsgId: string;

  beforeAll(async () => {
    queryMsgId = await insertMessage({
      subject: 'Quarterly Budget Review',
      fromAddress: 'finance@acme.com',
      fromName: 'Finance Team',
      bodyText: 'The quarterly budget review indicates overspending in marketing.',
      internalDate: 1700000000000,
      ragIndexedAt: null,
    });

    // Index it
    await service.indexMessage(SEED_ID, queryMsgId);
  });

  it('should return results with enriched message metadata', async () => {
    const response = await service.query({
      query: 'quarterly budget',
      seedId: SEED_ID,
    });

    expect(response.totalResults).toBeGreaterThanOrEqual(1);
    const match = response.results.find((r) => r.messageId === queryMsgId);
    expect(match).toBeDefined();
    expect(match!.from).toBe('finance@acme.com');
    expect(match!.subject).toBe('Quarterly Budget Review');
    expect(match!.date).toBe(1700000000000);
    expect(match!.collection).toBe('bodies');
    expect(match!.snippet).toBeTruthy();
  });

  it('should respect includeAttachments=false', async () => {
    // Insert an attachment with matching content
    const attMsgId = await insertMessage({
      subject: 'Budget Attachment',
      bodyText: 'See attached budget spreadsheet.',
    });
    const attId = await insertAttachment(attMsgId, {
      filename: 'budget.xlsx',
      extractionStatus: 'extracted',
      extractedText: 'Quarterly budget spreadsheet with detailed projections.',
    });
    await service.indexMessage(SEED_ID, attMsgId);
    await service.indexAttachment(SEED_ID, attId);

    // Query with attachments excluded
    const response = await service.query({
      query: 'budget',
      seedId: SEED_ID,
      includeAttachments: false,
    });

    // All results should be from 'bodies' collection
    for (const r of response.results) {
      expect(r.collection).toBe('bodies');
    }
  });

  it('should return empty results for non-matching query', async () => {
    const response = await service.query({
      query: 'xyznonexistent',
      seedId: SEED_ID,
    });
    expect(response.totalResults).toBe(0);
    expect(response.results).toEqual([]);
  });
});
