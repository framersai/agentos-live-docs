// File: frontend/src/components/agents/SystemDesignerAgentView.vue
/**
 * @file SystemDesignerAgentView.vue
 * @description UI component for the System Design AI agent.
 * Facilitates collaborative system design with a focus on diagram generation and structured explanations.
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
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue'; // Key component for display
import { LightBulbIcon, SparklesIcon, CodeBracketSquareIcon } from '@heroicons/vue/24/outline'; // ShieldCheckIcon was used in service, using a design-related icon here

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

// The mainContentToDisplay will hold the markdown (with embedded mermaid for CompactMessageRenderer)
const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));

const fetchSystemPrompt = async () => {
    if (props.agentConfig.systemPromptKey) {
        try {
            const module = await import(/* @vite-ignore */ `../../../../prompts/${props.agentConfig.systemPromptKey}.md?raw`);
            currentAgentSystemPrompt.value = module.default;
        } catch (e) {
            console.error(`[${props.agentId}Agent] Failed to load system prompt: ${props.agentConfig.systemPromptKey}.md`, e);
            currentAgentSystemPrompt.value = "You are a System Design AI. Help design and diagram systems.";
        }
    } else {
        currentAgentSystemPrompt.value = "You are a System Design AI. Help design and diagram systems.";
    }
};

watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

const getRecentDesignContext = (): string => {
    // Placeholder: Could summarize key components or requirements from last few turns or agentContext
    const context = agentStore.currentAgentContext;
    if (context?.focus_area) {
        return `your previous focus on ${context.focus_area}`;
    }
    if (context?.current_diagram_mermaid_code) {
        return `the existing diagram we were working on`;
    }
    return "our last design discussion";
};

