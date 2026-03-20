/**
 * @file xlsx-extractor.ts
 * @description Extracts text from XLSX/XLS attachments using the xlsx library.
 *              Converts each sheet to CSV-like text and joins with separators.
 *
 * @module email-intelligence/extractors
 */

import type { IAttachmentExtractor } from './extractor-registry.js';

export class XlsxExtractor implements IAttachmentExtractor {
  async extract(
    content: Buffer,
    filename: string
  ): Promise<{ text: string; metadata?: Record<string, any> }> {
    try {
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(content, { type: 'buffer' });

      const sheetTexts: string[] = [];

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) continue;

        const csv = XLSX.utils.sheet_to_csv(sheet);
        if (csv.trim()) {
          sheetTexts.push(`--- Sheet: ${sheetName} ---\n${csv.trim()}`);
        }
      }

      return {
        text: sheetTexts.join('\n\n'),
        metadata: {
          sheetCount: workbook.SheetNames.length,
          sheetNames: workbook.SheetNames,
          filename,
        },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        text: '',
        metadata: {
          error: `XLSX extraction failed: ${message}`,
          filename,
        },
      };
    }
  }
}
