/**
 * @file email-report.service.ts
 * @description Generates structured reports for email projects, threads, and
 *              periodic digests. Delegates formatting to IReportFormatter
 *              implementations (Markdown, JSON, PDF).
 */

import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service.js';
import { EmailProjectService } from './email-project.service.js';
import { EmailThreadService } from './email-thread.service.js';
import type { ReportData, IReportFormatter } from '../reports/report-types.js';
import { MarkdownFormatter } from '../reports/markdown-formatter.js';
import { JsonFormatter } from '../reports/json-formatter.js';
import { PdfFormatter } from '../reports/pdf-formatter.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReportOutput {
  content: Buffer | string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

interface MessageRow {
  id: string;
  thread_id: string;
  account_id: string;
  from_address: string;
  from_name: string | null;
  subject: string | null;
  snippet: string | null;
  internal_date: number;
  in_reply_to: string | null;
  has_attachments: number | null;
  attachment_count: number | null;
}

interface AttachmentRow {
  filename: string;
  mime_type: string;
  size_bytes: number | null;
  extracted_text: string | null;
}

interface ThreadSummaryRow {
  thread_id: string;
  account_id: string;
  subject: string | null;
  msg_count: number;
  last_activity: number;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class EmailReportService {
  constructor(
    @Inject(DatabaseService) private readonly db: DatabaseService,
    @Inject(EmailProjectService) private readonly projectService: EmailProjectService,
    @Inject(EmailThreadService) private readonly threadService: EmailThreadService
  ) {}

  // =========================================================================
  // Project Report
  // =========================================================================

  async generateProjectReport(
    projectId: string,
    format: 'markdown' | 'json' | 'pdf' = 'markdown'
  ): Promise<ReportOutput> {
    // 1. Load project
    const project = await this.projectService.getProject(projectId);
    if (!project) {
      throw new Error(`Project "${projectId}" not found.`);
    }

    // 2. Load thread IDs
    const threadLinks = await this.db.all<{ thread_id: string; account_id: string }>(
      `SELECT thread_id, account_id FROM wunderland_email_project_threads WHERE project_id = ?`,
      [projectId]
    );

    // 3. Load messages across those threads
    const messages = await this.loadProjectMessages(projectId);

    // 4. Get timeline
    const timeline = await this.projectService.getProjectTimeline(projectId);

    // 5. Get summary (optional — catch errors)
    let summary: string | undefined;
    try {
      summary = await this.projectService.getProjectSummary(projectId);
    } catch {
      // summary stays undefined
    }

    // 6. Load attachments
    const attachments = await this.loadProjectAttachments(projectId);

    // 7. Build participants map
    const participantMap = new Map<string, { email: string; name: string | null; count: number }>();
    for (const msg of messages) {
      const email = msg.from_address.toLowerCase();
      const existing = participantMap.get(email);
      if (existing) {
        existing.count++;
      } else {
        participantMap.set(email, { email: msg.from_address, name: msg.from_name, count: 1 });
      }
    }

    // 8. Build thread summaries
    const threadSummaries = await this.loadThreadSummaries(projectId);

    // 9. Build ReportData
    const dates = messages.map((m) => m.internal_date);
    const earliest = dates.length > 0 ? Math.min(...dates) : 0;
    const latest = dates.length > 0 ? Math.max(...dates) : 0;

    const reportData: ReportData = {
      type: 'project',
      title: `Project Report: ${project.name}`,
      generatedAt: Date.now(),
      summary,
      overview: {
        name: project.name,
        status: project.status,
        participants: Array.from(participantMap.values()).map((p) => ({
          email: p.email,
          name: p.name,
          messageCount: p.count,
        })),
        dateRange: { earliest, latest },
        threadCount: threadLinks.length,
        messageCount: messages.length,
        attachmentCount: attachments.length,
      },
      timeline: timeline.map((t) => ({
        date: t.date,
        from: t.from,
        subject: t.subject,
        snippet: t.snippet,
        action: t.action,
      })),
      threads: threadSummaries.map((t) => ({
        threadId: t.thread_id,
        subject: t.subject ?? '',
        messageCount: t.msg_count,
        lastActivity: t.last_activity,
      })),
      attachments: attachments.map((a) => ({
        filename: a.filename,
        mimeType: a.mime_type,
        sizeBytes: a.size_bytes ?? 0,
        extractedPreview: a.extracted_text?.slice(0, 200) ?? undefined,
      })),
    };

    // 10. Format
    const formatter = this.getFormatter(format);
    const content = await formatter.format(reportData);
    const dateSuffix = new Date().toISOString().slice(0, 10);
    const safeName = project.name.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const filename = `project-${safeName}-${dateSuffix}.${formatter.fileExtension}`;

    return {
      content,
      filename,
      mimeType: formatter.mimeType,
      sizeBytes: Buffer.byteLength(content),
    };
  }

  // =========================================================================
  // Thread Report
  // =========================================================================

  async generateThreadReport(
    threadId: string,
    accountId: string,
    format: 'markdown' | 'json' | 'pdf' = 'markdown'
  ): Promise<ReportOutput> {
    // 1. Get thread hierarchy
    const hierarchy = await this.threadService.reconstructThread(accountId, threadId);

    // 2. Load messages
    const messages = await this.db.all<MessageRow>(
      `SELECT * FROM wunderland_email_synced_messages
       WHERE thread_id = ? AND account_id = ?
       ORDER BY internal_date ASC`,
      [threadId, accountId]
    );

    // 3. Load attachments
    const attachments = await this.db.all<AttachmentRow>(
      `SELECT a.filename, a.mime_type, a.size_bytes, a.extracted_text
       FROM wunderland_email_attachments a
       INNER JOIN wunderland_email_synced_messages m ON a.message_id = m.id
       WHERE m.thread_id = ? AND m.account_id = ?`,
      [threadId, accountId]
    );

    // 4. Build participants
    const participantMap = new Map<string, { email: string; name: string | null; count: number }>();
    for (const msg of messages) {
      const email = msg.from_address.toLowerCase();
      const existing = participantMap.get(email);
      if (existing) {
        existing.count++;
      } else {
        participantMap.set(email, { email: msg.from_address, name: msg.from_name, count: 1 });
      }
    }

    const dates = messages.map((m) => m.internal_date);
    const earliest = dates.length > 0 ? Math.min(...dates) : 0;
    const latest = dates.length > 0 ? Math.max(...dates) : 0;

    // 5. Build ReportData
    const reportData: ReportData = {
      type: 'thread',
      title: `Thread Report: ${hierarchy.subject || 'Untitled'}`,
      generatedAt: Date.now(),
      overview: {
        name: hierarchy.subject || 'Untitled Thread',
        participants: Array.from(participantMap.values()).map((p) => ({
          email: p.email,
          name: p.name,
          messageCount: p.count,
        })),
        dateRange: { earliest, latest },
        threadCount: 1,
        messageCount: messages.length,
        attachmentCount: attachments.length,
      },
      timeline: hierarchy.flatTimeline.map((t) => ({
        date: t.date,
        from: t.from.name ?? t.from.email,
        subject: t.snippet,
        snippet: t.snippet,
        action: t.action,
      })),
      threads: [
        {
          threadId,
          subject: hierarchy.subject,
          messageCount: messages.length,
          lastActivity: latest,
        },
      ],
      attachments: attachments.map((a) => ({
        filename: a.filename,
        mimeType: a.mime_type,
        sizeBytes: a.size_bytes ?? 0,
        extractedPreview: a.extracted_text?.slice(0, 200) ?? undefined,
      })),
    };

    // 6. Format
    const formatter = this.getFormatter(format);
    const content = await formatter.format(reportData);
    const dateSuffix = new Date().toISOString().slice(0, 10);
    const filename = `thread-${threadId.slice(0, 8)}-${dateSuffix}.${formatter.fileExtension}`;

    return {
      content,
      filename,
      mimeType: formatter.mimeType,
      sizeBytes: Buffer.byteLength(content),
    };
  }

  // =========================================================================
  // Digest Report
  // =========================================================================

  async generateDigestReport(
    seedId: string,
    sinceDate: number,
    format: 'markdown' | 'json' | 'pdf' = 'markdown',
    options?: {
      filterProjects?: string[];
      filterAccounts?: string[];
      includeAttachments?: boolean;
      includeTimeline?: boolean;
    }
  ): Promise<ReportOutput> {
    // 1. Load new messages since sinceDate across all accounts for seedId
    let messageQuery = `
      SELECT m.* FROM wunderland_email_synced_messages m
      INNER JOIN wunderland_email_accounts a ON m.account_id = a.id
      WHERE a.seed_id = ? AND m.internal_date > ?
    `;
    const params: any[] = [seedId, sinceDate];

    if (options?.filterAccounts && options.filterAccounts.length > 0) {
      const placeholders = options.filterAccounts.map(() => '?').join(',');
      messageQuery += ` AND m.account_id IN (${placeholders})`;
      params.push(...options.filterAccounts);
    }

    messageQuery += ` ORDER BY m.internal_date ASC`;

    const messages = await this.db.all<MessageRow>(messageQuery, params);

    // 2. Build participants
    const participantMap = new Map<string, { email: string; name: string | null; count: number }>();
    for (const msg of messages) {
      const email = msg.from_address.toLowerCase();
      const existing = participantMap.get(email);
      if (existing) {
        existing.count++;
      } else {
        participantMap.set(email, { email: msg.from_address, name: msg.from_name, count: 1 });
      }
    }

    // 3. Group by thread
    const threadMap = new Map<string, MessageRow[]>();
    for (const msg of messages) {
      const key = `${msg.account_id}:${msg.thread_id}`;
      const list = threadMap.get(key) ?? [];
      list.push(msg);
      threadMap.set(key, list);
    }

    // 4. Filter by projects if requested
    const threadSummaries: Array<{
      threadId: string;
      subject: string;
      messageCount: number;
      lastActivity: number;
    }> = [];

    if (options?.filterProjects && options.filterProjects.length > 0) {
      // Only include threads that belong to specified projects
      const placeholders = options.filterProjects.map(() => '?').join(',');
      const projectThreads = await this.db.all<{ thread_id: string; account_id: string }>(
        `SELECT thread_id, account_id FROM wunderland_email_project_threads
         WHERE project_id IN (${placeholders})`,
        options.filterProjects
      );
      const projectThreadKeys = new Set(
        projectThreads.map((t) => `${t.account_id}:${t.thread_id}`)
      );

      for (const [key, msgs] of threadMap) {
        if (!projectThreadKeys.has(key)) continue;
        const lastMsg = msgs[msgs.length - 1];
        threadSummaries.push({
          threadId: msgs[0].thread_id,
          subject: msgs[0].subject ?? '',
          messageCount: msgs.length,
          lastActivity: lastMsg.internal_date,
        });
      }
    } else {
      for (const [, msgs] of threadMap) {
        const lastMsg = msgs[msgs.length - 1];
        threadSummaries.push({
          threadId: msgs[0].thread_id,
          subject: msgs[0].subject ?? '',
          messageCount: msgs.length,
          lastActivity: lastMsg.internal_date,
        });
      }
    }

    // 5. Attachments (optional)
    let attachments: AttachmentRow[] = [];
    if (options?.includeAttachments !== false && messages.length > 0) {
      const msgIds = messages.map((m) => m.id);
      const placeholders = msgIds.map(() => '?').join(',');
      attachments = await this.db.all<AttachmentRow>(
        `SELECT filename, mime_type, size_bytes, extracted_text
         FROM wunderland_email_attachments
         WHERE message_id IN (${placeholders})`,
        msgIds
      );
    }

    // 6. Timeline (optional)
    let timeline: Array<{
      date: number;
      from: string;
      subject: string;
      snippet: string;
      action: string;
    }> = [];
    if (options?.includeTimeline !== false) {
      timeline = messages.map((m) => ({
        date: m.internal_date,
        from: m.from_name ?? m.from_address,
        subject: m.subject ?? '',
        snippet: m.snippet ?? '',
        action: this.inferAction(m),
      }));
    }

    const dates = messages.map((m) => m.internal_date);
    const earliest = dates.length > 0 ? Math.min(...dates) : sinceDate;
    const latest = dates.length > 0 ? Math.max(...dates) : Date.now();

    // 7. Build ReportData
    const reportData: ReportData = {
      type: 'digest',
      title: `Email Digest — ${new Date(sinceDate).toISOString().slice(0, 10)} to ${new Date().toISOString().slice(0, 10)}`,
      generatedAt: Date.now(),
      overview: {
        name: `Digest for seed ${seedId.slice(0, 8)}`,
        participants: Array.from(participantMap.values()).map((p) => ({
          email: p.email,
          name: p.name,
          messageCount: p.count,
        })),
        dateRange: { earliest, latest },
        threadCount: threadSummaries.length,
        messageCount: messages.length,
        attachmentCount: attachments.length,
      },
      timeline,
      threads: threadSummaries,
      attachments: attachments.map((a) => ({
        filename: a.filename,
        mimeType: a.mime_type,
        sizeBytes: a.size_bytes ?? 0,
        extractedPreview: a.extracted_text?.slice(0, 200) ?? undefined,
      })),
    };

    // 8. Format
    const formatter = this.getFormatter(format);
    const content = await formatter.format(reportData);
    const dateSuffix = new Date().toISOString().slice(0, 10);
    const filename = `digest-${seedId.slice(0, 8)}-${dateSuffix}.${formatter.fileExtension}`;

    return {
      content,
      filename,
      mimeType: formatter.mimeType,
      sizeBytes: Buffer.byteLength(content),
    };
  }

  // =========================================================================
  // Private Helpers
  // =========================================================================

  private getFormatter(format: string): IReportFormatter {
    switch (format) {
      case 'json':
        return new JsonFormatter();
      case 'pdf':
        return new PdfFormatter();
      case 'markdown':
      default:
        return new MarkdownFormatter();
    }
  }

  private async loadProjectMessages(projectId: string): Promise<MessageRow[]> {
    return this.db.all<MessageRow>(
      `SELECT m.* FROM wunderland_email_synced_messages m
       INNER JOIN wunderland_email_project_threads pt
         ON m.thread_id = pt.thread_id AND m.account_id = pt.account_id
       WHERE pt.project_id = ?
       ORDER BY m.internal_date ASC`,
      [projectId]
    );
  }

  private async loadProjectAttachments(projectId: string): Promise<AttachmentRow[]> {
    return this.db.all<AttachmentRow>(
      `SELECT a.filename, a.mime_type, a.size_bytes, a.extracted_text
       FROM wunderland_email_attachments a
       INNER JOIN wunderland_email_synced_messages m ON a.message_id = m.id
       INNER JOIN wunderland_email_project_threads pt
         ON m.thread_id = pt.thread_id AND m.account_id = pt.account_id
       WHERE pt.project_id = ?`,
      [projectId]
    );
  }

  private async loadThreadSummaries(projectId: string): Promise<ThreadSummaryRow[]> {
    return this.db.all<ThreadSummaryRow>(
      `SELECT m.thread_id, m.account_id,
              MIN(m.subject) as subject,
              COUNT(*) as msg_count,
              MAX(m.internal_date) as last_activity
       FROM wunderland_email_synced_messages m
       INNER JOIN wunderland_email_project_threads pt
         ON m.thread_id = pt.thread_id AND m.account_id = pt.account_id
       WHERE pt.project_id = ?
       GROUP BY m.thread_id, m.account_id`,
      [projectId]
    );
  }

  private inferAction(msg: MessageRow): string {
    const subj = (msg.subject ?? '').toLowerCase();
    if (subj.startsWith('fwd:') || subj.startsWith('fw:')) return 'forwarded';
    if (msg.in_reply_to) return 'replied';
    return 'sent';
  }
}
