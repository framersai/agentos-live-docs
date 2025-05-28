// File: frontend/src/components/Header.vue
/**
 * @file Header.vue
 * @description Global application header, redesigned for "Ephemeral Harmony" theme.
 * Features dynamic logo, prominent agent title, reactive hearing icon,
 * unified user/settings dropdown, site navigation dropdown, and reactive login/logout state.
 * @version 6.2.0 - Added Agent Title, improved reactivity integration.
 */
<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useUiStore } from '@/store/ui.store';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';
import { useCostStore } from '@/store/cost.store';
import { type IAgentDefinition } from '@/services/agent.service';


// Async Components
const UserSettingsDropdown = defineAsyncComponent(() => import('./header/UserSettingsDropdown.vue'));
const VoiceControlsDropdown = defineAsyncComponent(() => import('./header/VoiceControlsDropdown.vue'));
const SiteMenuDropdown = defineAsyncComponent(() => import('./header/SiteMenuDropdown.vue'));

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
  (e: 'toggle-theme'): void;
  (e: 'toggle-fullscreen'): void;
  (e: 'logout'): void;
}>();

// Stores & Composables
const auth = useAuth();
const uiStore = useUiStore();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const costStore = useCostStore();
const router = useRouter();

// Computed States
const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);
const agentTitle = computed<string>(() => activeAgent.value?.label || 'Assistant');

const sessionCost = computed(() => costStore.totalSessionCost);
const isFullscreenActive = computed(() => uiStore.isBrowserFullscreenActive);
const isAiStateActive = computed(() => props.isAssistantSpeaking || chatStore.isMainContentStreaming);
const isUserStateActive = computed(() => props.isUserListening && !isAiStateActive.value);

// Methods
const handleLogoClick = () => {
  router.push({ name: auth.isAuthenticated.value ? 'AuthenticatedHome' : 'PublicHome' });
};

// Passthrough handlers
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
            <span class="hidden md:inline font-semibold">VoiceChat</span><span class="hidden md:inline font-light opacity-80">Assistant</span>
            <span class="md:hidden font-semibold">VCA</span>
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
          :title="isUserStateActive ? 'Listening...' : isAiStateActive ? 'Assistant Responding...' : 'Assistant Idle'"
          aria-label="Voice activity status"
          role="status"
        >
          <img src="@/assets/hearing.svg" alt="Voice activity indicator" class="hearing-icon-svg" />
        </div>
        <div class="active-agent-title-ephemeral" :title="`Current Assistant: ${agentTitle}`">
          {{ agentTitle }}
        </div>
      </div>

      <div class="header-right-section">
        <Suspense>
          <VoiceControlsDropdown class="voice-controls-header-integration" />
          <template #fallback>
            <div class="nav-button-placeholder"></div>
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
            <div class="nav-button-placeholder"></div>
          </template>
        </Suspense>

        <Suspense>
          <SiteMenuDropdown
            @logout="onLogout"
            class="site-menu-header-integration"
          />
          <template #fallback>
             <div class="nav-button-placeholder"></div>
          </template>
        </Suspense>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
/* Styles are primarily in frontend/src/styles/layout/_header.scss */
</style>