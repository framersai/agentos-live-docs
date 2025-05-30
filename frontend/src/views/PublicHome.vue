// File: frontend/src/views/PublicHome.vue
/**
 * @file PublicHome.vue
 * @description Public-facing home page using UnifiedChatLayout.
 * Features rate limiting, public agent selection, themed placeholders, API-driven prompt loading,
 * dynamic loading of custom agent views, and session-specific userId.
 * @version 3.5.1 - Refined isLoadingResponse and voice input processing logic.
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject, watch, defineAsyncComponent, type Component as VueComponentType } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import {
  api,
  chatAPI,
  promptAPI,
  type ChatMessagePayloadFE,
  type ProcessedHistoryMessageFE,
  type ChatMessageFE,
} from '@/utils/api';
import { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';
import { agentService, type IAgentDefinition, type AgentId } from '@/services/agent.service';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type MainContent } from '@/store/chat.store';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import { useAuth } from '@/composables/useAuth';

import UnifiedChatLayout from '@/components/layouts/UnifiedChatLayout.vue';
import MainContentView from '@/components/agents/common/MainContentView.vue';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';

import {
  SparklesIcon, KeyIcon, ChevronDownIcon, UserGroupIcon,
  ExclamationTriangleIcon, CheckIcon as CheckOutlineIcon,
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline';

interface RateLimitInfo {
  tier: 'public' | 'authenticated';
  ip?: string;
  used?: number;
  limit?: number;
  remaining?: number;
  resetAt?: string | Date;
  message?: string;
}

const router = useRouter();
const toast = inject<ToastService>('toast');
const agentStore = useAgentStore();
const chatStore = useChatStore();
const auth = useAuth(); // For sessionUserId

const availablePublicAgents = ref<IAgentDefinition[]>([]);
const currentPublicAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);
const agentViewRef = ref<any>(null);

const currentAgentViewComponent = computed<VueComponentType | null>(() => {
  const agent = currentPublicAgent.value;
  if (agent && agent.isPublic && agent.viewComponentName) {
    const componentName = agent.viewComponentName;
    const agentLabel = agent.label || 'Current Public Agent';
    try {
      console.log(`[PublicHome] Attempting to load dedicated view component: ${componentName} for public agent: ${agentLabel}`);
      return defineAsyncComponent(() =>
        import(`@/components/agents/${componentName}.vue`)
          .catch(err => {
            console.error(`[PublicHome] Failed to import @/components/agents/${componentName}.vue for public agent:`, err);
            toast?.add({type: 'error', title: 'UI Load Error', message: `Could not load specific interface for ${agentLabel}. Using default view.`});
            return import('@/components/agents/common/MainContentView.vue');
          })
      );
    } catch (e) {
      console.error(`[PublicHome] Synchronous error setting up dynamic import for public agent view: ${componentName}`, e);
      toast?.add({ type: 'error', title: 'UI Setup Error', message: `Error preparing interface for ${agentLabel}.` });
      return null;
    }
  }
  return null;
});

const showPublicAgentSelector = ref(false);
const publicAgentSelectorDropdownRef = ref<HTMLElement | null>(null);

/**
 * @ref isLoadingResponse
 * @description Indicates if an assistant LLM response is currently being processed.
 * This should be true ONLY when waiting for the backend LLM.
 */
const isLoadingResponse = ref(false);
/**
 * @ref isVoiceInputCurrentlyProcessingAudio
 * @description Reflects if the VoiceInput component (or its STT handlers) is actively recording or processing audio for STT.
 */
const isVoiceInputCurrentlyProcessingAudio = ref(false);

const currentSystemPromptText = ref('');
const rateLimitInfo = ref<RateLimitInfo | null>(null);

