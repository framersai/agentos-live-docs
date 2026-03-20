/**
 * @file email-sync.service.ts
 * @description Orchestrates the sync lifecycle for connected email accounts.
 *              Determines full vs incremental sync, upserts messages, creates
 *              attachment records, triggers thread reconstruction, and persists
 *              sync state/progress.
 *
 * @module email-intelligence/services/email-sync
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service.js';
import { EmailThreadService } from './email-thread.service.js';
import { GmailProvider } from '../providers/gmail-provider.js';
import type {
  IEmailProvider,
  EmailMessage,
  EmailAttachmentMeta,
  DecryptedCredentials,
} from '../providers/email-provider.interface.js';

// ---------------------------------------------------------------------------
// Internal row shapes
// ---------------------------------------------------------------------------

interface AccountRow {
  id: string;
  seed_id: string;
  owner_user_id: string;
  provider: string;
  email_address: string;
  credential_id: string;
  sync_cursor: string | null;
  sync_enabled: number;
  sync_state: string;
  sync_progress_json: string | null;
  total_messages_synced: number;
  last_full_sync_at: number | null;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class EmailSyncService {
  private readonly logger = new Logger(EmailSyncService.name);

  constructor(
    @Inject(DatabaseService) private readonly db: DatabaseService,
    private readonly threadService: EmailThreadService
  ) {}

  // ---- Main entry point ---------------------------------------------------

  /**
   * Syncs an email account. Determines full vs incremental based on whether
   * a sync_cursor exists. On error, sets sync_state to 'error' and re-throws.
   */
  async syncAccount(
    accountId: string,
    options?: {
      /** Override credential loading — provide decrypted creds directly (useful for testing). */
      credentials?: DecryptedCredentials;
      /** Override provider factory (useful for testing). */
      providerFactory?: (account: AccountRow) => IEmailProvider;
    }
  ): Promise<void> {
    // 1. Load account row
    const account = await this.db.get<AccountRow>(
      `SELECT * FROM wunderland_email_accounts WHERE id = ?`,
      [accountId]
    );

    if (!account || !account.sync_enabled) return;

    // 2. Mark syncing
    await this.updateSyncState(accountId, 'syncing');

    try {
      // 3. Create provider
      const provider = options?.providerFactory
        ? options.providerFactory(account)
        : this.getProviderForAccount(account);

      // 4. Initialize provider with credentials
      if (options?.credentials) {
        await provider.initialize(options.credentials);
      }
      // If no credentials supplied, caller is responsible for pre-initializing the provider
      // (e.g., via providerFactory returning an already-initialized provider)

      const syncedMessageIds: string[] = [];
      const affectedThreadIds = new Set<string>();

      if (account.sync_cursor === null) {
        // ---- Full sync ----
        let totalSynced = 0;

        for await (const batch of provider.fullSync({ maxMessages: 5000, batchSize: 100 })) {
          const ids = await this.upsertMessages(accountId, batch);
          syncedMessageIds.push(...ids);

          // Create attachment records
          for (let i = 0; i < batch.length; i++) {
            if (batch[i].attachments.length > 0) {
              await this.createAttachmentRecords(ids[i], accountId, batch[i].attachments);
            }
          }

          // Collect thread IDs
          for (const msg of batch) {
            affectedThreadIds.add(msg.threadId);
          }

          totalSynced += batch.length;

          await this.updateSyncProgress(accountId, {
            type: 'full',
            syncedMessages: totalSynced,
            inProgress: true,
          });
        }

        // Get cursor after full sync
        const cursor = await provider.getCurrentCursor();
        const now = Date.now();
        await this.db.run(
          `UPDATE wunderland_email_accounts
           SET sync_cursor = ?, last_full_sync_at = ?, total_messages_synced = ?, updated_at = ?
           WHERE id = ?`,
          [cursor, now, totalSynced, now, accountId]
        );
      } else {
        // ---- Incremental sync ----
        const result = await provider.incrementalSync(account.sync_cursor);

        // Upsert new messages
        if (result.newMessages.length > 0) {
          const ids = await this.upsertMessages(accountId, result.newMessages);
          syncedMessageIds.push(...ids);

          for (let i = 0; i < result.newMessages.length; i++) {
            if (result.newMessages[i].attachments.length > 0) {
              await this.createAttachmentRecords(
                ids[i],
                accountId,
                result.newMessages[i].attachments
              );
            }
          }

          for (const msg of result.newMessages) {
            affectedThreadIds.add(msg.threadId);
          }
        }

        // Handle modified messages (update labels/read status)
        for (const modifiedId of result.modifiedMessageIds) {
          // Fetch the modified message's thread to reconstruct
          const row = await this.db.get<{ thread_id: string }>(
            `SELECT thread_id FROM wunderland_email_synced_messages
             WHERE account_id = ? AND provider_message_id = ?`,
            [accountId, modifiedId]
          );
          if (row) affectedThreadIds.add(row.thread_id);
        }

        // Handle deleted messages
        for (const deletedId of result.deletedMessageIds) {
          const row = await this.db.get<{ thread_id: string }>(
            `SELECT thread_id FROM wunderland_email_synced_messages
             WHERE account_id = ? AND provider_message_id = ?`,
            [accountId, deletedId]
          );
          if (row) affectedThreadIds.add(row.thread_id);

          await this.db.run(
            `DELETE FROM wunderland_email_synced_messages
             WHERE account_id = ? AND provider_message_id = ?`,
            [accountId, deletedId]
          );
        }

        // Update cursor and total count
        const now = Date.now();
        const countRow = await this.db.get<{ cnt: number }>(
          `SELECT COUNT(*) as cnt FROM wunderland_email_synced_messages WHERE account_id = ?`,
          [accountId]
        );
        await this.db.run(
          `UPDATE wunderland_email_accounts
           SET sync_cursor = ?, total_messages_synced = ?, updated_at = ?
           WHERE id = ?`,
          [result.newCursor, countRow?.cnt ?? 0, now, accountId]
        );
      }

      // 9. Reconstruct threads
      for (const threadId of affectedThreadIds) {
        await this.threadService.reconstructThread(accountId, threadId);
      }

      // 10. Mark idle
      await this.updateSyncState(accountId, 'idle');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      await this.updateSyncState(accountId, 'error', message);
      throw err;
    }
  }

  // ---- Upsert messages ----------------------------------------------------

  /**
   * Upsert messages using INSERT OR REPLACE on the unique index
   * (account_id, provider_message_id). Returns our internal UUIDs.
   */
  async upsertMessages(accountId: string, messages: EmailMessage[]): Promise<string[]> {
    const ids: string[] = [];
    const now = Date.now();

    for (const msg of messages) {
      const id = this.db.generateId();
      ids.push(id);

      await this.db.run(
        `INSERT OR REPLACE INTO wunderland_email_synced_messages
          (id, provider_message_id, account_id, thread_id, message_id_header,
           subject, from_address, from_name, to_addresses, cc_addresses, bcc_addresses,
           body_text, body_html, snippet, internal_date, received_date,
           labels, is_read, is_starred, is_draft,
           in_reply_to, references_header,
           has_attachments, attachment_count, size_bytes,
           created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          msg.id, // provider_message_id
          accountId,
          msg.threadId,
          msg.messageIdHeader || null,
          msg.subject || null,
          msg.from.email,
          msg.from.name,
          JSON.stringify(msg.to),
          JSON.stringify(msg.cc),
          JSON.stringify(msg.bcc),
          msg.bodyText,
          msg.bodyHtml,
          msg.snippet || null,
          msg.internalDate,
          msg.receivedDate,
          JSON.stringify(msg.labels),
          msg.isRead ? 1 : 0,
          msg.isStarred ? 1 : 0,
          msg.isDraft ? 1 : 0,
          msg.inReplyTo,
          msg.referencesHeader.length > 0 ? JSON.stringify(msg.referencesHeader) : null,
          msg.attachments.length > 0 ? 1 : 0,
          msg.attachments.length,
          msg.sizeBytes,
          now,
          now,
        ]
      );
    }

    return ids;
  }

  // ---- Attachment records -------------------------------------------------

  /**
   * Create attachment records in wunderland_email_attachments for a message.
   */
  async createAttachmentRecords(
    messageId: string,
    accountId: string,
    attachments: EmailAttachmentMeta[]
  ): Promise<void> {
    const now = Date.now();

    for (const att of attachments) {
      const id = this.db.generateId();
      await this.db.run(
        `INSERT INTO wunderland_email_attachments
          (id, message_id, account_id, gmail_attachment_id, filename, mime_type,
           size_bytes, content_id, is_inline, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          messageId,
          accountId,
          att.attachmentId || null,
          att.filename,
          att.mimeType,
          att.sizeBytes,
          att.contentId,
          att.isInline ? 1 : 0,
          now,
          now,
        ]
      );
    }
  }

  // ---- Sync state management ----------------------------------------------

  /**
   * Update sync_state (and optionally last_sync_error) on the account row.
   */
  async updateSyncState(accountId: string, state: string, error?: string): Promise<void> {
    const now = Date.now();
    await this.db.run(
      `UPDATE wunderland_email_accounts
       SET sync_state = ?, last_sync_error = ?, updated_at = ?
       WHERE id = ?`,
      [state, error ?? null, now, accountId]
    );
  }

  /**
   * Persist sync progress JSON for UI consumption.
   */
  async updateSyncProgress(accountId: string, progress: object): Promise<void> {
    const now = Date.now();
    await this.db.run(
      `UPDATE wunderland_email_accounts
       SET sync_progress_json = ?, updated_at = ?
       WHERE id = ?`,
      [JSON.stringify(progress), now, accountId]
    );
  }

  // ---- Provider factory ---------------------------------------------------

  /**
   * Create a provider instance based on the account's provider field.
   * Currently only supports 'gmail'.
   */
  getProviderForAccount(account: { provider: string }): IEmailProvider {
    switch (account.provider) {
      case 'gmail':
        return new GmailProvider();
      default:
        throw new Error(`Unsupported email provider: ${account.provider}`);
    }
  }
}
