// File: frontend/src/views/PrivateHome.vue
/**
 * @file PrivateHome.vue
 * @description Authenticated home view using UnifiedChatLayout for the "Ephemeral Harmony" theme.
 * Hosts the main AI agent framework, allowing interaction with various AI agents and their specific UIs.
 * @version 2.1.0 - Refactored to use UnifiedChatLayout, full Ephemeral Harmony styling.
 */
<script setup lang="ts">
import { ref, computed, onMounted, inject, watch, shallowRef, type Component as VueComponentType, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import type { ToastService } from '@/services/services';
import { agentService, type AgentId, type IAgentDefinition } from '@/services/agent.service';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type MainContent } from '@/store/chat.store';
import { voiceSettingsManager } from '@/services/voice.settings.service'; // For default audioInputMode if needed by VoiceInput

// Import New Layout and Core UI Components
import UnifiedChatLayout from '@/components/layouts/UnifiedChatLayout.vue';
// MainContentView can still be used as a wrapper or default display within the slot if an agent doesn't have a custom UI
import MainContentView from '@/components/agents/common/MainContentView.vue';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue'; // For agents that use it

// Icons for placeholder/dashboard state
import { ShieldCheckIcon, UserGroupIcon, SparklesIcon as SparklesIconOutline } from '@heroicons/vue/24/outline';

// --- Store and Service Initialization ---
const toast = inject<ToastService>('toast');
const router = useRouter(); // For navigation (e.g., to settings, or if an agent triggers a route change)
const agentStore = useAgentStore();
const chatStore = useChatStore();

// --- Component State ---
const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);
const currentAgentUiComponent = computed<VueComponentType | string | undefined>(() => {
  // Resolve async components correctly if uiComponent is a function returning a promise
  if (typeof activeAgent.value?.uiComponent === 'function') {
    return defineAsyncComponent(activeAgent.value.uiComponent as () => Promise<VueComponentType>);
  }
  return activeAgent.value?.uiComponent; // String name or direct component
});

const isVoiceInputCurrentlyProcessing = ref(false); // Managed by events from VoiceInput via UnifiedChatLayout
const agentViewRef = ref<any>(null); // Ref to the dynamic agent UI component instance

/**
 * @computed mainContentForLayout
 * @description Determines the content to be displayed in the main area if the active agent
 * does not have a specific UI component or if a default/welcome message is needed.
 */
const mainContentForLayout = computed<MainContent | null>(() => {
  if (!activeAgent.value) {
    return {
      agentId: 'private-dashboard-placeholder' as AgentId,
      type: 'custom-component', // Key to render the placeholder
      data: 'PrivateDashboardPlaceholder',
      title: 'Welcome Back',
      timestamp: Date.now(),
    };
  }
  // If an agent is active but has no specific UI (currentAgentUiComponent is undefined),
  // MainContentView might display its default welcome or messages from chatStore.
  // This allows agents to simply use markdown/compact messages without a dedicated view component.
  if (!currentAgentUiComponent.value) {
      return chatStore.getMainContentForAgent(activeAgent.value.id) || {
          agentId: activeAgent.value.id,
          type: 'welcome', // Default to welcome message for agent
          data: `Welcome to the ${activeAgent.value.label} assistant. How can I help you today?`,
          title: activeAgent.value.label,
          timestamp: Date.now()
      };
  }
  // If there's a specific UI component, it handles its own content.
  // We might pass chatStore.getMainContentForAgent(activeAgent.value.id) as a prop to it if needed.
  return null; // Or return a minimal object indicating custom UI is active
});


/**
 * @function handleTranscriptionFromLayout
 * @description Handles transcription received from UnifiedChatLayout (which gets it from VoiceInput).
 * Delegates to the active agent's UI if it has a specific input handler,
 * otherwise performs a default chat interaction.
 * @param {string} transcription - The transcribed text from the user.
 * @async
 */
