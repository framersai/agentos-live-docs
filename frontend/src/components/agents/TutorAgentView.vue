// File: frontend/src/components/agents/TutorAgentView.vue
/**
 * @file TutorAgentView.vue
 * @description UI component for the AI Tutor agent "Professor Astra".
 * Manages interactive learning sessions, adapts to user level, uses
 * CompactMessageRenderer for structured explanations, and handles
 * potential function calls for quizzes or flashcards.
 * @version 0.3.1
 * @author Voice Coding Assistant Team
 *
 * @notes
 * - v0.3.1: Corrected import of ChatMessagePayloadFE from api.ts.
 */
<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, onUnmounted, PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type ChatMessage as StoreChatMessage, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
// Corrected import: Use ChatMessagePayloadFE 950
import { chatAPI, type ChatMessagePayloadFE, type TextResponseDataFE, type FunctionCallResponseDataFE, type ChatResponseDataFE } from '@/utils/api';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';
import { AcademicCapIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
import type { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';

/**
 * @typedef {'beginner' | 'intermediate' | 'expert'} TutorLevel
 * @description Defines the expertise levels the Tutor agent can adapt to.
 */
type TutorLevel = 'beginner' | 'intermediate' | 'expert';

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

const isLoadingResponse = ref(false);
const currentAgentSystemPrompt = ref('');
const currentTutorLevel = ref<TutorLevel>(
  (agentStore.currentAgentContext?.tutorLevel as TutorLevel) || 'intermediate'
);
const showLevelSelector = ref(false);
const levelSelectorRef = ref<HTMLElement | null>(null);

const tutorLevels: { id: TutorLevel; label: string; description: string }[] = [
  { id: 'beginner', label: 'Beginner', description: 'Simple explanations, foundational concepts.' },
  { id: 'intermediate', label: 'Intermediate', description: 'Detailed explanations, assumes some prior knowledge.' },
  { id: 'expert', label: 'Expert', description: 'Advanced topics, concise and technical.' },
];

const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));

const fetchSystemPrompt = async () => {
  if (props.agentConfig.systemPromptKey) {
    try {
      const module = await import(/* @vite-ignore */ `../../../../prompts/${props.agentConfig.systemPromptKey}.md?raw`);
      currentAgentSystemPrompt.value = module.default;
    } catch (e) {
      console.error(`[${props.agentId}Agent] Failed to load system prompt: ${props.agentConfig.systemPromptKey}.md`, e);
      currentAgentSystemPrompt.value = "You are Professor Astra, an AI Tutor. Your goal is to help users learn. Use tools like 'createQuizItem' or 'createFlashcard' when appropriate. Structure explanations for slides.";
    }
  } else {
    currentAgentSystemPrompt.value = "You are Professor Astra, an AI Tutor. Your goal is to help users learn. Use tools like 'createQuizItem' or 'createFlashcard' when appropriate. Structure explanations for slides.";
  }
};

watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

watch(currentTutorLevel, (newLevel) => {
  agentStore.updateAgentContext({ tutorLevel: newLevel });
  toast?.add({type: 'info', title: 'Tutor Level Set', message: `Switched to ${newLevel} level.`, duration: 2000});
  
  if (mainContentToDisplay.value && mainContentToDisplay.value.data && mainContentToDisplay.value.title !== `${props.agentConfig.label} Ready`) {
    const currentTopic = mainContentToDisplay.value.title?.replace(/^(Tutor on: |Processing: )/, "").substring(0,40) || 'this topic';
    // Automatically re-ask with the new level context
    handleNewUserInput(`Could you please adjust your current explanation of "${currentTopic}" to a ${newLevel} level?`);
  }
});

const setTutorLevel = (level: TutorLevel) => {
  currentTutorLevel.value = level;
  showLevelSelector.value = false;
};

const getRecentTopicsSummary = (): string => {
  const agentMessages = chatStore.getMessagesForAgent(props.agentId);
  const userTopics = agentMessages
    .filter(m => m.role === 'user' && m.content && m.content.trim().length > 0)
    .slice(-5) 
    .map(m => m.content!.length > 50 ? m.content!.substring(0, 50) + "..." : m.content)
    .filter((value, index, self) => self.indexOf(value) === index) 
    .slice(-3); 

  if (userTopics.length === 0) return "anything you're curious about";
  if (userTopics.length === 1) return `"${userTopics[0]}"`;
  return `topics like "${userTopics.join('", "')}"`;
};

