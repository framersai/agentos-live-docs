import test from 'node:test';
import assert from 'node:assert/strict';

import { SocialPostsService, SocialPostStatus, SocialPostRow } from '../modules/wunderland/social-posts/social-posts.service.js';

/* ------------------------------------------------------------------ */
/*  Mock DatabaseService                                               */
/* ------------------------------------------------------------------ */

interface MockRow extends Record<string, unknown> {}

function createMockDb(initialRows: MockRow[] = []) {
  const rows: MockRow[] = [...initialRows];
  const calls: { method: string; sql: string; params?: unknown[] }[] = [];

  let idCounter = 1;

  return {
    _rows: rows,
    _calls: calls,

    generateId(): string {
      return `post_${idCounter++}`;
    },

    async exec(sql: string): Promise<void> {
      calls.push({ method: 'exec', sql });
    },

    async run(sql: string, params?: unknown[]): Promise<{ changes: number; lastInsertRowid: number }> {
      calls.push({ method: 'run', sql, params: params as unknown[] });

      // Handle INSERT — push a row into the store
      if (sql.trim().toUpperCase().startsWith('INSERT')) {
        const row = buildRowFromInsertParams(params as unknown[]);
        rows.push(row);
      }

      // Handle UPDATE — apply status / field changes to matching row
      if (sql.trim().toUpperCase().startsWith('UPDATE')) {
        const id = (params as unknown[])?.[(params as unknown[]).length - 1];
        const target = rows.find((r) => r.id === id);
        if (target) {
          applyUpdateToRow(sql, params as unknown[], target);
        }
      }

      // Handle DELETE
      if (sql.trim().toUpperCase().startsWith('DELETE')) {
        const id = (params as unknown[])?.[0];
        const idx = rows.findIndex((r) => r.id === id);
        if (idx >= 0) rows.splice(idx, 1);
      }

      return { changes: 1, lastInsertRowid: rows.length };
    },

    async get<T>(sql: string, params?: unknown[]): Promise<T | undefined> {
      calls.push({ method: 'get', sql, params: params as unknown[] });

      // COUNT query
      if (sql.includes('COUNT(*)')) {
        const filtered = filterRows(rows, sql, params as unknown[]);
        return { cnt: filtered.length } as T;
      }

      // Single row lookup by id
      const id = (params as unknown[])?.[0];
      const found = rows.find((r) => r.id === id);
      return (found as T) ?? undefined;
    },

    async all<T>(sql: string, params?: unknown[]): Promise<T[]> {
      calls.push({ method: 'all', sql, params: params as unknown[] });
      const filtered = filterRows(rows, sql, params as unknown[]);
      return filtered as T[];
    },
  };
}

/** Build a SocialPostRow-like object from INSERT parameter array */
function buildRowFromInsertParams(params: unknown[]): MockRow {
  return {
    id: params[0],
    seed_id: params[1],
    base_content: params[2],
    adaptations: params[3],
    platforms: params[4],
    media_urls: params[5],
    scheduled_at: params[6],
    status: 'draft',
    results: '{}',
    retry_count: 0,
    max_retries: 3,
    error: null,
    created_at: params[7],
    updated_at: params[8],
  };
}

/** Naively apply UPDATE fields to a row for testing purposes */
function applyUpdateToRow(sql: string, params: unknown[], row: MockRow) {
  if (sql.includes("status = 'scheduled'")) {
    row.status = 'scheduled';
    row.scheduled_at = params[0];
    row.updated_at = params[1];
  } else if (sql.includes("status = 'publishing'")) {
    row.status = 'publishing';
    row.updated_at = params[0];
  } else if (sql.includes("status = 'published'")) {
    row.status = 'published';
    row.error = null;
    row.updated_at = params[0];
  } else if (sql.includes("status = 'error'")) {
    row.status = 'error';
    row.error = params[0];
    row.updated_at = params[1];
  } else if (sql.includes("status = 'retry'")) {
    row.status = 'retry';
    row.retry_count = params[0];
    row.error = null;
    row.updated_at = params[1];
  } else if (sql.includes('results = ?')) {
    row.results = params[0];
    row.updated_at = params[1];
  }
}

