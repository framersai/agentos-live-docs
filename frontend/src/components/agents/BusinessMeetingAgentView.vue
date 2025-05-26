// File: frontend/src/components/agents/BusinessMeetingAgentView.vue
/**
 * @file BusinessMeetingAgentView.vue
 * @description UI component for the Business Meeting Assistant.
 * Helps summarize meeting notes and extract key information.
 * @version 0.1.1 - Imported 'marked' for direct markdown rendering.
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
import { BriefcaseIcon, DocumentArrowDownIcon, SparklesIcon } from '@heroicons/vue/24/outline';
import { marked } from 'marked'; // <<--- ADD THIS IMPORT

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
const meetingNotesInput = ref('');

const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));

const fetchSystemPrompt = async () => {
    if (props.agentConfig.systemPromptKey) {
        try {
            const module = await import(/* @vite-ignore */ `../../../../prompts/${props.agentConfig.systemPromptKey}.md?raw`);
            currentAgentSystemPrompt.value = module.default;
        } catch (e) {
            console.error(`[${props.agentId}Agent] Failed to load system prompt: ${props.agentConfig.systemPromptKey}.md`, e);
            currentAgentSystemPrompt.value = "You are a Meeting Assistant. Summarize provided text into structured meeting notes.";
        }
    } else {
        currentAgentSystemPrompt.value = "You are a Meeting Assistant. Summarize provided text into structured meeting notes.";
    }
};

watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

const handleNewUserInput = async (text: string) => {
    if (!text.trim() || isLoadingResponse.value) {
        if (!text.trim()) {
            toast?.add({type:'warning', title:'Empty Notes', message:'Please provide some meeting notes to summarize.'});
        }
        return;
    }

    const userMessage: ChatMessage = {
        id: `user-meeting-${Date.now()}`, role: 'user' as 'user', content: `Submitted meeting notes for summarization (length: ${text.length} chars).`,
        timestamp: Date.now(), agentId: props.agentId,
    };
    chatStore.addMessage(userMessage);
    isLoadingResponse.value = true;
    
    chatStore.updateMainContent({
        agentId: props.agentId, type: 'markdown',
        data: `## Processing Meeting Notes...\n\nReviewing the provided information to generate a summary.\n\n<div class="flex justify-center items-center p-8"><div class="spinner-meeting"></div></div>`,
        title: `Summarizing...`, timestamp: Date.now()
    });

    try {
        let finalSystemPrompt = currentAgentSystemPrompt.value
            .replace(/{{USER_QUERY_TOPIC_OR_TITLE_SUGGESTION}}/g, `Summary of Provided Notes`)
            .replace(/{{USER_QUERY}}/g, text) 
            .replace(/{{GENERATE_DIAGRAM}}/g, (props.agentConfig.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams).toString())
            .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.currentAgentContext || {}))
            .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Ensure the output strictly follows the specified Markdown format for meeting summaries.');

        const historyForApi = await chatStore.getHistoryForApi(
            props.agentId, text, finalSystemPrompt, 1
        );
        
        const messagesForLlm: ChatMessagePayload['messages'] = [
            { role: 'system', content: finalSystemPrompt },
            // The full text is passed via {{USER_QUERY}} in the system prompt for this agent usually
            // or as a direct user message if the prompt is structured for that.
            // For summarization of a large block, often the block IS the primary "user" content.
            { role: 'user', content: `Please summarize the following meeting notes following the prescribed format: \n\n${text}` }
            // ...historyForApi, // History might be less critical if summarizing a fresh block of text
        ];
        
        const payload: ChatMessagePayload = {
            messages: messagesForLlm, mode: props.agentConfig.systemPromptKey,
            language: voiceSettingsManager.settings.speechLanguage,
            generateDiagram: props.agentConfig.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
            userId: 'private_user_meeting',
            conversationId: chatStore.getCurrentConversationId(props.agentId),
        };
        
        const response = await chatAPI.sendMessage(payload);
        const assistantMessageContent = response.data.content || "Could not generate a summary for the provided notes.";

        chatStore.updateMainContent({
            agentId: props.agentId,
            type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: assistantMessageContent,
            title: `Meeting Summary - ${new Date(userMessage.timestamp).toLocaleDateString()}`,
            timestamp: Date.now(),
        });
        
        chatStore.addMessage({
            id: `asst-meeting-${Date.now()}`, role: 'assistant',
            content: "I've processed the notes; the summary is in the main view. Any clarifications needed?",
            timestamp: Date.now(), agentId: props.agentId, model: response.data.model, usage: response.data.usage,
        });
        meetingNotesInput.value = '';

    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred.';
        toast?.add({ type: 'error', title: `Meeting Summary Error`, message: errorMessage });
        chatStore.updateMainContent({
            agentId: props.agentId, type: 'markdown',
            data: `### Error Summarizing Notes\n\n*${errorMessage}*`,
            title: 'Summary Error', timestamp: Date.now()
        });
         chatStore.addMessage({
            id: `error-meeting-${Date.now()}`, role: 'assistant', content: `Sorry, I encountered an issue: ${errorMessage}`,
            timestamp: Date.now(), agentId: props.agentId, isError: true,
        });
    } finally {
        isLoadingResponse.value = false;
    }
};

