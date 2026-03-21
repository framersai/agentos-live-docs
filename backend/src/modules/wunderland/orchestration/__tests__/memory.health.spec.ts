import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import type { StorageAdapter } from '@framers/sql-storage-adapter';

import { MemoryController } from '../memory.controller.js';

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

  const appDbModule = await import('../../../../core/database/appDatabase.js');
  await appDbModule.closeAppDatabase();
  (appDbModule as any).__setAppDatabaseAdapterResolverForTests(async () => adapter);
  await appDbModule.initializeAppDatabase();

  return {
    adapter,
    cleanup: async () => {
      await appDbModule.closeAppDatabase();
      await adapter.close();
    },
  };
}

describe('MemoryController.getHealth', () => {
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const ctx = await setupTestDb();
    cleanup = ctx.cleanup;
  });

  it('surfaces memory health without pretending working-memory utilization is available', async () => {
    const dbModule = await import('../../../../core/database/appDatabase.js');
    const db = dbModule.getAppDatabase();
    const nowSeconds = Math.trunc(Date.now() / 1000);

    await db.run(
      `INSERT INTO wunderland_memory_traces
        (id, seed_id, content, type, scope, tags, entities, importance, encoding_strength,
         stability, retrieval_count, last_accessed_at, emotional_valence, emotional_arousal,
         source_type, confidence, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'trace-1',
        'seed-1',
        'Remember the design system preferences',
        'semantic',
        'user',
        '["preferences"]',
        '[]',
        0.8,
        0.72,
        1,
        0,
        nowSeconds,
        0,
        0,
        'manual',
        1,
        1,
        nowSeconds,
        nowSeconds,
      ]
    );
    await db.run(
      `INSERT INTO wunderland_prospective_memory
        (id, seed_id, content, trigger_type, importance, triggered, recurring, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['pm-1', 'seed-1', 'Follow up on deploy status', 'event_based', 0.9, 0, 0, nowSeconds]
    );

    const controller = new MemoryController(
      {
        querySeedMemory: async () => ({ chunks: [], context: '' }),
      } as any,
      {} as any
    );

    const result = await controller.getHealth('seed-1');

    assert.equal(result.totalTraces, 1);
    assert.equal(result.activeTraces, 1);
    assert.equal(result.vectorMemoryAvailable, true);
    assert.equal(result.prospectiveCount, 1);
    assert.equal(result.workingMemoryUtilization, 0);
    assert.equal(result.workingMemoryUtilizationAvailable, false);
    assert.equal(result.workingMemoryUtilizationSource, 'unavailable');

    await cleanup();
  });

  it('marks vector memory unavailable when the vector query fails', async () => {
    const controller = new MemoryController(
      {
        querySeedMemory: async () => {
          throw new Error('vector offline');
        },
      } as any,
      {} as any
    );

    const result = await controller.getHealth('seed-2');

    assert.equal(result.vectorMemoryAvailable, false);
    assert.equal(result.workingMemoryUtilizationAvailable, false);
    assert.equal(result.workingMemoryUtilizationSource, 'unavailable');

    await cleanup();
  });
});
