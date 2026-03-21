/**
 * @file email-vector-memory.service.ts
 * @description Per-agent email RAG search using SQLite full-text search.
 *
 * This service manages per-seed FTS collections for email body and attachment
 * text, enabling semantic search across ingested email content. It uses SQLite
 * FTS5 where available (better-sqlite3) and falls back to FTS4 (sql.js) for
 * broad compatibility.
 *
 * Each seed gets its own FTS virtual table plus a companion metadata table.
 * The `collection` column distinguishes 'bodies' from 'attachments' within a
 * single table.
 *
 * @module email-intelligence/services/email-vector-memory
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface SearchResult {
  documentId: string;
  content: string;
  snippet: string;
  rank: number;
  metadata: Record<string, any>;
  collection: 'bodies' | 'attachments';
}

export interface SearchOptions {
  topK?: number;
  includeAttachments?: boolean;
  metadataFilter?: Record<string, any>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Sanitize a seedId for use in SQL table names: only keep [a-zA-Z0-9_]. */
const sanitizeSeedId = (seedId: string): string => seedId.replace(/[^a-zA-Z0-9]/g, '_');

/**
 * Build a snippet from content — first `maxLen` characters with trailing
 * ellipsis if truncated.
 */
const buildSnippet = (content: string, maxLen = 200): string => {
  if (content.length <= maxLen) return content;
  return content.slice(0, maxLen) + '…';
};

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class EmailVectorMemoryService {
  private readonly logger = new Logger(EmailVectorMemoryService.name);

  /**
   * Track which FTS version we detected per seed (so we only probe once).
   * Values: 'fts5' | 'fts4' | 'none'
   */
  private readonly ftsVersionCache = new Map<string, 'fts5' | 'fts4'>();

  /** Track which seeds have had their tables created. */
  private readonly initializedSeeds = new Set<string>();

  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  // -----------------------------------------------------------------------
  // Collection management
  // -----------------------------------------------------------------------

  /**
   * Create the FTS virtual table and companion metadata table for a seed.
   * Idempotent — safe to call multiple times.
   */
  async ensureCollection(seedId: string): Promise<void> {
    if (this.initializedSeeds.has(seedId)) return;

    const safe = sanitizeSeedId(seedId);
    const ftsVersion = await this.detectFtsVersion(safe);
    this.ftsVersionCache.set(seedId, ftsVersion);

    const ftsTable = `email_fts_${safe}`;
    const metaTable = `email_fts_meta_${safe}`;

    // Create the FTS virtual table
    if (ftsVersion === 'fts5') {
      await this.db.exec(
        `CREATE VIRTUAL TABLE IF NOT EXISTS ${ftsTable} USING fts5(` +
          `document_id, content, collection, ` +
          `content_rowid=rowid` +
          `);`
      );
    } else {
      await this.db.exec(
        `CREATE VIRTUAL TABLE IF NOT EXISTS ${ftsTable} USING fts4(` +
          `document_id, content, collection` +
          `);`
      );
    }

    // Companion table for JSON metadata (FTS tables can't store arbitrary cols)
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS ${metaTable} (
        rowid INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT NOT NULL,
        collection TEXT NOT NULL DEFAULT 'bodies',
        metadata_json TEXT NOT NULL DEFAULT '{}',
        created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
      );
    `);
    await this.db.exec(
      `CREATE INDEX IF NOT EXISTS idx_${metaTable}_doc ON ${metaTable}(document_id);`
    );

    this.initializedSeeds.add(seedId);
    this.logger.debug(`Ensured FTS collection for seed ${seedId} (${ftsVersion})`);
  }

  // -----------------------------------------------------------------------
  // Ingest
  // -----------------------------------------------------------------------

  /**
   * Ingest email body text for full-text search.
   */
  async ingestEmailBody(
    seedId: string,
    documentId: string,
    content: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    await this.ingest(seedId, documentId, content, 'bodies', metadata);
  }

  /**
   * Ingest attachment text for full-text search.
   */
  async ingestAttachment(
    seedId: string,
    documentId: string,
    content: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    await this.ingest(seedId, documentId, content, 'attachments', metadata);
  }

  // -----------------------------------------------------------------------
  // Search
  // -----------------------------------------------------------------------

  /**
   * Full-text search across indexed email content for a seed.
   *
   * @param seedId   Agent seed ID
   * @param query    Search query string
   * @param options  topK, includeAttachments, metadataFilter
   */
  async search(
    seedId: string,
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    await this.ensureCollection(seedId);

    const { topK = 10, includeAttachments = true, metadataFilter } = options;
    const safe = sanitizeSeedId(seedId);
    const ftsTable = `email_fts_${safe}`;
    const metaTable = `email_fts_meta_${safe}`;
    const ftsVersion = this.ftsVersionCache.get(seedId) ?? 'fts4';

    // Build collection filter
    const collectionFilter = includeAttachments ? '' : `AND f.collection = 'bodies'`;

    // Sanitize query for FTS MATCH: escape double quotes, wrap in quotes for
    // phrase-like matching while still allowing OR/AND operators
    const safeQuery = this.sanitizeQuery(query);
    if (!safeQuery) return [];

    // FTS5 supports `rank` pseudo-column; FTS4 uses `matchinfo` but for
    // simplicity we use `rowid` ordering (earlier = lower rowid = higher rank
    // in FTS4) and use a synthetic rank.
    let rows: Array<{
      document_id: string;
      content: string;
      collection: string;
      metadata_json: string;
      rank_val: number;
    }>;

    if (ftsVersion === 'fts5') {
      rows = await this.db.all<any>(
        `SELECT f.document_id, f.content, f.collection,
                COALESCE(m.metadata_json, '{}') AS metadata_json,
                rank AS rank_val
         FROM ${ftsTable} f
         LEFT JOIN ${metaTable} m
           ON m.document_id = f.document_id AND m.collection = f.collection
         WHERE ${ftsTable} MATCH ?
         ${collectionFilter}
         ORDER BY rank
         LIMIT ?`,
        [safeQuery, topK]
      );
    } else {
      // FTS4: use MATCH but no built-in rank column.
      // We use rowid as a proxy; lower rowid ≈ earlier insertion.
      rows = await this.db.all<any>(
        `SELECT f.document_id, f.content, f.collection,
                COALESCE(m.metadata_json, '{}') AS metadata_json,
                f.rowid AS rank_val
         FROM ${ftsTable} f
         LEFT JOIN ${metaTable} m
           ON m.document_id = f.document_id AND m.collection = f.collection
         WHERE ${ftsTable} MATCH ?
         ${collectionFilter}
         ORDER BY f.rowid ASC
         LIMIT ?`,
        [safeQuery, topK]
      );
    }

    // Apply metadata filter in application code (FTS can't filter JSON)
    let results: SearchResult[] = rows.map((row, idx) => {
      let meta: Record<string, any> = {};
      try {
        meta = JSON.parse(row.metadata_json);
      } catch {
        /* ignore bad JSON */
      }
      return {
        documentId: row.document_id,
        content: row.content,
        snippet: buildSnippet(row.content),
        rank: ftsVersion === 'fts5' ? row.rank_val : idx + 1,
        metadata: meta,
        collection: row.collection as 'bodies' | 'attachments',
      };
    });

    // Apply metadata filter if provided
    if (metadataFilter && Object.keys(metadataFilter).length > 0) {
      results = results.filter((r) =>
        Object.entries(metadataFilter).every(([key, val]) => r.metadata[key] === val)
      );
    }

    return results.slice(0, topK);
  }

  // -----------------------------------------------------------------------
  // Remove
  // -----------------------------------------------------------------------

  /**
   * Remove all indexed documents for a given documentId (for re-indexing).
   */
  async removeDocuments(seedId: string, documentId: string): Promise<void> {
    await this.ensureCollection(seedId);

    const safe = sanitizeSeedId(seedId);
    const ftsTable = `email_fts_${safe}`;
    const metaTable = `email_fts_meta_${safe}`;

    await this.db.run(`DELETE FROM ${ftsTable} WHERE document_id = ?`, [documentId]);
    await this.db.run(`DELETE FROM ${metaTable} WHERE document_id = ?`, [documentId]);
  }

  // -----------------------------------------------------------------------
  // Private helpers
  // -----------------------------------------------------------------------

  private async ingest(
    seedId: string,
    documentId: string,
    content: string,
    collection: 'bodies' | 'attachments',
    metadata: Record<string, any>
  ): Promise<void> {
    await this.ensureCollection(seedId);

    const safe = sanitizeSeedId(seedId);
    const ftsTable = `email_fts_${safe}`;
    const metaTable = `email_fts_meta_${safe}`;

    // Insert into FTS table
    await this.db.run(
      `INSERT INTO ${ftsTable} (document_id, content, collection) VALUES (?, ?, ?)`,
      [documentId, content, collection]
    );

    // Insert metadata
    await this.db.run(
      `INSERT INTO ${metaTable} (document_id, collection, metadata_json) VALUES (?, ?, ?)`,
      [documentId, collection, JSON.stringify(metadata)]
    );
  }

  /**
   * Detect the best available FTS version for this database.
   * Tries FTS5 first, falls back to FTS4.
   */
  private async detectFtsVersion(safeSeedId: string): Promise<'fts5' | 'fts4'> {
    const probeTable = `_fts_probe_${safeSeedId}`;
    try {
      await this.db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS ${probeTable} USING fts5(x);`);
      await this.db.exec(`DROP TABLE IF EXISTS ${probeTable};`);
      return 'fts5';
    } catch {
      // FTS5 not available
    }
    try {
      await this.db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS ${probeTable} USING fts4(x);`);
      await this.db.exec(`DROP TABLE IF EXISTS ${probeTable};`);
      return 'fts4';
    } catch {
      // Should not happen — FTS4 is compiled into all modern SQLite builds
      throw new Error('Neither FTS5 nor FTS4 is available in the current SQLite build');
    }
  }

  /**
   * Sanitize a user query for FTS MATCH.
   * Splits into tokens and joins with spaces (implicit AND in FTS).
   * Returns empty string if no valid tokens remain.
   */
  private sanitizeQuery(query: string): string {
    // Remove characters that are special in FTS syntax
    const cleaned = query
      .replace(/['"*^(){}[\]\\:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleaned) return '';
    return cleaned;
  }
}
