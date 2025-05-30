// File: frontend/src/views/PublicHome.vue
/**
 * @file PublicHome.vue
 * @description Public-facing home page using UnifiedChatLayout.
 * Features rate limiting, public agent selection, themed placeholders, API-driven prompt loading,
 * and dynamic loading of custom agent views if specified for public agents.
 * @version 3.4.0 - Implemented generic dynamic component loading for public agents with viewComponentName.
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject, watch, defineAsyncComponent, type Component as VueComponentType } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import {
  api, chatAPI, promptAPI, // Added promptAPI
  type ChatMessagePayloadFE, type ProcessedHistoryMessageFE, type ChatMessageFE,
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
} from '@heroicons/vue/24/outline'; // Using CheckOutlineIcon for consistency with other outline icons here

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
const agentViewRef = ref<any>(null); // For dedicated agent views, if any public agent uses one

const currentAgentViewComponent = computed<VueComponentType | null>(() => {
  const componentName = currentPublicAgent.value?.viewComponentName;
  const agentLabel = currentPublicAgent.value?.label || 'Current Public Agent';
  if (componentName && currentPublicAgent.value?.isPublic) { // Only load for public agents with a view
    try {
      console.log(`[PublicHome] Attempting to load dedicated view component: ${componentName} for public agent: ${agentLabel}`);
      return defineAsyncComponent(() =>
        import(`@/components/agents/${componentName}.vue`)
          .catch(err => {
            console.error(`[PublicHome] Failed to import @/components/agents/${componentName}.vue:`, err);
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

const isLoadingResponse = ref(false);
const isVoiceInputCurrentlyProcessing = ref(false);
const currentSystemPromptText = ref('');
const rateLimitInfo = ref<RateLimitInfo | null>(null);

const mainContentData = computed<MainContent | null>(() => {
  if (rateLimitInfo.value?.tier === 'public' && (rateLimitInfo.value.remaining !== undefined && rateLimitInfo.value.remaining <= 0)) {
    return {
      agentId: currentPublicAgent.value?.id as AgentId ?? (availablePublicAgents.value[0]?.id as AgentId),
      type: 'custom-component',
      data: 'RateLimitExceededPlaceholder',
      timestamp: Date.now()
    };
  }
  if (!currentPublicAgent.value && availablePublicAgents.value.length > 0) {
    return {
      agentId: availablePublicAgents.value[0]?.id as AgentId,
      type: 'custom-component',
      data: 'PublicWelcomePlaceholder',
      timestamp: Date.now()
    };
  }
  if (availablePublicAgents.value.length === 0 && !currentPublicAgent.value) {
    // If there are no public agents at all, pick a default/fallback AgentId (could be undefined)
    return {
      agentId: '' as AgentId,
      type: 'custom-component',
      data: 'NoPublicAgentsPlaceholder',
      timestamp: Date.now()
    };
  }
  // If a dedicated view is loaded, it handles its content.
  if (currentAgentViewComponent.value && currentPublicAgent.value?.isPublic) return null;

  return currentPublicAgent.value ? chatStore.getCurrentMainContentDataForAgent(currentPublicAgent.value.id) : null;
});

const showEphemeralLogForCurrentAgent = computed(() => currentPublicAgent.value?.capabilities?.showEphemeralChatLog ?? true);

const fetchRateLimitInfo = async (): Promise<void> => { /* ... as before ... */ };
const loadCurrentAgentSystemPrompt = async (): Promise<void> => {
  const agent = currentPublicAgent.value;
  const agentLabel = agent?.label || 'Public Agent';
  if (!agent) {
    currentSystemPromptText.value = "No agent selected."; return;
  }
  const systemPromptKey = agent.systemPromptKey; // Required field
  let defaultPromptText = `You are ${agentLabel}. As a public assistant, be helpful and concise.`;
  try {
      console.log(`[PublicHome] Loading prompt for key: ${systemPromptKey}.md for agent: ${agentLabel}`);
      const promptResponse = await promptAPI.getPrompt(`${systemPromptKey}.md`);
      if (promptResponse.data && typeof promptResponse.data.content === 'string') {
          currentSystemPromptText.value = promptResponse.data.content;
      } else {
          currentSystemPromptText.value = defaultPromptText;
      }
  } catch (e) {
      console.error(`[PublicHome] Failed to load prompt "${systemPromptKey}.md" for agent "${agentLabel}":`, e);
      currentSystemPromptText.value = defaultPromptText;
  }
};

