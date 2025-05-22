<template>
  <footer class="border-t dark:border-gray-800 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Branding and Status -->
        <div class="flex flex-col items-center md:items-start">
          <div class="flex items-center gap-2">
            <img src="/src/assets/logo.svg" alt="Logo" class="w-5 h-5" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Voice Coding Assistant</span>
          </div>
          
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Version 1.0.0 | <span class="text-primary-500 dark:text-primary-400">{{ latestLog }}</span>
          </div>
        </div>
        
        <!-- System Status (Desktop Only) -->
        <div class="hidden md:flex items-center gap-3">
          <button 
            @click="toggleLogs" 
            class="px-3 py-1 text-xs rounded-full flex items-center gap-1 transition-all"
            :class="logsOpen ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'"
          >
            <span class="inline-block w-2 h-2 rounded-full animate-pulse bg-green-400"></span>
            <span>System Logs ({{ logs.length }})</span>
          </button>
          
          <div class="text-xs flex items-center gap-2">
            <span class="text-gray-500 dark:text-gray-400">API Status:</span>
            <span class="font-medium flex items-center gap-1">
              <span class="inline-block w-2 h-2 rounded-full" :class="apiStatusClass"></span>
              {{ apiStatus }}
            </span>
          </div>
        </div>
        
        <!-- Links -->
        <div class="flex items-center gap-4">
          <router-link 
            to="/about"
            class="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            About
          </router-link>
          
          <a 
            href="https://manic.agency"
            target="_blank" 
            rel="noopener noreferrer"
            class="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            Created by Manic.Agency
          </a>
          
          <div class="flex items-center gap-3">
            <a 
              href="https://github.com/manic-agency/voice-coding-assistant"
              target="_blank" 
              rel="noopener noreferrer"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="View source on GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <!-- System Logs Section -->
      <TransitionGroup name="expand">
        <div v-if="logsOpen" key="logs" class="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">System Logs</h4>
            <div class="flex items-center gap-2">
              <button 
                @click="downloadLogs" 
                class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Download logs"
              >
                Download
              </button>
              <button 
                @click="clearLogs" 
                class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div class="logs-container h-32 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 p-2">
            <div v-for="(log, index) in logs" :key="index" class="text-xs font-mono mb-1">
              <span :class="getLogLevelClass(log.level)">{{ log.timestamp }} [{{ log.level.toUpperCase() }}]</span> {{ log.message }}
            </div>
            
            <div v-if="logs.length === 0" class="text-xs text-gray-500 dark:text-gray-400 italic">
              No logs to display.
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// System logs
const logs = ref<Array<{level: string; message: string; timestamp: string}>>([]);
const logsOpen = ref(false);
const apiStatus = ref('Operational');

// Sample logs for demonstration
const sampleLogs = [
  { level: 'info', message: 'Application started successfully', timestamp: '2025-05-21 11:30:02' },
  { level: 'info', message: 'User authenticated', timestamp: '2025-05-21 11:30:10' },
  { level: 'info', message: 'Connected to OpenAI API', timestamp: '2025-05-21 11:30:12' },
  { level: 'info', message: 'Voice recognition initialized', timestamp: '2025-05-21 11:30:15' },
];

// API status styling
const apiStatusClass = computed(() => {
  switch (apiStatus.value) {
    case 'Operational':
      return 'bg-green-400';
    case 'Degraded':
      return 'bg-yellow-400';
    case 'Down':
      return 'bg-red-400';
    default:
      return 'bg-gray-400';
  }
});

// Latest log for display
const latestLog = computed(() => {
  if (logs.value.length > 0) {
    const latest = logs.value[logs.value.length - 1];
    return `${latest.message}`;
  }
  return 'System ready';
});

// Methods
const toggleLogs = () => {
  logsOpen.value = !logsOpen.value;
};

const clearLogs = () => {
  logs.value = [];
  addLog('info', 'Logs cleared by user');
};

const downloadLogs = () => {
  const logContent = logs.value.map(log => 
    `${log.timestamp} [${log.level.toUpperCase()}] ${log.message}`
  ).join('\n');
  
  const blob = new Blob([logContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `voice-assistant-logs-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  addLog('info', 'Logs downloaded by user');
};

const addLog = (level: string, message: string) => {
  const now = new Date();
  const timestamp = now.toISOString().substring(0, 19).replace('T', ' ');
  logs.value.push({ level, message, timestamp });
  
  // Keep only the last 100 logs
  if (logs.value.length > 100) {
    logs.value.shift();
  }
  
  // Auto-scroll logs if panel is open
  if (logsOpen.value) {
    setTimeout(() => {
      const container = document.querySelector('.logs-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  }
};

const getLogLevelClass = (level: string) => {
  switch (level) {
    case 'error':
      return 'text-red-500 dark:text-red-400';
    case 'warning':
      return 'text-yellow-500 dark:text-yellow-400';
    case 'info':
    default:
      return 'text-blue-600 dark:text-blue-400';
  }
};

// Check API status periodically
const checkApiStatus = async () => {
  try {
    // This would be a real API call in production
    // For now, simulate different statuses
    const statuses = ['Operational', 'Operational', 'Operational', 'Degraded'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    if (apiStatus.value !== randomStatus) {
      apiStatus.value = randomStatus;
      addLog(randomStatus === 'Operational' ? 'info' : 'warning', `API status: ${randomStatus}`);
    }
  } catch (error) {
    apiStatus.value = 'Down';
    addLog('error', 'API health check failed');
  }
};

// Expose methods for parent components
defineExpose({
  addLog
});

// Initialize
onMounted(() => {
  logs.value = [...sampleLogs];
  
  // Check API status every 30 seconds
  checkApiStatus();
  setInterval(checkApiStatus, 30000);
  
  // Add periodic demo logs
  setInterval(() => {
    const randomMessages = [
      'Session cost updated',
      'Processed audio input',
      'Generated code snippet',
      'API request completed',
      'Model response received',
      'Voice transcription completed',
      'Diagram generated successfully',
      'User interaction processed'
    ];
    
    const randomIndex = Math.floor(Math.random() * randomMessages.length);
    addLog('info', randomMessages[randomIndex]);
  }, 45000);
});
</script>

<style scoped>
.logs-container::-webkit-scrollbar {
  width: 4px;
}

.logs-container::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800 rounded;
}

.logs-container::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded;
}

/* Expand animation for logs panel */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-out;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
}
</style>