/**
 * @file email-rag.service.ts
 * @description Retrieval-Augmented Generation service for email content.
 *              Indexes email messages and attachments into FTS collections
 *              and provides natural-language query across all indexed content.
 *
 * @module email-intelligence/services/email-rag
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service.js';
import { EmailVectorMemoryService } from './email-vector-memory.service.js';
import type { SearchResult } from './email-vector-memory.service.js';

// ---------------------------------------------------------------------------
// Internal row shapes
// ---------------------------------------------------------------------------

interface MessageRow {
  id: string;
  provider_message_id: string;
  account_id: string;
  thread_id: string;
  subject: string | null;
  from_address: string;
  from_name: string | null;
  to_addresses: string | null;
  body_text: string | null;
  internal_date: number;
  rag_indexed_at: number | null;
}

interface AttachmentRow {
  id: string;
  message_id: string;
  account_id: string;
  filename: string;
  mime_type: string;
  extraction_status: string;
  extracted_text: string | null;
  multimodal_description: string | null;
  rag_indexed_at: number | null;
}

interface AccountRow {
  id: string;
  seed_id: string;
}

// ---------------------------------------------------------------------------
// Public result type
// ---------------------------------------------------------------------------

export interface EmailQueryResult {
  documentId: string;
  messageId: string;
  threadId: string;
  from: string;
  subject: string;
  date: number;
  snippet: string;
  relevanceScore: number;
  collection: 'bodies' | 'attachments';
  attachmentFilename?: string;
}

export interface EmailQueryResponse {
  results: EmailQueryResult[];
  totalResults: number;
}

export interface EmailQueryParams {
  query: string;
  seedId: string;
  accountIds?: string[];
  projectIds?: string[];
  threadIds?: string[];
  dateRange?: { from?: number; to?: number };
  includeAttachments?: boolean;
  topK?: number;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class EmailRagService {
  private readonly logger = new Logger(EmailRagService.name);

  constructor(
    @Inject(DatabaseService) private readonly db: DatabaseService,
    private readonly vectorMemory: EmailVectorMemoryService
  ) {}

  // -----------------------------------------------------------------------
  // Index a single email message
  // -----------------------------------------------------------------------

  async indexMessage(seedId: string, messageId: string): Promise<void> {
    // 1. Load message from DB
    const msg = await this.db.get<MessageRow>(
      `SELECT id, provider_message_id, account_id, thread_id, subject,
              from_address, from_name, to_addresses, body_text, internal_date,
              rag_indexed_at
       FROM wunderland_email_synced_messages WHERE id = ?`,
      [messageId]
    );
    if (!msg) {
      this.logger.warn(`indexMessage: message ${messageId} not found`);
      return;
    }

    // 2. Build document text
    const toAddresses = msg.to_addresses || '';
    const dateStr = new Date(msg.internal_date).toISOString();
    const fromLine = msg.from_name
      ? `From: ${msg.from_address} (${msg.from_name})`
      : `From: ${msg.from_address}`;
    const documentText = [
      fromLine,
      `To: ${toAddresses}`,
      `Date: ${dateStr}`,
      `Subject: ${msg.subject || '(no subject)'}`,
      '',
      msg.body_text || '',
    ].join('\n');

    // 3. Build metadata
    const metadata = {
      messageId: msg.id,
      threadId: msg.thread_id,
      accountId: msg.account_id,
      from: msg.from_address,
      subject: msg.subject || '',
      date: msg.internal_date,
    };

    // 4. Ingest into vector memory
    await this.vectorMemory.ingestEmailBody(seedId, `email_${messageId}`, documentText, metadata);

    // 5. Update rag_indexed_at
    await this.db.run(
      `UPDATE wunderland_email_synced_messages SET rag_indexed_at = ? WHERE id = ?`,
      [Date.now(), messageId]
    );
  }

  // -----------------------------------------------------------------------
  // Index an attachment's extracted text
  // -----------------------------------------------------------------------

  async indexAttachment(seedId: string, attachmentId: string): Promise<void> {
    // 1. Load attachment from DB
    const att = await this.db.get<AttachmentRow>(
      `SELECT id, message_id, account_id, filename, mime_type,
              extraction_status, extracted_text, multimodal_description, rag_indexed_at
       FROM wunderland_email_attachments WHERE id = ?`,
      [attachmentId]
    );
    if (!att) {
      this.logger.warn(`indexAttachment: attachment ${attachmentId} not found`);
      return;
    }

    // 2. Get text based on extraction status
    let text: string | null = null;
    if (att.extraction_status === 'extracted' && att.extracted_text) {
      text = att.extracted_text;
    } else if (att.extraction_status === 'transcribed' && att.multimodal_description) {
      text = att.multimodal_description;
    }

    // 3. Skip if no text available
    if (!text) return;

    // 4. Build metadata
    const metadata = {
      attachmentId: att.id,
      messageId: att.message_id,
      filename: att.filename,
      mimeType: att.mime_type,
    };

    // 5. Ingest into vector memory
    await this.vectorMemory.ingestAttachment(seedId, `attachment_${attachmentId}`, text, metadata);

    // 6. Update rag_indexed_at
    await this.db.run(`UPDATE wunderland_email_attachments SET rag_indexed_at = ? WHERE id = ?`, [
      Date.now(),
      attachmentId,
    ]);
  }

  // -----------------------------------------------------------------------
  // Batch index pending messages
  // -----------------------------------------------------------------------

  async indexPendingMessages(seedId: string): Promise<{ indexed: number }> {
    const rows = await this.db.all<{ id: string }>(
      `SELECT m.id
       FROM wunderland_email_synced_messages m
       JOIN wunderland_email_accounts a ON a.id = m.account_id
       WHERE a.seed_id = ? AND m.rag_indexed_at IS NULL`,
      [seedId]
    );

    let indexed = 0;
    for (const row of rows) {
      try {
        await this.indexMessage(seedId, row.id);
        indexed++;
      } catch (err) {
        this.logger.warn(
          `Failed to index message ${row.id}: ${err instanceof Error ? err.message : err}`
        );
      }
    }

    return { indexed };
  }

  // -----------------------------------------------------------------------
  // Batch index pending attachments
  // -----------------------------------------------------------------------

  async indexPendingAttachments(seedId: string): Promise<{ indexed: number }> {
    const rows = await this.db.all<{ id: string }>(
      `SELECT att.id
       FROM wunderland_email_attachments att
       JOIN wunderland_email_accounts a ON a.id = att.account_id
       WHERE a.seed_id = ?
         AND att.extraction_status IN ('extracted', 'transcribed')
         AND att.rag_indexed_at IS NULL`,
      [seedId]
    );

    let indexed = 0;
    for (const row of rows) {
      try {
        await this.indexAttachment(seedId, row.id);
        indexed++;
      } catch (err) {
        this.logger.warn(
          `Failed to index attachment ${row.id}: ${err instanceof Error ? err.message : err}`
        );
      }
    }

    return { indexed };
  }

  // -----------------------------------------------------------------------
  // Natural language query
  // -----------------------------------------------------------------------

  async query(params: EmailQueryParams): Promise<EmailQueryResponse> {
    const {
      query,
      seedId,
      accountIds,
      threadIds,
      dateRange,
      includeAttachments = true,
      topK = 10,
    } = params;

    // 1. Ensure collection exists
    await this.vectorMemory.ensureCollection(seedId);

    // 2. Search — request more than topK so we can filter down
    const searchResults = await this.vectorMemory.search(seedId, query, {
      topK: topK * 3, // over-fetch to allow post-filtering
      includeAttachments,
    });

    if (searchResults.length === 0) {
      return { results: [], totalResults: 0 };
    }

    // 3. Enrich results with message metadata from DB
    const enriched: EmailQueryResult[] = [];

    for (const sr of searchResults) {
      const meta = sr.metadata;

      // For body results, the metadata has messageId directly
      // For attachment results, we need to look up the parent message
      let messageId: string;
      let threadId: string;
      let from: string;
      let subject: string;
      let date: number;
      let attachmentFilename: string | undefined;

      if (sr.collection === 'bodies') {
        messageId = meta.messageId || '';
        threadId = meta.threadId || '';
        from = meta.from || '';
        subject = meta.subject || '';
        date = meta.date || 0;
      } else {
        // Attachment — look up parent message
        attachmentFilename = meta.filename;
        const parentMsg = await this.db.get<MessageRow>(
          `SELECT id, thread_id, from_address, subject, internal_date, account_id
           FROM wunderland_email_synced_messages WHERE id = ?`,
          [meta.messageId]
        );
        if (parentMsg) {
          messageId = parentMsg.id;
          threadId = parentMsg.thread_id;
          from = parentMsg.from_address;
          subject = parentMsg.subject || '';
          date = parentMsg.internal_date;
        } else {
          messageId = meta.messageId || '';
          threadId = '';
          from = '';
          subject = '';
          date = 0;
        }
      }

      // 4. Post-search filters
      if (accountIds && accountIds.length > 0) {
        const accountId = meta.accountId;
        if (accountId && !accountIds.includes(accountId)) continue;
      }

      if (threadIds && threadIds.length > 0) {
        if (!threadIds.includes(threadId)) continue;
      }

      if (dateRange) {
        if (dateRange.from && date < dateRange.from) continue;
        if (dateRange.to && date > dateRange.to) continue;
      }

      enriched.push({
        documentId: sr.documentId,
        messageId,
        threadId,
        from,
        subject,
        date,
        snippet: sr.snippet,
        relevanceScore: sr.rank,
        collection: sr.collection,
        attachmentFilename,
      });
    }

    // Trim to topK
    const trimmed = enriched.slice(0, topK);

    return {
      results: trimmed,
      totalResults: trimmed.length,
    };
  }
}
