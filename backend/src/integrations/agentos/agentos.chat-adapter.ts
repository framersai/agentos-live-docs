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
import { sqliteMemoryAdapter } from '../../core/memory/SqliteMemoryAdapter.js';
import { jsonFileKnowledgeBaseService } from '../../core/knowledge/JsonFileKnowledgeBaseService.js';
import { llmContextAggregatorService } from '../../core/context/LLMContextAggregatorService.js';
import type { IStoredConversationTurn } from '../../core/memory/IMemoryAdapter.js';
import type { IContextBundle } from '../../core/context/IContextAggregatorService.js';

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
const CONTEXT_SNIPPET_LIMIT = parseInt(process.env.DEFAULT_HISTORY_MESSAGES_FOR_FALLBACK_CONTEXT || '12', 10);

export async function processAgentOSChatRequest(
  payload: AgentOSChatAdapterRequest,
): Promise<AgentOSChatAdapterResult> {
  const persona = resolveAgentOSPersona(payload.mode);
  const { userMessage, memoryTurns, contextBundle } = await buildContextForAgentOS(payload, persona);
  const systemPrompt = renderPersonaPrompt(persona, contextBundle);
  const history = buildMessageHistory(systemPrompt, memoryTurns, userMessage);
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
  memoryTurns: Array<{ role: 'user' | 'assistant' | 'system' | 'tool'; content: string }>,
  latestUserMessage: string,
): IChatMessage[] {
  const history: IChatMessage[] = [{ role: 'system', content: systemPrompt }];
  history.push(...memoryTurns);
  history.push({ role: 'user', content: latestUserMessage });
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

async function buildContextForAgentOS(
  payload: AgentOSChatAdapterRequest,
  persona: AgentOSPersonaDefinition,
): Promise<{
  userMessage: string;
  memoryTurns: Array<{ role: 'user' | 'assistant' | 'system' | 'tool'; content: string }>;
  contextBundle?: IContextBundle;
}> {
  const conversationId = payload.conversationId;
  const currentUserMessage =
    [...payload.messages]
      .reverse()
      .find((msg) => msg.role === 'user')?.content ?? '';

  let storedTurns: IStoredConversationTurn[] = [];
  try {
    storedTurns = await sqliteMemoryAdapter.retrieveConversationTurns(
      payload.userId,
      conversationId,
      { limit: CONTEXT_SNIPPET_LIMIT },
    );
  } catch (error) {
    console.error('[AgentOS][MemoryBridge] Failed to retrieve conversation history:', error);
  }

  const memoryMessages = storedTurns.map((turn) => ({
    role: normalizeRole(turn.role) ?? 'system',
    content:
      turn.summary ||
      turn.content ||
      `[${turn.role.toUpperCase()} context omitted due to empty content]`,
  }));

  let contextBundle: IContextBundle | undefined;
  try {
    const knowledgeSnippets = await jsonFileKnowledgeBaseService
      .searchKnowledgeBase(currentUserMessage, 3)
      .then((items) =>
        items.map((it) => ({
          id: it.id,
          type: it.type,
          content: it.content.substring(0, 300) + (it.content.length > 300 ? '...' : ''),
        })),
      );

    contextBundle = await llmContextAggregatorService.generateContextBundle({
      currentUserFocus: {
        query: currentUserMessage,
        intent: persona.category,
        mode: persona.category,
        metadata: { personaId: persona.personaId },
      },
      conversationHistory: memoryMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      userProfile: {
        preferences: {
          currentAgentMode: persona.category,
        },
      },
      systemState: {
        currentTaskContext: `User interacting with ${persona.label}`,
        responseConstraints: contextBundleOutputFormatHints(persona.category),
        sharedKnowledgeSnippets: knowledgeSnippets,
      },
    });
  } catch (error) {
    console.error('[AgentOS][ContextAggregator] Failed to build context bundle:', error);
  }

  return {
    userMessage: currentUserMessage,
    memoryTurns: memoryMessages,
    contextBundle,
  };
}

function renderPersonaPrompt(
  persona: AgentOSPersonaDefinition,
  contextBundle?: IContextBundle,
): string {
  const basePrompt = loadPersonaPrompt(persona);
  if (!contextBundle) {
    return basePrompt;
  }

  const bundleSummary = [
    `Context Bundle (v${contextBundle.version})`,
    `Primary Task: ${contextBundle.primaryTask.description} (intent: ${contextBundle.primaryTask.derivedIntent})`,
    `Required Output: ${contextBundle.primaryTask.requiredOutputFormat}`,
    contextBundle.relevantHistorySummary.length
      ? `Recent History:\n${contextBundle.relevantHistorySummary
          .map((item) => `- ${item.speaker}: ${item.summary}`)
          .join('\n')}`
      : 'Recent History: (none)',
    contextBundle.keyInformationFromDocuments.length
      ? `Knowledge Snippets:\n${contextBundle.keyInformationFromDocuments
          .map((doc) => `- ${doc.source}: ${doc.snippet}`)
          .join('\n')}`
      : 'Knowledge Snippets: (none)',
    contextBundle.criticalSystemContext?.customPersona
      ? `Custom Persona: ${contextBundle.criticalSystemContext.customPersona}`
      : '',
    `Discernment Outcome: ${contextBundle.discernmentOutcome}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  return `${basePrompt}\n\n${bundleSummary}`;
}

function contextBundleOutputFormatHints(mode: string): string {
  switch (mode.toLowerCase()) {
    case 'coding':
    case 'codingassistant':
      return 'Markdown with code blocks and explanations.';
    case 'systemdesigner':
    case 'system_design':
      return 'Architecture Markdown with Mermaid diagrams.';
    case 'meeting':
    case 'businessmeeting':
      return 'Meeting summary with action items.';
    case 'diary':
      return 'Empathetic tone, structured diary entry.';
    case 'tutor':
      return 'Slide-style Markdown with optional quizzes.';
    default:
      return 'Clear Markdown response with bullet points when helpful.';
  }
}
