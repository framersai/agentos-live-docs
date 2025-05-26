// File: frontend/src/store/chat.store.ts
/**
 * @file chat.store.ts
 * @description Pinia store for managing chat messages, main content display for agents,
 * and conversation history. Supports conditional use of simple or advanced history management.
 * @version 1.2.0 - Integrated conditional history manager, fixed type errors.
 */
import { defineStore } from 'pinia';
import { ref, computed, nextTick, readonly } from 'vue';
import type { AgentId } from '@/services/agent.service';
import { 
    advancedConversationManager, 
    type ProcessedConversationMessage,
    type AdvancedHistoryConfig // <-- Import AdvancedHistoryConfig
} from '@/services/advancedConversation.manager'; // Corrected import path assuming .ts extension
import { 
    conversationManager as simpleConversationManager,
    type ConversationMessage as SimpleManagerMessage // Alias to avoid name clash
} from '@/services/conversation.manager';
import { useAgentStore } from '@/store/agent.store';
import { voiceSettingsManager } from '@/services/voice.settings.service';

// Renamed from ChatMessageForStore for consistency with other components
export interface ChatMessage {
    id: string; 
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number; 
    agentId: AgentId;
    
    isError?: boolean;
    model?: string;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    
    // These fields align with ProcessedConversationMessage and can be used by AdvancedConversationManager
    estimatedTokenCount?: number;
    processedTokens?: string[];
    relevanceScore?: number;
}

export interface MainContent {
    agentId: AgentId;
    type: 'markdown' | 'structured-json' | 'diagram' | 'compact-message-renderer-data' | 'custom-component' | 'welcome';
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

    const history = computed(() => messageHistory.value);

    const currentMainContentData = computed(() => {
        const agentStore = useAgentStore(); // Called within computed property
        return mainAgentContents.value[agentStore.activeAgentId] || null;
    });

    const getMainContentForAgent = (agentId: AgentId) => {
        return mainAgentContents.value[agentId] || null;
    };
    
    const getMessagesForAgent = (agentId: AgentId): ChatMessage[] => {
        return messageHistory.value.filter(msg => msg.agentId === agentId);
    };

    const getCurrentConversationId = (agentId: AgentId): string => {
        if (!conversationIds.value[agentId]) {
            conversationIds.value[agentId] = `conv-${agentId}-${Date.now()}`;
        }
        return conversationIds.value[agentId];
    };

    function addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'> & { timestamp?: number, id?: string }): ChatMessage {
        const fullMessage: ChatMessage = {
            id: message.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            timestamp: message.timestamp || Date.now(),
            role: message.role,
            content: message.content,
            agentId: message.agentId,
            isError: message.isError,
            model: message.model,
            usage: message.usage,
        };
        messageHistory.value.push(fullMessage);
        return fullMessage;
    }

    function updateMainContent(content: MainContent): void {
        mainAgentContents.value[content.agentId] = content;
        nextTick(() => { /* Potential UI updates if needed */ });
    }

    function clearAgentData(agentId?: AgentId): void {
        if (agentId) {
            messageHistory.value = messageHistory.value.filter(msg => msg.agentId !== agentId);
            mainAgentContents.value[agentId] = null;
            delete conversationIds.value[agentId];
        } else {
            messageHistory.value = [];
            mainAgentContents.value = {};
            conversationIds.value = {};
        }
    }

    /**
     * Prepares conversation history for sending to the API.
     * Conditionally uses either the simple or advanced conversation manager based on settings.
     */
    async function getHistoryForApi(
        agentId: AgentId,
        currentQueryText: string,         // Required for AdvancedConversationManager
        systemPromptText: string,       // Required for AdvancedConversationManager (for token budgeting)
        countForSimpleManager?: number,  // Used if simple manager is active
        configOverrideForAdvanced?: Partial<AdvancedHistoryConfig> // Optional override for advanced manager
    ): Promise<Array<{role: 'user' | 'assistant' | 'system', content: string}>> {
        
        const agentMessages = messageHistory.value.filter(
            m => m.agentId === agentId && (m.role === 'user' || m.role === 'assistant' || m.role === 'system')
        );

        let selectedHistory: Array<ProcessedConversationMessage | SimpleManagerMessage>;

        if (voiceSettingsManager.settings.useAdvancedMemory) {
            // console.log('[ChatStore] Using Advanced Conversation Manager');
            const messagesForManager: ProcessedConversationMessage[] = agentMessages.map(m => ({
                role: m.role,
                content: m.content,
                timestamp: m.timestamp,
                id: m.id,
                // Advanced manager will populate estimatedTokenCount, processedTokens, relevanceScore
            }));

            selectedHistory = await advancedConversationManager.prepareHistoryForApi(
                messagesForManager,
                currentQueryText,
                systemPromptText,
                // configOverrideForAdvanced // This was the line with the error, it should be part of the object
            );
        } else {
            // console.log('[ChatStore] Using Simple Conversation Manager');
            const messagesForSimpleManager: SimpleManagerMessage[] = agentMessages.map(m => ({
                role: m.role as 'user' | 'assistant' | 'system',
                content: m.content,
                timestamp: m.timestamp,
                // Map other properties if SimpleManagerMessage expects them
            }));
            const historyCountToUse = countForSimpleManager || simpleConversationManager.getHistoryMessageCount();
            // Assuming simpleConversationManager.prepareHistoryForApi takes (allMessages, maxMessagesToSend?, maxTokenEstimate?)
            // Your simple manager's prepareHistoryForApi signature:
            // public prepareHistoryForApi(allMessages: ConversationMessage[], maxMessagesToSend?: number, maxTokenEstimate?: number): ConversationMessage[]
            // The 'maxTokenEstimate' for the simple manager is not currently being passed from agent views, so it will be undefined.
            selectedHistory = simpleConversationManager.prepareHistoryForApi(
                messagesForSimpleManager, 
                historyCountToUse,
                undefined // Placeholder for maxTokenEstimate if simple manager uses it.
            );
        }
        
        return selectedHistory.map(m => ({ role: m.role, content: m.content }));
    }

    function setMainContentStreaming(isStreaming: boolean, initialText: string = ''): void {
        isMainContentStreaming.value = isStreaming;
        streamingMainContentText.value = isStreaming ? initialText : '';
    }

    function appendStreamingMainContent(chunk: string): void {
        if (isMainContentStreaming.value) {
            streamingMainContentText.value += chunk;
        }
    }

    return {
        messageHistory: history,
        mainAgentContents,
        isMainContentStreaming: readonly(isMainContentStreaming),
        streamingMainContentText: readonly(streamingMainContentText),
        currentMainContentData,
        getMainContentForAgent,
        getMessagesForAgent,
        getCurrentConversationId,
        addMessage,
        updateMainContent,
        clearAgentData,
        getHistoryForApi,
        setMainContentStreaming,
        appendStreamingMainContent,
    };
});