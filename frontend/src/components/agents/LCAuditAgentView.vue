// File: frontend/src/components/agents/LCAuditAgentView.vue
/**
 * @file LCAuditAgentView.vue
 * @description Dedicated view component for the LC-Audit agent.
 * This component manages interaction for LeetCode problem analysis. It sends user input
 * (problem context) to the backend, receives a JSON response dictating slideshow updates,
 * and uses CompactMessageRenderer to display the slideshow content.
 * It supports autoplay and manual navigation of slides.
 * @version 2.0.0 - Reworked to handle JSON-based slideshow updates and removed Mermaid-specific logic.
 */
<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, onUnmounted, nextTick, PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition, AgentId } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, type ChatMessagePayloadFE, type TextResponseDataFE, type ChatResponseDataFE } from '@/utils/api';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';
import { DocumentMagnifyingGlassIcon, PlayIcon as PlaySolidIcon, PauseIcon as PauseSolidIcon, ArrowPathIcon, InformationCircleIcon } from '@heroicons/vue/24/solid';
import { marked } from 'marked'; // For rendering fallback markdown if needed
import { promptAPI } from '@/utils/api';
/**
 * @typedef {'new_slideshow' | 'append_to_final_slide' | 'revise_slideshow' | 'no_update_needed' | 'clarification_needed'} UpdateStrategy
 * @description Defines the strategy for updating the slideshow content based on the LLM response.
 */
type UpdateStrategy = "new_slideshow" | "append_to_final_slide" | "revise_slideshow" | "no_update_needed" | "clarification_needed";

/**
 * @interface LlmAuditResponse
 * @description Defines the expected structure of the JSON response from the LC-Audit LLM.
 */
interface LlmAuditResponse {
  updateStrategy: UpdateStrategy;
  problemTitle?: string;
  content?: string; // Full Markdown slideshow content
  newContent?: string; // Markdown to append for 'append_to_final_slide'
  clarification_question?: string; // Question if 'clarification_needed'
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
const currentAgentSystemPrompt = ref<string>("");
const agentDisplayName = computed(() => props.agentConfig?.label || "LC-Audit");

const currentSlideshowFullMarkdown = ref<string>("");
const currentProblemTitleForDisplay = ref<string>("Problem Analysis");

const mainContentToDisplayFromStore = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));
const compactMessageRendererRef = ref<InstanceType<typeof CompactMessageRenderer> | null>(null);

const slideDurationsMs = ref<number[]>([]); // Durations for autoplay
const currentAppSlideIndex = ref(0); // Tracks the current slide index for LCAuditAgentView's logic
const totalAppSlidesCount = ref(0);  // Tracks total slides for LCAuditAgentView's logic
const autoplayTimerId = ref<ReturnType<typeof setTimeout> | null>(null);
const isAutoplayGloballyActive = ref(true);
const isCurrentSlidePlaying = ref(false); // True if autoplay is running for the current slide
const hasNewSlideshowContentLoaded = ref(false); // Flag to trigger navigation to first slide on new content

const contentDisplayAreaId = computed(() => `${props.agentId}-main-content-area-lcaudit`);

const fetchSystemPrompt = async () => {
  const key = props.agentConfig?.systemPromptKey;
  const agentLabel = agentDisplayName.value;
  console.log(`[${agentLabel}] fetchSystemPrompt with key: "${key}"`);
  if (key) {
    try {
      const response = await promptAPI.getPrompt(`${key}.md`);
      currentAgentSystemPrompt.value = response.data.content; // Use the markdown string from the response
      if (!currentAgentSystemPrompt.value.trim()) {
        console.warn(`[${agentLabel}] System prompt for key "${key}" loaded but is empty.`);
      }
    } catch (e: any) {
      console.error(`[${agentLabel}] Error loading prompt for key "${key}":`, e.response?.data || e.message);
      currentAgentSystemPrompt.value = `ERROR: [${agentLabel}] System prompt load failed for key "${key}".`;
      toast?.add({ type: 'error', title: 'Prompt Load Error', message: `Failed to load critical instructions for ${agentLabel}.` });
    }
  } else {
    console.warn(`[${agentLabel}] No systemPromptKey defined.`);
    currentAgentSystemPrompt.value = `ERROR: [${agentLabel}] System prompt key missing in agent configuration.`;
    toast?.add({ type: 'error', title: 'Agent Config Error', message: `Configuration error for ${agentLabel}.` });
  }
};