const handleNewUserInput = async (text: string) => {
  if (!text.trim() || isLoadingResponse.value) return;

  const userMessage: StoreChatMessage = chatStore.addMessage({
    role: 'user', content: text,
    timestamp: Date.now(), agentId: props.agentId,
  });
  isLoadingResponse.value = true;
  
  const previousMainContentTitle = mainContentToDisplay.value?.title?.replace(/Ready$|Processing...$/, "").trim() || `New Topic`;
  const thinkingData = `## ${previousMainContentTitle}\n\nExploring: *"${text.substring(0,40)}..."*\n\n<div class="flex justify-center items-center p-8"><div class="spinner-tutor"></div><span class="ml-3 text-slate-400">Thinking...</span></div>`;
  chatStore.updateMainContent({ 
    agentId: props.agentId, type: 'markdown',
    data: thinkingData,
    title: `Processing: ${text.substring(0,30)}...`,
    timestamp: Date.now()
  });
  chatStore.setMainContentStreaming(true, thinkingData);

  try {
    const recentTopicsSummary = getRecentTopicsSummary();
    let finalSystemPrompt = currentAgentSystemPrompt.value
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage)
      .replace(/{{MODE}}/g, props.agentConfig.id)
      .replace(/{{TUTOR_LEVEL}}/g, currentTutorLevel.value)
      .replace(/{{RECENT_TOPICS_SUMMARY}}/gi, recentTopicsSummary)
      .replace(/{{GENERATE_DIAGRAM}}/g, (props.agentConfig.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams).toString())
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.currentAgentContext || {}))
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Remember to ask guiding questions. Structure detailed explanations with Markdown headings (e.g., ## Title) or ---SLIDE_BREAK--- for slide presentation. Short guiding questions should be for the chat log. Use createQuizItem or createFlashcard tools if beneficial.');

    const maxHistoryMessages = typeof props.agentConfig.capabilities?.maxChatHistory === 'number' 
        ? props.agentConfig.capabilities.maxChatHistory 
        : 12; 

    const historyConfigOverride: Partial<AdvancedHistoryConfig> = {
        numRecentMessagesToPrioritize: maxHistoryMessages,
        simpleRecencyMessageCount: maxHistoryMessages 
    };
    
    const processedHistoryFromClient = await chatStore.getHistoryForApi(
      props.agentId, text, finalSystemPrompt, historyConfigOverride
    );
    
    const payload: ChatMessagePayloadFE = { // Use ChatMessagePayloadFE
      messages: [{role: 'user', content: text, timestamp: userMessage.timestamp, agentId: props.agentId}],
      processedHistory: processedHistoryFromClient,
      mode: props.agentConfig.id, // For backend routing/logic
      language: voiceSettingsManager.settings.preferredCodingLanguage,
      generateDiagram: !!(props.agentConfig.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams),
      userId: 'frontend_user_tutor', // Could be replaced with actual user ID if available
      conversationId: chatStore.getCurrentConversationId(props.agentId),
      systemPromptOverride: finalSystemPrompt,
      tutorMode: true, // Indicate tutor mode to backend
      tutorLevel: currentTutorLevel.value, // Send current tutor level
      stream: true,
    };
    
    let accumulatedContent = "";
    chatStore.clearStreamingMainContent();

    await chatAPI.sendMessageStream(
        payload,
        (chunk: string) => {
            if (chunk) {
                accumulatedContent += chunk;
                chatStore.appendStreamingMainContent(chunk);
                chatStore.updateMainContent({
                    agentId: props.agentId,
                    type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                    data: accumulatedContent, 
                    title: `Tutor on: ${text.substring(0, 40)}...`,
                    timestamp: Date.now(),
                });
            }
        },
        () => { // onStreamEnd
            isLoadingResponse.value = false; 
            chatStore.setMainContentStreaming(false);
            const finalContent = accumulatedContent.trim();
            if (!finalContent) {
                toast?.add({ type: 'warning', title: `Tutor Response`, message: "Received an empty response from the tutor.", duration: 4000 });
                chatStore.updateMainContent({
                    agentId: props.agentId, type: 'markdown',
                    data: `I'm ready for your next question about "${text.substring(0,30)}..." or a new topic.`,
                    title: `Tutor on: ${text.substring(0, 40)}...`, timestamp: Date.now()
                });
                return;
            }
            
            const isConversationalReply = finalContent.length < 180 && finalContent.trim().endsWith('?');

            if (isConversationalReply) {
                chatStore.addMessage({
                    role: 'assistant', content: finalContent, 
                    timestamp: Date.now(), agentId: props.agentId, 
                });
                const currentMainData = mainContentToDisplay.value?.data || '';
                if(typeof currentMainData === 'string' && !currentMainData.includes(finalContent)){
                    chatStore.updateMainContent({
                        agentId: props.agentId,
                        type: 'markdown',
                        data: currentMainData + `\n\n---\n**Tutor (in chat):** *${finalContent}*`,
                        title: mainContentToDisplay.value?.title || `Interactive Session`,
                        timestamp: Date.now()
                    });
                }
            } else {
                chatStore.addMessage({
                    role: 'assistant', 
                    content: `I've updated the main view with information about "${text.substring(0, 30)}...". What are your thoughts or questions?`,
                    timestamp: Date.now(), agentId: props.agentId, 
                });
                chatStore.updateMainContent({
                    agentId: props.agentId,
                    type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                    data: finalContent,
                    title: `Tutor on: ${text.substring(0, 40)}...`,
                    timestamp: Date.now(),
                });
            }
        },
        (error: Error) => { // onStreamError
            console.error(`[${props.agentId}Agent] Chat stream error:`, error);
            const errorMessage = error.message || 'An error occurred during the tutoring session.';
            toast?.add({ type: 'error', title: `Tutor Stream Error`, message: errorMessage, duration: 7000 });
            chatStore.updateMainContent({
                agentId: props.agentId, type: 'markdown',
                data: `### Tutor System Error\nAn issue occurred while preparing your lesson:\n\n*${errorMessage}*`,
                title: 'Error', timestamp: Date.now()
            });
            isLoadingResponse.value = false; 
            chatStore.setMainContentStreaming(false);
        }
    );

  } catch (error: any) {
    console.error(`[${props.agentId}Agent] Chat API setup error:`, error);
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred.';
    toast?.add({ type: 'error', title: `Tutor Error`, message: errorMessage, duration: 7000 });
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown',
      data: `### Tutor System Error\nAn issue occurred:\n\n*${errorMessage}*`,
      title: 'Error', timestamp: Date.now()
    });
    isLoadingResponse.value = false; 
    chatStore.setMainContentStreaming(false);
  }
};

