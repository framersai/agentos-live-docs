<template>
  <div
    class="home-view themeable-view"
    :class="[uiStore.currentTheme, { 'context-panel-open': isContextPanelGloballyVisible }]"
    :data-voice-target-region="'home-view-main'"
    aria-labelledby="home-view-title"
  >
    <h1 id="home-view-title" class="sr-only">{{ t('home.viewTitle') }}</h1>

    <div class="chat-layout-grid">
      <main
        class="main-chat-area fancy-scrollbar"
        ref="mainChatAreaRef"
        :style="mainContentZoomStyle"
        :data-voice-target-region="'chat-history-region'"
        :data-zoomable-content="true" aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions text"
        @wheel.ctrl.prevent="handleWheelZoom"
      >
        <div class="messages-display-container" ref="messagesContainerRef">
          <AppMessage
            v-if="chatStore.chatError"
            type="error"
            :title="t('chat.errorMessageTitle')"
            :message="chatStore.chatError.message"
            show-close
            @close="chatStore.chatError = null"
            class="chat-error-banner"
            :data-voice-target="voiceTargetIdPrefix + 'chat-error-display'"
          />

          <TransitionGroup name="message-list-transition" tag="div" class="messages-list">
            <ChatMessageItem
              v-for="(message, index) in chatStore.displayMessages"
              :key="message.id"
              :message="message"
              :is-last="index === chatStore.displayMessages.length - 1"
              :voice-target-id-prefix="`msg-${message.id}-`"
              @action-from-message="handleMessageAction"
            />
          </TransitionGroup>

          <div v-if="chatStore.isLoading && chatStore.messages.length === 0" class="initial-loading-placeholder">
             <LoadingSpinner :message="t('chat.loadingInitialMessages')" size="lg" :data-voice-target="voiceTargetIdPrefix + 'initial-loading'"/>
          </div>

          <HomeExamplePrompts
            v-if="!chatStore.isLoading && chatStore.messages.length === 0 && !chatStore.chatError"
            :mode="chatSettingsStore.currentMode"
            :voice-target-id-prefix="voiceTargetIdPrefix + 'example-prompts-'"
            @example-clicked="handleExamplePromptClick"
          />
        </div>
         <DynamicLayoutSlot :slot-id="mainChatDynamicSlotId" class="my-4 px-4 sm:px-0" />
      </main>

      <footer class="chat-input-area-container" :data-voice-target-region="'chat-input-region'">
        <div class="chat-input-area-content">
           <ChatSmartSuggestions
            v-if="chatStore.inputSuggestions.length > 0 && chatSettingsStore.showSmartSuggestions"
            :suggestions="chatStore.inputSuggestions"
            :title="t('chat.smartSuggestions.defaultTitle')"
            :voice-target-id-prefix="voiceTargetIdPrefix + 'smart-suggestions-'"
            @suggestion-clicked="handleSmartSuggestionClick"
          />
          <VoiceInput
            :is-processing="chatStore.isLoading"
            :audio-mode-prop="chatSettingsStore.currentAudioMode"
            :transcription-method-prop="chatSettingsStore.currentTranscriptionMethod"
            :voice-target-id-prefix="voiceTargetIdPrefix + 'main-voice-input-'"
            @transcription="handleSendTranscription"
            @update:audio-mode="newMode => chatSettingsStore.setAudioMode(newMode)"
            @update:transcription-method="newMethod => chatSettingsStore.setTranscriptionMethod(newMethod)"
            @voice-command-trigger="handleDirectVoiceCommandTrigger"
          />
          <div class="input-area-footer">
            <span class="token-cost-display" :data-voice-target="voiceTargetIdPrefix + 'token-cost-info'">
                {{ t('chat.sessionCostLabel') }}: {{ formattedTotalCost }}
                <span v-if="chatStore.lastResponseCost > 0">| {{ t('chat.lastResponseCostLabel') }}: {{ formattedLastResponseCost }}</span>
            </span>
            <div class="footer-actions">
                <AppButton
                    variant="tertiary" size="xs" :pill="true"
                    :icon="ArrowPathIcon"
                    :title="t('chat.actions.regenerateLast')"
                    :aria-label="t('chat.actions.regenerateLast')"
                    @click="handleRegenerateLast"
                    :disabled="!canRegenerate"
                    :data-voice-target="voiceTargetIdPrefix + 'regenerate-button'"
                />
                <AppButton
                    variant="tertiary" size="xs" :pill="true"
                    :icon="InformationCircleIcon"
                    :title="t('chat.toggleContextPanel')"
                    :aria-label="t('chat.toggleContextPanel')"
                    @click="toggleContextPanel"
                    :data-voice-target="voiceTargetIdPrefix + 'toggle-context-panel-button'"
                    :class="{ 'active-panel-toggle': isContextPanelGloballyVisible }"
                />
            </div>
          </div>
        </div>
      </footer>

      <ChatContextPanel
        :is-visible="isContextPanelGloballyVisible"
        :context-data="chatStore.contextPanelData"
        :title="contextPanelTitle"
        :voice-target-id-prefix="voiceTargetIdPrefix + 'context-panel-'"
        @close="closeContextPanel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file HomeView.vue
 * @description The main chat interface of the Voice Chat Assistant. Orchestrates messages,
 * input, dynamic content, and integrates with Pinia stores for a SOTA experience.
 */
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from '../../../composables/useI18n';
import { useUiStore } from '../../../store/ui.store';
import { useAuthStore } from '../auth/store/auth.store'; // Corrected path
import { useChatStore, ChatMessage, ChatContextData, ChatSuggestion } from './store/chat.store';
import { useChatSettingsStore, AssistantMode, AudioInputMode, TranscriptionMethod } from './store/chatSettings.store';
import { useVoiceStore } from '../../../features/voice/store/voice.store';
import { useAgentStore } from '../../../features/agents/store/agent.store'; // For persona context
import { useDynamicUIAgent } from '../../../services/dynamicUIAgent.service';

