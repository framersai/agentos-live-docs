/**
 * @file PrivateHome.vue
 * @description Authenticated home view using UnifiedChatLayout.
 * Features dynamic agent loading and a visually engaging dashboard placeholder.
 * @version 3.2.1 - Merged with v3.1.2, restoring error handling and agent event logic.
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
  type ProcessedHistoryMessageFE, // Assuming this is compatible or handled by API
  type ChatMessageFE,
  type TextResponseDataFE // For direct LLM call if not streaming certain types
} from '@/utils/api';
import { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';

import UnifiedChatLayout from '@/components/layouts/UnifiedChatLayout.vue';
import MainContentView from '@/components/agents/common/MainContentView.vue';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';

// Icons for placeholder
import { ShieldCheckIcon, CogIcon } from '@heroicons/vue/24/solid'; // Using solid for more impact

// Dynamic Prompt Loading
const rawPromptModules = import.meta.glob("../../../../prompts/*.md", { query: "?raw", import: "default", eager: false });
const promptModules: Record<string, () => Promise<string>> = {};
for (const key in rawPromptModules) {
  const mod = rawPromptModules[key];
  promptModules[key] = async () => { // Ensure it's always async returning string
    const result = await mod();
    return typeof result === 'string' ? result : String(result); // Handle potential non-string default exports
  };
}

const toast = inject<ToastService>('toast');
const router = useRouter();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const auth = useAuth();

const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);

// Dynamically load agent-specific view components
const currentAgentViewComponent = computed<VueComponentType | null>(() => {
  const componentName = activeAgent.value?.viewComponentName;
  if (componentName) {
    try {
      // Example mapping:
      if (componentName === 'LCAuditAgentView') {
        return defineAsyncComponent(() => import('@/components/agents/LCAuditAgentView.vue'));
      }
      // Add other agent views here based on componentName
      // if (componentName === 'SpecificAgentView') return defineAsyncComponent(() => import(...));

      // Fallback or warning if componentName is set but not specifically mapped
      // This part depends on your project's conventions for agent view components.
      // If you have a predictable pattern:
      // return defineAsyncComponent(() => import(`@/components/agents/${componentName}.vue`));
      console.warn(`[PrivateHome] No specific dynamic import rule for viewComponentName: ${componentName}. Agent UI might not load.`);
      return null;
    } catch (e) {
      console.error(`[PrivateHome] Error dynamically importing agent view: ${componentName}`, e);
      toast?.add({ type: 'error', title: 'UI Error', message: `Could not load interface for ${activeAgent.value?.label || 'agent'}.` });
      return null;
    }
  }
  return null; // No specific view component for this agent
});

const isLoadingResponse = ref(false);
const isVoiceInputCurrentlyProcessing = ref(false);
const agentViewRef = ref<any>(null); // Ref for agent's dedicated view component instance

const mainContentData = computed<MainContent | null>(() => {
  if (!activeAgent.value) {
    // Dashboard placeholder
    return {
      agentId: 'private-dashboard-placeholder' as AgentId, type: 'custom-component',
      data: 'PrivateDashboardPlaceholder', title: 'Welcome Back!', timestamp: Date.now(),
    };
  }
  // If a dedicated agent UI component is loaded, main content is typically handled by that component.
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

// Determines if the default MainContentView wrapper should be used for non-dedicated UI agents
const shouldUseDefaultMainContentView = computed(() => {
  return activeAgent.value && !currentAgentViewComponent.value && mainContentData.value?.type !== 'custom-component';
});

// Prop for UnifiedChatLayout to show/hide ephemeral log
const showEphemeralLogForCurrentAgent = computed(() => {
  return activeAgent.value?.capabilities?.showEphemeralChatLog ?? true; // Default to true if not specified
});


const handleTranscriptionFromLayout = async (transcription: string): Promise<void> => {
  if (!transcription.trim()) return;
  if (!activeAgent.value) {
    toast?.add({ type: 'warning', title: 'No Agent Selected', message: 'Please select an agent from the header menu to start interacting.', duration: 4000 });
    return;
  }

  isVoiceInputCurrentlyProcessing.value = true; // Set early, UnifiedChatLayout might also emit this
  isLoadingResponse.value = true;
  const currentAgentInstance = activeAgent.value;
  const agentId = currentAgentInstance.id;

  // If agent has a dedicated view component that handles its own input
  if (currentAgentInstance.capabilities?.handlesOwnInput && currentAgentViewComponent.value && agentViewRef.value) {
    try {
      if (typeof agentViewRef.value.processProblemContext === 'function') { // Specific for LC-Audit like agents
        await agentViewRef.value.processProblemContext(transcription);
      } else if (typeof agentViewRef.value.handleNewUserInput === 'function') { // Generic custom input handler
        await agentViewRef.value.handleNewUserInput(transcription);
      } else {
        throw new Error("Agent configured to handle own input, but no suitable handler (processProblemContext or handleNewUserInput) found on its component.");
      }
    } catch (error: any) {
      console.error(`[PrivateHome] Error in agent's (${agentId}) custom input handler:`, error);
      toast?.add({type: 'error', title: 'Agent Error', message: error.message || 'The agent encountered an issue processing your input.'});
      isLoadingResponse.value = false; // Agent view should manage its own, but reset here as a fallback
    } finally {
      //isLoadingResponse.value = false; // Agent view is responsible for its internal loading state visibility
      isVoiceInputCurrentlyProcessing.value = false;
    }
  } else {
    // Standard LLM call for agents without dedicated input handlers
    const userMessageTimestamp = Date.now();
    chatStore.addMessage({ role: 'user', content: transcription, agentId: agentId, timestamp: userMessageTimestamp });

    const streamingPlaceholder = `Consulting ${currentAgentInstance.label}...`;
    chatStore.setMainContentStreaming(true, streamingPlaceholder); // For ephemeral log if shown
    chatStore.updateMainContent({ // Update main display area with loading state
        agentId, type: 'loading', data: streamingPlaceholder,
        title: `Processing with ${currentAgentInstance.label}...`, timestamp: Date.now()
    });

    try {
      const systemPromptKey = currentAgentInstance.systemPromptKey || 'general_chat';
      const promptModuleKey = `../../../../prompts/${systemPromptKey}.md`;
      let systemPromptText = `You are ${currentAgentInstance.label}. ${currentAgentInstance.description}`;

      if (promptModules[promptModuleKey]) {
        systemPromptText = (await promptModules[promptModuleKey]())
          .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified')
          .replace(/{{MODE}}/g, agentId) // agentId might be more specific than a generic mode
          .replace(/{{GENERATE_DIAGRAM}}/g, ((currentAgentInstance.capabilities?.canGenerateDiagrams ?? false) && (voiceSettingsManager.settings.generateDiagrams ?? false)).toString())
          .replace(/{{USER_QUERY}}/g, transcription)
          .replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.getAgentContext(agentId) || {}))
          .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, ''); // Populate if there are dynamic additional instructions
      } else {
        console.warn(`[PrivateHome] Prompt module not found for key: ${promptModuleKey}. Using default description as system prompt. Available keys:`, Object.keys(promptModules));
      }

      const historyConfig: Partial<AdvancedHistoryConfig> = {
        numRecentMessagesToPrioritize: currentAgentInstance.capabilities?.maxChatHistory || 10,
        maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 8000 : (currentAgentInstance.capabilities?.maxChatHistory || 10) * 150,
        // Add other specific overrides if needed
      };
      // Assuming getHistoryForApi returns ProcessedHistoryMessageFE[] which is compatible with ChatMessageFE[] for the payload
      // or that the API handles ProcessedHistoryMessageFE. If not, a mapping is needed.
      const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(agentId, transcription, systemPromptText, historyConfig);
      
      let messagesForPayload: ChatMessageFE[] = historyForApi.map(hMsg => ({ // Explicit mapping for safety if types differ subtly
          role: hMsg.role,
          content: hMsg.content,
          timestamp: hMsg.timestamp,
          // Map other relevant ChatMessageFE fields if they exist on ProcessedHistoryMessageFE
          name: (hMsg as any).name, 
          tool_calls: (hMsg as any).tool_calls,
          tool_call_id: (hMsg as any).tool_call_id,
      }));

      // Ensure the current user message (added to store above) is part of the payload if getHistoryForApi might not have picked it up (e.g. timing)
      // This check is good for robustness.
      const userMessageStillMissing = !messagesForPayload.find(
        m => m.role === 'user' && m.content === transcription && m.timestamp === userMessageTimestamp
      );
      if (userMessageStillMissing) {
        messagesForPayload.push({ role: 'user', content: transcription, timestamp: userMessageTimestamp });
        // Optional: re-sort if strict chronological order is critical and push disrupted it
        // messagesForPayload.sort((a,b) => (a.timestamp || 0) - (b.timestamp || 0));
      }

      const payload: ChatMessagePayloadFE = {
        messages: messagesForPayload, // System prompt handled by systemPromptOverride
        mode: systemPromptKey,
        systemPromptOverride: systemPromptText,
        language: voiceSettingsManager.settings.preferredCodingLanguage,
        generateDiagram: currentAgentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
        // userId: auth.user.value?.id || 'authenticated_user_private',
        // get some kind of static data from user request that is constant like IP for this session,
        // and use that as userId
        // userId: 'private_user_session', // Fallback for private agents

        conversationId: chatStore.getCurrentConversationId(agentId),
        stream: true,
      };

      let accumulatedResponse = "";
      await chatAPI.sendMessageStream(
        payload,
        (chunk: string) => {
            accumulatedResponse += chunk;
            // Update main content for streaming display
            if (agentStore.activeAgentId === agentId) { // Only update if agent is still active
                chatStore.updateMainContent({
                    agentId: agentId,
                    type: currentAgentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
                    data: accumulatedResponse + "▋", // Add streaming cursor
                    title: `${currentAgentInstance.label} Responding...`,
                    timestamp: Date.now()
                });
            }
        },
        () => { // onStreamEnd
          if (agentStore.activeAgentId === agentId) { // Check if agent is still active
            chatStore.addMessage({ role: 'assistant', content: accumulatedResponse, agentId: agentId, model: "StreamedModel (Private)", timestamp: Date.now() });
            chatStore.updateMainContent({
              agentId: agentId,
              type: currentAgentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
              data: accumulatedResponse, // Final content without cursor
              title: `${currentAgentInstance.label} Response`, timestamp: Date.now()
            });
          }
          // isLoadingResponse and isVoiceInputCurrentlyProcessing reset in finally
        },
        (error: Error | any) => { // onStreamError (specific to stream phase)
          console.error(`[PrivateHome] Stream API error for agent ${agentId}:`, error);
          const errorMsg = error.message || "A streaming error occurred with the assistant.";
          if (agentStore.activeAgentId === agentId) {
            chatStore.addMessage({ role: 'error', content: `Stream Error: ${errorMsg}`, agentId, timestamp: Date.now() });
            chatStore.updateMainContent({
              agentId, type: 'error', // Using 'error' type for consistency with template
              data: `### Assistant Stream Error\n${errorMsg}`,
              title: `Error with ${currentAgentInstance.label}`, timestamp: Date.now()
            });
          }
          // Other states reset in finally
        }
      );
    } catch (error: any) { // Catch errors from setup, prompt loading, or non-stream part of API call
      console.error(`[PrivateHome] Chat API interaction error for agent ${agentId}:`, error);
      const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred while communicating with the assistant.";
      if (agentStore.activeAgentId === agentId) {
        chatStore.addMessage({ role: 'error', content: `Interaction Error: ${errorMsg}`, agentId, timestamp: Date.now() });
        chatStore.updateMainContent({
          agentId, type: 'error', // Using 'error' type
          data: `### Assistant Interaction Error\n${errorMsg}`,
          title: `Error with ${currentAgentInstance.label}`, timestamp: Date.now()
        });
      }
    } finally {
      isLoadingResponse.value = false;
      isVoiceInputCurrentlyProcessing.value = false;
      chatStore.setMainContentStreaming(false); // Ensure streaming state is cleared
    }
  }
};

const handleAgentViewEventFromSlot = (eventData: any): void => {
  if (!activeAgent.value) return;
  // console.log(`[PrivateHome] Event from agent UI (${activeAgent.value.label}):`, eventData);
  switch (eventData.type) {
    case 'updateMainContent':
      chatStore.updateMainContent({
        agentId: activeAgent.value.id,
        type: eventData.payload.type || (activeAgent.value.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown'),
        data: eventData.payload.data,
        title: eventData.payload.title || `${activeAgent.value.label} Update`,
        timestamp: Date.now(),
      });
      // If agent updates main content, it might also be finishing its processing
      if (eventData.payload.isProcessing === false) { // Explicit check
        isLoadingResponse.value = false;
        isVoiceInputCurrentlyProcessing.value = false;
      }
      break;
    case 'addChatMessage': // Restored from old file
      chatStore.addMessage({
        agentId: activeAgent.value.id,
        timestamp: Date.now(),
        role: eventData.payload.role || 'assistant',
        content: eventData.payload.content,
        ...(eventData.payload.extra || {})
      });
      break;
    case 'setProcessingState': // Restored from old file
      isLoadingResponse.value = !!eventData.payload.isProcessing;
      isVoiceInputCurrentlyProcessing.value = !!eventData.payload.isProcessing; // Also link this for consistency
      if (!eventData.payload.isProcessing && chatStore.isMainContentStreaming) {
        chatStore.setMainContentStreaming(false);
      }
      break;
    case 'requestGlobalAction': // Restored from old file
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

onMounted(() => {
  if (!auth.isAuthenticated.value) {
    router.replace({ name: 'Login', query: { sessionExpired: 'true' }});
    return;
  }
  if (!agentStore.activeAgentId || !agentService.getAgentById(agentStore.activeAgentId)) {
    const defaultPrivateAgent = agentService.getDefaultAgent();
    if (defaultPrivateAgent) {
      agentStore.setActiveAgent(defaultPrivateAgent.id);
      // The watch on activeAgentId will call ensureMainContentForAgent
    } else {
      console.error("[PrivateHome] Critical: No default private agent could be determined.");
      chatStore.updateMainContent({
        agentId: 'system-error' as AgentId, type: 'error',
        data: "### System Configuration Error\nNo default assistant could be loaded. Please check the application setup or contact support.",
        title: "Initialization Error", timestamp: Date.now()
      });
    }
  } else {
    // If an agent is already active (e.g., from previous session state), ensure its content is loaded.
    // The watcher with immediate:true should also handle this.
    chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
  }
});

watch(() => agentStore.activeAgentId, (newAgentId, oldAgentId) => {
  if (newAgentId && newAgentId !== oldAgentId) {
    isLoadingResponse.value = false;
    isVoiceInputCurrentlyProcessing.value = false;
    if(chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false);
    chatStore.ensureMainContentForAgent(newAgentId);
  }
  if (!newAgentId && oldAgentId !== null) { // Show dashboard if active agent becomes null (e.g. deselect or error)
     chatStore.updateMainContent({
      agentId: 'private-dashboard-placeholder' as AgentId, type: 'custom-component',
      data: 'PrivateDashboardPlaceholder', title: 'Welcome Back!', timestamp: Date.now(),
    });
  }
  // If newAgentId is null on initial load (no default agent was found and set by onMounted),
  // the mainContentData computed property will already return the dashboard.
}, { immediate: true }); // Immediate to run on component mount

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
               <!-- {{ agentStore.activeAgentId || 'Premium User' }} -->
               ! Select an assistant from the header menu to begin, or manage your preferences.
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
// This file will define .private-home-view-ephemeral, .private-dashboard-placeholder-ephemeral, etc.
// and also implement the "central, top-heavy" margin adjustments for desktop/landscape.
</style>