/**
 * @file email-rate-limit.spec.ts
 * @description Unit tests for EmailRateLimitService — hourly sliding-window
 *              rate limiter backed by SQLite.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import {
  initializeAppDatabase,
  closeAppDatabase,
  __setAppDatabaseAdapterResolverForTests,
} from '../../../../core/database/appDatabase.js';
import { resolveStorageAdapter } from '@framers/sql-storage-adapter';
import { DatabaseService } from '../../../../database/database.service.js';
import { EmailRateLimitService } from '../services/email-rate-limit.service.js';

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

let db: DatabaseService;
let service: EmailRateLimitService;

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();
  service = new EmailRateLimitService(db);
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests();
  await closeAppDatabase();
});

beforeEach(async () => {
  // Clean the rate limits table between tests
  await db.run('DELETE FROM wunderland_email_rate_limits', []);
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('EmailRateLimitService', () => {
  it('should allow the first request within the limit', async () => {
    const result = await service.checkAndIncrement('seed-1', 'query', 10);
    expect(result.allowed).toBe(true);
    expect(result.retryAfterMs).toBeUndefined();
  });

  it('should allow multiple requests up to the limit', async () => {
    const maxPerHour = 3;
    for (let i = 0; i < maxPerHour; i++) {
      const result = await service.checkAndIncrement('seed-2', 'query', maxPerHour);
      expect(result.allowed).toBe(true);
    }
  });

  it('should reject requests at the limit with retryAfterMs', async () => {
    const maxPerHour = 2;
    // Fill up the limit
    await service.checkAndIncrement('seed-3', 'query', maxPerHour);
    await service.checkAndIncrement('seed-3', 'query', maxPerHour);

    // Third request should be rejected
    const result = await service.checkAndIncrement('seed-3', 'query', maxPerHour);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterMs).toBeDefined();
    expect(result.retryAfterMs!).toBeGreaterThan(0);
    expect(result.retryAfterMs!).toBeLessThanOrEqual(3600000);
  });

  it('should track different endpoints independently', async () => {
    const maxPerHour = 1;

    const r1 = await service.checkAndIncrement('seed-4', 'query', maxPerHour);
    expect(r1.allowed).toBe(true);

    // Same seed, different endpoint — should still be allowed
    const r2 = await service.checkAndIncrement('seed-4', 'project_summary', maxPerHour);
    expect(r2.allowed).toBe(true);

    // Same seed, same endpoint — should be rejected
    const r3 = await service.checkAndIncrement('seed-4', 'query', maxPerHour);
    expect(r3.allowed).toBe(false);
  });

  it('should track different seeds independently', async () => {
    const maxPerHour = 1;

    await service.checkAndIncrement('seed-5a', 'query', maxPerHour);
    // Different seed — should still be allowed
    const r2 = await service.checkAndIncrement('seed-5b', 'query', maxPerHour);
    expect(r2.allowed).toBe(true);
  });

  it('new hour window should reset the counter', async () => {
    const maxPerHour = 1;

    // Fill up the current window
    await service.checkAndIncrement('seed-6', 'query', maxPerHour);
    const rejected = await service.checkAndIncrement('seed-6', 'query', maxPerHour);
    expect(rejected.allowed).toBe(false);

    // Simulate a new hour by inserting a record in a different window
    // and clearing the current window's counter
    const currentWindow = Math.floor(Date.now() / 3600000) * 3600000;
    await db.run(
      'DELETE FROM wunderland_email_rate_limits WHERE seed_id = ? AND endpoint = ? AND window_start = ?',
      ['seed-6', 'query', currentWindow]
    );

    // Now should be allowed again
    const allowed = await service.checkAndIncrement('seed-6', 'query', maxPerHour);
    expect(allowed.allowed).toBe(true);
  });

  it('cleanupExpired should remove old windows', async () => {
    // Insert an old record (3 hours ago)
    const oldWindow = Math.floor(Date.now() / 3600000) * 3600000 - 3 * 3600000;
    await db.run(
      `INSERT INTO wunderland_email_rate_limits (seed_id, endpoint, window_start, count)
       VALUES (?, ?, ?, ?)`,
      ['seed-7', 'query', oldWindow, 5]
    );

    // Insert a current record
    const currentWindow = Math.floor(Date.now() / 3600000) * 3600000;
    await db.run(
      `INSERT INTO wunderland_email_rate_limits (seed_id, endpoint, window_start, count)
       VALUES (?, ?, ?, ?)`,
      ['seed-7', 'detect', currentWindow, 1]
    );

    await service.cleanupExpired();

    // Old record should be gone
    const oldRow = await db.get<{ count: number }>(
      'SELECT count FROM wunderland_email_rate_limits WHERE seed_id = ? AND window_start = ?',
      ['seed-7', oldWindow]
    );
    expect(oldRow).toBeUndefined();

    // Current record should still exist
    const currentRow = await db.get<{ count: number }>(
      'SELECT count FROM wunderland_email_rate_limits WHERE seed_id = ? AND window_start = ?',
      ['seed-7', currentWindow]
    );
    expect(currentRow).toBeDefined();
    expect(currentRow!.count).toBe(1);
  });
});
