<template>
  <header 
    class="app-header sticky top-0 z-50 transition-all backdrop-blur-md border-b dark:border-gray-800"
    :class="{
      'bg-white/95 dark:bg-gray-900/95': !isFullscreen,
      'bg-transparent': isFullscreen && !isMobileNavOpen,
      'bg-white dark:bg-gray-900': isFullscreen && isMobileNavOpen
    }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6" v-show="!isFullscreen || isMobileNavOpen">
      <div class="flex items-center justify-between py-3 md:py-4">
        <!-- Logo and Title -->
        <div class="flex items-center gap-3">
          <router-link to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div class="logo-container relative">
              <img src="/src/assets/logo.svg" alt="VCA" class="w-8 h-8 sm:w-10 sm:h-10" />
              <div class="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
            </div>
            <div class="hidden md:block">
              <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Voice Coding <span class="text-gradient font-bold">Assistant</span>
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">AI-powered voice coding</p>
            </div>
            <span class="md:hidden text-lg font-bold text-gray-900 dark:text-white">VCA</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-6">
          <!-- Mode Presets Dropdown -->
          <div class="relative" ref="modeDropdownRef">
            <button 
              @click="toggleModeDropdown"
              class="nav-button flex items-center gap-2"
            >
              <div class="mode-icon" :class="getModeIconClass()">
                <component :is="getModeIcon()" class="w-4 h-4" />
              </div>
              <span class="font-medium">{{ getModeDisplayName() }}</span>
              <ChevronDownIcon class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showModeDropdown }" />
            </button>
            
            <div 
              v-show="showModeDropdown"
              class="dropdown-menu"
            >
              <div class="dropdown-header">
                <h3 class="font-medium text-gray-900 dark:text-white">Select Mode</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Choose your assistant type</p>
              </div>
              <div class="dropdown-content">
                <button
                  v-for="preset in modePresets"
                  :key="preset.value"
                  @click="selectMode(preset.value)"
                  class="dropdown-item"
                  :class="{ 'active': localMode === preset.value }"
                >
                  <div class="flex items-center gap-3">
                    <div class="mode-icon" :class="preset.iconClass">
                      <component :is="preset.icon" class="w-4 h-4" />
                    </div>
                    <div class="flex-1 text-left">
                      <div class="font-medium">{{ preset.label }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ preset.description }}</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Language Selector (only for coding mode) -->
          <div v-if="localMode === 'coding'" class="relative" ref="languageDropdownRef">
            <button 
              @click="toggleLanguageDropdown"
              class="nav-button flex items-center gap-2"
            >
              <div class="language-icon">
                {{ getLanguageIcon(localLanguage) }}
              </div>
              <span class="font-medium">{{ localLanguage.charAt(0).toUpperCase() + localLanguage.slice(1) }}</span>
              <ChevronDownIcon class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showLanguageDropdown }" />
            </button>
            
            <div 
              v-show="showLanguageDropdown"
              class="dropdown-menu w-48"
            >
              <div class="dropdown-header">
                <h3 class="font-medium text-gray-900 dark:text-white">Programming Language</h3>
              </div>
              <div class="dropdown-content">
                <button
                  v-for="lang in programmingLanguages"
                  :key="lang.value"
                  @click="selectLanguage(lang.value)"
                  class="dropdown-item"
                  :class="{ 'active': localLanguage === lang.value }"
                >
                  <div class="flex items-center gap-3">
                    <span class="language-icon text-lg">{{ lang.icon }}</span>
                    <div class="flex-1 text-left">
                      <div class="font-medium">{{ lang.label }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ lang.description }}</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Settings -->
          <div class="flex items-center gap-4">
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
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-2">
          <!-- Cost Display -->
          <div class="cost-display glass-effect px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium">
            <span class="hidden sm:inline text-gray-600 dark:text-gray-300">Cost:</span>
            <span class="font-mono text-primary-600 dark:text-primary-400 font-bold">
              ${{ sessionCost.toFixed(4) }}
            </span>
          </div>

          <!-- Desktop Action Buttons -->
          <div class="hidden md:flex items-center gap-1">
            <button @click="clearChat" class="action-btn" title="Clear Chat">
              <TrashIcon class="w-4 h-4" />
            </button>
            
            <button @click="toggleFullscreen" class="action-btn" :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'">
              <ArrowsPointingOutIcon v-if="!isFullscreen" class="w-4 h-4" />
              <ArrowsPointingInIcon v-else class="w-4 h-4" />
            </button>
            
            <button @click="$emit('toggle-theme')" class="action-btn" title="Toggle Theme">
              <SunIcon v-if="isDarkMode" class="w-4 h-4" />
              <MoonIcon v-else class="w-4 h-4" />
            </button>
            
            <router-link to="/settings" class="action-btn" title="Settings">
              <CogIcon class="w-4 h-4" />
            </router-link>

            <router-link to="/about" class="action-btn" title="About">
              <InformationCircleIcon class="w-4 h-4" />
            </router-link>
          </div>
          
          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMobileNav"
            class="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
          >
            <XMarkIcon v-if="isMobileNavOpen" class="w-6 h-6" />
            <Bars3Icon v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile Navigation Panel -->
    <div 
      v-show="isMobileNavOpen" 
      class="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t dark:border-gray-800"
    >
      <div class="p-4 space-y-6">
        <!-- Mode Selection -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Assistant Mode</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="preset in modePresets"
              :key="preset.value"
              @click="selectMode(preset.value)"
              class="mobile-mode-card"
              :class="{ 'active': localMode === preset.value }"
            >
              <div class="mode-icon" :class="preset.iconClass">
                <component :is="preset.icon" class="w-4 h-4" />
              </div>
              <div class="text-xs font-medium">{{ preset.label }}</div>
            </button>
          </div>
        </div>

        <!-- Language Selection (for coding mode) -->
        <div v-if="localMode === 'coding'">
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Programming Language</label>
          <select v-model="localLanguage" class="mobile-select">
            <option v-for="lang in programmingLanguages" :key="lang.value" :value="lang.value">
              {{ lang.icon }} {{ lang.label }}
            </option>
          </select>
        </div>

        <!-- Audio Mode -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Audio Mode</label>
          <select v-model="localAudioMode" class="mobile-select">
            <option value="push-to-talk">🎙️ Push to Talk</option>
            <option value="continuous">🔊 Continuous</option>
            <option value="voice-activation">🎵 Voice Activation</option>
          </select>
        </div>
        
        <!-- Quick Toggles -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <label class="text-sm text-gray-600 dark:text-gray-400">Auto-Clear</label>
            <label class="toggle-switch">
              <input type="checkbox" v-model="localAutoClear" class="sr-only">
              <span class="slider"></span>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <label class="text-sm text-gray-600 dark:text-gray-400">Diagrams</label>
            <label class="toggle-switch">
              <input type="checkbox" v-model="localGenerateDiagram" class="sr-only">
              <span class="slider"></span>
            </label>
          </div>
        </div>
        
        <!-- Mobile Action Grid -->
        <div class="grid grid-cols-3 gap-3 pt-4 border-t dark:border-gray-800">
          <button @click="clearChat" class="mobile-action-btn">
            <TrashIcon class="w-5 h-5" />
            <span class="text-xs">Clear Chat</span>
          </button>
          
          <button @click="toggleFullscreen" class="mobile-action-btn">
            <ArrowsPointingOutIcon v-if="!isFullscreen" class="w-5 h-5" />
            <ArrowsPointingInIcon v-else class="w-5 h-5" />
            <span class="text-xs">{{ isFullscreen ? 'Exit FS' : 'Fullscreen' }}</span>
          </button>
          
          <button @click="$emit('toggle-theme')" class="mobile-action-btn">
            <SunIcon v-if="isDarkMode" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
            <span class="text-xs">Theme</span>
          </button>
          
          <router-link to="/settings" @click="isMobileNavOpen = false" class="mobile-action-btn">
            <CogIcon class="w-5 h-5" />
            <span class="text-xs">Settings</span>
          </router-link>
          
          <router-link to="/about" @click="isMobileNavOpen = false" class="mobile-action-btn">
            <InformationCircleIcon class="w-5 h-5" />
            <span class="text-xs">About</span>
          </router-link>
          
          <button @click="$emit('logout')" class="mobile-action-btn text-red-600 dark:text-red-400">
            <ArrowRightOnRectangleIcon class="w-5 h-5" />
            <span class="text-xs">Logout</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Fullscreen Controls -->
    <div 
      v-if="isFullscreen" 
      class="fixed top-4 right-4 z-50 flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full p-2"
    >
      <button @click="toggleFullscreen" class="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
        <ArrowsPointingInIcon class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  TrashIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  SunIcon,
  MoonIcon,
  CogIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon,
  CodeBracketIcon,
  CpuChipIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline';

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
  'toggle-theme': [];
  'toggle-fullscreen': [];
  'clear-chat': [];
  'logout': [];
}>();