const mainContentData = computed<MainContent | null>(() => {
  if (rateLimitInfo.value && rateLimitInfo.value.tier === 'public' && (rateLimitInfo.value.remaining !== undefined && rateLimitInfo.value.remaining <= 0)) {
    return {
      agentId: 'rate-limit-exceeded' as AgentId, type: 'custom-component',
      data: 'RateLimitExceededPlaceholder', title: 'Daily Public Limit Reached', timestamp: Date.now()
    };
  }
  if (!currentPublicAgent.value && availablePublicAgents.value.length > 0) {
    return {
      agentId: 'public-welcome-placeholder' as AgentId, type: 'custom-component',
      data: 'PublicWelcomePlaceholder', title: 'Welcome to Voice AI Assistant', timestamp: Date.now()
    };
  }
  if (availablePublicAgents.value.length === 0 && !currentPublicAgent.value) {
    return {
      agentId: 'no-public-agents-placeholder' as AgentId, type: 'custom-component',
      data: 'NoPublicAgentsPlaceholder', title: 'Assistants Unavailable', timestamp: Date.now()
    };
  }
  if (currentPublicAgent.value?.isPublic && currentAgentViewComponent.value) {
      return null; // Dedicated view handles its own content
  }
  return currentPublicAgent.value ? chatStore.getCurrentMainContentDataForAgent(currentPublicAgent.value.id) : null;
});

const showEphemeralLogForCurrentAgent = computed(() => {
  return currentPublicAgent.value?.capabilities?.showEphemeralChatLog ?? true;
});

