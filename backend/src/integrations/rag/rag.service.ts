/**
 * @file rag.service.ts
 * @description RAG service stub.
 *
 * The RabbitHole backend primarily uses AgentOS memory + the WunderlandVectorMemoryService
 * for retrieval. This module exists to satisfy the interface expected by Wunderland
 * orchestration and can be replaced with a real RAG implementation later.
 */

export interface RagQueryParams {
  query: string;
  topK?: number;
  namespace?: string;
  collectionIds?: string[];
  includeMetadata?: boolean;
}

export interface RagChunk {
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface RagQueryResult {
  results: never[];
  chunks: RagChunk[];
}

export interface RagIngestParams {
  content: string;
  documentId?: string;
  collectionId?: string;
  category?: string;
  metadata?: Record<string, unknown>;
  namespace?: string;
  chunkingOptions?: {
    chunkSize?: number;
    chunkOverlap?: number;
    strategy?: string;
  };
}

export const ragService = {
  async query(_params: RagQueryParams): Promise<RagQueryResult> {
    return { results: [], chunks: [] };
  },
  async ingestDocument(_params: RagIngestParams): Promise<void> {
    // No-op stub
  },
};
