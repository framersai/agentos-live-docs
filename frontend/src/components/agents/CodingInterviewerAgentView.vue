/**
 * @file CodingInterviewerAgentView.vue
 * @description UI for the AI Coding Interviewer. Manages interview flow states,
 * problem presentation, solution evaluation, and feedback.
 * @version 0.2.1 - Further TypeScript corrections and unused variable removal.
 */
<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type MainContent, type ChatMessage as StoreChatMessage } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { ChatMessageFE } from '@/utils/api';
import { ChatMessagePayloadFE } from '@/utils/api';
import { chatAPI } from '@/utils/api';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';
import { UserCircleIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline';
import type { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';

/**
 * @typedef {'initial' | 'problem_pending' | 'problem_presented' | 'awaiting_solution' | 'evaluating_solution' | 'feedback_displayed' | 'session_ended'} InterviewStage
 * @description Defines the various stages of the coding interview process.
 */
type InterviewStage =
  | 'initial'
  | 'problem_pending'
  | 'problem_presented'
  | 'awaiting_solution'
  | 'evaluating_solution'
  | 'feedback_displayed'
  | 'session_ended';

const props = defineProps({
  /** The unique identifier of the agent. */
  agentId: { type: String as PropType<IAgentDefinition['id']>, required: true },
  /** The configuration object for the agent. */
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
const interviewStage = ref<InterviewStage>((agentStore.currentAgentContext?.interviewStage as InterviewStage) || 'initial');
const currentProblemStatement = ref<string | null>(null);
const userSolutionInput = ref<string>('');

const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));

watch(interviewStage, (newStage) => {
  agentStore.updateAgentContext({ interviewStage: newStage });
});

const fetchSystemPrompt = async () => {
  if (props.agentConfig.systemPromptKey) {
    try {
      const module = await import(/* @vite-ignore */ `../../../../prompts/${props.agentConfig.systemPromptKey}.md?raw`);
      currentAgentSystemPrompt.value = module.default;
    } catch (e) {
      console.error(`[${props.agentConfig.label}Agent] Failed to load system prompt: ${props.agentConfig.systemPromptKey}.md`, e);
      currentAgentSystemPrompt.value = "You are a Coding Interviewer. Present problems, evaluate solutions, and give feedback. Use Markdown headings or ---SLIDE_BREAK--- for main content formatting.";
    }
  } else {
    currentAgentSystemPrompt.value = "You are a Coding Interviewer. Present problems, evaluate solutions, and give feedback. Use Markdown headings or ---SLIDE_BREAK--- for main content formatting.";
  }
};
watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

const startInterviewOrNextProblem = async () => {
  isLoadingResponse.value = true;
  interviewStage.value = 'problem_pending';
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown',
    data: "## Getting Next Problem...\n\n<div class='flex justify-center p-8'><div class='spinner-interviewer'></div></div>",
    title: "Preparing Interview...", timestamp: Date.now()
  });

  const promptForProblem = "Please provide the next coding problem statement, including constraints and expected input/output formats. Present it clearly for the candidate. Use Markdown headings or ---SLIDE_BREAK--- delimiters for presentation.";
  chatStore.addMessage({
    role: 'user', content: promptForProblem,
    timestamp: Date.now(), agentId: props.agentId,
  });
  await callInterviewerLLM(promptForProblem);
};

const submitSolution = async () => {
  if (!userSolutionInput.value.trim()) {
    toast?.add({ type: 'warning', title: 'Empty Solution', message: 'Please enter your code solution.' });
    return;
  }
  const solutionText = `Here is my solution:\n\`\`\`${voiceSettingsManager.settings.preferredCodingLanguage || 'python'}\n${userSolutionInput.value}\n\`\`\``;
  chatStore.addMessage({
    role: 'user', content: solutionText,
    timestamp: Date.now(), agentId: props.agentId,
  });
  interviewStage.value = 'evaluating_solution';
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown',
    data: `## Evaluating Your Solution...\n\n${solutionText}\n\n<div class='flex justify-center p-8'><div class='spinner-interviewer'></div></div>`,
    title: "Evaluating...", timestamp: Date.now()
  });
  userSolutionInput.value = '';
  await callInterviewerLLM(solutionText);
};

const handleNewUserInput = async (text: string) => {
  if (!text.trim() || isLoadingResponse.value) return;
  chatStore.addMessage({
    role: 'user', content: text,
    timestamp: Date.now(), agentId: props.agentId,
  });
  await callInterviewerLLM(text);
};

