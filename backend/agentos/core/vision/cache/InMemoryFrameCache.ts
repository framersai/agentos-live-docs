// File: backend/agentos/core/vision/cache/InMemoryFrameCache.ts
/**
 * @file InMemoryFrameCache.ts
 * @module backend/agentos/core/vision/cache/InMemoryFrameCache
 * @version 1.0.1
 * @description An in-memory implementation of the IFrameCache interface using a Map
 * with LRU (Least Recently Used) and optional TTL (Time-To-Live) eviction strategies.
 * This cache is suitable for single-instance deployments where persistence across
 * restarts is not required.
 *
 * It includes "decay" through TTL and LRU policies. "Evolutionary" aspects could
 * be added by allowing dynamic adjustment of `maxItems` or `defaultTTLMs` based
 * on system load or `VisualEnvironmentProfile` feedback, managed by a higher-level service.
 */

import { IFrameCache, FrameCacheStats, FrameCacheConfigBase } from './IFrameCache';
import { CachedFrameInfo } from '../types/CachedFrame';
import { VisionError, VisionErrorCode } from '../errors/VisionError';
import { v4 as uuidv4 } from 'uuid';

/**
 * @interface InMemoryFrameCacheConfig
 * @description Configuration options for the InMemoryFrameCache, extending FrameCacheConfigBase.
 */
export interface InMemoryFrameCacheConfig extends FrameCacheConfigBase {
  /**
   * @property {number} [maxItems=1000]
   * @description Maximum number of items to store in the cache. When exceeded,
   * the least recently used item is evicted.
   * @default 1000
   */
  maxItems?: number;

  /**
   * @property {number} [defaultTTLMs=0]
   * @description Optional. Default Time-To-Live for cache entries in milliseconds.
   * If set to 0 or not provided, entries do not expire based on TTL (only by LRU).
   * @default 0
   */
  defaultTTLMs?: number;

  /**
   * @property {number} [pruneIntervalMs=0]
   * @description Interval in milliseconds at which to automatically prune expired (TTL) entries.
   * Set to 0 or a negative value to disable automatic background pruning.
   * Pruning will still occur lazily on `get` or `has` if TTL is enabled.
   * @default 0 (Automatic background pruning disabled by default)
   */
  pruneIntervalMs?: number;
}

interface InternalCacheEntry {
  info: CachedFrameInfo;
  expiresAt?: number; // Unix timestamp in ms for TTL
}

/**
 * @class InMemoryFrameCache
 * @implements IFrameCache
 * @description An in-memory cache with LRU and TTL support for storing `CachedFrameInfo`.
 */
export class InMemoryFrameCache implements IFrameCache {
  public readonly cacheId: string;
  private cache: Map<string, InternalCacheEntry>;
  /**
   * Stores keys in order of access. The key at index 0 is the least recently used.
   * The key at the end is the most recently used.
   */
  private lruOrder: string[];
  private config!: Required<Omit<InMemoryFrameCacheConfig, 'cacheId'>> & Pick<InMemoryFrameCacheConfig, 'cacheId'>;
  private stats: FrameCacheStats;
  private pruneIntervalId?: NodeJS.Timeout;
  private _isInitialized: boolean = false;

  /**
   * Constructs an InMemoryFrameCache instance.
   * @param {string} [cacheId] - Optional ID for the cache. A UUID will be generated if not provided.
   */
  constructor(cacheId?: string) {
    this.cacheId = cacheId || `inmemory-frame-cache-${uuidv4()}`;
    this.cache = new Map<string, InternalCacheEntry>();
    this.lruOrder = [];
    this.stats = this.resetStatsInternal();
  }

  /** @inheritdoc */
  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  private resetStatsInternal(): FrameCacheStats {
    return {
      hits: 0,
      misses: 0,
      additions: 0,
      updates: 0,
      evictions: 0,
      currentSizeItems: 0,
      maxSizeItems: this.config?.maxItems,
      currentSizeBytes: 0, // Basic implementation won't track byte size accurately
      maxSizeBytes: undefined,
      lastPrunedAt: undefined,
      entriesPrunedLast: 0,
    };
  }

