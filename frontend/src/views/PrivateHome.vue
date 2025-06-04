// File: frontend/src/views/PrivateHome.vue

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
import type { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';

import UnifiedChatLayout from '@/components/layouts/UnifiedChatLayout.vue';
import MainContentView from '@/components/agents/common/MainContentView.vue';
import CompactMessageRenderer from '@/components/layouts/CompactMessageRenderer/CompactMessageRenderer.vue';

// Icons used in the dashboard placeholder template
// Ensure UserGroupIcon is imported if used in your template. Example:
import { ShieldCheckIcon, CogIcon, UserGroupIcon } from '@heroicons/vue/24/solid';


const toast = inject<ToastService>('toast');
const router = useRouter();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const auth = useAuth();

const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);
const currentSystemPromptText = ref('');

const currentAgentViewComponent = computed<VueComponentType | null>(() => {
  const agent = activeAgent.value;
  if (agent && agent.component && typeof agent.component === 'function') {
    const agentLabel = agent.label || 'Current Agent';
    try {
      return defineAsyncComponent(agent.component);
    } catch (e) {
      console.error(`[PrivateHome] Error setting up dynamic import for agent view: ${agentLabel}`, e);
      toast?.add({ type: 'error', title: 'UI Setup Error', message: `Error preparing interface for ${agentLabel}.` });
      return null;
    }
  }
  return null;
});

/**
 * @ref isLoadingResponse
 * @description True when an LLM call is actively being awaited by PrivateHome OR by an active agent view
 * that handles its own input and has signaled it's processing via 'setProcessingState' event.
 * This is the primary state passed as `isProcessing` to VoiceInput.vue.
 */
const isLoadingResponse = ref(false);

/**
 * @ref isVoiceInputCurrentlyProcessingAudio
 * @description True when the VoiceInput component's STT is actively processing audio (listening/recording).
 * This state is received from VoiceInput.vue via an event.
 * **Crucially, changes to this ref should NOT directly set `isLoadingResponse` to true.**
 */
const isVoiceInputCurrentlyProcessingAudio = ref(false);
const agentViewRef = ref<any>(null);

async function loadCurrentAgentSystemPrompt(): Promise<void> {
  const agent = activeAgent.value;
  if (!agent) {
    currentSystemPromptText.value = "No agent is active.";
    return;
  }
  if (agent.capabilities?.handlesOwnInput && currentAgentViewComponent.value) {
    currentSystemPromptText.value = '';
    // console.log(`[PrivateHome] Agent ${agent.label} handles its own input; its view/composable manages its prompt.`);
    return;
  }

  const systemPromptKey = agent.systemPromptKey;
  const agentLabel = agent.label || 'Assistant';
  let defaultPromptText = `You are ${agentLabel}. ${agent.description || 'Provide helpful assistance.'}`;

  if (systemPromptKey) {
    try {
      // console.log(`[PrivateHome] Loading prompt key: ${systemPromptKey}.md for agent: ${agentLabel} (standard call).`);
      const response = await promptAPI.getPrompt(`${systemPromptKey}.md`);
      currentSystemPromptText.value = (response.data?.content as string) || defaultPromptText;
    } catch (e: any) {
      console.error(`[PrivateHome] Failed to load prompt "${systemPromptKey}.md" for agent "${agentLabel}" (standard call):`, e.response?.data || e.message || e);
      currentSystemPromptText.value = defaultPromptText;
      toast?.add({ type: 'warning', title: 'Prompt Load Failed', message: `Could not load instructions for ${agentLabel}. Using default.`});
    }
  } else {
    currentSystemPromptText.value = defaultPromptText;
  }
}

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
  return activeAgent.value &&
         (!currentAgentViewComponent.value || !activeAgent.value.capabilities?.handlesOwnInput) &&
         mainContentData.value?.type !== 'custom-component';
});

const showEphemeralLogForCurrentAgent = computed(() => {
  return activeAgent.value?.capabilities?.showEphemeralChatLog ?? true;
});

