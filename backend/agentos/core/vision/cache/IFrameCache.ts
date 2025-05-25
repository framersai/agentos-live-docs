// File: backend/agentos/core/vision/cache/IFrameCache.ts
/**
 * @file IFrameCache.ts
 * @module backend/agentos/core/vision/cache/IFrameCache
 * @version 1.0.0
 * @description Defines the interface for a cache that stores information about
 * processed visual frames. This includes their digests, extracted features, and potentially
 * summaries or links to full analysis results. This cache is vital for optimizing
 * vision processing by avoiding redundant analysis of previously seen or similar frames.
 *
 * A robust frame cache is essential for:
 * - Reducing latency by serving pre-computed results for identical/similar frames.
 * - Lowering computational costs by avoiding repeated analyses.
 * - Decreasing calls to external vision API providers.
 * - Enabling more sophisticated frame differencing strategies.
 */

import { CachedFrameInfo } from '../types/CachedFrame';
import { VisionError } from '../errors/VisionError';

/**
 * @interface FrameCacheStats
 * @description Statistics about the frame cache's performance and state.
 * These stats are crucial for monitoring cache effectiveness and tuning its parameters.
 */
export interface FrameCacheStats {
  /** @property {number} hits - Number of times a requested frame (by digest) was found in the cache and was valid. */
  hits: number;
  /** @property {number} misses - Number of times a requested frame (by digest) was not found in the cache or was expired. */
  misses: number;
  /** @property {number} additions - Number of new `CachedFrameInfo` entries successfully added to the cache. */
  additions: number;
  /** @property {number} updates - Number of existing `CachedFrameInfo` entries that were updated. */
  updates: number;
  /** @property {number} evictions - Number of entries removed from the cache due to policies (e.g., LRU, LFU, TTL expiry leading to removal). */
  evictions: number;
  /** @property {number} currentSizeItems - Current number of items (CachedFrameInfo entries) in the cache. */
  currentSizeItems: number;
  /** @property {number} [maxSizeItems] - Maximum capacity of the cache in terms of items, if applicable. */
  maxSizeItems?: number;
  /** @property {number} [currentSizeBytes] - Optional. Current estimated total size of the cache contents in bytes. */
  currentSizeBytes?: number;
  /** @property {number} [maxSizeBytes] - Optional. Maximum capacity of the cache in bytes, if applicable. */
  maxSizeBytes?: number;
  /** @property {number} [lastPrunedAt] - Optional. Timestamp (Unix epoch ms) of the last pruning operation. */
  lastPrunedAt?: number;
  /** @property {number} [entriesPrunedLast] - Optional. Number of entries removed during the last pruning operation. */
  entriesPrunedLast?: number;
}

/**
 * @interface FrameCacheConfigBase
 * @description Base configuration options for any IFrameCache implementation.
 */
export interface FrameCacheConfigBase {
  /**
   * @property {string} cacheId
   * @description A unique identifier for this cache instance, useful for logging or managing multiple caches.
   */
  cacheId: string;

  /**
   * @property {boolean} [logActivity=false]
   * @description If true, the cache implementation should log its significant activities (e.g., hits, misses, evictions).
   * @default false
   */
  logActivity?: boolean;
}


/**
 * @interface IFrameCache
 * @description Interface for a visual frame information cache.
 * Implementations will manage the storage and retrieval of `CachedFrameInfo` objects,
 * employing various strategies for efficiency and data lifecycle management.
 */
export interface IFrameCache {
  /**
   * @property {string} cacheId - Readonly identifier for this cache instance.
   */
  readonly cacheId: string;

  /**
   * @property {boolean} isInitialized - Readonly flag indicating if the cache has been initialized.
   */
  readonly isInitialized: boolean;

  /**
   * Initializes the frame cache with its specific configuration.
   * This method must be successfully called before any other cache operations.
   * @async
   * @template TConfig - The specific configuration type for the cache implementation, extending FrameCacheConfigBase.
   * @param {TConfig} config - Cache-specific configuration options
   * (e.g., maxSize, ttl, evictionStrategy, connection strings for persistent stores).
   * @returns {Promise<void>} A promise that resolves upon successful initialization.
   * @throws {VisionError} If initialization fails (e.g., invalid config, connection issues).
   */
  initialize<TConfig extends FrameCacheConfigBase>(config: TConfig): Promise<void>;

