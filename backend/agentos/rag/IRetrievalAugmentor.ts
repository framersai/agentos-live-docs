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

import { IEmbeddingManager } from './IEmbeddingManager.js'; // To be defined as part of P1 RAG system
import { IVectorStore } from './IVectorStore.js'; // To be defined as part of P1 RAG system

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
}/**
 * @fileoverview Defines the IRetrievalAugmentor interface, which serves as the
 * primary contract for the Retrieval Augmented Generation (RAG) system in AgentOS.
 * This system is responsible for ingesting, managing, and retrieving relevant
 * information from various data sources to augment the prompts provided to LLMs,
 * thereby enhancing their contextual awareness and factual accuracy.
 *
 * The IRetrievalAugmentor orchestrates underlying components such as IEmbeddingManager
 * and IVectorStoreManager (or direct IVectorStore instances), along with document
 * processing utilities.
 *
 * @module backend/agentos/rag/IRetrievalAugmentor
 * @see ./IEmbeddingManager.ts
 * @see ./IVectorStoreManager.ts
 * @see ./IVectorStore.ts
 * @see ../config/RetrievalAugmentorConfiguration.ts for `RetrievalAugmentorServiceConfig`.
 */

import { IEmbeddingManager } from './IEmbeddingManager';
import { IVectorStoreManager } from './IVectorStoreManager';
import { RetrievalAugmentorServiceConfig } from '../config/RetrievalAugmentorConfiguration';
import { MetadataFilter, MetadataValue } from './IVectorStore'; // For RagRetrievalOptions

/**
 * Defines the logical categories of memory that the RAG system can manage.
 * These categories help in organizing information, applying different lifecycle
 * policies, and targeting retrieval operations.
 *
 * @enum {string}
 */
export enum RagMemoryCategory {
  /**
   * Knowledge and behavioral patterns learned by the GMI itself through interactions
   * and self-reflection. This memory is often personalized to the GMI instance.
   */
  PERSONAL_LLM_EXPERIENCE = 'personal_llm_experience',

  /**
   * Information explicitly provided by or about a user, such as preferences,
   * facts, or context relevant to their tasks.
   */
  USER_EXPLICIT_MEMORY = 'user_explicit_memory',

  /**
   * A common knowledge base accessible to multiple users or GMI instances,
   * such as general documentation, FAQs, or public datasets.
   */
  SHARED_KNOWLEDGE_BASE = 'shared_knowledge_base',

  /**
   * Short-term or episodic memory related to the current conversation or task.
   * May have shorter retention or different indexing strategies.
   */
  EPISODIC_CONTEXT = 'episodic_context',

  /**
   * Memory related to the GMI's goals, plans, and ongoing tasks.
   */
  GOAL_ORIENTED_MEMORY = 'goal_oriented_memory',
  // Add other categories as deemed necessary by the evolving architecture.
}


/**
 * Represents a unit of text content to be ingested into the RAG system.
 *
 * @interface RagDocumentInput
 * @property {string} id - A unique identifier for this document. If chunking occurs,
 * this ID might be a prefix for chunk IDs.
 * @property {string} content - The textual content of the document.
 * @property {string} [dataSourceId] - Optional: The target data source ID where this document should be ingested.
 * If not provided, the Augmentor might use a default or determine it based on other criteria.
 * @property {string} [source] - Optional: The original source of the document (e.g., URL, file path, API endpoint).
 * Useful for tracking provenance.
 * @property {Record<string, MetadataValue>} [metadata] - Optional: Rich metadata associated with the document.
 * This is crucial for filtering during retrieval and providing contextual information.
 * Keys should be descriptive (e.g., "author", "creationDate", "tags").
 * @property {string} [language] - Optional: The language of the document content, specified as an ISO 639-1 code (e.g., "en", "es").
 * @property {string} [timestamp] - Optional: An ISO 8601 date string representing when the document was last modified or created.
 * @property {number[]} [embedding] - Optional: A pre-computed embedding vector for this document's content.
 * If provided, `embeddingModelId` should also be specified, and the RetrievalAugmentor might skip embedding generation.
 * @property {string} [embeddingModelId] - Optional: The ID of the embedding model used if a pre-computed `embedding` is provided.
 * This helps ensure consistency and proper interpretation of the vector.
 */
export interface RagDocumentInput {
  id: string;
  content: string;
  dataSourceId?: string;
  source?: string;
  metadata?: Record<string, MetadataValue>;
  language?: string;
  timestamp?: string; // ISO 8601 date string
  embedding?: number[];
  embeddingModelId?: string;
}

