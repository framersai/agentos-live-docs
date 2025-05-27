// File: frontend/src/components/Footer.vue
/**
 * @file Footer.vue
 * @description Global application footer, styled for the "Holographic Analog" theme.
 * Displays version, status, attributions, and system logs access.
 * @version 3.0.0 - Holographic Analog Theme Update
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, shallowRef } from 'vue';
import SystemLogDisplay from './ui/SystemLogDisplay.vue'; // Assuming SystemLogDisplay has its own styling or adapts
import { CogIcon, CommandLineIcon, CloudIcon, WifiIcon, NoSymbolIcon, CodeBracketSquareIcon } from '@heroicons/vue/24/outline';

const repositoryUrl = ref('https://github.com/manicinc/voice-coding-assistant');
const logsOpen = ref(false);
const apiStatus = ref<'Operational' | 'Degraded' | 'Down' | 'Checking'>('Checking');
let apiStatusInterval: number | undefined;

// Define VueComponent type for icon components
import type { Component } from 'vue';
type VueComponent = Component;

const apiStatusInfo = computed(() => {
  switch (apiStatus.value) {
    case 'Operational': return { text: 'API Operational', class: 'text-success-light dark:text-success-dark', icon: WifiIcon as VueComponent, dotClass: 'bg-success-500' };
    case 'Degraded': return { text: 'API Degraded', class: 'text-warning-light dark:text-warning-dark', icon: CloudIcon as VueComponent, dotClass: 'bg-warning-500' };
    case 'Down': return { text: 'API Down', class: 'text-error-light dark:text-error-dark', icon: NoSymbolIcon as VueComponent, dotClass: 'bg-error-500' };
    default: return { text: 'Checking API...', class: 'text-neutral-text-muted', icon: CogIcon as VueComponent, dotClass: 'bg-neutral-text-muted animate-pulse' };
  }
});

/**
 * @function toggleLogsPanel
 * @description Toggles the visibility of the system logs panel.
 */
const toggleLogsPanel = (): void => {
  logsOpen.value = !logsOpen.value;
};

/**
 * @function checkApiStatus
 * @description Simulates checking the API status. In a real app, this would make an API call.
 */
