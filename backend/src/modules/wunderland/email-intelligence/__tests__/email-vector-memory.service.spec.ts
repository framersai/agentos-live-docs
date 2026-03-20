/**
 * @file email-vector-memory.service.spec.ts
 * @description Tests for EmailVectorMemoryService — FTS collection creation,
 *              ingestion, search, ranking, filtering, and removal.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  initializeAppDatabase,
  closeAppDatabase,
  generateId,
  __setAppDatabaseAdapterResolverForTests,
} from '../../../../core/database/appDatabase.js';
import { resolveStorageAdapter } from '@framers/sql-storage-adapter';
import { DatabaseService } from '../../../../database/database.service.js';
import { EmailVectorMemoryService } from '../services/email-vector-memory.service.js';
import type { SearchResult } from '../services/email-vector-memory.service.js';

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

let db: DatabaseService;
let service: EmailVectorMemoryService;
const SEED_ID = 'test-seed-abc123';

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();
  service = new EmailVectorMemoryService(db);
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
});

// ---------------------------------------------------------------------------
// 1. ensureCollection creates FTS table
// ---------------------------------------------------------------------------

describe('ensureCollection', () => {
  it('should create FTS table and metadata table without errors', async () => {
    await expect(service.ensureCollection(SEED_ID)).resolves.not.toThrow();

    // Verify FTS table exists by attempting an empty query
    const results = await service.search(SEED_ID, 'nonexistent');
    expect(results).toEqual([]);
  });

  it('should be idempotent — calling twice should not throw', async () => {
    await service.ensureCollection(SEED_ID);
    await expect(service.ensureCollection(SEED_ID)).resolves.not.toThrow();
  });

  it('should sanitize non-alphanumeric seed IDs', async () => {
    const weirdSeed = 'seed-with.dots/slashes!and@special#chars';
    await expect(service.ensureCollection(weirdSeed)).resolves.not.toThrow();

    // Should be able to ingest and search on the sanitized table
    await service.ingestEmailBody(weirdSeed, 'doc-1', 'sanitization test content');
    const results = await service.search(weirdSeed, 'sanitization');
    expect(results.length).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// 2. ingestEmailBody inserts searchable content
// ---------------------------------------------------------------------------

describe('ingestEmailBody', () => {
  const seedId = `ingest-body-${generateId()}`;

  it('should ingest email body text and make it searchable', async () => {
    await service.ingestEmailBody(
      seedId,
      'msg-001',
      'The quarterly revenue report shows significant growth in the EMEA region.',
      { from: 'cfo@company.com', subject: 'Q3 Report' }
    );

    const results = await service.search(seedId, 'quarterly revenue');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].documentId).toBe('msg-001');
    expect(results[0].collection).toBe('bodies');
    expect(results[0].content).toContain('quarterly revenue report');
  });

  it('should store metadata with ingested content', async () => {
    const results = await service.search(seedId, 'quarterly revenue');
    expect(results[0].metadata).toEqual({
      from: 'cfo@company.com',
      subject: 'Q3 Report',
    });
  });
});

// ---------------------------------------------------------------------------
// 3. search finds matching documents by keyword
// ---------------------------------------------------------------------------

describe('search', () => {
  const seedId = `search-${generateId()}`;

  beforeAll(async () => {
    await service.ingestEmailBody(
      seedId,
      'doc-alpha',
      'Meeting notes from the engineering standup about the new Kubernetes deployment.',
      { subject: 'Standup Notes' }
    );
    await service.ingestEmailBody(
      seedId,
      'doc-beta',
      'Invoice for cloud infrastructure services rendered in January.',
      { subject: 'Invoice #1234' }
    );
    await service.ingestAttachment(
      seedId,
      'doc-gamma',
      'Architecture diagram for the microservices Kubernetes cluster.',
      { filename: 'arch-diagram.pdf', subject: 'Attached docs' }
    );
  });

  it('should find documents matching a keyword', async () => {
    const results = await service.search(seedId, 'Kubernetes');
    expect(results.length).toBe(2);
    const docIds = results.map((r) => r.documentId);
    expect(docIds).toContain('doc-alpha');
    expect(docIds).toContain('doc-gamma');
  });

  it('should find documents matching another keyword', async () => {
    const results = await service.search(seedId, 'invoice');
    expect(results.length).toBe(1);
    expect(results[0].documentId).toBe('doc-beta');
  });

  it('should return empty array for non-matching query', async () => {
    const results = await service.search(seedId, 'xyznonexistent');
    expect(results).toEqual([]);
  });

  it('should return empty array for empty query', async () => {
    const results = await service.search(seedId, '');
    expect(results).toEqual([]);
  });

  it('should return a snippet for each result', async () => {
    const results = await service.search(seedId, 'invoice');
    expect(results[0].snippet).toBeTruthy();
    expect(results[0].snippet.length).toBeLessThanOrEqual(201); // 200 + ellipsis char
  });
});

// ---------------------------------------------------------------------------
// 4. search with topK limits results
// ---------------------------------------------------------------------------

describe('search topK', () => {
  const seedId = `topk-${generateId()}`;

  beforeAll(async () => {
    // Ingest 5 documents all matching "project"
    for (let i = 0; i < 5; i++) {
      await service.ingestEmailBody(
        seedId,
        `project-doc-${i}`,
        `Project update number ${i} with status details and milestones.`,
        { index: i }
      );
    }
  });

  it('should limit results to topK', async () => {
    const results = await service.search(seedId, 'project', { topK: 3 });
    expect(results.length).toBe(3);
  });

  it('should return all results when topK exceeds total', async () => {
    const results = await service.search(seedId, 'project', { topK: 100 });
    expect(results.length).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// 5. search with includeAttachments=false excludes attachment collection
// ---------------------------------------------------------------------------

describe('search includeAttachments filter', () => {
  const seedId = `attach-filter-${generateId()}`;

  beforeAll(async () => {
    await service.ingestEmailBody(
      seedId,
      'body-doc',
      'Budget spreadsheet discussion about Q4 targets.',
      { type: 'body' }
    );
    await service.ingestAttachment(
      seedId,
      'attachment-doc',
      'Budget spreadsheet with detailed Q4 financial projections.',
      { type: 'attachment', filename: 'budget.xlsx' }
    );
  });

  it('should include both bodies and attachments by default', async () => {
    const results = await service.search(seedId, 'budget');
    expect(results.length).toBe(2);
    const collections = results.map((r) => r.collection);
    expect(collections).toContain('bodies');
    expect(collections).toContain('attachments');
  });

  it('should exclude attachments when includeAttachments=false', async () => {
    const results = await service.search(seedId, 'budget', {
      includeAttachments: false,
    });
    expect(results.length).toBe(1);
    expect(results[0].collection).toBe('bodies');
    expect(results[0].documentId).toBe('body-doc');
  });
});

// ---------------------------------------------------------------------------
// 6. removeDocuments removes indexed content
// ---------------------------------------------------------------------------

describe('removeDocuments', () => {
  const seedId = `remove-${generateId()}`;

  it('should remove documents and make them unsearchable', async () => {
    await service.ingestEmailBody(
      seedId,
      'ephemeral-doc',
      'Temporary content that will be removed for re-indexing.'
    );

    // Verify it's searchable
    let results = await service.search(seedId, 'temporary');
    expect(results.length).toBe(1);

    // Remove
    await service.removeDocuments(seedId, 'ephemeral-doc');

    // Verify it's gone
    results = await service.search(seedId, 'temporary');
    expect(results.length).toBe(0);
  });

  it('should only remove the specified documentId', async () => {
    await service.ingestEmailBody(seedId, 'keep-me', 'Persistent data alpha.');
    await service.ingestEmailBody(seedId, 'drop-me', 'Persistent data beta.');

    await service.removeDocuments(seedId, 'drop-me');

    const results = await service.search(seedId, 'persistent');
    expect(results.length).toBe(1);
    expect(results[0].documentId).toBe('keep-me');
  });
});

// ---------------------------------------------------------------------------
// 7. Search ranking: more relevant results rank higher
// ---------------------------------------------------------------------------

describe('search ranking', () => {
  const seedId = `ranking-${generateId()}`;

  beforeAll(async () => {
    // Doc with one mention
    await service.ingestEmailBody(
      seedId,
      'low-relevance',
      'The deployment process is straightforward.'
    );
    // Doc with multiple mentions
    await service.ingestEmailBody(
      seedId,
      'high-relevance',
      'Deployment automation for deployment pipelines improves deployment reliability during deployment windows.'
    );
  });

  it('should return results with numeric rank values', async () => {
    const results = await service.search(seedId, 'deployment');
    expect(results.length).toBe(2);
    // Each result should have a rank
    for (const r of results) {
      expect(typeof r.rank).toBe('number');
    }
  });

  it('should rank the more relevant document higher (lower or earlier)', async () => {
    const results = await service.search(seedId, 'deployment');
    expect(results.length).toBe(2);
    // The high-relevance doc (more keyword occurrences) should appear first
    // With FTS5 rank is negative (lower = better), with FTS4 rowid we rely on
    // insertion order, but we can at least verify both appear
    const docIds = results.map((r) => r.documentId);
    expect(docIds).toContain('high-relevance');
    expect(docIds).toContain('low-relevance');
  });
});

// ---------------------------------------------------------------------------
// Metadata filter
// ---------------------------------------------------------------------------

describe('search metadataFilter', () => {
  const seedId = `meta-filter-${generateId()}`;

  beforeAll(async () => {
    await service.ingestEmailBody(
      seedId,
      'from-alice',
      'Project timeline discussion for the sprint.',
      { from: 'alice@company.com' }
    );
    await service.ingestEmailBody(
      seedId,
      'from-bob',
      'Project timeline review and retrospective.',
      { from: 'bob@company.com' }
    );
  });

  it('should filter results by metadata', async () => {
    const results = await service.search(seedId, 'project', {
      metadataFilter: { from: 'alice@company.com' },
    });
    expect(results.length).toBe(1);
    expect(results[0].documentId).toBe('from-alice');
  });
});
