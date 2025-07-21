// agentos/server/AgentOSServer.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { AgentOS } from '../api/AgentOS';
import { AgentOSConfig } from '../api/AgentOS';
import { AgentOSServerConfig } from './config/ServerConfig';
import { WebSocketManager } from './websocket/WebsocketManager';
import { setupRoutes } from './routes';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './utils/errorHandler';
import { logger } from './utils/logger';

export class AgentOSServer {
  private app: Express;
  private httpServer: HTTPServer;
  private io: SocketIOServer;
  private agentOS: AgentOS;
  private wsManager: WebSocketManager;
  private config: AgentOSServerConfig;
  private isInitialized: boolean = false;

  constructor(
    agentOSConfig: AgentOSConfig,
    serverConfig: AgentOSServerConfig
  ) {
    this.config = serverConfig;
    this.app = express();
    this.httpServer = createServer(this.app);
    this.agentOS = new AgentOS();
    this.io = new SocketIOServer();
    this.wsManager = new WebSocketManager(this.io, this.agentOS, this.config);
    
    // Initialize AgentOS
    this.initializeAgentOS(agentOSConfig);
    this.setupMiddleware();
    this.setupWebSocket();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private async initializeAgentOS(agentOSConfig: AgentOSConfig): Promise<void> {
    try {
      await this.agentOS.initialize(agentOSConfig);
      this.isInitialized = true;
      logger.info('AgentOS initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize AgentOS:', error);
      throw error;
    }
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: false,
    }));
    
    // CORS
    this.app.use(cors({
      origin: this.config.corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', this.config.apiKeyHeader],
    }));
    
    // Compression
    this.app.use(compression());
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: this.config.rateLimit.windowMs,
      max: this.config.rateLimit.maxRequests,
      skipSuccessfulRequests: this.config.rateLimit.skipSuccessfulRequests,
      message: 'Too many requests from this IP',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);
    
    // Request logging
    if (this.config.logging.enableRequestLogging) {
      this.app.use((req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();
        res.on('finish', () => {
          const duration = Date.now() - start;
          logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
        });
        next();
      });
    }
    
    // Authentication middleware for protected routes
    this.app.use('/api/chat', authMiddleware);
    this.app.use('/api/personas', authMiddleware);
    this.app.use('/api/conversations', authMiddleware);
    this.app.use('/api/feedback', authMiddleware);
  }

  private setupWebSocket(): void {
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: this.config.corsOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      maxHttpBufferSize: this.config.webSocket.maxMessageSize,
      pingTimeout: this.config.webSocket.connectionTimeout,
      pingInterval: this.config.webSocket.heartbeatInterval,
    });

    this.wsManager = new WebSocketManager(this.io, this.agentOS, this.config);
  }

  private setupRoutes(): void {
    setupRoutes(this.app, this.agentOS, this.config);
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    // Wait for AgentOS to be initialized
    while (!this.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return new Promise((resolve, reject) => {
      this.httpServer.listen(this.config.port, this.config.host, () => {
        logger.info(`AgentOS Server started on ${this.config.host}:${this.config.port}`);
        logger.info(`Environment: ${this.config.environment}`);
        logger.info(`WebSocket enabled with max ${this.config.webSocket.maxConnections} connections`);
        resolve();
      });

      this.httpServer.on('error', (error) => {
        logger.error('Server startup error:', error);
        reject(error);
      });
    });
  }

  public async stop(): Promise<void> {
    logger.info('Shutting down AgentOS Server...');
    
    // Close WebSocket connections
    this.wsManager?.shutdown();
    
    // Close Socket.IO
    this.io?.close();
    
    // Shutdown AgentOS
    await this.agentOS?.shutdown();
    
    // Close HTTP server
    return new Promise((resolve) => {
      this.httpServer.close(() => {
        logger.info('AgentOS Server shut down completed');
        resolve();
      });
    });
  }

  public getApp(): Express {
    return this.app;
  }

  public getServer(): HTTPServer {
    return this.httpServer;
  }

  public getAgentOS(): AgentOS {
    return this.agentOS;
  }
}