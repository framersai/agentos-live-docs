<template>
  <div
    class="home-view themeable-view"
    :class="[uiStore.currentTheme, { 'context-panel-open': isContextPanelGloballyVisible }]"
    :data-voice-target-region="'home-view-main-content'"
    aria-labelledby="home-view-main-title"
    @wheel.ctrl.prevent="handleWheelZoom"
  >
    <h1 id="home-view-main-title" class="sr-only">{{ t('pageTitles.home') }}</h1>
    <div class="chat-layout-grid">
      <main
        class="main-chat-content-area fancy-scrollbar"
        ref="mainChatAreaRef"
        :style="mainContentZoomStyle"
        :data-voice-target-region="'chat-history-scroll-region'"
        :data-zoomable-content="true"
        tabindex="-1" aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions text"
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
            :voice-target="voiceTargetIdPrefix + 'chat-error-display'"
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
             <LoadingSpinner :message="t('chat.loadingInitialMessages')" size="lg" :voice-target="voiceTargetIdPrefix + 'initial-loading'"/>
          </div>

          <div v-if="!chatStore.isLoading && chatStore.messages.length === 0 && !chatStore.chatError" class="welcome-screen-container">
            <HomeExamplePrompts
              :mode="chatSettingsStore.currentMode"
              :voice-target-id-prefix="voiceTargetIdPrefix + 'example-prompts-'"
              @example-clicked="handleExamplePromptClick"
            />
            <HomeFeatureHighlights
              v-if="showFeatureHighlights"
              :voice-target-id-prefix="voiceTargetIdPrefix + 'feature-highlights-'"
              class="mt-8 pt-8 border-t welcome-divider"
            />
          </div>
        </div>
         <DynamicLayoutSlot :slot-id="mainChatDynamicSlotId" class="dynamic-content-slot" />
      </main>

      <footer class="chat-input-area-container" :data-voice-target-region="'chat-input-region'">
        <div class="chat-input-area-content">
           <ChatSmartSuggestions
            v-if="smartSuggestions.length > 0 && chatSettingsStore.showSmartSuggestions"
            :suggestions="smartSuggestions"
            :title="t('chat.smartSuggestions.defaultTitle')"
            :voice-target-id-prefix="voiceTargetIdPrefix + 'smart-suggestions-'"
            @suggestion-clicked="handleSmartSuggestionClick"
          />
          <VoiceInput
            :is-processing="chatStore.isLoading"
            :voice-target-id-prefix="voiceTargetIdPrefix + 'main-voice-input-'"
            :show-text-input="true"
            :text-input-placeholder="t('voiceInput.homeViewPlaceholder')"
            :show-advanced-controls="true" /* Let user easily change modes from chat */
            @transcription="handleSendTranscription"
            @text-submitted="handleSendTranscription" /* Text input also uses same handler */
            @voice-command-trigger="handleDirectVoiceCommandTrigger"
          />
          <div class="input-area-footer">
             <div class="active-persona-display" v-if="agentStore.activePersona" :data-voice-target="voiceTargetIdPrefix + 'active-persona'">
                <component :is="personaDisplayIcon" class="persona-icon" aria-hidden="true"/>
                <span>{{ agentStore.activePersona.displayName }}</span>
             </div>
             <div v-else class="active-persona-display">
                <UserCircleIcon class="persona-icon" />
                <span>{{ t('chat.generalAssistant') }}</span>
             </div>

            <span class="token-cost-display" :data-voice-target="voiceTargetIdPrefix + 'token-cost-info'" :title="t('chat.costTooltip', { total: formattedTotalCost, last: formattedLastResponseCost })">
                <span class="hidden sm:inline">{{ t('chat.sessionCostLabelShort') }}:</span>
                <span class="sm:hidden">💰</span>
                {{ formattedTotalCost }}
            </span>
            <div class="footer-actions">
                <AppButton
                    variant="tertiary" size="xs" :pill="true"
                    :icon="ArrowPathIcon"
                    :title="t('chat.actions.regenerateLast')"
                    :aria-label="t('chat.actions.regenerateLast')"
                    @click="handleRegenerateLast"
                    :disabled="!canRegenerate || chatStore.isLoading"
                    :data-voice-target="voiceTargetIdPrefix + 'regenerate-button'"
                />
                <AppButton
                    variant="tertiary" size="xs" :pill="true"
                    :icon="Squares2X2Icon"
                    :title="t('chat.toggleContextPanel')"
                    :aria-label="t('chat.toggleContextPanel')"
                    :aria-expanded="isContextPanelGloballyVisible"
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
        :context-data="currentChatContext"
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
 * @description The SOTA main chat interface for Voice Chat Assistant.
 * Orchestrates all chat functionalities, integrates with Pinia stores,
 * supports AI-driven UI, dynamic theming, full voice navigation, and content zoom.
 */
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from '../../../composables/useI18n';
import { useUiStore, AppTheme } from '../../../store/ui.store';
import { useAuthStore } from '../auth/store/auth.store';
import { useChatStore, ChatMessage, ChatContextData, ChatSuggestion } from './store/chat.store';
import { useChatSettingsStore, AssistantMode } from './store/chatSettings.store';
import { useVoiceStore } from '../../../store/voice.store';
import { useAgentStore } from '../../../features/agents/store/agent.store';
import { useDynamicUIAgent } from '../../../services/dynamicUIAgent.service';
import { voiceCommandService } from '../../../services/voiceCommandService';

