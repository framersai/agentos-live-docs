// agentos/examples/standalone-server.ts
import { AgentOSServer } from '../../AgentOSServer';
import { createAgentOSConfig } from '../../config/ServerConfig';
import { createServerConfig } from '../server/config/ServerConfig';

async function startServer() {
  const agentOSConfig = await createAgentOSConfig();
  const serverConfig = createServerConfig();
  
  const server = new AgentOSServer(agentOSConfig, serverConfig);
  await server.start();
  
  console.log('AgentOS Server running at http://localhost:3000');
}

startServer().catch(console.error);
