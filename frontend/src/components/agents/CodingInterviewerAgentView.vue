<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type MainContent, type ChatMessage as StoreChatMessage } from '@/store/chat.store';
import type { IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
// ChatMessageFE is used for type consistency, not direct instantiation here often.
import { ChatMessagePayloadFE, chatAPI } from '@/utils/api'; 
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
const currentProblemStatement = ref<string | null>(null); // This might hold the markdown of the problem
const userSolutionInput = ref<string>(''); // User's code input

const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));

watch(interviewStage, (newStage) => {
  agentStore.updateAgentContext({ interviewStage: newStage });
});

const fetchSystemPrompt = async () => {
  if (props.agentConfig.systemPromptKey) {
    try {
      // The updated 'coding_interviewer.md' prompt will instruct the LLM to include inline comments.
      const module = await import(/* @vite-ignore */ `../../../../prompts/${props.agentConfig.systemPromptKey}.md?raw`);
      currentAgentSystemPrompt.value = module.default;
    } catch (e) {
      console.error(`[${props.agentConfig.label}Agent] Failed to load system prompt: ${props.agentConfig.systemPromptKey}.md`, e);
      currentAgentSystemPrompt.value = "You are a Coding Interviewer. Present problems with inline comments in code examples, evaluate solutions, and give feedback. Use Markdown headings or ---SLIDE_BREAK--- for main content formatting.";
    }
  } else {
    currentAgentSystemPrompt.value = "You are a Coding Interviewer. Present problems with inline comments in code examples, evaluate solutions, and give feedback. Use Markdown headings or ---SLIDE_BREAK--- for main content formatting.";
  }
};
watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

const startInterviewOrNextProblem = async () => {
  isLoadingResponse.value = true;
  interviewStage.value = 'problem_pending';
  // This content will be parsed by CompactMessageRenderer or marked, which should handle code highlighting.
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown',
    data: "## Getting Next Problem...\n\n<div class='flex justify-center p-8'><div class='spinner-interviewer'></div></div>",
    title: "Preparing Interview...", timestamp: Date.now()
  });

  const promptForProblem = "Please provide the next coding problem statement, including constraints and expected input/output formats. Present it clearly for the candidate. Ensure any example code has inline comments. Use Markdown headings or ---SLIDE_BREAK--- delimiters for presentation.";
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
  // The user's solution is sent as text. When the LLM provides feedback,
  // it might include this code (or parts of it) in a Markdown code block for display.
  const solutionText = `Here is my solution:\n\`\`\`<span class="math-inline">\{voiceSettingsManager\.settings\.preferredCodingLanguage \|\| 'python'\}\\n</span>{userSolutionInput.value}\n\`\`\``;
  chatStore.addMessage({
    role: 'user', content: solutionText,
    timestamp: Date.now(), agentId: props.agentId,
  });
  interviewStage.value = 'evaluating_solution';
  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown',
    // The LLM's evaluation will be displayed here, potentially including highlighted code with comments.
    data: `## Evaluating Your Solution...\n\n${solutionText}\n\n<div class='flex justify-center p-8'><div class='spinner-interviewer'></div></div>`,
    title: "Evaluating...", timestamp: Date.now()
  });
  userSolutionInput.value = ''; // Clear input after submission
  await callInterviewerLLM(solutionText); // Send user's solution text for evaluation
};

const handleNewUserInput = async (text: string) => { // Handles general chat during interview (e.g. clarifications)
  if (!text.trim() || isLoadingResponse.value) return;
  chatStore.addMessage({
    role: 'user', content: text,
    timestamp: Date.now(), agentId: props.agentId,
  });
  await callInterviewerLLM(text);
};

