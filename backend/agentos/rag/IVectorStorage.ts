// backend/agentos/rag/IVectorStoreManager.ts

/**
 * @fileoverview Defines the interface for the VectorStoreManager, which manages
 * multiple IVectorStore provider instances and provides a unified access point.
 * @module backend/agentos/rag/IVectorStoreManager
 */

import {
  IVectorStore,
  VectorDocument,
  QueryResult,
  QueryOptions,
  UpsertOptions,
  DeleteOptions,
  VectorStoreProviderConfig,
} from './IVectorStore';
import { VectorStoreManagerConfig } from '../config/VectorStoreConfiguration';

/**
 * @interface IVectorStoreManager
 * @description Manages and provides access to various configured IVectorStore instances.
 * It allows the RetrievalAugmentor to be agnostic of the specific vector DB
 * being used for a particular collection or category, based on configuration.
 */
export interface IVectorStoreManager {
  /**
   * Initializes the VectorStoreManager with configurations for all its providers.
   * @async
   * @param {VectorStoreManagerConfig} config - The manager's configuration, including an array of provider configs.
   * @returns {Promise<void>}
   */
  initialize(config: VectorStoreManagerConfig): Promise<void>;

  /**
   * Retrieves a specific IVectorStore provider instance by its configured ID.
   * @param {string} providerId - The unique ID of the provider instance (as defined in VectorStoreManagerConfig).
   * @returns {IVectorStore | undefined} The IVectorStore instance, or undefined if not found or not initialized.
   * @throws {Error} If the providerId is not configured.
   */
  getProvider(providerId: string): IVectorStore;

  /**
   * Retrieves the default IVectorStore provider instance.
   * @returns {IVectorStore} The default IVectorStore instance.
   * @throws {Error} If no default provider is configured or no providers are available.
   */
  getDefaultProvider(): IVectorStore;

  /**
   * Lists the IDs of all configured and initialized vector store providers.
   * @returns {string[]} An array of provider IDs.
   */
  listProviderIds(): string[];

  /**
   * Checks the health of all managed vector store providers or a specific one.
   * @async
   * @param {string} [providerId] - Optional: If provided, checks only this specific provider.
   * @returns {Promise<{isHealthy: boolean, details: Record<string, {isHealthy: boolean, details?: any}> | {isHealthy: boolean, details?: any} }>}
   * An object indicating overall health and details for each provider.
   */
  checkHealth(providerId?: string): Promise<{isHealthy: boolean, details: any}>;

  /**
   * Shuts down all managed vector store providers.
   * @async
   * @returns {Promise<void>}
   */
  shutdownAllProviders(): Promise<void>;
}