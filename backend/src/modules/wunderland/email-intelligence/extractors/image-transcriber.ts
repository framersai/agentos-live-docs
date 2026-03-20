/**
 * @file image-transcriber.ts
 * @description Transcribes image content using OpenAI's vision API (gpt-4o).
 *              Uses OPENAI_API_KEY or OPENROUTER_API_KEY. If neither is available,
 *              returns an empty result with an error metadata field.
 *
 * @module email-intelligence/extractors
 */

import type { IAttachmentExtractor } from './extractor-registry.js';

export class ImageTranscriber implements IAttachmentExtractor {
  async extract(
    content: Buffer,
    filename: string
  ): Promise<{ text: string; metadata?: Record<string, any> }> {
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return {
        text: '',
        metadata: { error: 'No vision API key configured', filename },
      };
    }

    const isOpenRouter = !process.env.OPENAI_API_KEY && !!process.env.OPENROUTER_API_KEY;
    const baseURL = isOpenRouter ? 'https://openrouter.ai/api/v1' : undefined;

    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey, baseURL });

      // Determine MIME type from filename extension as fallback
      const mimeType = this.guessMimeType(filename);
      const base64 = content.toString('base64');

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe this image in detail. If it contains text, transcribe all visible text. If it is a diagram, describe the structure. Focus on information useful for understanding the email this was attached to.',
              },
              {
                type: 'image_url',
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });

      const description = response.choices?.[0]?.message?.content?.trim() || '';

      return {
        text: description,
        metadata: {
          model: 'gpt-4o',
          tokens: response.usage?.total_tokens,
          filename,
        },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        text: '',
        metadata: {
          error: `Image transcription failed: ${message}`,
          filename,
        },
      };
    }
  }

  private guessMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      case 'svg':
        return 'image/svg+xml';
      case 'bmp':
        return 'image/bmp';
      default:
        return 'image/png';
    }
  }
}