import ChatMessageItem from '../components/ChatMessageItem.vue';
import HomeExamplePrompts, { ExamplePrompt } from '../components/HomeExamplePrompts.vue';
import HomeFeatureHighlights from '../components/HomeFeatureHighlights.vue';
import ChatSmartSuggestions from '../components/ChatSmartSuggestions.vue';
import VoiceInput from '../../../components/voice/VoiceInput.vue';
import ChatContextPanel from '../components/ChatContextPanel.vue';
import LoadingSpinner from '../../../components/common/LoadingSpinner.vue';
import AppButton from '../../../components/common/AppButton.vue';
import AppMessage from '../../../components/common/AppMessage.vue';
import DynamicLayoutSlot from '../../../components/dynamic/DynamicLayoutSlot.vue';
import {
  Squares2X2Icon, ArrowPathIcon, UserCircleIcon, SparklesIcon as PersonaDefaultIcon
} from '@heroicons/vue/24/outline'; // Using outline for UI consistency

const { t, formatCurrency } = useI18n();
const uiStore = useUiStore();
const authStore = useAuthStore(); // Used for user ID in API calls
const chatStore = useChatStore();
const chatSettingsStore = useChatSettingsStore();
const voiceStore = useVoiceStore();
const agentStore = useAgentStore();
const dynamicUIAgent = useDynamicUIAgent();

const voiceTargetIdPrefix = 'home-view-';
const mainChatDynamicSlotId = 'main-chat-dynamic-content-area';

const messagesContainerRef = ref<HTMLElement | null>(null);
const mainChatAreaRef = ref<HTMLElement | null>(null);
const showFeatureHighlights = ref(true);
const mainContentZoomLevel = ref(uiStore.mainContentZoom);

const formattedTotalCost = computed(() => formatCurrency(chatStore.currentSessionCost, 'USD', { maximumFractionDigits: 4 }));
const formattedLastResponseCost = computed(() => formatCurrency(chatStore.lastResponseCost, 'USD', { maximumFractionDigits: 4 }));
const isContextPanelGloballyVisible = computed(() => uiStore.isContextPanelOpenGlobal);
const canRegenerate = computed(() => chatStore.canRegenerateLastResponse);

const personaDisplayIcon = computed(() => {
    // In future, agentStore.activePersona.iconComponent (dynamically imported)
    // For now, a default or mapped icon based on ID/name
    if (agentStore.activePersona?.iconUrl) return 'img'; // Special case for img tags if needed
    return agentStore.activePersona ? PersonaDefaultIcon : UserCircleIcon;
});


