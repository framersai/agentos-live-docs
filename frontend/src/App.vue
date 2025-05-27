// File: frontend/src/App.vue
/**
 * @file App.vue
 * @version 4.1.0 - Ephemeral Harmony theme integration.
 * @description Main application shell. Uses global SCSS for styling.
 */
<template>
  <div class="app-shell-ephemeral" :data-theme="uiStore.currentThemeId.value || 'warm-embrace'">
    <div
      v-if="loading.isLoading.value"
      class="loading-overlay-ephemeral"
      role="status"
      aria-live="polite"
      aria-label="Loading application content"
    >
      <div class="loading-animation-content">
        <div class="loading-spinner-ephemeral">
          <div v-for="i in 8" :key="`blade-${i}`" class="spinner-blade-ephemeral"></div>
        </div>
        <p class="loading-text-ephemeral">Initializing Interface...</p>
      </div>
    </div>

    <a href="#main-app-content" class="skip-link-ephemeral">Skip to main content</a>

    <div class="app-layout-ephemeral">
      <AppHeader
        :session-cost="sessionCost"
        :is-user-listening="isUserActuallyListening" :is-assistant-speaking="isAiActuallySpeaking" @toggle-theme="handleToggleTheme"
        @toggle-fullscreen="handleToggleFullscreen"
        @clear-chat-and-session="handleClearChatAndSession"
        @logout="handleLogout"
        @show-prior-chat-log="handleShowPriorChatLog"
        class="app-layout-header-ephemeral"
      />

      <main id="main-app-content" class="app-layout-main-content-ephemeral">
        <router-view v-slot="{ Component, route }">
          <Transition :name="routeTransitionName" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </router-view>
      </main>

      <AppFooter class="app-layout-footer-ephemeral" />
    </div>

    <div
      aria-live="assertive"
      class="toast-notifications-container-ephemeral"
    >
      <TransitionGroup name="toast-transition" tag="div">
        <div
          v-for="toastItem in toastManager.toasts.value"
          :key="toastItem.id"
          class="toast-notification-ephemeral"
          :class="`toast--${toastItem.type}`" 
          role="alertdialog"
          :aria-labelledby="`toast-title-${toastItem.id}`"
          :aria-describedby="toastItem.message ? `toast-message-${toastItem.id}` : undefined"
        >
          <div class="toast-icon-wrapper-ephemeral">
            <component :is="getToastIcon(toastItem.type)" class="toast-icon-svg" aria-hidden="true" />
          </div>
          <div class="toast-content-ephemeral">
            <p :id="`toast-title-${toastItem.id}`" class="toast-title-ephemeral">{{ toastItem.title }}</p>
            <p v-if="toastItem.message" :id="`toast-message-${toastItem.id}`" class="toast-message-ephemeral" v-html="toastItem.message"></p>
          </div>
          <button
            @click="toastManager.remove(toastItem.id)"
            class="toast-close-button-ephemeral"
            :aria-label="`Dismiss notification: ${toastItem.title}`"
          >
            <XMarkIcon class="toast-close-icon-svg" aria-hidden="true" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, provide, readonly, type Component as VueComponent, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/Header.vue';
import AppFooter from '@/components/Footer.vue';

import { useCostStore } from './store/cost.store';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';
import { themeManager } from '@/theme/ThemeManager'; // Import our theme manager
import { useUiStore } from '@/store/ui.store'; // Existing UI store for some states
import { authAPI } from '@/utils/api';
import { AUTH_TOKEN_KEY } from '@/router'; // Assuming router/index.ts exports this
import { voiceSettingsManager } from './services/voice.settings.service';
import { ttsService } from './services/tts.service'; // For isSpeaking state
import { agentService } from '@/services/agent.service'; // Import agentService for default agent

import {
  CheckCircleIcon as SuccessIcon,
  XCircleIcon as ErrorIcon,
  ExclamationTriangleIcon as WarningIcon,
  InformationCircleIcon as InfoIcon,
  XMarkIcon,
} from '@heroicons/vue/24/solid';

// Stores
const router = useRouter();
const costStore = useCostStore();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const uiStoreFromPinia = useUiStore(); // Use the Pinia store for fullscreen etc.

// Loading State
const isLoadingApp = ref<boolean>(true);
provide('loading', {
  show: () => isLoadingApp.value = true,
  hide: () => isLoadingApp.value = false,
  isLoading: readonly(isLoadingApp)
});
const loading = { isLoading: readonly(isLoadingApp) }; // For local use

