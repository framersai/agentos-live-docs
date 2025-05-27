// File: frontend/src/views/PublicHome.vue
/**
 * @file PublicHome.vue
 * @description Public-facing home page using UnifiedChatLayout for the "Ephemeral Harmony" theme.
 * Features rate-limited access to selected AI agents and dynamic prompt loading.
 * @version 2.1.1 - Corrected ChatMessageFE mapping, full Ephemeral Harmony integration.
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject, watch, shallowRef, type Component as VueComponentType } from 'vue';
import { useRouter } from 'vue-router';
import {
  api, // For direct API calls like rate limit
  chatAPI, // For chat-specific calls
  type ChatMessagePayloadFE,
  type ProcessedHistoryMessageFE,
  type ChatMessageFE, // This is the type for messages in the API payload
  type ChatResponseDataFE,
  type TextResponseDataFE,
  type FunctionCallResponseDataFE,
} from '@/utils/api';
import { agentService, type IAgentDefinition, type AgentId } from '@/services/agent.service';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type ChatMessage as StoreChatMessage, type MainContent } from '@/store/chat.store'; // StoreChatMessage has an ID
import { voiceSettingsManager } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';

// Import New Layout and UI Components
import UnifiedChatLayout from '@/components/layouts/UnifiedChatLayout.vue';
import MainContentView from '@/components/agents/common/MainContentView.vue'; // Used to wrap main slot content
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue'; // For agents that use it

import {
  SparklesIcon,
  KeyIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  UserGroupIcon, // Example for default agent icon
  // ArrowPathIcon, // Not used in final template, can be removed
} from '@heroicons/vue/24/outline';

// Dynamic Prompt Loading
// Path assumes prompts directory is at project_root/prompts/
// Normalize import.meta.glob output to always return Promise<string>
const rawPromptModules = import.meta.glob(
  '../../../../prompts/*.md',
  { as: 'raw', import: 'default' }
);
const promptModules: Record<string, () => Promise<string>> = {};
for (const key in rawPromptModules) {
  const mod = rawPromptModules[key];
  promptModules[key] = () => {
    const result = mod();
    // If result is a string, wrap in Promise.resolve, else assume it's a Promise<string>
    return result instanceof Promise ? result : Promise.resolve(result);
  };
}

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

const availablePublicAgents = shallowRef<IAgentDefinition[]>([]);
// currentPublicAgent is now primarily driven by agentStore.activeAgent for consistency
const currentPublicAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);

const showPublicAgentSelector = ref(false);
const publicAgentSelectorDropdownRef = ref<HTMLElement | null>(null);

const isLoadingResponse = ref(false); // For API call loading state
const isVoiceInputCurrentlyProcessing = ref(false); // For VoiceInput component's internal busy state, managed by UnifiedChatLayout
const currentSystemPrompt = ref('');
const rateLimitInfo = ref<RateLimitInfo | null>(null);

/**
 * @computed mainContentForLayout
 * @description Determines what content to display in the main area of the UnifiedChatLayout.
 * This can be a welcome message, an error, or the active agent's content from the chat store.
 */
const mainContentForLayout = computed<MainContent | null>(() => {
  if (!currentPublicAgent.value && availablePublicAgents.value.length > 0) { // Agents exist but none selected (e.g. after filtering clears selection)
    return {
      agentId: 'public-welcome-placeholder' as AgentId,
      type: 'custom-component',
      data: 'PublicWelcomePlaceholder',
      title: 'Welcome to Voice Chat Assistant',
      timestamp: Date.now(),
    };
  }
  if (!currentPublicAgent.value && availablePublicAgents.value.length === 0) { // No public agents configured
     return {
      agentId: 'no-public-agents-placeholder' as AgentId,
      type: 'custom-component',
      data: 'NoPublicAgentsPlaceholder',
      title: 'Assistants Unavailable',
      timestamp: Date.now(),
    };
  }
  // If an agent is selected, get its main content from the chat store
  return currentPublicAgent.value ? chatStore.getMainContentForAgent(currentPublicAgent.value.id) : null;
});

