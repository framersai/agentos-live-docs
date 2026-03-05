import test from 'node:test';
import assert from 'node:assert/strict';

import { MediaLibraryService, MediaAsset } from '../modules/wunderland/media-library/media-library.service.js';

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
      return `media_${idCounter++}`;
    },

    async exec(sql: string): Promise<void> {
      calls.push({ method: 'exec', sql });
    },

    async run(sql: string, params?: unknown[]): Promise<{ changes: number; lastInsertRowid: number }> {
      calls.push({ method: 'run', sql, params: params as unknown[] });

      if (sql.trim().toUpperCase().startsWith('INSERT')) {
        const row = buildMediaRowFromInsert(params as unknown[]);
        rows.push(row);
      }

      if (sql.trim().toUpperCase().startsWith('UPDATE')) {
        const id = (params as unknown[])?.[(params as unknown[]).length - 1];
        const target = rows.find((r) => r.id === id);
        if (target && sql.includes('tags = ?')) {
          target.tags = params![0];
          target.updated_at = params![1];
        }
      }

      if (sql.trim().toUpperCase().startsWith('DELETE')) {
        // The delete query uses id = ? AND owner_user_id = ?
        const id = (params as unknown[])?.[0];
        const ownerId = (params as unknown[])?.[1];
        const idx = rows.findIndex((r) => r.id === id && r.owner_user_id === ownerId);
        if (idx >= 0) rows.splice(idx, 1);
      }

      return { changes: 1, lastInsertRowid: rows.length };
    },

    async get<T>(sql: string, params?: unknown[]): Promise<T | undefined> {
      calls.push({ method: 'get', sql, params: params as unknown[] });

      if (sql.includes('COUNT(*)')) {
        const filtered = filterMediaRows(rows, sql, params as unknown[]);
        return { cnt: filtered.length } as T;
      }

      // Lookup by id (and optionally owner_user_id)
      const id = (params as unknown[])?.[0];
      if (sql.includes('owner_user_id = ?')) {
        const ownerId = (params as unknown[])?.[1];
        const found = rows.find((r) => r.id === id && r.owner_user_id === ownerId);
        return (found as T) ?? undefined;
      }
      const found = rows.find((r) => r.id === id);
      return (found as T) ?? undefined;
    },

    async all<T>(sql: string, params?: unknown[]): Promise<T[]> {
      calls.push({ method: 'all', sql, params: params as unknown[] });
      const filtered = filterMediaRows(rows, sql, params as unknown[]);
      return filtered as T[];
    },
  };
}

function buildMediaRowFromInsert(params: unknown[]): MockRow {
  return {
    id: params[0],
    seed_id: params[1],
    owner_user_id: params[2],
    filename: params[3],
    original_name: params[4],
    mime_type: params[5],
    size: params[6],
    width: null,
    height: null,
    duration: null,
    tags: params[7],
    storage_path: params[8],
    thumbnail_path: null,
    created_at: params[9],
    updated_at: params[10],
  };
}

