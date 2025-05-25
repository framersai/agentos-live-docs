// File: frontend/src/App.vue
<template>
  <div :class="{ 'dark': isDarkMode }" class="app-wrapper">
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-[9999] transition-opacity duration-300"
      :class="{ 'opacity-100': isLoading, 'opacity-0 pointer-events-none': !isLoading }"
      role="status"
      aria-live="polite"
    >
      <div class="loading-animation">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

    <a href="#main-content" class="skip-link">Skip to main content</a>

    <div id="main-content" class="min-h-screen app-container flex-grow flex flex-col">
      <router-view v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </router-view>
    </div>

    <div aria-live="assertive" class="fixed bottom-4 right-4 z-[9990] space-y-3 max-w-sm w-full sm:w-auto">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-notification p-4 rounded-xl shadow-2xl flex items-start gap-3 border-l-4"
          :class="getToastClass(toast.type)"
          role="alert"
        >
          <div class="toast-icon shrink-0 mt-0.5">
            <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <svg v-else-if="toast.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="toast-content flex-1">
            <p class="text-sm font-semibold text-gray-900 dark:text-gray-50">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{{ toast.message }}</p>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="ml-3 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Dismiss notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, provide, readonly } from 'vue';
import { useStorage } from '@vueuse/core';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute(); // To get current route for :key on component

const isDarkMode = useStorage('darkMode', false);
const isLoading = ref(false);

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number; // milliseconds, 0 for persistent
}

const toasts = ref<Toast[]>([]);
let toastIdCounter = 0;

const addToast = (toastDetails: Omit<Toast, 'id'>) => {
  const id = toastIdCounter++;
  const newToast: Toast = {
    id,
    ...toastDetails,
    duration: toastDetails.duration === undefined ? 5000 : toastDetails.duration,
  };

  toasts.value.unshift(newToast); // Add to the top for visibility

  if (newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }
  return id;
};

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(toast => toast.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
};

const getToastClass = (type: Toast['type']) => {
  const baseClass = "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50";
  switch (type) {
    case 'success':
      return `${baseClass} border-green-500`;
    case 'error':
      return `${baseClass} border-red-500`;
    case 'warning':
      return `${baseClass} border-yellow-500`;
    case 'info':
    default:
      return `${baseClass} border-blue-500`;
  }
};

const setLoading = (loading: boolean) => {
  isLoading.value = loading;
};

provide('toast', {
  add: addToast,
  remove: removeToast,
});

provide('loading', {
  show: () => setLoading(true),
  hide: () => setLoading(false),
  isLoading: readonly(isLoading) // Provide readonly access to loading state
});

watch(isDarkMode, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, { immediate: true });

onMounted(() => {
  if (localStorage.getItem('darkMode') === null) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkMode.value = prefersDark;
  }

  let loadingTimer: number | undefined;

  router.beforeEach((to, from, next) => {
    if (to.path !== from.path) { // Only show loading for actual navigation
      setLoading(true);
    }
    next();
  });

  router.afterEach((to, from) => {
     if (to.path !== from.path) {
        if(loadingTimer) clearTimeout(loadingTimer);
        loadingTimer = window.setTimeout(() => {
            setLoading(false);
        }, 200); // Slightly shorter delay
     }
  });

  router.onError((error) => {
    console.error('Router Navigation Error:', error);
    setLoading(false);
    addToast({
      type: 'error',
      title: 'Page Load Error',
      message: error.message || 'Could not load the requested page. Please try again.',
      duration: 7000
    });
  });

  const hasVisited = localStorage.getItem('vcaHasVisited'); // Use a more specific key
  if (!hasVisited) {
    setTimeout(() => {
      addToast({
        type: 'info',
        title: 'Welcome to Your Voice Assistant!',
        message: 'Explore features and settings. Use your voice to interact.',
        duration: 7000
      });
      localStorage.setItem('vcaHasVisited', 'true');
    }, 1200);
  }
});
</script>

<style>
/* Global App Wrapper */
.app-wrapper {
  @apply min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* App Container Background - more subtle and modern */
.app-container {
  @apply flex-grow transition-opacity duration-300 ease-in-out;
  /* Removed direct background images for a cleaner default, can be added per-page or theme */
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Toast Animations (using TransitionGroup compatible names) */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* Bouncy effect */
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}
.toast-move { /* For reordering if toasts are added/removed not just at ends */
  transition: transform 0.3s ease;
}

/* Skip Link Styling */
.skip-link {
  @apply sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:p-3 focus:bg-primary-600 focus:text-white focus:font-semibold focus:z-[10000] focus:rounded-md focus:shadow-lg;
  transition: transform 0.2s ease-out;
}

/* Enhanced Loading Animation */
.loading-animation {
  display: inline-block;
  position: relative;
  width: 60px; /* Slightly smaller */
  height: 60px;
}
.loading-animation div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 48px; /* Adjusted for new size */
  height: 48px;
  margin: 6px;
  border: 5px solid theme('colors.primary.500'); /* Use theme color */
  border-radius: 50%;
  animation: loading-animation-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: theme('colors.primary.500') transparent transparent transparent;
}
.loading-animation div:nth-child(1) { animation-delay: -0.45s; }
.loading-animation div:nth-child(2) { animation-delay: -0.3s; }
.loading-animation div:nth-child(3) { animation-delay: -0.15s; }

@keyframes loading-animation-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Ensuring html, body take full height for sticky footer patterns if needed */
html, body, #app {
  height: 100%;
}
body {
  @apply font-sans antialiased; /* Apply a base font stack if not already in main.css */
}
</style>