// File: frontend/src/views/PublicHome.vue
/**
 * @file PublicHome.vue
 * @description Public-facing home page using UnifiedChatLayout.
 * Features rate limiting, public agent selection, themed placeholders, API-driven prompt loading,
 * and dynamic loading of custom agent views if specified for public agents.
 * @version 3.4.1 - Ensured all original code sections are complete and fixes are integrated.
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject, watch, defineAsyncComponent, type Component as VueComponentType } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import {
  api, // Base axios instance
  chatAPI,
  promptAPI, // For consistent prompt loading
  type ChatMessagePayloadFE,
  type ProcessedHistoryMessageFE,
  type ChatMessageFE,
  // type TextResponseDataFE, // Not directly used here for non-streaming TextResponseDataFE
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
  ExclamationTriangleIcon, CheckIcon as CheckOutlineIcon, // Renamed to avoid conflict if solid CheckIcon is also used
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline';

interface RateLimitInfo {
  tier: 'public' | 'authenticated';
  ip?: string;
  used?: number;
  limit?: number;
  remaining?: number;
  resetAt?: string | Date; // Date object after fetching
  message?: string;
}

const router = useRouter();
const toast = inject<ToastService>('toast');
const agentStore = useAgentStore();
const chatStore = useChatStore();
const auth = useAuth();

const availablePublicAgents = ref<IAgentDefinition[]>([]);
const currentPublicAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);
const agentViewRef = ref<any>(null); // For dedicated agent views, if any public agent uses one

// Dynamically load agent-specific view components for public agents
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
            return null; // Fallback, will use MainContentView
          })
      );
    } catch (e) {
      console.error(`[PublicHome] Synchronous error setting up dynamic import for public agent view: ${componentName}`, e);
      toast?.add({ type: 'error', title: 'UI Setup Error', message: `Error preparing interface for ${agentLabel}.` });
      return null;
    }
  }
  return null; // No specific view component for this public agent, or it's not public, or no componentName
});


const showPublicAgentSelector = ref(false);
const publicAgentSelectorDropdownRef = ref<HTMLElement | null>(null);

const isLoadingResponse = ref(false);
const isVoiceInputCurrentlyProcessing = ref(false);
const currentSystemPromptText = ref(''); // Stores the loaded system prompt text for the current public agent
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
  // If a dedicated view component is loaded for a public agent, it handles its own content.
  if (currentPublicAgent.value?.isPublic && currentAgentViewComponent.value) {
      return null;
  }
  // Otherwise, use chatStore for main content data.
  return currentPublicAgent.value ? chatStore.getCurrentMainContentDataForAgent(currentPublicAgent.value.id) : null;
});

const showEphemeralLogForCurrentAgent = computed(() => {
  return currentPublicAgent.value?.capabilities?.showEphemeralChatLog ?? true;
});

const fetchRateLimitInfo = async (): Promise<void> => {
  try {
    const response = await api.get('/rate-limit/status');
    if (response.data.tier === 'authenticated' && auth.isAuthenticated.value) {
      router.replace({ name: 'AuthenticatedHome' }); // Ensure 'AuthenticatedHome' is the correct route name
      return;
    }
    rateLimitInfo.value = {
      ...response.data,
      resetAt: response.data.resetAt ? new Date(response.data.resetAt) : new Date(Date.now() + 24 * 60 * 60 * 1000) // Default to 24h if resetAt is missing
    };
  } catch (error: any) {
    console.error('[PublicHome] Failed to fetch rate limit info:', error.response?.data || error.message);
    // Optionally, inform the user that usage info is unavailable, but avoid being too noisy.
    // toast?.add({ type: 'warning', title: 'Usage Info Unavailable', message: 'Could not retrieve public usage details.' });
  }
};

const loadCurrentAgentSystemPrompt = async (): Promise<void> => {
  const agent = currentPublicAgent.value;
  const agentLabel = agent?.label || 'Public Agent';
  if (!agent) {
    currentSystemPromptText.value = "No agent selected. Please choose an assistant.";
    return;
  }

  const systemPromptKey = agent.systemPromptKey; // This is a required field in IAgentDefinition
  let defaultPromptText = `You are ${agentLabel}. As a public assistant, be helpful but concise.`;

  // systemPromptKey should always exist as per IAgentDefinition, but defensive check:
  if (systemPromptKey) {
      try {
          console.log(`[PublicHome] Attempting to load prompt for key: ${systemPromptKey}.md for agent: ${agentLabel}`);
          const promptResponse = await promptAPI.getPrompt(`${systemPromptKey}.md`); // Keys should not include .md typically
          if (promptResponse.data && typeof promptResponse.data.content === 'string') {
              currentSystemPromptText.value = promptResponse.data.content;
              console.log(`[PublicHome] Successfully loaded prompt for ${agentLabel} using key ${systemPromptKey}.`);
          } else {
              console.warn(`[PublicHome] Prompt content for "${systemPromptKey}.md" (agent: ${agentLabel}) was not a string or was missing. Using default description for system prompt.`);
              currentSystemPromptText.value = defaultPromptText;
          }
      } catch (e: any) {
          console.error(`[PublicHome] Failed to load prompt "${systemPromptKey}.md" via API for agent "${agentLabel}":`, e.response?.data || e.message || e);
          toast?.add({ type: 'warning', title: 'Prompt Load Warning', message: `Could not load specific instructions for ${agentLabel}. Using general behavior.` });
          currentSystemPromptText.value = defaultPromptText;
      }
  } else {
      // This case should ideally not happen if agent definitions are correct.
      console.warn(`[PublicHome] Agent "${agentLabel}" has no systemPromptKey defined in its configuration. Using default prompt.`);
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
      agentToSet = agentService.getDefaultPublicAgent() || // Uses the improved logic in agentService
                   availablePublicAgents.value[0]; // Fallback to the first available public agent
    }

    if (agentToSet && agentStore.activeAgentId !== agentToSet.id) {
      agentStore.setActiveAgent(agentToSet.id); // Watcher on activeAgentId will handle prompt loading and content
    } else if (agentToSet) { // Agent is already active, ensure prompt and content are loaded
      await loadCurrentAgentSystemPrompt();
      chatStore.ensureMainContentForAgent(agentToSet.id);
    }
  } else {
    console.warn("[PublicHome] No publicly available agents found or configured.");
    if (agentStore.activeAgentId) agentStore.setActiveAgent(null); // Clear active agent if no public ones are available
    // mainContentData computed property will show NoPublicAgentsPlaceholder
  }
};

const selectPublicAgent = (agentId: AgentId): void => {
  const agent = availablePublicAgents.value.find(a => a.id === agentId);
  if (agent && agentStore.activeAgentId !== agentId) {
    // Data for the previous agent is typically cleared by store logic or component lifecycle.
    // Explicit clearing (chatStore.clearAgentData) could be done here if strict separation is needed on switch.
    agentStore.setActiveAgent(agentId); // Watcher will handle the rest (prompt loading, content ensuring)
  }
  showPublicAgentSelector.value = false;
};


watch(() => agentStore.activeAgentId, async (newAgentId, oldAgentId) => {
  if (newAgentId && newAgentId !== oldAgentId) {
    // Check if this newAgentId corresponds to a known public agent for this view
    if (availablePublicAgents.value.some(pa => pa.id === newAgentId)) {
        isLoadingResponse.value = false;
        isVoiceInputCurrentlyProcessing.value = false;
        if(chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false);
        
        await loadCurrentAgentSystemPrompt(); // Load/reload prompt for the newly selected agent
        chatStore.ensureMainContentForAgent(newAgentId);
    } else if (newAgentId && !auth.isAuthenticated.value) { 
        // If a non-public agent ID somehow gets set while in public home (e.g. store persistence issue, or direct URL manipulation)
        console.warn(`[PublicHome] A non-public agent (${newAgentId}) was attempted to be activated in PublicHome. Attempting to reset to a default public agent.`);
        await loadPublicAgentsAndSetDefault(); // This will try to set a valid public agent
    }
  } else if (!newAgentId && availablePublicAgents.value.length === 0) {
    // This case means no agent is active AND no public agents are configured.
    currentSystemPromptText.value = "No public assistants are currently available.";
    // mainContentData will handle showing the 'NoPublicAgentsPlaceholder'
  } else if (newAgentId && newAgentId === oldAgentId && !currentSystemPromptText.value) {
    // This can happen on initial mount if an agent is already set but its prompt hasn't been loaded yet.
    // The immediate watcher will trigger this.
    await loadCurrentAgentSystemPrompt();
    chatStore.ensureMainContentForAgent(newAgentId);
  }
}, { immediate: true }); // Immediate to run on component mount


const handleTranscriptionFromLayout = async (transcriptionText: string): Promise<void> => {
  if (!transcriptionText.trim()) return;
  const agent = currentPublicAgent.value; // Use local const for stability within this async function
  if (!agent) {
    toast?.add({ type: 'warning', title: 'No Assistant Selected', message: 'Please select an assistant to interact with.' });
    return;
  }
  if (isLoadingResponse.value) {
    toast?.add({ type: 'info', title: 'Processing', message: 'Please wait for the current response to complete.' });
    return;
  }

  if (rateLimitInfo.value?.tier === 'public' && (rateLimitInfo.value.remaining ?? 1) <= 0) {
    toast?.add({ type: 'error', title: 'Daily Limit Reached', message: 'Public preview limit reached. Please log in for full access or try again later.'});
    chatStore.updateMainContent({ // Update main view to reflect this state
      agentId: 'rate-limit-exceeded' as AgentId, type: 'custom-component',
      data: 'RateLimitExceededPlaceholder', title: 'Daily Public Limit Reached', timestamp: Date.now()
    });
    return;
  }

  // Set loading states
  isVoiceInputCurrentlyProcessing.value = true; // For UnifiedChatLayout visual state if it uses this
  isLoadingResponse.value = true;

  // If agent has a dedicated view component and handles its own input
  if (agent.isPublic && agent.capabilities?.handlesOwnInput && currentAgentViewComponent.value && agentViewRef.value) {
    try {
      if (typeof agentViewRef.value.processProblemContext === 'function') {
        await agentViewRef.value.processProblemContext(transcriptionText);
      } else if (typeof agentViewRef.value.handleNewUserInput === 'function') {
        await agentViewRef.value.handleNewUserInput(transcriptionText);
      } else {
        console.warn(`[PublicHome] Public Agent "${agent.label}" (ID: ${agent.id}) has 'handlesOwnInput' and a view, but no input handler method found. Falling back to standard chat.`);
        await standardLlmCallPublic(transcriptionText, agent);
      }
    } catch (error: any) {
      console.error(`[PublicHome] Error in public agent's ("${agent.label}") custom input handler:`, error);
      toast?.add({type: 'error', title: `${agent.label} Error`, message: error.message || `Agent "${agent.label}" encountered an issue processing your input.`});
      isLoadingResponse.value = false; // Reset as fallback
    } finally {
      // Agent view should manage its isLoadingResponse. isVoiceInputCurrentlyProcessing can be reset here.
      isVoiceInputCurrentlyProcessing.value = false;
    }
  } else {
    // Standard LLM call for public agents without dedicated input handlers or if setup failed
    await standardLlmCallPublic(transcriptionText, agent);
  }
};

/**
 * Handles the standard LLM call for public agents.
 * @param {string} transcriptionText - The user's input.
 * @param {IAgentDefinition} agentInstance - The current public agent's definition.
 */
