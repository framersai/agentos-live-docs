// File: frontend/src/components/layout/AppFooter.vue
<template>
  <footer
    class="app-footer border-t py-4"
    data-voice-target-region="application-footer"
  >
    <div class="app-container mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-y-4 md:gap-x-4">
        <div class="footer-section text-center md:text-left" :data-voice-target="voiceTargetIdPrefix + 'branding-info'">
          <div class="flex items-center justify-center md:justify-start gap-2 mb-1">
            <img src="/src/assets/logo.svg" :alt="t('app.name') + ' Logo'" class="w-5 h-5 footer-logo-icon" />
            <span class="text-sm font-medium footer-app-name">{{ t('app.name') }}</span>
          </div>
          <p class="text-xs footer-version-status">
            {{ t('footer.version') }} {{ appVersion }} |
            <span :class="['status-indicator', apiStatusDetails.class]">{{ apiStatusDetails.text }}</span>
          </p>
        </div>

        <div class="footer-section text-center order-last md:order-none">
          <div v-if="authStore.isAuthenticated" class="system-info-toggle">
             <AppButton
                variant="tertiary"
                size="xs"
                :icon="logsOpen ? ChevronUpIcon : ChevronDownIcon"
                iconPosition="right"
                :aria-expanded="logsOpen"
                aria-controls="system-logs-panel"
                :data-voice-target="voiceTargetIdPrefix + 'toggle-logs-button'"
                @click="toggleLogsPanel"
            >
                {{ t('footer.systemLogs') }} ({{ systemLogs.length }})
            </AppButton>
          </div>
          <p v-else class="text-xs footer-copyright">&copy; {{ currentYear }} {{ t('app.companyName') }}. {{ t('footer.allRightsReserved') }}</p>
        </div>

        <div class="footer-section text-center md:text-right">
          <nav class="flex items-center justify-center md:justify-end gap-x-4 gap-y-2 flex-wrap" aria-label="Footer links">
            <router-link
              :to="{ name: 'About' }"
              class="footer-link"
              :data-voice-target="voiceTargetIdPrefix + 'about-link'"
            >
              {{ t('navigation.about') }}
            </router-link>
            <a
              :href="appConfig.companyWebsiteUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-link"
              :data-voice-target="voiceTargetIdPrefix + 'company-website-link'"
            >
              {{ t('app.companyName') }}
            </a>
            <a
              :href="appConfig.githubRepoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-social-link"
              :aria-label="t('footer.viewSourceGithub')"
              :title="t('footer.viewSourceGithub')"
              :data-voice-target="voiceTargetIdPrefix + 'github-link'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            </nav>
        </div>
      </div>

      <Transition
        enter-active-class="transition-max-height ease-out duration-300"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-screen opacity-100"
        leave-active-class="transition-max-height ease-in duration-200"
        leave-from-class="max-h-screen opacity-100"
        leave-to-class="max-h-0 opacity-0"
      >
        <div v-if="logsOpen" id="system-logs-panel" class="system-logs-panel mt-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-semibold logs-title">{{ t('footer.systemLogsTitle') }}</h4>
            <div class="flex items-center gap-2">
              <AppButton variant="link" size="xs" @click="downloadLogs" :data-voice-target="voiceTargetIdPrefix + 'download-logs-button'">{{ t('footer.downloadLogs') }}</AppButton>
              <AppButton variant="link" size="xs" @click="clearLogs" :data-voice-target="voiceTargetIdPrefix + 'clear-logs-button'">{{ t('footer.clearLogs') }}</AppButton>
            </div>
          </div>
          <div class="logs-container" ref="logsContainerRef" :data-voice-target="voiceTargetIdPrefix + 'logs-output-area'">
            <p v-if="systemLogs.length === 0" class="log-entry italic">{{ t('footer.noLogs') }}</p>
            <p v-for="(log, index) in systemLogs" :key="index" :class="['log-entry', getLogLevelClass(log.level)]">
              <span class="log-timestamp">{{ log.timestamp }}</span>
              <span class="log-level">[{{ log.level.toUpperCase() }}]</span>
              <span class="log-message">{{ log.message }}</span>
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </footer>
</template>