/**
 * Configuration options for the document ingestion process.
 * These options control how documents are chunked, embedded, and stored.
 *
 * @interface RagIngestionOptions
 * @property {string} [userId] - Optional: Identifier of the user associated with this ingestion,
 * for auditing or user-specific data handling.
 * @property {string} [personaId] - Optional: Identifier of the persona/GMI instance performing the ingestion.
 * @property {string} [targetDataSourceId] - Optional: Explicitly specify the target data source ID for ingestion.
 * Overrides any `dataSourceId` in individual `RagDocumentInput` objects or default logic.
 * @property {'overwrite' | 'skip' | 'error'} [duplicateHandling='overwrite'] - Strategy for handling documents
 * with IDs that already exist in the target data source.
 * @property {object} [chunkingStrategy] - Configuration for document chunking. If not provided,
 * the RetrievalAugmentor might use a default strategy from its configuration, or not chunk if content is small.
 * @property {'fixed_size' | 'semantic' | 'recursive_character' | 'none'} chunkingStrategy.type - Type of chunking.
 * - `none`: Treat the entire document content as a single chunk (if it fits model limits).
 * - `recursive_character`: Splits text recursively by a list of characters.
 * - `fixed_size`: Splits text into fixed size chunks (e.g., by token count).
 * - `semantic`: (Advanced) Splits text based on semantic boundaries (may require an LLM or specialized model).
 * @property {number} [chunkingStrategy.chunkSize] - Target size for each chunk (e.g., number of tokens, characters).
 * @property {number} [chunkingStrategy.chunkOverlap] - Number of tokens/characters to overlap between consecutive chunks.
 * @property {Record<string, any>} [chunkingStrategy.strategySpecificParams] - Additional parameters for the chosen chunking type.
 * @property {string} [embeddingModelId] - The ID of the embedding model to use for generating embeddings
 * if they are not pre-computed or if re-embedding is desired. Overrides defaults.
 * @property {boolean} [processAsync=false] - Whether to process ingestion asynchronously. If true, the method
 * might return quickly with a job ID while ingestion happens in the background. Default is `false` (synchronous).
 * @property {number} [batchSize=32] - Preferred batch size for processing documents during embedding and vector store upsertion.
 * @property {boolean} [skipNormalization=false] - If true, skips any default text normalization/cleaning steps.
 * @property {Record<string, any>} [customParameters] - Any other custom parameters for the ingestion pipeline.
 */
export interface RagIngestionOptions {
  userId?: string;
  personaId?: string;
  targetDataSourceId?: string;
  duplicateHandling?: 'overwrite' | 'skip' | 'error';
  chunkingStrategy?: {
    type: 'fixed_size' | 'semantic' | 'recursive_character' | 'none';
    chunkSize?: number;
    chunkOverlap?: number;
    strategySpecificParams?: Record<string, any>;
  };
  embeddingModelId?: string;
  processAsync?: boolean;
  batchSize?: number;
  skipNormalization?: boolean;
  customParameters?: Record<string, any>;
}

/**
 * Represents a single retrieved chunk of a document, augmented with relevance information.
 *
 * @interface RagRetrievedChunk
 * @property {string} id - Unique identifier for this specific chunk (e.g., `originalDocumentId_chunk_001`).
 * @property {string} content - The textual content of the retrieved chunk.
 * @property {string} [originalDocumentId] - The ID of the source document from which this chunk originated.
 * @property {string} [dataSourceId] - The ID of the RAG Data Source from which this chunk was retrieved.
 * @property {string} [source] - The original source of the parent document (e.g., URL, file path).
 * @property {Record<string, MetadataValue>} [metadata] - Metadata associated with the original document and/or this specific chunk.
 * @property {number} relevanceScore - A score indicating the relevance of this chunk to the query.
 * The nature of this score (e.g., cosine similarity, MMR score) depends on the retrieval strategy and vector store.
 * @property {number} [rerankScore] - Optional: A refined relevance score from a secondary re-ranking step.
 * @property {number[]} [embedding] - Optional: The embedding vector of this chunk, if requested and available.
 * @property {Record<string, any>} [customProperties] - Any other properties attached during the retrieval pipeline.
 */
export interface RagRetrievedChunk {
  id: string;
  content: string;
  originalDocumentId?: string;
  dataSourceId?: string;
  source?: string;
  metadata?: Record<string, MetadataValue>;
  relevanceScore: number;
  rerankScore?: number;
  embedding?: number[];
  customProperties?: Record<string, any>;
}

