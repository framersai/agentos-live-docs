/**
 * @file text-extractor.ts
 * @description Simple UTF-8 text extractor for plain text, CSV, HTML, and code files.
 *
 * @module email-intelligence/extractors
 */

import type { IAttachmentExtractor } from './extractor-registry.js';

export class TextExtractor implements IAttachmentExtractor {
  async extract(
    content: Buffer,
    filename: string
  ): Promise<{ text: string; metadata?: Record<string, any> }> {
    const text = content.toString('utf-8');

    return {
      text: text.trim(),
      metadata: {
        byteLength: content.length,
        charLength: text.length,
        filename,
      },
    };
  }
}
