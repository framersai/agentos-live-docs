/**
 * @file mood-persistence.service.ts
 * @description Persistence adapter bridging IMoodPersistenceAdapter to DatabaseService.
 */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import type { IMoodPersistenceAdapter, PADState, MoodLabel, MoodDelta } from 'wunderland';

@Injectable()
export class MoodPersistenceService implements IMoodPersistenceAdapter {
  constructor(private readonly db: DatabaseService) {}

  async loadMoodSnapshot(
    seedId: string
  ): Promise<{ valence: number; arousal: number; dominance: number; moodLabel: string } | null> {
    const row = await this.db.get<{
      seed_id: string;
      valence: number;
      arousal: number;
      dominance: number;
      mood_label: string;
      updated_at: number;
    }>(
      `SELECT seed_id, valence, arousal, dominance, mood_label, updated_at
         FROM wunderland_agent_moods
        WHERE seed_id = ?`,
      [seedId]
    );

    if (!row) return null;

    return {
      valence: Number(row.valence),
      arousal: Number(row.arousal),
      dominance: Number(row.dominance),
      moodLabel: String(row.mood_label),
    };
  }

  async saveMoodSnapshot(seedId: string, state: PADState, label: MoodLabel): Promise<void> {
    const now = Date.now();
    await this.db.run(
      `INSERT OR REPLACE INTO wunderland_agent_moods
        (seed_id, valence, arousal, dominance, mood_label, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [seedId, state.valence, state.arousal, state.dominance, label, now]
    );
  }

  async appendMoodDelta(
    seedId: string,
    delta: MoodDelta,
    resultState: PADState,
    label: MoodLabel
  ): Promise<void> {
    const now = Date.now();
    await this.db.run(
      `INSERT INTO wunderland_agent_mood_history
        (id, seed_id, source, delta_valence, delta_arousal, delta_dominance, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        this.db.generateId(),
        seedId,
        delta.trigger,
        delta.valence,
        delta.arousal,
        delta.dominance,
        now,
      ]
    );
  }

  async loadRecentDeltas(seedId: string, limit: number): Promise<MoodDelta[]> {
    const rows = await this.db.all<{
      source: string;
      delta_valence: number;
      delta_arousal: number;
      delta_dominance: number;
    }>(
      `SELECT source, delta_valence, delta_arousal, delta_dominance
         FROM wunderland_agent_mood_history
        WHERE seed_id = ?
        ORDER BY timestamp DESC
        LIMIT ?`,
      [seedId, limit]
    );

    return rows.map((row) => ({
      valence: Number(row.delta_valence),
      arousal: Number(row.delta_arousal),
      dominance: Number(row.delta_dominance),
      trigger: String(row.source),
    }));
  }
}
