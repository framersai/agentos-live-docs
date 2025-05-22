<template>
  <header 
    class="app-header sticky top-0 z-40 transition-all backdrop-blur-sm border-b dark:border-gray-800"
    :class="{
      'bg-white/95 dark:bg-gray-900/95': !isFullscreen,
      'bg-transparent': isFullscreen && !isMobileNavOpen,
      'bg-white dark:bg-gray-900': isFullscreen && isMobileNavOpen
    }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6" v-show="!isFullscreen || isMobileNavOpen">
      <div class="flex items-center justify-between py-3 md:py-4">
        <div class="flex items-center gap-3">
          <div class="logo-container">
            <img src="/src/assets/logo.svg" alt="VCA" class="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div class="hidden md:block">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Voice Coding <span class="text-gradient font-bold">Assistant</span>
            </h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">AI-powered voice coding</p>
          </div>
          <span class="md:hidden text-lg font-bold text-gray-900 dark:text-white">VCA</span>
        </div>
        
        <div class="flex items-center gap-2">
          <div class="cost-display glass-effect px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium">
            <span class="hidden sm:inline text-gray-600 dark:text-gray-300">Cost:</span>
            <span class="font-mono text-primary-600 dark:text-primary-400 font-bold">
              ${{ sessionCost.toFixed(4) }}
            </span>
          </div>
          
          <button 
            @click="toggleFullscreen"
            class="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
            :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
          >
            <svg v-if="isFullscreen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M9 15H4.5M9 15v4.5M9 15l-5.25 5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>
          
          <button 
            @click="toggleMobileNav"
            class="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="isMobileNavOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div class="hidden md:block pb-2">
        <div class="flex flex-wrap items-center gap-4">
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mode:</label>
            <select 
              v-model="localMode"
              class="compact-select"
            >
              <option v-for="preset in modePresets" :key="preset.value" :value="preset.value">
                {{ preset.label }}
              </option>
            </select>
          </div>
          
          <div v-if="localMode === 'coding'" class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language:</label>
            <select v-model="localLanguage" class="compact-select">
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>
          
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Audio:</label>
            <select v-model="localAudioMode" class="compact-select">
              <option value="push-to-talk">Push to Talk</option>
              <option value="continuous">Continuous</option>
            </select>
          </div>
          
          <div class="flex items-center gap-4 ml-2">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600 dark:text-gray-400">Auto-Clear:</label>
              <label class="toggle-switch">
                <input type="checkbox" v-model="localAutoClear" class="sr-only">
                <span class="slider"></span>
              </label>
            </div>
            
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600 dark:text-gray-400">Diagrams:</label>
              <label class="toggle-switch">
                <input type="checkbox" v-model="localGenerateDiagram" class="sr-only">
                <span class="slider"></span>
              </label>
            </div>
          </div>
          
          <div class="ml-auto flex items-center gap-2">
            <button @click="clearChat" class="action-btn" title="Clear Chat">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <button @click="$emit('toggle-theme')" class="action-btn" title="Toggle Theme">
              <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            
            <button @click="goToSettings" class="action-btn" title="Settings">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div 
      v-show="isMobileNavOpen" 
      class="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800"
    >
      <div class="p-4 space-y-4">
        <div>
          <label class="block mb-1 text-xs text-gray-600 dark:text-gray-400">Mode</label>
          <select v-model="localMode" class="mobile-select">
            <option v-for="preset in modePresets" :key="preset.value" :value="preset.value">
              {{ preset.label }}
            </option>
          </select>
        </div>
        
        <div v-if="localMode === 'coding'">
          <label class="block mb-1 text-xs text-gray-600 dark:text-gray-400">Language</label>
          <select v-model="localLanguage" class="mobile-select">
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>
        
        <div>
          <label class="block mb-1 text-xs text-gray-600 dark:text-gray-400">Audio Mode</label>
          <select v-model="localAudioMode" class="mobile-select">
            <option value="push-to-talk">Push to Talk</option>
            <option value="continuous">Continuous</option>
          </select>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center justify-between">
            <label class="text-sm text-gray-600 dark:text-gray-400">Auto-Clear</label>
            <label class="toggle-switch">
              <input type="checkbox" v-model="localAutoClear" class="sr-only">
              <span class="slider"></span>
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <label class="text-sm text-gray-600 dark:text-gray-400">Diagrams</label>
            <label class="toggle-switch">
              <input type="checkbox" v-model="localGenerateDiagram" class="sr-only">
              <span class="slider"></span>
            </label>
          </div>
        </div>
        
        <div class="grid grid-cols-4 gap-2 pt-3 border-t dark:border-gray-800">
          <button @click="clearChat" class="mobile-action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span class="text-xs">Clear</span>
          </button>
          
          <button @click="toggleFullscreen" class="mobile-action-btn">
            <svg v-if="isFullscreen" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M9 15H4.5M9 15v4.5M9 15l-5.25 5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            <span class="text-xs">{{ isFullscreen ? 'Exit' : 'Full' }}</span>
          </button>
          
          <button @click="$emit('toggle-theme')" class="mobile-action-btn">
            <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span class="text-xs">Theme</span>
          </button>
          
          <button @click="goToSettings" class="mobile-action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
    
    <div 
      v-if="isFullscreen" 
      class="fixed top-4 right-4 z-50 flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full p-2"
    >
      <button @click="toggleFullscreen" class="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M9 15H4.5M9 15v4.5M9 15l-5.25 5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';