// Theme Management
// Provide the reactive currentThemeId from ThemeManager to children if needed
provide('currentThemeId', themeManager.getCurrentThemeId());
// The actual theme class is applied via data-theme on html by ThemeManager

// Expose isDarkMode for components that might still rely on this specific boolean
// though data-theme CSS is preferred.
// This uiStore is for fullscreen, not the main theme directly.
const uiStore = {
    isDarkMode: computed(() => themeManager.getCurrentTheme().value?.isDark || false),
    currentThemeId: themeManager.getCurrentThemeId(), // Expose current theme ID
    isFullscreen: uiStoreFromPinia.isFullscreen, // from Pinia UI store
    showHeaderInFullscreenMinimal: uiStoreFromPinia.showHeaderInFullscreenMinimal, // from Pinia UI store
    isBrowserFullscreenActive: uiStoreFromPinia.isBrowserFullscreenActive, // from Pinia UI store
    toggleTheme: () => { // Allow App.vue to trigger theme change via manager
        const currentId = themeManager.getCurrentThemeId().value;
        // Simple toggle logic: if current is dark-like, switch to light-like, and vice-versa
        // This is a basic example; a theme switcher component would offer more choice.
        if (themeManager.getCurrentTheme().value?.isDark) {
            themeManager.setTheme('aurora-daybreak'); // Default light
        } else {
            themeManager.setTheme('twilight-neo'); // Default dark
        }
    },
    setTheme: themeManager.setTheme, // Expose setTheme
    initializeTheme: themeManager.initialize, // Expose initialize
    toggleFullscreen: uiStoreFromPinia.toggleFullscreen,
    setFullscreen: uiStoreFromPinia.setFullscreen,
    toggleShowHeaderInFullscreenMinimal: uiStoreFromPinia.toggleShowHeaderInFullscreenMinimal,
    setShowHeaderInFullscreenMinimal: uiStoreFromPinia.setShowHeaderInFullscreenMinimal,
    toggleBrowserFullscreen: uiStoreFromPinia.toggleBrowserFullscreen,
};
provide('uiStore', uiStore);


const handleToggleTheme = () => { // This function will be called by AppHeader
  uiStore.toggleTheme(); // Calls the new toggleTheme logic which uses ThemeManager
};

// Fullscreen Management (remains the same, uses uiStoreFromPinia)
const handleToggleFullscreen = () => {
  uiStoreFromPinia.toggleBrowserFullscreen();
};


// Toast Notification System (remains the same)
interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}
const toasts = ref<Toast[]>([]);
let toastIdCounter = 0;
const addToast = (toastDetails: Omit<Toast, 'id'>): number => {
  const id = toastIdCounter++;
  const newToast: Toast = {
    id, ...toastDetails,
    duration: toastDetails.duration === undefined ? 7000 : toastDetails.duration,
  };
  toasts.value.unshift(newToast);
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => removeToast(id), newToast.duration);
  }
  return id;
};
const removeToast = (id: number): void => {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index !== -1) toasts.value.splice(index, 1);
};
const toastManager = { add: addToast, remove: removeToast, toasts: readonly(toasts) };
provide('toast', toastManager);

const getToastIcon = (type: Toast['type']): VueComponent => {
  switch (type) {
    case 'success': return SuccessIcon;
    case 'error': return ErrorIcon;
    case 'warning': return WarningIcon;
    default: return InfoIcon;
  }
};

// Session & Chat Management (remains the same)
const sessionCost = computed(() => costStore.totalSessionCost);
const handleClearChatAndSession = async () => {
  addToast({ type: 'info', title: 'Clearing Session', message: 'Wiping chat history and session costs...' });
  if (agentStore.activeAgentId) {
    await chatStore.clearAgentData(agentStore.activeAgentId);
    chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
  }
  await costStore.resetSessionCost();
  addToast({ type: 'success', title: 'Session Cleared', message: 'Chat and costs for current agent reset.' });
};
const handleLogout = async () => {
  addToast({ type: 'info', title: 'Logging Out', message: 'Please wait...' });
  try { await authAPI.logout(); }
  catch (error) { console.warn('[App.vue] Backend logout failed:', error); }
  finally {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    costStore.$reset(); chatStore.$reset(); agentStore.$reset(); uiStoreFromPinia.$reset();
    // After resetting Pinia UI store, re-initialize theme manager's state if needed
    // or ensure Pinia UI store doesn't conflict with ThemeManager's localStorage for theme ID.
    // ThemeManager handles its own persistence for 'vca-ephemeral-harmony-theme-v2'.
    addToast({ type: 'success', title: 'Logged Out', message: 'Successfully logged out.' });
    router.push({ name: 'Login' }).catch(err => console.error("[App.vue] Router push to Login failed:", err));
  }
};
const handleShowPriorChatLog = () => {
  addToast({ type: 'info', title: 'Feature Pending', message: 'Full chat history log viewer is planned.' });
};

