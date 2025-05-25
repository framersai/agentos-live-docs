// File: backend/agentos/core/vision/utils/ImageUtils.ts
/**
 * @file ImageUtils.ts
 * @module backend/agentos/core/vision/utils/ImageUtils
 * @version 1.0.0
 * @description Provides utility functions for basic image processing tasks
 * relevant to the vision subsystem, such as calculating image digests (hashes)
 * or extracting simple metrics. These utilities are intended to be lightweight
 * and primarily operate on image data that is already loaded (e.g., as base64
 * strings or pixel arrays if further processing is done after initial load).
 *
 * For more advanced image manipulation or analysis, dedicated libraries or
 * the IVisionProvider implementations should be used.
 */

import { createHash } from 'crypto';
import { VisionInputData, FrameResolution } from '../types/VisionInput';

/**
 * @class ImageUtils
 * @description A collection of static utility methods for image processing.
 */
export class ImageUtils {
  /**
   * Calculates a simple digest (hash) for an image represented by VisionInputData.
   * This uses MD5 on the data string (URL or base64 content) for simplicity.
   * For more robust perceptual hashing, a dedicated library would be needed.
   *
   * @static
   * @param {VisionInputData} visionInput - The vision input data.
   * @returns {string} An MD5 hash of the image data string.
   * @example
   * const digest = ImageUtils.calculateSimpleDigest({ type: 'base64', data: 'iVBORw0KGgoAAAAN...' });
   * // digest might be "md5:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   */
  public static calculateSimpleDigest(visionInput: VisionInputData): string {
    if (!visionInput || !visionInput.data) {
      // Consider throwing an error or returning a default "empty" digest
      console.warn('ImageUtils: Cannot calculate digest for empty or invalid VisionInputData.');
      return 'md5:empty_input_data';
    }
    const hash = createHash('md5');
    hash.update(visionInput.data); // Hash the URL or the base64 content itself
    return `md5:${hash.digest('hex')}`;
  }

  /**
   * Placeholder for a perceptual hash function.
   * Calculating a true perceptual hash (like pHash, aHash, dHash) from raw pixel data
   * in Node.js without external image processing libraries (like Sharp, Jimp + algorithms)
   * is complex. This function serves as a placeholder.
   *
   * In a real implementation, you'd typically:
   * 1. Decode the base64 image data to raw pixel buffer (if not already).
   * 2. Resize to a small, fixed size (e.g., 8x8 or 32x32).
   * 3. Convert to grayscale.
   * 4. Apply the specific perceptual hashing algorithm (e.g., DCT for pHash, averaging for aHash).
   *
   * @static
   * @param {VisionInputData} visionInput - The vision input data.
   * @param {'aHash' | 'pHash' | 'dHash'} [algorithm='aHash'] - The desired algorithm.
   * @returns {Promise<string>} A string representing the perceptual hash (e.g., "phash:abcdef1234567890").
   * @throws {Error} If image data cannot be processed or algorithm is not implemented.
   *
   * @example
   * // This is a conceptual example, actual implementation requires image lib
   * // const pHashValue = await ImageUtils.calculatePerceptualHash(imageData);
   */
  public static async calculatePerceptualHash(
    visionInput: VisionInputData,
    algorithm: 'aHash' | 'pHash' | 'dHash' = 'aHash',
  ): Promise<string> {
    if (visionInput.type === 'image_url') {
      // TODO: Implement fetching image from URL if direct pHash on URL isn't an option
      console.warn('ImageUtils: Perceptual hashing on image_url requires fetching and processing the image. This mock returns a simple digest.');
      return `${algorithm}:${this.calculateSimpleDigest(visionInput).split(':')[1].substring(0, 16)}`; // Fallback
    }

    // This is where actual pHash logic would go using an image processing library.
    // Since we are avoiding heavy dependencies for this core utility class for now,
    // we'll return a simulated hash derived from the simple digest.
    // In a real system, you would integrate a library like 'sharp' and 'imghash'.
    console.warn(`ImageUtils: True perceptual hashing for '${algorithm}' is not implemented in this basic utility. Returning a simulated hash based on MD5.`);
    const simpleDigest = this.calculateSimpleDigest(visionInput);
    const pseudoPHash = simpleDigest.split(':')[1].substring(0, 16); // Take first 16 chars of MD5
    return `${algorithm}:${pseudoPHash}`;
  }