watch(() => props.agentConfig?.systemPromptKey, fetchSystemPrompt, { immediate: true });

const clearCurrentAutoplayTimer = () => {
  if (autoplayTimerId.value) {
    clearTimeout(autoplayTimerId.value);
    autoplayTimerId.value = null;
  }
  isCurrentSlidePlaying.value = false;
};

const determineSlideDurations = (numSlides: number): number[] => {
  if (numSlides <= 0) return [];
  const durations: number[] = [];
  // Example durations (can be refined or made dynamic)
  durations.push(numSlides > 0 ? 10000 : Infinity); // Slide 1
  durations.push(numSlides > 1 ? 15000 : Infinity); // Slide 2
  durations.push(numSlides > 2 ? 20000 : Infinity); // Slide 3
  for (let i = 3; i < numSlides - 1; i++) {
    durations.push(30000); // Intermediate slides
  }
  if (numSlides > 0) { // Ensure last slide has Infinity duration if not covered
    durations[numSlides - 1] = Infinity;
  }
  return durations.slice(0, numSlides);
};

const setupSlideshowState = (markdownSlideshowContent: string, problemTitle?: string) => {
  console.log(`[${agentDisplayName.value}] Setting up slideshow state. Title: ${problemTitle}`);
  currentSlideshowFullMarkdown.value = markdownSlideshowContent;
  currentProblemTitleForDisplay.value = problemTitle || currentProblemTitleForDisplay.value || "Problem Analysis";

  const slidesArray = markdownSlideshowContent.split('---SLIDE_BREAK---');
  totalAppSlidesCount.value = slidesArray.length;
  slideDurationsMs.value = determineSlideDurations(totalAppSlidesCount.value);

  // Update main content in store for CompactMessageRenderer to pick up
  // This now directly passes the Markdown string, CompactMessageRenderer handles slideshow logic
  chatStore.updateMainContent({
    agentId: props.agentId,
    type: 'compact-message-renderer-data',
    data: currentSlideshowFullMarkdown.value,
    title: currentProblemTitleForDisplay.value,
    timestamp: Date.now(),
  });
};

const scheduleNextSlide = () => {
  clearCurrentAutoplayTimer();
  if (!isAutoplayGloballyActive.value || currentAppSlideIndex.value >= totalAppSlidesCount.value - 1 || totalAppSlidesCount.value === 0) {
    isCurrentSlidePlaying.value = false;
    return;
  }

  const duration = slideDurationsMs.value[currentAppSlideIndex.value];
  if (duration !== undefined && duration !== Infinity) {
    isCurrentSlidePlaying.value = true;
    autoplayTimerId.value = setTimeout(() => {
      if (isAutoplayGloballyActive.value && isCurrentSlidePlaying.value) {
        compactMessageRendererRef.value?.next(); // This will trigger 'slide-changed'
      }
    }, duration);
  } else {
    isCurrentSlidePlaying.value = false; // Infinite duration for this slide
  }
};

const handleSlideChangedInRenderer = (payload: { newIndex: number; totalSlides: number; navigatedManually: boolean }) => {
  console.log(`[${agentDisplayName.value}] Slide changed in renderer. New index: ${payload.newIndex}, Manually: ${payload.navigatedManually}`);
  currentAppSlideIndex.value = payload.newIndex;
  // totalAppSlidesCount.value can be updated if renderer has a more definitive count, though setupSlideshowState should be the source of truth.
  // totalAppSlidesCount.value = payload.totalSlides;


  if (payload.navigatedManually) {
    isAutoplayGloballyActive.value = false; // User interaction pauses global autoplay
    clearCurrentAutoplayTimer();
  } else if (isAutoplayGloballyActive.value) {
    scheduleNextSlide(); // Autoplay moved to next slide, schedule the one after
  }
};

const toggleMasterAutoplay = () => {
  isAutoplayGloballyActive.value = !isAutoplayGloballyActive.value;
  console.log(`[${agentDisplayName.value}] Master autoplay toggled to: ${isAutoplayGloballyActive.value}`);
  if (isAutoplayGloballyActive.value) {
    if (currentAppSlideIndex.value >= totalAppSlidesCount.value - 1 && totalAppSlidesCount.value > 0) {
      currentAppSlideIndex.value = 0; // Restart from beginning if at end
      compactMessageRendererRef.value?.navigateToSlide(0);
      // scheduleNextSlide will be called by handleSlideChangedInRenderer
    } else {
      scheduleNextSlide(); // Start playing from current slide
    }
  } else {
    clearCurrentAutoplayTimer();
  }
};

