/**
 * @file CodingAgentView.vue
 * @description UI component for the Coding Assistant agent.
 * Handles user input, interacts with the backend chat API via stores,
 * and displays responses, leveraging CompactMessageRenderer for structured content.
 * @version 0.2.2 - Corrected API response handling.
 */
<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, type PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type ChatMessage as StoreChatMessage, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { ChatMessageFE, chatAPI } from '@/utils/api';
import { ChatMessagePayloadFE } from '@/utils/api';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';
import { CodeBracketSquareIcon, LightBulbIcon } from '@heroicons/vue/24/outline';
import type { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';

const props = defineProps({
  /** The unique identifier of the agent. */
  agentId: { type: String as PropType<IAgentDefinition['id']>, required: true },
  /** The configuration object for the agent. */
  agentConfig: { type: Object as PropType<IAgentDefinition>, required: true }
});

const emit = defineEmits<{
  /**
   * Emitted for agent-specific events.
   * @param {object} event - The event payload.
   * @param {'view_mounted'} event.type - The type of event.
   * @param {string} event.agentId - The ID of the agent emitting the event.
   * @param {string} [event.label] - Optional label of the agent.
   */
  (e: 'agent-event', event: { type: 'view_mounted', agentId: string, label?: string }): void;
}>();

const agentStore = useAgentStore();
const chatStore = useChatStore();
const toast = inject<ToastService>('toast');

/** Reactive flag indicating if the agent is currently waiting for an LLM response. */
const isLoadingResponse = ref<boolean>(false);
/** Holds the system prompt string for the current agent. */
const currentAgentSystemPrompt = ref<string>('');

/**
 * @computed mainContentToDisplay
 * @description Retrieves the main content data for this agent from the chat store.
 * @returns {MainContent | null}
 */
const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));

/**
 * @function fetchSystemPrompt
 * @description Loads the system prompt for the agent from the markdown files.
 * @async
 */
const fetchSystemPrompt = async () => {
  if (props.agentConfig.systemPromptKey) {
    try {
      const module = await import(/* @vite-ignore */ `../../../../prompts/${props.agentConfig.systemPromptKey}.md?raw`);
      currentAgentSystemPrompt.value = module.default;
    } catch (e) {
      console.error(`[${props.agentConfig.label}Agent] Failed to load system prompt: ${props.agentConfig.systemPromptKey}.md`, e);
      currentAgentSystemPrompt.value = "You are an expert Coding Assistant. Provide clear code and explanations, structuring your output for slide-like presentation using Markdown headings or ---SLIDE_BREAK--- delimiters. Call tools like 'generateCodeSnippet' or 'explainCodeSegment' when appropriate based on user query.";
    }
  } else {
    currentAgentSystemPrompt.value = "You are an expert Coding Assistant. Provide clear code and explanations, structuring your output for slide-like presentation using Markdown headings or ---SLIDE_BREAK--- delimiters. Call tools like 'generateCodeSnippet' or 'explainCodeSegment' when appropriate based on user query.";
  }
};

watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

/**
 * @function handleNewUserInput
 * @description Processes new user input, sends it to the backend, and updates UI states.
 * @param {string} text - The user's input query.
 * @async
 */
