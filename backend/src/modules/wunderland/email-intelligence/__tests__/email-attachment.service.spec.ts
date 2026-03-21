/**
 * @file email-attachment.service.spec.ts
 * @description Tests for the attachment extraction pipeline: individual extractors,
 *              ExtractorRegistry routing, and EmailAttachmentService integration.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import {
  initializeAppDatabase,
  closeAppDatabase,
  generateId,
  __setAppDatabaseAdapterResolverForTests,
} from '../../../../core/database/appDatabase.js';
import { resolveStorageAdapter } from '@framers/sql-storage-adapter';
import { DatabaseService } from '../../../../database/database.service.js';

// ---------------------------------------------------------------------------
// Mock pdf-parse, mammoth, xlsx BEFORE importing extractors
// ---------------------------------------------------------------------------

vi.mock('pdf-parse', () => ({
  default: vi.fn(async (buffer: Buffer) => ({
    text: 'Extracted PDF text content',
    numpages: 3,
    info: { Title: 'Test PDF' },
  })),
}));

vi.mock('mammoth', () => ({
  extractRawText: vi.fn(async ({ buffer }: { buffer: Buffer }) => ({
    value: 'Extracted DOCX text content',
    messages: [],
  })),
}));

vi.mock('xlsx', () => {
  const sheet1 = {};
  const sheet2 = {};
  return {
    read: vi.fn((buffer: Buffer, opts: any) => ({
      SheetNames: ['Sheet1', 'Sheet2'],
      Sheets: { Sheet1: sheet1, Sheet2: sheet2 },
    })),
    utils: {
      sheet_to_csv: vi.fn((sheet: any) => {
        // Return different CSV for each call (Sheet1, Sheet2)
        return 'col1,col2\nval1,val2';
      }),
    },
  };
});

vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn(async () => ({
          choices: [{ message: { content: 'A photo of a chart showing revenue growth.' } }],
          usage: { total_tokens: 150 },
        })),
      },
    },
  })),
}));

// ---------------------------------------------------------------------------
// Now import extractors and service
// ---------------------------------------------------------------------------

import { PdfExtractor } from '../extractors/pdf-extractor.js';
import { DocxExtractor } from '../extractors/docx-extractor.js';
import { XlsxExtractor } from '../extractors/xlsx-extractor.js';
import { TextExtractor } from '../extractors/text-extractor.js';
import { ImageTranscriber } from '../extractors/image-transcriber.js';
import { ExtractorRegistry } from '../extractors/extractor-registry.js';
import { EmailAttachmentService } from '../services/email-attachment.service.js';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

let db: DatabaseService;
let service: EmailAttachmentService;

async function insertTestAttachment(
  overrides: Partial<{
    id: string;
    message_id: string;
    account_id: string;
    filename: string;
    mime_type: string;
    extraction_status: string;
    gmail_attachment_id: string | null;
  }>
): Promise<string> {
  const id = overrides.id || generateId();
  const now = Date.now();
  await db.run(
    `INSERT INTO wunderland_email_attachments
      (id, message_id, account_id, gmail_attachment_id, filename, mime_type,
       size_bytes, extraction_status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      overrides.message_id || 'msg-001',
      overrides.account_id || 'acc-001',
      overrides.gmail_attachment_id ?? null,
      overrides.filename || 'test.txt',
      overrides.mime_type || 'text/plain',
      1024,
      overrides.extraction_status || 'pending',
      now,
      now,
    ]
  );
  return id;
}

// ---------------------------------------------------------------------------
// Setup & teardown
// ---------------------------------------------------------------------------

beforeAll(async () => {
  __setAppDatabaseAdapterResolverForTests(async () => {
    return resolveStorageAdapter({ priority: ['sqljs'] });
  });

  await initializeAppDatabase();
  db = new DatabaseService();
  service = new EmailAttachmentService(db);
});

afterAll(async () => {
  __setAppDatabaseAdapterResolverForTests(); // reset
  await closeAppDatabase();
});

beforeEach(async () => {
  // Clean attachment table between tests
  await db.run(`DELETE FROM wunderland_email_attachments`, []);
});

// ===========================================================================
// Individual extractor tests
// ===========================================================================

describe('PdfExtractor', () => {
  it('extracts text from a valid PDF buffer', async () => {
    const extractor = new PdfExtractor();
    const result = await extractor.extract(Buffer.from('fake-pdf'), 'report.pdf');

    expect(result.text).toBe('Extracted PDF text content');
    expect(result.metadata?.pages).toBe(3);
    expect(result.metadata?.filename).toBe('report.pdf');
  });
});

describe('DocxExtractor', () => {
  it('extracts text from a DOCX buffer', async () => {
    const extractor = new DocxExtractor();
    const result = await extractor.extract(Buffer.from('fake-docx'), 'document.docx');

    expect(result.text).toBe('Extracted DOCX text content');
    expect(result.metadata?.filename).toBe('document.docx');
  });
});

describe('XlsxExtractor', () => {
  it('extracts text from a multi-sheet workbook', async () => {
    const extractor = new XlsxExtractor();
    const result = await extractor.extract(Buffer.from('fake-xlsx'), 'data.xlsx');

    expect(result.text).toContain('Sheet1');
    expect(result.text).toContain('Sheet2');
    expect(result.text).toContain('col1,col2');
    expect(result.metadata?.sheetCount).toBe(2);
    expect(result.metadata?.sheetNames).toEqual(['Sheet1', 'Sheet2']);
  });
});

describe('TextExtractor', () => {
  it('handles UTF-8 text', async () => {
    const extractor = new TextExtractor();
    const text = 'Hello, world!\nLine two with unicode: \u00e9\u00e8\u00ea';
    const result = await extractor.extract(Buffer.from(text, 'utf-8'), 'notes.txt');

    expect(result.text).toBe(text);
    expect(result.metadata?.byteLength).toBeGreaterThan(0);
    expect(result.metadata?.filename).toBe('notes.txt');
  });

  it('trims whitespace', async () => {
    const extractor = new TextExtractor();
    const result = await extractor.extract(Buffer.from('  hello  \n\n'), 'test.txt');
    expect(result.text).toBe('hello');
  });
});

describe('ImageTranscriber', () => {
  it('returns empty text when no API key configured', async () => {
    // Ensure no keys
    const origOpenAI = process.env.OPENAI_API_KEY;
    const origOR = process.env.OPENROUTER_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENROUTER_API_KEY;

    try {
      const transcriber = new ImageTranscriber();
      const result = await transcriber.extract(Buffer.from('fake-image'), 'photo.png');

      expect(result.text).toBe('');
      expect(result.metadata?.error).toBe('No vision API key configured');
    } finally {
      // Restore
      if (origOpenAI) process.env.OPENAI_API_KEY = origOpenAI;
      if (origOR) process.env.OPENROUTER_API_KEY = origOR;
    }
  });

  it('calls OpenAI vision API when key is available', async () => {
    const origKey = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = 'test-key-123';

    try {
      const transcriber = new ImageTranscriber();
      const result = await transcriber.extract(Buffer.from('fake-image'), 'chart.png');

      expect(result.text).toBe('A photo of a chart showing revenue growth.');
      expect(result.metadata?.model).toBe('gpt-4o');
    } finally {
      if (origKey) {
        process.env.OPENAI_API_KEY = origKey;
      } else {
        delete process.env.OPENAI_API_KEY;
      }
    }
  });
});

// ===========================================================================
// ExtractorRegistry tests
// ===========================================================================

describe('ExtractorRegistry', () => {
  const registry = new ExtractorRegistry();

  describe('getExtractor', () => {
    it('returns PdfExtractor for application/pdf', () => {
      const extractor = registry.getExtractor('application/pdf');
      expect(extractor).toBeInstanceOf(PdfExtractor);
    });

    it('returns DocxExtractor for DOCX MIME type', () => {
      const extractor = registry.getExtractor(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      expect(extractor).toBeInstanceOf(DocxExtractor);
    });

    it('returns XlsxExtractor for XLSX MIME type', () => {
      const extractor = registry.getExtractor(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      expect(extractor).toBeInstanceOf(XlsxExtractor);
    });

    it('returns TextExtractor for text/plain', () => {
      const extractor = registry.getExtractor('text/plain');
      expect(extractor).toBeInstanceOf(TextExtractor);
    });

    it('returns TextExtractor for text/csv', () => {
      const extractor = registry.getExtractor('text/csv');
      expect(extractor).toBeInstanceOf(TextExtractor);
    });

    it('returns TextExtractor for unknown text/* subtypes', () => {
      const extractor = registry.getExtractor('text/x-python');
      expect(extractor).toBeInstanceOf(TextExtractor);
    });

    it('returns ImageTranscriber for image/*', () => {
      expect(registry.getExtractor('image/png')).toBeInstanceOf(ImageTranscriber);
      expect(registry.getExtractor('image/jpeg')).toBeInstanceOf(ImageTranscriber);
      expect(registry.getExtractor('image/webp')).toBeInstanceOf(ImageTranscriber);
    });

    it('returns null for unsupported types', () => {
      expect(registry.getExtractor('application/zip')).toBeNull();
      expect(registry.getExtractor('video/mp4')).toBeNull();
      expect(registry.getExtractor('audio/mpeg')).toBeNull();
    });
  });

  describe('isEagerType', () => {
    it('returns true for text-extractable types', () => {
      expect(registry.isEagerType('application/pdf')).toBe(true);
      expect(registry.isEagerType('text/plain')).toBe(true);
      expect(registry.isEagerType('text/csv')).toBe(true);
      expect(registry.isEagerType('text/html')).toBe(true);
      expect(
        registry.isEagerType(
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
      ).toBe(true);
      expect(
        registry.isEagerType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      ).toBe(true);
    });

    it('returns false for images and unsupported types', () => {
      expect(registry.isEagerType('image/png')).toBe(false);
      expect(registry.isEagerType('application/zip')).toBe(false);
    });
  });

  describe('isDeferredType', () => {
    it('returns true for image/* types', () => {
      expect(registry.isDeferredType('image/png')).toBe(true);
      expect(registry.isDeferredType('image/jpeg')).toBe(true);
      expect(registry.isDeferredType('image/gif')).toBe(true);
    });

    it('returns false for non-image types', () => {
      expect(registry.isDeferredType('application/pdf')).toBe(false);
      expect(registry.isDeferredType('text/plain')).toBe(false);
    });
  });
});

// ===========================================================================
// EmailAttachmentService integration tests
// ===========================================================================

describe('EmailAttachmentService', () => {
  describe('processAttachment', () => {
    it('sets extraction_status to "extracted" for eager text types', async () => {
      const id = await insertTestAttachment({
        filename: 'notes.txt',
        mime_type: 'text/plain',
      });

      await service.processAttachment(id, Buffer.from('Hello from the attachment'));

      const row = await db.get<{ extraction_status: string; extracted_text: string }>(
        `SELECT extraction_status, extracted_text FROM wunderland_email_attachments WHERE id = ?`,
        [id]
      );

      expect(row?.extraction_status).toBe('extracted');
      expect(row?.extracted_text).toBe('Hello from the attachment');
    });

    it('sets extraction_status to "extracted" for PDF', async () => {
      const id = await insertTestAttachment({
        filename: 'report.pdf',
        mime_type: 'application/pdf',
      });

      await service.processAttachment(id, Buffer.from('fake-pdf'));

      const row = await db.get<{ extraction_status: string; extracted_text: string }>(
        `SELECT extraction_status, extracted_text FROM wunderland_email_attachments WHERE id = ?`,
        [id]
      );

      expect(row?.extraction_status).toBe('extracted');
      expect(row?.extracted_text).toBe('Extracted PDF text content');
    });

    it('sets extraction_status to "pending_transcription" for image types', async () => {
      const id = await insertTestAttachment({
        filename: 'photo.png',
        mime_type: 'image/png',
      });

      await service.processAttachment(id);

      const row = await db.get<{ extraction_status: string }>(
        `SELECT extraction_status FROM wunderland_email_attachments WHERE id = ?`,
        [id]
      );

      expect(row?.extraction_status).toBe('pending_transcription');
    });

    it('sets extraction_status to "skipped" for unsupported types', async () => {
      const id = await insertTestAttachment({
        filename: 'archive.zip',
        mime_type: 'application/zip',
      });

      await service.processAttachment(id);

      const row = await db.get<{ extraction_status: string }>(
        `SELECT extraction_status FROM wunderland_email_attachments WHERE id = ?`,
        [id]
      );

      expect(row?.extraction_status).toBe('skipped');
    });

    it('sets extraction_status to "failed" when no content provided for eager type', async () => {
      const id = await insertTestAttachment({
        filename: 'data.csv',
        mime_type: 'text/csv',
      });

      await service.processAttachment(id); // no content

      const row = await db.get<{ extraction_status: string; extraction_error: string }>(
        `SELECT extraction_status, extraction_error FROM wunderland_email_attachments WHERE id = ?`,
        [id]
      );

      expect(row?.extraction_status).toBe('failed');
      expect(row?.extraction_error).toContain('No content provided');
    });

    it('handles non-existent attachment gracefully', async () => {
      // Should not throw
      await service.processAttachment('non-existent-id', Buffer.from('data'));
    });
  });

  describe('processEagerAttachments', () => {
    it('processes all pending eager attachments for a message', async () => {
      const msgId = 'msg-eager-test';
      const id1 = await insertTestAttachment({
        message_id: msgId,
        filename: 'a.txt',
        mime_type: 'text/plain',
        gmail_attachment_id: 'gatt-1',
      });
      const id2 = await insertTestAttachment({
        message_id: msgId,
        filename: 'b.pdf',
        mime_type: 'application/pdf',
        gmail_attachment_id: 'gatt-2',
      });
      // Image should be skipped by processEagerAttachments
      const id3 = await insertTestAttachment({
        message_id: msgId,
        filename: 'c.png',
        mime_type: 'image/png',
      });

      const mockGetContent = vi.fn(async (attachmentId: string) => {
        return Buffer.from(`content-for-${attachmentId}`);
      });

      await service.processEagerAttachments(msgId, mockGetContent);

      // Text and PDF should be extracted
      const row1 = await db.get<{ extraction_status: string }>(
        `SELECT extraction_status FROM wunderland_email_attachments WHERE id = ?`,
        [id1]
      );
      const row2 = await db.get<{ extraction_status: string }>(
        `SELECT extraction_status FROM wunderland_email_attachments WHERE id = ?`,
        [id2]
      );
      // Image should remain pending (not processed by eager)
      const row3 = await db.get<{ extraction_status: string }>(
        `SELECT extraction_status FROM wunderland_email_attachments WHERE id = ?`,
        [id3]
      );

      expect(row1?.extraction_status).toBe('extracted');
      expect(row2?.extraction_status).toBe('extracted');
      expect(row3?.extraction_status).toBe('pending');

      // Provider was called for text and PDF only
      expect(mockGetContent).toHaveBeenCalledTimes(2);
      expect(mockGetContent).toHaveBeenCalledWith('gatt-1');
      expect(mockGetContent).toHaveBeenCalledWith('gatt-2');
    });

    it('handles download errors gracefully', async () => {
      const msgId = 'msg-download-fail';
      const id = await insertTestAttachment({
        message_id: msgId,
        filename: 'fail.txt',
        mime_type: 'text/plain',
        gmail_attachment_id: 'gatt-fail',
      });

      const mockGetContent = vi.fn(async () => {
        throw new Error('Network timeout');
      });

      await service.processEagerAttachments(msgId, mockGetContent);

      const row = await db.get<{ extraction_status: string; extraction_error: string }>(
        `SELECT extraction_status, extraction_error FROM wunderland_email_attachments WHERE id = ?`,
        [id]
      );

      expect(row?.extraction_status).toBe('failed');
      expect(row?.extraction_error).toContain('Network timeout');
    });
  });

  describe('transcribeImage', () => {
    it('stores multimodal_description and sets status to transcribed', async () => {
      const origKey = process.env.OPENAI_API_KEY;
      process.env.OPENAI_API_KEY = 'test-key-123';

      try {
        const id = await insertTestAttachment({
          filename: 'chart.png',
          mime_type: 'image/png',
          extraction_status: 'pending_transcription',
        });

        await service.transcribeImage(id, Buffer.from('fake-image'));

        const row = await db.get<{
          extraction_status: string;
          multimodal_description: string;
        }>(
          `SELECT extraction_status, multimodal_description FROM wunderland_email_attachments WHERE id = ?`,
          [id]
        );

        expect(row?.extraction_status).toBe('transcribed');
        expect(row?.multimodal_description).toBe('A photo of a chart showing revenue growth.');
      } finally {
        if (origKey) {
          process.env.OPENAI_API_KEY = origKey;
        } else {
          delete process.env.OPENAI_API_KEY;
        }
      }
    });

    it('sets status to failed when no API key available', async () => {
      const origOpenAI = process.env.OPENAI_API_KEY;
      const origOR = process.env.OPENROUTER_API_KEY;
      delete process.env.OPENAI_API_KEY;
      delete process.env.OPENROUTER_API_KEY;

      try {
        const id = await insertTestAttachment({
          filename: 'photo.jpg',
          mime_type: 'image/jpeg',
          extraction_status: 'pending_transcription',
        });

        await service.transcribeImage(id, Buffer.from('fake-image'));

        const row = await db.get<{ extraction_status: string; extraction_error: string }>(
          `SELECT extraction_status, extraction_error FROM wunderland_email_attachments WHERE id = ?`,
          [id]
        );

        expect(row?.extraction_status).toBe('failed');
        expect(row?.extraction_error).toContain('No vision API key configured');
      } finally {
        if (origOpenAI) process.env.OPENAI_API_KEY = origOpenAI;
        if (origOR) process.env.OPENROUTER_API_KEY = origOR;
      }
    });
  });
});
