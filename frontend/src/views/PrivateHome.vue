// File: frontend/src/views/PrivateHome.vue
/**
 * @file PrivateHome.vue
 * @description Main private view for authenticated users. Orchestrates agent views,
 * handles central LLM calls for agents that don't manage their own input,
 * and manages the global LLM processing state (`isLoadingResponse`).
 * This state is critical for coordinating UI elements like VoiceInput.
 *
 * @component PrivateHome
 * @version 2.3.0 - ABSOLUTE RIGOR on isLoadingResponse management.
 * It is ONLY true during an actual LLM API call initiated by PrivateHome's
 * standardLlmCallPrivate OR when an agent view explicitly signals its own LLM activity
 * via the 'setProcessingState' event. Completely decoupled from STT activity state.
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
import type { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';
import { createScopedSttLogger } from '@/utils/debug';

import UnifiedChatLayout from '@/components/layouts/UnifiedChatLayout.vue';
import MainContentView from '@/components/agents/common/MainContentView.vue';
import CompactMessageRenderer from '@/components/layouts/CompactMessageRenderer/CompactMessageRenderer.vue';

import { ShieldCheckIcon, CogIcon, UserGroupIcon } from '@heroicons/vue/24/solid';
import PersonaToolbar from '@/components/common/PersonaToolbar.vue';
import { usePlans } from '@/composables/usePlans';
import { useCostStore } from '@/store/cost.store';
import { GPT4O_COST_PER_KTOKENS } from '../../../shared/planCatalog';


const toast = inject<ToastService>('toast');
const router = useRouter();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const auth = useAuth();
const debugLog = createScopedSttLogger('PrivateHome');

const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);
const currentSystemPromptText = ref('');

const costStore = useCostStore();
const { findPlan } = usePlans();

const isGlobalUnlimited = computed(() => auth.user.value?.mode === 'global' && auth.user.value?.tier === 'unlimited');
const unlimitedPlan = computed(() => (isGlobalUnlimited.value ? findPlan('global-pass') : null));
const tokensTotal = computed(() => unlimitedPlan.value?.usage.approxGpt4oTokensPerDay ?? null);
const tokensUsed = computed(() => {
  if (!isGlobalUnlimited.value) return null;
  const usd = costStore.totalSessionCost.value;
  return Math.round((usd / GPT4O_COST_PER_KTOKENS) * 1000);
});
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
 * @description CRITICAL STATE: True ONLY when an LLM API call is actively being awaited.
 * - Set to true by `standardLlmCallPrivate` before its API call.
 * - Set to true by `handleAgentViewEventFromSlot` if an agent view emits `setProcessingState: true`.
 * - Set to false reliably in `finally` blocks or by `setProcessingState: false` events.
 * This state is passed as `isLlmProcessing` to UnifiedChatLayout, which passes it as `isProcessing` to VoiceInput.
 */
const isLoadingResponse = ref(false);

