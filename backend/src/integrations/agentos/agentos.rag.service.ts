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
import { createHash } from 'node:crypto';
import { AIModelProviderManager } from '@framers/agentos/core/llm/providers/AIModelProviderManager';
import type { ProviderConfigEntry } from '@framers/agentos/core/llm/providers/AIModelProviderManager';
import type { ChatMessage } from '@framers/agentos/core/llm/providers/IProvider';
import { EmbeddingManager, QdrantVectorStore, SqlVectorStore } from '@framers/agentos/rag';
import type {
  IVectorStore,
  QdrantVectorStoreConfig,
  SqlVectorStoreConfig,
} from '@framers/agentos/rag';
import type { EmbeddingManagerConfig } from '@framers/agentos/config/EmbeddingManagerConfiguration';
import type { QueryOptions } from '@framers/agentos/rag/IVectorStore';
import type { RetrievedVectorDocument } from '@framers/agentos/rag/IVectorStore';
import {
  CohereReranker,
  LocalCrossEncoderReranker,
  RerankerService,
} from '@framers/agentos/rag/reranking';
import type { RerankerInput } from '@framers/agentos/rag/reranking';
import type {
  GraphRAGSearchOptions,
  GlobalSearchResult,
  IGraphRAGEngine,
  LocalSearchResult,
} from '@framers/agentos/rag/graphrag';
import { audioService } from '../../core/audio/audio.service.js';
import type { ISttOptions } from '../../core/audio/stt.interfaces.js';

type RagRetrievalPreset = 'fast' | 'balanced' | 'accurate';
type RagVectorProvider = 'sql' | 'qdrant';

const firstNonEmptyEnv = (...names: string[]): string | undefined => {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
};

const coerceOllamaBaseURL = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `http://${trimmed}`;
};

const parsePositiveIntEnv = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return parsed;
};

const coerceRagPreset = (value: string | undefined): RagRetrievalPreset | undefined => {
  const preset = value?.trim().toLowerCase();
  if (preset === 'fast' || preset === 'balanced' || preset === 'accurate') return preset;
  return undefined;
};

const coerceRagVectorProvider = (value: string | undefined): RagVectorProvider | undefined => {
  const provider = value?.trim().toLowerCase();
  if (provider === 'sql' || provider === 'qdrant') return provider;
  return undefined;
};

const parseBooleanEnv = (value: string | undefined): boolean | undefined => {
  if (!value) return undefined;
  const lowered = value.trim().toLowerCase();
  if (lowered === 'true' || lowered === '1' || lowered === 'yes' || lowered === 'y') return true;
  if (lowered === 'false' || lowered === '0' || lowered === 'no' || lowered === 'n') return false;
  return undefined;
};

const isMetadataScalar = (value: unknown): value is string | number | boolean =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

const sanitizeGraphRagMetadata = (
  metadata: Record<string, unknown> | undefined
): Record<string, any> | undefined => {
  if (!metadata) return undefined;
  const out: Record<string, any> = {};
  for (const [key, raw] of Object.entries(metadata)) {
    if (raw === null || raw === undefined) continue;
    if (isMetadataScalar(raw)) {
      out[key] = raw;
      continue;
    }
    if (Array.isArray(raw)) {
      const items: Array<string | number | boolean> = [];
      for (const item of raw) {
        if (item === null || item === undefined) continue;
        if (isMetadataScalar(item)) items.push(item);
        else items.push(JSON.stringify(item));
      }
      out[key] = items;
      continue;
    }
    out[key] = JSON.stringify(raw);
  }
  return Object.keys(out).length > 0 ? out : undefined;
};

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
 * Supported multimodal asset types for RAG indexing.
 */
export type RagMediaModality = 'image' | 'audio';

/**
 * Input payload for ingesting a multimodal asset (image/audio) into RAG.
 *
 * The default implementation indexes assets by deriving a **text representation**
 * (image caption / OCR text / audio transcript) and storing that text as a normal
 * RAG document. The raw bytes are optionally persisted for later retrieval.
 */
export interface RagMediaAssetInput {
  /** Stable identifier for the asset (auto-generated if omitted). */
  assetId?: string;
  /** Collection/namespace to store the derived RAG document into. */
  collectionId?: string;
  /** Asset modality. */
  modality: RagMediaModality;
  /** MIME type of the asset (e.g., image/png, audio/webm). */
  mimeType: string;
  /** Original file name (best-effort metadata). */
  originalFileName?: string;
  /** Raw bytes for the asset. Optional when `sourceUrl` is supplied and `storePayload=false`. */
  payload?: Buffer;
  /** Optional pointer (URL) to the asset when not storing payload bytes. */
  sourceUrl?: string;
  /** Optional metadata stored alongside the derived RAG document chunks. */
  metadata?: Record<string, unknown>;
  /** Optional tag list stored in derived document metadata. */
  tags?: string[];
  /** Optional category to store the derived document under. Default: `custom`. */
  category?: 'conversation_memory' | 'knowledge_base' | 'user_notes' | 'system' | 'custom';
  /**
   * Optional precomputed text representation (caption/transcript).
   * When provided, the service skips captioning/transcription.
   */
  textRepresentation?: string;
  /** If true, stores the raw payload bytes (base64) in the RAG database. Default: env-driven. */
  storePayload?: boolean;
  /** User ID for attribution/cost tracking (optional). */
  userId?: string;
  /** Agent ID for attribution (optional). */
  agentId?: string;
}

/**
 * Stored multimodal asset record.
 */
export interface RagMediaAsset {
  assetId: string;
  collectionId: string;
  modality: RagMediaModality;
  mimeType: string;
  originalFileName?: string | null;
  sourceUrl?: string | null;
  contentHashHex?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: number;
  updatedAt: number;
}

/**
 * Result of a multimodal ingestion request.
 */
export interface RagMediaIngestionResult {
  success: boolean;
  assetId: string;
  collectionId: string;
  modality: RagMediaModality;
  /** The derived RAG documentId (currently equal to `assetId`). */
  documentId: string;
  /** Derived text representation used for indexing. */
  textRepresentation: string;
  chunksCreated: number;
  error?: string;
}

/**
 * Multimodal query options.
 */
export interface RagMediaQueryOptions {
  /** Text query. */
  query: string;
  /** Restrict to specific modalities. Default: both `image` and `audio`. */
  modalities?: RagMediaModality[];
  /** Collection(s) to search. When omitted, defaults to modality-specific collections. */
  collectionIds?: string[];
  /** Maximum number of assets to return. */
  topK?: number;
  /** Include chunk metadata in results. */
  includeMetadata?: boolean;
}

/**
 * Multimodal query response (grouped by asset).
 */
export interface RagMediaQueryResult {
  success: boolean;
  query: string;
  assets: Array<{
    asset: RagMediaAsset;
    /** Best matching chunk for this asset. */
    bestChunk: RagRetrievedChunk;
  }>;
  totalResults: number;
  processingTimeMs: number;
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

interface MediaAssetRow {
  asset_id: string;
  collection_id: string;
  modality: string;
  mime_type: string;
  original_filename: string | null;
  payload_base64: string | null;
  source_url: string | null;
  content_hash_hex: string | null;
  metadata_json: string | null;
  created_at: number;
  updated_at: number;
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

  // Optional vector index (TypeScript-only via AgentOS SqlVectorStore).
  private vectorStore: IVectorStore | null = null;
  private vectorStoreInitialized = false;
  private vectorStoreInitPromise: Promise<void> | null = null;
  private vectorTablePrefix = 'rag_vec_';
  private vectorProvider: RagVectorProvider = 'sql';

  // Optional embedding + reranking subsystem (lazy; requires provider access).
  private providerManagerInitPromise: Promise<void> | null = null;
  private embeddingInitPromise: Promise<void> | null = null;
  private embeddingStatus: 'uninitialized' | 'enabled' | 'disabled' = 'uninitialized';
  private embeddingDisabledReason?: string;
  private providerManager?: AIModelProviderManager;
  private embeddingManager?: EmbeddingManager;
  private embeddingModel?: { providerId: string; modelId: string; dimension: number };
  private rerankerService?: RerankerService;
  private rerankWarningLogged = false;