const submitMeetingNotes = () => {
    handleNewUserInput(meetingNotesInput.value);
}

defineExpose({ handleNewUserInput });

onMounted(() => {
    console.log(`[${props.agentConfig.label}] View Mounted`);
    emit('agent-event', { type: 'view_mounted', agentId: props.agentId });
    if (!mainContentToDisplay.value) {
        chatStore.updateMainContent({
            agentId: props.agentId, type: 'markdown',
            data: `### ${props.agentConfig.label}\n${props.agentConfig.description}\n\n${props.agentConfig.inputPlaceholder || 'Paste your meeting notes or transcript here to get started.'}`,
            title: `${props.agentConfig.label} Ready`, timestamp: Date.now(),
        });
    }
});

</script>

<template>
  <div class="business-meeting-agent-view flex flex-col h-full w-full overflow-hidden">
    <div class="agent-header-controls p-2 px-3 border-b border-purple-500/20 dark:border-slate-700/50 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
            <BriefcaseIcon class="w-5 h-5" :class="props.agentConfig.iconClass" />
            <span class="font-semibold text-sm">{{ props.agentConfig.label }}</span>
        </div>
        <button @click="submitMeetingNotes" class="btn btn-primary btn-xs py-1 px-2.5 text-xs" :disabled="!meetingNotesInput.trim() || isLoadingResponse">
            <DocumentArrowDownIcon class="w-4 h-4 mr-1.5" /> Process Notes
        </button>
    </div>

    <div class="flex-grow flex flex-col lg:flex-row overflow-hidden meeting-layout">
        <div class="lg:w-2/5 p-3 flex flex-col border-b lg:border-b-0 lg:border-r border-purple-500/10 dark:border-slate-700/30 notes-input-panel">
            <label for="meetingNotes" class="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5">Paste Meeting Notes/Transcript:</label>
            <textarea 
                id="meetingNotes"
                v-model="meetingNotesInput" 
                placeholder="Start pasting or typing your meeting notes here..."
                class="w-full flex-grow p-2.5 bg-slate-800/50 dark:bg-slate-950/70 border border-slate-700 dark:border-slate-800 rounded-md text-sm font-mono focus:ring-purple-500 focus:border-purple-500 resize-none"
            ></textarea>
        </div>

        <div class="lg:w-3/5 flex-grow relative min-h-0 summary-display-panel">
            <div v-if="isLoadingResponse" class="loading-overlay-meeting">
                <div class="spinner-meeting"></div>
                <p class="mt-2 text-sm text-slate-400">Summarizing notes...</p>
            </div>
            
            <template v-if="mainContentToDisplay && !isLoadingResponse">
                <CompactMessageRenderer
                    v-if="props.agentConfig.capabilities?.usesCompactRenderer && (mainContentToDisplay.type === 'compact-message-renderer-data' || mainContentToDisplay.type === 'markdown')"
                    :content="mainContentToDisplay.data" 
                    :mode="props.agentConfig.id"
                    class="flex-grow overflow-y-auto p-1 h-full"
                />
                <div v-else-if="mainContentToDisplay.type === 'markdown'"
                     class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 flex-grow overflow-y-auto h-full"
                     v-html="marked.parse(mainContentToDisplay.data as string)"
                ></div>
                 <div v-else class="p-4 text-slate-400 italic h-full flex items-center justify-center">
                    Meeting summary will appear here.
                </div>
            </template>
            <div v-else-if="!isLoadingResponse" class="flex-grow flex items-center justify-center h-full p-4">
                <div class="text-center text-slate-400 dark:text-slate-500">
                    <SparklesIcon class="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>{{ props.agentConfig.inputPlaceholder || 'Paste notes to get started.' }}</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay-meeting {
    position: absolute; inset: 0; background-color: rgba(18, 12, 38, 0.7);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    z-index: 10; color: theme('colors.cyan.200'); /* Adjusted for meeting theme */
}
.spinner-meeting {
    width: 36px; height: 36px; border: 4px solid rgba(34, 211, 238, 0.2); /* cyan */
    border-top-color: theme('colors.cyan.400');
    border-radius: 50%; animation: spin_meeting_agent_v2 1s linear infinite; /* Unique name */
}
@keyframes spin_meeting_agent_v2 { to { transform: rotate(360deg); } }

.notes-input-panel textarea {
    scrollbar-width: thin;
    scrollbar-color: theme('colors.slate.600') theme('colors.slate.800');
}
.notes-input-panel textarea::-webkit-scrollbar { width: 6px; }
.notes-input-panel textarea::-webkit-scrollbar-thumb { background-color: theme('colors.slate.600'); border-radius: 3px; }

.btn.btn-xs {
    padding-top: 0.25rem; /* py-1 */
    padding-bottom: 0.25rem; /* py-1 */
    padding-left: 0.625rem; /* px-2.5 */
    padding-right: 0.625rem; /* px-2.5 */
    font-size: 0.75rem; /* text-xs */
}
</style>