<script setup lang="ts">
/**
 * @file AppFooter.vue
 * @description Global application footer. Displays branding, version, status, links, and system logs.
 * Themeable, responsive, and voice-navigable.
 */
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from '../../../../composables/useI18n';
import { useAuthStore } from '../../../features/auth/store/auth.store';
import { appConfig } from '../../../config/appConfig'; // Assuming a global app config
import AppButton from '../common/AppButton.vue';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'; // For toggle

// Log structure (could be imported from a types file)
interface SystemLog {
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  timestamp: string; // Formatted timestamp
  data?: Record<string, any>; // Optional structured data
}

const props = defineProps({
  /**
   * Optional prefix for all voice target IDs within this footer.
   */
  voiceTargetIdPrefix: {
    type: String,
    default: 'app-footer-',
  }
});

const { t } = useI18n();
const authStore = useAuthStore();

const appVersion = computed(() => appConfig.version); // From src/config/appConfig.ts
const currentYear = computed(() => new Date().getFullYear());

// --- System Logs ---
const systemLogs = ref<SystemLog[]>([]);
const logsOpen = ref(false);
const logsContainerRef = ref<HTMLElement | null>(null);
let logIntervalId: number | null = null;
let apiStatusIntervalId: number | null = null;

const addSystemLog = (level: SystemLog['level'], message: string, data?: Record<string, any>) => {
  const now = new Date();
  const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  systemLogs.value.push({ level, message, timestamp, data });
  if (systemLogs.value.length > 100) { // Keep max 100 logs
    systemLogs.value.shift();
  }
  // Auto-scroll logs if panel is open
  if (logsOpen.value) {
    nextTick(() => {
      if (logsContainerRef.value) {
        logsContainerRef.value.scrollTop = logsContainerRef.value.scrollHeight;
      }
    });
  }
};

// --- API Status ---
const apiCurrentStatus = ref<'Operational' | 'Degraded' | 'Down' | 'Checking'>('Checking');
const apiStatusDetails = computed(() => {
  switch (apiCurrentStatus.value) {
    case 'Operational': return { text: t('footer.apiStatusOperational'), class: 'status-operational', iconColor: 'var(--app-success-color)'};
    case 'Degraded': return { text: t('footer.apiStatusDegraded'), class: 'status-degraded', iconColor: 'var(--app-warning-color)'};
    case 'Down': return { text: t('footer.apiStatusDown'), class: 'status-down', iconColor: 'var(--app-danger-color)'};
    default: return { text: t('footer.apiStatusChecking'), class: 'status-checking', iconColor: 'var(--app-text-muted-color)'};
  }
});

const checkApiStatus = async () => {
  // This would be a real health check to your backend /health endpoint
  try {
    // const response = await apiService.get('/health'); // Assuming apiService is available
    // For demo, simulate status changes
    const statuses: typeof apiCurrentStatus.value[] = ['Operational', 'Operational', 'Operational', 'Degraded', 'Down'];
    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
    if (newStatus !== apiCurrentStatus.value) {
        apiCurrentStatus.value = newStatus;
        addSystemLog(newStatus === 'Operational' ? 'info' : (newStatus === 'Degraded' ? 'warning' : 'error'), `API Status changed to: ${newStatus}`);
    }
  } catch (error) {
    if (apiCurrentStatus.value !== 'Down') {
        apiCurrentStatus.value = 'Down';
        addSystemLog('error', `API health check failed: ${(error as Error).message}`);
    }
  }
};


onMounted(() => {
  addSystemLog('info', `${t('app.name')} footer initialized. App Version: ${appVersion.value}.`);
  checkApiStatus(); // Initial check
  apiStatusIntervalId = setInterval(checkApiStatus, 30000) as unknown as number; // Check every 30s

  // Demo logs (remove in production)
  if (import.meta.env.DEV) {
    logIntervalId = setInterval(() => {
        const messages = ['User action recorded.', 'Background task completed.', 'Configuration updated.', 'New data received.'];
        addSystemLog('debug', messages[Math.floor(Math.random() * messages.length)]);
    }, 15000) as unknown as number;
  }
});

onBeforeUnmount(() => {
  if (logIntervalId) clearInterval(logIntervalId);
  if (apiStatusIntervalId) clearInterval(apiStatusIntervalId);
});

