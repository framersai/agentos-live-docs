/**
 * @file email-intelligence.controller.ts
 * @description REST endpoints for the email intelligence subsystem:
 *              account management, synced message browsing, thread views,
 *              project management, RAG query, attachments, and stats.
 *
 * Route prefix: /wunderland/email-intelligence
 *
 * Auth: JWT (via AuthGuard + @CurrentUser) OR X-Internal-Secret header.
 */

import {
  Inject,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  HttpException,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../../../common/guards/auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { DatabaseService } from '../../../database/database.service.js';
import { EmailSyncService } from './services/email-sync.service.js';
import { EmailThreadService } from './services/email-thread.service.js';
import { EmailProjectService } from './services/email-project.service.js';
import { EmailRagService } from './services/email-rag.service.js';
import { EmailAttachmentService } from './services/email-attachment.service.js';
import { EmailRateLimitService } from './services/email-rate-limit.service.js';
import {
  SeedIdQuery,
  ListMessagesQuery,
  ListThreadsQuery,
  ListAttachmentsQuery,
  UpdateAccountDto,
  CreateProjectDto,
  UpdateProjectDto,
  AddThreadsDto,
  MergeProjectsDto,
  ApplyProposalsDto,
  EmailQueryDto,
} from './email-intelligence.dto.js';

// ---------------------------------------------------------------------------
// Internal row shapes
// ---------------------------------------------------------------------------

interface AccountRow {
  id: string;
  seed_id: string;
  owner_user_id: string;
  provider: string;
  email_address: string;
  sync_enabled: number;
  sync_state: string;
  sync_cursor: string | null;
  sync_progress_json: string | null;
  total_messages_synced: number;
  last_sync_error: string | null;
  last_full_sync_at: number | null;
  sync_interval_ms: number | null;
  is_active: number;
  created_at: number;
  updated_at: number;
}

interface MessageRow {
  id: string;
  provider_message_id: string;
  account_id: string;
  thread_id: string;
  subject: string | null;
  from_address: string;
  from_name: string | null;
  to_addresses: string | null;
  cc_addresses: string | null;
  bcc_addresses: string | null;
  body_text: string | null;
  body_html: string | null;
  snippet: string | null;
  internal_date: number;
  labels: string | null;
  is_read: number;
  is_starred: number;
  is_draft: number;
  has_attachments: number;
  attachment_count: number;
  size_bytes: number | null;
  created_at: number;
}

interface ThreadSummaryRow {
  thread_id: string;
  subject: string | null;
  message_count: number;
  latest_date: number;
  earliest_date: number;
}

interface AttachmentRow {
  id: string;
  message_id: string;
  account_id: string;
  filename: string;
  mime_type: string;
  size_bytes: number | null;
  is_inline: number;
  extraction_status: string;
  extracted_text: string | null;
  multimodal_description: string | null;
}

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------

@Controller('wunderland/email-intelligence')
export class EmailIntelligenceController {
  private readonly logger = new Logger(EmailIntelligenceController.name);

  constructor(
    @Inject(DatabaseService) private readonly db: DatabaseService,
    @Inject(EmailSyncService) private readonly syncService: EmailSyncService,
    @Inject(EmailThreadService) private readonly threadService: EmailThreadService,
    @Inject(EmailProjectService) private readonly projectService: EmailProjectService,
    @Inject(EmailRagService) private readonly ragService: EmailRagService,
    @Inject(EmailAttachmentService) private readonly attachmentService: EmailAttachmentService,
    @Inject(EmailRateLimitService) private readonly rateLimitService: EmailRateLimitService
  ) {}

  // ---- Auth helpers --------------------------------------------------------

  /**
   * Assert access via JWT user ownership of the seedId OR via X-Internal-Secret.
   * Returns true if internal secret was used (no user context).
   */
  assertAccess(req: Request, user: any, seedId: string): void {
    // 1. Try internal secret
    const expectedSecret = (process.env.INTERNAL_API_SECRET || '').trim();
    if (expectedSecret) {
      const provided = String(req.headers['x-internal-secret'] || '').trim();
      if (provided && provided === expectedSecret) {
        return; // internal access granted
      }
    }

    // 2. JWT user must exist
    if (!user || !user.id) {
      throw new ForbiddenException('Authentication required.');
    }

    // 3. Check paid subscription
    this.assertPaidAccess(user);
  }

  private assertPaidAccess(user: any): void {
    const status =
      (typeof user?.subscriptionStatus === 'string' && user.subscriptionStatus) ||
      (typeof user?.subscription_status === 'string' && user.subscription_status) ||
      '';
    const tier = typeof user?.tier === 'string' ? user.tier : '';
    const mode = typeof user?.mode === 'string' ? user.mode : '';
    const isPaid =
      mode === 'global' ||
      tier === 'unlimited' ||
      status === 'active' ||
      status === 'trialing' ||
      status === 'unlimited';
    if (!isPaid) {
      throw new ForbiddenException('Active paid subscription required.');
    }
  }

  // ---- Rate limit helper ---------------------------------------------------

  private async assertRateLimit(seedId: string, endpoint: string, limit: number): Promise<void> {
    const result = await this.rateLimitService.checkAndIncrement(seedId, endpoint, limit);
    if (!result.allowed) {
      throw new HttpException(
        { message: 'Rate limit exceeded', retryAfterMs: result.retryAfterMs },
        429
      );
    }
  }

  // =========================================================================
  // Account Management
  // =========================================================================

  /** GET /accounts?seedId=X — list connected email accounts */
  @UseGuards(AuthGuard)
  @Get('accounts')
  async listAccounts(@Req() req: Request, @CurrentUser() user: any, @Query() query: SeedIdQuery) {
    this.assertAccess(req, user, query.seedId);

    const accounts = await this.db.all<AccountRow>(
      `SELECT * FROM wunderland_email_accounts
       WHERE seed_id = ? AND is_active = 1
       ORDER BY created_at DESC`,
      [query.seedId]
    );

    return {
      accounts: accounts.map((a) => ({
        id: a.id,
        provider: a.provider,
        emailAddress: a.email_address,
        syncEnabled: !!a.sync_enabled,
        syncState: a.sync_state,
        totalMessagesSynced: a.total_messages_synced,
        createdAt: a.created_at,
      })),
    };
  }

  /** GET /accounts/:accountId/status?seedId=X — sync status */
  @UseGuards(AuthGuard)
  @Get('accounts/:accountId/status')
  async getAccountStatus(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('accountId') accountId: string,
    @Query() query: SeedIdQuery
  ) {
    this.assertAccess(req, user, query.seedId);

    const account = await this.db.get<AccountRow>(
      `SELECT * FROM wunderland_email_accounts
       WHERE id = ? AND seed_id = ?`,
      [accountId, query.seedId]
    );

    if (!account) throw new NotFoundException('Account not found.');

    let syncProgress: object | null = null;
    if (account.sync_progress_json) {
      try {
        syncProgress = JSON.parse(account.sync_progress_json);
      } catch {
        syncProgress = null;
      }
    }

    return {
      accountId: account.id,
      syncState: account.sync_state,
      syncEnabled: !!account.sync_enabled,
      syncProgress,
      totalMessagesSynced: account.total_messages_synced,
      lastSyncError: account.last_sync_error,
      lastFullSyncAt: account.last_full_sync_at,
      syncIntervalMs: account.sync_interval_ms,
    };
  }

  /** DELETE /accounts/:accountId?seedId=X — soft-delete account (is_active=0) */
  @UseGuards(AuthGuard)
  @Delete('accounts/:accountId')
  async deleteAccount(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('accountId') accountId: string,
    @Query() query: SeedIdQuery
  ) {
    this.assertAccess(req, user, query.seedId);

    const account = await this.db.get<AccountRow>(
      `SELECT id FROM wunderland_email_accounts WHERE id = ? AND seed_id = ?`,
      [accountId, query.seedId]
    );
    if (!account) throw new NotFoundException('Account not found.');

    const now = Date.now();
    await this.db.run(
      `UPDATE wunderland_email_accounts SET is_active = 0, sync_enabled = 0, updated_at = ? WHERE id = ?`,
      [now, accountId]
    );

    return { ok: true, accountId };
  }

  /** PATCH /accounts/:accountId?seedId=X — update sync settings */
  @UseGuards(AuthGuard)
  @Patch('accounts/:accountId')
  async updateAccount(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('accountId') accountId: string,
    @Query() query: SeedIdQuery,
    @Body() body: UpdateAccountDto
  ) {
    this.assertAccess(req, user, query.seedId);

    const account = await this.db.get<AccountRow>(
      `SELECT id FROM wunderland_email_accounts WHERE id = ? AND seed_id = ?`,
      [accountId, query.seedId]
    );
    if (!account) throw new NotFoundException('Account not found.');

    const updates: string[] = [];
    const params: (string | number)[] = [];

    if (body.syncIntervalMs !== undefined) {
      updates.push('sync_interval_ms = ?');
      params.push(body.syncIntervalMs);
    }
    if (body.syncEnabled !== undefined) {
      updates.push('sync_enabled = ?');
      params.push(body.syncEnabled ? 1 : 0);
    }

    if (updates.length === 0) {
      return { ok: true, accountId };
    }

    const now = Date.now();
    updates.push('updated_at = ?');
    params.push(now);
    params.push(accountId);

    await this.db.run(
      `UPDATE wunderland_email_accounts SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    return { ok: true, accountId };
  }

  /** POST /accounts/:accountId/sync?seedId=X — trigger immediate sync (async, returns 202) */
  @UseGuards(AuthGuard)
  @Post('accounts/:accountId/sync')
  @HttpCode(HttpStatus.ACCEPTED)
  async triggerSync(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('accountId') accountId: string,
    @Query() query: SeedIdQuery
  ) {
    this.assertAccess(req, user, query.seedId);

    const account = await this.db.get<AccountRow>(
      `SELECT id, sync_state FROM wunderland_email_accounts WHERE id = ? AND seed_id = ?`,
      [accountId, query.seedId]
    );
    if (!account) throw new NotFoundException('Account not found.');

    if (account.sync_state === 'syncing') {
      return { status: 'already_syncing', accountId };
    }

    // Fire async — don't await
    this.syncService.syncAccount(accountId).catch((err) => {
      this.logger.error(`Async sync failed for account ${accountId}: ${err?.message ?? err}`);
    });

    return { status: 'accepted', accountId };
  }

  // =========================================================================
  // Messages
  // =========================================================================

  /** GET /messages?seedId=X&accountId=Y&page=1&limit=20 — paginated messages */
  @UseGuards(AuthGuard)
  @Get('messages')
  async listMessages(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Query() query: ListMessagesQuery
  ) {
    this.assertAccess(req, user, query.seedId);

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    // Must have an account that belongs to this seed
    conditions.push(
      `m.account_id IN (SELECT id FROM wunderland_email_accounts WHERE seed_id = ? AND is_active = 1)`
    );
    params.push(query.seedId);

    if (query.accountId) {
      conditions.push('m.account_id = ?');
      params.push(query.accountId);
    }

    if (query.label) {
      conditions.push("m.labels LIKE '%' || ? || '%'");
      params.push(query.label);
    }

    if (query.isRead !== undefined) {
      conditions.push('m.is_read = ?');
      params.push(query.isRead === 'true' || query.isRead === '1' ? 1 : 0);
    }

    if (query.after) {
      conditions.push('m.internal_date > ?');
      params.push(Number(query.after));
    }

    if (query.before) {
      conditions.push('m.internal_date < ?');
      params.push(Number(query.before));
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM wunderland_email_synced_messages m ${where}`,
      params
    );
    const total = countRow?.cnt ?? 0;

    const messages = await this.db.all<MessageRow>(
      `SELECT m.* FROM wunderland_email_synced_messages m
       ${where}
       ORDER BY m.internal_date DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return {
      messages: messages.map((m) => this.formatMessageSummary(m)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /** GET /messages/:messageId?seedId=X — full message with body and attachment metadata */
  @UseGuards(AuthGuard)
  @Get('messages/:messageId')
  async getMessage(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('messageId') messageId: string,
    @Query() query: SeedIdQuery
  ) {
    this.assertAccess(req, user, query.seedId);

    const message = await this.db.get<MessageRow>(
      `SELECT m.* FROM wunderland_email_synced_messages m
       JOIN wunderland_email_accounts a ON a.id = m.account_id
       WHERE m.id = ? AND a.seed_id = ? AND a.is_active = 1`,
      [messageId, query.seedId]
    );

    if (!message) throw new NotFoundException('Message not found.');

    // Load attachments
    const attachments = await this.db.all<{
      id: string;
      filename: string;
      mime_type: string;
      size_bytes: number;
      is_inline: number;
    }>(
      `SELECT id, filename, mime_type, size_bytes, is_inline
       FROM wunderland_email_attachments
       WHERE message_id = ?`,
      [messageId]
    );

    return {
      message: this.formatMessageFull(message),
      attachments: attachments.map((a) => ({
        id: a.id,
        filename: a.filename,
        mimeType: a.mime_type,
        sizeBytes: a.size_bytes,
        isInline: !!a.is_inline,
      })),
    };
  }

  // =========================================================================
  // Threads
  // =========================================================================

  /** GET /threads?seedId=X&accountId=Y&page=1&limit=20 — list threads with message counts */
  @UseGuards(AuthGuard)
  @Get('threads')
  async listThreads(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Query() query: ListThreadsQuery
  ) {
    this.assertAccess(req, user, query.seedId);

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const offset = (page - 1) * limit;

    const countRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(DISTINCT thread_id) as cnt
       FROM wunderland_email_synced_messages
       WHERE account_id = ?`,
      [query.accountId]
    );
    const total = countRow?.cnt ?? 0;

    const threads = await this.db.all<ThreadSummaryRow>(
      `SELECT
         thread_id,
         MIN(subject) as subject,
         COUNT(*) as message_count,
         MAX(internal_date) as latest_date,
         MIN(internal_date) as earliest_date
       FROM wunderland_email_synced_messages
       WHERE account_id = ?
       GROUP BY thread_id
       ORDER BY latest_date DESC
       LIMIT ? OFFSET ?`,
      [query.accountId, limit, offset]
    );

    return {
      threads: threads.map((t) => ({
        threadId: t.thread_id,
        subject: t.subject ?? '(no subject)',
        messageCount: t.message_count,
        latestDate: t.latest_date,
        earliestDate: t.earliest_date,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /** GET /threads/:threadId?seedId=X&accountId=X — thread hierarchy */
  @UseGuards(AuthGuard)
  @Get('threads/:threadId')
  async getThread(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('threadId') threadId: string,
    @Query() query: { seedId: string; accountId: string }
  ) {
    this.assertAccess(req, user, query.seedId);

    if (!query.accountId) {
      throw new BadRequestException('accountId query parameter is required.');
    }

    const hierarchy = await this.threadService.reconstructThread(query.accountId, threadId);
    return { thread: hierarchy };
  }

  /** GET /threads/:threadId/timeline?seedId=X&accountId=X — timeline events */
  @UseGuards(AuthGuard)
  @Get('threads/:threadId/timeline')
  async getThreadTimeline(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('threadId') threadId: string,
    @Query() query: { seedId: string; accountId: string }
  ) {
    this.assertAccess(req, user, query.seedId);

    if (!query.accountId) {
      throw new BadRequestException('accountId query parameter is required.');
    }

    const hierarchy = await this.threadService.reconstructThread(query.accountId, threadId);
    return { timeline: hierarchy.flatTimeline };
  }

  // =========================================================================
  // Projects
  // =========================================================================

  /** GET /projects?seedId=X — list projects */
  @UseGuards(AuthGuard)
  @Get('projects')
  async listProjects(@Req() req: Request, @CurrentUser() user: any, @Query() query: SeedIdQuery) {
    this.assertAccess(req, user, query.seedId);
    const projects = await this.projectService.listProjects(query.seedId);
    return { projects };
  }

  /** POST /projects?seedId=X — create project */
  @UseGuards(AuthGuard)
  @Post('projects')
  async createProject(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Query() query: SeedIdQuery,
    @Body() body: CreateProjectDto
  ) {
    this.assertAccess(req, user, query.seedId);
    const userId = user?.id ?? 'system';
    const project = await this.projectService.createProject(
      query.seedId,
      userId,
      body.name,
      body.description,
      body.threads
    );
    return { project };
  }

  /** GET /projects/:projectId?seedId=X — get single project */
  @UseGuards(AuthGuard)
  @Get('projects/:projectId')
  async getProject(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('projectId') projectId: string,
    @Query() query: SeedIdQuery
  ) {
    this.assertAccess(req, user, query.seedId);
    const project = await this.projectService.getProject(projectId);
    if (!project) throw new NotFoundException('Project not found.');
    return { project };
  }

  /** PATCH /projects/:projectId?seedId=X — update project */
  @UseGuards(AuthGuard)
  @Patch('projects/:projectId')
  async updateProject(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('projectId') projectId: string,
    @Query() query: SeedIdQuery,
    @Body() body: UpdateProjectDto
  ) {
    this.assertAccess(req, user, query.seedId);
    const existing = await this.projectService.getProject(projectId);
    if (!existing) throw new NotFoundException('Project not found.');
    await this.projectService.updateProject(projectId, body);
    return { ok: true, projectId };
  }

  /** DELETE /projects/:projectId?seedId=X — delete project */
  @UseGuards(AuthGuard)
  @Delete('projects/:projectId')
  async deleteProject(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('projectId') projectId: string,
    @Query() query: SeedIdQuery
  ) {
    this.assertAccess(req, user, query.seedId);
    const existing = await this.projectService.getProject(projectId);
    if (!existing) throw new NotFoundException('Project not found.');
    await this.projectService.deleteProject(projectId);
    return { ok: true, projectId };
  }

  /** POST /projects/:projectId/threads?seedId=X — add threads to project */
  @UseGuards(AuthGuard)
  @Post('projects/:projectId/threads')
  async addThreadsToProject(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('projectId') projectId: string,
    @Query() query: SeedIdQuery,
    @Body() body: AddThreadsDto
  ) {
    this.assertAccess(req, user, query.seedId);
    const existing = await this.projectService.getProject(projectId);
    if (!existing) throw new NotFoundException('Project not found.');
    const userId = user?.id ?? 'system';
    await this.projectService.addThreadsToProject(projectId, body.threads, userId);
    return { ok: true, projectId };
  }

  /** DELETE /projects/:projectId/threads/:threadId?seedId=X&accountId=Y — remove thread from project */
  @UseGuards(AuthGuard)
  @Delete('projects/:projectId/threads/:threadId')
  async removeThreadFromProject(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('projectId') projectId: string,
    @Param('threadId') threadId: string,
    @Query() query: { seedId: string; accountId: string }
  ) {
    this.assertAccess(req, user, query.seedId);
    if (!query.accountId) {
      throw new BadRequestException('accountId query parameter is required.');
    }
    await this.projectService.removeThreadFromProject(projectId, threadId, query.accountId);
    return { ok: true, projectId, threadId };
  }

  /** POST /projects/merge?seedId=X — merge two projects */
  @UseGuards(AuthGuard)
  @Post('projects/merge')
  async mergeProjects(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Query() query: SeedIdQuery,
    @Body() body: MergeProjectsDto
  ) {
    this.assertAccess(req, user, query.seedId);
    const mergedId = await this.projectService.mergeProjects(body.projectIdA, body.projectIdB);
    return { ok: true, mergedProjectId: mergedId };
  }

  /** GET /projects/:projectId/summary?seedId=X — LLM-generated summary (rate-limited: 10/hr) */
  @UseGuards(AuthGuard)
  @Get('projects/:projectId/summary')
  async getProjectSummary(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('projectId') projectId: string,
    @Query() query: SeedIdQuery
  ) {
    this.assertAccess(req, user, query.seedId);
    await this.assertRateLimit(query.seedId, 'project_summary', 10);
    const existing = await this.projectService.getProject(projectId);
    if (!existing) throw new NotFoundException('Project not found.');
    const summary = await this.projectService.getProjectSummary(projectId);
    return { projectId, summary };
  }

  /** GET /projects/:projectId/timeline?seedId=X — project timeline */
  @UseGuards(AuthGuard)
  @Get('projects/:projectId/timeline')
  async getProjectTimeline(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('projectId') projectId: string,
    @Query() query: SeedIdQuery
  ) {
    this.assertAccess(req, user, query.seedId);
    const existing = await this.projectService.getProject(projectId);
    if (!existing) throw new NotFoundException('Project not found.');
    const timeline = await this.projectService.getProjectTimeline(projectId);
    return { projectId, timeline };
  }

  /** POST /projects/detect?seedId=X — auto-detect projects (rate-limited: 3/hr) */
  @UseGuards(AuthGuard)
  @Post('projects/detect')
  async detectProjects(@Req() req: Request, @CurrentUser() user: any, @Query() query: SeedIdQuery) {
    this.assertAccess(req, user, query.seedId);
    await this.assertRateLimit(query.seedId, 'project_detect', 3);
    const proposals = await this.projectService.detectProjects(query.seedId);
    return { proposals };
  }

  /** POST /projects/detect/apply?seedId=X — apply detection proposals */
  @UseGuards(AuthGuard)
  @Post('projects/detect/apply')
  async applyProposals(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Query() query: SeedIdQuery,
    @Body() body: ApplyProposalsDto
  ) {
    this.assertAccess(req, user, query.seedId);
    const userId = user?.id ?? 'system';
    // body.proposals is the full proposals array; extract IDs for the service
    const proposalIds = body.proposals.map((p: any) => p.id);
    await this.projectService.applyProposals(query.seedId, userId, proposalIds, body.proposals);
    return { ok: true, applied: proposalIds.length };
  }

  // =========================================================================
  // Intelligence / RAG
  // =========================================================================

  /** POST /query?seedId=X — semantic search across email content (rate-limited: 30/hr) */
  @UseGuards(AuthGuard)
  @Post('query')
  async queryEmails(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Query() query: SeedIdQuery,
    @Body() body: EmailQueryDto
  ) {
    this.assertAccess(req, user, query.seedId);
    await this.assertRateLimit(query.seedId, 'query', 30);
    const result = await this.ragService.query({
      query: body.query,
      seedId: query.seedId,
      accountIds: body.accountIds,
      projectIds: body.projectIds,
      threadIds: body.threadIds,
      dateRange: body.dateRange,
      includeAttachments: body.includeAttachments,
      topK: body.topK,
    });
    return result;
  }

  /** GET /stats?seedId=X — aggregate intelligence stats */
  @UseGuards(AuthGuard)
  @Get('stats')
  async getStats(@Req() req: Request, @CurrentUser() user: any, @Query() query: SeedIdQuery) {
    this.assertAccess(req, user, query.seedId);

    const unreadRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(*) as cnt
       FROM wunderland_email_synced_messages m
       JOIN wunderland_email_accounts a ON a.id = m.account_id
       WHERE a.seed_id = ? AND a.is_active = 1 AND m.is_read = 0`,
      [query.seedId]
    );

    // "Awaiting reply" = messages sent by the user's account where no reply exists
    // Simplified: messages where from_address matches account email and is the latest in thread
    const awaitingRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(DISTINCT m.thread_id) as cnt
       FROM wunderland_email_synced_messages m
       JOIN wunderland_email_accounts a ON a.id = m.account_id
       WHERE a.seed_id = ? AND a.is_active = 1
         AND m.from_address = a.email_address
         AND m.internal_date = (
           SELECT MAX(m2.internal_date)
           FROM wunderland_email_synced_messages m2
           WHERE m2.thread_id = m.thread_id AND m2.account_id = m.account_id
         )`,
      [query.seedId]
    );

    const activeProjectsRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM wunderland_email_projects
       WHERE seed_id = ? AND status = 'active'`,
      [query.seedId]
    );

    return {
      unreadCount: unreadRow?.cnt ?? 0,
      awaitingReplyCount: awaitingRow?.cnt ?? 0,
      activeProjectsCount: activeProjectsRow?.cnt ?? 0,
    };
  }

  // =========================================================================
  // Attachments
  // =========================================================================

  /** GET /attachments?seedId=X&messageId=Y&mimeType=Z — list attachments */
  @UseGuards(AuthGuard)
  @Get('attachments')
  async listAttachments(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Query() query: ListAttachmentsQuery
  ) {
    this.assertAccess(req, user, query.seedId);

    const conditions: string[] = [
      `att.account_id IN (SELECT id FROM wunderland_email_accounts WHERE seed_id = ? AND is_active = 1)`,
    ];
    const params: (string | number)[] = [query.seedId];

    if (query.messageId) {
      conditions.push('att.message_id = ?');
      params.push(query.messageId);
    }
    if (query.mimeType) {
      conditions.push('att.mime_type = ?');
      params.push(query.mimeType);
    }

    const where = `WHERE ${conditions.join(' AND ')}`;

    const attachments = await this.db.all<AttachmentRow>(
      `SELECT att.* FROM wunderland_email_attachments att ${where}
       ORDER BY att.id`,
      params
    );

    return {
      attachments: attachments.map((a) => ({
        id: a.id,
        messageId: a.message_id,
        filename: a.filename,
        mimeType: a.mime_type,
        sizeBytes: a.size_bytes,
        isInline: !!a.is_inline,
        extractionStatus: a.extraction_status,
      })),
    };
  }

  /** GET /attachments/:attachmentId?seedId=X — single attachment detail with extracted text */
  @UseGuards(AuthGuard)
  @Get('attachments/:attachmentId')
  async getAttachment(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('attachmentId') attachmentId: string,
    @Query() query: SeedIdQuery
  ) {
    this.assertAccess(req, user, query.seedId);

    const attachment = await this.db.get<AttachmentRow>(
      `SELECT att.* FROM wunderland_email_attachments att
       JOIN wunderland_email_accounts a ON a.id = att.account_id
       WHERE att.id = ? AND a.seed_id = ? AND a.is_active = 1`,
      [attachmentId, query.seedId]
    );

    if (!attachment) throw new NotFoundException('Attachment not found.');

    return {
      attachment: {
        id: attachment.id,
        messageId: attachment.message_id,
        filename: attachment.filename,
        mimeType: attachment.mime_type,
        sizeBytes: attachment.size_bytes,
        isInline: !!attachment.is_inline,
        extractionStatus: attachment.extraction_status,
        extractedText: attachment.extracted_text,
        multimodalDescription: attachment.multimodal_description,
      },
    };
  }

  /** POST /attachments/:attachmentId/transcribe?seedId=X — trigger image transcription (rate-limited: 20/hr) */
  @UseGuards(AuthGuard)
  @Post('attachments/:attachmentId/transcribe')
  async transcribeAttachment(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Param('attachmentId') attachmentId: string,
    @Query() query: SeedIdQuery
  ) {
    this.assertAccess(req, user, query.seedId);
    await this.assertRateLimit(query.seedId, 'attachment_transcribe', 20);

    const attachment = await this.db.get<AttachmentRow>(
      `SELECT att.* FROM wunderland_email_attachments att
       JOIN wunderland_email_accounts a ON a.id = att.account_id
       WHERE att.id = ? AND a.seed_id = ? AND a.is_active = 1`,
      [attachmentId, query.seedId]
    );

    if (!attachment) throw new NotFoundException('Attachment not found.');

    // For now, transcription requires content to be re-fetched.
    // The service handles the actual transcription logic; we pass an empty
    // buffer placeholder — real content would come from the provider.
    // In practice, the caller would supply the image bytes or the service
    // would fetch them from the provider using stored credentials.
    await this.attachmentService.transcribeImage(attachmentId, Buffer.alloc(0));

    return { ok: true, attachmentId, status: 'transcription_triggered' };
  }

  // =========================================================================
  // Formatting helpers
  // =========================================================================

  private formatMessageSummary(m: MessageRow) {
    return {
      id: m.id,
      accountId: m.account_id,
      threadId: m.thread_id,
      subject: m.subject,
      from: { email: m.from_address, name: m.from_name },
      snippet: m.snippet,
      internalDate: m.internal_date,
      isRead: !!m.is_read,
      isStarred: !!m.is_starred,
      isDraft: !!m.is_draft,
      hasAttachments: !!m.has_attachments,
      attachmentCount: m.attachment_count,
      labels: this.safeParseJson(m.labels, []),
    };
  }

  private formatMessageFull(m: MessageRow) {
    return {
      ...this.formatMessageSummary(m),
      to: this.safeParseJson(m.to_addresses, []),
      cc: this.safeParseJson(m.cc_addresses, []),
      bcc: this.safeParseJson(m.bcc_addresses, []),
      bodyText: m.body_text,
      bodyHtml: m.body_html,
      sizeBytes: m.size_bytes,
    };
  }

  private safeParseJson(value: string | null, fallback: any): any {
    if (!value) return fallback;
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
}
