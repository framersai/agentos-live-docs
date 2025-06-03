// File: frontend/src/components/agents/catalog/VAgent/useVAgent.ts
/**
 * @file useVAgent.ts
 * @description Composable logic for "V" - the Advanced General AI Assistant.
 * @version 1.2.3 - Fixed streaming content updates for chat store.
 */
import { ref, computed, watch, type Ref } from 'vue';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type MainContent } from '@/store/chat.store';
import type { IAgentDefinition, IAgentCapability } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { chatAPI, type ChatMessagePayloadFE, type ChatMessageFE } from '@/utils/api';
import type { ToastService } from '@/services/services';
import { marked } from 'marked';
import { type AdvancedHistoryConfig, DEFAULT_V_HISTORY_CONFIG, type VAgentComposable } from './VAgentTypes';
import { api } from '@/utils/api';

export function useVAgent(
  agentConfigRef: Ref<IAgentDefinition>,
  toastInstance?: ToastService,
): VAgentComposable {
  const agentStore = useAgentStore();
  const chatStore = useChatStore();
  const toast = toastInstance;
  const agentId = computed(() => agentConfigRef.value.id);

  const isLoadingResponse = ref(false);
  const currentSystemPrompt = ref('');
  const agentDisplayName = computed(() => agentConfigRef.value?.label || "V");

  const mainContentToDisplay = computed<MainContent | null>(() => chatStore.getMainContentForAgent(agentId.value));

  const fetchSystemPrompt = async (): Promise<void> => {
    const promptKey = agentConfigRef.value.systemPromptKey;
    if (promptKey) {
      try {
        console.log(`[${agentDisplayName.value}] Fetching system prompt with key: ${promptKey}.md`);
        const response = await api.get(`/prompts/${promptKey}.md`);
        currentSystemPrompt.value = response.data as string;
        if (!currentSystemPrompt.value.trim()) {
            console.warn(`[${agentDisplayName.value}] Fetched prompt for key '${promptKey}' is empty. Using fallback.`);
            currentSystemPrompt.value = "You are V, a sophisticated AI assistant. Your primary directive is to provide insightful, articulate, and comprehensive responses. Generate detailed explanations, code, and diagrams (using Mermaid syntax when appropriate and `{{GENERATE_DIAGRAM}}` is true) to assist the user effectively.";
        }
      } catch (e) {
        console.error(`[${agentDisplayName.value}] Error loading prompt '${promptKey}.md':`, e);
        currentSystemPrompt.value = "You are V, a sophisticated AI assistant. Your primary directive is to provide insightful, articulate, and comprehensive responses. Generate detailed explanations, code, and diagrams (using Mermaid syntax when appropriate and `{{GENERATE_DIAGRAM}}` is true) to assist the user effectively.";
        toast?.add({ type: 'warning', title: 'Prompt Load Error', message: `Could not load custom instructions for ${agentDisplayName.value}. Using robust fallback.`});
      }
    } else {
      console.error(`[${agentDisplayName.value}] No systemPromptKey defined for agent. Using robust fallback.`);
      currentSystemPrompt.value = "You are V, a sophisticated AI assistant. Your primary directive is to provide insightful, articulate, and comprehensive responses. Generate detailed explanations, code, and diagrams (using Mermaid syntax when appropriate and `{{GENERATE_DIAGRAM}}` is true) to assist the user effectively.";
    }
  };

  const initialize = async () => {
    await fetchSystemPrompt();
  };

  const cleanup = () => {
    console.log(`[${agentDisplayName.value}] Cleanup performed.`);
  };

  const handleNewUserInput = async (text: string) => {
    if (!text.trim() || isLoadingResponse.value) return;
    const currentAgentIdStr = agentId.value;

    chatStore.addMessage({
      role: 'user', content: text,
      agentId: currentAgentIdStr, timestamp: Date.now(),
    });
    
    isLoadingResponse.value = true;

    const thinkingMessage = `### ${agentDisplayName.value} is contemplating: "${text.substring(0, 40)}..."\n\n<div class="v-spinner-container mx-auto my-4"><div class="v-spinner"></div></div>\n\nAccessing knowledge streams...`;
    chatStore.updateMainContent({
      agentId: currentAgentIdStr, type: 'markdown', data: thinkingMessage,
      title: `${agentDisplayName.value} is processing: ${text.substring(0, 30)}...`,
      timestamp: Date.now()
    });

    try {
      if (!currentSystemPrompt.value || !currentSystemPrompt.value.trim()) {
        console.log(`[${agentDisplayName.value}] System prompt empty or not loaded before user input. Fetching now.`);
        await fetchSystemPrompt();
         if (!currentSystemPrompt.value || !currentSystemPrompt.value.trim()) {
            throw new Error("Critical: System prompt for V agent could not be established.");
        }
      }

      let finalSystemPrompt = currentSystemPrompt.value
        .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'english')
        .replace(/{{USER_QUERY}}/g, text) 
        .replace(/{{MODE}}/g, agentConfigRef.value.id)
        .replace(/{{GENERATE_DIAGRAM}}/g, ((agentConfigRef.value.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams) ?? false).toString())
        .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.getAgentContext(currentAgentIdStr) || {}))
        .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, '');

      const historyConfig: AdvancedHistoryConfig = {
          ...DEFAULT_V_HISTORY_CONFIG,
          maxContextTokens: agentConfigRef.value.capabilities?.maxChatHistory ? agentConfigRef.value.capabilities.maxChatHistory * 150 : DEFAULT_V_HISTORY_CONFIG.maxContextTokens,
          simpleRecencyMessageCount: agentConfigRef.value.capabilities?.maxChatHistory || DEFAULT_V_HISTORY_CONFIG.numRecentMessagesToPrioritize,
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
        userId: `frontend_user_v_${currentAgentIdStr}`,
        conversationId: chatStore.getCurrentConversationId(currentAgentIdStr),
        stream: true,
      };
      console.log(`[${agentDisplayName.value}] Sending payload with mode: ${payload.mode}. System prompt starts with: "${finalSystemPrompt.substring(0, 100)}..."`);

      let accumulatedContent = "";
      
      // Clear the main content and set up for streaming
      chatStore.updateMainContent({
        agentId: currentAgentIdStr,
        type: 'markdown', 
        data: '', 
        title: `${agentDisplayName.value}'s insight on: "${text.substring(0, 30)}..."`,
        timestamp: Date.now(),
      });
      chatStore.setMainContentStreaming(true, '');

      await chatAPI.sendMessageStream(
        payload,
        async (chunk: string) => {
          if (chunk) {
            accumulatedContent += chunk;
            // CRITICAL FIX: Update the chat store's streaming text
            chatStore.setMainContentStreaming(true, accumulatedContent);
          }
        },
        async () => { // onStreamEnd
          isLoadingResponse.value = false; 
          chatStore.setMainContentStreaming(false);
          const finalContent = accumulatedContent.trim();

          if (!finalContent) {
            toast?.add({ type: 'info', title: `${agentDisplayName.value} Responds`, message: "I've processed that. Is there anything specific you'd like to explore further?", duration: 5000 });
            chatStore.updateMainContent({
              agentId: currentAgentIdStr, type: 'markdown',
              data: mainContentToDisplay.value?.data?.replace(/### .*V is contemplating.*Accessing knowledge streams.../s, "I'm ready for your next query.") || "How may I further assist you?",
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
            type: agentConfigRef.value.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: finalContent,
            title: `${agentDisplayName.value}'s insight on: "${text.substring(0, 30)}..."`,
            timestamp: Date.now(),
          });
        },
        async (error: Error) => {
          console.error(`[${agentDisplayName.value}] Chat stream error:`, error);
          const errorMessage = error.message || 'V encountered an issue processing your request.';
          toast?.add({ type: 'error', title: `${agentDisplayName.value} Error`, message: errorMessage, duration: 7000 });
          chatStore.addMessage({ role: 'error', content: `Processing error: ${errorMessage}`, agentId: currentAgentIdStr, timestamp: Date.now() });
          chatStore.updateMainContent({
            agentId: currentAgentIdStr, type: 'markdown',
            data: `### ${agentDisplayName.value} Processing Issue\n\n*${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
            title: 'Error', timestamp: Date.now()
          });
          isLoadingResponse.value = false; 
          chatStore.setMainContentStreaming(false);
        }
      );
    } catch (error: any) {
      console.error(`[${agentDisplayName.value}] Chat API setup error:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred with V.';
      toast?.add({ type: 'error', title: `${agentDisplayName.value} Error`, message: errorMessage, duration: 7000 });
      chatStore.addMessage({ role: 'error', content: `Failed to get response: ${errorMessage}`, agentId: currentAgentIdStr, timestamp: Date.now() });
      chatStore.updateMainContent({
        agentId: currentAgentIdStr, type: 'markdown',
        data: `### ${agentDisplayName.value} System Error\n\nConnection problem: *${errorMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}*`,
        title: 'Connection Error', timestamp: Date.now()
      });
      isLoadingResponse.value = false;
      chatStore.setMainContentStreaming(false);
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

  watch(() => agentConfigRef.value?.systemPromptKey, async (newKey, oldKey) => {
    if(newKey && newKey !== oldKey) {
        console.log(`[${agentDisplayName.value}] System prompt key changed to: ${newKey}. Refetching.`);
        await fetchSystemPrompt();
    } else if (newKey && !currentSystemPrompt.value.trim()) {
        console.log(`[${agentDisplayName.value}] Initializing with prompt key: ${newKey}. Fetching.`);
        await fetchSystemPrompt();
    }
  }, { immediate: true });
  
  watch(() => agentStore.activeAgentId, (newAgentId, oldAgentId) => {
    if (newAgentId !== oldAgentId && newAgentId === agentId.value) {
      if(!currentSystemPrompt.value.trim()) fetchSystemPrompt();
    }
  });

  // Add dummy/default implementations for animatedUnits and isTextAnimating to satisfy VAgentComposable
  const animatedUnits = ref([]); // Replace with actual logic if needed
  const isTextAnimating = ref(false); // Replace with actual logic if needed

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