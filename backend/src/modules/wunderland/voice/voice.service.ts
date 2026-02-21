/**
 * @file voice.service.ts
 * @description Business logic for voice call management — CRUD operations,
 * provider resolution, and call record persistence.
 */

import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service.js';
import type { InitiateCallDto, ListCallsQueryDto } from '../dto/voice.dto.js';

// ── Domain Types ────────────────────────────────────────────────────────────

export interface VoiceCallRecord {
  callId: string;
  seedId: string;
  provider: string;
  providerCallId: string | null;
  direction: string;
  fromNumber: string | null;
  toNumber: string;
  state: string;
  mode: string;
  startedAt: string;
  endedAt: string | null;
  durationMs: number | null;
  transcript: Array<{ role: string; text: string; timestamp: number }>;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface VoiceCallStats {
  totalCalls: number;
  activeCalls: number;
  totalDurationMs: number;
  avgDurationMs: number;
  completedCalls: number;
  failedCalls: number;
  providerBreakdown: Record<string, number>;
}

// ── Terminal states ─────────────────────────────────────────────────────────

const TERMINAL_STATES = new Set([
  'completed',
  'hangup-user',
  'hangup-bot',
  'timeout',
  'error',
  'failed',
  'no-answer',
  'busy',
  'voicemail',
]);

const ACTIVE_STATES = new Set([
  'initiated',
  'ringing',
  'answered',
  'active',
  'speaking',
  'listening',
]);

// ── Service ─────────────────────────────────────────────────────────────────

@Injectable()
export class VoiceService {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  // ── Call CRUD ──

  async initiateCall(userId: string, dto: InitiateCallDto): Promise<{ call: VoiceCallRecord }> {
    const seedId = dto.seedId.trim();
    await this.requireOwnedAgent(userId, seedId);

    const callId = this.db.generateId();
    const now = Date.now();

    await this.db.run(
      `INSERT INTO wunderland_voice_calls
        (call_id, seed_id, owner_user_id, provider, provider_call_id, direction,
         from_number, to_number, state, mode, start_time, end_time,
         transcript_json, metadata, created_at, updated_at)
       VALUES (?, ?, ?, ?, NULL, 'outbound', ?, ?, 'initiated', ?, NULL, NULL, '[]', '{}', ?, ?)`,
      [
        callId,
        seedId,
        userId,
        dto.provider ?? 'twilio',
        dto.fromNumber ?? '',
        dto.toNumber.trim(),
        dto.mode ?? 'notify',
        now,
        now,
      ]
    );

    const row = await this.db.get<any>('SELECT * FROM wunderland_voice_calls WHERE call_id = ?', [
      callId,
    ]);

    return { call: this.mapCall(row!) };
  }

  async getCall(userId: string, callId: string): Promise<{ call: VoiceCallRecord }> {
    const row = await this.db.get<any>(
      'SELECT * FROM wunderland_voice_calls WHERE call_id = ? AND owner_user_id = ?',
      [callId, userId]
    );
    if (!row) {
      throw new NotFoundException(`Call "${callId}" not found.`);
    }
    return { call: this.mapCall(row) };
  }

  async listCalls(
    userId: string,
    query: ListCallsQueryDto = {}
  ): Promise<{ items: VoiceCallRecord[] }> {
    const where: string[] = ['owner_user_id = ?'];
    const params: Array<string | number> = [userId];

    if (query.seedId) {
      where.push('seed_id = ?');
      params.push(query.seedId.trim());
    }
    if (query.provider) {
      where.push('provider = ?');
      params.push(query.provider);
    }
    if (query.direction) {
      where.push('direction = ?');
      params.push(query.direction);
    }
    if (query.status === 'active') {
      where.push(`state IN (${[...ACTIVE_STATES].map(() => '?').join(',')})`);
      params.push(...ACTIVE_STATES);
    } else if (query.status === 'completed') {
      where.push("state = 'completed'");
    } else if (query.status === 'failed') {
      where.push(`state IN ('failed', 'error', 'no-answer', 'busy')`);
    }

    const limit = query.limit ?? 50;
    const rows = await this.db.all<any>(
      `SELECT * FROM wunderland_voice_calls
       WHERE ${where.join(' AND ')}
       ORDER BY created_at DESC
       LIMIT ?`,
      [...params, limit]
    );

    return { items: rows.map((r) => this.mapCall(r)) };
  }

