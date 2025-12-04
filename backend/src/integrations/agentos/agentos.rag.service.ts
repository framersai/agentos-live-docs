/**
 * @file agentos.rag.service.ts
 * @description RAG (Retrieval Augmented Generation) service for AgentOS.
 * Provides methods for document ingestion, retrieval, and memory management.
 * Acts as a bridge between the backend services and the AgentOS RAG infrastructure.
 *
 * @module AgentOSRagService
 * @version 1.0.0
 */

import { agentosService } from './agentos.integration.js';

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
 * In-memory document store for RAG operations.
 * This is a temporary implementation until the full AgentOS RAG services are wired.
 * 
 * @remarks
 * This will be replaced with actual vector store operations once the
 * VectorStoreManager, EmbeddingManager, and RetrievalAugmentor are
 * initialized in the AgentOS integration.
 */
class InMemoryRagStore {
  private documents: Map<string, {
    documentId: string;
    collectionId: string;
    content: string;
    chunks: Array<{ chunkId: string; content: string; embedding?: number[] }>;
    category: string;
    metadata: Record<string, unknown>;
    createdAt: number;
  }> = new Map();

  private collections: Map<string, {
    collectionId: string;
    displayName: string;
    documentCount: number;
    createdAt: number;
  }> = new Map();

  /**
   * Ingest a document into the in-memory store.
   */
  async ingest(input: RagDocumentInput): Promise<RagIngestionResult> {
    const documentId = input.documentId || `doc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const collectionId = input.collectionId || 'default';
    
    // Ensure collection exists
    if (!this.collections.has(collectionId)) {
      this.collections.set(collectionId, {
        collectionId,
        displayName: collectionId,
        documentCount: 0,
        createdAt: Date.now(),
      });
    }

    // Simple chunking by paragraphs or fixed size
    const chunkSize = input.chunkingOptions?.chunkSize || 512;
    const chunks = this.chunkContent(input.content, chunkSize);
    
    const chunksWithIds = chunks.map((content, index) => ({
      chunkId: `${documentId}_chunk_${index}`,
      content,
      // Embeddings would be generated here in full implementation
    }));

    this.documents.set(documentId, {
      documentId,
      collectionId,
      content: input.content,
      chunks: chunksWithIds,
      category: input.category || 'knowledge_base',
      metadata: {
        ...input.metadata,
        ingestedAt: Date.now(),
      },
      createdAt: Date.now(),
    });

    // Update collection document count
    const collection = this.collections.get(collectionId)!;
    collection.documentCount++;

    console.log(`[RAG Service] Ingested document ${documentId} into collection ${collectionId} with ${chunksWithIds.length} chunks`);

    return {
      success: true,
      documentId,
      collectionId,
      chunksCreated: chunksWithIds.length,
    };
  }

  /**
   * Query the in-memory store for relevant chunks.
   * Uses simple keyword matching until embeddings are available.
   */
  async query(options: RagQueryOptions): Promise<RagQueryResult> {
    const startTime = Date.now();
    const topK = options.topK || 5;
    const queryTerms = options.query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    
    const results: Array<RagRetrievedChunk & { matchScore: number }> = [];

    for (const doc of this.documents.values()) {
      // Apply collection filter
      if (options.collectionIds?.length && !options.collectionIds.includes(doc.collectionId)) {
        continue;
      }

      // Apply metadata filters
      if (options.filters) {
        if (options.filters.agentId && doc.metadata.agentId !== options.filters.agentId) continue;
        if (options.filters.userId && doc.metadata.userId !== options.filters.userId) continue;
        if (options.filters.category && doc.category !== options.filters.category) continue;
      }

      // Score each chunk by keyword matching (placeholder for embedding similarity)
      for (const chunk of doc.chunks) {
        const chunkLower = chunk.content.toLowerCase();
        const matchCount = queryTerms.reduce((count, term) => 
          count + (chunkLower.includes(term) ? 1 : 0), 0
        );
        
        if (matchCount > 0) {
          const score = matchCount / queryTerms.length;
          if (!options.similarityThreshold || score >= options.similarityThreshold) {
            results.push({
              chunkId: chunk.chunkId,
              documentId: doc.documentId,
              content: chunk.content,
              score,
              matchScore: score,
              metadata: options.includeMetadata ? doc.metadata : undefined,
            });
          }
        }
      }
    }

    // Sort by score and take top K
    results.sort((a, b) => b.matchScore - a.matchScore);
    const topResults = results.slice(0, topK);

    return {
      success: true,
      query: options.query,
      chunks: topResults.map(({ matchScore, ...chunk }) => chunk),
      totalResults: results.length,
      processingTimeMs: Date.now() - startTime,
    };
  }

  /**
   * Delete a document from the store.
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    const doc = this.documents.get(documentId);
    if (!doc) return false;

    const collection = this.collections.get(doc.collectionId);
    if (collection) {
      collection.documentCount--;
    }

    this.documents.delete(documentId);
    console.log(`[RAG Service] Deleted document ${documentId}`);
    return true;
  }

  /**
   * Get statistics about the RAG memory.
   */
  getStats(agentId?: string): RagMemoryStats {
    const collectionsMap = new Map<string, { documentCount: number; chunkCount: number }>();

    for (const doc of this.documents.values()) {
      if (agentId && doc.metadata.agentId !== agentId) continue;

      const existing = collectionsMap.get(doc.collectionId) || { documentCount: 0, chunkCount: 0 };
      existing.documentCount++;
      existing.chunkCount += doc.chunks.length;
      collectionsMap.set(doc.collectionId, existing);
    }

    const collections = Array.from(collectionsMap.entries()).map(([collectionId, stats]) => ({
      collectionId,
      ...stats,
    }));

    return {
      totalDocuments: agentId 
        ? collections.reduce((sum, c) => sum + c.documentCount, 0)
        : this.documents.size,
      totalChunks: collections.reduce((sum, c) => sum + c.chunkCount, 0),
      collections,
    };
  }

  /**
   * List documents, optionally filtered.
   */
  listDocuments(filters?: { collectionId?: string; agentId?: string; userId?: string }): Array<{
    documentId: string;
    collectionId: string;
    category: string;
    chunkCount: number;
    metadata: Record<string, unknown>;
    createdAt: number;
  }> {
    const results = [];

    for (const doc of this.documents.values()) {
      if (filters?.collectionId && doc.collectionId !== filters.collectionId) continue;
      if (filters?.agentId && doc.metadata.agentId !== filters.agentId) continue;
      if (filters?.userId && doc.metadata.userId !== filters.userId) continue;

      results.push({
        documentId: doc.documentId,
        collectionId: doc.collectionId,
        category: doc.category,
        chunkCount: doc.chunks.length,
        metadata: doc.metadata,
        createdAt: doc.createdAt,
      });
    }

    return results;
  }

  /**
   * Create or update a collection.
   */
  createCollection(collectionId: string, displayName?: string): void {
    if (!this.collections.has(collectionId)) {
      this.collections.set(collectionId, {
        collectionId,
        displayName: displayName || collectionId,
        documentCount: 0,
        createdAt: Date.now(),
      });
    }
  }

  /**
   * List all collections.
   */
  listCollections(): Array<{ collectionId: string; displayName: string; documentCount: number }> {
    return Array.from(this.collections.values()).map(c => ({
      collectionId: c.collectionId,
      displayName: c.displayName,
      documentCount: c.documentCount,
    }));
  }

  /**
   * Delete a collection and all its documents.
   */
  deleteCollection(collectionId: string): boolean {
    if (!this.collections.has(collectionId)) return false;

    // Delete all documents in the collection
    for (const [docId, doc] of this.documents.entries()) {
      if (doc.collectionId === collectionId) {
        this.documents.delete(docId);
      }
    }

    this.collections.delete(collectionId);
    return true;
  }

  /**
   * Simple content chunking by character count with overlap.
   */
  private chunkContent(content: string, chunkSize: number, overlap = 50): string[] {
    const chunks: string[] = [];
    
    // Try to split by paragraphs first
    const paragraphs = content.split(/\n\n+/);
    
    let currentChunk = '';
    for (const paragraph of paragraphs) {
      if (currentChunk.length + paragraph.length <= chunkSize) {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        
        // If single paragraph is larger than chunk size, split it
        if (paragraph.length > chunkSize) {
          const sentences = paragraph.split(/(?<=[.!?])\s+/);
          currentChunk = '';
          for (const sentence of sentences) {
            if (currentChunk.length + sentence.length <= chunkSize) {
              currentChunk += (currentChunk ? ' ' : '') + sentence;
            } else {
              if (currentChunk) chunks.push(currentChunk.trim());
              currentChunk = sentence;
            }
          }
        } else {
          currentChunk = paragraph;
        }
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [content];
  }
}

// Singleton instance
const ragStore = new InMemoryRagStore();

/**
 * RAG Service - Main interface for RAG operations.
 * 
 * @remarks
 * Currently uses an in-memory store. Once AgentOS RAG services are fully
 * initialized, this will delegate to the RetrievalAugmentor.
 */
export const ragService = {
  /**
   * Check if RAG services are available.
   */
  isAvailable(): boolean {
    // For now, always available with in-memory store
    // Will check for AgentOS RAG service availability later
    return true;
  },

  /**
   * Ingest a document into RAG memory.
   * 
   * @param input - Document to ingest
   * @returns Ingestion result
   * 
   * @example
   * const result = await ragService.ingestDocument({
   *   content: 'Important information about...',
   *   collectionId: 'agent-123',
   *   metadata: { agentId: '123', userId: 'user-456' }
   * });
   */
  async ingestDocument(input: RagDocumentInput): Promise<RagIngestionResult> {
    try {
      return await ragStore.ingest(input);
    } catch (error) {
      console.error('[RAG Service] Ingestion failed:', error);
      return {
        success: false,
        documentId: input.documentId || 'unknown',
        collectionId: input.collectionId || 'default',
        chunksCreated: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Query RAG memory for relevant context.
   * 
   * @param options - Query options
   * @returns Retrieved chunks
   */
  async query(options: RagQueryOptions): Promise<RagQueryResult> {
    try {
      return await ragStore.query(options);
    } catch (error) {
      console.error('[RAG Service] Query failed:', error);
      return {
        success: false,
        query: options.query,
        chunks: [],
        totalResults: 0,
        processingTimeMs: 0,
      };
    }
  },

  /**
   * Delete a document from RAG memory.
   * 
   * @param documentId - Document to delete
   * @returns True if deleted
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    return ragStore.deleteDocument(documentId);
  },

  /**
   * Get RAG memory statistics.
   * 
   * @param agentId - Optional agent ID to filter stats
   * @returns Memory statistics
   */
  getStats(agentId?: string): RagMemoryStats {
    return ragStore.getStats(agentId);
  },

  /**
   * List documents in RAG memory.
   */
  listDocuments(filters?: { collectionId?: string; agentId?: string; userId?: string }) {
    return ragStore.listDocuments(filters);
  },

  /**
   * Create a collection.
   */
  createCollection(collectionId: string, displayName?: string): void {
    ragStore.createCollection(collectionId, displayName);
  },

  /**
   * List all collections.
   */
  listCollections() {
    return ragStore.listCollections();
  },

  /**
   * Delete a collection.
   */
  deleteCollection(collectionId: string): boolean {
    return ragStore.deleteCollection(collectionId);
  },

  /**
   * Ingest knowledge document for an agent.
   * Convenience method that sets appropriate collection and metadata.
   * 
   * @param agentId - Agent ID
   * @param userId - User ID
   * @param knowledgeId - Knowledge document ID
   * @param content - Document content
   * @param metadata - Additional metadata
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
};

export default ragService;

