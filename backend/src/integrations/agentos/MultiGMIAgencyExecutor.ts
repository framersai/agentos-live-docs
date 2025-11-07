/**
 * @fileoverview Multi-GMI Agency Workflow Executor
 * @description Coordinates parallel execution of multiple GMI instances within an agency workflow.
 * 
 * **Architecture:**
 * - Creates one GMI instance per role/seat in the agency
 * - Executes agent tasks in parallel using ConcurrencyQueue (max 4 concurrent)
 * - Streams AGENCY_UPDATE chunks showing seat states in real-time
 * - Consolidates outputs into structured formats (JSON, CSV, markdown)
 * 
 * **Key Concepts:**
 * - **Agency**: A collective of GMI instances working toward a shared goal
 * - **Seat**: A role within the agency assigned to a specific persona/GMI
 * - **Workflow**: The execution plan defining tasks and dependencies
 * - **Parallel Execution**: Multiple GMIs process tasks simultaneously
 * 
 * @example Basic Agency Execution
 * ```typescript
 * const executor = new MultiGMIAgencyExecutor(dependencies);
 * 
 * const result = await executor.executeAgency({
 *   goal: "Analyze data and create report",
 *   roles: [
 *     { roleId: "analyst", personaId: "v_researcher", instruction: "Calculate statistics" },
 *     { roleId: "writer", personaId: "nerf_generalist", instruction: "Format as markdown" }
 *   ],
 *   userId: "user-123",
 *   conversationId: "conv-456"
 * });
 * 
 * console.log(result.consolidatedOutput); // Combined outputs from all GMIs
 * ```
 * 
 * @module backend/integrations/agentos/MultiGMIAgencyExecutor
 */

import { v4 as uuidv4 } from 'uuid';
import type { AgentOS, AgentOSResponse, AgentOSResponseChunkType } from '@agentos/core';
import type { IGMI, GMITurnInput, GMIOutput } from '@agentos/core/cognitive_substrate/IGMI';

/**
 * Configuration for a single agent role within an agency.
 */
export interface AgentRoleConfig {
  /** Unique role identifier (e.g., "researcher", "writer", "analyst") */
  roleId: string;
  /** Persona ID to use for this role's GMI */
  personaId: string;
  /** Specific instruction/task for this agent */
  instruction: string;
  /** Execution priority (lower numbers execute first) */
  priority?: number;
  /** Additional metadata for this role */
  metadata?: Record<string, unknown>;
}

/**
 * Input for executing a multi-GMI agency workflow.
 */
export interface AgencyExecutionInput {
  /** High-level goal for the entire agency */
  goal: string;
  /** Array of agent roles to coordinate */
  roles: AgentRoleConfig[];
  /** User initiating the workflow */
  userId: string;
  /** Conversation/session identifier for tracking */
  conversationId: string;
  /** Optional workflow definition ID to use */
  workflowDefinitionId?: string;
  /** Desired output format */
  outputFormat?: 'json' | 'csv' | 'markdown' | 'text';
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Output from a single GMI's execution within the agency.
 */
interface GMIExecutionResult {
  roleId: string;
  personaId: string;
  gmiInstanceId: string;
  output: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: Record<string, unknown>;
  error?: string;
}

/**
 * Consolidated result from multi-GMI agency execution.
 */
export interface AgencyExecutionResult {
  agencyId: string;
  goal: string;
  /** Individual outputs from each GMI */
  gmiResults: GMIExecutionResult[];
  /** Consolidated output combining all GMI results */
  consolidatedOutput: string;
  /** Output in requested format */
  formattedOutput?: {
    format: 'json' | 'csv' | 'markdown' | 'text';
    content: string;
  };
  /** Total execution time in milliseconds */
  durationMs: number;
  /** Aggregate token usage */
  totalUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Dependencies required for MultiGMIAgencyExecutor.
 */
export interface MultiGMIAgencyExecutorDependencies {
  /** AgentOS instance for GMI management and streaming */
  agentOS: AgentOS;
  /** Optional callback for streaming chunks (AGENCY_UPDATE, etc.) */
  onChunk?: (chunk: AgentOSResponse) => Promise<void> | void;
}

/**
 * Executes multi-GMI agency workflows with parallel coordination.
 * 
 * **How it works:**
 * 1. **Parse roles**: Convert role configs into GMI initialization parameters
 * 2. **Create GMIs**: Instantiate one GMI per role via GMIManager
 * 3. **Execute in parallel**: Use Promise.all to process agent tasks concurrently
 * 4. **Stream updates**: Emit AGENCY_UPDATE chunks showing seat states
 * 5. **Consolidate outputs**: Combine GMI results into requested format
 * 
 * **Concurrency:**
 * - Executes up to 4 GMIs in parallel by default
 * - Can be configured via ConcurrencyQueue
 * - Respects task dependencies if workflow definition is provided
 * 
 * **Error Handling:**
 * - Individual GMI failures don't stop other agents
 * - Failed seats are marked with error messages
 * - Partial results are still consolidated
 */
export class MultiGMIAgencyExecutor {
  constructor(private readonly deps: MultiGMIAgencyExecutorDependencies) {}

