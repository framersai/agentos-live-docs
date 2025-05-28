<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, onUnmounted, nextTick, PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type MainContent } from '@/store/chat.store'; // MainContent is used
import type { IAgentDefinition, AgentId } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, type ChatMessagePayloadFE, type TextResponseDataFE } from '@/utils/api';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';
import { DocumentMagnifyingGlassIcon, PlayIcon as PlaySolidIcon, PauseIcon as PauseSolidIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';
import { marked } from 'marked'; // Used by renderMarkdownView
import { promptAPI } from "../../utils/api"

declare var mermaid: any; // Assume mermaid is globally available

type UpdateStrategy = "new_slideshow" | "append_to_final_slide" | "revise_slideshow" | "no_update_needed" | "clarification_needed";
interface LlmAuditResponse {
  updateStrategy: UpdateStrategy;
  problemTitle?: string;
  content?: string;
  newContent?: string;
  clarification_question?: string;
}

const props = defineProps({
  agentId: { type: String as PropType<AgentId>, required: true },
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
const agentDisplayName = computed(() => props.agentConfig.label || "LC-Audit");

const currentSlideshowFullMarkdown = ref<string>("");
const currentProblemTitleForDisplay = ref<string>("Problem Analysis");

const mainContentToDisplayFromStore = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));

const compactMessageRendererRef = ref<InstanceType<typeof CompactMessageRenderer> | null>(null);
const slideDurationsMs = ref<number[]>([]);
const currentAppSlideIndex = ref(0);
const totalAppSlidesCount = ref(0);
const autoplayTimerId = ref<ReturnType<typeof setTimeout> | null>(null);
const isAutoplayGloballyActive = ref(true); // Corrected variable name
const isCurrentSlidePlaying = ref(false);
const hasNewSlideshowContentLoaded = ref(false); // Renamed for clarity

const contentDisplayAreaId = computed(() => `${props.agentId}-main-content-area-lcaudit`);

const fetchSystemPrompt = async () => {
  if (props.agentConfig.systemPromptKey) {
  try {
    currentAgentSystemPrompt.value = (await promptAPI.getPrompt(`${props.agentConfig.systemPromptKey}.md`)).data.content
    
    // currentAgentSystemPrompt.value = promptText;
  } catch (e) {
    console.error(`[${agentDisplayName.value}] Error loading prompt:`, e);
    currentAgentSystemPrompt.value = "ERROR: LC-Audit system prompt could not be loaded.";
    toast?.add({ type: 'error', title: 'Critical Error', message: 'LC-Audit system prompt missing.' });
  }
}

};
watch(() => props.agentConfig.systemPromptKey, fetchSystemPrompt, { immediate: true });

const clearCurrentAutoplayTimer = () => {
  if (autoplayTimerId.value) {
    clearTimeout(autoplayTimerId.value);
    autoplayTimerId.value = null;
  }
  isCurrentSlidePlaying.value = false;
};

const determineSlideDurations = (numSlides: number): number[] => {
  const durations: number[] = [];
  if (numSlides <= 0) return [];
  if (numSlides > 0) durations.push(10000); 
  if (numSlides > 1) durations.push(15000); 
  if (numSlides > 2) durations.push(20000); 
  if (numSlides > 3) durations.push(60000); 

  const optimalSlidesStartIdx = 4;
  const finalAnalysisSlideActualIdx = numSlides - 1;
  for (let i = optimalSlidesStartIdx; i < finalAnalysisSlideActualIdx; i++) {
    durations.push(90000); 
  }
  while(durations.length < numSlides -1) {
    durations.push(90000);
  }
  if (numSlides > 0) { // Ensure last slide always has a duration, even if it's the only one
    durations[finalAnalysisSlideActualIdx] = Infinity;
  }
  return durations.slice(0, numSlides);
};

// Corrected function name from setupSlidesAndDurations to setupSlideDurationsAndParse
const setupSlideDurationsAndParse = (markdownContent: string, problemTitle?: string) => {
  currentSlideshowFullMarkdown.value = markdownContent;
  currentProblemTitleForDisplay.value = problemTitle || "Problem Analysis";
  const slidesArray = markdownContent.split('---SLIDE_BREAK---');
  totalAppSlidesCount.value = slidesArray.length;
  slideDurationsMs.value = determineSlideDurations(totalAppSlidesCount.value);
  
  chatStore.updateMainContent({
    agentId: props.agentId,
    type: 'compact-message-renderer-data',
    data: currentSlideshowFullMarkdown.value, // Pass the full markdown
    title: currentProblemTitleForDisplay.value,
    timestamp: Date.now(),
  });
};

const scheduleNextSlide = () => {
  clearCurrentAutoplayTimer();
  if (!isAutoplayGloballyActive.value || currentAppSlideIndex.value >= totalAppSlidesCount.value - 1) {
    isCurrentSlidePlaying.value = false;
    return;
  }
  const duration = slideDurationsMs.value[currentAppSlideIndex.value];
  if (duration && duration !== Infinity) {
    isCurrentSlidePlaying.value = true;
    autoplayTimerId.value = setTimeout(() => {
      if (isAutoplayGloballyActive.value && isCurrentSlidePlaying.value) {
        compactMessageRendererRef.value?.next();
      }
    }, duration);
  } else {
    isCurrentSlidePlaying.value = false;
  }
};

const handleSlideChangedInRenderer = (payload: { newIndex: number; totalSlides: number; navigatedManually: boolean }) => {
  currentAppSlideIndex.value = payload.newIndex;
  if (payload.navigatedManually) {
    isAutoplayGloballyActive.value = false; // Paused by manual navigation
    clearCurrentAutoplayTimer();
  } else if (isAutoplayGloballyActive.value) {
    scheduleNextSlide(); // It was an auto-advance, schedule the next one
  }
};

const toggleMasterAutoplay = () => {
  isAutoplayGloballyActive.value = !isAutoplayGloballyActive.value;
  if (isAutoplayGloballyActive.value) {
    isCurrentSlidePlaying.value = true;
    scheduleNextSlide();
  } else {
    clearCurrentAutoplayTimer(); // This also sets isCurrentSlidePlaying to false
  }
};

const handleLlmAuditResponse = (llmResponseString: string) => { // Renamed parameter for clarity
  clearCurrentAutoplayTimer();
  isCurrentSlidePlaying.value = false;
  isLoadingResponse.value = true; 

  try {
    const llmOutput = JSON.parse(llmResponseString) as LlmAuditResponse;
    let newProblemTitle = llmOutput.problemTitle || currentProblemTitleForDisplay.value || "Problem Analysis";
    let newFullMarkdown = "";
    let shouldStartAutoplayOnNewContent = false;

    if (llmOutput.updateStrategy === "new_slideshow" || llmOutput.updateStrategy === "revise_slideshow") {
      if (!llmOutput.content) throw new Error("No content for slideshow.");
      newFullMarkdown = llmOutput.content;
      setupSlideDurationsAndParse(newFullMarkdown, newProblemTitle); // This updates store & sets currentSlideshowFullMarkdown.value
      currentAppSlideIndex.value = 0;
      hasNewSlideshowContentLoaded.value = true;
      shouldStartAutoplayOnNewContent = true;
    } else if (llmOutput.updateStrategy === "append_to_final_slide") {
      if (currentSlideshowFullMarkdown.value && totalAppSlidesCount.value > 0 && llmOutput.newContent) {
        currentAppSlideIndex.value = totalAppSlidesCount.value - 1; // Ensure on final slide
        const separator = currentSlideshowFullMarkdown.value.endsWith('\n\n') ? '' : '\n\n---\n\n';
        newFullMarkdown = currentSlideshowFullMarkdown.value + separator + llmOutput.newContent;
        currentSlideshowFullMarkdown.value = newFullMarkdown; // Update our ref
        chatStore.updateMainContent({
            agentId: props.agentId, type: 'compact-message-renderer-data',
            data: newFullMarkdown, title: newProblemTitle, timestamp: Date.now(),
        });
        // Autoplay remains paused for appended final slide
      } else {
        // Fallback: treat as new if append context is wrong
        newFullMarkdown = llmOutput.newContent || "Error: Append content missing.";
        setupSlideDurationsAndParse(newFullMarkdown, "Appended Note");
        currentAppSlideIndex.value = 0;
        hasNewSlideshowContentLoaded.value = true;
        shouldStartAutoplayOnNewContent = true;
      }
    } else if (llmOutput.updateStrategy === "no_update_needed") {
      // No content change needed
      if (isAutoplayGloballyActive.value && !isCurrentSlidePlaying.value && currentAppSlideIndex.value < totalAppSlidesCount.value -1) {
         scheduleNextSlide(); // Try to resume if paused on a non-terminal slide
      }
    } else if (llmOutput.updateStrategy === "clarification_needed") {
      toast?.add({type: 'info', title: 'LC-Audit Clarification Needed', message: llmOutput.clarification_question || "Details needed.", duration: 12000});
      chatStore.addMessage({
          role: 'system', agentId: props.agentId,
          content: `LC-Audit needs clarification: ${llmOutput.clarification_question}`
      });
    }

    nextTick().then(() => {
      if (hasNewSlideshowContentLoaded.value && compactMessageRendererRef.value) {
        compactMessageRendererRef.value.navigateToSlide(0);
        hasNewSlideshowContentLoaded.value = false; // Reset flag
      }
      if (shouldStartAutoplayOnNewContent && isAutoplayGloballyActive.value) {
        isCurrentSlidePlaying.value = true; // Set intent to play
        scheduleNextSlide();
      }
      renderAllMermaidDiagramsInView();
    });

  } catch (e) {
    console.error("[LC-Audit] Error processing LLM JSON output:", e, llmResponseString); // Corrected: use param
    toast?.add({type: 'error', title: 'LC-Audit Update Error', message: 'Could not process analysis update.'});
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown',
      data: `### LC-Audit System Error\n\nFailed to interpret the analysis. Details in console.\n\nRaw response (check browser console for full output if error persists):\n\`\`\`\n${llmResponseString.substring(0,300)}...\n\`\`\``, // Corrected: use param
      title: 'Analysis Processing Failed', timestamp: Date.now()
    });
  } finally {
    isLoadingResponse.value = false;
  }
};

