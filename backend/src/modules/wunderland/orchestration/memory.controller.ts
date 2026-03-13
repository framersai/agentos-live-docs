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

// In-memory stores - will be replaced by CognitiveMemoryManager when wired
const traceStore = new Map<string, MemoryTraceRecord>();
const prospectiveStore = new Map<string, ProspectiveRecord>();
const configStore = new Map<string, Record<string, any>>();
let traceCounter = 0;
let prospectiveCounter = 0;

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
          score: c.score ?? 0,
          metadata: c.metadata as Record<string, any> | undefined,
        }));
      } catch {
        // Vector memory may not be available
      }
    }

    // Get traces from in-memory store
    let traces = Array.from(traceStore.values()).filter((t) => t.seedId === seedId && t.isActive);

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
    const id = `mt_${now}_${++traceCounter}`;
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

    traceStore.set(id, trace);

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
  getTrace(@Param('seedId') seedId: string, @Param('traceId') traceId: string) {
    const trace = traceStore.get(traceId);
    if (!trace || trace.seedId !== seedId) {
      throw new HttpException('Trace not found', HttpStatus.NOT_FOUND);
    }

    // Record access
    trace.retrievalCount++;
    trace.lastAccessedAt = Date.now();

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
    const trace = traceStore.get(traceId);
    if (!trace || trace.seedId !== seedId) {
      throw new HttpException('Trace not found', HttpStatus.NOT_FOUND);
    }

    if (body.content !== undefined) trace.content = body.content.trim();
    if (body.tags !== undefined) trace.tags = body.tags;
    if (body.entities !== undefined) trace.entities = body.entities;
    if (body.isActive !== undefined) trace.isActive = body.isActive;
    trace.updatedAt = Date.now();

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
  deleteTrace(@Param('seedId') seedId: string, @Param('traceId') traceId: string) {
    const trace = traceStore.get(traceId);
    if (!trace || trace.seedId !== seedId) {
      throw new HttpException('Trace not found', HttpStatus.NOT_FOUND);
    }

    trace.isActive = false;
    trace.updatedAt = Date.now();
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
    const allTraces = Array.from(traceStore.values()).filter((t) => t.seedId === seedId);
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
      prospectiveCount: Array.from(prospectiveStore.values()).filter(
        (p) => p.seedId === seedId && !p.triggered
      ).length,
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
  getProspective(@Param('seedId') seedId: string) {
    const items = Array.from(prospectiveStore.values())
      .filter((p) => p.seedId === seedId && (!p.triggered || p.recurring))
      .sort((a, b) => b.importance - a.importance);

    return { items };
  }

  /**
   * POST /wunderland/memory/:seedId/prospective
   * Create a new prospective memory item.
   */
  @Post('wunderland/memory/:seedId/prospective')
  createProspective(@Param('seedId') seedId: string, @Body() body: CreateProspectiveBody) {
    if (!body.content?.trim()) {
      throw new HttpException('content is required', HttpStatus.BAD_REQUEST);
    }
    if (!body.triggerType) {
      throw new HttpException('triggerType is required', HttpStatus.BAD_REQUEST);
    }

    const now = Date.now();
    const id = `pm_${now}_${++prospectiveCounter}`;

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

    prospectiveStore.set(id, item);
    return { item };
  }

  /**
   * DELETE /wunderland/memory/:seedId/prospective/:itemId
   * Delete a prospective memory item.
   */
  @Delete('wunderland/memory/:seedId/prospective/:itemId')
  deleteProspective(@Param('seedId') seedId: string, @Param('itemId') itemId: string) {
    const item = prospectiveStore.get(itemId);
    if (!item || item.seedId !== seedId) {
      throw new HttpException('Prospective item not found', HttpStatus.NOT_FOUND);
    }

    prospectiveStore.delete(itemId);
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
  getConfig(@Param('seedId') seedId: string) {
    const stored = configStore.get(seedId) ?? {};
    return { config: buildConfigResponse(stored) };
  }

  /**
   * PATCH /wunderland/memory/:seedId/config
   * Update memory configuration.
   */
  @Patch('wunderland/memory/:seedId/config')
  updateConfig(@Param('seedId') seedId: string, @Body() body: UpdateConfigBody) {
    const existing = configStore.get(seedId) ?? {};
    const updated = mergeConfigUpdate(existing, body);
    configStore.set(seedId, updated);

    // Return the full config shape
    return this.getConfig(seedId);
  }
}