async function handleTranscriptionFromLayout(transcription: string): Promise<void> {
  // console.log(`[PrivateHome] handleTranscriptionFromLayout received: "${transcription.substring(0,50)}..."`);
  if (!transcription.trim()) {
    // console.log("[PrivateHome] Transcription was empty or whitespace. Ignoring.");
    return;
  }
  if (!activeAgent.value) {
    toast?.add({ type: 'warning', title: 'No Agent Selected', message: 'Please select an agent to start interacting.', duration: 4000 });
    // console.log("[PrivateHome] No active agent. Cannot process transcription.");
    return;
  }

  const currentAgentInstance = activeAgent.value;
  const agentId = currentAgentInstance.id;
  const agentLabel = currentAgentInstance.label || 'Assistant';

  // console.log(`[PrivateHome] Handling transcription for agent: ${agentLabel} (ID: ${agentId})`);

  if (currentAgentInstance.capabilities?.handlesOwnInput && currentAgentViewComponent.value && agentViewRef.value) {
    // console.log(`[PrivateHome] Delegating input to dedicated handler for agent: ${agentLabel}`);
    try {
      if (typeof agentViewRef.value.handleNewUserInput === 'function') {
        await agentViewRef.value.handleNewUserInput(transcription);
      } else if (typeof agentViewRef.value.processProblemContext === 'function') {
        await agentViewRef.value.processProblemContext(transcription);
      } else {
        // console.warn(`[PrivateHome] Agent "${agentLabel}" configured for own input, but no suitable handler found. Falling back to standard LLM call.`);
        await standardLlmCallPrivate(transcription, currentAgentInstance);
      }
    } catch (error: any) {
      console.error(`[PrivateHome] Error in agent's (${agentLabel}) custom input handler:`, error);
      toast?.add({type: 'error', title: 'Agent Error', message: error.message || `The agent "${agentLabel}" encountered an issue.`});
      if (isLoadingResponse.value) {
        isLoadingResponse.value = false;
      }
    }
  } else {
    // console.log(`[PrivateHome] Using standard LLM call for agent: ${agentLabel}`);
    await standardLlmCallPrivate(transcription, currentAgentInstance);
  }
  // console.log(`[PrivateHome] handleTranscriptionFromLayout finished. Current isLoadingResponse (in PrivateHome): ${isLoadingResponse.value}`);
}

