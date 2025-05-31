<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type ChatMessage as StoreChatMessage, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, type ChatMessagePayloadFE, type ChatResponseDataFE } from '@/utils/api';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';
// Icon for Architectron - BuildingBlocksIcon or similar would be fitting. Using LightBulbIcon as placeholder if not available.
import { LightBulbIcon, CodeBracketSquareIcon, ShareIcon } from '@heroicons/vue/24/outline'; // ShareIcon for potential future use
import { marked } from 'marked'; // Ensure marked is configured for Mermaid if it's not handled by CompactMessageRenderer
import type { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';

const props = defineProps({
  agentId: { type: String as PropType<IAgentDefinition['id']>, required: true },
  agentConfig: { type: Object as PropType<IAgentDefinition>, required: true }
});

const emit = defineEmits<{
  (e: 'agent-event', event: { type: 'view_mounted', agentId: string, label?: string }): void;
  // Feature Idea: Could emit an event when a diagram is significantly updated for other UI elements to react
  // (e.g., 'diagram-updated', diagramCode: string): void;
}>();

const agentStore = useAgentStore();
const chatStore = useChatStore();
const toast = inject<ToastService>('toast');

const isLoadingResponse = ref(false);
const currentAgentSystemPrompt = ref(''); // Will be populated by Architectron's prompt

const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));
const agentDisplayName = computed(() => props.agentConfig.label || "Architectron");

const fetchSystemPrompt = async () => {
  if (props.agentConfig.systemPromptKey) {
    try {
      const module = await import(/* @vite-ignore */ `../../../../prompts/${props.agentConfig.systemPromptKey}.md?raw`);
      currentAgentSystemPrompt.value = module.default;
    } catch (e) {
      console.error(`[${agentDisplayName.value}Agent] Failed to load system prompt: ${props.agentConfig.systemPromptKey}.md`, e);
      currentAgentSystemPrompt.value = "You are Architectron, a System Design AI. Help design complex systems with diagrams and explanations. Focus on NFRs and trade-offs.";
    }
  } else {
    currentAgentSystemPrompt.value = "You are Architectron, a System Design AI. Help design complex systems with diagrams and explanations. Focus on NFRs and trade-offs.";
  }
};
watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

