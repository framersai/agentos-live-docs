// File: frontend/src/components/agents/catalog/NerfAgent/useNerfAgent.ts
/**
 * @file useNerfAgent.ts
 * @description Composable logic for "Nerf" - the General AI Assistant.
 * @version 1.2.0 - Integrated useTextAnimation and refined onStreamEnd logic.
 */
import { ref, computed, watch, type Ref } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition, IAgentCapability } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, type ChatMessagePayloadFE, type ChatMessageFE } from '@/utils/api';
import type { ToastService } from '@/services/services';
import { marked } from 'marked';
import { type AdvancedHistoryConfig, DEFAULT_NERF_HISTORY_CONFIG, type NerfAgentComposable } from './NerfAgentTypes';
import { api } from '@/utils/api';
import { useTextAnimation, type TextRevealConfig } from '@/composables/useTextAnimation';

interface NerfAgentCapability extends IAgentCapability {
  textAnimationConfig?: Partial<TextRevealConfig>;
}

export function useNerfAgent(
  agentConfigRef: Ref<IAgentDefinition>,
  toastInstance?: ToastService,
): NerfAgentComposable {
  const agentStore = useAgentStore();
  const chatStore = useChatStore();
  const toast = toastInstance;
  const agentId = computed(() => agentConfigRef.value.id);

  const isLoadingResponse = ref(false);
  const currentSystemPrompt = ref('');
  const agentDisplayName = computed(() => agentConfigRef.value?.label || "Nerf");

  const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(agentId.value));

  const agentCapabilities = computed(() => agentConfigRef.value.capabilities as NerfAgentCapability);

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

  const fetchSystemPrompt = async () => {
    const key = agentConfigRef.value.systemPromptKey || 'nerf_chat';
    if (key) {
      try {
        const response = await api.get(`/prompts/${key}.md`);
        currentSystemPrompt.value = response.data as string;
      } catch (e) {
        console.error(`[${agentDisplayName.value}] Failed to load system prompt: ${key}.md`, e);
        currentSystemPrompt.value = "You are Nerf, a friendly and concise general AI assistant. Help users with their questions efficiently.";
        toast?.add({type: 'error', title: 'Prompt Load Error', message: `Could not load instructions for ${agentDisplayName.value}.`});
      }
    } else {
      currentSystemPrompt.value = "You are Nerf, a friendly and concise general AI assistant. Help users with their questions efficiently.";
    }
  };

  const initialize = async () => {
    await fetchSystemPrompt();
    resetTextAnimation();
  };

  const cleanup = () => {
    console.log(`[${agentDisplayName.value}] Cleanup performed.`);
    resetTextAnimation();
  };

  const handleNewUserInput = async (text: string) => {
    if (!text.trim() || isLoadingResponse.value) return;
    const currentAgentIdStr = agentId.value;

    chatStore.addMessage({
      role: 'user', content: text,
      agentId: currentAgentIdStr, timestamp: Date.now(),
    });
    
    isLoadingResponse.value = true;
    resetTextAnimation();
    
    const thinkingMessage = `### ${agentDisplayName.value} is processing: "${text.substring(0, 40)}..."\n\n<div class="nerf-spinner-container mx-auto my-4"><div class="nerf-spinner"></div></div>\n\nChecking the knowledge circuits...`;
    chatStore.updateMainContent({
      agentId: currentAgentIdStr, type: 'markdown', data: thinkingMessage,
      title: `${agentDisplayName.value} is on it: ${text.substring(0, 30)}...`,
      timestamp: Date.now()
    });

    try {
      if (!currentSystemPrompt.value) await fetchSystemPrompt();

      let finalSystemPrompt = currentSystemPrompt.value
        .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'english')
        .replace(/{{USER_QUERY}}/g, text)
        .replace(/{{MODE}}/g, agentConfigRef.value.id)
        .replace(/{{GENERATE_DIAGRAM}}/g, ((agentConfigRef.value.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams) ?? false).toString())
        .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.getAgentContext(currentAgentIdStr) || {}))
        .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, '');

      const historyConfig: AdvancedHistoryConfig = {
          ...DEFAULT_NERF_HISTORY_CONFIG,
          maxContextTokens: agentConfigRef.value.capabilities?.maxChatHistory ? agentConfigRef.value.capabilities.maxChatHistory * 120 : DEFAULT_NERF_HISTORY_CONFIG.maxContextTokens,
          simpleRecencyMessageCount: agentConfigRef.value.capabilities?.maxChatHistory || DEFAULT_NERF_HISTORY_CONFIG.simpleRecencyMessageCount,
          numRecentMessagesToPrioritize: agentConfigRef.value.capabilities?.maxChatHistory || DEFAULT_NERF_HISTORY_CONFIG.numRecentMessagesToPrioritize,
      };
      
      const messagesForLlm: ChatMessageFE[] = [];
      messagesForLlm.push({ role: 'system', content: finalSystemPrompt });
      const processedHistory = await chatStore.getHistoryForApi(
        currentAgentIdStr, text, finalSystemPrompt, historyConfig
      );
      messagesForLlm.push(...processedHistory.map(m => ({...m, role: m.role as ChatMessageFE['role']})));
      if (messagesForLlm[messagesForLlm.length-1]?.content !== text || messagesForLlm[messagesForLlm.length-1]?.role !== 'user') {
          messagesForLlm.push({ role: 'user', content: text, timestamp: Date.now() });
      }
      
      const payload: ChatMessagePayloadFE = {
        messages: messagesForLlm,
        mode: agentConfigRef.value.systemPromptKey || agentConfigRef.value.id,
        language: voiceSettingsManager.settings.preferredCodingLanguage,
        generateDiagram: agentConfigRef.value.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
        userId: `frontend_user_nerf_${currentAgentIdStr}`,
        conversationId: chatStore.getCurrentConversationId(currentAgentIdStr),
        stream: true,
      };

      let accumulatedContent = "";
      chatStore.updateMainContent({
        agentId: currentAgentIdStr, type: 'markdown', data: '',
        title: `${agentDisplayName.value}'s response to: "${text.substring(0, 30)}..."`,
        timestamp: Date.now(),
      });
      chatStore.setMainContentStreaming(true);

      const currentAnimConfig: Partial<TextRevealConfig> = {
        mode: agentCapabilities.value?.textAnimationConfig?.mode || 'word',
        durationPerUnit: agentCapabilities.value?.textAnimationConfig?.durationPerUnit || 30,
        staggerDelay: agentCapabilities.value?.textAnimationConfig?.staggerDelay || 15,
        animationStyle: agentCapabilities.value?.textAnimationConfig?.animationStyle || 'terminal',
      };

      await chatAPI.sendMessageStream(
        payload,
        async (chunk: string) => {
          if (chunk) {
            accumulatedContent += chunk;
            await animateText(accumulatedContent, currentAnimConfig);
          }
        },
        async () => { // onStreamEnd
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
          estimatedAnimationDuration = Math.max(50, estimatedAnimationDuration);

          await new Promise(resolve => setTimeout(resolve, estimatedAnimationDuration));

          isLoadingResponse.value = false; 
          chatStore.setMainContentStreaming(false);
          const finalContent = accumulatedContent.trim();

          if (!finalContent) {
            toast?.add({ type: 'info', title: `${agentDisplayName.value} Says`, message: "Hmm, I didn't find a specific answer for that. Try rephrasing?", duration: 4000 });
            chatStore.updateMainContent({
              agentId: currentAgentIdStr, type: 'markdown',
              data: mainContentToDisplay.value?.data?.replace(/### .*Nerf is processing.*Checking the knowledge circuits.../s, "I'm ready for your next question!") || "How can I help you next?",
              title: `${agentDisplayName.value} Ready`, timestamp: Date.now()
            });
            return;
          }
          chatStore.addMessage({
            role: 'assistant', content: finalContent,
            timestamp: Date.now(), agentId: currentAgentIdStr, 
          });
          chatStore.updateMainContent({
            agentId: currentAgentIdStr,
            type: 'markdown',
            data: finalContent,
            title: `${agentDisplayName.value}'s response to: "${text.substring(0, 30)}..."`,
            timestamp: Date.now(),
          });
        },
        async (error: Error) => { 
          console.error(`[${agentDisplayName.value}] Chat stream error:`, error);
          const errorMessage = error.message || 'Nerf ran into a hiccup.';
          toast?.add({ type: 'error', title: `${agentDisplayName.value} Error`, message: errorMessage, duration: 7000 });
          chatStore.addMessage({ role: 'error', content: `Sorry, error: ${errorMessage}`, agentId: currentAgentIdStr, timestamp: Date.now() });
          chatStore.updateMainContent({
            agentId: currentAgentIdStr, type: 'markdown',
            data: `### Nerf Hiccup!\n\n*${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
            title: 'Error', timestamp: Date.now()
          });
          isLoadingResponse.value = false; 
          chatStore.setMainContentStreaming(false);
          resetTextAnimation();
        }
      );
    } catch (error: any) {
      console.error(`[${agentDisplayName.value}] Chat API setup error:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Unexpected error with Nerf.';
      toast?.add({ type: 'error', title: `${agentDisplayName.value} Error`, message: errorMessage, duration: 7000 });
      chatStore.addMessage({ role: 'error', content: `Failed response: ${errorMessage}`, agentId: currentAgentIdStr, timestamp: Date.now() });
      chatStore.updateMainContent({
        agentId: currentAgentIdStr, type: 'markdown',
        data: `### Nerf System Error\n\nConnection problem: *${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
        title: 'Connection Error', timestamp: Date.now()
      });
      isLoadingResponse.value = false;
      chatStore.setMainContentStreaming(false);
      resetTextAnimation();
    }
  };

  const renderMarkdown = (content: string | null): string => {
    if (content === null) return '';
    try {
      return marked.parse(content, { breaks: true, gfm: true });
    } catch (e) {
      console.error(`[${agentDisplayName.value}] Markdown parsing error:`, e);
      return `<p style="color: var(--color-error-text);">Error rendering content.</p>`;
    }
  };

  watch(() => agentConfigRef.value?.systemPromptKey, (newKey, oldKey) => {
    if(newKey && newKey !== oldKey) fetchSystemPrompt();
  }, { immediate: true });

  watch(() => agentStore.activeAgentId, (newAgentId, oldAgentId) => {
    if (newAgentId !== oldAgentId) {
      resetTextAnimation();
    }
  });

  return {
    isLoadingResponse,
    currentSystemPrompt,
    agentDisplayName,
    mainContentToDisplay,
    initialize,
    cleanup,
    handleNewUserInput,
    renderMarkdown,
    animatedUnits,
    isTextAnimating,
  };
}