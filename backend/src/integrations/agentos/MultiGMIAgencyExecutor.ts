/**
 * @fileoverview Multi-GMI Agency Workflow Executor
 * @description Coordinates multiple persona seats by invoking AgentOS for each role and
 * streaming back Agency/Workflow chunks in real time.
 */

import { v4 as uuidv4 } from 'uuid';
import type { AgentOS, AgentOSInput, AgentOSResponse } from '@framers/agentos';
import { AgentOSResponseChunkType, type AgentOSAgencyUpdateChunk } from '@framers/agentos';
import type { CostAggregator } from '@framers/agentos/cognitive_substrate/IGMI';

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
}

export interface MultiGMIAgencyExecutorDependencies {
  agentOS: AgentOS;
  onChunk?: (chunk: AgentOSResponse) => Promise<void> | void;
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

  constructor(deps: MultiGMIAgencyExecutorDependencies) {
    this.deps = deps;
  }

  /**
   * Executes an agency workflow by invoking AgentOS for every seat.
   */
  public async executeAgency(input: AgencyExecutionInput): Promise<AgencyExecutionResult> {
    const startTime = Date.now();
    const agencyId = `agency_${uuidv4()}`;
    const seatMap = new Map<string, SeatSnapshot>();

    input.roles.forEach((role) => {
      seatMap.set(role.roleId, {
        roleId: role.roleId,
        personaId: role.personaId,
        status: 'pending',
        metadata: role.metadata,
      });
    });

    await this.emitAgencyUpdate(agencyId, input.conversationId, seatMap, { goal: input.goal, status: 'pending' });

    const participants = input.roles.map((role) => ({ roleId: role.roleId, personaId: role.personaId }));
    const factories = input.roles.map((role) => async () => {
      await this.updateSeatStatus(agencyId, input.conversationId, seatMap, role.roleId, 'running');

      try {
        const result = await this.executeSeat({
          role,
          agencyId,
          goal: input.goal,
          userId: input.userId,
          conversationId: input.conversationId,
          workflowDefinitionId: input.workflowDefinitionId,
          participants,
          metadata: input.metadata,
        });

        seatMap.set(role.roleId, {
          roleId: role.roleId,
          personaId: role.personaId,
          gmiInstanceId: result.gmiInstanceId,
          status: result.error ? 'failed' : 'completed',
          metadata: { ...role.metadata, error: result.error },
        });
        await this.updateSeatStatus(agencyId, input.conversationId, seatMap, role.roleId, result.error ? 'failed' : 'completed');
        return result;
      } catch (error) {
        seatMap.set(role.roleId, {
          roleId: role.roleId,
          personaId: role.personaId,
          status: 'failed',
          metadata: { ...role.metadata, error: error instanceof Error ? error.message : String(error) },
        });
        await this.updateSeatStatus(agencyId, input.conversationId, seatMap, role.roleId, 'failed');
        return {
          roleId: role.roleId,
          personaId: role.personaId,
          gmiInstanceId: `gmi_failed_${uuidv4()}`,
          output: '',
          error: error instanceof Error ? error.message : String(error),
        };
      }
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
    };

    return result;
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