const getRecentDesignContext = (): string => {
  const context = agentStore.currentAgentContext;
  if (context?.focus_area) return `our previous focus on ${context.focus_area}`;
  if (context?.current_diagram_mermaid_code) return `the existing diagram (Mermaid code provided in context)`;
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
  const loadingMessage = `## ${currentTitle.replace(/Processing...|Ready/g, "").trim()}\n\nUpdating design based on: *"${text.substring(0, 50)}..."*\n\n<div class="flex justify-center items-center p-8 architectron-spinner-container"><div class="architectron-spinner"></div><span class="ml-3 text-slate-400 dark:text-slate-500">Architecting...</span></div>`;
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown', data: loadingMessage,
    title: `Processing: ${text.substring(0, 30)}...`, timestamp: Date.now()
  });
  chatStore.setMainContentStreaming(true, loadingMessage);

  try {
    const recentContextSummary = getRecentDesignContext();
    // Extract current diagram from main content if not already in agent context (more robust)
    const currentDiagramInView = extractMermaidCode(mainContentToDisplay.value?.data);
    const agentContextForLLM = {
        ...agentStore.currentAgentContext,
        current_diagram_mermaid_code: currentDiagramInView || agentStore.currentAgentContext?.current_diagram_mermaid_code // Prefer diagram from view if available
    };

    let finalSystemPrompt = currentAgentSystemPrompt.value
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage)
      .replace(/{{USER_QUERY}}/g, text)
      .replace(/{{RECENT_TOPICS_SUMMARY}}/gi, recentContextSummary)
      .replace(/{{GENERATE_DIAGRAM}}/g, "true") // Architectron should always try to generate/update diagrams
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentContextForLLM))
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Focus on iterative diagram updates and clear explanations for slides. Utilize Mermaid for diagrams.');

    const maxHistoryMessages = typeof props.agentConfig.capabilities?.maxChatHistory === 'number' 
        ? props.agentConfig.capabilities.maxChatHistory 
        : 12; // System design can have longer context
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
      generateDiagram: true, // Override: Architectron's main purpose
      userId: 'frontend_user_architectron',
      conversationId: chatStore.getCurrentConversationId(props.agentId),
      systemPromptOverride: finalSystemPrompt,
      stream: true, // Enable streaming for potentially long explanations
    };
    
    let accumulatedContent = "";
    chatStore.clearStreamingMainContent();

    await chatAPI.sendMessageStream(
        payload,
        (chunk) => {
            accumulatedContent += chunk;
            chatStore.appendStreamingMainContent(chunk);
            chatStore.updateMainContent({
                agentId: props.agentId,
                type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                data: accumulatedContent,
                title: `Architectron's Design: Iteration on "${text.substring(0,25)}..."`,
                timestamp: Date.now(),
            });
        },
        () => { // onStreamEnd
            isLoadingResponse.value = false;
            chatStore.setMainContentStreaming(false);
            const finalContent = accumulatedContent.trim();
            if (!finalContent) {
                chatStore.updateMainContent({
                    agentId: props.agentId, type: 'markdown',
                    data: mainContentToDisplay.value?.data?.replace(/## .*Updating design based on.*Architecting.../s, "Ready for next design input.") || "How can we refine the design?",
                    title: `Architectron Ready`, timestamp: Date.now()
                });
                return;
            }
            chatStore.addMessage({
                role: 'assistant',
                content: `Okay, I've updated the design in the main view. ${finalContent.includes("```mermaid") ? "Diagram updated." : "Discussion updated."} What are your thoughts on this iteration?`,
                timestamp: Date.now(), agentId: props.agentId,
            });
             chatStore.updateMainContent({
                agentId: props.agentId,
                type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                data: finalContent, // This will contain Markdown with Mermaid code blocks
                title: `Architectron's Design: Iteration on "${text.substring(0,25)}..."`,
                timestamp: Date.now(),
            });
            // After rendering, ensure Mermaid diagrams are processed
            // This might be handled globally or by CompactMessageRenderer. If not:
            // nextTick(() => { if (typeof mermaid !== 'undefined') mermaid.run(); });
        },
        (error) => { // onStreamError
            console.error(`[${agentDisplayName.value}Agent] Stream error:`, error);
            const errorMessage = error.message || "Architectron had an issue updating the design.";
            toast?.add({ type: 'error', title: `${agentDisplayName.value} Error`, message: errorMessage });
            chatStore.addMessage({ role: 'error', content: `Sorry, I encountered an issue: ${errorMessage}`, agentId: props.agentId });
            chatStore.updateMainContent({
                agentId: props.agentId, type: 'markdown',
                data: `### Error Updating Design\n\n*${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
                title: 'Design Error', timestamp: Date.now()
            });
            isLoadingResponse.value = false; 
            chatStore.setMainContentStreaming(false);
        }
    );

  } catch (error: any) { // Catch errors from setting up the stream
    console.error(`[${agentDisplayName.value}Agent] Chat API error:`, error);
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred with Architectron.';
    toast?.add({ type: 'error', title: `${agentDisplayName.value} Error`, message: errorMessage });
    chatStore.addMessage({ role: 'error', content: `Sorry, I encountered an issue: ${errorMessage}`, agentId: props.agentId });
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown',
      data: `### Error Updating Design\n\n*${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
      title: 'Design Error', timestamp: Date.now()
    });
    isLoadingResponse.value = false; 
    chatStore.setMainContentStreaming(false);
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
  console.log(`[${agentDisplayName.value}] View Mounted. Config:`, props.agentConfig);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: agentDisplayName.value });
  if (!mainContentToDisplay.value) {
    const welcomeMarkdown = `
<div class="architectron-welcome-container">
  <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto architectron-icon-glow">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12M3.75 3h-1.5m1.5 0h16.5M3.75 3V1.5M12.75 3v11.25A2.25 2.25 0 0 1 10.5 16.5H6M12.75 3h1.5m-1.5 0h7.5M12.75 3V1.5M6 16.5h12M6 16.5H4.5M20.25 16.5H18M18 16.5l.75-3.75M18 16.5l-.75 3.75M18 16.5l2.25-.75M18 16.5l-2.25.75M6 16.5l.75-3.75M6 16.5l-.75 3.75M6 16.5l2.25-.75M6 16.5l-2.25.75" />
  </svg>
  <h2 class="architectron-welcome-title">Architectron: System Design Assistant</h2>
  <p class="architectron-welcome-subtitle">${props.agentConfig.description || 'Ready to collaboratively design and diagram complex systems.'}</p>
  <p class="architectron-welcome-prompt">${props.agentConfig.inputPlaceholder || 'Describe the system you want to design, or the problem to solve.'}</p>
</div>`;
    chatStore.updateMainContent({
        agentId: props.agentId, type: 'markdown', data: welcomeMarkdown,
        title: `${agentDisplayName.value} Ready`, timestamp: Date.now()
    });
  } else {
      chatStore.ensureMainContentForAgent(props.agentId);
  }
  
  // Watch for changes in main content to update diagram context in store
  watch(mainContentToDisplay, (newContent) => {
    if (newContent && (newContent.type === 'markdown' || newContent.type === 'compact-message-renderer-data')) {
      const diagram = extractMermaidCode(newContent.data);
      if (diagram) {
        agentStore.updateAgentContext({ current_diagram_mermaid_code: diagram, agentId: props.agentId });
      }
    }
  }, {deep: true, immediate: true });
});