  /**
   * @inheritdoc
   */
  public async initialize(config: InMemoryFrameCacheConfig): Promise<void> {
    if (this._isInitialized) {
      if (config.logActivity ?? this.config?.logActivity) {
        console.warn(`InMemoryFrameCache (ID: ${this.cacheId}): Already initialized. Re-initializing.`);
      }
      await this.shutdown(); // Clear existing state and timers before re-initializing
    }

    this.config = {
      maxItems: 1000,
      defaultTTLMs: 0,
      pruneIntervalMs: 0,
      logActivity: false,
      ...config, // User-provided config overrides defaults
      cacheId: this.cacheId, // Ensure constructor's cacheId is preserved or config's is used
    };

    this.stats = this.resetStatsInternal(); // Reset stats with new config
    this.stats.maxSizeItems = this.config.maxItems;

    if (this.config.defaultTTLMs > 0 && this.config.pruneIntervalMs > 0) {
      this.pruneIntervalId = setInterval(() => {
        this.prune().catch(err => console.error(`InMemoryFrameCache (ID: ${this.cacheId}): Error during automatic prune:`, err));
      }, this.config.pruneIntervalMs);
    }
    this._isInitialized = true;
    if (this.config.logActivity) {
      console.log(`InMemoryFrameCache (ID: ${this.cacheId}) initialized. Max items: ${this.config.maxItems}, TTL: ${this.config.defaultTTLMs || 'N/A'}ms, Prune Interval: ${this.config.pruneIntervalMs > 0 ? this.config.pruneIntervalMs : 'N/A'}ms.`);
    }
  }

  private ensureInitialized(): void {
    if (!this._isInitialized) {
      throw new VisionError(
        `InMemoryFrameCache (ID: ${this.cacheId}) is not initialized. Call initialize() first.`,
        VisionErrorCode.CACHE_ERROR,
        { operation: 'ensureInitialized', cacheId: this.cacheId }
      );
    }
  }

  private isEntryExpired(entry: InternalCacheEntry): boolean {
    return !!(entry.expiresAt && entry.expiresAt < Date.now());
  }

  private touchEntry(frameDigest: string): void {
    const index = this.lruOrder.indexOf(frameDigest);
    if (index > -1) {
      this.lruOrder.splice(index, 1);
    }
    this.lruOrder.push(frameDigest); // Move to end (most recently used)
  }


  /**
   * @inheritdoc
   */
  public async get(frameDigest: string): Promise<CachedFrameInfo | undefined> {
    this.ensureInitialized();
    const entry = this.cache.get(frameDigest);

    if (entry) {
      if (this.isEntryExpired(entry)) {
        this.deleteInternal(frameDigest, true); // true for TTL eviction reason
        this.stats.misses++;
        if (this.config.logActivity) console.log(`InMemoryFrameCache (ID: ${this.cacheId}): TTL Expired for ${frameDigest} on get.`);
        return undefined;
      }

      this.touchEntry(frameDigest);
      this.stats.hits++;
      entry.info.accessCount += 1;
      entry.info.lastAccessedTimestamp = Date.now();
      // Return a deep copy to prevent external modification of cached object
      return JSON.parse(JSON.stringify(entry.info));
    }

    this.stats.misses++;
    return undefined;
  }

  /**
   * @inheritdoc
   */
  public async set(frameInfo: CachedFrameInfo): Promise<void> {
    this.ensureInitialized();
    if (!frameInfo || !frameInfo.frameDigest) {
      throw new VisionError('Invalid frameInfo or missing frameDigest for cache set operation.', VisionErrorCode.CACHE_ERROR, { frameInfo, cacheId: this.cacheId });
    }

    const frameDigest = frameInfo.frameDigest;
    const existingEntry = this.cache.get(frameDigest);
    const now = Date.now();

    // Create or update entry
    const newInfo: CachedFrameInfo = {
      ...frameInfo, // User provided info takes precedence for content
      frameDigest: frameDigest, // Ensure digest is from input
      timestampAdded: existingEntry ? existingEntry.info.timestampAdded : now,
      lastAccessedTimestamp: now,
      accessCount: (existingEntry ? existingEntry.info.accessCount : 0) + 1, // Increment on set/update, or init to 1
    };

    const newEntry: InternalCacheEntry = {
      info: newInfo,
      expiresAt: frameInfo.expiresAt ?? (this.config.defaultTTLMs > 0 ? now + this.config.defaultTTLMs : undefined),
    };

    this.cache.set(frameDigest, newEntry);
    this.touchEntry(frameDigest); // Update LRU order

    if (existingEntry) {
      this.stats.updates++;
    } else {
      this.stats.additions++;
    }

    // LRU Eviction
    if (this.lruOrder.length > this.config.maxItems) {
      const oldestKey = this.lruOrder.shift(); // Remove the least recently used from the front
      if (oldestKey) {
        this.deleteInternal(oldestKey, false); // false for LRU eviction reason
      }
    }
    this.stats.currentSizeItems = this.cache.size;
  }