/**
 * @function fetchRateLimitInfo
 * @description Fetches the current rate limit status for the user.
 * Redirects to PrivateHome if the user is authenticated.
 * @async
 */
const fetchRateLimitInfo = async (): Promise<void> => {
  try {
    const response = await api.get('/api/rate-limit/status');
    if (response.data.tier === 'authenticated') {
      router.push({ name: 'PrivateHome' });
      return;
    }
    rateLimitInfo.value = {
      ...response.data,
      resetAt: response.data.resetAt ? new Date(response.data.resetAt) : new Date(Date.now() + 24 * 60 * 60 * 1000) // Default 24h if not provided
    };
  } catch (error: any) {
    console.error('PublicHome: Failed to fetch rate limit info:', error.response?.data || error.message);
    toast?.add({ type: 'error', title: 'Network Status Error', message: 'Could not retrieve usage details. Some features might be limited.' });
  }
};

/**
 * @function loadPublicAgentsAndSetDefault
 * @description Loads available public agents and sets a default one in the agent store if none is active
 * or if the current active agent is not a valid public agent.
 */
const loadPublicAgentsAndSetDefault = (): void => {
  const allPublic = agentService.getPublicAgents();
  availablePublicAgents.value = allPublic.filter(agent =>
    !['codingAssistant', 'codingInterviewer', 'diary'].includes(agent.id) // Example filter
  );

  if (availablePublicAgents.value.length > 0) {
    const currentAgentInStore = agentStore.activeAgent;
    let agentToSetActiveId: AgentId;

    if (currentAgentInStore && availablePublicAgents.value.some(pa => pa.id === currentAgentInStore.id)) {
      // Current agent in store is a valid public agent, keep it.
      agentToSetActiveId = currentAgentInStore.id;
    } else {
      // No valid current agent, or current agent is not public; set a default public agent.
      const generalAgent = availablePublicAgents.value.find(a => a.id === 'general');
      agentToSetActiveId = generalAgent ? generalAgent.id : availablePublicAgents.value[0].id;
    }

    if (agentStore.activeAgentId !== agentToSetActiveId) {
      agentStore.setActiveAgent(agentToSetActiveId); // This will trigger watchers
    } else {
      // Agent store is already correctly set, ensure content and prompt are loaded
      loadAgentSystemPrompt();
      chatStore.ensureMainContentForAgent(agentToSetActiveId);
    }
  } else {
    console.warn("[PublicHome] No publicly available agents found after filtering.");
    if (agentStore.activeAgentId) {
        // If an agent was active but no public ones are now available, clear it.
        // This will lead mainContentForLayout to show the "NoPublicAgentsPlaceholder".
        agentStore.setActiveAgent('' as AgentId); // Effectively clears the agent
    }
  }
};

/**
 * @function selectPublicAgent
 * @description Sets the selected public agent as the active agent.
 * @param {AgentId} agentId - The ID of the agent to activate.
 */
const selectPublicAgent = (agentId: AgentId): void => {
  const agent = availablePublicAgents.value.find(a => a.id === agentId);
  if (agent && agentStore.activeAgentId !== agentId) {
    if (agentStore.activeAgentId) {
      chatStore.clearAgentData(agentStore.activeAgentId); // Clear data for previous agent
    }
    agentStore.setActiveAgent(agentId); // This triggers watchers for prompt and ensures main content
    toast?.add({ type: 'info', title: 'Assistant Switched', message: `Now interacting with ${agent.label}.`, duration: 2500 });
  }
  showPublicAgentSelector.value = false;
};

/**
 * @function loadAgentSystemPrompt
 * @description Loads the system prompt for the currently active public agent.
 * @async
 */