  /**
   * Simulates extracting basic image metrics like average brightness or color histogram.
   * True calculation requires decoding the image and accessing pixel data.
   *
   * @static
   * @param {VisionInputData} visionInput - The vision input data.
   * @returns {Promise<{ averageBrightness?: number; dominantColor?: string }>} Simulated basic metrics.
   * @throws {Error} If image data is invalid.
   */
  public static async extractBasicImageMetrics(
    visionInput: VisionInputData,
  ): Promise<{ averageBrightness?: number; dominantColorHex?: string; resolution?: FrameResolution }> {
    if (!visionInput.data) {
      throw new Error('ImageUtils: Cannot extract metrics from empty image data.');
    }

    // Simulate metrics. In a real scenario, decode image (e.g., base64 to buffer)
    // and use a library like 'sharp' or 'jimp' to get pixel data.
    const simulatedBrightness = Math.random() * 0.5 + 0.25; // Simulate value between 0.25 and 0.75

    // Simulate a dominant color
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const simulatedDominantColorHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    // Simulate resolution (could be part of metadata, but can also be extracted)
    // This is highly dependent on having an image processing library.
    // For a base64 data URI, one might try to parse dimensions if embedded,
    // or use a library to load the image and get its properties.
    // Here, we'll just return a mock resolution.
    const simulatedResolution: FrameResolution = {
        width: Math.floor(Math.random() * 1000) + 640, // e.g. 640-1639
        height: Math.floor(Math.random() * 800) + 480 // e.g. 480-1279
    };


    return {
      averageBrightness: parseFloat(simulatedBrightness.toFixed(2)),
      dominantColorHex: simulatedDominantColorHex,
      resolution: simulatedResolution,
    };
  }

  /**
   * Compares two frame digests (hashes).
   *
   * @static
   * @param {string} digest1 - The first digest string (e.g., "md5:abc...", "phash:123...").
   * @param {string} digest2 - The second digest string.
   * @returns {{areSame: boolean; distance?: number; method?: string}}
   * `areSame` is true if digests are identical.
   * `distance` (optional) is the Hamming distance if both are pHashes of same length.
   * `method` indicates the comparison type.
   */
  public static compareDigests(
    digest1: string,
    digest2: string
  ): { areSame: boolean; distance?: number; method?: string } {
    if (digest1 === digest2) {
      return { areSame: true, method: 'exact_match' };
    }

    const [type1, hash1] = digest1.split(':');
    const [type2, hash2] = digest2.split(':');

    if (type1 === type2 && (type1 === 'phash' || type1 === 'ahash' || type1 === 'dhash') && hash1 && hash2 && hash1.length === hash2.length) {
      // Calculate Hamming distance for perceptual hashes
      let distance = 0;
      for (let i = 0; i < hash1.length; i++) {
        if (hash1[i] !== hash2[i]) {
          distance++;
        }
      }
      return { areSame: false, distance, method: `${type1}_hamming_distance` };
    }

    return { areSame: false, method: 'inexact_match_unknown_types' };
  }

  /**
   * Validates if the VisionInputData seems plausible.
   * Basic checks for data presence and type.
   *
   * @static
   * @param {VisionInputData} input - The vision input to validate.
   * @returns {{isValid: boolean; errors: string[]}} Validation result.
   */
  public static validateVisionInputData(input: VisionInputData): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!input) {
          errors.push("Input data is null or undefined.");
          return { isValid: false, errors };
      }
      if (!['image_url', 'base64'].includes(input.type)) {
          errors.push(`Invalid input type: '${input.type}'. Must be 'image_url' or 'base64'.`);
      }
      if (typeof input.data !== 'string' || input.data.trim() === '') {
          errors.push("Image data string is missing or empty.");
      }
      if (input.type === 'base64' && !(input.mimeType || input.data.startsWith('data:image/'))) {
          errors.push("MIME type is recommended for base64 data if not included in data URI scheme.");
      }
      if (input.type === 'image_url') {
          try {
              new URL(input.data);
          } catch (_) {
              errors.push("Image data URL is not a valid URL.");
          }
      }
      return { isValid: errors.length === 0, errors };
  }
}