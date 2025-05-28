// File: frontend/src/components/Header.vue
/**
 * @file Header.vue
 * @description Global application header - Full "Ephemeral Harmony" Revamp.
 * Features: AnimatedLogo, responsive design with mobile navigation drawer,
 * direct access controls (Theme, Fullscreen, Mute), Agent Hub trigger,
 * prominent & reactive Agent Title, and refined dropdown integrations.
 * @version 9.0.0
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
import { themeManager } from '@/theme/ThemeManager';

// Core Components
import AnimatedLogo from '@/components/ui/AnimatedLogo.vue';
const UserSettingsDropdown = defineAsyncComponent(() => import('./header/UserSettingsDropdown.vue'));
const VoiceControlsDropdown = defineAsyncComponent(() => import('./header/VoiceControlsDropdown.vue'));
const ThemeSelectionDropdown = defineAsyncComponent(() => import('./header/ThemeSelectionDropdown.vue')); // New
const AgentHub = defineAsyncComponent(() => import('./agents/AgentHub.vue'));
const AgentHubTrigger = defineAsyncComponent(() => import('./header/AgentHubTrigger.vue'));

// Icons
import {
  Bars3Icon, XMarkIcon,
  InformationCircleIcon, Cog8ToothIcon, // For About, Settings links
  SunIcon, MoonIcon, PaintBrushIcon, // For Theme
  ArrowsPointingOutIcon, ArrowsPointingInIcon, // For Fullscreen
  SpeakerWaveIcon, SpeakerXMarkIcon, // For Mute
  Squares2X2Icon, // For Agent Hub trigger
  ClockIcon, TrashIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon, // For mobile nav actions
  LightBulbIcon // For fallback agent icon
} from '@heroicons/vue/24/outline';
import { SparklesIcon as SolidSparklesIcon } from '@heroicons/vue/24/solid'; // Example for a different theme icon

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

// Agent Info
const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);
const agentTitle = computed<string>(() => activeAgent.value?.label || activeAgent.value?.id || (auth.isAuthenticated.value ? 'Dashboard' : 'VCA'));
const agentIconComponent = computed(() => activeAgent.value?.iconComponent || LightBulbIcon ); // Fallback icon

// Header States
const sessionCost = computed(() => costStore.totalSessionCost);
const isFullscreenActive = computed(() => uiStore.isBrowserFullscreenActive);
const isAiStateActive = computed(() => props.isAssistantSpeaking || chatStore.isMainContentStreaming);
const isUserStateActive = computed(() => props.isUserListening && !isAiStateActive.value);

// Mobile Navigation & Agent Hub State
const isMobileMenuOpen = ref(false);
const isAgentHubOpen = ref(false);

// --- Direct Controls State ---
const isGlobalMuteActive = computed({
  get: () => !voiceSettingsManager.settings.autoPlayTts,
  set: (isMuted) => voiceSettingsManager.updateSetting('autoPlayTts', !isMuted)
});
const toggleGlobalMute = () => isGlobalMuteActive.value = !isGlobalMuteActive.value;

const toggleFullscreen = () => uiStore.toggleBrowserFullscreen();

// --- Methods ---
const toggleMobileMenu = () => isMobileMenuOpen.value = !isMobileMenuOpen.value;
const closeMobileMenu = () => isMobileMenuOpen.value = false;

const openAgentHub = () => { closeMobileMenu(); isAgentHubOpen.value = true; };
const closeAgentHub = () => isAgentHubOpen.value = false;

watch(() => router.currentRoute.value, () => {
  closeMobileMenu();
  // Do not close Agent Hub on route change, user might be navigating within a context where hub should persist
});

// Event handlers for actions, ensuring mobile menu closes
const onLogout = () => { closeMobileMenu(); closeAgentHub(); emit('logout'); };
const onClearChatAndSession = () => { closeMobileMenu(); emit('clear-chat-and-session'); };
const onShowPriorChatLog = () => { closeMobileMenu(); emit('show-prior-chat-log'); };

// Specific handlers for mobile nav actions that directly manipulate state
const handleMobileThemeSelection = (themeId: string) => {
    uiStore.setTheme(themeId); // Let ThemeSelectionDropdown use this for direct setting
    // closeMobileMenu(); // Keep mobile menu open to see change or if they want to pick another
};
const handleMobileFullscreen = () => {
    uiStore.toggleBrowserFullscreen();
    // closeMobileMenu();
};
const handleMobileMuteToggle = () => {
    toggleGlobalMute();
    // closeMobileMenu();
};

// Fix: Add missing handler for mobile fullscreen toggle
const handleToggleFullscreenMobile = () => {
    uiStore.toggleBrowserFullscreen();
};


// Body scroll lock management for overlays
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
      'fullscreen-active': isFullscreenActive,
      'ai-speaking-active': isAiStateActive,
      'user-listening-active': isUserStateActive,
      'mobile-menu-is-open': isMobileMenuOpen,
      'agent-hub-is-open': isAgentHubOpen,
    }"
  >
    <div class="header-content-wrapper-ephemeral">
      <!-- {/* === Left Section: Logo & Agent Info === */} -->
      <div class="header-left-section">
        <RouterLink to="/" @click="closeMobileMenu" class="animated-logo-link" aria-label="Voice Chat Assistant Home">
          <!-- {/* AnimatedLogo will handle its own responsiveness for text */} -->
          <AnimatedLogo />
        </RouterLink>
        <div v-if="activeAgent" class="current-agent-display-header">
          <component :is="agentIconComponent" class="agent-icon-header" :class="activeAgent.iconClass" />
          <span class="agent-name-header" :title="activeAgent.label">{{ agentTitle }}</span>
        </div>
      </div>

      <!-- {/* === Center Section: Hearing Status === */} -->
      <div class="header-center-section">
        <div
          class="hearing-icon-wrapper-ephemeral"
          :class="{ 'listening': isUserStateActive, 'speaking': isAiStateActive, 'idle': !isUserStateActive && !isAiStateActive }"
          :title="isUserStateActive ? 'Listening...' : isAiStateActive ? 'Assistant Responding...' : 'Assistant Idle'"
          role="status"
        >
          <img src="@/assets/hearing.svg" alt="Voice activity" class="hearing-icon-svg" />
        </div>
      </div>

      <!-- {/* === Right Section: Desktop Controls === */} -->
      <nav class="header-right-section desktop-controls-ephemeral">
        <Suspense><AgentHubTrigger @open-agent-hub="openAgentHub" class="header-control-item" /></Suspense>
        <Suspense><ThemeSelectionDropdown class="header-control-item" /></Suspense>
        
        <button @click="toggleFullscreen" class="btn btn-ghost-ephemeral btn-icon-ephemeral direct-header-button" :title="isFullscreenActive ? 'Exit Fullscreen' : 'Enter Fullscreen'">
          <component :is="isFullscreenActive ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="icon-base" />
        </button>
        <button @click="toggleGlobalMute" class="btn btn-ghost-ephemeral btn-icon-ephemeral direct-header-button" :title="isGlobalMuteActive ? 'Unmute Speech' : 'Mute Speech'">
          <component :is="isGlobalMuteActive ? SpeakerXMarkIcon : SpeakerWaveIcon" class="icon-base" />
        </button>

        <Suspense><VoiceControlsDropdown class="header-control-item" /></Suspense>
        
        <div v-if="auth.isAuthenticated.value" class="session-cost-display-ephemeral header-control-item" title="Session Cost">
          ${{ sessionCost.toFixed(3) }}
        </div>

        <Suspense>
          <UserSettingsDropdown
            @clear-chat-and-session="onClearChatAndSession"
            @show-prior-chat-log="onShowPriorChatLog"
            @logout="onLogout"
            class="header-control-item"
          />
        </Suspense>
      </nav>

      <!-- {/* === Mobile Menu Trigger === */} -->
      <div class="mobile-menu-trigger-wrapper-ephemeral">
        <button @click="toggleMobileMenu" class="btn btn-ghost-ephemeral btn-icon-ephemeral mobile-menu-trigger-button" :aria-expanded="isMobileMenuOpen">
          <XMarkIcon v-if="isMobileMenuOpen" class="icon-base" />
          <Bars3Icon v-else class="icon-base" />
        </button>
      </div>
    </div>

    <!-- {/* === Mobile Navigation Panel === */} -->
    <Transition name="mobile-nav-slide-from-right"> 
      <!-- {/* More descriptive transition name */} -->
      <nav v-if="isMobileMenuOpen" class="mobile-nav-panel-ephemeral" aria-label="Mobile navigation">
        <div class="mobile-nav-header">
            <AnimatedLogo appNameMain="VCA" :is-mobile-context="true" class="mobile-nav-logo"/>
            <div v-if="activeAgent" class="mobile-nav-agent-title-compact">
                <component :is="agentIconComponent" class="agent-icon-mobile-nav" :class="activeAgent.iconClass" />
                <span>{{ agentTitle }}</span>
            </div>
            <button @click="closeMobileMenu" class="btn btn-ghost-ephemeral btn-icon-ephemeral mobile-nav-close-button">
                <XMarkIcon class="icon-base" />
            </button>
        </div>
        <div class="mobile-nav-content-ephemeral custom-scrollbar-thin">
          <!-- {/* Agent Hub Trigger */} -->
          <button @click="openAgentHub" class="mobile-nav-item group prominent-action">
            <Squares2X2Icon class="nav-item-icon"/> Explore VCA Catalog
          </button>
          <div class="mobile-nav-divider"></div>

          <!-- {/* Main Navigation */} -->
          <RouterLink to="/about" class="mobile-nav-item group" @click="closeMobileMenu">
            <InformationCircleIcon class="nav-item-icon"/>About VCA
          </RouterLink>
          <RouterLink to="/settings" class="mobile-nav-item group" @click="closeMobileMenu">
            <Cog8ToothIcon class="nav-item-icon"/>App Settings
          </RouterLink>

          <div class="mobile-nav-divider"></div>
          <div class="mobile-nav-section-title">Display & Sound</div>
          <!-- {/* Mobile Theme Selection - simplified or full dropdown component if it fits */} -->
           <div class="theme-selector-grid-mobile">
              <button
                v-for="theme in themeManager.getAvailableThemes()" :key="theme.id"
                @click="uiStore.setTheme(theme.id)"
                class="mobile-nav-item theme-button-mobile"
                :class="{ 'active': uiStore.currentThemeId === theme.id }"
              >
                <component :is="theme.isDark ? MoonIcon : SunIcon" class="nav-item-icon mini-icon"/> {{ theme.name }}
                <CheckIcon v-if="uiStore.currentThemeId === theme.id" class="checkmark-icon-mobile"/>
              </button>
            </div>

          <button @click="handleToggleFullscreenMobile" class="mobile-nav-item group">
            <component :is="isFullscreenActive ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="nav-item-icon"/>
            {{ isFullscreenActive ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
          </button>
           <button @click="handleMobileMuteToggle" class="mobile-nav-item group">
            <component :is="isGlobalMuteActive ? SpeakerXMarkIcon : SpeakerWaveIcon" class="nav-item-icon" />
            {{ isGlobalMuteActive ? 'Unmute Speech' : 'Mute Speech' }}
          </button>

          {/* Session & Auth controls */}
          <template v-if="auth.isAuthenticated.value">
            <div class="mobile-nav-divider"></div>
            <div class="mobile-nav-section-title">Session</div>
            <button @click="onClearChatAndSession" class="mobile-nav-item group">
              <TrashIcon class="nav-item-icon"/>Clear Session
            </button>
             <button @click="onShowPriorChatLog" class="mobile-nav-item group">
              <ClockIcon class="nav-item-icon"/>Chat History
            </button>
            <div class="mobile-nav-divider"></div>
            <button @click="onLogout" class="mobile-nav-item group logout-item">
              <ArrowRightOnRectangleIcon class="nav-item-icon"/>Logout
            </button>
          </template>
          <template v-else>
            <div class="mobile-nav-divider"></div>
            <RouterLink to="/login" class="mobile-nav-item group login-item" @click="closeMobileMenu">
              <ArrowLeftOnRectangleIcon class="nav-item-icon"/>Login / Sign Up
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