// File: frontend/src/components/agents/common/GeneralAgentView.vue
/**
 * @file GeneralAgentView.vue
 * @description UI component for the General AI Assistant.
 * @version 1.0.4 - Corrected TS errors related to argument counts and property access.
 */
<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type ChatMessage, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, type ChatMessagePayload } from '@/utils/api';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';

const props = defineProps({
    agentId: {
        type: String as PropType<IAgentDefinition['id']>,
        required: true,
    },
    agentConfig: {
        type: Object as PropType<IAgentDefinition>,
        required: true,
    }
});

const emit = defineEmits(['agent-event']);

const agentStore = useAgentStore();
const chatStore = useChatStore();
const toast = inject<ToastService>('toast');

const isLoadingResponse = ref(false);
const currentAgentSystemPrompt = ref('');

const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));

const fetchSystemPrompt = async () => {
    if (props.agentConfig.systemPromptKey) {
        try {
            const module = await import(/* @vite-ignore */ `../../../../prompts/${props.agentConfig.systemPromptKey}.md?raw`);
            currentAgentSystemPrompt.value = module.default;
        } catch (e) {
            console.error(`[${props.agentId}Agent] Failed to load system prompt: ${props.agentConfig.systemPromptKey}.md`, e);
            currentAgentSystemPrompt.value = "You are a helpful general assistant. Please be concise.";
        }
    } else {
        currentAgentSystemPrompt.value = "You are a helpful general assistant. Please be concise.";
    }
};

watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

const handleNewUserInput = async (text: string) => {
    if (!text.trim() || isLoadingResponse.value) return;

    const userMessage: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        role: 'user' as 'user', // Explicitly type role
        content: text,
        timestamp: Date.now(),
        agentId: props.agentId,
    };
    chatStore.addMessage(userMessage);
    
    isLoadingResponse.value = true;
    chatStore.setMainContentStreaming(true, `Thinking about "${text.substring(0,30)}..."`);

    try {
        // Correctly pass 3 arguments to getHistoryForApi if maxTokens is relevant, otherwise pass undefined
        const historyForApi = await chatStore.getHistoryForApi(
            props.agentId, 
            props.agentConfig.capabilities?.maxChatHistory || 10,
            undefined // Or pass a token limit if calculated: e.g., 4000
        );
        
        let finalSystemPrompt = currentAgentSystemPrompt.value
            .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage)
            .replace(/{{MODE}}/g, props.agentConfig.id)
            .replace(/{{GENERATE_DIAGRAM}}/g, voiceSettingsManager.settings.generateDiagrams.toString())
            .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.currentAgentContext || {}))
            .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, '');

        const messagesForLlm: ChatMessagePayload['messages'] = [
            { role: 'system', content: finalSystemPrompt },
            ...historyForApi, // historyForApi is now awaited and should be an array
        ];
        
        const payload: ChatMessagePayload = {
            messages: messagesForLlm,
            mode: props.agentConfig.systemPromptKey,
            language: voiceSettingsManager.settings.preferredCodingLanguage,
            generateDiagram: props.agentConfig.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
            userId: 'private_user_general_agent',
            conversationId: chatStore.getCurrentConversationId(props.agentId),
        };

        const response = await chatAPI.sendMessage(payload);
        const assistantMessageContent = response.data.content || "Sorry, I didn't get a response.";
        chatStore.addMessage({
            id: `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            role: 'assistant',
            content: assistantMessageContent,
            timestamp: Date.now(),
            agentId: props.agentId,
            model: response.data.model,
            usage: response.data.usage,
        });

        chatStore.updateMainContent({
            agentId: props.agentId,
            type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: assistantMessageContent,
            title: `Response to: "${text.substring(0, 30)}..."`,
            timestamp: Date.now(),
        });

    } catch (error: any) {
        console.error(`[${props.agentId}Agent] Chat API error:`, error);
        const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
        toast?.add({ type: 'error', title: `${props.agentConfig.label} Error`, message: errorMessage, duration: 7000 });
        const errorGuidance = "There was an issue communicating with the AI. Please check your network connection or try again later."; // Shortened
        chatStore.addMessage({
            id: `error-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            role: 'assistant',
            content: `Sorry, I encountered an error. ${errorGuidance}`,
            timestamp: Date.now(),
            agentId: props.agentId,
            isError: true,
        });
        chatStore.updateMainContent({
            agentId: props.agentId,
            type: 'markdown',
            data: `### Error Occurred\n\n${errorMessage}\n\n${errorGuidance}`,
            title: 'Error',
            timestamp: Date.now(),
        });
    } finally {
        isLoadingResponse.value = false;
        chatStore.setMainContentStreaming(false);
    }
};

defineExpose({ handleNewUserInput });

onMounted(() => {
    console.log(`[${props.agentConfig.label}] View Mounted`);
    emit('agent-event', { type: 'view_mounted', agentId: props.agentId });
    if (!mainContentToDisplay.value && props.agentId) {
         chatStore.updateMainContent({
            agentId: props.agentId,
            type: 'markdown',
            data: `### Welcome to ${props.agentConfig.label}!\n${props.agentConfig.description}\n\n${props.agentConfig.inputPlaceholder || 'How can I help you?'}`,
            title: `${props.agentConfig.label} Ready`,
            timestamp: Date.now(),
        });
    }
});

</script>

<template>
  <div class="general-agent-view flex flex-col h-full w-full overflow-hidden">
    <div v-if="isLoadingResponse && !chatStore.isMainContentStreaming" class="loading-overlay">
      <div class="spinner"></div>
      <p class="mt-2 text-sm text-slate-400">Fetching response...</p>
    </div>
    
    <template v-if="mainContentToDisplay">
        <CompactMessageRenderer
            v-if="props.agentConfig.capabilities?.usesCompactRenderer && mainContentToDisplay.type === 'compact-message-renderer-data'"
            :content="mainContentToDisplay.data" 
            :mode="props.agentConfig.id"
            class="flex-grow overflow-y-auto p-1"
        />
        <div v-else-if="mainContentToDisplay.type === 'markdown'"
             class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 flex-grow overflow-y-auto"
             v-html="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId ? chatStore.streamingMainContentText + '▋' : mainContentToDisplay.data"
        ></div>
         <div v-else class="p-4 text-slate-400 italic">
            {{ agentConfig.label }} is active. Main content type: {{ mainContentToDisplay.type }}.
        </div>
    </template>
     <div v-else-if="!isLoadingResponse" class="flex-grow flex items-center justify-center">
        <p class="text-slate-500 italic">No main content to display for {{ agentConfig.label }}.</p>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(18, 12, 38, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
}
.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(167, 139, 250, 0.2);
    border-top-color: theme('colors.purple.400');
    border-radius: 50%;
    animation: spin_general_agent_view_v2 1s linear infinite; /* Unique animation name */
}
@keyframes spin_general_agent_view_v2 { /* Unique animation name */
  to { transform: rotate(360deg); }
}
</style>