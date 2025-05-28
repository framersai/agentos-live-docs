// File: frontend/src/components/agents/LCAuditAgentView.vue
/**
 * @file LCAuditAgentView.vue
 * @description Dedicated view component for the LC-Audit agent.
 * This component manages the interaction flow for LeetCode problem analysis,
 * including fetching system prompts, processing user input for problem context,
 * handling LLM responses (which are expected to be structured as slideshows),
 * and managing an autoplay feature for these slideshows.
 * It leverages the CompactMessageRenderer for displaying slideshow content.
 * @version 1.1.0 - Integrated robust error handling, improved logging for prompt loading and processing.
 */
<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, onUnmounted, nextTick, PropType } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition, AgentId } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, type ChatMessagePayloadFE, type TextResponseDataFE } from '@/utils/api';
import type { ToastService } from '@/services/services';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';
import { DocumentMagnifyingGlassIcon, PlayIcon as PlaySolidIcon, PauseIcon as PauseSolidIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';
import { marked } from 'marked';
import { promptAPI } from "../../utils/api"

// Ensure mermaid is declared if it's used globally and not imported
// If it's imported, use: import mermaid from 'mermaid';
declare var mermaid: any;

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
  /** The strategy for updating the content. */
  updateStrategy: UpdateStrategy;
  /** Optional new title for the problem analysis. */
  problemTitle?: string;
  /** Full Markdown content for a new or revised slideshow. Required if updateStrategy is 'new_slideshow' or 'revise_slideshow'. */
  content?: string;
  /** Additional Markdown content to append to the final slide. Required if updateStrategy is 'append_to_final_slide'. */
  newContent?: string;
  /** A question from the LLM if clarification is needed. Required if updateStrategy is 'clarification_needed'. */
  clarification_question?: string;
}

const props = defineProps({
  /** The unique identifier for this agent instance. */
  agentId: { type: String as PropType<AgentId>, required: true },
  /** The configuration object for this agent. */
  agentConfig: { type: Object as PropType<IAgentDefinition>, required: true }
});

const emit = defineEmits<{
  /**
   * Emitted for agent-specific events, like view mounting.
   * @param {string} e - The event name: 'agent-event'.
   * @param {object} event - The event payload.
   * @param {string} event.type - The type of event (e.g., 'view_mounted').
   * @param {string} event.agentId - The ID of the agent emitting the event.
   * @param {string} [event.label] - An optional label associated with the event.
   */
  (e: 'agent-event', event: { type: 'view_mounted', agentId: string, label?: string }): void;
}>();

const agentStore = useAgentStore();
const chatStore = useChatStore();
const toast = inject<ToastService>('toast');

/** Reactive state indicating if the agent is currently waiting for a response from the LLM. */
const isLoadingResponse = ref(false);
/** The system prompt string for the current agent, loaded dynamically. */
const currentAgentSystemPrompt = ref<string>(""); // Initialized to empty string
/** Computed display name for the agent, derived from its configuration. */
const agentDisplayName = computed(() => props.agentConfig?.label || "LC-Audit");

/** The full Markdown content of the current slideshow. */
const currentSlideshowFullMarkdown = ref<string>("");
/** The display title for the current problem being analyzed. */
const currentProblemTitleForDisplay = ref<string>("Problem Analysis");

/** Computed property to get the main content for this agent from the chat store. */
const mainContentToDisplayFromStore = computed<MainContent | null>(() => chatStore.getMainContentForAgent(props.agentId));

/** Reference to the CompactMessageRenderer component instance. */
const compactMessageRendererRef = ref<InstanceType<typeof CompactMessageRenderer> | null>(null);
/** Array of durations (in milliseconds) for each slide in the slideshow. */
const slideDurationsMs = ref<number[]>([]);
/** The current (0-indexed) slide being displayed. */
const currentAppSlideIndex = ref(0);
/** The total number of slides in the current slideshow. */
const totalAppSlidesCount = ref(0);
/** Timer ID for the autoplay functionality. */
const autoplayTimerId = ref<ReturnType<typeof setTimeout> | null>(null);
/** Global flag to control whether autoplay is active. */
const isAutoplayGloballyActive = ref(true);
/** Flag indicating if the current slide is in its "playing" (timed advance) state. */
const isCurrentSlidePlaying = ref(false);
/** Flag to indicate if new slideshow content has been loaded and requires navigation to the first slide. */
const hasNewSlideshowContentLoaded = ref(false);

/** Computed ID for the main content display area, ensuring uniqueness. */
const contentDisplayAreaId = computed(() => `${props.agentId}-main-content-area-lcaudit`);

/**
 * Fetches and sets the system prompt for the current agent based on its configuration.
 * Logs errors and sets a fallback prompt if fetching fails.
 * @async
 */
