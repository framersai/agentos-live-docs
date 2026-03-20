/**
 * @file extractor-registry.ts
 * @description Registry mapping MIME types to attachment content extractors.
 *              Classifies types as "eager" (text-based, extracted inline) or
 *              "deferred" (image-based, requires explicit vision API call).
 *
 * @module email-intelligence/extractors
 */

import { PdfExtractor } from './pdf-extractor.js';
import { DocxExtractor } from './docx-extractor.js';
import { XlsxExtractor } from './xlsx-extractor.js';
import { TextExtractor } from './text-extractor.js';
import { ImageTranscriber } from './image-transcriber.js';

// ---------------------------------------------------------------------------
// Extractor interface
// ---------------------------------------------------------------------------

export interface IAttachmentExtractor {
  extract(
    content: Buffer,
    filename: string
  ): Promise<{ text: string; metadata?: Record<string, any> }>;
}

// ---------------------------------------------------------------------------
// MIME type classification
// ---------------------------------------------------------------------------

const EAGER_MIME_MAP: Record<string, () => IAttachmentExtractor> = {
  'application/pdf': () => new PdfExtractor(),
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': () =>
    new DocxExtractor(),
  'application/msword': () => new DocxExtractor(),
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': () => new XlsxExtractor(),
  'application/vnd.ms-excel': () => new XlsxExtractor(),
  'text/plain': () => new TextExtractor(),
  'text/csv': () => new TextExtractor(),
  'text/html': () => new TextExtractor(),
  'text/markdown': () => new TextExtractor(),
  'text/xml': () => new TextExtractor(),
  'application/json': () => new TextExtractor(),
  'application/xml': () => new TextExtractor(),
  'application/javascript': () => new TextExtractor(),
  'text/javascript': () => new TextExtractor(),
  'text/css': () => new TextExtractor(),
};

const DEFERRED_MIME_PREFIXES = ['image/'];

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export class ExtractorRegistry {
  /**
   * Return an extractor for the given MIME type, or null if unsupported.
   */
  getExtractor(mimeType: string): IAttachmentExtractor | null {
    // Exact match in eager map
    const eagerFactory = EAGER_MIME_MAP[mimeType];
    if (eagerFactory) return eagerFactory();

    // Wildcard text/* match
    if (mimeType.startsWith('text/') && !EAGER_MIME_MAP[mimeType]) {
      return new TextExtractor();
    }

    // Image → deferred transcriber
    if (this.isDeferredType(mimeType)) {
      return new ImageTranscriber();
    }

    return null;
  }

  /**
   * True for MIME types that can be extracted eagerly (text-based extraction).
   */
  isEagerType(mimeType: string): boolean {
    if (EAGER_MIME_MAP[mimeType]) return true;
    if (mimeType.startsWith('text/')) return true;
    return false;
  }

  /**
   * True for MIME types that require deferred processing (vision API).
   */
  isDeferredType(mimeType: string): boolean {
    return DEFERRED_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix));
  }
}
