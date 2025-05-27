/**
 * @file SystemDesignerAgentView.vue
 * @description UI component for the System Design AI agent "Architecton".
 * Facilitates collaborative system design with a focus on diagram generation and structured explanations.
 * @version 0.2.1 - Corrected API response handling.
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
import { LightBulbIcon, CodeBracketSquareIcon } from '@heroicons/vue/24/outline';
import { marked } from 'marked';
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
      currentAgentSystemPrompt.value = "You are Architecton, a System Design AI. Help design and diagram complex systems collaboratively. Use Markdown headings or ---SLIDE_BREAK--- for main content formatting. Use the 'generateArchitectureDiagram' tool for diagram creation or updates.";
    }
  } else {
    currentAgentSystemPrompt.value = "You are Architecton, a System Design AI. Help design and diagram complex systems collaboratively. Use Markdown headings or ---SLIDE_BREAK--- for main content formatting. Use the 'generateArchitectureDiagram' tool for diagram creation or updates.";
  }
};
watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

const getRecentDesignContext = (): string => {
  const context = agentStore.currentAgentContext;
  if (context?.focus_area) return `your previous focus on ${context.focus_area}`;
  if (context?.current_diagram_mermaid_code) return `the existing diagram we were working on`;
  return "our last design discussion";
};

const handleNewUserInput = async (text: string) => {
  if (!text.trim() || isLoadingResponse.value) return;

  const userMessage: StoreChatMessage = chatStore.addMessage({
    role: 'user', content: text,
    timestamp: Date.now(), agentId: props.agentId,
  });
  isLoadingResponse.value = true;
  
  const currentTitle = mainContentToDisplay.value?.title || "System Design Discussion";
  const loadingMessage = `## ${currentTitle.replace("Processing...", "").replace("Ready", "").trim()}\n\nUpdating design based on: *"${text.substring(0, 50)}..."*\n\n<div class="flex justify-center items-center p-8"><div class="spinner-designer"></div><span class="ml-3 text-slate-400">Architecting...</span></div>`;
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown', data: loadingMessage,
    title: `Processing: ${text.substring(0, 30)}...`, timestamp: Date.now()
  });

  try {
    const recentContextSummary = getRecentDesignContext();
    let finalSystemPrompt = currentAgentSystemPrompt.value
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage)
      .replace(/{{USER_QUERY}}/g, text)
      .replace(/{{RECENT_TOPICS_SUMMARY}}/gi, recentContextSummary)
      .replace(/{{GENERATE_DIAGRAM}}/g, "true")
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify({
        ...agentStore.currentAgentContext,
        current_diagram_mermaid_code: extractMermaidCode(mainContentToDisplay.value?.data)
      }))
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Focus on iterative diagram updates and clear explanations. Use Markdown headings for sections or ---SLIDE_BREAK--- for CompactMessageRenderer. Utilize the `generateArchitectureDiagram` tool for diagram creation/updates.');

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
      messages: [{role: 'user', content: text, timestamp: userMessage.timestamp, agentId: props.agentId}],
      processedHistory: processedHistoryFromClient,
      mode: props.agentConfig.id,
      language: voiceSettingsManager.settings.preferredCodingLanguage,
      generateDiagram: true,
      userId: 'frontend_user_designer',
      conversationId: chatStore.getCurrentConversationId(props.agentId),
      systemPromptOverride: finalSystemPrompt,
    };
    
    const response = await chatAPI.sendMessage(payload);
    const responseData = response.data;
    let assistantMessageContent: string | null = null;
    let mainContentTitle = `System Design: Iteration on "${text.substring(0, 30)}..."`;
    let mainContentType: MainContent['type'] = props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown';


    if (responseData.type === 'function_call_data') {
        console.log(`[${props.agentConfig.label}Agent] Received function call request: ${responseData.toolName}`);
        // Assuming the diagram tool's output (Mermaid code) will be sent back by the user/frontend
        // For now, the assistant's preliminary text will be shown.
        assistantMessageContent = `Architecton is working on the diagram: **${responseData.toolName}**.\n\nArguments: \`\`\`json\n${JSON.stringify(responseData.toolArguments, null, 2)}\n\`\`\`\n\n${responseData.assistantMessageText || ''}`;
        mainContentTitle = `Tool Call: ${responseData.toolName}`;
        mainContentType = 'markdown';

        chatStore.addMessage({
            role: 'assistant', 
            content: `Requesting diagram generation via ${responseData.toolName}. ${responseData.assistantMessageText || ''}`, 
            agentId: props.agentId, 
            model: responseData.model,
            tool_calls: [{id: responseData.toolCallId, type:'function', function: {name: responseData.toolName, arguments: JSON.stringify(responseData.toolArguments)}}]
        });
        // The frontend would then hypothetically execute this (e.g. calling a diagram service or itself if it's just LLM generating mermaid)
        // and send back a 'tool' role message. Here, we just display the request.
    } else { // TextResponseDataFE
        assistantMessageContent = responseData.content || "I'm processing your design input. One moment.";
        const diagramUpdateNote = assistantMessageContent && assistantMessageContent.includes("```mermaid") ? "Diagram updated." : "Discussion updated.";
        chatStore.addMessage({
            role: 'assistant',
            content: `Okay, I've updated the design in the main view. ${diagramUpdateNote} What are your thoughts on this iteration?`,
            timestamp: Date.now(), agentId: props.agentId, model: responseData.model, usage: responseData.usage,
        });
    }
    
    chatStore.updateMainContent({
      agentId: props.agentId,
      type: mainContentType,
      data: assistantMessageContent,
      title: mainContentTitle,
      timestamp: Date.now(),
    });

  } catch (error: any) {
    console.error(`[${props.agentConfig.label}Agent] Chat API error:`, error);
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred.';
    toast?.add({ type: 'error', title: `${props.agentConfig.label} Error`, message: errorMessage });
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown',
      data: `### Error Updating Design\n\n*${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
      title: 'Design Error', timestamp: Date.now()
    });
    chatStore.addMessage({
      role: 'error', content: `Sorry, I encountered an issue: ${errorMessage}`, agentId: props.agentId,
    });
  } finally { 
    isLoadingResponse.value = false; 
  }
};

const extractMermaidCode = (markdownText: any): string | undefined => {
  if (typeof markdownText !== 'string') return undefined;
  const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/;
  const match = markdownText.match(mermaidRegex);
  return match ? match[1].trim() : undefined;
};

defineExpose({ handleNewUserInput });

onMounted(() => {
  console.log(`[${props.agentConfig.label}] View Mounted`);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: props.agentConfig.label });
  if (!mainContentToDisplay.value) {
    chatStore.ensureMainContentForAgent(props.agentId);
  }
  watch(mainContentToDisplay, (newContent) => {
    if (newContent && (newContent.type === 'markdown' || newContent.type === 'compact-message-renderer-data')) {
      const diagram = extractMermaidCode(newContent.data);
      if (diagram) {
        agentStore.updateAgentContext({ current_diagram_mermaid_code: diagram });
      }
    }
  }, {deep: true});
});

</script>

<template>
  <div class="system-designer-view flex flex-col h-full w-full overflow-hidden">
    <div class="agent-header-controls p-2 px-3 border-b border-indigo-500/20 dark:border-slate-700/50 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <CodeBracketSquareIcon class="w-5 h-5 shrink-0" :class="props.agentConfig.iconClass || 'text-indigo-400'" />
        <span class="font-semibold text-sm">{{ props.agentConfig.label }}</span>
      </div>
    </div>

    <div class="flex-grow relative min-h-0 custom-scrollbar-futuristic overflow-y-auto">
      <div v-if="isLoadingResponse" class="loading-overlay-designer">
        <div class="spinner-designer"></div>
        <p class="mt-2 text-sm text-slate-400">Architecting your system...</p>
      </div>
      
      <template v-if="mainContentToDisplay && !isLoadingResponse">
        <CompactMessageRenderer
          v-if="props.agentConfig.capabilities?.usesCompactRenderer && (mainContentToDisplay.type === 'compact-message-renderer-data' || mainContentToDisplay.type === 'markdown' || mainContentToDisplay.type === 'loading')" 
          :content="mainContentToDisplay.data as string" 
          :mode="props.agentConfig.id"
          class="p-1 h-full"
        />
        <div v-else-if="mainContentToDisplay.type === 'markdown' || mainContentToDisplay.type === 'welcome' || mainContentToDisplay.type === 'loading'"
             class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 h-full"
             :class="{'flex flex-col items-center justify-center text-center': mainContentToDisplay.type === 'welcome' && !mainContentToDisplay.data?.includes('###')}"
             v-html="marked.parse(mainContentToDisplay.data as string)" 
        ></div>
        <div v-else class="p-4 text-slate-400 italic h-full flex items-center justify-center">
          {{ agentConfig.label }} is ready. Main content type: {{ mainContentToDisplay.type }}.
        </div>
      </template>
      <div v-else-if="!isLoadingResponse" class="flex-grow flex items-center justify-center h-full p-4">
        <div class="text-center text-slate-400 dark:text-slate-500">
          <LightBulbIcon class="w-12 h-12 mx-auto mb-3 opacity-60"/>
          <p>{{ props.agentConfig.inputPlaceholder || 'Describe the system you want to design.' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.system-designer-view {
  background-color: var(--bg-agent-view-dark, theme('colors.slate.800'));
  color: var(--text-primary-dark, theme('colors.slate.100'));
}
.agent-header-controls {
  border-bottom-color: hsla(var(--accent-hue-indigo, 240), 60%, 50%, 0.3);
  background-color: var(--bg-header-dark, theme('colors.slate.950'));
}
.loading-overlay-designer {
  @apply absolute inset-0 flex flex-col items-center justify-center z-10;
  background-color: rgba(var(--bg-base-rgb-dark, 20, 20, 30), 0.7);
}
.spinner-designer {
  @apply w-10 h-10 border-4 rounded-full animate-spin;
  border-color: hsla(var(--accent-hue-indigo, 240), 50%, 50%, 0.2);
  border-top-color: hsl(var(--accent-hue-indigo, 240), 50%, 60%);
}

.custom-scrollbar-futuristic {
  &::-webkit-scrollbar { @apply w-1.5 h-1.5; }
  &::-webkit-scrollbar-track { background-color: hsla(var(--neutral-hue), 20%, 20%, 0.3); @apply rounded-full; }
  &::-webkit-scrollbar-thumb { background-color: hsla(var(--accent-hue-indigo, 240), 75%, 60%, 0.6); @apply rounded-full; border: 1px solid hsla(var(--neutral-hue), 20%, 15%, 0.5); }
  &::-webkit-scrollbar-thumb:hover { background-color: hsla(var(--accent-hue-indigo, 240), 75%, 70%, 0.8); }
  scrollbar-width: thin;
  scrollbar-color: hsla(var(--accent-hue-indigo, 240), 75%, 60%, 0.6) hsla(var(--neutral-hue), 20%, 20%, 0.3);
}

:deep(.prose) {
  h1, h2, h3 { @apply text-[var(--text-primary-dark)] border-b border-[var(--border-color-dark)] pb-1 mb-3; }
  p, li { @apply text-[var(--text-secondary-dark)] my-2; }
  a { @apply text-indigo-400 hover:text-indigo-300; }
  strong { @apply text-[var(--text-primary-dark)]; }
  code:not(pre code) { @apply bg-slate-700 text-rose-400 px-1.5 py-0.5 rounded-md text-xs; }
  pre { @apply bg-slate-900/70 border border-slate-700 text-sm my-3 p-3; }
}
</style>