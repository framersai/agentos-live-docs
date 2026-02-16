import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';

export type MetricType = 'llm' | 'tools' | 'channels' | 'behavior';
export type MetricRange = '24h' | '7d' | '30d';

const rangeToSinceMs = (range: MetricRange): number => {
  const now = Date.now();
  switch (range) {
    case '24h':
      return now - 24 * 60 * 60 * 1000;
    case '7d':
      return now - 7 * 24 * 60 * 60 * 1000;
    case '30d':
      return now - 30 * 24 * 60 * 60 * 1000;
  }
};

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
export class MetricsService {
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

  async getSummary(userId: string, seedId: string) {
    await this.assertOwnedAgent(userId, seedId);

    const now = Date.now();
    const since = now - 7 * 24 * 60 * 60 * 1000;

    const llmAgg = await this.db.get<{
      input_tokens: number;
      output_tokens: number;
      cost_usd: number;
      avg_latency_ms: number;
      request_count: number;
    }>(
      `SELECT
          COALESCE(SUM(input_tokens), 0) as input_tokens,
          COALESCE(SUM(output_tokens), 0) as output_tokens,
          COALESCE(SUM(estimated_cost_usd), 0) as cost_usd,
          COALESCE(AVG(latency_ms), 0) as avg_latency_ms,
          COUNT(1) as request_count
        FROM agent_llm_usage
       WHERE seed_id = ?
         AND created_at >= ?`,
      [seedId, since]
    );

    const toolAgg = await this.db.get<{
      total: number;
      success: number;
      avg_duration_ms: number;
    }>(
      `SELECT
          COUNT(1) as total,
          SUM(CASE WHEN status IN ('success','completed') THEN 1 ELSE 0 END) as success,
          COALESCE(AVG(duration_ms), 0) as avg_duration_ms
        FROM agent_tool_executions
       WHERE seed_id = ?
         AND created_at >= ?`,
      [seedId, since]
    );

    const channelAgg = await this.db.get<{
      total: number;
      avg_response_ms: number;
    }>(
      `SELECT
          COUNT(1) as total,
          COALESCE(AVG(response_time_ms), 0) as avg_response_ms
        FROM agent_channel_activity
       WHERE seed_id = ?
         AND created_at >= ?`,
      [seedId, since]
    );

    const activeChannelsRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(1) as cnt
         FROM wunderland_channel_bindings
        WHERE seed_id = ?
          AND is_active = 1`,
      [seedId]
    );

    const moodEventsRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(1) as cnt
         FROM agent_behavior_events
        WHERE seed_id = ?
          AND created_at >= ?
          AND event_type = ?`,
      [seedId, since, 'mood']
    );