const processProblemContext = async (problemInput: string) => {
  if (!problemInput.trim() || isLoadingResponse.value) {
    if(!problemInput.trim()) toast?.add({type: 'warning', title: 'Input Required', message: 'Please provide a problem description for LC-Audit.'});
    return;
  }
  
  isAutoplayGloballyActive.value = false; 
  clearCurrentAutoplayTimer();
  isLoadingResponse.value = true; 
  
  // Set a more specific loading message in the main content area
  chatStore.updateMainContent({ 
    agentId: props.agentId, type: 'markdown',
    data: `## LC-Audit: Preparing In-Depth Analysis...\n\n<div class="lc-audit-spinner-container mx-auto my-8"><div class="lc-audit-spinner"></div></div>\n\n<p class="text-center text-base text-slate-300">Processing the problem context. This detailed analysis can take a few moments.</p>`,
    title: `LC-Audit: Analyzing "${problemInput.substring(0, 20)}..."`, timestamp: Date.now()
  });

  try {
    // Use agentStore.getAgentContext instead of agentStore.currentAgentContext directly if it needs agentId
    const agentCtxFromStore = agentStore.getAgentContext(props.agentId) || {};
    const contextForLLM = {
        ...agentCtxFromStore,
        current_problem_title: currentProblemTitleForDisplay.value === "Problem Analysis" || currentProblemTitleForDisplay.value === `${agentDisplayName.value} Ready` || currentProblemTitleForDisplay.value === `${agentDisplayName.value} - Awaiting Problem` ? null : currentProblemTitleForDisplay.value,
        current_slideshow_content_summary: currentSlideshowFullMarkdown.value 
            ? (currentSlideshowFullMarkdown.value.split('---SLIDE_BREAK---')[currentAppSlideIndex.value] || "").substring(0, 250) + "..."
            : null,
        current_slide_index: currentAppSlideIndex.value,
        total_slides_in_current_show: totalAppSlidesCount.value,
        is_on_final_slide: totalAppSlidesCount.value > 0 && currentAppSlideIndex.value === totalAppSlidesCount.value - 1,
    };

    let finalSystemPrompt = currentAgentSystemPrompt.value
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings?.preferredCodingLanguage || 'Python')
      .replace(/{{USER_QUERY}}/g, problemInput) 
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(contextForLLM))
      .replace(/{{CONVERSATION_HISTORY}}/g, JSON.stringify(
          chatStore.getMessagesForAgent(props.agentId)
            .filter(m => m.role === 'user') 
            .slice(-3) 
            .map(m=> ({role:m.role, content:m.content?.substring(0,150)}))
      )); 

    const payload: ChatMessagePayloadFE = {
      messages: [{ role: 'user', content: problemInput }],
      mode: props.agentConfig.id, 
      systemPromptOverride: finalSystemPrompt,
      userId: `lc_audit_session_${props.agentId}`, 
      conversationId: chatStore.getCurrentConversationId(props.agentId) || `lcaudit-conv-${Date.now()}`,
      stream: false, 
    };

    const response = await chatAPI.sendMessage(payload);
    
    if (response.data && (response.data as TextResponseDataFE).content) {
      handleLlmAuditResponse((response.data as TextResponseDataFE).content!);
    } else {
      throw new Error("LC-Audit LLM did not return expected content structure (missing content field).");
    }

  } catch (error: any) {
    console.error(`[${agentDisplayName.value}] Critical API error in processProblemContext:`, error);
    const errorMessage = error.response?.data?.message || error.message || 'LC-Audit encountered a critical error processing the problem.';
    toast?.add({ type: 'error', title: `${agentDisplayName.value} Processing Error`, message: errorMessage, duration: 10000 });
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown',
      data: `### LC-Audit Analysis Failed\n\nAn error occurred while generating the analysis: \n\n*${String(errorMessage).replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
      title: 'Analysis Initialization Failed', timestamp: Date.now()
    });
  } finally {
    isLoadingResponse.value = false;
  } 
};

const renderAllMermaidDiagramsInView = async () => { /* ... (same as before) ... */ };
defineExpose({ processProblemContext, pauseAutoplay: toggleMasterAutoplay, startOrResumeAutoplay: toggleMasterAutoplay });

onMounted(() => {
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: agentDisplayName.value });
  // Use mainContentToDisplayFromStore.value for checks
  if (!mainContentToDisplayFromStore.value?.data) {
    const welcomeMarkdown = `
<div class="lc-audit-welcome-container">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto lc-audit-icon-glow">
    <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
  <h2 class="lc-audit-welcome-title">${agentDisplayName.value}</h2>
  <p class="lc-audit-welcome-subtitle">${props.agentConfig.description || 'Ready to analyze and explain coding problems.'}</p>
  <p class="lc-audit-welcome-prompt">${props.agentConfig.inputPlaceholder || 'Provide a problem context to begin analysis.'}</p>
  <button @click="() => processProblemContext('Example: Two Sum - Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.')" 
          class="btn btn-primary-ephemeral mt-4">Analyze Example: Two Sum</button>
</div>`;
    chatStore.updateMainContent({
        agentId: props.agentId, type: 'markdown', data: welcomeMarkdown,
        title: `${agentDisplayName.value} - Awaiting Problem`, timestamp: Date.now()
    });
  } else if (mainContentToDisplayFromStore.value.data && mainContentToDisplayFromStore.value.type === 'compact-message-renderer-data') {
    currentSlideshowFullMarkdown.value = mainContentToDisplayFromStore.value.data as string;
    // Use setupSlideDurationsAndParse instead of setupSlidesAndDurations
    setupSlideDurationsAndParse(currentSlideshowFullMarkdown.value, mainContentToDisplayFromStore.value.title);
    currentAppSlideIndex.value = 0; 
    nextTick().then(() => {
        compactMessageRendererRef.value?.navigateToSlide(currentAppSlideIndex.value);
        if (isAutoplayGloballyActive.value) { isCurrentSlidePlaying.value = true; scheduleNextSlide(); }
        renderAllMermaidDiagramsInView();
    });
  }
});

onUnmounted(() => { clearCurrentAutoplayTimer(); });

const renderMarkdownView = (content: string | null): string => {
    if (content === null) return '';
    try { return marked.parse(content, { breaks: true, gfm: true }); }
    catch (e) { return `<p class="text-red-500 dark:text-red-400">Content rendering error.</p>`; }
};

</script>

<template>
  <div class="lc-audit-agent-view flex flex-col h-full w-full overflow-hidden">
    <div class="agent-header-controls lc-audit-header">
      <div class="flex items-center gap-3">
        <DocumentMagnifyingGlassIcon class="w-7 h-7 shrink-0 lc-audit-icon" />
        <span class="font-semibold text-xl lc-audit-title">{{ agentDisplayName }}</span>
        <span v-if="currentProblemTitleForDisplay && currentProblemTitleForDisplay !== 'Problem Analysis' && currentProblemTitleForDisplay !== `${agentDisplayName} Ready` && currentProblemTitleForDisplay !== `${agentDisplayName} - Awaiting Problem` && !currentProblemTitleForDisplay.toLowerCase().includes('analyzing')" class="text-sm text-slate-400 truncate ml-2 hidden md:inline">
          | Analyzing: {{ currentProblemTitleForDisplay.replace('LC-Audit: ', '').replace('Analysis', '').trim() }}
        </span>
      </div>
      <div class="flex items-center gap-2" v-if="totalAppSlidesCount > 0 && mainContentToDisplayFromStore?.data">
        <button @click="toggleMasterAutoplay"
                class="btn btn-secondary btn-xs !text-xs"
                :disabled="currentAppSlideIndex >= totalAppSlidesCount - 1 && !isAutoplayGloballyActive && totalAppSlidesCount > 0"
                :title="isAutoplayGloballyActive && isCurrentSlidePlaying ? 'Pause Autoplay' : (currentAppSlideIndex >= totalAppSlidesCount - 1 && totalAppSlidesCount > 0 ? 'Slideshow Ended' : 'Start/Resume Autoplay')">
          <PauseSolidIcon v-if="isAutoplayGloballyActive && isCurrentSlidePlaying" class="w-4 h-4"/>
          <PlaySolidIcon v-else class="w-4 h-4"/>
          <span class="ml-1.5">{{ isAutoplayGloballyActive && isCurrentSlidePlaying ? 'Pause' : (currentAppSlideIndex >= totalAppSlidesCount - 1 && totalAppSlidesCount > 0 ? 'Replay' : 'Play') }}</span>
        </button>
         <button @click="() => { if(compactMessageRendererRef) processProblemContext('Placeholder to trigger re-analysis or specific command') }"
                class="btn btn-secondary btn-xs !text-xs" title="Re-analyze or new input (Dev)">
          <ArrowPathIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div :id="contentDisplayAreaId" class="flex-grow relative min-h-0 custom-scrollbar-futuristic lc-audit-scrollbar overflow-y-auto">
      <div v-if="isLoadingResponse && !(mainContentToDisplayFromStore?.data && currentSlideshowFullMarkdown)" class="loading-overlay lc-audit-loading-overlay">
         <div class="lc-audit-spinner-container"><div class="lc-audit-spinner"></div></div>
         <p class="mt-3 text-sm lc-audit-loading-text">LC-Audit is Initializing Analysis...</p>
      </div>
      
      <template v-if="mainContentToDisplayFromStore?.data && currentSlideshowFullMarkdown">
        <CompactMessageRenderer
          v-if="mainContentToDisplayFromStore.type === 'compact-message-renderer-data' || (mainContentToDisplayFromStore.type === 'markdown' && props.agentConfig.capabilities?.usesCompactRenderer)"
          ref="compactMessageRendererRef"
          :content="currentSlideshowFullMarkdown"  :mode="props.agentConfig.id" 
          :initial-slide-index="0"  :disable-internal-autoplay="true" 
          @slide-changed="handleSlideChangedInRenderer" 
          class="p-0 md:p-1 h-full lc-audit-compact-renderer" 
        />
         <div v-else-if="mainContentToDisplayFromStore.type === 'markdown' || mainContentToDisplayFromStore.type === 'welcome' || mainContentToDisplayFromStore.type === 'error'"
             class="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl dark:prose-invert max-w-none p-4 md:p-6 lg:p-8 xl:p-10 h-full lc-audit-prose-content"
             v-html="renderMarkdownView(mainContentToDisplayFromStore.data as string)">
        </div>
      </template>
      <div v-else-if="!isLoadingResponse" 
           class="lc-audit-welcome-container">
           <p class="text-slate-500 dark:text-slate-400 p-10 text-center italic">LC-Audit is ready. Please provide a problem context to begin analysis.</p>
      </div>
      <div v-if="isLoadingResponse && mainContentToDisplayFromStore?.data && currentSlideshowFullMarkdown" class="loading-overlay lc-audit-loading-overlay is-processing-update">
        <div class="lc-audit-spinner-container"><div class="lc-audit-spinner"></div></div>
        <p class="mt-3 text-sm lc-audit-loading-text">LC-Audit is updating analysis...</p>
      </div>
    </div>
  </div>
</template>
<style scoped lang="postcss">
/* All styles from previous LCAuditAgentView.vue response */
.lc-audit-agent-view {
  --agent-lcaudit-accent-hue: 200; /* A calm, analytical teal/blue */
  --agent-lcaudit-accent-saturation: 70%;
  --agent-lcaudit-accent-lightness: 55%;
  --agent-lcaudit-accent-color: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness));
  --agent-lcaudit-accent-color-muted: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.7);
  --agent-lcaudit-accent-color-darker: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), calc(var(--agent-lcaudit-accent-lightness) - 10%));
  
  font-size: 1.05rem; 
  @screen md { font-size: 1.1rem; }
  @screen lg { font-size: 1.15rem; }

  background-color: var(--bg-agent-view-dark, theme('colors.slate.900'));
  color: var(--text-primary-dark, theme('colors.slate.100'));
}
.lc-audit-header {
  @apply p-2.5 px-4 border-b flex items-center justify-between gap-3 text-base;
  border-bottom-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.35);
  background-color: var(--bg-header-dark, theme('colors.slate.950'));
}
.lc-audit-icon { color: var(--agent-lcaudit-accent-color); @apply w-7 h-7; }
.lc-audit-title { color: var(--text-primary-dark, theme('colors.slate.50')); @apply text-xl font-semibold; }

.loading-overlay.lc-audit-loading-overlay {
  @apply absolute inset-0 flex flex-col items-center justify-center z-20;
  background-color: rgba(18, 22, 30, 0.85); 
  backdrop-filter: blur(4px);
  &.is-processing-update {
    background-color: rgba(18, 22, 30, 0.65); 
    backdrop-filter: blur(3px);
  }
}
.lc-audit-spinner-container { @apply relative w-14 h-14; }
.lc-audit-spinner {
  @apply w-full h-full border-4 rounded-full animate-spin;
  border-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.25); 
  border-left-color: var(--agent-lcaudit-accent-color); 
}
.lc-audit-loading-text {
  color: var(--agent-lcaudit-accent-color); 
  @apply font-medium text-lg mt-4;
}

/* This class definition remains the same for direct use on elements like your div */
.lc-audit-scrollbar {
  &::-webkit-scrollbar { @apply w-2.5 h-2.5; } 
  &::-webkit-scrollbar-track { background-color: hsla(var(--neutral-hue, 220), 20%, 12%, 0.5); @apply rounded-lg; }
  &::-webkit-scrollbar-thumb {
    background-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.55);
    @apply rounded-lg;
    border: 2px solid hsla(var(--neutral-hue, 220), 20%, 12%, 0.5);
  }
  &::-webkit-scrollbar-thumb:hover { background-color: var(--agent-lcaudit-accent-color); }
  scrollbar-width: auto; 
  scrollbar-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.55) hsla(var(--neutral-hue, 220), 20%, 12%, 0.5);
}

.lc-audit-prose-content :deep(.prose), 
.lc-audit-compact-renderer :deep(.prose) {
  font-size: inherit; 
  
  h1, h2, h3, h4 { 
    color: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), calc(var(--agent-lcaudit-accent-lightness) + 20%)) !important;
    border-bottom-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.4) !important;
    @apply pb-2 mb-5 font-semibold;
  }
  h1 { @apply text-2xl md:text-3xl lg:text-4xl; } 
  h2 { @apply text-xl md:text-2xl lg:text-3xl; }
  h3 { @apply text-lg md:text-xl lg:text-2xl; }

  p, li { 
    @apply my-3.5 text-[var(--text-secondary-dark)] dark:text-slate-300;
    line-height: 1.8 !important; 
  }
  a {
    color: var(--agent-lcaudit-accent-color) !important;
    &:hover { color: var(--agent-lcaudit-accent-color-darker) !important; @apply underline; }
  }
  strong {
    color: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), calc(var(--agent-lcaudit-accent-lightness) + 15%)) !important;
  }
  code:not(pre code) {
    @apply px-2 py-1.5 rounded-lg text-[90%]; 
    background-color: hsla(var(--agent-lcaudit-accent-hue), 20%, 25%, 0.4) !important;
    color: hsl(var(--agent-lcaudit-accent-hue), 30%, 80%) !important;
    border: 1px solid hsla(var(--agent-lcaudit-accent-hue), 20%, 35%, 0.5) !important;
  }
  pre {
    /* MODIFIED: lc-audit-scrollbar removed from @apply */
    @apply border my-6 p-5 rounded-xl shadow-xl text-[95%] overflow-auto; 
    background-color: #0c1015 !important; 
    border-color: hsla(var(--agent-lcaudit-accent-hue), 30%, 30%, 0.4) !important;

    /* ADDED: Scrollbar styles directly applied to pre elements within this context */
    &::-webkit-scrollbar { @apply w-2.5 h-2.5; }
    &::-webkit-scrollbar-track { background-color: hsla(var(--neutral-hue, 220), 20%, 12%, 0.5); @apply rounded-lg; }
    &::-webkit-scrollbar-thumb {
      background-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.55);
      @apply rounded-lg;
      border: 2px solid hsla(var(--neutral-hue, 220), 20%, 12%, 0.5);
    }
    &::-webkit-scrollbar-thumb:hover { background-color: var(--agent-lcaudit-accent-color); }
    scrollbar-width: auto; /* For Firefox */
    scrollbar-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.55) hsla(var(--neutral-hue, 220), 20%, 12%, 0.5); /* For Firefox */
  }
  .mermaid { @apply my-6 p-2 bg-slate-800/30 rounded-lg overflow-auto; }
  .mermaid svg {
    @apply block max-w-full h-auto mx-auto;
  }
}

.lc-audit-welcome-container { @apply text-center p-6 md:p-10 flex flex-col items-center justify-center h-full; }
.lc-audit-icon-glow {
  color: var(--agent-lcaudit-accent-color);
  filter: drop-shadow(0 0 20px hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.7));
  animation: subtlePulseWelcome 2.5s infinite ease-in-out alternate; /* Unique name for welcome icon pulse */
}

@keyframes subtlePulseWelcome { /* Scoped keyframe for welcome icon */
  from { transform: scale(1); opacity: 0.85; }
  to { transform: scale(1.05); opacity: 1; }
}

.lc-audit-welcome-title {
  @apply text-3xl md:text-4xl font-bold mt-5 mb-3 tracking-tight;
  color: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), calc(var(--agent-lcaudit-accent-lightness) + 20%));
}
.lc-audit-welcome-subtitle { @apply text-lg md:text-xl text-[var(--text-secondary-dark)] mb-8 max-w-xl opacity-95; }
.lc-audit-welcome-prompt { @apply text-base md:text-lg text-[var(--text-muted-dark)] italic; }

.btn.btn-secondary.btn-xs {
  border-color: var(--agent-lcaudit-accent-color-muted);
  color: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation, 70%), calc(var(--agent-lcaudit-accent-lightness, 70%) + 15%));
  background-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation, 20%), var(--agent-lcaudit-accent-lightness, 20%), 0.2);
  &:hover {
    border-color: var(--agent-lcaudit-accent-color);
    background-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.2);
  }
}
</style>