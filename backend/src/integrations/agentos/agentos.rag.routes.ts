/**
 * @file agentos.rag.routes.ts
 * @description REST API routes for AgentOS RAG (Retrieval Augmented Generation) operations.
 * Provides endpoints for document ingestion, retrieval queries, and memory management.
 *
 * @module AgentOSRagRoutes
 * @version 1.0.0
 *
 * @example
 * // Mount routes in main AgentOS router:
 * import { createAgentOSRagRouter } from './agentos.rag.routes.js';
 * router.use('/rag', createAgentOSRagRouter());
 */

import { Router, type Request, type Response, type NextFunction } from 'express';
import { agentosChatAdapterEnabled } from './agentos.chat-adapter.js';
import { ragService } from './agentos.rag.service.js';

/**
 * Request payload for document ingestion into RAG memory.
 */
export interface RagIngestRequest {
  /** Unique identifier for the document */
  documentId?: string;
  /** Text content to ingest */
  content: string;
  /** Collection/namespace to store the document in */
  collectionId?: string;
  /** Document metadata for filtering and attribution */
  metadata?: {
    agentId?: string;
    userId?: string;
    type?: string;
    tags?: string[];
    source?: string;
    [key: string]: unknown;
  };
  /** Category of memory (conversation, knowledge, etc.) */
  category?: 'conversation_memory' | 'knowledge_base' | 'user_notes' | 'system' | 'custom';
  /** Chunking configuration */
  chunkingOptions?: {
    chunkSize?: number;
    chunkOverlap?: number;
    strategy?: 'fixed' | 'semantic' | 'sentence';
  };
}

/**
 * Response from document ingestion.
 */
export interface RagIngestResponse {
  success: boolean;
  documentId: string;
  chunksCreated: number;
  collectionId: string;
  message?: string;
}

/**
 * Request payload for querying RAG memory.
 */
export interface RagQueryRequest {
  /** The query text to find relevant context for */
  query: string;
  /** Collection(s) to search in */
  collectionIds?: string[];
  /** Maximum number of chunks to retrieve */
  topK?: number;
  /** Minimum similarity score threshold (0-1) */
  similarityThreshold?: number;
  /** Metadata filters */
  filters?: {
    agentId?: string;
    userId?: string;
    category?: string;
    tags?: string[];
    [key: string]: unknown;
  };
  /** Include document metadata in results */
  includeMetadata?: boolean;
}

/**
 * A single retrieved chunk from RAG query.
 */
export interface RagRetrievedChunk {
  /** Unique chunk identifier */
  chunkId: string;
  /** Parent document identifier */
  documentId: string;
  /** The text content of the chunk */
  content: string;
  /** Similarity score (0-1) */
  score: number;
  /** Chunk metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Response from RAG query.
 */
export interface RagQueryResponse {
  success: boolean;
  query: string;
  chunks: RagRetrievedChunk[];
  totalResults: number;
  processingTimeMs: number;
}

/**
 * Document summary for listing.
 */
export interface RagDocumentSummary {
  documentId: string;
  collectionId: string;
  chunkCount: number;
  category?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * RAG memory statistics.
 */
export interface RagStatsResponse {
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
 * Creates the Express router for RAG API endpoints.
 *
 * @returns {Router} Express router with RAG endpoints mounted
 *
 * @example
 * const ragRouter = createAgentOSRagRouter();
 * app.use('/api/agentos/rag', ragRouter);
 */
export const createAgentOSRagRouter = (): Router => {
  const router = Router();

  /**
   * POST /ingest
   * Ingest a document into RAG memory.
   *
   * @description Processes text content, generates embeddings, and stores
   * in the configured vector store. Supports chunking strategies and metadata.
   */
  router.post('/ingest', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({
          success: false,
          message: 'AgentOS integration disabled',
          error: 'AGENTOS_DISABLED',
        });
      }

      const body = req.body as RagIngestRequest;

      // Validate required fields
      if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'content is required and must be a non-empty string',
          error: 'INVALID_PAYLOAD',
        });
      }

      // Ingest using the RAG service
      const result = await ragService.ingestDocument({
        documentId: body.documentId,
        content: body.content,
        collectionId: body.collectionId,
        category: body.category,
        metadata: body.metadata,
        chunkingOptions: body.chunkingOptions,
      });

      const response: RagIngestResponse = {
        success: result.success,
        documentId: result.documentId,
        chunksCreated: result.chunksCreated,
        collectionId: result.collectionId,
        message: result.error || (result.success ? 'Document ingested successfully' : 'Ingestion failed'),
      };