/**
 * Options for the context retrieval process.
 * These options control how queries are embedded, how vector stores are searched,
 * and how results are processed and re-ranked.
 *
 * @interface RagRetrievalOptions
 * @property {string} [userId] - Optional: Identifier of the user making the retrieval request, for filtering or personalization.
 * @property {string} [personaId] - Optional: Identifier of the GMI/persona making the request.
 * @property {string[]} [targetDataSourceIds] - Optional: An array of specific RAG Data Source IDs to query.
 * If not provided, the RetrievalAugmentor may query default sources or sources determined by `targetMemoryCategories`.
 * @property {RagMemoryCategory[]} [targetMemoryCategories] - Optional: An array of logical memory categories to target for retrieval.
 * The Augmentor will map these to appropriate `targetDataSourceIds` based on its configuration.
 * @property {number} [topK=5] - The number of top relevant chunks to retrieve initially from each queried data source.
 * @property {MetadataFilter} [metadataFilter] - Metadata filter to apply during the vector store query.
 * Only documents/chunks matching this filter will be considered.
 * @property {'similarity' | 'mmr' | 'hybrid' | string} [strategy='similarity'] - The retrieval strategy to use.
 * - `similarity`: Standard vector similarity search.
 * - `mmr`: Maximal Marginal Relevance to balance relevance and diversity.
 * - `hybrid`: Combines keyword/lexical search with vector similarity (requires underlying store support).
 * Custom strategy strings may be supported by specific implementations.
 * @property {object} [strategyParams] - Parameters specific to the chosen retrieval strategy.
 * @property {number} [strategyParams.mmrLambda=0.5] - For MMR: controls diversity (0.0=max diversity, 1.0=max relevance).
 * @property {number} [strategyParams.hybridAlpha=0.5] - For hybrid: weight of semantic vs. lexical search (0.0-1.0).
 * @property {Record<string, any>} [strategyParams.custom] - Other strategy-specific parameters.
 * @property {string} [queryEmbeddingModelId] - The ID of the embedding model to use for embedding the `queryText`.
 * Overrides defaults. Should ideally match models used for indexing the documents being queried.
 * @property {object} [rerankerConfig] - Configuration for an optional secondary re-ranking step.
 * @property {boolean} [rerankerConfig.enabled=false] - Whether to apply re-ranking.
 * @property {string} [rerankerConfig.modelId] - Model ID for the re-ranker (e.g., a cross-encoder or an LLM).
 * @property {string} [rerankerConfig.providerId] - Optional provider ID if the re-ranker model is on a specific provider.
 * @property {number} [rerankerConfig.topN] - Number of results to keep after re-ranking (from the initial `topK` results).
 * @property {Record<string, any>} [rerankerConfig.params] - Custom parameters for the re-ranker model.
 * @property {boolean} [includeEmbeddings=false] - Whether to include the embedding vectors of the retrieved chunks in the result.
 * @property {number} [tokenBudgetForContext] - Optional: A target token budget for the final `augmentedPromptText`.
 * The Augmentor will try to fit the most relevant content within this budget.
 * @property {Record<string, any>} [customParameters] - Any other custom parameters for the retrieval pipeline.
 */
export interface RagRetrievalOptions {
  userId?: string;
  personaId?: string;
  targetDataSourceIds?: string[];
  targetMemoryCategories?: RagMemoryCategory[];
  topK?: number;
  metadataFilter?: MetadataFilter;
  strategy?: 'similarity' | 'mmr' | 'hybrid' | string; // Allow custom strategy strings
  strategyParams?: {
    mmrLambda?: number;
    hybridAlpha?: number;
    custom?: Record<string, any>;
  };
  queryEmbeddingModelId?: string;
  rerankerConfig?: {
    enabled?: boolean;
    modelId?: string;
    providerId?: string;
    topN?: number;
    params?: Record<string, any>;
  };
  includeEmbeddings?: boolean;
  tokenBudgetForContext?: number;
  customParameters?: Record<string, any>;
}

/**
 * Result of a document ingestion operation.
 *
 * @interface RagIngestionResult
 * @property {string[]} ingestedDocumentIds - IDs of documents (or primary entities) that were successfully processed and submitted for ingestion.
 * @property {number} processedDocumentCount - Total number of input documents attempted.
 * @property {number} successfullyIngestedCount - Number of documents fully ingested without error.
 * @property {number} failedIngestionCount - Number of documents that encountered critical errors during ingestion.
 * @property {Array<{ documentId?: string; chunkId?: string; message: string; details?: unknown }>} [errors] - Optional details about any failures
 * for specific documents or chunks.
 * @property {string} [jobId] - If `processAsync` was true, this is the ID of the background job processing the ingestion.
 * @property {Record<string, any>} [metrics] - Optional metrics about the ingestion process (e.g., time taken, tokens processed).
 */
