// File: backend/agentos/core/vision/types/CachedFrame.ts
/**
 * @file CachedFrame.ts
 * @module backend/agentos/core/vision/types/CachedFrame
 * @version 1.0.0
 * @description Defines structures related to caching processed visual frames and their associated information.
 * This is crucial for optimizing performance by avoiding redundant analysis of unchanged or recently seen frames.
 */

import { ImageFeatureSet, ProcessedVisionData } from './VisionOutput';
import { FrameResolution } from './VisionInput';

/**
 * @interface CachedFrameInfo
 * @description Information stored in the frame cache for a previously processed visual frame.
 * This allows the system to quickly retrieve analysis results or features for frames it has seen before.
 * The `frameDigest` is the primary key for this cache entry.
 */
export interface CachedFrameInfo {
  /**
   * @property {string} frameDigest
   * @description A unique digest or hash of the frame's content (e.g., "phash:a1b2c3d4e5f6", "md5:abcdef...").
   * This is the primary key for cache lookups. The prefix indicates the hashing algorithm.
   */
  readonly frameDigest: string;

  /**
   * @property {number} timestampAdded
   * @description Unix epoch (ms) when this frame information was first added to the cache.
   * Used for cache eviction policies (e.g., LRU, TTL).
   */
  readonly timestampAdded: number;

  /**
   * @property {number} [originalFrameTimestamp]
   * @description Optional. The timestamp from the `FrameMetadata` of the original frame, if available.
   * Useful for correlating cached data with the source stream and understanding frame age.
   */
  originalFrameTimestamp?: number;

  /**
   * @property {FrameResolution} [resolution]
   * @description Optional. The resolution of the cached frame. Can be useful for context or if
   * different resolutions of the same conceptual image are cached.
   */
  resolution?: FrameResolution;

  /**
   * @property {string} [sourceStreamId]
   * @description Optional. Identifier for the source stream this frame originated from (e.g., 'webcam_main', 'screen_share').
   * Helps in namespacing cache entries or applying stream-specific caching rules.
   */
  sourceStreamId?: string;

  /**
   * @property {ImageFeatureSet} [extractedFeatures]
   * @description Optional. Pre-extracted image features. Storing these can significantly speed up
   * feature-based differencing if the same frame (or a very similar one identified by digest)
   * is encountered again. This avoids re-calling the feature extraction model.
   */
  extractedFeatures?: ImageFeatureSet;

  /**
   * @property {string | Partial<ProcessedVisionData>} processedDataReference
   * @description A reference to or a subset of the full `ProcessedVisionData`.
   * - If string: An identifier (e.g., a UUID or a path/key in a separate data store)
   * linking to the full `ProcessedVisionData` if it underwent complete analysis.
   * This keeps `CachedFrameInfo` lightweight if full results are large and stored elsewhere.
   * - If `Partial<ProcessedVisionData>`: A lightweight summary or essential parts of the analysis
   * (e.g., primary scene tag, number of objects, presence of text/faces) stored directly.
   * This allows for quick access to key insights without fetching full data.
   * The choice depends on the application's needs for cache size vs. retrieval speed of full data.
   */
  processedDataReference: string | Partial<Pick<ProcessedVisionData, 'sceneUnderstanding' | 'detectedObjects' | 'ocrResult' | 'faceDetections' | 'processingTimestamp' | 'modelIdUsed'>>;

  /**
   * @property {number} accessCount
   * @description Number of times this cache entry has been successfully retrieved (hit).
   * Useful for LFU (Least Frequently Used) eviction policies. Initialized to 1 on first set.
   * @default 1
   */
  accessCount: number;

  /**
   * @property {number} lastAccessedTimestamp
   * @description Unix epoch (ms) when this cache entry was last successfully retrieved.
   * Crucial for LRU (Least Recently Used) eviction policies. Initialized to `timestampAdded` on first set.
   */
  lastAccessedTimestamp: number;

  /**
   * @property {number} [expiresAt]
   * @description Optional. Unix epoch (ms) indicating when this cache entry should be considered expired (TTL).
   * If not set, the entry expires only based on LRU/LFU or cache size limits.
   */
  expiresAt?: number;

  /**
   * @property {number} [sizeBytes]
   * @description Optional. Estimated size of this cache entry in bytes.
   * Useful for caches that manage total memory footprint.
   */
  sizeBytes?: number;

  /**
   * @property {Record<string, any>} [customCacheData]
   * @description Optional. Any other custom data specific to this cached frame instance
   * that might be useful for advanced caching strategies, debugging, or context.
   * @example { "sourceFrameId": "frame_12345", "processingPipelineVersion": "v1.2" }
   */
  customCacheData?: Record<string, any>;
}