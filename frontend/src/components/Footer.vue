// File: frontend/src/components/Footer.vue
/**
 * @file Footer.vue
 * @description Global application footer component for the "Ephemeral Harmony" theme.
 * It displays application branding, version information, API status indicator,
 * links to source code and settings, and provides a toggle for the system logs display.
 *
 * @component Footer
 * @props None
 * @emits None
 *
 * @version 3.1.1 - Aligned template with revamped _footer.scss structure and styles.
 * Enhanced JSDoc and ensured all dynamic parts are correctly bound.
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref, type Component as VueComponentType } from 'vue';
import SystemLogDisplay from './ui/SystemLogDisplay.vue'; // For displaying system logs
import { RouterLink } from 'vue-router'; // For navigation links

// Icons from Heroicons
import {
  Cog6ToothIcon as ConfigIcon,   // Using Cog6ToothIcon for "Config" for variety
  CommandLineIcon as LogsIcon,
  CloudIcon as ApiDegradedIcon,
  WifiIcon as ApiOnlineIcon,
  NoSymbolIcon as ApiOfflineIcon,
  CodeBracketSquareIcon as SourceIcon,
  QuestionMarkCircleIcon as ApiCheckingIcon // For default "Checking" state
} from '@heroicons/vue/24/outline';

/**
 * @const {string} APP_VERSION - Placeholder for the application version, ideally injected via build process.
 */
const APP_VERSION = '5.0.6'; // Example version, sync with App.vue or global const

/**
 * @const {Ref<string>} repositoryUrl - URL to the application's source code repository.
 */
const repositoryUrl: Ref<string> = ref('https://github.com/wearetheframers/agentos'); // Your actual repo URL

/**
 * @ref {Ref<boolean>} logsOpen - Controls the visibility of the SystemLogDisplay panel.
 */
const logsOpen: Ref<boolean> = ref(false);

/**
 * @type ApiStatusValue
 * @description Represents the possible states of the API.
 */
type ApiStatusValue = 'Operational' | 'Degraded' | 'Down' | 'Checking';

/**
 * @ref {Ref<ApiStatusValue>} apiStatus - Current status of the backend API.
 */
const apiStatus: Ref<ApiStatusValue> = ref<ApiStatusValue>('Checking');

let apiStatusInterval: number | undefined;

/**
 * @computed apiStatusInfo
 * @description Provides an object with text, CSS class, icon component, and dot class
 * based on the current `apiStatus`. Used for dynamic styling and content of the status indicator.
 * @returns {{ text: string; class: string; icon: VueComponentType; dotClass: string }}
 */
const apiStatusInfo = computed(() => {
  switch (apiStatus.value) {
    case 'Operational':
      return { text: 'Agents Online', class: 'text-[hsl(var(--color-success-h),var(--color-success-s),var(--color-success-l))]', icon: ApiOnlineIcon, dotClass: 'bg-[hsl(var(--color-success-h),var(--color-success-s),var(--color-success-l))]' };
    case 'Degraded':
      return { text: 'Agents Degraded', class: 'text-[hsl(var(--color-warning-h),var(--color-warning-s),var(--color-warning-l))]', icon: ApiDegradedIcon, dotClass: 'bg-[hsl(var(--color-warning-h),var(--color-warning-s),var(--color-warning-l))]' };
    case 'Down':
      return { text: 'Agents Offline', class: 'text-[hsl(var(--color-error-h),var(--color-error-s),var(--color-error-l))]', icon: ApiOfflineIcon, dotClass: 'bg-[hsl(var(--color-error-h),var(--color-error-s),var(--color-error-l))]' };
    default: // 'Checking' or unknown
      return { text: 'Agents Status...', class: 'text-[hsl(var(--color-text-muted-h),var(--color-text-muted-s),var(--color-text-muted-l))]', icon: ApiCheckingIcon, dotClass: 'bg-[hsl(var(--color-text-muted-h),var(--color-text-muted-s),var(--color-text-muted-l))] animate-pulse' };
  }
});

/**
 * @function toggleLogsPanel
 * @description Toggles the visibility of the system logs panel.
 * @returns {void}
 */
const toggleLogsPanel = (): void => {
  logsOpen.value = !logsOpen.value;
};

/**
 * @function checkApiStatus
 * @description Simulates checking the API status by randomly cycling through predefined states.
 * In a real application, this would make an actual API call to a health check endpoint.
 * @async
 * @returns {Promise<void>}
 */
