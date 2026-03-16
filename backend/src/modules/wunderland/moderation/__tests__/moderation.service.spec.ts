import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import type { StorageAdapter } from '@framers/sql-storage-adapter';
import { ModerationService } from '../moderation.service.js';

// ---------------------------------------------------------------------------
// In-memory StorageAdapter backed by better-sqlite3
// ---------------------------------------------------------------------------

function createInMemoryAdapter() {
  const db = new Database(':memory:');
  const adapter = {
    db,
    kind: 'better-sqlite3',
    capabilities: new Set(['sync', 'transactions', 'wal', 'persistence']),
    async run(sql: string, params?: unknown[]) {
      const stmt = db.prepare(sql);
      const result = params ? stmt.run(...(params as any[])) : stmt.run();
      return { changes: result.changes, lastInsertRowid: result.lastInsertRowid };
    },
    async get<T = unknown>(sql: string, params?: unknown[]): Promise<T | null> {
      const stmt = db.prepare(sql);
      const row = params ? stmt.get(...(params as any[])) : stmt.get();
      return (row as T) ?? null;
    },
    async all<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
      const stmt = db.prepare(sql);
      return (params ? stmt.all(...(params as any[])) : stmt.all()) as T[];
    },
    async exec(sql: string) {
      db.exec(sql);
    },
    async transaction<T>(fn: (trx: StorageAdapter) => Promise<T>): Promise<T> {
      return fn(adapter as unknown as StorageAdapter);
    },
    async open() {},
    async close() {
      db.close();
    },
  } as unknown as StorageAdapter & { db: Database.Database };
  return adapter;
}

// ---------------------------------------------------------------------------
// Bootstrap schema + wire getAppDatabase() to point at our in-memory adapter
// ---------------------------------------------------------------------------

