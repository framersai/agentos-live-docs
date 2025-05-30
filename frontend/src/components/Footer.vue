// File: frontend/src/components/Footer.vue
/**
 * @file Footer.vue
 * @description Global application footer component. Displays copyright, API status, and quick actions.
 * Optimized for a compact view on mobile devices.
 *
 * @component Footer
 * @props None
 * @emits None
 *
 * @version 3.2.0 - Simplified branding and attribution for a cleaner look.
 * Enhanced mobile compactness by adjusting text visibility and preparing for icon size changes via SCSS.
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref, type Component as VueComponentType } from 'vue';
import SystemLogDisplay from './ui/SystemLogDisplay.vue'; // For displaying system logs
import { RouterLink } from 'vue-router'; // For navigation links

// Icons from Heroicons
import {
  Cog6ToothIcon as ConfigIcon,
  CommandLineIcon as LogsIcon,
  CloudIcon as ApiDegradedIcon,
  WifiIcon as ApiOnlineIcon,
  NoSymbolIcon as ApiOfflineIcon,
  CodeBracketSquareIcon as SourceIcon,
  QuestionMarkCircleIcon as ApiCheckingIcon
} from '@heroicons/vue/24/outline';

/**
 * @const {string} APP_VERSION - Placeholder for the application version.
 */
const APP_VERSION = '5.0.6'; // Kept for potential future use, though not displayed directly in this simplified footer.

/**
 * @const {Ref<string>} repositoryUrl - URL to the application's source code repository.
 */
const repositoryUrl: Ref<string> = ref('https://github.com/wearetheframers/agentos');

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
      return { text: 'Agents Online', class: 'text-status-success', icon: ApiOnlineIcon, dotClass: 'bg-status-success' };
    case 'Degraded':
      return { text: 'Agents Degraded', class: 'text-status-warning', icon: ApiDegradedIcon, dotClass: 'bg-status-warning' };
    case 'Down':
      return { text: 'Agents Offline', class: 'text-status-error', icon: ApiOfflineIcon, dotClass: 'bg-status-error' };
    default: // 'Checking' or unknown
      return { text: 'Agents Status...', class: 'text-status-muted', icon: ApiCheckingIcon, dotClass: 'bg-status-muted animate-pulse' };
  }
});
// Note: The classes like 'text-status-success' now assume you have utility classes or CSS variables
// that map to your theme's success, warning, error, muted colors. E.g.,
// .text-status-success { color: hsl(var(--color-success-h), var(--color-success-s), var(--color-success-l)); }
// .bg-status-success { background-color: hsl(var(--color-success-h), var(--color-success-s), var(--color-success-l)); }
// These would ideally be part of your global utilities or _footer.scss.

/**
 * @function toggleLogsPanel
 * @description Toggles the visibility of the system logs panel.
 */
const toggleLogsPanel = (): void => {
  logsOpen.value = !logsOpen.value;
};

/**
 * @function checkApiStatus
 * @description Simulates checking the API status.
 */
const checkApiStatus = async (): Promise<void> => {
  const statuses: ApiStatusValue[] = ['Operational', 'Degraded', 'Down', 'Operational', 'Operational', 'Checking'];
  apiStatus.value = statuses[Math.floor(Math.random() * statuses.length)];
};

onMounted(() => {
  checkApiStatus();
  apiStatusInterval = window.setInterval(checkApiStatus, 30000);
});

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
          <img src="@/assets/logo.svg" alt="VCA Logo" class="footer-logo-ephemeral" />
          <p class="footer-copyright-ephemeral">
            &copy; {{ new Date().getFullYear() }} VCA.Chat. All rights reserved.
          </p>
        </div>

        <div class="footer-status-actions-ephemeral">
          <div class="api-status-indicator-ephemeral" :title="apiStatusInfo.text">
            <component :is="apiStatusInfo.icon" class="icon api-status-icon" :class="apiStatusInfo.class" aria-hidden="true" />
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
            <span class="action-text hidden sm:inline">Logs</span>
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
            <span class="action-text hidden sm:inline">Source</span>
          </a>
          <RouterLink
            to="/settings"
            class="footer-action-button-ephemeral"
            title="Open Application Settings"
            aria-label="Open Application Settings"
          >
            <ConfigIcon class="icon" aria-hidden="true" />
            <span class="action-text hidden sm:inline">Config</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
// Styles for Footer.vue are primarily in frontend/src/styles/layout/_footer.scss
// This assumes _footer.scss is imported into your main.scss or a similar global stylesheet.
</style>