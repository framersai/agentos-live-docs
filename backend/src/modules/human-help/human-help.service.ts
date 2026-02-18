/**
 * @file human-help.service.ts
 * @description Business logic for human help task queue, hour tracking,
 * and VA deductions. Persists to SQLite via appDatabase.
 */

import { Injectable } from '@nestjs/common';
import { getAppDatabase, generateId } from '../../core/database/appDatabase.js';

// ── Constants ────────────────────────────────────────────────────────────────

const TIER_HOURS: Record<string, number> = {
  free: 0,
  metered: 0,
  basic: 2,
  pro: 5,
  premium: 20,
};

const VALID_CATEGORIES = [
  'devops',
  'api-integration',
  'data-migration',
  'monitoring',
  'troubleshooting',
  'custom-workflows',
  'general',
] as const;

const VALID_PRIORITIES = ['normal', 'high', 'rush'] as const;

const VALID_STATUSES = [
  'pending',
  'approved',
  'assigned',
  'in_progress',
  'review',
  'completed',
  'rejected',
] as const;

const VALID_DEDUCTION_AMOUNTS = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];

export type HelpCategory = (typeof VALID_CATEGORIES)[number];
export type HelpPriority = (typeof VALID_PRIORITIES)[number];
export type HelpStatus = (typeof VALID_STATUSES)[number];

// ── Interfaces ───────────────────────────────────────────────────────────────

export interface HourQuota {
  id: string;
  userId: string;
  tier: string;
  allocated: number;
  used: number;
  remaining: number;
  periodStart: number;
  periodEnd: number;
}

export interface HourDeduction {
  amount: number;
  vaEmail: string;
  vaName?: string;
  reason: string;
  deductedAt: number;
}

export interface HumanHelpTask {
  id: string;
  userId: string;
  seedId?: string;
  projectName?: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  piiRedactionLevel: string;
  redactedDescription?: string;
  estimatedHours: number;
  actualHours?: number;
  assignedVaEmail?: string;
  assignedVaName?: string;
  hourDeductions: HourDeduction[];
  rating?: number;
  ratingComment?: string;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
}

export interface CreateTaskInput {
  userId: string;
  title: string;
  description: string;
  category?: string;
  priority?: string;
  seedId?: string;
  projectName?: string;
  estimatedHours?: number;
}

export interface DeductHoursInput {
  taskId: string;
  vaEmail: string;
  vaName?: string;
  amount: number;
  reason: string;
}

export interface VaStats {
  assignedTasks: number;
  completedTasks: number;
  hoursLoggedThisWeek: number;
  pendingTasks: number;
}

