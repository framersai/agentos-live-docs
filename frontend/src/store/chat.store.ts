/**
 * @file chat.store.ts
 * @description Pinia store for managing chat messages, main content display,
 * conversation history, and streaming state across different AI agents.
 * @version 1.4.7 - Corrected AgentId type usage and removed unused imports.
 */
import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue'; // Removed nextTick
import { type AgentId, agentService, type IAgentDefinition } from '@/services/agent.service';
import {
  advancedConversationManager,
  type ProcessedConversationMessage as AdvProcessedMessage,
  type AdvancedHistoryConfig,
  DEFAULT_ADVANCED_HISTORY_CONFIG // Assuming this is correctly exported
} from '@/services/advancedConversation.manager';
import {
  conversationManager as simpleConversationManager,
  type ConversationMessage as SimpleManagerMessage
} from '@/services/conversation.manager';
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
  const mainAgentContents = ref<Record<string, MainContent | null>>({});
  const conversationIds = ref<Record<string, string>>({});
  const isMainContentStreaming = ref(false);
  const streamingMainContentText = ref('');

  const history = computed(() => readonly(messageHistory.value));
  
  const getCurrentMainContentDataForAgent = (activeAgentId?: AgentId): MainContent | null => {
    if (!activeAgentId) return null;
    return mainAgentContents.value[activeAgentId] || null;
  };

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
        const placeholder = agentDef.inputPlaceholder || 'How can I assist you?';
        let welcomeData = `## Welcome to ${agentDef.label}!\n${agentDef.description}\n\n${placeholder}`;
        let welcomeType: MainContent['type'] = 'welcome';
        
        if (agentId === 'diary_agent') { // Corrected: Use the canonical AgentId
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

  function clearAgentData(agentId?: AgentId | null): void {
    if (agentId) {
      messageHistory.value = messageHistory.value.filter(msg => msg.agentId !== agentId);
      clearMainContentForAgent(agentId);
      delete conversationIds.value[agentId];
    } else {
      messageHistory.value = [];
      mainAgentContents.value = {};
      conversationIds.value = {};
    }
  }
  function clearAllAgentData(): void { clearAgentData(); }
  
  function clearAgentChatLogIfChanging(): void {
    // console.log(`[ChatStore] clearAgentChatLogIfChanging called.`);
  }

  async function getHistoryForApi(
    agentId: AgentId, currentQueryText: string, systemPromptText: string,
    configOverride?: Partial<AdvancedHistoryConfig>,
    additionalCurrentTurnMessages: ChatMessage[] = []
  ): Promise<ProcessedHistoryMessageFE[]> {
    const useAdvanced = voiceSettingsManager.settings.useAdvancedMemory;
    const validRolesForHistory: Array<ChatMessage['role']> = ['user', 'assistant', 'system', 'tool'];
    
    const agentMessagesFromStore: ChatMessage[] = getMessagesForAgent(agentId)
        .filter(m => validRolesForHistory.includes(m.role));
    
    const allMessagesForProcessing: ChatMessage[] = [
        ...agentMessagesFromStore, 
        ...additionalCurrentTurnMessages.filter(m => validRolesForHistory.includes(m.role))
    ].sort((a, b) => a.timestamp - b.timestamp);

    let selectedHistoryForManager: AdvProcessedMessage[];

    if (useAdvanced) {
      const messagesForAdvManager: AdvProcessedMessage[] = allMessagesForProcessing.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system', // 'tool' role may need specific handling if AdvManager expects it
        content: m.content || '',
        timestamp: m.timestamp,
        id: m.id,
        estimatedTokenCount: m.estimatedTokenCount,
        processedTokens: m.processedTokens,
        relevanceScore: m.relevanceScore,
      }));
      // Use the imported DEFAULT_ADVANCED_HISTORY_CONFIG or ensure it's correctly defined
      const baseConfig = advancedConversationManager.getHistoryConfig() || DEFAULT_ADVANCED_HISTORY_CONFIG;
      const effectiveConfig: AdvancedHistoryConfig = { ...baseConfig, ...(configOverride || {}), };
      selectedHistoryForManager = await advancedConversationManager.prepareHistoryForApi(
        messagesForAdvManager, currentQueryText, systemPromptText, effectiveConfig
      );
    } else {
      const messagesForSimpleManager: SimpleManagerMessage[] = allMessagesForProcessing
        .filter(m => m.role === 'user' || m.role === 'assistant' || m.role === 'system')
        .map(m => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content || '',
          timestamp: m.timestamp,
      }));
      // Use voice settings for history count if available
      const historyCountToUse = configOverride?.simpleRecencyMessageCount ??
        voiceSettingsManager.settings.maxHistoryMessages ??
        simpleConversationManager.getHistoryMessageCount();
      const simpleSelected = simpleConversationManager.prepareHistoryForApi(messagesForSimpleManager, historyCountToUse);
      selectedHistoryForManager = simpleSelected.map(m => ({
        role: m.role, content: m.content, timestamp: m.timestamp,
        id: `simple-${m.timestamp}-${Math.random().toString(16).slice(2)}`,
        estimatedTokenCount: undefined, processedTokens: undefined, relevanceScore: undefined,
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
      // tool_calls, tool_call_id, name are usually not part of ProcessedHistoryMessageFE for API context
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
    getCurrentMainContentDataForAgent,
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