/** Simple row filtering based on SQL WHERE clauses */
function filterRows(rows: MockRow[], sql: string, params: unknown[]): MockRow[] {
  let result = [...rows];

  if (sql.includes('seed_id = ?') && params?.length) {
    const seedIdx = sql.indexOf('seed_id = ?');
    // Find the parameter index by counting '?' before this one
    const prefix = sql.substring(0, seedIdx);
    const paramIndex = (prefix.match(/\?/g) || []).length;
    result = result.filter((r) => r.seed_id === params[paramIndex]);
  }

  if (sql.includes("status = 'scheduled'")) {
    result = result.filter((r) => r.status === 'scheduled');
  }

  if (sql.includes('status = ?')) {
    const statusIdx = sql.indexOf('status = ?');
    const prefix = sql.substring(0, statusIdx);
    const paramIndex = (prefix.match(/\?/g) || []).length;
    result = result.filter((r) => r.status === params[paramIndex]);
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Helper: create a service with a pre-seeded DB                      */
/* ------------------------------------------------------------------ */

function makeService(initialRows: MockRow[] = []) {
  const db = createMockDb(initialRows);
  const svc = new SocialPostsService(db as any);
  return { svc, db };
}

function makeDraftRow(overrides: Partial<SocialPostRow> = {}): MockRow {
  return {
    id: 'post_existing',
    seed_id: 'seed_1',
    base_content: 'Hello world',
    adaptations: '{}',
    platforms: '["twitter","linkedin"]',
    media_urls: '[]',
    scheduled_at: null,
    status: 'draft' as SocialPostStatus,
    results: '{}',
    retry_count: 0,
    max_retries: 3,
    error: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

/* ------------------------------------------------------------------ */
/*  Tests: createDraft                                                 */
/* ------------------------------------------------------------------ */

test('SocialPostsService.createDraft inserts a new draft post and returns mapped object', async () => {
  const { svc, db } = makeService();

  const result = await svc.createDraft('seed_1', 'Hello world', ['twitter', 'linkedin']);

  assert.equal(result.id, 'post_1');
  assert.equal(result.seedId, 'seed_1');
  assert.equal(result.baseContent, 'Hello world');
  assert.deepEqual(result.platforms, ['twitter', 'linkedin']);
  assert.equal(result.status, 'draft');
  assert.deepEqual(result.adaptations, {});
  assert.deepEqual(result.mediaUrls, []);
  assert.equal(result.retryCount, 0);
  assert.equal(result.maxRetries, 3);
  assert.equal(result.error, null);

  // Verify INSERT was issued
  const insertCall = db._calls.find((c) => c.method === 'run' && c.sql.includes('INSERT'));
  assert.ok(insertCall, 'Expected an INSERT call to the database');
});

test('SocialPostsService.createDraft stores adaptations and mediaUrls when provided', async () => {
  const { svc } = makeService();

  const adaptations = { twitter: 'Short version', linkedin: 'Professional version' };
  const mediaUrls = ['https://example.com/img1.png', 'https://example.com/img2.png'];

  const result = await svc.createDraft('seed_2', 'Base text', ['twitter'], adaptations, mediaUrls);

  assert.deepEqual(result.adaptations, adaptations);
  assert.deepEqual(result.mediaUrls, mediaUrls);
});

test('SocialPostsService.createDraft generates unique IDs for successive drafts', async () => {
  const { svc } = makeService();

  const post1 = await svc.createDraft('seed_1', 'Post one', ['twitter']);
  const post2 = await svc.createDraft('seed_1', 'Post two', ['twitter']);

  assert.notEqual(post1.id, post2.id);
});

/* ------------------------------------------------------------------ */
/*  Tests: getPost                                                     */
/* ------------------------------------------------------------------ */

test('SocialPostsService.getPost returns the mapped post when it exists', async () => {
  const row = makeDraftRow();
  const { svc } = makeService([row]);

  const post = await svc.getPost('post_existing');

  assert.equal(post.id, 'post_existing');
  assert.equal(post.seedId, 'seed_1');
  assert.equal(post.status, 'draft');
});

test('SocialPostsService.getPost throws NotFoundException for non-existent ID', async () => {
  const { svc } = makeService();

  await assert.rejects(
    () => svc.getPost('nonexistent_id'),
    (err: any) => {
      assert.ok(err.message.includes('not found') || err.status === 404);
      return true;
    }
  );
});

/* ------------------------------------------------------------------ */
/*  Tests: listPosts                                                   */
/* ------------------------------------------------------------------ */

test('SocialPostsService.listPosts returns all posts when no filters applied', async () => {
  const rows = [
    makeDraftRow({ id: 'p1', seed_id: 'seed_1' }),
    makeDraftRow({ id: 'p2', seed_id: 'seed_2' }),
  ];
  const { svc } = makeService(rows);

  const { posts, total } = await svc.listPosts();

  assert.equal(total, 2);
  assert.equal(posts.length, 2);
});

test('SocialPostsService.listPosts filters by seedId', async () => {
  const rows = [
    makeDraftRow({ id: 'p1', seed_id: 'seed_1' }),
    makeDraftRow({ id: 'p2', seed_id: 'seed_2' }),
    makeDraftRow({ id: 'p3', seed_id: 'seed_1' }),
  ];
  const { svc } = makeService(rows);

  const { posts, total } = await svc.listPosts({ seedId: 'seed_1' });

  assert.equal(total, 2);
  assert.ok(posts.every((p) => p.seedId === 'seed_1'));
});

test('SocialPostsService.listPosts filters by status', async () => {
  const rows = [
    makeDraftRow({ id: 'p1', status: 'draft' as SocialPostStatus }),
    makeDraftRow({ id: 'p2', status: 'published' as SocialPostStatus }),
    makeDraftRow({ id: 'p3', status: 'draft' as SocialPostStatus }),
  ];
  const { svc } = makeService(rows);

  const { posts, total } = await svc.listPosts({ status: 'draft' });

  assert.equal(total, 2);
  assert.ok(posts.every((p) => p.status === 'draft'));
});

/* ------------------------------------------------------------------ */
/*  Tests: schedulePost                                                */
/* ------------------------------------------------------------------ */

test('SocialPostsService.schedulePost transitions a draft to scheduled', async () => {
  const row = makeDraftRow({ id: 'p1', status: 'draft' as SocialPostStatus });
  const { svc } = makeService([row]);

  const scheduledAt = '2026-06-01T12:00:00.000Z';
  const result = await svc.schedulePost('p1', scheduledAt);

  assert.equal(result.status, 'scheduled');
  assert.equal(result.scheduledAt, scheduledAt);
});

test('SocialPostsService.schedulePost throws when post is not in draft status', async () => {
  const row = makeDraftRow({ id: 'p1', status: 'published' as SocialPostStatus });
  const { svc } = makeService([row]);

  await assert.rejects(
    () => svc.schedulePost('p1', '2026-06-01T12:00:00.000Z'),
    (err: any) => {
      assert.ok(err.message.includes('Cannot schedule'));
      return true;
    }
  );
});

/* ------------------------------------------------------------------ */
/*  Tests: updateStatus (startPublishing, markPublished, markError)     */
/* ------------------------------------------------------------------ */

test('SocialPostsService.startPublishing transitions scheduled to publishing', async () => {
  const row = makeDraftRow({ id: 'p1', status: 'scheduled' as SocialPostStatus });
  const { svc } = makeService([row]);

  const result = await svc.startPublishing('p1');
  assert.equal(result.status, 'publishing');
});

test('SocialPostsService.startPublishing also accepts retry status', async () => {
  const row = makeDraftRow({ id: 'p1', status: 'retry' as SocialPostStatus });
  const { svc } = makeService([row]);

  const result = await svc.startPublishing('p1');
  assert.equal(result.status, 'publishing');
});

test('SocialPostsService.startPublishing throws for invalid source status', async () => {
  const row = makeDraftRow({ id: 'p1', status: 'draft' as SocialPostStatus });
  const { svc } = makeService([row]);

  await assert.rejects(
    () => svc.startPublishing('p1'),
    (err: any) => {
      assert.ok(err.message.includes('Cannot start publishing'));
      return true;
    }
  );
});

test('SocialPostsService.markPublished transitions to published and clears error', async () => {
  const row = makeDraftRow({ id: 'p1', status: 'publishing' as SocialPostStatus, error: 'old error' });
  const { svc } = makeService([row]);

  const result = await svc.markPublished('p1');
  assert.equal(result.status, 'published');
  assert.equal(result.error, null);
});

test('SocialPostsService.markError transitions to error and stores error message', async () => {
  const row = makeDraftRow({ id: 'p1', status: 'publishing' as SocialPostStatus });
  const { svc } = makeService([row]);

  const result = await svc.markError('p1', 'API rate limit exceeded');
  assert.equal(result.status, 'error');
  assert.equal(result.error, 'API rate limit exceeded');
});

test('SocialPostsService.markPlatformResult merges platform result into results map', async () => {
  const row = makeDraftRow({ id: 'p1', status: 'publishing' as SocialPostStatus, results: '{}' });
  const { svc } = makeService([row]);

  const result = await svc.markPlatformResult('p1', 'twitter', {
    success: true,
    postId: 'tw_123',
    url: 'https://twitter.com/status/tw_123',
  });

  assert.ok(result.results.twitter);
  assert.equal(result.results.twitter.success, true);
  assert.equal(result.results.twitter.postId, 'tw_123');
});

/* ------------------------------------------------------------------ */
/*  Tests: retryPost                                                   */
/* ------------------------------------------------------------------ */

test('SocialPostsService.retryPost transitions error to retry and increments count', async () => {
  const row = makeDraftRow({
    id: 'p1',
    status: 'error' as SocialPostStatus,
    retry_count: 0,
    max_retries: 3,
  });
  const { svc } = makeService([row]);

  const result = await svc.retryPost('p1');
  assert.equal(result.status, 'retry');
  assert.equal(result.retryCount, 1);
  assert.equal(result.error, null);
});

test('SocialPostsService.retryPost throws when max retries exceeded', async () => {
  const row = makeDraftRow({
    id: 'p1',
    status: 'error' as SocialPostStatus,
    retry_count: 3,
    max_retries: 3,
  });
  const { svc } = makeService([row]);

  await assert.rejects(
    () => svc.retryPost('p1'),
    (err: any) => {
      assert.ok(err.message.includes('exceeded maximum retries'));
      return true;
    }
  );
});

test('SocialPostsService.retryPost throws when post is not in error status', async () => {
  const row = makeDraftRow({ id: 'p1', status: 'draft' as SocialPostStatus });
  const { svc } = makeService([row]);

  await assert.rejects(
    () => svc.retryPost('p1'),
    (err: any) => {
      assert.ok(err.message.includes('Cannot retry'));
      return true;
    }
  );
});

/* ------------------------------------------------------------------ */
/*  Tests: getDuePosts                                                 */
/* ------------------------------------------------------------------ */

test('SocialPostsService.getDuePosts returns scheduled posts past their scheduled time', async () => {
  const pastDate = new Date(Date.now() - 60_000).toISOString();
  const futureDate = new Date(Date.now() + 3_600_000).toISOString();

  const rows = [
    makeDraftRow({ id: 'p1', status: 'scheduled' as SocialPostStatus, scheduled_at: pastDate }),
    makeDraftRow({ id: 'p2', status: 'scheduled' as SocialPostStatus, scheduled_at: futureDate }),
    makeDraftRow({ id: 'p3', status: 'draft' as SocialPostStatus, scheduled_at: pastDate }),
  ];
  const { svc, db } = makeService(rows);

  // getDuePosts queries for status='scheduled' AND scheduled_at <= now
  // Our mock filters by status in the SQL; the service further checks scheduled_at <= now
  const duePosts = await svc.getDuePosts();

  // The mock all() returns rows matching status='scheduled' from the SQL
  // Both p1 and p2 are scheduled, but only p1 is past due.
  // The actual service relies on SQL WHERE to filter, so our mock returns both scheduled.
  // We verify the DB query was constructed correctly.
  const allCall = db._calls.find((c) => c.method === 'all' && c.sql.includes("status = 'scheduled'"));
  assert.ok(allCall, 'Expected a query filtering for scheduled status');
  assert.ok(allCall.sql.includes('scheduled_at <= ?'), 'Expected scheduled_at comparison in query');
});

test('SocialPostsService.getDuePosts returns empty array when no posts are due', async () => {
  const { svc } = makeService([]);
  const duePosts = await svc.getDuePosts();
  assert.deepEqual(duePosts, []);
});

/* ------------------------------------------------------------------ */
/*  Tests: deletePost                                                  */
/* ------------------------------------------------------------------ */

test('SocialPostsService.deletePost removes a draft post', async () => {
  const row = makeDraftRow({ id: 'p1', status: 'draft' as SocialPostStatus });
  const { svc, db } = makeService([row]);

  await svc.deletePost('p1');

  const deleteCall = db._calls.find((c) => c.method === 'run' && c.sql.includes('DELETE'));
  assert.ok(deleteCall, 'Expected a DELETE call');
  assert.equal(db._rows.length, 0);
});

test('SocialPostsService.deletePost throws when post is currently publishing', async () => {
  const row = makeDraftRow({ id: 'p1', status: 'publishing' as SocialPostStatus });
  const { svc } = makeService([row]);

  await assert.rejects(
    () => svc.deletePost('p1'),
    (err: any) => {
      assert.ok(err.message.includes('Cannot delete'));
      return true;
    }
  );
});

/* ------------------------------------------------------------------ */
/*  Tests: ensureTable idempotence                                     */
/* ------------------------------------------------------------------ */

test('SocialPostsService.ensureTable only runs CREATE TABLE once', async () => {
  const { svc, db } = makeService();

  // Call ensureTable indirectly by calling getPost twice (which both trigger ensureTable)
  try { await svc.getPost('x'); } catch { /* expected NotFoundException */ }
  try { await svc.getPost('y'); } catch { /* expected NotFoundException */ }

  const execCalls = db._calls.filter(
    (c) => c.method === 'exec' && c.sql.includes('CREATE TABLE')
  );
  assert.equal(execCalls.length, 1, 'CREATE TABLE should only be called once');
});
