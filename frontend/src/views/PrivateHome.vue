// File: frontend/src/views/PrivateHome.vue
/**
 * @file PrivateHome.vue
 * @description Authenticated home view using UnifiedChatLayout for the "Ephemeral Harmony" theme.
 * @version 3.0.2 - TypeScript error corrections (promptModules, eventData, capabilities access).
 */
<script setup lang="ts">
import { ref, computed, onMounted, inject, watch, type Component as VueComponentType, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import type { ToastService } from '@/services/services';
import { agentService, type AgentId, type IAgentDefinition } from '@/services/agent.service'; // IAgentDefinition now includes capabilities
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type MainContent } from '@/store/chat.store';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { useAuth } from '@/composables/useAuth';
import {
  chatAPI,
  type ChatMessagePayloadFE,
  type ProcessedHistoryMessageFE, // Kept for potential future use with more complex history
  type ChatMessageFE,
} from '@/utils/api';

import UnifiedChatLayout from '@/components/layouts/UnifiedChatLayout.vue';
import MainContentView from '@/components/agents/common/MainContentView.vue';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';

import { ShieldCheckIcon, SparklesIcon as SparklesIconOutline, CodeBracketSquareIcon } from '@heroicons/vue/24/outline';

// --- Dynamic Prompt Loading ---
const rawPromptModules = import.meta.glob('../../../../prompts/*.md', { as: 'raw', import: 'default' });
const promptModules: Record<string, () => Promise<string>> = {};
for (const key in rawPromptModules) {
  const mod = rawPromptModules[key];
  promptModules[key] = () => {
    const result = mod();
    return result instanceof Promise ? result : Promise.resolve(result);
  };
}

const toast = inject<ToastService>('toast');
const router = useRouter();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const auth = useAuth();

