<template>
  <header
    class="app-header sticky top-0 z-[var(--z-index-header,1000)] transition-all duration-300 backdrop-blur-md border-b"
    :class="headerClasses"
    data-voice-target-region="application-header"
  >
    <div class="app-container mx-auto px-4 sm:px-6" v-show="!uiStore.isFullscreen || isMobileNavOpen">
      <div class="flex items-center justify-between h-16 md:h-20">
        <div class="flex items-center">
          <router-link
            :to="{ name: 'Home' }"
            class="flex items-center gap-3 group"
            :aria-label="t('navigation.navigateToHome')"
            :data-voice-target="voiceTargetIdPrefix + 'logo-home-link'"
          >
            <div class="logo-container relative w-8 h-8 sm:w-10 sm:h-10 group-hover:opacity-80 transition-opacity">
              <img src="/src/assets/logo.svg" :alt="t('app.name') + ' Logo'" class="w-full h-full" />
              <div class="absolute inset-0 rounded-full logo-pulse-effect"></div>
            </div>
            <div class="hidden md:block">
              <h1 class="text-xl font-semibold header-title">
                {{ t('app.namePart1') }} <span class="header-title-accent font-bold">{{ t('app.namePart2') }}</span>
              </h1>
              <p class="text-xs header-subtitle">{{ t('app.tagline') }}</p>
            </div>
            <span class="md:hidden text-lg font-bold header-title-mobile">{{ t('app.shortName') }}</span>
          </router-link>
        </div>

        <nav class="hidden lg:flex items-center gap-x-3 xl:gap-x-5" aria-label="Main desktop navigation">
          <HeaderModeSelector :voice-target-id-prefix="voiceTargetIdPrefix + 'mode-selector-'" />
          <HeaderLanguageSelector v-if="chatSettingsStore.currentMode === AssistantMode.CODING" :voice-target-id-prefix="voiceTargetIdPrefix + 'language-selector-'" />
          <HeaderQuickToggles :voice-target-id-prefix="voiceTargetIdPrefix + 'quick-toggles-'" />
        </nav>

        <div class="flex items-center gap-2 sm:gap-3">
          <HeaderCostDisplay :voice-target-id-prefix="voiceTargetIdPrefix + 'cost-display-'" />

          <div class="hidden md:flex items-center gap-1">
            <AppButton
              variant="tertiary" size="sm" :pill="true" :icon="TrashIcon"
              :aria-label="t('header.clearChat')" :title="t('header.clearChat')"
              :data-voice-target="voiceTargetIdPrefix + 'clear-chat-button'"
              @click="handleClearChat"
            />
            <AppButton
              variant="tertiary" size="sm" :pill="true"
              :icon="uiStore.isFullscreen ? ArrowsPointingInIcon : ArrowsPointingOutIcon"
              :aria-label="uiStore.isFullscreen ? t('header.exitFullscreen') : t('header.enterFullscreen')"
              :title="uiStore.isFullscreen ? t('header.exitFullscreen') : t('header.enterFullscreen')"
              :data-voice-target="voiceTargetIdPrefix + 'fullscreen-button'"
              @click="handleToggleFullscreen"
            />
            <AppButton
              variant="tertiary" size="sm" :pill="true"
              :icon="uiStore.currentTheme === AppTheme.DARK || uiStore.currentTheme === AppTheme.HOLOGRAPHIC ? SunIcon : MoonIcon"
              :aria-label="t('header.toggleTheme')" :title="t('header.toggleTheme')"
              :data-voice-target="voiceTargetIdPrefix + 'theme-button'"
              @click="handleToggleTheme"
            />
             <router-link :to="{ name: 'Settings' }" :data-voice-target="voiceTargetIdPrefix + 'settings-link'">
                <AppButton variant="tertiary" size="sm" :pill="true" :icon="CogIcon" :aria-label="t('navigation.settings')" :title="t('navigation.settings')" />
            </router-link>
             <router-link :to="{ name: 'About' }" :data-voice-target="voiceTargetIdPrefix + 'about-link'">
                <AppButton variant="tertiary" size="sm" :pill="true" :icon="InformationCircleIcon" :aria-label="t('navigation.about')" :title="t('navigation.about')" />
            </router-link>
            <AppButton v-if="authStore.isAuthenticated"
              variant="tertiary" size="sm" :pill="true" :icon="ArrowRightOnRectangleIcon"
              :aria-label="t('auth.logout')" :title="t('auth.logout')"
              :data-voice-target="voiceTargetIdPrefix + 'logout-button'"
              @click="handleLogout"
            />
          </div>

          <AppButton
            variant="tertiary" size="sm" :pill="true"
            :icon="isMobileNavOpen ? XMarkIcon : Bars3Icon"
            class="lg:hidden"
            :aria-label="isMobileNavOpen ? t('header.closeMenu') : t('header.openMenu')"
            :aria-expanded="isMobileNavOpen"
            aria-controls="mobile-navigation-panel"
            :data-voice-target="voiceTargetIdPrefix + 'mobile-menu-button'"
            @click="toggleMobileNav"
          />
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-show="isMobileNavOpen"
        id="mobile-navigation-panel"
        class="lg:hidden mobile-nav-panel"
        role="dialog"
        aria-modal="true"
      >
        <div class="p-4 space-y-6">
            <HeaderModeSelector :is-mobile="true" :voice-target-id-prefix="voiceTargetIdPrefix + 'mobile-mode-selector-'" @mode-selected="closeMobileNav" />
            <HeaderLanguageSelector v-if="chatSettingsStore.currentMode === AssistantMode.CODING" :is-mobile="true" :voice-target-id-prefix="voiceTargetIdPrefix + 'mobile-language-selector-'" @language-selected="closeMobileNav" />
            <HeaderAudioModeSelector :is-mobile="true" :voice-target-id-prefix="voiceTargetIdPrefix + 'mobile-audio-selector-'" @audio-mode-selected="closeMobileNav" />
            <HeaderQuickToggles :is-mobile="true" :voice-target-id-prefix="voiceTargetIdPrefix + 'mobile-quick-toggles-'" />

            <div class="grid grid-cols-3 gap-3 pt-4 border-t main-nav-mobile-border">
                <AppButton variant="tertiary" size="sm" :icon="TrashIcon" :label="t('header.clearChatShort')" class="flex-col" :data-voice-target="voiceTargetIdPrefix + 'mobile-clear-chat'" @click="handleClearChat(); closeMobileNav()" />
                <AppButton variant="tertiary" size="sm" :icon="uiStore.isFullscreen ? ArrowsPointingInIcon : ArrowsPointingOutIcon" :label="uiStore.isFullscreen ? t('header.exitFSShort') : t('header.fullscreenShort')" class="flex-col" :data-voice-target="voiceTargetIdPrefix + 'mobile-fullscreen'" @click="handleToggleFullscreen(); closeMobileNav()" />
                <AppButton variant="tertiary" size="sm" :icon="uiStore.currentTheme === AppTheme.DARK || uiStore.currentTheme === AppTheme.HOLOGRAPHIC ? SunIcon : MoonIcon" :label="t('header.themeShort')" class="flex-col" :data-voice-target="voiceTargetIdPrefix + 'mobile-theme'" @click="handleToggleTheme(); closeMobileNav()" />
                <router-link :to="{ name: 'Settings' }" class="mobile-nav-router-link" :data-voice-target="voiceTargetIdPrefix + 'mobile-settings-link'" @click="closeMobileNav"><AppButton variant="tertiary" size="sm" :icon="CogIcon" :label="t('navigation.settings')" class="flex-col w-full" /></router-link>
                <router-link :to="{ name: 'About' }" class="mobile-nav-router-link" :data-voice-target="voiceTargetIdPrefix + 'mobile-about-link'" @click="closeMobileNav"><AppButton variant="tertiary" size="sm" :icon="InformationCircleIcon" :label="t('navigation.about')" class="flex-col w-full" /></router-link>
                <AppButton v-if="authStore.isAuthenticated" variant="tertiary" size="sm" :icon="ArrowRightOnRectangleIcon" :label="t('auth.logout')" class="flex-col text-danger-500" :data-voice-target="voiceTargetIdPrefix + 'mobile-logout'" @click="handleLogout(); closeMobileNav()" />
                <router-link v-else :to="{ name: 'Login' }" class="mobile-nav-router-link" :data-voice-target="voiceTargetIdPrefix + 'mobile-login-link'" @click="closeMobileNav"><AppButton variant="primary" size="sm" :label="t('auth.login')" class="flex-col w-full col-span-3 mt-2" /></router-link>
            </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