async function standardLlmCallPublic(transcriptionText: string, agentInstance: IAgentDefinition) {
    const agentId = agentInstance.id;
    const agentLabel = agentInstance.label || 'Assistant';

    chatStore.addMessage({ role: 'user', content: transcriptionText, agentId: agentId, timestamp: Date.now() });
    // isLoadingResponse and isVoiceInputCurrentlyProcessing are set by the caller (handleTranscriptionFromLayout)

    const streamingPlaceholder = `Contacting ${agentLabel}...`;
    chatStore.updateMainContent({ // Update main display area with loading state
        agentId, type: 'loading', data: streamingPlaceholder,
        title: `Contacting ${agentLabel}...`, timestamp: Date.now()
    });
    chatStore.setMainContentStreaming(true, streamingPlaceholder);

    try {
        // currentSystemPromptText should be populated by the watcher or loadCurrentAgentSystemPrompt call
        if (!currentSystemPromptText.value || currentSystemPromptText.value.startsWith("No agent selected")) {
            await loadCurrentAgentSystemPrompt(); // Ensure it's loaded if somehow missed
            if (!currentSystemPromptText.value || currentSystemPromptText.value.startsWith("No agent selected")) {
                // This is a critical failure if prompt cannot be established
                throw new Error("System prompt for the agent could not be loaded or established.");
            }
        }
        
        const historyConfig: Partial<AdvancedHistoryConfig> = {
          maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 1800 : (agentInstance.capabilities?.maxChatHistory || 2) * 100, // Adjusted multiplier
          numRecentMessagesToPrioritize: agentInstance.capabilities?.maxChatHistory || 2,
          simpleRecencyMessageCount: agentInstance.capabilities?.maxChatHistory || 2, // Keep this relatively small for public
        };
        const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(
          agentId, transcriptionText, currentSystemPromptText.value, historyConfig
        );

        let messagesForApiPayload: ChatMessageFE[] = historyForApi.map(hMsg => ({
            role: hMsg.role, content: hMsg.content, timestamp: hMsg.timestamp,
            tool_call_id: (hMsg as any).tool_call_id, tool_calls: (hMsg as any).tool_calls, name: (hMsg as any).name,
        }));
        if (!messagesForApiPayload.some(m => m.role === 'user' && m.content === transcriptionText)) { // Ensure current message is included
            messagesForApiPayload.push({ role: 'user', content: transcriptionText, timestamp: Date.now()});
        }
        messagesForApiPayload.sort((a,b) => (a.timestamp || 0) - (b.timestamp || 0)); // Ensure chronological order

        let finalSystemPromptText = (currentSystemPromptText.value) // Already loaded prompt
          .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified')
          .replace(/{{MODE}}/g, agentId) // Contextual agent ID
          .replace(/{{GENERATE_DIAGRAM}}/g, ((agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams) ?? false).toString())
          .replace(/{{USER_QUERY}}/g, transcriptionText) // Some prompts might use this directly
          .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'You are in a public preview mode. Be helpful but concise. Avoid offering actions you cannot perform like file access. Keep responses relatively short.');

        const payload: ChatMessagePayloadFE = {
          messages: messagesForApiPayload, // System prompt is now part of systemPromptOverride
          mode: agentInstance.systemPromptKey, // Key for backend to select model/base prompt context
          systemPromptOverride: finalSystemPromptText,
          language: voiceSettingsManager.settings.preferredCodingLanguage,
          generateDiagram: agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
          userId: rateLimitInfo.value?.ip || `public_user_${Date.now().toString(36)}`, // Use IP if available, else a unique string
          conversationId: chatStore.getCurrentConversationId(agentId), // Get or create conversation ID
          stream: true,
        };

        let accumulatedResponse = "";
        await chatAPI.sendMessageStream(
          payload,
          (chunk: string) => {
              accumulatedResponse += chunk;
              if (agentStore.activeAgentId === agentId) { // Check agent is still active
                  chatStore.updateMainContent({
                      agentId: agentId,
                      type: agentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                      data: accumulatedResponse + "▋", // Add streaming cursor
                      title: `${agentLabel} Responding...`,
                      timestamp: Date.now()
                  });
              }
          },
          async () => { /* onStreamEnd */
              chatStore.setMainContentStreaming(false);
              const finalContent = accumulatedResponse.trim();
              const currentActiveAgent = agentStore.activeAgent; // Use store's current agent
              if (currentActiveAgent && currentActiveAgent.id === agentId) {
                  chatStore.addMessage({ role: 'assistant', content: finalContent, agentId: agentId, model: "StreamedModel (Public)", timestamp: Date.now() });
                  chatStore.updateMainContent({
                      agentId: agentId,
                      type: currentActiveAgent.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                      data: finalContent, title: `${agentLabel} Response`, timestamp: Date.now()
                  });
              }
              await fetchRateLimitInfo(); // Update rate limit after successful interaction
              isLoadingResponse.value = false;
              isVoiceInputCurrentlyProcessing.value = false;
          },
          async (error: Error | any) => { /* onStreamError */
              console.error(`[PublicHome] Chat Stream API error for agent "${agentLabel}":`, error);
              const errorMsg = error.message || 'An error occurred during the stream.';
              const currentActiveAgentOnError = agentStore.activeAgent; // Check current agent from store
              if (currentActiveAgentOnError && currentActiveAgentOnError.id === agentId) {
                  chatStore.addMessage({ role: 'error', content: `Stream Error: ${errorMsg}`, agentId, timestamp: Date.now() });
                  chatStore.updateMainContent({
                      agentId, type: 'error', // Consistent 'error' type for main content
                      data: `### ${agentLabel} Stream Error\n${errorMsg}`,
                      title: `Error Processing Request with ${agentLabel}`, timestamp: Date.now()
                  });
              }
              chatStore.setMainContentStreaming(false);
              await fetchRateLimitInfo(); // Fetch rate limit even on error
              isLoadingResponse.value = false;
              isVoiceInputCurrentlyProcessing.value = false;
          }
        );
    } catch (error: any) { /* General catch for setup or non-stream API issues */
        console.error(`[PublicHome] Chat API interaction error for agent "${agentLabel}":`, error.response?.data || error.message);
        const errorMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
        const currentActiveAgentOnError = agentStore.activeAgent; // Check current agent from store
        if (currentActiveAgentOnError && currentActiveAgentOnError.id === agentId) {
            chatStore.addMessage({ role: 'error', content: `Interaction Error: ${errorMsg}`, agentId, timestamp: Date.now() });
            chatStore.updateMainContent({
                agentId, type: 'error', // Consistent 'error' type
                data: `### ${agentLabel} Interaction Error\n${errorMsg}`,
                title: `Error Communicating with ${agentLabel}`, timestamp: Date.now()
            });
        }
        isLoadingResponse.value = false;
        isVoiceInputCurrentlyProcessing.value = false;
        chatStore.setMainContentStreaming(false);
        if (error.response?.status === 429 || error.message?.includes('429')) { // More robust check for rate limit error
            await fetchRateLimitInfo(); // Refresh rate limit info
            chatStore.updateMainContent({
                agentId: 'rate-limit-exceeded' as AgentId, type: 'custom-component',
                data: 'RateLimitExceededPlaceholder', title: 'Daily Public Limit Reached', timestamp: Date.now()
            });
        }
    }
}