async function callInterviewerLLM(userInput: string) {
  isLoadingResponse.value = true;
  // The LLM, using the updated prompt, will generate Markdown.
  // Code blocks (```language ... ```) within this Markdown will be
  // processed by CompactMessageRenderer or marked+highlight.js.
  // Inline comments within those code blocks will be styled by highlight.js.

  try {
    const preferredLang = voiceSettingsManager.settings.preferredCodingLanguage;
    let finalSystemPrompt = currentAgentSystemPrompt.value
      .replace(/{{LANGUAGE}}/g, preferredLang)
      .replace(/{{USER_QUERY}}/g, userInput)
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify({ ...agentStore.currentAgentContext, currentProblem: currentProblemStatement.value || "Not yet presented." }))
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, `Current stage: ${interviewStage.value}. If presenting problem or feedback, use slide-format. Ensure any code includes inline comments.`);

    let maxHistoryMessages = 20; // Default for interviewer
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
      interviewMode: true, // Make sure backend knows this is an interview context
    };
    
    const response = await chatAPI.sendMessage(payload);
    const responseData = response.data; // Type is ChatResponseDataFE (TextResponseDataFE | FunctionCallResponseDataFE)
    let assistantMessageContent: string | null = null;

    if (responseData.type === 'function_call_data') {
        // Interviewer agent doesn't typically make function calls based on current prompt,
        // but handle defensively.
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

    // Update main content area with LLM's response (problem statement, feedback, etc.)
    // This content, if Markdown with code blocks, will be rendered with highlighting.
    if (interviewStage.value === 'problem_pending' && assistantMessageContent) {
      currentProblemStatement.value = assistantMessageContent; // Store the problem statement
      chatStore.updateMainContent({
        agentId: props.agentId, 
        type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown', 
        data: assistantMessageContent,
        title: `Coding Problem`, 
        timestamp: Date.now()
      });
      interviewStage.value = 'problem_presented';
    } else if (interviewStage.value === 'evaluating_solution' && assistantMessageContent) {
      chatStore.updateMainContent({
        agentId: props.agentId, 
        type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown', 
        data: assistantMessageContent, // This is the feedback, potentially with commented code
        title: `Feedback on Your Solution`, 
        timestamp: Date.now()
      });
      interviewStage.value = 'feedback_displayed';
    } else if (assistantMessageContent) {
        // Handle general clarifications or other text responses from the interviewer
         chatStore.updateMainContent({
            agentId: props.agentId, 
            type: props.agentConfig.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown', 
            data: assistantMessageContent,
            title: mainContentToDisplay.value?.title || `Interviewer Response`, // Retain or update title
            timestamp: Date.now()
        });
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
    const welcome = `Welcome to the ${props.agentConfig.label}!\n${props.agentConfig.description}\n\nPress "Start Interview" when you are ready.`;
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
      
      <template v-if="mainContentToDisplay && (!isLoadingResponse || chatStore.isMainContentStreaming)">
        <CompactMessageRenderer
          v-if="props.agentConfig.capabilities?.usesCompactRenderer && 
                (mainContentToDisplay.type === 'compact-message-renderer-data' || 
                 mainContentToDisplay.type === 'markdown' ||
                 mainContentToDisplay.type === 'loading')"
          :content="chatStore.isMainContentStreaming ? chatStore.streamingMainContentText : mainContentToDisplay.data as string"
          :mode="props.agentConfig.id"
          class="p-1 h-full"
        />
        <div v-else-if="mainContentToDisplay.type === 'markdown' || mainContentToDisplay.type === 'loading' || mainContentToDisplay.type === 'welcome'"
             class="prose dark:prose-invert max-w-none p-4 md:p-6 h-full"
             :class="{'flex flex-col items-center justify-center text-center': mainContentToDisplay.type === 'welcome' && !mainContentToDisplay.data?.includes('###')}"
             v-html="chatStore.isMainContentStreaming ? chatStore.streamingMainContentText + '▋' : mainContentToDisplay.data">
             </div>
        <div v-else class="p-4 text-slate-400 italic h-full flex items-center justify-center">
          Waiting for interviewer... (Content Type: {{ mainContentToDisplay.type }})
        </div>
      </template>
      <div v-else-if="!isLoadingResponse && interviewStage !== 'initial' && !mainContentToDisplay" class="p-4 text-slate-400 italic h-full flex items-center justify-center">
        Waiting for next step...
      </div>

      <div v-if="interviewStage === 'problem_presented' || interviewStage === 'awaiting_solution'" class="p-4 border-t border-slate-700 solution-input-area">
        <h3 class="text-sm font-semibold mb-2 text-slate-300">Your Solution (in {{ voiceSettingsManager.settings.preferredCodingLanguage || 'selected language' }}):</h3>
        <textarea
          v-model="userSolutionInput"
          placeholder="Type or paste your code solution here..."
          class="w-full h-48 p-2.5 bg-slate-900 border border-slate-700 rounded-md text-sm font-mono focus:ring-purple-500 focus:border-purple-500 custom-scrollbar-futuristic resize-y"
          aria-label="Code solution input"
        ></textarea>
        <button @click="submitSolution" class="btn btn-primary btn-sm mt-2 float-right" :disabled="!userSolutionInput.trim() || isLoadingResponse">
          <PaperAirplaneIcon class="w-4 h-4 mr-1.5"/> Submit Solution
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
/* ... (Styles from previous response, ensure they are included) ... */
/* Define a local CSS variable for the agent's specific accent hue */
:root { /* Or :host, or on .coding-interviewer-view for stricter scoping */
  --agent-interviewer-accent-hue: var(--accent-hue-purple, 260); /* Fallback to 260 (purple) */
  --agent-interviewer-accent-saturation: 60%;
  --agent-interviewer-accent-lightness: 50%;
}

.coding-interviewer-view {
  background-color: var(--bg-agent-view-dark, theme('colors.slate.800'));
  color: var(--text-primary-dark, theme('colors.slate.100'));
}

.agent-header-controls {
  border-bottom-color: hsla(var(--agent-interviewer-accent-hue), var(--agent-interviewer-accent-saturation), var(--agent-interviewer-accent-lightness), 0.3);
  background-color: var(--bg-header-dark, theme('colors.slate.950'));
}

.loading-overlay-interviewer {
  @apply absolute inset-0 flex flex-col items-center justify-content-center z-10;
  background-color: rgba(var(--bg-base-rgb-dark, 26, 32, 44), 0.7); 
  backdrop-filter: blur(3px); 
  color: hsl(var(--agent-interviewer-accent-hue), var(--agent-interviewer-accent-saturation), calc(var(--agent-interviewer-accent-lightness) + 20%)); 
}

.spinner-interviewer {
  @apply w-9 h-9 border-4 rounded-full animate-spin; 
  border-color: hsla(var(--agent-interviewer-accent-hue), var(--agent-interviewer-accent-saturation), var(--agent-interviewer-accent-lightness), 0.2); 
  border-top-color: hsl(var(--agent-interviewer-accent-hue), var(--agent-interviewer-accent-saturation), calc(var(--agent-interviewer-accent-lightness) + 10%)); 
}

.solution-input-area textarea { 
  @apply w-full p-2.5 bg-slate-900 border rounded-md text-sm font-mono resize-y; /* Added resize-y */
  border-color: var(--color-border-secondary-dark, theme('colors.slate.700')); /* Themed border */
  color: var(--text-primary-dark, theme('colors.slate.100'));

  &:focus {
    border-color: hsl(var(--agent-interviewer-accent-hue), var(--agent-interviewer-accent-saturation), calc(var(--agent-interviewer-accent-lightness) + 10%));
    box-shadow: 0 0 0 2px hsla(var(--agent-interviewer-accent-hue), var(--agent-interviewer-accent-saturation), calc(var(--agent-interviewer-accent-lightness) + 10%), 0.4);
    outline: none; /* Ensure default outline is removed if custom shadow is used */
  }
}

.btn.btn-xs { 
  @apply py-1 px-2.5 text-xs; 
}
/* Ensure .btn, .btn-primary, .btn-sm are globally defined or via Tailwind config */

.custom-scrollbar-futuristic {
  &::-webkit-scrollbar { @apply w-1.5 h-1.5; }
  &::-webkit-scrollbar-track { background-color: hsla(var(--neutral-hue, 220), 20%, 20%, 0.3); @apply rounded-full; }
  &::-webkit-scrollbar-thumb { background-color: hsla(var(--agent-interviewer-accent-hue), calc(var(--agent-interviewer-accent-saturation) + 15%), calc(var(--agent-interviewer-accent-lightness) + 10%), 0.6); @apply rounded-full; border: 1px solid hsla(var(--neutral-hue, 220), 20%, 15%, 0.5); }
  &::-webkit-scrollbar-thumb:hover { background-color: hsla(var(--agent-interviewer-accent-hue), calc(var(--agent-interviewer-accent-saturation) + 15%), calc(var(--agent-interviewer-accent-lightness) + 10%), 0.8); }
  scrollbar-width: thin;
  scrollbar-color: hsla(var(--agent-interviewer-accent-hue), calc(var(--agent-interviewer-accent-saturation) + 15%), calc(var(--agent-interviewer-accent-lightness) + 10%), 0.6) hsla(var(--neutral-hue, 220), 20%, 20%, 0.3);
}

:deep(.prose) {
  h1, h2, h3 { @apply text-[var(--text-primary-dark)] border-b border-[var(--border-color-dark)] pb-1 mb-3; }
  p, li { @apply text-[var(--text-secondary-dark)] my-2; }
  a {
    @apply hover:text-[color:hsl(var(--agent-interviewer-accent-hue),var(--agent-interviewer-accent-saturation),calc(var(--agent-interviewer-accent-lightness)-5%))];
    color: hsl(var(--agent-interviewer-accent-hue), var(--agent-interviewer-accent-saturation), var(--agent-interviewer-accent-lightness));
  }
  strong { @apply text-[var(--text-primary-dark)]; }
  code:not(pre code) { @apply bg-slate-700 text-emerald-400 px-1.5 py-0.5 rounded-md text-xs; }
  pre { @apply bg-slate-900/70 border border-slate-700 text-sm my-3 p-3 custom-scrollbar-futuristic; } /* Added scrollbar to pre if it overflows */
}
</style>