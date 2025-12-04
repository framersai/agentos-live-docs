/**
 * @file agentos.rag.service.ts
 * @description RAG (Retrieval Augmented Generation) service for AgentOS backend.
 * Uses `@framers/sql-storage-adapter` for cross-platform persistent storage with
 * intelligent fallback (better-sqlite3 → IndexedDB → sql.js).
 *
 * @module AgentOSRagService
 * @version 2.0.0 - Refactored to use sql-storage-adapter properly
 * 
 * @remarks
 * This service provides document ingestion, retrieval, and memory management
 * using SQL storage with automatic platform detection and fallback.
 * 
 * Architecture:
 * ```
 * Backend API Routes
 *         ↓
 *    ragService (this file)
 *         ↓
 *   sql-storage-adapter
 *         ↓
 *   SQLite / PostgreSQL / IndexedDB
 * ```
 */

import {
  resolveStorageAdapter,
  type StorageAdapter,
  type StorageResolutionOptions,
} from '@framers/sql-storage-adapter';

// ============================================================================
// Types
// ============================================================================

/**
 * Document to ingest into RAG memory.
 */
export interface RagDocumentInput {
  /** Unique identifier (auto-generated if not provided) */
  documentId?: string;
  /** Text content to ingest */
  content: string;
  /** Collection to store in */
  collectionId?: string;
  /** Memory category */
  category?: 'conversation_memory' | 'knowledge_base' | 'user_notes' | 'system' | 'custom';
  /** Document metadata */
  metadata?: {
    agentId?: string;
    userId?: string;
    type?: string;
    tags?: string[];
    source?: string;
    title?: string;
    [key: string]: unknown;
  };
  /** Chunking options */
  chunkingOptions?: {
    chunkSize?: number;
    chunkOverlap?: number;
    strategy?: 'fixed' | 'semantic' | 'sentence';
  };
}

/**
 * Result of document ingestion.
 */
export interface RagIngestionResult {
  success: boolean;
  documentId: string;
  collectionId: string;
  chunksCreated: number;
  error?: string;
}

/**
 * Query options for RAG retrieval.
 */
export interface RagQueryOptions {
  /** Query text */
  query: string;
  /** Collections to search */
  collectionIds?: string[];
  /** Maximum chunks to return */
  topK?: number;
  /** Minimum similarity threshold */
  similarityThreshold?: number;
  /** Metadata filters */
  filters?: {
    agentId?: string;
    userId?: string;
    category?: string;
    tags?: string[];
    [key: string]: unknown;
  };
  /** Include metadata in results */
  includeMetadata?: boolean;
}

/**
 * A retrieved chunk from RAG memory.
 */
export interface RagRetrievedChunk {
  chunkId: string;
  documentId: string;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}

/**
 * Result of RAG query.
 */
export interface RagQueryResult {
  success: boolean;
  query: string;
  chunks: RagRetrievedChunk[];
  totalResults: number;
  processingTimeMs: number;
}

/**
 * RAG memory statistics.
 */
export interface RagMemoryStats {
  totalDocuments: number;
  totalChunks: number;
  collections: Array<{
    collectionId: string;
    documentCount: number;
    chunkCount: number;
  }>;
  storageUsedBytes?: number;
  lastIngestionAt?: string;
}

/**
 * Collection info.
 */
export interface RagCollection {
  collectionId: string;
  displayName: string;
  documentCount: number;
  chunkCount: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Document summary.
 */
export interface RagDocumentSummary {
  documentId: string;
  collectionId: string;
  category: string;
  chunkCount: number;
  metadata: Record<string, unknown>;
  createdAt: number;
}

// ============================================================================
// Database Row Types
// ============================================================================

interface CollectionRow {
  collection_id: string;
  display_name: string;
  document_count: number;
  chunk_count: number;
  created_at: number;
  updated_at: number;
}

interface DocumentRow {
  document_id: string;
  collection_id: string;
  category: string;
  content: string;
  metadata_json: string | null;
  created_at: number;
  updated_at: number;
}

interface ChunkRow {
  chunk_id: string;
  document_id: string;
  collection_id: string;
  content: string;
  chunk_index: number;
  metadata_json: string | null;
  created_at: number;
}

// ============================================================================
// SQL RAG Store Implementation
// ============================================================================

/**
 * SQL-backed RAG store using sql-storage-adapter.
 * Provides persistent storage with automatic platform fallback.
 */
class SqlRagStore {
  private adapter: StorageAdapter | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private tablePrefix = 'rag_';