const loadPublicAgentsAndSetDefault = async (): Promise<void> => { /* ... as before, ensures loadCurrentAgentSystemPrompt is called if agent is already set ... */ 
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
      agentStore.setActiveAgent(agentToSet.id);
    } else if (agentToSet) {
      await loadCurrentAgentSystemPrompt(); // Ensure prompt is loaded
      chatStore.ensureMainContentForAgent(agentToSet.id);
    }
  } else {
    if (agentStore.activeAgentId) agentStore.setActiveAgent(null);
  }
};
const selectPublicAgent = (agentId: AgentId): void => { /* ... as before ... */ };

watch(() => agentStore.activeAgentId, async (newAgentId, oldAgentId) => { /* ... as before, calls loadCurrentAgentSystemPrompt ... */ }, { immediate: true });


const handleTranscriptionFromLayout = async (transcriptionText: string): Promise<void> => {
  if (!transcriptionText.trim()) return;
  const agent = currentPublicAgent.value;
  if (!agent) { /* ... no agent selected toast ... */ return; }
  if (isLoadingResponse.value) return;
  if (rateLimitInfo.value?.tier === 'public' && (rateLimitInfo.value.remaining ?? 1) <= 0) { /* ... rate limit toast & display ... */ return; }

  const agentId = agent.id;
  const agentLabel = agent.label || 'Assistant';
  isVoiceInputCurrentlyProcessing.value = true; // For UnifiedChatLayout visual state
  isLoadingResponse.value = true;


  // If agent has a dedicated view component and handles its own input
  if (agent.capabilities?.handlesOwnInput && currentAgentViewComponent.value && agentViewRef.value) {
    try {
      if (typeof agentViewRef.value.processProblemContext === 'function') {
        await agentViewRef.value.processProblemContext(transcriptionText);
      } else if (typeof agentViewRef.value.handleNewUserInput === 'function') {
        await agentViewRef.value.handleNewUserInput(transcriptionText);
      } else {
        console.warn(`[PublicHome] Public Agent "${agentLabel}" (ID: ${agentId}) has 'handlesOwnInput' and a view, but no input handler method found. Falling back to standard chat.`);
        await standardLlmCallPublic(transcriptionText, agent);
      }
    } catch (error: any) {
      console.error(`[PublicHome] Error in public agent's ("${agentLabel}") custom input handler:`, error);
      toast?.add({type: 'error', title: `${agentLabel} Error`, message: error.message || `Agent "${agentLabel}" had an issue.`});
      isLoadingResponse.value = false; // Reset as fallback
    } finally {
      isVoiceInputCurrentlyProcessing.value = false;
      // isLoadingResponse.value = false; // Agent view should manage this
    }
  } else {
    await standardLlmCallPublic(transcriptionText, agent);
  }
};

