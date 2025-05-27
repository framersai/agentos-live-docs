// File: frontend/src/store/chat.store.ts
/**
 * @file chat.store.ts
 * @description Pinia store for managing chat messages, main content display,
 * conversation history, and streaming state across different AI agents.
 * @version 1.4.1
 * @author Voice Coding Assistant Team
 *
 * @notes
 * - v1.4.1: Ensured robust default handling for advanced history config in getHistoryForApi.
 * - Standardized JSDoc for all public members.
 * - Validated `getHistoryForApi` parameter usage and return types.
 * - Ensured roles in ChatMessage and related types are compatible with API expectations.
 * - `clearAgentData` correctly handles optional agentId for targeted or full data clearing.
 */
import { defineStore } from 'pinia';
import { ref, computed, nextTick, readonly, type Ref } from 'vue';
import { type AgentId, agentService } from '@/services/agent.service';
import {
  advancedConversationManager,
  type ProcessedConversationMessage as AdvProcessedMessage,
  type AdvancedHistoryConfig,
  DEFAULT_ADVANCED_HISTORY_CONFIG // Import for fallback
} from '@/services/advancedConversation.manager';
import {
  conversationManager as simpleConversationManager,
  type ConversationMessage as SimpleManagerMessage
} from '@/services/conversation.manager';
import { useAgentStore } from '@/store/agent.store';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import type { ChatMessageFE, ProcessedHistoryMessageFE, ILlmToolCallFE as ApiLlmToolCall } from '@/utils/api';

/**
 * @interface ILlmToolCallUI
 * @description Frontend representation of an LLM tool call, for UI and store.
 * Aligns with ILlmToolCallFE from api.ts.
 */
export interface ILlmToolCallUI extends ApiLlmToolCall {}

/**
 * @interface ChatMessage
 * @description Represents a single message in the chat history store.
 * This type is used internally in the frontend for managing conversation state.
 */
export interface ChatMessage {
  /** Unique identifier for the message. */
  id: string;
  /** The role of the entity that produced the message. */
  role: 'user' | 'assistant' | 'system' | 'error' | 'tool';
  /**
   * The textual content of the message.
   * Can be null, e.g., for an assistant message that only contains tool calls.
   */
  content: string | null;
  /** Unix timestamp (in milliseconds) when the message was created or received. */
  timestamp: number;
  /** Identifier of the agent associated with this message. */
  agentId: AgentId;
  /** Flag indicating if this message represents an error. */
  isError?: boolean;
  /** Identifier of the model that generated the message, if applicable. */
  model?: string;
  /** Token usage statistics for LLM-generated messages. */
  usage?: { prompt_tokens: number | null; completion_tokens: number | null; total_tokens: number | null };
  /** Estimated token count, typically calculated on the frontend. */
  estimatedTokenCount?: number;
  /** For advanced history: tokenized and stemmed content. */
  processedTokens?: string[];
  /** For advanced history: relevance score relative to a query. */
  relevanceScore?: number;
  /** For assistant messages: a list of tool calls requested. */
  tool_calls?: ILlmToolCallUI[];
  /** For tool messages: the ID of the tool_call this message is a result for. */
  tool_call_id?: string;
  /** For tool messages: the name of the function/tool that was executed. */
  name?: string;
}

/**
 * @interface FunctionCallDataForUI
 * @description Data structure for rendering a function/tool call request in the UI.
 */
export interface FunctionCallDataForUI {
  /** The name of the function/tool to be called. */
  name: string;
  /** Parsed arguments for the function/tool. */
  arguments: Record<string, any>;
  /** The unique ID of the tool call request. */
  toolCallId: string;
  /** Optional preliminary text from the assistant when making the tool call. */
  assistantMessageText?: string | null;
}

/**
 * @interface MainContent
 * @description Represents the content to be displayed in an agent's main view area.
 * This allows for various types of content beyond simple markdown.
 */
export interface MainContent {
  /** Identifier of the agent this content belongs to. */
  agentId: AgentId;
  /** The type of content, determining how it should be rendered. */
  type:
    | 'markdown'
    | 'structured-json'
    | 'diagram'
    | 'compact-message-renderer-data'
    | 'function_call_data'
    | 'custom-component'
    | 'welcome'
    | 'loading'
    | 'error'
    | 'diary-entry-viewer';
  /** The actual data for the content. Structure depends on the `type`. */
  data: any;
  /** Optional title for the content panel. */
  title?: string;
  /** Unix timestamp when this content was generated or set. */
  timestamp: number;
}