const formatResetTime = (dateInput?: string | Date): string => {
  if (!dateInput) return 'soon';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'shortly';
  // Example: "3:45 PM PDT" - Adjust options as needed for your locale
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
};

const handleClickOutsidePublicAgentSelector = (event: MouseEvent) => {
  if (publicAgentSelectorDropdownRef.value && !publicAgentSelectorDropdownRef.value.contains(event.target as Node)) {
    showPublicAgentSelector.value = false;
  }
};
let rateLimitInterval: number | undefined;

onMounted(async () => {
  document.addEventListener('click', handleClickOutsidePublicAgentSelector, true);
  await auth.checkAuthStatus(); // Check auth status first
  if (auth.isAuthenticated.value) {
    router.replace({ name: 'AuthenticatedHome' }); // Redirect if already authenticated
    return;
  }
  
  await fetchRateLimitInfo();
  // Only load public agents and set interval if not authenticated (already checked by redirect)
  // and tier is not 'authenticated' (double check if rateLimitInfo is already fetched and not null)
  if (!auth.isAuthenticated.value && rateLimitInfo.value?.tier !== 'authenticated') {
    await loadPublicAgentsAndSetDefault(); // This now calls loadCurrentAgentSystemPrompt internally if agent is set
    rateLimitInterval = window.setInterval(fetchRateLimitInfo, 60000 * 5); // Check rate limit every 5 minutes
  }
});

