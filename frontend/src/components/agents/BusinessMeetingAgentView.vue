/**
 * @file BusinessMeetingAgentView.vue
 * @description UI component for the Business Meeting Assistant.
 * Helps summarize meeting notes and extract key information.
 * @version 0.2.1 - Corrected response data handling.
 */
<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, type PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type ChatMessage as StoreChatMessage, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI } from '@/utils/api';
import { ChatMessagePayloadFE } from '@/utils/api';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';
import { BriefcaseIcon, DocumentArrowDownIcon, SparklesIcon } from '@heroicons/vue/24/outline';
import { marked } from 'marked';
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
/** User input for meeting notes. */
const meetingNotesInput = ref<string>('');

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
      currentAgentSystemPrompt.value = "You are a Meeting Assistant. Summarize provided text into structured meeting notes. Use Markdown headings for sections like 'Key Discussion Points', 'Decisions Made', and 'Action Items'.";
    }
  } else {
    currentAgentSystemPrompt.value = "You are a Meeting Assistant. Summarize provided text into structured meeting notes. Use Markdown headings for sections like 'Key Discussion Points', 'Decisions Made', and 'Action Items'.";
  }
};

watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

/**
 * @function handleNewUserInput
 * @description Processes new user input (meeting notes), sends it to the backend, and updates UI states.
 * @param {string} text - The meeting notes text.
 * @async
 */