async function callInterviewerLLM(userInput: string) {
  isLoadingResponse.value = true;

  try {
    const preferredLang = voiceSettingsManager.settings.preferredCodingLanguage;
    let finalSystemPrompt = currentAgentSystemPrompt.value
      .replace(/{{LANGUAGE}}/g, preferredLang)
      .replace(/{{USER_QUERY}}/g, userInput)
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify({ ...agentStore.currentAgentContext, currentProblem: currentProblemStatement.value || "Not yet presented." }))
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, `Current stage: ${interviewStage.value}. If presenting problem or feedback, use slide-format for CompactMessageRenderer.`);

    let maxHistoryMessages = 20;
    const agentMaxChatHistory = props.agentConfig.capabilities?.maxChatHistory;
    if (typeof agentMaxChatHistory === 'number') {
      maxHistoryMessages = agentMaxChatHistory;
    }
    
    const historyConfigOverride: Partial<AdvancedHistoryConfig> = {
        numRecentMessagesToPrioritize: maxHistoryMessages,
        simpleRecencyMessageCount: maxHistoryMessages 
    };

    const processedHistoryFromClient = await chatStore.getHistoryForApi(
      props.agentId, userInput, finalSystemPrompt, historyConfigOverride
    );
    
    const payload: ChatMessagePayloadFE = {
      messages: [{role: 'user', content: userInput, timestamp: Date.now(), agentId: props.agentId}],
      processedHistory: processedHistoryFromClient,
      mode: props.agentConfig.id,
      language: preferredLang,
      generateDiagram: props.agentConfig.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: 'frontend_user_interviewer', 
      conversationId: chatStore.getCurrentConversationId(props.agentId),
      systemPromptOverride: finalSystemPrompt,
    };
    
    const response = await chatAPI.sendMessage(payload);
    const responseData = response.data;
    let assistantMessageContent: string | null = null;

    if (responseData.type === 'function_call_data') {
        console.warn(`[${props.agentConfig.label}Agent] Received unexpected function call: ${responseData.toolName}`);
        assistantMessageContent = responseData.assistantMessageText || "Assistant tried to call a tool unexpectedly.";
         chatStore.addMessage({
            role: 'assistant', content: `Tool call requested: ${responseData.toolName}. Arguments: ${JSON.stringify(responseData.toolArguments)}`, 
            timestamp: Date.now(), agentId: props.agentId, model: responseData.model
        });
    } else { // TextResponseDataFE
        assistantMessageContent = responseData.content || "An issue occurred with my response.";
        chatStore.addMessage({
            role: 'assistant', content: assistantMessageContent,
            timestamp: Date.now(), agentId: props.agentId, model: responseData.model, usage: responseData.usage,
        });
    }


    if (interviewStage.value === 'problem_pending' && assistantMessageContent) {
      currentProblemStatement.value = assistantMessageContent;
      chatStore.updateMainContent({
        agentId: props.agentId, type: 'compact-message-renderer-data', data: assistantMessageContent,
        title: `Coding Problem`, timestamp: Date.now()
      });
      interviewStage.value = 'problem_presented';
    } else if (interviewStage.value === 'evaluating_solution' && assistantMessageContent) {
      chatStore.updateMainContent({
        agentId: props.agentId, type: 'compact-message-renderer-data', data: assistantMessageContent,
        title: `Feedback on Your Solution`, timestamp: Date.now()
      });
      interviewStage.value = 'feedback_displayed';
    }

  } catch (error: any) {
    console.error(`[${props.agentConfig.label}Agent] Chat API error:`, error);
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred.';
    toast?.add({ type: 'error', title: `${props.agentConfig.label} Error`, message: errorMessage });
    chatStore.addMessage({
      role: 'error', content: `Error: ${errorMessage}`,
      timestamp: Date.now(), agentId: props.agentId,
    });
  } finally { 
    isLoadingResponse.value = false; 
  }
}

defineExpose({ handleNewUserInput, startInterviewOrNextProblem, submitSolution });

onMounted(() => {
  console.log(`[${props.agentConfig.label}] View Mounted`);
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: props.agentConfig.label });
  if (interviewStage.value === 'initial' || !mainContentToDisplay.value) {
    const welcome = `### Welcome to the ${props.agentConfig.label}!\n${props.agentConfig.description}\n\nPress "Start Interview" when you are ready.`;
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown', data: welcome,
      title: `${props.agentConfig.label} Ready`, timestamp: Date.now()
    });
  }
});
</script>

