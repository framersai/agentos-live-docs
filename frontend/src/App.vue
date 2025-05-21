<template>
  <div :class="{ 'dark': isDarkMode }" class="app-wrapper">
    <!-- Global loading indicator -->
    <div 
      v-if="isLoading" 
      class="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 transition-opacity"
      :class="{ 'opacity-100': isLoading, 'opacity-0 pointer-events-none': !isLoading }">
      <div class="loading-animation">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    
    <!-- Skip to content link for accessibility -->
    <a href="#main-content" class="skip-link">Skip to content</a>
    
    <!-- Main content with page transitions -->
    <div id="main-content" class="min-h-screen app-container">
      <router-view></router-view>
    </div>
    
    <!-- Global toast notifications -->
    <div class="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="toast-notification p-3 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-md toast-enter-active"
        :class="getToastClass(toast.type)">
        <div class="toast-icon">
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="toast.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="toast-content flex-1">
          <div class="text-sm font-medium">{{ toast.title }}</div>
          <div v-if="toast.message" class="text-xs mt-0.5 opacity-80">{{ toast.message }}</div>
        </div>
        <button 
          @click="removeToast(toast.id)" 
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, provide } from 'vue';
import { useStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

// Router
const router = useRouter();

// Theme state
const isDarkMode = useStorage('darkMode', false);

// Loading state
const isLoading = ref(false);

// Toast notifications
interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

// Add a toast notification
const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = toastId++;
  const newToast = {
    id,
    ...toast,
    duration: toast.duration || 5000
  };
  
  toasts.value.push(newToast);
  
  // Auto remove after duration
  if (newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }
  
  return id;
};

// Remove a toast notification
const removeToast = (id: number) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id);
};

// Get appropriate toast class based on type
const getToastClass = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500';
    case 'error':
      return 'bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500';
    case 'warning':
      return 'bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500';
    case 'info':
    default:
      return 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500';
  }
};

// Show/hide loading indicator
const setLoading = (loading: boolean) => {
  isLoading.value = loading;
};

// Provide toast and loading functions to child components
provide('toast', {
  add: addToast,
  remove: removeToast,
});

provide('loading', {
  show: () => setLoading(true),
  hide: () => setLoading(false),
});

// Check system preference on mount
onMounted(() => {
  // Check system theme preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (localStorage.getItem('darkMode') === null) {
    isDarkMode.value = prefersDark;
  }
  
  // Setup route change handlers
  router.beforeEach(() => {
    setLoading(true);
    return true;
  });
  
  router.afterEach(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300); // Small delay to prevent flashing
  });
  
  // Router error handling
  router.onError((error) => {
    console.error('Navigation error:', error);
    setLoading(false);
    addToast({
      type: 'error',
      title: 'Navigation Error',
      message: 'There was an error loading the page. Please try again.'
    });
  });
  
  // Welcome toast on first visit
  const hasVisited = localStorage.getItem('hasVisited');
  if (!hasVisited) {
    setTimeout(() => {
      addToast({
        type: 'info',
        title: 'Welcome to Voice Coding Assistant!',
        message: 'Built with Vue.js and AI-powered voice recognition',
        duration: 6000
      });
      localStorage.setItem('hasVisited', 'true');
    }, 1000);
  }
});

// Apply theme class
watch(isDarkMode, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, { immediate: true });
</script>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Skip link for accessibility */
.skip-link {
  @apply absolute top-0 left-0 p-3 -translate-y-full bg-primary-500 text-white font-medium z-50;
  transition: transform 0.3s;
}

.skip-link:focus {
  @apply translate-y-0;
}

/* App container */
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container {
  background-image: 
    radial-gradient(circle at 90% 10%, rgba(20, 184, 166, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 10% 90%, rgba(20, 184, 166, 0.05) 0%, transparent 40%);
}

.dark .app-container {
  background-image: 
    radial-gradient(circle at 90% 10%, rgba(20, 184, 166, 0.03) 0%, transparent 40%),
    radial-gradient(circle at 10% 90%, rgba(20, 184, 166, 0.03) 0%, transparent 40%);
}

/* Loading animation */
.loading-animation {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.loading-animation div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 16px;
  background: theme('colors.primary.500');
  animation: loading-animation 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}

.loading-animation div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
}

.loading-animation div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}

.loading-animation div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}

@keyframes loading-animation {
  0% {
    top: 8px;
    height: 64px;
  }
  50%, 100% {
    top: 24px;
    height: 32px;
  }
}
</style>