import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createAgentOSRagRouter } from '@framers/agentos-ext-http-api';
import { ragService } from '../integrations/agentos/agentos.rag.service.js';

test('RAG HTTP ingest + multi-query query works end-to-end (no embeddings)', async () => {
  await ragService.shutdown();

  // Force an in-memory SQLite database for deterministic tests.
  process.env.RAG_DATABASE_PATH = '';
  process.env.RAG_STORAGE_PRIORITY = 'sqljs';
  process.env.AGENTOS_RAG_VECTOR_PROVIDER = 'sql';

  // Avoid any real network calls in this integration test.
  process.env.OPENAI_API_KEY = '';
  process.env.OPENROUTER_API_KEY = '';
  process.env.OLLAMA_ENABLED = 'false';
  process.env.OLLAMA_BASE_URL = '';
  process.env.OLLAMA_HOST = '';

  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use(
    '/api/agentos/rag',
    createAgentOSRagRouter({
      isEnabled: () => true,
      ragService: ragService as any,
    })
  );

  const server = app.listen(0);
  const address = server.address();
  const port =
    typeof address === 'object' && address && 'port' in address ? (address as any).port : null;
  assert.equal(typeof port, 'number');

  try {
    const baseUrl = `http://127.0.0.1:${port}`;

    const docA = `http_mq_a_${Date.now()}`;
    const docB = `http_mq_b_${Date.now()}`;

    const ingestA = await fetch(`${baseUrl}/api/agentos/rag/ingest`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        documentId: docA,
        collectionId: 'default',
        category: 'knowledge_base',
        content: 'alpha beta gamma',
        chunkingOptions: { chunkSize: 5000, chunkOverlap: 0 },
      }),
    });
    assert.equal(ingestA.status, 201);
    const ingestAJson = (await ingestA.json()) as any;
    assert.equal(ingestAJson.success, true);
    assert.equal(ingestAJson.documentId, docA);

    const ingestB = await fetch(`${baseUrl}/api/agentos/rag/ingest`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        documentId: docB,
        collectionId: 'default',
        category: 'knowledge_base',
        content: 'delta epsilon',
        chunkingOptions: { chunkSize: 5000, chunkOverlap: 0 },
      }),
    });
    assert.equal(ingestB.status, 201);
    const ingestBJson = (await ingestB.json()) as any;
    assert.equal(ingestBJson.success, true);
    assert.equal(ingestBJson.documentId, docB);

    const query = await fetch(`${baseUrl}/api/agentos/rag/query`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: 'alpha beta gamma',
        queryVariants: ['delta epsilon'],
        collectionIds: ['default'],
        topK: 10,
        includeMetadata: false,
      }),
    });
    assert.equal(query.status, 200);
    const queryJson = (await query.json()) as any;
    assert.equal(queryJson.success, true);
    const docIds = new Set((queryJson.chunks ?? []).map((c: any) => c.documentId));
    assert.ok(docIds.has(docA), 'expected results to include base-query doc');
    assert.ok(docIds.has(docB), 'expected results to include query-variant doc');
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await ragService.shutdown();
  }
});
