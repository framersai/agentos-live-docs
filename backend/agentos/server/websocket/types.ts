// agentos/server/websocket/types.ts
export enum WSMessageType {
    // Client to Server
    INIT_SESSION = 'init_session',
    SEND_MESSAGE = 'send_message',
    TOOL_RESULT = 'tool_result',
    CANCEL_STREAM = 'cancel_stream',
    
    // Server to Client  
    SESSION_READY = 'session_ready',
    TEXT_DELTA = 'text_delta',
    SYSTEM_PROGRESS = 'system_progress',
    TOOL_CALL_REQUEST = 'tool_call_request',
    TOOL_RESULT_EMISSION = 'tool_result_emission',
    UI_COMMAND = 'ui_command',
    FINAL_RESPONSE = 'final_response',
    ERROR = 'error',
    STREAM_END = 'stream_end',
    
    // Connection management
    PING = 'ping',
    PONG = 'pong',
  }
  
  export interface WSMessage {
    type: WSMessageType;
    id: string;
    timestamp: string;
    data?: any;
  }
  
  export interface WSInitSessionMessage extends WSMessage {
    type: WSMessageType.INIT_SESSION;
    data: {
      userId: string;
      sessionId?: string;
      personaId?: string;
      apiKeys?: Record<string, string>;
    };
  }
  
  export interface WSSendMessageMessage extends WSMessage {
    type: WSMessageType.SEND_MESSAGE;
    data: {
      textInput: string;
      visionInputs?: any[];
      audioInput?: any;
      options?: any;
    };
  }
  
  export interface WSToolResultMessage extends WSMessage {
    type: WSMessageType.TOOL_RESULT;
    data: {
      streamId: string;
      toolCallId: string;
      toolName: string;
      toolOutput: any;
      isSuccess: boolean;
      errorMessage?: string;
    };
  }