const checkApiStatus = async (): Promise<void> => {
  // Placeholder - Cycle through statuses for demo
  const statuses: Array<'Operational' | 'Degraded' | 'Down'> = ['Operational', 'Degraded', 'Down', 'Operational', 'Operational']; // Skew towards operational
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
      <div v-if="logsOpen" class="logs-panel-wrapper fixed bottom-[var(--footer-height)] left-0 right-0 px-2 sm:px-4 pb-2 pointer-events-none">
        <div class="max-w-5xl mx-auto pointer-events-auto">
          <SystemLogDisplay class="logs-display-card" />
        </div>
      </div>
    </Transition>

    <div class="footer-content-wrapper">
      <div class="footer-main-row">
        <div class="footer-branding">
          <img src="/src/assets/logo.svg" alt="VCA Logo" class="w-7 h-7 footer-logo-filter" />
          <div class="flex flex-col">
            <span class="font-display font-semibold text-sm text-neutral-text">Voice Chat Assistant</span>
            <span class="text-xs text-neutral-text-muted hidden sm:inline">v4.0.0 "Holo-Analog"</span>
          </div>
        </div>

        <div class="footer-status-and-actions">
          <div class="api-status-indicator" :title="apiStatusInfo.text">
            <component :is="apiStatusInfo.icon" class="w-4 h-4 mr-1.5 shrink-0" :class="apiStatusInfo.class" />
            <span class="text-xs hidden md:inline" :class="apiStatusInfo.class">{{ apiStatusInfo.text }}</span>
            <span class="status-dot-indicator" :class="apiStatusInfo.dotClass"></span>
          </div>

          <button @click="toggleLogsPanel" class="footer-action-button" :class="{ 'active': logsOpen }" title="Toggle System Logs">
            <CommandLineIcon class="icon-sm" />
            <span class="hidden sm:inline text-xs">Logs</span>
          </button>

          <a :href="repositoryUrl" target="_blank" rel="noopener noreferrer" class="footer-action-button" title="View Source on GitHub">
            <CodeBracketSquareIcon class="icon-sm" /> <span class="hidden sm:inline text-xs">Source</span>
          </a>
          <router-link to="/settings" class="footer-action-button" title="Settings">
            <CogIcon class="icon-sm" />
             <span class="hidden sm:inline text-xs">Config</span>
          </router-link>
        </div>
      </div>
      <div class="footer-copyright">
        &copy; {{ new Date().getFullYear() }} Voice Chat Assistant. An Experiment in Conversational AI.
      </div>
    </div>
  </footer>
</template>

<style scoped lang="postcss">
.app-footer {
  @apply bg-neutral-bg/80 dark:bg-neutral-bg-subtle/80 backdrop-blur-md border-t border-neutral-border-light dark:border-neutral-border-dark text-xs text-neutral-text-muted;
  box-shadow: 0 -5px 20px hsl(var(--shadow-color-hsl)/0.05);
}
.dark .app-footer {
  box-shadow: 0 -5px 25px hsl(var(--shadow-color-hsl)/0.15);
}

.footer-content-wrapper {
  @apply max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4;
}

.footer-main-row {
  @apply flex flex-col sm:flex-row items-center justify-between gap-y-3 gap-x-4;
}

.footer-branding {
  @apply flex items-center gap-2.5;
}
.footer-logo-filter {
  filter: drop-shadow(0 0 3px hsl(var(--primary-color-hsl)/0.5));
}
.dark .footer-logo-filter {
  filter: drop-shadow(0 0 4px hsl(var(--primary-light-hsl)/0.6));
}

.footer-status-and-actions {
  @apply flex items-center gap-1.5 sm:gap-2;
}

.api-status-indicator {
  @apply flex items-center px-2.5 py-1.5 rounded-full bg-neutral-bg-surface dark:bg-neutral-bg-elevated text-xs font-medium border border-neutral-border dark:border-neutral-border-dark shadow-sm;
}
.status-dot-indicator {
  @apply w-2 h-2 rounded-full ml-2 shadow-sm;
  animation: pulseStatus 2.5s infinite ease-in-out;
}
@keyframes pulseStatus {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

.footer-action-button {
  @apply flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all duration-200 ease-out
         bg-neutral-bg-surface hover:bg-neutral-bg-elevated dark:bg-neutral-bg-elevated dark:hover:bg-neutral-bg-surface
         text-neutral-text-secondary hover:text-neutral-text
         border border-neutral-border dark:border-neutral-border-dark
         hover:shadow-interactive focus-visible:ring-1 focus-visible:ring-accent-focus focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-bg;
}
.footer-action-button.active {
  @apply bg-primary-500/20 dark:bg-primary-500/30 text-primary-700 dark:text-primary-300 border-primary-500/30 dark:border-primary-500/40 shadow-inner;
}
.footer-action-button .icon-sm { @apply w-4 h-4 text-current opacity-80; }
.footer-action-button:hover .icon-sm { @apply opacity-100; }


.footer-copyright {
  @apply text-center text-neutral-text-muted pt-3 mt-3 border-t border-neutral-border-light dark:border-neutral-border-dark text-[0.7rem] sm:text-xs font-mono tracking-tight;
}

/* Logs Panel */
.logs-display-card {
  @apply bg-neutral-bg-elevated dark:bg-black/80 border border-neutral-border-dark dark:border-neutral-border-dark shadow-2xl rounded-lg max-h-[40vh] overflow-hidden;
  backdrop-filter: blur(8px);
}

.slide-up-fade-logs-enter-active,
.slide-up-fade-logs-leave-active {
  transition: transform var(--duration-smooth) var(--ease-out-expo), opacity var(--duration-smooth) var(--ease-out-expo);
}
.slide-up-fade-logs-enter-from,
.slide-up-fade-logs-leave-to {
  transform: translateY(30px) scale(0.95);
  opacity: 0;
}
</style>