// File: frontend/src/components/layout/MainLayout.vue
<template>
  <div class="main-layout-container" :data-theme="uiStore.currentTheme">
    <AppHeader
      :voice-target-id-prefix="layoutVoiceTargetPrefix + 'header-'"
      @toggle-sidebar="toggleMobileSidebar"
      class="main-layout-header"
    />

    <div class="main-layout-body">
      <aside
        v-if="isSidebarVisible"
        :class="['main-layout-sidebar', { 'is-mobile-open': isMobileSidebarOpen }]"
        data-voice-target-region="sidebar"
      >
        <nav class="sidebar-nav" aria-label="Sidebar Navigation">
          <router-link
            :to="{ name: 'Home' }"
            class="sidebar-link"
            active-class="is-active"
            :data-voice-target="layoutVoiceTargetPrefix + 'nav-home'"
            @click="closeMobileSidebar"
          >
            <i class="icon-home mr-2"></i> {{ t('navigation.home') }}
          </router-link>
          <router-link
            :to="{ name: 'Settings' }"
            class="sidebar-link"
            active-class="is-active"
            :data-voice-target="layoutVoiceTargetPrefix + 'nav-settings'"
            @click="closeMobileSidebar"
          >
            <i class="icon-settings mr-2"></i> {{ t('navigation.settings') }}
          </router-link>
          </nav>
        <div class="sidebar-dynamic-content">
          <DynamicLayoutSlot :slot-id="sidebarTopSlotId" class="mb-4" />
          <DynamicLayoutSlot :slot-id="sidebarBottomSlotId" />
        </div>
        <button
            v-if="isMobileView && isMobileSidebarOpen"
            class="sidebar-close-mobile"
            :aria-label="t('common.closeSidebar')"
            :data-voice-target="layoutVoiceTargetPrefix + 'close-sidebar'"
            @click="closeMobileSidebar"
        >
            <i class="icon-close"></i>
        </button>
      </aside>

      <main id="main-content" class="main-layout-content" data-voice-target-region="main-content">
        <div class="page-header" v-if="currentPageTitle">
          <h1 :data-voice-target="layoutVoiceTargetPrefix + 'page-title'">{{ currentPageTitle }}</h1>
        </div>

        <DynamicLayoutSlot :slot-id="mainContentTopSlotId" class="mb-6" />

        <RouterView v-slot="{ Component, route }">
          <transition :name="route.meta.transitionName || 'fade-router-view'" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </RouterView>

        <DynamicLayoutSlot :slot-id="mainContentBottomSlotId" class="mt-6" />
      </main>
    </div>

    <AppFooter :voice-target-id-prefix="layoutVoiceTargetPrefix + 'footer-'" class="main-layout-footer" />

    <div
        v-if="isMobileView && isMobileSidebarOpen"
        class="mobile-sidebar-overlay"
        @click="closeMobileSidebar"
    ></div>

    </div>
</template>

