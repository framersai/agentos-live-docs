<template>
  <header class="app-header sticky top-0 z-40 transition-all bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Top Bar - Logo and Session Cost -->
      <div class="flex items-center justify-between py-3 md:py-4">
        <!-- Logo and Brand -->
        <div class="flex items-center gap-3">
          <div class="logo-container spotlight-effect">
            <img src="../assets/logo.svg" alt="Voice Coding Assistant" class="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          </div>
          <div class="hidden md:block">
            <h1 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Voice Coding <span class="text-gradient font-bold">Assistant</span>
            </h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">AI-powered voice coding</p>
          </div>
          <!-- Mobile Brand -->
          <span class="md:hidden text-lg font-bold text-gray-900 dark:text-white">VCA</span>
        </div>
        
        <!-- Session Cost -->
        <div class="flex items-center">
          <div class="cost-display glass-effect px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
            <span class="hidden sm:inline text-gray-600 dark:text-gray-300">Session Cost:</span>
            <span class="font-mono text-primary-600 dark:text-primary-400 font-bold">${{ sessionCost.toFixed(4) }}</span>
          </div>
          
          <!-- Mobile Menu Toggle -->
          <button 
            @click="toggleMobileNav"
            class="ml-4 md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path v-if="isMobileNavOpen" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs - Desktop -->
      <div class="hidden md:block pb-2">
        <div class="flex flex-wrap items-start">
          <!-- Main Mode Tabs -->
          <div class="flex space-x-1 mr-6">
            <button 
              v-for="tabOption in tabOptions" 
              :key="tabOption.value"
              @click="updateMode(tabOption.value)"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-md transition-all duration-300',
                localMode === tabOption.value 
                  ? 'bg-primary-500 text-white shadow-md' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              ]"
              class="btn-magnetic spotlight-effect"
            >
              {{ tabOption.label }}
            </button>
          </div>
          
          <!-- Options Based on Mode -->
          <div class="flex flex-wrap items-center gap-3 mt-1 sm:mt-0">
            <!-- Coding Options -->
            <div v-if="localMode === 'coding'" class="flex items-center gap-2">
              <label for="language-select" class="text-sm text-gray-600 dark:text-gray-400">Language:</label>
              <select 
                id="language-select"
                v-model="localLanguage"
                class="py-1 px-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
                <option value="c++">C++</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
            </div>
            
            <!-- Diagram Toggle for all modes -->
            <div class="flex items-center gap-2">
              <label for="diagram-toggle" class="text-sm text-gray-600 dark:text-gray-400">Generate Diagrams:</label>
              <label class="toggle-switch">
                <input 
                  id="diagram-toggle"
                  type="checkbox"
                  v-model="localGenerateDiagram"
                  class="sr-only"
                >
                <span class="slider"></span>
              </label>
            </div>
            
            <!-- Right-aligned action buttons -->
            <div class="ml-auto flex items-center gap-2">
              <button 
                @click="$emit('toggleTheme')" 
                class="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
                title="Toggle Light/Dark Mode"
              >
                <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              
              <button 
                @click="goToSettings" 
                class="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              <button 
                @click="$emit('logout')" 
                class="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile Navigation (Slide Down Panel) -->
    <div 
      v-if="isMobileNavOpen" 
      class="md:hidden bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-lg transform transition-transform duration-300"
    >
      <div class="p-4 space-y-4">
        <!-- Mode Tabs -->
        <div class="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
          <button 
            v-for="tabOption in tabOptions" 
            :key="tabOption.value"
            @click="updateMode(tabOption.value)"
            class="flex-1 py-2 text-sm font-medium rounded-md transition-all"
            :class="localMode === tabOption.value ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-400'"
          >
            {{ tabOption.label }}
          </button>
        </div>
        
        <!-- Options Based on Current Mode -->
        <div class="space-y-3 pt-3">
          <!-- Language Selection (for coding mode) -->
          <div v-if="localMode === 'coding'">
            <label for="language-mobile" class="block mb-1 text-xs text-gray-600 dark:text-gray-400">Programming Language</label>
            <select 
              id="language-mobile"
              v-model="localLanguage"
              class="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="c++">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>
          
          <!-- Diagram Toggle -->
          <div class="flex items-center justify-between">
            <label for="diagram-toggle-mobile" class="text-sm text-gray-600 dark:text-gray-400">Generate Diagrams</label>
            <label class="toggle-switch">
              <input 
                id="diagram-toggle-mobile"
                type="checkbox"
                v-model="localGenerateDiagram"
                class="sr-only"
              >
              <span class="slider"></span>
            </label>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="grid grid-cols-3 gap-2 pt-3 border-t dark:border-gray-800">
          <button 
            @click="$emit('toggleTheme')"
            class="flex flex-col items-center py-2 px-4 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span class="mt-1 text-xs">Theme</span>
          </button>
          
          <button 
            @click="goToSettings"
            class="flex flex-col items-center py-2 px-4 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="mt-1 text-xs">Settings</span>
          </button>
          
          <button 
            @click="$emit('logout')"
            class="flex flex-col items-center py-2 px-4 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="mt-1 text-xs">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';

