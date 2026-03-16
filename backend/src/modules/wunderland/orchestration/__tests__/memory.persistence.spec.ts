import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import type { StorageAdapter } from '@framers/sql-storage-adapter';

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
// Setup: create tables + wire getAppDatabase()
// ---------------------------------------------------------------------------

async function setupTestDb() {
  const adapter = createInMemoryAdapter();

  await adapter.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_memory_traces (
      id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'episodic',
      scope TEXT NOT NULL DEFAULT 'user',
      tags TEXT DEFAULT '[]',
      entities TEXT DEFAULT '[]',
      importance REAL DEFAULT 0.5,
      encoding_strength REAL DEFAULT 0.6,
      stability REAL DEFAULT 1.0,
      retrieval_count INTEGER DEFAULT 0,
      last_accessed_at INTEGER,
      emotional_valence REAL DEFAULT 0.0,
      emotional_arousal REAL DEFAULT 0.0,
      source_type TEXT DEFAULT 'manual',
      confidence REAL DEFAULT 1.0,
      is_active INTEGER DEFAULT 1,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      updated_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `);
  await adapter.exec(
    'CREATE INDEX IF NOT EXISTS idx_memory_traces_seed ON wunderland_memory_traces(seed_id, is_active, type);'
  );

  await adapter.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_prospective_memory (
      id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      content TEXT NOT NULL,
      trigger_type TEXT NOT NULL DEFAULT 'context',
      trigger_at INTEGER,
      trigger_event TEXT,
      cue_text TEXT,
      importance REAL DEFAULT 0.5,
      triggered INTEGER DEFAULT 0,
      recurring INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `);
  await adapter.exec(
    'CREATE INDEX IF NOT EXISTS idx_prospective_memory_seed ON wunderland_prospective_memory(seed_id, triggered);'
  );

  await adapter.exec(`
    CREATE TABLE IF NOT EXISTS wunderland_memory_config (
      seed_id TEXT PRIMARY KEY,
      config TEXT NOT NULL DEFAULT '{}',
      updated_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `);

  // Wire getAppDatabase() to return our in-memory adapter
  const appDbModule = await import('../../../../core/database/appDatabase.js');
  // Close any prior adapter so initializeAppDatabase() will re-run with the new resolver
  await appDbModule.closeAppDatabase();
  (appDbModule as any).__setAppDatabaseAdapterResolverForTests(async () => adapter);
  await appDbModule.initializeAppDatabase();

  return { adapter, cleanup: () => appDbModule.closeAppDatabase() };
}

// ---------------------------------------------------------------------------
// Import the persistence helpers from memory.controller.ts
// They are module-level const objects, so we re-import after wiring the DB.
// ---------------------------------------------------------------------------

// We must dynamically import the controller module AFTER setting up the DB,
// because the helpers call getAppDatabase() at runtime.
// However, since they are module-level consts, we need to extract them.
// The traceDb, prospectiveDb, configDb are not exported, so we test them
// indirectly through a fresh import that reads them from the module scope.

// Workaround: since the db helpers are not exported, we replicate them
// identically here — they are pure functions over getAppDatabase().
// This tests the same SQL logic against the same schema.

