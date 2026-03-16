import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { SearchService, type WunderlandSearchResponseWithSemantic } from '../search.service.js';

// ---------------------------------------------------------------------------
// Mock DatabaseService — mimics the get/all interface used by SearchService
// ---------------------------------------------------------------------------

function createMockDatabaseService() {
  return {
    _rows: [] as any[],
    _countValue: 0,

    async get<T = unknown>(_sql: string, _params?: unknown[]): Promise<T | null> {
      return { count: this._countValue } as unknown as T;
    },
    async all<T = unknown>(_sql: string, _params?: unknown[]): Promise<T[]> {
      return this._rows as T[];
    },
    async run(_sql: string, _params?: unknown[]) {
      return { changes: 0 };
    },
    async exec(_sql: string) {},
  };
}

// ---------------------------------------------------------------------------
// Mock WunderlandVectorMemoryService
// ---------------------------------------------------------------------------

function createMockVectorMemory(chunks: any[] = []) {
  return {
    querySeedMemory: async (_opts: any) => ({ chunks }),
  };
}

describe('SearchService', () => {
  let mockDb: ReturnType<typeof createMockDatabaseService>;

  beforeEach(() => {
    mockDb = createMockDatabaseService();
  });

  // ── keyword mode ─────────────────────────────────────────────────────

  it('search with mode=keyword returns standard sections without semantic', async () => {
    const svc = new (SearchService as any)(mockDb, undefined);

    const result: WunderlandSearchResponseWithSemantic = await svc.search('test', {
      mode: 'keyword',
    });

    assert.equal(result.mode, 'keyword');
    assert.equal(result.query, 'test');
    assert.ok(Array.isArray(result.agents.items));
    assert.ok(Array.isArray(result.posts.items));
    assert.ok(Array.isArray(result.comments.items));
    assert.ok(Array.isArray(result.jobs.items));
    assert.ok(Array.isArray(result.stimuli.items));
    // No semantic section in keyword mode
    assert.equal(result.semantic, undefined);
  });

  // ── semantic mode ────────────────────────────────────────────────────

  it('search with mode=semantic returns semantic section when vectorMemory available', async () => {
    const mockVector = createMockVectorMemory([
      { content: 'hello world', relevanceScore: 0.95, metadata: { seedId: 's1' } },
      { content: 'second chunk', relevanceScore: 0.8, metadata: { postId: 'p1' } },
    ]);
    const svc = new (SearchService as any)(mockDb, mockVector);

    const result: WunderlandSearchResponseWithSemantic = await svc.search('hello', {
      mode: 'semantic',
    });

    assert.equal(result.mode, 'semantic');
    assert.ok(result.semantic, 'should include semantic section');
    assert.equal(result.semantic!.items.length, 2);
    assert.equal(result.semantic!.items[0].score, 0.95);
    assert.equal(result.semantic!.items[0].seedId, 's1');
    assert.equal(result.semantic!.items[1].postId, 'p1');

    // keyword sections should be empty (mode=semantic skips keyword)
    assert.equal(result.agents.items.length, 0);
    assert.equal(result.posts.items.length, 0);
  });

  // ── hybrid mode ──────────────────────────────────────────────────────

  it('search with mode=hybrid returns both keyword + semantic', async () => {
    const mockVector = createMockVectorMemory([
      { content: 'semantic result', relevanceScore: 0.7 },
    ]);
    const svc = new (SearchService as any)(mockDb, mockVector);

    const result: WunderlandSearchResponseWithSemantic = await svc.search('test', {
      mode: 'hybrid',
    });

    assert.equal(result.mode, 'hybrid');
    // keyword sections exist (even if empty from mock)
    assert.ok(Array.isArray(result.agents.items));
    // semantic section exists
    assert.ok(result.semantic);
    assert.equal(result.semantic!.items.length, 1);
  });

  // ── semantic mode gracefully degrades ────────────────────────────────

  it('search with mode=semantic gracefully handles vectorMemory not available', async () => {
    // No vectorMemory injected (undefined)
    const svc = new (SearchService as any)(mockDb, undefined);

    const result: WunderlandSearchResponseWithSemantic = await svc.search('test', {
      mode: 'semantic',
    });

    assert.equal(result.mode, 'semantic');
    // No semantic section when vectorMemory is undefined
    assert.equal(result.semantic, undefined);
  });

  it('search with mode=semantic gracefully handles vectorMemory errors', async () => {
    const brokenVector = {
      querySeedMemory: async () => {
        throw new Error('Vector store offline');
      },
    };
    const svc = new (SearchService as any)(mockDb, brokenVector);

    const result: WunderlandSearchResponseWithSemantic = await svc.search('test', {
      mode: 'semantic',
    });

    assert.equal(result.mode, 'semantic');
    // Semantic section should be present but empty (graceful fallback)
    assert.ok(result.semantic);
    assert.equal(result.semantic!.items.length, 0);
  });

  // ── empty query ──────────────────────────────────────────────────────

  it('returns empty results for empty query', async () => {
    const svc = new (SearchService as any)(mockDb, undefined);

    const result: WunderlandSearchResponseWithSemantic = await svc.search('');

    assert.equal(result.query, '');
    assert.equal(result.agents.total, 0);
    assert.equal(result.posts.total, 0);
  });
});
