/**
 * @file email-intelligence-endpoints-v2.spec.ts
 * @description Unit tests for the v2 controller endpoints: projects, RAG query,
 *              attachments, stats, and rate-limited routes.
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
import { EmailIntelligenceController } from '../email-intelligence.controller.js';
import { EmailSyncService } from '../services/email-sync.service.js';
import { EmailThreadService } from '../services/email-thread.service.js';
import { EmailProjectService } from '../services/email-project.service.js';
import { EmailRagService } from '../services/email-rag.service.js';
import { EmailAttachmentService } from '../services/email-attachment.service.js';
import { EmailRateLimitService } from '../services/email-rate-limit.service.js';
import { EmailVectorMemoryService } from '../services/email-vector-memory.service.js';

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

let db: DatabaseService;
let controller: EmailIntelligenceController;
let projectService: EmailProjectService;
let ragService: EmailRagService;
let attachmentService: EmailAttachmentService;
let rateLimitService: EmailRateLimitService;

const TEST_SEED_ID = 'test-seed-v2';
const TEST_USER_ID = 'test-user-v2';

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

  const threadService = new EmailThreadService(db);
  const syncService = new EmailSyncService(db, threadService);
  projectService = new EmailProjectService(db);
  rateLimitService = new EmailRateLimitService(db);
  attachmentService = new EmailAttachmentService(db);

  // Create mock services for RAG and vector memory
  const vectorMemory = new EmailVectorMemoryService(db);
  ragService = new EmailRagService(db, vectorMemory);

  controller = new EmailIntelligenceController(
    db,
    syncService,
    threadService,
    projectService,
    ragService,
    attachmentService,
    rateLimitService
  );
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
      null,
      null,
      overrides.total_messages_synced ?? 0,
      null,
      null,
      300000,
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

async function createTestAttachment(
  messageId: string,
  accountId: string,
  overrides: Record<string, any> = {}
): Promise<string> {
  const id = overrides.id ?? generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_attachments
      (id, message_id, account_id, gmail_attachment_id, filename, mime_type,
       size_bytes, is_inline, extraction_status, extracted_text,
       multimodal_description, extraction_error, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      messageId,
      accountId,
      overrides.gmail_attachment_id ?? null,
      overrides.filename ?? 'test.pdf',
      overrides.mime_type ?? 'application/pdf',
      overrides.size_bytes ?? 2048,
      overrides.is_inline ?? 0,
      overrides.extraction_status ?? 'extracted',
      overrides.extracted_text ?? 'Extracted PDF text content',
      overrides.multimodal_description ?? null,
      null,
      now,
      now,
    ]
  );
  return id;
}

// ---------------------------------------------------------------------------
// Tests: Projects
// ---------------------------------------------------------------------------

describe('EmailIntelligenceController v2 — Projects', () => {
  it('POST /projects should create a project via service', async () => {
    const seedId = `proj-seed-${generateId()}`;
    await createTestAccount({ seed_id: seedId });

    const result = await controller.createProject(
      makeReq(),
      makePaidUser(),
      { seedId },
      {
        name: 'Test Project',
        description: 'A test project',
      }
    );

    expect(result.project).toBeDefined();
    expect(result.project.name).toBe('Test Project');
    expect(result.project.description).toBe('A test project');
    expect(result.project.status).toBe('active');
  });

  it('GET /projects/:id/summary should call getProjectSummary', async () => {
    const seedId = `summary-seed-${generateId()}`;
    const accountId = await createTestAccount({ seed_id: seedId });
    const threadId = `thread-summary-${generateId()}`;

    // Create project with threads
    const project = await projectService.createProject(seedId, TEST_USER_ID, 'Summary Project');
    await createTestMessage(accountId, { thread_id: threadId, subject: 'Budget discussion' });
    await projectService.addThreadsToProject(project.id, [{ threadId, accountId }]);

    const result = await controller.getProjectSummary(makeReq(), makePaidUser(), project.id, {
      seedId,
    });

    expect(result.projectId).toBe(project.id);
    expect(result.summary).toBeDefined();
    expect(typeof result.summary).toBe('string');
  });

  it('POST /projects/detect should call detectProjects', async () => {
    const seedId = `detect-seed-${generateId()}`;
    await createTestAccount({ seed_id: seedId });

    const result = await controller.detectProjects(makeReq(), makePaidUser(), { seedId });

    expect(result.proposals).toBeDefined();
    expect(Array.isArray(result.proposals)).toBe(true);
  });

  it('GET /projects should list projects for seed', async () => {
    const seedId = `list-proj-seed-${generateId()}`;
    await createTestAccount({ seed_id: seedId });
    await projectService.createProject(seedId, TEST_USER_ID, 'ListedProject');

    const result = await controller.listProjects(makeReq(), makePaidUser(), { seedId });

    expect(result.projects).toBeDefined();
    expect(result.projects.length).toBeGreaterThanOrEqual(1);
    expect(result.projects.some((p: any) => p.name === 'ListedProject')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tests: RAG Query
// ---------------------------------------------------------------------------

describe('EmailIntelligenceController v2 — RAG Query', () => {
  it('POST /query should call ragService.query with params', async () => {
    const seedId = `rag-seed-${generateId()}`;
    await createTestAccount({ seed_id: seedId });

    const querySpy = vi.spyOn(ragService, 'query').mockResolvedValueOnce({
      results: [],
      totalResults: 0,
    });

    const result = await controller.queryEmails(
      makeReq(),
      makePaidUser(),
      { seedId },
      {
        query: 'budget meeting',
        accountIds: ['acc-1'],
        topK: 5,
      }
    );

    expect(querySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'budget meeting',
        seedId,
        accountIds: ['acc-1'],
        topK: 5,
      })
    );
    expect(result.results).toBeDefined();
    expect(result.totalResults).toBe(0);

    querySpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// Tests: Attachments
// ---------------------------------------------------------------------------

describe('EmailIntelligenceController v2 — Attachments', () => {
  it('GET /attachments/:id should return attachment with extracted text', async () => {
    const seedId = `att-seed-${generateId()}`;
    const accountId = await createTestAccount({ seed_id: seedId });
    const messageId = await createTestMessage(accountId);
    const attachmentId = await createTestAttachment(messageId, accountId, {
      filename: 'report.pdf',
      extracted_text: 'Annual report text',
    });

    const result = await controller.getAttachment(makeReq(), makePaidUser(), attachmentId, {
      seedId,
    });

    expect(result.attachment).toBeDefined();
    expect(result.attachment.id).toBe(attachmentId);
    expect(result.attachment.filename).toBe('report.pdf');
    expect(result.attachment.extractedText).toBe('Annual report text');
  });

  it('POST /attachments/:id/transcribe should call transcribeImage', async () => {
    const seedId = `transcribe-seed-${generateId()}`;
    const accountId = await createTestAccount({ seed_id: seedId });
    const messageId = await createTestMessage(accountId);
    const attachmentId = await createTestAttachment(messageId, accountId, {
      filename: 'photo.png',
      mime_type: 'image/png',
      extraction_status: 'pending_transcription',
      extracted_text: null,
    });

    const transcribeSpy = vi
      .spyOn(attachmentService, 'transcribeImage')
      .mockResolvedValueOnce(undefined);

    const result = await controller.transcribeAttachment(makeReq(), makePaidUser(), attachmentId, {
      seedId,
    });

    expect(result.ok).toBe(true);
    expect(result.attachmentId).toBe(attachmentId);
    expect(transcribeSpy).toHaveBeenCalledWith(attachmentId, expect.any(Buffer));

    transcribeSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// Tests: Stats
// ---------------------------------------------------------------------------

describe('EmailIntelligenceController v2 — Stats', () => {
  it('GET /stats should return aggregate counts', async () => {
    const seedId = `stats-seed-${generateId()}`;
    const accountId = await createTestAccount({ seed_id: seedId, email_address: 'me@example.com' });
    // Create some unread messages
    await createTestMessage(accountId, { is_read: 0, subject: 'Unread 1' });
    await createTestMessage(accountId, { is_read: 0, subject: 'Unread 2' });
    await createTestMessage(accountId, { is_read: 1, subject: 'Read 1' });

    const result = await controller.getStats(makeReq(), makePaidUser(), { seedId });

    expect(result.unreadCount).toBeGreaterThanOrEqual(2);
    expect(typeof result.awaitingReplyCount).toBe('number');
    expect(typeof result.activeProjectsCount).toBe('number');
  });
});