import ChatMessageItem from '../components/ChatMessageItem.vue';
import HomeExamplePrompts, { ExamplePrompt } from '../components/HomeExamplePrompts.vue';
import ChatSmartSuggestions from '../components/ChatSmartSuggestions.vue';
import VoiceInput from '../../../components/voice/VoiceInput.vue'; // SOTA VoiceInput
import ChatContextPanel from '../components/ChatContextPanel.vue';
import LoadingSpinner from '../../../components/common/LoadingSpinner.vue';
import AppButton from '../../../components/common/AppButton.vue';
import AppMessage from '../../../components/common/AppMessage.vue';
import DynamicLayoutSlot from '../../../components/dynamic/DynamicLayoutSlot.vue';
import { InformationCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'; // For regenerate

const { t, formatCurrency } = useI18n();
const uiStore = useUiStore();
const authStore = useAuthStore();
const chatStore = useChatStore();
const chatSettingsStore = useChatSettingsStore();
const voiceStore = useVoiceStore();
const agentStore = useAgentStore(); // For persona info
const dynamicUIAgent = useDynamicUIAgent(); // For voice-driven UI manipulation like zoom

const voiceTargetIdPrefix = 'home-view-';
const mainChatDynamicSlotId = 'main-chat-dynamic-content-area'; // For AI-injected UI

// --- Refs for DOM Elements ---
const messagesContainerRef = ref<HTMLElement | null>(null);
const mainChatAreaRef = ref<HTMLElement | null>(null); // For zoom target

// --- Local State (Minimal - mostly for UI effects controlled by this view) ---
const mainContentZoomLevel = ref(1); // 1 = 100%

// --- Computed Properties ---
const formattedTotalCost = computed(() => formatCurrency(chatStore.currentSessionCost, 'USD'));
const formattedLastResponseCost = computed(() => formatCurrency(chatStore.lastResponseCost, 'USD'));

const isContextPanelGloballyVisible = computed(() => uiStore.isContextPanelOpenGlobal);

const contextPanelTitle = computed(() => {
  const contextType = chatStore.contextPanelData?.type;
  return contextType ? t('chat.contextPanel.titleFor', { contextType }) : t('chat.contextPanel.defaultTitle');
});

const canRegenerate = computed(() => chatStore.canRegenerateLastResponse);

const mainContentZoomStyle = computed(() => ({
  transform: `scale(${mainContentZoomLevel.value})`,
  transformOrigin: 'center top', // Zoom from top-center for chat-like feel
  transition: 'transform 0.2s ease-out',
}));

// --- Methods ---
const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  nextTick(() => {
    if (messagesContainerRef.value) {
      messagesContainerRef.value.scrollTo({ top: messagesContainerRef.value.scrollHeight, behavior });
    }
  });
};