async function setupTestDb() {
  const adapter = createInMemoryAdapter();

  // Create the required tables
  await adapter.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_content_flags (
      flag_id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      author_seed_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      severity TEXT NOT NULL,
      flagged_at BIGINT NOT NULL,
      resolved INTEGER NOT NULL DEFAULT 0,
      resolved_by TEXT,
      resolved_at BIGINT
    );
  `);

  await adapter.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_content_votes (
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      voter_seed_id TEXT NOT NULL,
      direction INTEGER NOT NULL,
      created_at BIGINT NOT NULL,
      UNIQUE(entity_type, entity_id, voter_seed_id)
    );
  `);

  await adapter.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_emoji_reactions (
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      reactor_seed_id TEXT NOT NULL,
      emoji TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      UNIQUE(entity_type, entity_id, reactor_seed_id, emoji)
    );
  `);

  // Monkey-patch getAppDatabase to return our test adapter
  const appDbModule = await import('../../../../core/database/appDatabase.js');
  // Close any prior adapter so initializeAppDatabase() will re-run with the new resolver
  await appDbModule.closeAppDatabase();
  (appDbModule as any).__setAppDatabaseAdapterResolverForTests(async () => adapter);
  await appDbModule.initializeAppDatabase();

  return { adapter, cleanup: () => appDbModule.closeAppDatabase() };
}

describe('ModerationService', () => {
  let svc: ModerationService;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const ctx = await setupTestDb();
    cleanup = ctx.cleanup;
    svc = new ModerationService();
  });

  // ── Content Flags ──────────────────────────────────────────────────────

  describe('flagContent / getFlags / getPendingFlags / resolveFlag', () => {
    it('flagContent creates a flag and getFlags returns it', async () => {
      const { flagId } = await svc.flagContent({
        entityType: 'post',
        entityId: 'post-1',
        authorSeedId: 'seed-a',
        reason: 'spam',
        severity: 'medium',
      });

      assert.ok(flagId, 'should return a flagId');

      const flags = await svc.getFlags('post', 'post-1');
      assert.equal(flags.length, 1);
      assert.equal((flags[0] as any).flag_id, flagId);
      assert.equal((flags[0] as any).reason, 'spam');
      assert.equal((flags[0] as any).severity, 'medium');
    });

    it('getPendingFlags lists unresolved flags only', async () => {
      await svc.flagContent({
        entityType: 'post',
        entityId: 'post-1',
        authorSeedId: 'seed-a',
        reason: 'spam',
        severity: 'high',
      });
      const { flagId: flagId2 } = await svc.flagContent({
        entityType: 'comment',
        entityId: 'comment-1',
        authorSeedId: 'seed-b',
        reason: 'harassment',
        severity: 'critical',
      });

      // Resolve one flag
      await svc.resolveFlag(flagId2, 'admin-1');

      const pending = await svc.getPendingFlags();
      assert.equal(pending.length, 1);
      assert.equal((pending[0] as any).entity_id, 'post-1');
    });

    it('resolveFlag marks a flag as resolved', async () => {
      const { flagId } = await svc.flagContent({
        entityType: 'post',
        entityId: 'post-2',
        authorSeedId: 'seed-c',
        reason: 'nsfw',
        severity: 'high',
      });

      const result = await svc.resolveFlag(flagId, 'admin-x');
      assert.equal(result.updated, true);

      // Resolving again should fail (already resolved)
      const result2 = await svc.resolveFlag(flagId, 'admin-y');
      assert.equal(result2.updated, false);
    });
  });

  // ── Content Votes ──────────────────────────────────────────────────────

  describe('vote', () => {
    it('creates a vote and returns correct totals', async () => {
      const r1 = await svc.vote({
        entityType: 'post',
        entityId: 'post-1',
        voterSeedId: 'voter-1',
        direction: 1,
      });
      assert.equal(r1.upvotes, 1);
      assert.equal(r1.downvotes, 0);
      assert.equal(r1.score, 1);

      const r2 = await svc.vote({
        entityType: 'post',
        entityId: 'post-1',
        voterSeedId: 'voter-2',
        direction: -1,
      });
      assert.equal(r2.upvotes, 1);
      assert.equal(r2.downvotes, 1);
      assert.equal(r2.score, 0);
    });

    it('updates vote direction on re-vote by same voter', async () => {
      await svc.vote({
        entityType: 'post',
        entityId: 'post-1',
        voterSeedId: 'voter-1',
        direction: 1,
      });

      // Same voter changes to downvote
      const r2 = await svc.vote({
        entityType: 'post',
        entityId: 'post-1',
        voterSeedId: 'voter-1',
        direction: -1,
      });
      assert.equal(r2.upvotes, 0);
      assert.equal(r2.downvotes, 1);
      assert.equal(r2.score, -1);
    });
  });

  // ── Emoji Reactions ────────────────────────────────────────────────────

  describe('addReaction / getReactions / removeReaction', () => {
    it('addReaction adds an emoji and getReactions returns grouped counts', async () => {
      await svc.addReaction({
        entityType: 'post',
        entityId: 'post-1',
        reactorSeedId: 'seed-a',
        emoji: '👍',
      });
      await svc.addReaction({
        entityType: 'post',
        entityId: 'post-1',
        reactorSeedId: 'seed-b',
        emoji: '👍',
      });
      await svc.addReaction({
        entityType: 'post',
        entityId: 'post-1',
        reactorSeedId: 'seed-a',
        emoji: '🔥',
      });

      const { reactions } = await svc.getReactions('post', 'post-1');
      assert.equal(reactions.length, 2);

      const thumbsUp = reactions.find((r: any) => r.emoji === '👍');
      assert.ok(thumbsUp);
      assert.equal((thumbsUp as any).count, 2);

      const fire = reactions.find((r: any) => r.emoji === '🔥');
      assert.ok(fire);
      assert.equal((fire as any).count, 1);
    });

    it('removeReaction removes an emoji', async () => {
      await svc.addReaction({
        entityType: 'post',
        entityId: 'post-1',
        reactorSeedId: 'seed-a',
        emoji: '👍',
      });

      const result = await svc.removeReaction({
        entityType: 'post',
        entityId: 'post-1',
        reactorSeedId: 'seed-a',
        emoji: '👍',
      });

      assert.equal(result.reactions.length, 0);
    });

    it('addReaction is idempotent for same reactor + emoji', async () => {
      await svc.addReaction({
        entityType: 'post',
        entityId: 'post-1',
        reactorSeedId: 'seed-a',
        emoji: '👍',
      });
      // Same reactor, same emoji — INSERT OR IGNORE
      await svc.addReaction({
        entityType: 'post',
        entityId: 'post-1',
        reactorSeedId: 'seed-a',
        emoji: '👍',
      });

      const { reactions } = await svc.getReactions('post', 'post-1');
      const thumbsUp = reactions.find((r: any) => r.emoji === '👍');
      assert.equal((thumbsUp as any).count, 1);
    });
  });
});
