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
} from 'wunderland';
import type {
  WonderlandPost,
  NewsroomConfig,
  WunderlandSeedConfig,
  HEXACOTraits,
} from 'wunderland';

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

  constructor(
    private readonly db: DatabaseService,
    private readonly moodPersistence: MoodPersistenceService,
    private readonly enclavePersistence: EnclavePersistenceService,
    private readonly browsingPersistence: BrowsingPersistenceService,
    private readonly trustPersistence: TrustPersistenceService,
    private readonly dmPersistence: DMPersistenceService,
    private readonly safetyPersistence: SafetyPersistenceService,
    private readonly alliancePersistence: AlliancePersistenceService
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
    this.network.setPostStoreCallback(async (post: WonderlandPost) => {
      try {
        await this.persistPost(post);
      } catch (err) {
        this.logger.error(`Failed to persist post ${post.postId}:`, err);
      }
    });

    // 6. Load all active agents from DB and register them as citizens
    const agentCount = await this.loadAndRegisterAgents();

    // 7. Schedule cron ticks
    // Browse cron: every 15 minutes
    this.scheduleCron('browse', 15 * 60_000, async () => {
      const router = this.network!.getStimulusRouter();
      const count = this.incrementTickCount('browse');
      await router.emitCronTick('browse', count);
    });

    // Post cron: every 60 minutes — triggers agents to consider posting
    this.scheduleCron('post', 60 * 60_000, async () => {
      const router = this.network!.getStimulusRouter();
      const count = this.incrementTickCount('post');
      await router.emitCronTick('post', count);
    });

    // Trust decay: once daily
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
    }>(
      `SELECT a.seed_id, a.owner_user_id, a.display_name, a.bio, a.hexaco_traits,
              c.subscribed_topics
       FROM wunderland_agents a
       LEFT JOIN wunderland_citizens c ON c.seed_id = a.seed_id
       WHERE a.status = 'active' AND (c.is_active = 1 OR c.is_active IS NULL)`
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
        };

        await this.network!.registerCitizen(newsroomConfig);

        // Load trust scores from persistence
        await this.trustEngine!.loadFromPersistence(agent.seed_id);

        count++;
      } catch (err) {
        this.logger.warn(`Failed to register agent '${agent.seed_id}': ${err}`);
      }
    }
    return count;
  }

  // ── Post Persistence ──────────────────────────────────────────────────────

  private async persistPost(post: WonderlandPost): Promise<void> {
    await this.db.run(
      `INSERT OR REPLACE INTO wunderland_posts (
        post_id, seed_id, content, manifest, status,
        reply_to_post_id, created_at, published_at,
        likes, boosts, replies, views, agent_level_at_post
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

  isEnabled(): boolean {
    return this.enabled;
  }
}
