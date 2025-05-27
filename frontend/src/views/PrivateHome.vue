// File: frontend/src/views/PrivateHome.vue
/**
 * @file PrivateHome.vue
 * @description Authenticated home view using UnifiedChatLayout for the "Ephemeral Harmony" theme.
 * Features a visually engaging dashboard placeholder.
 * @version 3.1.2 - Corrected import.meta.glob syntax.
 */
<script setup lang="ts">
import { ref, computed, onMounted, watch, type Component as VueComponentType, defineAsyncComponent, inject } from 'vue';
import { useRouter } from 'vue-router';
import type { ToastService } from '@/services/services';
import { agentService, type AgentId, type IAgentDefinition } from '@/services/agent.service';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type MainContent } from '@/store/chat.store';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { useAuth } from '@/composables/useAuth';
import {
  chatAPI,
  type ChatMessagePayloadFE,
  type ProcessedHistoryMessageFE,
  type ChatMessageFE,
} from '@/utils/api';

import UnifiedChatLayout from '@/components/layouts/UnifiedChatLayout.vue';
import MainContentView from '@/components/agents/common/MainContentView.vue';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';

import { ShieldCheckIcon, CogIcon, SparklesIcon as SparklesIconSolid } from '@heroicons/vue/24/solid';

// Dynamic Prompt Loading
// Corrected import.meta.glob: Removed 'as' option, using only 'query'.
const rawPromptModules = import.meta.glob("../../../../prompts/*.md", { query: "?raw", import: "default", eager: false });
const promptModules: Record<string, () => Promise<string>> = {};
for (const key in rawPromptModules) {
  const mod = rawPromptModules[key];
  promptModules[key] = () => {
    return Promise.resolve(mod()).then(res => res as string);
  };
}

const toast = inject<ToastService>('toast');
const router = useRouter();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const auth = useAuth();

const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);
const currentAgentUiComponent = computed<VueComponentType | string | undefined>(() => {
  if (activeAgent.value?.uiComponent && typeof activeAgent.value.uiComponent === 'function') {
    return defineAsyncComponent(activeAgent.value.uiComponent as () => Promise<VueComponentType>);
  }
  return activeAgent.value?.uiComponent;
});

const isLoadingResponse = ref(false);
const isVoiceInputCurrentlyProcessing = ref(false);
const agentViewRef = ref<any>(null);

const mainContentComputed = computed<MainContent | null>(() => {
  if (!activeAgent.value) {
    return {
      agentId: 'private-dashboard-placeholder' as AgentId, type: 'custom-component',
      data: 'PrivateDashboardPlaceholder', title: 'Welcome Back', timestamp: Date.now(),
    };
  }
  if (currentAgentUiComponent.value) return null;

  return chatStore.getMainContentForAgent(activeAgent.value.id) || {
    agentId: activeAgent.value.id, type: 'welcome',
    data: `<h2 class="text-2xl font-semibold mb-3">Welcome to ${activeAgent.value.label}</h2><p class="text-lg">How can I assist you today? Use the input below to start.</p>`,
    title: activeAgent.value.label, timestamp: Date.now()
  };
});

const shouldUseFramedContent = computed(() => {
  return activeAgent.value && !currentAgentUiComponent.value && mainContentComputed.value?.type !== 'custom-component';
});