  // Optional GraphRAG subsystem (disabled by default; enabled via env).
  private graphRagInitPromise: Promise<void> | null = null;
  private graphRagStatus: 'uninitialized' | 'enabled' | 'disabled' = 'uninitialized';
  private graphRagDisabledReason?: string;
  private graphRagEngine?: IGraphRAGEngine;
  private graphRagWarningLogged = false;

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
      const envFilePath = process.env.RAG_DATABASE_PATH;
      const options: StorageResolutionOptions = {
        // Treat an explicitly-set empty string as "in-memory/no persistence" for sql.js.
        filePath: envFilePath !== undefined ? envFilePath : './data/rag_store.db',
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

      // Initialize the optional vector index schema (no embeddings required yet).
      try {
        await this.ensureVectorStoreInitialized(this.adapter);
      } catch (vectorError: any) {
        console.warn(
          `[RAG Service] Vector index initialization failed (continuing with keyword-only RAG): ${
            vectorError?.message ?? vectorError
          }`
        );
      }

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

    // Multimodal assets table (image/audio). The derived caption/transcript is indexed as a normal RAG document.
    await this.adapter.exec(`
      CREATE TABLE IF NOT EXISTS ${this.tablePrefix}media_assets (
        asset_id TEXT PRIMARY KEY,
        collection_id TEXT NOT NULL,
        modality TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        original_filename TEXT,
        payload_base64 TEXT,
        source_url TEXT,
        content_hash_hex TEXT,
        metadata_json TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (collection_id) REFERENCES ${this.tablePrefix}collections(collection_id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_${this.tablePrefix}media_assets_collection
        ON ${this.tablePrefix}media_assets(collection_id);

      CREATE INDEX IF NOT EXISTS idx_${this.tablePrefix}media_assets_modality
        ON ${this.tablePrefix}media_assets(modality);

      CREATE INDEX IF NOT EXISTS idx_${this.tablePrefix}media_assets_hash
        ON ${this.tablePrefix}media_assets(content_hash_hex);
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

      // External content FTS tables require triggers to stay in sync.
      // If these fail (non-SQLite adapters), we fall back to keyword matching.
      await this.adapter.exec(`
        CREATE TRIGGER IF NOT EXISTS ${this.tablePrefix}chunks_ai AFTER INSERT ON ${this.tablePrefix}chunks BEGIN
          INSERT INTO ${this.tablePrefix}chunks_fts(rowid, chunk_id, content)
          VALUES (new.rowid, new.chunk_id, new.content);
        END;
        CREATE TRIGGER IF NOT EXISTS ${this.tablePrefix}chunks_ad AFTER DELETE ON ${this.tablePrefix}chunks BEGIN
          INSERT INTO ${this.tablePrefix}chunks_fts(${this.tablePrefix}chunks_fts, rowid, chunk_id, content)
          VALUES ('delete', old.rowid, old.chunk_id, old.content);
        END;
        CREATE TRIGGER IF NOT EXISTS ${this.tablePrefix}chunks_au AFTER UPDATE ON ${this.tablePrefix}chunks BEGIN
          INSERT INTO ${this.tablePrefix}chunks_fts(${this.tablePrefix}chunks_fts, rowid, chunk_id, content)
          VALUES ('delete', old.rowid, old.chunk_id, old.content);
          INSERT INTO ${this.tablePrefix}chunks_fts(rowid, chunk_id, content)
          VALUES (new.rowid, new.chunk_id, new.content);
        END;
      `);

      // If the index is empty but we already have chunks, rebuild once.
      try {
        const chunkCount = await this.adapter.get<{ count: number }>(
          `SELECT COUNT(*) as count FROM ${this.tablePrefix}chunks`
        );
        const ftsCount = await this.adapter.get<{ count: number }>(
          `SELECT COUNT(*) as count FROM ${this.tablePrefix}chunks_fts`
        );
        if ((chunkCount?.count ?? 0) > 0 && (ftsCount?.count ?? 0) === 0) {
          await this.adapter.exec(
            `INSERT INTO ${this.tablePrefix}chunks_fts(${this.tablePrefix}chunks_fts) VALUES('rebuild');`
          );
        }
      } catch {
        // Ignore; worst case keyword fallback still works.
      }

      console.log('[RAG Service] FTS5 full-text search enabled');
    } catch {
      console.log('[RAG Service] FTS5 not available, using keyword matching');
    }
  }

  private resolveVectorTablePrefix(): string {
    return (
      firstNonEmptyEnv('AGENTOS_RAG_VECTOR_TABLE_PREFIX', 'RAG_VECTOR_TABLE_PREFIX')?.trim() ||
      'rag_vec_'
    );
  }

  private resolveVectorProvider(): RagVectorProvider {
    return (
      coerceRagVectorProvider(
        firstNonEmptyEnv('AGENTOS_RAG_VECTOR_PROVIDER', 'RAG_VECTOR_PROVIDER')
      ) || 'sql'
    );
  }

  private async ensureVectorStoreInitialized(adapter: StorageAdapter): Promise<void> {
    if (this.vectorStoreInitialized) return;
    if (this.vectorStoreInitPromise) return this.vectorStoreInitPromise;

    this.vectorStoreInitPromise = (async () => {
      this.vectorProvider = this.resolveVectorProvider();

      if (this.vectorProvider === 'qdrant') {
        const url = firstNonEmptyEnv('AGENTOS_RAG_QDRANT_URL', 'QDRANT_URL');
        if (!url) {
          throw new Error(
            'Qdrant vector provider selected but no URL configured. Set `AGENTOS_RAG_QDRANT_URL` (or `QDRANT_URL`).'
          );
        }

        const timeoutMs =
          parsePositiveIntEnv(
            firstNonEmptyEnv('AGENTOS_RAG_QDRANT_TIMEOUT_MS', 'QDRANT_TIMEOUT_MS')
          ) ?? 15_000;
        const enableBm25 =
          parseBooleanEnv(firstNonEmptyEnv('AGENTOS_RAG_QDRANT_ENABLE_BM25')) ?? true;

        const store = new QdrantVectorStore();
        const config: QdrantVectorStoreConfig = {
          id: 'agentos-rag-vector-qdrant',
          type: 'qdrant',
          url,
          apiKey: firstNonEmptyEnv('AGENTOS_RAG_QDRANT_API_KEY', 'QDRANT_API_KEY'),
          timeoutMs,
          enableBm25,
        };

        await store.initialize(config);
        this.vectorStore = store;
        this.vectorStoreInitialized = true;
        console.log(`[RAG Service] Vector index ready (provider='qdrant' url='${url}').`);
        return;
      }

      // Default: SQL vector store (local)
      this.vectorTablePrefix = this.resolveVectorTablePrefix();
      const store = new SqlVectorStore();
      const config: SqlVectorStoreConfig = {
        id: 'agentos-rag-vector-sql',
        type: 'sql',
        adapter,
        tablePrefix: this.vectorTablePrefix,
        enableFullTextSearch: true,
      };

      await store.initialize(config);
      this.vectorStore = store;
      this.vectorStoreInitialized = true;
      console.log(
        `[RAG Service] Vector index ready (provider='sql' tablePrefix='${this.vectorTablePrefix}').`
      );
    })().finally(() => {
      this.vectorStoreInitPromise = null;
    });

    return this.vectorStoreInitPromise;
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

    return rows.map((row) => ({
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
    await adapter.run(`DELETE FROM ${this.tablePrefix}chunks WHERE collection_id = ?`, [
      collectionId,
    ]);

    // Delete documents
    await adapter.run(`DELETE FROM ${this.tablePrefix}documents WHERE collection_id = ?`, [
      collectionId,
    ]);

    // Delete collection
    const result = await adapter.run(
      `DELETE FROM ${this.tablePrefix}collections WHERE collection_id = ?`,
      [collectionId]
    );

    // Best-effort cleanup in the vector index (does not require embeddings).
    try {
      await this.ensureVectorStoreInitialized(adapter);
      await this.vectorStore?.deleteCollection?.(collectionId);
    } catch {
      // Ignore; legacy store remains the source of truth.
    }

    return result.changes > 0;
  }

  private getRetrievalPreset(): RagRetrievalPreset {
    return coerceRagPreset(firstNonEmptyEnv('AGENTOS_RAG_PRESET', 'RAG_PRESET')) ?? 'balanced';
  }

  private getHybridAlpha(): number {
    const raw = Number(firstNonEmptyEnv('AGENTOS_RAG_HYBRID_ALPHA', 'RAG_HYBRID_ALPHA'));
    return Number.isFinite(raw) ? Math.max(0, Math.min(1, raw)) : 0.7;
  }

  private buildEmbeddingProviderConfigs(): ProviderConfigEntry[] {
    const providers: ProviderConfigEntry[] = [];

    const openaiKey = process.env.OPENAI_API_KEY?.trim();
    const openrouterKey = process.env.OPENROUTER_API_KEY?.trim();
    const explicitProvider = firstNonEmptyEnv('AGENTOS_RAG_EMBED_PROVIDER', 'RAG_EMBED_PROVIDER')
      ?.trim()
      .toLowerCase();

    const ollamaConfiguredBaseURL =
      coerceOllamaBaseURL(process.env.OLLAMA_BASE_URL) ??
      coerceOllamaBaseURL(process.env.OLLAMA_HOST);
    const shouldIncludeOllama = explicitProvider === 'ollama' || Boolean(ollamaConfiguredBaseURL);

    if (shouldIncludeOllama) {
      const requestTimeout =
        parsePositiveIntEnv(
          firstNonEmptyEnv('AGENTOS_RAG_OLLAMA_REQUEST_TIMEOUT_MS', 'RAG_OLLAMA_REQUEST_TIMEOUT_MS')
        ) ??
        parsePositiveIntEnv(process.env.OLLAMA_REQUEST_TIMEOUT_MS) ??
        5_000;
      providers.push({
        providerId: 'ollama',
        enabled: true,
        isDefault: explicitProvider === 'ollama' || (!openaiKey && !openrouterKey),
        config: {
          baseURL: ollamaConfiguredBaseURL ?? 'http://localhost:11434',
          requestTimeout,
        },
      });
    }

    if (openaiKey) {
      providers.push({
        providerId: 'openai',
        enabled: true,
        isDefault: explicitProvider === 'openai' || (!explicitProvider && !shouldIncludeOllama),
        config: { apiKey: openaiKey },
      });
    }

    if (openrouterKey) {
      providers.push({
        providerId: 'openrouter',
        enabled: true,
        isDefault:
          explicitProvider === 'openrouter' ||
          (!explicitProvider && !shouldIncludeOllama && !openaiKey),
        config: { apiKey: openrouterKey },
      });
    }

    return providers;
  }

  private buildEmbeddingCandidates(
    providerManager: AIModelProviderManager
  ): Array<{ providerId: string; modelId: string }> {
    const explicitProvider = firstNonEmptyEnv(
      'AGENTOS_RAG_EMBED_PROVIDER',
      'RAG_EMBED_PROVIDER'
    )?.trim();
    const explicitModel = firstNonEmptyEnv('AGENTOS_RAG_EMBED_MODEL', 'RAG_EMBED_MODEL')?.trim();

    const candidates: Array<{ providerId: string; modelId: string }> = [];

    if (explicitProvider) {
      const providerId = explicitProvider.trim().toLowerCase();
      if (explicitModel) {
        candidates.push({ providerId, modelId: explicitModel });
        return candidates;
      }
      if (providerId === 'ollama') {
        candidates.push({
          providerId,
          modelId:
            firstNonEmptyEnv('OLLAMA_EMBED_MODEL', 'OLLAMA_EMBEDDING_MODEL') || 'nomic-embed-text',
        });
        return candidates;
      }
      if (providerId === 'openai') {
        candidates.push({ providerId, modelId: 'text-embedding-3-small' });
        return candidates;
      }
      if (providerId === 'openrouter') {
        candidates.push({ providerId, modelId: 'openai/text-embedding-3-small' });
        return candidates;
      }

      candidates.push({ providerId, modelId: explicitModel || 'unknown' });
      return candidates;
    }

    if (providerManager.getProvider('ollama')) {
      candidates.push({
        providerId: 'ollama',
        modelId:
          firstNonEmptyEnv('OLLAMA_EMBED_MODEL', 'OLLAMA_EMBEDDING_MODEL') || 'nomic-embed-text',
      });
    }
    if (providerManager.getProvider('openai')) {
      candidates.push({ providerId: 'openai', modelId: 'text-embedding-3-small' });
    }
    if (providerManager.getProvider('openrouter')) {
      candidates.push({ providerId: 'openrouter', modelId: 'openai/text-embedding-3-small' });
    }

    return candidates;
  }

  private async probeEmbeddingModel(
    providerManager: AIModelProviderManager
  ): Promise<{ providerId: string; modelId: string; dimension: number }> {
    const candidates = this.buildEmbeddingCandidates(providerManager);
    const probeText = 'dimension probe';

    const errors: string[] = [];
    for (const candidate of candidates) {
      const provider = providerManager.getProvider(candidate.providerId);
      if (!provider) {
        errors.push(`${candidate.providerId}: provider not initialized`);
        continue;
      }
      if (typeof provider.generateEmbeddings !== 'function') {
        errors.push(`${candidate.providerId}: embeddings not supported`);
        continue;
      }

      try {
        const resp = await provider.generateEmbeddings(candidate.modelId, [probeText], {});
        const embedding = resp?.data?.[0]?.embedding;
        if (!Array.isArray(embedding) || embedding.length === 0) {
          errors.push(`${candidate.providerId}/${candidate.modelId}: empty embedding`);
          continue;
        }
        return {
          providerId: candidate.providerId,
          modelId: candidate.modelId,
          dimension: embedding.length,
        };
      } catch (err: any) {
        errors.push(`${candidate.providerId}/${candidate.modelId}: ${err?.message ?? String(err)}`);
      }
    }

    throw new Error(
      `No embedding provider/model is available for AgentOS RAG. Configure Ollama or set OPENAI_API_KEY/OPENROUTER_API_KEY. Errors: ${errors.join(
        '; '
      )}`
    );
  }

  /**
   * Initializes the provider manager (OpenAI/OpenRouter/Ollama) without enabling embeddings.
   *
   * This is used for multimodal ingestion (e.g. image captioning) and other LLM-only workflows
   * that should continue to work even when vector embeddings are unavailable.
   */
  private async ensureProviderManagerInitialized(): Promise<AIModelProviderManager> {
    if (this.providerManager?.isInitialized) return this.providerManager;
    if (this.providerManagerInitPromise) {
      await this.providerManagerInitPromise;
      return this.providerManager ?? new AIModelProviderManager();
    }

    const providerManager = this.providerManager ?? new AIModelProviderManager();
    this.providerManager = providerManager;

    this.providerManagerInitPromise = (async () => {
      await providerManager.initialize({ providers: this.buildEmbeddingProviderConfigs() });
    })().finally(() => {
      this.providerManagerInitPromise = null;
    });

    await this.providerManagerInitPromise;
    return providerManager;
  }

  private async ensureEmbeddingsInitialized(adapter: StorageAdapter): Promise<void> {
    if (this.embeddingStatus === 'enabled') return;
    if (this.embeddingStatus === 'disabled') {
      throw new Error(this.embeddingDisabledReason ?? 'AgentOS RAG embeddings are disabled.');
    }
    if (this.embeddingInitPromise) return this.embeddingInitPromise;

    this.embeddingInitPromise = (async () => {
      // Vector store is purely local; embeddings may require network access.
      await this.ensureVectorStoreInitialized(adapter);

      const providerManager = await this.ensureProviderManagerInitialized();
      const embed = await this.probeEmbeddingModel(providerManager);
      const embeddingConfig: EmbeddingManagerConfig = {
        embeddingModels: [
          {
            providerId: embed.providerId,
            modelId: embed.modelId,
            dimension: embed.dimension,
            isDefault: true,
          },
        ],
        defaultModelId: embed.modelId,
        enableCache: true,
        cacheMaxSize: 50_000,
        cacheTTLSeconds: 60 * 60,
      };

      const embeddingManager = new EmbeddingManager();
      await embeddingManager.initialize(embeddingConfig, providerManager);

      this.embeddingManager = embeddingManager;
      this.embeddingModel = embed;

      // Optional reranker service (Cohere if available; otherwise local).
      const cohereKey = process.env.COHERE_API_KEY?.trim();
      const providers = [
        { providerId: 'local', defaultModelId: 'cross-encoder/ms-marco-MiniLM-L-6-v2' },
      ] as any[];
      if (cohereKey) {
        providers.push({ providerId: 'cohere', apiKey: cohereKey, defaultModelId: 'rerank-v3.5' });
      }
      const reranker = new RerankerService({
        config: {
          providers,
          defaultProviderId: cohereKey ? 'cohere' : 'local',
        },
      });
      reranker.registerProvider(
        new LocalCrossEncoderReranker({
          providerId: 'local',
          defaultModelId: 'cross-encoder/ms-marco-MiniLM-L-6-v2',
        })
      );
      if (cohereKey) {
        reranker.registerProvider(
          new CohereReranker({
            providerId: 'cohere',
            apiKey: cohereKey,
            defaultModelId: 'rerank-v3.5',
          })
        );
      }
      this.rerankerService = reranker;

      this.embeddingStatus = 'enabled';
      console.log(
        `[RAG Service] Vector retrieval enabled (provider='${embed.providerId}' model='${embed.modelId}' dim=${embed.dimension}).`
      );
    })()
      .catch((err: any) => {
        this.embeddingStatus = 'disabled';
        this.embeddingDisabledReason = err?.message
          ? String(err.message)
          : 'Embedding subsystem initialization failed.';
        console.warn(`[RAG Service] Vector retrieval disabled: ${this.embeddingDisabledReason}`);
        throw err;
      })
      .finally(() => {
        this.embeddingInitPromise = null;
      });

    return this.embeddingInitPromise;
  }

  private isGraphRagEnabled(): boolean {
    return (
      parseBooleanEnv(firstNonEmptyEnv('AGENTOS_GRAPHRAG_ENABLED', 'GRAPHRAG_ENABLED')) ?? false
    );
  }

  private shouldIngestGraphRag(category: string): boolean {
    if (!this.isGraphRagEnabled()) return false;
    const raw = firstNonEmptyEnv('AGENTOS_GRAPHRAG_CATEGORIES')?.trim();
    const normalizedCategory = String(category || '')
      .trim()
      .toLowerCase();
    if (!normalizedCategory) return false;

    // Default: keep GraphRAG focused on longer-lived knowledge docs (avoid indexing rolling memory by accident).
    if (!raw) return normalizedCategory === 'knowledge_base';

    const allow = new Set(
      raw
        .split(',')
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean)
    );
    return allow.has(normalizedCategory);
  }

  private buildGraphRagLlmProvider():
    | {
        generateText: (
          prompt: string,
          options?: { maxTokens?: number; temperature?: number }
        ) => Promise<string>;
      }
    | undefined {
    const enabled =
      parseBooleanEnv(firstNonEmptyEnv('AGENTOS_GRAPHRAG_LLM_ENABLED', 'GRAPHRAG_LLM_ENABLED')) ??
      false;
    if (!enabled) return undefined;
    if (!this.providerManager) {
      throw new Error('GraphRAG LLM is enabled but the provider manager is not initialized.');
    }

    const explicitProviderId = firstNonEmptyEnv(
      'AGENTOS_GRAPHRAG_LLM_PROVIDER',
      'GRAPHRAG_LLM_PROVIDER'
    )
      ?.trim()
      .toLowerCase();
    const providerId =
      explicitProviderId ||
      (this.providerManager.getProvider('openrouter')
        ? 'openrouter'
        : this.providerManager.getProvider('openai')
          ? 'openai'
          : this.providerManager.getProvider('ollama')
            ? 'ollama'
            : '');

    if (!providerId) {
      throw new Error(
        'GraphRAG LLM is enabled but no provider is available. Configure OPENAI_API_KEY / OPENROUTER_API_KEY (or Ollama).'
      );
    }

    const provider = this.providerManager.getProvider(providerId);
    if (!provider) {
      throw new Error(`GraphRAG LLM provider '${providerId}' is not initialized.`);
    }

    const explicitModelId = firstNonEmptyEnv(
      'AGENTOS_GRAPHRAG_LLM_MODEL',
      'GRAPHRAG_LLM_MODEL'
    )?.trim();
    const modelId =
      explicitModelId ||
      (providerId === 'openrouter'
        ? process.env.MODEL_PREF_OPENROUTER_DEFAULT?.trim() || 'openai/gpt-4o-mini'
        : providerId === 'openai'
          ? process.env.AGENTOS_DEFAULT_MODEL_ID?.trim() || 'gpt-4o-mini'
          : process.env.OLLAMA_MODEL?.trim() || 'llama3');

    return {
      generateText: async (
        prompt: string,
        options?: { maxTokens?: number; temperature?: number }
      ) => {
        const response = await provider.generateCompletion(
          modelId,
          [{ role: 'user', content: prompt }],
          {
            maxTokens: options?.maxTokens,
            temperature: options?.temperature,
          }
        );

        const choice = response?.choices?.[0];
        const content = choice?.message?.content;
        if (typeof content === 'string') return content;
        if (Array.isArray(content)) {
          return content
            .map((part: any) =>
              part?.type === 'text' && typeof part?.text === 'string' ? part.text : ''
            )
            .join('');
        }
        if (typeof choice?.text === 'string') return choice.text;
        return '';
      },
    };
  }

  private async ensureGraphRagInitialized(adapter: StorageAdapter): Promise<void> {
    if (!this.isGraphRagEnabled()) return;
    if (this.graphRagStatus === 'enabled') return;
    if (this.graphRagStatus === 'disabled') return;
    if (this.graphRagInitPromise) return this.graphRagInitPromise;

    this.graphRagInitPromise = (async () => {
      // GraphRAG benefits from the same embedding + vector infrastructure as dense/hybrid RAG.
      await this.ensureEmbeddingsInitialized(adapter);
      if (!this.vectorStore || !this.embeddingManager || !this.embeddingModel) {
        throw new Error('GraphRAG requires an initialized vector store + embedding subsystem.');
      }

      const rawEngineId =
        firstNonEmptyEnv('AGENTOS_GRAPHRAG_ENGINE_ID', 'GRAPHRAG_ENGINE_ID')?.trim() ||
        'agentos-graphrag';
      const engineId =
        rawEngineId
          .toLowerCase()
          .replace(/[^a-z0-9_-]+/g, '_')
          .slice(0, 60) || 'agentos-graphrag';

      const tablePrefix =
        firstNonEmptyEnv('AGENTOS_GRAPHRAG_TABLE_PREFIX', 'GRAPHRAG_TABLE_PREFIX')?.trim() ||
        'rag_graphrag_';
      const entityCollectionName =
        firstNonEmptyEnv(
          'AGENTOS_GRAPHRAG_ENTITY_COLLECTION',
          'GRAPHRAG_ENTITY_COLLECTION'
        )?.trim() || `${engineId}_entities`;
      const communityCollectionName =
        firstNonEmptyEnv(
          'AGENTOS_GRAPHRAG_COMMUNITY_COLLECTION',
          'GRAPHRAG_COMMUNITY_COLLECTION'
        )?.trim() || `${engineId}_communities`;
      const generateEntityEmbeddings =
        parseBooleanEnv(
          firstNonEmptyEnv('AGENTOS_GRAPHRAG_ENTITY_EMBEDDINGS', 'GRAPHRAG_ENTITY_EMBEDDINGS')
        ) ?? true;

      // Dynamic import keeps GraphRAG optional (peer deps like graphology can be missing in some deployments).
      const { GraphRAGEngine } = await import('@framers/agentos/rag/graphrag');

      const llmProvider = this.buildGraphRagLlmProvider();
      const engine = new GraphRAGEngine({
        vectorStore: this.vectorStore,
        embeddingManager: this.embeddingManager,
        llmProvider,
        persistenceAdapter: adapter as any,
      });

      await engine.initialize({
        engineId,
        tablePrefix,
        generateEntityEmbeddings,
        embeddingModelId: this.embeddingModel.modelId,
        embeddingDimension: this.embeddingModel.dimension,
        entityCollectionName,
        communityCollectionName,
      });

      this.graphRagEngine = engine;
      this.graphRagStatus = 'enabled';
      console.log(`[RAG Service] GraphRAG enabled (engineId='${engineId}').`);
    })()
      .catch((err: any) => {
        this.graphRagStatus = 'disabled';
        this.graphRagDisabledReason = err?.message
          ? String(err.message)
          : 'GraphRAG initialization failed.';
        if (!this.graphRagWarningLogged) {
          this.graphRagWarningLogged = true;
          console.warn(`[RAG Service] GraphRAG disabled: ${this.graphRagDisabledReason}`);
        }
      })
      .finally(() => {
        this.graphRagInitPromise = null;
      });

    return this.graphRagInitPromise;
  }

  private async requireGraphRagEngine(adapter: StorageAdapter): Promise<IGraphRAGEngine> {
    if (!this.isGraphRagEnabled()) {
      throw new Error(
        'GraphRAG is not enabled. Set `AGENTOS_GRAPHRAG_ENABLED=true` (and optionally `AGENTOS_GRAPHRAG_LLM_ENABLED=true`).'
      );
    }

    await this.ensureGraphRagInitialized(adapter);
    if (this.graphRagEngine) return this.graphRagEngine;

    throw new Error(
      this.graphRagDisabledReason ?? 'GraphRAG is not available (initialization failed).'
    );
  }

  private async ensureVectorCollection(collectionId: string): Promise<void> {
    if (!this.vectorStore) {
      throw new Error('Vector store is not initialized.');
    }
    if (!this.embeddingModel) {
      throw new Error('Embedding model is not initialized.');
    }

    if (this.vectorStore.collectionExists && this.vectorStore.createCollection) {
      const exists = await this.vectorStore.collectionExists(collectionId);
      if (!exists) {
        await this.vectorStore.createCollection(collectionId, this.embeddingModel.dimension, {
          similarityMetric: 'cosine',
        });
      }
    }
  }

  private async upsertVectorChunks(input: {
    adapter: StorageAdapter;
    collectionId: string;
    documentId: string;
    documentCategory: string;
    chunks: Array<{ chunkId: string; content: string; chunkIndex: number }>;
    metadata?: Record<string, unknown> | null;
  }): Promise<void> {
    if (input.chunks.length === 0) return;

    await this.ensureEmbeddingsInitialized(input.adapter);
    if (!this.embeddingManager || !this.embeddingModel || !this.vectorStore) {
      throw new Error('Vector subsystem not initialized.');
    }

    await this.ensureVectorCollection(input.collectionId);

    const chunkDocs = input.chunks
      .map((chunk) => ({
        id: chunk.chunkId,
        content: chunk.content,
        metadata: {
          ...(input.metadata ?? {}),
          __ragDocumentId: input.documentId,
          __ragCollectionId: input.collectionId,
          __ragDocumentCategory: input.documentCategory,
          __ragChunkIndex: chunk.chunkIndex,
        },
      }))
      .filter((doc) => doc.content.trim().length > 0);

    if (chunkDocs.length === 0) return;

    const embedResp = await this.embeddingManager.generateEmbeddings({
      texts: chunkDocs.map((c) => c.content),
      modelId: this.embeddingModel.modelId,
    });

    if (!Array.isArray(embedResp.embeddings) || embedResp.embeddings.length !== chunkDocs.length) {
      throw new Error(
        `Embedding batch size mismatch. Expected ${chunkDocs.length}, got ${embedResp.embeddings?.length ?? 0}.`
      );
    }

    await this.vectorStore.upsert(
      input.collectionId,
      chunkDocs.map((doc, idx) => ({
        id: doc.id,
        embedding: embedResp.embeddings[idx]!,
        textContent: doc.content,
        metadata: doc.metadata as any,
      })),
      { overwrite: true }
    );
  }

  // ==========================================================================
  // Document Operations
  // ==========================================================================

  private async upsertDocumentWithChunks(
    trx: StorageAdapter,
    input: {
      documentId: string;
      collectionId: string;
      category: string;
      content: string;
      metadataJson: string | null;
      now: number;
      chunks: string[];
    }
  ): Promise<void> {
    // Insert/replace document row.
    await trx.run(
      `INSERT OR REPLACE INTO ${this.tablePrefix}documents 
       (document_id, collection_id, category, content, metadata_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        input.documentId,
        input.collectionId,
        input.category,
        input.content,
        input.metadataJson,
        input.now,
        input.now,
      ]
    );

    // Delete existing chunks for this document (update semantics).
    await trx.run(`DELETE FROM ${this.tablePrefix}chunks WHERE document_id = ?`, [
      input.documentId,
    ]);

    // Insert chunks.
    for (let i = 0; i < input.chunks.length; i++) {
      const chunkId = `${input.documentId}_chunk_${i}`;
      await trx.run(
        `INSERT INTO ${this.tablePrefix}chunks 
         (chunk_id, document_id, collection_id, content, chunk_index, metadata_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          chunkId,
          input.documentId,
          input.collectionId,
          input.chunks[i],
          i,
          input.metadataJson,
          input.now,
        ]
      );
    }

    // Update collection counts.
    await this.updateCollectionCounts(trx, input.collectionId);
  }

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
        await this.upsertDocumentWithChunks(trx, {
          documentId,
          collectionId,
          category,
          content: input.content,
          metadataJson: input.metadata ? JSON.stringify(input.metadata) : null,
          now,
          chunks,
        });
      });

      // Best-effort: keep the vector index in sync (does not affect canonical SQL writes).
      try {
        await this.upsertVectorChunks({
          adapter,
          collectionId,
          documentId,
          documentCategory: category,
          chunks: chunks.map((content, chunkIndex) => ({
            chunkId: `${documentId}_chunk_${chunkIndex}`,
            content,
            chunkIndex,
          })),
          metadata: (input.metadata ?? null) as any,
        });
      } catch (vectorError: any) {
        console.warn(
          `[RAG Service] Vector indexing failed for document '${documentId}' (continuing): ${
            vectorError?.message ?? vectorError
          }`
        );
      }

      // Optional: GraphRAG indexing (disabled by default; best-effort).
      if (this.shouldIngestGraphRag(category)) {
        try {
          await this.ensureGraphRagInitialized(adapter);
          await this.graphRagEngine?.ingestDocuments([
            {
              id: documentId,
              content: input.content,
              metadata: sanitizeGraphRagMetadata(input.metadata),
            },
          ]);
        } catch (graphError: any) {
          console.warn(
            `[RAG Service] GraphRAG indexing failed for document '${documentId}' (continuing): ${
              graphError?.message ?? graphError
            }`
          );
        }
      }

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

  // ==========================================================================
  // Multimodal Asset Operations
  // ==========================================================================

  private resolveMediaStorePayloadDefault(): boolean {
    return (
      parseBooleanEnv(
        firstNonEmptyEnv(
          'AGENTOS_RAG_MEDIA_STORE_PAYLOAD',
          'RAG_MEDIA_STORE_PAYLOAD',
          'AGENTOS_MULTIMODAL_STORE_PAYLOAD'
        )
      ) ?? false
    );
  }

  private resolveMediaCollectionId(modality: RagMediaModality, provided?: string): string {
    const explicit = provided?.trim();
    if (explicit) return explicit;

    if (modality === 'image') {
      return (
        firstNonEmptyEnv(
          'AGENTOS_RAG_MEDIA_IMAGE_COLLECTION_ID',
          'AGENTOS_RAG_MEDIA_IMAGE_COLLECTION',
          'AGENTOS_MULTIMODAL_IMAGE_COLLECTION_ID'
        )?.trim() || 'media_images'
      );
    }

    return (
      firstNonEmptyEnv(
        'AGENTOS_RAG_MEDIA_AUDIO_COLLECTION_ID',
        'AGENTOS_RAG_MEDIA_AUDIO_COLLECTION',
        'AGENTOS_MULTIMODAL_AUDIO_COLLECTION_ID'
      )?.trim() || 'media_audio'
    );
  }

  private resolveImageCaptionProviderPreference(): {
    preferredProviderId: string;
    preferredModelId: string;
  } {
    const providerId =
      firstNonEmptyEnv(
        'AGENTOS_RAG_MEDIA_IMAGE_LLM_PROVIDER',
        'AGENTOS_MULTIMODAL_IMAGE_LLM_PROVIDER'
      )?.trim() || 'openai';
    const modelId =
      firstNonEmptyEnv(
        'AGENTOS_RAG_MEDIA_IMAGE_LLM_MODEL',
        'AGENTOS_MULTIMODAL_IMAGE_LLM_MODEL'
      )?.trim() || 'gpt-4o-mini';
    return { preferredProviderId: providerId, preferredModelId: modelId };
  }

  private resolveImageCaptionSystemPrompt(): string {
    return (
      firstNonEmptyEnv('AGENTOS_RAG_MEDIA_IMAGE_SYSTEM_PROMPT')?.trim() ||
      [
        'You are an indexing assistant.',
        'Create a search-optimized description of the image for retrieval.',
        'Return ONLY valid JSON with these fields:',
        '{ "caption": string, "visibleText": string, "entities": string[], "tags": string[] }',
        'Rules:',
        '- caption: concise, 1-2 sentences',
        '- visibleText: verbatim text you can read in the image (or empty string)',
        '- entities: key people/places/objects (strings)',
        '- tags: short lowercase tags (snake_case), 3-12 items',
      ].join('\n')
    );
  }

  private normalizeTags(tags: string[] | undefined): string[] | undefined {
    if (!tags || tags.length === 0) return undefined;
    const normalized = Array.from(
      new Set(
        tags
          .map((t) =>
            String(t ?? '')
              .trim()
              .toLowerCase()
          )
          .filter((t) => t.length > 0)
      )
    );
    return normalized.length > 0 ? normalized : undefined;
  }

  private extractFirstJsonObject(text: string): any | null {
    const raw = String(text ?? '').trim();
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    const slice = raw.slice(start, end + 1);
    try {
      return JSON.parse(slice);
    } catch {
      return null;
    }
  }

  private extractTextFromCompletion(response: any): string {
    const content = response?.choices?.[0]?.message?.content;
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
      return content
        .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
        .filter(Boolean)
        .join('');
    }
    if (typeof response?.choices?.[0]?.text === 'string') return response.choices[0].text;
    return '';
  }

  private async deriveImageTextRepresentation(input: {
    mimeType: string;
    payload?: Buffer;
    sourceUrl?: string;
  }): Promise<{ textRepresentation: string; tags?: string[] }> {
    const providerManager = await this.ensureProviderManagerInitialized();
    const { preferredProviderId, preferredModelId } = this.resolveImageCaptionProviderPreference();

    const provider =
      providerManager.getProvider(preferredProviderId) ??
      providerManager.getProvider('openai') ??
      providerManager.getProvider('openrouter') ??
      providerManager.getDefaultProvider();
    if (!provider) {
      throw new Error(
        'No LLM provider is configured for image captioning. Set OPENAI_API_KEY or OPENROUTER_API_KEY (or configure Ollama).'
      );
    }

    const imageUrl =
      input.payload && input.payload.length > 0
        ? `data:${input.mimeType};base64,${input.payload.toString('base64')}`
        : input.sourceUrl?.trim();
    if (!imageUrl) {
      throw new Error('Image ingestion requires `payload` bytes or a `sourceUrl`.');
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: this.resolveImageCaptionSystemPrompt() },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Describe this image for retrieval indexing.',
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl, detail: 'low' },
          },
        ],
      },
    ];

    const resp = await provider.generateCompletion(preferredModelId, messages, {
      temperature: 0.2,
      maxTokens: 450,
    } as any);

    const raw = this.extractTextFromCompletion(resp).trim();
    const parsed = this.extractFirstJsonObject(raw);

    const caption =
      typeof parsed?.caption === 'string' ? parsed.caption.trim() : raw.split('\n')[0]?.trim();
    const visibleText = typeof parsed?.visibleText === 'string' ? parsed.visibleText.trim() : '';
    const entities = Array.isArray(parsed?.entities)
      ? parsed.entities.map((v: any) => String(v ?? '').trim()).filter(Boolean)
      : [];
    const modelTags = Array.isArray(parsed?.tags)
      ? parsed.tags.map((v: any) => String(v ?? '').trim()).filter(Boolean)
      : [];

    const lines: string[] = ['[Image]'];
    if (caption) lines.push(`Caption: ${caption}`);
    if (visibleText) lines.push(`Visible text: ${visibleText}`);
    if (entities.length > 0) lines.push(`Entities: ${entities.join(', ')}`);
    const normalizedModelTags = this.normalizeTags(modelTags);
    if (normalizedModelTags && normalizedModelTags.length > 0) {
      lines.push(`Tags: ${normalizedModelTags.join(', ')}`);
    }

    const textRepresentation = lines.join('\n').trim();
    if (!textRepresentation) {
      throw new Error('Image captioning produced an empty response.');
    }

    return { textRepresentation, tags: normalizedModelTags };
  }

  private async deriveAudioTextRepresentation(input: {
    payload: Buffer;
    originalFileName: string;
    mimeType: string;
    userId: string;
  }): Promise<string> {
    const options: ISttOptions = {
      model: process.env.WHISPER_MODEL_DEFAULT || 'whisper-1',
      responseFormat: 'verbose_json',
      providerSpecificOptions: {
        mimeType: input.mimeType,
      },
    } as any;

    const result = await audioService.transcribeAudio(
      input.payload,
      input.originalFileName,
      options,
      input.userId
    );

    const transcript = String(result?.text ?? '').trim();
    if (!transcript) {
      throw new Error('Audio transcription produced an empty transcript.');
    }

    const lines: string[] = ['[Audio]', `Transcript: ${transcript}`];
    if (typeof result?.language === 'string' && result.language.trim()) {
      lines.push(`Language: ${result.language.trim()}`);
    }
    if (typeof result?.durationSeconds === 'number' && Number.isFinite(result.durationSeconds)) {
      lines.push(`DurationSeconds: ${result.durationSeconds.toFixed(2)}`);
    }
    return lines.join('\n').trim();
  }

  private rowToMediaAsset(row: MediaAssetRow): RagMediaAsset {
    return {
      assetId: row.asset_id,
      collectionId: row.collection_id,
      modality: row.modality as RagMediaModality,
      mimeType: row.mime_type,
      originalFileName: row.original_filename,
      sourceUrl: row.source_url,
      contentHashHex: row.content_hash_hex,
      metadata: row.metadata_json ? (JSON.parse(row.metadata_json) as any) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Ingest an image into RAG by deriving a text representation (caption + visible text).
   */
  async ingestImageAsset(
    input: Omit<RagMediaAssetInput, 'modality'>
  ): Promise<RagMediaIngestionResult> {
    return this.ingestMediaAsset({ ...input, modality: 'image' });
  }

  /**
   * Ingest an audio file into RAG by deriving a text representation (transcript).
   */
  async ingestAudioAsset(
    input: Omit<RagMediaAssetInput, 'modality'>
  ): Promise<RagMediaIngestionResult> {
    return this.ingestMediaAsset({ ...input, modality: 'audio' });
  }

  /**
   * Ingest a multimodal asset into RAG by deriving a text representation and indexing it as a normal document.
   *
   * The derived documentId is currently the same as `assetId`, making query grouping deterministic.
   */
  async ingestMediaAsset(input: RagMediaAssetInput): Promise<RagMediaIngestionResult> {
    const adapter = await this.ensureInitialized();
    const now = Date.now();

    const assetId = input.assetId || `asset_${now}_${Math.random().toString(36).slice(2, 10)}`;
    const modality = input.modality;
    const collectionId = this.resolveMediaCollectionId(modality, input.collectionId);
    const category = input.category || 'knowledge_base';

    const storePayload = input.storePayload ?? this.resolveMediaStorePayloadDefault();
    const payload = input.payload;
    const payloadBase64 = storePayload && payload ? payload.toString('base64') : null;
    const sourceUrl = input.sourceUrl?.trim() || null;
    const contentHashHex = payload
      ? createHash('sha256').update(payload).digest('hex')
      : sourceUrl
        ? null
        : null;

    const userId = input.userId || 'system';
    const agentId = input.agentId;

    try {
      await this.createCollection(collectionId);

      let derivedTags: string[] | undefined;
      let textRepresentation = input.textRepresentation?.trim();
      if (!textRepresentation) {
        if (modality === 'image') {
          const derived = await this.deriveImageTextRepresentation({
            mimeType: input.mimeType,
            payload,
            sourceUrl: sourceUrl ?? undefined,
          });
          textRepresentation = derived.textRepresentation;
          derivedTags = derived.tags;
        } else {
          if (!payload || payload.length === 0) {
            throw new Error('Audio ingestion requires `payload` bytes.');
          }
          textRepresentation = await this.deriveAudioTextRepresentation({
            payload,
            originalFileName:
              input.originalFileName ||
              `audio-${Date.now()}.${input.mimeType.split('/')[1] || 'bin'}`,
            mimeType: input.mimeType,
            userId,
          });
        }
      }

      if (!textRepresentation) {
        throw new Error('Derived text representation is empty.');
      }

      const mergedTags = this.normalizeTags([...(input.tags ?? []), ...(derivedTags ?? [])]);
      const baseMetadata = {
        ...(input.metadata ?? {}),
        kind: 'rag_media_asset',
        assetId,
        modality,
        mimeType: input.mimeType,
        originalFileName: input.originalFileName,
        sourceUrl: sourceUrl ?? undefined,
        contentHashHex: contentHashHex ?? undefined,
      } as Record<string, unknown>;

      const docMetadata: RagDocumentInput['metadata'] = {
        ...(baseMetadata as any),
        ...(agentId ? { agentId } : {}),
        ...(input.metadata?.agentId ? { agentId: input.metadata.agentId as any } : {}),
        ...(input.metadata?.userId ? { userId: input.metadata.userId as any } : {}),
        ...(input.userId ? { userId: input.userId } : {}),
        type: 'media_asset',
        tags: mergedTags,
      };

      const chunkSize = 700;
      const chunkOverlap = 60;
      const chunks = this.chunkContent(textRepresentation, chunkSize, chunkOverlap);

      // Atomic write: media asset row + derived document/chunks.
      await adapter.transaction(async (trx) => {
        await trx.run(
          `INSERT OR REPLACE INTO ${this.tablePrefix}media_assets
           (asset_id, collection_id, modality, mime_type, original_filename, payload_base64, source_url, content_hash_hex, metadata_json, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            assetId,
            collectionId,
            modality,
            input.mimeType,
            input.originalFileName ?? null,
            payloadBase64,
            sourceUrl,
            contentHashHex,
            JSON.stringify({
              ...(input.metadata ?? {}),
              ...(mergedTags ? { tags: mergedTags } : {}),
              ...(agentId ? { agentId } : {}),
              ...(input.userId ? { userId: input.userId } : {}),
            }),
            now,
            now,
          ]
        );

        await this.upsertDocumentWithChunks(trx, {
          documentId: assetId,
          collectionId,
          category,
          content: textRepresentation,
          metadataJson: docMetadata ? JSON.stringify(docMetadata) : null,
          now,
          chunks,
        });
      });

