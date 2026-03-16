import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import { GuardrailLogger, GuardrailSeverity } from '../GuardrailLogger.js';
import { GuardrailAction } from '@framers/agentos/core/guardrails/IGuardrailService';
import type { StorageAdapter } from '@framers/sql-storage-adapter';

/**
 * Minimal StorageAdapter backed by an in-memory better-sqlite3 database.
 */
function createInMemoryAdapter() {
  const db = new Database(':memory:');
  const adapter = {
    db,
    async run(sql: string, params?: unknown[]) {
      const stmt = db.prepare(sql);
      const result = params ? stmt.run(...(params as any[])) : stmt.run();
      return { changes: result.changes, lastInsertRowid: result.lastInsertRowid };
    },
    async query(sql: string, params?: unknown[]) {
      const stmt = db.prepare(sql);
      return params ? stmt.all(...(params as any[])) : stmt.all();
    },
  } as unknown as StorageAdapter & { db: Database.Database };
  return adapter;
}

function makeLogParams(overrides?: Record<string, any>) {
  return {
    guardrailId: 'guardrail-test',
    stage: 'output' as const,
    action: GuardrailAction.BLOCK,
    context: { userId: 'user-1', sessionId: 'session-1', seedId: 'seed-1' } as any,
    evaluation: {
      action: GuardrailAction.BLOCK,
      reason: 'Test block reason',
      reasonCode: 'TEST_BLOCK',
      metadata: { detectedTopics: ['violence'] },
    } as any,
    originalContent: 'Some harmful content here',
    modifiedContent: undefined,
    ...overrides,
  };
}

