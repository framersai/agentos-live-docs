// File: backend/agentos/rag/IRetrievalAugmentor.ts
/**
 * @fileoverview Defines the IRetrievalAugmentor interface, which serves as the
 * primary contract for the Retrieval Augmented Generation (RAG) system in AgentOS.
 * This system is responsible for ingesting, managing, and retrieving relevant
 * information from various data sources to augment the prompts provided to LLMs,
 * thereby enhancing their contextual awareness and factual accuracy.
 *
 * The IRetrievalAugmentor orchestrates underlying components such as EmbeddingManagers,
 * VectorStores, and document processing utilities.
 *
 * @module backend/agentos/rag/IRetrievalAugmentor
 */

import { IEmbeddingManager } from './IEmbeddingManager'; // To be defined as part of P1 RAG system
import { IVectorStore } from './IVectorStore'; // To be defined as part of P1 RAG system

/**
 * Represents a unit of text content to be ingested into the RAG system.
 * @interface RagDocumentInput
 */
export interface RagDocumentInput {
  /** A unique identifier for this document within its source. */
  id: string;
  /** The textual content of the document. */
  content: string;
  /** Optional: The source of the document (e.g., URL, file path, database ID). */
  source?: string;
  /**
   * Optional: Rich metadata associated with the document.
   * This metadata can be used for filtering during retrieval and for providing context.
   * Values should generally be simple types (string, number, boolean) or arrays of these for vector store compatibility.
   */
  metadata?: Record<string, string | number | boolean | string[] | number[] | boolean[]>;
  /** Optional: The language of the document content (ISO 639-1 code, e.g., "en", "es"). */
  language?: string;
  /** Optional: Timestamp of when the document was last modified or created. */
  timestamp?: string; // ISO 8601 date string
  /** Optional: An explicit embedding vector for this document, if pre-computed. */
  embedding?: number[];
  /** Optional: The ID of the embedding model used if `embedding` is provided. */
  embeddingModelId?: string;
}

/**
 * Configuration for the ingestion process.
 * @interface RagIngestionOptions
 */
export interface RagIngestionOptions {
  /**
   * The ID of the data source or collection within the RAG system where these documents should be stored.
   * If not provided, a default or globally configured data source might be used.
   */
  dataSourceId?: string;
  /**
   * Strategy for handling documents with duplicate IDs.
   * 'overwrite': Replace the existing document.
   * 'skip': Ignore the new document if an ID conflict occurs.
   * 'error': Throw an error on ID conflict.
   * @default 'overwrite'
   */
  duplicateHandling?: 'overwrite' | 'skip' | 'error';
  /**
   * Configuration for document chunking.
   * If not provided, the RetrievalAugmentor might use a default strategy or not chunk if content is small.
   */
  chunkingStrategy?: {
    type: 'fixed_size' | 'semantic' | 'recursive_character' | 'none'; // 'none' means treat whole content as one chunk
    chunkSize?: number; // e.g., number of tokens or characters
    chunkOverlap?: number;
    // Additional parameters for specific chunking types
    [key: string]: any;
  };
  /**
   * The ID of the embedding model to use for generating embeddings for these documents,
   * if not pre-computed or if re-embedding is desired.
   * If not provided, a default embedding model configured for the RAG system or data source will be used.
   */
  embeddingModelId?: string;
  /**
   * Whether to process ingestion asynchronously.
   * If true, the method might return quickly while ingestion happens in the background.
   * @default true
   */
  async?: boolean;
  /** Batch size for processing documents during ingestion, if applicable. */
  batchSize?: number;
}

/**
 * Represents a retrieved document chunk with its content, metadata, and relevance score.
 * @interface RagRetrievedChunk
 */
export interface RagRetrievedChunk {
  /** Unique identifier for this chunk (often derived from document ID and chunk index). */
  id: string;
  /** The textual content of the retrieved chunk. */
  content: string;
  /** The source of the original document. */
  source?: string;
  /** Metadata associated with the original document and/or this specific chunk. */
  metadata?: Record<string, unknown>;
  /**
   * A score indicating the relevance of this chunk to the query.
   * The nature of this score (e.g., cosine similarity, MMR score) depends on the retrieval strategy.
   */
  relevanceScore: number;
  /** Original document ID from which this chunk originated. */
  originalDocumentId?: string;
  /** Optional: The embedding vector of this chunk, if needed by downstream processes. */
  embedding?: number[];
}

/**
 * Options for the retrieval process.
 * @interface RagRetrievalOptions
 */
