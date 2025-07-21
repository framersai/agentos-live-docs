// agentos/server/websocket/WebSocketManager.ts
import { Server as SocketIOServer, Socket } from 'socket.io';
import { AgentOS } from '../../api/AgentOS';
import { AgentOSServerConfig } from '../config/ServerConfig';
import { ChatHandler } from './ChatHandler';
import { WSMessage, WSMessageType } from './types';
import { logger } from '../utils/logger';

export class WebSocketManager {
  private io: SocketIOServer;
  private agentOS: AgentOS;
  private config: AgentOSServerConfig;
  private activeSessions: Map<string, ChatHandler> = new Map();
  private connectionCount: number = 0;

  constructor(
    io: SocketIOServer,
    agentOS: AgentOS,
    config: AgentOSServerConfig
  ) {
    this.io = io;
    this.agentOS = agentOS;
    this.config = config;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      this.handleConnection(socket);
    });
  }

  private handleConnection(socket: Socket): void {
    this.connectionCount++;
    
    if (this.connectionCount > this.config.webSocket.maxConnections) {
      logger.warn(`Connection limit exceeded. Rejecting connection ${socket.id}`);
      socket.emit('error', { message: 'Connection limit exceeded' });
      socket.disconnect();
      this.connectionCount--;
      return;
    }

    logger.info(`WebSocket connected: ${socket.id} (${this.connectionCount} active)`);

    socket.on('message', (message: WSMessage) => {
      this.handleMessage(socket, message);
    });

    socket.on('disconnect', (reason) => {
      this.handleDisconnection(socket, reason);
    });

    socket.on('error', (error) => {
      logger.error(`WebSocket error for ${socket.id}:`, error);
    });

    socket.emit('message', {
      type: WSMessageType.SESSION_READY,
      id: this.generateMessageId(),
      timestamp: new Date().toISOString(),
      data: { socketId: socket.id },
    });
  }

  private async handleMessage(socket: Socket, message: WSMessage): Promise<void> {
    try {
      logger.debug(`Received message from ${socket.id}:`, message.type);

      switch (message.type) {
        case WSMessageType.INIT_SESSION:
          await this.handleInitSession(socket, message);
          break;

        case WSMessageType.SEND_MESSAGE:
          await this.handleSendMessage(socket, message);
          break;

        case WSMessageType.TOOL_RESULT:
          await this.handleToolResult(socket, message);
          break;

        case WSMessageType.CANCEL_STREAM:
          await this.handleCancelStream(socket, message);
          break;

        case WSMessageType.PING:
          socket.emit('message', {
            type: WSMessageType.PONG,
            id: this.generateMessageId(),
            timestamp: new Date().toISOString(),
          });
          break;

        default:
          logger.warn(`Unknown message type: ${message.type}`);
          socket.emit('message', {
            type: WSMessageType.ERROR,
            id: this.generateMessageId(),
            timestamp: new Date().toISOString(),
            data: { error: 'Unknown message type' },
          });
      }
    } catch (error) {
      logger.error(`Error handling message from ${socket.id}:`, error);
      socket.emit('message', {
        type: WSMessageType.ERROR,
        id: this.generateMessageId(),
        timestamp: new Date().toISOString(),
        data: { error: error.message },
      });
    }
  }

  private async handleInitSession(socket: Socket, message: WSMessage): Promise<void> {
    const { userId, sessionId, personaId, apiKeys } = message.data;
    
    const chatHandler = new ChatHandler(
      socket,
      this.agentOS,
      userId,
      sessionId || `session_${Date.now()}`,
      personaId,
      apiKeys
    );

    this.activeSessions.set(socket.id, chatHandler);
    
    socket.emit('message', {
      type: WSMessageType.SESSION_READY,
      id: this.generateMessageId(),
      timestamp: new Date().toISOString(),
      data: {
        sessionId: chatHandler.getSessionId(),
        userId,
        personaId,
      },
    });
  }

  private async handleSendMessage(socket: Socket, message: WSMessage): Promise<void> {
    const chatHandler = this.activeSessions.get(socket.id);
    if (!chatHandler) {
      throw new Error('Session not initialized. Send INIT_SESSION first.');
    }

    await chatHandler.handleMessage(message.data);
  }

  private async handleToolResult(socket: Socket, message: WSMessage): Promise<void> {
    const chatHandler = this.activeSessions.get(socket.id);
    if (!chatHandler) {
      throw new Error('Session not initialized.');
    }

    await chatHandler.handleToolResult(message.data);
  }

  private async handleCancelStream(socket: Socket, message: WSMessage): Promise<void> {
    const chatHandler = this.activeSessions.get(socket.id);
    if (chatHandler) {
      chatHandler.cancelCurrentStream();
    }
  }

  private handleDisconnection(socket: Socket, reason: string): void {
    this.connectionCount--;
    
    const chatHandler = this.activeSessions.get(socket.id);
    if (chatHandler) {
      chatHandler.cleanup();
      this.activeSessions.delete(socket.id);
    }

    logger.info(`WebSocket disconnected: ${socket.id}, reason: ${reason} (${this.connectionCount} active)`);
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public shutdown(): void {
    logger.info('Shutting down WebSocket manager...');
    
    for (const [socketId, chatHandler] of this.activeSessions) {
      chatHandler.cleanup();
    }
    this.activeSessions.clear();
    
    this.io.close();
    logger.info('WebSocket manager shutdown complete');
  }
}