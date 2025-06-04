// File: frontend/src/components/agents/catalog/NerfAgent/useNerfAgent.ts
/**
 * @file useNerfAgent.ts
 * @description Composable logic for "Nerf" - the General AI Assistant.
 * This composable manages the agent's state, system prompt, user input handling,
 * interaction with the chat API for streaming responses, and text animation.
 *
 * @version 1.3.1
 * @updated 2025-06-04
 * - Corrected `isLoadingResponse` logic: It's now set to `true` only immediately before the LLM API call
 * and set to `false` upon completion or error. This prevents premature STT termination.
 * - Enhanced JSDoc for all functions, properties, and types.
 * - Added console logs for tracing `isLoadingResponse` state.
 * - Removed `NerfAgentCapabilityExtended` and used `IAgentCapability` directly for `textAnimationConfig`.
 */
import { ref, computed, watch, type Ref, readonly } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition, IAgentCapability } from '@/services/agent.service'; // Using IAgentCapability directly
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, type ChatMessagePayloadFE, type ChatMessageFE, api } from '@/utils/api';
import type { ToastService } from '@/services/services';
import { marked } from 'marked';
import { type AdvancedHistoryConfig, DEFAULT_NERF_HISTORY_CONFIG, type NerfAgentComposable } from './NerfAgentTypes';
import { useTextAnimation, type TextRevealConfig } from '@/composables/useTextAnimation';

/**
 * Composable function for the Nerf agent.
 *
 * @param {Ref<IAgentDefinition>} agentConfigRef - Reactive reference to the agent's definition.
 * @param {ToastService} [toastInstance] - Optional toast service for notifications.
 * @returns {NerfAgentComposable} Object containing reactive properties and methods for the Nerf agent.
 */