// Router Transition Logic (remains the same)
const routeTransitionName = ref('page-fade');
router.beforeEach((to, _from, next) => {
  isLoadingApp.value = true;
  // Update route transition based on meta field
  if (to.meta.transition && typeof to.meta.transition === 'string') {
    routeTransitionName.value = to.meta.transition;
  } else {
    routeTransitionName.value = 'page-fade'; // Default
  }
  next();
});
router.afterEach(() => {
  setTimeout(() => { isLoadingApp.value = false; }, 300); // Slightly adjusted for theme
});
router.onError((error) => {
  console.error('[App.vue] Router Error:', error);
  isLoadingApp.value = false;
  addToast({ type: 'error', title: 'Navigation Error', message: error.message || 'Could not load page.', duration: 7000 });
});

// Voice Activity States for Header
// These would ideally come from a more central voice processing state service/store
// For now, we can derive them or pass them up from VoiceInput.vue if it holds the primary state.
// Let's assume VoiceInput will emit 'processing-audio' events.
const isUserActuallyListening = ref(false); // This needs to be updated by VoiceInput state
const isAiActuallySpeaking = computed(() => ttsService.isSpeaking());


// Lifecycle Hooks
onMounted(async () => {
  console.log('[App.vue] Ephemeral Harmony mounted. Initializing services.');
  themeManager.initialize(); // Initialize our new theme manager
  await voiceSettingsManager.initialize();

  if (costStore.totalSessionCost === 0 && !costStore.isLoadingCost) {
    costStore.fetchSessionCost();
  }
  if (agentStore.activeAgentId) {
    chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
  } else {
    // Fallback if no active agent somehow (should be handled by agentStore init)
    const defaultAgent = agentService.getDefaultAgent();
    agentStore.setActiveAgent(defaultAgent.id);
    chatStore.ensureMainContentForAgent(defaultAgent.id);
  }

  isLoadingApp.value = true;
  setTimeout(() => { isLoadingApp.value = false; }, 450); // Adjusted for theme

  const hasVisitedKey = 'vcaHasVisited_EphemeralHarmony_v1';
  if (!localStorage.getItem(hasVisitedKey)) {
    setTimeout(() => {
      addToast({
        type: 'info',
        title: 'Welcome to Ephemeral Harmony!',
        message: 'Experience the redesigned Voice Chat Assistant, inspired by fluidity and light.',
        duration: 9000
      });
      localStorage.setItem(hasVisitedKey, 'true');
    }, 1500);
  }
});

// Watcher to update the data-theme attribute on html whenever themeManager's currentThemeId changes
// This ensures Tailwind's darkMode: 'class' (if it targets html[data-theme='...dark...']) or our SCSS works.
// ThemeManager already does this, so this might be redundant unless specific interop is needed.
// Forcing Pinia's isDarkMode to sync with ThemeManager
watch(themeManager.getCurrentTheme(), (newThemeDef) => {
    if (newThemeDef && uiStoreFromPinia.isDarkMode !== newThemeDef.isDark) {
        // This syncs Pinia's isDarkMode if other parts of app rely on it for simple dark mode checks
        // but primary theme control is via data-theme and ThemeManager
        console.log(`[App.vue] Syncing Pinia's isDarkMode with ThemeManager. New theme: ${newThemeDef.name}, isDark: ${newThemeDef.isDark}`);
        // uiStoreFromPinia.setTheme(newThemeDef.isDark ? 'dark' : 'light'); // If uiStoreFromPinia had such a method
    }
}, { immediate: true });


// TODO: Get actual user listening state, e.g., from VoiceInput.vue via an event or a shared service/store
// For demonstration, you might add a provide/inject for VoiceInput to update this ref.
// provide('updateUserListeningState', (isListening: boolean) => {
//   isUserActuallyListening.value = isListening;
// });

</script>

<style lang="scss">
// Global styles are now primarily in main.scss and its imported partials.
// This <style> block can be removed if no App.vue specific, unscoped styles are needed.
// If some very specific App.vue shell styles are needed that don't fit _app.scss,
// they could remain here, but it's generally cleaner to centralize.

// Example: If you had specific overrides for a Tailwind class just for App.vue context
// .app-shell-ephemeral {
//   .some-tailwind-class-to-override {
//     @apply new-utility another-utility;
//   }
// }
</style>