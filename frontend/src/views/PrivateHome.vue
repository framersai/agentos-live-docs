// File: frontend/src/views/PrivateHome.vue
/**
 * @file PrivateHome.vue
 * @description Authenticated home view using UnifiedChatLayout.
 * Features dynamic agent loading (generic and specific views) and a visually engaging dashboard placeholder.
 * Centralizes agent interaction logic, including prompt fetching via API for generic agents.
 * @version 3.4.0 - Implemented generic dynamic component loading for agents with viewComponentName.
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
  promptAPI, // For consistent prompt loading
  type ChatMessagePayloadFE,
  type ProcessedHistoryMessageFE,
  type ChatMessageFE,
} from '@/utils/api';
import { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';

import UnifiedChatLayout from '@/components/layouts/UnifiedChatLayout.vue';
import MainContentView from '@/components/agents/common/MainContentView.vue';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';

import { ShieldCheckIcon, CogIcon } from '@heroicons/vue/24/solid';

const toast = inject<ToastService>('toast');
const router = useRouter();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const auth = useAuth();

const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);

const currentAgentViewComponent = computed<VueComponentType | null>(() => {
  const componentName = activeAgent.value?.viewComponentName;
  const agentLabel = activeAgent.value?.label || 'Current Agent';
  if (componentName) {
    try {
      console.log(`[PrivateHome] Attempting to load dedicated view component: ${componentName} for agent: ${agentLabel}`);
      // Generic dynamic import based on componentName convention
      return defineAsyncComponent(() =>
        import(`@/components/agents/${componentName}.vue`)
          .catch(err => {
            console.error(`[PrivateHome] Failed to import @/components/agents/${componentName}.vue:`, err);
            toast?.add({type: 'error', title: 'UI Load Error', message: `Could not load the interface component "${componentName}" for ${agentLabel}. Using default view.`});
            return import('@/components/agents/common/MainContentView.vue'); // Fallback to a generic view or error component
          })
      );
    } catch (e) { // Catch synchronous errors if any in the try block itself
      console.error(`[PrivateHome] Synchronous error setting up dynamic import for agent view: ${componentName}`, e);
      toast?.add({ type: 'error', title: 'UI Setup Error', message: `Error preparing interface for ${agentLabel}.` });
      return null; // Fallback to default MainContentView handled by v-else-if in template
    }
  }
  return null; // No specific view component defined for this agent
});

const isLoadingResponse = ref(false);
const isVoiceInputCurrentlyProcessing = ref(false);
const agentViewRef = ref<any>(null); // Ref for agent's dedicated view component instance

const mainContentData = computed<MainContent | null>(() => {
  if (!activeAgent.value) {
    return {
      agentId: 'private-dashboard-placeholder' as AgentId, type: 'custom-component',
      data: 'PrivateDashboardPlaceholder', title: 'Welcome Back!', timestamp: Date.now(),
    };
  }
  // If a dedicated agent UI component is actively being resolved or loaded,
  // main content is typically handled by that component OR we show a loading state for it.
  // For simplicity here, if currentAgentViewComponent is truthy, we let it handle content.
  if (currentAgentViewComponent.value) return null;

  // Otherwise, get standard main content from chat store for the active agent
  return chatStore.getCurrentMainContentDataForAgent(activeAgent.value.id) || {
    agentId: activeAgent.value.id, type: 'welcome',
    data: `<div class="prose dark:prose-invert max-w-none mx-auto text-center py-8">
             <h2 class="text-3xl font-bold mb-4 text-[var(--color-text-primary)]">${activeAgent.value.label} is Ready</h2>
             <p class="text-lg text-[var(--color-text-secondary)]">${activeAgent.value.description}</p>
             <p class="mt-6 text-base text-[var(--color-text-muted)]">${activeAgent.value.inputPlaceholder || 'Use the input below to start.'}</p>
           </div>`,
    title: `${activeAgent.value.label} Ready`, timestamp: Date.now()
  };
});

const shouldUseDefaultMainContentView = computed(() => {
  return activeAgent.value && !currentAgentViewComponent.value && mainContentData.value?.type !== 'custom-component';
});

const showEphemeralLogForCurrentAgent = computed(() => {
  return activeAgent.value?.capabilities?.showEphemeralChatLog ?? true;
});


const handleTranscriptionFromLayout = async (transcription: string): Promise<void> => {
  if (!transcription.trim()) return;
  if (!activeAgent.value) {
    toast?.add({ type: 'warning', title: 'No Agent Selected', message: 'Please select an agent from the header menu to start interacting.', duration: 4000 });
    return;
  }

  isVoiceInputCurrentlyProcessing.value = true;
  isLoadingResponse.value = true;
  const currentAgentInstance = activeAgent.value;
  const agentId = currentAgentInstance.id;
  const agentLabel = currentAgentInstance.label || 'Agent';

  if (currentAgentInstance.capabilities?.handlesOwnInput && currentAgentViewComponent.value && agentViewRef.value) {
    try {
      if (typeof agentViewRef.value.processProblemContext === 'function') {
        await agentViewRef.value.processProblemContext(transcription);
      } else if (typeof agentViewRef.value.handleNewUserInput === 'function') {
        await agentViewRef.value.handleNewUserInput(transcription);
      } else {
        console.error(`[PrivateHome] Agent "${agentLabel}" (ID: ${agentId}) is configured with 'handlesOwnInput' and has a view component, but the component instance (agentViewRef) does not expose 'processProblemContext' or 'handleNewUserInput' methods. Falling back to standard chat. View Ref:`, agentViewRef.value);
        // Fallback to standard LLM call if methods are missing on the component instance
        await standardLlmCall(transcription, currentAgentInstance);
      }
    } catch (error: any) {
      console.error(`[PrivateHome] Error in agent's ("${agentLabel}") custom input handler:`, error);
      toast?.add({type: 'error', title: `${agentLabel} Error`, message: error.message || `The agent "${agentLabel}" encountered an issue processing your input.`});
      isLoadingResponse.value = false;
    } finally {
      isVoiceInputCurrentlyProcessing.value = false;
      // isLoadingResponse.value = false; // Agent view component should manage its own loading state visibility after taking over.
    }
  } else {
    await standardLlmCall(transcription, currentAgentInstance);
  }
};

/**
 * Handles the standard LLM call for agents that do not have a dedicated input handler
 * or if the dedicated handler is not found.
 * @param {string} transcription - The user's input.
 * @param {IAgentDefinition} agentInstance - The current agent's definition.
 */
