/**
 * @file email-digest.service.ts
 * @description Manages periodic email digest configurations — creation, scheduling
 *              via CronJobService, delivery, and previewing.
 */

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service.js';
import { EmailReportService } from './email-report.service.js';
import { CronJobService } from '../../cron/cron.service.js';
import { generateId } from '../../../../core/database/appDatabase.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DigestConfig {
  name?: string;
  schedule: string;
  format?: string;
  deliveryChannel: string;
  deliveryTarget: string;
  filterProjects?: string[];
  filterAccounts?: string[];
  includeAttachments?: boolean;
  includeTimeline?: boolean;
}

export interface DigestRecord {
  id: string;
  seed_id: string;
  owner_user_id: string;
  name: string | null;
  schedule: string;
  format: string;
  delivery_channel: string;
  delivery_target: string;
  filter_projects: string | null;
  filter_accounts: string | null;
  include_attachments: number;
  include_timeline: number;
  is_active: number;
  last_sent_at: number | null;
  cron_job_id: string | null;
  created_at: number;
  updated_at: number;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class EmailDigestService {
  constructor(
    @Inject(DatabaseService) private readonly db: DatabaseService,
    @Inject(EmailReportService) private readonly reportService: EmailReportService,
    @Inject(CronJobService) private readonly cronService: CronJobService
  ) {}

  // =========================================================================
  // CRUD
  // =========================================================================

  async createDigest(seedId: string, userId: string, config: DigestConfig): Promise<DigestRecord> {
    const id = generateId();
    const now = Date.now();

    await this.db.run(
      `INSERT INTO wunderland_email_digests
        (id, seed_id, owner_user_id, name, schedule, format,
         delivery_channel, delivery_target,
         filter_projects, filter_accounts,
         include_attachments, include_timeline,
         is_active, cron_job_id,
         created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NULL, ?, ?)`,
      [
        id,
        seedId,
        userId,
        config.name ?? null,
        config.schedule,
        config.format ?? 'markdown',
        config.deliveryChannel,
        config.deliveryTarget,
        config.filterProjects ? JSON.stringify(config.filterProjects) : null,
        config.filterAccounts ? JSON.stringify(config.filterAccounts) : null,
        config.includeAttachments ? 1 : 0,
        config.includeTimeline !== false ? 1 : 0,
        now,
        now,
      ]
    );

    // Map schedule to cron job config
    let scheduleKind: string;
    let scheduleConfig: string;

    switch (config.schedule) {
      case 'daily':
        scheduleKind = 'every';
        scheduleConfig = JSON.stringify({ intervalMs: 86400000 });
        break;
      case 'weekly':
        scheduleKind = 'every';
        scheduleConfig = JSON.stringify({ intervalMs: 604800000 });
        break;
      default:
        // Treat as cron expression
        scheduleKind = 'cron';
        scheduleConfig = JSON.stringify({ expression: config.schedule });
        break;
    }

    // Create cron job
    const { job } = await this.cronService.createJob(userId, {
      seedId,
      name: `Email Digest: ${config.name ?? id.slice(0, 8)}`,
      description: `Auto-generated cron job for email digest ${id}`,
      enabled: true,
      scheduleKind,
      scheduleConfig,
      payloadKind: 'email_digest',
      payloadConfig: JSON.stringify({ digestId: id }),
    });

    // Store cron_job_id on digest row
    await this.db.run(
      `UPDATE wunderland_email_digests SET cron_job_id = ?, updated_at = ? WHERE id = ?`,
      [job.jobId, Date.now(), id]
    );

    const digest = await this.getDigest(id);
    return digest!;
  }

  async listDigests(seedId: string): Promise<DigestRecord[]> {
    return this.db.all<DigestRecord>(
      `SELECT * FROM wunderland_email_digests WHERE seed_id = ? ORDER BY created_at DESC`,
      [seedId]
    );
  }

  async getDigest(digestId: string): Promise<DigestRecord | undefined> {
    return this.db.get<DigestRecord>(`SELECT * FROM wunderland_email_digests WHERE id = ?`, [
      digestId,
    ]);
  }

  async updateDigest(
    digestId: string,
    updates: Partial<
      Pick<
        DigestConfig,
        | 'name'
        | 'schedule'
        | 'format'
        | 'deliveryChannel'
        | 'deliveryTarget'
        | 'includeAttachments'
        | 'includeTimeline'
      >
    >
  ): Promise<void> {
    const sets: string[] = [];
    const params: any[] = [];

    if (updates.name !== undefined) {
      sets.push('name = ?');
      params.push(updates.name);
    }
    if (updates.schedule !== undefined) {
      sets.push('schedule = ?');
      params.push(updates.schedule);
    }
    if (updates.format !== undefined) {
      sets.push('format = ?');
      params.push(updates.format);
    }
    if (updates.deliveryChannel !== undefined) {
      sets.push('delivery_channel = ?');
      params.push(updates.deliveryChannel);
    }
    if (updates.deliveryTarget !== undefined) {
      sets.push('delivery_target = ?');
      params.push(updates.deliveryTarget);
    }
    if (updates.includeAttachments !== undefined) {
      sets.push('include_attachments = ?');
      params.push(updates.includeAttachments ? 1 : 0);
    }
    if (updates.includeTimeline !== undefined) {
      sets.push('include_timeline = ?');
      params.push(updates.includeTimeline ? 1 : 0);
    }

    if (sets.length === 0) return;

    sets.push('updated_at = ?');
    params.push(Date.now());
    params.push(digestId);

    await this.db.run(
      `UPDATE wunderland_email_digests SET ${sets.join(', ')} WHERE id = ?`,
      params
    );
  }

  async deleteDigest(digestId: string, userId: string): Promise<void> {
    const digest = await this.getDigest(digestId);
    if (!digest) {
      throw new NotFoundException(`Digest "${digestId}" not found.`);
    }

    // Delete associated cron job
    if (digest.cron_job_id) {
      try {
        await this.cronService.deleteJob(userId, digest.cron_job_id);
      } catch {
        // Cron job may already be deleted — continue
      }
    }

    await this.db.run(`DELETE FROM wunderland_email_digests WHERE id = ?`, [digestId]);
  }

  // =========================================================================
  // Generation & Delivery
  // =========================================================================

  async generateAndDeliver(digestId: string): Promise<void> {
    const digest = await this.getDigest(digestId);
    if (!digest) {
      throw new NotFoundException(`Digest "${digestId}" not found.`);
    }

    // sinceDate = last_sent_at or (now - 24 hours)
    const sinceDate = digest.last_sent_at ?? Date.now() - 86400000;

    const filterProjects = digest.filter_projects ? JSON.parse(digest.filter_projects) : undefined;
    const filterAccounts = digest.filter_accounts ? JSON.parse(digest.filter_accounts) : undefined;

    const report = await this.reportService.generateDigestReport(
      digest.seed_id,
      sinceDate,
      (digest.format as 'markdown' | 'json' | 'pdf') ?? 'markdown',
      {
        filterProjects,
        filterAccounts,
        includeAttachments: Boolean(digest.include_attachments),
        includeTimeline: Boolean(digest.include_timeline),
      }
    );

    // Deliver based on channel
    switch (digest.delivery_channel) {
      case 'dashboard':
        // Content viewable via preview endpoint — just update last_sent_at
        break;

      case 'webhook': {
        const url = digest.delivery_target;
        try {
          await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': report.mimeType },
            body: typeof report.content === 'string' ? report.content : report.content,
          });
        } catch (err) {
          // Log but don't throw — delivery failure shouldn't break the digest
          console.error(
            `[EmailDigestService] Webhook delivery failed for digest ${digestId}:`,
            err
          );
        }
        break;
      }

      case 'email':
        // Future: send via SMTP
        console.log(
          `[EmailDigestService] Email delivery for digest ${digestId} — SMTP not configured`
        );
        break;

      case 'telegram':
      case 'discord':
      case 'slack':
        console.log(
          `[EmailDigestService] Channel delivery (${digest.delivery_channel}) for digest ${digestId} — pending implementation`
        );
        break;

      default:
        console.log(
          `[EmailDigestService] Unknown delivery channel "${digest.delivery_channel}" for digest ${digestId}`
        );
        break;
    }

