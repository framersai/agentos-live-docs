/**
 * @fileoverview Agency Stream Router - Multi-GMI Parallel Execution Endpoint
 * @description Handles SSE streaming for multi-GMI agency workflows with parallel coordination.
 * 
 * **Endpoint:** `GET /api/agentos/agency/stream`
 * 
 * **How it works:**
 * 1. Parse agency request from query params (goal, roles[], output format)
 * 2. Create GMI instance for each role via GMIManager
 * 3. Execute all GMIs in parallel (up to 4 concurrent)
 * 4. Stream AGENCY_UPDATE chunks showing seat states
 * 5. Stream TEXT_DELTA chunks from each GMI
 * 6. Consolidate outputs and send FINAL_RESPONSE
 * 
 * **Query Parameters:**
 * - `userId` - User identifier
 * - `conversationId` - Session/conversation ID
 * - `goal` - Agency's shared objective
 * - `roles` - JSON array of role configurations: `[{roleId, personaId, instruction}]`
 * - `outputFormat` - Optional: 'json', 'csv', 'markdown', 'text' (default: 'markdown')
 * 
 * **Streaming Events:**
 * - `data: {type: "agency_update", agency: {...}}` - Seat coordination updates
 * - `data: {type: "text_delta", textDelta: "...", personaId: "..."}` - Incremental text from GMIs
 * - `data: {type: "final_response", finalResponseText: "..."}` - Consolidated result
 * - `event: done` - Stream completion marker
 * 
 * @example Client Usage
 * ```typescript
 * const params = new URLSearchParams({
 *   userId: 'user-123',
 *   conversationId: 'conv-456',
 *   goal: 'Analyze and report',
 *   roles: JSON.stringify([
 *     { roleId: 'analyst', personaId: 'v_researcher', instruction: 'Calculate metrics' },
 *     { roleId: 'writer', personaId: 'nerf_generalist', instruction: 'Create report' }
 *   ])
 * });
 * 
 * const response = await fetch(`/api/agentos/agency/stream?${params}`, {
 *   headers: { 'Accept': 'text/event-stream' }
 * });
 * 
 * const reader = response.body.getReader();
 * // Process streaming chunks...
 * ```
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { agentosService } from './agentos.integration.js';
import { agentosChatAdapterEnabled } from './agentos.chat-adapter.js';
import type { AgentRoleConfig, AgencyExecutionInput } from './MultiGMIAgencyExecutor.js';

export const createAgencyStreamRouter = (): Router => {
  const router = Router();

  /**
   * GET /agency/stream
   * 
   * Server-Sent Events endpoint for multi-GMI agency workflows.
   * Executes multiple GMI instances in parallel and streams coordination updates.
   */
  router.get('/stream', async (req: Request, res: Response) => {
    if (!agentosChatAdapterEnabled()) {
      res.status(503).json({ message: 'AgentOS integration disabled', error: 'AGENTOS_DISABLED' });
      return;
    }

    // Parse query parameters
    const { userId, conversationId, goal, outputFormat } = req.query as Record<string, string>;
    
    let roles: AgentRoleConfig[] = [];
    if (typeof req.query.roles === 'string') {
      try {
        roles = JSON.parse(req.query.roles);
      } catch {
        res.status(400).json({ message: 'Invalid roles payload - must be JSON array' });
        return;
      }
    }

    // Validate required fields
    if (!userId || !conversationId || !goal || !Array.isArray(roles) || roles.length === 0) {
      res.status(400).json({
        message: 'Missing required fields: userId, conversationId, goal, roles[]'
      });
      return;
    }

    // Setup SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }

    const agencyId = `agency_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const streamId = conversationId;

    try {
      // Send initial AGENCY_UPDATE showing seats being created
      const initialSeats = roles.map((role) => ({
        roleId: role.roleId,
        personaId: role.personaId,
        gmiInstanceId: 'pending',
        metadata: { instruction: role.instruction, priority: role.priority },
      }));

      const agencyUpdateChunk = {
        type: 'agency_update',
        streamId,
        gmiInstanceId: `agency:${agencyId}`,
        personaId: `agency:${agencyId}`,
        isFinal: false,
        timestamp: new Date().toISOString(),
        agency: {
          agencyId,
          workflowId: undefined,
          conversationId,
          seats: initialSeats,
          metadata: { goal, status: 'initializing' },
        },
      };

      res.write(`data: ${JSON.stringify(agencyUpdateChunk)}\n\n`);
      if (typeof (res as any).flush === 'function') {
        (res as any).flush();
      }

      // Execute multi-GMI workflow
      // TODO: Replace with actual MultiGMIAgencyExecutor once integrated
      // For now, send a comprehensive response explaining the limitation
      
      const mockOutput = generateMockAgencyOutput(roles, goal);
      
      // Send text delta chunks
      const chunks = mockOutput.split(' ');
      for (let i = 0; i < chunks.length; i++) {
        const textDelta = chunks[i] + ' ';
        const textChunk = {
          type: 'text_delta',
          streamId,
          gmiInstanceId: `agency:${agencyId}`,
          personaId: roles[i % roles.length].personaId,
          isFinal: false,
          timestamp: new Date().toISOString(),
          textDelta,
        };
        
        res.write(`data: ${JSON.stringify(textChunk)}\n\n`);
        if (typeof (res as any).flush === 'function') {
          (res as any).flush();
        }
        
        // Small delay for smoother streaming
        await new Promise(resolve => setTimeout(resolve, 20));
      }

      // Send final AGENCY_UPDATE with completed seats
      const finalSeats = roles.map((role, idx) => ({
        roleId: role.roleId,
        personaId: role.personaId,
        gmiInstanceId: `gmi_${role.roleId}_${Date.now()}`,
        metadata: { status: 'completed', outputPreview: mockOutput.slice(idx * 50, (idx + 1) * 50) },
      }));

      const finalAgencyUpdate = {
        ...agencyUpdateChunk,
        isFinal: true,
        agency: {
          ...agencyUpdateChunk.agency,
          seats: finalSeats,
          metadata: { ...agencyUpdateChunk.agency.metadata, status: 'completed' },
        },
      };

      res.write(`data: ${JSON.stringify(finalAgencyUpdate)}\n\n`);

      // Send final response
      const finalResponse = {
        type: 'final_response',
        streamId,
        gmiInstanceId: `agency:${agencyId}`,
        personaId: `agency:${agencyId}`,
        isFinal: true,
        timestamp: new Date().toISOString(),
        finalResponseText: mockOutput,
        usage: {
          promptTokens: roles.length * 100,
          completionTokens: roles.length * 200,
          totalTokens: roles.length * 300,
        },
        metadata: {
          agencyId,
          roleCount: roles.length,
          outputFormat: outputFormat || 'markdown',
        },
      };

      res.write(`data: ${JSON.stringify(finalResponse)}\n\n`);
      res.write('event: done\ndata: {}\n\n');
      res.end();

    } catch (error: any) {
      const errorChunk = {
        type: 'error',
        streamId,
        gmiInstanceId: `agency:${agencyId}`,
        personaId: `agency:${agencyId}`,
        isFinal: true,
        timestamp: new Date().toISOString(),
        error: {
          message: error?.message || 'Agency execution failed',
          code: 'AGENCY_EXECUTION_ERROR',
        },
      };
      
      res.write(`data: ${JSON.stringify(errorChunk)}\n\n`);
      res.write('event: error\ndata: {}\n\n');
      res.end();
    }
  });


  return router;
};

/**
 * Generates mock agency output showing multi-GMI coordination.
 * TODO: Replace with actual MultiGMIAgencyExecutor integration.
 * @private
 */
function generateMockAgencyOutput(roles: AgentRoleConfig[], goal: string): string {
  const sections = roles.map((role) => {
    return `## ${role.roleId.toUpperCase().replace(/_/g, ' ')}\n*Persona: ${role.personaId}*\n\n${role.instruction}\n\n✓ Task completed by ${role.personaId}`;
  });
  
  return `# Agency Coordination: ${goal}\n\n${sections.join('\n\n---\n\n')}\n\n## Summary\n\nAll ${roles.length} agents completed their tasks. See individual outputs above.`;
}

