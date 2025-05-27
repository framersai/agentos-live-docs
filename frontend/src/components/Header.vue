// File: frontend/src/components/Header.vue
/**
 * @file Header.vue
 * @description Global application header, redesigned for "Ephemeral Harmony" theme.
 * Features dynamic logo and hearing icon, a unified user/settings dropdown,
 * reactive login/logout state, and improved visual integration with the "alive" app feel.
 * @version 6.0.0
 */
<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useUiStore } from '@/store/ui.store';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';
import { useCostStore } from '@/store/cost.store';
// Ensure icon imports are here if not globally registered or handled by UserSettingsDropdown
import { /* Relevant icons if needed directly */ } from '@heroicons/vue/24/outline';

// Async Components
const UserSettingsDropdown = defineAsyncComponent(() => import('./header/UserSettingsDropdown.vue'));
const VoiceControlsDropdown = defineAsyncComponent(() => import('./header/VoiceControlsDropdown.vue'));

// Props
const props = defineProps({
  /** Indicates if the user's microphone is actively capturing audio. */
  isUserListening: { type: Boolean, default: false },
  /** Indicates if the AI assistant is currently speaking. */
  isAssistantSpeaking: { type: Boolean, default: false },
});

// Emits: These are re-emitted from UserSettingsDropdown for App.vue to handle
const emit = defineEmits<{
  (e: 'clear-chat-and-session'): void;
  (e: 'show-prior-chat-log'): void;
}>();

// Stores & Composables
const auth = useAuth(); // For isAuthenticated status
const uiStore = useUiStore();
const agentStore = useAgentStore(); // Potentially for agent-specific header elements if any in future
const chatStore = useChatStore(); // For isMainContentStreaming
const costStore = useCostStore();
const router = useRouter();

// Computed States
const sessionCost = computed(() => costStore.totalSessionCost);
const isFullscreenActive = computed(() => uiStore.isBrowserFullscreenActive);

// Determine the overall "AI active" state (speaking or processing response)
const isAiStateActive = computed(() => props.isAssistantSpeaking || chatStore.isMainContentStreaming);
// User is considered "active" if listening AND AI is not currently overriding that state by speaking/processing
const isUserStateActive = computed(() => props.isUserListening && !isAiStateActive.value);

// Methods for header elements or passthrough emits
const handleLogoClick = () => {
  // Navigate to the appropriate home page based on authentication
  if (auth.isAuthenticated.value) {
    router.push({ name: 'AuthenticatedHome' });
  } else {
    router.push({ name: 'PublicHome' });
  }
};

// Handlers for events bubbled up from UserSettingsDropdown
const onClearChatAndSession = () => {
  emit('clear-chat-and-session');
};

const onShowPriorChatLog = () => {
  emit('show-prior-chat-log');
};

</script>

<template>
  <header
    class="app-header-ephemeral"
    :class="{
      'fullscreen-active': isFullscreenActive, // For potential style adjustments when browser is fullscreen
      'ai-speaking-active': isAiStateActive,
      'user-listening-active': isUserStateActive,
    }"
    aria-label="Application Header"
  >
    <div class="header-content-wrapper-ephemeral">
      <div class="header-left-section">
        <RouterLink
          @click="handleLogoClick"
          to="/"
          class="logo-title-link-ephemeral"
          aria-label="Go to Home Page"
        >
          <img src="@/assets/logo.svg" alt="Voice Chat Assistant Logo" class="app-logo-ephemeral" />
          <h1 class="app-title-ephemeral">
            <span class="hidden sm:inline font-semibold">VoiceChat</span><span class="hidden sm:inline font-light opacity-80">Assistant</span>
            <span class="sm:hidden font-semibold">VCA</span>
          </h1>
        </RouterLink>
      </div>

      <div class="header-center-section">
        <div
          class="hearing-icon-wrapper-ephemeral"
          :class="{
            'listening': isUserStateActive,
            'speaking': isAiStateActive,
            'idle': !isUserStateActive && !isAiStateActive
          }"
          :title="isUserStateActive ? 'Listening for your input...' : isAiStateActive ? 'Assistant is responding...' : 'Assistant is idle'"
          aria-label="Voice activity status"
          role="status"
        >
          <img src="@/assets/hearing.svg" alt="Voice activity indicator" class="hearing-icon-svg" />
        </div>
      </div>

      <div class="header-right-section">
        <Suspense>
          <VoiceControlsDropdown class="hidden md:flex" /> <template #fallback>
            <div class="nav-button-placeholder">Voice...</div>
          </template>
        </Suspense>

        <div
          v-if="auth.isAuthenticated.value"
          class="session-cost-display-ephemeral hidden sm:flex"
          title="Current session estimated API cost"
        >
          <span class="cost-value">${{ sessionCost.toFixed(3) }}</span>
        </div>
        
        <Suspense>
          <UserSettingsDropdown
            @clear-chat-and-session="onClearChatAndSession"
            @show-prior-chat-log="onShowPriorChatLog"
          />
          <template #fallback>
            <div class="user-settings-trigger-placeholder"></div>
          </template>
        </Suspense>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
// Styles are primarily in frontend/src/styles/layout/_header.scss
// This scoped style block is for very specific, one-off adjustments if necessary.

// Placeholder styles for fallback content - ensure they are minimal and don't conflict

</style>