    // Update last_sent_at
    await this.db.run(
      `UPDATE wunderland_email_digests SET last_sent_at = ?, updated_at = ? WHERE id = ?`,
      [Date.now(), Date.now(), digestId]
    );
  }

  async previewDigest(digestId: string): Promise<{
    content: Buffer | string;
    filename: string;
    mimeType: string;
    sizeBytes: number;
  }> {
    const digest = await this.getDigest(digestId);
    if (!digest) {
      throw new NotFoundException(`Digest "${digestId}" not found.`);
    }

    const sinceDate = digest.last_sent_at ?? Date.now() - 86400000;

    const filterProjects = digest.filter_projects ? JSON.parse(digest.filter_projects) : undefined;
    const filterAccounts = digest.filter_accounts ? JSON.parse(digest.filter_accounts) : undefined;

    return this.reportService.generateDigestReport(
      digest.seed_id,
      sinceDate,
      (digest.format as 'markdown' | 'json' | 'pdf') ?? 'markdown',
      {
        filterProjects,
        filterAccounts,
        includeAttachments: Boolean(digest.include_attachments),
        includeTimeline: Boolean(digest.include_timeline),
      }
    );
  }

  async sendNow(digestId: string): Promise<void> {
    return this.generateAndDeliver(digestId);
  }
}
