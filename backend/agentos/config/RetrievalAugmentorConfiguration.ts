// backend/agentos/config/RetrievalAugmentorConfiguration.ts

/**
 * @fileoverview Defines configuration structures for the RetrievalAugmentor.
 * @module backend/agentos/config/RetrievalAugmentorConfiguration
 */

import { VectorDocument, QueryResult } from '../rag/IVectorStore';
import { RagMemoryCategory } from '../rag/IRetrievalAugmentor';

/**
 * Options controlling the retrieval process for a specific request.
 * These can override global or collection-specific defaults.
 * @interface RetrievalRequestOptions
 * @property {number} [topK=5] - The number of top similar documents to retrieve.
 * @property {number} [minRelevanceScore] - A minimum similarity score for documents to be returned.
 * @property {boolean} [includeFullDocument=false] - Whether to include the full text_content of retrieved documents
 * in ProcessedRetrievedContext, or just snippets/summaries.
 * @property {number} [maxSnippetLength=300] - If not including full document, max length of generated snippets.
 * @property {string} [retrievalStrategy='default_vector_search'] - Name of the retrieval strategy to use
 * (e.g., 'default_vector_search', 'hybrid_search_future', 'multi_query_future').
 * @property {boolean} [enableQueryPreprocessing=true] - Whether to preprocess the query using StatisticalUtilityAI
 * (e.g., keyword extraction, normalization) before embedding.
 */
export interface RetrievalRequestOptions {
  topK?: number;
  minRelevanceScore?: number;
  includeFullDocument?: boolean;
  maxSnippetLength?: number;
  retrievalStrategy?: string; // For future expansion (e.g., 'hybrid', 'multi_query')
  enableQueryPreprocessing?: boolean;
}

/**
 * Options controlling the ingestion process for a specific request.
 * @interface IngestionRequestOptions
 * @property {'simple' | 'recursive_char_text_splitter' | 'semantic_chunking_future'} [chunkingStrategy='simple'] -
 * How to chunk large documents before embedding. 'simple' might just take the whole text if it fits.
 * @property {number} [maxChunkSize] - Max characters or tokens for a chunk (depends on embedding model limits).
 * @property {number} [chunkOverlap] - Overlap between chunks if using a text splitter.
 * @property {boolean} [generateKeywords=true] - Whether to use StatisticalUtilityAI to generate keywords for metadata.
 * @property {boolean} [generateSummary=false] - Whether to generate a brief summary for metadata or for embedding.
 * @property {string} [embeddingModelId] - Specific embedding model to use for this ingestion, overriding default.
 * @property {boolean} [overwriteExisting=true] - If a document with the same ID exists, should it be overwritten?
 */
export interface IngestionRequestOptions {
  chunkingStrategy?: 'simple' | 'recursive_char_text_splitter' | 'semantic_chunking_future';
  maxChunkSize?: number; // e.g., 500 tokens or 2000 characters
  chunkOverlap?: number;
  generateKeywordsForMetadata?: boolean;
  generateSummaryForMetadata?: boolean; // A short summary to store alongside the vector
  embeddingModelId?: string; // Override default embedding model for this specific ingestion
  overwriteExisting?: boolean;
}

/**
 * Represents the processed and formatted context retrieved from RAG.
 * This is what the GMI will use to augment its prompts.
 * @interface ProcessedRetrievedContext
 * @property {string} augmentedPromptText - A single string containing the formatted relevant snippets,
 * ready to be inserted into an LLM prompt.
 * @property {QueryResult[]} rawResults - The raw query results from the vector store.
 * @property {VectorDocument[]} sourceDocuments - Detailed information about the source documents of the snippets,
 * including their metadata.
 * @property {string} queryText - The original query text.
 * @property {string[]} searchedCategories - The memory categories that were searched.
 * @property {string} [summaryOfContext] - Optional: A brief summary of the entire retrieved context, potentially LLM-generated.
 */
export interface ProcessedRetrievedContext {
  augmentedPromptText: string; // Formatted string of snippets
  rawResults: QueryResult[];
  sourceDocuments: Array<Partial<VectorDocument> & { category?: RagMemoryCategory; score: number }>;
  queryText: string;
  searchedCategories: RagMemoryCategory[];
  summaryOfContext?: string; // Optional overall summary
}

/**
 * Result of an ingestion operation.
 * @interface IngestionResult
 * @property {boolean} success - Overall success status of the ingestion batch.
 * @property {string[]} successfullyIngestedIds - Array of document IDs that were successfully ingested/updated.
 * @property {string[]} failedIngestionIds - Array of document IDs that failed ingestion.
 * @property {Array<{documentId: string, error: string, details?: any}>} [errors] - Detailed errors for failed ingestions.
 * @property {number} documentsProcessed - Total number of documents attempted.
 * @property {number} embeddingsGenerated - Total number of embeddings generated (could be > documentsProcessed if chunked).
 */
