// File: frontend/src/components/agents/CodingAgentView.vue
/**
 * @file CodingAgentView.vue
 * @description UI component for the Coding Assistant agent.
 * Features a layout for displaying explanations and code side-by-side or stacked.
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
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';
import Message from '@/components/Message.vue'; // For rendering code blocks if not using CompactMessageRenderer
import { CodeBracketSquareIcon, DocumentTextIcon, LightBulbIcon } from '@heroicons/vue/24/outline';

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

// Main content could be split: explanationMarkdown and codeSnippet
const explanationContent = ref<string | null>(null);
const codeSnippet = ref<string | null>(null);
const codeLanguage = ref<string>('plaintext');

// Or, a single structured content for CompactMessageRenderer
const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));


const fetchSystemPrompt = async () => {
    if (props.agentConfig.systemPromptKey) {
        try {
            const module = await import(/* @vite-ignore */ `../../../../prompts/${props.agentConfig.systemPromptKey}.md?raw`);
            currentAgentSystemPrompt.value = module.default;
        } catch (e) {
            console.error(`[${props.agentId}Agent] Failed to load system prompt: ${props.agentConfig.systemPromptKey}.md`, e);
            currentAgentSystemPrompt.value = "You are an expert Coding Assistant. Provide clear code and explanations.";
        }
    } else {
        currentAgentSystemPrompt.value = "You are an expert Coding Assistant. Provide clear code and explanations.";
    }
};

watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

const parseLlmResponseForCoding = (llmResponseContent: string) => {
    // Heuristic to separate explanation from code block
    // Assumes LLM follows "Explanation... ```lang ...code... ``` ...further explanation"
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n```/m;
    const match = llmResponseContent.match(codeBlockRegex);

    if (match) {
        const lang = match[1] || voiceSettingsManager.settings.preferredCodingLanguage || 'plaintext';
        const code = match[2].trim();
        const parts = llmResponseContent.split(match[0]);
        const beforeCode = parts[0] ? parts[0].trim() : "";
        const afterCode = parts[1] ? parts[1].trim() : "";
        
        explanationContent.value = `${beforeCode}\n\n${afterCode}`.trim();
        codeSnippet.value = code;
        codeLanguage.value = lang;

        // For CompactMessageRenderer, we might want to structure this differently
        // e.g., send the whole thing and let CompactMessageRenderer handle code blocks
        // Or create specific "slides" for explanation and code.
        // For now, this updates local refs for a two-panel display.
        // Update main content in store to reflect this parsing, if desired.
        // This is complex because mainContent is usually a single blob.
        // We might need a custom type for mainContent in chatStore for this agent.
         chatStore.updateMainContent({
            agentId: props.agentId,
            type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            // If using CompactMessageRenderer, the LLM should ideally already format for slides.
            // The prompt for coding.md asks for headings.
            data: llmResponseContent, // Pass the full content for CompactMessageRenderer
            title: `Coding Solution/Explanation`,
            timestamp: Date.now(),
        });


    } else {
        explanationContent.value = llmResponseContent;
        codeSnippet.value = null;
        codeLanguage.value = 'plaintext';
         chatStore.updateMainContent({
            agentId: props.agentId,
            type: 'markdown',
            data: llmResponseContent,
            title: `Coding Explanation`,
            timestamp: Date.now(),
        });
    }
};


const handleNewUserInput = async (text: string) => {
    if (!text.trim() || isLoadingResponse.value) return;

    const userMessage: ChatMessage = {
        id: `user-coding-${Date.now()}`, role: 'user' as 'user', content: text,
        timestamp: Date.now(), agentId: props.agentId,
    };
    chatStore.addMessage(userMessage);
    isLoadingResponse.value = true;
    
    // Update main content with a loading/thinking state
    const thinkingData = `## Responding to: ${text.substring(0,50)}...\n\nThinking and preparing your coding assistance...\n\n<div class="flex justify-center items-center p-8"><div class="spinner-coding"></div></div>`;
    chatStore.updateMainContent({
        agentId: props.agentId, type: 'markdown', data: thinkingData,
        title: `Processing Query...`, timestamp: Date.now()
    });

    try {
        const preferredLang = voiceSettingsManager.settings.preferredCodingLanguage;
        let finalSystemPrompt = currentAgentSystemPrompt.value
            .replace(/{{LANGUAGE}}/g, preferredLang)
            .replace(/{{USER_QUERY}}/g, text) // Specific placeholder for coding prompt
            .replace(/{{GENERATE_DIAGRAM}}/g, (props.agentConfig.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams).toString())
            .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.currentAgentContext || {}))
            .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Please structure explanations clearly, possibly in sections suitable for slides. Ensure code is in proper Markdown blocks.');
        
        const historyForApi = await chatStore.getHistoryForApi(
            props.agentId, text, finalSystemPrompt,
            props.agentConfig.capabilities?.maxChatHistory || 15
        );

        const messagesForLlm: ChatMessagePayload['messages'] = [
            { role: 'system', content: finalSystemPrompt }, ...historyForApi,
        ];
        
        const payload: ChatMessagePayload = {
            messages: messagesForLlm, mode: props.agentConfig.systemPromptKey,
            language: preferredLang,
            generateDiagram: props.agentConfig.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
            userId: 'private_user_coding',
            conversationId: chatStore.getCurrentConversationId(props.agentId),
        };
        
        const response = await chatAPI.sendMessage(payload);
        const assistantMessageContent = response.data.content || "I seem to be having trouble formulating a response for that.";

        parseLlmResponseForCoding(assistantMessageContent); // This will update mainContent in chatStore

        chatStore.addMessage({
            id: `asst-coding-${Date.now()}`, role: 'assistant', content: assistantMessageContent,
            timestamp: Date.now(), agentId: props.agentId, model: response.data.model, usage: response.data.usage,
        });

    } catch (error: any) { /* ... (standard error handling) ... */ }
    finally { isLoadingResponse.value = false; }
};