export interface RagRetrievalOptions {
  /**
   * The ID of the data source or collection to query.
   * If not provided, queries might search across all accessible/default data sources.
   */
  dataSourceIds?: string[]; // Query one or more specific data sources
  /**
   * The number of top relevant chunks to retrieve.
   * @default 5
   */
  topK?: number;
  /**
   * Metadata filters to apply during retrieval. Only chunks whose documents match these
   * metadata criteria will be considered.
   * The structure is `Record<string, MetadataValueType>`.
   * Example: `{ "category": "api_docs", "version": "2.0" }`
   */
  metadataFilter?: Record<string, string | number | boolean | string[] | { $in: (string|number|boolean)[] } | { $nin: (string|number|boolean)[] } | { $exists: boolean }>;
  /**
   * The retrieval strategy to use.
   * 'similarity': Standard vector similarity search.
   * 'mmr': Maximal Marginal Relevance to balance relevance and diversity.
   * 'hybrid': Combines keyword search with vector similarity (requires underlying support).
   * @default 'similarity'
   */
  strategy?: 'similarity' | 'mmr' | 'hybrid';
  /** Parameters specific to the chosen retrieval strategy (e.g., MMR lambda factor). */
  strategyParams?: {
    mmrLambda?: number; // For MMR: diversity vs relevance (0.0 to 1.0)
    hybridAlpha?: number; // For hybrid: weight of keyword vs semantic (0.0 to 1.0)
    [key: string]: any;
  };
  /**
   * The ID of the embedding model to use for embedding the query, if different from the default.
   * This should ideally match the model used for indexing the documents being queried.
   */
  queryEmbeddingModelId?: string;
  /**
   * Configuration for an optional re-ranking step applied to the initial retrieval results.
   */
  rerankerConfig?: {
    enabled: boolean;
    modelId: string; // e.g., "cohere/rerank-english-v2.0", or an LLM model used for reranking
    topN?: number; // Number of results to keep after reranking
    providerId?: string; // If reranker model is on a specific provider
  };
  /**
   * Whether to include the embedding vectors of the retrieved chunks in the result.
   * @default false
   */
  includeEmbeddings?: boolean;
}

/**
 * Result of an ingestion operation.
 * @interface RagIngestionResult
 */
export interface RagIngestionResult {
  /** Number of documents successfully processed and submitted for ingestion. */
  processedCount: number;
  /** Number of documents that failed during processing or submission. */
  failedCount: number;
  /** IDs of documents that were successfully submitted for ingestion. */
  ingestedIds?: string[];
  /** Optional details about any failures. */
  errors?: Array<{ documentId?: string; message: string; details?: unknown }>;
  /** A job ID if ingestion is processed asynchronously in the background. */
  jobId?: string;
}

/**
 * Result of a retrieval operation.
 * @interface RagRetrievalResult
 */
export interface RagRetrievalResult {
  /** Array of retrieved document chunks, ordered by relevance (after potential reranking). */
  retrievedChunks: RagRetrievedChunk[];
  /** Optional: The query embedding vector used for the search. */
  queryEmbedding?: number[];
  /** Metadata about the retrieval process (e.g., time taken, strategy used). */
  metadata?: {
    retrievalTimeMs?: number;
    rerankingTimeMs?: number;
    strategyUsed?: RagRetrievalOptions['strategy'];
    dataSourceHits?: Record<string, number>; // dataSourceId -> number of hits from that source
  };
}

/**
 * Configuration for the RetrievalAugmentor instance.
 * @interface RetrievalAugmentorConfig
 */
export interface RetrievalAugmentorConfig {
  /** Default embedding model ID to use for ingestion and querying if not specified. */
  defaultEmbeddingModelId: string;
  /** Default data source ID to use if none is specified in operations. */
  defaultDataSourceId?: string;
  /** Default chunking strategy for ingestion if not specified per operation. */
  defaultChunkingStrategy?: RagIngestionOptions['chunkingStrategy'];
  /** Default retrieval options to apply if not overridden. */
  defaultRetrievalOptions?: Partial<RagRetrievalOptions>;
  /**
   * Reference to an EmbeddingManager instance.
   * This dependency is crucial for converting text to vectors.
   */
  embeddingManager: IEmbeddingManager; // This will be defined in its own P1 file.
  /**
   * Reference to a VectorStoreManager or a direct IVectorStore instance.
   * This dependency handles the storage and querying of vector embeddings.
   */
  vectorStore: IVectorStore; // Or IVectorStoreManager. This will be defined in its own P1 file.
}