const currentChatContext = computed<ChatContextData | null>(() => {
  return chatStore.contextPanelData; // Assuming chatStore now populates this
});

const contextPanelTitle = computed(() => {
    const contextType = currentChatContext.value?.type;
    return contextType ? t('chat.contextPanel.titleFor', { contextType }) : t('chat.contextPanel.defaultTitle');
});

const smartSuggestions = computed<ChatSuggestion[]>(() => chatStore.inputSuggestions);

const mainContentZoomStyle = computed(() => ({
  transform: `scale(${mainContentZoomLevel.value})`,
  transformOrigin: 'center top',
  transition: 'transform 0.2s var(--app-ease-out)',
}));

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
      personaId: agentStore.activePersonaId,
      generateDiagrams: chatSettingsStore.shouldGenerateDiagrams,
      userId: authStore.currentUser?.id || 'guest-user', // Pass user ID
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
  if (suggestion.value?.startsWith('ACTION_')) {
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
      voiceTargetIdPrefix: voiceTargetIdPrefix + 'clear-chat-confirm-modal-',
    },
    onConfirm: async () => {
      await chatStore.clearChatSession();
      // Notification is now handled within chatStore.clearChatSession
    }
  });
};

const handleMessageAction = (action: string, message: ChatMessage) => {
  console.log(`[HomeView] Action "${action}" from message ID "${message.id}"`);
  // Example: if (action === 'copy-code') { navigator.clipboard.writeText(relevantCode); }
  // This could also trigger a GMI interaction:
  // chatStore.sendMessage({ content: `User action: ${action} on message: ${message.content.substring(0,100)}...`})
  dynamicUIAgent.processIntent({ intent: 'CUSTOM_MESSAGE_ACTION', payload: { action, messageId: message.id } });
};

const toggleContextPanel = () => uiStore.setContextPanelVisibility(!isContextPanelGloballyVisible.value);
const closeContextPanel = () => uiStore.setContextPanelVisibility(false);
const handleRegenerateLast = async () => { if (canRegenerate.value) await chatStore.regenerateLastAssistantResponse(); };

const zoomMainContent = (direction: 'in' | 'out' | 'reset', amount: number = 0.1) => {
  let newScale = mainContentZoomLevel.value;
  if (direction === 'in') newScale = Math.min(2.0, mainContentZoomLevel.value + amount);
  else if (direction === 'out') newScale = Math.max(0.5, mainContentZoomLevel.value - amount);
  else if (direction === 'reset') newScale = 1.0;

  if (newScale !== mainContentZoomLevel.value) {
    mainContentZoomLevel.value = newScale;
    uiStore.setMainContentZoom(newScale); // Update store
    uiStore.addNotification({ type: 'info', message: `${t('chat.zoomLevelLabel')}: ${(newScale * 100).toFixed(0)}%`, duration: 1500 });
  }
};

const handleWheelZoom = (event: WheelEvent) => {
  if (event.ctrlKey) {
    event.preventDefault();
    zoomMainContent(event.deltaY < 0 ? 'in' : 'out', 0.05);
  }
};

const handleDirectVoiceCommandTrigger = (command: string, payload?: any) => {
  dynamicUIAgent.processIntent({ intent: command as any, payload });
};

