<template>
  <header
    class="app-header sticky top-0 z-40 transition-all duration-300 ease-in-out"
    :class="{
      'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700': !effectiveIsFullscreen || showHeaderOptionsInFullscreen,
      'bg-transparent pointer-events-none': effectiveIsFullscreen && !showHeaderOptionsInFullscreen && !isMobileNavOpen,
      'opacity-0 translate-y-[-100%]': effectiveIsFullscreen && !showHeaderOptionsInFullscreen && !isMobileNavOpen, // Hide completely
      'opacity-100 translate-y-0': !effectiveIsFullscreen || showHeaderOptionsInFullscreen || isMobileNavOpen,
      'shadow-lg': !effectiveIsFullscreen
    }"
  >
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6" v-show="!effectiveIsFullscreen || showHeaderOptionsInFullscreen || isMobileNavOpen">
      <div class="flex items-center justify-between py-2.5 md:py-3">
        <div class="flex items-center gap-2 sm:gap-3">
          <router-link to="/" class="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity" @click="isMobileNavOpen = false">
            <div class="logo-container relative shrink-0">
              <img src="/src/assets/logo.svg" alt="VCA Logo" class="w-7 h-7 sm:w-9 sm:h-9" />
              <div class="absolute inset-[-2px] bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-full animate-pulse duration-[3000ms]"></div>
            </div>
            <div class="hidden md:block">
              <h1 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                Voice Chat <span class="text-gradient font-bold">Assistant</span>
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-tight">AI-Powered Development</p>
            </div>
            <span class="md:hidden text-base sm:text-lg font-bold text-gray-900 dark:text-white">VCA</span>
          </router-link>
        </div>

        <nav class="hidden lg:flex items-center gap-3 xl:gap-5">
          <div class="relative" ref="modeDropdownRef">
            <button @click="toggleDropdown('mode')" class="nav-button flex items-center gap-1.5">
              <component :is="getModeIcon()" class="w-4 h-4 shrink-0" :class="getModeIconClass().replace('bg-', 'text-')" />
              <span class="font-medium text-sm">{{ getModeDisplayName() }}</span>
              <ChevronDownIcon class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': showModeDropdown }" />
            </button>
            <transition name="dropdown-fade">
              <div v-show="showModeDropdown" class="dropdown-menu w-72">
                <div class="dropdown-header"><h3 class="font-medium">Select Mode</h3></div>
                <div class="dropdown-content">
                  <button
                    v-for="preset in modePresets" :key="preset.value" @click="selectMode(preset.value)"
                    class="dropdown-item" :class="{ 'active': localMode === preset.value }"
                  >
                    <div class="flex items-center gap-3">
                      <div class="mode-icon-sm" :class="preset.iconClass"><component :is="preset.icon" class="w-4 h-4" /></div>
                      <div class="flex-1 text-left">
                        <div class="font-medium text-sm">{{ preset.label }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ preset.description }}</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <div v-if="localMode === 'coding'" class="relative" ref="languageDropdownRef">
            <button @click="toggleDropdown('language')" class="nav-button flex items-center gap-1.5">
              <div class="language-icon-sm">{{ getLanguageIcon(localLanguage) }}</div>
              <span class="font-medium text-sm">{{ localLanguage.charAt(0).toUpperCase() + localLanguage.slice(1) }}</span>
              <ChevronDownIcon class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': showLanguageDropdown }" />
            </button>
             <transition name="dropdown-fade">
                <div v-show="showLanguageDropdown" class="dropdown-menu w-64">
                    <div class="dropdown-header"><h3 class="font-medium">Programming Language</h3></div>
                    <div class="dropdown-content max-h-60 overflow-y-auto">
                    <button
                        v-for="lang in programmingLanguages" :key="lang.value" @click="selectLanguage(lang.value)"
                        class="dropdown-item" :class="{ 'active': localLanguage === lang.value }"
                    >
                        <div class="flex items-center gap-3">
                        <span class="text-base">{{ lang.icon }}</span>
                        <div class="flex-1 text-left">
                            <div class="font-medium text-sm">{{ lang.label }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">{{ lang.description }}</div>
                        </div>
                        </div>
                    </button>
                    </div>
                </div>
            </transition>
          </div>

          <div class="flex items-center gap-3 xl:gap-4">
            <div class="flex items-center gap-1.5" title="Auto-clear chat after each response">
              <label for="autoClearToggleDesktop" class="text-xs text-gray-600 dark:text-gray-400">Auto-Clear</label>
              <label class="toggle-switch-sm">
                <input id="autoClearToggleDesktop" type="checkbox" v-model="localAutoClearChat" class="sr-only">
                <span class="slider-sm"></span>
              </label>
            </div>
            <div v-if="localMode === 'system_design' || localMode === 'coding'" class="flex items-center gap-1.5" title="Generate diagrams for relevant content">
              <label for="diagramToggleDesktop" class="text-xs text-gray-600 dark:text-gray-400">Diagrams</label>
              <label class="toggle-switch-sm">
                <input id="diagramToggleDesktop" type="checkbox" v-model="localGenerateDiagram" class="sr-only">
                <span class="slider-sm"></span>
              </label>
            </div>
          </div>
        </nav>

        <div class="flex items-center gap-1.5 sm:gap-2">
          <div class="cost-display glass-effect px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium">
            <span class="hidden sm:inline text-gray-600 dark:text-gray-300">Cost: </span>
            <span class="font-mono text-primary-600 dark:text-primary-400 font-bold">${{ sessionCost.toFixed(3) }}</span>
          </div>

          <div class="hidden md:flex items-center gap-0.5 sm:gap-1">
            <button @click="handleClearChat" class="action-btn" title="Clear Chat"><TrashIcon class="w-4 h-4" /></button>
            <button @click="handleToggleFullscreen" class="action-btn" :title="effectiveIsFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'">
              <ArrowsPointingOutIcon v-if="!effectiveIsFullscreen" class="w-4 h-4" />
              <ArrowsPointingInIcon v-else class="w-4 h-4" />
            </button>
            <button @click="handleToggleTheme" class="action-btn" title="Toggle Theme">
              <SunIcon v-if="isDarkMode" class="w-4 h-4" /> <MoonIcon v-else class="w-4 h-4" />
            </button>
            <router-link to="/settings" class="action-btn" title="Settings"><CogIcon class="w-4 h-4" /></router-link>
          </div>

          <button
            @click="toggleMobileNav"
            class="lg:hidden p-1.5 sm:p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
            aria-label="Toggle mobile menu" :aria-expanded="isMobileNavOpen.toString()"
          >
            <XMarkIcon v-if="isMobileNavOpen" class="w-5 h-5 sm:w-6 sm:h-6" />
            <Bars3Icon v-else class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>

    <transition name="slide-down">
      <div
        v-show="isMobileNavOpen && (!effectiveIsFullscreen || showHeaderOptionsInFullscreen)"
        class="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 absolute top-full left-0 right-0 shadow-xl"
        role="dialog" aria-modal="true"
      >
        <div class="p-4 space-y-5 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <section>
            <h3 class="mobile-section-title">Assistant Mode</h3>
            <div class="grid grid-cols-2 gap-2.5">
              <button
                v-for="preset in modePresets" :key="preset.value" @click="selectMode(preset.value)"
                class="mobile-mode-card" :class="{ 'active': localMode === preset.value }"
              >
                <div class="mode-icon-sm" :class="preset.iconClass"><component :is="preset.icon" class="w-4 h-4" /></div>
                <span class="text-xs font-medium">{{ preset.label }}</span>
              </button>
            </div>
          </section>

          <section v-if="localMode === 'coding'">
            <h3 class="mobile-section-title">Programming Language</h3>
            <select v-model="localLanguage" @change="selectLanguage(($event.target as HTMLSelectElement).value)" class="mobile-select">
              <option v-for="lang in programmingLanguages" :key="lang.value" :value="lang.value">
                {{ lang.icon }} {{ lang.label }}
              </option>
            </select>
          </section>

          <section>
            <h3 class="mobile-section-title">Quick Settings</h3>
            <div class="space-y-3">
              <div class="mobile-toggle-item">
                <label for="autoClearToggleMobile">Auto-Clear Chat</label>
                <label class="toggle-switch-sm"><input id="autoClearToggleMobile" type="checkbox" v-model="localAutoClearChat" class="sr-only"><span class="slider-sm"></span></label>
              </div>
              <div class="mobile-toggle-item">
                <label for="diagramToggleMobile">Generate Diagrams</label>
                <label class="toggle-switch-sm"><input id="diagramToggleMobile" type="checkbox" v-model="localGenerateDiagram" class="sr-only"><span class="slider-sm"></span></label>
              </div>
            </div>
          </section>

          <section>
              <h3 class="mobile-section-title">Audio Input Mode</h3>
              <select v-model="localAudioMode" class="mobile-select">
                <option value="push-to-talk">🎙️ Push to Talk</option>
                <option value="continuous">🔊 Continuous Listening</option>
                <option value="voice-activation">🎤 Voice Activation</option>
              </select>
          </section>

          <section class="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div class="grid grid-cols-3 gap-2.5">
              <button @click="handleClearChat" class="mobile-action-btn"><TrashIcon class="w-5 h-5" /><span class="text-xs">Clear</span></button>
              <button @click="handleToggleFullscreen" class="mobile-action-btn">
                <ArrowsPointingOutIcon v-if="!effectiveIsFullscreen" class="w-5 h-5" /><ArrowsPointingInIcon v-else class="w-5 h-5" />
                <span class="text-xs">{{ effectiveIsFullscreen ? 'Exit FS' : 'Fullscreen' }}</span>
              </button>
              <button @click="handleToggleTheme" class="mobile-action-btn">
                <SunIcon v-if="isDarkMode" class="w-5 h-5" /><MoonIcon v-else class="w-5 h-5" />
                <span class="text-xs">Theme</span>
              </button>
              <router-link to="/settings" @click="isMobileNavOpen = false" class="mobile-action-btn"><CogIcon class="w-5 h-5" /><span class="text-xs">Settings</span></router-link>
              <router-link to="/about" @click="isMobileNavOpen = false" class="mobile-action-btn"><InformationCircleIcon class="w-5 h-5" /><span class="text-xs">About</span></router-link>
              <button @click="handleLogout" class="mobile-action-btn text-red-600 dark:text-red-400"><ArrowRightOnRectangleIcon class="w-5 h-5" /><span class="text-xs">Logout</span></button>
            </div>
          </section>
        </div>
      </div>
    </transition>

    <div
        v-if="effectiveIsFullscreen && !showHeaderOptionsInFullscreen"
        class="fixed top-2 right-2 sm:top-3 sm:right-3 z-50 flex items-center gap-1.5 sm:gap-2"
      >
      <button @click="showHeaderOptionsInFullscreen = true" class="fullscreen-minimal-btn" title="Show Menu">
        <Bars3Icon class="w-5 h-5" />
      </button>
      <button @click="handleToggleFullscreen" class="fullscreen-minimal-btn" title="Exit Fullscreen">
        <ArrowsPointingInIcon class="w-5 h-5" />
      </button>
    </div>
      <div v-if="effectiveIsFullscreen && showHeaderOptionsInFullscreen"
        class="fixed top-2 right-2 sm:top-3 sm:right-3 z-[60]">
        <button @click="showHeaderOptionsInFullscreen = false" class="fullscreen-minimal-btn" title="Hide Menu">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

  </header>
</template>

<script setup lang="ts">
/**
 * @file Header.vue
 * @description Global application header component.
 * Provides navigation, mode selection, language selection (contextual),
 * quick settings, cost display, and theme/fullscreen toggles.
 * Adapts for desktop and mobile views, and interacts with fullscreen state.
 * @version 1.2.0 - Enhanced fullscreen awareness and refined mobile navigation.
 */
import { ref, computed, watch, onMounted, onUnmounted, PropType } from 'vue';
import { useStorage } from '@vueuse/core';
import { useRouter } from 'vue-router'; // Corrected import
import {
  ChevronDownIcon, Bars3Icon, XMarkIcon, TrashIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon, SunIcon, MoonIcon,
  CogIcon, InformationCircleIcon, ArrowRightOnRectangleIcon,
  CodeBracketIcon, CpuChipIcon, DocumentTextIcon, ChatBubbleLeftRightIcon,
  LanguageIcon, SquaresPlusIcon // Example icons
} from '@heroicons/vue/24/outline';

// Define ModePreset and LanguageOption interfaces for clarity
interface ModePreset {
  label: string;
  value: string;
  description: string;
  icon: any; // Vue component type
  iconClass: string;
}

interface LanguageOption {
  label: string;
  value: string;
  icon: string; // Emoji or short code
  description: string;
}

const props = defineProps({
  /** Current session cost to display. */
  sessionCost: {
    type: Number,
    required: true,
  },
  /** Current operational mode of the assistant. */
  mode: {
    type: String,
    required: true,
  },
  /** Current selected programming language for coding mode. */
  language: {
    type: String,
    required: true,
  },
  /** Flag indicating if diagrams should be generated. */
  generateDiagram: {
    type: Boolean,
    required: true,
  },
  /** Current audio input mode (e.g., 'push-to-talk'). */
  audioMode: {
    type: String,
    default: 'push-to-talk',
  },
  /** Flag indicating if the application is in fullscreen mode. */
  isFullscreen: {
    type: Boolean,
    default: false,
  },
  /** Flag indicating if chat should auto-clear. */
  autoClearChat: { // Added from previous context, seems relevant for header quick toggles
    type: Boolean,
    default: true,
  }
});

const emit = defineEmits<{
  /** Emitted when the assistant mode is updated. */
  'update:mode': [value: string];
  /** Emitted when the programming language is updated. */
  'update:language': [value: string];
  /** Emitted when the generate diagram flag is updated. */
  'update:generate-diagram': [value: boolean];
  /** Emitted when the audio input mode is updated. */
  'update:audio-mode': [value: string];
  /** Emitted when the auto-clear chat flag is updated. */
  'update:auto-clear-chat': [value: boolean];
  /** Emitted to toggle the application's theme. */
  'toggle-theme': [];
  /** Emitted to toggle the application's fullscreen state. */
  'toggle-fullscreen': [];
  /** Emitted to clear the current chat session. */
  'clear-chat': [];
  /** Emitted when the user requests to logout. */
  'logout': [];
}>();

const router = useRouter();

// --- Local Reactive State (for UI interactions within Header) ---
const localMode = ref(props.mode);
const localLanguage = ref(props.language);
const localGenerateDiagram = ref(props.generateDiagram);
const localAudioMode = ref(props.audioMode);
const localAutoClearChat = ref(props.autoClearChat);

const showModeDropdown = ref(false);
const showLanguageDropdown = ref(false);
const isMobileNavOpen = ref(false);
const showHeaderOptionsInFullscreen = ref(false); // User can temporarily show header in FS

// Refs for dropdown click-outside detection
const modeDropdownRef = ref<HTMLElement | null>(null);
const languageDropdownRef = ref<HTMLElement | null>(null);

// Persistent state
const isDarkMode = useStorage('darkMode', false);

// --- Computed Properties ---
const effectiveIsFullscreen = computed(() => props.isFullscreen);

// --- Data ---
const modePresets: ModePreset[] = [
  { label: 'Coding Q&A', value: 'coding', description: 'Algorithm problems & debugging', icon: CodeBracketIcon, iconClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { label: 'System Design', value: 'system_design', description: 'Architecture & scalability', icon: CpuChipIcon, iconClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { label: 'Meeting Notes', value: 'meeting', description: 'Transcription & summaries', icon: DocumentTextIcon, iconClass: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  { label: 'General Chat', value: 'general', description: 'Open conversation', icon: ChatBubbleLeftRightIcon, iconClass: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400' }
];

const programmingLanguages: LanguageOption[] = [
  { label: 'Python', value: 'python', icon: '🐍', description: 'General purpose' },
  { label: 'JavaScript', value: 'javascript', icon: '⚡', description: 'Web development' },
  { label: 'TypeScript', value: 'typescript', icon: '🔷', description: 'Typed JavaScript' },
  { label: 'Java', value: 'java', icon: '☕', description: 'Enterprise apps' },
  // Add more as needed
];

// --- Methods ---
const getModeDisplayName = () => modePresets.find(p => p.value === localMode.value)?.label || 'Select Mode';
const getModeIcon = () => modePresets.find(p => p.value === localMode.value)?.icon || SquaresPlusIcon; // Corrected syntax
const getModeIconClass = () => modePresets.find(p => p.value === localMode.value)?.iconClass || 'bg-gray-100 text-gray-600';
const getLanguageIcon = (lang: string) => programmingLanguages.find(l => l.value === lang)?.icon || '💻';

const toggleDropdown = (type: 'mode' | 'language') => {
  if (type === 'mode') {
    showModeDropdown.value = !showModeDropdown.value;
    showLanguageDropdown.value = false;
  } else {
    showLanguageDropdown.value = !showLanguageDropdown.value;
    showModeDropdown.value = false;
  }
};

const selectMode = (modeValue: string) => {
  localMode.value = modeValue;
  emit('update:mode', modeValue);
  showModeDropdown.value = false;
  if(isMobileNavOpen.value) isMobileNavOpen.value = false; // Close mobile nav on selection
};

const selectLanguage = (languageValue: string) => {
  localLanguage.value = languageValue;
  emit('update:language', languageValue);
  showLanguageDropdown.value = false;
};

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
  // Close desktop dropdowns if open
  showModeDropdown.value = false;
  showLanguageDropdown.value = false;
};

const handleClearChat = () => {
  emit('clear-chat');
  if(isMobileNavOpen.value) isMobileNavOpen.value = false;
};

const handleToggleFullscreen = () => {
  emit('toggle-fullscreen');
  if(isMobileNavOpen.value) isMobileNavOpen.value = false;
  if(props.isFullscreen) showHeaderOptionsInFullscreen.value = false; // Hide options when exiting FS
};

const handleToggleTheme = () => {
  emit('toggle-theme');
  // If mobile nav is open, don't close it, theme can be toggled from anywhere
};

const handleLogout = () => {
  emit('logout');
  if(isMobileNavOpen.value) isMobileNavOpen.value = false;
};

const closeAllDropdowns = () => {
  showModeDropdown.value = false;
  showLanguageDropdown.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (modeDropdownRef.value && !modeDropdownRef.value.contains(event.target as Node)) {
    showModeDropdown.value = false;
  }
  if (languageDropdownRef.value && !languageDropdownRef.value.contains(event.target as Node)) {
    showLanguageDropdown.value = false;
  }
  // Note: Mobile nav is full screen, so click outside doesn't apply the same way.
  // It's closed by its own X button or by selecting an action.
};

// --- Watchers for Prop Sync ---
watch(() => props.mode, (newVal) => { localMode.value = newVal; });
watch(() => props.language, (newVal) => { localLanguage.value = newVal; });
watch(() => props.generateDiagram, (newVal) => { localGenerateDiagram.value = newVal; });
watch(() => props.audioMode, (newVal) => { localAudioMode.value = newVal; });
watch(() => props.autoClearChat, (newVal) => { localAutoClearChat.value = newVal; });


// --- Watchers for Emitting Local Changes ---
watch(localGenerateDiagram, (newVal) => emit('update:generate-diagram', newVal));
watch(localAudioMode, (newVal) => emit('update:audio-mode', newVal));
watch(localAutoClearChat, (newVal) => emit('update:auto-clear-chat', newVal));


// --- Lifecycle Hooks ---
onMounted(() => {
  document.addEventListener('click', handleClickOutside, true); // Use capture phase
});

onUnmounted(() => { // Corrected from onBeforeUnmount for consistency with add/remove listener
  document.removeEventListener('click', handleClickOutside, true);
});

</script>
<style lang="postcss" scoped>
.app-header.opacity-0 { pointer-events: none; } /* Ensure hidden header is not interactive */

.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-600 dark:from-primary-400 dark:to-purple-500;
}
.glass-effect { /* For cost display */
  @apply bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200 dark:border-gray-600;
}
.nav-button {
  @apply px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600; /* Changed dark:hover:bg-gray-750 to dark:hover:bg-gray-700 */
}
.action-btn {
  @apply p-1.5 sm:p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-1 focus:ring-primary-500;
}
.fullscreen-minimal-btn {
    @apply p-2 bg-black/40 dark:bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-black/50 dark:hover:bg-white/30 transition-colors shadow-lg;
}
.fullscreen-minimal-btn .icon { @apply w-5 h-5; }


/* Dropdown Menu */
.dropdown-menu {
  @apply absolute top-full mt-1.5 right-0 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl backdrop-blur-sm z-50;
  min-width: 15rem; /* Ensure decent width */
}
.dropdown-header { @apply p-3 border-b border-gray-200 dark:border-gray-700 text-sm; }
.dropdown-header h3 { @apply text-gray-800 dark:text-gray-100; }
.dropdown-content { @apply p-1.5; }
.dropdown-item { @apply w-full p-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors text-sm; } /* Changed dark:hover:bg-gray-750 to dark:hover:bg-gray-700 */
.dropdown-item.active { @apply bg-primary-50 dark:bg-primary-700/20 text-primary-700 dark:text-primary-300 font-medium; }
.mode-icon-sm { @apply w-7 h-7 rounded-md flex items-center justify-center text-sm; } /* For icons in dropdown */
.language-icon-sm { @apply w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-mono; }


/* Small Toggle Switch */
.toggle-switch-sm { @apply relative inline-flex items-center h-5 rounded-full w-9 cursor-pointer; }
.toggle-switch-sm .slider-sm { @apply absolute inset-0 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-200 ease-in-out; }
.toggle-switch-sm .slider-sm:before { content: ""; @apply absolute h-4 w-4 left-[2px] bottom-[2px] bg-white rounded-full transition-transform duration-200 ease-in-out shadow; }
.toggle-switch-sm input:checked + .slider-sm { @apply bg-primary-500 dark:bg-primary-500; } /* Consider dark:bg-primary-400 or similar for dark mode consistency if primary-500 is too bright */
.toggle-switch-sm input:checked + .slider-sm:before { transform: translateX(0.75rem); /* 12px */ }

/* Mobile Navigation */
.mobile-section-title { @apply block mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider; }
.mobile-select { @apply w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500; } /* Changed dark:bg-gray-750 to dark:bg-gray-700 */
.mobile-mode-card { @apply flex flex-col items-center justify-center gap-1.5 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center; }
.mobile-mode-card.active { @apply border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-700/20 text-primary-700 dark:text-primary-300; }
.mobile-toggle-item { @apply flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300; } /* Changed dark:bg-gray-750 to dark:bg-gray-700 */
.mobile-action-btn { @apply flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors; }
.mobile-action-btn .icon { @apply w-5 h-5 mb-0.5; }

/* Transitions for dropdowns and mobile nav */
.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: opacity 0.15s ease-out, transform 0.15s ease-out; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-5px) scale(0.95); }

.slide-down-enter-active, .slide-down-leave-active { transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out; }
.slide-down-enter-from, .slide-down-leave-to { transform: translateY(-100%); opacity: 0.8; }

/* Ensure primary colors are available for Tailwind JIT (these are fine as placeholders) */
.bg-primary-50 { } .dark\:bg-primary-700\/20 { } .text-primary-700 { } .dark\:text-primary-300 { }
.border-primary-500 { } .dark\:border-primary-400 { }
.bg-primary-600 { } .text-primary-600 { } .dark\:text-primary-400 { }
.from-primary-500 {} .to-purple-600 {} .dark\:from-primary-400 {} .dark\:to-purple-500 {}
</style>