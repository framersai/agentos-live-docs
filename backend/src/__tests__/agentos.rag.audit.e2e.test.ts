import test from 'node:test';
import assert from 'node:assert/strict';
import { createAgentOSRagRouter } from '@framers/agentos-ext-http-api';
import { ragService } from '../integrations/agentos/agentos.rag.service.js';

/* ── Helpers ─────────────────────────────────────────────────────────── */

function getHandler(router: any, method: string, path: string): any {
  const layer = (router?.stack ?? []).find(
    (l: any) => l?.route?.path === path && l?.route?.methods?.[method]
  );
  const handle = layer?.route?.stack?.[layer.route.stack.length - 1]?.handle;
  if (typeof handle !== 'function') {
    throw new Error(`${method.toUpperCase()} handler not found for route: ${path}`);
  }
  return handle;
}

function createMockRes() {
  const res: any = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

function createMockReq(body: any = {}, query: any = {}, params: any = {}): any {
  return { body, query, params };
}

/* ── Tests ───────────────────────────────────────────────────────────── */

test('RAG audit: query with includeAudit returns auditTrail', async () => {
  await ragService.shutdown();

  // Force in-memory SQLite for deterministic tests.
  process.env.RAG_DATABASE_PATH = '';
  process.env.RAG_STORAGE_PRIORITY = 'sqljs';
  process.env.AGENTOS_RAG_VECTOR_PROVIDER = 'sql';
  process.env.OPENAI_API_KEY = '';
  process.env.OPENROUTER_API_KEY = '';
  process.env.OLLAMA_ENABLED = 'false';
  process.env.OLLAMA_BASE_URL = '';
  process.env.OLLAMA_HOST = '';

  const router = createAgentOSRagRouter({
    isEnabled: () => true,
    ragService: ragService as any,
  });
  const ingestHandler = getHandler(router, 'post', '/ingest');
  const queryHandler = getHandler(router, 'post', '/query');

  try {
    // Ingest a document first.
    const docId = `audit_test_doc_${Date.now()}`;
    {
      const res = createMockRes();
      await ingestHandler(
        createMockReq({
          documentId: docId,
          collectionId: 'default',
          category: 'knowledge_base',
          content: 'RAG audit trail test document with unique content for retrieval.',
          chunkingOptions: { chunkSize: 5000, chunkOverlap: 0 },
        }),
        res,
        (err: any) => {
          if (err) throw err;
        }
      );
      assert.equal(res.statusCode, 201, 'ingest should return 201');
    }

    // Query with includeAudit: true.
    {
      const res = createMockRes();
      await queryHandler(
        createMockReq({
          query: 'RAG audit trail test',
          collectionIds: ['default'],
          topK: 5,
          includeAudit: true,
        }),
        res,
        (err: any) => {
          if (err) throw err;
        }
      );

      assert.equal(res.statusCode, 200, 'query should return 200');
      const json = res.body as any;
      assert.equal(json.success, true, 'query should succeed');

      // Audit trail should be present.
      assert.ok(json.auditTrail, 'auditTrail should be present when includeAudit: true');
      assert.ok(json.auditTrail.trailId, 'auditTrail should have a trailId');
      assert.ok(json.auditTrail.requestId, 'auditTrail should have a requestId');
      assert.equal(json.auditTrail.query, 'RAG audit trail test');
      assert.ok(json.auditTrail.timestamp, 'auditTrail should have a timestamp');

      // Summary should have aggregated values.
      const summary = json.auditTrail.summary;
      assert.ok(summary, 'auditTrail should have summary');
      assert.ok(summary.totalOperations >= 1, 'should have at least 1 operation');
      assert.ok(summary.totalDurationMs >= 0, 'duration should be non-negative');
      assert.ok(Array.isArray(summary.operationTypes), 'operationTypes should be an array');

      // Operations array should have entries.
      assert.ok(Array.isArray(json.auditTrail.operations), 'operations should be an array');
      assert.ok(json.auditTrail.operations.length >= 1, 'should have at least 1 operation');

      // Each operation should have the required fields.
      for (const op of json.auditTrail.operations) {
        assert.ok(op.operationId, 'operation should have operationId');
        assert.ok(op.operationType, 'operation should have operationType');
        assert.ok(op.startedAt, 'operation should have startedAt');
        assert.ok(typeof op.durationMs === 'number', 'operation should have numeric durationMs');
        assert.ok(Array.isArray(op.sources), 'operation should have sources array');
        assert.ok(op.tokenUsage, 'operation should have tokenUsage');
      }
    }

    // Query without includeAudit — auditTrail should NOT be present.
    {
      const res = createMockRes();
      await queryHandler(
        createMockReq({
          query: 'RAG audit trail test',
          collectionIds: ['default'],
          topK: 5,
        }),
        res,
        (err: any) => {
          if (err) throw err;
        }
      );

      assert.equal(res.statusCode, 200);
      const json = res.body as any;
      assert.equal(json.auditTrail, undefined, 'auditTrail should be absent when not requested');
    }
  } finally {
    await ragService.shutdown();
  }
});

test('RAG audit: GET /audit and /audit/:trailId routes', async () => {
  await ragService.shutdown();

  process.env.RAG_DATABASE_PATH = '';
  process.env.RAG_STORAGE_PRIORITY = 'sqljs';
  process.env.AGENTOS_RAG_VECTOR_PROVIDER = 'sql';
  process.env.OPENAI_API_KEY = '';
  process.env.OPENROUTER_API_KEY = '';
  process.env.OLLAMA_ENABLED = 'false';
  process.env.OLLAMA_BASE_URL = '';
  process.env.OLLAMA_HOST = '';

  const router = createAgentOSRagRouter({
    isEnabled: () => true,
    ragService: ragService as any,
  });
  const ingestHandler = getHandler(router, 'post', '/ingest');
  const queryHandler = getHandler(router, 'post', '/query');
  const auditListHandler = getHandler(router, 'get', '/audit');
  const auditDetailHandler = getHandler(router, 'get', '/audit/:trailId');

  try {
    // Ingest + query with audit to generate a trail.
    const docId = `audit_route_test_${Date.now()}`;
    {
      const res = createMockRes();
      await ingestHandler(
        createMockReq({
          documentId: docId,
          collectionId: 'default',
          content: 'Document for audit route testing.',
          chunkingOptions: { chunkSize: 5000, chunkOverlap: 0 },
        }),
        res,
        (err: any) => {
          if (err) throw err;
        }
      );
      assert.equal(res.statusCode, 201);
    }

    // Query with audit to persist a trail.
    let trailId: string | undefined;
    {
      const res = createMockRes();
      await queryHandler(
        createMockReq({
          query: 'audit route test',
          collectionIds: ['default'],
          topK: 5,
          includeAudit: true,
        }),
        res,
        (err: any) => {
          if (err) throw err;
        }
      );
      assert.equal(res.statusCode, 200);
      trailId = (res.body as any)?.auditTrail?.trailId;
      assert.ok(trailId, 'should get a trailId from the query');
    }

    // GET /audit — list trails.
    {
      const res = createMockRes();
      await auditListHandler(createMockReq({}, { limit: '50' }), res, (err: any) => {
        if (err) throw err;
      });
      assert.equal(res.statusCode, 200);
      const json = res.body as any;
      assert.equal(json.success, true);
      assert.ok(Array.isArray(json.trails), 'trails should be an array');
      // Should contain at least the trail we just created.
      const found = json.trails.find((t: any) => t.trailId === trailId);
      assert.ok(found, 'should find the trail we created');
    }

    // GET /audit/:trailId — single trail.
    {
      const res = createMockRes();
      await auditDetailHandler(createMockReq({}, {}, { trailId: trailId! }), res, (err: any) => {
        if (err) throw err;
      });
      assert.equal(res.statusCode, 200);
      const json = res.body as any;
      assert.equal(json.success, true);
      assert.ok(json.trail, 'should return the trail');
      assert.equal(json.trail.trailId, trailId);
    }

    // GET /audit/:trailId with non-existent ID — 404.
    {
      const res = createMockRes();
      await auditDetailHandler(
        createMockReq({}, {}, { trailId: 'nonexistent-trail' }),
        res,
        (err: any) => {
          if (err) throw err;
        }
      );
      assert.equal(res.statusCode, 404);
      const json = res.body as any;
      assert.equal(json.success, false);
    }
  } finally {
    await ragService.shutdown();
  }
});
