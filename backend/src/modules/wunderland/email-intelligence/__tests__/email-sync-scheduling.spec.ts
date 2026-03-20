/**
 * @file email-sync-scheduling.spec.ts
 * @description Tests for EmailSyncService scheduling methods — scheduleSync,
 *              unscheduleSync, and duplicate-prevention logic.
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
import { EmailSyncService } from '../services/email-sync.service.js';
import { EmailThreadService } from '../services/email-thread.service.js';
import { CronJobService } from '../../cron/cron.service.js';

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

let db: DatabaseService;
let syncService: EmailSyncService;
let threadService: EmailThreadService;
let cronJobService: CronJobService;

const TEST_USER_ID = 'test-user-scheduling';
const TEST_SEED_ID = 'test-seed-scheduling';

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();
  threadService = new EmailThreadService(db);
  cronJobService = new CronJobService(db);
  syncService = new EmailSyncService(db, threadService, cronJobService);

  // Ensure cron_job_id column exists (migration for existing DBs)
  try {
    await db.run(`ALTER TABLE wunderland_email_accounts ADD COLUMN cron_job_id TEXT`, []);
  } catch {
    // Column already exists
  }

  // Insert a wunderbot so CronJobService.requireOwnedAgent passes
  const now = Date.now();
  await db.run(
    `INSERT OR IGNORE INTO wunderbots
      (seed_id, owner_user_id, display_name, hexaco_traits, security_profile,
       inference_hierarchy, status, created_at, updated_at)
     VALUES (?, ?, ?, '{}', 'balanced', '[]', 'active', ?, ?)`,
    [TEST_SEED_ID, TEST_USER_ID, 'Test Bot', now, now]
  );
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function insertAccount(overrides: Record<string, unknown> = {}): Promise<string> {
  const id = generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_accounts
      (id, seed_id, owner_user_id, provider, email_address, credential_id,
       sync_cursor, sync_enabled, sync_state, sync_interval_ms, total_messages_synced,
       created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      overrides.seed_id ?? TEST_SEED_ID,
      overrides.owner_user_id ?? TEST_USER_ID,
      overrides.provider ?? 'gmail',
      overrides.email_address ?? `test-${generateId()}@example.com`,
      overrides.credential_id ?? generateId(),
      overrides.sync_cursor ?? null,
      overrides.sync_enabled ?? 1,
      overrides.sync_state ?? 'idle',
      overrides.sync_interval_ms ?? 300000,
      overrides.total_messages_synced ?? 0,
      now,
      now,
    ]
  );
  return id;
}

async function getAccount(id: string) {
  return db.get<Record<string, unknown>>(`SELECT * FROM wunderland_email_accounts WHERE id = ?`, [
    id,
  ]);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('EmailSyncService — scheduling', () => {
  it('scheduleSync creates a cron job with schedule_kind=every and payload_kind=email_sync', async () => {
    const accountId = await insertAccount({ sync_interval_ms: 600000 });

    const job = await syncService.scheduleSync(accountId, TEST_USER_ID, TEST_SEED_ID);

    expect(job.scheduleKind).toBe('every');
    expect(job.payloadKind).toBe('email_sync');
    expect(job.enabled).toBe(true);
    expect(job.name).toContain('Email sync:');
  });

  it('scheduleSync stores sync_interval_ms in schedule_config', async () => {
    const intervalMs = 120000;
    const accountId = await insertAccount({ sync_interval_ms: intervalMs });

    const job = await syncService.scheduleSync(accountId, TEST_USER_ID, TEST_SEED_ID);

    expect(job.scheduleConfig).toEqual({ intervalMs: 120000 });
    expect(job.payloadConfig).toEqual({ accountId });
  });

  it('scheduleSync stores cron_job_id on the account row', async () => {
    const accountId = await insertAccount();

    const job = await syncService.scheduleSync(accountId, TEST_USER_ID, TEST_SEED_ID);

    const account = await getAccount(accountId);
    expect(account!.cron_job_id).toBe(job.jobId);
  });

  it('scheduleSync for already-scheduled account returns existing job (no duplicate)', async () => {
    const accountId = await insertAccount();

    const job1 = await syncService.scheduleSync(accountId, TEST_USER_ID, TEST_SEED_ID);
    const job2 = await syncService.scheduleSync(accountId, TEST_USER_ID, TEST_SEED_ID);

    expect(job1.jobId).toBe(job2.jobId);
  });

  it('unscheduleSync removes the cron job and clears cron_job_id', async () => {
    const accountId = await insertAccount();

    const job = await syncService.scheduleSync(accountId, TEST_USER_ID, TEST_SEED_ID);
    expect(job.jobId).toBeTruthy();

    await syncService.unscheduleSync(accountId, TEST_USER_ID);

    const account = await getAccount(accountId);
    expect(account!.cron_job_id).toBeNull();

    // Verify cron job is actually deleted
    await expect(cronJobService.getJob(TEST_USER_ID, job.jobId)).rejects.toThrow();
  });

  it('unscheduleSync is safe to call on unscheduled account', async () => {
    const accountId = await insertAccount();

    // Should not throw
    await syncService.unscheduleSync(accountId, TEST_USER_ID);

    const account = await getAccount(accountId);
    expect(account!.cron_job_id).toBeNull();
  });

  it('scheduleSync re-creates job if previous cron_job_id is stale', async () => {
    const accountId = await insertAccount();

    // Manually set a bogus cron_job_id
    await db.run(
      `UPDATE wunderland_email_accounts SET cron_job_id = 'deleted-job-id' WHERE id = ?`,
      [accountId]
    );

    // Should detect the stale reference and create a new job
    const job = await syncService.scheduleSync(accountId, TEST_USER_ID, TEST_SEED_ID);
    expect(job.jobId).not.toBe('deleted-job-id');

    const account = await getAccount(accountId);
    expect(account!.cron_job_id).toBe(job.jobId);
  });
});
