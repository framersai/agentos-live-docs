// File: frontend/src/components/header/MobileNavPanel.vue
/**
 * @file MobileNavPanel.vue
 * @version 1.1.0
 * @description A dedicated full-screen navigation panel for mobile views.
 * Refined item structure for cleaner icon and text alignment.
 * Contains navigation links, theme selection, user actions, and session information.
 * Designed for the "Ephemeral Harmony" aesthetic with smooth transitions.
 */
<script setup lang="ts">
import { computed, type PropType, type Component as VueComponentType, type FunctionalComponent, type DefineComponent } from 'vue';
import { RouterLink } from 'vue-router';
import { useUiStore } from '@/store/ui.store';
import { themeManager, type ThemeDefinition } from '@/theme/ThemeManager';
import type { IAgentDefinition } from '@/services/agent.service';

// Components
import AnimatedLogo from '@/components/ui/AnimatedLogo.vue';

// Icons
import {
  XMarkIcon, InformationCircleIcon, Cog8ToothIcon, SunIcon, MoonIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon, SpeakerWaveIcon, SpeakerXMarkIcon,
  Squares2X2Icon, ClockIcon, TrashIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon,
  UserCircleIcon, CheckIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  isOpen: { type: Boolean as PropType<boolean>, required: true },
  isUserListening: { type: Boolean as PropType<boolean>, default: false },
  isAiStateActive: { type: Boolean as PropType<boolean>, default: false },
  activeAgent: { type: Object as PropType<IAgentDefinition | undefined>, default: undefined },
  agentTitle: { type: String as PropType<string>, required: true },
  agentIconComponent: { type: [Object, Function] as PropType<VueComponentType | FunctionalComponent | DefineComponent>, required: true },
  isAuthenticated: { type: Boolean as PropType<boolean>, required: true },
  sessionCost: { type: Number as PropType<number>, required: true },
  isFullscreenActiveForUI: { type: Boolean as PropType<boolean>, required: true },
  isGlobalMuteActiveProp: { type: Boolean as PropType<boolean>, required: true },
});

const emit = defineEmits<{
  (e: 'close-panel'): void;
  (e: 'open-agent-hub'): void;
  (e: 'toggle-fullscreen'): void;
  (e: 'toggle-global-mute'): void;
  (e: 'clear-chat-and-session'): void;
  (e: 'show-prior-chat-log'): void;
  (e: 'logout'): void;
}>();

const uiStore = useUiStore();

const localIsGlobalMuteActive = computed({
    get: () => props.isGlobalMuteActiveProp,
    set: () => emit('toggle-global-mute')
});

const closeAndNavigate = () => {
  emit('close-panel');
};
</script>

