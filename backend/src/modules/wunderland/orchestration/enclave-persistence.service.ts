/**
 * @file enclave-persistence.service.ts
 * @description Persistence adapter bridging IEnclavePersistenceAdapter to DatabaseService.
 */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import type { IEnclavePersistenceAdapter, EnclaveConfig } from 'wunderland';

@Injectable()
export class EnclavePersistenceService implements IEnclavePersistenceAdapter {
  constructor(private readonly db: DatabaseService) {}

  async loadAllEnclaves(): Promise<EnclaveConfig[]> {
    const rows = await this.db.all<{
      name: string;
      display_name: string;
      description: string;
      tags: string;
      creator_seed_id: string;
      min_level: string;
      rules: string;
      created_at: number;
    }>(
      `SELECT name, display_name, description, tags, creator_seed_id, min_level, rules, created_at
         FROM wunderland_subreddits`
    );

    return rows.map((row) => ({
      name: String(row.name),
      displayName: String(row.display_name),
      description: String(row.description),
      tags: JSON.parse(String(row.tags || '[]')) as string[],
      creatorSeedId: String(row.creator_seed_id),
      minLevelToPost: row.min_level ? String(row.min_level) : undefined,
      rules: JSON.parse(String(row.rules || '[]')) as string[],
    }));
  }

  async loadMemberships(): Promise<Map<string, string[]>> {
    const rows = await this.db.all<{
      seed_id: string;
      subreddit_name: string;
    }>(`SELECT seed_id, subreddit_name FROM wunderland_subreddit_members`);

    const map = new Map<string, string[]>();
    for (const row of rows) {
      const enclaveName = String(row.subreddit_name);
      const seedId = String(row.seed_id);
      const existing = map.get(enclaveName);
      if (existing) {
        existing.push(seedId);
      } else {
        map.set(enclaveName, [seedId]);
      }
    }

    return map;
  }

  async saveEnclave(config: EnclaveConfig): Promise<void> {
    const now = Date.now();
    await this.db.run(
      `INSERT OR REPLACE INTO wunderland_subreddits
        (name, display_name, description, tags, creator_seed_id, min_level, rules, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        config.name,
        config.displayName,
        config.description,
        JSON.stringify(config.tags),
        config.creatorSeedId,
        config.minLevelToPost ?? null,
        JSON.stringify(config.rules),
        now,
      ]
    );
  }

  async saveMembership(seedId: string, enclaveName: string): Promise<void> {
    const now = Date.now();
    await this.db.run(
      `INSERT OR IGNORE INTO wunderland_subreddit_members
        (seed_id, subreddit_name, joined_at)
       VALUES (?, ?, ?)`,
      [seedId, enclaveName, now]
    );
  }

  async removeMembership(seedId: string, enclaveName: string): Promise<void> {
    await this.db.run(
      `DELETE FROM wunderland_subreddit_members WHERE seed_id = ? AND subreddit_name = ?`,
      [seedId, enclaveName]
    );
  }
}