const handleSendTranscription = async (transcription: string) => {
  if (!transcription.trim()) return;
  await chatStore.sendMessage({
    content: transcription,
    settings: {
      mode: chatSettingsStore.currentMode,
      language: chatSettingsStore.currentLanguage,
      personaId: agentStore.activePersonaId, // Include active persona
      generateDiagrams: chatSettingsStore.shouldGenerateDiagrams,
    }
  });
};

const handleExamplePromptClick = async (example: ExamplePrompt) => {
  if (example.modes && example.modes.length > 0 && !example.modes.includes(chatSettingsStore.currentMode)) {
    chatSettingsStore.setMode(example.modes[0]);
    uiStore.addNotification({ type: 'info', message: t('chat.modeSwitchedTo', { mode: chatSettingsStore.currentModeDisplayName }), duration: 2500 });
  }
  await handleSendTranscription(example.text);
};

const handleSmartSuggestionClick = async (suggestion: ChatSuggestion) => {
  const textToSend = suggestion.action || suggestion.label;
  if (suggestion.value.startsWith('ACTION_')) {
      if (suggestion.value === 'ACTION_REGENERATE_LAST') await chatStore.regenerateLastAssistantResponse();
  } else {
    await handleSendTranscription(textToSend);
  }
  chatStore.clearSuggestions();
};

const handleClearChat = () => {
  uiStore.openModal({
    component: () => import('../../../components/common/AppConfirmationModal.vue'),
    props: {
      title: t('chat.confirmClearChatTitle'),
      message: t('chat.confirmClearChatMessage'),
      confirmButtonText: t('common.clear'),
      confirmButtonVariant: 'danger',
    },
    onConfirm: async () => {
      await chatStore.clearChatSession();
    }
  });
};

const handleMessageAction = (action: string, message: ChatMessage) => {
  dynamicUIAgent.processIntent({
      intent: 'CUSTOM_MESSAGE_ACTION', // Define appropriate intent type
      payload: { action, messageId: message.id, messageContent: message.content }
  });
};

const toggleContextPanel = () => {
  uiStore.setContextPanelVisibility(!isContextPanelGloballyVisible.value);
};
const closeContextPanel = () => {
  uiStore.setContextPanelVisibility(false);
};

const handleRegenerateLast = async () => {
    if (canRegenerate.value) {
        await chatStore.regenerateLastAssistantResponse();
    }
};

// --- Zoom Control Methods ---
const zoomMainContent = (direction: 'in' | 'out' | 'reset', amount: number = 0.1) => {
  let newScale = mainContentZoomLevel.value;
  if (direction === 'in') newScale = Math.min(2.0, mainContentZoomLevel.value + amount);
  else if (direction === 'out') newScale = Math.max(0.5, mainContentZoomLevel.value - amount);
  else if (direction === 'reset') newScale = 1.0;

  if (newScale !== mainContentZoomLevel.value) {
    mainContentZoomLevel.value = newScale;
    uiStore.addNotification({ type: 'info', message: `${t('chat.zoomLevelLabel')}: ${(newScale * 100).toFixed(0)}%`, duration: 1500 });
  }
};

const handleWheelZoom = (event: WheelEvent) => {
    if (event.ctrlKey) { // Only zoom if Ctrl key is pressed (common browser zoom behavior)
        event.preventDefault();
        if (event.deltaY < 0) { // Wheel up
            zoomMainContent('in', 0.05);
        } else { // Wheel down
            zoomMainContent('out', 0.05);
        }
    }
};

/**
 * This method is a placeholder for how the voice system, after parsing an intent,
 * would call specific actions on this view.
 * @param {string} command - The command name (e.g., 'zoomIn', 'scrollToMessage').
 * @param {any} payload - Data for the command.
 */
