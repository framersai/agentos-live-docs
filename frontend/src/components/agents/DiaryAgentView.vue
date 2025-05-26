// File: frontend/src/components/agents/DiaryAgentView.vue
/**
 * @file DiaryAgentView.vue
 * @description UI component for the Interactive Diary agent "Echo".
 * Facilitates empathetic conversation to capture and structure user's thoughts into diary entries.
 * @version 0.1.0 - Initial implementation.
 */
<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type ChatMessage, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, type ChatMessagePayload } from '@/utils/api';
import type { ToastService } from '@/services/services';
import { BookOpenIcon, PlusCircleIcon, SparklesIcon } from '@heroicons/vue/24/outline';
import { marked } from 'marked'; // For rendering the final diary entry markdown

// For this agent, CompactMessageRenderer might be overkill for a single entry display.
// We'll render the Markdown from mainContent directly or a custom entry component.

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

// State for the diary entry creation process
const isCreatingEntry = ref(false); // True when user starts dictating an entry
const currentEntryTitleSuggestion = ref('');
const currentEntryTagsSuggestion = ref<string[]>([]);

const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));
const renderedMainContentHtml = computed(() => {
    if (mainContentToDisplay.value && mainContentToDisplay.value.type === 'markdown') {
        try {
            return marked.parse(mainContentToDisplay.value.data as string);
        } catch (e) {
            console.error("Error parsing diary markdown:", e);
            return `<p class="text-red-500">Error displaying entry.</p>`;
        }
    }
    return '<p class="text-slate-500 italic">No diary entry selected or available.</p>';
});

const fetchSystemPrompt = async () => {
    if (props.agentConfig.systemPromptKey) {
        try {
            const module = await import(/* @vite-ignore */ `../../../../prompts/${props.agentConfig.systemPromptKey}.md?raw`);
            currentAgentSystemPrompt.value = module.default;
        } catch (e) {
            console.error(`[${props.agentId}Agent] Failed to load system prompt: ${props.agentConfig.systemPromptKey}.md`, e);
            currentAgentSystemPrompt.value = "You are Echo, an empathetic diary. Listen and help structure entries.";
        }
    } else {
        currentAgentSystemPrompt.value = "You are Echo, an empathetic diary. Listen and help structure entries.";
    }
};

watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

const getRecentDiaryTopicsSummary = (): string => {
    // Placeholder: In a real app, fetch titles/tags of last 1-2 diary entries
    // from a persistent store or a summarized version in agentStore.currentAgentContext.
    // For now, just a generic string.
    const recent = agentStore.currentAgentContext?.recentDiaryThemes as string[] || [];
    if (recent.length > 0) {
        return recent.slice(0,2).join(' and ');
    }
    return "your previous reflections";
};

const handleNewUserInput = async (text: string) => {
    if (!text.trim() || isLoadingResponse.value) return;

    const userMessage: ChatMessage = {
        id: `user-diary-${Date.now()}`, role: 'user' as 'user', content: text,
        timestamp: Date.now(), agentId: props.agentId,
    };
    chatStore.addMessage(userMessage);
    isLoadingResponse.value = true;

    // For diary, interaction is primarily chat-based until final entry generation
    // So, no direct main content streaming overlay here unless it's the final entry generation.

    try {
        const recentTopicsSummary = getRecentDiaryTopicsSummary();
        let finalSystemPrompt = currentAgentSystemPrompt.value
            .replace(/{{CURRENT_DATE}}/g, new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
            .replace(/{{RECENT_TOPICS_SUMMARY}}/gi, recentTopicsSummary)
            .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.currentAgentContext || { creatingNewEntry: isCreatingEntry.value }))
            .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Focus on empathetic follow-up questions. If the user seems to be concluding their thoughts for an entry, transition to suggesting a title and tags, then provide the structured Markdown for the main entry.');

        const historyForApi = await chatStore.getHistoryForApi(
            props.agentId, text, finalSystemPrompt,
            props.agentConfig.capabilities?.maxChatHistory || 15 // Diary might benefit from more context
        );
        
        const messagesForLlm: ChatMessagePayload['messages'] = [
            { role: 'system', content: finalSystemPrompt }, ...historyForApi,
        ];
        
        const payload: ChatMessagePayload = {
            messages: messagesForLlm, mode: props.agentConfig.systemPromptKey,
            language: voiceSettingsManager.settings.speechLanguage, // Use speech language for diary context
            userId: 'private_user_diary',
            conversationId: chatStore.getCurrentConversationId(props.agentId),
        };
        
        const response = await chatAPI.sendMessage(payload);
        const assistantMessageContent = response.data.content || "I'm listening. Tell me more.";

        // Heuristic: If LLM response looks like a diary entry (starts with ## Title), update main content.
        // Otherwise, it's a chat reply.
        if (assistantMessageContent.trim().startsWith("## ")) { // Assuming title is H2
            chatStore.updateMainContent({
                agentId: props.agentId, type: 'markdown',
                data: assistantMessageContent,
                title: assistantMessageContent.split('\n')[0].replace("## ", "").trim() || "Diary Entry",
                timestamp: Date.now(),
            });
            chatStore.addMessage({ // Add a small confirmation to chat log
                id: `asst-diary-entry-${Date.now()}`, role: 'assistant',
                content: "I've saved this as a new diary entry for you.",
                timestamp: Date.now(), agentId: props.agentId, model: response.data.model, usage: response.data.usage,
            });
            isCreatingEntry.value = false; // Reset state
        } else {
            // It's an interactive chat reply from Echo
            chatStore.addMessage({
                id: `asst-diary-chat-${Date.now()}`, role: 'assistant',
                content: assistantMessageContent,
                timestamp: Date.now(), agentId: props.agentId, model: response.data.model, usage: response.data.usage,
            });
        }

    } catch (error: any) {
        console.error(`[DiaryAgent] Chat API error:`, error);
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred.';
        toast?.add({ type: 'error', title: `Echo Error`, message: errorMessage });
        chatStore.addMessage({
            id: `error-diary-${Date.now()}`, role: 'assistant', content: `Sorry, I encountered an issue: ${errorMessage}`,
            timestamp: Date.now(), agentId: props.agentId, isError: true,
        });
    } finally {
        isLoadingResponse.value = false;
    }
};