/**
 * @file AppHeader.vue
 * @description Global application header component. Provides navigation, branding,
 * theme toggling, mode selection, and other key application-wide actions.
 * Fully themeable, responsive, and voice-navigable.
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import {
  Bars3Icon, XMarkIcon, TrashIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon,
  SunIcon, MoonIcon, CogIcon, InformationCircleIcon, ArrowRightOnRectangleIcon,
  // Icons for modes will be handled by sub-components or dynamically
} from '@heroicons/vue/24/outline';
import { useI18n } from '../../composables/useI18n';
import { useUiStore } from '../../store/ui.store';
import { useAuthStore } from '../../features/auth/store/auth.store';
import { useChatSettingsStore, AssistantMode } from '../../features/chat/store/chatSettings.store';
import AppButton from '../common/AppButton.vue';
// Import sub-components for header sections
import HeaderModeSelector from './HeaderModeSelector.vue';
import HeaderLanguageSelector from './HeaderLanguageSelector.vue';
import HeaderQuickToggles from './HeaderQuickToggles.vue';
import HeaderCostDisplay from './HeaderCostDisplay.vue';
import HeaderAudioModeSelector from './HeaderAudioModeSelector.vue'; // New sub-component
import { AppTheme } from '../../types/ui.types';

const props = defineProps({
  /**
   * Optional prefix for all voice target IDs within this header.
   * Useful if multiple headers could exist or for more specific targeting.
   */
  voiceTargetIdPrefix: {
    type: String,
    default: 'app-header-',
  }
});