  async updateCallState(
    callId: string,
    state: string,
    providerCallId?: string,
    transcriptEntry?: { role: string; text: string; timestamp: number }
  ): Promise<void> {
    const now = Date.now();
    const updates: string[] = ['state = ?', 'updated_at = ?'];
    const params: Array<string | number | null> = [state, now];

    if (providerCallId) {
      updates.push('provider_call_id = ?');
      params.push(providerCallId);
    }

    if (TERMINAL_STATES.has(state)) {
      updates.push('end_time = COALESCE(end_time, ?)');
      params.push(now);
    }

    if (state === 'answered' || state === 'active') {
      updates.push('start_time = COALESCE(start_time, ?)');
      params.push(now);
    }

    params.push(callId);

    await this.db.run(
      `UPDATE wunderland_voice_calls SET ${updates.join(', ')} WHERE call_id = ?`,
      params
    );

    if (transcriptEntry) {
      await this.appendTranscriptEntry(callId, transcriptEntry);
    }
  }

  async appendTranscriptEntry(
    callId: string,
    entry: { role: string; text: string; timestamp: number }
  ): Promise<void> {
    const row = await this.db.get<{ transcript_json: string }>(
      'SELECT transcript_json FROM wunderland_voice_calls WHERE call_id = ?',
      [callId]
    );
    if (!row) return;

    let transcript: Array<{ role: string; text: string; timestamp: number }> = [];
    try {
      transcript = JSON.parse(row.transcript_json || '[]');
    } catch {
      /* ignore */
    }

    transcript.push(entry);

    await this.db.run(
      'UPDATE wunderland_voice_calls SET transcript_json = ?, updated_at = ? WHERE call_id = ?',
      [JSON.stringify(transcript), Date.now(), callId]
    );
  }

  async hangupCall(userId: string, callId: string): Promise<{ call: VoiceCallRecord }> {
    const row = await this.db.get<any>(
      'SELECT * FROM wunderland_voice_calls WHERE call_id = ? AND owner_user_id = ?',
      [callId, userId]
    );
    if (!row) {
      throw new NotFoundException(`Call "${callId}" not found.`);
    }

    if (TERMINAL_STATES.has(row.state)) {
      throw new BadRequestException(
        `Call "${callId}" is already in terminal state "${row.state}".`
      );
    }

    await this.updateCallState(callId, 'hangup-bot');

    const updated = await this.db.get<any>(
      'SELECT * FROM wunderland_voice_calls WHERE call_id = ?',
      [callId]
    );
    return { call: this.mapCall(updated!) };
  }

  // ── Stats ──

  async getCallStats(userId: string, seedId?: string): Promise<VoiceCallStats> {
    const where: string[] = ['owner_user_id = ?'];
    const params: Array<string> = [userId];

    if (seedId) {
      where.push('seed_id = ?');
      params.push(seedId);
    }

    const whereClause = where.join(' AND ');

    const totalRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM wunderland_voice_calls WHERE ${whereClause}`,
      params
    );
    const activeRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM wunderland_voice_calls WHERE ${whereClause} AND state IN (${[...ACTIVE_STATES].map(() => '?').join(',')})`,
      [...params, ...ACTIVE_STATES]
    );
    const completedRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM wunderland_voice_calls WHERE ${whereClause} AND state = 'completed'`,
      params
    );
    const failedRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM wunderland_voice_calls WHERE ${whereClause} AND state IN ('failed', 'error', 'no-answer', 'busy')`,
      params
    );

    const providerRows = await this.db.all<{ provider: string; cnt: number }>(
      `SELECT provider, COUNT(*) as cnt FROM wunderland_voice_calls WHERE ${whereClause} GROUP BY provider`,
      params
    );

