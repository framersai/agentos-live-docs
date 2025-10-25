import fs from 'fs';
import { isAgentOSEnabled } from './agentos.integration.js';
import { callLlm } from '../../core/llm/llm.factory.js';
import type { IChatMessage, ILlmTool } from '../../core/llm/llm.interfaces.js';
import {
  resolveAgentOSPersona,
  listAgentOSToolsets,
  type AgentOSPersonaDefinition,
  type AgentOSToolset,
} from './agentos.persona-registry.js';
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
  personaLabel?: string | null;
}

export const agentosChatAdapterEnabled = (): boolean => isAgentOSEnabled();

const TOOLSET_MAP: Map<string, AgentOSToolset> = new Map(
  listAgentOSToolsets().map((toolset) => [toolset.id, toolset]),
);

const PROMPT_CACHE: Map<string, string> = new Map();

export async function processAgentOSChatRequest(
  payload: AgentOSChatAdapterRequest,
): Promise<AgentOSChatAdapterResult> {
  const persona = resolveAgentOSPersona(payload.mode);
  const systemPrompt = loadPersonaPrompt(persona);
  const history = buildMessageHistory(systemPrompt, payload.messages);
  const tools = flattenToolsets(persona.toolsetIds);

  const llmResponse = await callLlm(
    history,
    undefined,
    tools.length
      ? {
          tools,
        }
      : undefined,
    undefined,
    payload.userId,
  );

  const syntheticChunk: AgentOSResponse = {
    type: AgentOSResponseChunkType.FINAL_RESPONSE,
    streamId: payload.conversationId,
    gmiInstanceId: persona.personaId,
    personaId: persona.personaId,
    isFinal: true,
    timestamp: new Date().toISOString(),
    metadata: { modelId: llmResponse.model },
    finalResponseText: llmResponse.text,
    usage: llmResponse.usage
      ? {
          promptTokens: llmResponse.usage.prompt_tokens ?? undefined,
          completionTokens: llmResponse.usage.completion_tokens ?? undefined,
          totalTokens: llmResponse.usage.total_tokens ?? undefined,
        }
      : undefined,
    activePersonaDetails: {
      id: persona.personaId,
      label: persona.label,
    },
  };

  return summarizeAgentOSChunks(
    [syntheticChunk],
    payload.conversationId,
    persona.personaId,
    persona.label,
  );
}

function summarizeAgentOSChunks(
  chunks: AgentOSResponse[],
  conversationId: string,
  fallbackPersonaId?: string,
  fallbackPersonaLabel?: string,
): AgentOSChatAdapterResult {
  let responseText = '';
  let modelName = 'agentos';
  let usage: Record<string, number> | undefined;
  let persona: string | null = null;
  let personaLabel: string | null = null;

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
        personaLabel = finalChunk.activePersonaDetails?.label ?? personaLabel;
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
        break;
    }
  }

  return {
    content: responseText.trim(),
    model: modelName,
    usage,
    conversationId,
    persona: persona ?? fallbackPersonaId ?? null,
    personaLabel: personaLabel ?? fallbackPersonaLabel ?? null,
  };
}

function loadPersonaPrompt(persona: AgentOSPersonaDefinition): string {
  if (PROMPT_CACHE.has(persona.promptPath)) {
    return PROMPT_CACHE.get(persona.promptPath)!;
  }

  let rawPrompt = '';
  try {
    rawPrompt = fs.readFileSync(persona.promptPath, 'utf-8');
  } catch (error) {
    console.error('[AgentOS][PersonaPrompt] Unable to read prompt file:', persona.promptPath, error);
    rawPrompt = `You are ${persona.label}, an AI assistant focused on ${persona.category}. Respond in Markdown.`;
  }

  const rendered = applyPromptTemplate(rawPrompt, persona);
  PROMPT_CACHE.set(persona.promptPath, rendered);
  return rendered;
}

function applyPromptTemplate(template: string, persona: AgentOSPersonaDefinition): string {
  const replacements: Record<string, string> = {
    '{{AGENT_NAME}}': persona.label,
    '{{AGENT_LABEL}}': persona.label,
    '{{MODE}}': persona.category,
    '{{LANGUAGE}}': 'English',
    '{{GENERATE_DIAGRAM}}': persona.tags.some((tag) => tag.includes('diagram')) ? 'true' : 'false',
    '{{AGENT_CONTEXT_JSON}}': JSON.stringify({
      personaId: persona.personaId,
      label: persona.label,
      category: persona.category,
      tags: persona.tags,
    }),
    '{{ADDITIONAL_INSTRUCTIONS}}': '',
    '{{RECENT_TOPICS_SUMMARY}}': '',
    '{{USER_QUERY}}': '',
    '{{TUTOR_LEVEL}}': 'intermediate',
  };

  let rendered = template;
  for (const [token, value] of Object.entries(replacements)) {
    rendered = rendered.replace(new RegExp(token, 'g'), value);
  }
  return rendered;
}

function buildMessageHistory(
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>,
): IChatMessage[] {
  const history: IChatMessage[] = [{ role: 'system', content: systemPrompt }];
  for (const message of messages) {
    const normalizedRole = normalizeRole(message.role);
    if (!normalizedRole || message.content == null) continue;
    history.push({ role: normalizedRole, content: message.content });
  }
  return history;
}

function normalizeRole(role: string): IChatMessage['role'] | null {
  switch (role) {
    case 'system':
    case 'assistant':
    case 'user':
    case 'tool':
      return role;
    default:
      return null;
  }
}

function flattenToolsets(toolsetIds: string[]): ILlmTool[] {
  const tools: ILlmTool[] = [];
  for (const id of toolsetIds) {
    const toolset = TOOLSET_MAP.get(id);
    if (toolset) {
      tools.push(...toolset.tools);
    }
  }
  return tools;
}