const handleNewUserInput = async (text: string) => {
    if (!text.trim() || isLoadingResponse.value) return;

    const userMessage: ChatMessage = {
        id: `user-design-${Date.now()}`, role: 'user' as 'user', content: text,
        timestamp: Date.now(), agentId: props.agentId,
    };
    chatStore.addMessage(userMessage);
    isLoadingResponse.value = true;
    
    const currentTitle = mainContentToDisplay.value?.title || "System Design Discussion";
    const loadingMessage = `## ${currentTitle.replace("Processing...", "").replace("Ready", "").trim()}\n\nUpdating design based on: *"${text.substring(0,50)}..."*\n\n<div class="flex justify-center items-center p-8"><div class="spinner-designer"></div><span class="ml-3 text-slate-400">Architecting...</span></div>`;
    chatStore.updateMainContent({
        agentId: props.agentId, type: 'markdown', data: loadingMessage,
        title: `Processing: ${text.substring(0,30)}...`, timestamp: Date.now()
    });

    try {
        const recentContextSummary = getRecentDesignContext();
        let finalSystemPrompt = currentAgentSystemPrompt.value
            .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage)
            .replace(/{{USER_QUERY}}/g, text)
            .replace(/{{RECENT_TOPICS_SUMMARY}}/gi, recentContextSummary)
            .replace(/{{GENERATE_DIAGRAM}}/g, "true") // System Designer should always try to generate/update diagrams
            .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify({
                ...agentStore.currentAgentContext,
                // Pass current main content's mermaid code back to LLM for iteration
                current_diagram_mermaid_code: extractMermaidCode(mainContentToDisplay.value?.data)
            }))
            .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Focus on iterative diagram updates and clear explanations. Use Markdown headings for sections or ---SLIDE_BREAK--- for CompactMessageRenderer compatibility.');

        const historyForApi = await chatStore.getHistoryForApi(
            props.agentId, text, finalSystemPrompt,
            props.agentConfig.capabilities?.maxChatHistory || 10 
        );
        
        const messagesForLlm: ChatMessagePayload['messages'] = [
            { role: 'system', content: finalSystemPrompt }, ...historyForApi,
        ];
        
        const payload: ChatMessagePayload = {
            messages: messagesForLlm, mode: props.agentConfig.systemPromptKey,
            language: voiceSettingsManager.settings.preferredCodingLanguage,
            generateDiagram: true, // Override, always true for this agent
            userId: 'private_user_designer',
            conversationId: chatStore.getCurrentConversationId(props.agentId),
        };
        
        const response = await chatAPI.sendMessage(payload);
        const assistantMessageContent = response.data.content || "I'm processing your design input. One moment.";

        // System Designer's response IS the main content, expected to be Markdown with Mermaid.
        chatStore.updateMainContent({
            agentId: props.agentId,
            // It will always use CompactMessageRenderer or render rich markdown.
            type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: assistantMessageContent,
            title: `System Design: Iteration on "${text.substring(0, 30)}..."`,
            timestamp: Date.now(),
        });
        
        // Add a concise note to chat log
        const diagramUpdateNote = assistantMessageContent.includes("```mermaid") ? "Diagram updated." : "Discussion updated.";
        chatStore.addMessage({
            id: `asst-design-${Date.now()}`, role: 'assistant',
            content: `Okay, I've updated the design in the main view. ${diagramUpdateNote} What are your thoughts on this iteration?`,
            timestamp: Date.now(), agentId: props.agentId, model: response.data.model, usage: response.data.usage,
        });

    } catch (error: any) { /* ... standard error handling, update main content with error ... */ }
    finally { isLoadingResponse.value = false; }
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
    emit('agent-event', { type: 'view_mounted', agentId: props.agentId });
    if (!mainContentToDisplay.value) {
        const recentContextSummary = getRecentDesignContext();
        chatStore.updateMainContent({
            agentId: props.agentId, type: 'markdown',
            data: `### Welcome to the ${props.agentConfig.label}!\n${props.agentConfig.description}\n\n${props.agentConfig.inputPlaceholder || 'Let\'s start designing your system. What are the core requirements?'}\nWe were last discussing ${recentContextSummary}.`,
            title: `${props.agentConfig.label} Ready`, timestamp: Date.now(),
        });
    }
     // Persist current diagram to agent context for next LLM call if needed
    watch(mainContentToDisplay, (newContent) => {
        if (newContent && newContent.type === 'markdown' || newContent?.type === 'compact-message-renderer-data') {
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
    <div class="agent-header-controls p-2 px-3 border-b border-purple-500/20 dark:border-slate-700/50 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
            <CodeBracketSquareIcon class="w-5 h-5" :class="props.agentConfig.iconClass" /> {/* Or ShieldCheckIcon */}
            <span class="font-semibold text-sm">{{ props.agentConfig.label }}</span>
        </div>
        </div>

    <div class="flex-grow relative min-h-0">
        <div v-if="isLoadingResponse" class="loading-overlay-designer">
            <div class="spinner-designer"></div>
            <p class="mt-2 text-sm text-slate-400">Architecting your system...</p>
        </div>
        
        <template v-if="mainContentToDisplay && !isLoadingResponse">
            <CompactMessageRenderer
                v-if="props.agentConfig.capabilities?.usesCompactRenderer" 
                :content="mainContentToDisplay.data" 
                :mode="props.agentConfig.id"
                class="flex-grow overflow-y-auto p-1 h-full"
            />
            <div v-else-if="mainContentToDisplay.type === 'markdown'"
                 class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 flex-grow overflow-y-auto h-full"
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

<style scoped>
.loading-overlay-designer {
    position: absolute; inset: 0; background-color: rgba(18, 12, 38, 0.7);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    z-index: 10; color: theme('colors.indigo.200');
}
.spinner-designer {
    width: 36px; height: 36px; border: 4px solid rgba(129, 140, 248, 0.2); /* indigo */
    border-top-color: theme('colors.indigo.400');
    border-radius: 50%; animation: spin_designer_agent 1s linear infinite;
}
@keyframes spin_designer_agent { to { transform: rotate(360deg); } }
</style>