const loadAgentSystemPrompt = async (): Promise<void> => {
  const agent = currentPublicAgent.value; // Use the computed property
  if (agent?.systemPromptKey) {
    const promptFileName = `${agent.systemPromptKey}.md`;
    const modulePath = `../../../../prompts/${promptFileName}`;
    try {
      if (promptModules[modulePath]) {
        currentSystemPrompt.value = await promptModules[modulePath](); // Invoke to get the string
      } else {
        console.error(`[PublicHome] Prompt module not found for key: ${modulePath}. Available modules:`, Object.keys(promptModules));
        currentSystemPrompt.value = `You are ${agent.label}. As a public assistant, please keep your responses friendly, concise, and informative.`;
      }
    } catch(e) {
        console.error(`[PublicHome] Error loading prompt module for ${promptFileName}:`, e);
        currentSystemPrompt.value = `You are ${agent.label}. A default prompt is active due to a loading error.`;
    }
  } else if (agent) {
    currentSystemPrompt.value = `You are ${agent.label}, a helpful AI assistant. In this public preview, please provide brief and informative answers.`;
  } else {
    currentSystemPrompt.value = "You are a general helpful AI assistant for public users. Keep responses concise.";
  }
};

// Watch for changes in the active agent (from agentStore) to load its system prompt
// and ensure its main content area is initialized.
watch(() => agentStore.activeAgent, (newAgent, oldAgent) => {
  if (newAgent && availablePublicAgents.value.some(pa => pa.id === newAgent.id)) {
    // Only proceed if the new agent is a valid public agent for this view
    if (newAgent.id !== oldAgent?.id) {
      loadAgentSystemPrompt(); // Load new prompt
      chatStore.ensureMainContentForAgent(newAgent.id); // Ensure its welcome/main content is set up
    }
  } else if (!newAgent && availablePublicAgents.value.length === 0) {
    currentSystemPrompt.value = "No agents available at the moment.";
    // mainContentForLayout will handle showing the "NoPublicAgentsPlaceholder"
  }
  // If newAgent is null but public agents are available, loadPublicAgentsAndSetDefault will handle it.
}, { immediate: true, deep: true });


/**
 * @function handleTranscriptionFromLayout
 * @description Handles transcription received from UnifiedChatLayout (forwarded from VoiceInput).
 * Sends the message to the backend API.
 * @param {string} transcription - The transcribed text from the user.
 * @async
 */
