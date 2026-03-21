/**
 * @file email-digest.service.spec.ts
 * @description Tests for EmailDigestService — digest CRUD, scheduling, delivery.
 */

import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import {
  initializeAppDatabase,
  closeAppDatabase,
  generateId,
  __setAppDatabaseAdapterResolverForTests,
} from '../../../../core/database/appDatabase.js';
import { resolveStorageAdapter } from '@framers/sql-storage-adapter';
import { DatabaseService } from '../../../../database/database.service.js';
import { EmailDigestService } from '../services/email-digest.service.js';
import { EmailReportService } from '../services/email-report.service.js';
import { CronJobService } from '../../cron/cron.service.js';

let db: DatabaseService;
let digestService: EmailDigestService;
let cronService: CronJobService;

// We'll mock the reportService since its tests are separate
const mockReportService = {
  generateDigestReport: vi.fn().mockResolvedValue({
    content: '# Test Digest\nNo new messages.',
    filename: 'digest-test-2026-03-20.md',
    mimeType: 'text/markdown',
    sizeBytes: 35,
  }),
};

const userId = 'test-user-1';

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();
  cronService = new CronJobService(db);
  digestService = new EmailDigestService(
    db,
    mockReportService as unknown as EmailReportService,
    cronService
  );

  // Insert a test user into app_users
  await db.run(
    `INSERT OR IGNORE INTO app_users (id, email, password_hash, created_at, updated_at)
     VALUES (?, 'test@example.com', 'hash', ?, ?)`,
    [userId, Date.now(), Date.now()]
  );
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests();
  await closeAppDatabase();
});

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function createTestAgent(seedId: string): Promise<string> {
  await db.run(
    `INSERT OR IGNORE INTO wunderbots
      (seed_id, owner_user_id, display_name, hexaco_traits, security_profile,
       inference_hierarchy, status, created_at, updated_at)
     VALUES (?, ?, 'Test Agent', '{}', '{}', '{}', 'active', ?, ?)`,
    [seedId, userId, Date.now(), Date.now()]
  );
  return seedId;
}

