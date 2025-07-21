// api/types/AgentOSResponse.ts
  export enum AgentOSResponseChunkType {
    TEXT_DELTA = 'text_delta',
    SYSTEM_PROGRESS = 'system_progress',
    TOOL_CALL_REQUEST = 'tool_call_request',
    TOOL_RESULT_EMISSION = 'tool_result_emission',
    UI_COMMAND = 'ui_command',
    FINAL_RESPONSE = 'final_response',
    ERROR = 'error'
  }
  
  export interface AgentOSResponse {
    id: string;
    type: AgentOSResponseChunkType;
    timestamp: string;
    sessionId: string;
    userId: string;
    isFinal: boolean;
    
    // Content based on type
    textDelta?: string;
    systemProgress?: {
      step: string;
      progress: number;
      message: string;
    };
    toolCallRequest?: {
      toolCallId: string;
      toolName: string;
      parameters: any;
    };
    toolResult?: {
      toolCallId: string;
      toolName: string;
      result: any;
      isSuccess: boolean;
    };
    uiCommand?: {
      command: string;
      parameters: any;
    };
    finalResponseText?: string;
    error?: {
      code: string;
      message: string;
      details?: any;
    };
    
    // Metadata
    metadata?: {
      tokensUsed?: number;
      model?: string;
      provider?: string;
      conversationId?: string;
      [key: string]: any;
    };
  }
  