defineExpose({ handleNewUserInput });

onMounted(() => {
    console.log(`[${props.agentConfig.label}] View Mounted`);
    emit('agent-event', { type: 'view_mounted', agentId: props.agentId });
    if (!mainContentToDisplay.value) {
        chatStore.updateMainContent({
            agentId: props.agentId, type: 'markdown',
            data: `### Welcome to the ${props.agentConfig.label}!\n${props.agentConfig.description}\n\n${props.agentConfig.inputPlaceholder || 'How can I assist with your code?'}`,
            title: `${props.agentConfig.label} Ready`, timestamp: Date.now(),
        });
    }
});
</script>

<template>
  <div class="coding-agent-view flex flex-col h-full w-full overflow-hidden">
    <div class="agent-header-controls p-2 px-3 border-b border-purple-500/20 dark:border-slate-700/50 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
            <CodeBracketSquareIcon class="w-5 h-5" :class="props.agentConfig.iconClass" />
            <span class="font-semibold text-sm">{{ props.agentConfig.label }}</span>
        </div>
        </div>

    <div class="flex-grow relative min-h-0">
        <div v-if="isLoadingResponse" class="loading-overlay-coding">
            <div class="spinner-coding"></div>
            <p class="mt-2 text-sm text-slate-400">Crafting your code solution...</p>
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
                 v-html="mainContentToDisplay.data"
            ></div>
            <div v-else class="p-4 text-slate-400 italic h-full flex items-center justify-center">
                {{ agentConfig.label }} is ready. Output type: {{ mainContentToDisplay.type }}.
            </div>
        </template>
        <div v-else-if="!isLoadingResponse" class="flex-grow flex items-center justify-center h-full p-4">
            <div class="text-center text-slate-400 dark:text-slate-500">
                <LightBulbIcon class="w-12 h-12 mx-auto mb-3 opacity-60"/>
                <p class="text-lg">{{ props.agentConfig.inputPlaceholder || 'Ask your coding question.' }}</p>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay-coding {
    position: absolute; inset: 0;
    background-color: rgba(18, 12, 38, 0.7);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    z-index: 10; color: theme('colors.rose.200');
}
.spinner-coding {
    width: 36px; height: 36px; border: 4px solid rgba(251, 113, 133, 0.2); /* rose */
    border-top-color: theme('colors.rose.400');
    border-radius: 50%; animation: spin_coding_agent 1s linear infinite;
}
@keyframes spin_coding_agent { to { transform: rotate(360deg); } }

/* Example for a two-panel layout if not using CompactMessageRenderer for everything */
.coding-layout {
    display: flex;
    height: 100%;
}
.explanation-panel {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    border-right: 1px solid var(--border-color-rgb); /* Or theme('colors.slate.700') */
}
.code-panel {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    background-color: theme('colors.gray.800'); /* Or a code editor theme background */
}
/* Styles for Message component when rendering code inside code-panel */
.code-panel :deep(.message-container) {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
}
</style>