const handleNewUserInput = async (text: string): Promise<void> => {
  if (!text.trim() || isLoadingResponse.value) return;

  const userMessage: StoreChatMessage = chatStore.addMessage({
    role: 'user',
    content: text,
    agentId: props.agentId,
  });
  isLoadingResponse.value = true;
  
  const thinkingData = `## Responding to: ${text.substring(0,50).replace(/</g, '&lt;').replace(/>/g, '&gt;')}...\n\n<div class="loading-animation-small mx-auto my-4"><div></div><div></div><div></div></div>\n\nAnalyzing request and preparing coding assistance...`;
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown', data: thinkingData,
    title: `Processing: ${text.substring(0,30)}...`, timestamp: Date.now()
  });
  chatStore.setMainContentStreaming(true, thinkingData);

  try {
    const preferredLang = voiceSettingsManager.settings.preferredCodingLanguage;
    let finalSystemPrompt = currentAgentSystemPrompt.value
      .replace(/{{LANGUAGE}}/g, preferredLang)
      .replace(/{{USER_QUERY}}/g, text) 
      .replace(/{{GENERATE_DIAGRAM}}/g, (props.agentConfig.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams).toString())
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.currentAgentContext || {}))
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'You will receive a ContextBundle. Base your coding assistance response on it. Structure explanations for slides using Markdown headings or ---SLIDE_BREAK---. Ensure code is in fenced blocks. Use tools like `generateCodeSnippet` or `explainCodeSegment` if the user intent matches.');
      
    const maxHistoryMessages = typeof props.agentConfig.capabilities?.maxChatHistory === 'number' 
        ? props.agentConfig.capabilities.maxChatHistory 
        : 15; // Default for coding agent

    const historyConfigOverride: Partial<AdvancedHistoryConfig> = {
        numRecentMessagesToPrioritize: maxHistoryMessages,
        simpleRecencyMessageCount: maxHistoryMessages 
    };

    const processedHistoryFromClient = await chatStore.getHistoryForApi(
      props.agentId,
      text, 
      finalSystemPrompt,
      historyConfigOverride
    );

    const payload: ChatMessagePayloadFE = {
      messages: [{ role: 'user', content: text, timestamp: userMessage.timestamp, agentId: props.agentId }],
      processedHistory: processedHistoryFromClient,
      mode: props.agentConfig.id,
      language: preferredLang,
      generateDiagram: props.agentConfig.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: 'frontend_user_coding',
      conversationId: chatStore.getCurrentConversationId(props.agentId),
      systemPromptOverride: finalSystemPrompt,
    };
    
    const response = await chatAPI.sendMessage(payload);
    const responseData = response.data;
    let mainContentData: string | null = null;
    let mainContentTitle = `Coding Solution: ${text.substring(0, 30)}...`;
    let mainContentType: MainContent['type'] = props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown';

    if (responseData.type === 'function_call_data') {
        // This agent view currently doesn't render function call UIs directly.
        // It will show the assistant's preliminary text and a note about the tool call.
        console.log(`[${props.agentConfig.label}Agent] Received function call request: ${responseData.toolName}`);
        mainContentData = `Assistant is attempting to use the tool: **${responseData.toolName}**.\n\nArguments: \`\`\`json\n${JSON.stringify(responseData.toolArguments, null, 2)}\n\`\`\`\n\n${responseData.assistantMessageText || ''}`;
        mainContentTitle = `Tool Call: ${responseData.toolName}`;
        mainContentType = 'markdown'; // Display tool call info as markdown

        chatStore.addMessage({
            role: 'assistant', 
            content: `Calling tool: ${responseData.toolName}. ${responseData.assistantMessageText || ''}`, 
            agentId: props.agentId, 
            model: responseData.model,
            // Store tool call info if needed for resubmission logic later
        });

    } else { // TextResponseDataFE
        if (responseData.discernment === 'IGNORE') {
            toast?.add({type: 'info', title: 'Input Ignored', message: responseData.message || 'Your input was considered irrelevant or noise.', duration: 3000});
            mainContentData = mainContentToDisplay.value?.data.replace(/<div class="loading-animation-small.*?<\/div>/s, '') || '';
            mainContentTitle = mainContentToDisplay.value?.title?.replace('Processing Query...', 'Query Handled') || 'Ready';
        } else if (responseData.discernment === 'ACTION_ONLY') {
            toast?.add({type: 'info', title: 'Action Taken', message: responseData.content || 'Action processed.', duration: 3000});
            mainContentData = responseData.content || 'Action noted.';
            mainContentTitle = 'Action Confirmation';
            chatStore.addMessage({
                role: 'assistant', content: responseData.content || 'Action processed.', agentId: props.agentId, model: responseData.model,
            });
        } else { // RESPOND or CLARIFY
            mainContentData = responseData.content || "I seem to be having trouble formulating a response for that.";
            chatStore.addMessage({
                role: 'assistant', content: mainContentData, agentId: props.agentId,
                model: responseData.model, usage: responseData.usage,
            });
        }
    }

    chatStore.updateMainContent({
        agentId: props.agentId,
        type: mainContentType,
        data: mainContentData,
        title: mainContentTitle,
        timestamp: Date.now(),
    });

  } catch (error: any) {
    console.error(`[${props.agentConfig.label}Agent] Chat API error:`, error);
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred.';
    toast?.add({ type: 'error', title: `${props.agentConfig.label} Error`, message: errorMessage, duration: 7000 });
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown',
      data: `### Error\n\nAn error occurred: *${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
      title: 'Error in Response', timestamp: Date.now()
    });
    chatStore.addMessage({
      role: 'error', content: `Failed to get response: ${errorMessage}`, agentId: props.agentId,
    });
  } finally {
    isLoadingResponse.value = false;
    chatStore.setMainContentStreaming(false);
  }
};

defineExpose({ handleNewUserInput });

onMounted(() => {
  console.log(`[${props.agentConfig.label}] View Mounted. Config:`, props.agentConfig);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: props.agentConfig.label });
  chatStore.ensureMainContentForAgent(props.agentId);
});
</script>

<template>
  <div class="coding-agent-view flex flex-col h-full w-full overflow-hidden bg-[var(--bg-surface-dark)] text-[var(--text-primary-dark)]">
    <div class="agent-header-controls p-2 px-3 border-b border-[var(--border-color-dark)] flex items-center justify-between gap-2 text-sm">
      <div class="flex items-center gap-2">
        <CodeBracketSquareIcon class="w-5 h-5 shrink-0" :class="props.agentConfig.iconClass || 'text-rose-400'" />
        <span class="font-semibold">{{ props.agentConfig.label }}</span>
      </div>
      </div>

    <div class="flex-grow relative min-h-0 custom-scrollbar-futuristic overflow-y-auto">
      <div v-if="isLoadingResponse && !chatStore.isMainContentStreaming" class="loading-curtain">
        <div class="loading-animation-small"><div></div><div></div><div></div></div>
        <p class="mt-2 text-sm text-[var(--text-muted-dark)]">Crafting code solution...</p>
      </div>
      
      <template v-if="mainContentToDisplay && (!isLoadingResponse || chatStore.isMainContentStreaming)">
        <CompactMessageRenderer
          v-if="props.agentConfig.capabilities?.usesCompactRenderer && 
                (mainContentToDisplay.type === 'compact-message-renderer-data' || 
                 mainContentToDisplay.type === 'markdown' || 
                 mainContentToDisplay.type === 'loading')"
          :content="chatStore.isMainContentStreaming ? chatStore.streamingMainContentText : mainContentToDisplay.data as string"
          :mode="props.agentConfig.id"
          :language="voiceSettingsManager.settings.preferredCodingLanguage"
          class="h-full p-1"
        />
        <div v-else-if="mainContentToDisplay.type === 'markdown' || mainContentToDisplay.type === 'loading' || mainContentToDisplay.type === 'welcome'"
             class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 h-full"
             :class="{'flex flex-col items-center justify-center text-center': mainContentToDisplay.type === 'welcome'}"
             v-html="chatStore.isMainContentStreaming ? chatStore.streamingMainContentText + '▋' : mainContentToDisplay.data" 
        ></div>
        <div v-else class="p-4 text-[var(--text-muted-dark)] italic h-full flex items-center justify-center">
          <p>Output from {{ agentConfig.label }} will appear here. (Type: {{ mainContentToDisplay.type }})</p>
        </div>
      </template>
      <div v-else-if="!isLoadingResponse && !mainContentToDisplay" 
           class="flex-grow flex flex-col items-center justify-center h-full p-4 text-center text-[var(--text-secondary-dark)]">
        <LightBulbIcon class="w-16 h-16 mb-4 text-[var(--text-muted-dark)] opacity-60" />
        <p class="text-lg font-medium">{{ props.agentConfig.inputPlaceholder || 'Ask your coding question.' }}</p>
        <p class="text-xs mt-1">I can help with algorithms, debugging, code explanations, and more.</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.coding-agent-view {
  background-color: var(--bg-agent-view-dark, theme('colors.slate.800'));
  color: var(--text-primary-dark, theme('colors.slate.100'));
}

.agent-header-controls {
  border-bottom-color: hsla(var(--accent-hue-rose, 340), 60%, 50%, 0.3); /* Rose-ish accent */
  background-color: var(--bg-header-dark, theme('colors.slate.950'));
}

.loading-curtain {
  @apply absolute inset-0 flex flex-col items-center justify-center z-10;
  background-color: rgba(var(--bg-base-rgb-dark, 26, 32, 44), 0.6);
  backdrop-filter: blur(4px);
}

.loading-animation-small > div {
  box-sizing: border-box; @apply block absolute w-8 h-8 m-1 border-2 rounded-full animate-spin;
  border-color: hsla(var(--accent-hue-rose, 340), 70%, 50%, 0.2) transparent transparent transparent;
}
.loading-animation-small > div:nth-child(1) { animation-delay: -0.45s; }
.loading-animation-small > div:nth-child(2) { animation-delay: -0.3s;  border-top-color: hsl(var(--accent-hue-rose, 340), 70%, 60%); }
.loading-animation-small > div:nth-child(3) { animation-delay: -0.15s; border-top-color: hsl(var(--accent-hue-rose, 340), 70%, 70%); }


.custom-scrollbar-futuristic {
  &::-webkit-scrollbar {
    @apply w-1.5 h-1.5;
  }
  &::-webkit-scrollbar-track {
    background-color: hsla(var(--neutral-hue), 20%, 20%, 0.3);
    @apply rounded-full;
  }
  &::-webkit-scrollbar-thumb {
    background-color: hsla(var(--accent-hue-rose, 340), 75%, 60%, 0.6); /* Rose accent */
    @apply rounded-full;
    border: 1px solid hsla(var(--neutral-hue), 20%, 15%, 0.5);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: hsla(var(--accent-hue-rose, 340), 75%, 70%, 0.8);
  }
  scrollbar-width: thin;
  scrollbar-color: hsla(var(--accent-hue-rose, 340), 75%, 60%, 0.6) hsla(var(--neutral-hue), 20%, 20%, 0.3);
}

:deep(.prose) {
  h1, h2, h3 { @apply text-[var(--text-primary-dark)] border-b border-[var(--border-color-dark)] pb-1; }
  p, li { @apply text-[var(--text-secondary-dark)]; }
  a { @apply text-rose-400 hover:text-rose-300; }
  strong { @apply text-[var(--text-primary-dark)]; }
  code:not(pre code) { @apply bg-slate-700 text-emerald-400 px-1.5 py-0.5 rounded-md text-xs; }
  pre { 
    @apply bg-slate-900/70 border border-slate-700 text-sm; 
  }
}
</style>