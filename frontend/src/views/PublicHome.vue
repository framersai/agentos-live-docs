// File: frontend/src/views/PublicHome.vue
/**
 * @file PublicHome.vue
 * @description Public-facing home page using UnifiedChatLayout for "Ephemeral Harmony" theme.
 * @version 3.0.2 - TypeScript error corrections and unused variable cleanup.
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
} from '@/utils/api';
import { agentService, type IAgentDefinition, type AgentId } from '@/services/agent.service'; // IAgentDefinition includes capabilities
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
  CheckIcon
} from '@heroicons/vue/24/outline';

// Dynamic Prompt Loading
const rawPromptModules = import.meta.glob('../../../../prompts/*.md', { as: 'raw', import: 'default' });
const promptModules: Record<string, () => Promise<string>> = {};
for (const key in rawPromptModules) {
  const mod = rawPromptModules[key];
  promptModules[key] = () => {
    const result = mod();
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
const auth = useAuth();

const availablePublicAgents = ref<IAgentDefinition[]>([]);
const currentPublicAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);

const showPublicAgentSelector = ref(false);
const publicAgentSelectorDropdownRef = ref<HTMLElement | null>(null);

const isLoadingResponse = ref(false);
const isVoiceInputCurrentlyProcessing = ref(false);
const currentSystemPrompt = ref('');
const rateLimitInfo = ref<RateLimitInfo | null>(null);

const mainContentComputed = computed<MainContent | null>(() => {
  if (rateLimitInfo.value && rateLimitInfo.value.tier === 'public' && (rateLimitInfo.value.remaining !== undefined && rateLimitInfo.value.remaining <= 0)) {
    return {
      agentId: 'rate-limit-exceeded' as AgentId, type: 'custom-component',
      data: 'RateLimitExceededPlaceholder', title: 'Daily Limit Reached', timestamp: Date.now()
    };
  }
  // This placeholder is shown if no agent is selected yet, but agents are available
  if (!currentPublicAgent.value && availablePublicAgents.value.length > 0) {
    return {
      agentId: 'public-welcome-placeholder' as AgentId, type: 'custom-component',
      data: 'PublicWelcomePlaceholder', title: 'Welcome to Voice Chat Assistant', timestamp: Date.now()
    };
  }
  // This placeholder is shown if NO public agents are configured AT ALL
  if (availablePublicAgents.value.length === 0 && !currentPublicAgent.value) {
     return {
      agentId: 'no-public-agents-placeholder' as AgentId, type: 'custom-component',
      data: 'NoPublicAgentsPlaceholder', title: 'Assistants Unavailable', timestamp: Date.now()
    };
  }
  // If an agent IS selected, get its content from the chat store
  return currentPublicAgent.value ? chatStore.getMainContentForAgent(currentPublicAgent.value.id) : null;
});

const fetchRateLimitInfo = async (): Promise<void> => {
  try {
    const response = await api.get('/api/rate-limit/status');
    if (response.data.tier === 'authenticated') {
      router.replace({ name: 'AuthenticatedHome' });
      return;
    }
    rateLimitInfo.value = {
      ...response.data,
      resetAt: response.data.resetAt ? new Date(response.data.resetAt) : new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  } catch (error: any) {
    console.error('PublicHome: Failed to fetch rate limit info:', error.response?.data || error.message);
    toast?.add({ type: 'error', title: 'Network Status Error', message: 'Could not retrieve usage details.' });
  }
};

const loadPublicAgentsAndSetDefault = (): void => {
  const allPublic = agentService.getPublicAgents();
  availablePublicAgents.value = [...allPublic.filter(agent =>
    !['codingAssistant', 'codingInterviewer', 'diaryAgent'].includes(agent.id) // Keep example filter
  )];

  if (availablePublicAgents.value.length > 0) {
    const currentAgentInStore = agentStore.activeAgent;
    let agentToSetActiveId: AgentId;

    if (currentAgentInStore && availablePublicAgents.value.some(pa => pa.id === currentAgentInStore.id)) {
      agentToSetActiveId = currentAgentInStore.id;
    } else {
      const generalAgent = availablePublicAgents.value.find(a => a.id === 'general');
      agentToSetActiveId = generalAgent ? generalAgent.id : availablePublicAgents.value[0].id;
    }

    if (agentStore.activeAgentId !== agentToSetActiveId) {
      agentStore.setActiveAgent(agentToSetActiveId);
    } else { // Agent is already active, ensure prompt and content are loaded
      loadAgentSystemPrompt();
      chatStore.ensureMainContentForAgent(agentToSetActiveId);
    }
  } else {
    console.warn("[PublicHome] No publicly available agents found after filtering.");
    if (agentStore.activeAgentId) agentStore.setActiveAgent('' as AgentId);
     chatStore.updateMainContent({
      agentId: 'no-public-agents-placeholder' as AgentId, type: 'custom-component',
      data: 'NoPublicAgentsPlaceholder', title: 'Assistants Unavailable', timestamp: Date.now(),
    });
  }
};

const selectPublicAgent = (agentId: AgentId): void => {
  const agent = availablePublicAgents.value.find(a => a.id === agentId);
  if (agent && agentStore.activeAgentId !== agentId) {
    if (agentStore.activeAgentId) chatStore.clearAgentData(agentStore.activeAgentId);
    agentStore.setActiveAgent(agentId);
    toast?.add({ type: 'info', title: 'Assistant Switched', message: `Now interacting with ${agent.label}.`, duration: 2500 });
  }
  showPublicAgentSelector.value = false;
};

const loadAgentSystemPrompt = async (): Promise<void> => {
  const agent = currentPublicAgent.value; // This is IAgentDefinition | undefined
  if (agent?.systemPromptKey) {
    const promptFileName = `${agent.systemPromptKey}.md`;
    const modulePath = `../../../../prompts/${promptFileName}`;
    try {
      if (promptModules[modulePath]) {
        currentSystemPrompt.value = await promptModules[modulePath]();
      } else {
        console.warn(`[PublicHome] Prompt module not found: ${modulePath}`);
        currentSystemPrompt.value = `You are ${agent.label}. Public assistant: concise and informative.`;
      }
    } catch(e) {
        console.error(`[PublicHome] Error loading prompt for ${agent.label}:`, e);
        currentSystemPrompt.value = `You are ${agent.label}. Error loading specific prompt.`;
    }
  } else if (agent) {
    currentSystemPrompt.value = `You are ${agent.label}, helpful AI. Public preview: brief, informative.`;
  } else {
    currentSystemPrompt.value = "General helpful AI. Public, concise responses.";
  }
};

watch(() => agentStore.activeAgent, (newAgentDef, oldAgentDef) => {
  if (newAgentDef && availablePublicAgents.value.some(pa => pa.id === newAgentDef.id)) {
    if (newAgentDef.id !== oldAgentDef?.id) {
      loadAgentSystemPrompt();
      chatStore.ensureMainContentForAgent(newAgentDef.id);
    }
  } else if (!newAgentDef && availablePublicAgents.value.length === 0) {
    currentSystemPrompt.value = "No agents available."; // agentStore.activeAgent would be undefined
  }
}, { immediate: true, deep: true });


const handleTranscriptionFromLayout = async (transcriptionText: string): Promise<void> => {
  if (!transcriptionText.trim() || isLoadingResponse.value || !currentPublicAgent.value) return;

  if (rateLimitInfo.value?.tier === 'public' && (rateLimitInfo.value.remaining ?? 1) <= 0) {
   toast?.add({ type: 'error', title: 'Daily Limit Reached', message: 'Please log in or try again tomorrow.'});
   return;
  }
  const agent = currentPublicAgent.value; // Save ref to avoid issues if it changes mid-execution
  const agentId = agent.id;

  chatStore.addMessage({ role: 'user', content: transcriptionText, agentId: agentId, timestamp: Date.now() });
  isLoadingResponse.value = true;
  chatStore.setMainContentStreaming(true, `Contacting ${agent.label}...`);
  try {
    const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(
      agentId, transcriptionText, currentSystemPrompt.value, // currentSystemPrompt is already loaded for the active agent
      { 
        maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 1800 : (agent.capabilities?.maxChatHistory || 2) * 120,
        numRecentMessagesToPrioritize: agent.capabilities?.maxChatHistory || 2,
      }
    );
    const messagesForApiPayload: ChatMessageFE[] = historyForApi.map(hMsg => ({
      role: hMsg.role, content: hMsg.content, timestamp: hMsg.timestamp,
      tool_call_id: hMsg.tool_call_id, tool_calls: hMsg.tool_calls, name: hMsg.name,
    }));
    if (!messagesForApiPayload.find(m => m.role === 'user' && m.content === transcriptionText)) {
       messagesForApiPayload.push({ role: 'user', content: transcriptionText, timestamp: Date.now()});
    }
    messagesForApiPayload.sort((a,b) => (a.timestamp || 0) - (b.timestamp || 0));

    // Use currentSystemPrompt directly as it's already tailored
    let finalSystemPrompt = currentSystemPrompt.value
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified')
      .replace(/{{MODE}}/g, agentId)
      .replace(/{{GENERATE_DIAGRAM}}/g, (agent.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams).toString())
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'You are in a public preview mode. Be helpful but concise. Avoid offering actions you cannot perform like file access. Keep responses relatively short.');

    const payload: ChatMessagePayloadFE = {
      messages: [ { role: 'system', content: finalSystemPrompt }, ...messagesForApiPayload ],
      mode: agent.systemPromptKey || 'general_chat', 
      language: voiceSettingsManager.settings.preferredCodingLanguage,
      generateDiagram: agent.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: rateLimitInfo.value?.ip || `public_user_${Date.now().toString(36)}`,
      conversationId: chatStore.getCurrentConversationId(agentId), stream: true,
    };

    let accumulatedResponse = "";
    await chatAPI.sendMessageStream(
        payload,
        (chunk: string) => { accumulatedResponse += chunk; chatStore.setMainContentStreaming(true, accumulatedResponse); },
        async () => { 
            chatStore.setMainContentStreaming(false);
            const currentActiveAgent = agentStore.activeAgent; // Re-check active agent
            if (currentActiveAgent && currentActiveAgent.id === agentId) { // Ensure response is for the still-active agent
                chatStore.addMessage({ role: 'assistant', content: accumulatedResponse, agentId: agentId, model: "StreamedModel (Public)", timestamp: Date.now() });
                chatStore.updateMainContent({
                    agentId: agentId,
                    type: currentActiveAgent.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                    data: accumulatedResponse, title: `${currentActiveAgent.label} Response`, timestamp: Date.now()
                });
            }
            await fetchRateLimitInfo(); isLoadingResponse.value = false;
        },
        async (error: Error | any) => { 
            console.error('PublicHome: Chat Stream API error:', error);
            const errorMsg = error.message || 'Stream error.';
            const currentActiveAgent = agentStore.activeAgent;
            if (currentActiveAgent && currentActiveAgent.id === agentId) {
                chatStore.addMessage({ role: 'error', content: `Error: ${errorMsg}`, agentId: agentId, timestamp: Date.now() });
                chatStore.updateMainContent({
                    agentId: agentId, type: 'markdown', data: `### Stream Error\n${errorMsg}`,
                    title: `Error Processing Request`, timestamp: Date.now()
                });
            }
            chatStore.setMainContentStreaming(false); await fetchRateLimitInfo(); isLoadingResponse.value = false;
        }
    );
  } catch (error: any) { 
    console.error('PublicHome: Pre-stream Chat API error:', error.response?.data || error.message);
    const errorMsg = error.response?.data?.message || error.message || 'An error occurred.';
    if (agent) { // Use the agent captured at the start of the function
        chatStore.addMessage({ role: 'error', content: `Error: ${errorMsg}`, agentId: agent.id, timestamp: Date.now() });
        chatStore.updateMainContent({
            agentId: agent.id, type: 'markdown', data: `### Error\n${errorMsg}`,
            title: `Error Processing Request`, timestamp: Date.now()
        });
    }
    isLoadingResponse.value = false; chatStore.setMainContentStreaming(false);
    if (error.response?.status === 429) await fetchRateLimitInfo();
  }
};

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
let rateLimitInterval: number | undefined;
onMounted(async () => {
  auth.checkAuthStatus();
  if (auth.isAuthenticated.value) {
    router.replace({ name: 'AuthenticatedHome' });
    return;
  }
  document.addEventListener('click', handleClickOutsidePublicAgentSelector, true);
  await fetchRateLimitInfo();
  if (rateLimitInfo.value?.tier !== 'authenticated') {
    loadPublicAgentsAndSetDefault();
    rateLimitInterval = window.setInterval(fetchRateLimitInfo, 60000 * 5);
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
      @voice-input-processing="(status: boolean) => { isVoiceInputCurrentlyProcessing = status; if(status) isLoadingResponse = true; }"
    >
      <template #main-content>
        <div v-if="availablePublicAgents.length > 1 && (!rateLimitInfo || (rateLimitInfo.remaining ?? 1) > 0)"
             class="public-agent-selector-container-ephemeral">
          <div class="relative inline-block text-left" ref="publicAgentSelectorDropdownRef">
            <button @click="showPublicAgentSelector = !showPublicAgentSelector"
                    class="agent-selector-button-ephemeral"
                    aria-haspopup="true" :aria-expanded="showPublicAgentSelector">
              <component :is="currentPublicAgent?.icon || UserGroupIcon" class="selected-agent-icon" :class="currentPublicAgent?.iconClass" />
              <span>{{ currentPublicAgent?.label || 'Select Assistant' }}</span>
              <ChevronDownIcon class="chevron-icon" :class="{'open': showPublicAgentSelector}" />
            </button>
            <transition name="dropdown-float-neomorphic">
              <div v-if="showPublicAgentSelector" class="agent-selector-dropdown-panel-ephemeral">
                <div class="dropdown-header-holographic"><h3 class="dropdown-title">Public Assistants</h3></div>
                <div class="dropdown-content-holographic custom-scrollbar-thin">
                  <button
                    v-for="agentDef in availablePublicAgents" :key="agentDef.id"
                    @click="selectPublicAgent(agentDef.id)"
                    class="dropdown-item-holographic"
                    :class="{ 'active': currentPublicAgent?.id === agentDef.id }"
                    role="menuitemradio" :aria-checked="currentPublicAgent?.id === agentDef.id">
                    <div class="mode-icon-dd-holographic" :class="agentDef.iconClass">
                        <component :is="agentDef.icon || SparklesIcon" class="icon-base" />
                    </div>
                    <span class="dropdown-item-label">{{ agentDef.label }}</span>
                     <CheckIcon v-if="currentPublicAgent?.id === agentDef.id" class="icon-sm checkmark-icon-active" />
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <div v-if="mainContentComputed?.type === 'custom-component' && mainContentComputed.data === 'RateLimitExceededPlaceholder'" class="rate-limit-banner-ephemeral">
          <ExclamationTriangleIcon class="banner-icon-ephemeral" />
          <h3 class="banner-title-ephemeral">Daily Public Preview Limit Reached</h3>
          <p class="banner-text-ephemeral">
            Access resets around <strong>{{ formatResetTime(rateLimitInfo?.resetAt) }}</strong>.
          </p>
          <RouterLink to="/login" class="login-prompt-link-ephemeral btn btn-primary-ephemeral btn-sm-ephemeral">
            <KeyIcon class="icon-sm mr-1.5" /> Log In for Full Access
          </RouterLink>
        </div>
        <div v-else-if="mainContentComputed?.type === 'custom-component' && mainContentComputed.data === 'PublicWelcomePlaceholder'" class="public-welcome-placeholder-ephemeral">
          <SparklesIcon class="hero-icon-ephemeral" />
          <h2 class="welcome-title-ephemeral">Welcome to Voice Chat Assistant</h2>
          <p class="welcome-subtitle-ephemeral">
            This is a public preview. {{ availablePublicAgents.length > 1 ? 'Select an assistant to begin.' : (currentPublicAgent ? `Interacting with ${currentPublicAgent.label}.` : 'Use the default assistant to begin.') }}
            Interactions are rate-limited. For full features, please <RouterLink to="/login" class="link-ephemeral">log in</RouterLink>.
          </p>
        </div>
        <div v-else-if="mainContentComputed?.type === 'custom-component' && mainContentComputed.data === 'NoPublicAgentsPlaceholder'" class="public-welcome-placeholder-ephemeral">
            <UserGroupIcon class="hero-icon-ephemeral !text-[var(--color-text-muted)]" />
            <h2 class="welcome-title-ephemeral">Assistants Unavailable</h2>
            <p class="welcome-subtitle-ephemeral">
                We're sorry, but there are currently no public assistants configured for preview. Please check back later or <RouterLink to="/login" class="link-ephemeral">log in</RouterLink> for full access.
            </p>
        </div>
        
        <MainContentView :agent="currentPublicAgent" class="main-content-view-wrapper-ephemeral" v-else-if="currentPublicAgent && mainContentComputed && mainContentComputed.type !== 'custom-component'">
            <CompactMessageRenderer
              v-if="currentPublicAgent?.capabilities?.usesCompactRenderer && mainContentComputed.type === 'compact-message-renderer-data'"
              :content="mainContentComputed.data"
              :mode="currentPublicAgent.id"
              class="content-renderer-ephemeral"
            />
            <div v-else-if="mainContentComputed.type === 'markdown' || mainContentComputed.type === 'welcome'"
                 class="prose-ephemeral content-renderer-ephemeral"
                 v-html="isLoadingResponse && chatStore.isMainContentStreaming && chatStore.currentMainContentData?.agentId === currentPublicAgent.id ?
                         chatStore.streamingMainContentText + '<span class=\'streaming-cursor-ephemeral\'>|</span>' :
                         mainContentComputed.data"
                 aria-atomic="true">
            </div>
            <div v-else-if="mainContentComputed.type === 'error'"
                 class="prose-ephemeral prose-error content-renderer-ephemeral"
                 v-html="mainContentComputed.data"
                 aria-atomic="true">
            </div>
            <div v-else class="content-renderer-ephemeral text-[var(--color-text-muted)] italic">
              <p>Agent: {{ currentPublicAgent.label }} (Type: {{ mainContentComputed.type }})</p>
            </div>
        </MainContentView>

        <div v-else-if="isLoadingResponse" class="loading-placeholder-ephemeral">
          <div class="loading-animation-content">
            <div class="loading-spinner-ephemeral !w-12 !h-12">
              <div v-for="i in 8" :key="`blade-${i}`" class="spinner-blade-ephemeral !w-1.5 !h-4"></div>
            </div>
            <p class="loading-text-ephemeral !text-base mt-3">Loading Assistant...</p>
          </div>
        </div>
         <div v-else class="public-welcome-placeholder-ephemeral">
            <SparklesIcon class="hero-icon-ephemeral !text-[var(--color-text-muted)]" />
            <h2 class="welcome-title-ephemeral">Loading Interface...</h2>
        </div>
      </template>
    </UnifiedChatLayout>
  </div>
</template>

<style lang="scss">
// Styles in frontend/src/styles/views/_public-home.scss
</style>