  /**
   * Initialize the storage adapter and create schema.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this._doInitialize();
    return this.initPromise;
  }

  private async _doInitialize(): Promise<void> {
    try {
      // Resolve storage adapter with intelligent fallback
      const options: StorageResolutionOptions = {
        filePath: process.env.RAG_DATABASE_PATH || './data/rag_store.db',
        priority: process.env.RAG_STORAGE_PRIORITY
          ? (process.env.RAG_STORAGE_PRIORITY.split(',') as any[])
          : undefined,
        postgres: process.env.RAG_DATABASE_URL
          ? { connectionString: process.env.RAG_DATABASE_URL }
          : undefined,
      };

      console.log('[RAG Service] Resolving storage adapter...', {
        filePath: options.filePath,
        hasPostgres: !!options.postgres,
      });

      this.adapter = await resolveStorageAdapter(options);
      
      // Create schema
      await this.createSchema();
      
      this.initialized = true;
      console.log(`[RAG Service] Initialized with adapter: ${this.adapter.kind}`);
    } catch (error) {
      console.error('[RAG Service] Initialization failed:', error);
      this.initPromise = null;
      throw error;
    }
  }

  /**
   * Create database schema for RAG storage.
   */
  private async createSchema(): Promise<void> {
    if (!this.adapter) throw new Error('Adapter not initialized');

    // Collections table
    await this.adapter.exec(`
      CREATE TABLE IF NOT EXISTS ${this.tablePrefix}collections (
        collection_id TEXT PRIMARY KEY,
        display_name TEXT NOT NULL,
        document_count INTEGER NOT NULL DEFAULT 0,
        chunk_count INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    // Documents table
    await this.adapter.exec(`
      CREATE TABLE IF NOT EXISTS ${this.tablePrefix}documents (
        document_id TEXT PRIMARY KEY,
        collection_id TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'knowledge_base',
        content TEXT NOT NULL,
        metadata_json TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (collection_id) REFERENCES ${this.tablePrefix}collections(collection_id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_${this.tablePrefix}docs_collection 
        ON ${this.tablePrefix}documents(collection_id);
      
      CREATE INDEX IF NOT EXISTS idx_${this.tablePrefix}docs_category 
        ON ${this.tablePrefix}documents(category);
    `);

    // Chunks table - stores chunked content for retrieval
    await this.adapter.exec(`
      CREATE TABLE IF NOT EXISTS ${this.tablePrefix}chunks (
        chunk_id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        collection_id TEXT NOT NULL,
        content TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        metadata_json TEXT,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (document_id) REFERENCES ${this.tablePrefix}documents(document_id) ON DELETE CASCADE,
        FOREIGN KEY (collection_id) REFERENCES ${this.tablePrefix}collections(collection_id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_${this.tablePrefix}chunks_document 
        ON ${this.tablePrefix}chunks(document_id);
      
      CREATE INDEX IF NOT EXISTS idx_${this.tablePrefix}chunks_collection 
        ON ${this.tablePrefix}chunks(collection_id);
    `);

    // Try to create FTS5 index for full-text search (SQLite only)
    try {
      await this.adapter.exec(`
        CREATE VIRTUAL TABLE IF NOT EXISTS ${this.tablePrefix}chunks_fts 
        USING fts5(
          chunk_id,
          content,
          content='${this.tablePrefix}chunks',
          content_rowid='rowid'
        );
      `);
      console.log('[RAG Service] FTS5 full-text search enabled');
    } catch {
      console.log('[RAG Service] FTS5 not available, using keyword matching');
    }
  }

  /**
   * Ensure adapter is initialized.
   */
  private async ensureInitialized(): Promise<StorageAdapter> {
    if (!this.initialized) {
      await this.initialize();
    }
    if (!this.adapter) {
      throw new Error('RAG storage adapter not initialized');
    }
    return this.adapter;
  }

  /**
   * Check if service is available.
   */
  isAvailable(): boolean {
    return this.initialized && this.adapter !== null;
  }

  /**
   * Get adapter kind for diagnostics.
   */
  getAdapterKind(): string {
    return this.adapter?.kind ?? 'not-initialized';
  }

  // ==========================================================================
  // Collection Operations
  // ==========================================================================

  /**
   * Create a collection if it doesn't exist.
   */
  async createCollection(collectionId: string, displayName?: string): Promise<void> {
    const adapter = await this.ensureInitialized();
    const now = Date.now();

    const existing = await adapter.get<CollectionRow>(
      `SELECT collection_id FROM ${this.tablePrefix}collections WHERE collection_id = ?`,
      [collectionId]
    );

    if (!existing) {
      await adapter.run(
        `INSERT INTO ${this.tablePrefix}collections 
         (collection_id, display_name, document_count, chunk_count, created_at, updated_at)
         VALUES (?, ?, 0, 0, ?, ?)`,
        [collectionId, displayName || collectionId, now, now]
      );
      console.log(`[RAG Service] Collection '${collectionId}' created`);
    }
  }

  /**
   * List all collections.
   */
  async listCollections(): Promise<RagCollection[]> {
    const adapter = await this.ensureInitialized();

    const rows = await adapter.all<CollectionRow>(
      `SELECT * FROM ${this.tablePrefix}collections ORDER BY updated_at DESC`
    );

    return rows.map(row => ({
      collectionId: row.collection_id,
      displayName: row.display_name,
      documentCount: row.document_count,
      chunkCount: row.chunk_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  /**
   * Delete a collection and all its documents.
   */
  async deleteCollection(collectionId: string): Promise<boolean> {
    const adapter = await this.ensureInitialized();

    // Delete chunks first
    await adapter.run(
      `DELETE FROM ${this.tablePrefix}chunks WHERE collection_id = ?`,
      [collectionId]
    );

    // Delete documents
    await adapter.run(
      `DELETE FROM ${this.tablePrefix}documents WHERE collection_id = ?`,
      [collectionId]
    );

    // Delete collection
    const result = await adapter.run(
      `DELETE FROM ${this.tablePrefix}collections WHERE collection_id = ?`,
      [collectionId]
    );

    return result.changes > 0;
  }

  // ==========================================================================
  // Document Operations
  // ==========================================================================

  /**
   * Ingest a document into RAG storage.
   */
  async ingestDocument(input: RagDocumentInput): Promise<RagIngestionResult> {
    const adapter = await this.ensureInitialized();
    const now = Date.now();

    const documentId = input.documentId || `doc_${now}_${Math.random().toString(36).slice(2, 10)}`;
    const collectionId = input.collectionId || 'default';
    const category = input.category || 'knowledge_base';

    try {
      // Ensure collection exists
      await this.createCollection(collectionId);

      // Chunk the content
      const chunkSize = input.chunkingOptions?.chunkSize || 512;
      const chunkOverlap = input.chunkingOptions?.chunkOverlap || 50;
      const chunks = this.chunkContent(input.content, chunkSize, chunkOverlap);

      // Use transaction for atomicity
      await adapter.transaction(async (trx) => {
        // Insert document
        await trx.run(
          `INSERT OR REPLACE INTO ${this.tablePrefix}documents 
           (document_id, collection_id, category, content, metadata_json, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            documentId,
            collectionId,
            category,
            input.content,
            input.metadata ? JSON.stringify(input.metadata) : null,
            now,
            now,
          ]
        );

        // Delete existing chunks for this document (in case of update)
        await trx.run(
          `DELETE FROM ${this.tablePrefix}chunks WHERE document_id = ?`,
          [documentId]
        );

        // Insert chunks
        for (let i = 0; i < chunks.length; i++) {
          const chunkId = `${documentId}_chunk_${i}`;
          await trx.run(
            `INSERT INTO ${this.tablePrefix}chunks 
             (chunk_id, document_id, collection_id, content, chunk_index, metadata_json, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              chunkId,
              documentId,
              collectionId,
              chunks[i],
              i,
              input.metadata ? JSON.stringify(input.metadata) : null,
              now,
            ]
          );
        }

        // Update collection counts
        await this.updateCollectionCounts(trx, collectionId);
      });

      console.log(`[RAG Service] Document '${documentId}' ingested with ${chunks.length} chunks`);

      return {
        success: true,
        documentId,
        collectionId,
        chunksCreated: chunks.length,
      };
    } catch (error: any) {
      console.error('[RAG Service] Ingestion failed:', error);
      return {
        success: false,
        documentId,
        collectionId,
        chunksCreated: 0,
        error: error.message,
      };
    }
  }

  /**
   * Update collection document and chunk counts.
   */
  private async updateCollectionCounts(adapter: StorageAdapter, collectionId: string): Promise<void> {
    const docCount = await adapter.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${this.tablePrefix}documents WHERE collection_id = ?`,
      [collectionId]
    );
    
    const chunkCount = await adapter.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${this.tablePrefix}chunks WHERE collection_id = ?`,
      [collectionId]
    );

    await adapter.run(
      `UPDATE ${this.tablePrefix}collections 
       SET document_count = ?, chunk_count = ?, updated_at = ?
       WHERE collection_id = ?`,
      [docCount?.count ?? 0, chunkCount?.count ?? 0, Date.now(), collectionId]
    );
  }

  /**
   * Query for relevant chunks.
   */
  async query(options: RagQueryOptions): Promise<RagQueryResult> {
    const adapter = await this.ensureInitialized();
    const startTime = Date.now();
    const topK = options.topK || 5;
    const threshold = options.similarityThreshold || 0;

    // Tokenize query for keyword matching
    const queryTerms = options.query
      .toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 2);

    // Build base query
    let sql = `SELECT * FROM ${this.tablePrefix}chunks WHERE 1=1`;
    const params: any[] = [];

    // Filter by collections
    if (options.collectionIds && options.collectionIds.length > 0) {
      const placeholders = options.collectionIds.map(() => '?').join(',');
      sql += ` AND collection_id IN (${placeholders})`;
      params.push(...options.collectionIds);
    }

    const rows = await adapter.all<ChunkRow>(sql, params);

    // Score and filter chunks
    const scoredChunks: Array<RagRetrievedChunk & { _score: number }> = [];

    for (const row of rows) {
      // Parse metadata
      const metadata = row.metadata_json ? JSON.parse(row.metadata_json) : {};

      // Apply metadata filters
      if (options.filters) {
        if (options.filters.agentId && metadata.agentId !== options.filters.agentId) continue;
        if (options.filters.userId && metadata.userId !== options.filters.userId) continue;
        if (options.filters.category) {
          // Get document category
          const doc = await adapter.get<DocumentRow>(
            `SELECT category FROM ${this.tablePrefix}documents WHERE document_id = ?`,
            [row.document_id]
          );
          if (doc?.category !== options.filters.category) continue;
        }
        if (options.filters.tags && options.filters.tags.length > 0) {
          const docTags = metadata.tags || [];
          if (!options.filters.tags.some(tag => docTags.includes(tag))) continue;
        }
      }

      // Compute relevance score using keyword matching
      const contentLower = row.content.toLowerCase();
      let matchCount = 0;
      for (const term of queryTerms) {
        if (contentLower.includes(term)) {
          matchCount++;
        }
      }
      const score = queryTerms.length > 0 ? matchCount / queryTerms.length : 0;

      // Apply threshold
      if (score < threshold) continue;

      scoredChunks.push({
        chunkId: row.chunk_id,
        documentId: row.document_id,
        content: row.content,
        score,
        _score: score,
        metadata: options.includeMetadata ? metadata : undefined,
      });
    }

    // Sort by score descending and take top K
    scoredChunks.sort((a, b) => b._score - a._score);
    const results = scoredChunks.slice(0, topK).map(({ _score, ...chunk }) => chunk);

    return {
      success: true,
      query: options.query,
      chunks: results,
      totalResults: scoredChunks.length,
      processingTimeMs: Date.now() - startTime,
    };
  }

  /**
   * Delete a document and its chunks.
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    const adapter = await this.ensureInitialized();

    // Get collection ID for count update
    const doc = await adapter.get<DocumentRow>(
      `SELECT collection_id FROM ${this.tablePrefix}documents WHERE document_id = ?`,
      [documentId]
    );

    if (!doc) return false;

    // Delete chunks
    await adapter.run(
      `DELETE FROM ${this.tablePrefix}chunks WHERE document_id = ?`,
      [documentId]
    );

    // Delete document
    const result = await adapter.run(
      `DELETE FROM ${this.tablePrefix}documents WHERE document_id = ?`,
      [documentId]
    );

    // Update collection counts
    await this.updateCollectionCounts(adapter, doc.collection_id);

    return result.changes > 0;
  }

  /**
   * List documents with optional filters.
   */
  async listDocuments(filters?: {
    collectionId?: string;
    agentId?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<RagDocumentSummary[]> {
    const adapter = await this.ensureInitialized();

    let sql = `
      SELECT d.*, 
             (SELECT COUNT(*) FROM ${this.tablePrefix}chunks c WHERE c.document_id = d.document_id) as chunk_count
      FROM ${this.tablePrefix}documents d
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.collectionId) {
      sql += ` AND d.collection_id = ?`;
      params.push(filters.collectionId);
    }

    sql += ` ORDER BY d.updated_at DESC`;

    if (filters?.limit) {
      sql += ` LIMIT ?`;
      params.push(filters.limit);
    }

    if (filters?.offset) {
      sql += ` OFFSET ?`;
      params.push(filters.offset);
    }

    const rows = await adapter.all<DocumentRow & { chunk_count: number }>(sql, params);

    // Apply metadata filters in application code
    return rows
      .map(row => {
        const metadata = row.metadata_json ? JSON.parse(row.metadata_json) : {};
        return {
          documentId: row.document_id,
          collectionId: row.collection_id,
          category: row.category,
          chunkCount: row.chunk_count,
          metadata,
          createdAt: row.created_at,
        };
      })
      .filter(doc => {
        if (filters?.agentId && doc.metadata.agentId !== filters.agentId) return false;
        if (filters?.userId && doc.metadata.userId !== filters.userId) return false;
        return true;
      });
  }

  /**
   * Get statistics.
   */
  async getStats(agentId?: string): Promise<RagMemoryStats> {
    const adapter = await this.ensureInitialized();

    // Get collection stats
    const collections = await adapter.all<CollectionRow>(
      `SELECT * FROM ${this.tablePrefix}collections`
    );

    let totalDocs = 0;
    let totalChunks = 0;

    const collectionStats = collections.map(c => {
      totalDocs += c.document_count;
      totalChunks += c.chunk_count;
      return {
        collectionId: c.collection_id,
        documentCount: c.document_count,
        chunkCount: c.chunk_count,
      };
    });

    // If filtering by agent, recompute
    if (agentId) {
      const agentDocs = await adapter.all<{ collection_id: string; doc_count: number; chunk_count: number }>(
        `SELECT d.collection_id, 
                COUNT(DISTINCT d.document_id) as doc_count,
                (SELECT COUNT(*) FROM ${this.tablePrefix}chunks c WHERE c.document_id = d.document_id) as chunk_count
         FROM ${this.tablePrefix}documents d
         WHERE json_extract(d.metadata_json, '$.agentId') = ?
         GROUP BY d.collection_id`,
        [agentId]
      );

      totalDocs = agentDocs.reduce((sum, d) => sum + d.doc_count, 0);
      totalChunks = agentDocs.reduce((sum, d) => sum + d.chunk_count, 0);
    }

    return {
      totalDocuments: totalDocs,
      totalChunks,
      collections: collectionStats,
    };
  }

  /**
   * Chunk content into smaller pieces.
   */
  private chunkContent(content: string, chunkSize: number, overlap: number): string[] {
    const chunks: string[] = [];
    
    // Split by paragraphs first
    const paragraphs = content.split(/\n\n+/);
    
    let currentChunk = '';
    
    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) continue;

      if (currentChunk.length + trimmed.length <= chunkSize) {
        currentChunk += (currentChunk ? '\n\n' : '') + trimmed;
      } else {
        // Save current chunk if not empty
        if (currentChunk) {
          chunks.push(currentChunk);
        }
        
        // If paragraph is larger than chunk size, split by sentences
        if (trimmed.length > chunkSize) {
          const sentences = trimmed.split(/(?<=[.!?])\s+/);
          currentChunk = '';
          
          for (const sentence of sentences) {
            if (currentChunk.length + sentence.length <= chunkSize) {
              currentChunk += (currentChunk ? ' ' : '') + sentence;
            } else {
              if (currentChunk) chunks.push(currentChunk);
              
              // If single sentence is too long, split by words
              if (sentence.length > chunkSize) {
                const words = sentence.split(/\s+/);
                currentChunk = '';
                for (const word of words) {
                  if (currentChunk.length + word.length <= chunkSize) {
                    currentChunk += (currentChunk ? ' ' : '') + word;
                  } else {
                    if (currentChunk) chunks.push(currentChunk);
                    currentChunk = word;
                  }
                }
              } else {
                currentChunk = sentence;
              }
            }
          }
        } else {
          currentChunk = trimmed;
        }
      }
    }
    
    // Don't forget the last chunk
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [content];
  }

  /**
   * Shutdown and cleanup.
   */
  async shutdown(): Promise<void> {
    if (this.adapter) {
      await this.adapter.close();
      this.adapter = null;
      this.initialized = false;
      this.initPromise = null;
      console.log('[RAG Service] Shut down');
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

const ragStore = new SqlRagStore();

// ============================================================================
// Public API
// ============================================================================

/**
 * RAG Service - Main interface for RAG operations.
 * 
 * Uses `@framers/sql-storage-adapter` for cross-platform persistent storage
 * with intelligent fallback (better-sqlite3 → IndexedDB → sql.js).
 * 
 * @example
 * ```typescript
 * // Initialize happens automatically on first use
 * 
 * // Ingest a document
 * const result = await ragService.ingestDocument({
 *   content: 'Important information...',
 *   collectionId: 'agent-123',
 *   metadata: { agentId: '123', userId: 'user-456' }
 * });
 * 
 * // Query for relevant context
 * const context = await ragService.query({
 *   query: 'What is the important information?',
 *   topK: 5
 * });
 * ```
 */
export const ragService = {
  /**
   * Initialize the RAG service.
   * Called automatically on first use, but can be called explicitly for eager init.
   */
  async initialize(): Promise<void> {
    return ragStore.initialize();
  },

  /**
   * Check if RAG services are available.
   */
  isAvailable(): boolean {
    return ragStore.isAvailable();
  },

  /**
   * Get the storage adapter kind (for diagnostics).
   */
  getAdapterKind(): string {
    return ragStore.getAdapterKind();
  },

  /**
   * Ingest a document into RAG memory.
   */
  async ingestDocument(input: RagDocumentInput): Promise<RagIngestionResult> {
    return ragStore.ingestDocument(input);
  },

  /**
   * Query RAG memory for relevant context.
   */
  async query(options: RagQueryOptions): Promise<RagQueryResult> {
    return ragStore.query(options);
  },

  /**
   * Delete a document from RAG memory.
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    return ragStore.deleteDocument(documentId);
  },

  /**
   * Get RAG memory statistics.
   */
  async getStats(agentId?: string): Promise<RagMemoryStats> {
    return ragStore.getStats(agentId);
  },

  /**
   * List documents in RAG memory.
   */
  async listDocuments(filters?: {
    collectionId?: string;
    agentId?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<RagDocumentSummary[]> {
    return ragStore.listDocuments(filters);
  },

  /**
   * Create a collection.
   */
  async createCollection(collectionId: string, displayName?: string): Promise<void> {
    return ragStore.createCollection(collectionId, displayName);
  },

  /**
   * List all collections.
   */
  async listCollections(): Promise<RagCollection[]> {
    return ragStore.listCollections();
  },

  /**
   * Delete a collection.
   */
  async deleteCollection(collectionId: string): Promise<boolean> {
    return ragStore.deleteCollection(collectionId);
  },

  /**
   * Ingest knowledge document for an agent.
   * Convenience method that sets appropriate collection and metadata.
   */
  async ingestAgentKnowledge(
    agentId: string,
    userId: string,
    knowledgeId: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<RagIngestionResult> {
    return this.ingestDocument({
      documentId: `knowledge_${knowledgeId}`,
      content,
      collectionId: `agent-${agentId}`,
      category: 'knowledge_base',
      metadata: {
        ...metadata,
        agentId,
        userId,
        knowledgeId,
        source: 'user_upload',
      },
    });
  },

  /**
   * Delete knowledge document from RAG for an agent.
   */
  async deleteAgentKnowledge(knowledgeId: string): Promise<boolean> {
    return this.deleteDocument(`knowledge_${knowledgeId}`);
  },

  /**
   * Shutdown the RAG service.
   */
  async shutdown(): Promise<void> {
    return ragStore.shutdown();
  },
};

export default ragService;