      return res.status(result.success ? 201 : 500).json(response);
    } catch (error) {
      next(error);
    }
  });

  /**
   * POST /query
   * Query RAG memory for relevant context.
   *
   * @description Generates embedding for the query, performs similarity search,
   * and returns the most relevant chunks from the vector store.
   */
  router.post('/query', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({
          success: false,
          message: 'AgentOS integration disabled',
          error: 'AGENTOS_DISABLED',
        });
      }

      const body = req.body as RagQueryRequest;

      // Validate required fields
      if (!body.query || typeof body.query !== 'string' || body.query.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'query is required and must be a non-empty string',
          error: 'INVALID_PAYLOAD',
        });
      }

      // Query using the RAG service
      const result = await ragService.query({
        query: body.query,
        collectionIds: body.collectionIds,
        topK: body.topK,
        similarityThreshold: body.similarityThreshold,
        filters: body.filters,
        includeMetadata: body.includeMetadata,
      });

      const response: RagQueryResponse = {
        success: result.success,
        query: result.query,
        chunks: result.chunks,
        totalResults: result.totalResults,
        processingTimeMs: result.processingTimeMs,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /documents
   * List documents in RAG memory.
   *
   * @description Returns a paginated list of documents stored in RAG memory,
   * optionally filtered by collection, agent, or user.
   */
  router.get('/documents', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({
          success: false,
          message: 'AgentOS integration disabled',
          error: 'AGENTOS_DISABLED',
        });
      }

      const { collectionId, agentId, userId, limit, offset } = req.query;

      // Get documents from RAG service
      const documents = await ragService.listDocuments({
        collectionId: collectionId as string | undefined,
        agentId: agentId as string | undefined,
        userId: userId as string | undefined,
      });

      // Apply pagination
      const limitNum = Number(limit) || 50;
      const offsetNum = Number(offset) || 0;
      const paginatedDocs = documents.slice(offsetNum, offsetNum + limitNum);

      const response = {
        success: true,
        documents: paginatedDocs.map(doc => ({
          documentId: doc.documentId,
          collectionId: doc.collectionId,
          chunkCount: doc.chunkCount,
          category: doc.category,
          metadata: doc.metadata,
          createdAt: new Date(doc.createdAt).toISOString(),
          updatedAt: new Date(doc.createdAt).toISOString(),
        })) as RagDocumentSummary[],
        total: documents.length,
        limit: limitNum,
        offset: offsetNum,
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  /**
   * DELETE /documents/:documentId
   * Delete a document from RAG memory.
   *
   * @description Removes a document and all its chunks from the vector store.
   */
  router.delete('/documents/:documentId', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({
          success: false,
          message: 'AgentOS integration disabled',
          error: 'AGENTOS_DISABLED',
        });
      }

      const { documentId } = req.params;

      if (!documentId) {
        return res.status(400).json({
          success: false,
          message: 'documentId is required',
          error: 'INVALID_PARAMS',
        });
      }

      const deleted = await ragService.deleteDocument(documentId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          documentId,
          message: 'Document not found',
        });
      }

      return res.status(200).json({
        success: true,
        documentId,
        message: 'Document deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /stats
   * Get RAG memory statistics.
   *
   * @description Returns aggregate statistics about RAG memory usage,
   * including document counts, chunk counts, and storage usage.
   */
  router.get('/stats', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({
          success: false,
          message: 'AgentOS integration disabled',
          error: 'AGENTOS_DISABLED',
        });
      }

      const { agentId } = req.query;
      const stats = await ragService.getStats(agentId as string | undefined);

      return res.status(200).json({
        success: true,
        storageAdapter: ragService.getAdapterKind(),
        ...stats,
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * POST /collections
   * Create a new collection/namespace in RAG memory.
   *
   * @description Creates a new collection for organizing documents.
   * Collections provide isolation between different agents or use cases.
   */
  router.post('/collections', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({
          success: false,
          message: 'AgentOS integration disabled',
          error: 'AGENTOS_DISABLED',
        });
      }

      const { collectionId, displayName } = req.body;

      if (!collectionId || typeof collectionId !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'collectionId is required',
          error: 'INVALID_PAYLOAD',
        });
      }

      await ragService.createCollection(collectionId, displayName);

      return res.status(201).json({
        success: true,
        collectionId,
        displayName: displayName || collectionId,
        message: 'Collection created successfully',
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /collections
   * List all collections in RAG memory.
   */
  router.get('/collections', async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({
          success: false,
          message: 'AgentOS integration disabled',
          error: 'AGENTOS_DISABLED',
        });
      }

      const collections = await ragService.listCollections();

      return res.status(200).json({
        success: true,
        collections,
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * DELETE /collections/:collectionId
   * Delete a collection and all its documents.
   */
  router.delete('/collections/:collectionId', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({
          success: false,
          message: 'AgentOS integration disabled',
          error: 'AGENTOS_DISABLED',
        });
      }

      const { collectionId } = req.params;

      if (!collectionId) {
        return res.status(400).json({
          success: false,
          message: 'collectionId is required',
          error: 'INVALID_PARAMS',
        });
      }

      const deleted = await ragService.deleteCollection(collectionId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          collectionId,
          message: 'Collection not found',
        });
      }

      return res.status(200).json({
        success: true,
        collectionId,
        message: 'Collection deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /health
   * Check RAG service health.
   */
  router.get('/health', async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const isEnabled = agentosChatAdapterEnabled();
      
      // Try to initialize if not already
      let ragAvailable = ragService.isAvailable();
      let adapterKind = 'not-initialized';
      let stats = null;
      
      if (isEnabled && !ragAvailable) {
        try {
          await ragService.initialize();
          ragAvailable = ragService.isAvailable();
        } catch (initError) {
          console.warn('[RAG Routes] Health check init failed:', initError);
        }
      }

      if (ragAvailable) {
        adapterKind = ragService.getAdapterKind();
        try {
          stats = await ragService.getStats();
        } catch (statsError) {
          console.warn('[RAG Routes] Stats fetch failed:', statsError);
        }
      }

      return res.status(200).json({
        status: isEnabled && ragAvailable ? 'ready' : isEnabled ? 'initializing' : 'disabled',
        ragServiceInitialized: ragAvailable,
        storageAdapter: adapterKind,
        vectorStoreConnected: ragAvailable,
        embeddingServiceAvailable: false, // Embeddings not yet integrated (using keyword matching)
        stats: stats ? {
          totalDocuments: stats.totalDocuments,
          totalChunks: stats.totalChunks,
          collectionCount: stats.collections.length,
        } : null,
        message: isEnabled
          ? ragAvailable
            ? `RAG service ready (using ${adapterKind} storage)`
            : 'RAG service initializing'
          : 'AgentOS integration is disabled.',
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

export default createAgentOSRagRouter;

