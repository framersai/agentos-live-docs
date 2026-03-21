/**
 * @file email-retention.service.ts
 * @description Data retention cleanup for the email intelligence subsystem.
 *              Removes messages, attachments, and FTS entries older than a
 *              configurable retention period, and prunes stale rate-limit windows.
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service.js';
import { EmailVectorMemoryService } from './email-vector-memory.service.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CleanupResult {
  messagesDeleted: number;
  attachmentsDeleted: number;
  rateLimitsDeleted: number;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class EmailRetentionService {
  private readonly logger = new Logger(EmailRetentionService.name);

  constructor(
    @Inject(DatabaseService) private readonly db: DatabaseService,
    @Inject(EmailVectorMemoryService) private readonly vectorMemory: EmailVectorMemoryService
  ) {}

  /**
   * Delete email data older than `retentionDays` for a given seed.
   *
   * Steps:
   * 1. Find messages older than cutoff for this seed's accounts
   * 2. Remove FTS entries for those messages
   * 3. Delete associated attachments
   * 4. Delete old messages
   * 5. Clean up expired rate-limit windows (> 2 hours old)
   *
   * @param seedId         Agent seed ID
   * @param retentionDays  Number of days to retain (default 365)
   */
  async cleanupExpiredData(seedId: string, retentionDays: number = 365): Promise<CleanupResult> {
    const cutoff = Date.now() - retentionDays * 86400000;

    this.logger.log(
      `Starting retention cleanup for seed ${seedId}: retentionDays=${retentionDays}, cutoff=${new Date(cutoff).toISOString()}`
    );

    // 1. Find messages older than cutoff for this seed's accounts
    const oldMessages = await this.db.all<{ id: string; account_id: string }>(
      `SELECT m.id, m.account_id FROM wunderland_email_synced_messages m
       JOIN wunderland_email_accounts a ON m.account_id = a.id
       WHERE a.seed_id = ? AND m.internal_date < ?`,
      [seedId, cutoff]
    );

    if (oldMessages.length === 0) {
      // Still clean up rate limits even if no expired messages
      const rateLimitsDeleted = await this.cleanupRateLimits();
      this.logger.log(
        `No expired messages found for seed ${seedId}. Rate limits cleaned: ${rateLimitsDeleted}`
      );
      return { messagesDeleted: 0, attachmentsDeleted: 0, rateLimitsDeleted };
    }

    const messageIds = oldMessages.map((m) => m.id);

    // 2. Remove FTS entries for old messages
    for (const msg of oldMessages) {
      try {
        await this.vectorMemory.removeDocuments(seedId, `email_${msg.id}`);
      } catch (err) {
        this.logger.warn(`Failed to remove FTS entry for message ${msg.id}: ${err}`);
      }
    }

    // 3. Delete associated attachments and their FTS entries
    let attachmentsDeleted = 0;
    // Process in batches to avoid overly long SQL IN clauses
    const batchSize = 500;
    for (let i = 0; i < messageIds.length; i += batchSize) {
      const batch = messageIds.slice(i, i + batchSize);
      const placeholders = batch.map(() => '?').join(',');

      // Find attachment IDs for FTS cleanup
      const attachments = await this.db.all<{ id: string }>(
        `SELECT id FROM wunderland_email_attachments WHERE message_id IN (${placeholders})`,
        batch
      );

      // Remove attachment FTS entries
      for (const att of attachments) {
        try {
          await this.vectorMemory.removeDocuments(seedId, `attachment_${att.id}`);
        } catch (err) {
          this.logger.warn(`Failed to remove FTS entry for attachment ${att.id}: ${err}`);
        }
      }

      // Delete attachments
      const result = await this.db.run(
        `DELETE FROM wunderland_email_attachments WHERE message_id IN (${placeholders})`,
        batch
      );
      attachmentsDeleted += result?.changes ?? attachments.length;
    }

    // 4. Delete old messages
    let messagesDeleted = 0;
    for (let i = 0; i < messageIds.length; i += batchSize) {
      const batch = messageIds.slice(i, i + batchSize);
      const placeholders = batch.map(() => '?').join(',');
      const result = await this.db.run(
        `DELETE FROM wunderland_email_synced_messages WHERE id IN (${placeholders})`,
        batch
      );
      messagesDeleted += result?.changes ?? batch.length;
    }

    // 5. Clean up old rate limit windows
    const rateLimitsDeleted = await this.cleanupRateLimits();

    this.logger.log(
      `Retention cleanup complete for seed ${seedId}: messages=${messagesDeleted}, attachments=${attachmentsDeleted}, rateLimits=${rateLimitsDeleted}`
    );

    return { messagesDeleted, attachmentsDeleted, rateLimitsDeleted };
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  /**
   * Remove rate-limit windows older than 2 hours.
   * Returns count of deleted rows.
   */
  private async cleanupRateLimits(): Promise<number> {
    const cutoff = Date.now() - 7200000; // 2 hours ago
    const result = await this.db.run(
      'DELETE FROM wunderland_email_rate_limits WHERE window_start < ?',
      [cutoff]
    );
    return result?.changes ?? 0;
  }
}
