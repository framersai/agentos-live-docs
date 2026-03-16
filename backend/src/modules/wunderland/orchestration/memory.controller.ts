/**
 * @file memory.controller.ts
 * @description REST endpoints for agent cognitive memory management.
 *
 * Exposes memory trace CRUD, health diagnostics, prospective memory,
 * conversation history, and per-agent memory configuration.
 *
 * Uses WunderlandVectorMemoryService for semantic search and
 * DatabaseService for conversation persistence.
 */

import {
  Inject,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../../../common/guards/auth.guard.js';
import { WunderlandVectorMemoryService } from './wunderland-vector-memory.service.js';
import { DatabaseService } from '../../../database/database.service.js';
import { getAppDatabase } from '../../../core/database/appDatabase.js';

// ---------------------------------------------------------------------------
// DTO types
// ---------------------------------------------------------------------------

interface CreateTraceBody {
  content: string;
  type?: 'episodic' | 'semantic' | 'procedural' | 'prospective';
  scope?: 'thread' | 'user' | 'persona' | 'organization';
  tags?: string[];
  entities?: string[];
  importance?: number;
}

interface UpdateTraceBody {
  content?: string;
  tags?: string[];
  entities?: string[];
  isActive?: boolean;
}

interface CreateProspectiveBody {
  content: string;
  triggerType: 'time_based' | 'event_based' | 'context_based';
  triggerAt?: number;
  triggerEvent?: string;
  cueText?: string;
  importance: number;
  recurring?: boolean;
}

interface UpdateConfigBody {
  featureDetectionStrategy?: 'keyword' | 'llm' | 'hybrid';
  workingMemoryCapacity?: number;
  encoding?: {
    baseStrength?: number;
    flashbulbThreshold?: number;
    flashbulbStrengthMultiplier?: number;
    flashbulbStabilityMultiplier?: number;
  };
  decay?: {
    pruningThreshold?: number;
    recencyHalfLifeMs?: number;
    interferenceThreshold?: number;
  };
  autoIngest?: {
    importanceThreshold?: number;
    maxMemoriesPerTurn?: number;
    retrievalTopK?: number;
    enableSentimentTracking?: boolean;
    enabledCategories?: string[];
  };
  // Legacy flat keys kept for backward compatibility with older clients.
  baseStrength?: number;
  flashbulbThreshold?: number;
  flashbulbStrengthMultiplier?: number;
  flashbulbStabilityMultiplier?: number;
  pruningThreshold?: number;
  recencyHalfLifeMs?: number;
  interferenceThreshold?: number;
  importanceThreshold?: number;
  maxMemoriesPerTurn?: number;
  retrievalTopK?: number;
  enableSentimentTracking?: boolean;
  enabledCategories?: string[];
}

// ---------------------------------------------------------------------------
// In-memory stores (per-seedId) for cognitive features not yet persisted
// ---------------------------------------------------------------------------

interface MemoryTraceRecord {
  id: string;
  seedId: string;
  content: string;
  type: string;
  scope: string;
  tags: string[];
  entities: string[];
  importance: number;
  encodingStrength: number;
  stability: number;
  retrievalCount: number;
  lastAccessedAt: number;
  emotionalValence: number;
  emotionalArousal: number;
  sourceType: string;
  confidence: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

interface ProspectiveRecord {
  id: string;
  seedId: string;
  content: string;
  triggerType: string;
  triggerAt?: number;
  triggerEvent?: string;
  cueText?: string;
  importance: number;
  triggered: boolean;
  recurring: boolean;
  createdAt: number;
}

// SQLite-backed persistence for cognitive memory (replaces former in-memory Maps)
const traceDb = {
  async getAll(
    seedId: string,
    filter?: { type?: string; scope?: string; isActive?: boolean }
  ): Promise<MemoryTraceRecord[]> {
    const db = getAppDatabase();
    let sql = 'SELECT * FROM wunderland_memory_traces WHERE seed_id = ?';
    const params: any[] = [seedId];
    if (filter?.type) {
      sql += ' AND type = ?';
      params.push(filter.type);
    }
    if (filter?.scope) {
      sql += ' AND scope = ?';
      params.push(filter.scope);
    }
    if (filter?.isActive !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filter.isActive ? 1 : 0);
    }
    sql += ' ORDER BY created_at DESC';
    const rows = (await db.all(sql, params)) as any[];
    return rows.map(rowToTrace);
  },
  async get(id: string): Promise<MemoryTraceRecord | undefined> {
    const db = getAppDatabase();
    const rows = (await db.all('SELECT * FROM wunderland_memory_traces WHERE id = ?', [
      id,
    ])) as any[];
    return rows[0] ? rowToTrace(rows[0]) : undefined;
  },
  async set(trace: MemoryTraceRecord): Promise<void> {
    const db = getAppDatabase();
    await db.run(
      `INSERT OR REPLACE INTO wunderland_memory_traces
        (id, seed_id, content, type, scope, tags, entities, importance, encoding_strength,
         stability, retrieval_count, last_accessed_at, emotional_valence, emotional_arousal,
         source_type, confidence, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trace.id,
        trace.seedId,
        trace.content,
        trace.type,
        trace.scope,
        JSON.stringify(trace.tags),
        JSON.stringify(trace.entities),
        trace.importance,
        trace.encodingStrength,
        trace.stability,
        trace.retrievalCount,
        trace.lastAccessedAt,
        trace.emotionalValence,
        trace.emotionalArousal,
        trace.sourceType,
        trace.confidence,
        trace.isActive ? 1 : 0,
        Math.trunc(trace.createdAt / 1000),
        Math.trunc(trace.updatedAt / 1000),
      ]
    );
  },
  async count(seedId: string, isActive?: boolean): Promise<number> {
    const db = getAppDatabase();
    const sql =
      isActive !== undefined
        ? 'SELECT COUNT(*) as cnt FROM wunderland_memory_traces WHERE seed_id = ? AND is_active = ?'
        : 'SELECT COUNT(*) as cnt FROM wunderland_memory_traces WHERE seed_id = ?';
    const params = isActive !== undefined ? [seedId, isActive ? 1 : 0] : [seedId];
    const rows = (await db.all(sql, params)) as any[];
    return rows[0]?.cnt ?? 0;
  },
};

function rowToTrace(row: any): MemoryTraceRecord {
  return {
    id: row.id,
    seedId: row.seed_id,
    content: row.content,
    type: row.type,
    scope: row.scope,
    tags: JSON.parse(row.tags || '[]'),
    entities: JSON.parse(row.entities || '[]'),
    importance: row.importance,
    encodingStrength: row.encoding_strength,
    stability: row.stability,
    retrievalCount: row.retrieval_count,
    lastAccessedAt: row.last_accessed_at ? row.last_accessed_at * 1000 : Date.now(),
    emotionalValence: row.emotional_valence,
    emotionalArousal: row.emotional_arousal,
    sourceType: row.source_type,
    confidence: row.confidence,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at * 1000,
    updatedAt: row.updated_at * 1000,
  };
}

const prospectiveDb = {
  async getAll(seedId: string): Promise<ProspectiveRecord[]> {
    const db = getAppDatabase();
    const rows = (await db.all(
      'SELECT * FROM wunderland_prospective_memory WHERE seed_id = ? ORDER BY created_at DESC',
      [seedId]
    )) as any[];
    return rows.map((r: any) => ({
      id: r.id,
      seedId: r.seed_id,
      content: r.content,
      triggerType: r.trigger_type,
      triggerAt: r.trigger_at ? r.trigger_at * 1000 : undefined,
      triggerEvent: r.trigger_event ?? undefined,
      cueText: r.cue_text ?? undefined,
      importance: r.importance,
      triggered: Boolean(r.triggered),
      recurring: Boolean(r.recurring),
      createdAt: r.created_at * 1000,
    }));
  },
  async set(item: ProspectiveRecord): Promise<void> {
    const db = getAppDatabase();
    await db.run(
      `INSERT OR REPLACE INTO wunderland_prospective_memory
        (id, seed_id, content, trigger_type, trigger_at, trigger_event, cue_text,
         importance, triggered, recurring, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.id,
        item.seedId,
        item.content,
        item.triggerType,
        item.triggerAt ? Math.trunc(item.triggerAt / 1000) : null,
        item.triggerEvent ?? null,
        item.cueText ?? null,
        item.importance,
        item.triggered ? 1 : 0,
        item.recurring ? 1 : 0,
        Math.trunc(item.createdAt / 1000),
      ]
    );
  },
  async delete(id: string): Promise<boolean> {
    const db = getAppDatabase();
    const result = await db.run('DELETE FROM wunderland_prospective_memory WHERE id = ?', [id]);
    return (result as any)?.changes > 0;
  },
  async count(seedId: string): Promise<number> {
    const db = getAppDatabase();
    const rows = (await db.all(
      'SELECT COUNT(*) as cnt FROM wunderland_prospective_memory WHERE seed_id = ?',
      [seedId]
    )) as any[];
    return rows[0]?.cnt ?? 0;
  },
};

const configDb = {
  async get(seedId: string): Promise<Record<string, any>> {
    const db = getAppDatabase();
    const rows = (await db.all('SELECT config FROM wunderland_memory_config WHERE seed_id = ?', [
      seedId,
    ])) as any[];
    return rows[0] ? JSON.parse(rows[0].config || '{}') : {};
  },
  async set(seedId: string, config: Record<string, any>): Promise<void> {
    const db = getAppDatabase();
    await db.run(
      `INSERT OR REPLACE INTO wunderland_memory_config (seed_id, config, updated_at)
       VALUES (?, ?, strftime('%s','now'))`,
      [seedId, JSON.stringify(config)]
    );
  },
};

function buildConfigResponse(stored: Record<string, any>) {
  const encoding = stored.encoding ?? {};
  const decay = stored.decay ?? {};
  const autoIngest = stored.autoIngest ?? {};

  return {
    featureDetectionStrategy: stored.featureDetectionStrategy ?? 'keyword',
    workingMemoryCapacity: stored.workingMemoryCapacity ?? 7,
    encoding: {
      baseStrength: encoding.baseStrength ?? stored.baseStrength ?? 0.6,
      flashbulbThreshold: encoding.flashbulbThreshold ?? stored.flashbulbThreshold ?? 0.8,
      flashbulbStrengthMultiplier:
        encoding.flashbulbStrengthMultiplier ?? stored.flashbulbStrengthMultiplier ?? 2.0,
      flashbulbStabilityMultiplier:
        encoding.flashbulbStabilityMultiplier ?? stored.flashbulbStabilityMultiplier ?? 5.0,
    },
    decay: {
      pruningThreshold: decay.pruningThreshold ?? stored.pruningThreshold ?? 0.05,
      recencyHalfLifeMs: decay.recencyHalfLifeMs ?? stored.recencyHalfLifeMs ?? 86_400_000,
      interferenceThreshold: decay.interferenceThreshold ?? stored.interferenceThreshold ?? 0.7,
    },
    autoIngest: {
      importanceThreshold: autoIngest.importanceThreshold ?? stored.importanceThreshold ?? 0.3,
      maxMemoriesPerTurn: autoIngest.maxMemoriesPerTurn ?? stored.maxMemoriesPerTurn ?? 3,
      retrievalTopK: autoIngest.retrievalTopK ?? stored.retrievalTopK ?? 6,
      enableSentimentTracking:
        autoIngest.enableSentimentTracking ?? stored.enableSentimentTracking ?? true,
      enabledCategories: autoIngest.enabledCategories ??
        stored.enabledCategories ?? [
          'user_preference',
          'episodic',
          'goal',
          'knowledge',
          'correction',
        ],
    },
  };
}

function mergeConfigUpdate(
  existing: Record<string, any>,
  body: UpdateConfigBody
): Record<string, any> {
  return {
    ...existing,
    ...(body.featureDetectionStrategy !== undefined
      ? { featureDetectionStrategy: body.featureDetectionStrategy }
      : null),
    ...(body.workingMemoryCapacity !== undefined
      ? { workingMemoryCapacity: body.workingMemoryCapacity }
      : null),
    encoding: {
      ...(existing.encoding ?? {}),
      ...(body.encoding ?? {}),
      ...(body.baseStrength !== undefined ? { baseStrength: body.baseStrength } : null),
      ...(body.flashbulbThreshold !== undefined
        ? { flashbulbThreshold: body.flashbulbThreshold }
        : null),
      ...(body.flashbulbStrengthMultiplier !== undefined
        ? { flashbulbStrengthMultiplier: body.flashbulbStrengthMultiplier }
        : null),
      ...(body.flashbulbStabilityMultiplier !== undefined
        ? { flashbulbStabilityMultiplier: body.flashbulbStabilityMultiplier }
        : null),
    },
    decay: {
      ...(existing.decay ?? {}),
      ...(body.decay ?? {}),
      ...(body.pruningThreshold !== undefined ? { pruningThreshold: body.pruningThreshold } : null),
      ...(body.recencyHalfLifeMs !== undefined
        ? { recencyHalfLifeMs: body.recencyHalfLifeMs }
        : null),
      ...(body.interferenceThreshold !== undefined
        ? { interferenceThreshold: body.interferenceThreshold }
        : null),
    },
    autoIngest: {
      ...(existing.autoIngest ?? {}),
      ...(body.autoIngest ?? {}),
      ...(body.importanceThreshold !== undefined
        ? { importanceThreshold: body.importanceThreshold }
        : null),
      ...(body.maxMemoriesPerTurn !== undefined
        ? { maxMemoriesPerTurn: body.maxMemoriesPerTurn }
        : null),
      ...(body.retrievalTopK !== undefined ? { retrievalTopK: body.retrievalTopK } : null),
      ...(body.enableSentimentTracking !== undefined
        ? { enableSentimentTracking: body.enableSentimentTracking }
        : null),
      ...(body.enabledCategories !== undefined
        ? { enabledCategories: body.enabledCategories }
        : null),
    },
  };
}

// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------

@Controller()
@UseGuards(AuthGuard)
export class MemoryController {
  constructor(
    @Inject(WunderlandVectorMemoryService)
    private readonly vectorMemory: WunderlandVectorMemoryService,
    @Inject(DatabaseService) private readonly db: DatabaseService
  ) {}

  // =========================================================================
  // Traces
  // =========================================================================

  /**
   * GET /wunderland/memory/:seedId/traces
   * List/search memory traces for an agent.
   */
  @Get('wunderland/memory/:seedId/traces')
  async listTraces(
    @Param('seedId') seedId: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('scope') scope?: string,
    @Query('minStrength') minStrength?: string,
    @Query('tags') tags?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('sortBy') sortBy?: string
  ) {
    const maxResults = Math.min(Number(limit) || 50, 200);
    const skip = Number(offset) || 0;

    // If search query provided, also query vector memory
    let vectorResults: Array<{ content: string; score: number; metadata?: Record<string, any> }> =
      [];
    if (search) {
      try {
        const result = await this.vectorMemory.querySeedMemory({
          seedId,
          query: search,
          topK: maxResults,
        });
        vectorResults = result.chunks.map((c) => ({
          content: c.content,
          score: (c as any).relevanceScore ?? (c as any).score ?? 0,
          metadata: c.metadata as Record<string, any> | undefined,
        }));
      } catch {
        // Vector memory may not be available
      }
    }

    // Get traces from persistent store
    let traces = await traceDb.getAll(seedId, { isActive: true });

    if (type) traces = traces.filter((t) => t.type === type);
    if (scope) traces = traces.filter((t) => t.scope === scope);
    if (minStrength) traces = traces.filter((t) => t.encodingStrength >= Number(minStrength));
    if (tags) {
      const tagSet = new Set(
        tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      );
      traces = traces.filter((t) => t.tags.some((tag) => tagSet.has(tag)));
    }

    // Sort
    const sort = sortBy || 'createdAt';
    traces.sort((a, b) => {
      if (sort === 'strength') return b.encodingStrength - a.encodingStrength;
      if (sort === 'retrievalCount') return b.retrievalCount - a.retrievalCount;
      return b.createdAt - a.createdAt;
    });

    const total = traces.length;
    traces = traces.slice(skip, skip + maxResults);

    return {
      traces,
      vectorResults: search ? vectorResults : undefined,
      total,
    };
  }

  /**
   * POST /wunderland/memory/:seedId/traces
   * Create a new memory trace.
   */
  @Post('wunderland/memory/:seedId/traces')
  async createTrace(@Param('seedId') seedId: string, @Body() body: CreateTraceBody) {
    if (!body.content?.trim()) {
      throw new HttpException('content is required', HttpStatus.BAD_REQUEST);
    }

    const now = Date.now();
    const id = `mt_${now}_${Math.random().toString(36).substring(2, 8)}`;
    const importance = body.importance ?? 0.5;

    const trace: MemoryTraceRecord = {
      id,
      seedId,
      content: body.content.trim(),
      type: body.type ?? 'semantic',
      scope: body.scope ?? 'user',
      tags: body.tags ?? [],
      entities: body.entities ?? [],
      importance,
      encodingStrength: Math.min(1, 0.5 + importance * 0.3),
      stability: 86_400_000,
      retrievalCount: 0,
      lastAccessedAt: now,
      emotionalValence: 0,
      emotionalArousal: 0,
      sourceType: 'user_statement',
      confidence: 0.9,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await traceDb.set(trace);

    // Also ingest into vector memory for semantic search
    try {
      await this.vectorMemory.ingestSeedPost({
        seedId,
        postId: `memory_${id}`,
        content: body.content.trim(),
        createdAt: new Date(now).toISOString(),
      });
    } catch {
      // Vector memory may not be available
    }

    return { trace };
  }

  /**
   * GET /wunderland/memory/:seedId/traces/:traceId
   * Get a single trace with full metadata.
   */
  @Get('wunderland/memory/:seedId/traces/:traceId')
  async getTrace(@Param('seedId') seedId: string, @Param('traceId') traceId: string) {
    const trace = await traceDb.get(traceId);
    if (!trace || trace.seedId !== seedId) {
      throw new HttpException('Trace not found', HttpStatus.NOT_FOUND);
    }

    // Record access and persist
    trace.retrievalCount++;
    trace.lastAccessedAt = Date.now();
    trace.updatedAt = Date.now();
    await traceDb.set(trace);

    return { trace };
  }

  /**
   * PATCH /wunderland/memory/:seedId/traces/:traceId
   * Update trace fields.
   */
  @Patch('wunderland/memory/:seedId/traces/:traceId')
  async updateTrace(
    @Param('seedId') seedId: string,
    @Param('traceId') traceId: string,
    @Body() body: UpdateTraceBody
  ) {
    const trace = await traceDb.get(traceId);
    if (!trace || trace.seedId !== seedId) {
      throw new HttpException('Trace not found', HttpStatus.NOT_FOUND);
    }

    if (body.content !== undefined) trace.content = body.content.trim();
    if (body.tags !== undefined) trace.tags = body.tags;
    if (body.entities !== undefined) trace.entities = body.entities;
    if (body.isActive !== undefined) trace.isActive = body.isActive;
    trace.updatedAt = Date.now();

    // Persist updated trace to SQLite
    await traceDb.set(trace);

    // Re-ingest if content changed
    if (body.content !== undefined) {
      try {
        await this.vectorMemory.ingestSeedPost({
          seedId,
          postId: `memory_${traceId}`,
          content: trace.content,
          createdAt: new Date(trace.createdAt).toISOString(),
        });
      } catch {
        // non-critical
      }
    }

    return { trace };
  }

  /**
   * DELETE /wunderland/memory/:seedId/traces/:traceId
   * Soft-delete a trace.
   */
  @Delete('wunderland/memory/:seedId/traces/:traceId')
  async deleteTrace(@Param('seedId') seedId: string, @Param('traceId') traceId: string) {
    const trace = await traceDb.get(traceId);
    if (!trace || trace.seedId !== seedId) {
      throw new HttpException('Trace not found', HttpStatus.NOT_FOUND);
    }

    trace.isActive = false;
    trace.updatedAt = Date.now();
    await traceDb.set(trace);
    return { success: true };
  }

  // =========================================================================
  // Health
  // =========================================================================

  /**
   * GET /wunderland/memory/:seedId/health
   * Memory health report.
   */
  @Get('wunderland/memory/:seedId/health')
  async getHealth(@Param('seedId') seedId: string) {
    const allTraces = await traceDb.getAll(seedId);
    const active = allTraces.filter((t) => t.isActive);

    const tracesPerType: Record<string, number> = {
      episodic: 0,
      semantic: 0,
      procedural: 0,
      prospective: 0,
    };
    const tracesPerScope: Record<string, number> = {
      thread: 0,
      user: 0,
      persona: 0,
      organization: 0,
    };
    let totalStrength = 0;
    let weakest = 1;

    for (const t of active) {
      tracesPerType[t.type] = (tracesPerType[t.type] ?? 0) + 1;
      tracesPerScope[t.scope] = (tracesPerScope[t.scope] ?? 0) + 1;
      totalStrength += t.encodingStrength;
      if (t.encodingStrength < weakest) weakest = t.encodingStrength;
    }

    // Check vector memory stats
    let vectorMemoryAvailable = false;
    try {
      await this.vectorMemory.querySeedMemory({ seedId, query: 'test', topK: 1 });
      vectorMemoryAvailable = true;
    } catch {
      // not available
    }

    return {
      totalTraces: allTraces.length,
      activeTraces: active.length,
      avgStrength: active.length > 0 ? totalStrength / active.length : 0,
      weakestTraceStrength: active.length > 0 ? weakest : 0,
      workingMemoryUtilization: 0, // Not accessible without CognitiveMemoryManager
      tracesPerType,
      tracesPerScope,
      vectorMemoryAvailable,
      prospectiveCount: await prospectiveDb.count(seedId),
    };
  }

  // =========================================================================
  // Prospective Memory
  // =========================================================================

  /**
   * GET /wunderland/memory/:seedId/prospective
   * List active prospective memory items.
   */
  @Get('wunderland/memory/:seedId/prospective')
  async getProspective(@Param('seedId') seedId: string) {
    const all = await prospectiveDb.getAll(seedId);
    const items = all
      .filter((p) => !p.triggered || p.recurring)
      .sort((a, b) => b.importance - a.importance);

    return { items };
  }

  /**
   * POST /wunderland/memory/:seedId/prospective
   * Create a new prospective memory item.
   */
  @Post('wunderland/memory/:seedId/prospective')
  async createProspective(@Param('seedId') seedId: string, @Body() body: CreateProspectiveBody) {
    if (!body.content?.trim()) {
      throw new HttpException('content is required', HttpStatus.BAD_REQUEST);
    }
    if (!body.triggerType) {
      throw new HttpException('triggerType is required', HttpStatus.BAD_REQUEST);
    }

    const now = Date.now();
    const id = `pm_${now}_${Math.random().toString(36).substring(2, 8)}`;

    const item: ProspectiveRecord = {
      id,
      seedId,
      content: body.content.trim(),
      triggerType: body.triggerType,
      triggerAt: body.triggerAt,
      triggerEvent: body.triggerEvent,
      cueText: body.cueText,
      importance: body.importance ?? 0.5,
      triggered: false,
      recurring: body.recurring ?? false,
      createdAt: now,
    };

    await prospectiveDb.set(item);
    return { item };
  }

  /**
   * DELETE /wunderland/memory/:seedId/prospective/:itemId
   * Delete a prospective memory item.
   */
  @Delete('wunderland/memory/:seedId/prospective/:itemId')
  async deleteProspective(@Param('seedId') seedId: string, @Param('itemId') itemId: string) {
    const deleted = await prospectiveDb.delete(itemId);
    if (!deleted) {
      throw new HttpException('Prospective item not found', HttpStatus.NOT_FOUND);
    }
    return { success: true };
  }

  // =========================================================================
  // Conversations
  // =========================================================================

  /**
   * GET /wunderland/memory/:seedId/conversations
   * List conversations for an agent.
   */
  @Get('wunderland/memory/:seedId/conversations')
  async listConversations(
    @Param('seedId') seedId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const maxResults = Math.min(Number(limit) || 20, 100);
    const skip = Number(offset) || 0;

    try {
      const rows = await this.db.all(
        `SELECT
          conversationId,
          MAX(timestamp) as lastActivity,
          COUNT(*) as turnCount,
          MIN(timestamp) as startedAt
        FROM conversation_turns
        WHERE userId = ?
        GROUP BY conversationId
        ORDER BY lastActivity DESC
        LIMIT ? OFFSET ?`,
        [seedId, maxResults, skip]
      );

      return { conversations: rows ?? [] };
    } catch {
      return { conversations: [] };
    }
  }

  /**
   * GET /wunderland/memory/:seedId/conversations/:conversationId
   * Get turns for a specific conversation.
   */
  @Get('wunderland/memory/:seedId/conversations/:conversationId')
  async getConversationTurns(
    @Param('seedId') seedId: string,
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: string
  ) {
    const maxResults = Math.min(Number(limit) || 100, 500);

    try {
      const rows = await this.db.all(
        `SELECT role, content, timestamp, total_tokens AS tokenCount, tool_call_id AS toolName, metadata
        FROM conversation_turns
        WHERE userId = ? AND conversationId = ?
        ORDER BY timestamp ASC
        LIMIT ?`,
        [seedId, conversationId, maxResults]
      );

      return { turns: rows ?? [] };
    } catch {
      return { turns: [] };
    }
  }

  // =========================================================================
  // Config
  // =========================================================================

  /**
   * GET /wunderland/memory/:seedId/config
   * Get memory configuration for an agent.
   */
  @Get('wunderland/memory/:seedId/config')
  async getConfig(@Param('seedId') seedId: string) {
    const stored = (await configDb.get(seedId)) ?? {};
    return { config: buildConfigResponse(stored) };
  }

  /**
   * PATCH /wunderland/memory/:seedId/config
   * Update memory configuration.
   */
  @Patch('wunderland/memory/:seedId/config')
  async updateConfig(@Param('seedId') seedId: string, @Body() body: UpdateConfigBody) {
    const existing = (await configDb.get(seedId)) ?? {};
    const updated = mergeConfigUpdate(existing, body);
    await configDb.set(seedId, updated);

    // Return the full config shape
    return this.getConfig(seedId);
  }
}