// Router
const router = useRouter();

// Props
const props = defineProps<{
  sessionCost: number;
  mode: string;
  language: string;
  generateDiagram: boolean;
}>();

// Emits
const emit = defineEmits<{
  'update:mode': [value: string];
  'update:language': [value: string];
  'update:generate-diagram': [value: boolean];
  'toggle-theme': [];
  'logout': [];
}>();

// Local refs for two-way binding
const localMode = ref(props.mode);
const localLanguage = ref(props.language);
const localGenerateDiagram = ref(props.generateDiagram);
const isMobileNavOpen = ref(false);

// Get dark mode state
const isDarkMode = useStorage('darkMode', false);

// Tab options
const tabOptions = [
  { label: 'Coding Q&A', value: 'coding' },
  { label: 'System Design', value: 'system_design' },
  { label: 'Meeting Summary', value: 'meeting' }
];

// Methods
const goToSettings = () => {
  router.push('/settings');
  isMobileNavOpen.value = false;
};

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
};

const updateMode = (newMode: string) => {
  localMode.value = newMode;
  isMobileNavOpen.value = false;
};

// Watch for prop changes
watch(() => props.mode, (newVal) => {
  localMode.value = newVal;
});

watch(() => props.language, (newVal) => {
  localLanguage.value = newVal;
});

watch(() => props.generateDiagram, (newVal) => {
  localGenerateDiagram.value = newVal;
});

// Watch for local changes and emit events
watch(localMode, (newVal) => {
  emit('update:mode', newVal);
});

watch(localLanguage, (newVal) => {
  emit('update:language', newVal);
});

watch(localGenerateDiagram, (newVal) => {
  emit('update:generate-diagram', newVal);
});

// Auto-detect orientation changes and update layout if needed
onMounted(() => {
  const checkOrientation = () => {
    if (window.innerWidth >= 768) {
      // Desktop/tablet mode - close mobile menu
      isMobileNavOpen.value = false;
    }
  };
  
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);
  
  // Initial check
  checkOrientation();
  
  // Clean up event listeners
  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkOrientation);
    window.removeEventListener('orientationchange', checkOrientation);
  });
});
</script>

<style scoped>
.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700;
}

.glass-effect {
  @apply bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm;
}

.toggle-switch {
  @apply relative inline-block w-10 h-6;
}

.toggle-switch .slider {
  @apply absolute cursor-pointer inset-0 bg-gray-300 dark:bg-gray-700 rounded-full transition-all;
}

.toggle-switch .slider:before {
  content: "";
  @apply absolute h-4 w-4 left-1 bottom-1 bg-white rounded-full transition-all;
}

.toggle-switch input:checked + .slider {
  @apply bg-primary-500;
}

.toggle-switch input:checked + .slider:before {
  transform: translateX(16px);
}
</style>