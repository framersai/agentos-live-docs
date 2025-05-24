// File: frontend/src/App.vue
<template>
  <div :class="['app-container', uiStore.theme, { 'is-loading': uiStore.isLoading }]">
    <a href="#main-content" class="skip-link sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:p-2 focus:bg-primary-500 focus:text-white focus:z-[9999] rounded">
      {{ t('common.skipToContent') }}
    </a>

    <div v-if="uiStore.isGlobalLoading" class="global-loading-overlay">
      <LoadingSpinner :message="t('common.loadingMessage')" />
    </div>

    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transitionName || 'fade'" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>

    <NotificationDisplay />

    <VoiceCommandFeedback v-if="voiceStore.isListening || voiceStore.feedbackMessage" />
  </div>
</template>

<script setup lang="ts">
/**
 * @file App.vue
 * @description Root component for the Vue application.
 * Sets up global layout elements, transitions, and incorporates global UI states.
 * This component is the main entry point for the visual part of the application.
 */
import { onMounted, watch } from 'vue';
import { RouterView } from 'vue-router';
import { useI18n } from './composables/useI18n';
import { useUiStore } from './store/ui.store';
// import { useVoiceStore } from './features/voice/store/voice.store'; // Assuming a voice store
import LoadingSpinner from './components/common/LoadingSpinner.vue';
import NotificationDisplay from './components/common/NotificationDisplay.vue'; // Assuming this component
import VoiceCommandFeedback from './components/voice/VoiceCommandFeedback.vue'; // Assuming this component

const { t, currentLanguageCode } = useI18n();
const uiStore = useUiStore();
// const voiceStore = useVoiceStore(); // If you have a dedicated voice store

// Watch for theme changes to apply to the root or body element if necessary
watch(() => uiStore.theme, (newTheme, oldTheme) => {
  if (typeof document !== 'undefined') {
    if (oldTheme) document.documentElement.classList.remove(oldTheme);
    document.documentElement.classList.add(newTheme);
    // For holographic themes, you might trigger more complex CSS variable updates or JS effects here
    console.debug(`[App.vue] Theme changed to: ${newTheme}`);
  }
}, { immediate: true });

// Watch for language changes to update document lang attribute (already handled by seoService via useI18n, but good for awareness)
watch(currentLanguageCode, (newLang) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = newLang;
  }
}, { immediate: true });


onMounted(() => {
  console.log('[App.vue] Application root component mounted.');
  // Initialize any global event listeners or third-party libraries here if needed
  // e.g., uiStore.initializeTheme(); // If theme needs specific JS init
});

</script>

<style lang="css">
/* Global styles and transition effects */

/* Base application container styling */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--app-bg-color, #ffffff); /* Default theme background */
  color: var(--app-text-color, #333333); /* Default theme text color */
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Theme specific variables would be in holographic.theme.css or default.theme.css
   and loaded based on uiStore.theme */
.holographic {
  /* Example: these would be defined in a theme file */
  --app-bg-color: #0a0f1f; /* Dark, futuristic background */
  --app-text-color: #e0e0ff;
  /* Add more holographic theme variables here: gradients, opacities, accent colors */
}

.default {
   --app-bg-color: #f4f6f8;
   --app-text-color: #1f2937;
}


/* Global loading overlay */
.global-loading-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Ensure it's on top */
  backdrop-filter: blur(5px);
}

/* Page transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Example slide transition (can be customized per route meta) */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.slide-left-enter-from { transform: translateX(100%); }
.slide-left-leave-to { transform: translateX(-100%); }
.slide-right-enter-from { transform: translateX(-100%); }
.slide-right-leave-to { transform: translateX(100%); }

/* Accessibility: Skip Link (already has some inline styles for focus) */
.skip-link {
  /* sr-only is a common utility class to hide visually but keep accessible */
  /* TailwindCSS: <div class="sr-only focus:not-sr-only ..."> */
}
</style>