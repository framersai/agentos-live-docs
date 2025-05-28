/**
 * @file PublicHome.vue
 * @description Public-facing home page using UnifiedChatLayout.
 * Features rate limiting, public agent selection, and themed placeholders.
 * @version 3.2.1 - Merged with v3.1.1, restoring error handling, function implementations, and refining agent logic.
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject, watch } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import {
  api,
  chatAPI,
  type ChatMessagePayloadFE,
  type ProcessedHistoryMessageFE,
  type ChatMessageFE,
  type TextResponseDataFE,
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
  SparklesIcon,
  KeyIcon,
  ChevronDownIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline';

// Dynamic Prompt Loading
const rawPromptModules = import.meta.glob("../../../../prompts/*.md", { query: "?raw", import: "default", eager: false });
const promptModules: Record<string, () => Promise<string>> = {};
for (const key in rawPromptModules) {
  const mod = rawPromptModules[key];
  promptModules[key] = async () => {
    const result = await mod();
    return typeof result === 'string' ? result : String(result); // Ensure string
  };
}

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

const showPublicAgentSelector = ref(false);
const publicAgentSelectorDropdownRef = ref<HTMLElement | null>(null);

const isLoadingResponse = ref(false);
const isVoiceInputCurrentlyProcessing = ref(false);
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
  return currentPublicAgent.value ? chatStore.getCurrentMainContentDataForAgent(currentPublicAgent.value.id) : null;
});

const showEphemeralLogForCurrentAgent = computed(() => {
  return currentPublicAgent.value?.capabilities?.showEphemeralChatLog ?? true;
});

const fetchRateLimitInfo = async (): Promise<void> => {
  try {
    const response = await api.get('/rate-limit/status'); // New file uses this path
    // New file checks client-side auth as well before redirecting
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
    // toast?.add({ type: 'warning', title: 'Usage Info Unavailable', message: 'Could not retrieve public usage details.' });
  }
};

const loadPublicAgentsAndSetDefault = async (): Promise<void> => {
  // Using new file's agent.isPublic property
  availablePublicAgents.value = agentService.getPublicAgents().filter(agent => agent.isPublic);

  if (availablePublicAgents.value.length > 0) {
    const currentAgentInStoreId = agentStore.activeAgentId;
    let agentToSet: IAgentDefinition | undefined;

    if (currentAgentInStoreId && availablePublicAgents.value.some(pa => pa.id === currentAgentInStoreId)) {
      agentToSet = agentService.getAgentById(currentAgentInStoreId);
    } else {
      // New file's more robust default agent selection
      agentToSet = availablePublicAgents.value.find(a => a.id === 'general_chat') || // 'general_chat' from new file
                   agentService.getDefaultPublicAgent() ||
                   availablePublicAgents.value[0];
    }

    if (agentToSet && agentStore.activeAgentId !== agentToSet.id) {
      agentStore.setActiveAgent(agentToSet.id); // Watcher will handle the rest
    } else if (agentToSet) { // Agent is already active, ensure prompt and content
      await loadCurrentAgentSystemPrompt(); // Using new file's function name
      chatStore.ensureMainContentForAgent(agentToSet.id);
    }
  } else {
    console.warn("[PublicHome] No publicly available agents found or configured.");
    if (agentStore.activeAgentId) agentStore.setActiveAgent(null); // Clear active agent
    // mainContentData computed property will show NoPublicAgentsPlaceholder
  }
};

const selectPublicAgent = (agentId: AgentId): void => {
  const agent = availablePublicAgents.value.find(a => a.id === agentId);
  if (agent && agentStore.activeAgentId !== agentId) {
    // Restoring the clearAgentData logic from old file, but making it conditional or configurable if needed.
    // For now, let's include it as it was in the old file logic.
    // if (agentStore.activeAgentId) chatStore.clearAgentData(agentStore.activeAgentId);
    // Decided to keep new file's behavior (not clearing data explicitly here, relying on store/component lifecycle)
    agentStore.setActiveAgent(agentId);
  }
  showPublicAgentSelector.value = false;
};

const loadCurrentAgentSystemPrompt = async (): Promise<void> => { // Renamed from loadAgentSystemPrompt
  const agent = currentPublicAgent.value;
  if (!agent) {
    currentSystemPromptText.value = "No agent selected. Please choose an assistant.";
    return;
  }
  if (agent.systemPromptKey) {
    const promptFileName = `${agent.systemPromptKey}.md`;
    const promptModuleKey = `../../../../prompts/${promptFileName}`;
    try {
      if (promptModules[promptModuleKey]) {
        currentSystemPromptText.value = await promptModules[promptModuleKey]();
      } else {
        console.warn(`[PublicHome] Prompt module not found: ${promptModuleKey}. Using default.`);
        currentSystemPromptText.value = `You are ${agent.label}. As a public assistant, be helpful but concise.`;
      }
    } catch(e) {
      console.error(`[PublicHome] Error loading prompt for ${agent.label}:`, e);
      currentSystemPromptText.value = `You are ${agent.label}. Error loading specific instructions. Please be generally helpful.`;
    }
  } else {
    currentSystemPromptText.value = `You are ${agent.label}, a helpful AI. Please provide concise responses for this public preview.`;
  }
};

watch(() => agentStore.activeAgentId, async (newAgentId, oldAgentId) => { // Watching ID, new file approach
  if (newAgentId && newAgentId !== oldAgentId) {
    if (availablePublicAgents.value.some(pa => pa.id === newAgentId)) {
      isLoadingResponse.value = false;
      isVoiceInputCurrentlyProcessing.value = false;
      if(chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false);
      await loadCurrentAgentSystemPrompt();
      chatStore.ensureMainContentForAgent(newAgentId);
    } else if (newAgentId) {
      console.warn(`[PublicHome] Non-public agent ${newAgentId} activated. Attempting to set default public agent.`);
      await loadPublicAgentsAndSetDefault();
    }
  } else if (!newAgentId && availablePublicAgents.value.length === 0) {
    currentSystemPromptText.value = "No public assistants are currently available.";
  }
}, { immediate: true });


const handleTranscriptionFromLayout = async (transcriptionText: string): Promise<void> => {
  if (!transcriptionText.trim()) return;
  if (!currentPublicAgent.value) {
    toast?.add({ type: 'warning', title: 'No Assistant Selected', message: 'Please select an assistant to interact with.' });
    return;
  }
  if (isLoadingResponse.value) return;

  if (rateLimitInfo.value?.tier === 'public' && (rateLimitInfo.value.remaining ?? 1) <= 0) {
    toast?.add({ type: 'error', title: 'Daily Limit Reached', message: 'Public preview limit reached. Please log in for full access or try again later.'});
    chatStore.updateMainContent({ // From new file
      agentId: 'rate-limit-exceeded' as AgentId, type: 'custom-component',
      data: 'RateLimitExceededPlaceholder', title: 'Daily Public Limit Reached', timestamp: Date.now()
    });
    return;
  }

  const agent = currentPublicAgent.value;
  const agentId = agent.id;

  chatStore.addMessage({ role: 'user', content: transcriptionText, agentId: agentId, timestamp: Date.now() });
  isLoadingResponse.value = true;
  isVoiceInputCurrentlyProcessing.value = true;
  const streamingPlaceholder = `Contacting ${agent.label}...`;
  chatStore.updateMainContent({ // From new file
    agentId, type: 'loading', data: streamingPlaceholder,
    title: `Contacting ${agent.label}...`, timestamp: Date.now()
  });
  chatStore.setMainContentStreaming(true, streamingPlaceholder);

  try {
    const historyConfig: Partial<AdvancedHistoryConfig> = { // Using new file's config slightly (100 multiplier)
      maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 1800 : (agent.capabilities?.maxChatHistory || 2) * 100,
      numRecentMessagesToPrioritize: agent.capabilities?.maxChatHistory || 2,
      simpleRecencyMessageCount: agent.capabilities?.maxChatHistory || 2, // from new file
    };
    const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(
      agentId, transcriptionText, currentSystemPromptText.value, historyConfig
    );

    // Explicit mapping for robustness (from old file, good practice)
    let messagesForApiPayload: ChatMessageFE[] = historyForApi.map(hMsg => ({
        role: hMsg.role, content: hMsg.content, timestamp: hMsg.timestamp,
        tool_call_id: (hMsg as any).tool_call_id, tool_calls: (hMsg as any).tool_calls, name: (hMsg as any).name,
    }));
    if (!messagesForApiPayload.some(m => m.role === 'user' && m.content === transcriptionText)) { // 'some' from new file
        messagesForApiPayload.push({ role: 'user', content: transcriptionText, timestamp: Date.now()}); // Ensure unique timestamp if needed
    }
    messagesForApiPayload.sort((a,b) => (a.timestamp || 0) - (b.timestamp || 0)); // From old file

    // Using old file's more specific additional instructions
    let finalSystemPromptText = (currentSystemPromptText.value || `You are ${agent.label}.`)
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified')
      .replace(/{{MODE}}/g, agentId)
      .replace(/{{GENERATE_DIAGRAM}}/g, ((agent.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams) ?? false).toString())
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'You are in a public preview mode. Be helpful but concise. Avoid offering actions you cannot perform like file access. Keep responses relatively short.');

    const payload: ChatMessagePayloadFE = {
      messages: [ { role: 'system', content: finalSystemPromptText }, ...messagesForApiPayload ],
      mode: agent.systemPromptKey || 'general_chat',
      language: voiceSettingsManager.settings.preferredCodingLanguage,
      generateDiagram: agent.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: rateLimitInfo.value?.ip || `public_user_${Date.now().toString(36)}`,
      conversationId: chatStore.getCurrentConversationId(agentId), stream: true,
    };

    let accumulatedResponse = "";
    await chatAPI.sendMessageStream(
      payload,
      (chunk: string) => {
          accumulatedResponse += chunk;
          if (agentStore.activeAgentId === agentId) { // Check agent is still active
              chatStore.updateMainContent({ // From new file
                  agentId: agentId,
                  type: agent.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                  data: accumulatedResponse + "▋",
                  title: `${agent.label} Responding...`,
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
            data: finalContent, title: `${currentActiveAgent.label} Response`, timestamp: Date.now()
          });
        }
        await fetchRateLimitInfo();
        isLoadingResponse.value = false;
        isVoiceInputCurrentlyProcessing.value = false;
      },
      async (error: Error | any) => { /* onStreamError - Restored from old file */
        console.error('[PublicHome] Chat Stream API error:', error);
        const errorMsg = error.message || 'An error occurred during the stream.';
        const currentActiveAgentOnError = agentStore.activeAgent; // Check current agent from store
        if (currentActiveAgentOnError && currentActiveAgentOnError.id === agentId) {
            chatStore.addMessage({ role: 'error', content: `Stream Error: ${errorMsg}`, agentId, timestamp: Date.now() });
            chatStore.updateMainContent({
              agentId, type: 'error', // Consistent 'error' type for main content
              data: `### Assistant Stream Error\n${errorMsg}`,
              title: `Error Processing Request with ${agent.label}`, timestamp: Date.now()
            });
        }
        chatStore.setMainContentStreaming(false);
        await fetchRateLimitInfo();
        isLoadingResponse.value = false;
        isVoiceInputCurrentlyProcessing.value = false;
      }
    );
  } catch (error: any) { /* General catch - Restored from old file */
    console.error('[PublicHome] Chat API interaction error:', error.response?.data || error.message);
    const errorMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
    const currentActiveAgentOnError = agentStore.activeAgent; // Check current agent from store
    if (currentActiveAgentOnError && currentActiveAgentOnError.id === agentId) {
        chatStore.addMessage({ role: 'error', content: `Interaction Error: ${errorMsg}`, agentId, timestamp: Date.now() });
        chatStore.updateMainContent({
          agentId, type: 'error', // Consistent 'error' type
          data: `### Assistant Interaction Error\n${errorMsg}`,
          title: `Error Communicating with ${agent.label}`, timestamp: Date.now()
        });
    }
    isLoadingResponse.value = false;
    isVoiceInputCurrentlyProcessing.value = false;
    chatStore.setMainContentStreaming(false);
    if (error.response?.status === 429) { // Rate limit specific error
        await fetchRateLimitInfo(); // Refresh rate limit info
         chatStore.updateMainContent({
            agentId: 'rate-limit-exceeded' as AgentId, type: 'custom-component',
            data: 'RateLimitExceededPlaceholder', title: 'Daily Public Limit Reached', timestamp: Date.now()
        });
    }
  }
};