/**
 * @interface IRetrievalAugmentor
 * Defines the contract for the RAG system's primary orchestrator.
 * It handles the ingestion of documents, their conversion into searchable embeddings,
 * and the retrieval of relevant context based on input queries.
 */
export interface IRetrievalAugmentor {
  /** A unique identifier for this RetrievalAugmentor instance or configuration. */
  readonly augmenterId: string;

  /**
   * Initializes the RetrievalAugmentor with its configuration and dependencies.
   * This may involve setting up connections to vector stores or loading models.
   * @async
   * @param {RetrievalAugmentorConfig} config - Configuration for the RAG system.
   * @returns {Promise<void>} A promise that resolves upon successful initialization.
   * @throws {Error} If initialization fails (e.g., cannot connect to vector store, invalid config).
   */
  initialize(config: RetrievalAugmentorConfig): Promise<void>;

  /**
   * Ingests one or more documents into the RAG system.
   * This process typically involves:
   * 1. (Optional) Chunking the document content.
   * 2. Generating embeddings for each chunk (or the whole document if not chunked).
   * 3. Storing the chunks/documents and their embeddings in a vector store, along with metadata.
   *
   * @async
   * @param {RagDocumentInput | RagDocumentInput[]} documents - A single document or an array of documents to ingest.
   * @param {RagIngestionOptions} [options] - Options to control the ingestion process (e.g., chunking, duplicate handling).
   * @returns {Promise<RagIngestionResult>} A summary of the ingestion operation.
   * @throws {Error} If a critical error occurs during ingestion.
   */
  ingestDocuments(
    documents: RagDocumentInput | RagDocumentInput[],
    options?: RagIngestionOptions
  ): Promise<RagIngestionResult>;

  /**
   * Retrieves relevant document chunks from the RAG system based on a query.
   * This process typically involves:
   * 1. Embedding the input query using an appropriate model.
   * 2. Performing a similarity search (or other strategy) in the vector store.
   * 3. (Optional) Applying metadata filters.
   * 4. (Optional) Re-ranking the results for improved relevance and diversity.
   *
   * @async
   * @param {string} queryText - The textual query for which to retrieve context.
   * @param {RagRetrievalOptions} [options] - Options to control the retrieval process (e.g., topK, filters, strategy).
   * @returns {Promise<RagRetrievalResult>} The set of retrieved document chunks and related metadata.
   * @throws {Error} If the retrieval process fails.
   */
  retrieveContext(
    queryText: string,
    options?: RagRetrievalOptions
  ): Promise<RagRetrievalResult>;

  /**
   * Deletes documents (and their associated chunks/embeddings) from the RAG system.
   * @async
   * @param {string | string[]} documentIds - A single document ID or an array of document IDs to delete.
   * @param {string} [dataSourceId] - Optional: The specific data source from which to delete. If not provided,
   * the system may try to find and delete the document across all accessible sources or use a default.
   * @returns {Promise<{ successCount: number; failureCount: number; errors?: Array<{ documentId: string; message: string}> }>}
   * A summary of the deletion operation.
   * @throws {Error} If a critical error occurs during deletion.
   */
  deleteDocuments(
    documentIds: string | string[],
    dataSourceId?: string
  ): Promise<{ successCount: number; failureCount: number; errors?: Array<{ documentId: string; message: string}> }>;

  /**
   * Updates existing documents in the RAG system. This might involve re-chunking,
   * re-embedding, and updating metadata. Essentially a delete followed by an ingest.
   * @async
   * @param {RagDocumentInput | RagDocumentInput[]} documents - Document(s) to update, identified by their `id`.
   * @param {RagIngestionOptions} [options] - Options for the update process, similar to ingestion.
   * `duplicateHandling` might be implicitly 'overwrite'.
   * @returns {Promise<RagIngestionResult>} A summary of the update operation.
   * @throws {Error} If the update fails.
   */
  updateDocuments(
    documents: RagDocumentInput | RagDocumentInput[],
    options?: RagIngestionOptions
  ): Promise<RagIngestionResult>;

  /**
   * Checks the health and status of the RAG system, including its underlying
   * vector store and embedding model connections.
   * @async
   * @returns {Promise<{ isHealthy: boolean; details?: Record<string, unknown> }>} Health status and optional details.
   */
  checkHealth(): Promise<{ isHealthy: boolean; details?: Record<string, unknown> }>;

  /**
   * Gracefully shuts down the RetrievalAugmentor, releasing any resources.
   * @async
   * @returns {Promise<void>}
   */
  shutdown(): Promise<void>;
}