  /**
   * Internal delete operation to handle stats correctly based on reason.
   */
  private deleteInternal(frameDigest: string, isTtlEviction: boolean): boolean {
    if (this.cache.delete(frameDigest)) {
      this.lruOrder = this.lruOrder.filter(key => key !== frameDigest);
      this.stats.evictions++; // Count both TTL and LRU as evictions for this stat
      if (this.config.logActivity) {
        console.log(`InMemoryFrameCache (ID: ${this.cacheId}): ${isTtlEviction ? 'TTL Evicted' : 'LRU Evicted'} ${frameDigest}`);
      }
      this.stats.currentSizeItems = this.cache.size;
      return true;
    }
    return false;
  }


  /**
   * @inheritdoc
   */
  public async delete(frameDigest: string): Promise<boolean> {
    this.ensureInitialized();
    const wasPresent = this.cache.has(frameDigest);
    if (wasPresent) {
        // Manually deleted entries aren't "evictions" in the policy sense, but they reduce size.
        this.cache.delete(frameDigest);
        this.lruOrder = this.lruOrder.filter(key => key !== frameDigest);
        this.stats.currentSizeItems = this.cache.size;
        if (this.config.logActivity) console.log(`InMemoryFrameCache (ID: ${this.cacheId}): Manually deleted ${frameDigest}`);
        return true;
    }
    return false;
  }

  /**
   * @inheritdoc
   */
  public async has(frameDigest: string): Promise<boolean> {
    this.ensureInitialized();
    const entry = this.cache.get(frameDigest);
    if (entry) {
      if (this.isEntryExpired(entry)) {
        this.deleteInternal(frameDigest, true); // Lazy prune on has check
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * @inheritdoc
   */
  public async clear(): Promise<void> {
    this.ensureInitialized();
    this.cache.clear();
    this.lruOrder = [];
    this.stats = this.resetStatsInternal();
    this.stats.maxSizeItems = this.config.maxItems; // Retain configured max size
    if (this.config.logActivity) console.log(`InMemoryFrameCache (ID: ${this.cacheId}): Cache cleared.`);
  }

  /**
   * @inheritdoc
   */
  public async getStats(): Promise<FrameCacheStats> {
    this.ensureInitialized();
    this.stats.currentSizeItems = this.cache.size;
    // Note: currentSizeBytes is not accurately tracked in this basic implementation.
    // A more advanced version might estimate based on CachedFrameInfo content.
    return JSON.parse(JSON.stringify(this.stats)); // Return a deep copy
  }

  /**
   * @inheritdoc
   */
  public async prune(): Promise<{ entriesRemoved: number }> {
    this.ensureInitialized();
    let entriesRemoved = 0;
    if (!(this.config.defaultTTLMs > 0)) {
      if (this.config.logActivity && this.config.pruneIntervalMs > 0) { // Only log if auto-pruning was configured
        console.log(`InMemoryFrameCache (ID: ${this.cacheId}): Pruning skipped, TTL not configured or TTL is 0.`);
      }
      return { entriesRemoved };
    }

    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (this.isEntryExpired(entry)) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      if(this.deleteInternal(key, true)) { // true for TTL eviction reason
          entriesRemoved++;
      }
    }

    this.stats.entriesPrunedLast = entriesRemoved;
    this.stats.lastPrunedAt = Date.now();
    if (entriesRemoved > 0 && this.config.logActivity) {
      console.log(`InMemoryFrameCache (ID: ${this.cacheId}): Pruned ${entriesRemoved} expired entries.`);
    }
    return { entriesRemoved };
  }

  /**
   * @inheritdoc
   */
  public async shutdown(): Promise<void> {
    // No need to call ensureInitialized here as shutdown should work even if init failed partially
    if (this.pruneIntervalId) {
      clearInterval(this.pruneIntervalId);
      this.pruneIntervalId = undefined;
    }
    this.cache.clear();
    this.lruOrder = [];
    this.stats = this.resetStatsInternal(); // Reset all stats
    this._isInitialized = false;
    if (this.config?.logActivity) console.log(`InMemoryFrameCache (ID: ${this.cacheId}): Shutdown complete.`);
  }
}