// File: frontend/src/components/Header.vue
/**
 * @file Header.vue
 * @description Global application header, redesigned for "Ephemeral Harmony" theme.
 * Features dynamic logo and hearing icon, a unified user/settings dropdown,
 * a new site navigation dropdown, reactive login/logout state,
 * and improved visual integration with the "alive" app feel.
 * @version 6.1.0 - Added SiteMenuDropdown and refined structure.
 */
<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useUiStore } from '@/store/ui.store';
import { useChatStore } from '@/store/chat.store';
import { useCostStore } from '@/store/cost.store';

// Async Components
const UserSettingsDropdown = defineAsyncComponent(() => import('./header/UserSettingsDropdown.vue'));
const VoiceControlsDropdown = defineAsyncComponent(() => import('./header/VoiceControlsDropdown.vue'));
const SiteMenuDropdown = defineAsyncComponent(() => import('./header/SiteMenuDropdown.vue')); // New

// Props
const props = defineProps({
  /** Indicates if the user's microphone is actively capturing audio. */
  isUserListening: { type: Boolean, default: false },
  /** Indicates if the AI assistant is currently speaking. */
  isAssistantSpeaking: { type: Boolean, default: false },
});

// Emits
const emit = defineEmits<{
  (e: 'clear-chat-and-session'): void;
  (e: 'show-prior-chat-log'): void;
  (e: 'toggle-theme'): void; // For UserSettingsDropdown
  (e: 'toggle-fullscreen'): void; // For UserSettingsDropdown
  (e: 'logout'): void; // For SiteMenuDropdown
}>();

// Stores & Composables
const auth = useAuth();
const uiStore = useUiStore();
const chatStore = useChatStore();
const costStore = useCostStore();
const router = useRouter();

// Computed States
const sessionCost = computed(() => costStore.totalSessionCost);
const isFullscreenActive = computed(() => uiStore.isBrowserFullscreenActive);
const isAiStateActive = computed(() => props.isAssistantSpeaking || chatStore.isMainContentStreaming);
const isUserStateActive = computed(() => props.isUserListening && !isAiStateActive.value);

// Methods
const handleLogoClick = () => {
  router.push({ name: auth.isAuthenticated.value ? 'AuthenticatedHome' : 'PublicHome' });
};

// Passthrough handlers for events from child dropdowns
const onClearChatAndSession = () => emit('clear-chat-and-session');
const onShowPriorChatLog = () => emit('show-prior-chat-log');
const onToggleTheme = () => emit('toggle-theme');
const onToggleFullscreen = () => emit('toggle-fullscreen');
const onLogout = () => emit('logout');

</script>

<template>
  <header
    class="app-header-ephemeral"
    :class="{
      'fullscreen-active': isFullscreenActive,
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
          <VoiceControlsDropdown class="hidden md:flex voice-controls-header-integration" />
          <template #fallback>
            <div class="nav-button-placeholder w-8 h-8 bg-neutral-700/30 rounded-full animate-pulse"></div>
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
            @toggle-theme="onToggleTheme"
            @toggle-fullscreen="onToggleFullscreen"
            class="user-settings-header-integration"
          />
          <template #fallback>
            <div class="nav-button-placeholder w-8 h-8 bg-neutral-700/30 rounded-full animate-pulse"></div>
          </template>
        </Suspense>

        <Suspense>
          <SiteMenuDropdown
            @logout="onLogout"
            class="site-menu-header-integration"
          />
          <template #fallback>
             <div class="nav-button-placeholder w-8 h-8 bg-neutral-700/30 rounded-full animate-pulse"></div>
          </template>
        </Suspense>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
// Styles are primarily in frontend/src/styles/layout/_header.scss

// Placeholder styles for fallback content - ensure they are minimal and don't conflict
.nav-button-placeholder {
  // Mimic button size for layout stability during suspense
  // background-color: hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), var(--color-bg-tertiary-l), 0.3);
  // border-radius: var.$radius-full;
  // @apply animate-pulse;
}

// Integration classes for fine-tuning placement if needed.
.voice-controls-header-integration,
.user-settings-header-integration,
.site-menu-header-integration {
  // Add specific alignment or margin tweaks if the gap from .header-right-section is not enough
  // e.g., display: flex; align-items: center;
}
</style>