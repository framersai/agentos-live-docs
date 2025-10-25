import { agentosService, isAgentOSEnabled } from './agentos.integration.js';
import type { AgentOSInput } from '../../../agentos/api/types/AgentOSInput';
import {
  AgentOSResponse,
  AgentOSResponseChunkType,
  AgentOSFinalResponseChunk,
  AgentOSTextDeltaChunk,
  AgentOSMetadataUpdateChunk,
} from '../../../agentos/api/types/AgentOSResponse';

export interface AgentOSChatAdapterRequest {
  userId: string;
  conversationId: string;
  mode: string;
  messages: Array<{ role: string; content: string }>;
}

export interface AgentOSChatAdapterResult {
  content: string;
  model: string;
  usage?: Record<string, number>;
  conversationId: string;
  persona?: string | null;
}

export const agentosChatAdapterEnabled = (): boolean => isAgentOSEnabled();

export async function processAgentOSChatRequest(
  payload: AgentOSChatAdapterRequest,
): Promise<AgentOSChatAdapterResult> {
  const lastUserMessage =
    [...payload.messages]
      .reverse()
      .find((msg) => msg.role === 'user')?.content ?? '';

  const sessionId = payload.conversationId || `agentos-session-${Date.now()}`;

  const input: AgentOSInput = {
    userId: payload.userId || 'anonymous_user',
    sessionId,
    textInput: lastUserMessage,
    selectedPersonaId: payload.mode || 'default_assistant_persona',
    conversationId: payload.conversationId,
    options: {
      streamUICommands: false,
    },
  };

  const chunks = await agentosService.processThroughAgentOS(input);
  return summarizeAgentOSChunks(chunks, payload.conversationId);
}

function summarizeAgentOSChunks(
  chunks: AgentOSResponse[],
  conversationId: string,
): AgentOSChatAdapterResult {
  let responseText = '';
  let modelName = 'agentos';
  let usage: Record<string, number> | undefined;
  let persona: string | null = null;

  for (const chunk of chunks) {
    switch (chunk.type) {
      case AgentOSResponseChunkType.TEXT_DELTA: {
        const delta = chunk as AgentOSTextDeltaChunk;
        responseText += delta.textDelta ?? '';
        break;
      }
      case AgentOSResponseChunkType.FINAL_RESPONSE: {
        const finalChunk = chunk as AgentOSFinalResponseChunk;
        if (finalChunk.finalResponseText) {
          responseText = finalChunk.finalResponseText;
        }
        modelName = finalChunk.metadata?.modelId ?? modelName;
        if (finalChunk.usage) {
          usage = {
            prompt_tokens: finalChunk.usage.promptTokens ?? 0,
            completion_tokens: finalChunk.usage.completionTokens ?? 0,
            total_tokens: finalChunk.usage.totalTokens ?? 0,
          };
        }
        persona = finalChunk.activePersonaDetails?.id ?? persona;
        break;
      }
      case AgentOSResponseChunkType.METADATA_UPDATE: {
        const metaChunk = chunk as AgentOSMetadataUpdateChunk;
        if (metaChunk.updates?.modelId) {
          modelName = metaChunk.updates.modelId;
        }
        break;
      }
      case AgentOSResponseChunkType.ERROR: {
        throw new Error(
          `AgentOS error: ${(chunk as any).code ?? 'unknown'} - ${
            (chunk as any).message ?? 'no message'
          }`,
        );
      }
      default:
        // Ignore progress/tool chunks for the synchronous adapter
        break;
    }
  }

  return {
    content: responseText.trim(),
    model: modelName,
    usage,
    conversationId,
    persona,
  };
}
