/**
 * @file moderation.service.ts
 * @description Content moderation service — flags, votes, emoji reactions,
 * and review queue backed by SQLite via StorageAdapter.
 */

import { Injectable } from '@nestjs/common';
import { getAppDatabase } from '../../../core/database/appDatabase.js';

@Injectable()
export class ModerationService {
  // ---------------------------------------------------------------------------
  // Content Flags
  // ---------------------------------------------------------------------------

  async flagContent(params: {
    entityType: string;
    entityId: string;
    authorSeedId: string;
    reason: string;
    severity: string;
  }) {
    const db = getAppDatabase();
    const flagId = `flag_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    await db.run(
      `INSERT INTO wunderland_content_flags
        (flag_id, entity_type, entity_id, author_seed_id, reason, severity, flagged_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        flagId,
        params.entityType,
        params.entityId,
        params.authorSeedId,
        params.reason,
        params.severity,
        Date.now(),
      ]
    );
    return { flagId };
  }

  async getFlags(entityType: string, entityId: string) {
    const db = getAppDatabase();
    return db.all(
      'SELECT * FROM wunderland_content_flags WHERE entity_type = ? AND entity_id = ? ORDER BY flagged_at DESC',
      [entityType, entityId]
    );
  }

  async getPendingFlags(limit = 50) {
    const db = getAppDatabase();
    return db.all(
      'SELECT * FROM wunderland_content_flags WHERE resolved = 0 ORDER BY flagged_at DESC LIMIT ?',
      [limit]
    );
  }

  async resolveFlag(flagId: string, resolvedBy: string) {
    const db = getAppDatabase();
    const result = await db.run(
      'UPDATE wunderland_content_flags SET resolved = 1, resolved_by = ?, resolved_at = ? WHERE flag_id = ? AND resolved = 0',
      [resolvedBy, Date.now(), flagId]
    );
    return { updated: (result as any)?.changes > 0 };
  }

  // ---------------------------------------------------------------------------
  // Content Votes
  // ---------------------------------------------------------------------------

  async vote(params: {
    entityType: string;
    entityId: string;
    voterSeedId: string;
    direction: number; // 1 or -1
  }) {
    const db = getAppDatabase();
    await db.run(
      `INSERT OR REPLACE INTO wunderland_content_votes
        (entity_type, entity_id, voter_seed_id, direction, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [params.entityType, params.entityId, params.voterSeedId, params.direction, Date.now()]
    );
    // Return updated totals
    const totals = await db.get<{ up: number; down: number }>(
      `SELECT
        COALESCE(SUM(CASE WHEN direction = 1 THEN 1 ELSE 0 END), 0) as up,
        COALESCE(SUM(CASE WHEN direction = -1 THEN 1 ELSE 0 END), 0) as down
       FROM wunderland_content_votes
       WHERE entity_type = ? AND entity_id = ?`,
      [params.entityType, params.entityId]
    );
    return {
      upvotes: totals?.up ?? 0,
      downvotes: totals?.down ?? 0,
      score: (totals?.up ?? 0) - (totals?.down ?? 0),
    };
  }

  async getVotes(entityType: string, entityId: string) {
    const db = getAppDatabase();
    const totals = await db.get<{ up: number; down: number; total: number }>(
      `SELECT
        COALESCE(SUM(CASE WHEN direction = 1 THEN 1 ELSE 0 END), 0) as up,
        COALESCE(SUM(CASE WHEN direction = -1 THEN 1 ELSE 0 END), 0) as down,
        COUNT(*) as total
       FROM wunderland_content_votes
       WHERE entity_type = ? AND entity_id = ?`,
      [entityType, entityId]
    );
    return {
      upvotes: totals?.up ?? 0,
      downvotes: totals?.down ?? 0,
      score: (totals?.up ?? 0) - (totals?.down ?? 0),
      totalVotes: totals?.total ?? 0,
    };
  }

  // ---------------------------------------------------------------------------
  // Emoji Reactions
  // ---------------------------------------------------------------------------

  async addReaction(params: {
    entityType: string;
    entityId: string;
    reactorSeedId: string;
    emoji: string;
  }) {
    const db = getAppDatabase();
    await db.run(
      `INSERT OR IGNORE INTO wunderland_emoji_reactions
        (entity_type, entity_id, reactor_seed_id, emoji, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [params.entityType, params.entityId, params.reactorSeedId, params.emoji, Date.now()]
    );
    return this.getReactions(params.entityType, params.entityId);
  }

  async removeReaction(params: {
    entityType: string;
    entityId: string;
    reactorSeedId: string;
    emoji: string;
  }) {
    const db = getAppDatabase();
    await db.run(
      'DELETE FROM wunderland_emoji_reactions WHERE entity_type = ? AND entity_id = ? AND reactor_seed_id = ? AND emoji = ?',
      [params.entityType, params.entityId, params.reactorSeedId, params.emoji]
    );
    return this.getReactions(params.entityType, params.entityId);
  }

  async getReactions(entityType: string, entityId: string) {
    const db = getAppDatabase();
    const rows = await db.all<{ emoji: string; count: number }>(
      `SELECT emoji, COUNT(*) as count
       FROM wunderland_emoji_reactions
       WHERE entity_type = ? AND entity_id = ?
       GROUP BY emoji
       ORDER BY count DESC`,
      [entityType, entityId]
    );
    return { reactions: rows };
  }
}