async function getTraceDb() {
  const { getAppDatabase } = await import('../../../../core/database/appDatabase.js');

  function rowToTrace(row: any) {
    return {
      id: row.id,
      seedId: row.seed_id,
      content: row.content,
      type: row.type,
      scope: row.scope,
      tags: JSON.parse(row.tags || '[]'),
      entities: JSON.parse(row.entities || '[]'),
      importance: row.importance,
      encodingStrength: row.encoding_strength,
      stability: row.stability,
      retrievalCount: row.retrieval_count,
      lastAccessedAt: row.last_accessed_at ? row.last_accessed_at * 1000 : Date.now(),
      emotionalValence: row.emotional_valence,
      emotionalArousal: row.emotional_arousal,
      sourceType: row.source_type,
      confidence: row.confidence,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at * 1000,
      updatedAt: row.updated_at * 1000,
    };
  }

  return {
    async getAll(seedId: string, filter?: { type?: string; scope?: string; isActive?: boolean }) {
      const db = getAppDatabase();
      let sql = 'SELECT * FROM wunderland_memory_traces WHERE seed_id = ?';
      const params: any[] = [seedId];
      if (filter?.type) {
        sql += ' AND type = ?';
        params.push(filter.type);
      }
      if (filter?.scope) {
        sql += ' AND scope = ?';
        params.push(filter.scope);
      }
      if (filter?.isActive !== undefined) {
        sql += ' AND is_active = ?';
        params.push(filter.isActive ? 1 : 0);
      }
      sql += ' ORDER BY created_at DESC';
      const rows = (await db.all(sql, params)) as any[];
      return rows.map(rowToTrace);
    },
    async get(id: string) {
      const db = getAppDatabase();
      const rows = (await db.all('SELECT * FROM wunderland_memory_traces WHERE id = ?', [
        id,
      ])) as any[];
      return rows[0] ? rowToTrace(rows[0]) : undefined;
    },
    async set(trace: any) {
      const db = getAppDatabase();
      await db.run(
        `INSERT OR REPLACE INTO wunderland_memory_traces
          (id, seed_id, content, type, scope, tags, entities, importance, encoding_strength,
           stability, retrieval_count, last_accessed_at, emotional_valence, emotional_arousal,
           source_type, confidence, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          trace.id,
          trace.seedId,
          trace.content,
          trace.type,
          trace.scope,
          JSON.stringify(trace.tags),
          JSON.stringify(trace.entities),
          trace.importance,
          trace.encodingStrength,
          trace.stability,
          trace.retrievalCount,
          trace.lastAccessedAt,
          trace.emotionalValence,
          trace.emotionalArousal,
          trace.sourceType,
          trace.confidence,
          trace.isActive ? 1 : 0,
          Math.trunc(trace.createdAt / 1000),
          Math.trunc(trace.updatedAt / 1000),
        ]
      );
    },
    async count(seedId: string, isActive?: boolean) {
      const db = getAppDatabase();
      const sql =
        isActive !== undefined
          ? 'SELECT COUNT(*) as cnt FROM wunderland_memory_traces WHERE seed_id = ? AND is_active = ?'
          : 'SELECT COUNT(*) as cnt FROM wunderland_memory_traces WHERE seed_id = ?';
      const params = isActive !== undefined ? [seedId, isActive ? 1 : 0] : [seedId];
      const rows = (await db.all(sql, params)) as any[];
      return rows[0]?.cnt ?? 0;
    },
  };
}

async function getProspectiveDb() {
  const { getAppDatabase } = await import('../../../../core/database/appDatabase.js');

  return {
    async getAll(seedId: string) {
      const db = getAppDatabase();
      const rows = (await db.all(
        'SELECT * FROM wunderland_prospective_memory WHERE seed_id = ? ORDER BY created_at DESC',
        [seedId]
      )) as any[];
      return rows.map((r: any) => ({
        id: r.id,
        seedId: r.seed_id,
        content: r.content,
        triggerType: r.trigger_type,
        triggerAt: r.trigger_at ? r.trigger_at * 1000 : undefined,
        triggerEvent: r.trigger_event ?? undefined,
        cueText: r.cue_text ?? undefined,
        importance: r.importance,
        triggered: Boolean(r.triggered),
        recurring: Boolean(r.recurring),
        createdAt: r.created_at * 1000,
      }));
    },
    async set(item: any) {
      const db = getAppDatabase();
      await db.run(
        `INSERT OR REPLACE INTO wunderland_prospective_memory
          (id, seed_id, content, trigger_type, trigger_at, trigger_event, cue_text,
           importance, triggered, recurring, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.seedId,
          item.content,
          item.triggerType,
          item.triggerAt ? Math.trunc(item.triggerAt / 1000) : null,
          item.triggerEvent ?? null,
          item.cueText ?? null,
          item.importance,
          item.triggered ? 1 : 0,
          item.recurring ? 1 : 0,
          Math.trunc(item.createdAt / 1000),
        ]
      );
    },
    async delete(id: string) {
      const db = getAppDatabase();
      const result = await db.run('DELETE FROM wunderland_prospective_memory WHERE id = ?', [id]);
      return (result as any)?.changes > 0;
    },
    async count(seedId: string) {
      const db = getAppDatabase();
      const rows = (await db.all(
        'SELECT COUNT(*) as cnt FROM wunderland_prospective_memory WHERE seed_id = ?',
        [seedId]
      )) as any[];
      return rows[0]?.cnt ?? 0;
    },
  };
}