onUnmounted(() => {
  if (rateLimitInterval) clearInterval(rateLimitInterval);
  document.removeEventListener('click', handleClickOutsidePublicAgentSelector, true);
});

</script>

<template>
  <div class="public-home-view-ephemeral">
    <UnifiedChatLayout
      :is-voice-input-processing="isVoiceInputCurrentlyProcessing"
      :show-ephemeral-log="showEphemeralLogForCurrentAgent"
      :current-agent-input-placeholder="currentPublicAgent?.inputPlaceholder"
      @transcription="handleTranscriptionFromLayout"
      @voice-input-processing="(status: boolean) => { isVoiceInputCurrentlyProcessing = status; if(status && !isLoadingResponse) isLoadingResponse = true; }"
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
          @agent-event="() => {}"
        />
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

        <div v-else-if="isLoadingResponse && !mainContentData"
             class="loading-placeholder-ephemeral">
          <div class="loading-animation-content">
            <div class="loading-spinner-ephemeral !w-12 !h-12"><div v-for="i in 8" :key="`blade-${i}`" class="spinner-blade-ephemeral !w-1.5 !h-4"></div></div>
            <p class="loading-text-ephemeral !text-base mt-3">Loading Assistant...</p>
          </div>
        </div>
         <div v-else class="public-welcome-placeholder-ephemeral">
            <SparklesIcon class="hero-icon-ephemeral !text-[var(--color-text-muted)]" />
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