// Local reactive values
const localMode = ref(props.mode);
const localLanguage = ref(props.language);
const localGenerateDiagram = ref(props.generateDiagram);
const localAudioMode = ref(props.audioMode || 'push-to-talk');
const localAutoClear = ref(true);

// Dropdown states
const showModeDropdown = ref(false);
const showLanguageDropdown = ref(false);
const isMobileNavOpen = ref(false);

// Refs for dropdown positioning
const modeDropdownRef = ref<HTMLElement | null>(null);
const languageDropdownRef = ref<HTMLElement | null>(null);

// Get states
const isDarkMode = useStorage('darkMode', false);
const isFullscreen = computed(() => props.isFullscreen || false);

// Mode presets with enhanced styling
const modePresets = [
  {
    label: 'Coding Q&A',
    value: 'coding',
    description: 'Algorithm problems & debugging',
    icon: CodeBracketIcon,
    iconClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  },
  {
    label: 'System Design',
    value: 'system_design',
    description: 'Architecture & scalability',
    icon: CpuChipIcon,
    iconClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  },
  {
    label: 'Meeting Notes',
    value: 'meeting',
    description: 'Transcription & summaries',
    icon: DocumentTextIcon,
    iconClass: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
  },
  {
    label: 'General Chat',
    value: 'general',
    description: 'Open conversation',
    icon: ChatBubbleLeftRightIcon,
    iconClass: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
  }
];