defineExpose({ handleNewUserInput });

const handleClickOutsideLevelSelector = (event: MouseEvent) => {
  if (levelSelectorRef.value && !levelSelectorRef.value.contains(event.target as Node)) {
    showLevelSelector.value = false;
  }
};

onMounted(() => {
  console.log(`[${props.agentConfig.label}] View Mounted`);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: props.agentConfig.label });
  document.addEventListener('click', handleClickOutsideLevelSelector, true);

  if (!mainContentToDisplay.value || mainContentToDisplay.value.title === `${props.agentConfig.label} Ready`) {
    const recentTopicsSummary = getRecentTopicsSummary(); 
    const welcomeMessage = `### Welcome to ${props.agentConfig.label}!\n${props.agentConfig.description}\n\nI'm here to help you learn. Current level: **${currentTutorLevel.value}**. You can change this above.\n\n${props.agentConfig.inputPlaceholder || 'What topic shall we explore today, or what problem can I help you solve?'} Perhaps something related to ${recentTopicsSummary}?`;
    chatStore.updateMainContent({
      agentId: props.agentId,
      type: 'markdown',
      data: welcomeMessage,
      title: `${props.agentConfig.label} Ready`,
      timestamp: Date.now(),
    });
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideLevelSelector, true);
});

</script>

