/**
 * @file Header.vue
 * @description Global application header. Provides navigation, mode/language selection,
 * quick access to voice and other settings, cost display, and UI toggles.
 * @version 2.1.5 - Corrected ARIA attribute bindings for type compatibility.
 */
<script lang="ts">
import { ref, computed, onMounted, onUnmounted, defineComponent, defineAsyncComponent } from 'vue';
import { useStorage } from '@vueuse/core';
import { RouterLink } from 'vue-router';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { useUiStore } from '@/store/ui.store';

const VoiceControlsDropdown = defineAsyncComponent(() => import('./header/VoiceControlsDropdown.vue'));

import {
  ChevronDownIcon, Bars3Icon, XMarkIcon, TrashIcon, Cog8ToothIcon, SquaresPlusIcon, PhotoIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon, SunIcon, MoonIcon, CodeBracketIcon, CpuChipIcon,
  InformationCircleIcon, ArrowRightOnRectangleIcon, DocumentTextIcon, ChatBubbleLeftRightIcon,
  LanguageIcon, AdjustmentsHorizontalIcon, ClockIcon, PencilSquareIcon
} from '@heroicons/vue/24/outline';

interface ModePreset {
  label: string;
  value: string;
  description: string;
  icon: any; // Vue component type
  iconClassBase: string;
}

interface LanguageOption {
  label: string;
  value: string;
  icon?: string;
}

