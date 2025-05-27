// File: frontend/src/App.vue
/**
 * @file App.vue
 * @version 4.0.0
 * @description Main application shell. Integrates updated stores and provides global UI elements
 * with the new "Holographic Analog" theme.
 * V4.0.0: Complete visual overhaul. Updated loading overlay, skip-link, and toast notification styles.
 */

<template>
  <div :class="['app-shell', uiStore.isDarkMode ? 'dark' : 'light']">
    <div
      v-if="loading.isLoading.value"
      class="loading-overlay"
      role="status"
      aria-live="polite"
      aria-label="Loading application content"
    >
      <div class="loading-animation">
        <div class="loading-spinner">
          <div v-for="i in 8" :key="`blade-${i}`" class="spinner-blade"></div>
        </div>
        <p class="loading-text">Initializing Interface...</p>
      </div>
    </div>

    <a href="#main-app-content" class="skip-link">Skip to main content</a>

    <div class="app-layout">
      <AppHeader
        :session-cost="sessionCost"
        @toggle-theme="handleToggleTheme"
        @toggle-fullscreen="handleToggleFullscreen"
        @clear-chat-and-session="handleClearChatAndSession"
        @logout="handleLogout"
        @show-prior-chat-log="handleShowPriorChatLog"
        class="app-layout__header"
      />

      <main id="main-app-content" class="app-layout__main-content">
        <router-view v-slot="{ Component, route }">
          <Transition :name="routeTransitionName" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </router-view>
      </main>

      <AppFooter class="app-layout__footer" />
    </div>

    <div
      aria-live="assertive"
      class="toast-notifications-container"
    >
      <TransitionGroup name="toast-transition" tag="div">
        <div
          v-for="toastItem in toastManager.toasts.value"
          :key="toastItem.id"
          class="toast-notification"
          :class="`toast--${toastItem.type}`"
          role="alertdialog"
          :aria-labelledby="`toast-title-${toastItem.id}`"
          :aria-describedby="toastItem.message ? `toast-message-${toastItem.id}` : undefined"
        >
          <div class="toast__icon-wrapper">
            <component :is="getToastIcon(toastItem.type)" class="toast__icon" aria-hidden="true" />
          </div>
          <div class="toast__content">
            <p :id="`toast-title-${toastItem.id}`" class="toast__title">{{ toastItem.title }}</p>
            <p v-if="toastItem.message" :id="`toast-message-${toastItem.id}`" class="toast__message">{{ toastItem.message }}</p>
          </div>
          <button
            @click="toastManager.remove(toastItem.id)"
            class="toast__close-button"
            :aria-label="`Dismiss notification: ${toastItem.title}`"
          >
            <XMarkIcon class="toast__close-icon" aria-hidden="true" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, provide, readonly, type Component as VueComponent } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/Header.vue'; // Assuming path is correct
import AppFooter from '@/components/Footer.vue'; // Assuming path is correct

import { useCostStore } from './store/cost.store';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';
import { useUiStore } from '@/store/ui.store';
import { authAPI } from '@/utils/api';
import { AUTH_TOKEN_KEY } from '@/router';
import { voiceSettingsManager } from './services/voice.settings.service';

import {
  CheckCircleIcon as SuccessIcon,
  XCircleIcon as ErrorIcon,
  ExclamationTriangleIcon as WarningIcon,
  InformationCircleIcon as InfoIcon,
  XMarkIcon,
} from '@heroicons/vue/24/solid';

// --- Stores ---
const router = useRouter();
const costStore = useCostStore();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const uiStore = useUiStore();

// --- Loading State ---
const isLoadingApp = ref<boolean>(true);
provide('loading', {
  show: () => isLoadingApp.value = true,
  hide: () => isLoadingApp.value = false,
  isLoading: readonly(isLoadingApp)
});
const loading = { isLoading: readonly(isLoadingApp) };

// --- Theme Management ---
provide('theme', { isDarkMode: computed(() => uiStore.isDarkMode) });