export interface RagIngestionResult {
  ingestedDocumentIds: string[];
  processedDocumentCount: number;
  successfullyIngestedCount: number;
  failedIngestionCount: number;
  errors?: Array<{ documentId?: string; chunkId?: string; message: string; details?: unknown }>;
  jobId?: string;
  metrics?: Record<string, any>;
}

/**
 * Result of a context retrieval operation.
 *
 * @interface RagRetrievalResult
 * @property {string} queryText - The original query text that was processed.
 * @property {RagRetrievedChunk[]} retrievedChunks - An array of retrieved document chunks, ordered by final relevance
 * (after potential re-ranking).
 * @property {string} augmentedContext - A single string containing the formatted textual content from the
 * `retrievedChunks`, ready to be used for augmenting an LLM prompt. This text is constructed
 * respecting `tokenBudgetForContext` if provided.
 * @property {number[]} [queryEmbedding] - Optional: The embedding vector generated for the `queryText`.
 * @property {object} [diagnostics] - Optional: Diagnostic information about the retrieval process.
 * @property {number} [diagnostics.retrievalTimeMs] - Time taken for initial retrieval from vector stores.
 * @property {number} [diagnostics.rerankingTimeMs] - Time taken for the re-ranking step, if enabled.
 * @property {number} [diagnostics.embeddingTimeMs] - Time taken to embed the query.
 * @property {string} [diagnostics.strategyUsed] - The retrieval strategy that was actually employed.
 * @property {Record<string, number>} [diagnostics.dataSourceHits] - Number of initial hits from each queried data source ID.
 * @property {string[]} [diagnostics.effectiveDataSourceIds] - The data source IDs that were actually queried.
 * @property {number} [diagnostics.totalTokensInContext] - Estimated total tokens in the `augmentedContext`.
 * @property {string[]} [diagnostics.messages] - Any informational messages or warnings generated during retrieval.
 */
export interface RagRetrievalResult {
  queryText: string;
  retrievedChunks: RagRetrievedChunk[];
  augmentedContext: string;
  queryEmbedding?: number[];
  diagnostics?: {
    retrievalTimeMs?: number;
    rerankingTimeMs?: number;
    embeddingTimeMs?: number;
    strategyUsed?: RagRetrievalOptions['strategy'];
    dataSourceHits?: Record<string, number>;
    effectiveDataSourceIds?: string[];
    totalTokensInContext?: number;
    messages?: string[];
  };
}

/**
 * @interface IRetrievalAugmentor
 * @description Defines the contract for the RAG system's primary orchestrator.
 * It handles the ingestion of documents, their conversion into searchable embeddings,
 * and the retrieval of relevant context based on input queries. It coordinates
 * with an IEmbeddingManager and an IVectorStoreManager.
 */
export interface IRetrievalAugmentor {
  /**
   * A unique identifier for this RetrievalAugmentor instance, potentially derived from its configuration.
   * @readonly
   */
  readonly augmenterId: string;

  /**
   * Initializes the RetrievalAugmentor with its service-specific configuration and
   * instances of required manager dependencies.
   * This method must be called before any other operations.
   *
   * @async
   * @param {RetrievalAugmentorServiceConfig} config - The behavioral and operational configuration
   * for this RetrievalAugmentor instance (e.g., default strategies, category mappings).
   * @param {IEmbeddingManager} embeddingManager - An initialized instance of an IEmbeddingManager
   * for generating text embeddings.
   * @param {IVectorStoreManager} vectorStoreManager - An initialized instance of an IVectorStoreManager
   * for interacting with underlying vector stores.
   * @returns {Promise<void>} A promise that resolves upon successful initialization.
   * @throws {GMIError | Error} If initialization fails (e.g., invalid config, missing dependencies,
   * inability to verify essential components).
   */
  initialize(
    config: RetrievalAugmentorServiceConfig,
    embeddingManager: IEmbeddingManager,
    vectorStoreManager: IVectorStoreManager,
  ): Promise<void>;

