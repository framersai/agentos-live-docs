// File: src/components/Header.vue
/**
 * @file Header.vue
 * @description Global application header component. Provides navigation, centralized voice settings,
 * cost display, theme/fullscreen toggles, and adapts for different view modes.
 * @version 2.0.1 - Merged old logic for dropdowns and quick settings, refined mobile nav.
 */
<script lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, defineComponent, defineAsyncComponent } from 'vue';
import { useStorage } from '@vueuse/core';
import { RouterLink } from 'vue-router'; // useRouter is not directly used in template, but good to list if setup uses it for logic
import { voiceSettingsManager, VoiceApplicationSettings } from '@/services/voice.settings.service'; // Central settings
import { useUiStore } from '@/store/ui.store'; // Pinia store for UI states

// Async load heavy dropdown for better initial perf
const VoiceControlsDropdown = defineAsyncComponent(() => import('./header/VoiceControlsDropdown.vue'));

import {
  ChevronDownIcon, Bars3Icon, XMarkIcon, TrashIcon, Cog8ToothIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon, SunIcon, MoonIcon,
  InformationCircleIcon, ArrowRightOnRectangleIcon, CodeBracketIcon, CpuChipIcon,
  DocumentTextIcon, ChatBubbleLeftRightIcon, SquaresPlusIcon, AdjustmentsHorizontalIcon, ClockIcon,
  PencilSquareIcon, SparklesIcon // Example for possible new icons if needed
} from '@heroicons/vue/24/outline';

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
  icon: string; // Emoji or short code for display
  description: string;
}

