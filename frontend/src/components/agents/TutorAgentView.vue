// File: frontend/src/components/agents/TutorAgentView.vue
/**
 * @file TutorAgentView.vue
 * @description UI component for the AI Tutor agent.
 * Manages interactive learning sessions, adapts to user level, uses
 * CompactMessageRenderer for structured explanations, implements
 * RECENT_TOPICS_SUMMARY logic, and dynamic response routing.
 * @version 0.2.2 - Merged features, corrected TS errors, and improved error handling.
 */
<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, onUnmounted, PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type ChatMessage, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, type ChatMessagePayload } from '@/utils/api';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';
import { AcademicCapIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';

type TutorLevel = 'beginner' | 'intermediate' | 'expert';

const props = defineProps({
    agentId: { type: String as PropType<IAgentDefinition['id']>, required: true },
    agentConfig: { type: Object as PropType<IAgentDefinition>, required: true }
});

const emit = defineEmits(['agent-event']);

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
            // Ensure the path is correct based on your project structure.
            // This assumes prompts are in /prompts at the root of your source, adjust if necessary.
            const module = await import(/* @vite-ignore */ `/src/prompts/${props.agentConfig.systemPromptKey}.md?raw`);
            currentAgentSystemPrompt.value = module.default;
        } catch (e) {
            console.error(`[${props.agentId}Agent] Failed to load system prompt: ${props.agentConfig.systemPromptKey}.md`, e);
            currentAgentSystemPrompt.value = "You are an AI Tutor. Your goal is to help the user understand concepts and solve problems effectively.";
        }
    } else {
        currentAgentSystemPrompt.value = "You are an AI Tutor. Your goal is to help the user understand concepts and solve problems effectively.";
    }
};

watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

watch(currentTutorLevel, (newLevel) => {
    agentStore.updateAgentContext({ tutorLevel: newLevel });
    toast?.add({type: 'info', title: 'Tutor Level Set', message: `Switched to ${newLevel} level.`, duration: 2000});
    
    // Optionally, if a topic is active, ask to re-explain.
    if (mainContentToDisplay.value && mainContentToDisplay.value.data && mainContentToDisplay.value.title !== `${props.agentConfig.label} Ready`) {
        // A simple way to re-engage after level change on an existing topic
        handleNewUserInput(`Could you please adjust your current explanation of "${mainContentToDisplay.value.title?.replace(/^(Tutor on: |Processing: )/, "").substring(0,40) || 'this topic'}" to a ${newLevel} level?`);
    }
});

const setTutorLevel = (level: TutorLevel) => {
    currentTutorLevel.value = level;
    showLevelSelector.value = false;
};

const getRecentTopicsSummary = (): string => {
    const agentMessages = chatStore.getMessagesForAgent(props.agentId);
    // Get last 3 unique user messages' content, preferring shorter summaries
    const userTopics = agentMessages
        .filter(m => m.role === 'user' && m.content.trim().length > 0)
        .slice(-5) // Look at a slightly larger pool
        .map(m => m.content.length > 50 ? m.content.substring(0, 50) + "..." : m.content)
        .filter((value, index, self) => self.indexOf(value) === index) // Unique topics
        .slice(-3); // Take last 3 unique

    if (userTopics.length === 0) return "anything you're curious about";
    if (userTopics.length === 1) return `"${userTopics[0]}"`;
    return `topics like "${userTopics.join('", "')}"`;
};

