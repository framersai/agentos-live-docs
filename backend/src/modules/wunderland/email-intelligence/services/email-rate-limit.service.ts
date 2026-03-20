/**
 * @file email-rate-limit.service.ts
 * @description Sliding-window (hourly) rate limiter backed by SQLite.
 *              Uses the wunderland_email_rate_limits table to track per-seed,
 *              per-endpoint request counts within the current clock-hour.
 */

import { Injectable, Inject } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service.js';

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs?: number;
}

@Injectable()
export class EmailRateLimitService {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  /**
   * Check whether the caller is within the per-hour limit for this endpoint.
   * If allowed, atomically increment the counter and return `{ allowed: true }`.
   * If not, return `{ allowed: false, retryAfterMs }`.
   */
  async checkAndIncrement(
    seedId: string,
    endpoint: string,
    maxPerHour: number
  ): Promise<RateLimitResult> {
    const windowStart = Math.floor(Date.now() / 3600000) * 3600000; // current hour

    const row = await this.db.get<{ count: number }>(
      `SELECT count FROM wunderland_email_rate_limits
       WHERE seed_id = ? AND endpoint = ? AND window_start = ?`,
      [seedId, endpoint, windowStart]
    );

    if (row && row.count >= maxPerHour) {
      const retryAfterMs = windowStart + 3600000 - Date.now();
      return { allowed: false, retryAfterMs };
    }

    // Upsert counter
    await this.db.run(
      `INSERT INTO wunderland_email_rate_limits (seed_id, endpoint, window_start, count)
       VALUES (?, ?, ?, 1)
       ON CONFLICT(seed_id, endpoint, window_start)
       DO UPDATE SET count = count + 1`,
      [seedId, endpoint, windowStart]
    );

    return { allowed: true };
  }

  /**
   * Remove expired rate-limit windows (older than 2 hours) to prevent
   * unbounded table growth. Call periodically from a cron or on-demand.
   */
  async cleanupExpired(): Promise<void> {
    const cutoff = Date.now() - 7200000; // 2 hours ago
    await this.db.run('DELETE FROM wunderland_email_rate_limits WHERE window_start < ?', [cutoff]);
  }
}