export function useNerfAgent(
  agentConfigRef: Ref<IAgentDefinition>,
  toastInstance?: ToastService,
): NerfAgentComposable {
  const agentStore = useAgentStore();
  const chatStore = useChatStore();
  const toast = toastInstance;

  /** @type {ComputedRef<IAgentDefinition['id']>} The ID of the current agent. */
  const agentId = computed(() => agentConfigRef.value.id);

  /**
   * @type {Ref<boolean>}
   * @description Reactive flag indicating if the agent is currently waiting for a response from the LLM.
   * This should ONLY be true during the actual asynchronous API call.
   */
  const isLoadingResponse = ref(false);

  /** @type {Ref<string>} The current system prompt for the agent. */
  const currentSystemPrompt = ref('');

  /** @type {ComputedRef<string>} The display name of the agent. */
  const agentDisplayName = computed(() => agentConfigRef.value?.label || "Nerf");

  /** @type {ComputedRef<MainContent | null>} The main content to be displayed for this agent from the chat store. */
  const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(agentId.value));

  /** @type {ComputedRef<IAgentCapability>} The capabilities of this Nerf agent instance, directly using IAgentCapability. */
  const agentCapabilities = computed(() => agentConfigRef.value.capabilities as IAgentCapability);

  const {
    animatedUnits,
    animateText,
    resetAnimation: resetTextAnimation,
    isAnimating: isTextAnimating,
  } = useTextAnimation({
    mode: agentCapabilities.value?.textAnimationConfig?.mode || 'word',
    durationPerUnit: agentCapabilities.value?.textAnimationConfig?.durationPerUnit || 30,
    staggerDelay: agentCapabilities.value?.textAnimationConfig?.staggerDelay || 15,
    animationStyle: agentCapabilities.value?.textAnimationConfig?.animationStyle || 'terminal',
  });

  /**
   * Fetches the system prompt for the agent from the backend.
   * Uses the `systemPromptKey` from the agent's configuration.
   * Falls back to a default prompt if fetching fails or no key is provided.
   * @async
   */
  const fetchSystemPrompt = async (): Promise<void> => {
    const key = agentConfigRef.value.systemPromptKey || 'nerf_chat';
    const agentLabel = agentDisplayName.value;
    console.log(`[${agentLabel}] Fetching system prompt with key: ${key}.md`);
    if (key) {
      try {
        const response = await api.get(`/prompts/${key}.md`);
        currentSystemPrompt.value = response.data as string;
        if (!currentSystemPrompt.value.trim()) {
            console.warn(`[${agentLabel}] Fetched system prompt for key '${key}' is empty. Using fallback.`);
            currentSystemPrompt.value = `You are ${agentLabel}, a friendly and concise general AI assistant. Help users with their questions efficiently.`;
        }
      } catch (e) {
        console.error(`[${agentLabel}] Failed to load system prompt: ${key}.md`, e);
        currentSystemPrompt.value = `You are ${agentLabel}, a friendly and concise general AI assistant. Help users with their questions efficiently.`;
        toast?.add({type: 'error', title: 'Prompt Load Error', message: `Could not load instructions for ${agentLabel}.`});
      }
    } else {
      console.warn(`[${agentLabel}] No systemPromptKey defined. Using fallback prompt.`);
      currentSystemPrompt.value = `You are ${agentLabel}, a friendly and concise general AI assistant. Help users with their questions efficiently.`;
    }
  };

  /**
   * Initializes the agent, primarily by fetching its system prompt and resetting text animations.
   * @async
   */
  const initialize = async (): Promise<void> => {
    console.log(`[${agentDisplayName.value}] Initializing...`);
    await fetchSystemPrompt();
    resetTextAnimation();
  };

  /**
   * Performs cleanup operations when the agent is deactivated or the component is unmounted.
   * Resets text animations.
   */
  const cleanup = (): void => {
    console.log(`[${agentDisplayName.value}] Cleanup performed.`);
    resetTextAnimation();
  };

  /**
   * Handles new user input.
   * Adds the user's message to the chat store, prepares and sends a request to the LLM via `chatAPI.sendMessageStream`,
   * and updates the main content with the streaming response.
   * Manages the `isLoadingResponse` state correctly around the API call.
   *
   * @param {string} text - The user's input text.
   * @async
   */
  const handleNewUserInput = async (text: string): Promise<void> => {
    const agentLabel = agentDisplayName.value;
    console.log(`[${agentLabel}] handleNewUserInput called with text: "${text.substring(0, 50)}..."`);

    if (!text.trim()) {
      console.log(`[${agentLabel}] Input text is empty. Aborting.`);
      return;
    }
    // Check isLoadingResponse here. If true, it means an LLM call from *this agent instance* is already in progress.
    if (isLoadingResponse.value) {
      console.warn(`[${agentLabel}] LLM is already processing a response for this agent. Input ignored.`);
      toast?.add({ type: 'info', title: 'Processing', message: `${agentLabel} is currently busy. Please wait.` });
      return;
    }

    const currentAgentIdStr = agentId.value;

    chatStore.addMessage({
      role: 'user', content: text,
      agentId: currentAgentIdStr, timestamp: Date.now(),
    });

    resetTextAnimation(); // Reset any previous animation

    // Display an initial "thinking" message immediately.
    const thinkingMessage = `### ${agentLabel} is processing: "${text.substring(0, 40)}..."\n\n<div class="nerf-spinner-container mx-auto my-4"><div class="nerf-spinner"></div></div>\n\nChecking the knowledge circuits...`;
    chatStore.updateMainContent({
      agentId: currentAgentIdStr, type: 'markdown', data: thinkingMessage,
      title: `${agentLabel} is on it: ${text.substring(0, 30)}...`,
      timestamp: Date.now()
    });

    // --- Critical Change: isLoadingResponse set to true ONLY before API call ---
    console.log(`[${agentLabel}] Preparing to call LLM API. Setting isLoadingResponse to true.`);
    isLoadingResponse.value = true;
    // The NerfAgentView.vue component (or its parent, PrivateHome.vue) should observe this `isLoadingResponse`
    // (possibly via an emitted event if this composable is used by a child component that then emits upwards)
    // and use it to control the `isProcessing` prop of VoiceInput.vue.

    try {
      if (!currentSystemPrompt.value.trim()) { // Ensure system prompt is loaded
        console.warn(`[${agentLabel}] System prompt was empty before API call. Attempting to fetch again.`);
        await fetchSystemPrompt();
        if (!currentSystemPrompt.value.trim()) {
          toast?.add({type: 'error', title: 'Critical Error', message: `System prompt for ${agentLabel} could not be established.`});
          throw new Error(`System prompt for ${agentLabel} could not be established.`);
        }
      }

      let finalSystemPrompt = currentSystemPrompt.value
        .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'english')
        .replace(/{{USER_QUERY}}/g, text)
        .replace(/{{MODE}}/g, agentConfigRef.value.id)
        .replace(/{{GENERATE_DIAGRAM}}/g, ((agentCapabilities.value?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams) ?? false).toString())
        .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.getAgentContext(currentAgentIdStr) || {}))
        .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, '');

      const historyConfig: AdvancedHistoryConfig = {
          ...DEFAULT_NERF_HISTORY_CONFIG,
          maxContextTokens: agentCapabilities.value?.maxChatHistory ? agentCapabilities.value.maxChatHistory * 120 : DEFAULT_NERF_HISTORY_CONFIG.maxContextTokens,
          simpleRecencyMessageCount: agentCapabilities.value?.maxChatHistory || DEFAULT_NERF_HISTORY_CONFIG.simpleRecencyMessageCount,
          numRecentMessagesToPrioritize: agentCapabilities.value?.maxChatHistory || DEFAULT_NERF_HISTORY_CONFIG.numRecentMessagesToPrioritize,
      };

      const messagesForLlm: ChatMessageFE[] = [];
      messagesForLlm.push({ role: 'system', content: finalSystemPrompt });
      const processedHistory = await chatStore.getHistoryForApi(
        currentAgentIdStr, text, finalSystemPrompt, historyConfig
      );
      messagesForLlm.push(...processedHistory.map(m => ({...m, role: m.role as ChatMessageFE['role']})));
      // Ensure the current user message is the last one if not already included by getHistoryForApi
      if (messagesForLlm.length === 0 || messagesForLlm[messagesForLlm.length-1]?.content !== text || messagesForLlm[messagesForLlm.length-1]?.role !== 'user') {
          messagesForLlm.push({ role: 'user', content: text, timestamp: Date.now() });
      }

      const payload: ChatMessagePayloadFE = {
        messages: messagesForLlm,
        mode: agentConfigRef.value.systemPromptKey || agentConfigRef.value.id,
        language: voiceSettingsManager.settings.preferredCodingLanguage,
        generateDiagram: agentCapabilities.value?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
        userId: `frontend_user_nerf_${currentAgentIdStr}`, // Example User ID
        conversationId: chatStore.getCurrentConversationId(currentAgentIdStr),
        stream: true,
      };

      let accumulatedContent = "";
      // Clear thinking message and prepare for streaming actual content
      chatStore.updateMainContent({
        agentId: currentAgentIdStr, type: 'markdown', data: '', // Start with empty data for animation
        title: `${agentLabel}'s response to: "${text.substring(0, 30)}..."`,
        timestamp: Date.now(),
      });
      chatStore.setMainContentStreaming(true, ''); // Pass empty initial text for chatStore's internal streaming text

      const currentAnimConfig: Partial<TextRevealConfig> = {
        mode: agentCapabilities.value?.textAnimationConfig?.mode || 'word',
        durationPerUnit: agentCapabilities.value?.textAnimationConfig?.durationPerUnit || 30,
        staggerDelay: agentCapabilities.value?.textAnimationConfig?.staggerDelay || 15,
        animationStyle: agentCapabilities.value?.textAnimationConfig?.animationStyle || 'terminal',
      };

      await chatAPI.sendMessageStream(
        payload,
        async (chunk: string) => { // onChunkReceived
          if (chunk) {
            accumulatedContent += chunk; // Accumulate locally for animation
            // Animate the full accumulated content so far.
            // useTextAnimation will manage diffing or restarting animation based on its logic.
            await animateText(accumulatedContent, currentAnimConfig);
            // For live UI update in chatStore (if not driven by animatedUnits directly),
            // one might update chatStore.streamingMainContentText here, but `animateText` populates `animatedUnits`.
            // If NerfAgentView.vue binds to `animatedUnits`, this is sufficient.
            // If it binds to chatStore.streamingMainContentText, then:
            // chatStore.setMainContentStreaming(true, accumulatedContent); // Or appendStreamingMainContent
          }
        },
        async () => { // onStreamEnd
          // Wait for text animation to potentially finish before finalizing
          const animConfigForEnd = {
            staggerDelay: agentCapabilities.value?.textAnimationConfig?.staggerDelay || 15,
            durationPerUnit: agentCapabilities.value?.textAnimationConfig?.durationPerUnit || 30,
            factor: agentCapabilities.value?.textAnimationConfig?.totalDurationEstimateFactor || 1.0,
          };
          let estimatedAnimationDuration = 0;
          if (animatedUnits.value.length > 0) {
            estimatedAnimationDuration =
              ((animatedUnits.value.length - 1) * animConfigForEnd.staggerDelay + animConfigForEnd.durationPerUnit) * animConfigForEnd.factor;
          }
          estimatedAnimationDuration = Math.max(50, estimatedAnimationDuration); // Minimum time
          await new Promise(resolve => setTimeout(resolve, estimatedAnimationDuration));

          // isLoadingResponse is set in the finally block
          chatStore.setMainContentStreaming(false); // Signal end of streaming to store
          const finalContent = accumulatedContent.trim();

          if (!finalContent) {
            toast?.add({ type: 'info', title: `${agentLabel} Says`, message: "Hmm, I didn't find a specific answer for that. Try rephrasing?", duration: 4000 });
            // Try to clear the "Nerf is processing..." message if it's still there
            const currentMainData = mainContentToDisplay.value?.data as string || "";
            if (currentMainData.includes("Checking the knowledge circuits...")) {
                 chatStore.updateMainContent({
                    agentId: currentAgentIdStr, type: 'markdown',
                    data: "I'm ready for your next question!",
                    title: `${agentLabel} Ready`, timestamp: Date.now()
                });
            }
            return;
          }
          chatStore.addMessage({
            role: 'assistant', content: finalContent,
            timestamp: Date.now(), agentId: currentAgentIdStr,
          });
          // Update main content with the final, complete, non-animated response
          chatStore.updateMainContent({
            agentId: currentAgentIdStr,
            type: 'markdown', // Nerf primarily uses markdown
            data: finalContent, // The actual final text
            title: `${agentLabel}'s response to: "${text.substring(0, 30)}..."`,
            timestamp: Date.now(),
          });
        },
        async (error: Error) => { // onStreamError
          console.error(`[${agentLabel}] Chat stream error:`, error);
          const errorMessage = error.message || `${agentLabel} ran into a hiccup.`;
          toast?.add({ type: 'error', title: `${agentLabel} Error`, message: errorMessage, duration: 7000 });
          chatStore.addMessage({ role: 'error', content: `Sorry, error: ${errorMessage}`, agentId: currentAgentIdStr, timestamp: Date.now() });
          chatStore.updateMainContent({
            agentId: currentAgentIdStr, type: 'markdown',
            data: `### ${agentLabel} Hiccup!\n\n*${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
            title: 'Error', timestamp: Date.now()
          });
          // isLoadingResponse is set in the finally block
          chatStore.setMainContentStreaming(false);
          resetTextAnimation();
        }
      );
    } catch (error: any) {
      console.error(`[${agentLabel}] Chat API setup error:`, error);
      const errorMessage = error.response?.data?.message || error.message || `Unexpected error with ${agentLabel}.`;
      toast?.add({ type: 'error', title: `${agentLabel} Error`, message: errorMessage, duration: 7000 });
      chatStore.addMessage({ role: 'error', content: `Failed response: ${errorMessage}`, agentId: currentAgentIdStr, timestamp: Date.now() });
      chatStore.updateMainContent({
        agentId: currentAgentIdStr, type: 'markdown',
        data: `### ${agentLabel} System Error\n\nConnection problem: *${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
        title: 'Connection Error', timestamp: Date.now()
      });
      // isLoadingResponse is set in the finally block
      chatStore.setMainContentStreaming(false);
      resetTextAnimation();
    } finally {
      console.log(`[${agentLabel}] LLM API call finished or errored. Setting isLoadingResponse to false.`);
      isLoadingResponse.value = false;
      // Ensure streaming state is also reset if not already handled by onStreamEnd/Error
      if (chatStore.isMainContentStreaming) {
        chatStore.setMainContentStreaming(false);
      }
       // If text animation was ongoing and stream ended/errored, ensure isTextAnimating is false.
      // This should be handled by useTextAnimation's timeout, but an explicit reset might be needed
      // if the error occurred before the animation timeout naturally resolved.
      if (isTextAnimating.value) {
        // A short delay might be good here to let the UI catch up if the error was very abrupt.
        // Or, if the view relies on `animatedUnits` being cleared, `resetTextAnimation()` would do that.
        // For now, assume useTextAnimation handles its state correctly on timeout/reset.
        // If issues persist where isTextAnimating stays true after an error, call resetTextAnimation() here.
      }
    }
  };

  /**
   * Renders markdown content to HTML string.
   * Includes basic error handling for parsing.
   *
   * @param {(string | null)} content - The markdown string to parse.
   * @returns {string} The HTML string, or an error message if parsing fails.
   */
  const renderMarkdown = (content: string | null): string => {
    if (content === null) return '';
    try {
      return marked.parse(content, { breaks: true, gfm: true });
    } catch (e) {
      console.error(`[${agentDisplayName.value}] Markdown parsing error:`, e);
      return `<p style="color: var(--color-error-text);">Error rendering content.</p>`;
    }
  };

  // Watch for changes in the agent's system prompt key and re-fetch if necessary.
  watch(() => agentConfigRef.value?.systemPromptKey, (newKey, oldKey) => {
    if(newKey && newKey !== oldKey) {
      console.log(`[${agentDisplayName.value}] System prompt key changed from ${oldKey || 'N/A'} to ${newKey}. Re-fetching.`);
      fetchSystemPrompt();
    } else if (newKey && (!currentSystemPrompt.value || !currentSystemPrompt.value.trim())) {
      console.log(`[${agentDisplayName.value}] Initializing with prompt key: ${newKey} (current prompt empty). Fetching.`);
      fetchSystemPrompt();
    }
  }, { immediate: true }); // Immediate to fetch on initial load

  // Watch for active agent changes to reset animations if this agent becomes inactive.
  watch(() => agentStore.activeAgentId, (newActiveAgentId, oldActiveAgentId) => {
    if (newActiveAgentId !== oldActiveAgentId && oldActiveAgentId === agentId.value) { // Was this agent, now it's not
      console.log(`[${agentDisplayName.value}] Agent changed from ${oldActiveAgentId} to ${newActiveAgentId}. Resetting animation for Nerf.`);
      resetTextAnimation();
      if (isLoadingResponse.value) { // If Nerf was loading and agent switched, reset its loading flag
        console.log(`[${agentDisplayName.value}] Agent switched while Nerf was loading. Resetting Nerf's isLoadingResponse.`);
        isLoadingResponse.value = false;
      }
    } else if (newActiveAgentId === agentId.value && oldActiveAgentId !== agentId.value) { // This agent just became active
        if (!currentSystemPrompt.value.trim()) { // If prompt wasn't loaded (e.g. first time)
            console.log(`[${agentDisplayName.value}] Became active agent and system prompt is missing. Fetching.`);
            fetchSystemPrompt();
        }
    }
  });

  return {
    isLoadingResponse: readonly(isLoadingResponse), // Expose as readonly
    currentSystemPrompt: readonly(currentSystemPrompt),
    agentDisplayName,
    mainContentToDisplay,
    initialize,
    cleanup,
    handleNewUserInput,
    renderMarkdown,
    animatedUnits, // From useTextAnimation
    isTextAnimating: readonly(isTextAnimating), // From useTextAnimation
  };
}