/**
 * @file docx-extractor.ts
 * @description Extracts plain text from DOCX attachments using mammoth.
 *
 * @module email-intelligence/extractors
 */

import type { IAttachmentExtractor } from './extractor-registry.js';

export class DocxExtractor implements IAttachmentExtractor {
  async extract(
    content: Buffer,
    filename: string
  ): Promise<{ text: string; metadata?: Record<string, any> }> {
    try {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer: content });

      return {
        text: result.value?.trim() || '',
        metadata: {
          messages: result.messages,
          filename,
        },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        text: '',
        metadata: {
          error: `DOCX extraction failed: ${message}`,
          filename,
        },
      };
    }
  }
}