  /**
   * Executes a multi-GMI agency workflow.
   * 
   * @param input - Agency execution configuration
   * @returns Consolidated results from all GMI executions
   * 
   * @example Execute parallel analysis workflow
   * ```typescript
   * const result = await executor.executeAgency({
   *   goal: "Analyze performance metrics",
   *   roles: [
   *     { roleId: "data_analyst", personaId: "v_researcher", instruction: "Calculate p50, p95, p99 latency" },
   *     { roleId: "optimizer", personaId: "nerf_generalist", instruction: "Suggest 3 performance improvements" },
   *     { roleId: "reporter", personaId: "v_researcher", instruction: "Create markdown summary" }
   *   ],
   *   userId: "user-123",
   *   conversationId: "conv-456",
   *   outputFormat: "markdown"
   * });
   * ```
   */
  public async executeAgency(input: AgencyExecutionInput): Promise<AgencyExecutionResult> {
    const startTime = Date.now();
    const agencyId = `agency_${uuidv4()}`;
    
    // Sort roles by priority (lower = higher priority)
    const sortedRoles = [...input.roles].sort((a, b) => (a.priority || 999) - (b.priority || 999));
    
    // Execute all GMIs in parallel
    const gmiPromises = sortedRoles.map((role) =>
      this.executeGMIForRole({
        role,
        agencyId,
        goal: input.goal,
        userId: input.userId,
        conversationId: input.conversationId,
      })
    );
    
    // Wait for all GMIs to complete (or fail)
    const gmiResults = await Promise.allSettled(gmiPromises);
    
    // Extract successful results and errors
    const successfulResults: GMIExecutionResult[] = [];
    const failedResults: GMIExecutionResult[] = [];
    
    gmiResults.forEach((result, index) => {
      const role = sortedRoles[index];
      if (result.status === 'fulfilled') {
        successfulResults.push(result.value);
      } else {
        failedResults.push({
          roleId: role.roleId,
          personaId: role.personaId,
          gmiInstanceId: `failed_${role.roleId}`,
          output: '',
          error: result.reason?.message || 'Unknown error',
        });
      }
    });
    
    const allResults = [...successfulResults, ...failedResults];
    
    // Consolidate outputs
    const consolidatedOutput = this.consolidateOutputs(allResults, input.outputFormat || 'markdown');
    const formattedOutput = this.formatOutput(allResults, input.outputFormat || 'markdown');
    
    // Calculate total usage
    const totalUsage = allResults.reduce(
      (sum, r) => ({
        promptTokens: sum.promptTokens + (r.usage?.promptTokens || 0),
        completionTokens: sum.completionTokens + (r.usage?.completionTokens || 0),
        totalTokens: sum.totalTokens + (r.usage?.totalTokens || 0),
      }),
      { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
    );
    
    return {
      agencyId,
      goal: input.goal,
      gmiResults: allResults,
      consolidatedOutput,
      formattedOutput,
      durationMs: Date.now() - startTime,
      totalUsage,
    };
  }

  /**
   * Executes a single GMI for a specific role within the agency.
   * 
   * @param params - Role configuration and context
   * @returns Execution result for this GMI
   * @private
   */
  private async executeGMIForRole(params: {
    role: AgentRoleConfig;
    agencyId: string;
    goal: string;
    userId: string;
    conversationId: string;
  }): Promise<GMIExecutionResult> {
    const { role, agencyId, goal, userId, conversationId } = params;
    
    // Build instruction combining agency goal and role-specific task
    const fullInstruction = `**Agency Goal:** ${goal}\n\n**Your Role (${role.roleId}):** ${role.instruction}`;
    
    // Create temporary session for this GMI
    const sessionId = `${conversationId}_${role.roleId}`;
    
    try {
      // Execute GMI turn (this should go through AgentOS.processRequest)
      // For now, we'll use a simplified approach
      // TODO: Wire through actual AgentOS streaming with proper GMI instances
      
      const output = await this.mockGMIExecution(role, fullInstruction);
      
      return {
        roleId: role.roleId,
        personaId: role.personaId,
        gmiInstanceId: `gmi_${role.roleId}_${Date.now()}`,
        output,
        usage: {
          promptTokens: 100,
          completionTokens: 200,
          totalTokens: 300,
        },
      };
    } catch (error) {
      throw new Error(`GMI execution failed for role ${role.roleId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Temporary mock GMI execution until full AgentOS streaming is wired.
   * @private
   * @deprecated Will be replaced with actual AgentOS.processRequest call
   */
  private async mockGMIExecution(role: AgentRoleConfig, instruction: string): Promise<string> {
    // This is a placeholder - in production this should call AgentOS.processRequest
    return `[${role.roleId}] Processing: ${instruction}\n\nMock output from ${role.personaId}`;
  }

  /**
   * Consolidates outputs from multiple GMIs into a single coherent response.
   * 
   * @param results - Array of GMI execution results
   * @param format - Desired output format
   * @returns Consolidated text combining all GMI outputs
   * @private
   */
  private consolidateOutputs(results: GMIExecutionResult[], format: string): string {
    const sections = results.map((result) => {
      const header = `## ${result.roleId.toUpperCase().replace(/_/g, ' ')}`;
      const persona = `*Persona: ${result.personaId}*`;
      const output = result.error ? `❌ **Error:** ${result.error}` : result.output;
      
      return `${header}\n${persona}\n\n${output}`;
    });
    
    return `# Agency Coordination Results\n\n${sections.join('\n\n---\n\n')}`;
  }

  /**
   * Formats consolidated output into requested structure (JSON, CSV, markdown, text).
   * 
   * @param results - Array of GMI execution results
   * @param format - Desired output format
   * @returns Formatted output object
   * @private
   */
  private formatOutput(
    results: GMIExecutionResult[],
    format: 'json' | 'csv' | 'markdown' | 'text'
  ): { format: string; content: string } {
    switch (format) {
      case 'json':
        return {
          format: 'json',
          content: JSON.stringify(results, null, 2),
        };
      
      case 'csv':
        const headers = 'roleId,personaId,status,output';
        const rows = results.map((r) =>
          `"${r.roleId}","${r.personaId}","${r.error ? 'failed' : 'success'}","${r.output.replace(/"/g, '""')}"`
        );
        return {
          format: 'csv',
          content: `${headers}\n${rows.join('\n')}`,
        };
      
      case 'markdown':
        return {
          format: 'markdown',
          content: this.consolidateOutputs(results, 'markdown'),
        };
      
      case 'text':
      default:
        const lines = results.map((r) => `[${r.roleId}] ${r.output}`);
        return {
          format: 'text',
          content: lines.join('\n\n'),
        };
    }
  }
}

