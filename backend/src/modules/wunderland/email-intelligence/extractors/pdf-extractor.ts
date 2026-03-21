/**
 * @file pdf-extractor.ts
 * @description Extracts text content from PDF attachments using pdf-parse.
 *              Falls back to empty string for scanned/image PDFs (OCR deferred).
 *
 * @module email-intelligence/extractors
 */

import type { IAttachmentExtractor } from './extractor-registry.js';

export class PdfExtractor implements IAttachmentExtractor {
  async extract(
    content: Buffer,
    filename: string
  ): Promise<{ text: string; metadata?: Record<string, any> }> {
    try {
      // Dynamic import to avoid top-level require issues
      const pdfParse = (await import('pdf-parse')).default;
      const result = await pdfParse(content);

      return {
        text: result.text?.trim() || '',
        metadata: {
          pages: result.numpages,
          info: result.info,
          filename,
        },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        text: '',
        metadata: {
          error: `PDF extraction failed: ${message}`,
          filename,
        },
      };
    }
  }
}
