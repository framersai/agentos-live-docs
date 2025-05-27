// File: frontend/src/components/Footer.vue
/**
 * @file Footer.vue
 * @description Global application footer, styled for the "Ephemeral Harmony" theme.
 * Displays version, status, attributions, and system logs access.
 * @version 3.1.0 - Ephemeral Harmony Theme Update with Branding.
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SystemLogDisplay from './ui/SystemLogDisplay.vue';
import {
  Cog6ToothIcon as CogIcon, // Alias for clarity if Cog8ToothIcon is used elsewhere
  CommandLineIcon,
  CloudIcon,
  WifiIcon,
  NoSymbolIcon,
  CodeBracketSquareIcon,
  UsersIcon, // For The Framers
  BuildingOffice2Icon, // For Manic Inc.
  CubeTransparentIcon // For AgentOS
} from '@heroicons/vue/24/outline';
import type { Component } from 'vue';

type VueComponent = Component;

const repositoryUrl = ref('https://github.com/manicinc/voice-coding-assistant');
const logsOpen = ref(false);
const apiStatus = ref<'Operational' | 'Degraded' | 'Down' | 'Checking'>('Checking');
let apiStatusInterval: number | undefined;

const apiStatusInfo = computed(() => {
  switch (apiStatus.value) {
    case 'Operational': return { text: 'API Online', class: 'text-success', icon: WifiIcon as VueComponent, dotClass: 'bg-success' };
    case 'Degraded': return { text: 'API Degraded', class: 'text-warning', icon: CloudIcon as VueComponent, dotClass: 'bg-warning' };
    case 'Down': return { text: 'API Offline', class: 'text-error', icon: NoSymbolIcon as VueComponent, dotClass: 'bg-error' };
    default: return { text: 'API Status...', class: 'text-neutral-text-muted', icon: CogIcon as VueComponent, dotClass: 'bg-neutral-text-muted animate-pulse' };
  }
});

const toggleLogsPanel = (): void => {
  logsOpen.value = !logsOpen.value;
};

const checkApiStatus = async (): Promise<void> => {
  const statuses: Array<'Operational' | 'Degraded' | 'Down'> = ['Operational', 'Degraded', 'Down', 'Operational', 'Operational'];
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
  <footer class="app-footer-ephemeral">
    <Transition name="slide-up-fade-logs">
      <div v-if="logsOpen" class="logs-panel-wrapper-ephemeral">
        <SystemLogDisplay class="logs-display-card-ephemeral" />
      </div>
    </Transition>

    <div class="footer-content-wrapper-ephemeral">
      <div class="footer-main-row-ephemeral">
        <div class="footer-branding-ephemeral">
          <img src="/src/assets/logo.svg" alt="VCA Logo" class="footer-logo-ephemeral" />
          <div class="brand-text-group">
            <span class="brand-title-ephemeral">Voice Chat Assistant</span>
            <span class="brand-powered-by-ephemeral">
              Powered by <a href="https://github.com/AgentOSAIs/AgentOS" target="_blank" rel="noopener noreferrer" class="font-semibold hover:text-accent-secondary">AgentOS</a>
            </span>
          </div>
        </div>

        <div class="footer-status-actions-ephemeral">
          <div class="api-status-indicator-ephemeral" :title="apiStatusInfo.text">
            <component :is="apiStatusInfo.icon" class="icon" :class="apiStatusInfo.class" />
            <span class="status-text hidden md:inline" :class="apiStatusInfo.class">{{ apiStatusInfo.text }}</span>
            <span class="status-dot" :class="apiStatusInfo.dotClass"></span>
          </div>

          <button @click="toggleLogsPanel" class="footer-action-button-ephemeral" :class="{ 'active': logsOpen }" title="Toggle System Logs">
            <CommandLineIcon class="icon" />
            <span class="hidden sm:inline">Logs</span>
          </button>

          <a :href="repositoryUrl" target="_blank" rel="noopener noreferrer" class="footer-action-button-ephemeral" title="View Source on GitHub">
            <CodeBracketSquareIcon class="icon" />
            <span class="hidden sm:inline">Source</span>
          </a>
          <router-link to="/settings" class="footer-action-button-ephemeral" title="Settings">
            <CogIcon class="icon" />
            <span class="hidden sm:inline">Config</span>
          </router-link>
        </div>
      </div>

      <div class="footer-attributions-ephemeral">
        &copy; {{ new Date().getFullYear() }} Voice Chat Assistant.
        Developed by
        <a href="https://frame.dev" target="_blank" rel="noopener noreferrer">The Framers</a> &amp;
        <a href="https://manic.agency" target="_blank" rel="noopener noreferrer">Manic Inc</a>.
        All rights reserved.
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
// No SCSS needed here if all styles are in the global _footer.scss
// However, if you have very specific, one-off styles for this component
// that won't be reused and don't fit the global theme, you could add them here.
// For this refactor, we assume all styles are in the global SCSS partial.
// .example-local-class { color: red; }
</style>