// Programming languages with icons
const programmingLanguages = [
  { label: 'Python', value: 'python', icon: '🐍', description: 'General purpose' },
  { label: 'JavaScript', value: 'javascript', icon: '⚡', description: 'Web development' },
  { label: 'TypeScript', value: 'typescript', icon: '🔷', description: 'Typed JavaScript' },
  { label: 'Java', value: 'java', icon: '☕', description: 'Enterprise apps' },
  { label: 'C++', value: 'cpp', icon: '⚙️', description: 'System programming' },
  { label: 'Go', value: 'go', icon: '🔵', description: 'Cloud & backend' },
  { label: 'Rust', value: 'rust', icon: '🦀', description: 'Memory safety' },
  { label: 'Swift', value: 'swift', icon: '🍎', description: 'iOS development' },
  { label: 'Kotlin', value: 'kotlin', icon: '🟣', description: 'Android & JVM' }
];

// Helper functions
const getModeDisplayName = () => modePresets.find(p => p.value === localMode.value)?.label || 'Mode';
const getModeIcon = () => modePresets.find(p => p.value === localMode.value)?.icon || CodeBracketIcon;
const getModeIconClass = () => modePresets.find(p => p.value === localMode.value)?.iconClass || 'bg-gray-100 text-gray-600';
const getLanguageIcon = (lang: string) => programmingLanguages.find(l => l.value === lang)?.icon || '💻';

// Dropdown handlers
const toggleModeDropdown = () => {
  showModeDropdown.value = !showModeDropdown.value;
  showLanguageDropdown.value = false;
};

const toggleLanguageDropdown = () => {
  showLanguageDropdown.value = !showLanguageDropdown.value;
  showModeDropdown.value = false;
};