describe('GuardrailLogger persistence', () => {
  it('creates audit log + review queue tables on first log', async () => {
    const adapter = createInMemoryAdapter();
    const logger = new GuardrailLogger({
      logToConsole: false,
      logToDatabase: true,
      storageAdapter: adapter as any,
    });

    await logger.log(makeLogParams());

    const tables = adapter.db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all() as any[];
    const names = tables.map((t: any) => t.name);
    assert.ok(names.includes('guardrail_audit_log'));
    assert.ok(names.includes('guardrail_review_queue'));
  });

  it('persists a BLOCK event to guardrail_audit_log', async () => {
    const adapter = createInMemoryAdapter();
    const logger = new GuardrailLogger({
      logToConsole: false,
      logToDatabase: true,
      storageAdapter: adapter as any,
    });

    const entry = await logger.log(makeLogParams());

    const rows = adapter.db
      .prepare('SELECT * FROM guardrail_audit_log WHERE id = ?')
      .all(entry.id) as any[];
    assert.equal(rows.length, 1);
    assert.equal(rows[0].guardrail_id, 'guardrail-test');
    assert.equal(rows[0].stage, 'output');
    assert.equal(rows[0].action, GuardrailAction.BLOCK);
    assert.equal(rows[0].severity, GuardrailSeverity.CRITICAL);
    assert.equal(rows[0].trigger_reason, 'Test block reason');
    assert.equal(rows[0].reason_code, 'TEST_BLOCK');
    assert.equal(rows[0].input_snippet, 'Some harmful content here');
    assert.equal(rows[0].seed_id, 'seed-1');
    assert.equal(rows[0].session_id, 'session-1');
  });

  it('persists evaluation metadata as JSON', async () => {
    const adapter = createInMemoryAdapter();
    const logger = new GuardrailLogger({
      logToConsole: false,
      logToDatabase: true,
      storageAdapter: adapter as any,
    });

    const entry = await logger.log(makeLogParams());
    const rows = adapter.db
      .prepare('SELECT metadata FROM guardrail_audit_log WHERE id = ?')
      .all(entry.id) as any[];
    const meta = JSON.parse(rows[0].metadata);
    assert.deepEqual(meta.detectedTopics, ['violence']);
  });

  it('persists SANITIZE with modified content', async () => {
    const adapter = createInMemoryAdapter();
    const logger = new GuardrailLogger({
      logToConsole: false,
      logToDatabase: true,
      storageAdapter: adapter as any,
    });

    const entry = await logger.log(
      makeLogParams({
        action: GuardrailAction.SANITIZE,
        evaluation: { action: GuardrailAction.SANITIZE, reason: 'PII', reasonCode: 'PII_EMAIL' },
        originalContent: 'john@example.com',
        modifiedContent: '[REDACTED]',
      })
    );

    const rows = adapter.db
      .prepare('SELECT * FROM guardrail_audit_log WHERE id = ?')
      .all(entry.id) as any[];
    assert.equal(rows[0].action, GuardrailAction.SANITIZE);
    assert.equal(rows[0].severity, GuardrailSeverity.HIGH);
    assert.equal(rows[0].modified_snippet, '[REDACTED]');
  });

  it('ALLOW events have INFO severity', async () => {
    const adapter = createInMemoryAdapter();
    const logger = new GuardrailLogger({
      logToConsole: false,
      logToDatabase: true,
      storageAdapter: adapter as any,
    });

    const entry = await logger.log(
      makeLogParams({
        action: GuardrailAction.ALLOW,
        evaluation: { action: GuardrailAction.ALLOW, reason: 'OK' },
      })
    );

    const rows = adapter.db
      .prepare('SELECT severity FROM guardrail_audit_log WHERE id = ?')
      .all(entry.id) as any[];
    assert.equal(rows[0].severity, GuardrailSeverity.INFO);
  });

  it('multiple logs accumulate in database', async () => {
    const adapter = createInMemoryAdapter();
    const logger = new GuardrailLogger({
      logToConsole: false,
      logToDatabase: true,
      storageAdapter: adapter as any,
    });

    await logger.log(makeLogParams());
    await logger.log(makeLogParams());
    await logger.log(makeLogParams());

    const row = adapter.db.prepare('SELECT COUNT(*) as cnt FROM guardrail_audit_log').get() as any;
    assert.equal(row.cnt, 3);
  });

  it('escalation queues entry for review in database', async () => {
    const adapter = createInMemoryAdapter();
    const logger = new GuardrailLogger({
      logToConsole: false,
      logToDatabase: true,
      storageAdapter: adapter as any,
      escalationRules: [
        {
          condition: (e) => e.severity === GuardrailSeverity.CRITICAL,
          action: { queueForReview: true },
        },
      ],
    });

    const entry = await logger.log(makeLogParams());
    assert.equal(entry.escalated, true);

    const reviews = adapter.db
      .prepare('SELECT * FROM guardrail_review_queue WHERE audit_log_id = ?')
      .all(entry.id) as any[];
    assert.equal(reviews.length, 1);
    assert.equal(reviews[0].status, 'pending');
  });

  it('non-critical entries are not queued for review', async () => {
    const adapter = createInMemoryAdapter();
    const logger = new GuardrailLogger({
      logToConsole: false,
      logToDatabase: true,
      storageAdapter: adapter as any,
      escalationRules: [
        {
          condition: (e) => e.severity === GuardrailSeverity.CRITICAL,
          action: { queueForReview: true },
        },
      ],
    });

    const entry = await logger.log(
      makeLogParams({
        action: GuardrailAction.ALLOW,
        evaluation: { action: GuardrailAction.ALLOW, reason: 'OK' },
      })
    );
    assert.equal(entry.escalated, false);

    const reviews = adapter.db.prepare('SELECT * FROM guardrail_review_queue').all();
    assert.equal(reviews.length, 0);
  });

  it('does not throw when no storageAdapter configured', async () => {
    const logger = new GuardrailLogger({
      logToConsole: false,
      logToDatabase: true,
    });

    const entry = await logger.log(makeLogParams());
    assert.ok(entry);
    assert.equal(entry.guardrailId, 'guardrail-test');
  });

  it('handles storageAdapter errors gracefully', async () => {
    const broken = {
      async run() {
        throw new Error('DB down');
      },
    } as unknown as StorageAdapter;

    const logger = new GuardrailLogger({
      logToConsole: false,
      logToDatabase: true,
      storageAdapter: broken,
    });

    const entry = await logger.log(makeLogParams());
    assert.ok(entry);
  });

  it('truncates originalContent to 500 chars', async () => {
    const adapter = createInMemoryAdapter();
    const logger = new GuardrailLogger({
      logToConsole: false,
      logToDatabase: true,
      storageAdapter: adapter as any,
    });

    const entry = await logger.log(makeLogParams({ originalContent: 'x'.repeat(1000) }));
    const rows = adapter.db
      .prepare('SELECT input_snippet FROM guardrail_audit_log WHERE id = ?')
      .all(entry.id) as any[];
    assert.equal(rows[0].input_snippet.length, 500);
  });

  it('getStats reflects logged entries', async () => {
    const adapter = createInMemoryAdapter();
    const logger = new GuardrailLogger({
      logToConsole: false,
      logToDatabase: true,
      storageAdapter: adapter as any,
    });

    await logger.log(makeLogParams({ action: GuardrailAction.BLOCK }));
    await logger.log(makeLogParams({ action: GuardrailAction.BLOCK }));
    await logger.log(
      makeLogParams({
        action: GuardrailAction.ALLOW,
        evaluation: { action: GuardrailAction.ALLOW, reason: 'OK' },
      })
    );

    const stats = logger.getStats();
    assert.equal(stats.total, 3);
    assert.equal(stats.byAction[GuardrailAction.BLOCK], 2);
    assert.equal(stats.byAction[GuardrailAction.ALLOW], 1);
  });
});