</script>

<template>
  <div class="system-designer-view architectron-view flex flex-col h-full w-full overflow-hidden">
    <div class="agent-header-controls architectron-header p-2 px-3 border-b flex items-center justify-between gap-2 text-sm">
      <div class="flex items-center gap-2">
        <CodeBracketSquareIcon class="w-6 h-6 shrink-0 architectron-icon" :class="props.agentConfig.iconClass" />
        <span class="font-semibold text-lg architectron-title">{{ agentDisplayName }}</span>
      </div>
      </div>

    <div class="flex-grow relative min-h-0 custom-scrollbar-futuristic architectron-scrollbar overflow-y-auto">
      <div v-if="isLoadingResponse && !chatStore.isMainContentStreaming" class="loading-overlay-designer architectron-loading-overlay">
        <div class="architectron-spinner-container"><div class="architectron-spinner"></div></div>
        <p class="mt-2 text-sm architectron-loading-text">Architectron is crafting the design...</p>
      </div>
      
      <template v-if="mainContentToDisplay">
        <CompactMessageRenderer
          v-if="props.agentConfig.capabilities?.usesCompactRenderer && 
                (mainContentToDisplay.type === 'compact-message-renderer-data' || 
                 (mainContentToDisplay.type === 'markdown' && !chatStore.isMainContentStreaming) ||
                 mainContentToDisplay.type === 'loading')"
          :content="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId 
                      ? chatStore.streamingMainContentText 
                      : mainContentToDisplay.data as string"
          :mode="props.agentConfig.id"
          class="p-1 h-full architectron-compact-renderer"
        />
        <div v-else-if="mainContentToDisplay.type === 'markdown' || mainContentToDisplay.type === 'welcome' || mainContentToDisplay.type === 'loading'"
             class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 h-full architectron-prose-content"
             :class="{'flex flex-col items-center justify-center text-center': mainContentToDisplay.type === 'welcome' && !mainContentToDisplay.data?.includes('###')}"
             v-html="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId 
                      ? marked.parse(chatStore.streamingMainContentText + '▋')
                      : marked.parse(mainContentToDisplay.data as string)" 
        >
        </div>
        <div v-else class="p-4 text-slate-400 dark:text-slate-500 italic h-full flex items-center justify-center architectron-placeholder">
          {{ agentDisplayName }} is ready. (Content Type: {{ mainContentToDisplay.type }})
        </div>
      </template>
      <div v-else-if="!isLoadingResponse" class="flex-grow flex flex-col items-center justify-center h-full p-4 text-center architectron-empty-state">
        <LightBulbIcon class="w-12 h-12 mx-auto mb-3 text-[var(--agent-architectron-accent-color-muted)] opacity-60"/>
        <p class="text-slate-400 dark:text-slate-500">{{ props.agentConfig.inputPlaceholder || 'Describe the system you want to design.' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
/* Define Architectron's specific accent colors and theme properties */
.architectron-view { /* Apply to the root of this component for variable scoping */
  --agent-architectron-accent-hue: var(--accent-hue-indigo, 240); /* Indigo */
  --agent-architectron-accent-saturation: 65%;
  --agent-architectron-accent-lightness: 55%;
  --agent-architectron-accent-color: hsl(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation), var(--agent-architectron-accent-lightness));
  --agent-architectron-accent-color-muted: hsla(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation), var(--agent-architectron-accent-lightness), 0.7);
  --agent-architectron-accent-color-darker: hsl(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation), calc(var(--agent-architectron-accent-lightness) - 10%));
  
  background-color: var(--bg-agent-view-dark, theme('colors.slate.900')); /* Slightly different base */
  color: var(--text-primary-dark, theme('colors.slate.100'));

  /* Optional: Subtle blueprint grid background */
  /* position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(hsla(var(--agent-architectron-accent-hue), 50%, 30%, 0.07) 1px, transparent 1px),
                      linear-gradient(90deg, hsla(var(--agent-architectron-accent-hue), 50%, 30%, 0.07) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.5;
    pointer-events: none;
    z-index: 0;
  }
  > * { position: relative; z-index: 1; } */
}

.architectron-header {
  border-bottom-color: hsla(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation), var(--agent-architectron-accent-lightness), 0.4);
  background-color: var(--bg-header-dark, theme('colors.slate.950'));
  padding-top: theme('spacing.3');
  padding-bottom: theme('spacing.3');
}