export interface AdminOverview {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  totalHoursConsumed: number;
  totalHoursAllocated: number;
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class HumanHelpService {
  // ── Quota Management ─────────────────────────────────────────────────────

  async getQuota(userId: string, tier?: string): Promise<HourQuota> {
    const db = getAppDatabase();
    const now = Date.now();

    const row = await db.get<any>(
      `SELECT * FROM user_hour_allocations
       WHERE user_id = ? AND period_end > ?
       ORDER BY period_end DESC LIMIT 1`,
      [userId, now]
    );

    if (row) {
      return {
        id: row.id,
        userId: row.user_id,
        tier: row.tier,
        allocated: row.hours_allocated,
        used: row.hours_used,
        remaining: Math.max(0, row.hours_allocated - row.hours_used),
        periodStart: row.period_start,
        periodEnd: row.period_end,
      };
    }

    // Auto-provision for current period
    return this.provisionQuota(userId, tier || 'free');
  }

  private async provisionQuota(userId: string, tier: string): Promise<HourQuota> {
    const db = getAppDatabase();
    const now = Date.now();

    // Look up user's subscription_renews_at for period alignment
    const userRow = await db.get<any>(
      'SELECT subscription_renews_at, subscription_tier FROM app_users WHERE id = ?',
      [userId]
    );

    let periodStart: number;
    let periodEnd: number;
    const effectiveTier = userRow?.subscription_tier || tier;

    if (userRow?.subscription_renews_at) {
      const renewsAt = Number(userRow.subscription_renews_at);
      const msPerMonth = 30 * 24 * 60 * 60 * 1000;
      const monthsSinceRenewal = Math.floor((now - renewsAt) / msPerMonth);
      periodStart = renewsAt + monthsSinceRenewal * msPerMonth;
      periodEnd = periodStart + msPerMonth;
    } else {
      const date = new Date(now);
      periodStart = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      periodEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime();
    }

    const hours = TIER_HOURS[effectiveTier] ?? 0;
    const id = generateId();

    await db.run(
      `INSERT INTO user_hour_allocations (id, user_id, tier, hours_allocated, hours_used, period_start, period_end, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)`,
      [id, userId, effectiveTier, hours, periodStart, periodEnd, now, now]
    );

    return {
      id,
      userId,
      tier: effectiveTier,
      allocated: hours,
      used: 0,
      remaining: hours,
      periodStart,
      periodEnd,
    };
  }

  // ── Task CRUD ────────────────────────────────────────────────────────────

  async createTask(input: CreateTaskInput): Promise<HumanHelpTask> {
    const db = getAppDatabase();
    const now = Date.now();
    const id = generateId();

    const category = VALID_CATEGORIES.includes(input.category as any) ? input.category : 'general';
    const priority = VALID_PRIORITIES.includes(input.priority as any) ? input.priority : 'normal';
    const estimatedHours = Math.min(3, Math.max(0.5, input.estimatedHours ?? 1));

    await db.run(
      `INSERT INTO human_help_tasks
       (id, user_id, seed_id, project_name, title, description, category, priority, status, estimated_hours, hour_deductions, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, '[]', ?, ?)`,
      [
        id,
        input.userId,
        input.seedId || null,
        input.projectName || null,
        input.title,
        input.description,
        category,
        priority,
        estimatedHours,
        now,
        now,
      ]
    );

    return this.getTask(id);
  }

  async getTask(taskId: string): Promise<HumanHelpTask> {
    const db = getAppDatabase();
    const row = await db.get<any>('SELECT * FROM human_help_tasks WHERE id = ?', [taskId]);

    if (!row) {
      throw new Error('Task not found');
    }

    return this.rowToTask(row);
  }

  async listUserTasks(
    userId: string,
    opts?: { status?: string; limit?: number; offset?: number }
  ): Promise<HumanHelpTask[]> {
    const db = getAppDatabase();
    let sql = 'SELECT * FROM human_help_tasks WHERE user_id = ?';
    const params: any[] = [userId];

    if (opts?.status && VALID_STATUSES.includes(opts.status as any)) {
      sql += ' AND status = ?';
      params.push(opts.status);
    }

    sql += ' ORDER BY created_at DESC';

    if (opts?.limit) {
      sql += ' LIMIT ?';
      params.push(opts.limit);
    }
    if (opts?.offset) {
      sql += ' OFFSET ?';
      params.push(opts.offset);
    }

    const rows = await db.all<any>(sql, params);
    return rows.map((r: any) => this.rowToTask(r));
  }

  // ── VA Operations ────────────────────────────────────────────────────────

  async listVaTasks(vaEmail?: string, opts?: { status?: string }): Promise<HumanHelpTask[]> {
    const db = getAppDatabase();

    let sql: string;
    const params: any[] = [];

    if (opts?.status && VALID_STATUSES.includes(opts.status as any)) {
      sql = 'SELECT * FROM human_help_tasks WHERE status = ?';
      params.push(opts.status);
      if (vaEmail) {
        sql += ' OR assigned_va_email = ?';
        params.push(vaEmail);
      }
    } else {
      // Show unassigned tasks + tasks assigned to this VA
      sql = `SELECT * FROM human_help_tasks
             WHERE (assigned_va_email IS NULL AND status IN ('pending', 'approved'))`;
      if (vaEmail) {
        sql += ' OR assigned_va_email = ?';
        params.push(vaEmail);
      }
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await db.all<any>(sql, params);
    return rows.map((r: any) => this.rowToTask(r));
  }

  async claimTask(taskId: string, vaEmail: string, vaName?: string): Promise<HumanHelpTask> {
    const db = getAppDatabase();
    const now = Date.now();

    const task = await this.getTask(taskId);
    if (task.assignedVaEmail) {
      throw new Error('Task is already assigned');
    }

    await db.run(
      `UPDATE human_help_tasks
       SET assigned_va_email = ?, assigned_va_name = ?, status = 'assigned', updated_at = ?
       WHERE id = ?`,
      [vaEmail, vaName || vaEmail, now, taskId]
    );

    return this.getTask(taskId);
  }

  async deductHours(input: DeductHoursInput): Promise<{ task: HumanHelpTask; quota: HourQuota }> {
    const db = getAppDatabase();
    const now = Date.now();

    // Validate amount (30-minute increments, 0.5–3.0)
    if (!VALID_DEDUCTION_AMOUNTS.includes(input.amount)) {
      throw new Error('Amount must be 0.5, 1.0, 1.5, 2.0, 2.5, or 3.0 hours');
    }

    if (!input.reason || input.reason.trim().length === 0) {
      throw new Error('Reason is required');
    }

    // Get the task and its owner
    const task = await this.getTask(input.taskId);

    // Check user's quota
    const quota = await this.getQuota(task.userId);
    if (quota.used + input.amount > quota.allocated) {
      throw new Error(
        `Insufficient hours. User has ${quota.remaining.toFixed(1)} hrs remaining, attempted to deduct ${input.amount} hrs.`
      );
    }

    // Create deduction entry
    const deduction: HourDeduction = {
      amount: input.amount,
      vaEmail: input.vaEmail,
      vaName: input.vaName,
      reason: input.reason.trim(),
      deductedAt: now,
    };

    // Append to task's deduction history
    const deductions = [...task.hourDeductions, deduction];
    const totalActualHours = deductions.reduce((sum, d) => sum + d.amount, 0);

    await db.run(
      `UPDATE human_help_tasks
       SET hour_deductions = ?, actual_hours = ?, updated_at = ?
       WHERE id = ?`,
      [JSON.stringify(deductions), totalActualHours, now, input.taskId]
    );

    // Update user's quota
    await db.run(
      `UPDATE user_hour_allocations
       SET hours_used = hours_used + ?, updated_at = ?
       WHERE id = ?`,
      [input.amount, now, quota.id]
    );

    const updatedTask = await this.getTask(input.taskId);
    const updatedQuota = await this.getQuota(task.userId);

    return { task: updatedTask, quota: updatedQuota };
  }

  async updateTaskStatus(taskId: string, status: string): Promise<HumanHelpTask> {
    if (!VALID_STATUSES.includes(status as any)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const db = getAppDatabase();
    const now = Date.now();

    const updates: string[] = ['status = ?', 'updated_at = ?'];
    const params: any[] = [status, now];

    if (status === 'in_progress') {
      updates.push('started_at = COALESCE(started_at, ?)');
      params.push(now);
    }
    if (status === 'completed') {
      updates.push('completed_at = ?');
      params.push(now);
    }

    params.push(taskId);
    await db.run(`UPDATE human_help_tasks SET ${updates.join(', ')} WHERE id = ?`, params);

    return this.getTask(taskId);
  }

  async assignTask(taskId: string, vaEmail: string, vaName?: string): Promise<HumanHelpTask> {
    const db = getAppDatabase();
    const now = Date.now();

    await db.run(
      `UPDATE human_help_tasks
       SET assigned_va_email = ?, assigned_va_name = ?, status = 'assigned', updated_at = ?
       WHERE id = ?`,
      [vaEmail, vaName || vaEmail, now, taskId]
    );

    return this.getTask(taskId);
  }

  async getVaStats(vaEmail: string): Promise<VaStats> {
    const db = getAppDatabase();

    const assigned = await db.get<any>(
      `SELECT COUNT(*) as count FROM human_help_tasks
       WHERE assigned_va_email = ? AND status NOT IN ('completed', 'rejected')`,
      [vaEmail]
    );

    const completed = await db.get<any>(
      `SELECT COUNT(*) as count FROM human_help_tasks
       WHERE assigned_va_email = ? AND status = 'completed'`,
      [vaEmail]
    );

    const pending = await db.get<any>(
      `SELECT COUNT(*) as count FROM human_help_tasks
       WHERE assigned_va_email IS NULL AND status IN ('pending', 'approved')`,
      []
    );

    // Hours logged this week
    const weekStart = getWeekStart();
    const allTasks = await db.all<any>(
      'SELECT hour_deductions FROM human_help_tasks WHERE assigned_va_email = ?',
      [vaEmail]
    );

    let hoursThisWeek = 0;
    for (const row of allTasks) {
      const deductions: HourDeduction[] = safeParseJson(row.hour_deductions, []);
      for (const d of deductions) {
        if (d.vaEmail === vaEmail && d.deductedAt >= weekStart) {
          hoursThisWeek += d.amount;
        }
      }
    }

    return {
      assignedTasks: assigned?.count || 0,
      completedTasks: completed?.count || 0,
      hoursLoggedThisWeek: hoursThisWeek,
      pendingTasks: pending?.count || 0,
    };
  }

  async getAdminOverview(): Promise<AdminOverview> {
    const db = getAppDatabase();
    const now = Date.now();

    const tasks = await db.all<any>(
      'SELECT status, COUNT(*) as count FROM human_help_tasks GROUP BY status',
      []
    );

    const statusCounts: Record<string, number> = {};
    let totalTasks = 0;
    for (const row of tasks) {
      statusCounts[row.status] = row.count;
      totalTasks += row.count;
    }

    const quotaRow = await db.get<any>(
      `SELECT SUM(hours_used) as total_used, SUM(hours_allocated) as total_allocated
       FROM user_hour_allocations WHERE period_end > ?`,
      [now]
    );

    return {
      totalTasks,
      pendingTasks: (statusCounts['pending'] || 0) + (statusCounts['approved'] || 0),
      inProgressTasks: (statusCounts['assigned'] || 0) + (statusCounts['in_progress'] || 0),
      completedTasks: statusCounts['completed'] || 0,
      totalHoursConsumed: quotaRow?.total_used || 0,
      totalHoursAllocated: quotaRow?.total_allocated || 0,
    };
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private rowToTask(row: any): HumanHelpTask {
    return {
      id: row.id,
      userId: row.user_id,
      seedId: row.seed_id || undefined,
      projectName: row.project_name || undefined,
      title: row.title,
      description: row.description,
      category: row.category,
      priority: row.priority,
      status: row.status,
      piiRedactionLevel: row.pii_redaction_level || 'partial',
      redactedDescription: row.redacted_description || undefined,
      estimatedHours: row.estimated_hours || 1,
      actualHours: row.actual_hours || undefined,
      assignedVaEmail: row.assigned_va_email || undefined,
      assignedVaName: row.assigned_va_name || undefined,
      hourDeductions: safeParseJson(row.hour_deductions, []),
      rating: row.rating || undefined,
      ratingComment: row.rating_comment || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      startedAt: row.started_at || undefined,
      completedAt: row.completed_at || undefined,
    };
  }
}

// ── Utilities ────────────────────────────────────────────────────────────────

function safeParseJson<T>(value: any, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getWeekStart(): number {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.getFullYear(), now.getMonth(), diff, 0, 0, 0, 0).getTime();
}