const handleTranscriptionFromLayout = async (transcription: string): Promise<void> => {
  if (!transcription.trim()) return;
  if (!activeAgent.value) {
    toast?.add({ type: 'warning', title: 'No Agent Selected', message: 'Please select an agent from the header menu to interact.' });
    return;
  }

  isVoiceInputCurrentlyProcessing.value = true; // Indicate that processing has started

  // Prioritize agent-specific input handler
  if (agentViewRef.value && typeof agentViewRef.value.handleNewUserInput === 'function') {
    try {
      // The agent-specific UI component is responsible for:
      // 1. Adding the user message to the chatStore.
      // 2. Making API calls if necessary.
      // 3. Adding assistant responses to the chatStore.
      // 4. Updating its own main content view (or emitting events for PrivateHome to do so).
      // 5. Managing its own internal loading/processing state and eventually signaling completion.
      await agentViewRef.value.handleNewUserInput(transcription);
      // Assume the agent component will emit an event or directly set a shared state
      // to indicate when its processing is complete. For now, we rely on @set-processing-state event.
    } catch (error) {
      console.error(`[PrivateHome] Error in agent's (${activeAgent.value.id}) custom input handler:`, error);
      toast?.add({type: 'error', title: 'Agent Interaction Error', message: 'The active agent encountered an issue.'});
      isVoiceInputCurrentlyProcessing.value = false; // Reset on error
    }
  } else {
    // Default chat interaction if no specific agent handler (e.g., send to a generic backend endpoint)
    const agentId = activeAgent.value.id;
    console.log(`[PrivateHome] Default chat handler for agent ${agentId}, input: "${transcription}"`);

    chatStore.addMessage({ role: 'user', content: transcription, agentId: agentId });
    chatStore.setMainContentStreaming(true, `Consulting ${activeAgent.value.label}...`);

    // TODO: Replace with actual chatAPI.sendMessage or sendMessageStream call for authenticated users
    // This would involve constructing the payload similar to PublicHome.vue but without rate limit concerns
    // and potentially with more context or user-specific data.
    try {
        // Example: Construct payload
        // const history = await chatStore.getHistoryForApi(...);
        // const payload = { messages: [...], mode: agentId, ...};
        // const response = await chatAPI.sendMessage(payload); // or sendMessageStream

        // MOCK RESPONSE FOR NOW
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        const mockResponse = `This is a simulated response from ${activeAgent.value.label} to your query: "${transcription.substring(0, 40)}..."`;
        
        chatStore.addMessage({ role: 'assistant', content: mockResponse, agentId: agentId });
        chatStore.updateMainContent({
            agentId: agentId,
            type: activeAgent.value.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
            data: mockResponse,
            title: `${activeAgent.value.label} Says`,
            timestamp: Date.now()
        });

    } catch (error: any) {
        console.error(`[PrivateHome] Default chat handler API error for agent ${agentId}:`, error);
        const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred.";
        chatStore.addMessage({ role: 'error', content: `Error: ${errorMsg}`, agentId });
         chatStore.updateMainContent({
            agentId, type: 'markdown', data: `### Interaction Error\n${errorMsg}`,
            title: `Error with ${activeAgent.value.label}`, timestamp: Date.now()
        });
    } finally {
        chatStore.setMainContentStreaming(false);
        isVoiceInputCurrentlyProcessing.value = false; // Reset after default handler completes
    }
  }
};

/**
 * @function handleAgentViewEventFromSlot
 * @description Handles custom events emitted by dynamically loaded agent UI components
 * that are slotted into MainContentView.
 * @param {any} eventData - The data emitted by the agent component.
 */
