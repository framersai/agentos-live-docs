import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';

export type RuntimeTaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export type RuntimeTaskType = 'llm_inference' | 'tool_execution' | 'workflow' | 'cron_run';

export interface RuntimeTask {
  id: string;
  seedId: string;
  taskType: RuntimeTaskType;
  status: RuntimeTaskStatus;
  title: string;
  description?: string | null;
  progress: number;
  resultSummary?: string | null;
  errorMessage?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
}

const toIso = (value: unknown): string | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return new Date(value).toISOString();
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const asNumber = Number(trimmed);
    if (Number.isFinite(asNumber)) return new Date(asNumber).toISOString();
    const normalized =
      trimmed.includes(' ') && !trimmed.includes('T') ? `${trimmed.replace(' ', 'T')}Z` : trimmed;
    const parsed = Date.parse(normalized);
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
  }
  return null;
};

@Injectable()
export class TasksService {
  constructor(private readonly db: DatabaseService) {}

  private async assertOwnedAgent(userId: string, seedId: string): Promise<void> {
    const row = await this.db.get<{ seed_id: string }>(
      `SELECT seed_id
         FROM wunderbots
        WHERE seed_id = ?
          AND owner_user_id = ?
          AND status != ?
        LIMIT 1`,
      [seedId, userId, 'archived']
    );
    if (!row) {
      throw new NotFoundException(`Agent "${seedId}" not found or not owned by current user.`);
    }
  }

  private mapTask(row: any): RuntimeTask {
    return {
      id: String(row.id),
      seedId: String(row.seed_id),
      taskType: String(row.task_type) as RuntimeTaskType,
      status: String(row.status) as RuntimeTaskStatus,
      title: String(row.title ?? ''),
      description: row.description ?? null,
      progress: Number(row.progress ?? 0),
      resultSummary: row.result_summary ?? null,
      errorMessage: row.error_message ?? null,
      startedAt: toIso(row.started_at),
      completedAt: toIso(row.completed_at),
      createdAt: toIso(row.created_at) ?? new Date().toISOString(),
    };
  }

  async listTasks(
    userId: string,
    seedId: string,
    opts: { status?: string; limit?: number }
  ): Promise<RuntimeTask[]> {
    await this.assertOwnedAgent(userId, seedId);

    const limit = Math.min(Math.max(1, Number(opts.limit ?? 50)), 200);
    const status = (opts.status ?? 'all').trim();

    const where: string[] = ['seed_id = ?'];
    const params: Array<string | number> = [seedId];

    if (status !== 'all') {
      where.push('status = ?');
      params.push(status);
    }

    const rows = await this.db.all(
      `SELECT *
         FROM agent_runtime_tasks
        WHERE ${where.join(' AND ')}
        ORDER BY created_at DESC
        LIMIT ?`,
      [...params, limit]
    );

    return rows.map((row) => this.mapTask(row));
  }

  async getTask(userId: string, seedId: string, taskId: string): Promise<RuntimeTask> {
    await this.assertOwnedAgent(userId, seedId);

    const row = await this.db.get(
      `SELECT *
         FROM agent_runtime_tasks
        WHERE id = ?
          AND seed_id = ?
        LIMIT 1`,
      [taskId, seedId]
    );
    if (!row) {
      throw new NotFoundException(`Task "${taskId}" not found.`);
    }
    return this.mapTask(row);
  }

  async createTask(
    userId: string,
    seedId: string,
    payload: { taskType: RuntimeTaskType; title: string; description?: string | null }
  ): Promise<RuntimeTask> {
    await this.assertOwnedAgent(userId, seedId);

    const existingRunning = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(1) as cnt
         FROM agent_runtime_tasks
        WHERE seed_id = ?
          AND status = ?`,
      [seedId, 'running']
    );

    if (Number(existingRunning?.cnt ?? 0) > 0) {
      throw new ConflictException(
        'Agent is already running a task. Cancel or wait for completion.'
      );
    }

    const now = Date.now();
    const id = this.db.generateId();

    await this.db.run(
      `INSERT INTO agent_runtime_tasks (
        id,
        seed_id,
        owner_user_id,
        task_type,
        status,
        title,
        description,
        progress,
        result_summary,
        error_message,
        started_at,
        completed_at,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        seedId,
        userId,
        payload.taskType,
        'queued',
        payload.title,
        payload.description ?? null,
        0,
        null,
        null,
        null,
        null,
        now,
      ]
    );

    return this.getTask(userId, seedId, id);
  }

  async cancelTask(userId: string, seedId: string, taskId: string): Promise<RuntimeTask> {
    await this.assertOwnedAgent(userId, seedId);

    const existing = await this.db.get<{ status?: unknown }>(
      `SELECT *
         FROM agent_runtime_tasks
        WHERE id = ?
          AND seed_id = ?
        LIMIT 1`,
      [taskId, seedId]
    );
    if (!existing) {
      throw new NotFoundException(`Task "${taskId}" not found.`);
    }

    const status = String(existing.status ?? '');
    if (status === 'queued' || status === 'running') {
      const now = Date.now();
      await this.db.run(
        `UPDATE agent_runtime_tasks
            SET status = ?,
                completed_at = ?
          WHERE id = ?
            AND seed_id = ?`,
        ['cancelled', now, taskId, seedId]
      );
    }

    return this.getTask(userId, seedId, taskId);
  }

  async overview(userId: string): Promise<RuntimeTask[]> {
    const rows = await this.db.all(
      `SELECT t.*
         FROM agent_runtime_tasks t
         JOIN wunderbots a
           ON a.seed_id = t.seed_id
        WHERE a.owner_user_id = ?
          AND a.status != ?
          AND t.status IN (?, ?)
        ORDER BY t.created_at DESC
        LIMIT 200`,
      [userId, 'archived', 'queued', 'running']
    );

    return rows.map((row) => this.mapTask(row));
  }
}