async function insertAccount(seedId: string): Promise<string> {
  const id = generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_accounts
      (id, seed_id, owner_user_id, provider, email_address, credential_id, is_active, created_at, updated_at)
     VALUES (?, ?, ?, 'gmail', ?, ?, 1, ?, ?)`,
    [id, seedId, userId, `${id}@example.com`, generateId(), now, now]
  );
  return id;
}

async function insertMessage(opts: {
  accountId: string;
  threadId: string;
  internalDate: number;
}): Promise<string> {
  const id = generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_synced_messages
      (id, provider_message_id, account_id, thread_id, message_id_header,
       subject, from_address, snippet, internal_date,
       has_attachments, attachment_count, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'Test', 'sender@test.com', 'snippet', ?, 0, 0, ?, ?)`,
    [
      id,
      `prov-${id}`,
      opts.accountId,
      opts.threadId,
      `<${id}@test.com>`,
      opts.internalDate,
      now,
      now,
    ]
  );
  return id;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('EmailDigestService', () => {
  describe('createDigest', () => {
    it('inserts row and creates cron job with correct schedule', async () => {
      const seedId = await createTestAgent(generateId());
      await insertAccount(seedId);

      const digest = await digestService.createDigest(seedId, userId, {
        schedule: 'daily',
        deliveryChannel: 'dashboard',
        deliveryTarget: '/dashboard',
        name: 'Daily Roundup',
      });

      expect(digest).toBeDefined();
      expect(digest.seed_id).toBe(seedId);
      expect(digest.owner_user_id).toBe(userId);
      expect(digest.name).toBe('Daily Roundup');
      expect(digest.schedule).toBe('daily');
      expect(digest.delivery_channel).toBe('dashboard');
      expect(digest.is_active).toBe(1);
      expect(digest.cron_job_id).toBeTruthy();

      // Verify cron job was created
      const { job } = await cronService.getJob(userId, digest.cron_job_id!);
      expect(job.payloadKind).toBe('email_digest');
      expect(job.scheduleKind).toBe('every');
    });

    it('maps daily to intervalMs 86400000', async () => {
      const seedId = await createTestAgent(generateId());

      const digest = await digestService.createDigest(seedId, userId, {
        schedule: 'daily',
        deliveryChannel: 'dashboard',
        deliveryTarget: '/',
      });

      const { job } = await cronService.getJob(userId, digest.cron_job_id!);
      expect(job.scheduleKind).toBe('every');
      expect(job.scheduleConfig).toEqual({ intervalMs: 86400000 });
    });

    it('maps weekly to intervalMs 604800000', async () => {
      const seedId = await createTestAgent(generateId());

      const digest = await digestService.createDigest(seedId, userId, {
        schedule: 'weekly',
        deliveryChannel: 'dashboard',
        deliveryTarget: '/',
      });

      const { job } = await cronService.getJob(userId, digest.cron_job_id!);
      expect(job.scheduleKind).toBe('every');
      expect(job.scheduleConfig).toEqual({ intervalMs: 604800000 });
    });

    it('maps custom cron expression correctly', async () => {
      const seedId = await createTestAgent(generateId());

      const digest = await digestService.createDigest(seedId, userId, {
        schedule: '0 9 * * MON',
        deliveryChannel: 'email',
        deliveryTarget: 'user@test.com',
      });

      const { job } = await cronService.getJob(userId, digest.cron_job_id!);
      expect(job.scheduleKind).toBe('cron');
      expect(job.scheduleConfig).toEqual({ expression: '0 9 * * MON' });
    });
  });

  describe('listDigests', () => {
    it('returns digests for seedId', async () => {
      const seedId = await createTestAgent(generateId());

      await digestService.createDigest(seedId, userId, {
        schedule: 'daily',
        deliveryChannel: 'dashboard',
        deliveryTarget: '/',
        name: 'Digest A',
      });
      await digestService.createDigest(seedId, userId, {
        schedule: 'weekly',
        deliveryChannel: 'webhook',
        deliveryTarget: 'https://example.com/hook',
        name: 'Digest B',
      });

      const digests = await digestService.listDigests(seedId);
      expect(digests).toHaveLength(2);
      const names = digests.map((d) => d.name);
      expect(names).toContain('Digest A');
      expect(names).toContain('Digest B');
    });

    it('does not return digests from other seeds', async () => {
      const seedA = await createTestAgent(generateId());
      const seedB = await createTestAgent(generateId());

      await digestService.createDigest(seedA, userId, {
        schedule: 'daily',
        deliveryChannel: 'dashboard',
        deliveryTarget: '/',
        name: 'Seed A Digest',
      });

      const digestsB = await digestService.listDigests(seedB);
      expect(digestsB.find((d) => d.name === 'Seed A Digest')).toBeUndefined();
    });
  });

  describe('deleteDigest', () => {
    it('removes cron job and digest row', async () => {
      const seedId = await createTestAgent(generateId());

      const digest = await digestService.createDigest(seedId, userId, {
        schedule: 'daily',
        deliveryChannel: 'dashboard',
        deliveryTarget: '/',
      });

      const cronJobId = digest.cron_job_id!;

      await digestService.deleteDigest(digest.id, userId);

      // Digest should be gone
      const deleted = await digestService.getDigest(digest.id);
      expect(deleted).toBeUndefined();

      // Cron job should also be gone
      await expect(cronService.getJob(userId, cronJobId)).rejects.toThrow();
    });

    it('throws when digest not found', async () => {
      await expect(digestService.deleteDigest('nonexistent-id', userId)).rejects.toThrow(
        'not found'
      );
    });
  });

  describe('generateAndDeliver', () => {
    it('updates last_sent_at after delivery', async () => {
      const seedId = await createTestAgent(generateId());
      await insertAccount(seedId);

      const digest = await digestService.createDigest(seedId, userId, {
        schedule: 'daily',
        deliveryChannel: 'dashboard',
        deliveryTarget: '/',
      });

      expect(digest.last_sent_at).toBeNull();

      await digestService.generateAndDeliver(digest.id);

      const updated = await digestService.getDigest(digest.id);
      expect(updated!.last_sent_at).toBeTruthy();
      expect(updated!.last_sent_at).toBeGreaterThan(0);
    });

    it('calls reportService.generateDigestReport with correct params', async () => {
      const seedId = await createTestAgent(generateId());

      const digest = await digestService.createDigest(seedId, userId, {
        schedule: 'daily',
        format: 'json',
        deliveryChannel: 'dashboard',
        deliveryTarget: '/',
        includeAttachments: true,
        includeTimeline: false,
      });

      await digestService.generateAndDeliver(digest.id);

      expect(mockReportService.generateDigestReport).toHaveBeenCalledWith(
        seedId,
        expect.any(Number),
        'json',
        expect.objectContaining({
          includeAttachments: true,
          includeTimeline: false,
        })
      );
    });

    it('with delivery_channel=webhook makes POST', async () => {
      const seedId = await createTestAgent(generateId());

      // Mock global fetch
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));

      const digest = await digestService.createDigest(seedId, userId, {
        schedule: 'daily',
        deliveryChannel: 'webhook',
        deliveryTarget: 'https://hooks.example.com/digest',
      });

      await digestService.generateAndDeliver(digest.id);

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://hooks.example.com/digest',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'text/markdown' },
        })
      );

      fetchSpy.mockRestore();
    });

    it('throws when digest not found', async () => {
      await expect(digestService.generateAndDeliver('nonexistent')).rejects.toThrow('not found');
    });
  });

  describe('previewDigest', () => {
    it('returns content without updating last_sent_at', async () => {
      const seedId = await createTestAgent(generateId());

      const digest = await digestService.createDigest(seedId, userId, {
        schedule: 'daily',
        deliveryChannel: 'dashboard',
        deliveryTarget: '/',
      });

      const preview = await digestService.previewDigest(digest.id);

      expect(preview.content).toBeDefined();
      expect(preview.mimeType).toBe('text/markdown');

      // last_sent_at should remain null (preview doesn't update it)
      const afterPreview = await digestService.getDigest(digest.id);
      expect(afterPreview!.last_sent_at).toBeNull();
    });
  });

  describe('updateDigest', () => {
    it('updates specified fields', async () => {
      const seedId = await createTestAgent(generateId());

      const digest = await digestService.createDigest(seedId, userId, {
        schedule: 'daily',
        deliveryChannel: 'dashboard',
        deliveryTarget: '/',
        name: 'Original Name',
      });

      await digestService.updateDigest(digest.id, {
        name: 'Updated Name',
        format: 'json',
      });

      const updated = await digestService.getDigest(digest.id);
      expect(updated!.name).toBe('Updated Name');
      expect(updated!.format).toBe('json');
      // Other fields unchanged
      expect(updated!.delivery_channel).toBe('dashboard');
    });
  });
});