const handleAgentViewEventFromSlot = (eventData: any): void => {
  if (!activeAgent.value) return;
  console.log(`[PrivateHome] Event from agent UI (${activeAgent.value.label}):`, eventData);

  switch (eventData.type) {
    case 'updateMainContent':
      chatStore.updateMainContent({
        agentId: activeAgent.value.id,
        type: eventData.payload.type || 'markdown',
        data: eventData.payload.data,
        title: eventData.payload.title || `${activeAgent.value.label} Update`,
        timestamp: Date.now(),
      });
      break;
    case 'addChatMessage':
      chatStore.addMessage({
        agentId: activeAgent.value.id,
        role: eventData.payload.role || 'assistant', // Default to assistant if role not specified
        content: eventData.payload.content,
        ...(eventData.payload.extra || {}) // For model, usage, tool_calls etc.
      });
      break;
    case 'setProcessingState': // Allows agent UI to control the global voice input processing state
      isVoiceInputCurrentlyProcessing.value = !!eventData.payload.isProcessing;
      if (!eventData.payload.isProcessing && chatStore.isMainContentStreaming) {
         chatStore.setMainContentStreaming(false); // Ensure streaming display stops if agent signals completion
      }
      break;
    case 'requestGlobalAction': // Example: Agent requests a global action like navigation
      if (eventData.action === 'navigateTo' && eventData.payload?.route) {
        router.push(eventData.payload.route);
      }
      break;
    default:
      console.warn(`[PrivateHome] Unhandled agent event type: ${eventData.type}`);
  }
};

onMounted(() => {
  // Agent store initialization (in agent.store.ts) should ensure an agent is active.
  // If not, or if the active agent isn't suitable for PrivateHome, set a default.
  if (!agentStore.activeAgentId || !agentService.getAgentById(agentStore.activeAgentId)) {
    const defaultPrivateAgent = agentService.getAgentById('general') || agentService.getDefaultAgent(); // Choose an appropriate default
    if (defaultPrivateAgent) {
      agentStore.setActiveAgent(defaultPrivateAgent.id);
    } else {
      console.error("[PrivateHome] Critical: No default private agent found to activate.");
      // Display an error message in the main content area
      chatStore.updateMainContent({
        agentId: 'system-error' as AgentId,
        type: 'markdown',
        data: "### System Error\nNo default agent could be loaded. Please contact support.",
        title: "Initialization Error",
        timestamp: Date.now()
      });
    }
  } else {
      // Ensure content for the already active agent is loaded/displayed
      chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
  }
});

// Watch for changes in the active agent from the store (e.g., selected via AppHeader)
watch(() => agentStore.activeAgentId, (newAgentId, oldAgentId) => {
    if (newAgentId && newAgentId !== oldAgentId) {
        console.log(`[PrivateHome] Active agent changed to: ${newAgentId}. Old: ${oldAgentId}`);
        // The agentStore's setActiveAgent should handle clearing old context and
        // chatStore.ensureMainContentForAgent for the new agent.
        // Reset local processing state if agent changes.
        isVoiceInputCurrentlyProcessing.value = false;
        if(chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false);
    }
});

</script>