const startNewEntry = () => {
    isCreatingEntry.value = true;
    const promptText = "Let's start a new diary entry. What's on your mind?";
    chatStore.addMessage({
        id: `system-new-entry-${Date.now()}`, role: 'assistant', // System-like message from agent itself
        content: promptText, timestamp: Date.now(), agentId: props.agentId
    });
    // Optionally, clear previous "main content" or show a "new entry" placeholder
    chatStore.updateMainContent({
        agentId: props.agentId, type: 'markdown',
        data: `## New Diary Entry - ${new Date().toLocaleDateString()}\n\n_Start typing or use your voice to share your thoughts..._`,
        title: `New Entry`, timestamp: Date.now()
    });
    toast?.add({type:'info', title:'New Diary Entry', message:'Echo is ready to listen.'});
}

defineExpose({ handleNewUserInput });

onMounted(() => {
    console.log(`[${props.agentConfig.label}] View Mounted`);
    emit('agent-event', { type: 'view_mounted', agentId: props.agentId });
    if (!mainContentToDisplay.value) {
        const recentTopicsSummary = getRecentDiaryTopicsSummary();
        chatStore.updateMainContent({
            agentId: props.agentId, type: 'markdown',
            data: `### ${props.agentConfig.label} - Echo\n${props.agentConfig.description}\n\nReady to listen. You can start a new entry or just share your thoughts. You recently wrote about ${recentTopicsSummary}.`,
            title: `${props.agentConfig.label} Ready`, timestamp: Date.now(),
        });
    }
});

</script>

<template>
  <div class="diary-agent-view flex flex-col h-full w-full overflow-hidden">
    <div class="agent-header-controls p-2 px-3 border-b border-purple-500/20 dark:border-slate-700/50 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
            <BookOpenIcon class="w-5 h-5" :class="props.agentConfig.iconClass" />
            <span class="font-semibold text-sm">{{ props.agentConfig.label }}</span>
        </div>
        <button @click="startNewEntry" class="btn btn-secondary btn-xs py-1 px-2.5 text-xs flex items-center gap-1.5">
            <PlusCircleIcon class="w-4 h-4"/> New Entry
        </button>
    </div>

    <div class="flex-grow relative min-h-0">
      <div v-if="isLoadingResponse" class="loading-overlay-diary">
        <SparklesIcon class="w-8 h-8 text-emerald-400 animate-ping" />
        <p class="mt-2 text-sm text-slate-400">Echo is listening...</p>
      </div>
      
      <div v-if="mainContentToDisplay && mainContentToDisplay.type === 'markdown'"
           class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 flex-grow overflow-y-auto h-full diary-entry-display"
           v-html="renderedMainContentHtml"
      ></div>
      <div v-else-if="!isLoadingResponse" class="flex-grow flex items-center justify-center h-full p-4">
          <p class="text-slate-500 italic text-center">
            Your diary entries will appear here once finalized.<br/>
            Use the chat to interact with Echo and compose your thoughts.
          </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay-diary {
    position: absolute; inset: 0;
    background-color: rgba(10, 20, 15, 0.7); /* Dark green tint */
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    z-index: 10; color: theme('colors.emerald.200');
}
.diary-entry-display {
    background-color: rgba(20, 30, 25, 0.1); /* Subtle background for entry */
}
.dark .diary-entry-display {
    background-color: rgba(10, 15, 12, 0.3);
}

.prose :deep(h2) { /* Styling for diary entry title */
    @apply text-emerald-600 dark:text-emerald-400 border-b border-emerald-500/30 pb-2 mb-4;
}
.prose :deep(strong) { /* Styling for Date, Tags labels */
    @apply text-emerald-700 dark:text-emerald-300;
}
.btn.btn-xs {
    @apply py-1 px-2 text-xs;
}
</style>