export default defineComponent({
  name: 'AppHeader',
  components: {
    RouterLink, VoiceControlsDropdown, ChevronDownIcon, Bars3Icon, XMarkIcon, TrashIcon,
    Cog8ToothIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, SunIcon, MoonIcon,
    InformationCircleIcon, ArrowRightOnRectangleIcon, CodeBracketIcon, CpuChipIcon,
    DocumentTextIcon, ChatBubbleLeftRightIcon, LanguageIcon, SquaresPlusIcon, PhotoIcon,
    AdjustmentsHorizontalIcon, ClockIcon, PencilSquareIcon
  },
  props: {
    sessionCost: { type: Number, default: 0 },
  },
  emits: ['toggle-theme', 'toggle-fullscreen', 'clear-chat', 'logout', 'show-prior-chat-log'],
  setup(props, { emit }) {
    const uiStore = useUiStore();
    const appSettings = voiceSettingsManager.settings;

    const showModeDropdown = ref(false);
    const modeDropdownRef = ref<HTMLElement | null>(null);
    const showLanguageDropdown = ref(false);
    const languageDropdownRef = ref<HTMLElement | null>(null);
    const isMobileNavOpen = ref(false);

    const isDarkMode = useStorage('darkMode', false);
    const isFullscreenActive = computed(() => uiStore.isFullscreen);
    const showHeaderInFullscreen = computed(() => uiStore.showHeaderInFullscreenMinimal);

    const modePresets: ModePreset[] = [
      { label: 'General Chat', value: 'general', description: 'Open conversation', icon: ChatBubbleLeftRightIcon, iconClassBase: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
      { label: 'Coding Q&A', value: 'coding', description: 'Algorithms & debugging', icon: CodeBracketIcon, iconClassBase: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' },
      { label: 'System Design', value: 'system_design', description: 'Architecture ideas', icon: CpuChipIcon, iconClassBase: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400' },
      { label: 'Tutor Mode', value: 'tutor', description: 'Learn and explore topics', icon: SquaresPlusIcon, iconClassBase: 'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400' },
      { label: 'Meeting Notes', value: 'meeting', description: 'Summaries & actions', icon: DocumentTextIcon, iconClassBase: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' },
      { label: 'Diary/Journal', value: 'diary', description: 'Personal reflections', icon: PencilSquareIcon, iconClassBase: 'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400' },
      { label: 'Coding Interviewer', value: 'coding_interviewer', description: 'Practice interviews', icon: CodeBracketIcon, iconClassBase: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' },
      { label: 'Business Assistant', value: 'business_meeting', description: 'Business context chat', icon: DocumentTextIcon, iconClassBase: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' },
    ];

    const programmingLanguages: LanguageOption[] = [
      { label: 'Python', value: 'python', icon: '🐍' }, { label: 'JavaScript', value: 'javascript', icon: '⚡' },
      { label: 'TypeScript', value: 'typescript', icon: '🔷' }, { label: 'Java', value: 'java', icon: '☕' },
      { label: 'C++', value: 'cpp', icon: '🅲➕' }, { label: 'Go', value: 'go', icon: '🐹' },
      { label: 'Rust', value: 'rust', icon: '🦀' }, { label: 'PHP', value: 'php', icon: '🐘'},
    ];

    const getModeDisplay = computed(() => modePresets.find(p => p.value === appSettings.currentAppMode) || modePresets.find(p => p.value === appSettings.defaultMode) || modePresets[0]);
    const getLanguageDisplay = computed(() => programmingLanguages.find(l => l.value === appSettings.preferredCodingLanguage) || programmingLanguages.find(l => l.value === appSettings.defaultLanguage) || programmingLanguages[0]);

    const toggleDropdown = (type: 'mode' | 'language') => {
      if (type === 'mode') {
        showModeDropdown.value = !showModeDropdown.value;
        if (showModeDropdown.value) showLanguageDropdown.value = false;
      } else if (type === 'language') {
        showLanguageDropdown.value = !showLanguageDropdown.value;
        if (showLanguageDropdown.value) showModeDropdown.value = false;
      }
    };

    const selectAppMode = (modeValue: string) => {
      voiceSettingsManager.updateSetting('currentAppMode', modeValue);
      showModeDropdown.value = false;
      if(isMobileNavOpen.value) isMobileNavOpen.value = false;
    };
    const selectCodingLanguage = (languageValue: string) => {
      voiceSettingsManager.updateSetting('preferredCodingLanguage', languageValue);
      showLanguageDropdown.value = false;
      if(isMobileNavOpen.value) isMobileNavOpen.value = false;
    };

    const toggleMobileNav = () => isMobileNavOpen.value = !isMobileNavOpen.value;
    const closeMobileNav = () => isMobileNavOpen.value = false;

    const handleClearChat = () => { emit('clear-chat'); closeMobileNav(); };
    const handleToggleFullscreen = () => { emit('toggle-fullscreen'); if (uiStore.isFullscreen) uiStore.setShowHeaderInFullscreenMinimal(false); closeMobileNav(); };
    const handleToggleTheme = () => { emit('toggle-theme'); };
    const handleLogout = () => { emit('logout'); closeMobileNav(); };
    const handleShowPriorChatLog = () => { emit('show-prior-chat-log'); closeMobileNav(); }

    const handleClickOutside = (event: MouseEvent) => {
      if (modeDropdownRef.value && !modeDropdownRef.value.contains(event.target as Node)) showModeDropdown.value = false;
      if (languageDropdownRef.value && !languageDropdownRef.value.contains(event.target as Node)) showLanguageDropdown.value = false;
    };

    onMounted(() => document.addEventListener('click', handleClickOutside, true));
    onUnmounted(() => document.removeEventListener('click', handleClickOutside, true));

    const toggleShowHeaderInFullscreen = () => uiStore.toggleShowHeaderInFullscreenMinimal();

    const navLinks = ref([
      { name: 'Settings', path: '/settings', icon: Cog8ToothIcon },
      { name: 'About', path: '/about', icon: InformationCircleIcon },
    ]);

    return {
      appSettings,
      isDarkMode,
      isFullscreenActive,
      showHeaderInFullscreen,
      toggleShowHeaderInFullscreen,
      isMobileNavOpen,
      toggleMobileNav,
      closeMobileNav,
      showModeDropdown,
      modeDropdownRef,
      showLanguageDropdown,
      languageDropdownRef,
      toggleDropdown,
      selectAppMode,
      getModeDisplay,
      modePresets,
      selectCodingLanguage,
      getLanguageDisplay,
      programmingLanguages,
      handleClearChat,
      handleToggleFullscreen,
      handleToggleTheme,
      handleLogout,
      handleShowPriorChatLog,
      navLinks,
    };
  },
});
</script>

<template>
  <header
    class="app-header"
    :class="{
      'is-fullscreen-hidden': isFullscreenActive && !showHeaderInFullscreen && !isMobileNavOpen,
    }"
  >
    <div class="header-content-wrapper" v-show="!isFullscreenActive || showHeaderInFullscreen || isMobileNavOpen">
      <div class="header-main-row">
        <div class="header-logo-section">
          <RouterLink to="/" class="logo-link" @click="closeMobileNav">
            <img src="/src/assets/logo.svg" alt="VCA Logo" class="logo-image" />
            <h1 class="app-title">
              Voice <span class="app-title-accent">Assistant</span>
            </h1>
            <span class="app-title-short">VCA</span>
          </RouterLink>
        </div>

        <nav class="desktop-nav">
          <div class="relative" ref="modeDropdownRef">
            <button @click="toggleDropdown('mode')" class="nav-button group" aria-haspopup="true" :aria-expanded="showModeDropdown">
              <component :is="getModeDisplay.icon" class="icon-sm shrink-0" :class="getModeDisplay.iconClassBase.replace('bg-', 'text-').replace('dark:bg-', 'dark:text-')" />
              <span class="nav-button-text">{{ getModeDisplay.label }}</span>
              <ChevronDownIcon class="icon-xs nav-chevron" :class="{ 'rotate-180': showModeDropdown }" />
            </button>
            <transition name="dropdown-float">
              <div v-show="showModeDropdown" class="dropdown-menu w-72 origin-top-left sm:origin-top" role="menu">
                <div class="dropdown-header"><h3 class="dropdown-title">Select Assistant Mode</h3></div>
                <div class="dropdown-content p-2 max-h-80 overflow-y-auto">
                  <button v-for="preset in modePresets" :key="preset.value" @click="selectAppMode(preset.value)"
                    class="dropdown-item w-full group" :class="{ 'active': appSettings.currentAppMode === preset.value }" role="menuitemradio" :aria-checked="appSettings.currentAppMode === preset.value">
                    <div class="mode-icon-sm-dd" :class="preset.iconClassBase"><component :is="preset.icon" class="icon-sm" /></div>
                    <div class="flex-1 text-left">
                      <div class="dropdown-item-label">{{ preset.label }}</div>
                      <div class="dropdown-item-desc">{{ preset.description }}</div>
                    </div>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <div v-if="appSettings.currentAppMode === 'coding' || appSettings.currentAppMode === 'coding_interviewer' || appSettings.currentAppMode === 'tutor' && (appSettings.preferredCodingLanguage || programmingLanguages.length > 0)" class="relative" ref="languageDropdownRef">
            <button @click="toggleDropdown('language')" class="nav-button group" aria-haspopup="true" :aria-expanded="showLanguageDropdown">
              <LanguageIcon class="icon-sm shrink-0 text-gray-500 dark:text-gray-400"/>
              <span class="nav-button-text">{{ getLanguageDisplay.label }}</span>
              <ChevronDownIcon class="icon-xs nav-chevron" :class="{ 'rotate-180': showLanguageDropdown }" />
            </button>
            <transition name="dropdown-float">
                <div v-show="showLanguageDropdown" class="dropdown-menu w-64 origin-top-left sm:origin-top" role="menu">
                    <div class="dropdown-header"><h3 class="dropdown-title">Programming Language</h3></div>
                    <div class="dropdown-content p-2 max-h-72 overflow-y-auto">
                      <button v-for="lang in programmingLanguages" :key="lang.value" @click="selectCodingLanguage(lang.value)"
                        class="dropdown-item w-full group" :class="{ 'active': appSettings.preferredCodingLanguage === lang.value }" role="menuitemradio" :aria-checked="appSettings.preferredCodingLanguage === lang.value">
                        <span class="text-base mr-2 min-w-[1.25rem] text-center">{{ lang.icon }}</span>
                        <span class="dropdown-item-label">{{ lang.label }}</span>
                      </button>
                    </div>
                </div>
            </transition>
          </div>

          <Suspense>
            <VoiceControlsDropdown />
            <template #fallback>
              <button class="nav-button opacity-50 cursor-default" disabled>
                <AdjustmentsHorizontalIcon class="icon-sm" /> <span class="nav-button-text">Voice...</span>
              </button>
            </template>
          </Suspense>

          <div class="quick-toggles">
            <div class="quick-toggle-item" title="Hint to AI to generate diagrams when relevant content is detected in assistant responses.">
              <PhotoIcon class="icon-xs text-gray-500 dark:text-gray-400 mr-1" />
              <label for="diagramToggleDesktop" class="quick-toggle-label">Diagrams</label>
              <label class="toggle-switch-xs">
                <input id="diagramToggleDesktop" type="checkbox" v-model="appSettings.generateDiagrams" class="sr-only peer" />
                <div class="toggle-switch-track"></div>
              </label>
            </div>
            <div v-if="appSettings.currentAppMode === 'coding' || appSettings.currentAppMode === 'coding_interviewer' || appSettings.currentAppMode === 'tutor'"
                 class="quick-toggle-item" title="Automatically clear the chat input after sending a message.">
              <TrashIcon class="icon-xs text-gray-500 dark:text-gray-400 mr-1" />
              <label for="autoClearToggleDesktop" class="quick-toggle-label">Auto-Clear</label>
              <label class="toggle-switch-xs">
                <input id="autoClearToggleDesktop" type="checkbox" v-model="appSettings.autoClearChat" class="sr-only peer" />
                <div class="toggle-switch-track"></div>
              </label>
            </div>
          </div>

          <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path" class="nav-button group" active-class="nav-button-active">
            <component v-if="link.icon" :is="link.icon" class="icon-sm shrink-0" />
            <span class="nav-button-text">{{ link.name }}</span>
          </RouterLink>
        </nav>

        <div class="header-actions-section">
          <div class="cost-display">
            <span class="cost-label">Cost: </span>
            <span class="cost-value">${{ sessionCost.toFixed(4) }}</span>
          </div>

          <div class="desktop-action-buttons">
            <button @click="handleShowPriorChatLog" class="action-btn" title="View Chat History Log"><ClockIcon class="icon-sm" /></button>
            <button @click="handleClearChat" class="action-btn" title="Clear Chat & Session Cost"><TrashIcon class="icon-sm" /></button>
            <button @click="handleToggleFullscreen" class="action-btn" :title="isFullscreenActive ? 'Exit Fullscreen' : 'Enter Fullscreen'" :aria-pressed="isFullscreenActive">
              <ArrowsPointingOutIcon v-if="!isFullscreenActive" class="icon-sm" /><ArrowsPointingInIcon v-else class="icon-sm" />
            </button>
            <button @click="handleToggleTheme" class="action-btn" title="Toggle Theme" :aria-pressed="isDarkMode">
              <SunIcon v-if="isDarkMode" class="icon-sm" /> <MoonIcon v-else class="icon-sm" />
            </button>
          </div>

          <button @click="toggleMobileNav" class="mobile-nav-toggle" aria-label="Toggle mobile menu" :aria-expanded="isMobileNavOpen">
            <XMarkIcon v-if="isMobileNavOpen" class="icon-base" /> <Bars3Icon v-else class="icon-base" />
          </button>
        </div>
      </div>
    </div>

    <transition name="slide-down-panel">
      <div v-show="isMobileNavOpen && (!isFullscreenActive || showHeaderInFullscreen)" class="mobile-nav-panel" role="dialog" aria-modal="true" aria-labelledby="mobile-nav-title">
        <div class="mobile-nav-content">
          <h2 id="mobile-nav-title" class="sr-only">Mobile Navigation Panel</h2>
          <section class="mobile-section">
            <h3 class="mobile-section-title">Assistant Mode</h3>
            <div class="grid grid-cols-2 gap-3">
              <button v-for="preset in modePresets" :key="preset.value" @click="selectAppMode(preset.value)"
                class="mobile-mode-card" :class="{ 'active': appSettings.currentAppMode === preset.value }">
                <div class="mode-icon-sm-dd p-2" :class="preset.iconClassBase"><component :is="preset.icon" class="icon-base" /></div>
                <span class="mobile-mode-label">{{ preset.label }}</span>
              </button>
            </div>
          </section>

          <section v-if="appSettings.currentAppMode === 'coding' || appSettings.currentAppMode === 'coding_interviewer' || appSettings.currentAppMode === 'tutor' && (appSettings.preferredCodingLanguage || programmingLanguages.length > 0)" class="mobile-section">
            <h3 class="mobile-section-title">Programming Language</h3>
            <select :value="appSettings.preferredCodingLanguage" @change="selectCodingLanguage(($event.target as HTMLSelectElement).value)" class="form-select w-full text-base">
              <option v-for="lang in programmingLanguages" :key="lang.value" :value="lang.value">
                {{ lang.icon }} {{ lang.label }}
              </option>
            </select>
          </section>

          <section class="mobile-section">
            <h3 class="mobile-section-title">Quick Toggles</h3>
            <div class="space-y-3.5">
              <div class="mobile-toggle-item">
                <PhotoIcon class="icon-base mr-2.5 text-gray-500 dark:text-gray-400"/>
                <label for="diagramToggleMobile" class="mobile-toggle-label">Generate Diagrams</label>
                <label class="toggle-switch ml-auto"><input id="diagramToggleMobile" type="checkbox" v-model="appSettings.generateDiagrams" class="sr-only peer" /><div class="toggle-switch-track"></div></label>
              </div>
              <div v-if="appSettings.currentAppMode === 'coding' || appSettings.currentAppMode === 'coding_interviewer' || appSettings.currentAppMode === 'tutor'" class="mobile-toggle-item">
                  <TrashIcon class="icon-base mr-2.5 text-gray-500 dark:text-gray-400"/>
                <label for="autoClearToggleMobile" class="mobile-toggle-label">Auto-Clear Input</label>
                <label class="toggle-switch ml-auto"><input id="autoClearToggleMobile" type="checkbox" v-model="appSettings.autoClearChat" class="sr-only peer" /><div class="toggle-switch-track"></div></label>
              </div>
            </div>
          </section>

          <nav class="mobile-nav-links">
            <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path" @click="closeMobileNav" class="mobile-nav-link">
              <component v-if="link.icon" :is="link.icon" class="icon-base mr-3 shrink-0" />
              {{ link.name }}
            </RouterLink>
          </nav>

          <div class="mobile-action-buttons">
            <button @click="handleShowPriorChatLog" class="mobile-action-btn-full"><ClockIcon class="icon-base mr-2"/> Chat History Log</button>
            <button @click="handleClearChat" class="mobile-action-btn-full"><TrashIcon class="icon-base mr-2"/> Clear Chat & Cost</button>
            <button @click="handleToggleTheme" class="mobile-action-btn-full">
              <SunIcon v-if="isDarkMode" class="icon-base mr-2" /> <MoonIcon v-else class="icon-base mr-2" /> Toggle Theme
            </button>
            <button @click="handleToggleFullscreen" class="mobile-action-btn-full">
              <ArrowsPointingOutIcon v-if="!isFullscreenActive" class="icon-base mr-2" /> <ArrowsPointingInIcon v-else class="icon-base mr-2" />
              {{ isFullscreenActive ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
            </button>
            <button @click="handleLogout" class="mobile-action-btn-full text-red-600 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-400/10">
              <ArrowRightOnRectangleIcon class="icon-base mr-2"/> Logout
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="isFullscreenActive && !showHeaderInFullscreen" class="fullscreen-interaction-buttons">
      <button @click="toggleShowHeaderInFullscreen" class="fullscreen-minimal-btn" title="Show Menu" aria-label="Show Menu">
        <Bars3Icon class="icon-base" />
      </button>
      <button @click="handleToggleFullscreen" class="fullscreen-minimal-btn" title="Exit Fullscreen" aria-label="Exit Fullscreen">
        <ArrowsPointingInIcon class="icon-base" />
      </button>
    </div>
    <div v-if="isFullscreenActive && showHeaderInFullscreen" class="fixed top-4 right-4 z-[60]">
      <button @click="toggleShowHeaderInFullscreen" class="fullscreen-minimal-btn" title="Hide Menu" aria-label="Hide Menu">
        <XMarkIcon class="icon-base" />
      </button>
    </div>
  </header>
</template>

<style lang="postcss" scoped>
/* Styles from previous iteration are largely kept. Ensure theme variables like --ease-out-cubic, --radius-md, etc. are defined in your global styles (e.g., main.css) */
.app-header {
  @apply sticky top-0 z-40 transition-all duration-300 ease-[var(--ease-out-cubic)];
  @apply bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border-b border-gray-200/80 dark:border-slate-700/60 shadow-lg;
}
.app-header.is-fullscreen-hidden {
  @apply bg-transparent backdrop-blur-none border-transparent shadow-none opacity-0 -translate-y-full pointer-events-none;
}

.header-content-wrapper { @apply max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8; }
.header-main-row { @apply flex items-center justify-between h-16 md:h-[4.5rem]; }

.header-logo-section { @apply flex items-center shrink-0; }
.logo-link { @apply flex items-center gap-2 sm:gap-2.5 hover:opacity-90 transition-opacity duration-150 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm; }
.logo-image { @apply w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full shadow-sm; }
.app-title { @apply hidden md:block text-xl sm:text-[1.375rem] font-bold text-gray-800 dark:text-gray-50 leading-tight tracking-tight; }
.app-title-accent { @apply text-primary-600 dark:text-primary-400; }
.app-title-short { @apply md:hidden text-xl font-bold text-gray-800 dark:text-gray-50; }

.desktop-nav { @apply hidden lg:flex items-center gap-x-1 xl:gap-x-1.5; }
.nav-button {
  @apply h-10 inline-flex items-center px-3.5 py-2 rounded-[var(--radius-md)] text-sm font-medium
        text-gray-600 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-slate-700/80
        focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 focus-visible:outline-none
        transition-all duration-150 ease-in-out;
}
.nav-button-text { @apply hidden xl:inline; }
.nav-button:hover .nav-button-text, .nav-button.router-link-exact-active .nav-button-text { @apply xl:inline; }
.nav-button.router-link-exact-active { @apply bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300 font-semibold; }
.nav-chevron { @apply ml-1 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-transform duration-200; }

.quick-toggles { @apply hidden xl:flex items-center gap-x-3.5 border-l border-gray-200/80 dark:border-slate-700/60 ml-2.5 pl-3.5; }
.quick-toggle-item { @apply flex items-center gap-x-1.5; }
.quick-toggle-label { @apply text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200; }

.toggle-switch-xs { @apply relative inline-flex items-center h-4 rounded-full w-7 cursor-pointer flex-shrink-0; }
.toggle-switch-xs .toggle-switch-track {
  @apply h-full w-full rounded-full bg-slate-300 dark:bg-slate-600 peer-checked:bg-primary-500 dark:peer-checked:bg-primary-500 transition-colors;
}
.toggle-switch-xs .toggle-switch-track::after {
  content: ''; @apply absolute top-[2px] left-[2px] bg-white rounded-full h-3 w-3 shadow transition-transform duration-200 ease-in-out peer-checked:translate-x-full;
}

.header-actions-section { @apply flex items-center gap-x-2 sm:gap-x-2.5; }
.cost-display {
  @apply bg-gray-100/70 dark:bg-slate-800/70 border border-gray-200/70 dark:border-slate-700/50
        px-3 py-1.5 rounded-[var(--radius-md)] text-xs sm:text-sm font-medium backdrop-blur-sm shadow-sm;
}
.cost-label { @apply text-gray-500 dark:text-gray-400 hidden sm:inline; }
.cost-value { @apply font-mono text-primary-600 dark:text-primary-400 font-bold tracking-tighter; }

.desktop-action-buttons { @apply hidden md:flex items-center gap-x-0.5 sm:gap-x-1; }
.action-btn {
  @apply p-2.5 rounded-[var(--radius-md)] text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100
        hover:bg-gray-100/80 dark:hover:bg-slate-700/70 transition-all duration-150
        focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 focus-visible:outline-none focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900;
}
.mobile-nav-toggle { @apply lg:hidden action-btn p-2.5; }

.dropdown-menu {
  @apply absolute top-full mt-2.5
        bg-white dark:bg-slate-800/95 backdrop-blur-md
        border border-gray-200/80 dark:border-slate-700/60
        rounded-[var(--radius-lg)] shadow-2xl z-50 overflow-hidden;
}
.dropdown-header { @apply px-4 py-3 border-b border-gray-200/80 dark:border-slate-700/60 flex justify-between items-center; }
.dropdown-title { @apply text-sm font-semibold text-gray-800 dark:text-gray-100; }
.dropdown-content { @apply p-1.5; }
.dropdown-item {
  @apply w-full flex items-center gap-x-3 px-3 py-2.5 text-left rounded-[var(--radius-md)]
        text-sm text-gray-700 dark:text-gray-200
        hover:bg-gray-100 dark:hover:bg-slate-700/70 focus:bg-gray-100 dark:focus:bg-slate-700
        transition-colors duration-100 cursor-pointer
        focus-visible:ring-1 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 focus-visible:outline-none;
}
.dropdown-item.active {
  @apply bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 font-semibold;
}
.dropdown-item-label { @apply font-medium text-sm; }
.dropdown-item-desc { @apply text-xs text-gray-500 dark:text-gray-400 mt-0.5; }
.mode-icon-sm-dd { @apply w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center text-base shrink-0; }

/* Mobile Navigation Panel Styles */
.mobile-nav-panel {
  @apply lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
        border-t border-gray-200/80 dark:border-slate-700/60 shadow-xl;
}
.mobile-nav-content { @apply p-4 space-y-5 max-h-[calc(100vh-4.5rem)] overflow-y-auto; }
.mobile-section { @apply pb-4 mb-4 border-b border-gray-200/80 dark:border-slate-700/60 last:border-b-0 last:pb-0 last:mb-0; }
.mobile-section-title { @apply block mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider; }
.mobile-mode-card {
  @apply flex flex-col items-center justify-center gap-1.5 p-3.5 border border-gray-200 dark:border-slate-700 rounded-[var(--radius-lg)]
        hover:bg-gray-50 dark:hover:bg-slate-800/70 transition-colors text-center shadow-sm active:scale-95 focus-visible:ring-1 focus-visible:ring-primary-500;
}
.mobile-mode-card.active {
  @apply border-primary-500/70 dark:border-primary-400/70 bg-primary-50 dark:bg-primary-600/25
        text-primary-700 dark:text-primary-300 font-semibold shadow-md;
}
.mobile-mode-label { @apply text-xs font-medium mt-1; }
.mobile-toggle-item { @apply flex items-center justify-between p-3.5 bg-gray-100/70 dark:bg-slate-800/50 rounded-[var(--radius-md)] text-sm; }
.mobile-toggle-label { @apply font-medium text-gray-700 dark:text-gray-200 cursor-pointer; }

.mobile-nav-links { @apply space-y-1.5; }
.mobile-nav-link {
  @apply flex items-center px-3.5 py-3 text-base font-medium text-gray-700 dark:text-gray-200
        hover:bg-gray-100 dark:hover:bg-slate-700/70 rounded-[var(--radius-md)] transition-colors;
}
.mobile-nav-link.router-link-exact-active {
  @apply bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300;
}
.mobile-action-buttons { @apply pt-3 space-y-2.5; }
.mobile-action-btn-full {
  @apply flex items-center justify-center w-full px-4 py-3 text-base font-medium rounded-[var(--radius-md)]
        border border-gray-200/80 dark:border-slate-700/60
        bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200
        hover:bg-gray-50 dark:hover:bg-slate-700/80 transition-colors shadow-sm active:scale-95 focus-visible:ring-1 focus-visible:ring-primary-500;
}

.fullscreen-interaction-buttons { @apply fixed top-4 right-4 z-50 flex items-center gap-3; }
.fullscreen-minimal-btn {
  @apply p-3 bg-black/50 dark:bg-white/25 backdrop-blur-lg rounded-full text-white
        hover:bg-black/60 dark:hover:bg-white/35 transition-all duration-150 shadow-xl
        focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus:outline-none;
}

.icon-xs { @apply w-3.5 h-3.5; }
.icon-sm { @apply w-4 h-4; }
.icon-base { @apply w-5 h-5; }

.toggle-switch {
  @apply relative inline-flex items-center h-6 w-11 cursor-pointer flex-shrink-0;
}
.toggle-switch-track {
  @apply w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-200 ease-in-out
        peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-primary-500 dark:peer-focus:ring-offset-slate-900
        peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500;
}
.toggle-switch-track::after {
  @apply content-[''] absolute top-0.5 left-[2px] bg-white border-gray-300 dark:border-gray-500 border rounded-full h-5 w-5
        shadow-sm transition-all duration-200 ease-in-out
        peer-checked:translate-x-full peer-checked:border-white;
}

.form-select {
  @apply w-full block px-4 py-3 rounded-[var(--radius-md)] text-base
        bg-white dark:bg-slate-700/80 border border-gray-300 dark:border-slate-600
        text-gray-900 dark:text-gray-50
        focus:outline-none focus:ring-2 focus:border-transparent focus:ring-primary-500 dark:focus:ring-primary-400
        transition-all duration-150 ease-in-out appearance-none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 1rem center;
  background-repeat: no-repeat;
  background-size: 1.1em 1.1em;
  padding-right: 2.75rem;
}
.dark .form-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}

.dropdown-float-enter-active, .dropdown-float-leave-active { transition: opacity 0.18s var(--ease-out-quad), transform 0.18s var(--ease-out-quad); }
.dropdown-float-enter-from, .dropdown-float-leave-to { opacity: 0; transform: translateY(-10px) scale(0.97); }
.slide-down-panel-enter-active, .slide-down-panel-leave-active { transition: transform 0.3s var(--ease-out-cubic), opacity 0.25s ease-out; }
.slide-down-panel-enter-from, .slide-down-panel-leave-to { transform: translateY(-100%); opacity: 0; }
</style>