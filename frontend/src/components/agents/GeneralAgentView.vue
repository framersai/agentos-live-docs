/**
 * @file GeneralAgentView.vue
 * @description UI component for the General AI Assistant.
 * Displays responses, potentially using CompactMessageRenderer.
 * @version 1.1.2 - Corrected API response handling and CSS.
 */
<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type ChatMessage as StoreChatMessage, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, type ChatMessagePayloadFE, type TextResponseDataFE, type FunctionCallResponseDataFE, type ChatResponseDataFE } from '@/utils/api';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';
import { marked } from 'marked';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/vue/24/outline';
import type { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';

const props = defineProps({
  agentId: { type: String as PropType<IAgentDefinition['id']>, required: true },
  agentConfig: { type: Object as PropType<IAgentDefinition>, required: true }
});

const emit = defineEmits<{
  (e: 'agent-event', event: { type: 'view_mounted', agentId: string, label?: string }): void;
}>();

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
      currentAgentSystemPrompt.value = "You are a helpful general assistant. Please be concise and clear.";
    }
  } else {
    currentAgentSystemPrompt.value = "You are a helpful general assistant. Please be concise and clear.";
  }
};
watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

const handleNewUserInput = async (text: string) => {
  if (!text.trim() || isLoadingResponse.value) return;

  const userMessage: StoreChatMessage = chatStore.addMessage({
    role: 'user', content: text,
    timestamp: Date.now(), agentId: props.agentId,
  });
  
  isLoadingResponse.value = true;
  chatStore.setMainContentStreaming(true, `### Thinking about "${text.substring(0, 40)}..."\n\n<div class="spinner mx-auto my-4"></div>`);

  try {
    let finalSystemPrompt = currentAgentSystemPrompt.value
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage)
      .replace(/{{MODE}}/g, props.agentConfig.id)
      .replace(/{{GENERATE_DIAGRAM}}/g, voiceSettingsManager.settings.generateDiagrams.toString())
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.currentAgentContext || {}))
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, '');

    const maxHistoryMessages = typeof props.agentConfig.capabilities?.maxChatHistory === 'number' 
        ? props.agentConfig.capabilities.maxChatHistory 
        : 10;
    const historyConfigOverride: Partial<AdvancedHistoryConfig> = {
        numRecentMessagesToPrioritize: maxHistoryMessages,
        simpleRecencyMessageCount: maxHistoryMessages
    };
    
    const processedHistoryFromClient = await chatStore.getHistoryForApi(
      props.agentId, text, finalSystemPrompt, historyConfigOverride
    );
    
    const payload: ChatMessagePayloadFE = {
      messages: [{ role: 'user', content: text, timestamp: userMessage.timestamp, agentId: props.agentId }],
      processedHistory: processedHistoryFromClient,
      mode: props.agentConfig.id,
      language: voiceSettingsManager.settings.preferredCodingLanguage,
      generateDiagram: props.agentConfig.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: 'frontend_user_general',
      conversationId: chatStore.getCurrentConversationId(props.agentId),
      systemPromptOverride: finalSystemPrompt,
    };

    const response = await chatAPI.sendMessage(payload);
    const responseData = response.data;
    let assistantMessageContent: string | null = null;

    if (responseData.type === 'function_call_data') {
        console.warn(`[${props.agentConfig.label}Agent] Received unexpected function call: ${responseData.toolName}`);
        assistantMessageContent = responseData.assistantMessageText || "Assistant tried to perform an action I cannot display right now.";
         chatStore.addMessage({
            role: 'assistant', content: `Assistant requested tool: ${responseData.toolName}.`, 
            agentId: props.agentId, model: responseData.model
        });
    } else { // TextResponseDataFE
        assistantMessageContent = responseData.content || "Sorry, I didn't get a response.";
        chatStore.addMessage({
            role: 'assistant', content: assistantMessageContent,
            timestamp: Date.now(), agentId: props.agentId,
            model: responseData.model, usage: responseData.usage,
        });
    }

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
    const errorGuidance = "There was an issue communicating with the AI. Please check your network connection or try again later.";
    chatStore.addMessage({
      role: 'error', content: `Sorry, I encountered an error. ${errorGuidance}`,
      timestamp: Date.now(), agentId: props.agentId,
    });
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown',
      data: `### Error Occurred\n\n${errorMessage}\n\n${errorGuidance}`,
      title: 'Error', timestamp: Date.now(),
    });
  } finally {
    isLoadingResponse.value = false;
    chatStore.setMainContentStreaming(false);
  }
};

const renderMarkdown = (content: string | null) => {
  if (content === null) return '';
  try {
    return marked.parse(content);
  } catch (e) {
    console.error("Error parsing markdown:", e);
    return `<p class="text-red-500 dark:text-red-400">Error rendering content.</p>`;
  }
};

defineExpose({ handleNewUserInput });