    const safetyBlocksRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(1) as cnt
         FROM agent_behavior_events
        WHERE seed_id = ?
          AND created_at >= ?
          AND event_type = ?`,
      [seedId, since, 'safety_block']
    );

    const trustScoreRow = await this.db.get<{ global_reputation: number }>(
      `SELECT global_reputation
         FROM wunderland_reputations
        WHERE seed_id = ?
        LIMIT 1`,
      [seedId]
    );

    const tasksAgg = await this.db.get<{
      total: number;
      running: number;
      completed: number;
      failed: number;
    }>(
      `SELECT
          COUNT(1) as total,
          SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as running,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
        FROM agent_runtime_tasks
       WHERE seed_id = ?`,
      [seedId]
    );

    return {
      seedId,
      llm: {
        totalTokens: Number(llmAgg?.input_tokens ?? 0) + Number(llmAgg?.output_tokens ?? 0),
        totalCostUsd: Number(llmAgg?.cost_usd ?? 0),
        avgLatencyMs: Number(llmAgg?.avg_latency_ms ?? 0),
        requestCount: Number(llmAgg?.request_count ?? 0),
      },
      tools: {
        totalExecutions: Number(toolAgg?.total ?? 0),
        successRate:
          Number(toolAgg?.total ?? 0) > 0
            ? Number(toolAgg?.success ?? 0) / Number(toolAgg?.total ?? 1)
            : 0,
        avgDurationMs: Number(toolAgg?.avg_duration_ms ?? 0),
      },
      channels: {
        totalMessages: Number(channelAgg?.total ?? 0),
        avgResponseTimeMs: Number(channelAgg?.avg_response_ms ?? 0),
        activeChannels: Number(activeChannelsRow?.cnt ?? 0),
      },
      behavior: {
        moodEvents: Number(moodEventsRow?.cnt ?? 0),
        safetyBlocks: Number(safetyBlocksRow?.cnt ?? 0),
        trustScore: Number(trustScoreRow?.global_reputation ?? 0),
      },
      tasks: {
        total: Number(tasksAgg?.total ?? 0),
        running: Number(tasksAgg?.running ?? 0),
        completed: Number(tasksAgg?.completed ?? 0),
        failed: Number(tasksAgg?.failed ?? 0),
      },
    };
  }

  async getMetrics(userId: string, seedId: string, type: MetricType, range: MetricRange) {
    await this.assertOwnedAgent(userId, seedId);

    const since = rangeToSinceMs(range);

    const response: Record<string, unknown> = { seedId, type, range };

    if (type === 'llm') {
      const rows = await this.db.all<any>(
        `SELECT model, provider, input_tokens, output_tokens, latency_ms, estimated_cost_usd, request_type, created_at
           FROM agent_llm_usage
          WHERE seed_id = ?
            AND created_at >= ?
          ORDER BY created_at DESC
          LIMIT 500`,
        [seedId, since]
      );

      let totalInputTokens = 0;
      let totalOutputTokens = 0;
      let totalCostUsd = 0;
      let latencySum = 0;

      const modelBreakdown: Record<string, number> = {};
      const providerBreakdown: Record<string, number> = {};

      const usage = rows.map((row) => {
        const model = String(row.model ?? 'unknown');
        const provider = String(row.provider ?? 'unknown');
        const inputTokens = Number(row.input_tokens ?? 0);
        const outputTokens = Number(row.output_tokens ?? 0);
        const latencyMs = Number(row.latency_ms ?? 0);
        const costUsd = Number(row.estimated_cost_usd ?? 0);

        totalInputTokens += inputTokens;
        totalOutputTokens += outputTokens;
        totalCostUsd += costUsd;
        latencySum += latencyMs;

        modelBreakdown[model] = (modelBreakdown[model] ?? 0) + inputTokens + outputTokens;
        providerBreakdown[provider] =
          (providerBreakdown[provider] ?? 0) + inputTokens + outputTokens;

        return {
          model,
          provider,
          inputTokens,
          outputTokens,
          latencyMs,
          estimatedCostUsd: costUsd,
          requestType: row.request_type ?? null,
          createdAt: toIso(row.created_at),
        };
      });

      response.data = {
        usage,
        totalInputTokens,
        totalOutputTokens,
        totalCostUsd,
        avgLatencyMs: usage.length > 0 ? latencySum / usage.length : 0,
        modelBreakdown,
        providerBreakdown,
      };
      return response;
    }

    if (type === 'tools') {
      const rows = await this.db.all<any>(
        `SELECT tool_id, tool_name, status, duration_ms, error_message, input_summary, output_summary, created_at
           FROM agent_tool_executions
          WHERE seed_id = ?
            AND created_at >= ?
          ORDER BY created_at DESC
          LIMIT 500`,
        [seedId, since]
      );

      const executions = rows.map((row) => ({
        toolId: String(row.tool_id ?? ''),
        toolName: String(row.tool_name ?? ''),
        status: String(row.status ?? ''),
        durationMs: Number(row.duration_ms ?? 0),
        errorMessage: row.error_message ?? null,
        inputSummary: row.input_summary ?? null,
        outputSummary: row.output_summary ?? null,
        createdAt: toIso(row.created_at),
      }));

      const totalExecutions = executions.length;
      const successes = executions.filter(
        (e) => e.status === 'success' || e.status === 'completed'
      ).length;
      const durationSum = executions.reduce((acc, e) => acc + e.durationMs, 0);

      const toolBreakdown: Record<string, number> = {};
      for (const e of executions) {
        toolBreakdown[e.toolName] = (toolBreakdown[e.toolName] ?? 0) + 1;
      }

      response.data = {
        executions,
        totalExecutions,
        successRate: totalExecutions > 0 ? successes / totalExecutions : 0,
        avgDurationMs: totalExecutions > 0 ? durationSum / totalExecutions : 0,
        toolBreakdown,
      };
      return response;
    }

    if (type === 'channels') {
      const rows = await this.db.all<any>(
        `SELECT platform, channel_id, event_type, response_time_ms, created_at
           FROM agent_channel_activity
          WHERE seed_id = ?
            AND created_at >= ?
          ORDER BY created_at DESC
          LIMIT 500`,
        [seedId, since]
      );

      const activity = rows.map((row) => ({
        platform: String(row.platform ?? ''),
        channelId: row.channel_id ?? null,
        eventType: String(row.event_type ?? ''),
        responseTimeMs: row.response_time_ms ?? null,
        createdAt: toIso(row.created_at),
      }));

      const totalMessages = activity.length;
      const responseTimes = activity
        .map((a) => Number(a.responseTimeMs ?? 0))
        .filter((v) => Number.isFinite(v) && v > 0);
      const avgResponseTimeMs =
        responseTimes.length > 0
          ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
          : 0;

      const platformBreakdown: Record<string, number> = {};
      for (const a of activity) {
        platformBreakdown[a.platform] = (platformBreakdown[a.platform] ?? 0) + 1;
      }

      response.data = {
        activity,
        totalMessages,
        avgResponseTimeMs,
        platformBreakdown,
      };
      return response;
    }

    // behavior
    const rows = await this.db.all<any>(
      `SELECT event_type, event_data, created_at
         FROM agent_behavior_events
        WHERE seed_id = ?
          AND created_at >= ?
        ORDER BY created_at DESC
        LIMIT 500`,
      [seedId, since]
    );

    const events = rows.map((row) => ({
      eventType: String(row.event_type ?? ''),
      eventData: row.event_data ?? null,
      createdAt: toIso(row.created_at),
    }));

    response.data = {
      events,
      moodHistory: [],
      trustHistory: [],
      safetyEvents: [],
      styleAdaptations: [],
    };
    return response;
  }
}