const handleDirectVoiceCommandTrigger = (command: string, payload?: any) => {
    console.log(`[HomeView] Received direct voice command: ${command}`, payload);
    switch(command) {
        case 'zoomIn': zoomMainContent('in', payload?.amount); break;
        case 'zoomOut': zoomMainContent('out', payload?.amount); break;
        case 'resetZoom': zoomMainContent('reset'); break;
        case 'scrollToTop': messagesContainerRef.value?.scrollTo({top: 0, behavior: 'smooth'}); break;
        case 'scrollToBottom': scrollToBottom('smooth'); break;
        // Add more direct commands as needed
        default:
            uiStore.addNotification({type: 'warning', message: `Voice command "${command}" not yet implemented for this view.`});
    }
};


// --- Dynamic UI Agent Integration Setup ---
const registerHomeViewAgentCommands = () => {
  dynamicUIAgent.registerCommand({ id: 'homeView.zoomIn', action: () => zoomMainContent('in'), naturalLanguageTriggers: ['zoom in main chat', 'enlarge conversation'], category: 'view_control' });
  dynamicUIAgent.registerCommand({ id: 'homeView.zoomOut', action: () => zoomMainContent('out'), naturalLanguageTriggers: ['zoom out main chat', 'shrink conversation'], category: 'view_control' });
  dynamicUIAgent.registerCommand({ id: 'homeView.resetZoom', action: () => zoomMainContent('reset'), naturalLanguageTriggers: ['reset chat zoom', 'normal view'], category: 'view_control' });
  dynamicUIAgent.registerCommand({ id: 'homeView.toggleContextPanel', action: toggleContextPanel, naturalLanguageTriggers: ['toggle context panel', 'show details', 'hide details'], category: 'view_control' });
  dynamicUIAgent.registerCommand({ id: 'homeView.clearChat', action: handleClearChat, naturalLanguageTriggers: ['clear chat', 'new conversation', 'reset discussion'], category: 'chat_control' });
  // More commands can be registered, e.g., for scrolling to specific messages by voice.
};
const unregisterHomeViewAgentCommands = () => {
  ['homeView.zoomIn', 'homeView.zoomOut', 'homeView.resetZoom', 'homeView.toggleContextPanel', 'homeView.clearChat'].forEach(id => dynamicUIAgent.unregisterCommand(id));
};


// --- Watchers ---
watch(() => chatStore.messages.length, () => scrollToBottom('smooth'), { flush: 'post' });
watch(() => uiStore.isFullscreen, (isFS) => { if (!isFS) mainContentZoomLevel.value = 1; }); // Reset zoom on exiting app fullscreen

// --- Lifecycle Hooks ---
onMounted(async () => {
  registerHomeViewAgentCommands();
  await agentStore.fetchAvailablePersonas(); // Load personas for potential selection
  if (chatStore.messages.length === 0 && !chatStore.isLoading) {
    // Send a welcome message or load initial examples
  }
  scrollToBottom('auto');
});

onUnmounted(() => {
  unregisterHomeViewAgentCommands();
});
</script>

<style lang="postcss" scoped>
.home-view {
  /* Styles from previous SOTA HomeView.vue */
  @apply h-full flex flex-col overflow-hidden;
  background-color: var(--app-chat-bg, var(--app-bg-color));
  color: var(--app-chat-text-color, var(--app-text-color));
}

.chat-layout-grid {
  @apply flex-grow grid overflow-hidden;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr;
  position: relative;
}

.home-view.context-panel-open {
  @media (min-width: 1024px) { /* lg */
    grid-template-columns: 1fr var(--app-context-panel-width, 24rem);
  }
}

.main-chat-area {
  @apply overflow-hidden flex flex-col relative;
  /* Transition for zoom is on the style binding */
}

.messages-display-container {
  @apply flex-grow overflow-y-auto p-4 sm:p-6;
}

.messages-list {
  @apply flex flex-col gap-4 sm:gap-6;
}

.chat-error-banner {
  @apply m-4 sticky top-2 z-10; /* Adjust z-index as needed */
}
.initial-loading-placeholder {
    @apply flex-grow flex items-center justify-center text-muted-color p-8;
    min-height: 200px;
}

