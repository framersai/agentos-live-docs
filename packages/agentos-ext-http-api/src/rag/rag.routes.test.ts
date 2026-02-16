import { describe, expect, it, vi } from 'vitest';
import express from 'express';
import { createAgentOSRagRouter } from './rag.routes.js';
import type { RagAuditTrailWire } from './rag.types.js';

/** Helper: spin up an express app with the RAG router and return a port + cleanup fn. */
function createTestServer(ragService: Record<string, any>, isEnabled = true) {
  const app = express();
  app.use(express.json());
  app.use(
    '/api/agentos/rag',
    createAgentOSRagRouter({ isEnabled: () => isEnabled, ragService: ragService as any })
  );

  const server = app.listen(0);
  const address = server.address();
  const port =
    typeof address === 'object' && address && 'port' in address ? (address as any).port : null;

  return {
    port: port as number,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}

/** Stub audit trail for tests. */
const STUB_AUDIT_TRAIL: RagAuditTrailWire = {
  trailId: 'trail-test-1',
  requestId: 'req-1',
  query: 'test query',
  timestamp: new Date().toISOString(),
  operations: [
    {
      operationId: 'op-1',
      operationType: 'embedding',
      startedAt: new Date().toISOString(),
      durationMs: 5,
      sources: [],
      tokenUsage: {
        embeddingTokens: 128,
        llmPromptTokens: 0,
        llmCompletionTokens: 0,
        totalTokens: 128,
      },
      costUSD: 0.0001,
      resultsCount: 1,
    },
  ],
  summary: {
    totalOperations: 1,
    totalLLMCalls: 0,
    totalEmbeddingCalls: 1,
    totalTokens: 128,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalEmbeddingTokens: 128,
    totalCostUSD: 0.0001,
    totalDurationMs: 5,
    operationTypes: ['embedding'],
    sourceSummary: { uniqueDocuments: 0, uniqueCollections: 0, uniqueDataSources: 0 },
  },
};

describe('createAgentOSRagRouter', () => {
  it('creates an Express router', () => {
    const router = createAgentOSRagRouter({
      isEnabled: () => false,
      ragService: {} as any,
    });

    expect(router).toBeTruthy();
    expect(typeof (router as any).use).toBe('function');
  });

  it('passes queryVariants and rewrite to ragService.query', async () => {
    const querySpy = vi.fn().mockResolvedValue({
      success: true,
      query: 'hello',
      chunks: [],
      totalResults: 0,
      processingTimeMs: 1,
    });

    const { port, close } = createTestServer({ query: querySpy });
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/agentos/rag/query`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          query: 'hello',
          queryVariants: ['hi', 'greetings'],
          rewrite: { enabled: true, maxVariants: 2 },
        }),
      });

      expect(response.status).toBe(200);
      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(querySpy.mock.calls[0]?.[0]).toMatchObject({
        query: 'hello',
        queryVariants: ['hi', 'greetings'],
        rewrite: { enabled: true, maxVariants: 2 },
      });
    } finally {
      await close();
    }
  });
});

describe('RAG audit trail routes', () => {
  it('passes includeAudit to ragService.query and returns auditTrail', async () => {
    const querySpy = vi.fn().mockResolvedValue({
      success: true,
      query: 'audit test',
      chunks: [],
      totalResults: 0,
      processingTimeMs: 2,
      auditTrail: STUB_AUDIT_TRAIL,
    });

    const { port, close } = createTestServer({ query: querySpy });
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/agentos/rag/query`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: 'audit test', includeAudit: true }),
      });

      expect(response.status).toBe(200);
      const json = (await response.json()) as any;
      expect(json.success).toBe(true);
      expect(json.auditTrail).toBeDefined();
      expect(json.auditTrail.trailId).toBe('trail-test-1');
      expect(json.auditTrail.summary.totalEmbeddingCalls).toBe(1);

      // Verify includeAudit was passed through
      expect(querySpy.mock.calls[0]?.[0]).toMatchObject({ includeAudit: true });
    } finally {
      await close();
    }
  });

  it('omits auditTrail from response when not requested', async () => {
    const querySpy = vi.fn().mockResolvedValue({
      success: true,
      query: 'no audit',
      chunks: [],
      totalResults: 0,
      processingTimeMs: 1,
    });

    const { port, close } = createTestServer({ query: querySpy });
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/agentos/rag/query`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: 'no audit' }),
      });

      expect(response.status).toBe(200);
      const json = (await response.json()) as any;
      expect(json.auditTrail).toBeUndefined();
    } finally {
      await close();
    }
  });

  it('GET /audit returns audit trails list', async () => {
    const getAuditTrails = vi.fn().mockResolvedValue([STUB_AUDIT_TRAIL]);
    const { port, close } = createTestServer({ getAuditTrails });
    try {
      const response = await fetch(
        `http://127.0.0.1:${port}/api/agentos/rag/audit?seedId=seed-1&limit=10`
      );

      expect(response.status).toBe(200);
      const json = (await response.json()) as any;
      expect(json.success).toBe(true);
      expect(json.trails).toHaveLength(1);
      expect(json.trails[0].trailId).toBe('trail-test-1');

      expect(getAuditTrails).toHaveBeenCalledWith(
        expect.objectContaining({ seedId: 'seed-1', limit: 10 })
      );
    } finally {
      await close();
    }
  });

  it('GET /audit uses default limit of 20', async () => {
    const getAuditTrails = vi.fn().mockResolvedValue([]);
    const { port, close } = createTestServer({ getAuditTrails });
    try {
      await fetch(`http://127.0.0.1:${port}/api/agentos/rag/audit`);
      expect(getAuditTrails).toHaveBeenCalledWith(expect.objectContaining({ limit: 20 }));
    } finally {
      await close();
    }
  });

  it('GET /audit/:trailId returns a single trail', async () => {
    const getAuditTrail = vi.fn().mockResolvedValue(STUB_AUDIT_TRAIL);
    const { port, close } = createTestServer({ getAuditTrail });
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/agentos/rag/audit/trail-test-1`);

      expect(response.status).toBe(200);
      const json = (await response.json()) as any;
      expect(json.success).toBe(true);
      expect(json.trail.trailId).toBe('trail-test-1');
      expect(getAuditTrail).toHaveBeenCalledWith('trail-test-1');
    } finally {
      await close();
    }
  });

  it('GET /audit/:trailId returns 404 when not found', async () => {
    const getAuditTrail = vi.fn().mockResolvedValue(null);
    const { port, close } = createTestServer({ getAuditTrail });
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/agentos/rag/audit/nonexistent`);

      expect(response.status).toBe(404);
      const json = (await response.json()) as any;
      expect(json.success).toBe(false);
    } finally {
      await close();
    }
  });

  it('GET /audit returns 503 when disabled', async () => {
    const getAuditTrails = vi.fn().mockResolvedValue([]);
    const { port, close } = createTestServer({ getAuditTrails }, false);
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/agentos/rag/audit`);
      expect(response.status).toBe(503);
      const json = (await response.json()) as any;
      expect(json.error).toBe('AGENTOS_DISABLED');
    } finally {
      await close();
    }
  });
});