  /**
   * Ingests one or more documents into the RAG system.
   * This process typically involves:
   * 1. Normalizing and optionally chunking the document content.
   * 2. Generating embeddings for each document/chunk using the `IEmbeddingManager`.
   * 3. Storing the documents/chunks and their embeddings in appropriate vector stores
   * via the `IVectorStoreManager`, along with metadata.
   *
   * @async
   * @param {RagDocumentInput | RagDocumentInput[]} documents - A single document or an array of documents to ingest.
   * @param {RagIngestionOptions} [options] - Options to control various aspects of the ingestion process
   * (e.g., chunking strategy, target data source, duplicate handling).
   * @returns {Promise<RagIngestionResult>} A summary of the ingestion operation, including success/failure counts and IDs.
   * @throws {GMIError | Error} If a critical, unrecoverable error occurs during the ingestion pipeline.
   * Partial failures for individual documents should be reported in `RagIngestionResult.errors`.
   */
  ingestDocuments(
    documents: RagDocumentInput | RagDocumentInput[],
    options?: RagIngestionOptions,
  ): Promise<RagIngestionResult>;

  /**
   * Retrieves relevant document chunks from the RAG system based on a textual query.
   * This process involves:
   * 1. Embedding the input query using the `IEmbeddingManager`.
   * 2. Querying relevant vector stores (determined by `IVectorStoreManager` and configuration)
   * for similar document chunks.
   * 3. Optionally applying re-ranking to refine results.
   * 4. Formatting the retrieved content into a context string suitable for LLM augmentation.
   *
   * @async
   * @param {string} queryText - The textual query for which to retrieve context.
   * @param {RagRetrievalOptions} [options] - Options to control the retrieval process
   * (e.g., target data sources/categories, topK, filters, re-ranking).
   * @returns {Promise<RagRetrievalResult>} The set of retrieved document chunks, the augmented context string,
   * and diagnostic information.
   * @throws {GMIError | Error} If the retrieval process fails critically.
   */
  retrieveContext(
    queryText: string,
    options?: RagRetrievalOptions,
  ): Promise<RagRetrievalResult>;

  /**
   * Deletes documents (and all their associated chunks/embeddings) from the RAG system.
   * Deletion can be specified by document IDs and/or target data source.
   *
   * @async
   * @param {string[]} documentIds - An array of document IDs to delete.
   * @param {string} [dataSourceId] - Optional: The specific RAG Data Source ID from which to delete these documents.
   * If not provided, the system may attempt to find and delete the documents from any data source
   * where they might exist based on ID, or use a configured default behavior.
   * @param {object} [options] - Optional additional parameters for deletion.
   * @param {boolean} [options.ignoreNotFound=false] - If true, do not treat "document not found" as an error.
   * @returns {Promise<{ successCount: number; failureCount: number; errors?: Array<{ documentId: string; message: string; details?: any }> }>}
   * A summary of the deletion operation.
   * @throws {GMIError | Error} If a critical error occurs during deletion.
   */
  deleteDocuments(
    documentIds: string[],
    dataSourceId?: string,
    options?: { ignoreNotFound?: boolean },
  ): Promise<{
    successCount: number;
    failureCount: number;
    errors?: Array<{ documentId: string; message: string; details?: any }>;
  }>;

  /**
   * Updates existing documents in the RAG system. This typically involves deleting the old
   * version(s) and ingesting the new version(s).
   * The documents are identified by their `id` field.
   *
   * @async
   * @param {RagDocumentInput | RagDocumentInput[]} documents - Document(s) to update. The `id` field is used for matching.
   * @param {RagIngestionOptions} [options] - Options for the update process, similar to ingestion.
   * `duplicateHandling` might be implicitly 'overwrite' for the matched documents.
   * @returns {Promise<RagIngestionResult>} A summary of the update operation, similar to `ingestDocuments`.
   * @throws {GMIError | Error} If the update fails critically.
   */
  updateDocuments(
    documents: RagDocumentInput | RagDocumentInput[],
    options?: RagIngestionOptions,
  ): Promise<RagIngestionResult>;

  /**
   * Checks the health and operational status of the RetrievalAugmentor and its key dependencies
   * (EmbeddingManager, VectorStoreManager).
   *
   * @async
   * @returns {Promise<{ isHealthy: boolean; details?: Record<string, unknown> }>} An object indicating
   * overall health status and providing details about components.
   */
  checkHealth(): Promise<{ isHealthy: boolean; details?: Record<string, unknown> }>;

  /**
   * Gracefully shuts down the RetrievalAugmentor, releasing any resources and ensuring
   * its dependencies (like IEmbeddingManager, IVectorStoreManager) are also properly shut down if owned.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when shutdown is complete.
   */
  shutdown(): Promise<void>;
}