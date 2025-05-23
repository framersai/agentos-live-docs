// backend/agentos/config/VectorStoreConfiguration.ts

/**
 * @fileoverview Defines configuration structures for vector store providers
 * and the overall VectorStoreManager. This allows for flexible setup of
 * different vector database backends (Pinecone, Weaviate, local, in-memory).
 * @module backend/agentos/config/VectorStoreConfiguration
 */

import { VectorStoreProviderConfig } from '../rag/IVectorStore'; // Assuming IVectorStore defines this base

/**
 * Specific configuration for an InMemoryVectorStore.
 * @interface InMemoryVectorStoreConfig
 * @extends VectorStoreProviderConfig
 * @property {'in_memory'} providerId - Must be 'in_memory'.
 * @property {string} [persistPath] - Optional path to a file for persisting the in-memory store on shutdown/startup.
 * @property {'tf_idf' | 'basic_vector'} [similarityMode='basic_vector'] -
 * 'tf_idf': Uses TF-IDF and cosine similarity from 'natural' library for very lightweight, text-based similarity.
 * Embeddings provided to upsert will be ignored; TF-IDF vectors generated internally.
 * 'basic_vector': Stores and uses provided numerical embeddings with cosine similarity.
 * @property {number} [defaultEmbeddingDimension] - Required if similarityMode is 'basic_vector' and no global default.
 */
export interface InMemoryVectorStoreConfig extends VectorStoreProviderConfig {
  providerId: 'in_memory';
  persistPath?: string;
  similarityMode?: 'tf_idf' | 'basic_vector';
  defaultEmbeddingDimension?: number;
}

/**
 * Specific configuration for a local, file-based, or embedded VectorStore.
 * This could be for SQLite with vector extensions, LanceDB, local ChromaDB etc.
 * @interface LocalFileVectorStoreConfig
 * @extends VectorStoreProviderConfig
 * @property {'local_file' | 'lancedb' | 'chromadb_local'} providerId - Specific local provider type.
 * @property {string} databasePath - Path to the database file or directory.
 * @property {number} [defaultEmbeddingDimension] - Required if no global default.
 * @property {Record<string, any>} [connectionParams] - Additional parameters for the specific local DB.
 */
export interface LocalFileVectorStoreConfig extends VectorStoreProviderConfig {
  providerId: 'local_file' | 'lancedb' | 'chromadb_local'; // Example local provider IDs
  databasePath: string;
  defaultEmbeddingDimension?: number;
  connectionParams?: Record<string, any>;
}

/**
 * Specific configuration for Pinecone.
 * @interface PineconeVectorStoreConfig
 * @extends VectorStoreProviderConfig
 * @property {'pinecone'} providerId - Must be 'pinecone'.
 * @property {string} apiKey - Pinecone API key.
 * @property {string} environment - Pinecone environment (e.g., 'us-west1-gcp').
 * @property {string} [defaultIndexName] - Default Pinecone index to use. (Corresponds to collectionName).
 * @property {number} [defaultEmbeddingDimension] - Required if no global default.
 * @property {string} [similarityMetric='cosine'] - Default similarity metric for new indexes.
 */
export interface PineconeVectorStoreConfig extends VectorStoreProviderConfig {
  providerId: 'pinecone';
  apiKey: string;
  environment: string; // e.g., 'gcp-starter', 'us-east-1-aws', etc.
  defaultIndexName?: string; // Pinecone uses 'index' for collection
  defaultEmbeddingDimension?: number;
  similarityMetric?: 'cosine' | 'euclidean' | 'dotproduct';
}

/**
 * Specific configuration for Weaviate.
 * @interface WeaviateVectorStoreConfig
 * @extends VectorStoreProviderConfig
 * @property {'weaviate'} providerId - Must be 'weaviate'.
 * @property {string} scheme - Connection scheme ('http' or 'https').
 * @property {string} host - Weaviate instance host (e.g., 'localhost:8080' or a cloud endpoint).
 * @property {string} [apiKey] - Optional API key for Weaviate Cloud Services (WCS) or secured instances.
 * @property {string} [defaultClassName] - Default Weaviate class name to use. (Corresponds to collectionName).
 * @property {number} [defaultEmbeddingDimension] - Required if no global default.
 * @property {Record<string, any>} [headers] - Optional additional headers for connection.
 */
export interface WeaviateVectorStoreConfig extends VectorStoreProviderConfig {
  providerId: 'weaviate';
  scheme: 'http' | 'https';
  host: string; // e.g., "localhost:8080" or "your-cluster.weaviate.network"
  apiKey?: string;
  defaultClassName?: string; // Weaviate uses 'class' for collection
  defaultEmbeddingDimension?: number;
  headers?: Record<string, string>;
}

/**
 * A union type representing configuration for any supported vector store provider.
 * Add new specific provider configs to this union.
 */
export type AnyVectorStoreProviderConfig =
  | InMemoryVectorStoreConfig
  | LocalFileVectorStoreConfig
  | PineconeVectorStoreConfig
  | WeaviateVectorStoreConfig
  // Add other provider configurations here, e.g.
  // | QdrantVectorStoreConfig
  // | MilvusVectorStoreConfig
  | VectorStoreProviderConfig; // Fallback for generic or future providers

/**
 * Configuration for the VectorStoreManager.
 * @interface VectorStoreManagerConfig
 * @property {AnyVectorStoreProviderConfig[]} providers - An array of configurations for each vector store provider to be initialized.
 * @property {string} [defaultProviderId] - The ID of the vector store provider to use by default if not specified.
 * If not set, the first provider in the list might be used as default.
 * @property {number} [defaultEmbeddingDimension] - A system-wide default embedding dimension if a provider/collection
 * doesn't specify its own. Useful for embedding model consistency.
 */
