<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref, type Component as VueComponentType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import SystemLogDisplay from './ui/SystemLogDisplay.vue';
import { RouterLink } from 'vue-router';
// Import the COMPLEX, stateful HearingIndicator
import HearingIndicator from '@/components/ui/HearingIndicator.vue';
import { useReactiveStore, type AppState } from '@/store/reactive.store';
import { useUiStore } from '@/store/ui.store'; // For isReducedMotionPreferred

import {
  Cog6ToothIcon as ConfigIcon,
  CommandLineIcon as LogsIcon,
  CloudIcon as ApiDegradedIcon,
  WifiIcon as ApiOnlineIcon,
  NoSymbolIcon as ApiOfflineIcon,
  CodeBracketSquareIcon as SourceIcon,
  QuestionMarkCircleIcon as ApiCheckingIcon
} from '@heroicons/vue/24/outline';

const APP_VERSION = '5.0.6';
const repositoryUrl: Ref<string> = ref('https://github.com/wearetheframers/agentos');
const logsOpen: Ref<boolean> = ref(false);
type ApiStatusValue = 'Operational' | 'Degraded' | 'Down' | 'Checking';
const apiStatus: Ref<ApiStatusValue> = ref<ApiStatusValue>('Checking');
let apiStatusInterval: number | undefined;

const reactiveStore = useReactiveStore();
const uiStore = useUiStore();
const { t } = useI18n();
const route = useRoute();

// The HearingIndicator will use this appState to show its dynamic visuals
const appStateForFooterIndicator = computed<AppState>(() => reactiveStore.appState);

const apiStatusInfo = computed(() => {
  // ... (same as your provided code)
  switch (apiStatus.value) {
    case 'Operational':
      return { text: t('status.online'), class: 'text-status-success', icon: ApiOnlineIcon, dotClass: 'bg-status-success' };
    case 'Degraded':
      return { text: t('status.degraded'), class: 'text-status-warning', icon: ApiDegradedIcon, dotClass: 'bg-status-warning' };
    case 'Down':
      return { text: t('status.offline'), class: 'text-status-error', icon: ApiOfflineIcon, dotClass: 'bg-status-error' };
    default:
      return { text: t('status.checking'), class: 'text-status-muted', icon: ApiCheckingIcon, dotClass: 'bg-status-muted animate-pulse' };
  }
});

const toggleLogsPanel = (): void => {
  logsOpen.value = !logsOpen.value;
};

const checkApiStatus = async (): Promise<void> => {
  const statuses: ApiStatusValue[] = ['Operational', 'Degraded', 'Down', 'Operational', 'Operational', 'Checking'];
  apiStatus.value = statuses[Math.floor(Math.random() * statuses.length)];
};

const handleFooterHearingIndicatorClick = () => {
  // This is the main interaction point, e.g., toggle microphone listening state
  // This should ideally call a method in a store (e.g., appManager.toggleListening())
  console.log('Footer HearingIndicator Clicked. Current App State:', appStateForFooterIndicator.value);
  if (reactiveStore.appState === 'idle' || reactiveStore.appState=== 'error') {
    reactiveStore.transitionToState('listening');
  } else if (reactiveStore.appState === 'listening' || reactiveStore.appState === 'speaking' || reactiveStore.appState === 'responding') {
    reactiveStore.transitionToState('idle'); // or a specific 'stop' state
  }
  // Add actual logic to toggle listening state via a store action
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
            &copy; {{ new Date().getFullYear() }} VCA.Chat. {{ t('common.allRightsReserved') }}
          </p>
        </div>

        <div class="footer-center-indicator-ephemeral" @click="handleFooterHearingIndicatorClick" role="button" tabindex="0">
          <HearingIndicator
            :customState="appStateForFooterIndicator"
            :size="44" :interactive="true"
            :showLabel="false" />
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
            <span class="action-text hidden sm:inline">{{ t('common.logs') }}</span>
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
            <span class="action-text hidden sm:inline">{{ t('common.source') }}</span>
          </a>
          <RouterLink
            :to="`/${route.params.locale || 'en-US'}/settings`"
            class="footer-action-button-ephemeral"
            title="Open Application Settings"
            aria-label="Open Application Settings"
          >
            <ConfigIcon class="icon" aria-hidden="true" />
            <span class="action-text hidden sm:inline">{{ t('common.settings') }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>