const fetchRateLimitInfo = async (): Promise<void> => {
  try {
    const response = await api.get('/rate-limit/status');
    if (response.data.tier === 'authenticated' && auth.isAuthenticated.value) {
      router.replace({ name: 'AuthenticatedHome' });
      return;
    }
    rateLimitInfo.value = {
      ...response.data,
      resetAt: response.data.resetAt ? new Date(response.data.resetAt) : new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  } catch (error: any) {
    console.error('[PublicHome] Failed to fetch rate limit info:', error.response?.data || error.message);
    rateLimitInfo.value = {
        tier: 'public',
        limit: parseInt(process.env.RATE_LIMIT_PUBLIC_DAILY || '20'),
        remaining: parseInt(process.env.RATE_LIMIT_PUBLIC_DAILY || '20'),
        used: 0,
        resetAt: new Date(Date.now() + 24*60*60*1000),
        message: "Could not fetch usage details. Using default limits."
    };
    toast?.add({type: 'warning', title:'Usage Info', message: 'Could not fetch public usage details. Default limits applied.'})
  }
};

const loadCurrentAgentSystemPrompt = async (): Promise<void> => {
  const agent = currentPublicAgent.value;
  const agentLabel = agent?.label || 'Public Agent';
  if (!agent) {
    currentSystemPromptText.value = "No agent selected. Please choose an assistant.";
    return;
  }

  // Skip loading prompt if agent handles its own input via dedicated view
  if (agent.capabilities?.handlesOwnInput && currentAgentViewComponent.value) {
    currentSystemPromptText.value = ''; // Or a minimal placeholder if needed
    console.log(`[PublicHome] Agent ${agentLabel} handles its own input, skipping general prompt load.`);
    return;
  }

  const systemPromptKey = agent.systemPromptKey;
  let defaultPromptText = `You are ${agentLabel}. As a public assistant, be helpful and concise.`;

  if (systemPromptKey) {
      try {
        console.log(`[PublicHome] Loading prompt for key: ${systemPromptKey}.md for agent: ${agentLabel}`);
        const promptResponse = await promptAPI.getPrompt(`${systemPromptKey}.md`);
        if (promptResponse.data && typeof promptResponse.data.content === 'string') {
            currentSystemPromptText.value = promptResponse.data.content;
        } else {
            currentSystemPromptText.value = defaultPromptText;
        }
      } catch (e: any) {
        console.error(`[PublicHome] Failed to load prompt "${systemPromptKey}.md" for agent "${agentLabel}":`, e.response?.data || e.message || e);
        currentSystemPromptText.value = defaultPromptText;
      }
  } else {
      console.warn(`[PublicHome] Agent "${agentLabel}" has no systemPromptKey defined. Using default prompt.`);
      currentSystemPromptText.value = defaultPromptText;
  }
};

const loadPublicAgentsAndSetDefault = async (): Promise<void> => {
  availablePublicAgents.value = agentService.getPublicAgents().filter(agent => agent.isPublic);
  if (availablePublicAgents.value.length > 0) {
    const currentAgentInStoreId = agentStore.activeAgentId;
    let agentToSet: IAgentDefinition | undefined;
    if (currentAgentInStoreId && availablePublicAgents.value.some(pa => pa.id === currentAgentInStoreId)) {
      agentToSet = agentService.getAgentById(currentAgentInStoreId);
    } else {
      agentToSet = agentService.getDefaultPublicAgent() || availablePublicAgents.value[0];
    }
    if (agentToSet && agentStore.activeAgentId !== agentToSet.id) {
      agentStore.setActiveAgent(agentToSet.id); // Watcher will trigger prompt load
    } else if (agentToSet) { // Agent is already set, ensure prompt and content are loaded
      await loadCurrentAgentSystemPrompt();
      chatStore.ensureMainContentForAgent(agentToSet.id);
    }
  } else {
    console.warn("[PublicHome] No publicly available agents found or configured.");
    if (agentStore.activeAgentId) agentStore.setActiveAgent(null);
  }
};

const selectPublicAgent = (agentId: AgentId): void => {
  const agent = availablePublicAgents.value.find(a => a.id === agentId);
  if (agent && agentStore.activeAgentId !== agentId) {
    agentStore.setActiveAgent(agentId);
  }
  showPublicAgentSelector.value = false;
};

watch(() => agentStore.activeAgentId, async (newAgentId, oldAgentId) => {
  if (newAgentId && newAgentId !== oldAgentId) {
    if (availablePublicAgents.value.some(pa => pa.id === newAgentId)) {
        isLoadingResponse.value = false; // Reset on agent switch
        isVoiceInputCurrentlyProcessingAudio.value = false;
        if(chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false);
        await loadCurrentAgentSystemPrompt();
        chatStore.ensureMainContentForAgent(newAgentId);
    } else if (newAgentId && !auth.isAuthenticated.value) { // Attempt to load a non-public agent on public page
        console.warn(`[PublicHome] Non-public agent (${newAgentId}) attempted activation. Resetting to default public agent.`);
        await loadPublicAgentsAndSetDefault(); // This will set a valid public agent
    }
  } else if (!newAgentId && availablePublicAgents.value.length === 0) { // No agent selected and no public agents
    currentSystemPromptText.value = "No public assistants are currently available.";
    chatStore.updateMainContent({ // Update main content to reflect this state
        agentId: 'no-public-agents-placeholder' as AgentId, type: 'custom-component',
        data: 'NoPublicAgentsPlaceholder', title: 'Assistants Unavailable', timestamp: Date.now()
    });
  } else if (newAgentId && newAgentId === oldAgentId ) { // Agent is same (e.g. on initial load after default set)
    const agent = agentService.getAgentById(newAgentId);
    if (agent && (!currentAgentViewComponent.value || !agent.capabilities?.handlesOwnInput)) {
      await loadCurrentAgentSystemPrompt();
    }
    chatStore.ensureMainContentForAgent(newAgentId);
  }
}, { immediate: true });


const handleTranscriptionFromLayout = async (transcriptionText: string): Promise<void> => {
  console.log("[PublicHome] handleTranscriptionFromLayout received:", `"${transcriptionText}"`);
  if (!transcriptionText.trim()) {
    console.log("[PublicHome] Transcription was empty or whitespace. Ignoring.");
    return;
  }
  const agent = currentPublicAgent.value;

  if (!agent) {
    toast?.add({ type: 'warning', title: 'No Assistant Selected', message: 'Please select an assistant to interact with.' });
    console.log("[PublicHome] No current public agent selected. Cannot process transcription.");
    return;
  }

  if (isLoadingResponse.value) {
    toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Please wait for the current response to complete before sending a new message.' });
    console.log("[PublicHome] Assistant is busy (isLoadingResponse is true). Transcription dropped.");
    return;
  }

  if (rateLimitInfo.value?.tier === 'public' && (rateLimitInfo.value.remaining ?? 1) <= 0) {
    toast?.add({ type: 'error', title: 'Daily Limit Reached', message: 'Public preview limit reached. Please log in for full access or try again later.'});
    chatStore.updateMainContent({
      agentId: 'rate-limit-exceeded' as AgentId, type: 'custom-component',
      data: 'RateLimitExceededPlaceholder', title: 'Daily Public Limit Reached', timestamp: Date.now()
    });
    console.log("[PublicHome] Rate limit reached. Transcription dropped.");
    return;
  }

  // Note: isVoiceInputCurrentlyProcessingAudio is set by the @voice-input-processing handler from UnifiedChatLayout.
  // We don't set it to true here, as this function is about *initiating* the LLM call *after* STT is done.
  // However, we set isLoadingResponse to true to indicate the LLM part of the cycle.

  isLoadingResponse.value = true; // Indicate LLM processing is starting

  try {
    if (agent.isPublic && agent.capabilities?.handlesOwnInput && currentAgentViewComponent.value && agentViewRef.value) {
      console.log(`[PublicHome] Agent ${agent.label} handles own input. Calling dedicated handler.`);
      if (typeof agentViewRef.value.handleNewUserInput === 'function') {
        await agentViewRef.value.handleNewUserInput(transcriptionText);
      } else if (typeof agentViewRef.value.processProblemContext === 'function') { // Example fallback
        await agentViewRef.value.processProblemContext(transcriptionText);
      } else {
        console.warn(`[PublicHome] Agent "${agent.label}" (ID: ${agent.id}) has 'handlesOwnInput' and a view, but no input handler method found. Falling back to standard chat.`);
        await standardLlmCallPublic(transcriptionText, agent);
      }
       // For dedicated handlers, they should manage their own internal loading states for content updates.
       // PublicHome's isLoadingResponse is for the main LLM call cycle if standardLlmCallPublic is used,
       // or it's reset after the dedicated handler promise resolves if it was a dedicated agent.
      isLoadingResponse.value = false; // Reset after dedicated handler is done.
    } else {
      console.log(`[PublicHome] Agent ${agent.label} uses standard LLM call.`);
      await standardLlmCallPublic(transcriptionText, agent);
      // standardLlmCallPublic will manage isLoadingResponse internally.
    }
  } catch (error: any) {
    console.error(`[PublicHome] Error during transcription handling for agent "${agent.label}":`, error);
    toast?.add({type: 'error', title: 'Processing Error', message: error.message || `An error occurred while processing your request for ${agent.label}.`});
    isLoadingResponse.value = false; // Ensure reset on general error
  } 
  // `isVoiceInputCurrentlyProcessingAudio` will be set to false by an event from VoiceInput when STT truly finishes its part.
  // We should not reset it here as STT might still be in a brief finalization phase.
  console.log(`[PublicHome] handleTranscriptionFromLayout finished for "${transcriptionText}". isLoadingResponse: ${isLoadingResponse.value}`);
};

async function standardLlmCallPublic(transcriptionText: string, agentInstance: IAgentDefinition) {
  const agentId = agentInstance.id;
  const agentLabel = agentInstance.label || 'Assistant';
  const userMessageTimestamp = Date.now();

  // isLoadingResponse should already be true if this function is called from handleTranscriptionFromLayout
  // If called directly, ensure it's set:
  if (!isLoadingResponse.value) isLoadingResponse.value = true;


  chatStore.addMessage({ role: 'user', content: transcriptionText, agentId: agentId, timestamp: userMessageTimestamp });

  const streamingPlaceholder = `Contacting ${agentLabel}...`;
    if (agentStore.activeAgentId === agentId) {
      chatStore.setMainContentStreaming(true, streamingPlaceholder);
      chatStore.updateMainContent({
          agentId, type: 'loading', data: streamingPlaceholder,
          title: `Contacting ${agentLabel}...`, timestamp: Date.now()
      });
  }

  try {
    // Ensure system prompt is loaded for general agents
    if (!agentInstance.capabilities?.handlesOwnInput || !currentAgentViewComponent.value) {
        // Conditional prompt loading: only if not already loaded or seems default
        if (!currentSystemPromptText.value || currentSystemPromptText.value.startsWith(`You are ${agentLabel}`)) {
            await loadCurrentAgentSystemPrompt(); // This updates currentSystemPromptText.value
            if (!currentSystemPromptText.value) { // Still no specific prompt after load
                throw new Error("System prompt could not be established for the agent.");
            }
        }
    }

    let finalSystemPrompt = currentSystemPromptText.value;
      if (!finalSystemPrompt.trim() && agentInstance.systemPromptKey) {
        console.warn(`[PublicHome] System prompt text was empty for ${agentLabel} after initial load attempt. Attempting to re-load or use default.`);
        await loadCurrentAgentSystemPrompt();
        finalSystemPrompt = currentSystemPromptText.value;
        if (!finalSystemPrompt.trim()) {
            finalSystemPrompt = `You are ${agentLabel}. ${agentInstance.description || 'Provide helpful assistance.'}`;
        }
    } else if (!finalSystemPrompt.trim()) { // If no key and text is empty, use a very basic default
        finalSystemPrompt = `You are ${agentLabel}. ${agentInstance.description || 'Provide helpful assistance.'}`;
    }


    finalSystemPrompt = finalSystemPrompt
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified')
      .replace(/{{MODE}}/g, agentId)
      .replace(/{{GENERATE_DIAGRAM}}/g, ((agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams) ?? false).toString())
      .replace(/{{USER_QUERY}}/g, transcriptionText) // This might be redundant if user query is part of messages
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'You are in a public preview mode. Be helpful but concise. Avoid offering actions you cannot perform like file access. Keep responses relatively short.');

    const historyConfig: Partial<AdvancedHistoryConfig> = {
      maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 1800 : (agentInstance.capabilities?.maxChatHistory || 2) * 100, // Shorter context for public
      numRecentMessagesToPrioritize: agentInstance.capabilities?.maxChatHistory || 2,
      simpleRecencyMessageCount: agentInstance.capabilities?.maxChatHistory || 2, // Fallback for simple history
    };
    const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(agentId, transcriptionText, finalSystemPrompt, historyConfig);
    
    let messagesForApiPayload: ChatMessageFE[] = historyForApi.map(hMsg => ({
        role: hMsg.role, content: hMsg.content, timestamp: hMsg.timestamp, agentId: hMsg.agentId,
        name: (hMsg as any).name, tool_calls: (hMsg as any).tool_calls, tool_call_id: (hMsg as any).tool_call_id,
    }));

    // Ensure the current user message is the last user message if not already perfectly captured by history processing
    if (!messagesForApiPayload.some(m => m.role === 'user' && m.content === transcriptionText && m.timestamp === userMessageTimestamp)) {
        messagesForApiPayload.push({ role: 'user', content: transcriptionText, timestamp: userMessageTimestamp, agentId });
    }
    messagesForApiPayload.sort((a,b) => (a.timestamp || 0) - (b.timestamp || 0));


    const payload: ChatMessagePayloadFE = {
      messages: messagesForApiPayload,
      mode: agentInstance.systemPromptKey || agentId, // Use systemPromptKey if available, else agentId as mode
      systemPromptOverride: finalSystemPrompt,
      language: voiceSettingsManager.settings.preferredCodingLanguage,
      generateDiagram: agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: auth.sessionUserId.value || `public_session_${Date.now().toString(36)}`,
      conversationId: chatStore.getCurrentConversationId(agentId),
      stream: true, // Always stream for public home
    };
    console.log("[PublicHome] Sending payload to chatAPI.sendMessageStream:", JSON.stringify(payload, null, 0).substring(0,300) + "...");

    let accumulatedResponse = "";
    await chatAPI.sendMessageStream(
      payload,
      (chunk: string) => { // onChunkReceived
        accumulatedResponse += chunk;
        if (agentStore.activeAgentId === agentId) { // Check if agent is still active
          chatStore.updateMainContent({
            agentId: agentId,
            type: agentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: accumulatedResponse + "▋", // Add streaming cursor
            title: `${agentLabel} Responding...`,
            timestamp: Date.now()
          });
        }
      },
      async () => { // onStreamEnd
        chatStore.setMainContentStreaming(false);
        const finalContent = accumulatedResponse.trim();
        if (agentStore.activeAgentId === agentId) {
          chatStore.addMessage({ role: 'assistant', content: finalContent, agentId: agentId, model:"StreamedModel (Public)", timestamp: Date.now() });
          chatStore.updateMainContent({
            agentId: agentId,
            type: agentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: finalContent, title: `${agentLabel} Response`, timestamp: Date.now()
          });
        }
        await fetchRateLimitInfo(); // Update rate limit info after successful interaction
        isLoadingResponse.value = false;
        // isVoiceInputCurrentlyProcessingAudio will be set by VoiceInput component
      },
      async (error: Error | any) => { // onStreamError
        console.error(`[PublicHome] Chat Stream API error for agent "${agentLabel}":`, error);
        const errorMsg = error.message || 'An error occurred during the stream.';
        if (agentStore.activeAgentId === agentId) {
          chatStore.addMessage({ role: 'error', content: `Stream Error: ${errorMsg}`, agentId, timestamp: Date.now() });
          chatStore.updateMainContent({
            agentId, type: 'error',
            data: `### ${agentLabel} Stream Error\n${errorMsg}`,
            title: `Error Processing Request with ${agentLabel}`, timestamp: Date.now()
          });
        }
        chatStore.setMainContentStreaming(false);
        await fetchRateLimitInfo(); // Still fetch rate limit info on error
        isLoadingResponse.value = false;
        // isVoiceInputCurrentlyProcessingAudio will be set by VoiceInput component
      }
    );
  } catch (error: any) {
    console.error(`[PublicHome] Chat API interaction setup error for agent "${agentLabel}":`, error.response?.data || error.message || error);
    const errorMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
    if (agentStore.activeAgentId === agentId) { // Check if agent is still active
        chatStore.addMessage({ role: 'error', content: `Interaction Error: ${errorMsg}`, agentId, timestamp: Date.now() });
        chatStore.updateMainContent({
            agentId, type: 'error',
            data: `### ${agentLabel} Interaction Error\n${errorMsg}`,
            title: `Error Communicating with ${agentLabel}`, timestamp: Date.now()
        });
    }
    isLoadingResponse.value = false; // Critical: reset loading state
    // isVoiceInputCurrentlyProcessingAudio will be set by VoiceInput component
    chatStore.setMainContentStreaming(false);
    // Check for 429 specifically from the error object if possible
    if (error.response?.status === 429 || error.message?.includes('429')) {
        await fetchRateLimitInfo(); // Update UI with rate limit exceeded status
        chatStore.updateMainContent({ // Explicitly set rate limit exceeded view
            agentId: 'rate-limit-exceeded' as AgentId, type: 'custom-component',
            data: 'RateLimitExceededPlaceholder', title: 'Daily Public Limit Reached', timestamp: Date.now()
        });
    }
  }
}