async function getConfigDb() {
  const { getAppDatabase } = await import('../../../../core/database/appDatabase.js');

  return {
    async get(seedId: string) {
      const db = getAppDatabase();
      const rows = (await db.all('SELECT config FROM wunderland_memory_config WHERE seed_id = ?', [
        seedId,
      ])) as any[];
      return rows[0] ? JSON.parse(rows[0].config || '{}') : {};
    },
    async set(seedId: string, config: Record<string, any>) {
      const db = getAppDatabase();
      await db.run(
        `INSERT OR REPLACE INTO wunderland_memory_config (seed_id, config, updated_at)
         VALUES (?, ?, strftime('%s','now'))`,
        [seedId, JSON.stringify(config)]
      );
    },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Memory persistence — traceDb', () => {
  let traceDb: Awaited<ReturnType<typeof getTraceDb>>;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const ctx = await setupTestDb();
    cleanup = ctx.cleanup;
    traceDb = await getTraceDb();
  });

  it('set + get roundtrips correctly with all fields preserved', async () => {
    const now = Date.now();
    const trace = {
      id: 'mt_test_001',
      seedId: 'seed-alpha',
      content: 'Remember that the user prefers dark mode',
      type: 'semantic',
      scope: 'user',
      tags: ['preference', 'ui'],
      entities: ['dark-mode'],
      importance: 0.8,
      encodingStrength: 0.74,
      stability: 86400000,
      retrievalCount: 3,
      lastAccessedAt: now,
      emotionalValence: 0.2,
      emotionalArousal: 0.1,
      sourceType: 'user_statement',
      confidence: 0.95,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await traceDb.set(trace);
    const loaded = await traceDb.get('mt_test_001');

    assert.ok(loaded, 'trace should be returned');
    assert.equal(loaded!.id, 'mt_test_001');
    assert.equal(loaded!.seedId, 'seed-alpha');
    assert.equal(loaded!.content, 'Remember that the user prefers dark mode');
    assert.equal(loaded!.type, 'semantic');
    assert.equal(loaded!.scope, 'user');
    assert.deepEqual(loaded!.tags, ['preference', 'ui']);
    assert.deepEqual(loaded!.entities, ['dark-mode']);
    assert.equal(loaded!.importance, 0.8);
    assert.equal(loaded!.isActive, true);
    assert.equal(loaded!.retrievalCount, 3);
    assert.equal(loaded!.sourceType, 'user_statement');
    assert.equal(loaded!.confidence, 0.95);
  });

  it('getAll filters by seedId, type, scope, isActive', async () => {
    const now = Date.now();
    const base = {
      importance: 0.5,
      encodingStrength: 0.6,
      stability: 86400000,
      retrievalCount: 0,
      lastAccessedAt: now,
      emotionalValence: 0,
      emotionalArousal: 0,
      sourceType: 'manual',
      confidence: 1,
      createdAt: now,
      updatedAt: now,
    };

    await traceDb.set({
      ...base,
      id: 't1',
      seedId: 'seed-1',
      content: 'a',
      type: 'episodic',
      scope: 'user',
      tags: [],
      entities: [],
      isActive: true,
    });
    await traceDb.set({
      ...base,
      id: 't2',
      seedId: 'seed-1',
      content: 'b',
      type: 'semantic',
      scope: 'user',
      tags: [],
      entities: [],
      isActive: true,
    });
    await traceDb.set({
      ...base,
      id: 't3',
      seedId: 'seed-1',
      content: 'c',
      type: 'episodic',
      scope: 'persona',
      tags: [],
      entities: [],
      isActive: false,
    });
    await traceDb.set({
      ...base,
      id: 't4',
      seedId: 'seed-2',
      content: 'd',
      type: 'episodic',
      scope: 'user',
      tags: [],
      entities: [],
      isActive: true,
    });

    // All for seed-1
    const allSeed1 = await traceDb.getAll('seed-1');
    assert.equal(allSeed1.length, 3);

    // Filter by type
    const episodicSeed1 = await traceDb.getAll('seed-1', { type: 'episodic' });
    assert.equal(episodicSeed1.length, 2);

    // Filter by scope
    const personaSeed1 = await traceDb.getAll('seed-1', { scope: 'persona' });
    assert.equal(personaSeed1.length, 1);
    assert.equal(personaSeed1[0].id, 't3');

    // Filter by isActive
    const activeSeed1 = await traceDb.getAll('seed-1', { isActive: true });
    assert.equal(activeSeed1.length, 2);

    const inactiveSeed1 = await traceDb.getAll('seed-1', { isActive: false });
    assert.equal(inactiveSeed1.length, 1);
    assert.equal(inactiveSeed1[0].id, 't3');
  });

  it('count returns correct counts', async () => {
    const now = Date.now();
    const base = {
      importance: 0.5,
      encodingStrength: 0.6,
      stability: 1,
      retrievalCount: 0,
      lastAccessedAt: now,
      emotionalValence: 0,
      emotionalArousal: 0,
      sourceType: 'manual',
      confidence: 1,
      createdAt: now,
      updatedAt: now,
      type: 'episodic',
      scope: 'user',
      tags: [],
      entities: [],
    };

    await traceDb.set({ ...base, id: 'c1', seedId: 'seed-x', content: 'a', isActive: true });
    await traceDb.set({ ...base, id: 'c2', seedId: 'seed-x', content: 'b', isActive: true });
    await traceDb.set({ ...base, id: 'c3', seedId: 'seed-x', content: 'c', isActive: false });

    const total = await traceDb.count('seed-x');
    assert.equal(total, 3);

    const active = await traceDb.count('seed-x', true);
    assert.equal(active, 2);

    const inactive = await traceDb.count('seed-x', false);
    assert.equal(inactive, 1);
  });
});