<template>
  <Transition name="mobile-nav-slide-from-right-ephemeral">
    <nav
      v-if="isOpen"
      id="mobile-navigation-panel"
      class="mobile-nav-panel-ephemeral"
      aria-label="Mobile navigation"
      aria-modal="true"
      role="dialog"
    >
      <div class="mobile-nav-header-ephemeral">
        <RouterLink to="/" @click="closeAndNavigate" class="animated-logo-link">
          <AnimatedLogo
            appNameMain="VCA"
            :is-mobile-context="true"
            class="mobile-nav-logo"
            :is-user-listening="props.isUserListening"
            :is-ai-speaking-or-processing="props.isAiStateActive"
          />
        </RouterLink>
        <div v-if="props.activeAgent && props.isAuthenticated" class="mobile-nav-agent-title-compact">
          <component :is="props.agentIconComponent" class="agent-icon-mobile-nav" :class="props.activeAgent.iconClass" aria-hidden="true" />
          <span class="agent-title-text">{{ props.agentTitle }}</span>
        </div>
        <button @click="emit('close-panel')" class="mobile-nav-close-button btn btn-ghost-ephemeral btn-icon-ephemeral" aria-label="Close mobile menu">
          <XMarkIcon class="icon-base" />
        </button>
      </div>

      <div class="mobile-nav-content-ephemeral custom-scrollbar-thin-ephemeral">
        <button v-if="props.isAuthenticated" @click="emit('open-agent-hub'); closeAndNavigate();" class="mobile-nav-item-ephemeral group prominent-action">
          <Squares2X2Icon class="nav-item-icon" aria-hidden="true"/>
          <span class="nav-item-text">Explore Assistants</span>
        </button>
        <div v-if="props.isAuthenticated" class="mobile-nav-divider-ephemeral"></div>

        <RouterLink to="/settings" class="mobile-nav-item-ephemeral group" @click="closeAndNavigate">
          <Cog8ToothIcon class="nav-item-icon" aria-hidden="true"/>
          <span class="nav-item-text">App Settings</span>
        </RouterLink>
        <RouterLink to="/about" class="mobile-nav-item-ephemeral group" @click="closeAndNavigate">
          <InformationCircleIcon class="nav-item-icon" aria-hidden="true"/>
          <span class="nav-item-text">About VCA</span>
        </RouterLink>

        <div class="mobile-nav-divider-ephemeral"></div>
        <div class="mobile-nav-section-title-ephemeral">Display & Sound</div>
        <div class="theme-selector-grid-mobile" role="radiogroup" aria-labelledby="mobile-theme-select-label">
          <span id="mobile-theme-select-label" class="sr-only">Select a theme</span>
          <button
            v-for="theme in themeManager.getAvailableThemes()" :key="theme.id"
            @click="uiStore.setTheme(theme.id);"
            class="mobile-nav-item-ephemeral theme-button-mobile"
            :class="{ 'active': uiStore.currentThemeId === theme.id }"
            role="radio" :aria-checked="uiStore.currentThemeId === theme.id"
          >
            <component :is="theme.isDark ? MoonIcon : SunIcon" class="nav-item-icon mini-icon" aria-hidden="true"/>
            <span class="nav-item-text theme-name-text">{{ theme.name }}</span>
            <CheckIcon v-if="uiStore.currentThemeId === theme.id" class="checkmark-icon-mobile" aria-hidden="true"/>
          </button>
        </div>

        <button @click="emit('toggle-fullscreen')" class="mobile-nav-item-ephemeral group">
          <component :is="props.isFullscreenActiveForUI ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="nav-item-icon" aria-hidden="true"/>
          <span class="nav-item-text">{{ props.isFullscreenActiveForUI ? 'Exit Fullscreen' : 'Enter Fullscreen' }}</span>
        </button>
        <button @click="localIsGlobalMuteActive = !localIsGlobalMuteActive" class="mobile-nav-item-ephemeral group">
          <component :is="props.isGlobalMuteActiveProp ? SpeakerXMarkIcon : SpeakerWaveIcon" class="nav-item-icon" aria-hidden="true" />
          <span class="nav-item-text">{{ props.isGlobalMuteActiveProp ? 'Unmute Speech' : 'Mute Speech' }}</span>
        </button>
        <RouterLink :to="{ name: 'Settings', hash: '#audio-voice-settings'}" class="mobile-nav-item-ephemeral group" @click="closeAndNavigate">
          <SpeakerWaveIcon class="nav-item-icon" aria-hidden="true"/>
          <span class="nav-item-text">Full Voice Settings</span>
        </RouterLink>

        <template v-if="props.isAuthenticated">
          <div class="mobile-nav-divider-ephemeral"></div>
          <div class="mobile-nav-section-title-ephemeral">Session & Account</div>
          <div class="mobile-nav-item-static">
            Session Cost: ${{ props.sessionCost.toFixed(3) }}
          </div>
          <button @click="emit('clear-chat-and-session'); closeAndNavigate();" class="mobile-nav-item-ephemeral group">
            <TrashIcon class="nav-item-icon" aria-hidden="true"/>
            <span class="nav-item-text">Clear Session</span>
          </button>
          <button @click="emit('show-prior-chat-log'); closeAndNavigate();" class="mobile-nav-item-ephemeral group">
            <ClockIcon class="nav-item-icon" aria-hidden="true"/>
            <span class="nav-item-text">View Chat History</span>
          </button>
          <RouterLink :to="{ name: 'Settings', hash: '#user-preferences'}" class="mobile-nav-item-ephemeral group" @click="closeAndNavigate">
            <UserCircleIcon class="nav-item-icon" aria-hidden="true"/>
            <span class="nav-item-text">User Preferences</span>
          </RouterLink>
          <div class="mobile-nav-divider-ephemeral"></div>
          <button @click="emit('logout'); closeAndNavigate();" class="mobile-nav-item-ephemeral group logout-item">
            <ArrowRightOnRectangleIcon class="nav-item-icon" aria-hidden="true"/>
            <span class="nav-item-text">Logout</span>
          </button>
        </template>
        <template v-else>
          <div class="mobile-nav-divider-ephemeral"></div>
          <RouterLink to="/login" class="mobile-nav-item-ephemeral group login-item prominent-action" @click="closeAndNavigate">
            <ArrowLeftOnRectangleIcon class="nav-item-icon" aria-hidden="true"/>
            <span class="nav-item-text">Login / Sign Up</span>
          </RouterLink>
        </template>
      </div>
    </nav>
  </Transition>
</template>

<style lang="scss" scoped>
// Minimal scoped styles, primary styling in _header.scss
.mobile-nav-panel-ephemeral {
  // Ensure this class matches the one in _header.scss
}

.mobile-nav-slide-from-right-ephemeral-enter-active,
.mobile-nav-slide-from-right-ephemeral-leave-active {
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s ease-out;
}
.mobile-nav-slide-from-right-ephemeral-enter-from,
.mobile-nav-slide-from-right-ephemeral-leave-to {
  transform: translateX(100%);
  opacity: 0.7;
}
</style>