const fetchSystemPrompt = async () => {
  const key = props.agentConfig?.systemPromptKey;
  const agentLabel = agentDisplayName.value;

  console.log(`[${agentLabel}] fetchSystemPrompt called with systemPromptKey: "${key}"`);

  if (key) {
    try {
      const response = await promptAPI.getPrompt(`${key}.md`);
      console.log(`[${agentLabel}] Prompt API response for key "${key}.md":`, response);

      if (response && response.data && typeof response.data.content === 'string') {
        currentAgentSystemPrompt.value = response.data.content;
        if (!response.data.content.trim()) {
          console.warn(`[${agentLabel}] System prompt for key "${key}" loaded successfully but is empty or whitespace.`);
        }
      } else {
        console.error(`[${agentLabel}] Prompt API response for key "${key}" is not structured as expected or content is not a string. Response data:`, response?.data);
        currentAgentSystemPrompt.value = `ERROR: [${agentLabel}] System prompt for key "${key}" had an invalid structure or missing/invalid content.`;
        toast?.add({ type: 'error', title: 'Prompt Load Error', message: `Invalid prompt data structure for "${key}". ${agentLabel} may not function correctly.` });
      }
    } catch (e: any) {
      console.error(`[${agentLabel}] Critical error loading prompt for key "${key}":`, e.response?.data || e.message || e);
      currentAgentSystemPrompt.value = `ERROR: [${agentLabel}] System prompt for key "${key}" could not be loaded. Details: ${e.message || 'Unknown server error'}`;
      toast?.add({ type: 'error', title: 'Critical Prompt Error', message: `Failed to load system prompt for "${key}". ${agentLabel} may not function correctly.` });
    }
  } else {
    console.warn(`[${agentLabel}] fetchSystemPrompt called, but props.agentConfig.systemPromptKey is falsy (undefined, null, or empty). Agent ID: "${props.agentId}"`);
    currentAgentSystemPrompt.value = `ERROR: [${agentLabel}] System prompt key is missing in agent configuration.`; // Ensure this is an error string
    toast?.add({ type: 'error', title: 'Agent Config Error', message: `System prompt key missing for ${agentLabel}.` });
  }
  console.log(`[${agentLabel}] fetchSystemPrompt finished. currentAgentSystemPrompt.value (first 100 chars):`, currentAgentSystemPrompt.value ? currentAgentSystemPrompt.value.substring(0,100) + "..." : currentAgentSystemPrompt.value);
};

watch(() => props.agentConfig?.systemPromptKey, fetchSystemPrompt, { immediate: true });

/**
 * Clears any active autoplay timer and sets the current slide playing state to false.
 */
const clearCurrentAutoplayTimer = () => {
  if (autoplayTimerId.value) {
    clearTimeout(autoplayTimerId.value);
    autoplayTimerId.value = null;
  }
  isCurrentSlidePlaying.value = false;
};

/**
 * Determines the duration for each slide in a slideshow.
 * Applies specific durations for initial slides and a default for subsequent ones,
 * with the final slide having an infinite duration.
 * @param {number} numSlides - The total number of slides.
 * @returns {number[]} An array of slide durations in milliseconds.
 */
const determineSlideDurations = (numSlides: number): number[] => {
  const durations: number[] = [];
  if (numSlides <= 0) return [];

  // Durations for specific initial slides
  if (numSlides > 0) durations.push(10000); // Slide 1 (index 0)
  if (numSlides > 1) durations.push(15000); // Slide 2 (index 1)
  if (numSlides > 2) durations.push(20000); // Slide 3 (index 2)
  if (numSlides > 3) durations.push(60000); // Slide 4 (index 3)

  const optimalSlidesStartIdx = 4; // Index from which default duration applies
  const finalAnalysisSlideActualIdx = numSlides - 1;

  // Default duration for slides between the initial set and the final slide
  for (let i = optimalSlidesStartIdx; i < finalAnalysisSlideActualIdx; i++) {
    durations.push(90000);
  }
  // Fill any remaining gaps if numSlides is small but > optimalSlidesStartIdx
  while(durations.length < numSlides -1 && numSlides > optimalSlidesStartIdx) {
    durations.push(90000);
  }

  // Ensure the last slide always gets a duration entry, even if it's the only one or among the first few
  if (numSlides > 0) {
    durations[finalAnalysisSlideActualIdx] = Infinity; // Last slide
  }
  return durations.slice(0, numSlides); // Ensure correct length
};

/**
 * Sets up slide durations based on new Markdown content and updates the chat store.
 * @param {string} markdownContent - The full Markdown content for the slideshow.
 * @param {string} [problemTitle] - Optional title for the problem analysis.
 */
const setupSlideDurationsAndParse = (markdownContent: string, problemTitle?: string) => {
  currentSlideshowFullMarkdown.value = markdownContent;
  currentProblemTitleForDisplay.value = problemTitle || currentProblemTitleForDisplay.value || "Problem Analysis"; // Preserve existing title if new one not provided
  const slidesArray = markdownContent.split('---SLIDE_BREAK---');
  totalAppSlidesCount.value = slidesArray.length;
  slideDurationsMs.value = determineSlideDurations(totalAppSlidesCount.value);

  chatStore.updateMainContent({
    agentId: props.agentId,
    type: 'compact-message-renderer-data',
    data: currentSlideshowFullMarkdown.value,
    title: currentProblemTitleForDisplay.value,
    timestamp: Date.now(),
  });
};

/**
 * Schedules the next slide to be displayed during autoplay.
 * Clears existing timers and sets a new one based on the current slide's duration.
 */
