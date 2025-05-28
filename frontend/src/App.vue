// File: frontend/src/App.vue
/**
 * @file App.vue
 * @version 5.0.4 - Resolved unused AgentId import warning.
 * @description Main application shell. Handles global state initialization, theming, toasts, and routing.
 */
<script setup lang="ts">
import { ref, computed, onMounted, provide, readonly, type Component as VueComponent, watch } from 'vue';
import { useRouter, type RouteLocationNormalized } from 'vue-router';
import AppHeader from '@/components/Header.vue';
import AppFooter from '@/components/Footer.vue';

import { useCostStore } from './store/cost.store';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';
import { themeManager, type ThemeDefinition } from '@/theme/ThemeManager';
import { useUiStore } from '@/store/ui.store';
import { useAuth } from '@/composables/useAuth';
import { voiceSettingsManager } from './services/voice.settings.service';
import { ttsService } from './services/tts.service';
// AgentId type import removed as it's not directly used for annotations within this file,
// and type safety for agentService methods should flow from its own module.
// The type `AgentId` is still known to TypeScript when using `agentService` methods
// because `agent.service.ts` exports it and TypeScript resolves it.
import { agentService } from '@/services/agent.service';

import {
  CheckCircleIcon as SuccessIcon, XCircleIcon as ErrorIcon,
  ExclamationTriangleIcon as WarningIcon, InformationCircleIcon as InfoIcon,
  XMarkIcon,
} from '@heroicons/vue/24/solid';

const router = useRouter();
const costStore = useCostStore();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const piniaUiStore = useUiStore();
const auth = useAuth();

const isLoadingApp = ref<boolean>(true);
provide('loading', readonly({
  show: () => isLoadingApp.value = true,
  hide: () => isLoadingApp.value = false,
  isLoading: isLoadingApp
}));

const templateThemeId = computed(() => piniaUiStore.currentThemeId);

const handleToggleTheme = () => {
  const currentThemeDef = themeManager.getCurrentTheme().value;
  if (currentThemeDef?.isDark) {
    const lightTheme = themeManager.getAvailableThemes().find(t => !t.isDark && t.id === 'aurora-daybreak') ||
                       themeManager.getAvailableThemes().find(t => !t.isDark);
    themeManager.setTheme(lightTheme?.id || 'aurora-daybreak');
  } else {
    const darkTheme = themeManager.getAvailableThemes().find(t => t.isDark && t.id === 'magenta-mystic') ||
                      themeManager.getAvailableThemes().find(t => t.isDark);
    themeManager.setTheme(darkTheme?.id || 'magenta-mystic');
  }
};

const handleToggleFullscreen = () => {
  piniaUiStore.toggleBrowserFullscreen();
};

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
    id,
    ...toastDetails,
    duration: toastDetails.duration === undefined ? 7000 : toastDetails.duration,
  };
  toasts.value.unshift(newToast);
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => removeToast(id), newToast.duration);
  }
  return id;
};
const removeToast = (id: number): void => {
  toasts.value = toasts.value.filter(t => t.id !== id);
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

const sessionCost = computed(() => costStore.totalSessionCost);

const handleClearChatAndSession = async () => {
  addToast({ type: 'info', title: 'Clearing Session', message: 'Wiping chat history and session costs...' });
  if (agentStore.activeAgentId) {
    await chatStore.clearAgentData(agentStore.activeAgentId);
    chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
  } else {
    chatStore.clearAllAgentData();
  }
  await costStore.resetSessionCost();
  addToast({ type: 'success', title: 'Session Cleared', message: 'Chat and costs for current session reset.' });
};

const handleLogoutFromHeader = async () => {
  addToast({ type: 'info', title: 'Logging Out', message: 'Please wait...' });
  await auth.logout(false);

  costStore.$reset();
  chatStore.$reset();
  agentStore.$reset();
  piniaUiStore.$reset();

  addToast({ type: 'success', title: 'Logged Out', message: 'Successfully logged out.' });
  if (router.currentRoute.value.name !== 'Login') {
    router.push({ name: 'Login' }).catch(err => console.error("[App.vue] Router push to Login failed after logout:", err));
  }
};

const handleShowPriorChatLog = () => {
  addToast({ type: 'info', title: 'Feature Pending', message: 'Full chat history log viewer is planned for a future update.' });
};

const routeTransitionName = ref('page-fade');

router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: () => void) => {
  isLoadingApp.value = true;
  routeTransitionName.value = (typeof to.meta.transition === 'string' ? to.meta.transition : 'page-fade');
  next();
});
router.afterEach(() => {
  setTimeout(() => { isLoadingApp.value = false; }, 250);
});
router.onError((error) => {
  console.error('[App.vue] Router Error:', error);
  isLoadingApp.value = false;
  addToast({ type: 'error', title: 'Navigation Error', message: (error as Error).message || 'Could not load the requested page.', duration: 7000 });
});

