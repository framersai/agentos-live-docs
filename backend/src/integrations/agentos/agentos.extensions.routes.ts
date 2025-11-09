/**
 * Extension management routes for AgentOS
 */

import { Router, Request, Response } from 'express';

const router = Router();

// Mock extension data for development
const mockExtensions = [
  {
    id: 'com.framers.research.web-search',
    name: 'Web Search',
    package: '@framers/agentos-research-web-search',
    version: '1.0.0',
    description: 'Multi-provider web search with research aggregation',
    category: 'research',
    verified: true,
    installed: true,
    tools: ['webSearch', 'researchAggregator', 'factCheck']
  },
  {
    id: 'com.framers.integrations.telegram',
    name: 'Telegram Bot',
    package: '@framers/agentos-integrations-telegram',
    version: '1.0.0',
    description: 'Telegram Bot API integration',
    category: 'integrations',
    verified: true,
    installed: false,
    tools: ['telegramSendMessage', 'telegramSendPhoto', 'telegramGetChatInfo']
  }
];

const mockTools = [
  {
    id: 'webSearch',
    name: 'Web Search',
    description: 'Search the web using multiple providers',
    extension: '@framers/agentos-research-web-search',
    inputSchema: {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string', description: 'Search query' },
        maxResults: { type: 'number', default: 10 }
      }
    },
    hasSideEffects: false
  },
  {
    id: 'telegramSendMessage',
    name: 'Send Telegram Message',
    description: 'Send a message to a Telegram chat',
    extension: '@framers/agentos-integrations-telegram',
    inputSchema: {
      type: 'object',
      required: ['chatId', 'text'],
      properties: {
        chatId: { type: ['string', 'number'] },
        text: { type: 'string' }
      }
    },
    hasSideEffects: true
  }
];

/**
 * GET /api/agentos/extensions
 * List all available extensions
 */
router.get('/extensions', async (req: Request, res: Response) => {
  try {
    // Return mock extensions for now
    res.json(mockExtensions);
  } catch (error: any) {
    console.error('Error fetching extensions:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/agentos/extensions/tools
 * List all available tools from loaded extensions
 */
router.get('/extensions/tools', async (req: Request, res: Response) => {
  try {
    // Return mock tools for now
    res.json(mockTools);
  } catch (error: any) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/agentos/extensions/install
 * Install an extension from npm (mock for now)
 */
router.post('/extensions/install', async (req: Request, res: Response) => {
  try {
    const { package: packageName } = req.body;
    
    if (!packageName) {
      return res.status(400).json({ error: 'Package name required' });
    }
    
    // Mock installation - mark extension as installed
    const ext = mockExtensions.find(e => e.package === packageName);
    if (ext) {
      ext.installed = true;
    }
    
    res.json({ success: true, message: `Extension ${packageName} installed (mock)` });
  } catch (error: any) {
    console.error('Error installing extension:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/agentos/extensions/reload
 * Reload all extensions
 */
router.post('/extensions/reload', async (req: Request, res: Response) => {
  try {
    res.json({ success: true, message: 'Extensions reloaded (mock)' });
  } catch (error: any) {
    console.error('Error reloading extensions:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/agentos/extensions/search
 * Search for extensions on npm
 */
router.get('/extensions/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    // Return filtered mock extensions based on query
    const results = mockExtensions.filter(ext => 
      !q || ext.name.toLowerCase().includes((q as string).toLowerCase())
    );
    res.json(results);
  } catch (error: any) {
    console.error('Error searching extensions:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/agentos/tools/execute
 * Execute a specific tool (mock for now)
 */
router.post('/tools/execute', async (req: Request, res: Response) => {
  try {
    const { toolId, input, userId } = req.body;
    
    if (!toolId || !input) {
      return res.status(400).json({ error: 'toolId and input required' });
    }
    
    // Mock tool execution
    const tool = mockTools.find(t => t.id === toolId);
    if (!tool) {
      return res.status(404).json({ error: `Tool ${toolId} not found` });
    }
    
    // Return mock result based on tool
    const mockResult = {
      success: true,
      output: {
        toolId,
        input,
        message: `Mock execution of ${tool.name}`,
        timestamp: new Date().toISOString()
      }
    };
    
    res.json(mockResult);
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