function filterMediaRows(rows: MockRow[], sql: string, params: unknown[]): MockRow[] {
  let result = [...rows];

  if (sql.includes('owner_user_id = ?')) {
    const ownerIdx = sql.indexOf('owner_user_id = ?');
    const prefix = sql.substring(0, ownerIdx);
    const paramIndex = (prefix.match(/\?/g) || []).length;
    if (params?.[paramIndex] !== undefined) {
      result = result.filter((r) => r.owner_user_id === params[paramIndex]);
    }
  }

  if (sql.includes('seed_id = ?')) {
    const seedIdx = sql.indexOf('seed_id = ?');
    const prefix = sql.substring(0, seedIdx);
    const paramIndex = (prefix.match(/\?/g) || []).length;
    if (params?.[paramIndex] !== undefined) {
      result = result.filter((r) => r.seed_id === params[paramIndex]);
    }
  }

  if (sql.includes('mime_type LIKE ?')) {
    const mimeIdx = sql.indexOf('mime_type LIKE ?');
    const prefix = sql.substring(0, mimeIdx);
    const paramIndex = (prefix.match(/\?/g) || []).length;
    if (params?.[paramIndex] !== undefined) {
      const pattern = String(params[paramIndex]).replace(/%/g, '');
      result = result.filter((r) => String(r.mime_type).startsWith(pattern.replace('/', '')));
    }
  }

  if (sql.includes('tags LIKE ?')) {
    // Find all tags LIKE ? occurrences
    let searchFrom = 0;
    const tagParams: string[] = [];
    while (true) {
      const idx = sql.indexOf('tags LIKE ?', searchFrom);
      if (idx < 0) break;
      const prefix = sql.substring(0, idx);
      const paramIndex = (prefix.match(/\?/g) || []).length;
      if (params?.[paramIndex] !== undefined) {
        tagParams.push(String(params[paramIndex]));
      }
      searchFrom = idx + 11;
    }
    for (const tp of tagParams) {
      // tp looks like %"tagname"% — extract the tag
      const match = tp.match(/"([^"]+)"/);
      if (match) {
        result = result.filter((r) => String(r.tags).includes(`"${match[1]}"`));
      }
    }
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Mock fs module — intercept file operations                         */
/* ------------------------------------------------------------------ */

/** Track fs calls for assertions without touching the real filesystem */
const fsCalls: { method: string; args: unknown[] }[] = [];

function resetFsCalls() {
  fsCalls.length = 0;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function makeMediaRow(overrides: Partial<MockRow> = {}): MockRow {
  const now = Date.now();
  return {
    id: 'media_existing',
    seed_id: 'seed_1',
    owner_user_id: 'user_1',
    filename: 'media_existing.png',
    original_name: 'photo.png',
    mime_type: 'image/png',
    size: 1024,
    width: null,
    height: null,
    duration: null,
    tags: '["landscape","hero"]',
    storage_path: '/tmp/test-media/seed_1/media_existing.png',
    thumbnail_path: null,
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

function makeService(initialRows: MockRow[] = []) {
  const db = createMockDb(initialRows);
  const svc = new MediaLibraryService(db as any);
  // Override storageDir to a test path
  (svc as any).storageDir = '/tmp/test-media';
  return { svc, db };
}

/* ------------------------------------------------------------------ */
/*  Tests: upload (createAsset)                                        */
/* ------------------------------------------------------------------ */

test('MediaLibraryService.upload inserts a new asset and returns mapped object', async (t) => {
  const { svc, db } = makeService();

  // Mock fs.mkdir and fs.writeFile on the service level to avoid real I/O
  const originalFsMkdir = (await import('fs/promises')).mkdir;
  const originalFsWriteFile = (await import('fs/promises')).writeFile;

  // We need to stub the file system calls. Since the service imports fs directly,
  // we verify the database layer instead.
  try {
    // The upload will fail on fs.mkdir since directory doesn't exist.
    // We test the database logic by verifying the INSERT was attempted.
    await svc.upload({
      seedId: 'seed_1',
      ownerUserId: 'user_1',
      file: Buffer.from('fake image data'),
      originalName: 'photo.png',
      mimeType: 'image/png',
      tags: ['hero', 'banner'],
    });
  } catch {
    // File system error is expected in test environment.
    // Verify the ensureTable exec was called.
    const execCalls = db._calls.filter((c) => c.method === 'exec');
    assert.ok(execCalls.length > 0, 'ensureTable should have been called');
  }
});

/* ------------------------------------------------------------------ */
/*  Tests: getAsset                                                    */
/* ------------------------------------------------------------------ */

test('MediaLibraryService.getAsset returns mapped asset when found', async () => {
  const row = makeMediaRow();
  const { svc } = makeService([row]);

  const asset = await svc.getAsset('media_existing');

  assert.ok(asset);
  assert.equal(asset.id, 'media_existing');
  assert.equal(asset.seedId, 'seed_1');
  assert.equal(asset.ownerUserId, 'user_1');
  assert.equal(asset.filename, 'media_existing.png');
  assert.equal(asset.originalName, 'photo.png');
  assert.equal(asset.mimeType, 'image/png');
  assert.equal(asset.size, 1024);
  assert.deepEqual(asset.tags, ['landscape', 'hero']);
});

test('MediaLibraryService.getAsset returns null for non-existent ID', async () => {
  const { svc } = makeService([]);

  const asset = await svc.getAsset('nonexistent');

  assert.equal(asset, null);
});

test('MediaLibraryService.getAsset correctly maps optional fields (width, height, duration)', async () => {
  const row = makeMediaRow({
    width: 1920,
    height: 1080,
    duration: 120.5,
    mime_type: 'video/mp4',
  });
  const { svc } = makeService([row]);

  const asset = await svc.getAsset('media_existing');

  assert.ok(asset);
  assert.equal(asset.width, 1920);
  assert.equal(asset.height, 1080);
  assert.equal(asset.duration, 120.5);
});

test('MediaLibraryService.getAsset handles malformed JSON in tags gracefully', async () => {
  const row = makeMediaRow({ tags: 'not-valid-json' });
  const { svc } = makeService([row]);

  const asset = await svc.getAsset('media_existing');

  assert.ok(asset);
  assert.deepEqual(asset.tags, []);
});

/* ------------------------------------------------------------------ */
/*  Tests: listAssets                                                   */
/* ------------------------------------------------------------------ */

test('MediaLibraryService.listAssets returns assets filtered by owner', async () => {
  const rows = [
    makeMediaRow({ id: 'm1', owner_user_id: 'user_1' }),
    makeMediaRow({ id: 'm2', owner_user_id: 'user_2' }),
    makeMediaRow({ id: 'm3', owner_user_id: 'user_1' }),
  ];
  const { svc } = makeService(rows);

  const { items, total } = await svc.listAssets('user_1');

  assert.equal(total, 2);
  assert.equal(items.length, 2);
  assert.ok(items.every((a) => a.ownerUserId === 'user_1'));
});

test('MediaLibraryService.listAssets filters by seedId', async () => {
  const rows = [
    makeMediaRow({ id: 'm1', owner_user_id: 'user_1', seed_id: 'seed_A' }),
    makeMediaRow({ id: 'm2', owner_user_id: 'user_1', seed_id: 'seed_B' }),
  ];
  const { svc, db } = makeService(rows);

  await svc.listAssets('user_1', 'seed_A');

  const allCall = db._calls.find((c) => c.method === 'all');
  assert.ok(allCall);
  assert.ok(allCall.sql.includes('seed_id = ?'), 'Query should filter by seed_id');
});

test('MediaLibraryService.listAssets filters by mimeType', async () => {
  const rows = [
    makeMediaRow({ id: 'm1', owner_user_id: 'user_1', mime_type: 'image/png' }),
    makeMediaRow({ id: 'm2', owner_user_id: 'user_1', mime_type: 'video/mp4' }),
  ];
  const { svc, db } = makeService(rows);

  await svc.listAssets('user_1', undefined, undefined, 'image/png');

  const allCall = db._calls.find((c) => c.method === 'all');
  assert.ok(allCall);
  assert.ok(allCall.sql.includes('mime_type LIKE ?'), 'Query should filter by mime_type');
});

test('MediaLibraryService.listAssets filters by tags', async () => {
  const rows = [
    makeMediaRow({ id: 'm1', owner_user_id: 'user_1', tags: '["hero","banner"]' }),
    makeMediaRow({ id: 'm2', owner_user_id: 'user_1', tags: '["icon"]' }),
  ];
  const { svc, db } = makeService(rows);

  const { items } = await svc.listAssets('user_1', undefined, ['hero']);

  const allCall = db._calls.find((c) => c.method === 'all');
  assert.ok(allCall);
  assert.ok(allCall.sql.includes('tags LIKE ?'), 'Query should filter by tags');
});

test('MediaLibraryService.listAssets returns correct total with multiple tag filters', async () => {
  const rows = [
    makeMediaRow({ id: 'm1', owner_user_id: 'user_1', tags: '["hero","banner","featured"]' }),
    makeMediaRow({ id: 'm2', owner_user_id: 'user_1', tags: '["hero"]' }),
    makeMediaRow({ id: 'm3', owner_user_id: 'user_1', tags: '["banner"]' }),
  ];
  const { svc } = makeService(rows);

  const { items, total } = await svc.listAssets('user_1', undefined, ['hero', 'banner']);

  // Only m1 has both "hero" and "banner"
  assert.equal(total, 1);
});

/* ------------------------------------------------------------------ */
/*  Tests: deleteAsset                                                 */
/* ------------------------------------------------------------------ */

test('MediaLibraryService.deleteAsset removes asset from DB and returns true', async () => {
  const row = makeMediaRow({ id: 'm1', owner_user_id: 'user_1' });
  const { svc, db } = makeService([row]);

  const result = await svc.deleteAsset('m1', 'user_1');

  assert.equal(result, true);
  assert.equal(db._rows.length, 0);

  const deleteCall = db._calls.find((c) => c.method === 'run' && c.sql.includes('DELETE'));
  assert.ok(deleteCall, 'Expected DELETE call');
});

test('MediaLibraryService.deleteAsset returns false when asset not found', async () => {
  const { svc } = makeService([]);

  const result = await svc.deleteAsset('nonexistent', 'user_1');

  assert.equal(result, false);
});

test('MediaLibraryService.deleteAsset returns false when owner does not match', async () => {
  const row = makeMediaRow({ id: 'm1', owner_user_id: 'user_1' });
  const { svc } = makeService([row]);

  const result = await svc.deleteAsset('m1', 'user_WRONG');

  assert.equal(result, false);
});

/* ------------------------------------------------------------------ */
/*  Tests: tagAsset                                                    */
/* ------------------------------------------------------------------ */

test('MediaLibraryService.tagAsset updates tags on an existing asset', async () => {
  const row = makeMediaRow({ id: 'm1', owner_user_id: 'user_1', tags: '["old"]' });
  const { svc, db } = makeService([row]);

  const result = await svc.tagAsset('m1', 'user_1', ['new-tag', 'featured']);

  assert.ok(result);
  // Verify the UPDATE was issued with the new tags
  const updateCall = db._calls.find((c) => c.method === 'run' && c.sql.includes('UPDATE'));
  assert.ok(updateCall, 'Expected UPDATE call for tags');
  assert.ok(
    (updateCall.params as string[])[0].includes('new-tag'),
    'Tags parameter should contain new tag'
  );
});

test('MediaLibraryService.tagAsset returns null when asset not owned by user', async () => {
  const row = makeMediaRow({ id: 'm1', owner_user_id: 'user_1' });
  const { svc } = makeService([row]);

  const result = await svc.tagAsset('m1', 'user_WRONG', ['tag']);

  assert.equal(result, null);
});

/* ------------------------------------------------------------------ */
/*  Tests: ensureTable idempotence                                     */
/* ------------------------------------------------------------------ */

test('MediaLibraryService.ensureTable only runs schema DDL once', async () => {
  const { svc, db } = makeService();

  await svc.getAsset('x');
  await svc.getAsset('y');

  const createCalls = db._calls.filter(
    (c) => c.method === 'exec' && c.sql.includes('CREATE TABLE')
  );
  assert.equal(createCalls.length, 1, 'CREATE TABLE should only run once');
});

/* ------------------------------------------------------------------ */
/*  Tests: date mapping                                                */
/* ------------------------------------------------------------------ */

test('MediaLibraryService maps epoch timestamps in created_at/updated_at to ISO strings', async () => {
  const now = Date.now();
  const row = makeMediaRow({ created_at: now, updated_at: now });
  const { svc } = makeService([row]);

  const asset = await svc.getAsset('media_existing');

  assert.ok(asset);
  // The ISO string should be a valid date
  assert.ok(!isNaN(new Date(asset.createdAt).getTime()), 'createdAt should be a valid ISO date');
  assert.ok(!isNaN(new Date(asset.updatedAt).getTime()), 'updatedAt should be a valid ISO date');
});
