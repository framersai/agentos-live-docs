// File: frontend/src/components/layout/MainLayout.vue (Conceptual - for context)
<template>
  <div class="app-main-layout" :class="uiStore.currentTheme" :data-voice-target-region="'application-root'">
    <AppHeader :voice-target-id-prefix="'global-header-'" />

    <div class="layout-content-wrapper">
      <RouterView v-slot="{ Component, route }">
        <transition :name="route.meta.transitionName || 'view-fade'" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </RouterView>
    </div>

    <AppFooter :voice-target-id-prefix="'global-footer-'" />

    <NotificationDisplay />
    <GlobalModalRenderer />
    <VoiceCommandFeedbackOverlay /> </div>
</template>

<script setup lang="ts">
/**
 * @file MainLayout.vue
 * @description The main layout component for authenticated parts of the application.
 * Includes global header, footer, and the main router view area.
 * Manages global theme class and provides slots for dynamic content if needed.
 */
import { RouterView } from 'vue-router';
import { useUiStore } from '../../store/ui.store';
import AppHeader from './AppHeader.vue'; // SOTA Header
import AppFooter from './AppFooter.vue'; // SOTA Footer
import NotificationDisplay from '../common/NotificationDisplay.vue';
import GlobalModalRenderer from '../common/GlobalModalRenderer.vue';
import VoiceCommandFeedbackOverlay from '../voice/VoiceCommandFeedbackOverlay.vue'; // New conceptual component

const uiStore = useUiStore();

// Initialization logic for theme, voice services, etc., typically happens in main.ts or App.vue's setup.
// MainLayout focuses on the structural layout of authenticated views.
</script>

<style scoped>
.app-main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--app-layout-bg, var(--app-bg-color));
  color: var(--app-layout-text, var(--app-text-color));
}
.layout-content-wrapper {
  flex-grow: 1;
  display: flex; /* For potential sidebar */
  /* The <router-view> will contain the actual page content (e.g., HomeView) */
  /* which then has its own internal scrolling if needed. */
  overflow: hidden; /* Prevent layout itself from scrolling if content inside scrolls */
}

/* View transitions */
.view-fade-enter-active,
.view-fade-leave-active {
  transition: opacity 0.25s ease-out;
}
.view-fade-enter-from,
.view-fade-leave-to {
  opacity: 0;
}
</style>