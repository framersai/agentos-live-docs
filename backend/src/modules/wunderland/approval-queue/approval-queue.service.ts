/**
 * @file approval-queue.service.ts
 * @description Injectable service for the Wunderland Approval Queue.
 *
 * Encapsulates business logic for managing the human-in-the-loop review
 * queue, including enqueueing generated posts, ownership validation,
 * approval/rejection workflows, and WebSocket event emission.
 *
 * Will integrate with the {@link SocialFeedService} for post publication
 * and the {@link WunderlandGateway} for real-time notifications.
 */

import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service.js';
import type { DecideApprovalDto, ListApprovalQueueQueryDto } from '../dto/index.js';

type PaginatedResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};

type ApprovalQueueItem = {
  queueId: string;
  postId: string;
  seedId: string;
  ownerUserId: string;
  content: string;
  manifest: Record<string, unknown>;
  status: string;
  queuedAt: string;
  decidedAt?: string | null;
  rejectionReason?: string | null;
};

function parseJsonOr<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return (JSON.parse(raw) as T) ?? fallback;
  } catch {
    return fallback;
  }
}

@Injectable()
export class ApprovalQueueService {
  constructor(private readonly db: DatabaseService) {}

  async listQueue(
    userId: string,
    query: ListApprovalQueueQueryDto = {}
  ): Promise<PaginatedResponse<ApprovalQueueItem>> {
    const page = Math.max(1, Number(query.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(query.limit ?? 25)));
    const offset = (page - 1) * limit;

    const where: string[] = ['owner_user_id = ?'];
    const params: Array<string | number> = [userId];

    if (query.status) {
      where.push('status = ?');
      params.push(query.status);
    }

    const whereSql = `WHERE ${where.join(' AND ')}`;

    const totalRow = await this.db.get<{ count: number }>(
      `SELECT COUNT(1) as count FROM wunderland_approval_queue ${whereSql}`,
      params
    );
    const total = totalRow?.count ?? 0;

    const rows = await this.db.all<any>(
      `
        SELECT
          queue_id,
          post_id,
          seed_id,
          owner_user_id,
          content,
          manifest,
          status,
          queued_at,
          decided_at,
          rejection_reason
        FROM wunderland_approval_queue
        ${whereSql}
        ORDER BY queued_at DESC
        LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    return {
      items: rows.map((row) => ({
        queueId: String(row.queue_id),
        postId: String(row.post_id),
        seedId: String(row.seed_id),
        ownerUserId: String(row.owner_user_id),
        content: String(row.content ?? ''),
        manifest: parseJsonOr<Record<string, unknown>>(row.manifest, {}),
        status: String(row.status ?? 'pending'),
        queuedAt: new Date(Number(row.queued_at ?? Date.now())).toISOString(),
        decidedAt: row.decided_at ? new Date(Number(row.decided_at)).toISOString() : null,
        rejectionReason: row.rejection_reason ?? null,
      })),
      page,
      limit,
      total,
    };
  }

  async decide(userId: string, queueId: string, dto: DecideApprovalDto) {
    const now = Date.now();

    return this.db.transaction(async (trx) => {
      const entry = await trx.get<any>(
        'SELECT * FROM wunderland_approval_queue WHERE queue_id = ? AND owner_user_id = ? LIMIT 1',
        [queueId, userId]
      );
      if (!entry) throw new NotFoundException(`Approval queue entry "${queueId}" not found.`);

      if (entry.status !== 'pending') {
        return {
          queueId,
          status: entry.status,
          decidedAt: entry.decided_at ? new Date(Number(entry.decided_at)).toISOString() : null,
        };
      }

      if (dto.action === 'approve') {
        await trx.run(
          'UPDATE wunderland_approval_queue SET status = ?, decided_at = ?, rejection_reason = NULL WHERE queue_id = ?',
          ['approved', now, queueId]
        );
        await trx.run(
          `
            UPDATE wunderland_posts
               SET status = 'published',
                   content = COALESCE(?, content),
                   manifest = COALESCE(?, manifest),
                   published_at = COALESCE(published_at, ?)
             WHERE post_id = ?
          `,
          [entry.content ?? null, entry.manifest ?? null, now, entry.post_id]
        );
        return {
          queueId,
          action: 'approve',
          status: 'approved',
          decidedAt: new Date(now).toISOString(),
        };
      }

      await trx.run(
        'UPDATE wunderland_approval_queue SET status = ?, decided_at = ?, rejection_reason = ? WHERE queue_id = ?',
        ['rejected', now, dto.feedback ?? null, queueId]
      );
      await trx.run(`UPDATE wunderland_posts SET status = 'rejected' WHERE post_id = ?`, [
        entry.post_id,
      ]);

      return {
        queueId,
        action: 'reject',
        status: 'rejected',
        decidedAt: new Date(now).toISOString(),
      };
    });
  }
}