      // Best-effort: keep the vector index in sync.
      try {
        await this.upsertVectorChunks({
          adapter,
          collectionId,
          documentId: assetId,
          documentCategory: category,
          chunks: chunks.map((content, chunkIndex) => ({
            chunkId: `${assetId}_chunk_${chunkIndex}`,
            content,
            chunkIndex,
          })),
          metadata: (docMetadata ?? null) as any,
        });
      } catch (vectorError: any) {
        console.warn(
          `[RAG Service] Vector indexing failed for media asset '${assetId}' (continuing): ${
            vectorError?.message ?? vectorError
          }`
        );
      }

      // Optional: GraphRAG indexing (best-effort).
      if (this.shouldIngestGraphRag(category)) {
        try {
          await this.ensureGraphRagInitialized(adapter);
          await this.graphRagEngine?.ingestDocuments([
            {
              id: assetId,
              content: textRepresentation,
              metadata: sanitizeGraphRagMetadata(docMetadata as any),
            },
          ]);
        } catch (graphError: any) {
          console.warn(
            `[RAG Service] GraphRAG indexing failed for media asset '${assetId}' (continuing): ${
              graphError?.message ?? graphError
            }`
          );
        }
      }

      return {
        success: true,
        assetId,
        collectionId,
        modality,
        documentId: assetId,
        textRepresentation,
        chunksCreated: chunks.length,
      };
    } catch (error: any) {
      const message = error?.message ?? String(error);
      console.error('[RAG Service] Media ingestion failed:', message);
      return {
        success: false,
        assetId,
        collectionId,
        modality,
        documentId: assetId,
        textRepresentation: input.textRepresentation ?? '',
        chunksCreated: 0,
        error: message,
      };
    }
  }

  /**
   * Fetch stored multimodal asset metadata.
   */
  async getMediaAsset(assetId: string): Promise<RagMediaAsset | null> {
    const adapter = await this.ensureInitialized();
    const row = await adapter.get<MediaAssetRow>(
      `SELECT * FROM ${this.tablePrefix}media_assets WHERE asset_id = ?`,
      [assetId]
    );
    return row ? this.rowToMediaAsset(row) : null;
  }

  /**
   * Fetch stored multimodal asset raw bytes (if `storePayload` was enabled at ingest time).
   */
  async getMediaAssetContent(
    assetId: string
  ): Promise<{ mimeType: string; buffer: Buffer } | null> {
    const adapter = await this.ensureInitialized();
    const row = await adapter.get<Pick<MediaAssetRow, 'mime_type' | 'payload_base64'>>(
      `SELECT mime_type, payload_base64 FROM ${this.tablePrefix}media_assets WHERE asset_id = ?`,
      [assetId]
    );
    const payloadBase64 = row?.payload_base64;
    if (!row || !payloadBase64) return null;
    return { mimeType: row.mime_type, buffer: Buffer.from(payloadBase64, 'base64') };
  }

  /**
   * Delete a multimodal asset and its derived RAG document.
   */
  async deleteMediaAsset(assetId: string): Promise<boolean> {
    const adapter = await this.ensureInitialized();
    await adapter.run(`DELETE FROM ${this.tablePrefix}media_assets WHERE asset_id = ?`, [assetId]);
    return this.deleteDocument(assetId);
  }

  /**
   * Query multimodal assets by searching their derived text representations.
   */
  async queryMediaAssets(options: RagMediaQueryOptions): Promise<RagMediaQueryResult> {
    const adapter = await this.ensureInitialized();
    const start = Date.now();

    const defaultModalities: RagMediaModality[] = ['image', 'audio'];
    const modalities: RagMediaModality[] =
      options.modalities && options.modalities.length > 0 ? options.modalities : defaultModalities;
    const requestedCollections =
      options.collectionIds && options.collectionIds.length > 0
        ? options.collectionIds
        : modalities.map((m) => this.resolveMediaCollectionId(m));
    const collectionIds = Array.from(
      new Set(requestedCollections.map((c) => c.trim()).filter(Boolean))
    );

    const assetTopK = options.topK ?? 5;
    const chunkTopK = Math.min(200, Math.max(assetTopK * 10, assetTopK));

    const queryResult = await this.query({
      query: options.query,
      collectionIds,
      topK: chunkTopK,
      includeMetadata: true,
    });

    const bestByAsset = new Map<string, RagRetrievedChunk>();
    for (const chunk of queryResult.chunks) {
      const assetId = chunk.documentId;
      const existing = bestByAsset.get(assetId);
      if (!existing || chunk.score > existing.score) {
        bestByAsset.set(assetId, chunk);
      }
    }

    const rankedAssets = Array.from(bestByAsset.entries())
      .map(([assetId, bestChunk]) => ({ assetId, bestChunk }))
      .sort((a, b) => b.bestChunk.score - a.bestChunk.score)
      .slice(0, assetTopK);

    if (rankedAssets.length === 0) {
      return {
        success: true,
        query: options.query,
        assets: [],
        totalResults: 0,
        processingTimeMs: Date.now() - start,
      };
    }

    const assetIds = rankedAssets.map((a) => a.assetId);
    const placeholders = assetIds.map(() => '?').join(', ');
    const rows = await adapter.all<MediaAssetRow>(
      `SELECT * FROM ${this.tablePrefix}media_assets WHERE asset_id IN (${placeholders})`,
      assetIds
    );
    const byId = new Map(rows.map((r) => [r.asset_id, this.rowToMediaAsset(r)]));

    const assets = rankedAssets
      .map((entry) => {
        const asset = byId.get(entry.assetId);
        if (!asset) return null;
        return {
          asset,
          bestChunk: {
            ...entry.bestChunk,
            metadata: options.includeMetadata ? entry.bestChunk.metadata : undefined,
          },
        };
      })
      .filter(Boolean) as RagMediaQueryResult['assets'];

    return {
      success: true,
      query: options.query,
      assets,
      totalResults: assets.length,
      processingTimeMs: Date.now() - start,
    };
  }

  /**
   * Update collection document and chunk counts.
   */
  private async updateCollectionCounts(
    adapter: StorageAdapter,
    collectionId: string
  ): Promise<void> {
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
  private async queryKeywordInternal(
    adapter: StorageAdapter,
    options: RagQueryOptions
  ): Promise<{ chunks: RagRetrievedChunk[]; totalResults: number }> {
    const topK = options.topK || 5;
    const threshold = options.similarityThreshold || 0;

    // Tokenize query for keyword matching
    const queryTerms = options.query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 2);

    if (queryTerms.length === 0) {
      return { chunks: [], totalResults: 0 };
    }

    const categoryFilter = options.filters?.category;
    const collectionIds =
      options.collectionIds && options.collectionIds.length > 0 ? options.collectionIds : undefined;

    // Try FTS5 first (SQLite). Falls back to full scan when unavailable.
    let rows: ChunkRow[] = [];
    let usedFts = false;
    const candidateLimit = Math.min(2_000, Math.max(200, topK * 80));

    try {
      const sanitizedTerms = queryTerms
        .map((t) => t.replace(/[^a-z0-9_]+/g, '').trim())
        .filter(Boolean);
      const ftsQuery = sanitizedTerms.map((t) => `"${t.replace(/"/g, '""')}"`).join(' OR ');
      if (!ftsQuery) {
        return { chunks: [], totalResults: 0 };
      }

      let sql = `
        SELECT c.*
        FROM ${this.tablePrefix}chunks_fts fts
        JOIN ${this.tablePrefix}chunks c ON c.rowid = fts.rowid
      `;
      const params: any[] = [ftsQuery];

      if (categoryFilter) {
        sql += ` JOIN ${this.tablePrefix}documents d ON d.document_id = c.document_id`;
      }

      sql += ` WHERE fts MATCH ?`;

      if (categoryFilter) {
        sql += ` AND d.category = ?`;
        params.push(categoryFilter);
      }

      if (collectionIds) {
        const placeholders = collectionIds.map(() => '?').join(',');
        sql += ` AND c.collection_id IN (${placeholders})`;
        params.push(...collectionIds);
      }

      sql += ` ORDER BY bm25(${this.tablePrefix}chunks_fts) ASC LIMIT ?`;
      params.push(candidateLimit);

      rows = await adapter.all<ChunkRow>(sql, params);
      usedFts = true;
    } catch {
      // Fall back to scanning chunks (slower, but portable).
    }

    // Fallback query: full scan with optional collection filter.
    if (!usedFts) {
      let sql = `SELECT * FROM ${this.tablePrefix}chunks WHERE 1=1`;
      const params: any[] = [];

      if (collectionIds) {
        const placeholders = collectionIds.map(() => '?').join(',');
        sql += ` AND collection_id IN (${placeholders})`;
        params.push(...collectionIds);
      }

      rows = await adapter.all<ChunkRow>(sql, params);
    }

    // If filtering by document category and we couldn't push it down, prefetch categories once.
    let categoryByDocumentId: Map<string, string> | null = null;
    if (categoryFilter && !usedFts) {
      const docIds = Array.from(new Set(rows.map((r) => r.document_id).filter(Boolean)));
      if (docIds.length > 0) {
        const placeholders = docIds.map(() => '?').join(',');
        const docs = await adapter.all<{ document_id: string; category: string }>(
          `SELECT document_id, category FROM ${this.tablePrefix}documents WHERE document_id IN (${placeholders})`,
          docIds
        );
        categoryByDocumentId = new Map(docs.map((d) => [d.document_id, d.category]));
      } else {
        categoryByDocumentId = new Map();
      }
    }

    // Score and filter chunks
    const scoredChunks: Array<RagRetrievedChunk & { _score: number }> = [];

    for (const row of rows) {
      const metadata = row.metadata_json ? JSON.parse(row.metadata_json) : {};

      // Apply metadata filters (legacy semantics)
      if (options.filters) {
        if (options.filters.agentId && metadata.agentId !== options.filters.agentId) continue;
        if (options.filters.userId && metadata.userId !== options.filters.userId) continue;
        if (categoryFilter && categoryByDocumentId) {
          const docCategory = categoryByDocumentId.get(row.document_id);
          if (docCategory !== categoryFilter) continue;
        }
        if (options.filters.tags && options.filters.tags.length > 0) {
          const docTags = Array.isArray(metadata.tags) ? metadata.tags : [];
          if (!options.filters.tags.some((tag) => docTags.includes(tag))) continue;
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

    scoredChunks.sort((a, b) => b._score - a._score);
    const results = scoredChunks.slice(0, topK).map(({ _score, ...chunk }) => chunk);

    return {
      chunks: results,
      totalResults: scoredChunks.length,
    };
  }

  private async queryVectorInternal(
    adapter: StorageAdapter,
    options: RagQueryOptions
  ): Promise<{ chunks: RagRetrievedChunk[]; totalResults: number } | null> {
    // Vector store tables are local; embeddings may require network access.
    try {
      await this.ensureVectorStoreInitialized(adapter);
      await this.ensureEmbeddingsInitialized(adapter);
    } catch {
      return null;
    }

    if (!this.embeddingManager || !this.embeddingModel || !this.vectorStore) {
      return null;
    }

    const queryText = options.query.trim();
    if (!queryText) {
      return { chunks: [], totalResults: 0 };
    }

    const queryEmbeddingResp = await this.embeddingManager.generateEmbeddings({
      texts: queryText,
      modelId: this.embeddingModel.modelId,
    });
    const queryEmbedding = queryEmbeddingResp.embeddings?.[0];
    if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
      return null;
    }

    const preset = this.getRetrievalPreset();
    const hybridAlpha = this.getHybridAlpha();
    const shouldRerank = preset === 'accurate';

    const topK = options.topK || 5;
    const threshold =
      typeof options.similarityThreshold === 'number' ? options.similarityThreshold : 0;
    const maxPerCollection = Math.min(50, Math.max(topK * 4, topK));
    const collectionIds =
      options.collectionIds && options.collectionIds.length > 0
        ? options.collectionIds
        : ['default'];

    const vectorFilter: NonNullable<QueryOptions['filter']> = {};
    if (options.filters?.agentId) vectorFilter.agentId = options.filters.agentId;
    if (options.filters?.userId) vectorFilter.userId = options.filters.userId;
    const hasVectorFilter = Object.keys(vectorFilter).length > 0;

    type Candidate = {
      chunkId: string;
      documentId: string;
      content: string;
      score: number;
      metadata: any;
    };

    const candidates: Candidate[] = [];

    for (const collectionId of collectionIds) {
      try {
        await this.ensureVectorCollection(collectionId);
      } catch {
        continue;
      }

      try {
        if (preset === 'fast') {
          const result = await this.vectorStore.query(collectionId, queryEmbedding, {
            topK: maxPerCollection,
            includeTextContent: true,
            includeMetadata: true,
            filter: hasVectorFilter ? (vectorFilter as any) : undefined,
            minSimilarityScore: threshold,
          });
          for (const doc of result.documents) {
            const metadata = (doc.metadata ?? {}) as any;
            candidates.push({
              chunkId: doc.id,
              documentId:
                typeof metadata.__ragDocumentId === 'string' ? metadata.__ragDocumentId : doc.id,
              content: typeof doc.textContent === 'string' ? doc.textContent : '',
              score: typeof doc.similarityScore === 'number' ? doc.similarityScore : 0,
              metadata,
            });
          }
        } else if (typeof (this.vectorStore as any).hybridSearch === 'function') {
          const result = await (this.vectorStore as any).hybridSearch(
            collectionId,
            queryEmbedding,
            queryText,
            {
              topK: maxPerCollection,
              includeTextContent: true,
              includeMetadata: true,
              filter: hasVectorFilter ? (vectorFilter as any) : undefined,
              alpha: hybridAlpha,
              fusion: 'weighted',
              lexicalTopK: maxPerCollection * 3,
            }
          );

          for (const doc of (result.documents ?? []) as RetrievedVectorDocument[]) {
            const metadata = (doc.metadata ?? {}) as any;
            candidates.push({
              chunkId: doc.id,
              documentId:
                typeof metadata.__ragDocumentId === 'string' ? metadata.__ragDocumentId : doc.id,
              content: typeof doc.textContent === 'string' ? doc.textContent : '',
              score: typeof doc.similarityScore === 'number' ? doc.similarityScore : 0,
              metadata,
            });
          }
        } else {
          const result = await this.vectorStore.query(collectionId, queryEmbedding, {
            topK: maxPerCollection,
            includeTextContent: true,
            includeMetadata: true,
            filter: hasVectorFilter ? (vectorFilter as any) : undefined,
          });
          for (const doc of result.documents) {
            const metadata = (doc.metadata ?? {}) as any;
            candidates.push({
              chunkId: doc.id,
              documentId:
                typeof metadata.__ragDocumentId === 'string' ? metadata.__ragDocumentId : doc.id,
              content: typeof doc.textContent === 'string' ? doc.textContent : '',
              score: typeof doc.similarityScore === 'number' ? doc.similarityScore : 0,
              metadata,
            });
          }
        }
      } catch {
        // Ignore per-collection vector failures; keyword fallback may still cover the request.
      }
    }

    // Apply filters that are hard to push down (tags OR, doc category).
    const filtered = candidates.filter((candidate) => {
      const metadata = candidate.metadata ?? {};
      if (options.filters?.agentId && metadata.agentId !== options.filters.agentId) return false;
      if (options.filters?.userId && metadata.userId !== options.filters.userId) return false;
      if (options.filters?.category) {
        const cat = metadata.__ragDocumentCategory;
        if (typeof cat === 'string' && cat !== options.filters.category) return false;
      }
      if (options.filters?.tags && options.filters.tags.length > 0) {
        const docTags = Array.isArray(metadata.tags) ? metadata.tags : [];
        if (!options.filters.tags.some((tag) => docTags.includes(tag))) return false;
      }
      return true;
    });

    // Deduplicate by chunkId, keeping the best score.
    const bestById = new Map<string, Candidate>();
    for (const item of filtered) {
      const existing = bestById.get(item.chunkId);
      if (!existing || item.score > existing.score) {
        bestById.set(item.chunkId, item);
      }
    }

    let ranked = Array.from(bestById.values()).filter((item) => item.score >= threshold);
    ranked.sort((a, b) => b.score - a.score);

    // Rerank (optional; accuracy over latency).
    if (shouldRerank && this.rerankerService && ranked.length > 0) {
      const useCohere = Boolean(process.env.COHERE_API_KEY?.trim());
      const providerId = useCohere ? 'cohere' : 'local';
      const modelId = useCohere ? 'rerank-v3.5' : 'cross-encoder/ms-marco-MiniLM-L-6-v2';
      const maxDocuments = 40;
      const timeoutMs = 20_000;

      try {
        const rerankInput: RerankerInput = {
          query: queryText,
          documents: ranked.slice(0, maxDocuments).map((c) => ({
            id: c.chunkId,
            content: c.content,
            originalScore: c.score,
            metadata: c.metadata,
          })),
        };
        const output = await this.rerankerService.rerank(rerankInput, {
          providerId,
          modelId,
          topN: topK,
          maxDocuments,
          timeoutMs,
        });

        const byId = new Map(ranked.map((c) => [c.chunkId, c]));
        const reranked: Candidate[] = [];
        for (const res of output.results) {
          const original = byId.get(res.id);
          if (!original) continue;
          reranked.push({
            ...original,
            score: res.relevanceScore,
            metadata: {
              ...(original.metadata ?? {}),
              _rerankerOriginalScore: original.score,
              _rerankerProviderId: providerId,
            },
          });
        }

        // Fill remaining slots with original ranking if reranker returned fewer results.
        const included = new Set(reranked.map((r) => r.chunkId));
        for (const original of ranked) {
          if (reranked.length >= topK) break;
          if (included.has(original.chunkId)) continue;
          reranked.push(original);
        }

        ranked = reranked;
      } catch (rerankError: any) {
        if (!this.rerankWarningLogged) {
          this.rerankWarningLogged = true;
          const message = rerankError?.message ?? String(rerankError);
          console.warn(
            `[RAG Service] Reranking failed; returning results without reranking. ${message}`
          );
          if (
            typeof message === 'string' &&
            (message.includes('@huggingface/transformers') ||
              message.includes('@xenova/transformers'))
          ) {
            console.warn(
              `[RAG Service] Local reranking requires installing Transformers.js (optional): '@huggingface/transformers' (preferred) or '@xenova/transformers'.`
            );
          }
        }
      }
    }

    const results = ranked.slice(0, topK).map((candidate) => ({
      chunkId: candidate.chunkId,
      documentId: candidate.documentId,
      content: candidate.content,
      score: candidate.score,
      metadata: options.includeMetadata ? candidate.metadata : undefined,
    }));

    return {
      chunks: results,
      totalResults: ranked.length,
    };
  }

  async query(options: RagQueryOptions): Promise<RagQueryResult> {
    const adapter = await this.ensureInitialized();
    const startTime = Date.now();
    const topK = options.topK || 5;

    const vector = await this.queryVectorInternal(adapter, options);
    const keyword =
      vector && vector.chunks.length >= topK
        ? null
        : await this.queryKeywordInternal(adapter, options);

    const mergedById = new Map<string, RagRetrievedChunk>();
    for (const chunk of vector?.chunks ?? []) {
      mergedById.set(chunk.chunkId, chunk);
    }
    if (keyword) {
      for (const chunk of keyword.chunks) {
        const existing = mergedById.get(chunk.chunkId);
        if (!existing || chunk.score > existing.score) {
          mergedById.set(chunk.chunkId, chunk);
        }
      }
    }

    const merged = Array.from(mergedById.values());
    merged.sort((a, b) => b.score - a.score);

    return {
      success: true,
      query: options.query,
      chunks: merged.slice(0, topK),
      totalResults: merged.length,
      processingTimeMs: Date.now() - startTime,
    };
  }

  async graphRagLocalSearch(
    query: string,
    options?: GraphRAGSearchOptions
  ): Promise<LocalSearchResult> {
    const adapter = await this.ensureInitialized();
    const engine = await this.requireGraphRagEngine(adapter);
    const trimmed = String(query || '').trim();
    if (!trimmed) throw new Error('GraphRAG localSearch requires a non-empty query.');
    return engine.localSearch(trimmed, options);
  }

  async graphRagGlobalSearch(
    query: string,
    options?: GraphRAGSearchOptions
  ): Promise<GlobalSearchResult> {
    const adapter = await this.ensureInitialized();
    const engine = await this.requireGraphRagEngine(adapter);
    const trimmed = String(query || '').trim();
    if (!trimmed) throw new Error('GraphRAG globalSearch requires a non-empty query.');
    return engine.globalSearch(trimmed, options);
  }

  async graphRagStats(): Promise<Awaited<ReturnType<IGraphRAGEngine['getStats']>>> {
    const adapter = await this.ensureInitialized();
    const engine = await this.requireGraphRagEngine(adapter);
    return engine.getStats();
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

    // Capture chunk IDs for vector index cleanup before deleting.
    const chunkRows = await adapter.all<{ chunk_id: string }>(
      `SELECT chunk_id FROM ${this.tablePrefix}chunks WHERE document_id = ?`,
      [documentId]
    );
    const chunkIds = chunkRows.map((r) => r.chunk_id).filter(Boolean);

    // Delete chunks
    await adapter.run(`DELETE FROM ${this.tablePrefix}chunks WHERE document_id = ?`, [documentId]);

    // Delete document
    const result = await adapter.run(
      `DELETE FROM ${this.tablePrefix}documents WHERE document_id = ?`,
      [documentId]
    );

    // Best-effort: if this document is a derived multimodal asset, remove the asset row as well.
    try {
      await adapter.run(`DELETE FROM ${this.tablePrefix}media_assets WHERE asset_id = ?`, [
        documentId,
      ]);
    } catch {
      // Ignore; older schemas may not have the table.
    }

    // Update collection counts
    await this.updateCollectionCounts(adapter, doc.collection_id);

    // Best-effort: clean up vector index without forcing embeddings init.
    try {
      await this.ensureVectorStoreInitialized(adapter);
      if (chunkIds.length > 0) {
        await this.vectorStore?.delete(doc.collection_id, chunkIds);
      }
    } catch {
      // Ignore; canonical SQL deletes already happened.
    }

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
      .map((row) => {
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
      .filter((doc) => {
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

    const collectionStats = collections.map((c) => {
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
      const agentDocs = await adapter.all<{
        collection_id: string;
        doc_count: number;
        chunk_count: number;
      }>(
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
    try {
      await this.graphRagEngine?.shutdown();
    } catch {
      // Ignore.
    }
    try {
      await this.embeddingManager?.shutdown();
    } catch {
      // Ignore.
    }
    try {
      await this.vectorStore?.shutdown();
    } catch {
      // Ignore.
    }

    this.providerManager = undefined;
    this.providerManagerInitPromise = null;
    this.embeddingManager = undefined;
    this.embeddingModel = undefined;
    this.rerankerService = undefined;
    this.embeddingStatus = 'uninitialized';
    this.embeddingDisabledReason = undefined;
    this.embeddingInitPromise = null;

    this.vectorStore = null;
    this.vectorStoreInitialized = false;
    this.vectorStoreInitPromise = null;

    this.graphRagEngine = undefined;
    this.graphRagStatus = 'uninitialized';
    this.graphRagDisabledReason = undefined;
    this.graphRagInitPromise = null;
    this.graphRagWarningLogged = false;

    if (this.adapter) {
      await this.adapter.close();
      this.adapter = null;
    }
    this.initialized = false;
    this.initPromise = null;
    console.log('[RAG Service] Shut down');
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
   * Ingest an image into multimodal RAG (stores metadata + derived caption document).
   */
  async ingestImageAsset(
    input: Omit<RagMediaAssetInput, 'modality'>
  ): Promise<RagMediaIngestionResult> {
    return ragStore.ingestImageAsset(input);
  },

  /**
   * Ingest an audio file into multimodal RAG (stores metadata + derived transcript document).
   */
  async ingestAudioAsset(
    input: Omit<RagMediaAssetInput, 'modality'>
  ): Promise<RagMediaIngestionResult> {
    return ragStore.ingestAudioAsset(input);
  },

  /**
   * Ingest a multimodal asset into RAG by deriving a text representation.
   */
  async ingestMediaAsset(input: RagMediaAssetInput): Promise<RagMediaIngestionResult> {
    return ragStore.ingestMediaAsset(input);
  },

  /**
   * Query multimodal assets by searching their derived text representations.
   */
  async queryMediaAssets(options: RagMediaQueryOptions): Promise<RagMediaQueryResult> {
    return ragStore.queryMediaAssets(options);
  },

  /**
   * Get multimodal asset metadata by `assetId`.
   */
  async getMediaAsset(assetId: string): Promise<RagMediaAsset | null> {
    return ragStore.getMediaAsset(assetId);
  },

  /**
   * Get multimodal asset raw bytes (only available when `storePayload=true` at ingest time).
   */
  async getMediaAssetContent(
    assetId: string
  ): Promise<{ mimeType: string; buffer: Buffer } | null> {
    return ragStore.getMediaAssetContent(assetId);
  },

  /**
   * Delete a multimodal asset and its derived RAG document.
   */
  async deleteMediaAsset(assetId: string): Promise<boolean> {
    return ragStore.deleteMediaAsset(assetId);
  },

  /**
   * GraphRAG local search (entity + relationship context).
   * Disabled by default. Enable with `AGENTOS_GRAPHRAG_ENABLED=true`.
   */
  async graphRagLocalSearch(
    query: string,
    options?: GraphRAGSearchOptions
  ): Promise<LocalSearchResult> {
    return ragStore.graphRagLocalSearch(query, options);
  },

  /**
   * GraphRAG global search (community summaries).
   * Disabled by default. Enable with `AGENTOS_GRAPHRAG_ENABLED=true`.
   */
  async graphRagGlobalSearch(
    query: string,
    options?: GraphRAGSearchOptions
  ): Promise<GlobalSearchResult> {
    return ragStore.graphRagGlobalSearch(query, options);
  },

  /**
   * GraphRAG statistics.
   */
  async graphRagStats(): Promise<Awaited<ReturnType<IGraphRAGEngine['getStats']>>> {
    return ragStore.graphRagStats();
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
