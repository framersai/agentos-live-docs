/**
 * @fileoverview Multi-GMI Agency Workflow Executor
 * @description Coordinates multiple persona seats by invoking AgentOS for each role and
 * streaming back Agency/Workflow chunks in real time. Supports emergent behavior with
 * dynamic task decomposition and adaptive role spawning.
 */

import { generateUniqueId as uuidv4 } from '../../utils/ids.js';
import type { AgentOS, AgentOSInput, AgentOSResponse } from '@framers/agentos';
import { AgentOSResponseChunkType, type AgentOSAgencyUpdateChunk } from '@framers/agentos';
import type { CostAggregator } from '@framers/agentos/cognitive_substrate/IGMI';
import { EmergentAgencyCoordinator, type EmergentTask, type EmergentRole } from './EmergentAgencyCoordinator.js';
import {
  createAgencyExecution,
  updateAgencyExecution,
  markAgencyExecutionFailed,
  createAgencySeat,
  updateAgencySeat,
} from './agencyPersistence.service.js';

/** Captures the configuration for a single agency seat. */
export interface AgentRoleConfig {
  roleId: string;
  personaId: string;
  instruction: string;
  priority?: number;
  metadata?: Record<string, unknown>;
}

/** Input payload when launching a multi-seat execution. */
export interface AgencyExecutionInput {
  goal: string;
  roles: AgentRoleConfig[];
  userId: string;
  conversationId: string;
  workflowDefinitionId?: string;
  outputFormat?: 'json' | 'csv' | 'markdown' | 'text';
  metadata?: Record<string, unknown>;
  /** Enable emergent behavior: dynamic task decomposition and role spawning */
  enableEmergentBehavior?: boolean;
}

interface GmiExecutionResult {
  roleId: string;
  personaId: string;
  gmiInstanceId: string;
  output: string;
  usage?: CostAggregator;
  metadata?: Record<string, unknown>;
  error?: string;
}

/** Aggregated result returned to callers. */
export interface AgencyExecutionResult {
  agencyId: string;
  goal: string;
  gmiResults: GmiExecutionResult[];
  consolidatedOutput: string;
  formattedOutput?: {
    format: 'json' | 'csv' | 'markdown' | 'text';
    content: string;
  };
  durationMs: number;
  totalUsage: CostAggregator;
  /** Emergent behavior metadata */
  emergentMetadata?: {
    tasksDecomposed: EmergentTask[];
    rolesSpawned: EmergentRole[];
    coordinationLog: Array<{ timestamp: string; roleId: string; action: string; details: Record<string, unknown> }>;
  };
}

export interface MultiGMIAgencyExecutorDependencies {
  agentOS: AgentOS;
  onChunk?: (chunk: AgentOSResponse) => Promise<void> | void;
  /** Maximum retry attempts for failed tasks (default: 2) */
  maxRetries?: number;
  /** Delay between retries in ms (default: 1000) */
  retryDelayMs?: number;
}

interface SeatSnapshot {
  roleId: string;
  personaId: string;
  gmiInstanceId?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  metadata?: Record<string, unknown>;
}