.architectron-icon {
  color: var(--agent-architectron-accent-color);
  filter: drop-shadow(0 0 4px var(--agent-architectron-accent-color-muted));
}
.architectron-title {
  color: var(--text-primary-dark, theme('colors.slate.100'));
  /* text-shadow: 0 0 6px hsla(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation), var(--agent-architectron-accent-lightness), 0.2); */
}

/* Loading Overlay & Spinner for Architectron */
.architectron-loading-overlay {
  @apply absolute inset-0 flex flex-col items-center justify-center z-10;
  background-color: rgba(var(--bg-base-rgb-dark, 20, 25, 35), 0.7); /* Slightly bluer dark base */
  backdrop-filter: blur(2.5px);
}
.architectron-spinner-container { /* If using a more complex spinner, style its container */
  @apply relative w-10 h-10;
}
.architectron-spinner { /* Spinner from original file */
  @apply w-full h-full border-4 rounded-full animate-spin;
  border-color: hsla(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation), var(--agent-architectron-accent-lightness), 0.25);
  border-top-color: var(--agent-architectron-accent-color);
}
.architectron-loading-text {
  color: var(--agent-architectron-accent-color-muted);
  font-weight: 500;
}

/* Custom Scrollbar for Architectron */


/* Styling for Prose content rendered by Architectron */
.architectron-prose-content, .architectron-compact-renderer :deep(.prose) { /* Target prose within compact renderer too */
  :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
    @apply text-[var(--text-primary-dark)] border-b pb-1.5 mb-3;
    border-bottom-color: hsla(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation), var(--agent-architectron-accent-lightness), 0.35);
    color: hsl(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation), calc(var(--agent-architectron-accent-lightness) + 15%)); /* Brighter headings for emphasis */
  }
  :deep(p), :deep(li) {
    @apply text-[var(--text-secondary-dark)] my-2.5 leading-relaxed;
  }
  :deep(a) {
    color: var(--agent-architectron-accent-color);
    @apply hover:underline hover:text-[var(--agent-architectron-accent-color-darker)];
  }
  :deep(strong) {
    color: hsl(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation), calc(var(--agent-architectron-accent-lightness) + 10%));
  }
  :deep(code:not(pre code)) { /* Inline code */
    @apply px-1.5 py-1 rounded-md text-xs;
    background-color: hsla(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation, 30%), var(--agent-architectron-accent-lightness, 25%), 0.2);
    color: hsl(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation, 50%), calc(var(--agent-architectron-accent-lightness, 50%) + 20%));
    border: 1px solid hsla(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation, 30%), var(--agent-architectron-accent-lightness, 25%), 0.3);
  }
  :deep(pre) { /* Code blocks, especially for Mermaid diagrams */
    @apply border text-sm my-4 p-0 rounded-lg architectron-scrollbar overflow-auto; /* Apply scrollbar, remove padding for mermaid */
    /* Background for code blocks, distinct for diagrams */
    background-color: hsla(var(--neutral-hue, 220), 25%, 12%, 0.8); /* Dark, slightly transparent for diagrams */
    border-color: hsla(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation), var(--agent-architectron-accent-lightness), 0.25);
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.25);
    /* Mermaid specific: ensure diagram takes up space and is centered */
    code.language-mermaid { /* Or just pre > .mermaid if that's how it's rendered */
        @apply block text-center p-2 sm:p-4; 
        /* Mermaid themes are usually set via JS, but basic text color for code block can be set */
        color: var(--text-primary-dark);
    }
  }
}

/* Welcome message specific styling */
.architectron-welcome-container {
  @apply text-center p-6 flex flex-col items-center justify-center h-full;
}
.architectron-icon-glow {
  color: var(--agent-architectron-accent-color);
  filter: drop-shadow(0 0 12px hsla(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation), var(--agent-architectron-accent-lightness), 0.6));
  animation: subtlePulse 3.5s infinite ease-in-out;
  --scale-pulse: 1.03;
  --opacity-pulse: 0.85;
}
.architectron-welcome-title {
  @apply text-2xl sm:text-3xl font-bold mt-3 mb-1.5;
  color: hsl(var(--agent-architectron-accent-hue), var(--agent-architectron-accent-saturation), calc(var(--agent-architectron-accent-lightness) + 25%));
}
.architectron-welcome-subtitle {
  @apply text-base sm:text-lg text-[var(--text-secondary-dark)] mb-5 max-w-lg;
}
.architectron-welcome-prompt {
  @apply text-sm sm:text-base text-[var(--text-muted-dark)] italic;
}

</style>