async function standardLlmCall(transcription: string, agentInstance: IAgentDefinition) {
    const agentId = agentInstance.id;
    const agentLabel = agentInstance.label || 'Agent';
    const userMessageTimestamp = Date.now();
    chatStore.addMessage({ role: 'user', content: transcription, agentId: agentId, timestamp: userMessageTimestamp });

    const streamingPlaceholder = `Consulting ${agentLabel}...`;
    chatStore.setMainContentStreaming(true, streamingPlaceholder);
    chatStore.updateMainContent({
        agentId, type: 'loading', data: streamingPlaceholder,
        title: `Processing with ${agentLabel}...`, timestamp: Date.now()
    });

    let systemPromptText = `You are ${agentLabel}. ${agentInstance.description || 'Be helpful and concise.'}`;
    try {
      const systemPromptKey = agentInstance.systemPromptKey; // systemPromptKey is required in IAgentDefinition
      // Always attempt to load via API for consistency
      try {
          console.log(`[PrivateHome] Attempting to load prompt for key: ${systemPromptKey}.md for generic agent: ${agentLabel}`);
          const promptResponse = await promptAPI.getPrompt(`${systemPromptKey}.md`);
          if (promptResponse.data && typeof promptResponse.data.content === 'string') {
              systemPromptText = promptResponse.data.content;
              console.log(`[PrivateHome] Successfully loaded prompt for ${agentLabel} using key ${systemPromptKey}.`);
          } else {
              console.warn(`[PrivateHome] Prompt content for "${systemPromptKey}.md" (agent: ${agentLabel}) was not a string or was missing. Using default description for system prompt.`);
              // systemPromptText remains the default defined above
          }
      } catch (e: any) {
          console.error(`[PrivateHome] Failed to load prompt "${systemPromptKey}.md" via API for agent "${agentLabel}":`, e.response?.data || e.message || e);
          toast?.add({ type: 'warning', title: 'Prompt Load Warning', message: `Could not load specific instructions for ${agentLabel}. Using general behavior.` });
          // systemPromptText remains the default
      }
      
      systemPromptText = systemPromptText
        .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified')
        .replace(/{{MODE}}/g, agentId)
        .replace(/{{GENERATE_DIAGRAM}}/g, ((agentInstance.capabilities?.canGenerateDiagrams ?? false) && (voiceSettingsManager.settings.generateDiagrams ?? false)).toString())
        .replace(/{{USER_QUERY}}/g, transcription)
        .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.getAgentContext(agentId) || {}))
        .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, '');

      const historyConfig: Partial<AdvancedHistoryConfig> = { /* ... as before ... */ };
      const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(agentId, transcription, systemPromptText, historyConfig);
      let messagesForPayload: ChatMessageFE[] = historyForApi.map(hMsg => ({ /* ... as before ... */
          role: hMsg.role, content: hMsg.content, timestamp: hMsg.timestamp,
          name: (hMsg as any).name, tool_calls: (hMsg as any).tool_calls, tool_call_id: (hMsg as any).tool_call_id,
      }));
      const userMessageStillMissing = !messagesForPayload.find(m => m.role === 'user' && m.content === transcription && m.timestamp === userMessageTimestamp);
      if (userMessageStillMissing) messagesForPayload.push({ role: 'user', content: transcription, timestamp: userMessageTimestamp });
      messagesForPayload.sort((a,b) => (a.timestamp || 0) - (b.timestamp || 0));

      const userIdForPayload = auth.user.value?.id || `private_session_user_${Date.now().toString(36).slice(-6)}`;
      const payload: ChatMessagePayloadFE = {
        messages: messagesForPayload,
        mode: agentInstance.systemPromptKey,
        systemPromptOverride: systemPromptText,
        language: voiceSettingsManager.settings.preferredCodingLanguage,
        generateDiagram: agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
        userId: userIdForPayload,
        conversationId: chatStore.getCurrentConversationId(agentId),
        stream: true,
      };

      let accumulatedResponse = "";
      await chatAPI.sendMessageStream(
        payload,
        (chunk: string) => { /* ... onChunk ... */ 
            accumulatedResponse += chunk;
            if (agentStore.activeAgentId === agentId) {
                chatStore.updateMainContent({
                    agentId: agentId,
                    type: agentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                    data: accumulatedResponse + "▋",
                    title: `${agentLabel} Responding...`, timestamp: Date.now()
                });
            }
        },
        () => { /* ... onStreamEnd ... */ 
            if (agentStore.activeAgentId === agentId) {
                chatStore.addMessage({ role: 'assistant', content: accumulatedResponse, agentId: agentId, model: "StreamedModel (Private)", timestamp: Date.now() });
                chatStore.updateMainContent({
                    agentId: agentId,
                    type: agentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                    data: accumulatedResponse, title: `${agentLabel} Response`, timestamp: Date.now()
                });
            }
        },
        (error: Error | any) => { /* ... onStreamError ... */ 
            console.error(`[PrivateHome] Stream API error for agent ${agentId} ("${agentLabel}"):`, error);
            const errorMsg = error.message || "A streaming error occurred.";
            if (agentStore.activeAgentId === agentId) {
                chatStore.addMessage({ role: 'error', content: `Stream Error: ${errorMsg}`, agentId, timestamp: Date.now() });
                chatStore.updateMainContent({
                    agentId, type: 'error', data: `### ${agentLabel} Stream Error\n${errorMsg}`,
                    title: `Error with ${agentLabel}`, timestamp: Date.now()
                });
            }
        }
      );
    } catch (error: any) {
      console.error(`[PrivateHome] Chat API interaction error for agent ${agentId} ("${agentLabel}"):`, error);
      const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred.";
      if (agentStore.activeAgentId === agentId) {
        chatStore.addMessage({ role: 'error', content: `Interaction Error: ${errorMsg}`, agentId, timestamp: Date.now() });
        chatStore.updateMainContent({
          agentId, type: 'error', data: `### ${agentLabel} Interaction Error\n${errorMsg}`,
          title: `Error with ${agentLabel}`, timestamp: Date.now()
        });
      }
    } finally {
      isLoadingResponse.value = false;
      isVoiceInputCurrentlyProcessing.value = false;
      chatStore.setMainContentStreaming(false);
    }
}


