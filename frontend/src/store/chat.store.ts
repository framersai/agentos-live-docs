// File: frontend/src/store/chat.store.ts
/**
 * @file chat.store.ts
 * @description Pinia store for managing chat messages, main content display,
 * conversation history, and streaming state across different AI agents.
 * @version 1.4.3 - Removed unused 'newAgentId' parameter from clearAgentChatLogIfChanging.
 */
import { defineStore } from 'pinia';
import { ref, computed, nextTick, readonly } from 'vue'; // Removed unused 'Ref'
import { type AgentId, agentService } from '@/services/agent.service';
import {
  advancedConversationManager,
  type ProcessedConversationMessage as AdvProcessedMessage,
  type AdvancedHistoryConfig,
  DEFAULT_ADVANCED_HISTORY_CONFIG
} from '@/services/advancedConversation.manager';
import {
  conversationManager as simpleConversationManager,
  type ConversationMessage as SimpleManagerMessage
} from '@/services/conversation.manager';
import { useAgentStore } from '@/store/agent.store';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import type { ChatMessageFE, ProcessedHistoryMessageFE, ILlmToolCallFE as ApiLlmToolCall } from '@/utils/api';

export interface ILlmToolCallUI extends ApiLlmToolCall {}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error' | 'tool';
  content: string | null;
  timestamp: number;
  agentId: AgentId;
  isError?: boolean;
  model?: string;
  usage?: { prompt_tokens: number | null; completion_tokens: number | null; total_tokens: number | null };
  estimatedTokenCount?: number;
  processedTokens?: string[];
  relevanceScore?: number;
  tool_calls?: ILlmToolCallUI[];
  tool_call_id?: string;
  name?: string;
}
export interface FunctionCallDataForUI {
  name: string;
  arguments: Record<string, any>;
  toolCallId: string;
  assistantMessageText?: string | null;
}
export interface MainContent {
  agentId: AgentId;
  type:
    | 'markdown' | 'structured-json' | 'diagram' | 'compact-message-renderer-data'
    | 'function_call_data' | 'custom-component' | 'welcome' | 'loading' | 'error'
    | 'diary-entry-viewer';
  data: any;
  title?: string;
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
  const getMainContentForAgent = (agentId: AgentId): MainContent | null => mainAgentContents.value[agentId] || null;
  const getMessagesForAgent = (agentId: AgentId): ChatMessage[] => messageHistory.value.filter(msg => msg.agentId === agentId);
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
      role: messageData.role, content: messageData.content, agentId: messageData.agentId,
      isError: messageData.isError ?? false, model: messageData.model, usage: messageData.usage,
      estimatedTokenCount: messageData.estimatedTokenCount, processedTokens: messageData.processedTokens,
      relevanceScore: messageData.relevanceScore, tool_calls: messageData.tool_calls,
      tool_call_id: messageData.tool_call_id, name: messageData.name,
    };
    messageHistory.value.push(fullMessage);
    return fullMessage;
  }
  function updateMainContent(content: MainContent): void {
    mainAgentContents.value[content.agentId] = content;
    nextTick(() => { /* UI updates */ });
  }
  function clearMainContentForAgent(agentId: AgentId): void {
    if (mainAgentContents.value[agentId]) mainAgentContents.value[agentId] = null;
  }
  function ensureMainContentForAgent(agentId: AgentId): void {
    if (!mainAgentContents.value[agentId]) {
      const agentDef = agentService.getAgentById(agentId);
      if (agentDef) {
        let welcomeData = `### Welcome to ${agentDef.label}!\n${agentDef.description}\n\n${agentDef.inputPlaceholder || 'How can I assist you?'}`;
        let welcomeType: MainContent['type'] = 'welcome';
        // The 'diaryAgent' string is now a valid AgentId type
        if (agentId === 'diaryAgent') {
          welcomeType = 'diary-entry-viewer';
          welcomeData = "Select an entry to view, or start a new one. Your thoughts are saved locally.";
        }
        updateMainContent({
          agentId: agentDef.id, type: welcomeType, data: welcomeData,
          title: `${agentDef.label} Ready`, timestamp: Date.now(),
        });
      }
    }
  }
  function clearAgentData(agentId?: AgentId): void {
    if (agentId) {
      messageHistory.value = messageHistory.value.filter(msg => msg.agentId !== agentId);
      if (mainAgentContents.value[agentId]) mainAgentContents.value[agentId] = null;
      delete conversationIds.value[agentId];
    } else {
      messageHistory.value = []; mainAgentContents.value = {}; conversationIds.value = {};
    }
  }
  function clearAllAgentData(): void { clearAgentData(); }
  
  /**
   * @function clearAgentChatLogIfChanging
   * @description Placeholder function. Actual logic for clearing chat logs when an agent changes
   * is typically handled within setActiveAgent in agent.store.ts or by the view itself based on settings.
   * This function is kept for API consistency if it was previously defined, but its direct utility here is limited.
   * The `newAgentId` parameter was unused and has been removed.
   */
  function clearAgentChatLogIfChanging(): void {
    console.log(`[ChatStore] clearAgentChatLogIfChanging called. Note: Specific clearing is typically handled by agent change logic.`);
  }

  async function getHistoryForApi(
    agentId: AgentId, currentQueryText: string, systemPromptText: string,
    configOverride?: Partial<AdvancedHistoryConfig>,
    additionalCurrentTurnMessages: ChatMessage[] = []
  ): Promise<ProcessedHistoryMessageFE[]> {
    // ... (rest of the function remains the same as it was largely correct)
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
        role: m.role as 'user' | 'assistant' | 'system', content: m.content || '',
        timestamp: m.timestamp, id: m.id, estimatedTokenCount: m.estimatedTokenCount,
        processedTokens: m.processedTokens, relevanceScore: m.relevanceScore,
      }));
      const baseConfig = advancedConversationManager.getHistoryConfig() || DEFAULT_ADVANCED_HISTORY_CONFIG;
      const effectiveConfig: AdvancedHistoryConfig = { ...baseConfig, ...(configOverride || {}), };
      selectedHistoryForManager = await advancedConversationManager.prepareHistoryForApi(
        messagesForAdvManager, currentQueryText, systemPromptText, effectiveConfig
      );
    } else {
      const messagesForSimpleManager: SimpleManagerMessage[] = allMessagesForProcessing.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content || '', timestamp: m.timestamp,
      }));
      const historyCountToUse = configOverride?.simpleRecencyMessageCount ?? simpleConversationManager.getHistoryMessageCount();
      const simpleSelected = simpleConversationManager.prepareHistoryForApi(messagesForSimpleManager, historyCountToUse);
      selectedHistoryForManager = simpleSelected.map(m => ({
        role: m.role, content: m.content, timestamp: m.timestamp,
        id: `simple-${m.timestamp}-${Math.random().toString(16).slice(2)}`,
        estimatedTokenCount: undefined, processedTokens: undefined, relevanceScore: undefined,
      }));
    }
    return selectedHistoryForManager.map(m => ({
      id: m.id, role: m.role as ChatMessageFE['role'], content: m.content,
      timestamp: m.timestamp, estimatedTokenCount: m.estimatedTokenCount,
      processedTokens: m.processedTokens, relevanceScore: m.relevanceScore,
    }));
  }
  function setMainContentStreaming(isStreaming: boolean, initialText: string = ''): void {
    isMainContentStreaming.value = isStreaming;
    if (isStreaming) streamingMainContentText.value = initialText;
  }
  function appendStreamingMainContent(chunk: string): void {
    if (isMainContentStreaming.value) streamingMainContentText.value += chunk;
  }
  function clearStreamingMainContent(): void { streamingMainContentText.value = ''; }

  return {
    messageHistory: history, mainAgentContents: readonly(mainAgentContents),
    isMainContentStreaming: readonly(isMainContentStreaming),
    streamingMainContentText: readonly(streamingMainContentText),
    currentMainContentData, getMainContentForAgent, getMessagesForAgent,
    getCurrentConversationId, addMessage, updateMainContent, clearAgentData,
    clearAllAgentData, getHistoryForApi, setMainContentStreaming,
    appendStreamingMainContent, clearStreamingMainContent, clearMainContentForAgent,
    ensureMainContentForAgent, clearAgentChatLogIfChanging,
  };
});