/**
 * @ref isVoiceInputCurrentlyProcessingAudio
 * @description True when VoiceInput.vue's STT is active. THIS MUST NOT AFFECT `isLoadingResponse`.
 * Updated by the '@voice-input-processing' event from UnifiedChatLayout.
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
    return;
  }

  const systemPromptKey = agent.systemPromptKey;
  const agentLabel = agent.label || 'Assistant';
  let defaultPromptText = `You are ${agentLabel}. ${agent.description || 'Provide helpful assistance.'}`;

  if (systemPromptKey) {
    try {
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
  if (!transcription.trim()) return;
  if (!activeAgent.value) {
    toast?.add({ type: 'warning', title: 'No Agent Selected', message: 'Please select an agent.' });
    return;
  }

  const currentAgentInstance = activeAgent.value;
  const agentLabel = currentAgentInstance.label || 'Assistant';

  // Log entry point for transcription handling
  debugLog(`[PrivateHome] handleTranscriptionFromLayout for agent: ${agentLabel}. Current isLoadingResponse: ${isLoadingResponse.value}`);

  if (currentAgentInstance.capabilities?.handlesOwnInput && currentAgentViewComponent.value && agentViewRef.value) {
    debugLog(`[PrivateHome] Delegating input to dedicated handler for agent: ${agentLabel}`);
    try {
      if (typeof agentViewRef.value.handleNewUserInput === 'function') {
        // The agent view's handleNewUserInput is responsible for its own isLoadingResponse management
        // and emitting 'setProcessingState'
        await agentViewRef.value.handleNewUserInput(transcription);
      } else if (typeof agentViewRef.value.processProblemContext === 'function') {
        await agentViewRef.value.processProblemContext(transcription);
      } else {
        console.warn(`[PrivateHome] Agent "${agentLabel}" to handle own input, but no handler found. Fallback to standard.`);
        await standardLlmCallPrivate(transcription, currentAgentInstance);
      }
    } catch (error: any) {
      console.error(`[PrivateHome] Error in agent's (${agentLabel}) custom input handler:`, error);
      toast?.add({type: 'error', title: 'Agent Error', message: error.message || `Agent ${agentLabel} failed.`});
      // Agent view is responsible for emitting setProcessingState: false on its own error.
      // If PrivateHome's isLoadingResponse was true because of this agent, the agent *must* signal it's done.
    }
  } else {
    debugLog(`[PrivateHome] Using standard LLM call for agent: ${agentLabel}`);
    await standardLlmCallPrivate(transcription, currentAgentInstance);
  }
  debugLog(`[PrivateHome] handleTranscriptionFromLayout finished for agent ${agentLabel}. Final isLoadingResponse: ${isLoadingResponse.value}`);
}

async function standardLlmCallPrivate(transcriptionText: string, agentInstance: IAgentDefinition) {
  const agentId = agentInstance.id;
  const agentLabel = agentInstance.label || 'Assistant';
  const userMessageTimestamp = Date.now();

  // **CRITICAL: Set isLoadingResponse = true ONLY here for this specific LLM call path**
  if (isLoadingResponse.value) {
      console.warn(`[PrivateHome - standardLlmCallPrivate] Called for ${agentLabel} but isLoadingResponse is already true. This might indicate a problem if not expected.`);
      // Potentially block or queue, but for now, proceed and rely on finally block.
      // This path should ideally not be hit if an agent is already processing.
  }
  debugLog(`[PrivateHome - standardLlmCallPrivate] Initiating LLM call for ${agentLabel}. Setting isLoadingResponse = true.`);
  isLoadingResponse.value = true;

  chatStore.addMessage({ role: 'user', content: transcriptionText, agentId: agentId, timestamp: userMessageTimestamp });
  const streamingPlaceholder = `Consulting ${agentLabel}...`;
  if (agentStore.activeAgentId === agentId) {
      chatStore.setMainContentStreaming(true, streamingPlaceholder);
      chatStore.updateMainContent({ agentId, type: 'loading', data: streamingPlaceholder, title: `Processing with ${agentLabel}...`, timestamp: Date.now() });
  }

  try {
    if (!currentSystemPromptText.value || currentSystemPromptText.value.startsWith(`You are ${agentLabel}`)) {
      await loadCurrentAgentSystemPrompt();
      if (!currentSystemPromptText.value) {
        toast?.add({type: 'error', title: 'System Error', message: `Critical: No system prompt for ${agentLabel}.`});
        throw new Error(`No system prompt for ${agentLabel}.`);
      }
    }
    let finalSystemPrompt = currentSystemPromptText.value.replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified').replace(/{{MODE}}/g, agentId).replace(/{{GENERATE_DIAGRAM}}/g, ((agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams) ?? false).toString()).replace(/{{USER_QUERY}}/g, transcriptionText).replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.getAgentContext(agentId) || {})).replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, '');
    const historyConfig: Partial<AdvancedHistoryConfig> = { numRecentMessagesToPrioritize: agentInstance.capabilities?.maxChatHistory || 10, maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 8000 : (agentInstance.capabilities?.maxChatHistory || 10) * 200, };
    const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(agentId, transcriptionText, finalSystemPrompt, historyConfig);
    let messagesForPayload: ChatMessageFE[] = [ { role: 'system', content: finalSystemPrompt, agentId: agentId, timestamp: userMessageTimestamp -10 }, ...historyForApi.map(hMsg => ({ role: hMsg.role, content: hMsg.content, timestamp: hMsg.timestamp, agentId: hMsg.agentId, name: (hMsg as any).name, tool_calls: (hMsg as any).tool_calls, tool_call_id: (hMsg as any).tool_call_id, })) ];
    if (!messagesForPayload.some(m => m.role === 'user' && m.content === transcriptionText && m.timestamp === userMessageTimestamp)) { messagesForPayload.push({ role: 'user', content: transcriptionText, timestamp: userMessageTimestamp, agentId }); }
    const payload: ChatMessagePayloadFE = { messages: messagesForPayload, mode: agentInstance.systemPromptKey || agentId, language: voiceSettingsManager.settings.preferredCodingLanguage, generateDiagram: agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams, userId: auth.sessionUserId.value || `authenticated_user_session_${Date.now().toString(36)}`, conversationId: chatStore.getCurrentConversationId(agentId), stream: true, };

    let accumulatedResponse = "";
    await chatAPI.sendMessageStream( payload,
      (chunk: string) => { accumulatedResponse += chunk; if (agentStore.activeAgentId === agentId) { chatStore.updateMainContent({ agentId: agentId, type: agentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown', data: accumulatedResponse + "▋", title: `${agentLabel} Responding...`, timestamp: Date.now() }); } },
      () => { chatStore.setMainContentStreaming(false); if (agentStore.activeAgentId === agentId) { const finalContent = accumulatedResponse.trim(); chatStore.addMessage({ role: 'assistant', content: finalContent, agentId: agentId, model: "StreamedModel (PrivateHome)", timestamp: Date.now() }); chatStore.updateMainContent({ agentId: agentId, type: agentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown', data: finalContent, title: `${agentLabel} Response`, timestamp: Date.now() }); } },
      (error: Error | any) => { const errorMsg = error.message || "A streaming error occurred."; if (agentStore.activeAgentId === agentId) { chatStore.addMessage({ role: 'error', content: `Stream Error: ${errorMsg}`, agentId, timestamp: Date.now() }); chatStore.updateMainContent({ agentId, type: 'error', data: `### ${agentLabel} Stream Error\n${errorMsg}`, title: `Error with ${agentLabel}`, timestamp: Date.now() }); } chatStore.setMainContentStreaming(false); }
    );
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred.";
    if (agentStore.activeAgentId === agentId) { chatStore.addMessage({ role: 'error', content: `Interaction Error: ${errorMsg}`, agentId, timestamp: Date.now() }); chatStore.updateMainContent({ agentId, type: 'error', data: `### ${agentLabel} Interaction Error\n${errorMsg}`, title: `Error with ${agentLabel}`, timestamp: Date.now() }); }
    chatStore.setMainContentStreaming(false);
  } finally {
    // **CRITICAL: Reset isLoadingResponse = false here for this specific LLM call path**
    debugLog(`[PrivateHome - standardLlmCallPrivate] LLM call finished for ${agentLabel}. Setting isLoadingResponse = false.`);
    isLoadingResponse.value = false;
    if (chatStore.isMainContentStreaming && agentStore.activeAgentId === agentId) {
        chatStore.setMainContentStreaming(false);
    }
  }
}

const handleAgentViewEventFromSlot = (eventData: any): void => {
  if (!activeAgent.value) return;
  // debugLog(`[PrivateHome] AgentEvent: type='${eventData.type}', agentId='${eventData.agentId}' (active: ${activeAgent.value.id})`);

  if (eventData.agentId && eventData.agentId !== activeAgent.value.id) {
    // console.warn(`[PrivateHome] Ignored stale agent-event from '${eventData.agentId}'.`);
    return;
  }

  switch (eventData.type) {
    case 'updateMainContent': 
      chatStore.updateMainContent({ agentId: activeAgent.value.id, type: eventData.payload.type || (activeAgent.value.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown'), data: eventData.payload.data, title: eventData.payload.title || `${activeAgent.value.label} Update`, timestamp: Date.now(), });
      // DO NOT set isLoadingResponse here based on updateMainContent's payload.
      // Only 'setProcessingState' should control this from agent views.
      break;
    case 'addChatMessage': 
      chatStore.addMessage({ agentId: activeAgent.value.id, timestamp: Date.now(), role: eventData.payload.role || 'assistant', content: eventData.payload.content, ...(eventData.payload.extra || {}) });
      break;
    case 'setProcessingState':
      // This is the SOLE event from agent views that should control PrivateHome's isLoadingResponse.
      const newProcessingState = !!eventData.payload.isProcessing;
      if (isLoadingResponse.value !== newProcessingState) {
        debugLog(`[PrivateHome] Event 'setProcessingState' from agent view ${activeAgent.value.label}: payload.isProcessing = ${newProcessingState}. Updating PrivateHome.isLoadingResponse from ${isLoadingResponse.value} to ${newProcessingState}.`);
        isLoadingResponse.value = newProcessingState;
      } else {
        // debugLog(`[PrivateHome] Event 'setProcessingState' from agent view ${activeAgent.value.label}: payload.isProcessing = ${newProcessingState}. PrivateHome.isLoadingResponse already ${isLoadingResponse.value}. No change.`);
      }
      if (!newProcessingState && chatStore.isMainContentStreaming) {
        chatStore.setMainContentStreaming(false);
      }
      break;
    case 'requestGlobalAction': 
      if (eventData.action === 'navigateTo' && eventData.payload?.route) { router.push(eventData.payload.route); } 
      break;
    case 'view_mounted': 
      if (agentViewRef.value && typeof agentViewRef.value.onParentAcknowledgedMount === 'function') { agentViewRef.value.onParentAcknowledgedMount(); } 
      break;
    default: 
      console.warn(`[PrivateHome] Unhandled agent-event type: ${eventData.type}`);
  }
};

onMounted(async () => {
  debugLog("[PrivateHome] Mounted. Initial isLoadingResponse:", isLoadingResponse.value);
  if (!auth.isAuthenticated.value) {
    router.replace({ name: 'Login', query: { sessionExpired: 'true', reason: 'unauthenticated_access_pro_mount' }});
    return;
  }
  if (!agentStore.activeAgentId || !agentService.getAgentById(agentStore.activeAgentId)) {
    const defaultPrivateAgent = agentService.getDefaultAgent();
    if (defaultPrivateAgent) {
      await agentStore.setActiveAgent(defaultPrivateAgent.id);
    } else {
      console.error("[PrivateHome] CRITICAL: No default private agent.");
      chatStore.updateMainContent({ agentId: 'system-error' as AgentId, type: 'error', data: "### System Error\nNo default assistant.", title: "Init Error", timestamp: Date.now() });
      isLoadingResponse.value = false; return;
    }
  }
  if (activeAgent.value) {
    await loadCurrentAgentSystemPrompt();
    chatStore.ensureMainContentForAgent(activeAgent.value.id);
  }
  // Explicitly ensure isLoadingResponse is false after initial setup, unless an agent immediately signals processing.
  // This handles cases where it might have been true from a previous state if the component was kept-alive.
  if (isLoadingResponse.value && !activeAgent.value?.capabilities?.handlesOwnInput) {
      debugLog("[PrivateHome] onMounted: isLoadingResponse was true, but current agent does not handle own input. Resetting to false.");
      isLoadingResponse.value = false;
  } else if (isLoadingResponse.value && activeAgent.value?.capabilities?.handlesOwnInput) {
      debugLog("[PrivateHome] onMounted: isLoadingResponse is true, and agent handles own input. Agent view is responsible for this state.");
  } else {
      isLoadingResponse.value = false; // Default ensure it's false.
  }
  debugLog("[PrivateHome] onMounted finished. Final isLoadingResponse:", isLoadingResponse.value);
});

watch(() => agentStore.activeAgentId, async (newAgentId, oldAgentId) => {
  debugLog(`[PrivateHome] activeAgentId changed from ${oldAgentId || 'N/A'} to ${newAgentId || 'N/A'}. Current isLoadingResponse: ${isLoadingResponse.value}`);
  if (newAgentId && newAgentId !== oldAgentId) {
    // Reset LLM loading state when agent changes, unless the new agent immediately sets it via event.
    // Standard agents won't emit 'setProcessingState' immediately, so this reset is safe for them.
    // Agents handling own input might emit quickly, and handleAgentViewEventFromSlot will update.
    if (isLoadingResponse.value) {
        debugLog(`[PrivateHome] Agent changed. Resetting isLoadingResponse from true to false.`);
        isLoadingResponse.value = false;
    }
    isVoiceInputCurrentlyProcessingAudio.value = false;
    if(chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false);
    await loadCurrentAgentSystemPrompt();
    chatStore.ensureMainContentForAgent(newAgentId);
  } else if (!newAgentId && oldAgentId !== null) {
    chatStore.updateMainContent({ agentId: 'private-dashboard-placeholder' as AgentId, type: 'custom-component', data: 'PrivateDashboardPlaceholder', title: 'Welcome Back!', timestamp: Date.now(), });
    currentSystemPromptText.value = '';
    if (isLoadingResponse.value) {
        debugLog(`[PrivateHome] Agent cleared. Resetting isLoadingResponse from true to false.`);
        isLoadingResponse.value = false;
    }
  } else if (newAgentId && newAgentId === oldAgentId) { // Agent re-selected or initial load
    const agent = agentService.getAgentById(newAgentId);
    if (agent && (!currentAgentViewComponent.value || !agent.capabilities?.handlesOwnInput)) {
      await loadCurrentAgentSystemPrompt();
    }
    chatStore.ensureMainContentForAgent(newAgentId);
    // Do not change isLoadingResponse here; it should persist if already true for this agent.
  }
  debugLog(`[PrivateHome] Watch activeAgentId finished for ${newAgentId}. Final isLoadingResponse: ${isLoadingResponse.value}`);
}, { immediate: true });

// Watch for STT activity changes. THIS IS FOR LOGGING/DEBUGGING ONLY.
// IT MUST NOT CHANGE isLoadingResponse.
watch(isVoiceInputCurrentlyProcessingAudio, (isSttActive) => {
    debugLog(`[PrivateHome - DEBUG] isVoiceInputCurrentlyProcessingAudio (STT active) changed to: ${isSttActive}. Current isLoadingResponse (LLM active): ${isLoadingResponse.value}`);
    // NO CHANGE TO isLoadingResponse.value HERE
});

</script>
<template>
  <div class="private-home-view-ephemeral">
    <UnifiedChatLayout
      :is-llm-processing="isLoadingResponse"
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
        <div v-else class="loading-placeholder-ephemeral">
            <div class="loading-animation-content">
                <div class="loading-spinner-ephemeral !w-16 !h-16"><div v-for="i in 8" :key="`blade-${i}-init`" class="spinner-blade-ephemeral !w-2 !h-5"></div></div>
                <p class="loading-text-ephemeral !text-lg mt-4">Initializing Workspace...</p>
            </div>
        </div>
      </template>
      <template #voice-toolbar>
        <PersonaToolbar
          :agent="activeAgent"
          :show-usage-badge="isGlobalUnlimited"
          :tokens-total="tokensTotal"
          :tokens-used="tokensUsed"
        />
      </template>
    </UnifiedChatLayout>
  </div>
</template>

<style lang="scss">
/* PrivateHome layout helpers */
.dedicated-agent-view { height: 100%; width: 100%; overflow: auto; }
.default-agent-mcv { height: 100%; width: 100%; display: flex; flex-direction: column; }
.content-renderer-container-ephemeral { flex-grow: 1; overflow-y: auto; padding: 1rem; }
.has-framed-content .content-renderer-container-ephemeral{}
.private-dashboard-placeholder-ephemeral { @apply flex flex-col items-center justify-center h-full text-center p-8; .dashboard-icon-ephemeral { @apply w-20 h-20 mb-6 text-[var(--color-accent-primary)]; filter: drop-shadow(0 4px 10px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.3)); } .dashboard-title-ephemeral { @apply text-4xl font-bold text-[var(--color-text-primary)] mb-3; } .dashboard-subtitle-ephemeral { @apply text-lg text-[var(--color-text-secondary)] max-w-lg; } }
.loading-placeholder-ephemeral { @apply flex-grow flex items-center justify-center h-full p-4 text-center; .loading-animation-content { @apply flex flex-col items-center; } }
.prose-ephemeral {}
.streaming-cursor-ephemeral { animation: blink 1s step-end infinite; font-weight: bold; color: hsl(var(--color-text-accent-h), var(--color-text-accent-s), var(--color-text-accent-l)); }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }



</style>












