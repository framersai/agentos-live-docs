/**
 * Extension management routes for AgentOS
 */

import { Router, Request, Response } from 'express';
import { listExtensions, listAvailableTools, invalidateRegistryCache } from './extensions.service.js';
import { agentosService } from './agentos.integration.js';

const router: Router = Router();

/**
 * List all available extensions from the local registry.
 * @route GET /api/agentos/extensions
 */
router.get('/extensions', async (req: Request, res: Response) => {
  try {
    const exts = await listExtensions();
    res.json(exts);
  } catch (error: any) {
    console.error('Error fetching extensions:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * List all available tools derived from the extensions registry.
 * @route GET /api/agentos/extensions/tools
 */
router.get('/extensions/tools', async (req: Request, res: Response) => {
  try {
    const tools = await listAvailableTools();
    res.json(tools);
  } catch (error: any) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Schedule installation of an extension package (placeholder).
 * Currently only invalidates the in-memory registry cache.
 * @route POST /api/agentos/extensions/install
 */
router.post('/extensions/install', async (req: Request, res: Response) => {
  try {
    const { package: packageName } = req.body;
    
    if (!packageName) {
      return res.status(400).json({ error: 'Package name required' });
    }
    
    // Placeholder: in the future, resolve and install the package, then reload registry/cache.
    invalidateRegistryCache();
    
    res.json({ success: true, message: `Extension ${packageName} installation scheduled` });
  } catch (error: any) {
    console.error('Error installing extension:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Invalidate the extensions registry cache (forces reload on next request).
 * @route POST /api/agentos/extensions/reload
 */
router.post('/extensions/reload', async (req: Request, res: Response) => {
  try {
    invalidateRegistryCache();
    res.json({ success: true, message: 'Extensions cache invalidated' });
  } catch (error: any) {
    console.error('Error reloading extensions:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Search across the local registry by name, package, or description substring.
 * @route GET /api/agentos/extensions/search?q=<text>
 */
router.get('/extensions/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const exts = await listExtensions();
    const query = (q as string | undefined)?.toLowerCase() ?? '';
    const results = query
      ? exts.filter(ext =>
          ext.name.toLowerCase().includes(query) ||
          ext.package.toLowerCase().includes(query) ||
          (ext.description ?? '').toLowerCase().includes(query)
        )
      : exts;
    res.json(results);
  } catch (error: any) {
    console.error('Error searching extensions:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Execute a specific tool via AgentOS ToolOrchestrator.
 * - Validates the tool exists (by id/name) in registry.
 * - Delegates JSON schema validation to AgentOS ToolExecutor.
 * @route POST /api/agentos/tools/execute
 */
router.post('/tools/execute', async (req: Request, res: Response) => {
  try {
    const { toolId, input, userId, personaId, personaCapabilities, correlationId } = req.body;
    
    if (!toolId) {
      return res.status(400).json({ error: 'toolId required' });
    }

    // Validate tool exists in registry
    const tools = await listAvailableTools();
    const tool = tools.find(t => t.id === toolId);
    if (!tool) {
      return res.status(404).json({ error: `Tool ${toolId} not found in registry` });
    }

    const result = await agentosService.executeToolCall({
      toolName: toolId,
      args: input ?? {},
      userId,
      personaId,
      personaCapabilities,
      correlationId,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error executing tool:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/agentos/agency/workflow/start
 * Start an agency workflow (demo)
 */
router.post('/agency/workflow/start', async (req: Request, res: Response) => {
  try {
    const { workflowId, input, userId } = req.body;
    
    // This is a simplified demo - real implementation would:
    // 1. Create agency with multiple GMIs
    // 2. Execute workflow tasks in parallel
    // 3. Stream progress updates
    
    res.json({
      success: true,
      workflowId,
      agencyId: `agency_${Date.now()}`,
      status: 'started'
    });
  } catch (error: any) {
    console.error('Error starting workflow:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/agentos/agency/workflow/stream
 * Stream workflow progress updates
 */
router.get('/agency/workflow/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send demo updates
  const sendUpdate = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  
  // Simulate workflow execution
  const steps = [
    { type: 'task_start', taskId: 'search-technical', executor: 'researcher', taskName: 'Search Technical Info', delay: 1000 },
    { type: 'task_start', taskId: 'search-news', executor: 'researcher', taskName: 'Search Latest News', delay: 1500 },
    { type: 'agent_thinking', agentId: 'researcher', thought: 'Analyzing search results...', delay: 2000 },
    { type: 'task_complete', taskId: 'search-technical', executor: 'researcher', progress: 25, delay: 3000 },
    { type: 'task_complete', taskId: 'search-news', executor: 'researcher', progress: 50, delay: 3500 },
    { type: 'task_start', taskId: 'fact-check', executor: 'researcher', taskName: 'Fact Check Claims', delay: 4000 },
    { type: 'agent_action', agentId: 'researcher', action: 'Verifying claims against sources', delay: 5000 },
    { type: 'task_complete', taskId: 'fact-check', executor: 'researcher', progress: 75, delay: 6000 },
    { type: 'task_start', taskId: 'format-report', executor: 'communicator', taskName: 'Format Report', delay: 6500 },
    { type: 'agent_thinking', agentId: 'communicator', thought: 'Structuring report...', delay: 7000 },
    { type: 'task_complete', taskId: 'format-report', executor: 'communicator', progress: 90, delay: 8000 },
    { type: 'task_start', taskId: 'send-telegram', executor: 'communicator', taskName: 'Send to Telegram', delay: 8500 },
    { type: 'task_complete', taskId: 'send-telegram', executor: 'communicator', progress: 100, delay: 9500 },
    { type: 'workflow_complete', delay: 10000 }
  ];
  
  steps.forEach(step => {
    setTimeout(() => sendUpdate(step), step.delay);
  });
  
  // Close connection after workflow completes
  setTimeout(() => {
    res.write('data: [DONE]\n\n');
    res.end();
  }, 11000);
});

export default router;
