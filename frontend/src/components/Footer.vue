// File: src/components/Footer.vue
/**
 * @file Footer.vue
 * @description Global application footer. Displays version, status, attributions, and system logs.
 * @version 2.0.0 - Enhanced design, Frame.dev attribution, refined logs UI.
 */
<template>
  <footer class="border-t border-gray-200 dark:border-gray-700/50 bg-gray-50/70 dark:bg-gray-900/70 backdrop-blur-md text-sm">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6 md:py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div class="flex flex-col items-center md:items-start text-center md:text-left">
            <div class="flex items-center gap-2">
              <img src="/src/assets/logo.svg" alt="VCA Logo" class="w-6 h-6" />
              <span class="font-semibold text-gray-800 dark:text-gray-100">Voice Coding Assistant</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              Version 1.0.1 | Status: <span class="font-medium" :class="apiStatus === 'Operational' ? 'text-green-500' : 'text-yellow-500'">{{ apiStatus }}</span>
            </p>
          </div>

          <div class="text-center space-y-2">
             <p class="text-xs text-gray-600 dark:text-gray-300">
              Lovingly crafted by <a href="https://manic.agency" target="_blank" rel="noopener noreferrer" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">Manic.Agency</a>
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-300">
              Proudly tagged by
              <a href="https://frame.dev" target="_blank" rel="noopener noreferrer" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">frame.dev</a>
              <span class="mx-1">|</span>
              <a href="https://github.com/wearetheframers" target="_blank" rel="noopener noreferrer" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">@wearetheframers</a>
            </p>
          </div>

          <div class="flex flex-col items-center md:items-end gap-3">
            <div class="flex items-center gap-4">
              <router-link
                to="/about"
                class="text-xs font-medium text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
              >
                About
              </router-link>
              <a
                :href="repositoryUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 transition-colors"
                title="View source on GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
            <button
              @click="toggleLogs"
              class="px-3 py-1.5 text-xs rounded-full flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              :class="logsOpen ? 'bg-primary-500 text-white shadow-md' : 'bg-gray-200/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:bg-gray-300/70 dark:hover:bg-gray-600/70'"
            >
              <span class="inline-block w-2 h-2 rounded-full animate-pulse" :class="apiStatus === 'Operational' ? 'bg-green-400' : 'bg-yellow-400'"></span>
              <span>System Logs</span>
              <span class="text-xs opacity-70">({{ logs.length }})</span>
            </button>
          </div>
        </div>

        <Transition name="expand">
          <div v-if="logsOpen" class="mt-6 p-4 bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-base font-semibold text-gray-800 dark:text-gray-100">System Activity</h4>
              <div class="flex items-center gap-3">
                <button
                  @click="downloadLogs"
                  class="text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  title="Download logs"
                >
                  Download
                </button>
                <button
                  @click="clearLogs"
                  class="text-xs font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  title="Clear logs"
                >
                  Clear
                </button>
              </div>
            </div>

            <div class="logs-container h-40 overflow-y-auto bg-gray-50 dark:bg-gray-900/80 rounded-md border border-gray-200 dark:border-gray-700 p-3 text-xs font-mono">
              <div v-if="logs.length === 0" class="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 italic">
                No logs to display. System is quiet.
              </div>
              <div v-for="(log, index) in logs" :key="index" class="mb-1.5 last:mb-0 whitespace-pre-wrap break-words">
                <span class="font-semibold" :class="getLogLevelClass(log.level)">[{{ log.level.toUpperCase() }}]</span>
                <span class="text-gray-500 dark:text-gray-400 ml-1 mr-2">{{ log.timestamp }}</span>
                <span class="text-gray-700 dark:text-gray-300">{{ log.message }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface LogEntry {
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  timestamp: string;
}

const repositoryUrl = ref('https://github.com/manic-agency/voice-coding-assistant'); // Or your specific repo

const logs = ref<LogEntry[]>([]);
const logsOpen = ref(false);
const apiStatus = ref<'Operational' | 'Degraded' | 'Down'>('Operational');

let apiStatusInterval: number | undefined;
let demoLogInterval: number | undefined;

const addLog = (level: LogEntry['level'], message: string) => {
  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  logs.value.push({ level, message, timestamp });

  if (logs.value.length > 150) { // Keep a bit more logs
    logs.value.shift();
  }

  if (logsOpen.value) {
    setTimeout(() => {
      const container = document.querySelector('.logs-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  }
};

const toggleLogs = () => {
  logsOpen.value = !logsOpen.value;
  if(logsOpen.value) {
    addLog('info', 'Log panel opened.');
  } else {
    // No need to log panel close unless for debugging the panel itself
  }
};

const clearLogs = () => {
  logs.value = [];
  addLog('info', 'Logs cleared by user.');
};

const downloadLogs = () => {
  const logContent = logs.value.map(log =>
    `${log.timestamp} [${log.level.toUpperCase()}] ${log.message}`
  ).join('\n');

  const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vca-logs-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  addLog('info', 'Logs downloaded.');
};

const getLogLevelClass = (level: LogEntry['level']) => {
  switch (level) {
    case 'error': return 'text-red-500 dark:text-red-400';
    case 'warning': return 'text-yellow-500 dark:text-yellow-400';
    case 'debug': return 'text-purple-500 dark:text-purple-400';
    case 'info':
    default: return 'text-blue-500 dark:text-blue-400';
  }
};

const checkApiStatus = async () => {
  // Simulated API status check
  const statuses: typeof apiStatus.value[] = ['Operational', 'Operational', 'Operational', 'Degraded', 'Down'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  if (apiStatus.value !== randomStatus) {
    apiStatus.value = randomStatus;
    addLog(randomStatus === 'Operational' ? 'info' : (randomStatus === 'Degraded' ? 'warning' : 'error'), `API status changed to: ${randomStatus}`);
  }
};

defineExpose({ addLog });

onMounted(() => {
  addLog('info', 'Footer initialized. Application ready.');
  checkApiStatus();
  apiStatusInterval = window.setInterval(checkApiStatus, 30000); // Check every 30 seconds

  // Demo logs for UI purposes if needed during development, can be removed for production
  demoLogInterval = window.setInterval(() => {
    const randomMessages = [
      'User login successful', 'Chat session started', 'Voice command received',
      'Transcription processing', 'LLM response generated', 'TTS synthesis complete'
    ];
    addLog('debug', randomMessages[Math.floor(Math.random() * randomMessages.length)]);
  }, 60000); // Add a debug log every minute
});

onUnmounted(() => {
  if (apiStatusInterval) clearInterval(apiStatusInterval);
  if (demoLogInterval) clearInterval(demoLogInterval);
});

</script>

<style scoped>
.logs-container::-webkit-scrollbar {
  width: 6px;
}
.logs-container::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800 rounded-full;
}
.logs-container::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded-full;
}
.logs-container::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); /* Smoother ease */
  max-height: 600px; /* Increased max-height for logs */
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0; /* Ensure no margin when collapsed */
  padding-top: 0;
  padding-bottom: 0;
  border-width: 0;
}
</style>