<template>
  <div class="private-home-view-ephemeral">
    <UnifiedChatLayout
      :is-voice-input-processing="isVoiceInputCurrentlyProcessing"
      @transcription="handleTranscriptionFromLayout"
      @voice-input-processing="(status: boolean) => isVoiceInputCurrentlyProcessing = status"
    >
      <template #main-content>
        <MainContentView :agent="activeAgent" v-if="activeAgent" class="agent-ui-slot-wrapper">
          <transition name="agent-ui-fade" mode="out-in">
            <component
              :is="currentAgentUiComponent"
              v-if="currentAgentUiComponent && typeof currentAgentUiComponent !== 'string'"
              :key="activeAgent.id + '-dynamic-ui'"
              ref="agentViewRef"
              :agent-id="activeAgent.id"
              :agent-config="activeAgent"
              @agent-event="handleAgentViewEventFromSlot"
              @set-processing-state="(status: boolean) => isVoiceInputCurrentlyProcessing = status"
              />
            <div v-else-if="mainContentForLayout && mainContentForLayout.type !== 'custom-component'"
                 class="h-full flex-grow overflow-y-auto custom-scrollbar-thin">
                <CompactMessageRenderer
                  v-if="activeAgent?.capabilities?.usesCompactRenderer && mainContentForLayout.type === 'compact-message-renderer-data'"
                  :content="mainContentForLayout.data"
                  :mode="activeAgent.id"
                  class="p-1 h-full"
                />
                <div v-else-if="mainContentForLayout.type === 'markdown' || mainContentForLayout.type === 'welcome'"
                     class="prose-ephemeral max-w-none p-4 md:p-6 h-full"
                     v-html="chatStore.isMainContentStreaming && chatStore.currentMainContentData?.agentId === activeAgent.id ?
                               chatStore.streamingMainContentText + '<span class=\'streaming-cursor-ephemeral\'>|</span>' :
                               mainContentForLayout.data"
                     aria-atomic="true">
                </div>
                 <div v-else-if="mainContentForLayout.type === 'error'"
                     class="prose-ephemeral prose-error max-w-none p-4 md:p-6 h-full"
                     v-html="mainContentForLayout.data"
                     aria-atomic="true">
                </div>
                <div v-else class="p-4 text-[var(--color-text-muted)] italic h-full">
                    <p>Agent: {{ activeAgent.label }}</p>
                    <p>Displaying content of type: <strong>{{ mainContentForLayout.type }}</strong>.</p>
                    <pre v-if="typeof mainContentForLayout.data === 'object'" class="text-xs whitespace-pre-wrap">{{ JSON.stringify(mainContentForLayout.data, null, 2) }}</pre>
                    <div v-else v-html="mainContentForLayout.data"></div>
                </div>
            </div>
            <div v-else-if="mainContentForLayout?.type === 'custom-component' && mainContentForLayout.data === 'PrivateDashboardPlaceholder'"
                 class="private-dashboard-placeholder">
              <ShieldCheckIcon class="dashboard-icon-ephemeral" />
              <h2 class="dashboard-title-ephemeral">Secure AI Workspace</h2>
              <p class="dashboard-subtitle-ephemeral">
                Welcome to your personalized AI environment. Select an assistant from the header to begin.
              </p>
            </div>
          </transition>
        </MainContentView>

        <div v-else class="private-dashboard-placeholder">
            <SparklesIconOutline class="dashboard-icon-ephemeral !text-[var(--color-text-muted)]" />
            <h2 class="dashboard-title-ephemeral">Initializing Agents...</h2>
            <p class="dashboard-subtitle-ephemeral">Please wait or select an agent if the menu is available.</p>
        </div>
      </template>
    </UnifiedChatLayout>
  </div>
</template>

<style lang="scss">
// Styles for PrivateHome are in frontend/src/styles/views/_private-home.scss
// and shared component styles.

// Agent UI fade transition (can be globalized in _transitions.scss if used elsewhere)
.agent-ui-fade-enter-active,
.agent-ui-fade-leave-active {
  transition: opacity 0.3s var(--ease-out-quad);
}
.agent-ui-fade-enter-from,
.agent-ui-fade-leave-to {
  opacity: 0;
}

// Ensure the slotted component in MainContentView fills the space
// This should ideally be handled by MainContentView's own styling or the slotted component itself.
// :deep() is used if MainContentView wraps the slot in another div.
.agent-ui-slot-wrapper {
  > :deep(*) { // Targets the root element of the component passed into the slot
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden; // Important: Slotted component should manage its own scrolling
  }
  // If the slotted item is just a div for prose, it needs to scroll
  > :deep(.prose-ephemeral) {
    overflow-y: auto;
    flex-grow: 1; // Make sure it takes space
  }
}

// Styles for prose when used for error messages within the private home
.prose-ephemeral.prose-error {
    h3, h4 { color: hsl(var(--color-error-h), var(--color-error-s), var(--color-error-l)) !important;}
    p, li { color: hsl(var(--color-error-h), var(--color-error-s), calc(var(--color-error-l) + 10%)) !important;}
}
</style>