const handleTranscriptionFromLayout = async (transcription: string): Promise<void> => {
  if (!transcription.trim() || isLoadingResponse.value || !currentPublicAgent.value) return;

  if (rateLimitInfo.value?.tier === 'public' && (rateLimitInfo.value.remaining ?? 1) <= 0) {
    toast?.add({ type: 'error', title: 'Daily Limit Reached', message: 'Please log in or try again tomorrow for more interactions.'});
    return;
  }

  const agentId = currentPublicAgent.value.id;
  // Add user message to the store immediately for responsive UI
  const userMessageInStore = chatStore.addMessage({
    role: 'user', content: transcription, agentId: agentId,
  });

  isLoadingResponse.value = true; // For API call
  // isVoiceInputCurrentlyProcessing is managed via @voice-input-processing event from layout
  chatStore.setMainContentStreaming(true, `Contacting ${currentPublicAgent.value.label}...`);

  try {
    const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(
      agentId,
      transcription, // Current query text
      currentSystemPrompt.value, // System prompt
      { // Config overrides for public mode
        maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 1800 : (currentPublicAgent.value.capabilities?.maxChatHistory || 2) * 120,
        numRecentMessagesToPrioritize: currentPublicAgent.value.capabilities?.maxChatHistory || 2,
      }
    );

    // Map store messages (ProcessedHistoryMessageFE) to API payload messages (ChatMessageFE)
    // Crucially, ChatMessageFE does NOT have an 'id' field.
    const messagesForApiPayload: ChatMessageFE[] = historyForApi.map(hMsg => ({
        role: hMsg.role,
        content: hMsg.content,
        timestamp: hMsg.timestamp,
        tool_call_id: hMsg.tool_call_id,
        tool_calls: hMsg.tool_calls,
        name: hMsg.name,
    }));

    // Ensure the *current* user message (that triggered this interaction) is in the payload,
    // as getHistoryForApi might not include it if it wasn't in messageHistory when called.
    // It's safer to add it explicitly if not found by its store-generated ID or exact content/timestamp.
    if (!messagesForApiPayload.find(m => m.role === 'user' && m.content === transcription && m.timestamp === userMessageInStore.timestamp)) {
        messagesForApiPayload.push({
            role: 'user',
            content: transcription,
            timestamp: userMessageInStore.timestamp,
        });
    }
    // Sort just in case, though backend should also handle order.
    messagesForApiPayload.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    let finalSystemPrompt = currentSystemPrompt.value
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified')
      .replace(/{{MODE}}/g, agentId)
      .replace(/{{GENERATE_DIAGRAM}}/g, (currentPublicAgent.value.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams).toString())
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'You are in a public preview mode. Be helpful but concise. Avoid offering actions you cannot perform like file access. Keep responses relatively short.');

    const payload: ChatMessagePayloadFE = {
      messages: [
        { role: 'system', content: finalSystemPrompt },
        ...messagesForApiPayload
      ],
      mode: currentPublicAgent.value.systemPromptKey,
      language: voiceSettingsManager.settings.preferredCodingLanguage,
      generateDiagram: currentPublicAgent.value.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: rateLimitInfo.value?.ip || `public_user_${Date.now().toString(36)}`,
      conversationId: chatStore.getCurrentConversationId(agentId),
      stream: true, // Enable streaming
    };

    // Handle streaming response
    let accumulatedResponse = "";
    await chatAPI.sendMessageStream(
        payload,
        (chunk) => { // onChunkReceived
            accumulatedResponse += chunk;
            chatStore.setMainContentStreaming(true, accumulatedResponse); // Continuously update with new chunk
        },
        async () => { // onStreamEnd
            chatStore.setMainContentStreaming(false); // Final update, streaming is done
            if (currentPublicAgent.value) { // Ensure agent is still selected
                 chatStore.addMessage({
                    role: 'assistant',
                    content: accumulatedResponse,
                    agentId: currentPublicAgent.value.id,
                    // model and usage would typically come from a final metadata event in the stream
                });
                chatStore.updateMainContent({
                    agentId: currentPublicAgent.value.id,
                    type: currentPublicAgent.value.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                    data: accumulatedResponse,
                    title: `${currentPublicAgent.value.label} Response`,
                    timestamp: Date.now()
                });
            }
            await fetchRateLimitInfo();
            isLoadingResponse.value = false;
        },
        async (error) => { // onStreamError
            console.error('PublicHome: Chat Stream API error:', error);
            const errorMsg = error.message || 'Stream error during chat.';
            if (currentPublicAgent.value) {
                chatStore.addMessage({ role: 'error', content: `System Error: ${errorMsg}`, agentId: currentPublicAgent.value.id });
                chatStore.updateMainContent({
                    agentId: currentPublicAgent.value.id, type: 'markdown', data: `### Stream Error\n${errorMsg}`,
                    title: `Error Processing Request`, timestamp: Date.now()
                });
            }
            chatStore.setMainContentStreaming(false);
            await fetchRateLimitInfo(); // Update rate limit info on error too
            isLoadingResponse.value = false;
        }
    );

  } catch (error: any) { // Catch errors from getHistoryForApi or initial setup before stream
    console.error('PublicHome: Pre-stream Chat API error:', error.response?.data || error.message);
    const errorMsg = error.response?.data?.message || error.message || 'An error occurred processing your request.';
    if (currentPublicAgent.value) {
        chatStore.addMessage({ role: 'error', content: `System Error: ${errorMsg}`, agentId: currentPublicAgent.value.id });
        chatStore.updateMainContent({
            agentId: currentPublicAgent.value.id, type: 'markdown', data: `### Error\n${errorMsg}`,
            title: `Error Processing Request`, timestamp: Date.now()
        });
    }
    isLoadingResponse.value = false;
    chatStore.setMainContentStreaming(false);
    if (error.response?.status === 429) await fetchRateLimitInfo();
  } finally {
    // isLoadingResponse and streaming state handled by stream callbacks now
    // isVoiceInputCurrentlyProcessing is handled by VoiceInput component's own emits
  }
};

