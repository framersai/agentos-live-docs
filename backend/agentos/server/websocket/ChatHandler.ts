// agentos/server/websocket/ChatHandler.ts
import { Socket } from 'socket.io';
import { AgentOS } from '../../api/AgentOS';
import { AgentOSInput } from '../../api/types/AgentOSInput';
import { AgentOSResponse, AgentOSResponseChunkType } from '../../api/types/AgentOSResponse';
import { WSMessageType } from './types';
import { logger } from '../utils/logger';

export class ChatHandler {
  private socket: Socket;
  private agentOS: AgentOS;
  private userId: string;
  private sessionId: string;
  private personaId?: string;
  private apiKeys?: Record<string, string>;
  private currentStreamController?: AbortController;

  constructor(
    socket: Socket,
    agentOS: AgentOS,
    userId: string,
    sessionId: string,
    personaId?: string,
    apiKeys?: Record<string, string>
  ) {
    this.socket = socket;
    this.agentOS = agentOS;
    this.userId = userId;
    this.sessionId = sessionId;
    this.personaId = personaId;
    this.apiKeys = apiKeys;
  }

  public async handleMessage(data: any): Promise<void> {
    try {
      const input: AgentOSInput = {
        userId: this.userId,
        sessionId: this.sessionId,
        textInput: data.textInput,
        visionInputs: data.visionInputs,
        audioInput: data.audioInput,
        selectedPersonaId: this.personaId,
        userApiKeys: this.apiKeys,
        conversationId: data.conversationId,
        options: data.options,
      };

      this.currentStreamController = new AbortController();

      for await (const chunk of this.agentOS.processRequest(input)) {
        if (this.currentStreamController.signal.aborted) {
          break;
        }

        await this.sendChunkToClient(chunk);

        if (chunk.isFinal) {
          break;
        }
      }
    } catch (error) {
      logger.error(`Chat handler error for ${this.socket.id}:`, error);
      await this.sendErrorToClient(error.message);
    } finally {
      this.currentStreamController = undefined;
    }
  }

  public async handleToolResult(data: any): Promise<void> {
    try {
      const {
        streamId,
        toolCallId,
        toolName,
        toolOutput,
        isSuccess,
        errorMessage,
      } = data;

      for await (const chunk of this.agentOS.handleToolResult(
        streamId,
        toolCallId,
        toolName,
        toolOutput,
        isSuccess,
        errorMessage
      )) {
        if (this.currentStreamController?.signal.aborted) {
          break;
        }

        await this.sendChunkToClient(chunk);

        if (chunk.isFinal) {
          break;
        }
      }
    } catch (error) {
      logger.error(`Tool result handler error for ${this.socket.id}:`, error);
      await this.sendErrorToClient(error.message);
    }
  }

  private async sendChunkToClient(chunk: AgentOSResponse): Promise<void> {
    let messageType: WSMessageType;

    switch (chunk.type) {
      case AgentOSResponseChunkType.TEXT_DELTA:
        messageType = WSMessageType.TEXT_DELTA;
        break;
      case AgentOSResponseChunkType.SYSTEM_PROGRESS:
        messageType = WSMessageType.SYSTEM_PROGRESS;
        break;
      case AgentOSResponseChunkType.TOOL_CALL_REQUEST:
        messageType = WSMessageType.TOOL_CALL_REQUEST;
        break;
      case AgentOSResponseChunkType.TOOL_RESULT_EMISSION:
        messageType = WSMessageType.TOOL_RESULT_EMISSION;
        break;
      case AgentOSResponseChunkType.UI_COMMAND:
        messageType = WSMessageType.UI_COMMAND;
        break;
      case AgentOSResponseChunkType.FINAL_RESPONSE:
        messageType = WSMessageType.FINAL_RESPONSE;
        break;
      case AgentOSResponseChunkType.ERROR:
        messageType = WSMessageType.ERROR;
        break;
      default:
        messageType = WSMessageType.ERROR;
        logger.warn(`Unknown chunk type: ${chunk.type}`);
    }

    this.socket.emit('message', {
      type: messageType,
      id: this.generateMessageId(),
      timestamp: new Date().toISOString(),
      data: chunk,
    });

    if (chunk.isFinal) {
      this.socket.emit('message', {
        type: WSMessageType.STREAM_END,
        id: this.generateMessageId(),
        timestamp: new Date().toISOString(),
      });
    }
  }

  private async sendErrorToClient(errorMessage: string): Promise<void> {
    this.socket.emit('message', {
      type: WSMessageType.ERROR,
      id: this.generateMessageId(),
      timestamp: new Date().toISOString(),
      data: {
        error: errorMessage,
      },
    });
  }

  public cancelCurrentStream(): void {
    if (this.currentStreamController) {
      this.currentStreamController.abort();
      logger.info(`Stream cancelled for ${this.socket.id}`);
    }
  }

  public cleanup(): void {
    this.cancelCurrentStream();
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}