export const useChatStore = defineStore('chat', () => {
  const messageHistory = ref<ChatMessage[]>([]);
  const mainAgentContents = ref<Record<AgentId | string, MainContent | null>>({});
  const conversationIds = ref<Record<AgentId | string, string>>({});
  const isMainContentStreaming = ref(false);
  const streamingMainContentText = ref('');

  const history = computed(() => readonly(messageHistory));

  const currentMainContentData = computed<MainContent | null>(() => {
    const agentStore = useAgentStore();
    return mainAgentContents.value[agentStore.activeAgentId] || null;
  });

  const getMainContentForAgent = (agentId: AgentId): MainContent | null => {
    return mainAgentContents.value[agentId] || null;
  };

  const getMessagesForAgent = (agentId: AgentId): ChatMessage[] => {
    return messageHistory.value.filter(msg => msg.agentId === agentId);
  };

  const getCurrentConversationId = (agentId: AgentId): string => {
    if (!conversationIds.value[agentId]) {
      conversationIds.value[agentId] = `conv-${agentId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    return conversationIds.value[agentId];
  };

  function addMessage(messageData: Omit<ChatMessage, 'id' | 'timestamp'> & { timestamp?: number, id?: string }): ChatMessage {
    const fullMessage: ChatMessage = {
      id: messageData.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: messageData.timestamp || Date.now(),
      role: messageData.role,
      content: messageData.content,
      agentId: messageData.agentId,
      isError: messageData.isError ?? false,
      model: messageData.model,
      usage: messageData.usage,
      estimatedTokenCount: messageData.estimatedTokenCount,
      processedTokens: messageData.processedTokens,
      relevanceScore: messageData.relevanceScore,
      tool_calls: messageData.tool_calls,
      tool_call_id: messageData.tool_call_id,
      name: messageData.name,
    };
    messageHistory.value.push(fullMessage);
    return fullMessage;
  }

  function updateMainContent(content: MainContent): void {
    mainAgentContents.value[content.agentId] = content;
    nextTick(() => { /* UI updates if necessary */ });
  }

  function clearMainContentForAgent(agentId: AgentId): void {
    if (mainAgentContents.value[agentId]) {
      mainAgentContents.value[agentId] = null;
    }
  }

  function ensureMainContentForAgent(agentId: AgentId): void {
    if (!mainAgentContents.value[agentId]) {
      const agentDef = agentService.getAgentById(agentId);
      if (agentDef) {
        let welcomeData = `### Welcome to ${agentDef.label}!\n${agentDef.description}\n\n${agentDef.inputPlaceholder || 'How can I assist you?'}`;
        let welcomeType: MainContent['type'] = 'welcome';

        if (agentId === 'diary') {
            welcomeType = 'diary-entry-viewer';
            welcomeData = "Select an entry to view, or start a new one. Your thoughts are saved locally in your browser.";
        }

        updateMainContent({
          agentId: agentDef.id,
          type: welcomeType,
          data: welcomeData,
          title: `${agentDef.label} Ready`,
          timestamp: Date.now(),
        });
      }
    }
  }

  function clearAgentData(agentId?: AgentId): void {
    if (agentId) {
      messageHistory.value = messageHistory.value.filter(msg => msg.agentId !== agentId);
      if (mainAgentContents.value[agentId]) {
        mainAgentContents.value[agentId] = null;
      }
      delete conversationIds.value[agentId];
      console.log(`[ChatStore] Cleared data for agent: ${agentId}`);
    } else {
      messageHistory.value = [];
      mainAgentContents.value = {};
      conversationIds.value = {};
      console.log('[ChatStore] Cleared data for ALL agents.');
    }
  }
  
  function clearAllAgentData(): void {
    clearAgentData();
  }

  function clearAgentChatLogIfChanging(newAgentId: AgentId): void {
     console.log(`[ChatStore] clearAgentChatLogIfChanging called for ${newAgentId}. Global history is kept; views filter by agentId. Specific clearing is handled by clearAgentData or UI logic based on settings.`);
  }

  async function getHistoryForApi(
    agentId: AgentId,
    currentQueryText: string,
    systemPromptText: string,
    configOverride?: Partial<AdvancedHistoryConfig>,
    additionalCurrentTurnMessages: ChatMessage[] = []
  ): Promise<ProcessedHistoryMessageFE[]> {
    
    const useAdvanced = voiceSettingsManager.settings.useAdvancedMemory;

    const validRolesForHistory: Array<ChatMessage['role']> = ['user', 'assistant', 'system', 'tool'];
    const agentMessagesFromStore: ChatMessage[] = messageHistory.value.filter(
      m => m.agentId === agentId && validRolesForHistory.includes(m.role)
    );
    const allMessagesForProcessing: ChatMessage[] = [
        ...agentMessagesFromStore, 
        ...additionalCurrentTurnMessages.filter(m => validRolesForHistory.includes(m.role))
    ];

    let selectedHistoryForManager: AdvProcessedMessage[];

    if (useAdvanced) {
      const messagesForAdvManager: AdvProcessedMessage[] = allMessagesForProcessing.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content || '',
        timestamp: m.timestamp,
        id: m.id,
        estimatedTokenCount: m.estimatedTokenCount,
        processedTokens: m.processedTokens,
        relevanceScore: m.relevanceScore,
      }));

      const baseConfig = advancedConversationManager.getHistoryConfig() || DEFAULT_ADVANCED_HISTORY_CONFIG;
      const effectiveConfig: AdvancedHistoryConfig = {
        ...baseConfig,
        ...(configOverride || {}), 
      };
      
      selectedHistoryForManager = await advancedConversationManager.prepareHistoryForApi(
        messagesForAdvManager,
        currentQueryText,
        systemPromptText,
        effectiveConfig
      );
    } else {
      const messagesForSimpleManager: SimpleManagerMessage[] = allMessagesForProcessing.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content || '',
        timestamp: m.timestamp,
      }));
      
      const historyCountToUse = configOverride?.simpleRecencyMessageCount ??
                                simpleConversationManager.getHistoryMessageCount();
      
      const simpleSelected = simpleConversationManager.prepareHistoryForApi(
        messagesForSimpleManager,
        historyCountToUse
      );
      selectedHistoryForManager = simpleSelected.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        id: `simple-${m.timestamp}-${Math.random().toString(16).slice(2)}`,
        estimatedTokenCount: undefined,
        processedTokens: undefined,
        relevanceScore: undefined,
      }));
    }
    
    return selectedHistoryForManager.map(m => ({
        id: m.id,
        role: m.role as ChatMessageFE['role'],
        content: m.content,
        timestamp: m.timestamp,
        estimatedTokenCount: m.estimatedTokenCount,
        processedTokens: m.processedTokens,
        relevanceScore: m.relevanceScore,
        // If tool_calls/tool_call_id are needed in ProcessedHistoryMessageFE,
        // they'd need to be sourced from the original `allMessagesForProcessing`
        // based on matching `id` or `timestamp`, as AdvProcessedMessage doesn't carry them.
        // This mapping currently assumes they are not part of what `ProcessedHistoryMessageFE`
        // sends from this function if derived from AdvProcessedMessage.
        // The API payload `messages: ChatMessageFE[]` should contain the full tool_calls.
    }));
  }

  function setMainContentStreaming(isStreaming: boolean, initialText: string = ''): void {
    isMainContentStreaming.value = isStreaming;
    if (isStreaming) {
      streamingMainContentText.value = initialText;
    }
  }

  function appendStreamingMainContent(chunk: string): void {
    if (isMainContentStreaming.value) {
      streamingMainContentText.value += chunk;
    }
  }
  
  function clearStreamingMainContent(): void {
    streamingMainContentText.value = '';
  }

  return {
    messageHistory: history,
    mainAgentContents: readonly(mainAgentContents),
    isMainContentStreaming: readonly(isMainContentStreaming),
    streamingMainContentText: readonly(streamingMainContentText),
    currentMainContentData,
    getMainContentForAgent,
    getMessagesForAgent,
    getCurrentConversationId,
    addMessage,
    updateMainContent,
    clearAgentData,
    clearAllAgentData,
    getHistoryForApi,
    setMainContentStreaming,
    appendStreamingMainContent,
    clearStreamingMainContent,
    clearMainContentForAgent,
    ensureMainContentForAgent,
    clearAgentChatLogIfChanging,
  };
});