<template>
  <div class="coding-interviewer-view flex flex-col h-full w-full overflow-hidden">
    <div class="agent-header-controls p-2 px-3 border-b border-purple-500/20 dark:border-slate-700/50 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <UserCircleIcon class="w-5 h-5 shrink-0" :class="props.agentConfig.iconClass || 'text-purple-400'" />
        <span class="font-semibold text-sm">{{ props.agentConfig.label }}</span>
        <span class="text-xs px-2 py-0.5 bg-slate-700 rounded capitalize">{{ interviewStage.replace(/_/g, ' ') }}</span>
      </div>
      <div>
        <button
          v-if="interviewStage === 'initial' || interviewStage === 'feedback_displayed'"
          @click="startInterviewOrNextProblem"
          class="btn btn-primary btn-xs py-1 px-2.5 text-xs"
          :disabled="isLoadingResponse">
          {{ interviewStage === 'initial' ? 'Start Interview' : 'Next Problem' }}
        </button>
      </div>
    </div>

    <div class="flex-grow relative min-h-0 custom-scrollbar-futuristic overflow-y-auto">
      <div v-if="isLoadingResponse && (interviewStage === 'problem_pending' || interviewStage === 'evaluating_solution')" class="loading-overlay-interviewer">
        <div class="spinner-interviewer"></div>
        <p class="mt-2 text-sm text-slate-400">
          {{ interviewStage === 'problem_pending' ? 'Preparing problem...' : 'Evaluating solution...' }}
        </p>
      </div>
      
      <template v-if="mainContentToDisplay && !isLoadingResponse">
        <CompactMessageRenderer
          v-if="props.agentConfig.capabilities?.usesCompactRenderer"
          :content="mainContentToDisplay.data as string"
          :mode="props.agentConfig.id"
          class="p-1 h-full"
        />
        <div v-else class="prose dark:prose-invert max-w-none p-4 md:p-6 h-full"
             v-html="mainContentToDisplay.data">
        </div>
      </template>
      <div v-else-if="!isLoadingResponse && interviewStage !== 'initial'" class="p-4 text-slate-400 italic h-full flex items-center justify-center">
        Waiting for next step...
      </div>

      <div v-if="interviewStage === 'problem_presented' || interviewStage === 'awaiting_solution'" class="p-4 border-t border-slate-700">
        <h3 class="text-sm font-semibold mb-2 text-slate-300">Your Solution (in {{ voiceSettingsManager.settings.preferredCodingLanguage || 'selected language' }}):</h3>
        <textarea
          v-model="userSolutionInput"
          placeholder="Type or paste your code solution here..."
          class="w-full h-48 p-2 bg-slate-900 border border-slate-700 rounded-md text-sm font-mono focus:ring-purple-500 focus:border-purple-500"
        ></textarea>
        <button @click="submitSolution" class="btn btn-primary btn-sm mt-2 float-right" :disabled="!userSolutionInput.trim() || isLoadingResponse">
          <PaperAirplaneIcon class="w-4 h-4 mr-1.5"/> Submit Solution
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.coding-interviewer-view {
  background-color: var(--bg-agent-view-dark, theme('colors.slate.800'));
  color: var(--text-primary-dark, theme('colors.slate.100'));
}
.agent-header-controls {
 border-bottom-color: hsla(var(--accent-hue-purple, 260), 60%, 50%, 0.3); /* Purple-ish accent */
 background-color: var(--bg-header-dark, theme('colors.slate.950'));
}
.loading-overlay-interviewer {
  position: absolute; inset: 0; background-color: rgba(var(--bg-base-rgb-dark, 26, 32, 44), 0.7);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 10; color: theme('colors.purple.200');
}
.spinner-interviewer {
  width: 36px; height: 36px; border: 4px solid hsla(var(--accent-hue-purple, 260), 50%, 50%, 0.2); /* purple */
  border-top-color: hsl(var(--accent-hue-purple, 260), 50%, 60%);
  border-radius: 50%; animation: spin_interview_agent 1s linear infinite;
}
@keyframes spin_interview_agent { to { transform: rotate(360deg); } }

.btn.btn-xs {
  @apply py-1 px-2 text-xs;
}

.custom-scrollbar-futuristic {
  &::-webkit-scrollbar { @apply w-1.5 h-1.5; }
  &::-webkit-scrollbar-track { background-color: hsla(var(--neutral-hue), 20%, 20%, 0.3); @apply rounded-full; }
  &::-webkit-scrollbar-thumb { background-color: hsla(var(--accent-hue-purple, 260), 75%, 60%, 0.6); @apply rounded-full; border: 1px solid hsla(var(--neutral-hue), 20%, 15%, 0.5); }
  &::-webkit-scrollbar-thumb:hover { background-color: hsla(var(--accent-hue-purple, 260), 75%, 70%, 0.8); }
  scrollbar-width: thin;
  scrollbar-color: hsla(var(--accent-hue-purple, 260), 75%, 60%, 0.6) hsla(var(--neutral-hue), 20%, 20%, 0.3);
}

/* Removing previously empty CSS rules and @apply for .btn.btn-xs as it's handled by Tailwind now */
</style>