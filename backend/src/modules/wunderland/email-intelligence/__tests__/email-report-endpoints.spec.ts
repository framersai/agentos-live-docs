/**
 * @file email-report-endpoints.spec.ts
 * @description Unit tests for the report/digest REST endpoints on
 *              EmailIntelligenceController (Tasks 4).
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
import { EmailReportService } from '../services/email-report.service.js';
import { EmailDigestService } from '../services/email-digest.service.js';

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

let db: DatabaseService;
let controller: EmailIntelligenceController;
let reportService: EmailReportService;
let digestService: EmailDigestService;
let rateLimitService: EmailRateLimitService;

const TEST_SEED_ID = 'test-seed-reports';
const TEST_USER_ID = 'test-user-reports';

function makePaidUser(id = TEST_USER_ID) {
  return { id, subscriptionStatus: 'active', authenticated: true };
}

function makeReq(): any {
  return { headers: {} };
}

// Stubs for response object
function makeRes(): any {
  const headers: Record<string, string> = {};
  return {
    set: (key: string, val: string) => {
      headers[key] = val;
    },
    getHeaders: () => headers,
    _headers: headers,
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
  const projectService = new EmailProjectService(db);
  rateLimitService = new EmailRateLimitService(db);
  const attachmentService = new EmailAttachmentService(db);
  const vectorMemory = new EmailVectorMemoryService(db);
  const ragService = new EmailRagService(db, vectorMemory);
  reportService = new EmailReportService(db, projectService, threadService);

  // Mock digest service — we test the controller routing, not digest internals
  digestService = {
    listDigests: vi
      .fn()
      .mockResolvedValue([
        { id: 'digest-1', seed_id: TEST_SEED_ID, name: 'Weekly', schedule: 'weekly' },
      ]),
    createDigest: vi.fn().mockResolvedValue({
      id: 'digest-new',
      seed_id: TEST_SEED_ID,
      name: 'Daily',
      schedule: 'daily',
    }),
    getDigest: vi.fn().mockImplementation(async (id: string) => {
      if (id === 'digest-1') {
        return { id: 'digest-1', seed_id: TEST_SEED_ID, name: 'Weekly', schedule: 'weekly' };
      }
      return undefined;
    }),
    updateDigest: vi.fn().mockResolvedValue(undefined),
    deleteDigest: vi.fn().mockResolvedValue(undefined),
    previewDigest: vi.fn().mockResolvedValue({
      content: '# Preview',
      filename: 'preview.md',
      mimeType: 'text/markdown',
      sizeBytes: 9,
    }),
    sendNow: vi.fn().mockResolvedValue(undefined),
  } as any;

  controller = new EmailIntelligenceController(
    db,
    syncService,
    threadService,
    projectService,
    ragService,
    attachmentService,
    rateLimitService,
    reportService,
    digestService
  );
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
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
  internalDate?: number;
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
      opts.subject ?? 'Test Subject',
      opts.internalDate ?? now,
      now,
      now,
    ]
  );
  return id;
}

// ---------------------------------------------------------------------------
// Report Endpoint Tests
// ---------------------------------------------------------------------------

describe('Report endpoints', () => {
  let accountId: string;
  let projectId: string;

  beforeAll(async () => {
    accountId = await insertAccount(TEST_SEED_ID);

    // Create a project with a thread
    const threadId = generateId();
    await insertMessage({ accountId, threadId, subject: 'Report test' });

    const project = await db.get<{ id: string }>(
      `SELECT id FROM wunderland_email_projects WHERE seed_id = ?`,
      [TEST_SEED_ID]
    );

    if (!project) {
      // Create project manually
      projectId = generateId();
      const now = Date.now();
      await db.run(
        `INSERT INTO wunderland_email_projects (id, seed_id, owner_user_id, name, status, created_at, updated_at)
         VALUES (?, ?, ?, 'Test Project', 'active', ?, ?)`,
        [projectId, TEST_SEED_ID, TEST_USER_ID, now, now]
      );
      await db.run(
        `INSERT INTO wunderland_email_project_threads (id, project_id, thread_id, account_id, added_by, added_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [generateId(), projectId, threadId, accountId, TEST_USER_ID, now]
      );
    } else {
      projectId = project.id;
    }
  });

  it('POST /reports/project returns formatted markdown content', async () => {
    const result = await controller.generateProjectReport(
      makeReq(),
      makeRes(),
      makePaidUser(),
      projectId,
      { seedId: TEST_SEED_ID },
      { format: 'markdown' }
    );

    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('filename');
    expect(result).toHaveProperty('mimeType');
    expect(result.mimeType).toBe('text/markdown');
    expect(typeof result.content).toBe('string');
  });

  it('POST /reports/project with format=json returns JSON content', async () => {
    const result = await controller.generateProjectReport(
      makeReq(),
      makeRes(),
      makePaidUser(),
      projectId,
      { seedId: TEST_SEED_ID },
      { format: 'json' }
    );

    expect(result.mimeType).toBe('application/json');
    // Content should be parseable JSON string
    const parsed = JSON.parse(result.content as string);
    expect(parsed).toHaveProperty('type', 'project');
  });

  it('POST /reports/project with format=pdf sets Content-Type header', async () => {
    const res = makeRes();
    const result = await controller.generateProjectReport(
      makeReq(),
      res,
      makePaidUser(),
      projectId,
      { seedId: TEST_SEED_ID },
      { format: 'pdf' }
    );

    expect(res._headers['Content-Type']).toBe('application/pdf');
    expect(res._headers['Content-Disposition']).toMatch(/^attachment; filename="/);
    // PDF returns the buffer directly
    expect(Buffer.isBuffer(result) || typeof result === 'string').toBe(true);
  });

  it('POST /reports/project returns 404 for missing project', async () => {
    await expect(
      controller.generateProjectReport(
        makeReq(),
        makeRes(),
        makePaidUser(),
        'nonexistent-id',
        { seedId: TEST_SEED_ID },
        { format: 'markdown' }
      )
    ).rejects.toThrow(/not found/i);
  });
});

// ---------------------------------------------------------------------------
// Digest Endpoint Tests
// ---------------------------------------------------------------------------

describe('Digest endpoints', () => {
  it('GET /digests lists digests', async () => {
    const result = await controller.listDigests(makeReq(), makePaidUser(), {
      seedId: TEST_SEED_ID,
    });
    expect(result).toHaveProperty('digests');
    expect(Array.isArray(result.digests)).toBe(true);
    expect(digestService.listDigests).toHaveBeenCalledWith(TEST_SEED_ID);
  });

  it('POST /digests creates a digest', async () => {
    const result = await controller.createDigest(
      makeReq(),
      makePaidUser(),
      { seedId: TEST_SEED_ID },
      {
        schedule: 'daily',
        deliveryChannel: 'dashboard',
        deliveryTarget: 'self',
      }
    );

    expect(result).toHaveProperty('digest');
    expect(result.digest).toHaveProperty('id', 'digest-new');
    expect(digestService.createDigest).toHaveBeenCalledWith(
      TEST_SEED_ID,
      TEST_USER_ID,
      expect.objectContaining({ schedule: 'daily', deliveryChannel: 'dashboard' })
    );
  });

  it('GET /digests/:digestId returns single digest', async () => {
    const result = await controller.getDigest(makeReq(), makePaidUser(), 'digest-1', {
      seedId: TEST_SEED_ID,
    });
    expect(result.digest).toHaveProperty('id', 'digest-1');
  });

  it('GET /digests/:digestId returns 404 for missing digest', async () => {
    await expect(
      controller.getDigest(makeReq(), makePaidUser(), 'nonexistent', { seedId: TEST_SEED_ID })
    ).rejects.toThrow(/not found/i);
  });

  it('PATCH /digests/:digestId updates a digest', async () => {
    const result = await controller.updateDigest(
      makeReq(),
      makePaidUser(),
      'digest-1',
      { seedId: TEST_SEED_ID },
      { name: 'Updated' }
    );
    expect(result).toEqual({ ok: true, digestId: 'digest-1' });
    expect(digestService.updateDigest).toHaveBeenCalledWith('digest-1', { name: 'Updated' });
  });

  it('DELETE /digests/:digestId deletes a digest', async () => {
    const result = await controller.deleteDigest(makeReq(), makePaidUser(), 'digest-1', {
      seedId: TEST_SEED_ID,
    });
    expect(result).toEqual({ ok: true, digestId: 'digest-1' });
    expect(digestService.deleteDigest).toHaveBeenCalledWith('digest-1', TEST_USER_ID);
  });

  it('POST /digests/:digestId/preview returns preview content', async () => {
    const result = await controller.previewDigest(makeReq(), makePaidUser(), 'digest-1', {
      seedId: TEST_SEED_ID,
    });
    expect(result).toHaveProperty('content', '# Preview');
    expect(result).toHaveProperty('mimeType', 'text/markdown');
  });

  it('POST /digests/:digestId/send-now triggers delivery', async () => {
    const result = await controller.sendDigestNow(makeReq(), makePaidUser(), 'digest-1', {
      seedId: TEST_SEED_ID,
    });
    expect(result).toEqual({ ok: true, digestId: 'digest-1', status: 'sent' });
    expect(digestService.sendNow).toHaveBeenCalledWith('digest-1');
  });
});

// ---------------------------------------------------------------------------
// Rate Limit Tests
// ---------------------------------------------------------------------------

describe('Rate limits on report endpoints', () => {
  it('POST /reports/project is rate-limited to 5/hr', async () => {
    // Use a dedicated seed so we don't conflict with other tests
    const rateSeedId = 'rate-limit-seed-' + generateId().slice(0, 6);
    const accountId = await insertAccount(rateSeedId);

    // Create project
    const pId = generateId();
    const tId = generateId();
    const now = Date.now();
    await insertMessage({ accountId, threadId: tId, subject: 'Rate limit test' });
    await db.run(
      `INSERT INTO wunderland_email_projects (id, seed_id, owner_user_id, name, status, created_at, updated_at)
       VALUES (?, ?, ?, 'Rate Test', 'active', ?, ?)`,
      [pId, rateSeedId, TEST_USER_ID, now, now]
    );
    await db.run(
      `INSERT INTO wunderland_email_project_threads (id, project_id, thread_id, account_id, added_by, added_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [generateId(), pId, tId, accountId, TEST_USER_ID, now]
    );

    // Make 5 requests — all should succeed
    for (let i = 0; i < 5; i++) {
      await controller.generateProjectReport(
        makeReq(),
        makeRes(),
        makePaidUser(),
        pId,
        { seedId: rateSeedId },
        { format: 'markdown' }
      );
    }

    // 6th request should be rate-limited (HTTP 429)
    await expect(
      controller.generateProjectReport(
        makeReq(),
        makeRes(),
        makePaidUser(),
        pId,
        { seedId: rateSeedId },
        { format: 'markdown' }
      )
    ).rejects.toThrow();
  });
});