const toggleLogsPanel = () => logsOpen.value = !logsOpen.value;
const clearLogs = () => {
  systemLogs.value = [];
  addSystemLog('info', 'System logs cleared by user.');
};
const downloadLogs = () => {
  const logContent = systemLogs.value.map(log =>
    `${log.timestamp} [${log.level.toUpperCase()}] ${log.message}${log.data ? ' ' + JSON.stringify(log.data) : ''}`
  ).join('\n');
  const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vca-system-logs-${new Date().toISOString().slice(0,10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  addSystemLog('info', 'System logs downloaded.');
};

const getLogLevelClass = (level: SystemLog['level']) => {
  return {
    'log-info': level === 'info',
    'log-warning': level === 'warning',
    'log-error': level === 'error',
    'log-debug': level === 'debug',
  };
};
</script>

<style scoped>
.app-footer {
  background-color: var(--app-footer-bg, var(--app-surface-color));
  color: var(--app-footer-text-color, var(--app-text-secondary-color));
  border-top-color: var(--app-footer-border-color, var(--app-border-color));
}

.footer-section {
  /* Spacing handled by grid gap */
}

.footer-logo-icon {
  /* Themeable filter for logo if needed, e.g., for dark mode */
  /* filter: var(--app-logo-filter); */
}
.footer-app-name {
  color: var(--app-footer-title-color, var(--app-text-color));
}
.footer-version-status {
  color: var(--app-footer-muted-text-color, var(--app-text-muted-color));
}
.status-indicator {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.7rem; /* Tailwind text-xs is 0.75rem, this is smaller */
  border-radius: var(--app-badge-border-radius, 9999px);
  font-weight: 500;
  line-height: 1.2;
}
.status-operational { background-color: var(--app-success-bg-subtle, #d1fae5); color: var(--app-success-text-strong, #065f46); }
.status-degraded { background-color: var(--app-warning-bg-subtle, #fef3c7); color: var(--app-warning-text-strong, #92400e); }
.status-down { background-color: var(--app-danger-bg-subtle, #fee2e2); color: var(--app-danger-text-strong, #991b1b); }
.status-checking { background-color: var(--app-neutral-bg-subtle, #f3f4f6); color: var(--app-neutral-text-strong, #374151); }


.footer-link, .footer-social-link {
  font-size: var(--app-font-size-xs, 0.75rem);
  color: var(--app-footer-link-color, var(--app-text-secondary-color));
  transition: color 0.2s ease;
}
.footer-link:hover, .footer-social-link:hover {
  color: var(--app-footer-link-hover-color, var(--app-primary-color));
}
.footer-social-link svg {
  fill: currentColor;
}
.footer-copyright {
    color: var(--app-footer-muted-text-color, var(--app-text-muted-color));
}

.system-logs-panel {
  background-color: var(--app-logs-panel-bg, var(--app-surface-inset-color));
  border: 1px solid var(--app-logs-panel-border, var(--app-border-color-light));
  border-radius: var(--app-border-radius-md, 0.5rem);
  padding: 1rem;
  overflow: hidden; /* For transition */
}
.logs-title {
    color: var(--app-logs-title-color, var(--app-text-color));
}
.logs-container {
  height: 8rem; /* 128px */
  overflow-y: auto;
  background-color: var(--app-logs-bg, var(--app-code-bg-color));
  border-radius: var(--app-border-radius-sm, 0.25rem);
  border: 1px solid var(--app-logs-border, var(--app-border-color-light));
  padding: 0.5rem;
  font-family: var(--app-font-family-mono, monospace);
  font-size: var(--app-font-size-xs, 0.75rem);
  color: var(--app-logs-text-color, var(--app-text-secondary-color));
}
.log-entry { margin-bottom: 0.25rem; white-space: pre-wrap; word-break: break-all; }
.log-timestamp { color: var(--app-logs-timestamp-color, var(--app-text-muted-color)); margin-right: 0.5em; }
.log-level { font-weight: 500; margin-right: 0.5em; }
.log-info .log-level { color: var(--app-info-color, #3b82f6); }
.log-warning .log-level { color: var(--app-warning-color, #f59e0b); }
.log-error .log-level { color: var(--app-danger-color, #ef4444); }
.log-debug .log-level { color: var(--app-neutral-color, #6b7280); }

/* Transition for max-height */
.transition-max-height {
  transition-property: max-height, opacity;
}
</style>