const handleLlmAuditResponse = (llmResponseString: string) => {
  clearCurrentAutoplayTimer();
  const agentLabel = agentDisplayName.value;
  console.log(`[${agentLabel}] Received raw LLM response (first 500 chars):`, llmResponseString.substring(0, 500));

  let llmOutput: LlmAuditResponse;
  try {
    // The LLM is instructed to return ONLY the JSON string.
    llmOutput = JSON.parse(llmResponseString.trim());
    console.log(`[${agentLabel}] Successfully parsed LLM JSON. Strategy: ${llmOutput.updateStrategy}`);
  } catch (e: any) {
    console.error(`[${agentLabel}] CRITICAL: Failed to parse LLM response as JSON. Error:`, e.message);
    console.error(`[${agentLabel}] Raw LLM Response that failed:`, llmResponseString);
    toast?.add({ type: 'error', title: `${agentLabel} Response Error`, message: `Assistant response was not valid JSON. Cannot display slideshow. Raw content shown.`, duration: 10000 });
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown',
      data: `### ${agentLabel} - Invalid Response Format\nThe assistant's response was not in the expected JSON format. Displaying raw content:\n\n---\n\n${llmResponseString.replace(/</g, '&lt;').replace(/>/g, '&gt;')}`,
      title: 'Invalid Response Format', timestamp: Date.now()
    });
    isLoadingResponse.value = false;
    return;
  }

  const newProblemTitle = llmOutput.problemTitle || currentProblemTitleForDisplay.value || "Problem Analysis";
  let shouldStartAutoplay = false;

  switch (llmOutput.updateStrategy) {
    case "new_slideshow":
    case "revise_slideshow":
      if (!llmOutput.content || typeof llmOutput.content !== 'string') {
        console.error(`[${agentLabel}] 'content' field missing or invalid for strategy: ${llmOutput.updateStrategy}.`);
        toast?.add({ type: 'error', title: 'Slideshow Content Error', message: `Assistant response for "${llmOutput.updateStrategy}" was missing slideshow content.` });
        chatStore.updateMainContent({
          agentId: props.agentId, type: 'markdown',
          data: `### ${agentLabel} - Slideshow Content Error\nAssistant response was valid JSON, but the required slideshow content for strategy "${llmOutput.updateStrategy}" was missing or invalid.`,
          title: 'Slideshow Content Error', timestamp: Date.now()
        });
        break;
      }
      setupSlideshowState(llmOutput.content, newProblemTitle);
      currentAppSlideIndex.value = 0; // Always start new/revised slideshows from the beginning
      hasNewSlideshowContentLoaded.value = true;
      shouldStartAutoplay = true;
      console.log(`[${agentLabel}] Strategy: ${llmOutput.updateStrategy}. New/Revised slideshow content set (length: ${llmOutput.content.length}). Title: ${newProblemTitle}`);
      break;

    case "append_to_final_slide":
      if (currentSlideshowFullMarkdown.value && totalAppSlidesCount.value > 0 && llmOutput.newContent) {
        const updatedMarkdown = currentSlideshowFullMarkdown.value + (currentSlideshowFullMarkdown.value.endsWith('\n') ? '' : '\n') + llmOutput.newContent;
        setupSlideshowState(updatedMarkdown, newProblemTitle); // This updates currentSlideshowFullMarkdown
        currentAppSlideIndex.value = totalAppSlidesCount.value > 0 ? totalAppSlidesCount.value - 1 : 0; // Stay on (new) last slide
        hasNewSlideshowContentLoaded.value = true; // To trigger navigation
        isAutoplayGloballyActive.value = false; // Pause autoplay when appending
        isCurrentSlidePlaying.value = false;
        console.log(`[${agentLabel}] Strategy: append_to_final_slide. Content appended.`);
      } else {
        console.warn(`[${agentLabel}] Could not append: current slideshow empty or no new content. Reverting to new_slideshow.`);
        setupSlideshowState(llmOutput.newContent || `Error: Append content was missing. Original title: ${newProblemTitle}`, "Appended Note (Fallback)");
        currentAppSlideIndex.value = 0;
        hasNewSlideshowContentLoaded.value = true;
        shouldStartAutoplay = true;
      }
      break;

    case "no_update_needed":
      toast?.add({ type: 'info', title: `${agentLabel} Status`, message: 'No significant update to the analysis was needed based on the latest input.', duration: 4000 });
      // If autoplay was on and paused, and not on the last slide, potentially resume
      if (isAutoplayGloballyActive.value && !isCurrentSlidePlaying.value && currentAppSlideIndex.value < totalAppSlidesCount.value - 1) {
        scheduleNextSlide();
      }
      console.log(`[${agentLabel}] Strategy: no_update_needed.`);
      break;

    case "clarification_needed":
      const question = llmOutput.clarification_question || "The assistant requires more details to proceed.";
      toast?.add({ type: 'warning', title: `${agentLabel} Needs Clarification`, message: question, duration: 12000 });
      // Optionally, add a system message to a chat log if this agent had one
      // chatStore.addMessage({ role: 'system', agentId: props.agentId, content: `[${agentLabel}] Clarification needed: ${question}` });
      isAutoplayGloballyActive.value = false;
      isCurrentSlidePlaying.value = false;
      console.log(`[${agentLabel}] Strategy: clarification_needed. Question: ${question}`);
      break;

    default:
      console.error(`[${agentLabel}] Unknown updateStrategy: ${llmOutput.updateStrategy}`);
      toast?.add({type: 'error', title: 'Unknown Update Strategy', message: `Received an unrecognized update instruction: ${llmOutput.updateStrategy}`});
      chatStore.updateMainContent({
          agentId: props.agentId, type: 'markdown',
          data: `### ${agentLabel} - Internal Error\nAssistant provided an unknown update strategy: "${llmOutput.updateStrategy}".`,
          title: 'Internal Processing Error', timestamp: Date.now()
      });
  }

  nextTick().then(() => {
    if (hasNewSlideshowContentLoaded.value && compactMessageRendererRef.value) {
      compactMessageRendererRef.value.navigateToSlide(currentAppSlideIndex.value); // Navigate to current (possibly new 0 or last for append)
      hasNewSlideshowContentLoaded.value = false;
    }
    // Autoplay will be handled by handleSlideChangedInRenderer if navigation occurred,
    // or if shouldStartAutoplay is true for a brand new slideshow.
    if (shouldStartAutoplay && isAutoplayGloballyActive.value && totalAppSlidesCount.value > 0) {
      scheduleNextSlide();
    }
  });

  isLoadingResponse.value = false;
};