const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);
const currentAgentUiComponent = computed<VueComponentType | string | undefined>(() => {
  if (typeof activeAgent.value?.uiComponent === 'function') {
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
  // If agent has a specific UI component, it handles rendering, mainContentComputed is null for this case.
  if (currentAgentUiComponent.value) return null;

  // Otherwise, provide default content from chatStore or a welcome message.
  return chatStore.getMainContentForAgent(activeAgent.value.id) || {
      agentId: activeAgent.value.id, type: 'welcome',
      data: `Welcome to the ${activeAgent.value.label} assistant. How can I assist you today?`,
      title: activeAgent.value.label, timestamp: Date.now()
  };
});

const handleTranscriptionFromLayout = async (transcription: string): Promise<void> => {
  if (!transcription.trim() || !activeAgent.value) {
    if(!activeAgent.value) toast?.add({ type: 'warning', title: 'No Agent Selected', message: 'Please select an agent.' });
    return;
  }

  isVoiceInputCurrentlyProcessing.value = true;
  isLoadingResponse.value = true;

  // Use agent's custom input handler if it's defined and the agent view exists
  if (activeAgent.value.capabilities?.handlesOwnInput && agentViewRef.value && typeof agentViewRef.value.handleNewUserInput === 'function') {
    try {
      await agentViewRef.value.handleNewUserInput(transcription);
    } catch (error) {
      console.error(`[PrivateHome] Error in agent's (${activeAgent.value.id}) custom input handler:`, error);
      toast?.add({type: 'error', title: 'Agent Error', message: 'The agent encountered an issue.'});
      isVoiceInputCurrentlyProcessing.value = false;
      isLoadingResponse.value = false;
    }
  } else { // Fallback default chat interaction
    const agentId = activeAgent.value.id;
    chatStore.addMessage({ role: 'user', content: transcription, agentId: agentId, timestamp: Date.now() });
    chatStore.setMainContentStreaming(true, `Consulting ${activeAgent.value.label}...`);

    try {
      const systemPromptKey = activeAgent.value.systemPromptKey || 'general_chat';
      const modulePath = `../../../../prompts/${systemPromptKey}.md`;
      let systemPromptText = `You are ${activeAgent.value.label}.`;
      if (promptModules[modulePath]) {
        systemPromptText = (await promptModules[modulePath]())
          .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified')
          .replace(/{{MODE}}/g, agentId)
          .replace(/{{GENERATE_DIAGRAM}}/g, (activeAgent.value.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams).toString())
          .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, '');
      } else {
        console.warn(`[PrivateHome] System prompt module not found: ${modulePath}.`);
      }
      
      const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(agentId, transcription, systemPromptText, {
        numRecentMessagesToPrioritize: activeAgent.value.capabilities?.maxChatHistory || 10,
        maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 4000 : (activeAgent.value.capabilities?.maxChatHistory || 10) * 150,
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
        generateDiagram: activeAgent.value.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
        userId: auth.currentToken.value ? `user_priv_${auth.currentToken.value.slice(-8)}` : 'private_user_unknown',
        conversationId: chatStore.getCurrentConversationId(agentId),
        stream: true,
      };

      let accumulatedResponse = "";
      await chatAPI.sendMessageStream(
        payload,
        (chunk: string) => { accumulatedResponse += chunk; chatStore.setMainContentStreaming(true, accumulatedResponse); },
        () => { 
          chatStore.setMainContentStreaming(false);
          if (activeAgent.value) {
            chatStore.addMessage({ role: 'assistant', content: accumulatedResponse, agentId: activeAgent.value.id, model: "StreamedModel (Private)", timestamp: Date.now() });
            chatStore.updateMainContent({
              agentId: activeAgent.value.id,
              type: activeAgent.value.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
              data: accumulatedResponse, title: `${activeAgent.value.label} Response`, timestamp: Date.now()
            });
          }
          isVoiceInputCurrentlyProcessing.value = false; isLoadingResponse.value = false;
        },
        (error: Error | any) => { 
            console.error(`[PrivateHome] Stream API error for agent ${agentId}:`, error);
            const errorMsg = error.message || "Stream error.";
            if(activeAgent.value) {
                chatStore.addMessage({ role: 'error', content: `Error: ${errorMsg}`, agentId, timestamp: Date.now() });
                chatStore.updateMainContent({
                    agentId, type: 'markdown', data: `### Stream Error\n${errorMsg}`,
                    title: `Error with ${activeAgent.value.label}`, timestamp: Date.now()
                });
            }
            chatStore.setMainContentStreaming(false); isVoiceInputCurrentlyProcessing.value = false; isLoadingResponse.value = false;
        }
      );
    } catch (error: any) {
      console.error(`[PrivateHome] Chat API error for agent ${agentId}:`, error);
      const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred.";
       if(activeAgent.value) {
            chatStore.addMessage({ role: 'error', content: `Error: ${errorMsg}`, agentId, timestamp: Date.now() });
            chatStore.updateMainContent({
                agentId, type: 'markdown', data: `### Interaction Error\n${errorMsg}`,
                title: `Error with ${activeAgent.value.label}`, timestamp: Date.now()
            });
       }
      chatStore.setMainContentStreaming(false); isVoiceInputCurrentlyProcessing.value = false; isLoadingResponse.value = false;
    }
  }
};

const handleAgentViewEventFromSlot = (eventData: any): void => {
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
      isVoiceInputCurrentlyProcessing.value = !!eventData.payload.isProcessing;
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

onMounted(() => {
  if (!agentStore.activeAgentId || !agentService.getAgentById(agentStore.activeAgentId)) {
    const defaultPrivateAgent = agentService.getAgentById('general') || agentService.getDefaultAgent();
    if (defaultPrivateAgent) {
      agentStore.setActiveAgent(defaultPrivateAgent.id);
    } else {
      console.error("[PrivateHome] Critical: No default private agent found.");
       chatStore.updateMainContent({
        agentId: 'system-error' as AgentId, type: 'markdown',
        data: "### System Error\nNo default agent could be loaded.",
        title: "Initialization Error", timestamp: Date.now()
      });
    }
  } else {
     chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
  }
});

watch(() => agentStore.activeAgentId, (newAgentId, oldAgentId) => {
  if (newAgentId && newAgentId !== oldAgentId) {
    isVoiceInputCurrentlyProcessing.value = false;
    isLoadingResponse.value = false;
    if(chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false);
    chatStore.ensureMainContentForAgent(newAgentId);
  }
});
</script>

<template>
  <div class="private-home-view-ephemeral">
    <UnifiedChatLayout
      :is-voice-input-processing="isVoiceInputCurrentlyProcessing"
      @transcription="handleTranscriptionFromLayout"
      @voice-input-processing="(status: boolean) => { isVoiceInputCurrentlyProcessing = status; if (status) isLoadingResponse = true; }"
    >
      <template #main-content>
        <MainContentView :agent="activeAgent" class="main-content-view-wrapper-ephemeral" v-if="activeAgent">
          <transition name="agent-ui-fade" mode="out-in">
            <component
              :is="currentAgentUiComponent"
              v-if="currentAgentUiComponent && typeof currentAgentUiComponent !== 'string' && activeAgent.capabilities?.handlesOwnInput"
              :key="activeAgent.id + '-dynamic-ui'"
              ref="agentViewRef"
              :agent-id="activeAgent.id"
              :agent-config="activeAgent"
              @agent-event="handleAgentViewEventFromSlot"
              @set-processing-state="(status: boolean) => { isVoiceInputCurrentlyProcessing = status; isLoadingResponse = status; if (!status && chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false); }"
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
                 <div v-else class="content-renderer-ephemeral text-[var(--color-text-muted)] italic">
                    <p>Content for {{ activeAgent.label }} (Type: {{ mainContentComputed.type }})</p>
                </div>
            </div>
            <div v-else-if="mainContentComputed?.type === 'custom-component' && mainContentComputed.data === 'PrivateDashboardPlaceholder'"
                 class="private-dashboard-placeholder-ephemeral">
              <ShieldCheckIcon class="dashboard-icon-ephemeral" />
              <h2 class="dashboard-title-ephemeral">Secure AI Workspace</h2>
              <p class="dashboard-subtitle-ephemeral">
                Welcome! Select an assistant from the header menu to begin your tasks.
              </p>
               <button @click="router.push('/settings')" class="btn btn-secondary-ephemeral mt-4">
                  <CodeBracketSquareIcon class="icon-sm mr-2"/> Configure Agents & Settings
              </button>
            </div>
             <div v-else-if="isLoadingResponse" class="loading-placeholder-ephemeral">
              <div class="loading-animation-content">
                <div class="loading-spinner-ephemeral !w-12 !h-12">
                  <div v-for="i in 8" :key="`blade-${i}`" class="spinner-blade-ephemeral !w-1.5 !h-4"></div>
                </div>
                <p class="loading-text-ephemeral !text-base mt-3">Agent is working...</p>
              </div>
            </div>
          </transition>
        </MainContentView>
        <div v-else-if="mainContentComputed?.type === 'custom-component' && mainContentComputed.data === 'PrivateDashboardPlaceholder'"
             class="private-dashboard-placeholder-ephemeral">
            <ShieldCheckIcon class="dashboard-icon-ephemeral" />
            <h2 class="dashboard-title-ephemeral">Secure AI Workspace</h2>
            <p class="dashboard-subtitle-ephemeral">
              Please select an agent from the header menu to begin.
            </p>
             <button @click="router.push('/settings')" class="btn btn-secondary-ephemeral mt-4">
                <CodeBracketSquareIcon class="icon-sm mr-2"/> Configure Agents & Settings
            </button>
        </div>
        <div v-else class="private-dashboard-placeholder-ephemeral">
            <SparklesIconOutline class="dashboard-icon-ephemeral !text-[var(--color-text-muted)]" />
            <h2 class="dashboard-title-ephemeral">Initializing Interface...</h2>
            <p class="dashboard-subtitle-ephemeral">Please wait a moment.</p>
        </div>
      </template>
    </UnifiedChatLayout>
  </div>
</template>

<style lang="scss">
// Styles in frontend/src/styles/views/_private-home.scss
</style>