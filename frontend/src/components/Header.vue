// File: frontend/src/components/Header.vue
/**
 * @file Header.vue
 * @description Global application header for the "Ephemeral Harmony" theme.
 * This component manages the display of the application logo, primary navigation controls (desktop and mobile),
 * user-specific actions, and access to the Agent Hub. It dynamically reflects application states
 * such as AI speaking or user listening through visual cues and passes these states to child components like AnimatedLogo.
 * It ensures a responsive layout, with a comprehensive mobile navigation panel.
 *
 * @component Header
 * @props {boolean} [isUserListening=false] - Indicates if the application is currently listening to user voice input.
 * @props {boolean} [isAssistantSpeaking=false] - Indicates if the AI assistant is currently speaking or processing.
 * @emits toggle-fullscreen - Requests to toggle browser fullscreen mode.
 * @emits clear-chat-and-session - Requests to clear current chat history and session costs.
 * @emits logout - Requests user logout.
 * @emits show-prior-chat-log - Requests to show the prior chat log history.
 *
 * @version 9.2.0 - Integrated state propagation to AnimatedLogo, robust AgentHub triggering,
 * comprehensive mobile navigation panel, and structural improvements for dropdown positioning.
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
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useUiStore } from '@/store/ui.store';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';
import { useCostStore } from '@/store/cost.store';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { type IAgentDefinition } from '@/services/agent.service';
import { themeManager } from '@/theme/ThemeManager'; // For mobile theme selector

// Core Components (Asynchronously loaded for performance)
import AnimatedLogo from '@/components/ui/AnimatedLogo.vue';
const UserSettingsDropdown = defineAsyncComponent(() => import('./header/UserSettingsDropdown.vue'));
const VoiceControlsDropdown = defineAsyncComponent(() => import('./header/VoiceControlsDropdown.vue'));
const ThemeSelectionDropdown = defineAsyncComponent(() => import('./header/ThemeSelectionDropdown.vue'));
const SiteMenuDropdown = defineAsyncComponent(() => import('./header/SiteMenuDropdown.vue'));
const AgentHub = defineAsyncComponent(() => import('@/components/agents/AgentHub.vue'));
const AgentHubTrigger = defineAsyncComponent(() => import('./header/AgentHubTrigger.vue'));

// Icons from Heroicons
import {
  Bars3Icon, XMarkIcon,
  InformationCircleIcon, Cog8ToothIcon,
  SunIcon, MoonIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon,
  SpeakerWaveIcon, SpeakerXMarkIcon,
  Squares2X2Icon,
  ClockIcon, TrashIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  LightBulbIcon, // Fallback agent icon
  CheckIcon,    // Used for active selection in mobile theme chooser
} from '@heroicons/vue/24/outline';

/**
 * @props - Component properties.
 */
const props = defineProps({
  /** Indicates if the application is actively listening to the user's voice. */
  isUserListening: { type: Boolean as PropType<boolean>, default: false },
  /** Indicates if the AI assistant is currently speaking or processing a response. */
  isAssistantSpeaking: { type: Boolean as PropType<boolean>, default: false },
});

/**
 * @emits - Defines the events emitted by this component.
 */
const emit = defineEmits<{
  (e: 'toggle-fullscreen'): void;
  (e: 'clear-chat-and-session'): void;
  (e: 'logout'): void;
  (e: 'show-prior-chat-log'): void;
}>();

// Composable and Store Instances
const auth = useAuth();
const uiStore = useUiStore();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const costStore = useCostStore();
const router = useRouter();

/**
 * @computed activeAgent
 * @description Retrieves the currently active agent's definition from the agent store.
 * @returns {IAgentDefinition | undefined} The active agent definition or undefined.
 */
const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);

/**
 * @computed agentTitle
 * @description Determines the title displayed in the header, based on the active agent or auth state.
 * @returns {string} The display title.
 */
const agentTitle = computed<string>(() =>
  activeAgent.value?.label || (auth.isAuthenticated.value ? 'VCA Dashboard' : 'Voice Chat Assistant')
);

/**
 * @computed agentIconComponent
 * @description Provides the Vue component for the active agent's icon, with a fallback.
 * @returns {VueComponentType | FunctionalComponent | DefineComponent} The icon component.
 */
const agentIconComponent = computed<VueComponentType | FunctionalComponent | DefineComponent>(() => {
    const icon = activeAgent.value?.iconComponent;
    if (typeof icon === 'object' || typeof icon === 'function') {
        return icon as VueComponentType;
    }
    return LightBulbIcon as VueComponentType;
});

