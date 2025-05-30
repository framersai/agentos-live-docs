// File: frontend/src/views/PrivateHome.vue
/**
 * @file PrivateHome.vue
 * @description Authenticated home view using UnifiedChatLayout.
 * Features dynamic agent loading, API-driven prompt loading for general agents,
 * and a visually engaging dashboard placeholder. Uses session-specific userId.
 * @version 3.4.0 - Integrated session-specific userId and aligned with PublicHome structure.
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
  promptAPI,
  type ChatMessagePayloadFE,
  type ProcessedHistoryMessageFE,
  type ChatMessageFE,
} from '@/utils/api';
import { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';

import UnifiedChatLayout from '@/components/layouts/UnifiedChatLayout.vue';
import MainContentView from '@/components/agents/common/MainContentView.vue';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';

import { ShieldCheckIcon, CogIcon, SparklesIcon, UserGroupIcon } from '@heroicons/vue/24/solid';

const toast = inject<ToastService>('toast');
const router = useRouter();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const auth = useAuth();

const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);
const currentSystemPromptText = ref('');

const currentAgentViewComponent = computed<VueComponentType | null>(() => {
  const agent = activeAgent.value;
  if (agent && agent.viewComponentName) {
    const componentName = agent.viewComponentName;
    const agentLabel = agent.label || 'Current Agent';
    try {
      console.log(`[PrivateHome] Attempting to load dedicated view component: ${componentName} for agent: ${agentLabel}`);
      return defineAsyncComponent(() =>
        import(`@/components/agents/${componentName}.vue`)
          .catch(err => {
            console.error(`[PrivateHome] Failed to import @/components/agents/${componentName}.vue for agent ${agentLabel}:`, err);
            toast?.add({type: 'error', title: 'UI Load Error', message: `Could not load specific interface for ${agentLabel}. Using default view.`});
            // Fallback to a generic MainContentView if specific agent view fails to load
            return import('@/components/agents/common/MainContentView.vue');
          })
      );
    } catch (e) {
      console.error(`[PrivateHome] Synchronous error setting up dynamic import for agent view: ${componentName}`, e);
      toast?.add({ type: 'error', title: 'UI Setup Error', message: `Error preparing interface for ${agentLabel}.` });
      return null;
    }
  }
  return null;
});

const isLoadingResponse = ref(false);
const isVoiceInputCurrentlyProcessing = ref(false);
const agentViewRef = ref<any>(null);

const loadCurrentAgentSystemPrompt = async (): Promise<void> => {
  const agent = activeAgent.value;
  if (!agent || (agent.capabilities?.handlesOwnInput && currentAgentViewComponent.value)) {
    currentSystemPromptText.value = '';
    return;
  }

  const systemPromptKey = agent.systemPromptKey;
  const agentLabel = agent.label || 'Assistant';
  let defaultPromptText = `You are ${agentLabel}. ${agent.description || 'Provide helpful assistance.'}`;

  if (systemPromptKey) {
    try {
      console.log(`[PrivateHome] Loading prompt for key: ${systemPromptKey}.md for agent: ${agentLabel}`);
      const response = await promptAPI.getPrompt(`${systemPromptKey}.md`);
      if (response.data && typeof response.data.content === 'string') {
        currentSystemPromptText.value = response.data.content;
      } else {
        currentSystemPromptText.value = defaultPromptText;
      }
    } catch (e: any) {
      console.error(`[PrivateHome] Failed to load prompt "${systemPromptKey}.md" via API for agent "${agentLabel}":`, e.response?.data || e.message || e);
      currentSystemPromptText.value = defaultPromptText;
    }
  } else {
    currentSystemPromptText.value = defaultPromptText;
  }
};

const mainContentData = computed<MainContent | null>(() => {
  if (!activeAgent.value) {
    return {
      agentId: 'private-dashboard-placeholder' as AgentId, type: 'custom-component',
      data: 'PrivateDashboardPlaceholder', title: 'Welcome Back!', timestamp: Date.now(),
    };
  }
  if (currentAgentViewComponent.value && activeAgent.value?.capabilities?.handlesOwnInput) {
    return null;
  }
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
  return activeAgent.value && (!currentAgentViewComponent.value || !activeAgent.value.capabilities?.handlesOwnInput) && mainContentData.value?.type !== 'custom-component';
});

const showEphemeralLogForCurrentAgent = computed(() => {
  return activeAgent.value?.capabilities?.showEphemeralChatLog ?? true;
});

const handleTranscriptionFromLayout = async (transcription: string): Promise<void> => {
  console.log("[PrivateHome] handleTranscriptionFromLayout called with:", transcription);
  if (!transcription.trim()) {
    console.log("[PrivateHome] Transcription was empty.");
    return;
  }
  if (!activeAgent.value) {
    toast?.add({ type: 'warning', title: 'No Agent Selected', message: 'Please select an agent to start interacting.', duration: 4000 });
    console.log("[PrivateHome] No active agent.");
    return;
  }
  if (isLoadingResponse.value) {
    toast?.add({ type: 'info', title: 'Processing', message: 'Please wait for the current response to complete.' });
    console.log("[PrivateHome] isLoadingResponse is true, exiting.");
    return;
  }

  isVoiceInputCurrentlyProcessing.value = true;
  isLoadingResponse.value = true;
  const currentAgentInstance = activeAgent.value;
  const agentId = currentAgentInstance.id;
  const agentLabel = currentAgentInstance.label || 'Assistant';

  console.log(`[PrivateHome] Handling transcription for agent: ${agentLabel} (ID: ${agentId})`);

  if (currentAgentInstance.capabilities?.handlesOwnInput && currentAgentViewComponent.value && agentViewRef.value) {
    console.log(`[PrivateHome] Attempting to call dedicated input handler for agent: ${agentLabel}`);
    try {
      if (typeof agentViewRef.value.handleNewUserInput === 'function') {
        await agentViewRef.value.handleNewUserInput(transcription);
      } else if (typeof agentViewRef.value.processProblemContext === 'function') {
        await agentViewRef.value.processProblemContext(transcription);
      } else {
        console.warn(`[PrivateHome] Agent "${agentLabel}" configured to handle own input, but no suitable handler method found. Falling back to standard LLM call.`);
        await standardLlmCallPrivate(transcription, currentAgentInstance);
      }
    } catch (error: any) {
      console.error(`[PrivateHome] Error in agent's (${agentLabel}) custom input handler:`, error);
      toast?.add({type: 'error', title: 'Agent Error', message: error.message || `The agent "${agentLabel}" encountered an issue.`});
      // Reset loading states directly here if the dedicated handler fails globally
      isLoadingResponse.value = false;
      isVoiceInputCurrentlyProcessing.value = false;
    }
    // The dedicated agent view is responsible for its own isLoadingResponse state during its operations.
    // PublicHome's isLoadingResponse is reset after the dedicated handler is awaited, or in its finally block.
    isLoadingResponse.value = false; // Reset after attempting to call dedicated handler
    isVoiceInputCurrentlyProcessing.value = false;

  } else {
    console.log(`[PrivateHome] Using standard LLM call for agent: ${agentLabel}`);
    await standardLlmCallPrivate(transcription, currentAgentInstance);
  }
};

async function standardLlmCallPrivate(transcriptionText: string, agentInstance: IAgentDefinition) {
  const agentId = agentInstance.id;
  const agentLabel = agentInstance.label || 'Assistant';
  const userMessageTimestamp = Date.now();

  chatStore.addMessage({ role: 'user', content: transcriptionText, agentId: agentId, timestamp: userMessageTimestamp });

  const streamingPlaceholder = `Consulting ${agentLabel}...`;
  if (agentStore.activeAgentId === agentId) {
      chatStore.setMainContentStreaming(true, streamingPlaceholder);
      chatStore.updateMainContent({
          agentId, type: 'loading', data: streamingPlaceholder,
          title: `Processing with ${agentLabel}...`, timestamp: Date.now()
      });
  }

  try {
    if (!agentInstance.capabilities?.handlesOwnInput || !currentAgentViewComponent.value) {
        if (!currentSystemPromptText.value || currentSystemPromptText.value.startsWith(`You are ${agentLabel}`)) {
            await loadCurrentAgentSystemPrompt();
             if (!currentSystemPromptText.value) {
                throw new Error("System prompt could not be established for the agent.");
            }
        }
    }

    let finalSystemPrompt = currentSystemPromptText.value;
    if (!finalSystemPrompt.trim() && agentInstance.systemPromptKey) { // If prompt text is still empty but key exists, try loading again or default
        console.warn(`[PrivateHome] System prompt text was empty for ${agentLabel} after initial load attempt. Attempting to re-load or use default.`);
        await loadCurrentAgentSystemPrompt();
        finalSystemPrompt = currentSystemPromptText.value;
         if (!finalSystemPrompt.trim()) {
            finalSystemPrompt = `You are ${agentLabel}. ${agentInstance.description || 'Provide helpful assistance.'}`;
         }
    } else if (!finalSystemPrompt.trim()) { // If no key and text is empty
         finalSystemPrompt = `You are ${agentLabel}. ${agentInstance.description || 'Provide helpful assistance.'}`;
    }

    finalSystemPrompt = finalSystemPrompt
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified')
      .replace(/{{MODE}}/g, agentId)
      .replace(/{{GENERATE_DIAGRAM}}/g, ((agentInstance.capabilities?.canGenerateDiagrams ?? false) && (voiceSettingsManager.settings.generateDiagrams ?? false)).toString())
      .replace(/{{USER_QUERY}}/g, transcriptionText)
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.getAgentContext(agentId) || {}))
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, '');

    const historyConfig: Partial<AdvancedHistoryConfig> = {
      numRecentMessagesToPrioritize: agentInstance.capabilities?.maxChatHistory || 10,
      maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 8000 : (agentInstance.capabilities?.maxChatHistory || 10) * 200,
    };

    const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(agentId, transcriptionText, finalSystemPrompt, historyConfig);
    
    let messagesForPayload: ChatMessageFE[] = historyForApi.map(hMsg => ({
        role: hMsg.role, content: hMsg.content, timestamp: hMsg.timestamp, agentId: hMsg.agentId,
        name: (hMsg as any).name, tool_calls: (hMsg as any).tool_calls, tool_call_id: (hMsg as any).tool_call_id,
    }));

    if (!messagesForPayload.some(m => m.role === 'user' && m.content === transcriptionText && m.timestamp === userMessageTimestamp)) {
        messagesForPayload.push({ role: 'user', content: transcriptionText, timestamp: userMessageTimestamp, agentId });
    }
    messagesForPayload.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    const payload: ChatMessagePayloadFE = {
      messages: messagesForPayload,
      mode: agentInstance.systemPromptKey || agentId,
      systemPromptOverride: finalSystemPrompt,
      language: voiceSettingsManager.settings.preferredCodingLanguage,
      generateDiagram: agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: auth.sessionUserId.value || `authenticated_user_session_${Date.now().toString(36)}`, // Use sessionUserId
      conversationId: chatStore.getCurrentConversationId(agentId),
      stream: true,
    };
    console.log("[PrivateHome] Sending payload to chatAPI.sendMessageStream:", JSON.stringify(payload, null, 0).substring(0, 300) + "...");

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
      () => { // onStreamEnd
        if (agentStore.activeAgentId === agentId) {
          const finalContent = accumulatedResponse.trim();
          chatStore.addMessage({ role: 'assistant', content: finalContent, agentId: agentId, model: "StreamedModel (Private)", timestamp: Date.now() });
          chatStore.updateMainContent({
            agentId: agentId,
            type: agentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: finalContent,
            title: `${agentLabel} Response`,
            timestamp: Date.now()
          });
        }
        isLoadingResponse.value = false;
        isVoiceInputCurrentlyProcessing.value = false;
        chatStore.setMainContentStreaming(false);
      },
      (error: Error | any) => { // onStreamError
        console.error(`[PrivateHome] Stream API error for agent ${agentLabel}:`, error);
        const errorMsg = error.message || "A streaming error occurred.";
        if (agentStore.activeAgentId === agentId) {
          chatStore.addMessage({ role: 'error', content: `Stream Error: ${errorMsg}`, agentId, timestamp: Date.now() });
          chatStore.updateMainContent({
            agentId, type: 'error',
            data: `### ${agentLabel} Stream Error\n${errorMsg}`,
            title: `Error with ${agentLabel}`, timestamp: Date.now()
          });
        }
        isLoadingResponse.value = false;
        isVoiceInputCurrentlyProcessing.value = false;
        chatStore.setMainContentStreaming(false);
      }
    );
  } catch (error: any) {
    console.error(`[PrivateHome] Chat API interaction setup error for agent ${agentLabel}:`, error.response?.data || error.message || error);
    const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred.";
    if (agentStore.activeAgentId === agentId) {
        chatStore.addMessage({ role: 'error', content: `Interaction Error: ${errorMsg}`, agentId, timestamp: Date.now() });
        chatStore.updateMainContent({
            agentId, type: 'error',
            data: `### ${agentLabel} Interaction Error\n${errorMsg}`,
            title: `Error with ${agentLabel}`, timestamp: Date.now()
        });
    }
    isLoadingResponse.value = false;
    isVoiceInputCurrentlyProcessing.value = false;
    chatStore.setMainContentStreaming(false);
  }
}

const handleAgentViewEventFromSlot = (eventData: any): void => {
  if (!activeAgent.value) return;
  switch (eventData.type) {
    case 'updateMainContent':
      chatStore.updateMainContent({
        agentId: activeAgent.value.id,
        type: eventData.payload.type || (activeAgent.value.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown'),
        data: eventData.payload.data,
        title: eventData.payload.title || `${activeAgent.value.label} Update`,
        timestamp: Date.now(),
      });
      if (eventData.payload.isProcessing === false) {
        isLoadingResponse.value = false;
        isVoiceInputCurrentlyProcessing.value = false;
      }
      break;
    case 'addChatMessage':
      chatStore.addMessage({
        agentId: activeAgent.value.id,
        timestamp: Date.now(),
        role: eventData.payload.role || 'assistant',
        content: eventData.payload.content,
        ...(eventData.payload.extra || {})
      });
      break;
    case 'setProcessingState':
      isLoadingResponse.value = !!eventData.payload.isProcessing;
      isVoiceInputCurrentlyProcessing.value = !!eventData.payload.isProcessing;
      if (!eventData.payload.isProcessing && chatStore.isMainContentStreaming) {
        chatStore.setMainContentStreaming(false);
      }
      break;
    case 'requestGlobalAction':
      if (eventData.action === 'navigateTo' && eventData.payload?.route) {
        router.push(eventData.payload.route);
      } else {
        console.warn(`[PrivateHome] Unhandled global action from agent: ${eventData.action}`);
      }
      break;
    default:
      console.warn(`[PrivateHome] Unhandled agent event type: ${eventData.type}`);
  }
};

onMounted(async () => {
  if (!auth.isAuthenticated.value) {
    router.replace({ name: 'Login', query: { sessionExpired: 'true', reason: 'unauthenticated_access_pro' }});
    return;
  }
  if (!agentStore.activeAgentId || !agentService.getAgentById(agentStore.activeAgentId)) {
    const defaultPrivateAgent = agentService.getDefaultAgent();
    if (defaultPrivateAgent) {
      agentStore.setActiveAgent(defaultPrivateAgent.id);
    } else {
      console.error("[PrivateHome] Critical: No default private agent could be determined.");
      chatStore.updateMainContent({
        agentId: 'system-error' as AgentId, type: 'error',
        data: "### System Configuration Error\nNo default assistant could be loaded. Please check the application setup or contact support.",
        title: "Initialization Error", timestamp: Date.now()
      });
    }
  } else {
    await loadCurrentAgentSystemPrompt();
    chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
  }
});

watch(() => agentStore.activeAgentId, async (newAgentId, oldAgentId) => {
  if (newAgentId && newAgentId !== oldAgentId) {
    isLoadingResponse.value = false;
    isVoiceInputCurrentlyProcessing.value = false;
    if(chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false);
    await loadCurrentAgentSystemPrompt();
    chatStore.ensureMainContentForAgent(newAgentId);
  } else if (!newAgentId && oldAgentId !== null) {
    chatStore.updateMainContent({
      agentId: 'private-dashboard-placeholder' as AgentId, type: 'custom-component',
      data: 'PrivateDashboardPlaceholder', title: 'Welcome Back!', timestamp: Date.now(),
    });
    currentSystemPromptText.value = '';
  } else if (newAgentId && newAgentId === oldAgentId) { // Agent re-selected or initial load
    // Ensure prompt and content are loaded, especially if they weren't before
    const agent = agentService.getAgentById(newAgentId);
    if (agent && (!currentAgentViewComponent.value || !agent.capabilities?.handlesOwnInput)) {
      await loadCurrentAgentSystemPrompt();
    }
    chatStore.ensureMainContentForAgent(newAgentId);
  }
}, { immediate: true });

</script>

<template>
  <div class="private-home-view-ephemeral">
    <UnifiedChatLayout
      :is-voice-input-processing="isVoiceInputCurrentlyProcessing"
      :show-ephemeral-log="showEphemeralLogForCurrentAgent"
      :current-agent-input-placeholder="activeAgent?.inputPlaceholder || 'Type your message or use voice...'"
      @transcription="handleTranscriptionFromLayout"
      @voice-input-processing="(status: boolean) => { isVoiceInputCurrentlyProcessing = status; if (status && !isLoadingResponse) isLoadingResponse = true; else if (!status && !isVoiceInputCurrentlyProcessing) isLoadingResponse = false; }"
    >
      <template #main-content>
        <component
          :is="currentAgentViewComponent"
          v-if="activeAgent && currentAgentViewComponent && typeof currentAgentViewComponent !== 'string' && activeAgent.capabilities?.handlesOwnInput"
          :key="activeAgent.id + '-dedicated-ui'"
          ref="agentViewRef"
          :agent-id="activeAgent.id"
          :agent-config="activeAgent"
          @agent-event="handleAgentViewEventFromSlot"
          class="dedicated-agent-view"
        />
        <MainContentView
            :agent="activeAgent"
            class="main-content-view-wrapper-ephemeral default-agent-mcv"
            :class="{'has-framed-content': shouldUseDefaultMainContentView}"
            v-else-if="activeAgent && mainContentData"
        >
          <div v-if="mainContentData.type === 'custom-component' && mainContentData.data === 'PrivateDashboardPlaceholder'"
               class="private-dashboard-placeholder-ephemeral">
            <ShieldCheckIcon class="dashboard-icon-ephemeral" />
            <h2 class="dashboard-title-ephemeral">Secure AI Workspace</h2>
            <p class="dashboard-subtitle-ephemeral">
              Welcome back!
              Select an assistant from the header menu to begin, or manage your preferences.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 mt-8">
              <button @click="router.push('/settings')" class="btn btn-secondary-ephemeral btn-lg-ephemeral">
                  <CogIcon class="icon-sm"/> Configure Agents & Settings
              </button>
            </div>
          </div>
          <div v-else class="content-renderer-container-ephemeral">
            <CompactMessageRenderer
              v-if="activeAgent?.capabilities?.usesCompactRenderer && (mainContentData.type === 'compact-message-renderer-data' || (mainContentData.type === 'markdown' && !chatStore.isMainContentStreaming))"
              :content="mainContentData.data"
              :mode="activeAgent.id"
              class="content-renderer-ephemeral"
            />
            <div v-else-if="mainContentData.type === 'markdown' || mainContentData.type === 'welcome'"
                 class="prose-ephemeral content-renderer-ephemeral"
                 v-html="chatStore.isMainContentStreaming && chatStore.getCurrentMainContentDataForAgent(activeAgent.id)?.agentId === activeAgent.id && chatStore.getCurrentMainContentDataForAgent(activeAgent.id)?.type === 'markdown' ?
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
                  <div class="loading-spinner-ephemeral !w-10 !h-10"><div v-for="i in 8" :key="`blade-${i}-loading`" class="spinner-blade-ephemeral !w-1 !h-3.5"></div></div>
                  <p class="loading-text-ephemeral !text-base mt-2.5" v-html="mainContentData.data + (chatStore.isMainContentStreaming ? '<span class=\'streaming-cursor-ephemeral\'>▋</span>' : '')"></p>
              </div>
            </div>
            <div v-else class="content-renderer-ephemeral text-[var(--color-text-muted)] italic p-6 text-center">
              <UserGroupIcon class="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p class="text-lg">Ready to assist with {{ activeAgent.label }}.</p>
              <p class="text-sm mt-2">(Content type: {{ mainContentData.type }})</p>
            </div>
          </div>
        </MainContentView>
        <div v-else class="loading-placeholder-ephemeral">
           <div class="loading-animation-content">
            <div class="loading-spinner-ephemeral !w-16 !h-16"><div v-for="i in 8" :key="`blade-${i}-init`" class="spinner-blade-ephemeral !w-2 !h-5"></div></div>
            <p class="loading-text-ephemeral !text-lg mt-4">Initializing Workspace...</p>
           </div>
        </div>
      </template>
    </UnifiedChatLayout>
  </div>
</template>

<style lang="scss">
// Styles for PrivateHome are in frontend/src/styles/views/_private-home.scss
// This file will define .private-home-view-ephemeral, .private-dashboard-placeholder-ephemeral, etc.
.dedicated-agent-view {
  height: 100%;
  width: 100%;
  overflow: auto; // Or hidden, depending on the agent view's internal scrolling
}
.default-agent-mcv {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.content-renderer-container-ephemeral {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem; // Add some default padding
}
.has-framed-content .content-renderer-container-ephemeral{
    // Example: add a border or specific background if MainContentView itself has a frame
    // border: 1px solid var(--color-border-subtle);
    // background-color: var(--color-bg-secondary);
    // border-radius: var(--radius-md);
}
.private-dashboard-placeholder-ephemeral {
  @apply flex flex-col items-center justify-center h-full text-center p-8;
  .dashboard-icon-ephemeral {
    @apply w-20 h-20 mb-6 text-[var(--color-accent-primary)]; // Use primary accent
    filter: drop-shadow(0 4px 10px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.3));
  }
  .dashboard-title-ephemeral {
    @apply text-4xl font-bold text-[var(--color-text-primary)] mb-3;
  }
  .dashboard-subtitle-ephemeral {
    @apply text-lg text-[var(--color-text-secondary)] max-w-lg;
  }
}

.loading-placeholder-ephemeral {
    @apply flex-grow flex items-center justify-center h-full p-4 text-center;
    .loading-animation-content {
        @apply flex flex-col items-center;
    }
}

// Ensure prose styles from main.scss or _typography.scss apply well.
// This is just a placeholder if specific overrides for PrivateHome prose are needed.
.prose-ephemeral {
  // Standard prose styling, potentially with overrides for this view
  // For example:
  // h2 { color: var(--color-accent-primary); }
}
.prose-error {
  // Specific styling for error messages if needed
  // color: var(--color-error);
}

</style>