<template>
  <div class="tutor-agent-view flex flex-col h-full w-full overflow-hidden">
    <div class="agent-header-controls p-2 px-3 border-b border-amber-500/20 dark:border-slate-700/50 flex items-center justify-between gap-2 flex-wrap">
      <div class="flex items-center gap-2 shrink-0">
        <AcademicCapIcon class="w-5 h-5" :class="props.agentConfig.iconClass || 'text-amber-400'" />
        <span class="font-semibold text-sm">{{ props.agentConfig.label }}</span>
      </div>
      <div class="relative" ref="levelSelectorRef">
        <button @click="showLevelSelector = !showLevelSelector" class="btn btn-secondary btn-xs py-1 px-2.5 text-xs flex items-center gap-1">
          Level: {{ currentTutorLevel }}
          <ChevronDownIcon class="w-3 h-3 transition-transform" :class="{'rotate-180': showLevelSelector}" />
        </button>
        <transition name="dropdown-fade">
          <div v-if="showLevelSelector" class="dropdown-menu-private absolute top-full right-0 mt-1 w-64 origin-top-right z-20">
            <div class="p-1">
              <button
                v-for="level in tutorLevels"
                :key="level.id"
                @click="setTutorLevel(level.id)"
                class="dropdown-item-private w-full group" 
                :class="{ 'active': currentTutorLevel === level.id }"
              >
                <div class="text-left">
                  <span class="text-sm font-medium">{{ level.label }}</span>
                  <p class="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{{ level.description }}</p>
                </div>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="flex-grow relative min-h-0 custom-scrollbar-futuristic overflow-y-auto">
      <div v-if="isLoadingResponse && !chatStore.isMainContentStreaming" class="loading-overlay-tutor">
        <div class="spinner-tutor"></div>
        <p class="mt-2 text-sm text-slate-400">Preparing your lesson...</p>
      </div>
      
      <template v-if="mainContentToDisplay">
        <CompactMessageRenderer
          v-if="props.agentConfig.capabilities?.usesCompactRenderer && (mainContentToDisplay.type === 'compact-message-renderer-data' || (mainContentToDisplay.type === 'markdown' && !chatStore.isMainContentStreaming) || mainContentToDisplay.type === 'loading')"
          :content="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId ? chatStore.streamingMainContentText : mainContentToDisplay.data as string" 
          :mode="props.agentConfig.id"
          class="p-1 h-full"
        />
        <div v-else-if="mainContentToDisplay.type === 'markdown' || mainContentToDisplay.type === 'welcome' || mainContentToDisplay.type === 'loading'"
             class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 h-full"
             :class="{'flex flex-col items-center justify-center text-center': mainContentToDisplay.type === 'welcome'}"
             v-html="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId ? chatStore.streamingMainContentText + '▋' : mainContentToDisplay.data"
        ></div>
        <div v-else class="p-4 text-slate-400 italic h-full flex items-center justify-center">
          Tutor agent is active. Main content type: {{ mainContentToDisplay.type }}.
        </div>
      </template>
      <div v-else-if="!isLoadingResponse" class="flex-grow flex items-center justify-center h-full p-4">
        <p class="text-slate-500 italic">What would you like to learn about with the {{ agentConfig.label }}?</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.tutor-agent-view {
  background-color: var(--bg-agent-view-dark, theme('colors.slate.800'));
  color: var(--text-primary-dark, theme('colors.slate.100'));
}
.agent-header-controls {
 border-bottom-color: hsla(var(--accent-hue-amber, 40), 60%, 50%, 0.3); /* Amber-ish accent */
 background-color: var(--bg-header-dark, theme('colors.slate.950')); /* Updated name */
}
.loading-overlay-tutor { 
  @apply absolute inset-0 flex flex-col items-center justify-center z-10;
  background-color: rgba(var(--bg-base-rgb-dark, 18, 12, 38), 0.7); /* Updated name for dark mode base */
  color: theme('colors.amber.200');
}

.spinner-tutor {
  @apply w-9 h-9 border-4 rounded-full animate-spin;
  border-color: hsla(var(--accent-hue-amber, 40), 50%, 50%, 0.2); 
  border-top-color: hsl(var(--accent-hue-amber, 40), 50%, 60%);
}

.dropdown-menu-private { /* Assuming these styles are defined globally or in PrivateHome.vue and are suitable */
  @apply bg-slate-800/80 backdrop-blur-md border border-purple-500/50 rounded-lg shadow-2xl;
}
.dropdown-item-private {
  @apply flex items-center px-3 py-2.5 text-left text-gray-200 rounded-md 
        transition-colors duration-150 ease-in-out hover:bg-purple-600/40;
}
.dropdown-item-private.active {
  @apply bg-purple-700/50 text-white font-semibold;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.btn.btn-secondary.btn-xs {
  @apply px-2.5 py-1 text-xs;
}

.custom-scrollbar-futuristic {
  &::-webkit-scrollbar { @apply w-1.5 h-1.5; }
  &::-webkit-scrollbar-track { background-color: hsla(var(--neutral-hue), 20%, 20%, 0.3); @apply rounded-full; }
  &::-webkit-scrollbar-thumb { background-color: hsla(var(--accent-hue-amber, 40), 75%, 60%, 0.6); @apply rounded-full; border: 1px solid hsla(var(--neutral-hue), 20%, 15%, 0.5); }
  &::-webkit-scrollbar-thumb:hover { background-color: hsla(var(--accent-hue-amber, 40), 75%, 70%, 0.8); }
  scrollbar-width: thin;
  scrollbar-color: hsla(var(--accent-hue-amber, 40), 75%, 60%, 0.6) hsla(var(--neutral-hue), 20%, 20%, 0.3);
}
</style>