const registerAgentCommands = () => {
  dynamicUIAgent.registerCommand({ id: 'homeView.zoomIn', action: () => zoomMainContent('in'), naturalLanguageTriggers: ['zoom in main chat', 'enlarge conversation', 'look closer'], category: 'view_control' });
  dynamicUIAgent.registerCommand({ id: 'homeView.zoomOut', action: () => zoomMainContent('out'), naturalLanguageTriggers: ['zoom out main chat', 'shrink conversation', 'see more'], category: 'view_control' });
  dynamicUIAgent.registerCommand({ id: 'homeView.resetZoom', action: () => zoomMainContent('reset'), naturalLanguageTriggers: ['reset chat zoom', 'normal view size'], category: 'view_control' });
  dynamicUIAgent.registerCommand({ id: 'homeView.toggleContextPanel', action: toggleContextPanel, naturalLanguageTriggers: ['toggle context panel', 'show details panel', 'hide details panel'], category: 'view_control' });
  dynamicUIAgent.registerCommand({ id: 'homeView.clearChat', action: handleClearChat, naturalLanguageTriggers: ['clear chat history', 'new conversation', 'reset this discussion'], category: 'chat_control' });
  dynamicUIAgent.registerCommand({ id: 'homeView.regenerateResponse', action: handleRegenerateLast, naturalLanguageTriggers: ['regenerate last response', 'try again', 'give me another answer'], category: 'chat_control',  isAvailable: () => canRegenerate.value && !chatStore.isLoading });
};
const unregisterAgentCommands = () => {
  ['homeView.zoomIn', 'homeView.zoomOut', 'homeView.resetZoom', 'homeView.toggleContextPanel', 'homeView.clearChat', 'homeView.regenerateResponse'].forEach(id => dynamicUIAgent.unregisterCommand(id));
};

watch(() => chatStore.messages, () => scrollToBottom('smooth'), { deep: true, flush: 'post' });
watch(() => uiStore.isContextPanelOpenGlobal, (isOpen) => { if (isContextPanelVisible.value !== isOpen) isContextPanelVisible.value = isOpen; });
watch(() => uiStore.mainContentZoom, (newZoom) => { if (mainContentZoomLevel.value !== newZoom) mainContentZoomLevel.value = newZoom; });


onMounted(async () => {
  registerAgentCommands();
  await uiStore.initializeTheme();
  await authStore.initializeAuth();
  await voiceStore.initializeVoicePreference();
  await agentStore.fetchAvailablePersonas(true); // Fetch personas for this view
  await voiceCommandService.initialize(); // Ensures voice service is ready

  // Load initial chat session or welcome messages if applicable
  if (chatStore.messages.length === 0 && !chatStore.isLoading) {
    // chatStore.sendSystemMessage(t('chat.welcomeMessage')); // Example system welcome
  }
  scrollToBottom('auto');
  // Initialize zoom from store
  mainContentZoomLevel.value = uiStore.mainContentZoom;

  // Handle browser fullscreen changes
  const fsChangeHandler = () => uiStore.setFullscreen(!!document.fullscreenElement);
  document.addEventListener('fullscreenchange', fsChangeHandler);
  onUnmounted(() => document.removeEventListener('fullscreenchange', fsChangeHandler));
});

onUnmounted(() => {
  unregisterAgentCommands();
});
</script>

<style lang="postcss" scoped>
/* Styles from SOTA HomeView.vue (previous response), ensuring variables and Tailwind are used */
.home-view {
  @apply h-screen flex flex-col overflow-hidden; /* Use h-screen for full viewport height */
  background-color: var(--app-chat-bg, var(--app-bg-color));
  color: var(--app-chat-text-color, var(--app-text-color));
}

.chat-layout-grid {
  @apply flex-grow grid overflow-hidden;
  grid-template-rows: 1fr auto; /* Messages fill space, input is fixed height */
  grid-template-columns: 1fr; /* Single column layout */
  position: relative;
}
.home-view.context-panel-open {
  @media (min-width: 1024px) { /* lg breakpoint for sidebar */
    grid-template-columns: 1fr var(--app-context-panel-width, 24rem); /* Chat area | Context Panel */
  }
}

.main-chat-content-area {
  @apply overflow-hidden flex flex-col relative; /* For zoom transform-origin */
}
.messages-display-container {
  @apply flex-grow overflow-y-auto p-4 sm:p-6;
}
.messages-list { @apply flex flex-col gap-4 sm:gap-6; }
.chat-error-banner { @apply mx-0 mb-4 sticky top-0 z-10; }
.initial-loading-placeholder {
    @apply flex-grow flex items-center justify-center text-muted-color p-8;
    min-height: 200px;
}
.welcome-screen-container { /* Wrapper for welcome elements */
    @apply flex-1 flex flex-col items-center justify-center p-4;
}
.welcome-divider { border-top-color: var(--app-divider-color); }