const scheduleNextSlide = () => {
  clearCurrentAutoplayTimer();
  if (!isAutoplayGloballyActive.value || currentAppSlideIndex.value >= totalAppSlidesCount.value - 1) {
    isCurrentSlidePlaying.value = false; // End of slideshow or autoplay paused
    return;
  }

  const duration = slideDurationsMs.value[currentAppSlideIndex.value];
  if (duration !== undefined && duration !== Infinity) {
    isCurrentSlidePlaying.value = true;
    autoplayTimerId.value = setTimeout(() => {
      if (isAutoplayGloballyActive.value && isCurrentSlidePlaying.value) { // Double check state before advancing
        compactMessageRendererRef.value?.next();
      }
    }, duration);
  } else {
    isCurrentSlidePlaying.value = false; // No duration or infinite duration, so stop "playing" state
  }
};

/**
 * Handles the 'slide-changed' event from the CompactMessageRenderer.
 * Updates the current slide index and manages autoplay state if navigation was manual.
 * @param {object} payload - The event payload from CompactMessageRenderer.
 * @param {number} payload.newIndex - The new current slide index.
 * @param {number} payload.totalSlides - The total number of slides in the renderer.
 * @param {boolean} payload.navigatedManually - True if the slide change was due to manual user interaction.
 */
const handleSlideChangedInRenderer = (payload: { newIndex: number; totalSlides: number; navigatedManually: boolean }) => {
  currentAppSlideIndex.value = payload.newIndex;
  // totalAppSlidesCount.value = payload.totalSlides; // Renderer might have its own count, ensure ours is aligned if necessary

  if (payload.navigatedManually) {
    isAutoplayGloballyActive.value = false; // Manual navigation pauses global autoplay
    clearCurrentAutoplayTimer();
  } else if (isAutoplayGloballyActive.value) {
    // Slide changed automatically (likely via our scheduleNextSlide calling renderer.next())
    scheduleNextSlide(); // Schedule the *next* one
  }
};

/**
 * Toggles the master autoplay state for the slideshow.
 * If enabling autoplay, it starts playing from the current slide.
 * If disabling, it clears any active autoplay timers.
 */
const toggleMasterAutoplay = () => {
  isAutoplayGloballyActive.value = !isAutoplayGloballyActive.value;
  if (isAutoplayGloballyActive.value) {
    // If slideshow ended, and user hits play, restart from beginning or current slide
    if (currentAppSlideIndex.value >= totalAppSlidesCount.value - 1 && totalAppSlidesCount.value > 0) {
        currentAppSlideIndex.value = 0; // Option: restart from beginning
        compactMessageRendererRef.value?.navigateToSlide(0); // Navigate renderer too
        // Autoplay will be triggered by slide-changed event or explicitly by scheduleNextSlide
    }
    isCurrentSlidePlaying.value = true; // Set intent to play
    scheduleNextSlide();
  } else {
    clearCurrentAutoplayTimer(); // This also sets isCurrentSlidePlaying to false
  }
};

/**
 * Processes the LLM response string, parsing it as JSON and updating the view.
 * Handles different update strategies like creating new slideshows or appending content.
 * @param {string} llmResponseString - The raw JSON string from the LLM.
 */