const handleNewUserInput = async (text: string) => {
  if (!text.trim() || isLoadingResponse.value) {
    if (!text.trim()) {
      toast?.add({type:'warning', title:'Empty Notes', message:'Please provide some meeting notes to summarize.'});
    }
    return;
  }

  const userMessageForLog: StoreChatMessage = chatStore.addMessage({
    role: 'user',
    content: `Submitted meeting notes for summarization (length: ${text.length} chars). Reviewing...`,
    agentId: props.agentId,
  });
  isLoadingResponse.value = true;
  
  const loadingData = `## Processing Meeting Notes...\n\nReviewing the provided information to generate a summary.\n\n<div class="flex justify-center items-center p-8"><div class="spinner-meeting"></div></div>`;
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown',
    data: loadingData,
    title: `Summarizing Notes...`, timestamp: Date.now()
  });
  chatStore.setMainContentStreaming(true, loadingData);


  try {
    let finalSystemPrompt = currentAgentSystemPrompt.value
      .replace(/{{USER_QUERY_TOPIC_OR_TITLE_SUGGESTION}}/g, `Summary of Provided Notes`)
      .replace(/{{USER_QUERY}}/g, text) 
      .replace(/{{GENERATE_DIAGRAM}}/g, (props.agentConfig.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams).toString())
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.currentAgentContext || {}))
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Ensure the output strictly follows the specified Markdown format for meeting summaries, using headings for sections.');
    
    const maxHistoryMessages = typeof props.agentConfig.capabilities?.maxChatHistory === 'number' 
        ? props.agentConfig.capabilities.maxChatHistory 
        : 5; // Default for meeting agent (less history needed for direct summarization)

    const historyConfigOverride: Partial<AdvancedHistoryConfig> = {
        numRecentMessagesToPrioritize: maxHistoryMessages,
        simpleRecencyMessageCount: maxHistoryMessages 
    };

    const processedHistoryFromClient = await chatStore.getHistoryForApi(
      props.agentId,
      `Summarize these meeting notes: ${text.substring(0,100)}...`,
      finalSystemPrompt,
      historyConfigOverride
    );
    
    const payload: ChatMessagePayloadFE = {
      messages: [{ role: 'user', content: `Please summarize the following meeting notes:\n\n${text}`, timestamp: userMessageForLog.timestamp, agentId: props.agentId }],
      processedHistory: processedHistoryFromClient,
      mode: props.agentConfig.id,
      language: voiceSettingsManager.settings.speechLanguage,
      generateDiagram: props.agentConfig.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: 'frontend_user_meeting',
      conversationId: chatStore.getCurrentConversationId(props.agentId),
      systemPromptOverride: finalSystemPrompt,
    };
    
    const response = await chatAPI.sendMessage(payload);
    const responseData = response.data;

    let assistantMessageContent: string | null;
    let responseTitle = `Meeting Summary - ${new Date(userMessageForLog.timestamp).toLocaleDateString()}`;

    if (responseData.type === 'function_call_data') {
        // Meeting assistant does not currently expect function calls, but good to handle
        console.warn("[BusinessMeetingAgentView] Received unexpected function call data:", responseData);
        assistantMessageContent = responseData.assistantMessageText || "The assistant tried to perform an action I can't display yet.";
        responseTitle = "Function Call Requested";
         chatStore.addMessage({
            role: 'assistant', content: `Assistant requested tool: ${responseData.toolName}`, agentId: props.agentId, model: responseData.model
        });
    } else { // TextResponseDataFE
        assistantMessageContent = responseData.content || "Could not generate a summary for the provided notes.";
        if (responseData.discernment === 'IGNORE' || responseData.discernment === 'ACTION_ONLY') {
            assistantMessageContent = responseData.message || "The assistant processed the input but did not generate a standard summary.";
            responseTitle = `Notes Processed (${responseData.discernment})`;
            chatStore.addMessage({
                role: 'assistant', content: assistantMessageContent, agentId: props.agentId, model: responseData.model
            });
        } else {
             chatStore.addMessage({
                role: 'assistant',
                content: "I've processed the notes; the summary is displayed. Any clarifications or further actions?",
                agentId: props.agentId, model: responseData.model, usage: responseData.usage,
            });
        }
    }
    
    chatStore.updateMainContent({
      agentId: props.agentId,
      type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
      data: assistantMessageContent,
      title: responseTitle,
      timestamp: Date.now(),
    });
    meetingNotesInput.value = '';

  } catch (error: any) {
    console.error(`[${props.agentConfig.label}Agent] Chat API error:`, error);
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred while summarizing notes.';
    toast?.add({ type: 'error', title: `Meeting Summary Error`, message: errorMessage });
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown',
      data: `### Error Summarizing Notes\n\n*${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
      title: 'Summary Error', timestamp: Date.now()
    });
    chatStore.addMessage({
      role: 'error', content: `Sorry, I encountered an issue: ${errorMessage}`, agentId: props.agentId,
    });
  } finally {
    isLoadingResponse.value = false;
    chatStore.setMainContentStreaming(false);
  }
};

/**
 * @function submitMeetingNotes
 * @description Handler for the submit button.
 */
const submitMeetingNotes = () => {
  handleNewUserInput(meetingNotesInput.value);
}

defineExpose({ handleNewUserInput });

onMounted(() => {
  console.log(`[${props.agentConfig.label}] View Mounted.`);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: props.agentConfig.label });
  chatStore.ensureMainContentForAgent(props.agentId);
});

</script>

<template>
  <div class="business-meeting-agent-view flex flex-col h-full w-full overflow-hidden bg-slate-800 text-slate-100">
    <div class="agent-header-controls p-2 px-3 border-b border-[var(--border-color-dark)] flex items-center justify-between gap-2 text-sm">
      <div class="flex items-center gap-2">
        <BriefcaseIcon class="w-5 h-5 shrink-0" :class="props.agentConfig.iconClass || 'text-cyan-400'" />
        <span class="font-semibold">{{ props.agentConfig.label }}</span>
      </div>
      <button @click="submitMeetingNotes" class="btn btn-primary btn-xs py-1 px-2.5 text-xs" :disabled="!meetingNotesInput.trim() || isLoadingResponse">
        <DocumentArrowDownIcon class="w-4 h-4 mr-1.5" /> Process Notes
      </button>
    </div>

    <div class="flex-grow flex flex-col lg:flex-row overflow-hidden meeting-layout">
      <div class="lg:w-2/5 p-3 flex flex-col border-b lg:border-b-0 lg:border-r border-[var(--border-color-dark)] notes-input-panel">
        <label for="meetingNotes" class="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5">Paste Meeting Notes/Transcript:</label>
        <textarea 
          id="meetingNotes"
          v-model="meetingNotesInput" 
          placeholder="Start pasting or typing your meeting notes here..."
          class="w-full flex-grow p-2.5 bg-slate-900/70 dark:bg-slate-950/80 border border-slate-700 dark:border-slate-800/70 rounded-md text-sm font-mono focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none custom-scrollbar-futuristic"
        ></textarea>
      </div>

      <div class="lg:w-3/5 flex-grow relative min-h-0 summary-display-panel custom-scrollbar-futuristic overflow-y-auto">
        <div v-if="isLoadingResponse && !chatStore.isMainContentStreaming" class="loading-overlay-meeting">
          <div class="spinner-meeting"></div>
          <p class="mt-2 text-sm text-slate-400">Summarizing notes...</p>
        </div>
        
        <template v-if="mainContentToDisplay && (!isLoadingResponse || chatStore.isMainContentStreaming)">
          <CompactMessageRenderer
            v-if="props.agentConfig.capabilities?.usesCompactRenderer && 
                  (mainContentToDisplay.type === 'compact-message-renderer-data' || 
                   mainContentToDisplay.type === 'markdown' ||
                   mainContentToDisplay.type === 'loading')"
            :content="chatStore.isMainContentStreaming ? chatStore.streamingMainContentText : mainContentToDisplay.data as string" 
            :mode="props.agentConfig.id"
            class="h-full p-1" 
          />
          <div v-else-if="mainContentToDisplay.type === 'markdown' || mainContentToDisplay.type === 'loading'"
               class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 h-full"
               v-html="chatStore.isMainContentStreaming ? marked.parse(chatStore.streamingMainContentText + '▋') : marked.parse(mainContentToDisplay.data as string)"
          ></div>
           <div v-else-if="mainContentToDisplay.type === 'welcome'"
             class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 h-full flex flex-col items-center justify-center text-center"
             v-html="marked.parse(mainContentToDisplay.data as string)"
          ></div>
          <div v-else class="p-4 text-slate-400 italic h-full flex items-center justify-center">
            Meeting summary will appear here. (Content Type: {{ mainContentToDisplay.type }})
          </div>
        </template>
        <div v-else-if="!isLoadingResponse && !mainContentToDisplay" class="flex-grow flex items-center justify-center h-full p-4">
          <div class="text-center text-slate-400 dark:text-slate-500">
            <SparklesIcon class="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>{{ props.agentConfig.inputPlaceholder || 'Paste notes to get started.' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.business-meeting-agent-view {
  background-color: var(--bg-agent-view-dark, theme('colors.slate.800'));
  color: var(--text-primary-dark, theme('colors.slate.100'));
}
.agent-header-controls {
  border-bottom-color: hsla(var(--accent-hue-cyan, 180), 60%, 50%, 0.3); /* Cyan-ish accent */
  background-color: var(--bg-header-dark, theme('colors.slate.950'));
}
.notes-input-panel {
  border-color: hsla(var(--neutral-hue), 15%, 30%, 0.5);
  background-color: hsla(var(--neutral-hue), 15%, 18%, 0.3);
}
.notes-input-panel textarea {
  background-color: hsla(var(--neutral-hue), 15%, 15%, 0.7);
  border-color: hsla(var(--neutral-hue), 15%, 25%, 0.7);
  color: var(--text-primary-dark);
  &:focus {
    border-color: hsl(var(--accent-hue-cyan, 180), 70%, 60%); /* Cyan focus */
    box-shadow: 0 0 0 2px hsla(var(--accent-hue-cyan, 180), 70%, 60%, 0.3);
  }
}
.summary-display-panel {
  background-color: hsla(var(--neutral-hue), 15%, 20%, 0.2);
}

.loading-overlay-meeting {
  @apply absolute inset-0 flex flex-col items-center justify-center z-10;
  background-color: rgba(var(--bg-base-rgb-dark, 26, 32, 44), 0.6); /* Use dark base for curtain */
  backdrop-filter: blur(4px);
}

.spinner-meeting {
  @apply w-10 h-10 border-4 rounded-full animate-spin;
  border-color: hsla(var(--accent-hue-cyan, 180), 60%, 50%, 0.2); /* Cyan accent */
  border-top-color: hsl(var(--accent-hue-cyan, 180), 60%, 50%);
}
/* Removed redundant @keyframes spin_meeting_agent_v2 */

.custom-scrollbar-futuristic {
  &::-webkit-scrollbar { @apply w-1.5 h-1.5; }
  &::-webkit-scrollbar-track { background-color: hsla(var(--neutral-hue), 20%, 20%, 0.3); @apply rounded-full; }
  &::-webkit-scrollbar-thumb { background-color: hsla(var(--accent-hue-cyan, 180), 75%, 60%, 0.6); @apply rounded-full; border: 1px solid hsla(var(--neutral-hue), 20%, 15%, 0.5); }
  &::-webkit-scrollbar-thumb:hover { background-color: hsla(var(--accent-hue-cyan, 180), 75%, 70%, 0.8); }
  scrollbar-width: thin;
  scrollbar-color: hsla(var(--accent-hue-cyan, 180), 75%, 60%, 0.6) hsla(var(--neutral-hue), 20%, 20%, 0.3);
}

.btn.btn-xs {
  @apply px-2.5 py-1 text-xs;
}

:deep(.prose) {
  h1, h2, h3 { @apply text-[var(--text-primary-dark)] border-b border-[var(--border-color-dark)] pb-1; }
  p, li { @apply text-[var(--text-secondary-dark)]; }
  a { @apply text-cyan-400 hover:text-cyan-300; }
  strong { @apply text-[var(--text-primary-dark)]; }
  code:not(pre code) { @apply bg-slate-700 text-emerald-400 px-1.5 py-0.5 rounded-md text-xs; }
  pre { @apply bg-slate-900/70 border border-slate-700 text-sm; }
  table { @apply w-full; }
  th { @apply bg-slate-700/50 text-slate-300; }
  td, th { @apply border border-slate-600 px-2 py-1; }
}
</style>