export default defineComponent({
  name: 'AppHeader',
  components: {
    RouterLink, VoiceControlsDropdown,
    ChevronDownIcon, Bars3Icon, XMarkIcon, TrashIcon, Cog8ToothIcon,
    ArrowsPointingOutIcon, ArrowsPointingInIcon, SunIcon, MoonIcon,
    InformationCircleIcon, ArrowRightOnRectangleIcon, CodeBracketIcon, CpuChipIcon,
    DocumentTextIcon, ChatBubbleLeftRightIcon, SquaresPlusIcon, AdjustmentsHorizontalIcon, ClockIcon,
    PencilSquareIcon, SparklesIcon // Ensure all used icons are registered
  },
  props: {
    sessionCost: { type: Number, required: true },
  },
  emits: [
    'toggle-theme', 'toggle-fullscreen', 'clear-chat', 'logout',
    'show-prior-chat-log'
  ],
  setup(_, { emit }) {
    const uiStore = useUiStore();

    // Assuming VoiceApplicationSettings now includes currentAppMode, preferredCodingLanguage, autoClearChat, generateDiagrams
    const appSettings = voiceSettingsManager.settings as VoiceApplicationSettings & {
        currentAppMode: string; // Define expected extended properties for type safety here
        preferredCodingLanguage: string;
        autoClearChat: boolean;
        generateDiagrams: boolean;
    };


    // Local UI state for header dropdowns
    const showModeDropdown = ref(false);
    const modeDropdownRef = ref<HTMLElement | null>(null);
    const showLanguageDropdown = ref(false);
    const languageDropdownRef = ref<HTMLElement | null>(null);

    const isMobileNavOpen = ref(false);

    const isDarkMode = useStorage('darkMode', false);
    const isFullscreenActive = computed(() => uiStore.isFullscreen);
    const showHeaderInFullscreen = computed(() => uiStore.showHeaderInFullscreenMinimal);

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
    ];

    const getModeDisplayName = () => modePresets.find(p => p.value === appSettings.currentAppMode)?.label || 'Select Mode';
    const getModeIcon = () => modePresets.find(p => p.value === appSettings.currentAppMode)?.icon || SquaresPlusIcon;
    const getModeIconClass = () => modePresets.find(p => p.value === appSettings.currentAppMode)?.iconClass || 'bg-gray-100 text-gray-600';
    const getLanguageDisplayName = () => programmingLanguages.find(l => l.value === appSettings.preferredCodingLanguage)?.label || 'Language';
    const getLanguageIcon = (langValue: string) => programmingLanguages.find(l => l.value === langValue)?.icon || '🧑‍💻';


    const toggleModeDropdown = () => {
      showModeDropdown.value = !showModeDropdown.value;
      if (showModeDropdown.value) showLanguageDropdown.value = false; // Close other dropdown
    };

    const toggleLanguageDropdown = () => {
      showLanguageDropdown.value = !showLanguageDropdown.value;
      if (showLanguageDropdown.value) showModeDropdown.value = false; // Close other dropdown
    };

    const selectAppMode = (modeValue: string) => {
      appSettings.currentAppMode = modeValue;
      showModeDropdown.value = false;
      if(isMobileNavOpen.value) isMobileNavOpen.value = false;
    };

    const selectCodingLanguage = (languageValue: string) => {
      appSettings.preferredCodingLanguage = languageValue;
      showLanguageDropdown.value = false;
      if(isMobileNavOpen.value) isMobileNavOpen.value = false;
    };

    const toggleMobileNav = () => {
      isMobileNavOpen.value = !isMobileNavOpen.value;
      showModeDropdown.value = false;
      showLanguageDropdown.value = false;
    };

    const handleClearChat = () => { emit('clear-chat'); if(isMobileNavOpen.value) isMobileNavOpen.value = false; };
    const handleToggleFullscreen = () => {
        emit('toggle-fullscreen');
        if(isMobileNavOpen.value) isMobileNavOpen.value = false;
        if (uiStore.isFullscreen) showHeaderInFullscreen.value = false; // Hide options when exiting FS via button
    };
    const handleToggleTheme = () => { emit('toggle-theme'); }; // Mobile nav can stay open
    const handleLogout = () => { emit('logout'); if(isMobileNavOpen.value) isMobileNavOpen.value = false; };
    const handleShowPriorChatLog = () => { emit('show-prior-chat-log'); if(isMobileNavOpen.value) isMobileNavOpen.value = false; }

    const handleClickOutside = (event: MouseEvent) => {
      if (modeDropdownRef.value && !modeDropdownRef.value.contains(event.target as Node)) {
        showModeDropdown.value = false;
      }
      if (languageDropdownRef.value && !languageDropdownRef.value.contains(event.target as Node)) {
        showLanguageDropdown.value = false;
      }
    };

    onMounted(() => { document.addEventListener('click', handleClickOutside, true); });
    onUnmounted(() => { document.removeEventListener('click', handleClickOutside, true); });
    
    const toggleShowHeaderInFullscreen = () => uiStore.toggleShowHeaderInFullscreenMinimal();

    const navLinks = ref([
        { name: 'Home', path: '/', icon: null },
        { name: 'Settings', path: '/settings', icon: Cog8ToothIcon },
        { name: 'About', path: '/about', icon: InformationCircleIcon },
    ]);

    // Watchers for direct settings changes (e.g., from VoiceControlsDropdown or other components)
    // This is primarily for UI elements in the header that need to react, like displayed names/icons.
    // The actual state change is handled by the service.
    watch(() => appSettings.currentAppMode, () => { /* Force re-render if needed, but computed should handle */ });
    watch(() => appSettings.preferredCodingLanguage, () => { /* Force re-render */ });


    return {
      appSettings,
      voiceSettingsManager, // For direct access if needed, e.g., non-setting reactive states
      isDarkMode,
      isFullscreenActive,
      showHeaderInFullscreen,
      toggleShowHeaderInFullscreen,
      isMobileNavOpen,
      toggleMobileNav,
      
      showModeDropdown,
      modeDropdownRef,
      toggleModeDropdown,
      selectAppMode,
      getModeDisplayName, getModeIcon, getModeIconClass,
      modePresets,

      showLanguageDropdown,
      languageDropdownRef,
      toggleLanguageDropdown,
      selectCodingLanguage,
      getLanguageDisplayName, getLanguageIcon,
      programmingLanguages,

      handleClearChat, handleToggleFullscreen, handleToggleTheme, handleLogout, handleShowPriorChatLog,
      navLinks,
      AdjustmentsHorizontalIcon, ClockIcon, PencilSquareIcon, SparklesIcon
    };
  },
});
</script>