async function standardLlmCallPublic(transcriptionText: string, agentInstance: IAgentDefinition) {
    const agentId = agentInstance.id;
    const agentLabel = agentInstance.label || 'Assistant';

    chatStore.addMessage({ role: 'user', content: transcriptionText, agentId: agentId, timestamp: Date.now() });
    // isLoadingResponse & isVoiceInputCurrentlyProcessing already true
    const streamingPlaceholder = `Contacting ${agentLabel}...`;
    chatStore.updateMainContent({
        agentId, type: 'loading', data: streamingPlaceholder,
        title: `Contacting ${agentLabel}...`, timestamp: Date.now()
    });
    chatStore.setMainContentStreaming(true, streamingPlaceholder);

    try {
        // currentSystemPromptText is loaded by watcher or loadCurrentAgentSystemPrompt
        if (!currentSystemPromptText.value || currentSystemPromptText.value.startsWith("No agent selected")) {
            await loadCurrentAgentSystemPrompt();
            if (!currentSystemPromptText.value || currentSystemPromptText.value.startsWith("No agent selected")) {
                throw new Error("System prompt for the agent could not be loaded.");
            }
        }
        
        const historyConfig: Partial<AdvancedHistoryConfig> = { /* ... */ };
        const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(agentId, transcriptionText, currentSystemPromptText.value, historyConfig);
        let messagesForApiPayload: ChatMessageFE[] = historyForApi.map(hMsg => ({
            role: hMsg.role,
            content: hMsg.content,
            timestamp: hMsg.timestamp,
            agentId: hMsg.agentId,
            // Add other properties as needed to match ChatMessageFE
        }));
        if (!messagesForApiPayload.some(m => m.role === 'user' && m.content === transcriptionText)) {
            messagesForApiPayload.push({ role: 'user', content: transcriptionText, timestamp: Date.now()});
        }
        messagesForApiPayload.sort((a,b) => (a.timestamp || 0) - (b.timestamp || 0));

        let finalSystemPromptText = (currentSystemPromptText.value)
          .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified')
          .replace(/{{MODE}}/g, agentId)
          .replace(/{{GENERATE_DIAGRAM}}/g, ((agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams) ?? false).toString())
          .replace(/{{USER_QUERY}}/g, transcriptionText)
          .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'You are in a public preview mode. Be helpful but concise. Avoid offering actions you cannot perform like file access. Keep responses relatively short.');

        const payload: ChatMessagePayloadFE = { /* ... */
            messages: messagesForApiPayload,
            mode: agentInstance.systemPromptKey,
            systemPromptOverride: finalSystemPromptText,
            userId: rateLimitInfo.value?.ip || `public_user_${Date.now().toString(36)}`,
            conversationId: chatStore.getCurrentConversationId(agentId), stream: true,
        };

        let accumulatedResponse = "";
        await chatAPI.sendMessageStream(payload,
            (chunk: string) => { /* ... onChunk ... */ 
                accumulatedResponse += chunk;
                if (agentStore.activeAgentId === agentId) {
                    chatStore.updateMainContent({
                        agentId: agentId,
                        type: agentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                        data: accumulatedResponse + "▋", title: `${agentLabel} Responding...`, timestamp: Date.now()
                    });
                }
            },
            async () => { /* ... onStreamEnd, includes fetchRateLimitInfo ... */
                chatStore.setMainContentStreaming(false);
                const finalContent = accumulatedResponse.trim();
                const currentActiveAgent = agentStore.activeAgent;
                if (currentActiveAgent && currentActiveAgent.id === agentId) {
                    chatStore.addMessage({ role: 'assistant', content: finalContent, agentId: agentId, model:"StreamedModel (Public)", timestamp: Date.now() });
                    chatStore.updateMainContent({
                        agentId: agentId,
                        type: currentActiveAgent.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                        data: finalContent, title: `${agentLabel} Response`, timestamp: Date.now()
                    });
                }
                await fetchRateLimitInfo(); // Crucial
                isLoadingResponse.value = false;
                isVoiceInputCurrentlyProcessing.value = false;
            },
            async (error: Error | any) => { /* ... onStreamError, includes fetchRateLimitInfo ... */ }
        );
    } catch (error: any) { /* ... General catch, includes fetchRateLimitInfo on 429 ... */ }
    // finally { // isLoadingResponse, etc., are handled in stream end/error or general catch
    //    isLoadingResponse.value = false;
    //    isVoiceInputCurrentlyProcessing.value = false;
    //    chatStore.setMainContentStreaming(false);
    // }
};


const formatResetTime = (dateInput?: string | Date): string => { /* ... as before ... */ return "soon"; };
const handleClickOutsidePublicAgentSelector = (event: MouseEvent) => { /* ... as before ... */ };
let rateLimitInterval: number | undefined;
onMounted(async () => { /* ... as before ... */ });
onUnmounted(() => { /* ... as before ... */ });

</script>

<template>
  <div class="public-home-view-ephemeral">
    <UnifiedChatLayout
      :is-voice-input-processing="isVoiceInputCurrentlyProcessing"
      :show-ephemeral-log="{ type: showEphemeralLogForCurrentAgent, default: true }"
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
          </div>
        <div v-else-if="mainContentData?.type === 'custom-component' && mainContentData.data === 'PublicWelcomePlaceholder'"
             class="public-welcome-placeholder-ephemeral">
          </div>
        <div v-else-if="mainContentData?.type === 'custom-component' && mainContentData.data === 'NoPublicAgentsPlaceholder'"
             class="public-welcome-placeholder-ephemeral">
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
          </div>
         <div v-else class="public-welcome-placeholder-ephemeral">
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
  overflow: auto;
}
.default-agent-mcv { // Ensure default view also fills space
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}
.content-renderer-container-ephemeral { // Used in PrivateHome, ensure it exists if needed
    flex-grow: 1;
    overflow-y: auto;
}
</style>