const checkApiStatus = async (): Promise<void> => {
  // Placeholder: Simulate API status check
  const statuses: ApiStatusValue[] = ['Operational', 'Degraded', 'Down', 'Operational', 'Operational', 'Checking'];
  apiStatus.value = statuses[Math.floor(Math.random() * statuses.length)];
  // Example: In a real app, you might do:
  // try {
  //   const response = await api.get('/health/status'); // Assuming an endpoint like this
  //   if (response.data.status === 'OK') apiStatus.value = 'Operational';
  //   // ... handle other statuses
  // } catch (error) {
  //   apiStatus.value = 'Down';
  // }
};

// Set up an interval to periodically check API status on component mount.
onMounted(() => {
  checkApiStatus(); // Initial check
  apiStatusInterval = window.setInterval(checkApiStatus, 30000); // Check every 30 seconds
});

// Clear the interval when the component is unmounted to prevent memory leaks.
onUnmounted(() => {
  if (apiStatusInterval) clearInterval(apiStatusInterval);
});
</script>

<template>
  <footer class="app-footer-ephemeral" role="contentinfo">
    <Transition name="slide-up-fade-logs">
      <div v-if="logsOpen" class="logs-panel-wrapper-ephemeral">
        <SystemLogDisplay class="logs-display-card-ephemeral" />
      </div>
    </Transition>

    <div class="footer-content-wrapper-ephemeral">
      <div class="footer-main-row-ephemeral">
        <div class="footer-branding-ephemeral">
          <img src="@/assets/logo.svg" alt="Voice Coding Assistant Logo" class="footer-logo-ephemeral" />
          <div class="brand-text-group">
            <!-- <span class="brand-title-ephemeral"><strong>V</strong> -->
               <!-- <span class="opacity-60 font-light text-xs">v{{ APP_VERSION }}</span> -->
              <!-- </span> -->
            <span class="brand-powered-by-ephemeral">
              Powered by <a href="https://github.com/wearetheframers/agentos" target="_blank" rel="noopener noreferrer" class="font-semibold hover:text-[hsl(var(--color-accent-secondary-h),var(--color-accent-secondary-s),var(--color-accent-secondary-l))]">AgentOS</a>
            </span>
          </div>
          
        <div class="footer-attributions-ephemeral">
          <span>
            &copy; {{ new Date().getFullYear() }} 
            VCA.Chat
            <!-- Voice Assistant Project. -->
          </span>
          <span>
            by <a href="https://manic.agency" target="_blank" rel="noopener noreferrer">Manic.agency</a>.
          </span>
            All rights reserved.
          </div>
        </div>

        <div class="footer-status-actions-ephemeral">
          <div class="api-status-indicator-ephemeral" :title="apiStatusInfo.text">
            <component :is="apiStatusInfo.icon" class="icon" :class="apiStatusInfo.class" aria-hidden="true" />
            <span class="status-text hidden md:inline" :class="apiStatusInfo.class">{{ apiStatusInfo.text }}</span>
            <span class="status-dot" :class="apiStatusInfo.dotClass" aria-hidden="true"></span>
          </div>

          <button
            @click="toggleLogsPanel"
            class="footer-action-button-ephemeral"
            :class="{ 'active': logsOpen }"
            title="Toggle System Logs"
            aria-label="Toggle System Logs Display"
            :aria-pressed="logsOpen"
          >
            <LogsIcon class="icon" aria-hidden="true" />
            <span class="hidden sm:inline">Logs</span>
          </button>

          <a
            :href="repositoryUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-action-button-ephemeral"
            title="View Source Code on GitHub"
            aria-label="View Source Code on GitHub"
          >
            <SourceIcon class="icon" aria-hidden="true" />
            <span class="hidden sm:inline">Source</span>
          </a>
          <RouterLink
            to="/settings"
            class="footer-action-button-ephemeral"
            title="Open Application Settings"
            aria-label="Open Application Settings"
          >
            <ConfigIcon class="icon" aria-hidden="true" />
            <span class="hidden sm:inline">Config</span>
          </RouterLink>
        </div>
      </div>


    </div>
  </footer>
</template>

<style lang="scss">
// Styles for Footer.vue are primarily in frontend/src/styles/layout/_footer.scss
// This global import assumes _footer.scss is part of your main.scss build.
// No scoped styles needed here if all are handled by the global SCSS partial.
</style>