/** @computed sessionCost - The current session's API usage cost. */
const sessionCost = computed<number>(() => costStore.totalSessionCost);
/** @computed isFullscreenActiveForUI - Reflects if the browser is in native fullscreen. */
const isFullscreenActiveForUI = computed<boolean>(() => uiStore.isBrowserFullscreenActive);

/**
 * @computed isAiStateActive
 * @description True if the AI is speaking or the main content is streaming.
 * This prop is passed to `AnimatedLogo`.
 * @returns {boolean}
 */
const isAiStateActive = computed<boolean>(() => props.isAssistantSpeaking || chatStore.isMainContentStreaming);

/**
 * @computed isUserStateActive
 * @description True if the user is actively being listened to AND the AI is not currently active.
 * This prop is passed to `AnimatedLogo`.
 * @returns {boolean}
 */
const isUserStateActive = computed<boolean>(() => props.isUserListening && !isAiStateActive.value);

/** @ref {Ref<boolean>} isMobileMenuOpen - Controls the visibility of the full-screen mobile navigation panel. */
const isMobileMenuOpen: Ref<boolean> = ref(false);
/** @ref {Ref<boolean>} isAgentHubOpen - Controls the visibility of the Agent Hub modal. */
const isAgentHubOpen: Ref<boolean> = ref(false);

/**
 * @computed isGlobalMuteActive
 * @description Manages the global mute state for Text-to-Speech (TTS) playback.
 * Reflects and updates the `autoPlayTts` setting in `voiceSettingsManager`.
 */
const isGlobalMuteActive = computed<boolean>({
  get: () => !voiceSettingsManager.settings.autoPlayTts,
  set: (isMuted: boolean) => voiceSettingsManager.updateSetting('autoPlayTts', !isMuted)
});

// --- Mobile Navigation and Modal Control ---
const toggleMobileMenu = (): void => { isMobileMenuOpen.value = !isMobileMenuOpen.value; };
const closeMobileMenu = (): void => { isMobileMenuOpen.value = false; };
const openAgentHub = (): void => { closeMobileMenu(); isAgentHubOpen.value = true; };
const closeAgentHub = (): void => { isAgentHubOpen.value = false; };

// Close mobile menu on route change
watch(() => router.currentRoute.value, () => {
  closeMobileMenu();
});

// --- Event Handlers for Emitted Actions ---
// These handlers also ensure any open overlays (mobile menu, agent hub) are closed.
const onLogoutHandler = (): void => { closeMobileMenu(); closeAgentHub(); emit('logout'); };
const onClearChatHandler = (): void => { closeMobileMenu(); emit('clear-chat-and-session'); };
const onShowHistoryHandler = (): void => { closeMobileMenu(); emit('show-prior-chat-log'); };
const onToggleFullscreenHandler = (): void => { uiStore.toggleBrowserFullscreen(); };