async function standardLlmCallPrivate(transcriptionText: string, agentInstance: IAgentDefinition) {
  const agentId = agentInstance.id;
  const agentLabel = agentInstance.label || 'Assistant';
  const userMessageTimestamp = Date.now();

  console.log(`[PrivateHome - standardLlmCallPrivate] For agent ${agentLabel}. Setting isLoadingResponse = true.`);
  isLoadingResponse.value = true;

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
    if (!currentSystemPromptText.value || currentSystemPromptText.value.startsWith(`You are ${agentLabel}`)) {
      await loadCurrentAgentSystemPrompt();
      if (!currentSystemPromptText.value) {
        toast?.add({type: 'error', title: 'System Error', message: `Critical: Could not establish system instructions for ${agentLabel}.`});
        throw new Error(`System prompt could not be established for ${agentLabel}.`);
      }
    }

    let finalSystemPrompt = currentSystemPromptText.value
      .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified')
      .replace(/{{MODE}}/g, agentId)
      .replace(/{{GENERATE_DIAGRAM}}/g, ((agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams) ?? false).toString())
      .replace(/{{USER_QUERY}}/g, transcriptionText)
      .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.getAgentContext(agentId) || {}))
      .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, '');

    const historyConfig: Partial<AdvancedHistoryConfig> = {
      numRecentMessagesToPrioritize: agentInstance.capabilities?.maxChatHistory || 10,
      maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 8000 : (agentInstance.capabilities?.maxChatHistory || 10) * 200,
    };

    const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(agentId, transcriptionText, finalSystemPrompt, historyConfig);

    let messagesForPayload: ChatMessageFE[] = [
      { role: 'system', content: finalSystemPrompt, agentId: agentId, timestamp: userMessageTimestamp -10 },
      ...historyForApi.map(hMsg => ({
        role: hMsg.role, content: hMsg.content, timestamp: hMsg.timestamp, agentId: hMsg.agentId,
        name: (hMsg as any).name, tool_calls: (hMsg as any).tool_calls, tool_call_id: (hMsg as any).tool_call_id,
      }))
    ];
    if (!messagesForPayload.some(m => m.role === 'user' && m.content === transcriptionText && m.timestamp === userMessageTimestamp)) {
        messagesForPayload.push({ role: 'user', content: transcriptionText, timestamp: userMessageTimestamp, agentId });
    }

    const payload: ChatMessagePayloadFE = {
      messages: messagesForPayload,
      mode: agentInstance.systemPromptKey || agentId,
      language: voiceSettingsManager.settings.preferredCodingLanguage,
      generateDiagram: agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: auth.sessionUserId.value || `authenticated_user_session_${Date.now().toString(36)}`,
      conversationId: chatStore.getCurrentConversationId(agentId),
      stream: true,
    };
    // console.log(`[PrivateHome - standardLlmCallPrivate] Sending payload for ${agentLabel}.`);

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
        chatStore.setMainContentStreaming(false);
        if (agentStore.activeAgentId === agentId) {
          const finalContent = accumulatedResponse.trim();
          chatStore.addMessage({ role: 'assistant', content: finalContent, agentId: agentId, model: "StreamedModel (PrivateHome)", timestamp: Date.now() });
          chatStore.updateMainContent({
            agentId: agentId,
            type: agentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: finalContent,
            title: `${agentLabel} Response`,
            timestamp: Date.now()
          });
        }
        // isLoadingResponse is set in finally
      },
      (error: Error | any) => { // onStreamError
        console.error(`[PrivateHome - standardLlmCallPrivate] Stream API error for agent ${agentLabel}:`, error);
        const errorMsg = error.message || "A streaming error occurred.";
        if (agentStore.activeAgentId === agentId) {
          chatStore.addMessage({ role: 'error', content: `Stream Error: ${errorMsg}`, agentId, timestamp: Date.now() });
          chatStore.updateMainContent({
            agentId, type: 'error',
            data: `### ${agentLabel} Stream Error\n${errorMsg}`,
            title: `Error with ${agentLabel}`, timestamp: Date.now()
          });
        }
        chatStore.setMainContentStreaming(false);
        // isLoadingResponse is set in finally
      }
    );
  } catch (error: any) {
    console.error(`[PrivateHome - standardLlmCallPrivate] Chat API setup error for agent ${agentLabel}:`, error.response?.data || error.message || error);
    const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred.";
    if (agentStore.activeAgentId === agentId) {
        chatStore.addMessage({ role: 'error', content: `Interaction Error: ${errorMsg}`, agentId, timestamp: Date.now() });
        chatStore.updateMainContent({
            agentId, type: 'error',
            data: `### ${agentLabel} Interaction Error\n${errorMsg}`,
            title: `Error with ${agentLabel}`, timestamp: Date.now()
        });
    }
    chatStore.setMainContentStreaming(false);
    // isLoadingResponse is set in finally
  } finally {
    console.log(`[PrivateHome - standardLlmCallPrivate] For agent ${agentLabel}. Setting isLoadingResponse = false.`);
    isLoadingResponse.value = false;
    if (chatStore.isMainContentStreaming && agentStore.activeAgentId === agentId) {
        chatStore.setMainContentStreaming(false);
    }
  }
}

