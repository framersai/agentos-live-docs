// File: frontend/src/views/PublicHome.vue
/**
 * @file PublicHome.vue
 * @description Public-facing home page using UnifiedChatLayout.
 * Features rate limiting, public agent selection, themed placeholders, API-driven prompt loading,
 * dynamic loading of custom agent views, and session-specific userId.
 * @version 3.5.3 - Corrected dynamic agent view loading to use `agent.component`.
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
import CompactMessageRenderer from '@/components/layouts/CompactMessageRenderer/CompactMessageRenderer.vue';

import {
  SparklesIcon, KeyIcon, ChevronDownIcon, UserGroupIcon,
  ExclamationTriangleIcon, CheckIcon as CheckOutlineIcon, // Renamed to avoid conflict if CheckIcon from solid is also used
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline'; // Using outline as per original imports

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
const agentViewRef = ref<any>(null); // Used to call methods on the loaded agent component

/**
 * @computed currentAgentViewComponent
 * @description Dynamically resolves the component for the active public agent's dedicated view.
 * Uses the `component` property from the agent definition, which is expected to be
 * a function returning a dynamic import promise.
 * @returns {VueComponentType | null} The asynchronously loaded agent view component or null.
 */
const currentAgentViewComponent = computed<VueComponentType | null>(() => {
  const agent = currentPublicAgent.value;
  // Check if the agent is public and has a component factory function
  if (agent && agent.isPublic && agent.component && typeof agent.component === 'function') {
    const agentLabel = agent.label || 'Current Public Agent';
    try {
      // agent.component is expected to be like: () => import('@/path/to/Component.vue')
      return defineAsyncComponent(agent.component);
    } catch (e) {
      console.error(`[PublicHome] Synchronous error setting up dynamic import for public agent view: ${agentLabel}`, e);
      toast?.add({ type: 'error', title: 'UI Setup Error', message: `Error preparing interface for ${agentLabel}.` });
      return null; // Fallback if defineAsyncComponent itself throws (unlikely for valid function)
    }
  }
  return null;
});

const showPublicAgentSelector = ref(false);
const publicAgentSelectorDropdownRef = ref<HTMLElement | null>(null);

