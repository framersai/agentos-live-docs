import test from 'node:test';
import assert from 'node:assert/strict';

import {
  initializeAppDatabase,
  closeAppDatabase,
  __setAppDatabaseAdapterResolverForTests,
  getAppDatabase,
} from '../core/database/appDatabase.js';
import { DatabaseService } from '../database/database.service.js';
import { VoiceService } from '../modules/wunderland/voice/voice.service.js';

async function setupDb(): Promise<void> {
  await closeAppDatabase();
  __setAppDatabaseAdapterResolverForTests(async () => {
    const { resolveStorageAdapter } = await import('@framers/sql-storage-adapter');
    return await resolveStorageAdapter({
      priority: ['sqljs'],
      openOptions: { filePath: '' },
    } as any);
  });
  await initializeAppDatabase();
}

async function seedUser(options: { userId: string; planId: string; status?: string }) {
  const adapter = getAppDatabase();
  const now = Date.now();
  await adapter.run(
    `INSERT INTO app_users
      (id, email, password_hash, subscription_status, subscription_tier, subscription_plan_id, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      options.userId,
      `${options.userId}@test.local`,
      'hash',
      options.status ?? 'active',
      'metered',
      options.planId,
      1,
      now,
      now,
    ]
  );
}

async function seedAgent(options: { seedId: string; ownerUserId: string }) {
  const adapter = getAppDatabase();
  const now = Date.now();
  await adapter.run(
    `INSERT INTO wunderbots
      (seed_id, owner_user_id, display_name, hexaco_traits, security_profile, inference_hierarchy, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [options.seedId, options.ownerUserId, options.seedId, '{}', '{}', '{}', now, now]
  );
}

test('VoiceService.getCallStats returns duration metrics', async () => {
  await setupDb();

  const userId = `user_${Date.now()}`;
  const seedId = `seed_${Date.now()}`;
  await seedUser({ userId, planId: 'pro' });
  await seedAgent({ seedId, ownerUserId: userId });

  const adapter = getAppDatabase();
  const now = Date.now();

  const callA = `call_${now}_a`;
  const callB = `call_${now}_b`;

  // Durations: 4000ms and 1500ms => total 5500, avg 2750.
  await adapter.run(
    `INSERT INTO wunderland_voice_calls
      (call_id, seed_id, owner_user_id, provider, provider_call_id, direction,
       from_number, to_number, state, mode, start_time, end_time,
       transcript_json, metadata, created_at, updated_at)
     VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, '[]', '{}', ?, ?)`,
    [
      callA,
      seedId,
      userId,
      'twilio',
      'outbound',
      '+15550001111',
      '+15551234567',
      'completed',
      'notify',
      now - 5_000,
      now - 1_000,
      now,
      now,
    ]
  );

  await adapter.run(
    `INSERT INTO wunderland_voice_calls
      (call_id, seed_id, owner_user_id, provider, provider_call_id, direction,
       from_number, to_number, state, mode, start_time, end_time,
       transcript_json, metadata, created_at, updated_at)
     VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, '[]', '{}', ?, ?)`,
    [
      callB,
      seedId,
      userId,
      'telnyx',
      'inbound',
      '',
      '+15559876543',
      'completed',
      'notify',
      now - 2_000,
      now - 500,
      now,
      now,
    ]
  );

  const svc = new VoiceService(new DatabaseService());
  const stats = await svc.getCallStats(userId, seedId);

  assert.equal(stats.totalCalls, 2);
  assert.equal(stats.activeCalls, 0);
  assert.equal(stats.totalDurationMs, 5_500);
  assert.equal(stats.avgDurationMs, 2_750);
  assert.equal(stats.completedCalls, 2);
  assert.deepEqual(stats.providerBreakdown, { twilio: 1, telnyx: 1 });
});

test('VoiceService.listCalls maps durationMs and direction metadata', async () => {
  await setupDb();

  const userId = `user_${Date.now()}`;
  const seedId = `seed_${Date.now()}`;
  await seedUser({ userId, planId: 'pro' });
  await seedAgent({ seedId, ownerUserId: userId });

  const adapter = getAppDatabase();
  const now = Date.now();

  const callId = `call_${now}_x`;
  await adapter.run(
    `INSERT INTO wunderland_voice_calls
      (call_id, seed_id, owner_user_id, provider, provider_call_id, direction,
       from_number, to_number, state, mode, start_time, end_time,
       transcript_json, metadata, created_at, updated_at)
     VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, '[]', '{}', ?, ?)`,
    [
      callId,
      seedId,
      userId,
      'plivo',
      'inbound',
      '',
      '+15550000000',
      'completed',
      'notify',
      now - 10_000,
      now - 7_000,
      now,
      now,
    ]
  );

  const svc = new VoiceService(new DatabaseService());
  const { items } = await svc.listCalls(userId, { seedId, limit: 10 } as any);
  assert.equal(items.length, 1);

  const call = items[0]!;
  assert.equal(call.callId, callId);
  assert.equal(call.durationMs, 3_000);
  assert.equal((call.metadata as any).direction, 'inbound');
  assert.ok(typeof call.createdAt === 'string' && call.createdAt.includes('T'));
});