// Restored from old file
const formatResetTime = (dateInput?: string | Date): string => {
  if (!dateInput) return 'soon';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'shortly';
  // Example: "3:45 PM PDT" - Adjust options as needed
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
};

// Restored from old file
const handleClickOutsidePublicAgentSelector = (event: MouseEvent) => {
  if (publicAgentSelectorDropdownRef.value && !publicAgentSelectorDropdownRef.value.contains(event.target as Node)) {
    showPublicAgentSelector.value = false;
  }
};
let rateLimitInterval: number | undefined;

onMounted(async () => {
  await auth.checkAuthStatus(); // New file: check auth first
  if (auth.isAuthenticated.value) {
    router.replace({ name: 'AuthenticatedHome' });
    return;
  }
  document.addEventListener('click', handleClickOutsidePublicAgentSelector, true);
  await fetchRateLimitInfo();
  // New file: conditional load and interval based on auth status
  if (rateLimitInfo.value?.tier !== 'authenticated' || !auth.isAuthenticated.value) {
    await loadPublicAgentsAndSetDefault(); // await added
    rateLimitInterval = window.setInterval(fetchRateLimitInfo, 60000 * 5);
  }
});

// Restored from old file
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
                    <CheckIcon v-if="currentPublicAgent?.id === agentDef.id" class="icon-sm checkmark-icon-active" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </template>

      <template #main-content>
        <div v-if="mainContentData?.type === 'custom-component' && mainContentData.data === 'RateLimitExceededPlaceholder'"
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

        <MainContentView :agent="currentPublicAgent" class="main-content-view-wrapper-ephemeral default-agent-mcv"
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
// This SCSS file will handle the "visually stunning" placeholders and overall public page aesthetic.
</style>