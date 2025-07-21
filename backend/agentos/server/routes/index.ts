// agentos/server/routes/index.ts
import { Express } from 'express';
import { AgentOS } from '../../api/AgentOS';
import { AgentOSServerConfig } from '../config/ServerConfig';

import { setupHealthRoutes } from './health';
import { setupPersonaRoutes } from './personas';
import { setupConversationRoutes } from './conversations';
import { setupChatRoutes } from './chat';
import { setupFeedbackRoutes } from './feedback';

export function setupRoutes(
  app: Express,
  agentOS: AgentOS,
  config: AgentOSServerConfig
): void {
  // API base path
  const apiBase = '/api/v1';
  
  setupHealthRoutes(app, apiBase);
  setupPersonaRoutes(app, apiBase, agentOS);
  setupConversationRoutes(app, apiBase, agentOS);
  setupChatRoutes(app, apiBase, agentOS, config);
  setupFeedbackRoutes(app, apiBase, agentOS);
}