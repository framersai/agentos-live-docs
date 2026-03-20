/**
 * @file email-report.service.spec.ts
 * @description Tests for EmailReportService — project, thread, and digest report generation.
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
import { EmailReportService } from '../services/email-report.service.js';
import { EmailProjectService } from '../services/email-project.service.js';
import { EmailThreadService } from '../services/email-thread.service.js';

let db: DatabaseService;
let projectService: EmailProjectService;
let threadService: EmailThreadService;
let reportService: EmailReportService;

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();
  projectService = new EmailProjectService(db);
  threadService = new EmailThreadService(db);
  reportService = new EmailReportService(db, projectService, threadService);
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function insertAccount(seedId: string, email?: string): Promise<string> {
  const id = generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_accounts
      (id, seed_id, owner_user_id, provider, email_address, credential_id, is_active, created_at, updated_at)
     VALUES (?, ?, ?, 'gmail', ?, ?, 1, ?, ?)`,
    [id, seedId, 'user-1', email ?? `${id}@example.com`, generateId(), now, now]
  );
  return id;
}

async function insertMessage(opts: {
  accountId: string;
  threadId: string;
  subject?: string;
  fromAddress?: string;
  fromName?: string | null;
  snippet?: string;
  internalDate: number;
  inReplyTo?: string | null;
  attachmentCount?: number;
}): Promise<string> {
  const id = generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_synced_messages
      (id, provider_message_id, account_id, thread_id, message_id_header,
       subject, from_address, from_name, snippet, internal_date,
       in_reply_to, references_header,
       has_attachments, attachment_count,
       created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      `provider-${id}`,
      opts.accountId,
      opts.threadId,
      `<${id}@test.com>`,
      opts.subject ?? 'Test Subject',
      opts.fromAddress ?? 'sender@example.com',
      opts.fromName ?? null,
      opts.snippet ?? 'snippet text',
      opts.internalDate,
      opts.inReplyTo ?? null,
      null,
      opts.attachmentCount ? 1 : 0,
      opts.attachmentCount ?? 0,
      now,
      now,
    ]
  );
  return id;
}

async function insertAttachment(
  messageId: string,
  accountId: string,
  opts?: {
    filename?: string;
    mimeType?: string;
    sizeBytes?: number;
  }
): Promise<string> {
  const id = generateId();
  await db.run(
    `INSERT INTO wunderland_email_attachments
      (id, message_id, account_id, filename, mime_type, size_bytes, extraction_status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
    [
      id,
      messageId,
      accountId,
      opts?.filename ?? 'document.pdf',
      opts?.mimeType ?? 'application/pdf',
      opts?.sizeBytes ?? 1024,
      Date.now(),
      Date.now(),
    ]
  );
  return id;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('EmailReportService', () => {
  describe('generateProjectReport', () => {
    it('builds correct ReportData and formats as markdown', async () => {
      const seedId = generateId();
      const accountId = await insertAccount(seedId);
      const threadId = generateId();

      await insertMessage({
        accountId,
        threadId,
        internalDate: 1000,
        fromAddress: 'alice@test.com',
        fromName: 'Alice',
        subject: 'Q3 Budget',
      });
      await insertMessage({
        accountId,
        threadId,
        internalDate: 2000,
        fromAddress: 'bob@test.com',
        fromName: 'Bob',
        subject: 'Re: Q3 Budget',
        inReplyTo: '<something>',
      });

      const project = await projectService.createProject(seedId, 'user-1', 'Q3 Budget Review');
      await projectService.addThreadsToProject(project.id, [{ threadId, accountId }], 'user-1');

      const result = await reportService.generateProjectReport(project.id, 'markdown');

      expect(result.mimeType).toBe('text/markdown');
      expect(result.filename).toContain('project-');
      expect(result.filename).toContain('.md');
      expect(result.sizeBytes).toBeGreaterThan(0);
      expect(typeof result.content).toBe('string');

      const md = result.content as string;
      expect(md).toContain('Q3 Budget Review');
      expect(md).toContain('alice@test.com');
      expect(md).toContain('bob@test.com');
    });

    it('returns JSON format with correct mimeType', async () => {
      const seedId = generateId();
      const accountId = await insertAccount(seedId);
      const threadId = generateId();

      await insertMessage({
        accountId,
        threadId,
        internalDate: 1000,
        fromAddress: 'alice@test.com',
        subject: 'JSON Test',
      });

      const project = await projectService.createProject(seedId, 'user-1', 'JSON Project');
      await projectService.addThreadsToProject(project.id, [{ threadId, accountId }], 'user-1');

      const result = await reportService.generateProjectReport(project.id, 'json');

      expect(result.mimeType).toBe('application/json');
      expect(result.filename).toContain('.json');
      const parsed = JSON.parse(result.content as string);
      expect(parsed.type).toBe('project');
      expect(parsed.overview.name).toBe('JSON Project');
    });

    it('throws when project not found', async () => {
      await expect(
        reportService.generateProjectReport('nonexistent-id', 'markdown')
      ).rejects.toThrow('not found');
    });
  });

  describe('generateThreadReport', () => {
    it('includes thread hierarchy data', async () => {
      const seedId = generateId();
      const accountId = await insertAccount(seedId);
      const threadId = generateId();

      const msgId1 = await insertMessage({
        accountId,
        threadId,
        internalDate: 1000,
        fromAddress: 'alice@test.com',
        fromName: 'Alice',
        subject: 'Thread Topic',
      });
      await insertMessage({
        accountId,
        threadId,
        internalDate: 2000,
        fromAddress: 'bob@test.com',
        fromName: 'Bob',
        subject: 'Re: Thread Topic',
        inReplyTo: `<${msgId1}@test.com>`,
      });

      const result = await reportService.generateThreadReport(threadId, accountId, 'markdown');

      expect(result.mimeType).toBe('text/markdown');
      expect(result.filename).toContain('thread-');
      const md = result.content as string;
      expect(md).toContain('Thread Topic');
      expect(md).toContain('alice@test.com');
      expect(md).toContain('bob@test.com');
    });

    it('includes attachment data in thread report', async () => {
      const seedId = generateId();
      const accountId = await insertAccount(seedId);
      const threadId = generateId();

      const msgId = await insertMessage({
        accountId,
        threadId,
        internalDate: 1000,
        fromAddress: 'alice@test.com',
        subject: 'With Attachments',
        attachmentCount: 1,
      });
      await insertAttachment(msgId, accountId, {
        filename: 'report.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        sizeBytes: 5120,
      });

      const result = await reportService.generateThreadReport(threadId, accountId, 'json');
      const parsed = JSON.parse(result.content as string);

      expect(parsed.attachments).toHaveLength(1);
      expect(parsed.attachments[0].filename).toBe('report.xlsx');
      expect(parsed.attachments[0].sizeBytes).toBe(5120);
    });
  });

  describe('generateDigestReport', () => {
    it('filters by sinceDate', async () => {
      const seedId = generateId();
      const accountId = await insertAccount(seedId);
      const threadId = generateId();

      // Old message (before sinceDate)
      await insertMessage({
        accountId,
        threadId,
        internalDate: 1000,
        fromAddress: 'old@test.com',
        subject: 'Old Message',
      });
      // New message (after sinceDate)
      await insertMessage({
        accountId,
        threadId,
        internalDate: 5000,
        fromAddress: 'new@test.com',
        subject: 'New Message',
      });

      const result = await reportService.generateDigestReport(seedId, 3000, 'json');
      const parsed = JSON.parse(result.content as string);

      expect(parsed.type).toBe('digest');
      // Only the new message should be included
      expect(parsed.overview.messageCount).toBe(1);
      expect(parsed.overview.participants).toHaveLength(1);
      expect(parsed.overview.participants[0].email).toBe('new@test.com');
    });

    it('handles empty result (no new messages)', async () => {
      const seedId = generateId();
      await insertAccount(seedId);

      const result = await reportService.generateDigestReport(seedId, Date.now(), 'markdown');

      expect(result.sizeBytes).toBeGreaterThan(0);
      const md = result.content as string;
      expect(md).toContain('Digest');

      // Should show zero messages
      const jsonResult = await reportService.generateDigestReport(seedId, Date.now(), 'json');
      const parsed = JSON.parse(jsonResult.content as string);
      expect(parsed.overview.messageCount).toBe(0);
      expect(parsed.overview.threadCount).toBe(0);
    });

    it('filters by account when filterAccounts provided', async () => {
      const seedId = generateId();
      const accountA = await insertAccount(seedId, 'a@test.com');
      const accountB = await insertAccount(seedId, 'b@test.com');
      const threadA = generateId();
      const threadB = generateId();

      await insertMessage({
        accountId: accountA,
        threadId: threadA,
        internalDate: 5000,
        fromAddress: 'alice@test.com',
        subject: 'Account A Message',
      });
      await insertMessage({
        accountId: accountB,
        threadId: threadB,
        internalDate: 5000,
        fromAddress: 'bob@test.com',
        subject: 'Account B Message',
      });

      const result = await reportService.generateDigestReport(seedId, 1000, 'json', {
        filterAccounts: [accountA],
      });
      const parsed = JSON.parse(result.content as string);

      expect(parsed.overview.messageCount).toBe(1);
      expect(parsed.overview.participants[0].email).toBe('alice@test.com');
    });
  });
});