onMounted(() => {
  console.log(`[${props.agentConfig.label}] View Mounted`);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: props.agentConfig.label });
  if (!mainContentToDisplay.value && props.agentId) {
    chatStore.ensureMainContentForAgent(props.agentId);
  }
});

</script>

<template>
  <div class="general-agent-view flex flex-col h-full w-full overflow-hidden">
    <div class="agent-header-controls p-2 px-3 border-b border-[var(--border-color-dark)] flex items-center gap-2 text-sm">
      <ChatBubbleLeftEllipsisIcon class="w-5 h-5 shrink-0" :class="props.agentConfig.iconClass || 'text-sky-400'" />
      <span class="font-semibold">{{ props.agentConfig.label }}</span>
    </div>
    <div v-if="isLoadingResponse && !chatStore.isMainContentStreaming" class="loading-overlay">
      <div class="spinner"></div>
      <p class="mt-2 text-sm text-slate-400">Fetching response...</p>
    </div>
    
    <div class="flex-grow relative min-h-0 custom-scrollbar-futuristic overflow-y-auto">
      <template v-if="mainContentToDisplay">
        <CompactMessageRenderer
          v-if="props.agentConfig.capabilities?.usesCompactRenderer && 
                (mainContentToDisplay.type === 'compact-message-renderer-data' || 
                (mainContentToDisplay.type === 'markdown' && !chatStore.isMainContentStreaming) ||
                 mainContentToDisplay.type === 'loading')"
          :content="mainContentToDisplay.data as string"
          :mode="props.agentConfig.id"
          class="p-1 h-full" 
        />
        <div v-else-if="mainContentToDisplay.type === 'markdown' || mainContentToDisplay.type === 'welcome' || mainContentToDisplay.type === 'loading'"
             class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 h-full"
             :class="{'flex flex-col items-center justify-center text-center': mainContentToDisplay.type === 'welcome' && !mainContentToDisplay.data?.includes('###')}"
             v-html="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId 
                     ? renderMarkdown(chatStore.streamingMainContentText + '▋') 
                     : renderMarkdown(mainContentToDisplay.data as string)"
        ></div>
        <div v-else class="p-4 text-slate-400 italic h-full flex items-center justify-center">
          {{ agentConfig.label }} is active. Main content type: {{ mainContentToDisplay.type }}.
        </div>
      </template>
      <div v-else-if="!isLoadingResponse" class="flex-grow flex items-center justify-center h-full p-4">
        <p class="text-slate-500 italic">No main content to display for {{ agentConfig.label }}.</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.general-agent-view {
  background-color: var(--bg-agent-view-dark, theme('colors.slate.800'));
  color: var(--text-primary-dark, theme('colors.slate.100'));
}
.agent-header-controls {
  border-bottom-color: hsla(var(--accent-hue-sky, 200), 60%, 50%, 0.3);
  background-color: var(--bg-header-dark, theme('colors.slate.950'));
}
.loading-overlay {
  @apply absolute inset-0 flex flex-col items-center justify-center z-10;
  background-color: rgba(var(--bg-base-rgb-dark, 26, 32, 44), 0.6);
}

.spinner {
  @apply w-10 h-10 border-4 rounded-full animate-spin;
  border-color: hsla(var(--accent-hue-sky, 200), 50%, 50%, 0.2);
  border-top-color: hsl(var(--accent-hue-sky, 200), 50%, 60%);
}

.custom-scrollbar-futuristic {
  &::-webkit-scrollbar { @apply w-1.5 h-1.5; }
  &::-webkit-scrollbar-track { background-color: hsla(var(--neutral-hue), 20%, 20%, 0.3); @apply rounded-full; }
  &::-webkit-scrollbar-thumb { background-color: hsla(var(--accent-hue-sky, 200), 75%, 60%, 0.6); @apply rounded-full; border: 1px solid hsla(var(--neutral-hue), 20%, 15%, 0.5); }
  &::-webkit-scrollbar-thumb:hover { background-color: hsla(var(--accent-hue-sky, 200), 75%, 70%, 0.8); }
  scrollbar-width: thin;
  scrollbar-color: hsla(var(--accent-hue-sky, 200), 75%, 60%, 0.6) hsla(var(--neutral-hue), 20%, 20%, 0.3);
}

:deep(.prose) {
  h1, h2, h3 { @apply text-[var(--text-primary-dark)] border-b border-[var(--border-color-dark)] pb-1 mb-3; }
  p, li { @apply text-[var(--text-secondary-dark)] my-2; }
  a { @apply text-sky-400 hover:text-sky-300; }
  strong { @apply text-[var(--text-primary-dark)]; }
  code:not(pre code) { @apply bg-slate-700 text-rose-400 px-1.5 py-0.5 rounded-md text-xs; }
  pre { @apply bg-slate-900/70 border border-slate-700 text-sm my-3 p-3; }
}
</style>