export interface IngestionResult {
  success: boolean;
  successfullyIngestedIds: string[];
  failedIngestionIds: string[];
  errors?: Array<{documentId: string, error: string, details?: any}>;
  documentsProcessed: number;
  embeddingsGenerated: number;
}

/**
 * Defines default behaviors and mappings for different RAG memory categories.
 * @interface RagCategoryBehavior
 * @property {RagMemoryCategory} category - The logical memory category.
 * @property {string[]} targetCollectionIds - The actual `collectionId`(s) from `RagCollectionConfig` in `VectorStoreConfiguration`
 * that this logical category maps to. A category can map to multiple physical collections.
 * @property {RetrievalRequestOptions} [defaultRetrievalOptions] - Default retrieval options for this category.
 * @property {IngestionRequestOptions} [defaultIngestionOptions] - Default ingestion options for this category.
 * @property {string} [defaultEmbeddingModelId] - Default embedding model for this category, overrides global.
 * @property {number} [retentionDays] - Optional: How long to retain items in this category (0 for indefinite).
 * @property {boolean} [isUserSpecific] - True if data in this category is typically tied to a `userId`.
 * @property {boolean} [isSessionSpecific] - True if data in this category is typically tied to a `sessionId`.
 * @property {number} [queryPriority=0] - Priority for querying this category (higher means queried first or more prominently).
 */
export interface RagCategoryBehavior {
  category: RagMemoryCategory;
  targetCollectionIds: string[]; // Maps to RagCollectionConfig.collectionId
  defaultRetrievalOptions?: RetrievalRequestOptions;
  defaultIngestionOptions?: IngestionRequestOptions;
  defaultEmbeddingModelId?: string;
  retentionDays?: number; // 0 for indefinite
  isUserSpecific?: boolean;
  isSessionSpecific?: boolean;
  queryPriority?: number;
}

/**
 * Configuration for the RetrievalAugmentor.
 * @interface RetrievalAugmentorConfig
 * @property {string} [defaultQueryEmbeddingModelId] - Overrides EmbeddingManager's default specifically for queries.
 * @property {RetrievalRequestOptions} [globalDefaultRetrievalOptions] - Global default retrieval options.
 * @property {IngestionRequestOptions} [globalDefaultIngestionOptions] - Global default ingestion options.
 * @property {RagCategoryBehavior[]} categoryBehaviors - Defines behavior for each supported RAG memory category.
 * @property {number} [maxCharsForAugmentedPrompt=4000] - Max characters for the `augmentedPromptText`.
 * @property {string} [contextJoinSeparator="\n\n---\n\n"] - Separator used to join context snippets.
 * @property {boolean} [useStatisticalPreprocessingForIngestion=true] - Global flag to use StatisticalUtilityAI for ingestion preprocessing.
 * @property {boolean} [useStatisticalPreprocessingForQuery=false] - Global flag for query preprocessing (future).
 */
export interface RetrievalAugmentorConfig {
  defaultQueryEmbeddingModelId?: string;
  globalDefaultRetrievalOptions?: RetrievalRequestOptions;
  globalDefaultIngestionOptions?: IngestionRequestOptions;
  categoryBehaviors: RagCategoryBehavior[];
  maxCharsForAugmentedPrompt?: number;
  contextJoinSeparator?: string;
  useStatisticalPreprocessingForIngestion?: boolean;
  useStatisticalPreprocessingForQuery?: boolean; // Future use
}

// Example of how categoryBehaviors might be configured:
/*
const exampleRetrievalAugmentorConfig: RetrievalAugmentorConfig = {
  categoryBehaviors: [
    {
      category: 'shared_knowledge_base',
      targetCollectionIds: ['global_wiki_main', 'global_faq_secondary'], // from VectorStoreConfiguration.RagCollectionConfig
      defaultRetrievalOptions: { topK: 5, minRelevanceScore: 0.7 },
      defaultIngestionOptions: { chunkingStrategy: 'recursive_char_text_splitter', maxChunkSize: 1000, generateKeywordsForMetadata: true },
      queryPriority: 10,
    },
    {
      category: 'user_explicit_memory',
      targetCollectionIds: ['user_private_notes'], // from VectorStoreConfiguration.RagCollectionConfig
      isUserSpecific: true,
      defaultRetrievalOptions: { topK: 3 },
      queryPriority: 100, // High priority for personal user memory
    },
    {
      category: 'personal_llm_experience',
      targetCollectionIds: ['gmi_self_learnings'], // from VectorStoreConfiguration.RagCollectionConfig
      // This might be persona-specific if GMI instances don't share self-learnings easily
      // isUserSpecific: false, // Or true if LLM experience is tied to a user's GMI instance
      defaultRetrievalOptions: { topK: 2, minRelevanceScore: 0.65 },
      queryPriority: 50,
    }
  ],
  globalDefaultRetrievalOptions: { topK: 3 },
  maxCharsForAugmentedPrompt: 3000,
};
*/