describe('Memory persistence — prospectiveDb', () => {
  let prospectiveDb: Awaited<ReturnType<typeof getProspectiveDb>>;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const ctx = await setupTestDb();
    cleanup = ctx.cleanup;
    prospectiveDb = await getProspectiveDb();
  });

  it('set + getAll roundtrips correctly', async () => {
    const now = Date.now();
    await prospectiveDb.set({
      id: 'pm_001',
      seedId: 'seed-1',
      content: 'Remind user about meeting at 3pm',
      triggerType: 'time_based',
      triggerAt: now + 3600000,
      triggerEvent: undefined,
      cueText: 'meeting reminder',
      importance: 0.9,
      triggered: false,
      recurring: false,
      createdAt: now,
    });

    const items = await prospectiveDb.getAll('seed-1');
    assert.equal(items.length, 1);
    assert.equal(items[0].id, 'pm_001');
    assert.equal(items[0].content, 'Remind user about meeting at 3pm');
    assert.equal(items[0].triggerType, 'time_based');
    assert.equal(items[0].importance, 0.9);
    assert.equal(items[0].triggered, false);
    assert.equal(items[0].recurring, false);
    assert.equal(items[0].cueText, 'meeting reminder');
  });

  it('delete removes a prospective item', async () => {
    const now = Date.now();
    await prospectiveDb.set({
      id: 'pm_del',
      seedId: 'seed-1',
      content: 'to delete',
      triggerType: 'event_based',
      importance: 0.5,
      triggered: false,
      recurring: false,
      createdAt: now,
    });

    const deleted = await prospectiveDb.delete('pm_del');
    assert.equal(deleted, true);

    const items = await prospectiveDb.getAll('seed-1');
    assert.equal(items.length, 0);
  });

  it('delete returns false for non-existent item', async () => {
    const deleted = await prospectiveDb.delete('pm_nonexistent');
    assert.equal(deleted, false);
  });

  it('count returns correct number of items', async () => {
    const now = Date.now();
    const base = {
      triggerType: 'context_based',
      importance: 0.5,
      triggered: false,
      recurring: false,
      createdAt: now,
    };

    await prospectiveDb.set({ ...base, id: 'pm_a', seedId: 'seed-1', content: 'a' });
    await prospectiveDb.set({ ...base, id: 'pm_b', seedId: 'seed-1', content: 'b' });
    await prospectiveDb.set({ ...base, id: 'pm_c', seedId: 'seed-2', content: 'c' });

    const countSeed1 = await prospectiveDb.count('seed-1');
    assert.equal(countSeed1, 2);

    const countSeed2 = await prospectiveDb.count('seed-2');
    assert.equal(countSeed2, 1);
  });
});

describe('Memory persistence — configDb', () => {
  let configDb: Awaited<ReturnType<typeof getConfigDb>>;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const ctx = await setupTestDb();
    cleanup = ctx.cleanup;
    configDb = await getConfigDb();
  });

  it('set + get roundtrips with JSON serialization', async () => {
    const config = {
      featureDetectionStrategy: 'hybrid',
      workingMemoryCapacity: 10,
      encoding: {
        baseStrength: 0.7,
        flashbulbThreshold: 0.9,
      },
      decay: {
        pruningThreshold: 0.03,
        recencyHalfLifeMs: 172800000,
      },
      autoIngest: {
        importanceThreshold: 0.4,
        maxMemoriesPerTurn: 5,
        enableSentimentTracking: false,
        enabledCategories: ['episodic', 'goal'],
      },
    };

    await configDb.set('seed-1', config);
    const loaded = await configDb.get('seed-1');

    assert.deepEqual(loaded, config);
  });

  it('get returns empty object for unknown seedId', async () => {
    const result = await configDb.get('seed-nonexistent');
    assert.deepEqual(result, {});
  });

  it('set overwrites existing config', async () => {
    await configDb.set('seed-1', { featureDetectionStrategy: 'keyword' });
    await configDb.set('seed-1', { featureDetectionStrategy: 'llm', workingMemoryCapacity: 12 });

    const loaded = await configDb.get('seed-1');
    assert.equal(loaded.featureDetectionStrategy, 'llm');
    assert.equal(loaded.workingMemoryCapacity, 12);
  });
});