/** Utility function limiting concurrency for async tasks. */
async function runWithConcurrency<T>(factories: Array<() => Promise<T>>, limit: number): Promise<T[]> {
  const results: T[] = new Array(factories.length);
  let cursor = 0;

  const worker = async (): Promise<void> => {
    while (true) {
      const current = cursor++;
      if (current >= factories.length) {
        break;
      }
      results[current] = await factories[current]();
    }
  };

  const workers = Array.from({ length: Math.min(limit, factories.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export class MultiGMIAgencyExecutor {
  private readonly deps: MultiGMIAgencyExecutorDependencies;
  private readonly emergentCoordinator: EmergentAgencyCoordinator;
  private readonly maxRetries: number;
  private readonly retryDelayMs: number;

  constructor(deps: MultiGMIAgencyExecutorDependencies) {
    this.deps = deps;
    this.emergentCoordinator = new EmergentAgencyCoordinator({ agentOS: deps.agentOS });
    this.maxRetries = deps.maxRetries ?? 2;
    this.retryDelayMs = deps.retryDelayMs ?? 1000;
  }

  /**
   * Executes an agency workflow by invoking AgentOS for every seat.
   * Supports emergent behavior with dynamic task decomposition and role spawning.
   */
  public async executeAgency(input: AgencyExecutionInput): Promise<AgencyExecutionResult> {
    const startTime = Date.now();
    const agencyId = `agency_${uuidv4()}`;
    
    // Persist initial agency state
    try {
      await createAgencyExecution({
        agencyId,
        userId: input.userId,
        conversationId: input.conversationId,
        goal: input.goal,
        workflowDefinitionId: input.workflowDefinitionId,
      });
    } catch (error) {
      console.error(`[MultiGMIAgencyExecutor] Failed to persist agency ${agencyId}:`, error);
      // Continue execution even if persistence fails
    }

    let tasks: EmergentTask[] = [];
    let effectiveRoles: AgentRoleConfig[] = input.roles;
    let emergentMetadata: AgencyExecutionResult['emergentMetadata'];

    // If emergent behavior is enabled, decompose goal and assign roles dynamically
    if (input.enableEmergentBehavior) {
      console.log(`[MultiGMIAgencyExecutor] Enabling emergent behavior for agency ${agencyId}`);
      const emergentResult = await this.emergentCoordinator.transformToEmergentAgency(input);
      tasks = emergentResult.tasks;
      effectiveRoles = emergentResult.roles;
      
      emergentMetadata = {
        tasksDecomposed: tasks,
        rolesSpawned: emergentResult.roles,
        coordinationLog: emergentResult.context.coordinationLog,
      };

      console.log(`[MultiGMIAgencyExecutor] Decomposed into ${tasks.length} tasks, spawned ${effectiveRoles.length} roles`);
    }

    const seatMap = new Map<string, SeatSnapshot>();
    effectiveRoles.forEach((role) => {
      seatMap.set(role.roleId, {
        roleId: role.roleId,
        personaId: role.personaId,
        status: 'pending',
        metadata: role.metadata,
      });
    });

    // Create seat records in database
    for (const role of effectiveRoles) {
      try {
        await createAgencySeat({ agencyId, roleId: role.roleId, personaId: role.personaId });
      } catch (error) {
        console.error(`[MultiGMIAgencyExecutor] Failed to persist seat ${role.roleId}:`, error);
      }
    }

    await this.emitAgencyUpdate(agencyId, input.conversationId, seatMap, { goal: input.goal, status: 'pending' });

    const participants = effectiveRoles.map((role) => ({ roleId: role.roleId, personaId: role.personaId }));
    const factories = effectiveRoles.map((role) => async () => {
      return await this.executeSeatWithRetry({
        role,
        agencyId,
        goal: input.goal,
        userId: input.userId,
        conversationId: input.conversationId,
        workflowDefinitionId: input.workflowDefinitionId,
        participants,
        metadata: input.metadata,
        seatMap,
      });
    });

    const concurrencyLimit = Math.min(4, Math.max(1, factories.length));
    const gmiResults = await runWithConcurrency(factories, concurrencyLimit);

    const consolidatedOutput = this.consolidateOutputs(gmiResults, input.outputFormat ?? 'markdown');
    const formattedOutput = this.formatOutput(gmiResults, input.outputFormat ?? 'markdown');
    const totalUsage = this.aggregateUsage(gmiResults);

    await this.emitAgencyUpdate(agencyId, input.conversationId, seatMap, {
      goal: input.goal,
      status: 'completed',
    });

    const result: AgencyExecutionResult = {
      agencyId,
      goal: input.goal,
      gmiResults,
      consolidatedOutput,
      formattedOutput,
      durationMs: Date.now() - startTime,
      totalUsage,
      emergentMetadata,
    };

    // Persist final results
    try {
      await updateAgencyExecution(result);
    } catch (error) {
      console.error(`[MultiGMIAgencyExecutor] Failed to persist results for agency ${agencyId}:`, error);
    }

    // Cleanup emergent context if used
    if (input.enableEmergentBehavior) {
      this.emergentCoordinator.cleanupContext(agencyId);
    }

    return result;
  }

  /**
   * Executes a seat with automatic retry logic on failure
   */
  private async executeSeatWithRetry(params: {
    role: AgentRoleConfig;
    agencyId: string;
    goal: string;
    userId: string;
    conversationId: string;
    workflowDefinitionId?: string;
    participants: Array<{ roleId: string; personaId?: string }>;
    metadata?: Record<string, unknown>;
    seatMap: Map<string, SeatSnapshot>;
  }): Promise<GmiExecutionResult> {
    const { role, agencyId, conversationId, seatMap } = params;
    const seatId = `seat_${agencyId}_${role.roleId}`;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        await this.updateSeatStatus(agencyId, conversationId, seatMap, role.roleId, 'running');
        
        // Persist seat status update
        try {
          await updateAgencySeat({
            seatId,
            status: 'running',
            startedAt: Date.now(),
            retryCount: attempt,
          });
        } catch (error) {
          console.error(`[MultiGMIAgencyExecutor] Failed to persist seat status for ${seatId}:`, error);
        }

        const result = await this.executeSeat({
          role: params.role,
          agencyId: params.agencyId,
          goal: params.goal,
          userId: params.userId,
          conversationId: params.conversationId,
          workflowDefinitionId: params.workflowDefinitionId,
          participants: params.participants,
          metadata: params.metadata,
        });

        // Success - update seat status
        seatMap.set(role.roleId, {
          roleId: role.roleId,
          personaId: role.personaId,
          gmiInstanceId: result.gmiInstanceId,
          status: result.error ? 'failed' : 'completed',
          metadata: { ...role.metadata, error: result.error, attempts: attempt + 1 },
        });
        await this.updateSeatStatus(agencyId, conversationId, seatMap, role.roleId, result.error ? 'failed' : 'completed');
        
        // Persist seat results
        try {
          await updateAgencySeat({
            seatId,
            gmiInstanceId: result.gmiInstanceId,
            status: result.error ? 'failed' : 'completed',
            completedAt: Date.now(),
            output: result.output,
            error: result.error,
            usageTokens: result.usage?.totalTokens,
            usageCostUsd: result.usage?.totalCostUSD,
            retryCount: attempt,
          });
        } catch (error) {
          console.error(`[MultiGMIAgencyExecutor] Failed to persist seat results for ${seatId}:`, error);
        }
        
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`[MultiGMIAgencyExecutor] Seat ${role.roleId} failed (attempt ${attempt + 1}/${this.maxRetries + 1}):`, lastError.message);

        if (attempt < this.maxRetries) {
          console.log(`[MultiGMIAgencyExecutor] Retrying seat ${role.roleId} after ${this.retryDelayMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, this.retryDelayMs));
        }
      }
    }

    // All retries exhausted - mark as failed
    const errorMessage = lastError?.message ?? 'Unknown error';
    seatMap.set(role.roleId, {
      roleId: role.roleId,
      personaId: role.personaId,
      status: 'failed',
      metadata: { ...role.metadata, error: errorMessage, attempts: this.maxRetries + 1 },
    });
    await this.updateSeatStatus(agencyId, conversationId, seatMap, role.roleId, 'failed');

    // Persist final failure state
    try {
      await updateAgencySeat({
        seatId,
        status: 'failed',
        completedAt: Date.now(),
        error: errorMessage,
        retryCount: this.maxRetries,
      });
    } catch (error) {
      console.error(`[MultiGMIAgencyExecutor] Failed to persist seat failure for ${seatId}:`, error);
    }

    return {
      roleId: role.roleId,
      personaId: role.personaId,
      gmiInstanceId: `gmi_failed_${uuidv4()}`,
      output: '',
      error: errorMessage,
      metadata: { attempts: this.maxRetries + 1 },
    };
  }

  private async executeSeat(params: {
    role: AgentRoleConfig;
    agencyId: string;
    goal: string;
    userId: string;
    conversationId: string;
    workflowDefinitionId?: string;
    participants: Array<{ roleId: string; personaId?: string }>;
    metadata?: Record<string, unknown>;
  }): Promise<GmiExecutionResult> {
    const { role, agencyId, goal, userId, conversationId } = params;
    const seatSessionId = `${conversationId}:${role.roleId}:${uuidv4()}`;
    const instruction = `You are participating in a multi-agent agency.
Goal: ${goal}
Role (${role.roleId}): ${role.instruction}`;

    const agentosInput: AgentOSInput = {
      userId,
      sessionId: seatSessionId,
      conversationId,
      selectedPersonaId: role.personaId,
      textInput: instruction,
      options: { streamUICommands: true },
      agencyRequest: {
        agencyId,
        goal,
        metadata: params.metadata,
        participants: params.participants,
      },
      workflowRequest: params.workflowDefinitionId
        ? {
            definitionId: params.workflowDefinitionId,
            workflowId: `${params.workflowDefinitionId}-${agencyId}`,
            conversationId,
          }
        : undefined,
    };

    let aggregatedText = '';
    let finalResponseText: string | null = null;
    let usage: CostAggregator | undefined;
    let gmiInstanceId = `gmi_${role.roleId}_${uuidv4()}`;

    const stream = this.deps.agentOS.processRequest(agentosInput);
    for await (const chunk of stream) {
      gmiInstanceId = chunk.gmiInstanceId ?? gmiInstanceId;

      switch (chunk.type) {
        case AgentOSResponseChunkType.TEXT_DELTA:
          aggregatedText += chunk.textDelta ?? '';
          break;
        case AgentOSResponseChunkType.FINAL_RESPONSE:
          finalResponseText = chunk.finalResponseText ?? finalResponseText;
          usage = chunk.usage ?? usage;
          break;
        default:
          break;
      }

      await this.deps.onChunk?.(chunk);
    }

    const output = (finalResponseText ?? aggregatedText).trim();
    return {
      roleId: role.roleId,
      personaId: role.personaId,
      gmiInstanceId,
      output,
      usage,
      metadata: role.metadata,
    };
  }

  private async updateSeatStatus(
    agencyId: string,
    conversationId: string,
    seatMap: Map<string, SeatSnapshot>,
    roleId: string,
    status: SeatSnapshot['status'],
  ): Promise<void> {
    const snapshot = seatMap.get(roleId);
    if (!snapshot) {
      return;
    }
    snapshot.status = status;
    seatMap.set(roleId, snapshot);
    await this.emitAgencyUpdate(agencyId, conversationId, seatMap);
  }

  private async emitAgencyUpdate(
    agencyId: string,
    conversationId: string,
    seatMap: Map<string, SeatSnapshot>,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    if (!this.deps.onChunk) {
      return;
    }

    const seats = Array.from(seatMap.values()).map((seat) => ({
      roleId: seat.roleId,
      personaId: seat.personaId,
      gmiInstanceId: seat.gmiInstanceId ?? 'pending',
      metadata: { ...seat.metadata, status: seat.status },
    }));

    const allTerminal = seats.every((seat) => {
      const status = (seat.metadata?.status as string | undefined) ?? 'pending';
      return status === 'completed' || status === 'failed';
    });

    const chunk: AgentOSAgencyUpdateChunk = {
      type: AgentOSResponseChunkType.AGENCY_UPDATE,
      streamId: conversationId,
      gmiInstanceId: `agency:${agencyId}`,
      personaId: `agency:${agencyId}`,
      isFinal: allTerminal,
      timestamp: new Date().toISOString(),
      agency: {
        agencyId,
        workflowId: (typeof metadata?.workflowId === 'string' ? (metadata!.workflowId as string) : `workflow:${agencyId}`),
        conversationId,
        seats,
        metadata,
      },
    };

    await this.deps.onChunk(chunk);
  }

  private consolidateOutputs(results: GmiExecutionResult[], format: string): string {
    const sections = results.map((result) => {
      const header = `## ${result.roleId.toUpperCase().replace(/_/g, ' ')}`;
      const persona = `*Persona: ${result.personaId}*`;
      const body = result.error ? `**Warning:** ${result.error}` : result.output;
      return `${header}\n${persona}\n\n${body}`;
    });
    return `# Agency Coordination Results\n\n${sections.join('\n\n---\n\n')}`;
  }

  private formatOutput(results: GmiExecutionResult[], format: 'json' | 'csv' | 'markdown' | 'text') {
    switch (format) {
      case 'json':
        return { format: 'json' as const, content: JSON.stringify(results, null, 2) };
      case 'csv': {
        const rows = results.map(
          (r) =>
            `"${r.roleId.replace(/"/g, '""')}","${r.personaId.replace(/"/g, '""')}","${
              r.error ? 'failed' : 'success'
            }","${(r.output || r.error || '').replace(/"/g, '""')}"`,
        );
        return {
          format: 'csv' as const,
          content: ['roleId,personaId,status,output', ...rows].join('\n'),
        };
      }
      case 'markdown':
        return { format: 'markdown' as const, content: this.consolidateOutputs(results, 'markdown') };
      case 'text':
      default:
        return {
          format: 'text' as const,
          content: results.map((r) => `[${r.roleId}] ${r.output || r.error || ''}`).join('\n\n'),
        };
    }
  }

  private aggregateUsage(results: GmiExecutionResult[]): CostAggregator {
    return results.reduce<CostAggregator>(
      (acc, result) => ({
        promptTokens: (acc.promptTokens ?? 0) + (result.usage?.promptTokens ?? 0),
        completionTokens: (acc.completionTokens ?? 0) + (result.usage?.completionTokens ?? 0),
        totalTokens: (acc.totalTokens ?? 0) + (result.usage?.totalTokens ?? 0),
        totalCostUSD: (acc.totalCostUSD ?? 0) + (result.usage?.totalCostUSD ?? 0),
      }),
      { promptTokens: 0, completionTokens: 0, totalTokens: 0, totalCostUSD: 0 },
    );
  }
}