  /**
   * Retrieves cached information for a frame based on its digest.
   * Implementations should update access statistics (e.g., for LRU/LFU).
   * If an entry is found but has expired (based on TTL), it should be treated as a miss
   * and potentially removed from the cache.
   * @async
   * @param {string} frameDigest - The unique digest of the frame to retrieve.
   * @returns {Promise<CachedFrameInfo | undefined>} The cached frame information if found and valid,
   * or `undefined` if not found or expired.
   * @throws {VisionError} For critical cache access errors (not for simple misses).
   */
  get(frameDigest: string): Promise<CachedFrameInfo | undefined>;

  /**
   * Stores or updates frame information in the cache.
   * If an entry with the same `frameDigest` already exists, its content should be updated
   * (potentially merging, e.g., incrementing accessCount, updating lastAccessedTimestamp).
   * The `timestampAdded` of an existing entry should generally NOT be updated unless it's a complete replacement.
   * Implementations are responsible for enforcing eviction policies (LRU, LFU, size limits)
   * if the cache capacity is exceeded by this operation.
   * @async
   * @param {CachedFrameInfo} frameInfo - The frame information to cache.
   * The `frameDigest` within this object is the primary key.
   * The `timestampAdded` and `lastAccessedTimestamp` should be set appropriately by the caller or cache.
   * `accessCount` should be initialized (e.g., to 1) if it's a new entry.
   * @returns {Promise<void>} A promise that resolves upon successful storage.
   * @throws {VisionError} If storing fails (e.g., cache full and cannot evict, serialization error, storage error).
   */
  set(frameInfo: CachedFrameInfo): Promise<void>;

  /**
   * Removes frame information from the cache based on its digest.
   * @async
   * @param {string} frameDigest - The digest of the frame to remove.
   * @returns {Promise<boolean>} A promise resolving to `true` if an item was found and removed,
   * `false` if the item was not found.
   * @throws {VisionError} For critical cache deletion errors.
   */
  delete(frameDigest: string): Promise<boolean>;

  /**
   * Checks if frame information for a given digest exists in the cache and is valid (not expired).
   * This method should ideally not update LRU/LFU statistics, serving as a "peek".
   * @async
   * @param {string} frameDigest - The digest to check.
   * @returns {Promise<boolean>} True if the digest exists and the entry is valid (not TTL-expired), false otherwise.
   * @throws {VisionError} For critical cache access errors.
   */
  has(frameDigest: string): Promise<boolean>;

  /**
   * Clears all entries from the cache, resetting it to an empty state.
   * Statistics related to item counts should be reset.
   * @async
   * @returns {Promise<void>} A promise that resolves when the cache is cleared.
   * @throws {VisionError} If clearing fails.
   */
  clear(): Promise<void>;

  /**
   * Retrieves statistics about the cache's current state and performance.
   * @async
   * @returns {Promise<FrameCacheStats>} A promise resolving to the cache statistics.
   * @throws {VisionError} If statistics cannot be retrieved.
   */
  getStats(): Promise<FrameCacheStats>;

  /**
   * Manually triggers a pruning process to remove expired (TTL) or other policy-violating entries.
   * Some cache implementations might perform pruning automatically in the background, while others
   * might rely on this explicit call or prune lazily during `get`/`has` operations.
   * @async
   * @returns {Promise<{ entriesRemoved: number }>} A promise resolving to information about the pruning operation,
   * specifically the number of entries removed.
   * @throws {VisionError} If the pruning process encounters an error.
   */
  prune(): Promise<{ entriesRemoved: number }>;

  /**
   * Gracefully shuts down the cache. For persistent caches, this might involve flushing
   * pending writes to disk/database and releasing connections or resources.
   * For in-memory caches, it might simply involve clearing data and stopping any background tasks (like pruning timers).
   * @async
   * @returns {Promise<void>} A promise that resolves when the shutdown is complete.
   * @throws {VisionError} If shutdown fails.
   */
  shutdown(): Promise<void>;
}