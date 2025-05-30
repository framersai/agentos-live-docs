// File: frontend/src/components/Header.vue
/**
 * @file Header.vue
 * @version 9.6.0
 * @description Global application header.
 * - Logo click navigates to home & forces reload.
 * - Hearing icon section is always rendered for CSS visibility control.
 * - Mobile icon sizes adjusted via SCSS.
 * - Logout behavior refined for page refresh.
 */
<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onUnmounted,
  defineAsyncComponent,
  type Component as VueComponentType,
  type PropType,
  type Ref,
  type FunctionalComponent,
  type DefineComponent
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useUiStore } from '@/store/ui.store';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';
import { useCostStore } from '@/store/cost.store';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { type IAgentDefinition } from '@/services/agent.service';
import { themeManager } from '@/theme/ThemeManager';

// Core Components
import AnimatedLogo from '@/components/ui/AnimatedLogo.vue';
const UserSettingsDropdown = defineAsyncComponent(() => import('./header/UserSettingsDropdown.vue'));
const VoiceControlsDropdown = defineAsyncComponent(() => import('./header/VoiceControlsDropdown.vue'));
const ThemeSelectionDropdown = defineAsyncComponent(() => import('./header/ThemeSelectionDropdown.vue'));
const SiteMenuDropdown = defineAsyncComponent(() => import('./header/SiteMenuDropdown.vue'));
const AgentHub = defineAsyncComponent(() => import('@/components/agents/AgentHub.vue'));
const AgentHubTrigger = defineAsyncComponent(() => import('./header/AgentHubTrigger.vue'));
const MobileNavPanel = defineAsyncComponent(() => import('./header/MobileNavPanel.vue'));

// Icons
import {
  Bars3Icon, XMarkIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon,
  SpeakerWaveIcon, SpeakerXMarkIcon,
  LightBulbIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  isUserListening: { type: Boolean as PropType<boolean>, default: false },
  isAssistantSpeaking: { type: Boolean as PropType<boolean>, default: false },
});

const emit = defineEmits<{
  (e: 'toggle-fullscreen'): void;
  (e: 'clear-chat-and-session'): void;
  (e: 'logout'): void; // This will be handled by App.vue which calls useAuth.logout
  (e: 'show-prior-chat-log'): void;
}>();

const auth = useAuth();
const uiStore = useUiStore();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const costStore = useCostStore();
const router = useRouter();
const route = useRoute();

const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);
const agentTitle = computed<string>(() =>
  activeAgent.value?.label ||
  (auth.isAuthenticated.value ? 'VCA Dashboard' : 'Voice Chat Assistant')
);
const agentIconComponent = computed<VueComponentType | FunctionalComponent | DefineComponent>(() => {
  const icon = activeAgent.value?.iconComponent;
  if (typeof icon === 'object' || typeof icon === 'function' || (typeof icon === 'string' && icon.endsWith('Icon'))) {
    return icon as VueComponentType;
  }
  return LightBulbIcon as VueComponentType;
});

const sessionCost = computed<number>(() => costStore.totalSessionCost);
const isFullscreenActiveForUI = computed<boolean>(() => uiStore.isBrowserFullscreenActive);
const isAiStateActive = computed<boolean>(() => props.isAssistantSpeaking || chatStore.isMainContentStreaming);
const isUserStateActive = computed<boolean>(() => props.isUserListening && !isAiStateActive.value);

const isMobileMenuOpen: Ref<boolean> = ref(false);
const isAgentHubOpen: Ref<boolean> = ref(false);

const isGlobalMuteActive = computed<boolean>({
  get: () => !voiceSettingsManager.settings.autoPlayTts,
  set: (isMuted: boolean) => voiceSettingsManager.updateSetting('autoPlayTts', !isMuted)
});

const toggleMobileMenu = (): void => { isMobileMenuOpen.value = !isMobileMenuOpen.value; };
const openAgentHub = (): void => {
  isMobileMenuOpen.value = false;
  isAgentHubOpen.value = true;
};
const closeAgentHub = (): void => { isAgentHubOpen.value = false; };

