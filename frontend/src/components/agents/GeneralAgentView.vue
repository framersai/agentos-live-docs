<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type ChatMessage as StoreChatMessage, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, type ChatMessagePayloadFE, type ChatResponseDataFE } from '@/utils/api';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';
import { marked } from 'marked';
// Using ChatBubbleLeftEllipsisIcon as Nerf's icon
import { ChatBubbleLeftEllipsisIcon, SparklesIcon } from '@heroicons/vue/24/outline';
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
const currentAgentSystemPrompt = ref(''); // This will be populated with Nerf's prompt

const agentDisplayName = computed(() => props.agentConfig.label || "Nerf"); // Use configured label, fallback to Nerf

const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));

const fetchSystemPrompt = async () => {
  // The systemPromptKey should point to 'general_chat.md' which now contains Nerf's persona
  if (props.agentConfig.systemPromptKey) {
    try {
      const module = await import(/* @vite-ignore */ `../../../../prompts/${props.agentConfig.systemPromptKey}.md?raw`);
      currentAgentSystemPrompt.value = module.default;
    } catch (e) {
      console.error(`[${agentDisplayName.value}Agent] Failed to load system prompt: ${props.agentConfig.systemPromptKey}.md`, e);
      // Fallback to a simple Nerf prompt if file load fails
      currentAgentSystemPrompt.value = "You are Nerf, a friendly and concise general AI assistant. Help users with their questions efficiently.";
    }
  } else {
    currentAgentSystemPrompt.value = "You are Nerf, a friendly and concise general AI assistant. Help users with their questions efficiently.";
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
  // More engaging loading message for Nerf
  const thinkingMessage = `### Nerf is thinking about "${text.substring(0, 40)}..."\n\n<div class="nerf-spinner-container mx-auto my-4"><div class="nerf-spinner"></div></div>\n\nGetting the best info for you!`;
  chatStore.updateMainContent({
      agentId: props.agentId,
      type: 'markdown', // Display loading as markdown
      data: thinkingMessage,
      title: `Nerf is on it: ${text.substring(0, 30)}...`,
      timestamp: Date.now(),
  });
  chatStore.setMainContentStreaming(true, thinkingMessage);


  try {
    // The updated prompt guides Nerf on response length and engagement.
    let finalSystemPrompt = currentAgentSystemPrompt.value
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage) // Though less relevant for Nerf
      .replace(/{{MODE}}/g, props.agentConfig.id) // 'general_chat'
      .replace(/{{GENERATE_DIAGRAM}}/g,
      ((props.agentConfig.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings?.generateDiagrams) ?? false).toString())      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.currentAgentContext || {}))
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, ''); // Add any dynamic instructions if needed

    const maxHistoryMessages = typeof props.agentConfig.capabilities?.maxChatHistory === 'number' 
        ? props.agentConfig.capabilities.maxChatHistory 
        : 8; // Nerf might benefit from slightly less history to stay focused on current Q
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
      generateDiagram: props.agentConfig.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: 'frontend_user_nerf', // Specific user ID for Nerf
      conversationId: chatStore.getCurrentConversationId(props.agentId),
      systemPromptOverride: finalSystemPrompt,
      stream: true, // Assuming Nerf responses can also be streamed for better UX
    };

    let accumulatedContent = "";
    chatStore.clearStreamingMainContent(); // Clear previous stream

    await chatAPI.sendMessageStream(
      payload,
      (chunk: string) => { // onChunkReceived
        if (chunk) {
          accumulatedContent += chunk;
          chatStore.appendStreamingMainContent(chunk);
          // Update main content progressively
          chatStore.updateMainContent({
            agentId: props.agentId,
            type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: accumulatedContent, 
            title: `Nerf's response to: "${text.substring(0, 30)}..."`,
            timestamp: Date.now(),
          });
        }
      },
      () => { // onStreamEnd
        isLoadingResponse.value = false; 
        chatStore.setMainContentStreaming(false);
        const finalContent = accumulatedContent.trim();
        if (!finalContent) {
          toast?.add({ type: 'info', title: `Nerf Says`, message: "Hmm, I didn't find a specific answer for that right now. Try asking another way?", duration: 4000 });
          chatStore.updateMainContent({ // Revert to a ready state or previous content
            agentId: props.agentId, type: 'markdown',
            data: mainContentToDisplay.value?.data?.replace(/### Nerf is thinking.*Getting the best info for you!/s, "I'm ready for your next question!") || "How can I help you next?",
            title: `${agentDisplayName.value} Ready`, timestamp: Date.now()
          });
          return;
        }
        // Add final assistant message to chat log
        chatStore.addMessage({
            role: 'assistant', content: finalContent,
            timestamp: Date.now(), agentId: props.agentId, 
            // model: responseData.model, usage: responseData.usage // These would come from a final metadata event in stream
        });
        // Final update to main content with complete response
         chatStore.updateMainContent({
            agentId: props.agentId,
            type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: finalContent,
            title: `Nerf's response to: "${text.substring(0, 30)}..."`,
            timestamp: Date.now(),
          });
      },
      (error: Error) => { // onStreamError
        console.error(`[${agentDisplayName.value}Agent] Chat stream error:`, error);
        const errorMessage = error.message || 'Oops! Nerf ran into a hiccup trying to get that for you.';
        toast?.add({ type: 'error', title: `${agentDisplayName.value} Error`, message: errorMessage, duration: 7000 });
        chatStore.addMessage({ role: 'error', content: `Sorry, I encountered an error. ${errorMessage}`, agentId: props.agentId });
        chatStore.updateMainContent({
            agentId: props.agentId, type: 'markdown',
            data: `### Nerf Hiccup!\n\nSomething went wrong: *${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}*\n\nPlease try asking again!`,
            title: 'Error', timestamp: Date.now()
        });
        isLoadingResponse.value = false; 
        chatStore.setMainContentStreaming(false);
      }
    );

  } catch (error: any) { // Catch errors from setting up the stream
    console.error(`[${agentDisplayName.value}Agent] Chat API setup error:`, error);
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred with Nerf.';
    toast?.add({ type: 'error', title: `${agentDisplayName.value} Error`, message: errorMessage, duration: 7000 });
    chatStore.addMessage({ role: 'error', content: `Failed to get response: ${errorMessage}`, agentId: props.agentId });
     chatStore.updateMainContent({
        agentId: props.agentId, type: 'markdown',
        data: `### Nerf System Error\n\nLooks like there was a problem connecting: *${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
        title: 'Connection Error', timestamp: Date.now()
    });
    isLoadingResponse.value = false;
    chatStore.setMainContentStreaming(false);
  }
};

const renderMarkdown = (content: string | null) => {
  if (content === null) return '';
  try {
    // Ensure 'marked' is configured to use highlight.js for code blocks.
    // Comments within code blocks will be styled by the highlight.js theme.
    return marked.parse(content);
  } catch (e) {
    console.error("Error parsing markdown for Nerf:", e);
    return `<p class="text-red-500 dark:text-red-400">Error rendering content.</p>`;
  }
};

defineExpose({ handleNewUserInput });

onMounted(() => {
  console.log(`[${agentDisplayName.value}] View Mounted. Agent Config:`, props.agentConfig);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: agentDisplayName.value });
  
  // Set a friendly welcome message for Nerf
  if (!mainContentToDisplay.value || mainContentToDisplay.value.title === `${props.agentConfig.label} Ready`) {
    // The initial prompt for Nerf (in general_chat.md) sets its greeting.
    // This ensures the main content area also has a welcoming message.
    const welcomeMarkdown = `
<div class="nerf-welcome-container">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 mx-auto nerf-icon-glow">
    <path fill-rule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.478.232.98.44 1.48.626a6.702 6.702 0 0 0 2.874 0 6.702 6.702 0 0 0 1.48-.627A6.721 6.721 0 0 0 18 21.75a6.707 6.707 0 0 0 1.196-.106 1.538 1.538 0 0 0 .82-2.562 4.933 4.933 0 0 1 0-7.764 1.538 1.538 0 0 0-.82-2.562A6.707 6.707 0 0 0 18 8.25a6.721 6.721 0 0 0-3.583 1.029c-.478-.232-.98-.44-1.48-.626a6.702 6.702 0 0 0-2.874 0 6.702 6.702 0 0 0-1.48.627A6.721 6.721 0 0 0 6 8.25a6.707 6.707 0 0 0-1.196.106 1.538 1.538 0 0 0-.82 2.562 4.933 4.933 0 0 1 0 7.764 1.538 1.538 0 0 0 .82 2.562Z" clip-rule="evenodd" />
  </svg>
  <h2 class="nerf-welcome-title">Hi, I'm ${agentDisplayName.value}!</h2>
  <p class="nerf-welcome-subtitle">${props.agentConfig.description || 'Your friendly general assistant for quick questions and information.'}</p>
  <p class="nerf-welcome-prompt">${props.agentConfig.inputPlaceholder || 'What can I help you with today?'}</p>
</div>
    `;
    chatStore.updateMainContent({
      agentId: props.agentId,
      type: 'markdown',
      data: welcomeMarkdown,
      title: `${agentDisplayName.value} Ready`,
      timestamp: Date.now(),
    });
  } else {
      // Ensure main content is present if already set
      chatStore.ensureMainContentForAgent(props.agentId);
  }
});

</script>

<template>
  <div class="general-agent-view nerf-agent-view flex flex-col h-full w-full overflow-hidden">
    <div class="agent-header-controls nerf-header p-2 px-3 border-b flex items-center gap-2 text-sm">
      <ChatBubbleLeftEllipsisIcon class="w-6 h-6 shrink-0 nerf-icon" :class="props.agentConfig.iconClass" />
      <span class="font-semibold text-lg nerf-title">{{ agentDisplayName }}</span>
      </div>
    
    <div v-if="isLoadingResponse && !chatStore.isMainContentStreaming" class="loading-overlay nerf-loading-overlay">
      <div class="nerf-spinner-container"><div class="nerf-spinner"></div></div>
      <p class="mt-2 text-sm nerf-loading-text">Nerf is fetching that for you...</p>
    </div>
    
    <div class="flex-grow relative min-h-0 custom-scrollbar-futuristic nerf-scrollbar overflow-y-auto">
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
          class="p-1 h-full nerf-compact-renderer" 
        />
        <div v-else-if="mainContentToDisplay.type === 'markdown' || mainContentToDisplay.type === 'welcome' || mainContentToDisplay.type === 'loading'"
             class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 h-full nerf-prose-content"
             v-html="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId 
                      ? renderMarkdown(chatStore.streamingMainContentText + '▋') 
                      : renderMarkdown(mainContentToDisplay.data as string)"
        ></div>
        <div v-else class="p-4 text-slate-400 dark:text-slate-500 italic h-full flex items-center justify-center nerf-placeholder">
          {{ agentDisplayName }} is active. Main content type: {{ mainContentToDisplay.type }}.
        </div>
      </template>
      <div v-else-if="!isLoadingResponse" class="flex-grow flex flex-col items-center justify-center h-full p-4 text-center nerf-empty-state">
        <SparklesIcon class="w-12 h-12 mb-3 text-[var(--agent-nerf-accent-color-muted)] opacity-60"/>
        <p class="text-slate-500 dark:text-slate-400 italic">{{ props.agentConfig.inputPlaceholder || `Ask ${agentDisplayName} anything!` }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
/* Define Nerf's specific accent colors and theme properties */
.nerf-agent-view { /* Apply to the root of this component for variable scoping */
  --agent-nerf-accent-hue: 35; /* Orange/Amber */
  --agent-nerf-accent-saturation: 100%;
  --agent-nerf-accent-lightness: 60%;
  --agent-nerf-accent-color: hsl(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), var(--agent-nerf-accent-lightness));
  --agent-nerf-accent-color-muted: hsla(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), var(--agent-nerf-accent-lightness), 0.7);
  --agent-nerf-accent-color-darker: hsl(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), calc(var(--agent-nerf-accent-lightness) - 10%));
  
  /* Background: Subtle radial gradient using the accent color */
  background-color: var(--bg-agent-view-dark, theme('colors.slate.800'));
  /*
  background-image: radial-gradient(ellipse at center, hsla(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), var(--agent-nerf-accent-lightness), 0.05) 0%, transparent 60%);
  */
  color: var(--text-primary-dark, theme('colors.slate.100'));
  
  /* Add a subtle animated pattern or texture if desired */
  /* position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('/path/to/subtle-tech-pattern.svg');
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
  }
  > * {
    position: relative;
    z-index: 1;
  } */
}

.nerf-header {
  border-bottom-color: hsla(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), var(--agent-nerf-accent-lightness), 0.4);
  background-color: var(--bg-header-dark, theme('colors.slate.950'));
  padding-top: theme('spacing.3');
  padding-bottom: theme('spacing.3');
}

.nerf-icon {
  color: var(--agent-nerf-accent-color);
  filter: drop-shadow(0 0 5px var(--agent-nerf-accent-color-muted));
}
.nerf-title {
  color: var(--text-primary-dark, theme('colors.slate.100'));
  text-shadow: 0 0 8px hsla(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), var(--agent-nerf-accent-lightness), 0.3);
}

/* Loading Overlay & Spinner for Nerf */
.nerf-loading-overlay { /* Extends general .loading-overlay if that exists */
  @apply absolute inset-0 flex flex-col items-center justify-center z-10;
  background-color: rgba(var(--bg-base-rgb-dark, 26, 32, 44), 0.65); /* Slightly more opaque */
  backdrop-filter: blur(2px);
}
.nerf-spinner-container {
  @apply relative w-12 h-12; /* Adjust size as needed */
}
.nerf-spinner {
  @apply w-full h-full border-4 rounded-full animate-spin;
  border-color: hsla(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), var(--agent-nerf-accent-lightness), 0.25); /* Track color */
  border-top-color: var(--agent-nerf-accent-color); /* Spinner active color */
  /* For a more "blocky" or Nerf-like spinner, one might use pseudo-elements or multiple divs */
}
.nerf-loading-text {
  color: var(--agent-nerf-accent-color-muted);
  font-weight: 500;
}

/* Styling for Prose content rendered by Nerf */
.nerf-prose-content {
  /* Basic prose styling for readability */
  :deep(h1), :deep(h2), :deep(h3) {
    @apply text-[var(--text-primary-dark)] border-b pb-1 mb-4;
    border-bottom-color: hsla(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), var(--agent-nerf-accent-lightness), 0.3);
    color: hsl(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), calc(var(--agent-nerf-accent-lightness) + 20%)); /* Brighter headings */
  }
  :deep(p), :deep(li) {
    @apply text-[var(--text-secondary-dark)] my-2.5 leading-relaxed; /* Improved line height for readability */
  }
  :deep(a) {
    color: var(--agent-nerf-accent-color);
    @apply hover:underline hover:text-[var(--agent-nerf-accent-color-darker)];
    text-decoration-thickness: 1.5px;
    text-underline-offset: 2px;
  }
  :deep(strong) {
    color: hsl(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), calc(var(--agent-nerf-accent-lightness) + 10%));
    font-weight: 600;
  }
  :deep(code:not(pre code)) { /* Inline code */
    @apply px-1.5 py-0.5 rounded-md text-xs;
    background-color: hsla(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), var(--agent-nerf-accent-lightness), 0.1);
    color: hsl(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), calc(var(--agent-nerf-accent-lightness) + 15%));
    border: 1px solid hsla(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), var(--agent-nerf-accent-lightness), 0.2);
  }
  :deep(pre) { /* Code blocks */
    @apply border text-sm my-4 p-3.5 rounded-lg nerf-scrollbar; /* Apply Nerf scrollbar to code blocks too */
    background-color: hsla(var(--neutral-hue, 220), 20%, 10%, 0.7); /* Darker bg for code */
    border-color: hsla(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), var(--agent-nerf-accent-lightness), 0.2);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
  }
  :deep(ul) { @apply list-disc list-inside; }
  :deep(ol) { @apply list-decimal list-inside; }
  :deep(blockquote) {
    @apply border-l-4 pl-3 italic my-3 text-[var(--text-muted-dark)];
    border-left-color: var(--agent-nerf-accent-color-muted);
  }
}

/* Welcome message specific styling for Nerf */
.nerf-welcome-container {
  @apply text-center p-6 flex flex-col items-center justify-center h-full;
}
.nerf-icon-glow {
  color: var(--agent-nerf-accent-color);
  filter: drop-shadow(0 0 15px hsla(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), var(--agent-nerf-accent-lightness), 0.7))
          drop-shadow(0 0 25px hsla(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), var(--agent-nerf-accent-lightness), 0.5));
  animation: subtlePulse 3s infinite ease-in-out; /* Uses global subtlePulse */
  --scale-pulse: 1.05;
  --opacity-pulse: 0.9;
}
.nerf-welcome-title {
  @apply text-3xl font-bold mt-4 mb-2;
  color: hsl(var(--agent-nerf-accent-hue), var(--agent-nerf-accent-saturation), calc(var(--agent-nerf-accent-lightness) + 20%));
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.nerf-welcome-subtitle {
  @apply text-lg text-[var(--text-secondary-dark)] mb-6 max-w-md;
}
.nerf-welcome-prompt {
  @apply text-base text-[var(--text-muted-dark)] italic;
}

</style>