const formatResetTime = (dateValue?: string | Date): string => {
  if (!dateValue) return 'in approximately 24 hours';
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  if (isNaN(date.getTime())) return 'shortly';
  // Format to user's local time for better readability
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
  await fetchRateLimitInfo();
  if (rateLimitInfo.value?.tier !== 'authenticated') {
    loadPublicAgentsAndSetDefault();
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
      @transcription="handleTranscriptionFromLayout"
      @voice-input-processing="(status: boolean) => isVoiceInputCurrentlyProcessing = status"
    >
      <template #main-content>
        <div v-if="availablePublicAgents.length > 1 && (!rateLimitInfo || (rateLimitInfo.remaining ?? 1) > 0)"
             class="public-agent-selector-ephemeral">
          <div class="relative" ref="publicAgentSelectorDropdownRef">
            <button @click="showPublicAgentSelector = !showPublicAgentSelector"
                    class="agent-selector-button btn btn-secondary-ephemeral btn-sm"
                    aria-haspopup="true" :aria-expanded="showPublicAgentSelector">
              <component :is="currentPublicAgent?.icon || UserGroupIcon" class="selected-agent-icon icon-sm" :class="currentPublicAgent?.iconClass || 'text-[var(--color-text-muted)]'" />
              <span>{{ currentPublicAgent?.label || 'Select Assistant' }}</span>
              <ChevronDownIcon class="chevron-icon icon-xs" :class="{'open': showPublicAgentSelector}" />
            </button>
            <transition name="dropdown-float">
              <div v-if="showPublicAgentSelector" class="audio-mode-dropdown dropdown-menu-ephemeral">
                <div class="dropdown-header-holographic"><h3 class="dropdown-title">Available Public Assistants</h3></div>
                <div class="dropdown-content-holographic p-1 max-h-72 custom-scrollbar-thin">
                  <button
                    v-for="agentDef in availablePublicAgents" :key="agentDef.id"
                    @click="selectPublicAgent(agentDef.id)"
                    class="dropdown-item-holographic w-full group"
                    :class="{ 'active': currentPublicAgent?.id === agentDef.id }"
                    role="menuitemradio" :aria-checked="currentPublicAgent?.id === agentDef.id">
                    <div class="mode-icon-dd-holographic !w-9 !h-9 !p-1.5" :class="agentDef.iconClass || 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'">
                        <component :is="agentDef.icon || SparklesIcon" class="icon-base" />
                    </div>
                    <span class="dropdown-item-label">{{ agentDef.label }}</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <div v-else-if="rateLimitInfo && rateLimitInfo.tier === 'public' && (rateLimitInfo.remaining !== undefined && rateLimitInfo.remaining <= 0)"
             class="rate-limit-banner-ephemeral card-glass-interactive">
          <InformationCircleIcon class="w-10 h-10 mx-auto mb-3 text-[var(--color-warning)]" />
          <h3 class="text-lg font-semibold mb-1 text-[var(--color-text-primary)]">Daily Public Preview Limit Reached</h3>
          <p class="text-sm opacity-90 mb-3">
             Access resets around <strong>{{ formatResetTime(rateLimitInfo.resetAt) }}</strong>.
          </p>
          <router-link to="/login" class="login-prompt-link btn btn-primary-ephemeral btn-sm">
            <KeyIcon class="icon-sm mr-1.5" /> Log In for Full Access
          </router-link>
        </div>

        <MainContentView :agent="currentPublicAgent!" class="flex-grow flex flex-col overflow-hidden" v-if="currentPublicAgent || mainContentForLayout?.data === 'NoPublicAgentsPlaceholder'">
            <template v-if="mainContentForLayout?.type === 'custom-component' && mainContentForLayout.data === 'PublicWelcomePlaceholder'">
                <div class="public-welcome-placeholder">
                  <SparklesIcon class="hero-icon-ephemeral" />
                  <h2 class="welcome-title-ephemeral">Welcome to Voice Chat Assistant</h2>
                  <p class="welcome-subtitle-ephemeral">
                    This is a public preview. {{ availablePublicAgents.length > 1 ? 'Select an assistant from the dropdown above or use the default to begin.' : 'Use the default assistant to begin.'}}
                    Interactions are rate-limited. For full features, please <router-link to="/login" class="link-ephemeral">log in</router-link>.
                  </p>
                </div>
            </template>
            <template v-else-if="mainContentForLayout?.type === 'custom-component' && mainContentForLayout.data === 'NoPublicAgentsPlaceholder'">
                 <div class="public-welcome-placeholder">
                    <UserGroupIcon class="hero-icon-ephemeral !text-[var(--color-text-muted)]" />
                    <h2 class="welcome-title-ephemeral">Assistants Unavailable</h2>
                    <p class="welcome-subtitle-ephemeral">
                        We're sorry, but there are currently no public assistants configured for preview. Please check back later or <router-link to="/login" class="link-ephemeral">log in</router-link> for full access.
                    </p>
                </div>
            </template>
            <template v-else-if="mainContentForLayout && currentPublicAgent">
                <CompactMessageRenderer
                  v-if="currentPublicAgent?.capabilities?.usesCompactRenderer && mainContentForLayout.type === 'compact-message-renderer-data'"
                  :content="mainContentForLayout.data"
                  :mode="currentPublicAgent.id"
                  class="flex-grow overflow-y-auto p-1 custom-scrollbar-thin"
                />
                <div v-else-if="mainContentForLayout.type === 'markdown' || mainContentForLayout.type === 'welcome'"
                     class="prose-ephemeral max-w-none p-4 md:p-6 flex-grow overflow-y-auto custom-scrollbar-thin"
                     v-html="isLoadingResponse && chatStore.isMainContentStreaming && chatStore.currentMainContentData?.agentId === currentPublicAgent.id ?
                               chatStore.streamingMainContentText + '<span class=\'streaming-cursor-ephemeral\'>|</span>' :
                               mainContentForLayout.data"
                     aria-atomic="true">
                </div>
                 <div v-else-if="mainContentForLayout.type === 'error'"
                     class="prose-ephemeral prose-error max-w-none p-4 md:p-6 flex-grow overflow-y-auto custom-scrollbar-thin"
                     v-html="mainContentForLayout.data"
                     aria-atomic="true">
                </div>
                <div v-else class="p-4 text-[var(--color-text-muted)] italic custom-scrollbar-thin flex-grow overflow-y-auto">
                    <p>Agent response (type: {{ mainContentForLayout.type }})</p>
                    <pre v-if="typeof mainContentForLayout.data === 'object'" class="text-xs">{{ JSON.stringify(mainContentForLayout.data, null, 2) }}</pre>
                    <div v-else v-html="mainContentForLayout.data"></div>
                </div>
            </template>
            <div v-else-if="isLoadingResponse && !chatStore.isMainContentStreaming" class="flex-grow flex items-center justify-center text-center">
                <div class="loading-animation-content"> <div class="loading-spinner-ephemeral !w-12 !h-12">
                    <div v-for="i in 8" :key="`blade-${i}`" class="spinner-blade-ephemeral !w-1.5 !h-4"></div>
                  </div>
                  <p class="loading-text-ephemeral !text-base mt-3">Agent is preparing response...</p>
                </div>
            </div>
        </MainContentView>
      </template>
    </UnifiedChatLayout>
  </div>
</template>

<style lang="scss">
// Styles are in frontend/src/styles/views/_public-home.scss
// and frontend/src/styles/components for shared elements like dropdowns.

// Link style for use within prose or general text areas
.link-ephemeral {
  color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 500;
  &:hover {
    color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), calc(var(--color-accent-primary-l) + 10%));
  }
}

.prose-ephemeral.prose-error {
    h3 { color: hsl(var(--color-error-h), var(--color-error-s), var(--color-error-l));}
    p { color: hsl(var(--color-error-h), var(--color-error-s), calc(var(--color-error-l) + 10%));}
}
</style>