<script setup lang="ts">
/**
 * @file MainLayout.vue
 * @description The primary layout structure for authenticated sections of the application.
 * Includes header, footer, sidebar, and slots for dynamic AI-generated content.
 * Manages responsive sidebar behavior.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { useI18n } from '../../composables/useI18n';
import { useUiStore } from '../../store/ui.store';
import AppHeader from './Header/AppHeader.vue'; // Assuming this component exists
import AppFooter from './Footer/AppFooter.vue'; // Assuming this component
import DynamicLayoutSlot from '../dynamic/DynamicLayoutSlot.vue';

const { t } = useI18n();
const uiStore = useUiStore();
const route = useRoute();

// --- Configuration for Slot IDs ---
const sidebarTopSlotId = 'sidebar-main-dynamic-top';
const sidebarBottomSlotId = 'sidebar-main-dynamic-bottom';
const mainContentTopSlotId = 'main-content-dynamic-top';
const mainContentBottomSlotId = 'main-content-dynamic-bottom';

// --- Voice Target Prefix for Layout Elements ---
const layoutVoiceTargetPrefix = 'layout-';

// --- Sidebar Configuration ---
const isSidebarVisible = ref(true); // Control overall sidebar visibility (e.g., for full-page views)
const isMobileSidebarOpen = ref(false);
const mobileBreakpoint = 768; // px, Tailwind's `md` breakpoint
const isMobileView = ref(typeof window !== 'undefined' ? window.innerWidth < mobileBreakpoint : false);

const updateMobileView = () => {
  if (typeof window !== 'undefined') {
    isMobileView.value = window.innerWidth < mobileBreakpoint;
    if (!isMobileView.value && isMobileSidebarOpen.value) {
      // If resized to desktop and mobile sidebar was open, ensure it's "closed" (hidden via CSS)
      isMobileSidebarOpen.value = false;
    }
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    updateMobileView(); // Initial check
    window.addEventListener('resize', updateMobileView);
    // uiStore.initializeTheme(); // Theme initialization might be better in App.vue or main.ts
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateMobileView);
  }
});

const toggleMobileSidebar = () => {
  if (isMobileView.value) {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
    uiStore.setScrollLock(isMobileSidebarOpen.value); // Lock scroll when mobile sidebar is open
  }
};
const closeMobileSidebar = () => {
  if (isMobileSidebarOpen.value) {
      isMobileSidebarOpen.value = false;
      uiStore.setScrollLock(false);
  }
};

const currentPageTitle = computed(() => {
  const titleMeta = route.meta.title;
  if (typeof titleMeta === 'function') return titleMeta();
  if (typeof titleMeta === 'string') return titleMeta;
  return null; // Or a default title
});

// Watch for route changes to close mobile sidebar
watch(() => route.path, () => {
  closeMobileSidebar();
});

</script>

<style scoped>
.main-layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--app-layout-bg, var(--app-bg-color));
  color: var(--app-layout-text, var(--app-text-color));
}

.main-layout-header {
  position: sticky; /* Or fixed, depending on design */
  top: 0;
  z-index: var(--z-index-header, 1000);
  /* Add header specific styles: height, background, shadow */
  background-color: var(--app-header-bg, var(--app-surface-color, #fff));
  box-shadow: var(--app-header-shadow, 0 2px 4px rgba(0,0,0,0.05));
}

.main-layout-body {
  display: flex;
  flex-grow: 1;
  position: relative; /* For mobile overlay */
}

.main-layout-sidebar {
  width: var(--app-sidebar-width, 260px);
  flex-shrink: 0;
  background-color: var(--app-sidebar-bg, var(--app-surface-alt-color, #f8f9fa));
  border-right: 1px solid var(--app-sidebar-border, var(--app-border-color));
  padding: var(--app-sidebar-padding, 1.5rem 1rem);
  transition: transform 0.3s ease-in-out;
  overflow-y: auto; /* Make sidebar scrollable if content exceeds height */
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Space between links */
}
.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: var(--app-button-border-radius, 0.375rem);
  color: var(--app-sidebar-link-text, var(--app-text-secondary-color));
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-weight: 500;
}
.sidebar-link:hover {
  background-color: var(--app-sidebar-link-hover-bg, var(--app-primary-color-lightest));
  color: var(--app-sidebar-link-hover-text, var(--app-primary-color));
}
.sidebar-link.is-active {
  background-color: var(--app-sidebar-link-active-bg, var(--app-primary-color));
  color: var(--app-sidebar-link-active-text, white);
  font-weight: 600;
}
.sidebar-link .icon { /* Assuming icon classes like icon-home */
    font-size: 1.2em; /* Adjust as needed */
}


.sidebar-dynamic-content {
  margin-top: 2rem; /* Space below static nav */
}

.main-layout-content {
  flex-grow: 1;
  padding: var(--app-content-padding, 1.5rem); /* Default padding */
  overflow-x: hidden; /* Prevent horizontal scroll from content */
}

.page-header {
  margin-bottom: 1.5rem;
}
.page-header h1 {
  font-size: var(--app-font-size-h1, 1.875rem); /* Tailwind text-3xl */
  font-weight: var(--app-font-weight-bold, 700);
  color: var(--app-heading-color, var(--app-text-color));
}

.main-layout-footer {
  /* Add footer specific styles: height, background, padding */
  background-color: var(--app-footer-bg, var(--app-surface-alt-color, #f8f9fa));
  border-top: 1px solid var(--app-footer-border, var(--app-border-color));
  padding: 1rem;
  text-align: center;
}

/* Mobile Sidebar Specifics */
@media (max-width: 767.98px) { /* md breakpoint - 1px */
  .main-layout-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    transform: translateX(-100%);
    z-index: var(--z-index-mobile-sidebar, 1100);
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    border-right-width: 0; /* No border when it's an overlay */
  }
  .main-layout-sidebar.is-mobile-open {
    transform: translateX(0);
  }
  .mobile-sidebar-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: var(--z-index-mobile-sidebar-overlay, 1099);
    transition: opacity 0.3s ease;
  }
  .sidebar-close-mobile {
      position: absolute;
      top: 1rem;
      right: 1rem;
      /* Style like a small icon button */
      background: none; border: none; font-size: 1.5rem; cursor: pointer;
      color: var(--app-sidebar-link-text);
  }
}

/* Router View Transitions */
.fade-router-view-enter-active,
.fade-router-view-leave-active {
  transition: opacity 0.2s ease-out;
}
.fade-router-view-enter-from,
.fade-router-view-leave-to {
  opacity: 0;
}
</style>