const emit = defineEmits<{
  /** Emitted when the mobile sidebar should be toggled (typically handled by MainLayout). */
  (e: 'toggle-sidebar'): void;
}>();

const { t } = useI18n();
const uiStore = useUiStore();
const authStore = useAuthStore();
const chatSettingsStore = useChatSettingsStore();

const isMobileNavOpen = ref(false);

/** Dynamic classes for the header based on fullscreen and mobile nav state. */
const headerClasses = computed(() => {
  // Use CSS custom properties for background colors
  const baseBgClass = 'app-header-bg'; // This class would define background using CSS vars
  const borderClass = 'app-header-border'; // This class for border color using CSS vars

  if (uiStore.isFullscreen) {
    return isMobileNavOpen.value ? [baseBgClass, borderClass, 'is-fullscreen-mobile-nav-open'] : ['is-fullscreen', 'bg-transparent'];
  }
  return [baseBgClass, borderClass];
});

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
  uiStore.setScrollLock(isMobileNavOpen.value); // Lock scroll when mobile nav is open
};
const closeMobileNav = () => {
    isMobileNavOpen.value = false;
    uiStore.setScrollLock(false);
}

const handleToggleTheme = () => {
  let nextTheme: AppTheme;
  // Cycle through themes: LIGHT -> DARK -> HOLOGRAPHIC -> LIGHT
  if (uiStore.currentTheme === AppTheme.LIGHT) nextTheme = AppTheme.DARK;
  else if (uiStore.currentTheme === AppTheme.DARK) nextTheme = AppTheme.HOLOGRAPHIC;
  else nextTheme = AppTheme.LIGHT;
  uiStore.setTheme(nextTheme);
};

const handleToggleFullscreen = () => {
  uiStore.isFullscreen = !uiStore.isFullscreen; // Assuming isFullscreen is a direct state in UiStore
  // Actual fullscreen API call would happen in a service or composable
  // e.g., useFullscreen().toggle();
  if (typeof document !== 'undefined') {
    if (!document.fullscreenElement && uiStore.isFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen && !uiStore.isFullscreen) {
      document.exitFullscreen();
    }
  }
};