const handleTranscriptionFromLayout = async (transcription: string): Promise<void> => {
  if (!transcription.trim() || !activeAgent.value) {
    if (!activeAgent.value) toast?.add({ type: 'warning', title: 'No Agent Selected', message: 'Please select an agent from the header menu.' });
    return;
  }

  isVoiceInputCurrentlyProcessing.value = true;
  isLoadingResponse.value = true;
  const currentAgentInstance = activeAgent.value;

  if (currentAgentInstance.capabilities?.handlesOwnInput && agentViewRef.value && typeof agentViewRef.value.handleNewUserInput === 'function') {
    try {
      await agentViewRef.value.handleNewUserInput(transcription);
    } catch (error) {
      console.error(`[PrivateHome] Error in agent's (${currentAgentInstance.id}) custom input handler:`, error);
      toast?.add({type: 'error', title: 'Agent Error', message: 'The agent encountered an issue.'});
      isLoadingResponse.value = false;
    }
  } else {
    const agentId = currentAgentInstance.id;
    chatStore.addMessage({ role: 'user', content: transcription, agentId: agentId, timestamp: Date.now() });
    chatStore.setMainContentStreaming(true, `Consulting ${currentAgentInstance.label}...`);

    try {
      const systemPromptKey = currentAgentInstance.systemPromptKey || 'general_chat';
      // Construct the key exactly as it would appear in promptModules from import.meta.glob
      // import.meta.glob keys are relative to the current file.
      // If PrivateHome.vue is in src/views, and prompts is at project_root/prompts
      // then the path is indeed ../../../../prompts/
      const promptModuleKey = `../../../../prompts/${systemPromptKey}.md`;
      let systemPromptText = `You are ${currentAgentInstance.label}.`;

      if (promptModules[promptModuleKey]) {
        systemPromptText = (await promptModules[promptModuleKey]())
          .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified')
          .replace(/{{MODE}}/g, agentId)
          .replace(/{{GENERATE_DIAGRAM}}/g, (currentAgentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams).toString())
          .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, '');
      } else {
        console.warn(`[PrivateHome] System prompt module not found for key: ${promptModuleKey}. Using default. Available keys:`, Object.keys(promptModules));
      }

      const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(agentId, transcription, systemPromptText, {
        numRecentMessagesToPrioritize: currentAgentInstance.capabilities?.maxChatHistory || 10,
        maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 8000 : (currentAgentInstance.capabilities?.maxChatHistory || 10) * 150,
      });

      const messagesForApiPayload: ChatMessageFE[] = historyForApi.map(hMsg => ({
        role: hMsg.role, content: hMsg.content, timestamp: hMsg.timestamp,
        tool_call_id: hMsg.tool_call_id, tool_calls: hMsg.tool_calls, name: hMsg.name,
      }));
      if (!messagesForApiPayload.find(m => m.role === 'user' && m.content === transcription)) {
        messagesForApiPayload.push({ role: 'user', content: transcription, timestamp: Date.now()});
      }
      messagesForApiPayload.sort((a,b) => (a.timestamp || 0) - (b.timestamp || 0));

      const payload: ChatMessagePayloadFE = {
        messages: [ { role: 'system', content: systemPromptText }, ...messagesForApiPayload ],
        mode: systemPromptKey,
        language: voiceSettingsManager.settings.preferredCodingLanguage,
        generateDiagram: currentAgentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
        userId: auth.isAuthenticated.value ? 'authenticated_user' : 'private_user_unknown',
        conversationId: chatStore.getCurrentConversationId(agentId),
        stream: true,
      };

      let accumulatedResponse = "";
      await chatAPI.sendMessageStream(
        payload,
        (chunk: string) => { accumulatedResponse += chunk; chatStore.setMainContentStreaming(true, accumulatedResponse); },
        () => { /* ... (rest of the function remains the same) ... */
          chatStore.setMainContentStreaming(false);
          if (agentStore.activeAgentId === agentId) {
            chatStore.addMessage({ role: 'assistant', content: accumulatedResponse, agentId: agentId, model: "StreamedModel (Private)", timestamp: Date.now() });
            chatStore.updateMainContent({
              agentId: agentId,
              type: currentAgentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
              data: accumulatedResponse, title: `${currentAgentInstance.label} Response`, timestamp: Date.now()
            });
          }
          isLoadingResponse.value = false;
        },
        (error: Error | any) => { /* ... (rest of the function remains the same) ... */
          console.error(`[PrivateHome] Stream API error for agent ${agentId}:`, error);
          const errorMsg = error.message || "Stream error.";
          if (agentStore.activeAgentId === agentId) {
            chatStore.addMessage({ role: 'error', content: `Error: ${errorMsg}`, agentId, timestamp: Date.now() });
            chatStore.updateMainContent({
              agentId, type: 'markdown', data: `### Stream Error\n${errorMsg}`,
              title: `Error with ${currentAgentInstance.label}`, timestamp: Date.now()
            });
          }
          chatStore.setMainContentStreaming(false); isLoadingResponse.value = false;
        }
      );
    } catch (error: any) { /* ... (rest of the function remains the same) ... */
      console.error(`[PrivateHome] Chat API error for agent ${agentId}:`, error);
      const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred.";
      if (agentStore.activeAgentId === agentId) {
          chatStore.addMessage({ role: 'error', content: `Error: ${errorMsg}`, agentId, timestamp: Date.now() });
          chatStore.updateMainContent({
            agentId, type: 'markdown', data: `### Interaction Error\n${errorMsg}`,
            title: `Error with ${currentAgentInstance.label}`, timestamp: Date.now()
          });
      }
      chatStore.setMainContentStreaming(false); isLoadingResponse.value = false;
    }
  }
};