    const durationRow = await this.db.get<{
      total: number | string | null;
      cnt: number | string | null;
    }>(
      `SELECT
         SUM(CASE
               WHEN start_time IS NOT NULL AND end_time IS NOT NULL AND end_time >= start_time
               THEN (end_time - start_time)
               ELSE 0
             END) AS total,
         SUM(CASE
               WHEN start_time IS NOT NULL AND end_time IS NOT NULL AND end_time >= start_time
               THEN 1
               ELSE 0
             END) AS cnt
       FROM wunderland_voice_calls
       WHERE ${whereClause}`,
      params
    );

    const totalDurationMs =
      typeof durationRow?.total === 'number'
        ? durationRow.total
        : typeof durationRow?.total === 'string' && durationRow.total.trim()
          ? Number(durationRow.total)
          : 0;
    const durationCount =
      typeof durationRow?.cnt === 'number'
        ? durationRow.cnt
        : typeof durationRow?.cnt === 'string' && durationRow.cnt.trim()
          ? Number(durationRow.cnt)
          : 0;
    const avgDurationMs =
      Number.isFinite(totalDurationMs) && Number.isFinite(durationCount) && durationCount > 0
        ? Math.round(totalDurationMs / durationCount)
        : 0;

    return {
      totalCalls: totalRow?.cnt ?? 0,
      activeCalls: activeRow?.cnt ?? 0,
      totalDurationMs: Number.isFinite(totalDurationMs) ? totalDurationMs : 0,
      avgDurationMs,
      completedCalls: completedRow?.cnt ?? 0,
      failedCalls: failedRow?.cnt ?? 0,
      providerBreakdown: Object.fromEntries(providerRows.map((r) => [r.provider, r.cnt])),
    };
  }

  // ── Private Helpers ──

  private async requireOwnedAgent(userId: string, seedId: string): Promise<void> {
    const agent = await this.db.get<{ seed_id: string }>(
      `SELECT seed_id FROM wunderbots WHERE seed_id = ? AND owner_user_id = ? AND status != 'archived'`,
      [seedId, userId]
    );
    if (!agent) {
      throw new NotFoundException(`Agent "${seedId}" not found or not owned by current user.`);
    }
  }

  private mapCall(row: any): VoiceCallRecord {
    let metadata: Record<string, unknown> = {};
    try {
      metadata = JSON.parse(String(row.metadata || '{}'));
    } catch {
      /* ignore */
    }

    let transcript: Array<{ role: string; text: string; timestamp: number }> = [];
    try {
      const parsed = JSON.parse(String(row.transcript_json || '[]'));
      transcript = Array.isArray(parsed) ? (parsed as any) : [];
    } catch {
      transcript = [];
    }

    const createdAtMs = row.created_at ? Number(row.created_at) : Date.now();
    const updatedAtMs = row.updated_at ? Number(row.updated_at) : createdAtMs;
    const startMs = row.start_time ? Number(row.start_time) : null;
    const endMs = row.end_time ? Number(row.end_time) : null;
    const state = String(row.state);

    const startedAtMs = Number.isFinite(startMs as any) && startMs !== null ? startMs : createdAtMs;
    const startedAt = new Date(startedAtMs).toISOString();
    const endedAt = endMs && Number.isFinite(endMs) ? new Date(endMs).toISOString() : null;

    const durationMs =
      startMs && Number.isFinite(startMs)
        ? endMs && Number.isFinite(endMs)
          ? Math.max(0, endMs - startMs)
          : ACTIVE_STATES.has(state)
            ? Math.max(0, Date.now() - startMs)
            : null
        : null;

    if (metadata.direction === undefined && row.direction) {
      metadata = { ...metadata, direction: String(row.direction) };
    }

    return {
      callId: String(row.call_id),
      seedId: String(row.seed_id),
      provider: String(row.provider),
      providerCallId: row.provider_call_id ? String(row.provider_call_id) : null,
      direction: String(row.direction),
      fromNumber: row.from_number ? String(row.from_number) : null,
      toNumber: String(row.to_number || ''),
      state,
      mode: String(row.mode || 'notify'),
      startedAt,
      endedAt,
      durationMs,
      transcript,
      metadata,
      createdAt: new Date(createdAtMs).toISOString(),
      updatedAt: new Date(updatedAtMs).toISOString(),
    };
  }
}