const handleAgentViewEventFromSlot = (eventData: any): void => {
  if (!activeAgent.value) return;
  // console.log(`[PrivateHome] Received agent-event: type='${eventData.type}', agentId='${eventData.agentId}' (active: ${activeAgent.value.id})`);

  if (eventData.agentId && eventData.agentId !== activeAgent.value.id) {
    // console.warn(`[PrivateHome] Ignored stale agent-event from '${eventData.agentId}'. Active is '${activeAgent.value.id}'.`);
    return;
  }

  switch (eventData.type) {
    case 'updateMainContent':
      chatStore.updateMainContent({
        agentId: activeAgent.value.id,
        type: eventData.payload.type || (activeAgent.value.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown'),
        data: eventData.payload.data,
        title: eventData.payload.title || `${activeAgent.value.label} Update`,
        timestamp: Date.now(),
      });
      if (typeof eventData.payload.isProcessing === 'boolean' && isLoadingResponse.value !== eventData.payload.isProcessing) {
        // console.log(`[PrivateHome] Agent event 'updateMainContent' also indicated isProcessing: ${eventData.payload.isProcessing}. Setting PrivateHome.isLoadingResponse.`);
        isLoadingResponse.value = eventData.payload.isProcessing;
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
      if (isLoadingResponse.value !== !!eventData.payload.isProcessing) {
        // console.log(`[PrivateHome] Event 'setProcessingState': payload.isProcessing = ${eventData.payload.isProcessing}. Updating PrivateHome.isLoadingResponse.`);
        isLoadingResponse.value = !!eventData.payload.isProcessing;
      }
      if (!eventData.payload.isProcessing && chatStore.isMainContentStreaming) {
        chatStore.setMainContentStreaming(false);
      }
      break;
    case 'requestGlobalAction':
      if (eventData.action === 'navigateTo' && eventData.payload?.route) {
        router.push(eventData.payload.route);
      } else {
        // console.warn(`[PrivateHome] Unhandled global action from agent: ${eventData.action}`);
      }
      break;
    case 'view_mounted':
      // console.log(`[PrivateHome] Agent view for "${eventData.label || activeAgent.value.label}" has mounted.`);
      if (agentViewRef.value && typeof agentViewRef.value.onParentAcknowledgedMount === 'function') {
        agentViewRef.value.onParentAcknowledgedMount();
      }
      break;
    default:
      // console.warn(`[PrivateHome] Unhandled agent-event type: ${eventData.type}`);
  }
};

onMounted(async () => {
  // console.log("[PrivateHome] Mounted.");
  if (!auth.isAuthenticated.value) {
    router.replace({ name: 'Login', query: { sessionExpired: 'true', reason: 'unauthenticated_access_pro_mount' }});
    return;
  }

  if (!agentStore.activeAgentId || !agentService.getAgentById(agentStore.activeAgentId)) {
    // console.log("[PrivateHome] No active agent ID in store or agent not found on mount. Setting default.");
    const defaultPrivateAgent = agentService.getDefaultAgent();
    if (defaultPrivateAgent) {
      await agentStore.setActiveAgent(defaultPrivateAgent.id);
    } else {
      console.error("[PrivateHome] CRITICAL: No default private agent could be determined on mount.");
      chatStore.updateMainContent({
        agentId: 'system-error' as AgentId, type: 'error',
        data: "### System Configuration Error\nNo default assistant could be loaded. Please check configuration.",
        title: "Initialization Error", timestamp: Date.now()
      });
      isLoadingResponse.value = false;
      return;
    }
  }

  if (activeAgent.value) {
    // console.log(`[PrivateHome] Active agent on mount: ${activeAgent.value.label}. Loading its system prompt if not self-handled.`);
    await loadCurrentAgentSystemPrompt();
    chatStore.ensureMainContentForAgent(activeAgent.value.id);
  }
  isLoadingResponse.value = false;
});

watch(() => agentStore.activeAgentId, async (newAgentId, oldAgentId) => {
  // console.log(`[PrivateHome] activeAgentId changed from ${oldAgentId || 'N/A'} to ${newAgentId || 'N/A'}.`);
  if (newAgentId && newAgentId !== oldAgentId) {
    isLoadingResponse.value = false;
    isVoiceInputCurrentlyProcessingAudio.value = false;
    if(chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false);
    await loadCurrentAgentSystemPrompt();
    chatStore.ensureMainContentForAgent(newAgentId);
  } else if (!newAgentId && oldAgentId !== null) {
    chatStore.updateMainContent({
      agentId: 'private-dashboard-placeholder' as AgentId, type: 'custom-component',
      data: 'PrivateDashboardPlaceholder', title: 'Welcome Back!', timestamp: Date.now(),
    });
    currentSystemPromptText.value = '';
    isLoadingResponse.value = false;
  } else if (newAgentId && newAgentId === oldAgentId) {
    const agent = agentService.getAgentById(newAgentId);
    if (agent && (!currentAgentViewComponent.value || !agent.capabilities?.handlesOwnInput)) {
      await loadCurrentAgentSystemPrompt();
    }
    chatStore.ensureMainContentForAgent(newAgentId);
  }
}, { immediate: true });

// This watcher was correctly removed in the previous step.
// Make sure it's NOT present:
// watch(isVoiceInputCurrentlyProcessingAudio, (isSttActive) => {
//   /* ... if (isSttActive) isLoadingResponse.value = true; ... */ // <--- THIS IS THE BUGGY PATTERN
// });

</script>
<template>
  <div class="private-home-view-ephemeral">
    <UnifiedChatLayout
      :is-voice-input-processing="isVoiceInputCurrentlyProcessingAudio"
      :current-agent-input-placeholder="activeAgent?.inputPlaceholder || 'Type your message or use voice...'"
      :show-ephemeral-log="showEphemeralLogForCurrentAgent"
      @transcription="handleTranscriptionFromLayout"
      @voice-input-processing="(status: boolean) => { isVoiceInputCurrentlyProcessingAudio = status; }"
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
        <div v-else class="loading-placeholder-ephemeral"> <div class="loading-animation-content">
            <div class="loading-spinner-ephemeral !w-16 !h-16"><div v-for="i in 8" :key="`blade-${i}-init`" class="spinner-blade-ephemeral !w-2 !h-5"></div></div>
            <p class="loading-text-ephemeral !text-lg mt-4">Initializing Workspace...</p>
            </div>
        </div>
      </template>
    </UnifiedChatLayout>
  </div>
</template>

<style lang="scss">
.dedicated-agent-view {
  height: 100%;
  width: 100%;
  overflow: auto;
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
  padding: 1rem; // Standard padding, can be overridden by specific content views
}
.has-framed-content .content-renderer-container-ephemeral{
  // Styles for when MainContentView has framed content, if needed
}
.private-dashboard-placeholder-ephemeral {
  @apply flex flex-col items-center justify-center h-full text-center p-8;
  .dashboard-icon-ephemeral {
    @apply w-20 h-20 mb-6 text-[var(--color-accent-primary)];
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

// Base prose styling for markdown content, assuming themes handle specific color overrides.
.prose-ephemeral {
  // Standard prose styling can go here or be managed by a global prose setup.
  // For Ephemeral Harmony, ensure it uses theme variables for links, headings, code blocks etc.
  // Example:
  // h1, h2, h3 { color: hsl(var(--color-text-heading-h), var(--color-text-heading-s), var(--color-text-heading-l)); }
  // p, li { color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));}
  // a { color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l)); }
  // &.prose-error { color: hsl(var(--color-error-text-h), var(--color-error-text-s), var(--color-error-text-l));}
}

// Ensure the streaming cursor is visible and blinks
.streaming-cursor-ephemeral {
  animation: blink 1s step-end infinite;
  font-weight: bold; // Make it more visible
  color: hsl(var(--color-text-accent-h), var(--color-text-accent-s), var(--color-text-accent-l));
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>