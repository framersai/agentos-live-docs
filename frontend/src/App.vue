// File: frontend/src/App.vue
/**
  * @file App.vue
  * @version 5.0.1 - Corrected theme interactions.
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
import { useUiStore } from '@/store/ui.store'; // This is Pinia store instance
import { authAPI } from '@/utils/api'; // For logout (though useAuth is preferred)
import { useAuth } from '@/composables/useAuth'; // For reactive auth state
import { AUTH_TOKEN_KEY } from '@/router'; // Potentially for direct manipulation if needed, though useAuth handles it
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
const piniaUiStore = useUiStore(); // The actual Pinia store instance
const auth = useAuth(); // Auth composable

const isLoadingApp = ref<boolean>(true);
provide('loading', {
 show: () => isLoadingApp.value = true,
 hide: () => isLoadingApp.value = false,
 isLoading: readonly(isLoadingApp)
});
const loading = { isLoading: readonly(isLoadingApp) };

// --- Theme Management ---
// ThemeManager is the source of truth. uiStore (Pinia) derives from it.
const currentThemeIdFromManager = themeManager.getCurrentThemeId(); // Readonly<Ref<string>>
const isCurrentThemeDarkFromManager = computed(() => themeManager.getCurrentTheme().value?.isDark || false);

// Provide theme info to children if needed directly from ThemeManager
provide('currentThemeId', currentThemeIdFromManager);
provide('isCurrentThemeDark', isCurrentThemeDarkFromManager);

// The `data-theme` attribute for the template uses the Pinia store's derived value,
// which should always be in sync with ThemeManager.
const templateThemeId = computed(() => piniaUiStore.currentThemeId);


const handleToggleTheme = () => {
 // This function is called by AppHeader's @toggle-theme emit.
 // It toggles between a default light and dark theme using ThemeManager.
 const currentTheme = themeManager.getCurrentTheme().value;
 if (currentTheme?.isDark) {
    const lightTheme = themeManager.getAvailableThemes().find(t => !t.isDark && t.id === 'aurora-light');
    themeManager.setTheme(lightTheme?.id || 'legacy-warm-embrace'); // Provide a fallback theme ID
 } else {
    const darkTheme = themeManager.getAvailableThemes().find(t => t.isDark && t.id === 'ephemeral-holo-dark');
    themeManager.setTheme(darkTheme?.id || 'legacy-twilight-neo'); // Provide a fallback theme ID
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

const handleLogout = async () => {
 addToast({ type: 'info', title: 'Logging Out', message: 'Please wait...' });
 await auth.logout(false); // Use auth composable, don't redirect from here, router guard will.
 
 // Reset Pinia stores (auth state already handled by auth.logout())
 costStore.$reset();
 chatStore.$reset(); // Consider if clearAllAgentData is better
 agentStore.$reset();
 piniaUiStore.$reset(); // Reset UI specific states like internal fullscreen

 // ThemeManager persists its own state, no direct reset needed here unless desired.
 // Re-initializing theme can be an option if $reset of uiStore affects derived theme values.
 // themeManager.initialize(); // Re-evaluate if needed after Pinia store resets.

 addToast({ type: 'success', title: 'Logged Out', message: 'Successfully logged out.' });
 router.push({ name: 'Login' }).catch(err => console.error("[App.vue] Router push to Login failed:", err));
};

const handleShowPriorChatLog = () => {
 addToast({ type: 'info', title: 'Feature Pending', message: 'Full chat history log viewer is planned.' });
};

const routeTransitionName = ref('page-fade');
router.beforeEach((to, _from, next) => {
  isLoadingApp.value = true;
  if (to.meta.transition && typeof to.meta.transition === 'string') {
    routeTransitionName.value = to.meta.transition;
  } else {
    routeTransitionName.value = 'page-fade';
  }
  next();
});
router.afterEach(() => {
  setTimeout(() => {
    isLoadingApp.value = false;
  }, 300);
});
router.onError((error) => {
  console.error('[App.vue] Router Error:', error);
  isLoadingApp.value = false;
  addToast({ type: 'error', title: 'Navigation Error', message: error.message || 'Could not load page.', duration: 7000 });
});

const isUserActuallyListening = ref(false);
const isAiActuallySpeaking = computed(() => ttsService.isSpeaking());

onMounted(async () => {
 console.log('[App.vue] Initializing application core services.');
 themeManager.initialize();          // Initialize ThemeManager first
 piniaUiStore.initializeUiState(); // Then initialize UI store dependent parts (like fullscreen listeners)
 auth.checkAuthStatus();      // Check initial auth status

 await voiceSettingsManager.initialize();

 if (auth.isAuthenticated.value) { // Only fetch cost if authenticated
    if (costStore.totalSessionCost === 0 && !costStore.isLoadingCost) {
        costStore.fetchSessionCost();
    }
 }

 if (agentStore.activeAgentId) {
    chatStore.ensureMainContentForAgent(agentStore.activeAgentId);
 } else {
    const defaultAgentId = auth.isAuthenticated.value ? agentService.getDefaultAgent().id : agentService.getDefaultPublicAgent().id;
    agentStore.setActiveAgent(defaultAgentId);
    // ensureMainContentForAgent will be called by agentStore watcher or setActiveAgent logic
 }

 isLoadingApp.value = true;
 setTimeout(() => { isLoadingApp.value = false; }, 450);

 const hasVisitedKey = 'vcaHasVisited_EphemeralHarmony_v2.1_App';
 if (!localStorage.getItem(hasVisitedKey)) {
    setTimeout(() => {
        addToast({
            type: 'info', title: 'Welcome to the Future of Voice!',
            message: 'Interface enhancements active. Explore the new Ephemeral Harmony design.',
            duration: 9000
        });
        localStorage.setItem(hasVisitedKey, 'true');
    }, 1500);
 }
});

// Watcher to log theme changes; direct synchronization is handled by uiStore's computed properties.
watch(themeManager.getCurrentTheme(), (newThemeDef) => {
 // Corrected: Access the Pinia store's derived property for comparison.
 if (newThemeDef && piniaUiStore.isCurrentThemeDark !== newThemeDef.isDark) {
    // This state should ideally not occur if uiStore.isCurrentThemeDark correctly derives from themeManager.
    // This log helps debug if there's a desync.
    console.warn(`[App.vue] Discrepancy detected: ThemeManager says isDark=${newThemeDef.isDark}, Pinia uiStore.isCurrentThemeDark=${piniaUiStore.isCurrentThemeDark}. This should self-correct.`);
 } else if (newThemeDef) {
    console.log(`[App.vue] Theme changed to: ${newThemeDef.name} (isDark: ${newThemeDef.isDark}). Pinia uiStore.isCurrentThemeDark is: ${piniaUiStore.isCurrentThemeDark}`);
 }
}, { immediate: true });

// TODO: Implement global event bus or Pinia store for VoiceInput to update isUserActuallyListening.
// provide('updateUserListeningState', (isListening: boolean) => {
//  isUserActuallyListening.value = isListening;
// });

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