<template>
  <header
    class="app-header sticky top-0 z-40 transition-all duration-300 ease-in-out"
    :class="{
      'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700': !isFullscreenActive || showHeaderInFullscreen,
      'bg-transparent pointer-events-none': isFullscreenActive && !showHeaderInFullscreen && !isMobileNavOpen,
      'opacity-0 translate-y-[-100%]': isFullscreenActive && !showHeaderInFullscreen && !isMobileNavOpen,
      'opacity-100 translate-y-0': !isFullscreenActive || showHeaderInFullscreen || isMobileNavOpen,
      'shadow-lg': !isFullscreenActive && !isMobileNavOpen
    }"
  >
    <div class="max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6" v-show="!isFullscreenActive || showHeaderInFullscreen || isMobileNavOpen">
      <div class="flex items-center justify-between h-16 md:h-18">
        <div class="flex items-center gap-2 sm:gap-3">
          <RouterLink to="/" class="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity" @click="isMobileNavOpen = false">
            <img src="/src/assets/logo.svg" alt="VCA Logo" class="w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
            <div class="hidden md:block">
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Voice Chat <span class="text-primary-600 dark:text-primary-400">Assistant</span>
              </h1>
            </div>
            <span class="md:hidden text-lg sm:text-xl font-bold text-gray-900 dark:text-white">VCA</span>
          </RouterLink>
        </div>

        <nav class="hidden lg:flex items-center space-x-1 xl:space-x-2">
          <div class="relative" ref="modeDropdownRef">
            <button @click="toggleModeDropdown" class="nav-button flex items-center gap-1.5">
              <component :is="getModeIcon()" class="w-4 h-4 shrink-0" :class="getModeIconClass().replace('bg-', 'text-').replace('dark:bg-', 'dark:text-')" />
              <span class="font-medium text-sm">{{ getModeDisplayName() }}</span>
              <ChevronDownIcon class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': showModeDropdown }" />
            </button>
            <transition name="dropdown-fade">
              <div v-show="showModeDropdown" class="dropdown-menu w-72">
                <div class="dropdown-header"><h3 class="font-medium">Select Mode</h3></div>
                <div class="dropdown-content p-2">
                  <button
                    v-for="preset in modePresets" :key="preset.value" @click="selectAppMode(preset.value)"
                    class="dropdown-item w-full" :class="{ 'active': appSettings.currentAppMode === preset.value }"
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
          
          <div v-if="appSettings.currentAppMode === 'coding'" class="relative" ref="languageDropdownRef">
            <button @click="toggleLanguageDropdown" class="nav-button flex items-center gap-1.5">
               <span class="text-lg leading-none">{{ getLanguageIcon(appSettings.preferredCodingLanguage) }}</span>
              <span class="font-medium text-sm">{{ getLanguageDisplayName() }}</span>
              <ChevronDownIcon class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': showLanguageDropdown }" />
            </button>
            <transition name="dropdown-fade">
                <div v-show="showLanguageDropdown" class="dropdown-menu w-64">
                    <div class="dropdown-header"><h3 class="font-medium">Programming Language</h3></div>
                    <div class="dropdown-content p-2 max-h-72 overflow-y-auto">
                        <button
                            v-for="lang in programmingLanguages" :key="lang.value" @click="selectCodingLanguage(lang.value)"
                            class="dropdown-item w-full" :class="{ 'active': appSettings.preferredCodingLanguage === lang.value }">
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

          <Suspense>
            <VoiceControlsDropdown />
            <template #fallback>
              <button class="nav-button flex items-center gap-1.5 opacity-50 cursor-default">
                <AdjustmentsHorizontalIcon class="w-4 h-4" /> <span class="text-sm">Voice...</span>
              </button>
            </template>
          </Suspense>
          
          <div class="flex items-center gap-3 pl-2" v-if="appSettings.currentAppMode === 'coding' || appSettings.currentAppMode === 'system_design'">
            <div class="flex items-center gap-1.5" title="Generate diagrams for relevant content">
                <label for="diagramToggleDesktop" class="text-xs text-gray-600 dark:text-gray-400 cursor-pointer">Diagrams</label>
                <label class="toggle-switch-xs">
                    <input id="diagramToggleDesktop" type="checkbox" v-model="appSettings.generateDiagrams" class="sr-only">
                    <span class="slider-xs"></span>
                </label>
            </div>
          </div>
          <div class="flex items-center gap-1.5 pl-2" title="Auto-clear chat after each response">
              <label for="autoClearToggleDesktop" class="text-xs text-gray-600 dark:text-gray-400 cursor-pointer">Auto-Clear</label>
              <label class="toggle-switch-xs">
                  <input id="autoClearToggleDesktop" type="checkbox" v-model="appSettings.autoClearChat" class="sr-only">
                  <span class="slider-xs"></span>
              </label>
          </div>


          <RouterLink
            v-for="link in navLinks.filter(l => l.path !== '/')" :key="link.path" :to="link.path"
            class="nav-button flex items-center gap-1.5"
            active-class="nav-button-active"
          >
            <component v-if="link.icon" :is="link.icon" class="w-4 h-4" />
            <span class="font-medium text-sm">{{ link.name }}</span>
          </RouterLink>
        </nav>

        <div class="flex items-center gap-1.5 sm:gap-2">
          <div class="cost-display glass-effect px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium">
            <span class="hidden sm:inline text-gray-600 dark:text-gray-300">Cost: </span>
            <span class="font-mono text-primary-600 dark:text-primary-400 font-bold">${{ sessionCost.toFixed(3) }}</span>
          </div>

          <div class="hidden md:flex items-center gap-0.5 sm:gap-1">
            <button @click="handleShowPriorChatLog" class="action-btn" title="Show Chat History Log">
                <ClockIcon class="w-4 h-4" />
            </button>
            <button @click="handleClearChat" class="action-btn" title="Clear Chat & Reset Cost"><TrashIcon class="w-4 h-4" /></button>
            <button @click="handleToggleFullscreen" class="action-btn" :title="isFullscreenActive ? 'Exit Fullscreen' : 'Enter Fullscreen'">
              <ArrowsPointingOutIcon v-if="!isFullscreenActive" class="w-4 h-4" />
              <ArrowsPointingInIcon v-else class="w-4 h-4" />
            </button>
            <button @click="handleToggleTheme" class="action-btn" title="Toggle Theme">
              <SunIcon v-if="isDarkMode" class="w-4 h-4" /> <MoonIcon v-else class="w-4 h-4" />
            </button>
          </div>

          <button @click="toggleMobileNav" class="lg:hidden action-btn" aria-label="Toggle mobile menu" :aria-expanded="isMobileNavOpen.toString()">
            <XMarkIcon v-if="isMobileNavOpen" class="w-5 h-5" /> <Bars3Icon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <transition name="slide-down-panel">
      <div
        v-show="isMobileNavOpen && (!isFullscreenActive || showHeaderInFullscreen)"
        class="lg:hidden mobile-nav-panel"
        role="dialog" aria-modal="true"
      >
        <div class="p-4 space-y-4 max-h-[calc(100vh-4.5rem)] overflow-y-auto">
            <section>
                <h3 class="mobile-section-title">Assistant Mode</h3>
                 <div class="grid grid-cols-2 gap-2.5">
                    <button
                        v-for="preset in modePresets" :key="preset.value" @click="selectAppMode(preset.value)"
                        class="mobile-mode-card" :class="{ 'active': appSettings.currentAppMode === preset.value }"
                    >
                        <div class="mode-icon-sm" :class="preset.iconClass"><component :is="preset.icon" class="w-5 h-5" /></div>
                        <span class="text-xs font-medium">{{ preset.label }}</span>
                    </button>
                </div>
            </section>

            <section v-if="appSettings.currentAppMode === 'coding'">
                <h3 class="mobile-section-title">Programming Language</h3>
                <select v-model="appSettings.preferredCodingLanguage" @change="selectCodingLanguage(($event.target as HTMLSelectElement).value)" class="mobile-select">
                    <option v-for="lang in programmingLanguages" :key="lang.value" :value="lang.value">
                        {{ lang.icon }} {{ lang.label }}
                    </option>
                </select>
            </section>

            <section>
                <h3 class="mobile-section-title">Quick Settings</h3>
                <div class="space-y-2.5">
                    <div class="mobile-toggle-item">
                        <label for="autoClearToggleMobile" class="cursor-pointer">Auto-Clear Chat</label>
                        <label class="toggle-switch-sm"><input id="autoClearToggleMobile" type="checkbox" v-model="appSettings.autoClearChat" class="sr-only"><span class="slider-sm"></span></label>
                    </div>
                    <div v-if="appSettings.currentAppMode === 'coding' || appSettings.currentAppMode === 'system_design'" class="mobile-toggle-item">
                        <label for="diagramToggleMobile" class="cursor-pointer">Generate Diagrams</label>
                        <label class="toggle-switch-sm"><input id="diagramToggleMobile" type="checkbox" v-model="appSettings.generateDiagrams" class="sr-only"><span class="slider-sm"></span></label>
                    </div>
                </div>
            </section>
            
            <nav class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-1">
                <RouterLink v-for="link in navLinks.filter(l => l.path !== '/')" :key="link.path" :to="link.path" @click="toggleMobileNav" class="mobile-nav-link">
                    <component v-if="link.icon" :is="link.icon" class="w-5 h-5 mr-3" />
                    {{ link.name }}
                </RouterLink>
            </nav>

            <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <button @click="handleShowPriorChatLog" class="mobile-action-btn-full"><ClockIcon class="w-5 h-5 mr-2"/> Chat History Log</button>
                <button @click="handleClearChat" class="mobile-action-btn-full"><TrashIcon class="w-5 h-5 mr-2"/> Clear Chat</button>
                <button @click="handleToggleTheme" class="mobile-action-btn-full">
                    <SunIcon v-if="isDarkMode" class="w-5 h-5 mr-2" /> <MoonIcon v-else class="w-5 h-5 mr-2" /> Toggle Theme
                </button>
                <button @click="handleToggleFullscreen" class="mobile-action-btn-full">
                    <ArrowsPointingOutIcon v-if="!isFullscreenActive" class="w-5 h-5 mr-2" /> <ArrowsPointingInIcon v-else class="w-5 h-5 mr-2" />
                    {{ isFullscreenActive ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
                </button>
                <button @click="handleLogout" class="mobile-action-btn-full text-red-600 dark:text-red-400">
                    <ArrowRightOnRectangleIcon class="w-5 h-5 mr-2"/> Logout
                </button>
            </div>
        </div>
      </div>
    </transition>

    <div v-if="isFullscreenActive && !showHeaderInFullscreen" class="fixed top-3 right-3 z-50 flex items-center gap-2">
      <button @click="toggleShowHeaderInFullscreen" class="fullscreen-minimal-btn" title="Show Menu">
        <Bars3Icon class="w-5 h-5" />
      </button>
      <button @click="handleToggleFullscreen" class="fullscreen-minimal-btn" title="Exit Fullscreen">
        <ArrowsPointingInIcon class="w-5 h-5" />
      </button>
    </div>
    <div v-if="isFullscreenActive && showHeaderInFullscreen" class="fixed top-3 right-3 z-[60]">
      <button @click="toggleShowHeaderInFullscreen" class="fullscreen-minimal-btn" title="Hide Menu">
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>

<style lang="postcss" scoped>
/* Base styles from your new Header.vue, adapted for clarity and new elements */
.app-header.opacity-0 { pointer-events: none; }

.nav-button {
  @apply inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
        text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-700/60
        focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none
        transition-colors duration-150;
}
.nav-button-active {
  @apply bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300;
}

.action-btn {
  @apply p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
        hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-all
        focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none;
}

.cost-display {
  @apply bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm;
}

.dropdown-menu {
  @apply absolute top-full mt-1.5 right-0 origin-top-right bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl backdrop-blur-md z-50;
  min-width: 16rem;
}
.dropdown-header { @apply px-3.5 py-2.5 border-b border-gray-200 dark:border-gray-700 text-sm; }
.dropdown-header h3 { @apply text-gray-800 dark:text-gray-100; }
.dropdown-content { @apply p-1.5; } /* Padding for items container */
.dropdown-item {
  @apply w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700/70 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-200;
}
.dropdown-item.active {
  @apply bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300 font-semibold;
}
.mode-icon-sm { @apply w-8 h-8 rounded-lg flex items-center justify-center text-base; }

/* Mobile Navigation Panel */
.mobile-nav-panel {
  @apply absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-xl;
}
.mobile-nav-link {
  @apply flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 rounded-lg transition-colors;
}
.mobile-action-btn-full { /* For buttons like clear chat, logout in mobile panel */
  @apply flex items-center justify-start w-full px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 rounded-lg transition-colors;
}
.mobile-section-title { @apply block mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider; }
.mobile-select { @apply w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500; }
.mobile-mode-card { @apply flex flex-col items-center justify-center gap-1.5 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center; }
.mobile-mode-card.active { @apply border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-700/20 text-primary-700 dark:text-primary-300; }
.mobile-toggle-item { @apply flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg text-sm text-gray-700 dark:text-gray-300; }


/* Small Toggle Switch (from old, can be used for desktop too if needed) */
.toggle-switch-xs { @apply relative inline-flex items-center h-4 rounded-full w-7 cursor-pointer; }
.toggle-switch-xs .slider-xs { @apply absolute inset-0 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-200 ease-in-out; }
.toggle-switch-xs .slider-xs:before { content: ""; @apply absolute h-3 w-3 left-[2px] bottom-[2px] bg-white rounded-full transition-transform duration-200 ease-in-out shadow; }
.toggle-switch-xs input:checked + .slider-xs { @apply bg-primary-500 dark:bg-primary-500; }
.toggle-switch-xs input:checked + .slider-xs:before { transform: translateX(0.625rem); /* 10px */ }

/* Regular Toggle Switch (from old, mobile specific) */
.toggle-switch-sm { @apply relative inline-flex items-center h-5 rounded-full w-9 cursor-pointer; }
.toggle-switch-sm .slider-sm { @apply absolute inset-0 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-200 ease-in-out; }
.toggle-switch-sm .slider-sm:before { content: ""; @apply absolute h-4 w-4 left-[2px] bottom-[2px] bg-white rounded-full transition-transform duration-200 ease-in-out shadow; }
.toggle-switch-sm input:checked + .slider-sm { @apply bg-primary-500 dark:bg-primary-500; }
.toggle-switch-sm input:checked + .slider-sm:before { transform: translateX(0.75rem); /* 12px */ }


/* Transitions */
.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: opacity 0.15s ease-out, transform 0.15s ease-out; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-8px) scale(0.98); }

.slide-down-panel-enter-active, .slide-down-panel-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease-out; }
.slide-down-panel-enter-from, .slide-down-panel-leave-to { transform: translateY(-20%); opacity: 0; }

.fullscreen-minimal-btn {
  @apply p-2.5 bg-black/40 dark:bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-black/50 dark:hover:bg-white/30 transition-colors shadow-lg;
}

/* Ensure primary colors are defined for Tailwind JIT if not used elsewhere (placeholders for safety) */
.bg-primary-50 { } .dark\:bg-primary-500\/20 { } .text-primary-600 { } .dark\:text-primary-300 { }
.border-primary-500 { } .dark\:border-primary-400 { }
.bg-primary-600 { } .dark\:text-primary-400 { }
</style>