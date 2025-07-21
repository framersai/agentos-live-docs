// agentos/server/app.ts
import dotenv from 'dotenv';
import path from 'path';
import { AgentOSServer } from './AgentOSServer';
import { createServerConfig } from './config/ServerConfig';
import { createAgentOSConfig } from '../config/AgentOSConfig'; // Use existing AgentOS config
import { logger } from './utils/logger';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function main() {
  try {
    logger.info('Starting AgentOS Server...');

    // Create configurations
    const agentOSConfig = await createAgentOSConfig();
    const serverConfig = createServerConfig();

    // Create and start server
    const server = new AgentOSServer(agentOSConfig, serverConfig);
    
    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);
      try {
        await server.stop();
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    await server.start();
    
  } catch (error) {
    logger.error('Failed to start AgentOS Server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { AgentOSServer };