const handleLlmAuditResponse = (llmResponseString: string) => {
  clearCurrentAutoplayTimer();
  // isLoadingResponse.value is already true, no need to set it again. isCurrentSlidePlaying is handled by clearCurrentAutoplayTimer.
  const agentLabel = agentDisplayName.value;

  try {
    const llmOutput = JSON.parse(llmResponseString) as LlmAuditResponse;
    let newProblemTitle = llmOutput.problemTitle || currentProblemTitleForDisplay.value || "Problem Analysis";
    let newFullMarkdown = "";
    let shouldStartAutoplayOnNewContent = false;

    console.log(`[${agentLabel}] Processing LLM Audit Response. Strategy: ${llmOutput.updateStrategy}`);

    if (llmOutput.updateStrategy === "new_slideshow" || llmOutput.updateStrategy === "revise_slideshow") {
      if (!llmOutput.content || typeof llmOutput.content !== 'string') {
        throw new Error(`No valid 'content' provided for update strategy: ${llmOutput.updateStrategy}.`);
      }
      newFullMarkdown = llmOutput.content;
      setupSlideDurationsAndParse(newFullMarkdown, newProblemTitle);
      currentAppSlideIndex.value = 0; // Reset to first slide
      hasNewSlideshowContentLoaded.value = true;
      shouldStartAutoplayOnNewContent = true; // Autoplay new/revised slideshows
    } else if (llmOutput.updateStrategy === "append_to_final_slide") {
      if (currentSlideshowFullMarkdown.value && totalAppSlidesCount.value > 0 && llmOutput.newContent) {
        currentAppSlideIndex.value = totalAppSlidesCount.value - 1; // Ensure on final slide for append logic
        // Determine appropriate separator: ensure new content starts on a new line, possibly with a thematic break.
        const separator = currentSlideshowFullMarkdown.value.endsWith('\n') ? '\n---\n\n' : '\n\n---\n\n';
        newFullMarkdown = currentSlideshowFullMarkdown.value + separator + llmOutput.newContent;
        
        // Update internal state and store
        currentSlideshowFullMarkdown.value = newFullMarkdown; // Update ref used by CompactMessageRenderer
        // Re-calculate slide durations as appending might effectively alter the "last" slide's perceived content.
        // However, CompactMessageRenderer itself does not split by '---SLIDE_BREAK---' for appends, it just gets longer content.
        // The store needs the full new markdown to rerender.
        chatStore.updateMainContent({
            agentId: props.agentId, type: 'compact-message-renderer-data',
            data: newFullMarkdown, title: newProblemTitle, timestamp: Date.now(),
        });
        // Autoplay remains paused for appended content to allow user to read.
        // User must manually navigate or re-enable autoplay.
        isAutoplayGloballyActive.value = false; 
        isCurrentSlidePlaying.value = false;
        // Navigate to the last slide IF the renderer supports it and we're not already there due to currentAppSlideIndex update
        nextTick().then(() => { // Ensure renderer has updated with new content length
            compactMessageRendererRef.value?.navigateToSlide(totalAppSlidesCount.value > 0 ? totalAppSlidesCount.value -1 : 0);
        });

      } else {
        console.warn(`[${agentLabel}] Could not append: current slideshow empty, or no new content. CurrentTotalSlides: ${totalAppSlidesCount.value}, NewContent: ${llmOutput.newContent}`);
        // Fallback: Treat as a new slideshow with the new content if append is not possible
        newFullMarkdown = llmOutput.newContent || "Error: Append content missing and current slideshow context insufficient.";
        setupSlideDurationsAndParse(newFullMarkdown, "Appended Note (Fallback)");
        currentAppSlideIndex.value = 0;
        hasNewSlideshowContentLoaded.value = true;
        shouldStartAutoplayOnNewContent = true;
      }
    } else if (llmOutput.updateStrategy === "no_update_needed") {
      toast?.add({type: 'info', title: `${agentLabel} Feedback`, message: 'No significant update required for the current analysis.', duration: 5000});
      // If autoplay was active and paused (e.g. on last slide), and user provides input that results in "no_update_needed",
      // we might want to resume it if it's not on the terminal slide.
      if (isAutoplayGloballyActive.value && !isCurrentSlidePlaying.value && currentAppSlideIndex.value < totalAppSlidesCount.value -1) {
        scheduleNextSlide(); // Attempt to resume if appropriate
      }
    } else if (llmOutput.updateStrategy === "clarification_needed") {
      const question = llmOutput.clarification_question || "The assistant needs more details to proceed.";
      toast?.add({type: 'info', title: `${agentLabel} Needs Clarification`, message: question, duration: 12000});
      // Add this clarification to the ephemeral chat log if shown by parent
      chatStore.addMessage({
          role: 'system', // Or 'assistant' if preferred for display
          agentId: props.agentId,
          content: `[${agentLabel}] Clarification needed: ${question}`
      });
      // Autoplay should remain paused as user input is expected.
      isAutoplayGloballyActive.value = false;
      isCurrentSlidePlaying.value = false;
    }

    nextTick().then(() => {
      if (hasNewSlideshowContentLoaded.value && compactMessageRendererRef.value) {
        compactMessageRendererRef.value.navigateToSlide(0); // Ensure new/revised slideshows start from the first slide.
        hasNewSlideshowContentLoaded.value = false; // Reset flag
      }
      // Start autoplay only if new content was loaded, global autoplay is on, and it was determined autoplay should start.
      if (shouldStartAutoplayOnNewContent && isAutoplayGloballyActive.value) {
        isCurrentSlidePlaying.value = true; // Set intent to play before scheduling
        scheduleNextSlide();
      }
      renderAllMermaidDiagramsInView();
    });

  } catch (e: any) {
    console.error(`[${agentLabel}] Error processing LLM JSON output for LC-Audit:`, e, "\nRaw LLM Response String:", llmResponseString);
    toast?.add({type: 'error', title: `${agentLabel} Update Error`, message: `Could not process analysis update. Details: ${e.message}`});
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown',
      data: `### ${agentLabel} System Error\n\nFailed to interpret the analysis provided by the assistant. Details logged in console.\n\n**Error:** ${e.message}\n\n**Raw response (first 300 chars, check browser console for full output if this error persists):**\n\`\`\`\n${llmResponseString.substring(0,300)}...\n\`\`\``,
      title: 'Analysis Processing Failed', timestamp: Date.now()
    });
  } finally {
    isLoadingResponse.value = false;
  }
};

/**
 * Processes the user-provided problem context by sending it to the LLM via `chatAPI`.
 * Handles loading states and updates the main content view with responses or errors.
 * @param {string} problemInput - The problem description or context provided by the user.
 * @async
 */