const formatResetTime = (dateInput?: string | Date): string => {
  if (!dateInput) return 'soon';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'shortly'; // Invalid date
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
};

const handleClickOutsidePublicAgentSelector = (event: MouseEvent) => {
  if (publicAgentSelectorDropdownRef.value && !publicAgentSelectorDropdownRef.value.contains(event.target as Node)) {
    showPublicAgentSelector.value = false;
  }
};
let rateLimitIntervalId: number | undefined;

onMounted(async () => {
  document.addEventListener('click', handleClickOutsidePublicAgentSelector, true);
  await auth.checkAuthStatus(); // Check auth status first
  if (auth.isAuthenticated.value) { // If authenticated, redirect to private home
    router.replace({ name: 'AuthenticatedHome' });
    return; // Stop further execution for public home
  }
  
  // If not authenticated, proceed with public home setup
  await fetchRateLimitInfo();
  // Only load public agents if not authenticated and not already redirected
  if (!auth.isAuthenticated.value && rateLimitInfo.value?.tier !== 'authenticated') {
    await loadPublicAgentsAndSetDefault();
    rateLimitIntervalId = window.setInterval(fetchRateLimitInfo, 60000 * 5); // Refresh rate limit every 5 mins
  }
});

onUnmounted(() => {
  if (rateLimitIntervalId) clearInterval(rateLimitIntervalId);
  document.removeEventListener('click', handleClickOutsidePublicAgentSelector, true);
});

