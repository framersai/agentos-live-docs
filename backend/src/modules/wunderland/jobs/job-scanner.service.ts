/**
 * @file job-scanner.service.ts
 * @description Runs JobScanner for active agents to autonomously evaluate and bid on jobs.
 *
 * Features:
 * - Instantiates JobScanner for each active agent
 * - Connects to MoodEngine for personality + mood-based decisions
 * - Wires JobMemoryService with RAG for learning from past jobs
 * - Submits bids on-chain via Solana program
 * - Persists AgentJobState to database
 */

import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  JobScanner,
  JobEvaluator,
  JobMemoryService,
  createAgentJobState,
  incrementWorkload,
  decrementWorkload,
  recordJobOutcome,
} from 'wunderland';
import type { AgentJobState, Job, AgentProfile, JobEvaluationResult } from 'wunderland';
import { OrchestrationService } from '../orchestration/orchestration.service';
import { WunderlandVectorMemoryService } from '../orchestration/wunderland-vector-memory.service';

interface AgentScannerInstance {
  scanner: JobScanner;
  state: AgentJobState;
  profile: AgentProfile;
  displayName: string; // For logging and status reporting
}

@Injectable()
export class JobScannerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('JobScannerService');
  private readonly enabled: boolean;
  private scanners: Map<string, AgentScannerInstance> = new Map();
  private jobMemoryService?: JobMemoryService;

  constructor(
    private readonly db: DatabaseService,
    private readonly orchestration: OrchestrationService,
    private readonly vectorMemory: WunderlandVectorMemoryService
  ) {
    this.enabled = process.env.ENABLE_JOB_SCANNING === 'true';
  }

  async onModuleInit(): Promise<void> {
    if (!this.enabled) {
      this.logger.log('Job scanning disabled (ENABLE_JOB_SCANNING != true).');
      return;
    }

    // Wait for orchestration to be ready (has MoodEngine)
    if (!this.orchestration.isReady()) {
      this.logger.warn('Orchestration not ready, job scanning will be limited.');
    }

    // Initialize JobMemoryService if RAG is available
    if (this.vectorMemory.isAvailable()) {
      const ragAugmentor = await this.vectorMemory.getRetrievalAugmentor();
      if (ragAugmentor) {
        this.jobMemoryService = new JobMemoryService(ragAugmentor);
        this.logger.log('JobMemoryService initialized with RAG.');
      }
    } else {
      this.logger.warn('Vector memory not available, JobScanner will run without RAG.');
    }

    // Load active agents and start scanners
    await this.startScannersForActiveAgents();

    this.logger.log(`Job scanning enabled for ${this.scanners.size} agents.`);
  }

  async onModuleDestroy(): Promise<void> {
    // Stop all scanners
    for (const [seedId, instance] of this.scanners.entries()) {
      instance.scanner.stop();
      await this.saveAgentJobState(seedId, instance.state);
    }
    this.scanners.clear();
  }

  private async startScannersForActiveAgents(): Promise<void> {
    // Query active agents from database
    const agents = await this.db.all<{
      seed_id: string;
      display_name: string;
      hexaco_traits: string;
      status: string;
    }>(
      `SELECT seed_id, display_name, hexaco_traits, status
       FROM wunderland_agents
       WHERE status = 'active'
       LIMIT 50`
    );

    for (const agent of agents) {
      try {
        await this.startScannerForAgent({
          seedId: agent.seed_id,
          displayName: agent.display_name,
          level: 1, // Default level (can be computed from job history later)
          reputation: 50, // Default reputation
          hexacoTraits: JSON.parse(agent.hexaco_traits || '{}'),
        });
      } catch (err) {
        this.logger.error(`Failed to start scanner for ${agent.seed_id}: ${err}`);
      }
    }
  }

  private async startScannerForAgent(agent: {
    seedId: string;
    displayName: string;
    level: number;
    reputation: number;
    hexacoTraits: any;
  }): Promise<void> {
    // Load or create AgentJobState
    const state = await this.loadOrCreateAgentJobState(agent.seedId, agent.level, agent.reputation);

    // Get MoodEngine from orchestration
    const moodEngine = this.orchestration.getMoodEngine();
    if (!moodEngine) {
      this.logger.warn(`MoodEngine not available for ${agent.seedId}, using default behavior.`);
      return;
    }

    // Create AgentProfile
    const profile: AgentProfile = {
      seedId: agent.seedId,
      level: agent.level,
      reputation: agent.reputation,
      hexaco: {
        honesty_humility: agent.hexacoTraits.honesty_humility || 0.5,
        emotionality: agent.hexacoTraits.emotionality || 0.5,
        extraversion: agent.hexacoTraits.extraversion || 0.5,
        agreeableness: agent.hexacoTraits.agreeableness || 0.5,
        conscientiousness: agent.hexacoTraits.conscientiousness || 0.5,
        openness: agent.hexacoTraits.openness || 0.5,
      },
      completedJobs: 0, // Will be computed from job state
      averageRating: 0, // Will be computed from job state
    };

    // Create JobScanner with RAG-enhanced evaluation
    const scanner = new JobScanner(
      {
        jobsApiUrl:
          process.env.WUNDERLAND_JOBS_API_URL || 'http://localhost:3100/api/wunderland/jobs',
        baseIntervalMs: 30_000,
        enableAdaptivePolling: true,
        maxActiveBids: 5,
        onBidDecision: async (job: Job, evaluation: JobEvaluationResult) => {
          await this.handleBidDecision(agent.seedId, job, evaluation, state);
        },
      },
      moodEngine,
      agent.seedId,
      this.jobMemoryService // Pass RAG for learning from past jobs
    );

    // Start scanning
    scanner.start(profile, state);

    // Store instance
    this.scanners.set(agent.seedId, { scanner, state, profile, displayName: agent.displayName });

    this.logger.log(`Started JobScanner for agent ${agent.seedId} (${agent.displayName})`);
  }

  private async loadOrCreateAgentJobState(
    seedId: string,
    level: number,
    reputation: number
  ): Promise<AgentJobState> {
    // Try to load from database
    const rows = await this.db.all<{
      active_job_count: number;
      bandwidth: number;
      min_acceptable_rate_per_hour: number;
      preferred_categories: string;
      recent_outcomes: string;
      risk_tolerance: number;
      total_jobs_evaluated: number;
      total_jobs_bid_on: number;
      total_jobs_completed: number;
      success_rate: number;
    }>(`SELECT * FROM wunderland_agent_job_states WHERE seed_id = ? LIMIT 1`, [seedId]);

    if (rows.length > 0) {
      const row = rows[0];
      return {
        seedId,
        activeJobCount: row.active_job_count,
        bandwidth: row.bandwidth,
        minAcceptableRatePerHour: row.min_acceptable_rate_per_hour,
        preferredCategories: new Map(JSON.parse(row.preferred_categories || '[]')),
        recentOutcomes: JSON.parse(row.recent_outcomes || '[]'),
        riskTolerance: row.risk_tolerance,
        totalJobsEvaluated: row.total_jobs_evaluated,
        totalJobsBidOn: row.total_jobs_bid_on,
        totalJobsCompleted: row.total_jobs_completed,
        successRate: row.success_rate,
      };
    }

    // Create new state
    return createAgentJobState(seedId, level, reputation);
  }

  private async saveAgentJobState(seedId: string, state: AgentJobState): Promise<void> {
    const now = Date.now();
    await this.db.run(
      `INSERT INTO wunderland_agent_job_states (
        seed_id, active_job_count, bandwidth, min_acceptable_rate_per_hour,
        preferred_categories, recent_outcomes, risk_tolerance,
        total_jobs_evaluated, total_jobs_bid_on, total_jobs_completed, success_rate,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(seed_id) DO UPDATE SET
        active_job_count = excluded.active_job_count,
        bandwidth = excluded.bandwidth,
        min_acceptable_rate_per_hour = excluded.min_acceptable_rate_per_hour,
        preferred_categories = excluded.preferred_categories,
        recent_outcomes = excluded.recent_outcomes,
        risk_tolerance = excluded.risk_tolerance,
        total_jobs_evaluated = excluded.total_jobs_evaluated,
        total_jobs_bid_on = excluded.total_jobs_bid_on,
        total_jobs_completed = excluded.total_jobs_completed,
        success_rate = excluded.success_rate,
        updated_at = excluded.updated_at`,
      [
        seedId,
        state.activeJobCount,
        state.bandwidth,
        state.minAcceptableRatePerHour,
        JSON.stringify(Array.from(state.preferredCategories.entries())),
        JSON.stringify(state.recentOutcomes),
        state.riskTolerance,
        state.totalJobsEvaluated,
        state.totalJobsBidOn,
        state.totalJobsCompleted,
        state.successRate,
        now,
        now,
      ]
    );
  }

  private async handleBidDecision(
    seedId: string,
    job: Job,
    evaluation: JobEvaluationResult,
    state: AgentJobState
  ): Promise<void> {
    this.logger.log(
      `Agent ${seedId} decided to bid on job ${job.id}: ${evaluation.recommendedBidAmount} lamports (score: ${evaluation.jobScore.toFixed(2)})`
    );

    // TODO: Implement actual Solana bid submission via wunderland-sol.service
    // For now, just log the decision

    // Update state
    incrementWorkload(state);
    await this.saveAgentJobState(seedId, state);

    // TODO: Store bid in database for tracking
  }

  /**
   * Record job outcome and store in RAG for future learning
   */
  async recordJobCompletion(input: {
    seedId: string;
    jobId: string;
    title: string;
    description: string;
    category: string;
    budgetLamports: number;
    success: boolean;
    completionTimeMs: number;
    actualHours?: number;
    rating?: number;
  }): Promise<void> {
    const instance = this.scanners.get(input.seedId);
    if (!instance) {
      this.logger.warn(`No scanner instance for ${input.seedId}`);
      return;
    }

    // Update AgentJobState
    recordJobOutcome(instance.state, {
      jobId: input.jobId,
      category: input.category,
      budgetLamports: input.budgetLamports,
      success: input.success,
      timestamp: Date.now(),
      completionTimeMs: input.completionTimeMs,
    });

    decrementWorkload(instance.state);
    await this.saveAgentJobState(input.seedId, instance.state);

    // Store in RAG if available
    if (this.jobMemoryService) {
      await this.jobMemoryService.storeJobOutcome({
        jobId: input.jobId,
        agentId: input.seedId,
        title: input.title,
        description: input.description,
        category: input.category,
        budgetLamports: input.budgetLamports,
        success: input.success,
        completedAt: Date.now(),
        actualHours: input.actualHours,
        rating: input.rating,
      });

      this.logger.log(`Stored job outcome in RAG for agent ${input.seedId}: ${input.jobId}`);
    }
  }

  /**
   * Get current status of all scanners
   */
  getStatus(): Array<{
    seedId: string;
    displayName: string;
    isRunning: boolean;
    activeBids: number;
    totalEvaluated: number;
    totalBids: number;
    successRate: number;
  }> {
    return Array.from(this.scanners.entries()).map(([seedId, instance]) => ({
      seedId,
      displayName: instance.displayName,
      isRunning: instance.scanner.getStatus().isRunning,
      activeBids: instance.scanner.getStatus().activeBids,
      totalEvaluated: instance.state.totalJobsEvaluated,
      totalBids: instance.state.totalJobsBidOn,
      successRate: instance.state.successRate,
    }));
  }
}
