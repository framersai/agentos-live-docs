/**
 * @file email-attachment.service.ts
 * @description Processes email attachments — downloads content, extracts text
 *              using the appropriate extractor, and persists results to the
 *              wunderland_email_attachments table.
 *
 * @module email-intelligence/services
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service.js';
import { ExtractorRegistry } from '../extractors/extractor-registry.js';

// ---------------------------------------------------------------------------
// Internal row shape
// ---------------------------------------------------------------------------

interface AttachmentRow {
  id: string;
  message_id: string;
  account_id: string;
  gmail_attachment_id: string | null;
  filename: string;
  mime_type: string;
  size_bytes: number | null;
  extraction_status: string;
  extracted_text: string | null;
  multimodal_description: string | null;
  extraction_error: string | null;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class EmailAttachmentService {
  private readonly logger = new Logger(EmailAttachmentService.name);
  private readonly registry: ExtractorRegistry;

  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {
    this.registry = new ExtractorRegistry();
  }

  // ---- Process a single attachment -----------------------------------------

  /**
   * Process a single attachment: extract text content and update the DB row.
   *
   * - If no extractor is available for the MIME type → status = 'skipped'
   * - If eager type (text/pdf/docx/xlsx) → extract immediately, status = 'extracted'
   * - If deferred type (image) → status = 'pending_transcription' (needs explicit trigger)
   * - On error → status = 'failed', extraction_error stored
   */
  async processAttachment(attachmentId: string, content?: Buffer): Promise<void> {
    const row = await this.db.get<AttachmentRow>(
      `SELECT * FROM wunderland_email_attachments WHERE id = ?`,
      [attachmentId]
    );

    if (!row) {
      this.logger.warn(`Attachment "${attachmentId}" not found`);
      return;
    }

    const extractor = this.registry.getExtractor(row.mime_type);
    const now = Date.now();

    // No extractor available — skip
    if (!extractor) {
      await this.db.run(
        `UPDATE wunderland_email_attachments
         SET extraction_status = 'skipped', updated_at = ?
         WHERE id = ?`,
        [now, attachmentId]
      );
      return;
    }

    // Deferred type (images) — mark for later explicit transcription
    if (this.registry.isDeferredType(row.mime_type)) {
      await this.db.run(
        `UPDATE wunderland_email_attachments
         SET extraction_status = 'pending_transcription', updated_at = ?
         WHERE id = ?`,
        [now, attachmentId]
      );
      return;
    }

    // Eager type — extract now
    if (!content) {
      await this.db.run(
        `UPDATE wunderland_email_attachments
         SET extraction_status = 'failed', extraction_error = 'No content provided for extraction', updated_at = ?
         WHERE id = ?`,
        [now, attachmentId]
      );
      return;
    }

    try {
      const result = await extractor.extract(content, row.filename);

      await this.db.run(
        `UPDATE wunderland_email_attachments
         SET extraction_status = 'extracted',
             extracted_text = ?,
             extraction_error = NULL,
             updated_at = ?
         WHERE id = ?`,
        [result.text || null, now, attachmentId]
      );

      this.logger.debug(
        `Extracted ${result.text.length} chars from "${row.filename}" (${row.mime_type})`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      await this.db.run(
        `UPDATE wunderland_email_attachments
         SET extraction_status = 'failed',
             extraction_error = ?,
             updated_at = ?
         WHERE id = ?`,
        [message, now, attachmentId]
      );
      this.logger.error(`Extraction failed for "${row.filename}": ${message}`);
    }
  }

  // ---- Process all eager attachments for a message -------------------------

  /**
   * Process all text-based (eager) attachments for a given message.
   * Uses the provided callback to download attachment content on demand.
   */
  async processEagerAttachments(
    messageId: string,
    providerGetContent: (attachmentId: string) => Promise<Buffer>
  ): Promise<void> {
    const attachments = await this.db.all<AttachmentRow>(
      `SELECT * FROM wunderland_email_attachments
       WHERE message_id = ? AND extraction_status = 'pending'`,
      [messageId]
    );

    for (const att of attachments) {
      if (!this.registry.isEagerType(att.mime_type)) continue;

      try {
        const content = await providerGetContent(att.gmail_attachment_id || att.id);
        await this.processAttachment(att.id, content);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.error(`Failed to download/process attachment "${att.filename}": ${message}`);

        const now = Date.now();
        await this.db.run(
          `UPDATE wunderland_email_attachments
           SET extraction_status = 'failed',
               extraction_error = ?,
               updated_at = ?
           WHERE id = ?`,
          [`Download failed: ${message}`, now, att.id]
        );
      }
    }
  }

  // ---- Explicit image transcription ----------------------------------------

  /**
   * Explicitly transcribe an image attachment using the vision API.
   * Stores the result in multimodal_description and sets status to 'transcribed'.
   */
  async transcribeImage(attachmentId: string, content: Buffer): Promise<void> {
    const row = await this.db.get<AttachmentRow>(
      `SELECT * FROM wunderland_email_attachments WHERE id = ?`,
      [attachmentId]
    );

    if (!row) {
      this.logger.warn(`Attachment "${attachmentId}" not found for transcription`);
      return;
    }

    const now = Date.now();

    try {
      const { ImageTranscriber } = await import('../extractors/image-transcriber.js');
      const transcriber = new ImageTranscriber();
      const result = await transcriber.extract(content, row.filename);

      if (result.metadata?.error) {
        await this.db.run(
          `UPDATE wunderland_email_attachments
           SET extraction_status = 'failed',
               extraction_error = ?,
               updated_at = ?
           WHERE id = ?`,
          [result.metadata.error, now, attachmentId]
        );
        return;
      }

      await this.db.run(
        `UPDATE wunderland_email_attachments
         SET extraction_status = 'transcribed',
             multimodal_description = ?,
             extraction_error = NULL,
             updated_at = ?
         WHERE id = ?`,
        [result.text || null, now, attachmentId]
      );

      this.logger.debug(`Transcribed image "${row.filename}" — ${result.text.length} chars`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      await this.db.run(
        `UPDATE wunderland_email_attachments
         SET extraction_status = 'failed',
             extraction_error = ?,
             updated_at = ?
         WHERE id = ?`,
        [message, now, attachmentId]
      );
      this.logger.error(`Image transcription failed for "${row.filename}": ${message}`);
    }
  }
}