</script>

<template>
  <div class="public-home-view-ephemeral">
    <UnifiedChatLayout
      :is-voice-input-processing="isVoiceInputCurrentlyProcessingAudio"
      :show-ephemeral-log="showEphemeralLogForCurrentAgent"
      :current-agent-input-placeholder="currentPublicAgent?.inputPlaceholder || 'Type your message or use voice (public preview)...'"
      @transcription="handleTranscriptionFromLayout"
      @voice-input-processing="(status: boolean) => { isVoiceInputCurrentlyProcessingAudio = status; }"
    >
      <template #above-main-content>
        <div v-if="availablePublicAgents.length > 0 && (!rateLimitInfo || (rateLimitInfo.remaining === undefined || rateLimitInfo.remaining > 0) || rateLimitInfo.tier === 'authenticated')"
             class="public-agent-selector-area-ephemeral">
          <p v-if="availablePublicAgents.length > 1" class="selector-title-ephemeral">Select an Assistant:</p>
          <div class="relative inline-block text-left" ref="publicAgentSelectorDropdownRef">
            <button @click="showPublicAgentSelector = !showPublicAgentSelector"
                    class="agent-selector-button-ephemeral"
                    aria-haspopup="true" :aria-expanded="showPublicAgentSelector"
                    aria-controls="public-agent-select-dropdown">
              <component :is="currentPublicAgent?.iconComponent || UserGroupIcon" class="selected-agent-icon" :class="currentPublicAgent?.iconClass" aria-hidden="true" />
              <span>{{ currentPublicAgent?.label || (availablePublicAgents.length > 0 ? 'Choose Assistant' : 'No Assistants Available') }}</span>
              <ChevronDownIcon class="chevron-icon" :class="{'open': showPublicAgentSelector}" aria-hidden="true" />
            </button>
            <Transition name="dropdown-float-neomorphic">
              <div v-if="showPublicAgentSelector" id="public-agent-select-dropdown" class="agent-selector-dropdown-panel-ephemeral" role="menu">
                <div class="dropdown-header-holographic"><h3 class="dropdown-title">Public Assistants</h3></div>
                <div class="dropdown-content-holographic custom-scrollbar-thin">
                  <button
                    v-for="agentDef in availablePublicAgents" :key="agentDef.id"
                    @click="selectPublicAgent(agentDef.id)"
                    class="dropdown-item-holographic"
                    :class="{ 'active': currentPublicAgent?.id === agentDef.id }"
                    role="menuitemradio" :aria-checked="currentPublicAgent?.id === agentDef.id">
                    <div class="mode-icon-dd-holographic" :class="agentDef.iconClass" aria-hidden="true">
                        <component :is="agentDef.iconComponent || SparklesIcon" class="icon-base" />
                    </div>
                    <span class="dropdown-item-label">{{ agentDef.label }}</span>
                    <CheckOutlineIcon v-if="currentPublicAgent?.id === agentDef.id" class="icon-sm checkmark-icon-active" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </template>

      <template #main-content>
        <component
          :is="currentAgentViewComponent"
          v-if="currentPublicAgent && currentPublicAgent.isPublic && currentAgentViewComponent && typeof currentAgentViewComponent !== 'string'"
          :key="currentPublicAgent.id + '-dedicated-public-ui'"
          ref="agentViewRef" 
          :agent-id="currentPublicAgent.id"
          :agent-config="currentPublicAgent"
          class="dedicated-agent-view h-full w-full"
          @agent-event="() => {}" />
        <div v-else-if="mainContentData?.type === 'custom-component' && mainContentData.data === 'RateLimitExceededPlaceholder'"
             class="rate-limit-banner-ephemeral">
          <ExclamationTriangleIcon class="banner-icon-ephemeral" aria-hidden="true" />
          <h3 class="banner-title-ephemeral">Daily Public Preview Limit Reached</h3>
          <p class="banner-text-ephemeral">
            Thank you for trying our public preview! You've reached the daily interaction limit.
            Access will reset around <strong>{{ formatResetTime(rateLimitInfo?.resetAt) }}</strong>.
          </p>
          <RouterLink to="/login" class="login-prompt-link-ephemeral btn btn-primary-ephemeral btn-sm">
            <KeyIcon class="icon-sm mr-1.5" aria-hidden="true" /> Log In for Full Access
          </RouterLink>
        </div>
        <div v-else-if="mainContentData?.type === 'custom-component' && mainContentData.data === 'PublicWelcomePlaceholder'"
             class="public-welcome-placeholder-ephemeral">
          <BuildingStorefrontIcon class="hero-icon-ephemeral" aria-hidden="true" />
          <h2 class="welcome-title-ephemeral">Welcome to Voice AI Assistant</h2>
          <p class="welcome-subtitle-ephemeral">
            This is a public preview. {{ availablePublicAgents.length > 1 ? 'Select an assistant above to begin.' : (currentPublicAgent ? `You are interacting with ${currentPublicAgent.label}.` : 'Use the default assistant to begin.') }}
            Interactions are rate-limited for public users. For unlimited access and more features, please <RouterLink to="/login" class="link-ephemeral">log in or sign up</RouterLink>.
          </p>
        </div>
        <div v-else-if="mainContentData?.type === 'custom-component' && mainContentData.data === 'NoPublicAgentsPlaceholder'"
             class="public-welcome-placeholder-ephemeral">
            <UserGroupIcon class="hero-icon-ephemeral no-agents-icon" aria-hidden="true" />
            <h2 class="welcome-title-ephemeral">Assistants Currently Unavailable</h2>
            <p class="welcome-subtitle-ephemeral">
                We're sorry, but there are no public assistants configured for preview at this moment. Please check back later or <RouterLink to="/login" class="link-ephemeral">log in</RouterLink> for access to private assistants.
            </p>
        </div>

        <MainContentView :agent="currentPublicAgent" class="main-content-view-wrapper-ephemeral default-agent-mcv h-full w-full"
                           v-else-if="currentPublicAgent && mainContentData && mainContentData.type !== 'custom-component'">
          <CompactMessageRenderer
            v-if="currentPublicAgent?.capabilities?.usesCompactRenderer && (mainContentData.type === 'compact-message-renderer-data' || (mainContentData.type === 'markdown' && !chatStore.isMainContentStreaming))"
            :content="mainContentData.data"
            :mode="currentPublicAgent.id"
            class="content-renderer-ephemeral"
          />
          <div v-else-if="mainContentData.type === 'markdown' || mainContentData.type === 'welcome'"
               class="prose-ephemeral content-renderer-ephemeral"
               v-html="chatStore.isMainContentStreaming && (mainContentData.type === 'markdown') && chatStore.getCurrentMainContentDataForAgent(currentPublicAgent.id)?.agentId === currentPublicAgent.id ?
                       chatStore.streamingMainContentText + '<span class=\'streaming-cursor-ephemeral\'>▋</span>' :
                       mainContentData.data"
               aria-atomic="true">
          </div>
            <div v-else-if="mainContentData.type === 'loading'"
               class="prose-ephemeral content-renderer-ephemeral" 
               v-html="mainContentData.data + (chatStore.isMainContentStreaming ? '<span class=\'streaming-cursor-ephemeral\'>▋</span>' : '')"
               aria-atomic="true">
          </div>
          <div v-else-if="mainContentData.type === 'error'"
               class="prose-ephemeral prose-error content-renderer-ephemeral"
               v-html="mainContentData.data"
               aria-atomic="true">
          </div>
          <div v-else class="content-renderer-ephemeral text-[var(--color-text-muted)] italic p-6 text-center">
            <p class="text-lg">Interacting with {{ currentPublicAgent.label }}.</p>
            <p class="text-sm mt-2">(Displaying content type: {{ mainContentData.type }})</p>
          </div>
        </MainContentView>

        <div v-else-if="isLoadingResponse && !mainContentData" class="loading-placeholder-ephemeral">
          <div class="loading-animation-content">
            <div class="loading-spinner-ephemeral !w-12 !h-12"><div v-for="i in 8" :key="`blade-${i}`" class="spinner-blade-ephemeral !w-1.5 !h-4"></div></div>
            <p class="loading-text-ephemeral !text-base mt-3">Loading Assistant...</p>
          </div>
        </div>
         <div v-else class="public-welcome-placeholder-ephemeral"> <SparklesIcon class="hero-icon-ephemeral !text-[var(--color-text-muted)]" />
            <h2 class="welcome-title-ephemeral">Initializing Public Interface</h2>
            <p class="welcome-subtitle-ephemeral">Please wait a moment. Assistants are loading...</p>
        </div>
      </template>
    </UnifiedChatLayout>
  </div>
</template>

<style lang="scss">
// Styles for PublicHome are in frontend/src/styles/views/_public-home.scss
.dedicated-agent-view { // Ensure dedicated views fill space
  height: 100%;
  width: 100%;
  overflow: auto; // Or hidden, depending on internal scrolling of agent view
}
.default-agent-mcv { // Ensure default view also fills space
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}
// .content-renderer-container-ephemeral { // Ensure this exists if used by default MainContentView structure
//     flex-grow: 1;
//     overflow-y: auto;
// }
</style>