/**
 * @function handleToggleTheme
 * @description Toggles the application's dark/light theme.
 */
const handleToggleTheme = () => {
  uiStore.toggleTheme();
};

// --- Fullscreen Management ---
provide('fullscreen', {
  isFullscreen: computed(() => uiStore.isFullscreen),
  toggle: () => uiStore.toggleBrowserFullscreen(),
  enter: async () => {
    if (!uiStore.isBrowserFullscreenActive) await uiStore.toggleBrowserFullscreen();
    uiStore.setFullscreen(true);
  },
  exit: async () => {
    if (uiStore.isBrowserFullscreenActive) await uiStore.toggleBrowserFullscreen();
    uiStore.setFullscreen(false);
  },
});

/**
 * @function handleToggleFullscreen
 * @description Toggles the browser's fullscreen mode.
 */
const handleToggleFullscreen = () => {
  uiStore.toggleBrowserFullscreen();
};

// --- Toast Notification System ---
/**
 * @interface Toast
 * @description Defines the structure for a toast notification.
 * @property {number} id - Unique identifier for the toast.
 * @property {'success' | 'error' | 'info' | 'warning'} type - The type of toast, influencing its style.
 * @property {string} title - The main title of the toast.
 * @property {string} [message] - Optional detailed message for the toast.
 * @property {number} [duration] - Optional duration in milliseconds before auto-dismissal. 0 or undefined for manual dismissal.
 */
interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}
const toasts = ref<Toast[]>([]);
let toastIdCounter = 0;

/**
 * @function addToast
 * @description Adds a new toast notification to the display.
 * @param {Omit<Toast, 'id'>} toastDetails - The details of the toast to add.
 * @returns {number} The ID of the added toast.
 */
const addToast = (toastDetails: Omit<Toast, 'id'>): number => {
  const id = toastIdCounter++;
  const newToast: Toast = {
    id, ...toastDetails,
    duration: toastDetails.duration === undefined ? 7000 : toastDetails.duration, // Default 7s
  };
  toasts.value.unshift(newToast);
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => removeToast(id), newToast.duration);
  }
  return id;
};

/**
 * @function removeToast
 * @description Removes a toast notification by its ID.
 * @param {number} id - The ID of the toast to remove.
 */
const removeToast = (id: number): void => {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index !== -1) toasts.value.splice(index, 1);
};

const toastManager = { add: addToast, remove: removeToast, toasts: readonly(toasts) };
provide('toast', toastManager);

/**
 * @function getToastIcon
 * @description Returns the appropriate icon component based on the toast type.
 * @param {Toast['type']} type - The type of the toast.
 * @returns {VueComponent} The corresponding icon component.
 */
const getToastIcon = (type: Toast['type']): VueComponent => {
  switch (type) {
    case 'success': return SuccessIcon;
    case 'error': return ErrorIcon;
    case 'warning': return WarningIcon;
    default: return InfoIcon;
  }
};

// --- Session & Chat Management ---
const sessionCost = computed(() => costStore.totalSessionCost);

/**
 * @function handleClearChatAndSession
 * @description Clears the chat history for the active agent and resets session costs.
 */
const handleClearChatAndSession = async () => {
  addToast({ type: 'info', title: 'Clearing Session', message: 'Wiping chat history and session costs...' });
  if (agentStore.activeAgentId) {
    await chatStore.clearAgentData(agentStore.activeAgentId);
    chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
  }
  await costStore.resetSessionCost();
  addToast({ type: 'success', title: 'Session Cleared', message: 'Chat and costs for the current agent have been reset.' });
};

/**
 * @function handleLogout
 * @description Logs out the user, clears local storage and store states, then redirects to login.
 */