const isLoadingResponse = ref(false);
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
  // If agent has dedicated view AND handlesOwnInput, mainContentData should be null for it
  if (currentPublicAgent.value?.isPublic && currentAgentViewComponent.value && currentPublicAgent.value?.capabilities?.handlesOwnInput) {
    return null; // Dedicated view is responsible for its display
  }
  // Otherwise, get content from chatStore or provide default welcome/loading for general agents
  return currentPublicAgent.value ? (
    chatStore.getCurrentMainContentDataForAgent(currentPublicAgent.value.id) || {
      agentId: currentPublicAgent.value.id, type: 'welcome',
      data: `<div class="prose dark:prose-invert max-w-none mx-auto text-center py-8">
               <h2 class="text-3xl font-bold mb-4 text-[var(--color-text-primary)]">${currentPublicAgent.value.label} is Ready</h2>
               <p class="text-lg text-[var(--color-text-secondary)]">${currentPublicAgent.value.description}</p>
               <p class="mt-6 text-base text-[var(--color-text-muted)]">${currentPublicAgent.value.inputPlaceholder || 'Use the input below to start.'}</p>
             </div>`,
      title: `${currentPublicAgent.value.label} Ready`, timestamp: Date.now()
    }
  ) : null;
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
        limit: 20, // Fallback, ideally from env
        remaining: 20, // Fallback
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

  if (agent.capabilities?.handlesOwnInput && currentAgentViewComponent.value) {
    currentSystemPromptText.value = '';
    console.log(`[PublicHome] Agent ${agentLabel} handles its own input, skipping general prompt load.`);
    return;
  }

  const systemPromptKey = agent.systemPromptKey;
  let defaultPromptText = `You are ${agentLabel}. As a public assistant, be helpful and concise.`;

  if (systemPromptKey) {
      try {
        console.log(`[PublicHome] Loading prompt for key: ${systemPromptKey}.md for agent: ${agentLabel}`);
        const promptResponse = await promptAPI.getPrompt(`${systemPromptKey}.md`);
        currentSystemPromptText.value = promptResponse.data?.content || defaultPromptText;
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
      agentStore.setActiveAgent(agentToSet.id); // Watcher will trigger prompt load & content ensure
    } else if (agentToSet) { // Agent is already set, ensure prompt and content are loaded
      await loadCurrentAgentSystemPrompt();
      chatStore.ensureMainContentForAgent(agentToSet.id);
    }
  } else {
    console.warn("[PublicHome] No publicly available agents found or configured.");
    if (agentStore.activeAgentId) agentStore.setActiveAgent(null); // Clear if previously set to non-public
     chatStore.updateMainContent({
        agentId: 'no-public-agents-placeholder' as AgentId, type: 'custom-component',
        data: 'NoPublicAgentsPlaceholder', title: 'Assistants Unavailable', timestamp: Date.now()
    });
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
    // Check if the new agent is actually public, if not, reset to a valid public one
    const agentDef = agentService.getAgentById(newAgentId);
    if (agentDef && agentDef.isPublic) {
        isLoadingResponse.value = false;
        isVoiceInputCurrentlyProcessingAudio.value = false;
        if(chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false);
        await loadCurrentAgentSystemPrompt(); // This is important to run
        chatStore.ensureMainContentForAgent(newAgentId); // This sets up welcome message if needed
    } else if (newAgentId && !auth.isAuthenticated.value) { // User somehow tried to activate non-public on public page
        console.warn(`[PublicHome] Non-public agent (${newAgentId}) activation attempted. Resetting to default public agent.`);
        await loadPublicAgentsAndSetDefault(); // This will re-evaluate and set a valid public agent
    }
  } else if (!newAgentId && availablePublicAgents.value.length === 0) {
    currentSystemPromptText.value = "No public assistants are currently available.";
    chatStore.updateMainContent({
        agentId: 'no-public-agents-placeholder' as AgentId, type: 'custom-component',
        data: 'NoPublicAgentsPlaceholder', title: 'Assistants Unavailable', timestamp: Date.now()
    });
  } else if (newAgentId && newAgentId === oldAgentId ) { // Agent is same (e.g. on initial load or refresh)
    const agent = agentService.getAgentById(newAgentId);
    if (agent && agent.isPublic && (!currentAgentViewComponent.value || !agent.capabilities?.handlesOwnInput)) {
      await loadCurrentAgentSystemPrompt(); // Refresh prompt if needed
    }
    chatStore.ensureMainContentForAgent(newAgentId); // Ensure welcome screen is there
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
    return;
  }
  if (isLoadingResponse.value) {
    toast?.add({ type: 'info', title: 'Assistant Busy', message: 'Please wait for the current response.' });
    return;
  }
  if (rateLimitInfo.value?.tier === 'public' && (rateLimitInfo.value.remaining ?? 1) <= 0) {
    toast?.add({ type: 'error', title: 'Daily Limit Reached', message: 'Public preview limit reached. Please log in or try again later.'});
    chatStore.updateMainContent({
      agentId: 'rate-limit-exceeded' as AgentId, type: 'custom-component',
      data: 'RateLimitExceededPlaceholder', title: 'Daily Public Limit Reached', timestamp: Date.now()
    });
    return;
  }

  isLoadingResponse.value = true;

  try {
    if (agent.isPublic && agent.capabilities?.handlesOwnInput && currentAgentViewComponent.value && agentViewRef.value) {
      console.log(`[PublicHome] Agent ${agent.label} handles own input. Calling dedicated handler.`);
      if (typeof agentViewRef.value.handleNewUserInput === 'function') {
        await agentViewRef.value.handleNewUserInput(transcriptionText);
      } else {
        console.warn(`[PublicHome] Agent "${agent.label}" has no 'handleNewUserInput'. Falling back.`);
        await standardLlmCallPublic(transcriptionText, agent);
      }
    } else {
      await standardLlmCallPublic(transcriptionText, agent);
    }
  } catch (error: any) {
    console.error(`[PublicHome] Error during transcription handling for agent "${agent.label}":`, error);
    toast?.add({type: 'error', title: 'Processing Error', message: error.message || `Error with ${agent.label}.`});
  } finally {
    // isLoadingResponse is managed within standardLlmCallPublic or should be reset if dedicated handler was used
    // For dedicated handlers, it's reset in the block above. For standard calls, it's reset within standardLlmCallPublic.
    // If an error occurs before standardLlmCallPublic's finally, ensure it's reset:
    if(isLoadingResponse.value && !(agent.isPublic && agent.capabilities?.handlesOwnInput && currentAgentViewComponent.value && agentViewRef.value)) {
        // Only reset if standardLlmCallPublic was supposed to handle it and didn't reach its own finally
    }
    if (!(agent.isPublic && agent.capabilities?.handlesOwnInput && currentAgentViewComponent.value && agentViewRef.value)) {
         // if it was not a dedicated agent, ensure loading is false
         // standardLlmCallPublic should handle this, but as a safeguard:
         // isLoadingResponse.value = false; // This might be too aggressive here if standardLlmCallPublic is async and hasn't finished
    } else {
        // if it was a dedicated agent, it should have reset its own or we reset it above
        isLoadingResponse.value = false;
    }
  }
  console.log(`[PublicHome] handleTranscriptionFromLayout finished for "${transcriptionText}". isLoadingResponse: ${isLoadingResponse.value}`);
};