// Manage body overflow style when mobile menu or agent hub is open to prevent background scroll.
watch([isMobileMenuOpen, isAgentHubOpen], ([mobileOpen, hubOpen]) => {
  if (typeof document !== 'undefined' && document.body) {
    document.body.classList.toggle('overflow-hidden-by-app-overlay', mobileOpen || hubOpen);
  }
});
onUnmounted(() => { // Cleanup body class on component unmount
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
      'mobile-menu-is-open': isMobileMenuOpen,
      'agent-hub-is-open': isAgentHubOpen,
    }"
    role="banner"
  >
    <div class="header-content-wrapper-ephemeral">
      <div class="header-left-section">
        <RouterLink to="/" @click="closeMobileMenu" class="animated-logo-link" aria-label="Voice Coding Assistant Home">
          <AnimatedLogo
            :app-name-main="uiStore.isSmallScreen ? 'VCA' : 'Voice Chat'"
            :app-name-subtitle="uiStore.isSmallScreen ? 'Assistant' : 'Assistant'"
            :is-user-listening="isUserStateActive"
            :is-ai-speaking-or-processing="isAiStateActive"
          />
        </RouterLink>
        <div v-if="activeAgent && auth.isAuthenticated.value && !uiStore.isMediumScreenOrSmaller" class="current-agent-display-header">
          <component :is="agentIconComponent" class="agent-icon-header" :class="activeAgent.iconClass" aria-hidden="true"/>
          <span class="agent-name-header" :title="activeAgent.label">{{ agentTitle }}</span>
        </div>
      </div>

      <div class="header-center-section">
        <div
          class="hearing-icon-wrapper-ephemeral"
          :class="{ 'listening': isUserStateActive, 'speaking': isAiStateActive, 'idle': !isUserStateActive && !isAiStateActive }"
          :title="isUserStateActive ? 'Listening to you...' : isAiStateActive ? 'Assistant is responding...' : 'Assistant is idle'"
          role="status"
        >
          <img src="@/assets/hearing.svg" alt="Voice activity indicator" class="hearing-icon-svg" />
        </div>
      </div>

      <nav class="header-right-section desktop-controls-ephemeral" aria-label="Main desktop navigation">
        <Suspense><AgentHubTrigger v-if="auth.isAuthenticated.value" @open-agent-hub="openAgentHub" /></Suspense>
        <Suspense><ThemeSelectionDropdown /></Suspense>
        <button @click="onToggleFullscreenHandler" class="btn btn-ghost-ephemeral btn-icon-ephemeral direct-header-button" :title="isFullscreenActiveForUI ? 'Exit Fullscreen' : 'Enter Fullscreen'" :aria-pressed="isFullscreenActiveForUI">
          <component :is="isFullscreenActiveForUI ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="icon-base" />
        </button>
        <button @click="isGlobalMuteActive = !isGlobalMuteActive" class="btn btn-ghost-ephemeral btn-icon-ephemeral direct-header-button" :title="isGlobalMuteActive ? 'Unmute All Speech' : 'Mute All Speech'" :aria-pressed="isGlobalMuteActive">
          <component :is="isGlobalMuteActive ? SpeakerXMarkIcon : SpeakerWaveIcon" class="icon-base" />
        </button>
        <Suspense><VoiceControlsDropdown /></Suspense>
        <div v-if="auth.isAuthenticated.value" class="session-cost-display-ephemeral" title="Current Session Cost">
          ${{ sessionCost.toFixed(3) }}
        </div>
        <Suspense>
          <UserSettingsDropdown
            @clear-chat-and-session="onClearChatHandler"
            @show-prior-chat-log="onShowHistoryHandler"
            @logout="onLogoutHandler"
          />
        </Suspense>
         <Suspense><SiteMenuDropdown /></Suspense>
      </nav>

      <div class="mobile-menu-trigger-wrapper-ephemeral">
        <Suspense><AgentHubTrigger v-if="auth.isAuthenticated.value && uiStore.isMediumScreenOrSmaller" @open-agent-hub="openAgentHub" class="mobile-agent-hub-trigger" /></Suspense>
        <button @click="toggleMobileMenu" class="btn btn-ghost-ephemeral btn-icon-ephemeral mobile-menu-trigger-button" :aria-expanded="isMobileMenuOpen" aria-controls="mobile-navigation-panel">
          <XMarkIcon v-if="isMobileMenuOpen" class="icon-base" aria-hidden="true" />
          <Bars3Icon v-else class="icon-base" aria-hidden="true" />
          <span class="sr-only">{{ isMobileMenuOpen ? 'Close main menu' : 'Open main menu' }}</span>
        </button>
      </div>
    </div>

    <Transition name="mobile-nav-slide-from-right">
      <nav v-if="isMobileMenuOpen" id="mobile-navigation-panel" class="mobile-nav-panel-ephemeral" aria-label="Mobile navigation">
        <div class="mobile-nav-header">
            <AnimatedLogo
              appNameMain="VCA"
              :is-mobile-context="true"
              class="mobile-nav-logo"
              @click="closeMobileMenu"
              :is-user-listening="isUserStateActive"
              :is-ai-speaking-or-processing="isAiStateActive"
            />
            <div v-if="activeAgent && auth.isAuthenticated.value" class="mobile-nav-agent-title-compact">
                <component :is="agentIconComponent" class="agent-icon-mobile-nav" :class="activeAgent.iconClass" aria-hidden="true" />
                <span>{{ agentTitle }}</span>
            </div>
            <button @click="closeMobileMenu" class="btn btn-ghost-ephemeral btn-icon-ephemeral mobile-nav-close-button" aria-label="Close mobile menu">
                <XMarkIcon class="icon-base" />
            </button>
        </div>
        <div class="mobile-nav-content-ephemeral custom-scrollbar-thin">
            <button v-if="auth.isAuthenticated.value" @click="openAgentHub" class="mobile-nav-item group prominent-action">
                <Squares2X2Icon class="nav-item-icon" aria-hidden="true"/> Explore Assistants
            </button>
            <div v-if="auth.isAuthenticated.value" class="mobile-nav-divider"></div>

            <RouterLink to="/settings" class="mobile-nav-item group" @click="closeMobileMenu">
                <Cog8ToothIcon class="nav-item-icon" aria-hidden="true"/>App Settings
            </RouterLink>
             <RouterLink to="/about" class="mobile-nav-item group" @click="closeMobileMenu">
                <InformationCircleIcon class="nav-item-icon" aria-hidden="true"/>About VCA
            </RouterLink>

            <div class="mobile-nav-divider"></div>
            <div class="mobile-nav-section-title">Display & Sound</div>
             <div class="theme-selector-grid-mobile" role="radiogroup" aria-labelledby="mobile-theme-select-label">
                <span id="mobile-theme-select-label" class="sr-only">Select a theme</span>
                <button
                    v-for="theme in themeManager.getAvailableThemes()" :key="theme.id"
                    @click="uiStore.setTheme(theme.id); /* Optionally closeMobileMenu(); */"
                    class="mobile-nav-item theme-button-mobile"
                    :class="{ 'active': uiStore.currentThemeId === theme.id }"
                    role="radio" :aria-checked="uiStore.currentThemeId === theme.id"
                >
                    <component :is="theme.isDark ? MoonIcon : SunIcon" class="nav-item-icon mini-icon" aria-hidden="true"/> {{ theme.name }}
                    <CheckIcon v-if="uiStore.currentThemeId === theme.id" class="checkmark-icon-mobile" aria-hidden="true"/>
                </button>
            </div>

            <button @click="onToggleFullscreenHandler" class="mobile-nav-item group">
                <component :is="isFullscreenActiveForUI ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="nav-item-icon" aria-hidden="true"/>
                {{ isFullscreenActiveForUI ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
            </button>
            <button @click="isGlobalMuteActive = !isGlobalMuteActive" class="mobile-nav-item group">
                <component :is="isGlobalMuteActive ? SpeakerXMarkIcon : SpeakerWaveIcon" class="nav-item-icon" aria-hidden="true" />
                {{ isGlobalMuteActive ? 'Unmute Speech' : 'Mute Speech' }}
            </button>
            <RouterLink :to="{ name: 'Settings', hash: '#audio-voice-settings'}" class="mobile-nav-item group" @click="closeMobileMenu">
                <SpeakerWaveIcon class="nav-item-icon" aria-hidden="true"/>Full Voice Settings
            </RouterLink>

            <template v-if="auth.isAuthenticated.value">
                <div class="mobile-nav-divider"></div>
                <div class="mobile-nav-section-title">Session & Account</div>
                <div class="mobile-nav-item-static px-4 py-2 text-xs text-neutral-text-muted">
                    Session Cost: ${{ sessionCost.toFixed(3) }}
                </div>
                <button @click="onClearChatHandler" class="mobile-nav-item group">
                    <TrashIcon class="nav-item-icon" aria-hidden="true"/>Clear Session
                </button>
                 <button @click="onShowHistoryHandler" class="mobile-nav-item group">
                    <ClockIcon class="nav-item-icon" aria-hidden="true"/>View Chat History
                </button>
                 <RouterLink :to="{ name: 'Settings', hash: '#user-preferences'}" class="mobile-nav-item group" @click="closeMobileMenu">
                    <UserCircleIcon class="nav-item-icon" aria-hidden="true"/>User Preferences
                </RouterLink>
                <div class="mobile-nav-divider"></div>
                <button @click="onLogoutHandler" class="mobile-nav-item group logout-item">
                    <ArrowRightOnRectangleIcon class="nav-item-icon" aria-hidden="true"/>Logout
                </button>
            </template>
            <template v-else>
                <div class="mobile-nav-divider"></div>
                <RouterLink to="/login" class="mobile-nav-item group login-item prominent-action" @click="closeMobileMenu">
                    <ArrowLeftOnRectangleIcon class="nav-item-icon" aria-hidden="true"/>Login / Sign Up
                </RouterLink>
            </template>
        </div>
      </nav>
    </Transition>

    <Suspense>
      <AgentHub :is-open="isAgentHubOpen" @close="closeAgentHub" @agent-selected="closeAgentHub" />
    </Suspense>
  </header>
</template>

<style lang="scss">
// Styles are in frontend/src/styles/layout/_header.scss
// Note: `themeManager.getAvailableThemes()` in template requires `themeManager` to be available.
// It was imported in `<script setup>`, so it's available.
</style>