const handleClearChat = () => {
  // This should typically dispatch an action to a chat store
  // e.g., useChatStore().clearMessages();
  console.log('[AppHeader] Clear chat action triggered');
  // For now, let's assume it emits an event if no chat store is fully implemented here.
  // Placeholder: useUiStore().addNotification({ message: 'Chat cleared (simulated).', type: 'info'});
  emit('clear-chat'); // If parent needs to handle
};

const handleLogout = async () => {
  await authStore.logout(); // Auth store handles navigation
};

// Close mobile nav on click outside (if needed, though usually links navigate away)
const headerRef = ref<HTMLElement | null>(null); // Add ref="headerRef" to the <header> element
// const handleClickOutside = (event: MouseEvent) => {
//   if (isMobileNavOpen.value && headerRef.value && !headerRef.value.contains(event.target as Node)) {
//     closeMobileNav();
//   }
// };
// onMounted(() => document.addEventListener('click', handleClickOutside));
// onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
/* Use CSS Custom Properties for themeable elements */
.app-header {
  border-bottom-color: var(--app-border-color-light, var(--app-border-color)); /* Slightly lighter border */
}
.app-header-bg {
  background-color: var(--app-header-background, var(--app-surface-color-transparent)); /* e.g., white/95 or gray-900/95 */
}
.app-header.is-fullscreen-mobile-nav-open {
    background-color: var(--app-header-background-opaque, var(--app-surface-color));
}
.app-header-border {
  border-bottom-color: var(--app-border-color);
}

.logo-pulse-effect {
  /* Themeable pulse using CSS variables */
  background-image: linear-gradient(
    to bottom right,
    var(--app-pulse-color-start, rgba(var(--app-primary-rgb), 0.2)),
    var(--app-pulse-color-end, rgba(var(--app-accent-rgb), 0.2))
  );
  animation: pulse-soft 3s infinite ease-in-out;
}
@keyframes pulse-soft {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.header-title { color: var(--app-header-title-color, var(--app-text-color)); }
.header-title-accent { color: var(--app-header-title-accent-color, var(--app-primary-color)); } /* Use a specific var or primary */
.header-subtitle { color: var(--app-header-subtitle-color, var(--app-text-secondary-color)); }
.header-title-mobile { color: var(--app-header-title-mobile-color, var(--app-text-color)); }


.mobile-nav-panel {
  background-color: var(--app-mobile-nav-bg, var(--app-surface-color));
  border-top-color: var(--app-mobile-nav-border, var(--app-border-color));
  /* For a "glass" effect on mobile nav when open */
  /* backdrop-filter: blur(var(--app-blur-md)); */
  /* background-color: var(--app-surface-color-transparent-heavy); */
  max-height: calc(100vh - 4rem); /* Adjust based on header height */
  overflow-y: auto;
}

.main-nav-mobile-border {
    border-top-color: var(--app-border-color-subtle);
}

.mobile-nav-router-link .app-button {
    justify-content: center; /* Center content for column flex */
}
.mobile-nav-router-link .app-button :deep(.button-text) {
    font-size: var(--app-font-size-xs); /* Smaller text for mobile actions */
}
.mobile-nav-router-link .app-button :deep(.button-icon-wrapper) {
    margin-bottom: 0.25rem; /* Space between icon and text in column flex */
}

/* Example for Holographic theme specific overrides if needed beyond variables */
.theme-holographic .app-header-bg {
  background-color: var(--app-header-background, rgba(var(--holographic-panel-rgb), 0.85));
  border-bottom-color: var(--holographic-border-translucent, rgba(var(--holographic-accent-rgb), 0.3));
}
.theme-holographic .logo-pulse-effect {
  background-image: linear-gradient(
    to bottom right,
    color-mix(in srgb, var(--holographic-accent) 30%, transparent),
    color-mix(in srgb, var(--holographic-glow-color) 30%, transparent)
  );
   box-shadow: 0 0 10px var(--holographic-glow-color);
}
</style>