const selectMode = (mode: string) => {
  localMode.value = mode;
  showModeDropdown.value = false;
  isMobileNavOpen.value = false;
};

const selectLanguage = (language: string) => {
  localLanguage.value = language;
  showLanguageDropdown.value = false;
};

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
  showModeDropdown.value = false;
  showLanguageDropdown.value = false;
};

const toggleFullscreen = () => {
  emit('toggle-fullscreen');
  isMobileNavOpen.value = false;
};

const clearChat = () => {
  emit('clear-chat');
  isMobileNavOpen.value = false;
  showModeDropdown.value = false;
  showLanguageDropdown.value = false;
};

// Close dropdowns when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (modeDropdownRef.value && !modeDropdownRef.value.contains(event.target as Node)) {
    showModeDropdown.value = false;
  }
  if (languageDropdownRef.value && !languageDropdownRef.value.contains(event.target as Node)) {
    showLanguageDropdown.value = false;
  }
};

// Watch for prop changes
watch(() => props.mode, (newVal) => { localMode.value = newVal; });
watch(() => props.language, (newVal) => { localLanguage.value = newVal; });
watch(() => props.generateDiagram, (newVal) => { localGenerateDiagram.value = newVal; });
watch(() => props.audioMode, (newVal) => { if (newVal) localAudioMode.value = newVal; });

// Emit changes
watch(localMode, (newVal) => emit('update:mode', newVal));
watch(localLanguage, (newVal) => emit('update:language', newVal));
watch(localGenerateDiagram, (newVal) => emit('update:generate-diagram', newVal));
watch(localAudioMode, (newVal) => emit('update:audio-mode', newVal));
watch(localAutoClear, (newVal) => emit('update:auto-clear', newVal));

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="postcss" scoped>
.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700;
}

.glass-effect {
  @apply bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm;
}

.nav-button {
  @apply px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600;
}

.dropdown-menu {
  @apply absolute top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg backdrop-blur-sm z-50;
}

.dropdown-header {
  @apply p-4 border-b border-gray-200 dark:border-gray-700;
}

.dropdown-content {
  @apply p-2 max-h-64 overflow-y-auto;
}

.dropdown-item {
  @apply w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors;
}

.dropdown-item.active {
  @apply bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800;
}

.mode-icon {
  @apply w-8 h-8 rounded-lg flex items-center justify-center;
}

.language-icon {
  @apply w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm;
}

.toggle-switch {
  @apply relative inline-flex items-center h-5 rounded-full w-9 cursor-pointer;
}

.toggle-switch .slider {
  @apply absolute inset-0 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-200 ease-in-out;
}

.toggle-switch .slider:before {
  content: "";
  @apply absolute h-4 w-4 left-0.5 bottom-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out shadow;
}

.toggle-switch input:checked + .slider {
  @apply bg-primary-600 dark:bg-primary-500;
}

.toggle-switch input:checked + .slider:before {
  transform: translateX(1rem);
}

.action-btn {
  @apply p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all;
}

.mobile-select {
  @apply w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white;
}

.mobile-mode-card {
  @apply flex flex-col items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors;
}

.mobile-mode-card.active {
  @apply border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30;
}

.mobile-action-btn {
  @apply flex flex-col items-center justify-center py-3 px-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

/* Primary color definitions */
.from-primary-500 { --tw-gradient-from: #3b82f6; }
.to-primary-700 { --tw-gradient-to: #1d4ed8; }
.bg-primary-600 { background-color: #2563eb; }
.text-primary-600 { color: #2563eb; }
.dark .text-primary-400 { color: #60a5fa; }
.bg-primary-50 { background-color: #eff6ff; }
.dark .bg-primary-900\/30 { background-color: rgb(30 58 138 / 0.3); }
.text-primary-700 { color: #1d4ed8; }
.dark .text-primary-300 { color: #93c5fd; }
.border-primary-200 { border-color: #bfdbfe; }
.dark .border-primary-800 { border-color: #1e40af; }
.border-primary-500 { border-color: #3b82f6; }
.dark .border-primary-400 { border-color: #60a5fa; }
</style>