// Event handlers for MobileNavPanel emissions
const onLogoutFromMobile = () => { isMobileMenuOpen.value = false; emit('logout'); };
const onClearChatFromMobile = () => { isMobileMenuOpen.value = false; emit('clear-chat-and-session'); };
const onShowHistoryFromMobile = () => { isMobileMenuOpen.value = false; emit('show-prior-chat-log'); };
const onToggleFullscreenFromMobile = () => { emit('toggle-fullscreen'); };

/**
 * @function handleLogoClick
 * @description Navigates to the home page ('/') and forces a full page reload.
 * This is used to ensure a fresh state when the main application logo is clicked.
 * It also ensures the mobile navigation panel is closed if it was open.
 */
const handleLogoClick = (): void => {
  isMobileMenuOpen.value = false; // Close mobile menu if open

  // Navigate to home. If already home, reload. Otherwise, navigate then reload.
  if (route.path === '/') {
    window.location.reload();
  } else {
    // Using window.location.href for a clean navigation and reload effect
    window.location.href = '/';
  }
};

watch(() => route.path, () => {
  if (isMobileMenuOpen.value) isMobileMenuOpen.value = false;
});

watch([isMobileMenuOpen, isAgentHubOpen], ([mobileOpen, hubOpen]) => {
  if (typeof document !== 'undefined' && document.body) {
    document.body.classList.toggle('overflow-hidden-by-app-overlay', mobileOpen || hubOpen);
  }
}, { deep: true });

onUnmounted(() => {
  if (typeof document !== 'undefined' && document.body) {
    document.body.classList.remove('overflow-hidden-by-app-overlay');
  }
});
</script>