const handleLogout = async () => {
  addToast({ type: 'info', title: 'Logging Out', message: 'Please wait...' });
  try {
    await authAPI.logout();
  } catch (error) {
    console.warn('[App.vue] Backend logout call failed, proceeding with client-side cleanup:', error);
  } finally {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    
    costStore.$reset();
    chatStore.$reset();
    agentStore.$reset();
    uiStore.$reset();

    addToast({ type: 'success', title: 'Logged Out', message: 'Successfully logged out.' });
    router.push({ name: 'Login' }).catch(err => console.error("[App.vue] Router push to Login failed after logout:", err));
  }
};

/**
 * @function handleShowPriorChatLog
 * @description Placeholder for showing a prior chat log feature.
 */
const handleShowPriorChatLog = () => {
  console.log("[App.vue] Show Prior Chat Log requested (placeholder).");
  addToast({ type: 'info', title: 'Chat History', message: 'Full chat history log viewer is a planned feature.' });
};

// --- Router Transition Logic ---
const routeTransitionName = ref('page-fade'); // Default transition

router.beforeEach((_to, _from, next) => {
  isLoadingApp.value = true;
  next();
});
router.afterEach(() => {
  setTimeout(() => { isLoadingApp.value = false; }, 250); // Slightly longer for new theme
});
router.onError((error) => {
  console.error('[App.vue] Router Navigation Error:', error);
  isLoadingApp.value = false;
  addToast({ type: 'error', title: 'Navigation Error', message: error.message || 'Could not load the requested page.', duration: 7000 });
});

// --- Lifecycle Hooks ---
onMounted(async () => { // Make onMounted async
  console.log('[App.vue] Component mounted. Initializing theme and services for Holographic Analog theme.');
  await voiceSettingsManager.initialize(); // Wait for voice settings to initialize
  uiStore.initializeTheme();

  if (costStore.totalSessionCost === 0 && !costStore.isLoadingCost) {
    costStore.fetchSessionCost();
  }
  // Agent store initialization might depend on voiceSettingsManager being initialized
  if (agentStore.activeAgentId) {
    chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
  } else {
    // This case might occur if initial agentId from settings is invalid or not yet loaded by agentService
    // agentStore itself has fallback logic to set a default agent.
    // We can ensure the main content is set for whatever agentStore resolves to.
    // agentStore.activeAgentId would be reactive, so a watcher or nextTick might be needed
    // if setActiveAgent is async and not completed before this line.
    // For simplicity, ensureMainContentForAgent is called here, assuming agentStore initialization is synchronous enough.
    chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
  }


  isLoadingApp.value = true;
  setTimeout(() => { isLoadingApp.value = false; }, 400);

  const hasVisitedKey = 'vcaHasVisited_v4.0_holo';
  if (!localStorage.getItem(hasVisitedKey)) {
    setTimeout(() => {
      addToast({
        type: 'info',
        title: 'Welcome to the Future of AI Interaction!',
        message: 'Experience the new Holographic Analog interface. Your digital assistant, reimagined.',
        duration: 9000
      });
      localStorage.setItem(hasVisitedKey, 'true');
    }, 1500);
  }
});

</script>

<style lang="postcss">
/* App.vue specific structural styles, theming handled by main.css through CSS variables */

.app-shell {
  @apply flex flex-col min-h-screen bg-neutral-bg text-neutral-text font-sans transition-default;
}

.app-layout {
  @apply flex flex-col flex-grow overflow-hidden;
}

.app-layout__header {
  @apply shrink-0 z-40; /* Ensure header is above other content if overlaps occur */
}

.app-layout__main-content {
  @apply flex-grow relative overflow-y-auto; /* Allow main content to scroll independently if needed */
}

.app-layout__footer {
  @apply shrink-0 z-30; /* Footer below header but can be above certain main content elements */
}

/* Page Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity var(--duration-smooth) var(--ease-in-out-sine), transform var(--duration-smooth) var(--ease-in-out-sine);
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Other global styles like loading overlay, toasts are now primarily in main.css */
/* Ensure this file does not unintentionally override main.css theme variables */
</style>