const processProblemContext = async (problemInput: string) => {
  const agentLabel = agentDisplayName.value;

  if (!problemInput.trim()) {
    toast?.add({type: 'warning', title: 'Input Required', message: `Please provide a problem description for ${agentLabel}.`});
    isLoadingResponse.value = false;
    return;
  }
   if (isLoadingResponse.value) {
    toast?.add({type: 'info', title: 'Processing Busy', message: `${agentLabel} is already processing a request.`});
    return;
  }

  const systemPrompt = currentAgentSystemPrompt.value;
  console.log(`[${agentLabel}] processProblemContext: Attempting to use system prompt. Type: ${typeof systemPrompt}, Is empty/whitespace: ${!systemPrompt?.trim()}`);

  if (typeof systemPrompt !== 'string' || !systemPrompt.trim() || systemPrompt.startsWith("ERROR:")) {
    console.error(`[${agentLabel}] CRITICAL in processProblemContext: currentAgentSystemPrompt is invalid or indicates a prior load error. Type: "${typeof systemPrompt}", Content (start): "${systemPrompt ? systemPrompt.substring(0, 100) + "..." : "N/A"}". Cannot proceed. Agent ID: "${props.agentId}", Configured Key: "${props.agentConfig?.systemPromptKey}"`);
    toast?.add({
      type: 'error',
      title: `${agentLabel} Internal Error`,
      message: systemPrompt.startsWith("ERROR:") ? `Cannot proceed due to: ${systemPrompt.replace("ERROR: ", "")}` : 'Core system prompt is not available or invalid. Analysis cannot start.',
      duration: 10000
    });
    isLoadingResponse.value = false;

    chatStore.updateMainContent({
      agentId: props.agentId,
      type: 'markdown',
      data: `### ${agentLabel} System Error\n\nThe "${agentLabel}" assistant encountered a critical problem with its internal configuration (system prompt missing, invalid, or could not be loaded for key: \`${props.agentConfig?.systemPromptKey}\`). \n\n${systemPrompt.startsWith("ERROR:") ? `Details: ${systemPrompt.replace("ERROR: ", "")}` : 'Please try selecting the agent again. If the issue persists, it may indicate a deeper system problem.'}`,
      title: `${agentLabel} Initialization Failed`,
      timestamp: Date.now()
    });
    return;
  }

  isAutoplayGloballyActive.value = false;
  clearCurrentAutoplayTimer();
  isLoadingResponse.value = true;

  chatStore.updateMainContent({
    agentId: props.agentId, type: 'markdown',
    data: `## ${agentLabel}: Preparing In-Depth Analysis...\n\n<div class="lc-audit-spinner-container mx-auto my-8"><div class="lc-audit-spinner"></div></div>\n\n<p class="text-center text-base text-slate-300">Processing the problem context. This detailed analysis can take a few moments.</p>`,
    title: `${agentLabel}: Analyzing "${problemInput.substring(0, 20)}..."`, timestamp: Date.now()
  });

  try {
    const agentCtxFromStore = agentStore.getAgentContext(props.agentId) || {};
    const currentSlideContent = currentSlideshowFullMarkdown.value.split('---SLIDE_BREAK---')[currentAppSlideIndex.value] || "";
    const contextForLLM = {
        ...agentCtxFromStore,
        current_problem_title: currentProblemTitleForDisplay.value === "Problem Analysis" || 
                               currentProblemTitleForDisplay.value === `${agentLabel} Ready` || 
                               currentProblemTitleForDisplay.value === `${agentLabel} - Awaiting Problem` 
                               ? null 
                               : currentProblemTitleForDisplay.value,
        current_slideshow_content_summary: currentSlideshowFullMarkdown.value 
            ? currentSlideContent.substring(0, 250) + (currentSlideContent.length > 250 ? "..." : "")
            : null,
        current_slide_index: totalAppSlidesCount.value > 0 ? currentAppSlideIndex.value : null, // Send null if no slides
        total_slides_in_current_show: totalAppSlidesCount.value,
        is_on_final_slide: totalAppSlidesCount.value > 0 && currentAppSlideIndex.value === totalAppSlidesCount.value - 1,
    };

    let finalSystemPrompt = systemPrompt // Guarded: systemPrompt is a valid string here
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings?.preferredCodingLanguage || 'Python')
      .replace(/{{USER_QUERY}}/g, problemInput)
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(contextForLLM))
      .replace(/{{CONVERSATION_HISTORY}}/g, JSON.stringify(
          chatStore.getMessagesForAgent(props.agentId)
            .filter(m => m.role === 'user')
            .slice(-3)
            .map(m => ({role: m.role, content: m.content?.substring(0,150)}))
      ));

    const payload: ChatMessagePayloadFE = {
      messages: [{ role: 'user', content: problemInput }],
      mode: props.agentConfig.id,
      systemPromptOverride: finalSystemPrompt,
      userId: `lc_audit_session_${props.agentId}`,
      conversationId: chatStore.getCurrentConversationId(props.agentId) || `lcaudit-conv-${Date.now()}`,
      stream: false, // LC-Audit expects full JSON objects, not streams for its structured response
    };
    
    console.log(`[${agentLabel}] Sending payload to chatAPI for problem: "${problemInput.substring(0, 50)}..."`);
    const response = await chatAPI.sendMessage(payload);
    console.log(`[${agentLabel}] Received response from chatAPI:`, response);

    // Ensure response.data and response.data.content exist and content is string
    if (response.data && typeof (response.data as TextResponseDataFE).content === 'string') {
      handleLlmAuditResponse((response.data as TextResponseDataFE).content!);
    } else {
      console.error(`[${agentLabel}] LLM did not return expected content structure. Response data:`, response.data);
      throw new Error(`${agentLabel} LLM response missing 'content' field or content is not a string.`);
    }

  } catch (error: any) {
    console.error(`[${agentLabel}] Critical API error in processProblemContext:`, error.response?.data || error.message || error);
    const errorMessage = error.response?.data?.message || error.message || `${agentLabel} encountered a critical error processing the problem.`;
    toast?.add({ type: 'error', title: `${agentLabel} Processing Error`, message: errorMessage, duration: 10000 });
    chatStore.updateMainContent({
      agentId: props.agentId, type: 'markdown',
      data: `### ${agentLabel} Analysis Failed\n\nAn error occurred while generating the analysis: \n\n*${String(errorMessage).replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
      title: 'Analysis Initialization Failed', timestamp: Date.now()
    });
  } finally {
    isLoadingResponse.value = false;
  }
};

/**
 * Finds all Mermaid diagram code blocks in the current view and renders them.
 * Uses a timeout to ensure the DOM has updated.
 * @async
 */
const renderAllMermaidDiagramsInView = async () => {
  await nextTick(); // Wait for DOM updates
  setTimeout(() => { // Additional delay for complex DOM changes
    try {
      if (typeof mermaid !== 'undefined' && mermaid?.initialize) {
        const contentArea = document.getElementById(contentDisplayAreaId.value);
        if (contentArea) {
          const mermaidElements = contentArea.querySelectorAll('.mermaid');
          if (mermaidElements.length > 0) {
            // console.log(`[${agentDisplayName.value}] Found ${mermaidElements.length} Mermaid elements to render.`);
            mermaidElements.forEach((el, index) => {
              // Ensure IDs are unique if mermaid relies on them internally, though it usually doesn't for anonymous blocks.
              // el.id = `mermaid-diag-${props.agentId}-${Date.now()}-${index}`;
            });
            mermaid.run({ nodes: mermaidElements });
          }
        }
      } else {
        // console.warn(`[${agentDisplayName.value}] Mermaid.js not available or not initialized.`);
      }
    } catch (e) {
      console.error(`[${agentDisplayName.value}] Error rendering Mermaid diagrams:`, e);
      toast?.add({type: 'warning', title: 'Diagram Error', message: 'Could not render one or more diagrams.'});
    }
  }, 250); // Delay might need adjustment based on rendering complexity
};

defineExpose({ processProblemContext, pauseAutoplay: toggleMasterAutoplay, startOrResumeAutoplay: toggleMasterAutoplay });

onMounted(() => {
  emit('agent-event', { type: 'view_mounted', agentId: props.agentId, label: agentDisplayName.value });

  if (!mainContentToDisplayFromStore.value?.data && !currentSlideshowFullMarkdown.value) {
    const welcomeMarkdown = `
<div class="lc-audit-welcome-container">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto lc-audit-icon-glow">
    <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
  <h2 class="lc-audit-welcome-title">${agentDisplayName.value}</h2>
  <p class="lc-audit-welcome-subtitle">${props.agentConfig?.description || 'Ready to analyze and explain coding problems.'}</p>
  <p class="lc-audit-welcome-prompt">${props.agentConfig?.inputPlaceholder || 'Provide a problem context to begin analysis.'}</p>
  <button @click="() => processProblemContext('Example: Two Sum - Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.')"
          class="btn btn-primary-ephemeral mt-4">Analyze Example: Two Sum</button>
</div>`;
    chatStore.updateMainContent({
        agentId: props.agentId, type: 'markdown', data: welcomeMarkdown,
        title: `${agentDisplayName.value} - Awaiting Problem`, timestamp: Date.now()
    });
  } else if (mainContentToDisplayFromStore.value?.data && mainContentToDisplayFromStore.value.type === 'compact-message-renderer-data') {
    // Restore state from store
    const storedData = mainContentToDisplayFromStore.value.data as string;
    const storedTitle = mainContentToDisplayFromStore.value.title;
    setupSlideDurationsAndParse(storedData, storedTitle); // This updates currentSlideshowFullMarkdown and other states
    currentAppSlideIndex.value = 0; // Default to start, or could be stored/retrieved
    
    nextTick().then(() => {
        compactMessageRendererRef.value?.navigateToSlide(currentAppSlideIndex.value);
        if (isAutoplayGloballyActive.value && totalAppSlidesCount.value > 0) { // Check if there's content to play
             isCurrentSlidePlaying.value = true; scheduleNextSlide();
        }
        renderAllMermaidDiagramsInView();
    });
  }
   // Ensure mermaid diagrams are rendered if content exists on mount, regardless of source
  if (currentSlideshowFullMarkdown.value) {
    renderAllMermaidDiagramsInView();
  }
});

onUnmounted(() => {
  clearCurrentAutoplayTimer();
});

/**
 * Renders Markdown content to HTML using the 'marked' library.
 * Includes basic GFM and breaks options.
 * @param {string | null} content - The Markdown string to parse.
 * @returns {string} HTML string, or an error message if parsing fails or content is null.
 */
const renderMarkdownView = (content: string | null): string => {
    if (content === null || content === undefined) return '<p class="text-slate-500 dark:text-slate-400 italic">No content available to display.</p>';
    try {
        return marked.parse(content, { breaks: true, gfm: true });
    } catch (e) {
        console.error("Markdown rendering error:", e);
        return `<p class="text-red-500 dark:text-red-400">Content rendering error. Please check console.</p>`;
    }
};

</script>

<template>
  <div class="lc-audit-agent-view flex flex-col h-full w-full overflow-hidden">
    <div class="agent-header-controls lc-audit-header">
      <div class="flex items-center gap-3">
        <DocumentMagnifyingGlassIcon class="w-7 h-7 shrink-0 lc-audit-icon" />
        <span class="font-semibold text-xl lc-audit-title">{{ agentDisplayName }}</span>
        <span v-if="currentProblemTitleForDisplay && currentProblemTitleForDisplay !== 'Problem Analysis' && currentProblemTitleForDisplay !== `${agentDisplayName} Ready` && currentProblemTitleForDisplay !== `${agentDisplayName} - Awaiting Problem` && !currentProblemTitleForDisplay.toLowerCase().includes('analyzing')" class="text-sm text-slate-400 truncate ml-2 hidden md:inline">
          | Analyzing: {{ currentProblemTitleForDisplay.replace(`${agentDisplayName}: `, '').replace('Analysis', '').trim() }}
        </span>
      </div>
      <div class="flex items-center gap-2" v-if="totalAppSlidesCount > 0 && (mainContentToDisplayFromStore?.data || currentSlideshowFullMarkdown)">
        <button @click="toggleMasterAutoplay"
                class="btn btn-secondary btn-xs !text-xs"
                :disabled="currentAppSlideIndex >= totalAppSlidesCount - 1 && !isAutoplayGloballyActive && totalAppSlidesCount > 0"
                :title="isAutoplayGloballyActive && isCurrentSlidePlaying ? 'Pause Autoplay' : (currentAppSlideIndex >= totalAppSlidesCount - 1 && totalAppSlidesCount > 0 ? 'Slideshow Ended' : 'Start/Resume Autoplay')">
          <PauseSolidIcon v-if="isAutoplayGloballyActive && isCurrentSlidePlaying" class="w-4 h-4"/>
          <PlaySolidIcon v-else class="w-4 h-4"/>
          <span class="ml-1.5">{{ isAutoplayGloballyActive && isCurrentSlidePlaying ? 'Pause' : (currentAppSlideIndex >= totalAppSlidesCount - 1 && totalAppSlidesCount > 0 ? 'Replay' : 'Play') }}</span>
        </button>
         <button @click="() => { if(compactMessageRendererRef) processProblemContext('Placeholder to trigger re-analysis or specific command') }"
                 class="btn btn-secondary btn-xs !text-xs" title="Re-analyze or new input (Dev Only)">
           <ArrowPathIcon class="w-4 h-4" />
         </button>
      </div>
    </div>
    
    <div :id="contentDisplayAreaId" class="flex-grow relative min-h-0 custom-scrollbar-futuristic lc-audit-scrollbar overflow-y-auto">
      <div v-if="isLoadingResponse && !(mainContentToDisplayFromStore?.data || currentSlideshowFullMarkdown)" class="loading-overlay lc-audit-loading-overlay">
          <div class="lc-audit-spinner-container"><div class="lc-audit-spinner"></div></div>
          <p class="mt-3 text-sm lc-audit-loading-text">{{ agentDisplayName }} is Initializing Analysis...</p>
      </div>
      
      <template v-if="(mainContentToDisplayFromStore?.data || currentSlideshowFullMarkdown)">
        <CompactMessageRenderer
          v-if="currentSlideshowFullMarkdown && (mainContentToDisplayFromStore?.type === 'compact-message-renderer-data' || (mainContentToDisplayFromStore?.type === 'markdown' && props.agentConfig?.capabilities?.usesCompactRenderer))"
          ref="compactMessageRendererRef"
          :content="currentSlideshowFullMarkdown"
          :mode="props.agentConfig?.id || 'lc-audit'" 
          :initial-slide-index="0"
          :disable-internal-autoplay="true" 
          @slide-changed="handleSlideChangedInRenderer"
          @rendered="renderAllMermaidDiagramsInView"
          class="p-0 md:p-1 h-full lc-audit-compact-renderer" 
        />
        <div v-else-if="mainContentToDisplayFromStore?.type === 'markdown' || mainContentToDisplayFromStore?.type === 'welcome' || mainContentToDisplayFromStore?.type === 'error'"
             class="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl dark:prose-invert max-w-none p-4 md:p-6 lg:p-8 xl:p-10 h-full lc-audit-prose-content"
             v-html="renderMarkdownView(mainContentToDisplayFromStore.data as string)">
        </div>
      </template>
      <div v-else-if="!isLoadingResponse" class="lc-audit-welcome-container">
          <p class="text-slate-500 dark:text-slate-400 p-10 text-center italic">{{ agentDisplayName }} is ready. Please provide a problem context to begin analysis.</p>
      </div>

      <div v-if="isLoadingResponse && (mainContentToDisplayFromStore?.data || currentSlideshowFullMarkdown)" class="loading-overlay lc-audit-loading-overlay is-processing-update">
        <div class="lc-audit-spinner-container"><div class="lc-audit-spinner"></div></div>
        <p class="mt-3 text-sm lc-audit-loading-text">{{ agentDisplayName }} is updating analysis...</p>
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
  background-color: rgba(18, 22, 30, 0.85); /* Darker, more translucent overlay */
  backdrop-filter: blur(4px);
  &.is-processing-update {
    background-color: rgba(18, 22, 30, 0.65); /* Slightly lighter for updates */
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

/* Custom scrollbar for LC-Audit main content area AND code blocks */
.custom-scrollbar-futuristic,
.lc-audit-prose-content :deep(pre),
.lc-audit-compact-renderer :deep(pre) { /* Targeting pre within prose via deep selector */
  &::-webkit-scrollbar { @apply w-2.5 h-2.5; } 
  &::-webkit-scrollbar-track { background-color: hsla(var(--neutral-hue, 220), 20%, 12%, 0.5); @apply rounded-lg; }
  &::-webkit-scrollbar-thumb {
    background-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.55);
    @apply rounded-lg;
    border: 2px solid hsla(var(--neutral-hue, 220), 20%, 12%, 0.5); /* Match track for seamless look */
  }
  &::-webkit-scrollbar-thumb:hover { background-color: var(--agent-lcaudit-accent-color); }
  scrollbar-width: auto; /* For Firefox - 'thin' or 'auto' */
  scrollbar-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.55) hsla(var(--neutral-hue, 220), 20%, 12%, 0.5); /* For Firefox */
}
/* Ensure pre elements that get this scrollbar also have overflow auto */
.lc-audit-prose-content :deep(pre),
.lc-audit-compact-renderer :deep(pre) {
  @apply overflow-auto;
}


.lc-audit-prose-content :deep(.prose), 
.lc-audit-compact-renderer :deep(.prose) { /* Apply to prose within compact renderer too */
  font-size: inherit; /* Allow parent to control base font size */
  
  h1, h2, h3, h4 { 
    color: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), calc(var(--agent-lcaudit-accent-lightness) + 20%)) !important;
    border-bottom-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.4) !important;
    @apply pb-2 mb-5 font-semibold;
  }
  h1 { @apply text-2xl md:text-3xl lg:text-4xl; } 
  h2 { @apply text-xl md:text-2xl lg:text-3xl; }
  h3 { @apply text-lg md:text-xl lg:text-2xl; }

  p, li { 
    @apply my-3.5 text-[var(--text-secondary-dark)] dark:text-slate-300; /* Use theme variables */
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
    /* Scrollbar applied via .custom-scrollbar-futuristic targeting rule above */
    @apply border my-6 p-5 rounded-xl shadow-xl text-[95%]; 
    background-color: #0c1015 !important; /* Very dark background for code blocks */
    border-color: hsla(var(--agent-lcaudit-accent-hue), 30%, 30%, 0.4) !important;
  }
  /* Ensure mermaid diagrams are legible and fit well */
  .mermaid { @apply my-6 p-2 bg-slate-800/30 rounded-lg overflow-auto; }
  .mermaid svg {
    @apply block max-w-full h-auto mx-auto; /* Center and make responsive */
  }
}

.lc-audit-welcome-container { @apply text-center p-6 md:p-10 flex flex-col items-center justify-center h-full; }
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
  @apply text-3xl md:text-4xl font-bold mt-5 mb-3 tracking-tight;
  color: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), calc(var(--agent-lcaudit-accent-lightness) + 20%));
}
.lc-audit-welcome-subtitle { @apply text-lg md:text-xl text-[var(--text-secondary-dark)] dark:text-slate-300 mb-8 max-w-xl opacity-95; }
.lc-audit-welcome-prompt { @apply text-base md:text-lg text-[var(--text-muted-dark)] dark:text-slate-400 italic; }

/* Styling for control buttons if needed, e.g., Play/Pause */
.btn.btn-secondary.btn-xs { /* Example: if using global button styles that need override or theming */
  /* Ensure these buttons use the LC-Audit accent color system if they are secondary */
  border-color: var(--agent-lcaudit-accent-color-muted);
  color: hsl(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation, 70%), calc(var(--agent-lcaudit-accent-lightness, 70%) + 15%)); /* Lighter text */
  background-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation, 20%), var(--agent-lcaudit-accent-lightness, 20%), 0.2); /* Subtle background */
  &:hover {
    border-color: var(--agent-lcaudit-accent-color);
    background-color: hsla(var(--agent-lcaudit-accent-hue), var(--agent-lcaudit-accent-saturation), var(--agent-lcaudit-accent-lightness), 0.2);
  }
  &:disabled {
    border-color: hsla(var(--neutral-hue, 220), 10%, 40%, 0.5);
    color: hsla(var(--neutral-hue, 220), 10%, 60%, 0.7);
    background-color: hsla(var(--neutral-hue, 220), 10%, 30%, 0.3);
  }
}
</style>