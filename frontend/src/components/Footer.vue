// File: frontend/src/components/Footer.vue
/**
 * @file Footer.vue
 * @description Global application footer. Displays version, status, attributions, and system logs.
 * @version 2.1.1 - Corrected Tailwind CSS class for icon sizing.
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'; // Removed defineAsyncComponent as SystemLogDisplay is directly imported
import SystemLogDisplay from './ui/SystemLogDisplay.vue';
import { CogIcon, CommandLineIcon, CloudIcon, WifiIcon, NoSymbolIcon } from '@heroicons/vue/24/outline';

const repositoryUrl = ref('https://github.com/manicinc/voice-coding-assistant');
const logsOpen = ref(false);
const apiStatus = ref<'Operational' | 'Degraded' | 'Down' | 'Checking'>('Checking');
let apiStatusInterval: number | undefined;

const apiStatusInfo = computed(() => {
  switch (apiStatus.value) {
    case 'Operational': return { text: 'API Operational', color: 'text-green-500 dark:text-green-400', icon: WifiIcon, dotColor: 'bg-green-500' };
    case 'Degraded': return { text: 'API Degraded', color: 'text-yellow-500 dark:text-yellow-400', icon: CloudIcon, dotColor: 'bg-yellow-500' };
    case 'Down': return { text: 'API Down', color: 'text-red-500 dark:text-red-400', icon: NoSymbolIcon, dotColor: 'bg-red-500' };
    default: return { text: 'Checking API...', color: 'text-gray-500 dark:text-gray-400', icon: CogIcon, dotColor: 'bg-gray-500' };
  }
});

const toggleLogsPanel = () => {
  logsOpen.value = !logsOpen.value;
};

const checkApiStatus = async () => {
  // This is a placeholder. In a real app, you would make an API call, e.g., to a /health endpoint.
  // For now, cycle through statuses for demo.
  const statuses: Array<'Operational' | 'Degraded' | 'Down'> = ['Operational', 'Degraded', 'Down'];
  apiStatus.value = statuses[Math.floor(Math.random() * statuses.length)];
};

onMounted(() => {
  checkApiStatus(); // Initial check
  apiStatusInterval = window.setInterval(checkApiStatus, 30000); // Check every 30 seconds
});

onUnmounted(() => {
  if (apiStatusInterval) clearInterval(apiStatusInterval);
});
</script>

<template>
  <footer class="app-footer relative z-30">
    <Transition name="slide-up-fade-logs">
      <div v-if="logsOpen" class="logs-panel-wrapper fixed bottom-16 sm:bottom-20 left-0 right-0 px-2 sm:px-4 pointer-events-none">
         <div class="max-w-4xl mx-auto pointer-events-auto">
           <SystemLogDisplay />
         </div>
      </div>
    </Transition>

    <div class="footer-content-wrapper">
      <div class="footer-main-row">
        <div class="footer-branding">
          <img src="/src/assets/logo.svg" alt="VCA Logo" class="w-6 h-6 text-primary-500" />
          <span class="font-semibold text-sm text-gray-700 dark:text-gray-200">Voice Chat Assistant</span>
          <span class="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">v1.5.0</span>
        </div>

        <div class="footer-status-and-actions">
            <div class="api-status-indicator" :title="apiStatusInfo.text">
                <component :is="apiStatusInfo.icon" class="w-4 h-4 mr-1.5" :class="apiStatusInfo.color" />
                <span class="text-xs hidden md:inline" :class="apiStatusInfo.color">{{ apiStatusInfo.text }}</span>
                <span class="status-dot-indicator" :class="apiStatusInfo.dotColor"></span>
            </div>

            <button @click="toggleLogsPanel" class="logs-toggle-button" :class="{ 'active': logsOpen }" title="Toggle System Logs">
                <CommandLineIcon class="w-4 h-4" />
                <span class="hidden sm:inline text-xs">System Logs</span>
            </button>

            <a :href="repositoryUrl" target="_blank" rel="noopener noreferrer" class="footer-icon-link" title="View Source on GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-4 h-4 fill-current"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
            </a>
             <router-link to="/settings" class="footer-icon-link" title="Settings">
                <CogIcon class="w-4 h-4" />
            </router-link>
        </div>
      </div>
      <div class="footer-copyright">
        &copy; {{ new Date().getFullYear() }} Voice Chat Assistant. Powered by AI.
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  @apply bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 text-xs text-gray-600 dark:text-gray-400;
}
.footer-content-wrapper {
  @apply max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4;
}
.footer-main-row {
  @apply flex flex-col sm:flex-row items-center justify-between gap-3;
}
.footer-branding {
  @apply flex items-center gap-2;
}
.footer-status-and-actions {
  @apply flex items-center gap-2 sm:gap-3;
}
.api-status-indicator {
    @apply flex items-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-xs font-medium border border-transparent;
}
.status-dot-indicator {
    @apply w-2 h-2 rounded-full ml-1.5 md:ml-2;
    animation: pulseStatus 2s infinite;
}
@keyframes pulseStatus {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.logs-toggle-button {
  @apply flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors
         bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 
         text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-slate-700;
}
.logs-toggle-button.active {
  @apply bg-primary-500 hover:bg-primary-600 text-white dark:bg-primary-500 dark:hover:bg-primary-600 border-transparent;
}
.footer-icon-link {
  @apply p-1.5 rounded-md text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 transition-colors;
}
.footer-icon-link svg {
  /* Corrected to use arbitrary values for specific pixel-equivalent sizes not in default scale */
  /* 1.125rem = 18px. w-4 is 1rem (16px), w-5 is 1.25rem (20px) */
  @apply w-4 h-4 sm:w-[1.125rem] sm:h-[1.125rem] fill-current;
}

.footer-copyright {
  @apply text-center text-gray-400 dark:text-gray-500 pt-3 mt-3 border-t border-gray-200 dark:border-slate-800 text-[0.7rem] sm:text-xs;
}

/* Logs Panel Wrapper & Transition */
.logs-panel-wrapper {
  /* Max width will be controlled by the inner div */
}
.slide-up-fade-logs-enter-active,
.slide-up-fade-logs-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}
.slide-up-fade-logs-enter-from,
.slide-up-fade-logs-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>