/**
 * @file social-posts.service.ts
 * @description Service for managing cross-platform social posts.
 *
 * Implements a state machine for social post lifecycle:
 *   draft -> scheduled -> publishing -> published
 *                                    -> error -> retry -> publishing
 *
 * Posts are stored in `wunderland_social_posts` with per-platform
 * adaptation text, media URLs, and publishing results as JSON columns.
 */

import { Inject, Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service.js';

export type SocialPostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'error' | 'retry';

export interface PlatformResult {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

export interface SocialPostRow {
  id: string;
  seed_id: string;
  base_content: string;
  adaptations: string;
  platforms: string;
  media_urls: string;
  scheduled_at: string | null;
  status: SocialPostStatus;
  results: string;
  retry_count: number;
  max_retries: number;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialPost {
  id: string;
  seedId: string;
  baseContent: string;
  adaptations: Record<string, string>;
  platforms: string[];
  mediaUrls: string[];
  scheduledAt: string | null;
  status: SocialPostStatus;
  results: Record<string, PlatformResult>;
  retryCount: number;
  maxRetries: number;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class SocialPostsService {
  private readonly logger = new Logger(SocialPostsService.name);
  private tableEnsured = false;

  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  // ── Table initialization ──────────────────────────────────────────────────

  async ensureTable(): Promise<void> {
    if (this.tableEnsured) return;

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS wunderland_social_posts (
        id TEXT PRIMARY KEY,
        seed_id TEXT NOT NULL,
        base_content TEXT NOT NULL,
        adaptations TEXT DEFAULT '{}',
        platforms TEXT NOT NULL,
        media_urls TEXT DEFAULT '[]',
        scheduled_at TEXT,
        status TEXT NOT NULL DEFAULT 'draft',
        results TEXT DEFAULT '{}',
        retry_count INTEGER DEFAULT 0,
        max_retries INTEGER DEFAULT 3,
        error TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    this.tableEnsured = true;
    this.logger.log('Ensured wunderland_social_posts table exists.');
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────

  async createDraft(
    seedId: string,
    baseContent: string,
    platforms: string[],
    adaptations?: Record<string, string>,
    mediaUrls?: string[],
    scheduledAt?: string
  ): Promise<SocialPost> {
    await this.ensureTable();

    const id = this.db.generateId();
    const now = new Date().toISOString();

    await this.db.run(
      `INSERT INTO wunderland_social_posts
        (id, seed_id, base_content, adaptations, platforms, media_urls, scheduled_at, status, results, retry_count, max_retries, error, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', '{}', 0, 3, NULL, ?, ?)`,
      [
        id,
        seedId,
        baseContent,
        JSON.stringify(adaptations ?? {}),
        JSON.stringify(platforms),
        JSON.stringify(mediaUrls ?? []),
        scheduledAt ?? null,
        now,
        now,
      ]
    );

    return this.mapRow({
      id,
      seed_id: seedId,
      base_content: baseContent,
      adaptations: JSON.stringify(adaptations ?? {}),
      platforms: JSON.stringify(platforms),
      media_urls: JSON.stringify(mediaUrls ?? []),
      scheduled_at: scheduledAt ?? null,
      status: 'draft',
      results: '{}',
      retry_count: 0,
      max_retries: 3,
      error: null,
      created_at: now,
      updated_at: now,
    });
  }

  async schedulePost(postId: string, scheduledAt: string): Promise<SocialPost> {
    await this.ensureTable();

    const post = await this.requirePost(postId);
    if (post.status !== 'draft') {
      throw new BadRequestException(`Cannot schedule post in "${post.status}" state. Must be "draft".`);
    }

    const now = new Date().toISOString();
    await this.db.run(
      `UPDATE wunderland_social_posts SET status = 'scheduled', scheduled_at = ?, updated_at = ? WHERE id = ?`,
      [scheduledAt, now, postId]
    );

    return { ...post, status: 'scheduled', scheduledAt, updatedAt: now };
  }

  async startPublishing(postId: string): Promise<SocialPost> {
    await this.ensureTable();

    const post = await this.requirePost(postId);
    if (post.status !== 'scheduled' && post.status !== 'retry') {
      throw new BadRequestException(
        `Cannot start publishing post in "${post.status}" state. Must be "scheduled" or "retry".`
      );
    }

    const now = new Date().toISOString();
    await this.db.run(
      `UPDATE wunderland_social_posts SET status = 'publishing', updated_at = ? WHERE id = ?`,
      [now, postId]
    );

    return { ...post, status: 'publishing', updatedAt: now };
  }

  async markPlatformResult(
    postId: string,
    platform: string,
    result: PlatformResult
  ): Promise<SocialPost> {
    await this.ensureTable();

    const post = await this.requirePost(postId);
    const results = { ...post.results, [platform]: result };
    const now = new Date().toISOString();

    await this.db.run(
      `UPDATE wunderland_social_posts SET results = ?, updated_at = ? WHERE id = ?`,
      [JSON.stringify(results), now, postId]
    );

    return { ...post, results, updatedAt: now };
  }

  async markPublished(postId: string): Promise<SocialPost> {
    await this.ensureTable();

    const post = await this.requirePost(postId);
    const now = new Date().toISOString();

    await this.db.run(
      `UPDATE wunderland_social_posts SET status = 'published', error = NULL, updated_at = ? WHERE id = ?`,
      [now, postId]
    );

    return { ...post, status: 'published', error: null, updatedAt: now };
  }

  async markError(postId: string, error: string): Promise<SocialPost> {
    await this.ensureTable();

    const post = await this.requirePost(postId);
    const now = new Date().toISOString();

    await this.db.run(
      `UPDATE wunderland_social_posts SET status = 'error', error = ?, updated_at = ? WHERE id = ?`,
      [error, now, postId]
    );

    return { ...post, status: 'error', error, updatedAt: now };
  }

  async retryPost(postId: string): Promise<SocialPost> {
    await this.ensureTable();

    const post = await this.requirePost(postId);
    if (post.status !== 'error') {
      throw new BadRequestException(`Cannot retry post in "${post.status}" state. Must be "error".`);
    }
    if (post.retryCount >= post.maxRetries) {
      throw new BadRequestException(
        `Post has exceeded maximum retries (${post.maxRetries}). Manual intervention required.`
      );
    }

    const now = new Date().toISOString();
    const newRetryCount = post.retryCount + 1;

    await this.db.run(
      `UPDATE wunderland_social_posts SET status = 'retry', retry_count = ?, error = NULL, updated_at = ? WHERE id = ?`,
      [newRetryCount, now, postId]
    );

    return { ...post, status: 'retry', retryCount: newRetryCount, error: null, updatedAt: now };
  }

  async getPost(postId: string): Promise<SocialPost> {
    await this.ensureTable();
    return this.requirePost(postId);
  }

  async listPosts(opts?: {
    seedId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ posts: SocialPost[]; total: number }> {
    await this.ensureTable();

    const conditions: string[] = [];
    const params: Array<string | number> = [];

    if (opts?.seedId) {
      conditions.push('seed_id = ?');
      params.push(opts.seedId);
    }
    if (opts?.status) {
      conditions.push('status = ?');
      params.push(opts.status);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = Math.min(opts?.limit ?? 20, 100);
    const offset = opts?.offset ?? 0;

    const countRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM wunderland_social_posts ${where}`,
      params
    );
    const total = countRow?.cnt ?? 0;

    const rows = await this.db.all<SocialPostRow>(
      `SELECT * FROM wunderland_social_posts ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return {
      posts: rows.map((row) => this.mapRow(row)),
      total,
    };
  }

  async getDuePosts(): Promise<SocialPost[]> {
    await this.ensureTable();

    const now = new Date().toISOString();
    const rows = await this.db.all<SocialPostRow>(
      `SELECT * FROM wunderland_social_posts
       WHERE status = 'scheduled' AND scheduled_at IS NOT NULL AND scheduled_at <= ?
       ORDER BY scheduled_at ASC`,
      [now]
    );

    return rows.map((row) => this.mapRow(row));
  }

  async deletePost(postId: string): Promise<void> {
    await this.ensureTable();

    const post = await this.requirePost(postId);
    if (post.status === 'publishing') {
      throw new BadRequestException('Cannot delete a post that is currently being published.');
    }

    await this.db.run(`DELETE FROM wunderland_social_posts WHERE id = ?`, [postId]);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private async requirePost(postId: string): Promise<SocialPost> {
    const row = await this.db.get<SocialPostRow>(
      `SELECT * FROM wunderland_social_posts WHERE id = ? LIMIT 1`,
      [postId]
    );
    if (!row) {
      throw new NotFoundException(`Social post "${postId}" not found.`);
    }
    return this.mapRow(row);
  }

  private mapRow(row: SocialPostRow): SocialPost {
    return {
      id: row.id,
      seedId: row.seed_id,
      baseContent: row.base_content,
      adaptations: this.parseJson(row.adaptations, {}),
      platforms: this.parseJson(row.platforms, []),
      mediaUrls: this.parseJson(row.media_urls, []),
      scheduledAt: row.scheduled_at ?? null,
      status: row.status,
      results: this.parseJson(row.results, {}),
      retryCount: row.retry_count ?? 0,
      maxRetries: row.max_retries ?? 3,
      error: row.error ?? null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private parseJson<T>(raw: unknown, fallback: T): T {
    if (typeof raw !== 'string') return fallback;
    if (!raw.trim()) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
}