const processProblemContext = async (problemInput: string) => {
  const agentLabel = agentDisplayName.value;
  console.log(`[${agentLabel}] processProblemContext called with input (first 50): "${problemInput.substring(0,50)}"`);

  if (!problemInput.trim()) {
    toast?.add({ type: 'warning', title: 'Input Required', message: `Please provide problem context for ${agentLabel}.` });
    return;
  }
  if (isLoadingResponse.value) {
    toast?.add({ type: 'info', title: 'Processing Busy', message: `${agentLabel} is already analyzing.` });
    return;
  }

  const systemPrompt = currentAgentSystemPrompt.value;
  if (typeof systemPrompt !== 'string' || !systemPrompt.trim() || systemPrompt.startsWith("ERROR:")) {
    const errorMsg = systemPrompt.startsWith("ERROR:") ? systemPrompt : 'Core system prompt is not available or invalid.';
    console.error(`[${agentLabel}] CRITICAL: System prompt error. ${errorMsg}`);
    toast?.add({ type: 'error', title: `${agentLabel} System Error`, message: `Cannot proceed: ${errorMsg.replace("ERROR: ", "")}`, duration: 10000 });
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown',
      data: `### ${agentLabel} System Error\n${errorMsg.replace("ERROR: ", "")}`,
      title: `${agentLabel} Initialization Failed`, timestamp: Date.now()
    });
    return;
  }

  isAutoplayGloballyActive.value = true; // Default to autoplay on new problem, can be toggled
  clearCurrentAutoplayTimer();
  isLoadingResponse.value = true;

  chatStore.updateMainContent({
    agentId: props.agentId, type: 'loading',
    data: `<div class="lc-audit-spinner-container mx-auto my-8"><div class="lc-audit-spinner"></div></div><p class="text-center text-base text-slate-300">Preparing in-depth analysis for: "${problemInput.substring(0, 30)}..."</p>`,
    title: `${agentLabel}: Analyzing "${problemInput.substring(0, 20)}..."`, timestamp: Date.now()
  });

  try {
    // Prepare AGENT_CONTEXT_JSON for the prompt
    const currentSlideContentSummary = currentSlideshowFullMarkdown.value
        ? (currentSlideshowFullMarkdown.value.split('---SLIDE_BREAK---')[currentAppSlideIndex.value] || "").substring(0,300) + "..."
        : null;

    const agentContextForLLM = {
      current_problem_title: (currentProblemTitleForDisplay.value === "Problem Analysis" || currentProblemTitleForDisplay.value === `${agentLabel} Ready` || currentProblemTitleForDisplay.value.includes("Awaiting Problem")) ? null : currentProblemTitleForDisplay.value,
      current_slideshow_content_summary: currentSlideshowFullMarkdown.value ? currentSlideContentSummary : null,
      current_slide_index: totalAppSlidesCount.value > 0 ? currentAppSlideIndex.value : null,
      total_slides_in_current_show: totalAppSlidesCount.value,
      is_on_final_slide: totalAppSlidesCount.value > 0 && currentAppSlideIndex.value === totalAppSlidesCount.value - 1,
    };

    let finalSystemPrompt = systemPrompt
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings?.preferredCodingLanguage || 'Python')
      .replace(/{{USER_QUERY}}/g, problemInput) // Candidate's latest utterance
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentContextForLLM))
      .replace(/{{CONVERSATION_HISTORY}}/g, JSON.stringify(
        chatStore.getMessagesForAgent(props.agentId)
          .filter(m => m.role === 'user' && m.content) // Only user messages with content
          .slice(-5) // Last 5 user messages
          .map(m => m.content!.substring(0, 200)) // Summary of user messages
      ));

    const payload: ChatMessagePayloadFE = {
      messages: [{ role: 'user', content: problemInput }],
      mode: props.agentConfig.id,
      systemPromptOverride: finalSystemPrompt,
      userId: `lc_audit_session_${props.agentId}`,
      conversationId: chatStore.getCurrentConversationId(props.agentId) || `lcaudit-conv-${Date.now()}`,
      stream: false, // LC-Audit expects a single JSON object
    };

    console.log(`[${agentLabel}] Sending payload to chatAPI (first 100 chars of system prompt): ${finalSystemPrompt.substring(0,100)}...`);
    const response = await chatAPI.sendMessage(payload);
    
    // The backend's response.data.content should be the JSON string from the LLM
    if (response.data && typeof (response.data as TextResponseDataFE).content === 'string') {
      handleLlmAuditResponse((response.data as TextResponseDataFE).content!);
    } else {
      console.error(`[${agentLabel}] LLM response from API did not have a 'content' string. Response data:`, response.data);
      throw new Error(`${agentLabel} API response format error: 'content' string missing.`);
    }

  } catch (error: any) {
    console.error(`[${agentLabel}] API error in processProblemContext:`, error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || error.message || `${agentLabel} encountered an error processing the request.`;
    toast?.add({ type: 'error', title: `${agentLabel} Error`, message: errorMessage, duration: 10000 });
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'error', // Use 'error' type
      data: `### ${agentLabel} Analysis Failed\n**Error:** *${String(errorMessage).replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
      title: 'Analysis Failed', timestamp: Date.now()
    });
  } finally {
    isLoadingResponse.value = false;
  }
};

defineExpose({ processProblemContext, pauseAutoplay: toggleMasterAutoplay, startOrResumeAutoplay: toggleMasterAutoplay });

const renderMarkdownForWelcomeOrError = (content: string | null): string => {
  if (content === null || content === undefined) return '<p class="text-slate-500 dark:text-slate-400 italic p-6">No content available.</p>';
  try {
    return marked.parse(content, { breaks: true, gfm: true });
  } catch (e) {
    console.error("Markdown rendering error:", e);
    return `<p class="text-red-500 dark:text-red-400 p-6">Content rendering error.</p>`;
  }
};

onMounted(() => {
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: agentDisplayName.value });
  
  const existingContent = mainContentToDisplayFromStore.value;

  if (existingContent && existingContent.type === 'compact-message-renderer-data' && typeof existingContent.data === 'string') {
    // Restore state from store if it's valid slideshow data
    console.log(`[${agentDisplayName.value}] Restoring slideshow from store.`);
    setupSlideshowState(existingContent.data, existingContent.title);
    // Could potentially store and restore currentAppSlideIndex as well
    currentAppSlideIndex.value = chatStore.getMessagesForAgent(props.agentId).reduce((acc, msg) => {
        // A more sophisticated way to find the last known slide index might be needed
        // For now, default to 0 if restoring.
        return msg.agentId === props.agentId ? (msg.relevanceScore || 0) : acc; // Placeholder
    },0) || 0;

    nextTick().then(() => {
      compactMessageRendererRef.value?.navigateToSlide(currentAppSlideIndex.value);
      if (isAutoplayGloballyActive.value && totalAppSlidesCount.value > 0 && currentAppSlideIndex.value < totalAppSlidesCount.value -1) {
        scheduleNextSlide();
      }
    });
  } else if (!isLoadingResponse.value && !currentSlideshowFullMarkdown.value) {
    // Show welcome message if no content and not loading
    console.log(`[${agentDisplayName.value}] Displaying welcome message.`);
    const welcomeMarkdown = `
<div class="lc-audit-welcome-container">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto lc-audit-icon-glow">
  <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
  <h2 class="lc-audit-welcome-title">${agentDisplayName.value}</h2>
  <p class="lc-audit-welcome-subtitle">${props.agentConfig?.description || 'Ready to analyze and explain coding problems.'}</p>
  <p class="lc-audit-welcome-prompt">${props.agentConfig?.inputPlaceholder || 'Provide a problem context to begin analysis.'}</p>
</div>`;
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'welcome', data: welcomeMarkdown, // 'welcome' type can be styled distinctly
      title: `${agentDisplayName.value} - Awaiting Problem`, timestamp: Date.now()
    });
    currentProblemTitleForDisplay.value = `${agentDisplayName.value} - Awaiting Problem`;
  }
});

onUnmounted(() => {
  clearCurrentAutoplayTimer();
});

</script>

<template>
  <div class="lc-audit-agent-view flex flex-col h-full w-full overflow-hidden bg-slate-800 text-slate-100">
    <div class="agent-header-controls lc-audit-header">
      <div class="flex items-center gap-3 flex-shrink min-w-0">
        <DocumentMagnifyingGlassIcon class="w-7 h-7 shrink-0 lc-audit-icon" />
        <span class="font-semibold text-xl lc-audit-title truncate" :title="agentDisplayName">{{ agentDisplayName }}</span>
        <span v-if="currentProblemTitleForDisplay && !currentProblemTitleForDisplay.includes('Awaiting Problem') && !currentProblemTitleForDisplay.includes('Problem Analysis') && !currentProblemTitleForDisplay.toLowerCase().includes('analyzing')" 
              class="text-sm text-slate-400 truncate ml-2 hidden md:inline" :title="currentProblemTitleForDisplay.replace(`${agentDisplayName}: `, '').replace('Analysis', '').trim()">
          | {{ currentProblemTitleForDisplay.replace(`${agentDisplayName}: `, '').replace('Analysis', '').trim() }}
        </span>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0" v-if="totalAppSlidesCount > 0 && currentSlideshowFullMarkdown">
        <button @click="toggleMasterAutoplay"
          class="btn btn-secondary btn-xs !text-xs"
          :disabled="totalAppSlidesCount === 0 || (currentAppSlideIndex >= totalAppSlidesCount - 1 && !isAutoplayGloballyActive)"
          :title="isAutoplayGloballyActive && isCurrentSlidePlaying ? 'Pause Autoplay' : (currentAppSlideIndex >= totalAppSlidesCount - 1 && totalAppSlidesCount > 0 ? 'Slideshow Ended' : 'Start/Resume Autoplay')">
          <PauseSolidIcon v-if="isAutoplayGloballyActive && isCurrentSlidePlaying" class="w-4 h-4"/>
          <PlaySolidIcon v-else class="w-4 h-4"/>
          <span class="ml-1.5">{{ isAutoplayGloballyActive && isCurrentSlidePlaying ? 'Pause' : (currentAppSlideIndex >= totalAppSlidesCount - 1 && totalAppSlidesCount > 0 ? 'Replay' : 'Play') }}</span>
        </button>
      </div>
    </div>
  
    <div :id="contentDisplayAreaId" class="flex-grow relative min-h-0 custom-scrollbar-futuristic lc-audit-scrollbar overflow-y-auto">
      <div v-if="isLoadingResponse && !currentSlideshowFullMarkdown && mainContentToDisplayFromStore?.type === 'loading'" 
           class="loading-overlay lc-audit-loading-overlay">
        <div class="lc-audit-spinner-container"><div class="lc-audit-spinner"></div></div>
        <p class="mt-3 text-sm lc-audit-loading-text">{{ agentDisplayName }} is Initializing Analysis...</p>
      </div>
      
      <template v-if="currentSlideshowFullMarkdown && mainContentToDisplayFromStore?.type === 'compact-message-renderer-data'">
        <CompactMessageRenderer
          ref="compactMessageRendererRef"
          :content="currentSlideshowFullMarkdown" 
          :mode="props.agentConfig?.id || 'lc-audit'" 
          :initial-slide-index="0" 
          :disable-internal-autoplay="true" 
          @slide-changed="handleSlideChangedInRenderer"
          class="p-0 md:p-1 h-full lc-audit-compact-renderer" 
        />
      </template>
      <template v-else-if="mainContentToDisplayFromStore?.data && (mainContentToDisplayFromStore.type === 'welcome' || mainContentToDisplayFromStore.type === 'error' || mainContentToDisplayFromStore.type === 'markdown')">
        <div 
          class="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none p-4 md:p-6 lg:p-8 h-full lc-audit-prose-content"
          v-html="renderMarkdownForWelcomeOrError(mainContentToDisplayFromStore.data as string)">
        </div>
      </template>
      <div v-else-if="!isLoadingResponse && !currentSlideshowFullMarkdown && !mainContentToDisplayFromStore?.data" 
           class="lc-audit-welcome-container text-slate-500 dark:text-slate-400 p-10 text-center italic">
           <InformationCircleIcon class="w-12 h-12 mx-auto mb-3 opacity-50"/>
        {{ agentDisplayName }} is ready. Please provide a problem context via voice or text input.
      </div>

      <div v-if="isLoadingResponse && currentSlideshowFullMarkdown" 
           class="loading-overlay lc-audit-loading-overlay is-processing-update">
        <div class="lc-audit-spinner-container"><div class="lc-audit-spinner"></div></div>
        <p class="mt-3 text-sm lc-audit-loading-text">{{ agentDisplayName }} is updating analysis...</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Using SCSS for better organization, though PostCSS features from original are fine */
.lc-audit-agent-view {
  --agent-lcaudit-accent-hue: 200;
  --agent-lcaudit-accent-saturation: 70%;
  --agent-lcaudit-accent-lightness: 55%;
  --agent-lcaudit-accent-color: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness));
  
  background-color: #1e293b; /* slate-800 */
  color: #f1f5f9; /* slate-100 */
  font-size: 1rem; // Adjusted base for better scaling with prose
}

.lc-audit-header {
  padding: 0.625rem 1rem; /* p-2.5 px-4 */
  border-bottom: 1px solid hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.35);
  background-color: #0f172a; /* slate-900/950 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem; /* gap-3 */
}

.lc-audit-icon {
  color: var(--agent-lcaudit-accent-color);
  width: 1.75rem; /* w-7 */
  height: 1.75rem; /* h-7 */
}

.lc-audit-title {
  color: #f8fafc; /* slate-50 */
  font-size: 1.25rem; /* text-xl */
  font-weight: 600; /* font-semibold */
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  background-color: rgba(18, 22, 30, 0.85);
  backdrop-filter: blur(4px);

  &.is-processing-update {
    background-color: rgba(18, 22, 30, 0.65);
    backdrop-filter: blur(3px);
  }
}

.lc-audit-spinner-container {
  position: relative;
  width: 3.5rem; /* w-14 */
  height: 3.5rem; /* h-14 */
}

.lc-audit-spinner {
  width: 100%;
  height: 100%;
  border: 4px solid hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.25);
  border-left-color: var(--agent-lcaudit-accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.lc-audit-loading-text {
  color: var(--agent-lcaudit-accent-color);
  font-weight: 500; /* font-medium */
  font-size: 1.125rem; /* text-lg, was sm */
  margin-top: 1rem; /* mt-4 */
}

.custom-scrollbar-futuristic {
  &::-webkit-scrollbar { width: 0.625rem; height: 0.625rem; } /* w-2.5 h-2.5 */
  &::-webkit-scrollbar-track { background-color: hsla(220, 20%, 12%, 0.5); border-radius: 0.5rem; } /* rounded-lg */
  &::-webkit-scrollbar-thumb {
    background-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.55);
    border-radius: 0.5rem; /* rounded-lg */
    border: 2px solid hsla(220, 20%, 12%, 0.5);
  }
  &::-webkit-scrollbar-thumb:hover { background-color: var(--agent-lcaudit-accent-color); }
  scrollbar-width: auto;
  scrollbar-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.55) hsla(220, 20%, 12%, 0.5);
}

.lc-audit-prose-content {
  /* Base prose styles are applied by Tailwind's prose plugin via CompactMessageRenderer or direct v-html */
  /* This is for overrides or additional styling if needed directly on the wrapper */
  :deep(h1), :deep(h2), :deep(h3), :deep(h4) { 
    color: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), calc(var(--agent-lcaudit-accent-lightness) + 20%));
    border-bottom-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.4);
    padding-bottom: 0.5rem; /* pb-2 */
    margin-bottom: 1.25rem; /* mb-5 */
    font-weight: 600; /* font-semibold */
  }
  :deep(p), :deep(li) { 
    margin-top: 0.875rem; /* my-3.5 */
    margin-bottom: 0.875rem;
    color: #cbd5e1; /* slate-300 */
    line-height: 1.7; 
  }
  :deep(a) {
    color: var(--agent-lcaudit-accent-color);
    &:hover { color: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), calc(var(--agent-lcaudit-accent-lightness) - 10%)); text-decoration: underline; }
  }
}

.lc-audit-welcome-container {
  text-align: center;
  padding: 1.5rem; /* p-6 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  @media (min-width: 768px) { padding: 2.5rem; /* md:p-10 */ }
}

.lc-audit-icon-glow {
  color: var(--agent-lcaudit-accent-color);
  filter: drop-shadow(0 0 20px hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.7));
  animation: subtlePulseWelcome 2.5s infinite ease-in-out alternate;
}

@keyframes subtlePulseWelcome {
  from { transform: scale(1); opacity: 0.85; }
  to { transform: scale(1.05); opacity: 1; }
}

.lc-audit-welcome-title {
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700; /* font-bold */
  margin-top: 1.25rem; /* mt-5 */
  margin-bottom: 0.75rem; /* mb-3 */
  letter-spacing: -0.025em; /* tracking-tight */
  color: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), calc(var(--agent-lcaudit-accent-lightness) + 20%));
  @media (min-width: 768px) { font-size: 2.25rem; /* md:text-4xl */ }
}

.lc-audit-welcome-subtitle {
  font-size: 1.125rem; /* text-lg */
  color: #cbd5e1; /* slate-300 */
  margin-bottom: 2rem; /* mb-8 */
  max-width: 42rem; /* max-w-xl */
  opacity: 0.95;
  @media (min-width: 768px) { font-size: 1.25rem; /* md:text-xl */ }
}

.lc-audit-welcome-prompt {
  font-size: 1rem; /* text-base */
  color: #94a3b8; /* slate-400 */
  font-style: italic;
  @media (min-width: 768px) { font-size: 1.125rem; /* md:text-lg */ }
}

/* Ensure CompactMessageRenderer takes full height if it's the direct child for slideshow */
.lc-audit-compact-renderer {
  height: 100%;
  width: 100%;
}

/* Button styles from original if needed, assuming global .btn styles exist */
.btn {
  /* Base button styles */
  &.btn-secondary {
    /* Secondary button specific styles */
    &.btn-xs {
      /* Extra small secondary button styles */
      border-color: var(--agent-lcaudit-accent-color-muted, hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.7));
      color: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation, 70%), calc(var(--agent-lcaudit-accent-lightness, 70%) + 15%));
      background-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation, 20%), calc(var(--agent-lcaudit-accent-lightness, 20%)), 0.2);
      &:hover {
        border-color: var(--agent-lcaudit-accent-color);
        background-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.2);
      }
      &:disabled {
        border-color: hsla(220, 10%, 40%, 0.5);
        color: hsla(220, 10%, 60%, 0.7);
        background-color: hsla(220, 10%, 30%, 0.3);
      }
    }
  }
}
</style>