.message-list-transition-enter-active,
.message-list-transition-leave-active { transition: all 0.5s var(--app-ease-spring); }
.message-list-transition-enter-from { opacity: 0; transform: translateY(30px) scale(0.95); }
.message-list-transition-leave-to { opacity: 0; transform: translateX(-30px) scale(0.95); }

.dynamic-content-slot { /* Styles for the AI-injected UI slot */
    /* Example: border-t border-dashed border-app-border-color-light my-4 py-4 */
}

.chat-input-area-container {
  @apply bg-gradient-to-t from-[var(--app-input-area-bg-start,var(--app-surface-color))] to-[var(--app-input-area-bg-end,transparent)] p-3 sm:p-4 border-t border-[var(--app-input-area-border-color,var(--app-border-color))];
  flex-shrink: 0;
  z-index: var(--z-index-chat-input, 500);
}
.chat-input-area-content { @apply max-w-3xl mx-auto space-y-2; }
.input-area-footer {
    @apply flex justify-between items-center text-xs mt-1;
    color: var(--app-text-muted-color);
}
.token-cost-display {
    @apply px-2 py-1 rounded-md;
    background-color: var(--app-surface-inset-color);
    border: 1px solid var(--app-border-color-extralight);
}
.active-persona-display {
    @apply flex items-center gap-2 px-2 py-1 text-xs rounded-md;
    background-color: var(--app-surface-inset-color);
    border: 1px solid var(--app-border-color-extralight);
    color: var(--app-text-secondary-color);
}
.persona-icon { @apply w-4 h-4; }

.footer-actions { @apply flex items-center gap-1; }
.footer-actions .app-button {
    padding: var(--space-1h);
    color: var(--app-icon-button-color, var(--app-text-muted-color));
}
.footer-actions .app-button:hover {
    color: var(--app-icon-button-hover-color, var(--app-text-secondary-color));
    background-color: var(--app-icon-button-hover-bg, var(--app-surface-hover-color));
}
.footer-actions .app-button.active-panel-toggle {
    color: var(--app-primary-color);
    background-color: var(--app-primary-bg-subtle);
}

/* Holographic Theme Adjustments */
.theme-holographic .home-view { background: var(--holographic-bg-main-gradient); }
.theme-holographic .chat-input-area-container {
    background: var(--holographic-input-area-bg);
    border-top-color: var(--holographic-border-subtle);
}
.theme-holographic .input-area-footer { color: var(--holographic-text-muted); }
.theme-holographic .token-cost-display,
.theme-holographic .active-persona-display {
    background-color: var(--holographic-surface-inset-translucent);
    border-color: var(--holographic-border-very-subtle);
    color: var(--holographic-text-secondary);
}
.theme-holographic .persona-icon { color: var(--holographic-accent); }
.theme-holographic .footer-actions .app-button { color: var(--holographic-icon-button-color); }
.theme-holographic .footer-actions .app-button:hover {
    color: var(--holographic-icon-button-hover-color);
    background-color: var(--holographic-icon-button-hover-bg);
}
.theme-holographic .footer-actions .app-button.active-panel-toggle {
    color: var(--holographic-accent);
    background-color: var(--holographic-accent-bg-translucent);
}
.theme-holographic .welcome-divider { border-top-color: var(--holographic-border-very-subtle); }

/* Ensure fancy-scrollbar is defined globally or imported */
.fancy-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.fancy-scrollbar::-webkit-scrollbar-track { background: var(--app-scrollbar-track-bg, transparent); }
.fancy-scrollbar::-webkit-scrollbar-thumb { background: var(--app-scrollbar-thumb-bg, var(--app-border-color)); border-radius: 3px;}
.fancy-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--app-scrollbar-thumb-hover-bg, var(--app-text-muted-color)); }

.theme-holographic .fancy-scrollbar::-webkit-scrollbar-track { background: rgba(var(--holographic-panel-rgb), 0.1); }
.theme-holographic .fancy-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--holographic-accent-rgb), 0.3); }
.theme-holographic .fancy-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(var(--holographic-accent-rgb), 0.5); }
</style>