const isUserActuallyListening = ref(false);
const isAiActuallySpeaking = computed(() => ttsService.isSpeaking());

provide('updateUserListeningState', (isListening: boolean) => {
  isUserActuallyListening.value = isListening;
});

onMounted(async () => {
  isLoadingApp.value = true;
  themeManager.initialize();
  piniaUiStore.initializeUiState();
  
  await auth.checkAuthStatus();
  await voiceSettingsManager.initialize();

  if (auth.isAuthenticated.value) {
    if (costStore.totalSessionCost === 0 && !costStore.isLoadingCost) {
      await costStore.fetchSessionCost();
    }
  }

  if (!agentStore.activeAgentId || !agentService.getAgentById(agentStore.activeAgentId)) {
    const defaultAgent = auth.isAuthenticated.value ? agentService.getDefaultAgent() : agentService.getDefaultPublicAgent();
    if (defaultAgent) {
      agentStore.setActiveAgent(defaultAgent.id);
    } else {
      console.error("[App.vue] CRITICAL: No default agent could be set on mount.");
      addToast({type: 'error', title: 'Agent Init Error', message: 'Could not load a default assistant.'});
    }
  } else if (agentStore.activeAgentId) { // Ensure content if agentId is valid
    chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
  }


  setTimeout(() => { isLoadingApp.value = false; }, 350);

  const hasVisitedKey = 'vcaHasVisited_EphemeralHarmony_v5.0.4_App'; // Updated version
  if (!localStorage.getItem(hasVisitedKey)) {
    setTimeout(() => {
      addToast({
        type: 'info', title: 'Welcome to Voice Coding Assistant!',
        message: 'Enjoy the refined "Ephemeral Harmony" experience. Explore assistants and features.',
        duration: 10000
      });
      localStorage.setItem(hasVisitedKey, 'true');
    }, 1200);
  }
});

watch(
  () => themeManager.getCurrentTheme().value,
  (newThemeDef: ThemeDefinition | null | undefined) => {
    if (newThemeDef) {
      // console.log(`[App.vue] Theme changed to: ${newThemeDef.name} (isDark: ${newThemeDef.isDark}). Pinia: ${piniaUiStore.isCurrentThemeDark}`);
    }
  },
  { immediate: true }
);

</script>

<template>
  <div 
    class="app-shell-ephemeral" 
    :data-theme="templateThemeId" 
    :class="{
      'is-dark-mode': piniaUiStore.isCurrentThemeDark, 
      'is-light-mode': !piniaUiStore.isCurrentThemeDark,
      'ai-is-speaking': isAiActuallySpeaking,
      'user-is-listening': isUserActuallyListening && !isAiActuallySpeaking,
    }"
    aria-live="polite" 
    aria-atomic="true"
  >
    <div
      v-if="isLoadingApp" class="loading-overlay-ephemeral"
      role="status" aria-live="polite" aria-label="Loading application content"
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
        :is-user-listening="isUserActuallyListening" 
        :is-assistant-speaking="isAiActuallySpeaking" 
        @toggle-theme="handleToggleTheme"
        @toggle-fullscreen="handleToggleFullscreen"
        @clear-chat-and-session="handleClearChatAndSession"
        @logout="handleLogoutFromHeader" 
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

    <div aria-live="assertive" class="toast-notifications-container-ephemeral">
      <TransitionGroup name="toast-transition" tag="div">
        <div
          v-for="toastItem in toasts" :key="toastItem.id"
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
            @click="removeToast(toastItem.id)" class="toast-close-button-ephemeral"
            :aria-label="`Dismiss notification: ${toastItem.title}`"
          >
            <XMarkIcon class="toast-close-icon-svg" aria-hidden="true" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss">
// Global styles are in main.scss and its imported partials.
// Specific app-shell styles or overrides can go into frontend/src/styles/layout/_app.scss
</style>