export interface VectorStoreManagerConfig {
  providers: AnyVectorStoreProviderConfig[];
  defaultProviderId?: string;
  defaultEmbeddingDimension?: number;
}

/**
 * Represents a named collection configuration within the RAG system.
 * This allows different GMIs or personas to use different sets of data
 * or different configurations for the same underlying provider.
 *
 * @interface RagCollectionConfig
 * @property {string} collectionId - A unique identifier for this RAG collection (e.g., "global_wiki", "gmi_xyz_personal_notes").
 * @property {string} displayName - A user-friendly name for the collection.
 * @property {string} description - A brief description of the collection's purpose or content.
 * @property {string} vectorStoreProviderId - The ID of the VectorStoreProvider (from VectorStoreManagerConfig) to use for this collection.
 * @property {string} actualCollectionNameInProvider - The actual name of the index/class/collection in the underlying vector DB
 * (e.g., "agentos-main-kb" in Pinecone, "KnowledgeItem" class in Weaviate).
 * @property {boolean} isDefaultQueryCollection - If true, GMI might query this collection by default if no specific collection is targeted.
 * @property {boolean} isDefaultStorageCollection - If true, GMI/WorkingMemory might store new data here by default.
 * @property {string[]} relevantPersonaIds - Optional list of persona IDs that primarily use or are relevant to this collection.
 * @property {string[]} authorizedUserRoles - Optional list of user roles authorized to access/contribute to this collection.
 * @property {any} [preprocessingRules] - Configuration for statistical preprocessing before ingestion into this collection
 * (e.g., { summarization: "medium", keywords: true }).
 * @property {any} [retrievalParameters] - Default retrieval parameters for this collection (e.g., { topK: 7, minScore: 0.75 }).
 */
export interface RagCollectionConfig {
  collectionId: string;
  displayName: string;
  description: string;
  vectorStoreProviderId: string;
  actualCollectionNameInProvider: string;
  isDefaultQueryCollection?: boolean;
  isDefaultStorageCollection?: boolean;
  relevantPersonaIds?: string[];
  authorizedUserRoles?: string[]; // e.g., ['admin', 'editor', 'user_tier_premium']
  preprocessingRules?: {
    minLength?: number; // Min text length to be considered for storage
    minNoveltyScore?: number; // Min novelty score from StatisticalUtilityAI
    summarization?: 'short' | 'medium' | 'none'; // Pre-summarization before embedding
    extractKeywordsForMetadata?: boolean;
    targetChunkSize?: number; // For text splitting
  };
  retrievalParameters?: {
    defaultTopK?: number;
    defaultMinScore?: number;
  };
}


/**
 * Overall configuration for the Retrieval Augmented Generation system.
 * @interface RagSystemConfig
 * @property {VectorStoreManagerConfig} vectorStoreManagerConfig - Configuration for all underlying vector store providers.
 * @property {RagCollectionConfig[]} collections - Defines the different logical RAG collections available in the system.
 * @property {string} defaultEmbeddingModelId - Default model ID to use for generating embeddings (e.g., "text-embedding-ada-002").
 * This would be used by an EmbeddingManager.
 * @property {string} defaultEmbeddingProviderId - Default provider ID for the embedding model.
 * @property {Record<string, any>} [ingestionDefaults] - Default settings for data ingestion across collections.
 * @property {Record<string, any>} [queryDefaults] - Default settings for queries across collections.
 */
export interface RagSystemConfig {
  vectorStoreManagerConfig: VectorStoreManagerConfig;
  collections: RagCollectionConfig[];
  defaultEmbeddingModelId: string; // e.g., "text-embedding-3-small"
  defaultEmbeddingProviderId: string; // e.g., "openai" or "ollama_local_embeddings"
  // Potentially add default configurations for EmbeddingManager here if it's complex
}

// Example of how this configuration might be structured in a main system config file:
/*
const systemConfiguration = {
  // ... other system configs
  rag: {
    vectorStoreManagerConfig: {
      defaultProviderId: 'pinecone_main',
      defaultEmbeddingDimension: 1536,
      providers: [
        {
          providerId: 'pinecone_main',
          apiKey: process.env.PINECONE_API_KEY,
          environment: process.env.PINECONE_ENVIRONMENT,
          defaultIndexName: 'agentos-knowledge-base',
          defaultEmbeddingDimension: 1536,
        } as PineconeVectorStoreConfig,
        {
          providerId: 'in_memory_dev',
          similarityMode: 'basic_vector',
          defaultEmbeddingDimension: 384, // for a smaller local model
        } as InMemoryVectorStoreConfig,
      ],
    },
    collections: [
      {
        collectionId: 'global_wiki',
        displayName: 'Global Knowledge Wiki',
        description: 'Shared knowledge base for all agents.',
        vectorStoreProviderId: 'pinecone_main',
        actualCollectionNameInProvider: 'agentos-global-wiki-prod',
        isDefaultQueryCollection: true,
        isDefaultStorageCollection: true,
        preprocessingRules: {
          summarization: 'medium',
          extractKeywordsForMetadata: true,
        },
        retrievalParameters: { defaultTopK: 5 }
      },
      {
        collectionId: 'user_personal_notes',
        displayName: 'User Personal Notes',
        description: 'Personal notes and memories for individual users (data segregation implied by metadata).',
        vectorStoreProviderId: 'pinecone_main', // Could also be a different provider
        actualCollectionNameInProvider: 'agentos-user-notes-prod',
        // This collection would be queried with user_id in metadataFilter
      }
    ],
    defaultEmbeddingModelId: 'text-embedding-3-small',
    defaultEmbeddingProviderId: 'openai',
  } as RagSystemConfig,
  // ... other service configs
};
*/