const handleNewUserInput = async (text: string) => {
    if (!text.trim() || isLoadingResponse.value) return;

    const userMessage: ChatMessage = {
        id: `user-tutor-${Date.now()}-${Math.random().toString(36).substring(2,9)}`,
        role: 'user' as 'user',
        content: text,
        timestamp: Date.now(),
        agentId: props.agentId,
    };
    chatStore.addMessage(userMessage);
    isLoadingResponse.value = true;
    
    const previousMainContentTitle = mainContentToDisplay.value?.title?.replace(/Ready$|Processing...$/, "").trim() || `New Topic`;
    chatStore.updateMainContent({ 
        agentId: props.agentId, 
        type: 'markdown',
        data: `## ${previousMainContentTitle}\n\nExploring: *"${text.substring(0,40)}..."*\n\n<div class="flex justify-center items-center p-8"><div class="spinner-tutor"></div><span class="ml-3 text-slate-400">Thinking...</span></div>`,
        title: `Processing: ${text.substring(0,30)}...`,
        timestamp: Date.now()
    });
    chatStore.setMainContentStreaming(true); // Indicate that new content might start streaming

    try {
        const recentTopicsSummary = getRecentTopicsSummary();
        let finalSystemPrompt = currentAgentSystemPrompt.value
            .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage)
            .replace(/{{MODE}}/g, props.agentConfig.id)
            .replace(/{{TUTOR_LEVEL}}/g, currentTutorLevel.value)
            .replace(/{{RECENT_TOPICS_SUMMARY}}/gi, recentTopicsSummary)
            .replace(/{{GENERATE_DIAGRAM}}/g, (props.agentConfig.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams).toString())
            .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.currentAgentContext || {}))
            .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Remember to ask guiding questions. Structure detailed explanations with Markdown headings (e.g., ## Title) or ---SLIDE_BREAK--- for slide presentation. Short guiding questions should be for the chat log.');

        // Use AdvancedConversationManager via chatStore if enabled, or fallback.
        // Assuming chatStore.getHistoryForApi is updated to handle this.
        const historyForApi = await chatStore.getHistoryForApi(
            props.agentId,
            text, // currentQueryText
            finalSystemPrompt // systemPromptText
        );
        
        const messagesForLlm: ChatMessagePayload['messages'] = [
            { role: 'system', content: finalSystemPrompt },
            ...historyForApi,
            // { role: 'user', content: text } // The current user text is passed as currentQueryText for history selection, LLM expects it as last message.
                                             // Ensure chatStore.getHistoryForApi does not include the current 'text' if it's added here.
                                             // Or, if getHistoryForApi *returns* a history that *should* be prepended to the current query, then this structure is fine.
                                             // For now, assuming `text` is the query for context selection and also the last user message.
                                             // The AdvancedConversationManager currently does NOT add the currentQueryText to the selected messages.
                                             // So we add it here:
             { role: 'user', content: text }
        ];

        const payload: ChatMessagePayload = {
            messages: messagesForLlm,
            mode: props.agentConfig.systemPromptKey || props.agentConfig.id, // Ensure mode has a fallback
            language: voiceSettingsManager.settings.preferredCodingLanguage,
            generateDiagram: !!(props.agentConfig.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams),
            userId: 'private_user_tutor', // Consider making this dynamic or configurable
            conversationId: chatStore.getCurrentConversationId(props.agentId),
            stream: true, // Enable streaming from the API
        };
        
        // Handle streaming response
        let accumulatedContent = "";
        chatStore.clearStreamingMainContent(); // Clear previous streaming text

        await chatAPI.sendMessageStream(payload, (chunk) => {
            if (chunk) {
                accumulatedContent += chunk;
                chatStore.appendToStreamingMainContent(chunk); 
                // Update main content progressively for streaming display
                // Heuristic: if it's short and looks like a question, maybe don't update main view yet.
                // For now, always update main view with streaming content.
                 chatStore.updateMainContent({
                    agentId: props.agentId,
                    type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                    data: accumulatedContent, // Streamed content directly
                    title: `Tutor on: ${text.substring(0, 40)}...`,
                    timestamp: Date.now(),
                });
            }
        });
        
        isLoadingResponse.value = false; // Loading is done once stream starts or finishes.
        chatStore.setMainContentStreaming(false); // Streaming finished.

        const assistantMessageContent = accumulatedContent.trim();
        if (!assistantMessageContent) {
            // Handle empty response after streaming
            toast?.add({ type: 'warning', title: `Tutor Response`, message: "Received an empty response from the tutor.", duration: 4000 });
            // Revert main content to a waiting state or previous state if desired.
             chatStore.updateMainContent({
                agentId: props.agentId, type: 'markdown',
                data: `I'm ready for your next question about "${text.substring(0,30)}..." or a new topic.`,
                title: `Tutor on: ${text.substring(0, 40)}...`, timestamp: Date.now()
            });
            return;
        }

        // Heuristic: short responses ending in '?' are chat replies.
        // This might be less reliable with streaming, apply to the full accumulatedContent.
        const isConversationalReply = assistantMessageContent.length < 180 && assistantMessageContent.trim().endsWith('?');

        if (isConversationalReply) {
            chatStore.addMessage({
                id: `asst-tutor-chat-${Date.now()}`,
                role: 'assistant',
                content: assistantMessageContent,
                timestamp: Date.now(),
                agentId: props.agentId,
                // model and usage might not be available per chunk in streaming, handle if available from final stream event
            });
            // Update main content to reflect it's waiting for user's response to the chat question
            const currentMainData = mainContentToDisplay.value?.type === 'markdown' ? mainContentToDisplay.value.data : '';
             chatStore.updateMainContent({
                agentId: props.agentId,
                type: 'markdown',
                data: currentMainData.includes(assistantMessageContent) ? currentMainData : (currentMainData + `\n\n---\n**Tutor (in chat):** *${assistantMessageContent}*`),
                title: mainContentToDisplay.value?.title || `Interactive Session`,
                timestamp: Date.now()
            });

        } else {
            // Main content was already updated by streaming. Add a chat message to prompt user.
            chatStore.addMessage({
                id: `asst-tutor-main-${Date.now()}`,
                role: 'assistant',
                content: `I've updated the main view with information about "${text.substring(0, 30)}...". What are your thoughts or questions?`,
                timestamp: Date.now(),
                agentId: props.agentId,
            });
        }

    } catch (error: any) {
        console.error(`[${props.agentId}Agent] Chat API error:`, error);
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred during the tutoring session.';
        toast?.add({ type: 'error', title: `Tutor Error`, message: errorMessage, duration: 7000 });
        chatStore.updateMainContent({
            agentId: props.agentId, type: 'markdown',
            data: `### Tutor System Error\nAn issue occurred while preparing your lesson:\n\n*${errorMessage}*`,
            title: 'Error', timestamp: Date.now()
        });
    } finally {
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
    emit('agent-event', { type: 'view_mounted', agentId: props.agentId });
    document.addEventListener('click', handleClickOutsideLevelSelector, true);

    if (!mainContentToDisplay.value || mainContentToDisplay.value.title === `${props.agentConfig.label} Ready`) {
        const recentTopicsSummary = getRecentTopicsSummary(); 
        const welcomeMessage = `### Welcome to the ${props.agentConfig.label}!\n${props.agentConfig.description}\n\nI'm here to help you learn. Current level: **${currentTutorLevel.value}**. You can change this above.\n\n${props.agentConfig.inputPlaceholder || 'What topic shall we explore today, or what problem can I help you solve?'} Perhaps something related to ${recentTopicsSummary}?`;
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
    <div class="agent-header-controls p-2 px-3 border-b border-purple-500/20 dark:border-slate-700/50 flex items-center justify-between gap-2 flex-wrap">
        <div class="flex items-center gap-2 shrink-0">
            <AcademicCapIcon class="w-5 h-5 text-amber-400" />
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

    <div class="flex-grow relative min-h-0">
      <div v-if="isLoadingResponse && !chatStore.isMainContentStreaming" class="loading-overlay-tutor">
        <div class="spinner-tutor"></div>
        <p class="mt-2 text-sm text-slate-400">Preparing your lesson...</p>
      </div>
      
      <template v-if="mainContentToDisplay">
          <CompactMessageRenderer
              v-if="props.agentConfig.capabilities?.usesCompactRenderer && (mainContentToDisplay.type === 'compact-message-renderer-data' || (mainContentToDisplay.type === 'markdown' && !chatStore.isMainContentStreaming))"
              :content="mainContentToDisplay.data" 
              :mode="props.agentConfig.id"
              class="flex-grow overflow-y-auto p-1 h-full"
          />
          <div v-else-if="mainContentToDisplay.type === 'markdown'"
               class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 flex-grow overflow-y-auto h-full"
               v-html="chatStore.isMainContentStreaming && agentStore.activeAgentId === props.agentId ? chatStore.streamingMainContentText + '▋' : mainContentToDisplay.data"
          ></div>
          <div v-else class="p-4 text-slate-400 italic h-full flex items-center justify-center">
            Tutor agent is active. Main content type: {{ mainContentToDisplay.type }}.
          </div>
      </template>
      <div v-else-if="!isLoadingResponse" class="flex-grow flex items-center justify-center h-full">
        <p class="text-slate-500 italic">What would you like to learn about with the {{ agentConfig.label }}?</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay-tutor { /* Unique class for tutor loading */
  position: absolute;
  inset: 0;
  background-color: rgba(18, 12, 38, 0.7); /* Slightly more opaque for focus */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10; /* Ensure it's above other content in this view */
  color: theme('colors.amber.200');
}

.spinner-tutor {
  width: 36px;
  height: 36px;
  border: 4px solid rgba(251, 191, 36, 0.2); /* Amber variant */
  border-top-color: theme('colors.amber.400');
  border-radius: 50%;
  animation: spin_tutor_agent_view_merged 1s linear infinite; /* Unique animation name */
}

@keyframes spin_tutor_agent_view_merged { /* Unique animation name */
  to { transform: rotate(360deg); }
}

/* Styles for dropdown, copied and adapted */
.dropdown-menu-private {
  background-color: rgba(30, 41, 59, 0.9); /* dark:bg-slate-800 with opacity */
  backdrop-filter: blur(1rem);
  border-width: 1px;
  border-color: rgba(107, 33, 168, 0.5); /* purple-700 with opacity */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: theme('boxShadow.2xl');
}
.dropdown-item-private {
  display: flex;
  align-items: center;
  padding: 0.625rem 0.75rem; /* px-3 py-2.5 for example */
  text-align: left;
  color: theme('colors.gray.200'); /* dark:text-gray-200 */
  border-radius: 0.375rem; /* rounded-md */
  transition-property: background-color, color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.dropdown-item-private:hover {
  background-color: rgba(107, 33, 168, 0.4); /* purple-700 hover with opacity */
  /* color: theme('colors.white'); implicitly handled by group-hover on text below if needed */
}
.dropdown-item-private.active {
  background-color: rgba(126, 34, 206, 0.5); /* purple-600 with opacity */
  color: theme('colors.white');
  font-weight: 600; /* semibold */
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

/* Ensure btn-xs from Tailwind or custom btn styles are applied correctly */
.btn.btn-secondary.btn-xs {
    /* Assuming these are defined globally or via @apply if using Tailwind components */
    /* Example explicit styles if not using @apply for btn components */
    padding-top: 0.25rem; 
    padding-bottom: 0.25rem;
    padding-left: 0.625rem;
    padding-right: 0.625rem;
    font-size: 0.75rem; /* text-xs */
    /* Add other base button styles like border, background, hover, focus as needed */
}
</style>