/* Message list transitions (same as before) */
.message-list-transition-enter-active,
.message-list-transition-leave-active {
  transition: all 0.5s cubic-bezier(0.5, -0.05, 0.1, 1);
}
.message-list-transition-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
.message-list-transition-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.chat-input-area-container {
  @apply bg-gradient-to-t from-[var(--app-input-area-bg-start,var(--app-surface-alt-color))] to-[var(--app-input-area-bg-end,transparent)] p-3 sm:p-4 border-t border-[var(--app-input-area-border-color,var(--app-border-color))];
  flex-shrink: 0;
  z-index: var(--z-index-chat-input, 500);
}
.chat-input-area-content {
    @apply max-w-3xl mx-auto space-y-2;
}
.input-area-footer {
    @apply flex justify-between items-center text-xs mt-1;
    color: var(--app-text-muted-color);
}
.footer-actions {
    @apply flex items-center gap-1;
}
.footer-actions .app-button { /* Style for small tertiary buttons */
    padding: var(--space-1h); /* Tailwind p-1.5 */
    color: var(--app-icon-button-color, var(--app-text-muted-color));
}
.footer-actions .app-button:hover {
    color: var(--app-icon-button-hover-color, var(--app-text-secondary-color));
    background-color: var(--app-icon-button-hover-bg, var(--app-surface-hover-color));
}
.footer-actions .app-button.active-panel-toggle { /* Example active state for toggle */
    color: var(--app-primary-color);
    background-color: var(--app-primary-bg-subtle);
}

/* Holographic theme specific overrides */
.theme-holographic .home-view {
    background: var(--holographic-bg-main-gradient, linear-gradient(180deg, var(--holographic-bg-start) 0%, var(--holographic-bg-mid) 60%, var(--holographic-bg-end) 100%));
}
.theme-holographic .chat-input-area-container {
    background: var(--holographic-input-area-bg, linear-gradient(to top, rgba(var(--holographic-panel-rgb),0.6), transparent));
    border-top-color: var(--holographic-border-subtle);
}
.theme-holographic .input-area-footer {
    color: var(--holographic-text-muted);
}
.theme-holographic .footer-actions .app-button {
    color: var(--holographic-icon-button-color, var(--holographic-text-muted));
}
.theme-holographic .footer-actions .app-button:hover {
    color: var(--holographic-icon-button-hover-color, var(--holographic-text-primary));
    background-color: var(--holographic-icon-button-hover-bg, var(--holographic-surface-hover-translucent));
}
.theme-holographic .footer-actions .app-button.active-panel-toggle {
    color: var(--holographic-accent);
    background-color: var(--holographic-accent-bg-translucent);
}


/* Welcome Section previously had many specific styles.
   Now, HomeExamplePrompts and HomeFeatureHighlights would have their own scoped styles. */
.welcome-section {
  flex-grow: 1; /* Takes up available space when messages are empty */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem; /* Tailwind p-4 */
}
.welcome-content-container {
  width: 100%;
  max-width: var(--view-max-width-lg, 72rem); /* Tailwind max-w-6xl */
  margin: 0 auto;
  text-align: center;
}
.welcome-logo-title { margin-bottom: 3rem; /* Tailwind mb-12 */ }
.welcome-logo { width: 5rem; height: 5rem; margin: 0 auto 1rem; /* Tailwind w-20 h-20 mb-4 */ }
.welcome-main-title {
  font-size: var(--app-font-size-4xl); /* Tailwind text-4xl or 5xl */
  font-weight: var(--app-font-weight-bold);
  color: var(--app-heading-color);
  margin-bottom: 0.5rem;
}
.welcome-main-subtitle {
  font-size: var(--app-font-size-lg); /* Tailwind text-lg or xl */
  color: var(--app-text-secondary-color);
  max-width: var(--text-max-width-prose, 65ch); /* Tailwind max-w-prose */
  margin: 0 auto;
}


/* Ensure fancy-scrollbar is defined globally or imported if it's a common utility style */
.fancy-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.fancy-scrollbar::-webkit-scrollbar-track { background: var(--app-scrollbar-track-bg, transparent); }
.fancy-scrollbar::-webkit-scrollbar-thumb { background: var(--app-scrollbar-thumb-bg, var(--app-border-color)); border-radius: 3px;}
.fancy-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--app-scrollbar-thumb-hover-bg, var(--app-text-muted-color)); }
</style>