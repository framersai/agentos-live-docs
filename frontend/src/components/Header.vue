/**
 * @file Header.vue
 * @description Global application header - Full "Ephemeral Harmony" Revamp.
 * Features: AnimatedLogo, responsive design with mobile navigation drawer,
 * direct access controls (Theme, Fullscreen, Mute), Agent Hub trigger,
 * prominent & reactive Agent Title, and refined dropdown integrations.
 * @version 9.0.2 - Script cleanup, enhanced mobile nav structure, separated SCSS.
 */
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useUiStore } from '@/store/ui.store';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';
import { useCostStore } from '@/store/cost.store';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { type IAgentDefinition } from '@/services/agent.service';
import { themeManager, type ThemeDefinition } from '@/theme/ThemeManager';

// Core Components
import AnimatedLogo from '@/components/ui/AnimatedLogo.vue';
const UserSettingsDropdown = defineAsyncComponent(() => import('./header/UserSettingsDropdown.vue'));
const VoiceControlsDropdown = defineAsyncComponent(() => import('./header/VoiceControlsDropdown.vue'));
const ThemeSelectionDropdown = defineAsyncComponent(() => import('./header/ThemeSelectionDropdown.vue'));
const AgentHub = defineAsyncComponent(() => import('@/components/agents/AgentHub.vue'));
const AgentHubTrigger = defineAsyncComponent(() => import('./header/AgentHubTrigger.vue'));

// Icons
import {
  Bars3Icon, XMarkIcon,
  InformationCircleIcon, Cog8ToothIcon,
  SunIcon, MoonIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon,
  SpeakerWaveIcon, SpeakerXMarkIcon,
  Squares2X2Icon,
  ClockIcon, TrashIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon,
  LightBulbIcon, // Fallback agent icon
  CheckIcon // For mobile theme selection
} from '@heroicons/vue/24/outline';

const props = defineProps({
  isUserListening: { type: Boolean, default: false },
  isAssistantSpeaking: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (e: 'clear-chat-and-session'): void;
  (e: 'show-prior-chat-log'): void;
  (e: 'logout'): void;
}>();

const auth = useAuth();
const uiStore = useUiStore();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const costStore = useCostStore();
const router = useRouter();

const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);
const agentTitle = computed<string>(() => activeAgent.value?.label || (auth.isAuthenticated.value ? 'Dashboard' : 'VCA Platform'));
const agentIconComponent = computed(() => activeAgent.value?.iconComponent || LightBulbIcon );

const sessionCost = computed(() => costStore.totalSessionCost);
const isFullscreenActiveForUI = computed(() => uiStore.isBrowserFullscreenActive);
const isAiStateActive = computed(() => props.isAssistantSpeaking || chatStore.isMainContentStreaming);
const isUserStateActive = computed(() => props.isUserListening && !isAiStateActive.value);

const isMobileMenuOpen = ref(false);
const isAgentHubOpen = ref(false);

const isGlobalMuteActive = computed({
  get: () => !voiceSettingsManager.settings.autoPlayTts,
  set: (isMuted) => voiceSettingsManager.updateSetting('autoPlayTts', !isMuted)
});

const toggleMobileMenu = () => isMobileMenuOpen.value = !isMobileMenuOpen.value;
const closeMobileMenu = () => isMobileMenuOpen.value = false;

const openAgentHub = () => { closeMobileMenu(); isAgentHubOpen.value = true; };
const closeAgentHub = () => isAgentHubOpen.value = false;

watch(() => router.currentRoute.value, () => {
  closeMobileMenu();
});

// Event handlers for actions, ensuring mobile menu closes
const onLogoutHandler = () => { closeMobileMenu(); closeAgentHub(); emit('logout'); };
const onClearChatHandler = () => { closeMobileMenu(); emit('clear-chat-and-session'); };
const onShowHistoryHandler = () => { closeMobileMenu(); emit('show-prior-chat-log'); };