const router = useRouter();

const props = defineProps<{
  sessionCost: number;
  mode: string;
  language: string;
  generateDiagram: boolean;
  audioMode?: string;
  isFullscreen?: boolean;
}>();

const emit = defineEmits<{
  'update:mode': [value: string];
  'update:language': [value: string];
  'update:generate-diagram': [value: boolean];
  'update:audio-mode': [value: string];
  'update:auto-clear': [value: boolean];
  'toggle-theme': []; // Vue convention is kebab-case for emitted event names
  'toggle-fullscreen': [];
  'clear-chat': [];
}>();

// Local reactive values
const localMode = ref(props.mode);
const localLanguage = ref(props.language);
const localGenerateDiagram = ref(props.generateDiagram);
const localAudioMode = ref(props.audioMode || 'push-to-talk');
const localAutoClear = ref(true); // Defaulting to true, adjust if needed from props or settings
const isMobileNavOpen = ref(false);

// Get states
const isDarkMode = useStorage('darkMode', false); // From @vueuse/core, persists theme preference
const isFullscreen = computed(() => props.isFullscreen || false);

// Mode presets - simplified for compactness
const modePresets = [
  { label: 'Coding Q&A', value: 'coding' },
  { label: 'System Design', value: 'system_design' },
  { label: 'Meeting Notes', value: 'meeting' },
  { label: 'General Chat', value: 'general' }
];

// Methods
const goToSettings = () => {
  router.push('/settings');
  isMobileNavOpen.value = false;
};

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
};

const toggleFullscreen = () => {
  emit('toggle-fullscreen');
  isMobileNavOpen.value = false; // Close mobile nav when toggling fullscreen
};

const clearChat = () => {
  emit('clear-chat');
  isMobileNavOpen.value = false; // Close mobile nav after clearing chat
};

// Watch for prop changes to update local state
watch(() => props.mode, (newVal) => { localMode.value = newVal; });
watch(() => props.language, (newVal) => { localLanguage.value = newVal; });
watch(() => props.generateDiagram, (newVal) => { localGenerateDiagram.value = newVal; });
watch(() => props.audioMode, (newVal) => { if (newVal) localAudioMode.value = newVal; });

// Watch for local changes and emit updates (two-way binding pattern for props)
watch(localMode, (newVal) => emit('update:mode', newVal));
watch(localLanguage, (newVal) => emit('update:language', newVal));
watch(localGenerateDiagram, (newVal) => emit('update:generate-diagram', newVal));
watch(localAudioMode, (newVal) => emit('update:audio-mode', newVal));
watch(localAutoClear, (newVal) => emit('update:auto-clear', newVal));

</script>

<style lang="postcss" scoped>
.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700;
}

.glass-effect {
  @apply bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm;
}

.compact-select, .mobile-select {
  @apply w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500; /* Added focus styles */
  -webkit-appearance: none; /* Removes default Safari arrow */
  -moz-appearance: none; /* Removes default Firefox arrow */
  appearance: none; /* Removes default arrow for other browsers */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem; /* Increased padding to prevent text overlap with arrow */
}

.compact-select {
  @apply w-36; /* Slightly wider for better text display */
}

.toggle-switch {
  @apply relative inline-flex items-center h-4 rounded-full w-8 cursor-pointer;
}

.toggle-switch .slider {
  @apply absolute inset-0 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors duration-200 ease-in-out;
}

.toggle-switch .slider:before {
  content: "";
  @apply absolute h-3 w-3 left-0.5 bottom-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out shadow;
}

.toggle-switch input:checked + .slider {
  @apply bg-primary-600 dark:bg-primary-500;
}

.toggle-switch input:checked + .slider:before {
  transform: translateX(1rem); /* 16px / 4 = 4 units if base font is 16px; 1rem is usually 16px */
}

.action-btn {
  @apply p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 transition-all;
}

.mobile-action-btn {
  @apply flex flex-col items-center justify-center py-2 px-1 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors;
}

/* Ensuring primary colors are defined if not globally available via Tailwind theme */
.from-primary-500 {
  --tw-gradient-from: #3b82f6 var(--tw-gradient-from-position); /* Example: blue-500 */
  --tw-gradient-to: transparent var(--tw-gradient-to-position);
}
.to-primary-700 {
  --tw-gradient-to: #1d4ed8 var(--tw-gradient-to-position); /* Example: blue-700 */
}
.bg-primary-600 {
  background-color: #2563eb; /* Example: blue-600 */
}
.dark .bg-primary-500 {
   background-color: #3b82f6; /* Example: blue-500 */
}
.text-primary-600 {
  color: #2563eb; /* Example: blue-600 */
}
.dark .text-primary-400 {
  color: #60a5fa; /* Example: blue-400 */
}
.focus\:ring-primary-500:focus {
  --tw-ring-color: #3b82f6; /* Example: blue-500 */
}
</style>