const handleAgentViewEventFromSlot = (eventData: any): void => { /* ... as before ... */ };

onMounted(() => { /* ... as before ... */ });
watch(() => agentStore.activeAgentId, (newAgentId, oldAgentId) => { /* ... as before ... */ }, { immediate: true });

</script>

<template>
  <div class="private-home-view-ephemeral">
    <UnifiedChatLayout
      :is-voice-input-processing="isVoiceInputCurrentlyProcessing"
      :show-ephemeral-log="showEphemeralLogForCurrentAgent"
      :current-agent-input-placeholder="activeAgent?.inputPlaceholder"
      @transcription="handleTranscriptionFromLayout"
      @voice-input-processing="(status: boolean) => { isVoiceInputCurrentlyProcessing = status; if (!status && isLoadingResponse) isLoadingResponse = false; }"
    >
      <template #main-content>
        <component
          :is="currentAgentViewComponent"
          v-if="activeAgent && currentAgentViewComponent && typeof currentAgentViewComponent !== 'string'"
          :key="activeAgent.id + '-dedicated-ui'"
          ref="agentViewRef"
          :agent-id="activeAgent.id"
          :agent-config="activeAgent"
          @agent-event="handleAgentViewEventFromSlot"
          class="dedicated-agent-view h-full w-full"
        />
        <MainContentView
            :agent="activeAgent"
            class="main-content-view-wrapper-ephemeral default-agent-mcv h-full w-full"
            :class="{'has-framed-content': shouldUseDefaultMainContentView}"
            v-else-if="activeAgent && mainContentData" 
        >
          <div v-if="mainContentData.type === 'custom-component' && mainContentData.data === 'PrivateDashboardPlaceholder'"
               class="private-dashboard-placeholder-ephemeral">
            <ShieldCheckIcon class="dashboard-icon-ephemeral" />
            <h2 class="dashboard-title-ephemeral">Secure AI Workspace</h2>
            <p class="dashboard-subtitle-ephemeral">
              Welcome back! Select an assistant from the header menu to begin, or manage your preferences.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 mt-8">
              <button @click="router.push('/settings')" class="btn btn-secondary-ephemeral btn-lg-ephemeral">
                  <CogIcon class="icon-sm"/> Configure Agents & Settings
              </button>
            </div>
          </div>
          <div v-else class="content-renderer-container-ephemeral">
            <CompactMessageRenderer
              v-if="activeAgent?.capabilities?.usesCompactRenderer && (mainContentData.type === 'compact-message-renderer-data' || mainContentData.type === 'markdown')"
              :content="mainContentData.data"
              :mode="activeAgent.id"
              class="content-renderer-ephemeral"
            />
            <div v-else-if="mainContentData.type === 'markdown' || mainContentData.type === 'welcome'"
                 class="prose-ephemeral content-renderer-ephemeral"
                 v-html="isLoadingResponse && chatStore.isMainContentStreaming && chatStore.getCurrentMainContentDataForAgent(activeAgent.id)?.agentId === activeAgent.id && chatStore.getCurrentMainContentDataForAgent(activeAgent.id)?.type !== 'loading' ?
                         chatStore.streamingMainContentText + '<span class=\'streaming-cursor-ephemeral\'>▋</span>' :
                         mainContentData.data"
                 aria-atomic="true">
            </div>
            <div v-else-if="mainContentData.type === 'error'"
                 class="prose-ephemeral prose-error content-renderer-ephemeral"
                 v-html="mainContentData.data"
                 aria-atomic="true">
            </div>
            <div v-else-if="mainContentData.type === 'loading'"
                 class="loading-placeholder-ephemeral content-renderer-ephemeral">
              <div class="loading-animation-content">
                  <div class="loading-spinner-ephemeral !w-10 !h-10"><div v-for="i in 8" :key="`blade-${i}`" class="spinner-blade-ephemeral !w-1 !h-3.5"></div></div>
                  <p class="loading-text-ephemeral !text-base mt-2.5" v-html="mainContentData.data"></p>
              </div>
            </div>
            <div v-else class="content-renderer-ephemeral text-[var(--color-text-muted)] italic p-6 text-center">
              <p class="text-lg">Interacting with {{ activeAgent.label }}.</p>
              <p class="text-sm mt-2">(Displaying content type: {{ mainContentData.type }})</p>
            </div>
          </div>
        </MainContentView>
        <div v-else class="loading-placeholder-ephemeral">
           <div class="loading-animation-content">
            <div class="loading-spinner-ephemeral !w-16 !h-16"><div v-for="i in 8" :key="`blade-${i}`" class="spinner-blade-ephemeral !w-2 !h-5"></div></div>
            <p class="loading-text-ephemeral !text-lg mt-4">Initializing Workspace...</p>
          </div>
        </div>
      </template>
    </UnifiedChatLayout>
  </div>
</template>

<style lang="scss">
// Styles for PrivateHome are in frontend/src/styles/views/_private-home.scss
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
.content-renderer-container-ephemeral {
    flex-grow: 1;
    overflow-y: auto; // Allow scrolling for generic content
}
</style>