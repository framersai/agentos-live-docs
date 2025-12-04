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

      // Generate document ID if not provided
      const documentId = body.documentId || `doc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      const collectionId = body.collectionId || 'default';

      // TODO: Integrate with actual RetrievalAugmentor when AgentOS RAG services are wired
      // For now, return a stub response indicating the endpoint is ready but RAG is not yet initialized
      console.log('[RAG Routes] Ingest request received:', {
        documentId,
        collectionId,
        contentLength: body.content.length,
        category: body.category,
        hasMetadata: !!body.metadata,
      });

      // Stub response - will be replaced with actual RAG integration
      const response: RagIngestResponse = {
        success: true,
        documentId,
        chunksCreated: 0, // Will be populated by actual ingestion
        collectionId,
        message: 'RAG ingestion endpoint ready. Full integration pending AgentOS RAG service initialization.',
      };

      return res.status(201).json(response);
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

      const startTime = Date.now();

      // TODO: Integrate with actual RetrievalAugmentor when AgentOS RAG services are wired
      console.log('[RAG Routes] Query request received:', {
        queryLength: body.query.length,
        topK: body.topK,
        collectionIds: body.collectionIds,
        hasFilters: !!body.filters,
      });

      // Stub response - will be replaced with actual RAG integration
      const response: RagQueryResponse = {
        success: true,
        query: body.query,
        chunks: [], // Will be populated by actual retrieval
        totalResults: 0,
        processingTimeMs: Date.now() - startTime,
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

      console.log('[RAG Routes] List documents request:', {
        collectionId,
        agentId,
        userId,
        limit,
        offset,
      });

      // Stub response - will be replaced with actual RAG integration
      const response = {
        success: true,
        documents: [] as RagDocumentSummary[],
        total: 0,
        limit: Number(limit) || 50,
        offset: Number(offset) || 0,
        message: 'RAG documents endpoint ready. Full integration pending.',
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

      console.log('[RAG Routes] Delete document request:', { documentId });

      // TODO: Integrate with actual RetrievalAugmentor
      // Stub response
      return res.status(200).json({
        success: true,
        documentId,
        message: 'Document deletion endpoint ready. Full integration pending.',
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

      console.log('[RAG Routes] Stats request:', { agentId });

      // Stub response - will be replaced with actual RAG integration
      const response: RagStatsResponse = {
        totalDocuments: 0,
        totalChunks: 0,
        collections: [],
        storageUsedBytes: 0,
      };

      return res.status(200).json({
        success: true,
        ...response,
        message: 'RAG stats endpoint ready. Full integration pending.',
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

      const { collectionId, displayName, metadata } = req.body;

      if (!collectionId || typeof collectionId !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'collectionId is required',
          error: 'INVALID_PAYLOAD',
        });
      }

      console.log('[RAG Routes] Create collection request:', {
        collectionId,
        displayName,
        hasMetadata: !!metadata,
      });

      // Stub response
      return res.status(201).json({
        success: true,
        collectionId,
        displayName: displayName || collectionId,
        message: 'Collection creation endpoint ready. Full integration pending.',
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /collections
   * List all collections in RAG memory.
   */
  router.get('/collections', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({
          success: false,
          message: 'AgentOS integration disabled',
          error: 'AGENTOS_DISABLED',
        });
      }

      console.log('[RAG Routes] List collections request');

      // Stub response
      return res.status(200).json({
        success: true,
        collections: [],
        message: 'Collections list endpoint ready. Full integration pending.',
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

      console.log('[RAG Routes] Delete collection request:', { collectionId });

      // Stub response
      return res.status(200).json({
        success: true,
        collectionId,
        message: 'Collection deletion endpoint ready. Full integration pending.',
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

      return res.status(200).json({
        status: isEnabled ? 'ready' : 'disabled',
        ragServiceInitialized: false, // Will be true when RAG services are wired
        vectorStoreConnected: false,
        embeddingServiceAvailable: false,
        message: isEnabled
          ? 'RAG routes mounted. Full service integration pending.'
          : 'AgentOS integration is disabled.',
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

export default createAgentOSRagRouter;

