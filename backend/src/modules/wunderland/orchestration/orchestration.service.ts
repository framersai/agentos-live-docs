/**
 * @file orchestration.service.ts
 * @description The missing link — instantiates the social engine from `packages/wunderland`
 * and wires it to the NestJS backend. Env-gated via ENABLE_SOCIAL_ORCHESTRATION=true.
 *
 * Responsibilities:
 * - Bootstrap WonderlandNetwork with persistence adapters
 * - Create and wire supplementary engines (Trust, DM, Safety, Alliance, Governance)
 * - Load active agents from the DB and register them as citizens
 * - Schedule cron ticks (browse, post, trust decay)
 * - Expose accessor methods for other backend services
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { callLlm } from '../../../core/llm/llm.factory';
import { ragService } from '../../../integrations/agentos/agentos.rag.service';
import { WunderlandVectorMemoryService } from './wunderland-vector-memory.service';
import {
  WonderlandNetwork,
  TrustEngine,
  DirectMessageRouter,
  SafetyEngine,
  AllianceEngine,
  GovernanceExecutor,
  createCreateEnclaveHandler,
  createBanAgentHandler,
  DEFAULT_SECURITY_PROFILE,
  DEFAULT_INFERENCE_HIERARCHY,
  DEFAULT_STEP_UP_AUTH_CONFIG,
  createWunderlandTools,
  createMemoryReadTool,
  PreLLMClassifier,
} from 'wunderland';
import type {
  WonderlandPost,
  NewsroomConfig,
  WunderlandSeedConfig,
  HEXACOTraits,
  PostingDirectives,
} from 'wunderland';
import { isHostedMode } from '../hosted-mode.js';

// Import all 7 persistence adapters
import { MoodPersistenceService } from './mood-persistence.service';
import { EnclavePersistenceService } from './enclave-persistence.service';
import { BrowsingPersistenceService } from './browsing-persistence.service';
import { TrustPersistenceService } from './trust-persistence.service';
import { DMPersistenceService } from './dm-persistence.service';
import { SafetyPersistenceService } from './safety-persistence.service';
import { AlliancePersistenceService } from './alliance-persistence.service';

@Injectable()
export class OrchestrationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('OrchestrationService');
  private network?: WonderlandNetwork;
  private trustEngine?: TrustEngine;
  private dmRouter?: DirectMessageRouter;
  private safetyEngine?: SafetyEngine;
  private allianceEngine?: AllianceEngine;
  private governanceExecutor?: GovernanceExecutor;
  private cronIntervals: Map<string, NodeJS.Timeout> = new Map();
  private cronTickCounts: Map<string, number> = new Map();
  private readonly enabled: boolean;

  // Always-on Pre-LLM classifier — runs on every agent-generated content regardless of per-agent settings
  private readonly alwaysOnClassifier = new PreLLMClassifier({
    riskThreshold: 0.7,
    blockThreshold: 0.95,
    enableLogging: true,
  });

  // Timezone-aware scheduling state
  private agentTimezones: Map<string, string> = new Map();
  private lastBrowseTickAt = 0;
  private lastPostTickAt = 0;
  private currentBrowseJitter = 0;
  private currentPostJitter = 0;

  constructor(
    private readonly db: DatabaseService,
    private readonly moodPersistence: MoodPersistenceService,
    private readonly enclavePersistence: EnclavePersistenceService,
    private readonly browsingPersistence: BrowsingPersistenceService,
    private readonly trustPersistence: TrustPersistenceService,
    private readonly dmPersistence: DMPersistenceService,
    private readonly safetyPersistence: SafetyPersistenceService,
    private readonly alliancePersistence: AlliancePersistenceService,
    private readonly vectorMemory: WunderlandVectorMemoryService
  ) {
    this.enabled = process.env.ENABLE_SOCIAL_ORCHESTRATION === 'true';
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  async onModuleInit(): Promise<void> {
    if (!this.enabled) {
      this.logger.log('Social orchestration disabled (ENABLE_SOCIAL_ORCHESTRATION != true).');
      return;
    }
    try {
      await this.bootstrap();
    } catch (err) {
      this.logger.error('Failed to bootstrap social orchestration:', err);
    }
  }

  async onModuleDestroy(): Promise<void> {
    for (const [, interval] of this.cronIntervals) {
      clearInterval(interval);
    }
    this.cronIntervals.clear();

    if (this.network) {
      try {
        await this.network.stop();
      } catch (err) {
        this.logger.error('Error stopping WonderlandNetwork:', err);
      }
    }
    this.logger.log('Social orchestration stopped.');
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────────

  private async bootstrap(): Promise<void> {
    // 1. Create WonderlandNetwork
    this.network = new WonderlandNetwork({
      networkId: 'wunderland-main',
      worldFeedSources: [],
      globalRateLimits: { maxPostsPerHourPerAgent: 10, maxTipsPerHourPerUser: 20 },
      defaultApprovalTimeoutMs: 300_000,
      quarantineNewCitizens: false,
      quarantineDurationMs: 0,
    });

    // 2. Wire persistence adapters (before initializeEnclaveSystem)
    this.network.setMoodPersistenceAdapter(this.moodPersistence);
    this.network.setEnclavePersistenceAdapter(this.enclavePersistence);
    this.network.setBrowsingPersistenceAdapter(this.browsingPersistence);

    // 3. Initialize enclave system (loads persisted enclaves, creates defaults)
    await this.network.initializeEnclaveSystem();

    // 3.5 Configure LLM + tools (optional, enables production mode)
    await this.configureLLMAndTools();

    // 4. Create supplementary engines (after enclave system is up)
    this.trustEngine = new TrustEngine();
    this.trustEngine.setPersistenceAdapter(this.trustPersistence);

    this.safetyEngine = new SafetyEngine();
    this.safetyEngine.setPersistenceAdapter(this.safetyPersistence);

    const stimulusRouter = this.network.getStimulusRouter();
    const enclaveRegistry = this.network.getEnclaveRegistry()!;
    const moodEngine = this.network.getMoodEngine()!;

    this.dmRouter = new DirectMessageRouter(stimulusRouter, this.trustEngine, enclaveRegistry);
    this.dmRouter.setPersistenceAdapter(this.dmPersistence);

    this.allianceEngine = new AllianceEngine(this.trustEngine, moodEngine, enclaveRegistry);
    this.allianceEngine.setPersistenceAdapter(this.alliancePersistence);

    this.governanceExecutor = new GovernanceExecutor();
    this.governanceExecutor.registerHandler(
      'create_enclave',
      createCreateEnclaveHandler(enclaveRegistry)
    );
    this.governanceExecutor.registerHandler('ban_agent', createBanAgentHandler(enclaveRegistry));

    // 5. Set post store callback — writes published posts to wunderland_posts
    //    Always-on Pre-LLM classifier runs on every post regardless of agent security settings.
    this.network.setPostStoreCallback(async (post: WonderlandPost) => {
      try {
        // Always-on injection defense: classify content before persisting
        const classification = this.alwaysOnClassifier.classifyInput(post.content);
        if (classification.category === 'MALICIOUS') {
          this.logger.warn(
            `[SECURITY] Blocked malicious post from ${post.seedId} (risk=${classification.riskScore.toFixed(2)}): ${classification.detectedPatterns.map((p) => p.patternId).join(', ')}`
          );
          return; // Block — do not persist
        }
        if (classification.category === 'SUSPICIOUS') {
          this.logger.warn(
            `[SECURITY] Flagged suspicious post from ${post.seedId} (risk=${classification.riskScore.toFixed(2)}): ${classification.detectedPatterns.map((p) => p.patternId).join(', ')}`
          );
          // Allow through but log for audit — the approval queue will catch it
        }

        await this.persistPost(post);
        // After a successful post, clear any active (one-time) directives
        await this.clearActiveDirectivesIfNeeded(post.seedId);
      } catch (err) {
        this.logger.error(`Failed to persist post ${post.postId}:`, err);
      }
    });

    // 6. Load all active agents from DB and register them as citizens
    const agentCount = await this.loadAndRegisterAgents();

    // 7. Schedule timezone-aware activity crons
    //
    // Instead of fixed-interval global broadcasts, a master scheduler runs
    // every 5 minutes. On each cycle it checks how many agents are in their
    // "active window" (7 AM–11 PM local time based on stored timezone).
    // Browse and post ticks are only emitted when active agents exist, and
    // each interval is jittered so activity isn't perfectly periodic.
    //
    // This keeps all scheduling logic in the backend — the wunderland
    // package receives the same broadcast cron ticks, it just receives
    // them at timezone-appropriate times with natural variation.

    this.lastBrowseTickAt = Date.now();
    this.lastPostTickAt = Date.now();
    this.currentBrowseJitter = this.randomJitter(-3 * 60_000, 3 * 60_000);
    this.currentPostJitter = this.randomJitter(-10 * 60_000, 10 * 60_000);

    this.scheduleCron('activity_scheduler', 5 * 60_000, async () => {
      await this.runActivityCycle();
    });

    // Trust decay: once daily (not timezone-dependent)
    this.scheduleCron('trust_decay', 24 * 60 * 60_000, async () => {
      this.trustEngine?.decayAll(1);
    });

    // 8. Start the network
    await this.network.start();
    this.logger.log(`Social orchestration started. ${agentCount} agents registered.`);
  }

  // ── Agent Loading ─────────────────────────────────────────────────────────

  private async loadAndRegisterAgents(): Promise<number> {
    const agents = await this.db.all<{
      seed_id: string;
      owner_user_id: string;
      display_name: string;
      bio: string | null;
      hexaco_traits: string;
      subscribed_topics: string | null;
      tool_access_profile: string | null;
      timezone: string | null;
      posting_directives: string | null;
      execution_mode: string | null;
    }>(
      `SELECT a.seed_id, a.owner_user_id, a.display_name, a.bio, a.hexaco_traits,
	              a.tool_access_profile, a.timezone, a.posting_directives, a.execution_mode, c.subscribed_topics
	       FROM wunderland_agents a
	       LEFT JOIN wunderland_citizens c ON c.seed_id = a.seed_id
         LEFT JOIN wunderland_agent_runtime r ON r.seed_id = a.seed_id
	       WHERE a.status = 'active'
           AND (c.is_active = 1 OR c.is_active IS NULL)
           AND COALESCE(r.hosting_mode, 'managed') != 'self_hosted'`
    );

    let count = 0;
    for (const agent of agents) {
      try {
        const hexaco = this.parseJson<HEXACOTraits>(agent.hexaco_traits, {
          honesty_humility: 0.5,
          emotionality: 0.5,
          extraversion: 0.5,
          agreeableness: 0.5,
          conscientiousness: 0.5,
          openness: 0.5,
        });
        const topics = this.parseJson<string[]>(agent.subscribed_topics, []);

        const seedConfig: WunderlandSeedConfig = {
          seedId: agent.seed_id,
          name: agent.display_name,
          description: agent.bio ?? '',
          hexacoTraits: hexaco,
          securityProfile: DEFAULT_SECURITY_PROFILE,
          inferenceHierarchy: DEFAULT_INFERENCE_HIERARCHY,
          stepUpAuthConfig: DEFAULT_STEP_UP_AUTH_CONFIG,
          toolAccessProfile:
            (agent.tool_access_profile as WunderlandSeedConfig['toolAccessProfile']) ||
            'social-citizen',
        };

        const postingDirectives = this.parseJson<PostingDirectives | null>(
          agent.posting_directives,
          null
        );

        // Execution mode determines approval behavior:
        // - 'autonomous':       agent posts without approval (within safety bounds)
        // - 'human-all':        all posts require owner approval
        // - 'human-dangerous':  only high-risk outputs require approval (default)
        const executionMode =
          (agent.execution_mode as 'autonomous' | 'human-all' | 'human-dangerous') ||
          'human-dangerous';
        const requireApproval = executionMode !== 'autonomous';

        const newsroomConfig: NewsroomConfig = {
          seedConfig,
          ownerId: agent.owner_user_id,
          worldFeedTopics: topics,
          acceptTips: true,
          postingCadence: { type: 'interval', value: 3_600_000 },
          maxPostsPerHour: 10,
          approvalTimeoutMs: 300_000,
          requireApproval,
          postingDirectives: postingDirectives ?? undefined,
        };

        await this.network!.registerCitizen(newsroomConfig);

        // Store timezone for activity scheduling
        this.agentTimezones.set(agent.seed_id, agent.timezone || 'UTC');

        // Load trust scores from persistence
        await this.trustEngine!.loadFromPersistence(agent.seed_id);

        count++;
      } catch (err) {
        this.logger.warn(`Failed to register agent '${agent.seed_id}': ${err}`);
      }
    }
    return count;
  }

  private async configureLLMAndTools(): Promise<void> {
    if (!this.network) return;

    // Tools (web/news/image/etc.) + memory tool
    try {
      const hostedMode = isHostedMode();
      const tools = await createWunderlandTools(
        hostedMode
          ? {
              tools: [
                'web-search',
                'web-browser',
                'news-search',
                'giphy',
                'image-search',
                'voice-synthesis',
              ],
              voice: 'none',
              productivity: 'none',
            }
          : undefined
      );

      tools.push(
        createMemoryReadTool(async ({ query, topK, context }) => {
          const seedId = context.gmiId;
          try {
            const result = await this.vectorMemory.querySeedMemory({
              seedId,
              query,
              topK,
            });

            const items = (result.chunks ?? []).map((chunk) => ({
              text: chunk.content,
              score: chunk.relevanceScore,
              metadata: chunk.metadata as any,
            }));

            return {
              items,
              context: result.context,
            };
          } catch (err) {
            // Fallback to the legacy keyword RAG store.
            const collectionId = `wunderland-seed-memory:${seedId}`;
            const result = await ragService.query({
              query,
              collectionIds: [collectionId],
              topK,
              includeMetadata: false,
            });

            const items = (result.chunks ?? []).map((chunk) => ({
              text: chunk.content,
              score: chunk.score,
            }));

            return {
              items,
              context: items.map((item, idx) => `(${idx + 1}) ${item.text}`).join('\n'),
            };
          }
        })
      );

      this.network.registerToolsForAll(tools);
      this.logger.log(`Registered ${tools.length} tools for Wunderland newsrooms.`);
    } catch (err) {
      this.logger.warn(
        `Failed to load/register Wunderland tools; continuing without tools: ${String(
          (err as any)?.message ?? err
        )}`
      );
    }

    const hasAnyLLM =
      Boolean(process.env.OPENAI_API_KEY?.trim()) ||
      Boolean(process.env.OPENROUTER_API_KEY?.trim());

    if (!hasAnyLLM) {
      this.logger.log(
        'No LLM API keys detected (OPENAI_API_KEY/OPENROUTER_API_KEY). Newsrooms will run in placeholder mode.'
      );
      return;
    }

    // Destructive tool names that agents must NEVER be allowed to call
    const BLOCKED_TOOL_NAMES = new Set([
      'file_delete',
      'rm',
      'rmdir',
      'unlink',
      'drop_table',
      'drop_database',
      'truncate',
      'kill_process',
      'shutdown',
      'reboot',
      'exec_shell',
      'shell',
      'bash',
      'sh',
      'shell_execute',
      'shell_exec',
      'run_command',
      'cli_executor',
      'file_read',
      'file_write',
      'list_directory',
      'skills_list',
      'skills_read',
      'skills_enable',
      'skills_install',
      'modify_config',
      'set_env',
      'write_config',
    ]);

    this.network.setLLMCallbackForAll(async (messages, tools, options) => {
      // Always-on Pre-LLM classifier on the latest user/system message
      const lastMessage = messages[messages.length - 1];
      const textToClassify =
        typeof lastMessage === 'string' ? lastMessage : ((lastMessage as any)?.content ?? '');
      if (textToClassify) {
        const inputClassification = this.alwaysOnClassifier.classifyInput(textToClassify);
        if (inputClassification.category === 'MALICIOUS') {
          this.logger.warn(
            `[SECURITY] Blocked malicious LLM input (risk=${inputClassification.riskScore.toFixed(2)}): ${inputClassification.detectedPatterns.map((p) => p.patternId).join(', ')}`
          );
          return {
            content: 'I cannot process this request due to security policy.',
            tool_calls: [],
            model: 'blocked',
          };
        }
      }

      const resp = await callLlm(messages as any, options?.model, {
        temperature: options?.temperature,
        max_tokens: options?.max_tokens,
        tools: tools as any,
      });

      // Filter out any destructive tool calls that agents must never execute
      if (resp.toolCalls && Array.isArray(resp.toolCalls)) {
        resp.toolCalls = resp.toolCalls.filter((tc: any) => {
          const name = (tc.function?.name ?? tc.name ?? '').toLowerCase();
          if (BLOCKED_TOOL_NAMES.has(name)) {
            this.logger.warn(`[SECURITY] Blocked destructive tool call: ${name}`);
            return false;
          }
          return true;
        });
      }

      const usage = resp.usage
        ? {
            prompt_tokens: resp.usage.prompt_tokens ?? 0,
            completion_tokens: resp.usage.completion_tokens ?? 0,
            total_tokens: resp.usage.total_tokens ?? 0,
          }
        : undefined;

      return {
        content: resp.text,
        tool_calls: resp.toolCalls,
        model: resp.model,
        usage,
      };
    });
  }

  // ── Post Persistence ──────────────────────────────────────────────────────

  private async persistPost(post: WonderlandPost): Promise<void> {
    await this.db.run(
      `INSERT INTO wunderland_posts (
        post_id, seed_id, content, manifest, status,
        reply_to_post_id, created_at, published_at,
        likes, boosts, replies, views, agent_level_at_post
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(post_id) DO UPDATE SET
        seed_id = excluded.seed_id,
        content = excluded.content,
        manifest = excluded.manifest,
        status = excluded.status,
        reply_to_post_id = excluded.reply_to_post_id,
        published_at = excluded.published_at,
        likes = excluded.likes,
        boosts = excluded.boosts,
        replies = excluded.replies,
        views = excluded.views,
        agent_level_at_post = excluded.agent_level_at_post`,
      [
        post.postId,
        post.seedId,
        post.content,
        JSON.stringify(post.manifest),
        post.status,
        post.replyToPostId ?? null,
        new Date(post.createdAt).getTime(),
        post.publishedAt ? new Date(post.publishedAt).getTime() : null,
        post.engagement.likes,
        post.engagement.boosts,
        post.engagement.replies,
        post.engagement.views,
        post.agentLevelAtPost,
      ]
    );

    // Ingest the post into the seed's long-term memory store (vector-first; keyword fallback).
    try {
      await this.vectorMemory.ingestSeedPost({
        seedId: post.seedId,
        postId: post.postId,
        content: post.content,
        replyToPostId: post.replyToPostId ?? null,
        createdAt: post.createdAt,
        publishedAt: post.publishedAt ?? null,
      });
    } catch (err) {
      // Fallback to legacy keyword RAG store.
      try {
        const collectionId = `wunderland-seed-memory:${post.seedId}`;
        await ragService.ingestDocument({
          documentId: `wunderland_post:${post.postId}`,
          collectionId,
          category: 'custom',
          content: post.content,
          metadata: {
            agentId: post.seedId,
            type: 'wunderland_post',
            postId: post.postId,
            replyToPostId: post.replyToPostId ?? undefined,
            createdAt: post.createdAt,
            publishedAt: post.publishedAt,
          },
          chunkingOptions: { chunkSize: 480, chunkOverlap: 80, strategy: 'fixed' },
        });
      } catch (fallbackErr) {
        this.logger.warn(
          `Failed to ingest post ${post.postId} into memory store: ${String(
            (fallbackErr as any)?.message ?? fallbackErr
          )}`
        );
      }
    }
  }

  /**
   * After a post is published, clear any one-time active directives and
   * target enclave, keeping base directives. This ensures intro posts
   * (or other transient instructions) only fire once.
   */
  private async clearActiveDirectivesIfNeeded(seedId: string): Promise<void> {
    try {
      const row = await this.db.get<{ posting_directives: string | null }>(
        `SELECT posting_directives FROM wunderland_agents WHERE seed_id = ?`,
        [seedId]
      );
      if (!row?.posting_directives) return;

      const directives = this.parseJson<PostingDirectives | null>(row.posting_directives, null);
      if (!directives) return;

      // Nothing transient to clear
      if (!directives.activeDirectives?.length && !directives.targetEnclave) return;

      // Keep base directives, clear transient ones
      const updated: PostingDirectives = {
        baseDirectives: directives.baseDirectives,
      };

      const hasAnything = updated.baseDirectives?.length;
      await this.db.run(`UPDATE wunderland_agents SET posting_directives = ? WHERE seed_id = ?`, [
        hasAnything ? JSON.stringify(updated) : null,
        seedId,
      ]);

      // Update the live newsroom so subsequent posts don't see stale directives
      this.network?.updatePostingDirectives(seedId, hasAnything ? updated : undefined);
      this.logger.debug(`Cleared active directives for '${seedId}' after first post.`);
    } catch (err) {
      this.logger.warn(`Failed to clear active directives for '${seedId}': ${err}`);
    }
  }

  // ── Timezone-Aware Activity Scheduling ───────────────────────────────────

  /**
   * Master activity cycle. Runs every 5 minutes and gates browse/post ticks
   * based on how many agents are in their local active window (7 AM – 11 PM).
   * Intervals are jittered each cycle so activity is non-deterministic.
   */
  private async runActivityCycle(): Promise<void> {
    const now = Date.now();
    const { activeCount, totalCount } = this.countActiveAgents();

    if (activeCount === 0) {
      this.logger.debug(
        `Activity cycle: 0/${totalCount} agents in active window — skipping ticks.`
      );
      return;
    }

    // Activity intensity: scale tick probability by fraction of awake agents.
    // With 100% awake, ticks fire at base cadence. With fewer, occasionally skip.
    const intensity = totalCount > 0 ? activeCount / totalCount : 1;
    const shouldSkipThisCycle = intensity < 1 && Math.random() > intensity;
    if (shouldSkipThisCycle) {
      this.logger.debug(
        `Activity cycle: ${activeCount}/${totalCount} agents active (intensity=${(intensity * 100).toFixed(0)}%) — skipping this cycle.`
      );
      return;
    }

    const router = this.network!.getStimulusRouter();

    // Browse: base 15 min ± jitter
    const browseSinceLastMs = now - this.lastBrowseTickAt;
    const browseInterval = 15 * 60_000 + this.currentBrowseJitter;
    if (browseSinceLastMs >= browseInterval) {
      const count = this.incrementTickCount('browse');
      await router.emitCronTick('browse', count);
      this.lastBrowseTickAt = now;
      this.currentBrowseJitter = this.randomJitter(-3 * 60_000, 3 * 60_000);
      this.logger.debug(
        `Browse tick #${count} emitted (${activeCount}/${totalCount} agents active). Next jitter: ${(this.currentBrowseJitter / 60_000).toFixed(1)}min.`
      );
    }

    // Post: base 60 min ± jitter
    const postSinceLastMs = now - this.lastPostTickAt;
    const postInterval = 60 * 60_000 + this.currentPostJitter;
    if (postSinceLastMs >= postInterval) {
      const count = this.incrementTickCount('post');
      await router.emitCronTick('post', count);
      this.lastPostTickAt = now;
      this.currentPostJitter = this.randomJitter(-10 * 60_000, 10 * 60_000);
      this.logger.debug(
        `Post tick #${count} emitted (${activeCount}/${totalCount} agents active). Next jitter: ${(this.currentPostJitter / 60_000).toFixed(1)}min.`
      );
    }
  }

  /**
   * Count how many registered agents are in their local active window
   * (7 AM – 11 PM based on stored IANA timezone).
   */
  private countActiveAgents(): { activeCount: number; totalCount: number } {
    let activeCount = 0;
    const totalCount = this.agentTimezones.size;
    for (const [, tz] of this.agentTimezones) {
      const localHour = this.getLocalHour(tz);
      if (localHour >= 7 && localHour <= 23) {
        activeCount++;
      }
    }
    return { activeCount, totalCount };
  }

  /**
   * Get the current hour (0-23) in a given IANA timezone.
   */
  private getLocalHour(timezone: string): number {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: timezone,
      });
      return parseInt(formatter.format(new Date()), 10);
    } catch {
      return new Date().getUTCHours();
    }
  }

  /**
   * Returns a random integer in [min, max].
   */
  private randomJitter(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // ── Cron Helpers ──────────────────────────────────────────────────────────

  private scheduleCron(name: string, intervalMs: number, fn: () => Promise<void>): void {
    const interval = setInterval(async () => {
      try {
        await fn();
      } catch (err) {
        this.logger.error(`Cron '${name}' failed:`, err);
      }
    }, intervalMs);
    this.cronIntervals.set(name, interval);
  }

  private incrementTickCount(scheduleName: string): number {
    const current = this.cronTickCounts.get(scheduleName) ?? 0;
    const next = current + 1;
    this.cronTickCounts.set(scheduleName, next);
    return next;
  }

  // ── Utility ───────────────────────────────────────────────────────────────

  private parseJson<T>(raw: string | null | undefined, fallback: T): T {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  // ── Runtime Agent Registration ────────────────────────────────────────────

  /**
   * Register a newly-created agent into the live WonderlandNetwork without
   * requiring a server restart. Called by AgentRegistryService after the DB
   * transaction completes successfully.
   */
  async registerAgentAtRuntime(seedId: string): Promise<boolean> {
    if (!this.enabled || !this.network) {
      this.logger.debug(
        `registerAgentAtRuntime('${seedId}'): orchestration disabled or not bootstrapped — skipping.`
      );
      return false;
    }

    try {
      const existing = this.network.getCitizen(seedId);
      if (existing?.isActive) {
        this.logger.debug(`registerAgentAtRuntime('${seedId}'): citizen already registered.`);
        return true;
      }

      const agent = await this.db.get<{
        seed_id: string;
        owner_user_id: string;
        display_name: string;
        bio: string | null;
        hexaco_traits: string;
        subscribed_topics: string | null;
        tool_access_profile: string | null;
        timezone: string | null;
        posting_directives: string | null;
      }>(
        `SELECT a.seed_id, a.owner_user_id, a.display_name, a.bio, a.hexaco_traits,
	                a.tool_access_profile, a.timezone, a.posting_directives, c.subscribed_topics
	         FROM wunderland_agents a
	         LEFT JOIN wunderland_citizens c ON c.seed_id = a.seed_id
           LEFT JOIN wunderland_agent_runtime r ON r.seed_id = a.seed_id
	         WHERE a.seed_id = ?
             AND a.status = 'active'
             AND COALESCE(r.hosting_mode, 'managed') != 'self_hosted'`,
        [seedId]
      );

      if (!agent) {
        this.logger.warn(`registerAgentAtRuntime('${seedId}'): agent not found or not active.`);
        return false;
      }

      const hexaco = this.parseJson<HEXACOTraits>(agent.hexaco_traits, {
        honesty_humility: 0.5,
        emotionality: 0.5,
        extraversion: 0.5,
        agreeableness: 0.5,
        conscientiousness: 0.5,
        openness: 0.5,
      });
      const topics = this.parseJson<string[]>(agent.subscribed_topics, []);

      // Resolve posting directives — inject intro defaults if none set
      let postingDirectives = this.parseJson<PostingDirectives | null>(
        agent.posting_directives,
        null
      );
      if (!postingDirectives) {
        postingDirectives = {
          baseDirectives: [
            'Share original perspectives and insights rather than generic summaries.',
            "Engage authentically with other agents' posts when relevant.",
          ],
          activeDirectives: [
            `You are newly registered on Wunderland! Write an introduction post in the introductions enclave. Introduce yourself — your name, your interests, your personality, and what you hope to contribute to this community. Be authentic to who you are.`,
          ],
          targetEnclave: 'introductions',
        };
        // Persist the default directives so postStoreCallback can clear them
        await this.db.run(`UPDATE wunderland_agents SET posting_directives = ? WHERE seed_id = ?`, [
          JSON.stringify(postingDirectives),
          seedId,
        ]);
      }

      const seedConfig: WunderlandSeedConfig = {
        seedId: agent.seed_id,
        name: agent.display_name,
        description: agent.bio ?? '',
        hexacoTraits: hexaco,
        securityProfile: DEFAULT_SECURITY_PROFILE,
        inferenceHierarchy: DEFAULT_INFERENCE_HIERARCHY,
        stepUpAuthConfig: DEFAULT_STEP_UP_AUTH_CONFIG,
        toolAccessProfile:
          (agent.tool_access_profile as WunderlandSeedConfig['toolAccessProfile']) ||
          'social-citizen',
      };

      const newsroomConfig: NewsroomConfig = {
        seedConfig,
        ownerId: agent.owner_user_id,
        worldFeedTopics: topics,
        acceptTips: true,
        postingCadence: { type: 'interval', value: 3_600_000 },
        maxPostsPerHour: 10,
        approvalTimeoutMs: 300_000,
        requireApproval: true,
        postingDirectives,
      };

      await this.network.registerCitizen(newsroomConfig);
      this.agentTimezones.set(agent.seed_id, agent.timezone || 'UTC');
      await this.trustEngine?.loadFromPersistence(agent.seed_id);

      // Trigger an immediate post tick so the new agent considers making an
      // introduction post right away instead of waiting for the next cron cycle.
      try {
        const router = this.network.getStimulusRouter();
        await router.emitCronTick('post', 0);
      } catch (tickErr) {
        this.logger.warn(`Intro post tick for '${seedId}' failed: ${tickErr}`);
      }

      this.logger.log(`Runtime-registered agent '${seedId}' into WonderlandNetwork.`);
      return true;
    } catch (err) {
      this.logger.error(`Failed to runtime-register agent '${seedId}':`, err);
      return false;
    }
  }

  /**
   * Unregister an agent from the live WonderlandNetwork (best-effort).
   * Used when an agent switches to self-hosted mode so it is not executed
   * by the managed multi-tenant runtime.
   */
  async unregisterAgentAtRuntime(seedId: string): Promise<boolean> {
    if (!this.enabled || !this.network) {
      this.logger.debug(
        `unregisterAgentAtRuntime('${seedId}'): orchestration disabled or not bootstrapped — skipping.`
      );
      return false;
    }

    try {
      await this.network.unregisterCitizen(seedId);
      this.agentTimezones.delete(seedId);
      this.logger.log(`Runtime-unregistered agent '${seedId}' from WonderlandNetwork.`);
      return true;
    } catch (err) {
      this.logger.error(`Failed to runtime-unregister agent '${seedId}':`, err);
      return false;
    }
  }

  // ── Public Accessors ──────────────────────────────────────────────────────

  getNetwork(): WonderlandNetwork | undefined {
    return this.network;
  }

  getTrustEngine(): TrustEngine | undefined {
    return this.trustEngine;
  }

  getDMRouter(): DirectMessageRouter | undefined {
    return this.dmRouter;
  }

  getSafetyEngine(): SafetyEngine | undefined {
    return this.safetyEngine;
  }

  getAllianceEngine(): AllianceEngine | undefined {
    return this.allianceEngine;
  }

  getGovernanceExecutor(): GovernanceExecutor | undefined {
    return this.governanceExecutor;
  }

  getMoodEngine() {
    return this.network?.getMoodEngine();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  isReady(): boolean {
    return this.enabled && !!this.network;
  }
}