const handleAgentViewEventFromSlot = (eventData: any): void => { /* ... (function remains the same) ... */
  if (!activeAgent.value) return;
  console.log(`[PrivateHome] Event from agent UI (${activeAgent.value.label}):`, eventData);
  switch (eventData.type) {
    case 'updateMainContent':
      chatStore.updateMainContent({
        agentId: activeAgent.value.id, type: eventData.payload.type || 'markdown',
        data: eventData.payload.data, title: eventData.payload.title || `${activeAgent.value.label} Update`,
        timestamp: Date.now(),
      });
      break;
    case 'addChatMessage':
      chatStore.addMessage({
        agentId: activeAgent.value.id, timestamp: Date.now(), role: eventData.payload.role || 'assistant',
        content: eventData.payload.content, ...(eventData.payload.extra || {})
      });
      break;
    case 'setProcessingState':
      isLoadingResponse.value = !!eventData.payload.isProcessing;
      if (!eventData.payload.isProcessing && chatStore.isMainContentStreaming) {
         chatStore.setMainContentStreaming(false);
      }
      break;
    case 'requestGlobalAction':
      if (eventData.action === 'navigateTo' && eventData.payload?.route) {
        router.push(eventData.payload.route);
      }
      break;
    default:
      console.warn(`[PrivateHome] Unhandled agent event type: ${eventData.type}`);
  }
};

onMounted(() => { /* ... (function remains the same) ... */
  if (!agentStore.activeAgentId || !agentService.getAgentById(agentStore.activeAgentId)) {
    const defaultPrivateAgent = agentService.getDefaultAgent();
    if (defaultPrivateAgent) {
      agentStore.setActiveAgent(defaultPrivateAgent.id);
    } else {
      console.error("[PrivateHome] Critical: No default private agent found.");
      chatStore.updateMainContent({
        agentId: 'system-error' as AgentId, type: 'markdown',
        data: "### System Error\nNo default agent could be loaded. Please configure agents in settings.",
        title: "Initialization Error", timestamp: Date.now()
      });
    }
  } else {
     chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
  }
});

watch(() => agentStore.activeAgentId, (newAgentId, oldAgentId) => { /* ... (function remains the same) ... */
  if (newAgentId && newAgentId !== oldAgentId) {
    isLoadingResponse.value = false;
    if(chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false);
    chatStore.ensureMainContentForAgent(newAgentId);
  }
  if (!newAgentId && oldAgentId) {
     chatStore.updateMainContent({
      agentId: 'private-dashboard-placeholder' as AgentId, type: 'custom-component',
      data: 'PrivateDashboardPlaceholder', title: 'Welcome Back', timestamp: Date.now(),
    });
  }
});
</script>