<template>
  <header
    class="app-header-ephemeral"
    :class="{
      'fullscreen-active': isFullscreenActiveForUI,
      'ai-speaking-active': isAiStateActive,
      'user-listening-active': isUserStateActive,
      'agent-hub-is-open': isAgentHubOpen,
    }"
    role="banner"
  >
    <div class="header-content-wrapper-ephemeral">
      <div class="header-left-section">
        <div
          @click="handleLogoClick"
          @keydown.enter="handleLogoClick"
          tabindex="0"
          role="button"
          class="animated-logo-link"
          aria-label="Voice Chat Assistant Home (Reload)"
        >
          <AnimatedLogo
            :app-name-main="uiStore.isSmallScreen ? 'VCA' : 'Voice Chat'"
            :app-name-subtitle="uiStore.isSmallScreen ? '' : 'Assistant'"
            :is-mobile-context="uiStore.isSmallScreen"
            :is-user-listening="isUserStateActive"
            :is-ai-speaking-or-processing="isAiStateActive"
          />
        </div>
        <div v-if="activeAgent" class="current-agent-display-header">
          <component :is="agentIconComponent" class="agent-icon-header" :class="activeAgent.iconClass" aria-hidden="true"/>
          <span class="agent-name-header" :title="activeAgent.label">{{ activeAgent.label }}</span>
        </div>
        <div v-else-if="auth.isAuthenticated.value && !activeAgent && route.name === 'AuthenticatedHome'" class="current-agent-display-header">
             <span class="agent-name-header">VCA Dashboard</span>
        </div>
      </div>

      <div class="header-center-section">
        <div
          class="hearing-icon-wrapper-ephemeral"
          :title="isUserStateActive ? 'Listening to you...' : isAiStateActive ? 'Assistant is responding...' : 'Assistant is idle'"
          role="status"
        >
          <img src="@/assets/hearing.svg" alt="Voice activity indicator" class="hearing-icon-svg" />
        </div>
      </div>

      <nav class="header-right-section desktop-controls-ephemeral" aria-label="Main desktop navigation">
        <Suspense><AgentHubTrigger @open-agent-hub="openAgentHub" class="direct-header-button" /></Suspense>
        <Suspense><ThemeSelectionDropdown class="header-control-item" /></Suspense>
        <button @click="emit('toggle-fullscreen')" class="direct-header-button" :title="isFullscreenActiveForUI ? 'Exit Fullscreen' : 'Enter Fullscreen'" :aria-pressed="isFullscreenActiveForUI">
          <component :is="isFullscreenActiveForUI ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="icon-base" />
          <span class="sr-only">{{ isFullscreenActiveForUI ? 'Exit Fullscreen' : 'Enter Fullscreen' }}</span>
        </button>
        <button @click="isGlobalMuteActive = !isGlobalMuteActive" class="direct-header-button" :title="isGlobalMuteActive ? 'Unmute All Speech' : 'Mute All Speech'" :aria-pressed="isGlobalMuteActive">
          <component :is="isGlobalMuteActive ? SpeakerXMarkIcon : SpeakerWaveIcon" class="icon-base" />
          <span class="sr-only">{{ isGlobalMuteActive ? 'Unmute All Speech' : 'Mute All Speech' }}</span>
        </button>
        <Suspense><VoiceControlsDropdown class="header-control-item" /></Suspense>
        
        <template v-if="auth.isAuthenticated.value">
            <div class="session-cost-display-ephemeral" title="Current Session Cost">
              ${{ sessionCost.toFixed(3) }}
            </div>
            <Suspense>
              <UserSettingsDropdown
                class="header-control-item"
                @clear-chat-and-session="emit('clear-chat-and-session')"
                @show-prior-chat-log="emit('show-prior-chat-log')"
                @logout="emit('logout')"
              />
            </Suspense>
        </template>
        <template v-else>
            <RouterLink to="/login" class="direct-header-button login-button-desktop">
                <ArrowLeftOnRectangleIcon class="icon-base" aria-hidden="true" />
                <span class="login-button-text">Login</span>
            </RouterLink>
        </template>
         <Suspense><SiteMenuDropdown class="header-control-item site-menu-dropdown-header"/></Suspense>
      </nav>

      <div class="mobile-menu-trigger-wrapper-ephemeral">
        <Suspense><AgentHubTrigger v-if="uiStore.isMediumScreenOrSmaller" @open-agent-hub="openAgentHub" class="mobile-agent-hub-trigger" /></Suspense>
        <button @click="toggleMobileMenu" class="mobile-menu-trigger-button" :aria-expanded="isMobileMenuOpen" aria-controls="mobile-navigation-panel">
          <XMarkIcon v-if="isMobileMenuOpen" class="icon-base" aria-hidden="true" />
          <Bars3Icon v-else class="icon-base" aria-hidden="true" />
          <span class="sr-only">{{ isMobileMenuOpen ? 'Close main menu' : 'Open main menu' }}</span>
        </button>
      </div>
    </div>

    <Suspense>
      <MobileNavPanel
        :is-open="isMobileMenuOpen"
        :is-user-listening="isUserStateActive"
        :is-ai-state-active="isAiStateActive"
        :active-agent="activeAgent"
        :agent-title="agentTitle"
        :agent-icon-component="agentIconComponent"
        :is-authenticated="auth.isAuthenticated.value"
        :session-cost="sessionCost"
        :is-fullscreen-active-for-u-i="isFullscreenActiveForUI"
        :is-global-mute-active-prop="isGlobalMuteActive"
        @close-panel="isMobileMenuOpen = false"
        @open-agent-hub="openAgentHub"
        @toggle-fullscreen="onToggleFullscreenFromMobile"
        @toggle-global-mute="isGlobalMuteActive = !isGlobalMuteActive"
        @clear-chat-and-session="onClearChatFromMobile"
        @show-prior-chat-log="onShowHistoryFromMobile"
        @logout="onLogoutFromMobile"
      />
    </Suspense>

    <Suspense>
      <AgentHub :is-open="isAgentHubOpen" @close="closeAgentHub" @agent-selected="closeAgentHub" />
    </Suspense>
  </header>
</template>

<style lang="scss">
// Styles are in frontend/src/styles/layout/_header.scss
// .login-button-desktop styles are also in _header.scss
</style>