async function standardLlmCallPublic(transcriptionText: string, agentInstance: IAgentDefinition) {
  const agentId = agentInstance.id;
  const agentLabel = agentInstance.label || 'Assistant';
  const userMessageTimestamp = Date.now();

  if (!isLoadingResponse.value) isLoadingResponse.value = true; // Ensure it's true

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
    if (!agentInstance.capabilities?.handlesOwnInput || !currentAgentViewComponent.value) {
        if (!currentSystemPromptText.value || currentSystemPromptText.value.startsWith(`You are ${agentLabel}`)) {
            await loadCurrentAgentSystemPrompt();
            if (!currentSystemPromptText.value) throw new Error("System prompt could not be established.");
        }
    }
    let finalSystemPrompt = currentSystemPromptText.value;
    if (!finalSystemPrompt.trim()) {
        finalSystemPrompt = `You are ${agentLabel}. ${agentInstance.description || 'Provide helpful assistance.'}`;
    }

    finalSystemPrompt = finalSystemPrompt
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified')
      .replace(/{{MODE}}/g, agentId)
      .replace(/{{GENERATE_DIAGRAM}}/g, ((agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams) ?? false).toString())
      .replace(/{{USER_QUERY}}/g, transcriptionText)
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'You are in a public preview mode. Be helpful but concise. Avoid offering actions you cannot perform like file access. Keep responses relatively short.');

    const historyConfig: Partial<AdvancedHistoryConfig> = {
      maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 1800 : (agentInstance.capabilities?.maxChatHistory || 2) * 100,
      numRecentMessagesToPrioritize: agentInstance.capabilities?.maxChatHistory || 2,
      simpleRecencyMessageCount: agentInstance.capabilities?.maxChatHistory || 2,
    };
    const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(agentId, transcriptionText, finalSystemPrompt, historyConfig);

    let messagesForApiPayload: ChatMessageFE[] = historyForApi.map(hMsg => ({
        role: hMsg.role, content: hMsg.content, timestamp: hMsg.timestamp, agentId: hMsg.agentId,
        name: (hMsg as any).name, tool_calls: (hMsg as any).tool_calls, tool_call_id: (hMsg as any).tool_call_id,
    }));
    if (!messagesForApiPayload.some(m => m.role === 'user' && m.content === transcriptionText && m.timestamp === userMessageTimestamp)) {
        messagesForApiPayload.push({ role: 'user', content: transcriptionText, timestamp: userMessageTimestamp, agentId });
    }
    messagesForApiPayload.sort((a,b) => (a.timestamp || 0) - (b.timestamp || 0));

    const payload: ChatMessagePayloadFE = {
      messages: messagesForApiPayload,
      mode: agentInstance.systemPromptKey || agentId,
      systemPromptOverride: finalSystemPrompt,
      language: voiceSettingsManager.settings.preferredCodingLanguage,
      generateDiagram: agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: auth.sessionUserId.value || `public_session_${Date.now().toString(36)}`,
      conversationId: chatStore.getCurrentConversationId(agentId),
      stream: true,
    };

    let accumulatedResponse = "";
    await chatAPI.sendMessageStream(
      payload,
      (chunk: string) => {
        accumulatedResponse += chunk;
        if (agentStore.activeAgentId === agentId) {
          chatStore.updateMainContent({
            agentId: agentId,
            type: agentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: accumulatedResponse + "▋",
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
        await fetchRateLimitInfo();
        isLoadingResponse.value = false;
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
        await fetchRateLimitInfo();
        isLoadingResponse.value = false;
      }
    );
  } catch (error: any) {
    console.error(`[PublicHome] Chat API interaction setup error for agent "${agentLabel}":`, error.response?.data || error.message || error);
    const errorMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
    if (agentStore.activeAgentId === agentId) {
        chatStore.addMessage({ role: 'error', content: `Interaction Error: ${errorMsg}`, agentId, timestamp: Date.now() });
        chatStore.updateMainContent({
            agentId, type: 'error',
            data: `### ${agentLabel} Interaction Error\n${errorMsg}`,
            title: `Error Communicating with ${agentLabel}`, timestamp: Date.now()
        });
    }
    isLoadingResponse.value = false;
    chatStore.setMainContentStreaming(false);
    if (error.response?.status === 429 || error.message?.includes('429')) {
        await fetchRateLimitInfo();
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
  auth.checkAuthStatus(); // Not async!
  if (auth.isAuthenticated.value) {
    router.replace({ name: 'AuthenticatedHome' });
    return;
  }
  await fetchRateLimitInfo();
  if (!auth.isAuthenticated.value && rateLimitInfo.value?.tier !== 'authenticated') {
    await loadPublicAgentsAndSetDefault();
    rateLimitIntervalId = window.setInterval(fetchRateLimitInfo, 60000 * 5);
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
          v-if="currentPublicAgent && currentPublicAgent.isPublic && currentAgentViewComponent && typeof currentAgentViewComponent !== 'string' && currentPublicAgent.capabilities?.handlesOwnInput"
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
          <div v-if="currentPublicAgent?.capabilities?.usesCompactRenderer && (mainContentData.type === 'compact-message-renderer-data' || (mainContentData.type === 'markdown' && !chatStore.isMainContentStreaming))"
               class="content-renderer-container-ephemeral">
            <CompactMessageRenderer
              :content="mainContentData.data"
              :mode="currentPublicAgent.id"
              class="content-renderer-ephemeral"
            />
          </div>
          <div v-else-if="mainContentData.type === 'markdown' || mainContentData.type === 'welcome'"
               class="prose-ephemeral content-renderer-ephemeral content-renderer-container-ephemeral"
               v-html="chatStore.isMainContentStreaming && (mainContentData.type === 'markdown') && chatStore.getCurrentMainContentDataForAgent(currentPublicAgent.id)?.agentId === currentPublicAgent.id ?
                       chatStore.streamingMainContentText + '<span class=\'streaming-cursor-ephemeral\'>▋</span>' :
                       mainContentData.data"
               aria-atomic="true">
          </div>
          <div v-else-if="mainContentData.type === 'loading'"
               class="prose-ephemeral content-renderer-ephemeral content-renderer-container-ephemeral"
               v-html="mainContentData.data + (chatStore.isMainContentStreaming ? '<span class=\'streaming-cursor-ephemeral\'>▋</span>' : '')"
               aria-atomic="true">
          </div>
          <div v-else-if="mainContentData.type === 'error'"
               class="prose-ephemeral prose-error content-renderer-ephemeral content-renderer-container-ephemeral"
               v-html="mainContentData.data"
               aria-atomic="true">
          </div>
          <div v-else class="content-renderer-ephemeral text-[var(--color-text-muted)] italic p-6 text-center content-renderer-container-ephemeral">
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
.content-renderer-container-ephemeral { // Ensure this exists if used by default MainContentView structure
    flex-grow: 1;
    overflow-y: auto; // Manages scroll for default content types
}
</style>