<template> <div class="private-home-view-ephemeral">
    <UnifiedChatLayout
      :is-voice-input-processing="isVoiceInputCurrentlyProcessing"
      @transcription="handleTranscriptionFromLayout"
      @voice-input-processing="(status: boolean) => { isVoiceInputCurrentlyProcessing = status; if (!status) isLoadingResponse = false; }"
    >
      <template #main-content>
        <MainContentView :agent="activeAgent" class="main-content-view-wrapper-ephemeral" :class="{'has-framed-content': shouldUseFramedContent}" v-if="activeAgent">
          <transition name="agent-ui-fade" mode="out-in">
            <component
              :is="currentAgentUiComponent"
              v-if="currentAgentUiComponent && typeof currentAgentUiComponent !== 'string' && activeAgent.capabilities?.handlesOwnInput"
              :key="activeAgent.id + '-dynamic-ui'"
              ref="agentViewRef"
              :agent-id="activeAgent.id"
              :agent-config="activeAgent"
              @agent-event="handleAgentViewEventFromSlot"
              @set-processing-state="(status: boolean) => { isLoadingResponse = status; if (!status && chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false); }"
            />
            <div v-else-if="mainContentComputed && mainContentComputed.type !== 'custom-component'"
                 class="content-renderer-container-ephemeral">
              <CompactMessageRenderer
                v-if="activeAgent?.capabilities?.usesCompactRenderer && mainContentComputed.type === 'compact-message-renderer-data'"
                :content="mainContentComputed.data"
                :mode="activeAgent.id"
                class="content-renderer-ephemeral"
              />
              <div v-else-if="mainContentComputed.type === 'markdown' || mainContentComputed.type === 'welcome'"
                   class="prose-ephemeral content-renderer-ephemeral"
                   v-html="isLoadingResponse && chatStore.isMainContentStreaming && chatStore.currentMainContentData?.agentId === activeAgent.id ?
                             chatStore.streamingMainContentText + '<span class=\'streaming-cursor-ephemeral\'>|</span>' :
                             mainContentComputed.data"
                   aria-atomic="true">
              </div>
              <div v-else-if="mainContentComputed.type === 'error'"
                   class="prose-ephemeral prose-error content-renderer-ephemeral"
                   v-html="mainContentComputed.data"
                   aria-atomic="true">
              </div>
               <div v-else class="content-renderer-ephemeral text-[var(--color-text-muted)] italic p-6 text-center">
                  <p class="text-lg">Interacting with {{ activeAgent.label }}.</p>
                  <p class="text-sm mt-2">(Content type: {{ mainContentComputed.type }})</p>
              </div>
            </div>
            <div v-else-if="isLoadingResponse" class="loading-placeholder-ephemeral">
              <div class="loading-animation-content">
                <div class="loading-spinner-ephemeral !w-12 !h-12">
                  <div v-for="i in 8" :key="`blade-${i}`" class="spinner-blade-ephemeral !w-1.5 !h-4"></div>
                </div>
                <p class="loading-text-ephemeral !text-base mt-3">{{ activeAgent.label }} is working...</p>
              </div>
            </div>
          </transition>
        </MainContentView>

        <div v-else-if="mainContentComputed?.type === 'custom-component' && mainContentComputed.data === 'PrivateDashboardPlaceholder'"
             class="private-dashboard-placeholder-ephemeral">
          <ShieldCheckIcon class="dashboard-icon-ephemeral" />
          <h2 class="dashboard-title-ephemeral">Secure AI Workspace</h2>
          <p class="dashboard-subtitle-ephemeral">
            Welcome back! Select an assistant from the header menu to begin your tasks, or manage your preferences.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 mt-8">
            <button @click="router.push('/settings')" class="btn btn-secondary-ephemeral">
                <CogIcon class="icon-sm"/> Configure Agents & Settings
            </button>
          </div>
        </div>

        <div v-else class="loading-placeholder-ephemeral">
           <div class="loading-animation-content">
             <div class="loading-spinner-ephemeral !w-16 !h-16">
                <div v-for="i in 8" :key="`blade-${i}`" class="spinner-blade-ephemeral !w-2 !h-5"></div>
             </div>
             <p class="loading-text-ephemeral !text-lg mt-4">Initializing Your Workspace...</p>
           </div>
        </div>
      </template>
    </UnifiedChatLayout>
  </div>
</template>

<style lang="scss">
// Styles are in frontend/src/styles/views/_private-home.scss
</style>