// Body scroll lock management
watch([isMobileMenuOpen, isAgentHubOpen], ([mobileOpen, hubOpen]) => {
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('overflow-hidden-by-app-overlay', mobileOpen || hubOpen);
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
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
  >
    <div class="header-content-wrapper-ephemeral">
      <div class="header-left-section">
        <RouterLink to="/" @click="closeMobileMenu" class="animated-logo-link" aria-label="Voice Chat Assistant Home">
          <AnimatedLogo app-name-main="VCA" app-name-subtitle="AI" />
        </RouterLink>
        <div v-if="activeAgent && auth.isAuthenticated.value" class="current-agent-display-header">
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
        <Suspense><AgentHubTrigger @open-agent-hub="openAgentHub" class="header-control-item" /></Suspense>
        <Suspense><ThemeSelectionDropdown class="header-control-item theme-dropdown-header" /></Suspense>
        
        <button @click="uiStore.toggleBrowserFullscreen()" class="btn btn-ghost-ephemeral btn-icon-ephemeral direct-header-button" :title="isFullscreenActiveForUI ? 'Exit Fullscreen' : 'Enter Fullscreen'" :aria-pressed="isFullscreenActiveForUI">
          <component :is="isFullscreenActiveForUI ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="icon-base" />
        </button>
        <button @click="isGlobalMuteActive = !isGlobalMuteActive" class="btn btn-ghost-ephemeral btn-icon-ephemeral direct-header-button" :title="isGlobalMuteActive ? 'Unmute All Speech' : 'Mute All Speech'" :aria-pressed="isGlobalMuteActive">
          <component :is="isGlobalMuteActive ? SpeakerXMarkIcon : SpeakerWaveIcon" class="icon-base" />
        </button>

        <Suspense><VoiceControlsDropdown class="header-control-item voice-controls-dropdown-header" /></Suspense>
        
        <div v-if="auth.isAuthenticated.value" class="session-cost-display-ephemeral header-control-item" title="Current Session Cost">
          ${{ sessionCost.toFixed(3) }}
        </div>

        <Suspense>
          <UserSettingsDropdown
            @clear-chat-and-session="onClearChatHandler"
            @show-prior-chat-log="onShowHistoryHandler"
            @logout="onLogoutHandler"
            class="header-control-item user-settings-dropdown-header"
          />
        </Suspense>
      </nav>

      <div class="mobile-menu-trigger-wrapper-ephemeral">
        <Suspense><AgentHubTrigger v-if="auth.isAuthenticated.value" @open-agent-hub="openAgentHub" class="mobile-agent-hub-trigger" /></Suspense>
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
            <AnimatedLogo appNameMain="VCA" :is-mobile-context="true" class="mobile-nav-logo" @click="closeMobileMenu"/>
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

          <RouterLink to="/about" class="mobile-nav-item group" @click="closeMobileMenu">
            <InformationCircleIcon class="nav-item-icon" aria-hidden="true"/>About VCA
          </RouterLink>
          <RouterLink to="/settings" class="mobile-nav-item group" @click="closeMobileMenu">
            <Cog8ToothIcon class="nav-item-icon" aria-hidden="true"/>App Settings
          </RouterLink>

          <div class="mobile-nav-divider"></div>
          <div class="mobile-nav-section-title">Display & Sound</div>
          <div class="theme-selector-grid-mobile" role="radiogroup" aria-labelledby="mobile-theme-select-label">
              <span id="mobile-theme-select-label" class="sr-only">Select a theme</span>
              <button
                v-for="theme in themeManager.getAvailableThemes()" :key="theme.id"
                @click="uiStore.setTheme(theme.id)"
                class="mobile-nav-item theme-button-mobile"
                :class="{ 'active': uiStore.currentThemeId === theme.id }"
                role="radio" :aria-checked="uiStore.currentThemeId === theme.id"
              >
                <component :is="theme.isDark ? MoonIcon : SunIcon" class="nav-item-icon mini-icon" aria-hidden="true"/> {{ theme.name }}
                <CheckIcon v-if="uiStore.currentThemeId === theme.id" class="checkmark-icon-mobile" aria-hidden="true"/>
              </button>
            </div>

          <button @click="uiStore.toggleBrowserFullscreen()" class="mobile-nav-item group">
            <component :is="isFullscreenActiveForUI ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="nav-item-icon" aria-hidden="true"/>
            {{ isFullscreenActiveForUI ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
          </button>
           <button @click="isGlobalMuteActive = !isGlobalMuteActive" class="mobile-nav-item group">
            <component :is="isGlobalMuteActive ? SpeakerXMarkIcon : SpeakerWaveIcon" class="nav-item-icon" aria-hidden="true" />
            {{ isGlobalMuteActive ? 'Unmute Speech' : 'Mute Speech' }}
          </button>

          <template v-if="auth.isAuthenticated.value">
            <div class="mobile-nav-divider"></div>
            <div class="mobile-nav-section-title">Session</div>
            <button @click="onClearChatHandler" class="mobile-nav-item group">
              <TrashIcon class="nav-item-icon" aria-hidden="true"/>Clear Session
            </button>
              <button @click="onShowHistoryHandler" class="mobile-nav-item group">
              <ClockIcon class="nav-item-icon" aria-hidden="true"/>Chat History (View)
            </button>
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