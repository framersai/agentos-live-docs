// File: frontend/src/App.vue
/**
 * @file App.vue
 * @version 5.0.2 - Integrated SiteMenuDropdown logout event.
 * @description Main application shell.
 */
<script setup lang="ts">
import { ref, computed, onMounted, provide, readonly, type Component as VueComponent, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/Header.vue';
import AppFooter from '@/components/Footer.vue';

import { useCostStore } from './store/cost.store';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';
import { themeManager } from '@/theme/ThemeManager';
import { useUiStore } from '@/store/ui.store';
import { useAuth } from '@/composables/useAuth';
import { voiceSettingsManager } from './services/voice.settings.service';
import { ttsService } from './services/tts.service';
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
provide('loading', {
  show: () => isLoadingApp.value = true,
  hide: () => isLoadingApp.value = false,
  isLoading: readonly(isLoadingApp)
});
const loading = { isLoading: readonly(isLoadingApp) };

const templateThemeId = computed(() => piniaUiStore.currentThemeId);

const handleToggleTheme = () => {
  const currentTheme = themeManager.getCurrentTheme().value;
  if (currentTheme?.isDark) {
    const lightTheme = themeManager.getAvailableThemes().find(t => !t.isDark && t.id === 'aurora-daybreak'); // Use ID for aurora-light alias
    themeManager.setTheme(lightTheme?.id || 'legacy-warm-embrace');
  } else {
    const darkTheme = themeManager.getAvailableThemes().find(t => t.isDark && t.id === 'twilight-neo'); // Use ID for ephemeral-holo-dark alias
    themeManager.setTheme(darkTheme?.id || 'legacy-twilight-neo');
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

const handleLogoutFromHeader = async () => { // Renamed to avoid conflict if other logout methods exist
  addToast({ type: 'info', title: 'Logging Out', message: 'Please wait...' });
  await auth.logout(false); // Use auth composable, don't redirect from here, router guard will.
  
  costStore.$reset();
  chatStore.$reset();
  agentStore.$reset();
  piniaUiStore.$reset();

  addToast({ type: 'success', title: 'Logged Out', message: 'Successfully logged out.' });
  router.push({ name: 'Login' }).catch(err => console.error("[App.vue] Router push to Login failed:", err));
};

const handleShowPriorChatLog = () => {
  addToast({ type: 'info', title: 'Feature Pending', message: 'Full chat history log viewer is planned.' });
};

const routeTransitionName = ref('page-fade');
router.beforeEach((to, _from, next) => {
  isLoadingApp.value = true;
  routeTransitionName.value = (typeof to.meta.transition === 'string' ? to.meta.transition : 'page-fade');
  next();
});
router.afterEach(() => {
  setTimeout(() => { isLoadingApp.value = false; }, 300);
});
router.onError((error) => {
  console.error('[App.vue] Router Error:', error);
  isLoadingApp.value = false;
  addToast({ type: 'error', title: 'Navigation Error', message: error.message || 'Could not load page.', duration: 7000 });
});

const isUserActuallyListening = ref(false); // This should be updated by VoiceInput component
const isAiActuallySpeaking = computed(() => ttsService.isSpeaking());

// Provide a method for VoiceInput to update the listening state
// This is a simple way; a more robust solution might involve a shared service or Pinia state.
provide('updateUserListeningState', (isListening: boolean) => {
  isUserActuallyListening.value = isListening;
});


onMounted(async () => {
  console.log('[App.vue] Initializing application core services.');
  themeManager.initialize();
  piniaUiStore.initializeUiState();
  auth.checkAuthStatus();

  await voiceSettingsManager.initialize();

  if (auth.isAuthenticated.value) {
    if (costStore.totalSessionCost === 0 && !costStore.isLoadingCost) {
      costStore.fetchSessionCost();
    }
  }

  if (agentStore.activeAgentId) {
    chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
  } else {
    const defaultAgentId = auth.isAuthenticated.value ? agentService.getDefaultAgent().id : agentService.getDefaultPublicAgent().id;
    agentStore.setActiveAgent(defaultAgentId);
  }

  isLoadingApp.value = true;
  setTimeout(() => { isLoadingApp.value = false; }, 450);

  const hasVisitedKey = 'vcaHasVisited_EphemeralHarmony_v2.1_App_HeaderRefactor';
  if (!localStorage.getItem(hasVisitedKey)) {
    setTimeout(() => {
      addToast({
        type: 'info', title: 'Welcome to the Refined Experience!',
        message: 'The application header and core themes have been updated. Enjoy the new "Ephemeral Harmony"!',
        duration: 9000
      });
      localStorage.setItem(hasVisitedKey, 'true');
    }, 1500);
  }
});

watch(themeManager.getCurrentTheme(), (newThemeDef) => {
  if (newThemeDef) {
    console.log(`[App.vue] Theme changed to: ${newThemeDef.name} (isDark: ${newThemeDef.isDark}). Pinia uiStore.isCurrentThemeDark is: ${piniaUiStore.isCurrentThemeDark}`);
  }
}, { immediate: true });

</script>

<template>
  <div 
    class="app-shell-ephemeral" 
    :data-theme="templateThemeId" :class="{
      'is-dark-mode': piniaUiStore.isCurrentThemeDark, 'is-light-mode': !piniaUiStore.isCurrentThemeDark,
      'ai-is-speaking': isAiActuallySpeaking,
      'user-is-listening': isUserActuallyListening && !isAiActuallySpeaking,
    }"
    aria-live="polite" 
    aria-atomic="true"
  >
    <div
      v-if="loading.isLoading.value"
      class="loading-overlay-ephemeral"
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

<style lang="scss">
// Global styles are now primarily in main.scss and its imported partials.
</style>