// File: frontend/src/components/Header.vue
/**
 * @file Header.vue
 * @description Global application header, redesigned for a "Holographic Analog-esque" theme.
 * Provides navigation, mode/language selection, quick access to voice/other settings,
 * cost display, and UI toggles, featuring holographic visuals and tactile analog-style buttons.
 * @version 4.0.0 - Holographic Analog-esque redesign.
 * @author AI Architect
 */// File: frontend/src/components/Header.vue
/**
 * @file Header.vue
 * @description Global application header, redesigned for a "Holographic Analog-esque" theme.
 * Provides navigation, mode/language selection, quick access to voice/other settings,
 * cost display, and UI toggles, featuring holographic visuals and tactile analog-style buttons.
 * @version 4.0.1 - Added missing icon component registrations.
 * @author AI Architect
 */
<script lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  defineComponent,
  defineAsyncComponent,
  type Component as VueComponent,
} from 'vue';
import { RouterLink } from 'vue-router';
import { voiceSettingsManager, type AudioInputMode } from '@/services/voice.settings.service';
import { useUiStore } from '@/store/ui.store';
import { useAgentStore } from '@/store/agent.store';
import { agentService, type IAgentDefinition, type AgentId } from '@/services/agent.service';
import { useChatStore } from '@/store/chat.store';

const VoiceControlsDropdown = defineAsyncComponent(() => import('./header/VoiceControlsDropdown.vue'));

import {
  ChevronDownIcon, Bars3Icon, XMarkIcon, Cog8ToothIcon,
  SquaresPlusIcon, PhotoIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon, SunIcon, MoonIcon,
  InformationCircleIcon, ArrowRightOnRectangleIcon, DocumentTextIcon,
  LanguageIcon, AdjustmentsHorizontalIcon, ClockIcon, PencilSquareIcon,
  TrashIcon as TrashIconOutline, CpuChipIcon,
  SpeakerWaveIcon, MicrophoneIcon, PauseCircleIcon, PlayCircleIcon
} from '@heroicons/vue/24/outline';

// Additional interfaces (ModePreset, LanguageOption) remain the same as in the user-provided file.
interface ModePreset {
  label: string;
  value: AgentId;
  description: string;
  icon: VueComponent;
  iconClass: string;
}
interface LanguageOption {
  label: string;
  value: string;
  icon?: string;
}


export default defineComponent({
  name: 'AppHeaderHolographic',
  components: {
    RouterLink,
    VoiceControlsDropdown,
    ChevronDownIcon, Bars3Icon, XMarkIcon, Cog8ToothIcon,
    ArrowsPointingOutIcon, ArrowsPointingInIcon, SunIcon, MoonIcon, // Ensured these are registered
    InformationCircleIcon, ArrowRightOnRectangleIcon, DocumentTextIcon,
    LanguageIcon, SquaresPlusIcon, PhotoIcon, AdjustmentsHorizontalIcon,
    ClockIcon, PencilSquareIcon, TrashIconOutline, CpuChipIcon, SpeakerWaveIcon,
    MicrophoneIcon, PauseCircleIcon, PlayCircleIcon
  },
  props: {
    sessionCost: { type: Number, default: 0 },
    isUserListening: { type: Boolean, default: false },
    isAssistantSpeaking: { type: Boolean, default: false },
  },
  emits: [
    'toggle-theme', 'toggle-fullscreen', 'clear-chat-and-session',
    'logout', 'show-prior-chat-log'
  ],
  setup(props, { emit }) {
    const uiStore = useUiStore();
    const agentStore = useAgentStore();
    const chatStore = useChatStore();
    const appSettings = voiceSettingsManager.settings;

    const showModeDropdown = ref(false);
    const modeDropdownRef = ref<HTMLElement | null>(null);
    const showLanguageDropdown = ref(false);
    const languageDropdownRef = ref<HTMLElement | null>(null);
    const isMobileNavOpen = ref(false);

    const isDarkMode = computed(() => uiStore.isDarkMode);
    const isFullscreenActive = computed(() => uiStore.isFullscreen);
    const showHeaderInFullscreen = computed(() => uiStore.showHeaderInFullscreenMinimal);

    const modePresets = computed<ModePreset[]>(() =>
      agentService.getAllAgents().map(agent => ({
        label: agent.label, value: agent.id,
        description: agent.description.substring(0, 70) + (agent.description.length > 70 ? '...' : ''),
        icon: agent.icon, iconClass: agent.iconClass,
      }))
    );

    const activeAgentDisplay = computed(() => {
      const currentAgent = agentStore.activeAgent || agentService.getDefaultAgent();
      return { label: currentAgent.label, icon: currentAgent.icon, iconClass: currentAgent.iconClass };
    });

    const programmingLanguages: LanguageOption[] = [
      { label: 'Python', value: 'python', icon: '🐍' }, { label: 'JavaScript', value: 'javascript', icon: '⚡' },
      { label: 'TypeScript', value: 'typescript', icon: '🔷' }, { label: 'Java', value: 'java', icon: '☕️' },
      { label: 'C++', value: 'cpp', icon: '🅲+' }, { label: 'Go', value: 'go', icon: '🐹' },
      { label: 'Rust', value: 'rust', icon: '🦀' }, { label: 'PHP', value: 'php', icon: '🐘' },
    ];

    const currentLanguageDisplay = computed(() =>
      programmingLanguages.find(l => l.value === appSettings.preferredCodingLanguage) ||
      programmingLanguages.find(l => l.value === appSettings.defaultLanguage) ||
      programmingLanguages[0]
    );

    const toggleDropdown = (type: 'mode' | 'language') => {
      if (type === 'mode') {
        showModeDropdown.value = !showModeDropdown.value;
        if (showModeDropdown.value) showLanguageDropdown.value = false;
      } else if (type === 'language') {
        showLanguageDropdown.value = !showLanguageDropdown.value;
        if (showLanguageDropdown.value) showModeDropdown.value = false;
      }
    };

    const selectAppMode = (modeValue: AgentId) => {
      agentStore.setActiveAgent(modeValue);
      showModeDropdown.value = false; closeMobileNav();
    };

    const selectCodingLanguage = (languageValue: string) => {
      voiceSettingsManager.updateSetting('preferredCodingLanguage', languageValue);
      showLanguageDropdown.value = false; closeMobileNav();
    };

    const toggleMobileNav = () => isMobileNavOpen.value = !isMobileNavOpen.value;
    const closeMobileNav = () => { isMobileNavOpen.value = false; };

    const handleClearChatAndSession = () => { emit('clear-chat-and-session'); closeMobileNav(); };
    const handleToggleFullscreenEmit = () => { emit('toggle-fullscreen'); closeMobileNav(); }; // Renamed to avoid conflict
    const handleToggleTheme = () => { uiStore.toggleTheme(); }; // Directly call store action
    const handleLogout = () => { emit('logout'); closeMobileNav(); };
    const handleShowPriorChatLog = () => { emit('show-prior-chat-log'); closeMobileNav(); };

    const handleClickOutside = (event: MouseEvent) => {
      if (modeDropdownRef.value && !modeDropdownRef.value.contains(event.target as Node)) showModeDropdown.value = false;
      if (languageDropdownRef.value && !languageDropdownRef.value.contains(event.target as Node)) showLanguageDropdown.value = false;
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside, true);
      if(!uiStore.theme) uiStore.initializeTheme();
    });

    onUnmounted(() => document.removeEventListener('click', handleClickOutside, true));

    const toggleShowHeaderInFullscreen = () => uiStore.toggleShowHeaderInFullscreenMinimal();
    
    const navLinks = ref([
      { name: 'Settings', path: '/settings', icon: Cog8ToothIcon },
    ]);
    
    const isAiActive = computed(() => props.isAssistantSpeaking || chatStore.isMainContentStreaming);
    const isUserActive = computed(() => props.isUserListening);

    return {
      appSettings, isDarkMode, isFullscreenActive, showHeaderInFullscreen, toggleShowHeaderInFullscreen,
      isMobileNavOpen, toggleMobileNav, closeMobileNav, showModeDropdown, modeDropdownRef,
      showLanguageDropdown, languageDropdownRef, toggleDropdown, selectAppMode, activeAgentDisplay,
      modePresets, selectCodingLanguage, currentLanguageDisplay, programmingLanguages,
      handleClearChatAndSession, 
      handleToggleFullscreen: handleToggleFullscreenEmit, // Use renamed emitter
      handleToggleTheme, 
      handleLogout, handleShowPriorChatLog,
      navLinks, uiStore, agentStore,
      isAiActive, isUserActive,
      // Ensure icons used in the template are returned if not globally registered or auto-imported by <script setup>
      // For Options API, they are handled by the `components` option.
    };
  },
});
</script>

<template>
  <header
    class="app-header header-glass-holographic"
    :class="{
      'is-fullscreen-hidden': isFullscreenActive && !showHeaderInFullscreen && !isMobileNavOpen,
      'ai-active-glow-holographic': isAiActive,
      'user-active-glow-holographic': isUserActive && !isAiActive,
    }"
  >
    <div class="header-content-wrapper">
      <div class="header-main-row">
        <div class="header-logo-section">
          <RouterLink to="/app" class="logo-link-holographic" @click="closeMobileNav" aria-label="Go to Dashboard">
            <img src="@/assets/logo.svg" alt="VCA Logo" class="logo-image-holographic" />
            <h1 class="app-title-full-holographic">
              VOICE CHAT <span class="app-title-accent-holographic text-glow-accent">ASSISTANT</span>
            </h1>
            <span class="app-title-short-holographic">VCA</span>
          </RouterLink>
          <div class="activity-indicator-container">
              <div v-if="isAiActive" class="activity-indicator ai-speaking-indicator-holographic animate-speaking-indicator-anim" title="Assistant is processing/speaking">
                <SpeakerWaveIcon class="icon-xs text-accent-focus"/>
              </div>
              <div v-else-if="isUserActive" class="activity-indicator user-listening-indicator-holographic animate-listening-indicator-anim animation-delay-300" title="Listening to you">
                <MicrophoneIcon class="icon-xs text-holo-green"/>
              </div>
            </div>
        </div>

        <nav class="desktop-nav-holographic" aria-label="Main desktop navigation">
          <div class="relative" ref="modeDropdownRef">
            <button @click="toggleDropdown('mode')" class="nav-button-analog group" id="mode-button" aria-haspopup="true" :aria-expanded="showModeDropdown.toString()">
              <component :is="activeAgentDisplay.icon || CpuChipIcon" class="icon-sm shrink-0" :class="activeAgentDisplay.iconClass || 'text-primary-focus'" />
              <span class="nav-button-text">{{ activeAgentDisplay.label }}</span>
              <ChevronDownIcon class="icon-xs nav-chevron-analog" :class="{ 'rotate-180': showModeDropdown }" />
            </button>
            <transition name="dropdown-float">
              <div v-show="showModeDropdown" class="dropdown-menu-holographic w-80 origin-top-left sm:origin-top-right" role="menu" aria-orientation="vertical" aria-labelledby="mode-button">
                <div class="dropdown-header-holographic"><h3 class="dropdown-title">Select Assistant Mode</h3></div>
                <div class="dropdown-content-holographic p-2 max-h-96 overflow-y-auto custom-scrollbar-thin">
                  <button v-for="preset in modePresets" :key="preset.value" @click="selectAppMode(preset.value)"
                    class="dropdown-item-holographic w-full group" :class="{ 'active': agentStore.activeAgentId === preset.value }" role="menuitemradio" :aria-checked="agentStore.activeAgentId === preset.value">
                    <div class="mode-icon-dd-holographic" :class="preset.iconClass || 'bg-neutral-bg-elevated text-neutral-text-muted'"><component :is="preset.icon" class="icon-base" /></div>
                    <div class="flex-1 text-left">
                      <div class="dropdown-item-label">{{ preset.label }}</div>
                      <div class="dropdown-item-desc">{{ preset.description }}</div>
                    </div>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <div v-if="agentStore.activeAgent?.showLanguageSelector" class="relative" ref="languageDropdownRef">
              <button @click="toggleDropdown('language')" class="nav-button-analog group" id="language-button" aria-haspopup="true" :aria-expanded="showLanguageDropdown.toString()">
              <LanguageIcon class="icon-sm shrink-0 text-primary-focus"/>
              <span class="nav-button-text">{{ currentLanguageDisplay.label }}</span>
              <ChevronDownIcon class="icon-xs nav-chevron-analog" :class="{ 'rotate-180': showLanguageDropdown }" />
            </button>
            <transition name="dropdown-float">
              <div v-show="showLanguageDropdown" class="dropdown-menu-holographic w-64 origin-top-left sm:origin-top-right" role="menu" aria-orientation="vertical" aria-labelledby="language-button">
                  <div class="dropdown-header-holographic"><h3 class="dropdown-title">Programming Language</h3></div>
                  <div class="dropdown-content-holographic p-2 max-h-72 overflow-y-auto custom-scrollbar-thin">
                    <button v-for="lang in programmingLanguages" :key="lang.value" @click="selectCodingLanguage(lang.value)"
                      class="dropdown-item-holographic w-full group" :class="{ 'active': appSettings.preferredCodingLanguage === lang.value }" role="menuitemradio" :aria-checked="appSettings.preferredCodingLanguage === lang.value">
                      <span class="text-lg mr-2.5 min-w-[1.5rem] text-center text-glow-subtle" aria-hidden="true">{{ lang.icon }}</span>
                      <span class="dropdown-item-label">{{ lang.label }}</span>
                    </button>
                  </div>
              </div>
            </transition>
          </div>

          <Suspense>
            <VoiceControlsDropdown button-class="nav-button-analog" text-class="nav-button-text" icon-class="icon-sm text-primary-focus" chevron-class="nav-chevron-analog" />
            <template #fallback>
              <button class="nav-button-analog opacity-50 cursor-default" disabled>
                <AdjustmentsHorizontalIcon class="icon-sm text-primary-focus" /> <span class="nav-button-text">Voice...</span>
              </button>
            </template>
          </Suspense>
          
          <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path" class="nav-button-analog group" active-class="nav-button-analog-active">
            <component v-if="link.icon" :is="link.icon" class="icon-sm shrink-0 text-primary-focus" />
            <span class="nav-button-text">{{ link.name }}</span>
          </RouterLink>
        </nav>

        <div class="header-actions-section">
          <div class="quick-toggles-group-analog">
              <div class="quick-toggle-item-analog" title="Toggle Diagram Generation">
                <label class="toggle-switch-analog">
                  <input id="diagramToggleDesktop" type="checkbox" v-model="appSettings.generateDiagrams" class="sr-only peer" />
                  <div class="toggle-switch-track-analog"></div>
                  <div class="toggle-switch-knob-analog"></div>
                </label>
                <label for="diagramToggleDesktop" class="quick-toggle-label-icon-analog"><PhotoIcon class="icon-sm" /></label>
              </div>
              <div v-if="agentStore.activeAgent?.supportsAutoClear"
                    class="quick-toggle-item-analog" title="Toggle Auto-Clear Input">
                <label class="toggle-switch-analog">
                  <input id="autoClearToggleDesktop" type="checkbox" v-model="appSettings.autoClearChat" class="sr-only peer" />
                  <div class="toggle-switch-track-analog"></div>
                  <div class="toggle-switch-knob-analog"></div>
                </label>
                <label for="autoClearToggleDesktop" class="quick-toggle-label-icon-analog"><TrashIconOutline class="icon-sm" /></label>
              </div>
          </div>

          <div class="cost-display-analog" title="Current session estimated cost">
            <span class="cost-label hidden sm:inline">Cost: </span>
            <span class="cost-value-analog">${{ sessionCost.toFixed(4) }}</span>
          </div>

          <div class="desktop-action-buttons">
            <button @click="handleShowPriorChatLog" class="action-btn-analog" title="View Chat History Log"><ClockIcon class="icon-base" /></button>
            <button @click="handleClearChatAndSession" class="action-btn-analog" title="Clear Chat & Session"><TrashIconOutline class="icon-base" /></button>
            <button @click="handleToggleFullscreen" class="action-btn-analog" :title="isFullscreenActive ? 'Exit Fullscreen' : 'Enter Fullscreen'">
              <component :is="isFullscreenActive ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="icon-base" />
            </button>
            <button @click="handleToggleTheme" class="action-btn-analog" title="Toggle Theme">
              <component :is="isDarkMode ? SunIcon : MoonIcon" class="icon-base" />
            </button>
              <button @click="handleLogout" class="action-btn-analog logout-btn-analog" title="Logout">
              <ArrowRightOnRectangleIcon class="icon-base"/>
            </button>
          </div>

          <button @click="toggleMobileNav" class="mobile-nav-toggle-analog btn btn-icon btn-ghost lg:hidden" aria-label="Toggle mobile menu" :aria-expanded="isMobileNavOpen.toString()">
            <component :is="isMobileNavOpen ? XMarkIcon : Bars3Icon" class="icon-base" />
          </button>
        </div>
      </div>
    </div>

    <transition name="slide-down-panel">
      <div v-show="isMobileNavOpen && (!uiStore.isFullscreen || uiStore.showHeaderInFullscreenMinimal)" class="mobile-nav-panel-holographic" role="dialog" aria-modal="true">
        <div class="mobile-nav-content custom-scrollbar-thin">
          <section class="mobile-section">
            <h3 class="mobile-section-title-holographic">Assistant Mode</h3>
            <div class="grid grid-cols-2 gap-3">
              <button v-for="preset in modePresets" :key="preset.value" @click="selectAppMode(preset.value)"
                class="mobile-mode-card-analog" :class="{ 'active': agentStore.activeAgentId === preset.value }">
                <div class="mode-icon-dd-holographic p-2.5" :class="preset.iconClass || 'bg-neutral-bg-elevated text-neutral-text-muted'"><component :is="preset.icon" class="icon-xl" /></div>
                <span class="mobile-mode-label">{{ preset.label }}</span>
              </button>
            </div>
          </section>

          <section v-if="agentStore.activeAgent?.showLanguageSelector" class="mobile-section">
            <h3 class="mobile-section-title-holographic">Programming Language</h3>
            <select :value="appSettings.preferredCodingLanguage" @change="selectCodingLanguage(($event.target as HTMLSelectElement).value)" class="form-select-analog w-full text-base">
              <option v-for="lang in programmingLanguages" :key="lang.value" :value="lang.value">
                {{ lang.icon }} {{ lang.label }}
              </option>
            </select>
          </section>
          
          <section class="mobile-section">
              <h3 class="mobile-section-title-holographic">Quick Toggles</h3>
              <div class="space-y-3.5">
                <div class="mobile-toggle-item-analog">
                    <PhotoIcon class="icon-base mr-2.5 text-neutral-text-muted"/>
                    <label for="diagramToggleMobile" class="mobile-toggle-label">Generate Diagrams</label>
                    <label class="toggle-switch-analog ml-auto">
                      <input id="diagramToggleMobile" type="checkbox" v-model="appSettings.generateDiagrams" class="sr-only peer" />
                      <div class="toggle-switch-track-analog"></div><div class="toggle-switch-knob-analog"></div>
                    </label>
                </div>
                <div v-if="agentStore.activeAgent?.supportsAutoClear" class="mobile-toggle-item-analog">
                    <TrashIconOutline class="icon-base mr-2.5 text-neutral-text-muted"/>
                    <label for="autoClearToggleMobile" class="mobile-toggle-label">Auto-Clear Input</label>
                    <label class="toggle-switch-analog ml-auto">
                      <input id="autoClearToggleMobile" type="checkbox" v-model="appSettings.autoClearChat" class="sr-only peer" />
                      <div class="toggle-switch-track-analog"></div><div class="toggle-switch-knob-analog"></div>
                    </label>
                </div>
              </div>
            </section>

          <nav class="mobile-nav-links">
            <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path" @click="closeMobileNav" class="mobile-nav-link-analog" active-class="mobile-nav-link-analog-active">
              <component v-if="link.icon" :is="link.icon" class="icon-base mr-3 shrink-0" />
              {{ link.name }}
            </RouterLink>
          </nav>

          <div class="mobile-action-buttons">
            <button @click="handleShowPriorChatLog" class="btn-analog mobile-action-btn-full"><ClockIcon class="icon-base mr-2"/> Chat History</button>
            <button @click="handleClearChatAndSession" class="btn-analog mobile-action-btn-full"><TrashIconOutline class="icon-base mr-2"/> Clear Chat & Cost</button>
            <button @click="handleToggleTheme" class="btn-analog mobile-action-btn-full">
              <component :is="isDarkMode ? SunIcon : MoonIcon" class="icon-base mr-2" /> Toggle Theme
            </button>
            <button @click="handleToggleFullscreen" class="btn-analog mobile-action-btn-full">
              <component :is="isFullscreenActive ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="icon-base mr-2" />
              {{ isFullscreenActive ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
            </button>
            <button @click="handleLogout" class="btn-analog btn-analog-danger mobile-action-btn-full"> <ArrowRightOnRectangleIcon class="icon-base mr-2"/> Logout
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="isFullscreenActive && !showHeaderInFullscreen" class="fullscreen-interaction-buttons">
      <button @click="toggleShowHeaderInFullscreen" class="fullscreen-minimal-btn-holographic" title="Show Menu"><Bars3Icon class="icon-base" /></button>
      <button @click="handleToggleFullscreen" class="fullscreen-minimal-btn-holographic" title="Exit Fullscreen"><ArrowsPointingInIcon class="icon-base" /></button>
    </div>
    <div v-if="isFullscreenActive && showHeaderInFullscreen" class="fixed top-4 right-4 z-[60]">
      <button @click="toggleShowHeaderInFullscreen" class="fullscreen-minimal-btn-holographic" title="Hide Menu"><XMarkIcon class="icon-base" /></button>
    </div>
  </header>
</template>

<style lang="postcss" scoped>
/* Holographic, Analog-esque Header Styles - Version 4.0.2 (Fix text and shadow classes) */

.app-header { /* Base class, already in original CSS */
  @apply transition-all duration-[var(--duration-smooth)] ease-[var(--ease-out-quad)];
  /* Leverage header-glass from main.css for base glassmorphism, then enhance */
}

.header-glass-holographic {
  /* Using header-glass from main.css as a base, enhancing it here */
  @apply border-b;
  background: hsl(var(--bg-base-hsl) / 0.65); /* Slightly less opaque for more "holo" */
  backdrop-filter: blur(24px) saturate(180%); /* More blur and saturation */
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom-color: hsl(var(--primary-focus-hsl) / 0.25);
  box-shadow: 0 2px 20px hsl(var(--primary-dark-hsl)/0.15), inset 0 -1px 0 hsl(var(--primary-focus-hsl)/0.1);
}
.dark .header-glass-holographic {
  background: hsl(var(--bg-base-hsl-dark) / 0.7);
  border-bottom-color: hsl(var(--accent-focus-hsl) / 0.3);
  box-shadow: 0 2px 25px hsl(var(--accent-dark-hsl)/0.2), inset 0 -1px 0 hsl(var(--accent-focus-hsl)/0.15);
}


.app-header.ai-active-glow-holographic { /* Enhanced glow */
  box-shadow: 0 0 35px 8px hsl(var(--accent-focus-hsl)/0.5), inset 0 0 20px hsl(var(--accent-focus-hsl)/0.2), 0 2px 20px hsl(var(--primary-dark-hsl)/0.1);
  border-bottom-color: hsl(var(--accent-focus-hsl)/0.6);
}
.app-header.user-active-glow-holographic { /* Enhanced glow */
  box-shadow: 0 0 35px 8px hsl(var(--holo-green-hsl)/0.5), inset 0 0 20px hsl(var(--holo-green-hsl)/0.2), 0 2px 20px hsl(var(--primary-dark-hsl)/0.1);
  border-bottom-color: hsl(var(--holo-green-hsl)/0.6);
}

.app-header.is-fullscreen-hidden {
  @apply opacity-0 -translate-y-full pointer-events-none;
}

.header-content-wrapper { @apply max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6; }
.header-main-row { @apply flex items-center justify-between h-[var(--header-height)]; }

/* Logo and Title - Holographic styling */
.header-logo-section { @apply flex items-center shrink-0 gap-3; }
.logo-link-holographic {
  @apply flex items-center gap-2 sm:gap-2.5 transition-opacity duration-[var(--duration-quick)] focus-visible:ring-inset rounded-sm;
}
.logo-link-holographic:hover .logo-image-holographic {
  transform: rotate(10deg) scale(1.2);
  filter: brightness(1.5) drop-shadow(0 0 15px hsl(var(--primary-focus-hsl)/0.7));
}
.logo-link-holographic:hover .app-title-full-holographic,
.logo-link-holographic:hover .app-title-short-holographic {
  @apply text-glow-primary opacity-100;
  color: hsl(var(--primary-light-hsl));
}
.dark .logo-link-holographic:hover .app-title-full-holographic,
.dark .logo-link-holographic:hover .app-title-short-holographic {
  color: hsl(var(--primary-focus-hsl));
}

.logo-image-holographic {
  @apply w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-md transition-all duration-[var(--duration-smooth)] ease-[var(--ease-elastic)];
  filter: drop-shadow(0 0 10px hsl(var(--primary-focus-hsl)/0.6));
}

.app-title-full-holographic {
  @apply hidden md:block text-xl sm:text-2xl font-bold tracking-wider uppercase opacity-90;
  font-family: var(--font-display);
  color: hsl(var(--text-primary-hsl));
  text-shadow: 0 0 6px hsl(var(--primary-color-hsl)/0.3);
}
.app-title-accent-holographic { /* Uses text-glow-accent utility */
  color: hsl(var(--accent-focus-hsl));
  opacity: 1;
}
.app-title-short-holographic {
  @apply md:hidden text-xl font-bold uppercase opacity-90;
  font-family: var(--font-display);
  color: hsl(var(--text-primary-hsl));
  text-shadow: 0 0 6px hsl(var(--primary-color-hsl)/0.3);
}

/* Activity Indicators - Holographic pulse */
.activity-indicator-container { @apply w-7 h-7 relative ml-1.5; }
.activity-indicator { @apply absolute inset-0 rounded-full flex items-center justify-center; }
.ai-speaking-indicator-holographic {
  background-color: hsl(var(--accent-focus-hsl)/0.15);
  box-shadow: 0 0 10px hsl(var(--accent-focus-hsl)/0.5), inset 0 0 5px hsl(var(--accent-focus-hsl)/0.2);
}
.user-listening-indicator-holographic {
  background-color: hsl(var(--holo-green-hsl)/0.15);
  box-shadow: 0 0 10px hsl(var(--holo-green-hsl)/0.5), inset 0 0 5px hsl(var(--holo-green-hsl)/0.2);
}

/* Desktop Navigation - Analog Buttons */
.desktop-nav-holographic { @apply hidden lg:flex items-center gap-x-1 xl:gap-x-1.5; }

.nav-button-analog {
  @apply h-11 inline-flex items-center px-3.5 xl:px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium
         transition-all duration-[var(--duration-quick)] ease-[var(--ease-out-quad)] relative
         border border-neutral-border/50 dark:border-neutral-border-dark/70
         bg-neutral-bg-surface/70 dark:bg-neutral-bg-elevated/70
         text-neutral-text-secondary dark:text-neutral-text-secondary
         shadow-analog-outset hover:shadow-interactive-hover active:shadow-analog-inset
         hover:bg-neutral-bg-elevated/80 dark:hover:bg-neutral-bg-surface/80
         hover:text-neutral-text dark:hover:text-neutral-text
         hover:border-neutral-border dark:hover:border-neutral-border-light/70
         focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-bg;
}
.nav-button-analog .nav-button-text { @apply hidden xl:inline ml-1.5 tracking-wide; }
.nav-button-analog .nav-chevron-analog {
  @apply ml-1.5 text-neutral-text-muted group-hover:text-neutral-text transition-transform duration-[var(--duration-quick)];
}
.nav-button-analog.nav-button-analog-active, /* Custom active class */
.nav-button-analog.router-link-active, /* Default Vue Router active class */
.nav-button-analog.router-link-exact-active { /* Default Vue Router exact active class */
  @apply text-primary-focus dark:text-primary-light bg-primary-500/10 dark:bg-primary-dark/20
         border-primary-focus/50 dark:border-primary-focus/40 font-semibold shadow-analog-inset;
}
.nav-button-analog:active { @apply scale-[0.97] brightness-95; }

/* Quick Toggles - Analog Switches */
.quick-toggles-group-analog { @apply hidden sm:flex items-center gap-x-3.5 border-l border-neutral-border/40 dark:border-neutral-border-dark/50 ml-3 pl-3.5; }
.quick-toggle-item-analog { @apply flex items-center gap-x-2; }
.quick-toggle-label-icon-analog {
  @apply text-neutral-text-muted hover:text-primary-focus dark:hover:text-primary-light cursor-pointer transition-colors duration-[var(--duration-quick)];
}

.toggle-switch-analog { /* Base defined in main.css, specific styling here */
  @apply relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer
         transition-colors duration-[var(--duration-smooth)] ease-in-out
         focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-offset-transparent focus-within:ring-accent-focus;
}
.toggle-switch-track-analog {
  @apply h-full w-full rounded-full bg-neutral-border/70 dark:bg-neutral-border-dark/50
         peer-checked:bg-primary-500 dark:peer-checked:bg-primary-focus
         transition-colors shadow-analog-inset;
}
.toggle-switch-knob-analog {
  @apply absolute top-[3px] left-[3px] bg-neutral-bg-surface dark:bg-neutral-300 border border-neutral-border dark:border-neutral-border-light/30
         rounded-full h-[1.125rem] w-[1.125rem] shadow-md
         transition-transform duration-[var(--duration-smooth)] ease-[var(--ease-elastic)]
         peer-checked:translate-x-[calc(100%-0.2rem)] peer-checked:border-transparent dark:peer-checked:bg-white;
  background-image: linear-gradient(145deg, hsl(var(--neutral-hue-light) 20% 98%), hsl(var(--neutral-hue-light) 20% 88%));
}
.dark .toggle-switch-knob-analog {
  background-image: linear-gradient(145deg, hsl(var(--neutral-hue-dark) 10% 40%), hsl(var(--neutral-hue-dark) 10% 30%));
}


/* Header Actions - Analog Theming */
.header-actions-section { @apply flex items-center gap-x-1 sm:gap-x-1.5; }

.cost-display-analog { /* Analog VFD/LCD style */
  @apply bg-black/80 dark:bg-black/60
         border border-primary-900/40 dark:border-neutral-border-dark/40
         px-3.5 py-2 rounded-[var(--radius-sm)] text-xs sm:text-sm shadow-analog-inset backdrop-blur-sm;
  min-width: 90px; text-align: right;
}
.cost-display-analog .cost-label { color: hsl(var(--holo-cyan-hsl)/0.7); @apply font-mono text-xs; }
.cost-display-analog .cost-value-analog {
  @apply font-mono text-holo-cyan font-bold tracking-wider;
  text-shadow: 0 0 3px hsl(var(--holo-cyan-hsl)/0.8), 0 0 6px hsl(var(--holo-cyan-hsl)/0.5);
}

.desktop-action-buttons { @apply hidden md:flex items-center gap-x-0.5; }
.action-btn-analog { /* Using .btn structure from main.css */
  @apply btn btn-icon btn-ghost p-2.5 rounded-[var(--radius-md)] text-neutral-text-secondary hover:text-primary-focus
        border border-transparent hover:border-primary-focus/20 hover:bg-primary-500/5
        dark:hover:text-primary-light dark:hover:border-primary-light/20 dark:hover:bg-primary-light/5
        shadow-none hover:shadow-interactive active:shadow-analog-inset active:scale-[0.95];
}
.action-btn-analog.logout-btn-analog {
  @apply hover:text-error-dark dark:hover:text-error-light hover:border-error-dark/30 dark:hover:border-error-light/30 hover:bg-error-dark/5 dark:hover:bg-error-light/5;
}
.action-btn-analog .icon-base { @apply opacity-80 group-hover:opacity-100; }


.mobile-nav-toggle-analog { /* Uses btn, btn-icon, btn-ghost. Theming applied via those classes */
  @apply text-neutral-text-secondary hover:text-primary-focus;
}


/* Dropdown Menu - Holographic Styling */
.dropdown-menu-holographic {
  @apply absolute top-full mt-2.5 z-50 glass-pane rounded-[var(--radius-lg)] shadow-holo-lg border-primary-focus/20 dark:border-accent-focus/30;
  min-width: 280px;
}
.dropdown-header-holographic { @apply px-4 py-3 border-b border-primary-focus/10 dark:border-accent-focus/15; }
.dropdown-title { @apply text-xs font-bold text-neutral-text-muted uppercase tracking-wider; }
.dropdown-content-holographic { /* For scrollable area within dropdown */ }

.dropdown-item-holographic { /* Holographic list item */
  @apply w-full flex items-center gap-x-3 px-3 py-2.5 text-left rounded-[var(--radius-md)]
         text-neutral-text-secondary hover:text-primary-focus dark:hover:text-accent-light
         hover:bg-primary-500/10 dark:hover:bg-accent-dark/15 focus-visible:bg-primary-500/15
         transition-all duration-[var(--duration-quick)] cursor-pointer;
}
.dropdown-item-holographic.active {
  @apply bg-primary-500/20 text-primary-focus dark:bg-accent-dark/25 dark:text-accent-light font-semibold
         shadow-inner shadow-primary-dark/10 dark:shadow-accent-dark/15;
}
.mode-icon-dd-holographic {
  @apply w-10 h-10 p-2 rounded-[var(--radius-md)] flex items-center justify-center text-lg shrink-0 shadow-sm
         bg-primary-500/5 dark:bg-accent-500/10 border border-primary-500/10 dark:border-accent-500/15;
}
.dropdown-item-label { @apply font-medium text-sm; }
.dropdown-item-desc { @apply text-xs text-neutral-text-muted mt-0.5 group-hover:text-neutral-text-secondary dark:group-hover:text-neutral-text-muted; }


/* Mobile Navigation - Holographic Panel, Analog Controls */
.mobile-nav-panel-holographic {
  @apply lg:hidden absolute top-full left-0 right-0 shadow-2xl glass-pane;
  border-top: 1px solid hsl(var(--primary-focus-hsl)/0.3);
  border-bottom-left-radius: 0; border-bottom-right-radius: 0;
}
.mobile-nav-content { @apply p-4 space-y-5 max-h-[calc(100vh-var(--header-height)-1rem)] overflow-y-auto; }
.mobile-section { @apply pb-4 mb-4 border-b border-neutral-border/20 dark:border-neutral-border-dark/30 last:border-b-0 last:pb-0 last:mb-0; }
.mobile-section-title-holographic {
  @apply block mb-3 text-xs font-bold text-neutral-text-muted uppercase tracking-wider;
  text-shadow: 0 0 3px hsl(var(--text-muted-hsl)/0.5);
}

.mobile-mode-card-analog { /* Analog card style for mobile */
  @apply flex flex-col items-center justify-center gap-1.5 p-3.5 border rounded-[var(--radius-lg)]
         transition-all text-center shadow-analog-outset active:scale-95 duration-[var(--duration-quick)] ease-[var(--ease-out-quad)]
         border-neutral-border/60 dark:border-neutral-border-dark/70
         bg-neutral-bg-surface/80 dark:bg-neutral-bg-elevated/80 text-neutral-text-secondary;
}
.mobile-mode-card-analog:hover {
  @apply border-primary-focus/50 dark:border-accent-focus/60
        bg-primary-500/5 dark:bg-accent-500/5 shadow-interactive-hover;
}
.mobile-mode-card-analog.active {
  @apply border-primary-focus dark:border-accent-focus bg-primary-500/10 dark:bg-accent-dark/15
         text-primary-focus dark:text-accent-light font-semibold
         transform scale-[1.02] shadow-analog-inset;
}
.mobile-mode-label { @apply text-xs font-medium mt-1.5; }

.form-select-analog { /* For mobile language select */
  @apply form-select; /* Use base from main.css or tailwind forms plugin */
  /* Specific analog overrides if needed */
  @apply bg-neutral-bg-subtle/80 dark:bg-neutral-bg-elevated/70 border-neutral-border-light/70 dark:border-neutral-border-dark/60 shadow-analog-inset;
}
.form-select-analog:focus {
  @apply border-accent-focus ring-accent-focus shadow-holo-sm;
}

.mobile-toggle-item-analog {
  @apply flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-neutral-bg-subtle/70 dark:bg-neutral-bg-elevated/60 shadow-sm border border-neutral-border/30 dark:border-neutral-border-dark/40;
}
.mobile-toggle-label { @apply font-medium text-sm text-neutral-text; }

.mobile-nav-links { @apply space-y-1.5; }
.mobile-nav-link-analog { /* Analog style for mobile links */
  @apply flex items-center px-3.5 py-3 text-base font-medium rounded-[var(--radius-lg)] transition-colors duration-[var(--duration-quick)]
         text-neutral-text-secondary hover:bg-primary-500/10 hover:text-primary-focus
         dark:hover:bg-accent-dark/15 dark:hover:text-accent-light;
}
.mobile-nav-link-analog.mobile-nav-link-analog-active {
  @apply bg-primary-500/15 text-primary-focus dark:bg-accent-dark/20 dark:text-accent-light font-semibold;
}

.mobile-action-buttons { @apply pt-4 space-y-2.5; }
.btn-analog { /* General analog button for mobile, uses .btn from main.css as base */
  @apply btn btn-secondary text-sm py-3; /* Default to secondary analog style */
  /* Ensure it has analog shadows & feel */
  @apply shadow-analog-outset hover:shadow-interactive-hover active:shadow-analog-inset active:scale-[0.97];
}
.btn-analog.btn-analog-danger { /* Specific danger style for analog */
  @apply btn btn-danger; /* Uses .btn-danger from main.css which has a gradient */
  @apply shadow-lg hover:shadow-error/50; /* Ensure it has analog shadows if desired or keep main.css style */
}
.mobile-action-btn-full {
  @apply w-full justify-center;
}


/* Fullscreen Interaction Buttons - Holographic Style */
.fullscreen-interaction-buttons { @apply fixed top-4 right-4 z-[60] flex items-center gap-3; }
.fullscreen-minimal-btn-holographic {
  @apply btn btn-icon bg-neutral-bg-elevated/50 text-neutral-text /* CORRECTED HERE */
         hover:bg-neutral-bg-elevated/80 shadow-holo-md border-neutral-border/30 backdrop-blur-md
         dark:bg-neutral-bg-elevated/60 dark:border-neutral-border-dark/40 dark:hover:bg-neutral-bg-elevated
         rounded-[var(--radius-md)];
  transition: all var(--duration-quick) ease-in-out;
}
.fullscreen-minimal-btn-holographic:hover {
  @apply shadow-holo-lg scale-[1.05];
  color: hsl(var(--accent-focus-hsl));
}


/* Transitions */
.dropdown-float-enter-active, .dropdown-float-leave-active { transition: opacity 0.2s var(--ease-out-quad), transform 0.2s var(--ease-out-quad); }
.dropdown-float-enter-from, .dropdown-float-leave-to { opacity: 0; transform: translateY(-12px) scale(0.92); }

.slide-down-panel-enter-active { transition: transform 0.35s var(--ease-out-expo), opacity 0.3s var(--ease-out-quad); }
.slide-down-panel-leave-active { transition: transform 0.25s var(--ease-in-quad), opacity 0.2s var(--ease-in-quad); }
.slide-down-panel-enter-from, .slide-down-panel-leave-to { transform: translateY(-100%); opacity: 0; }


/* Ensure custom scrollbar uses new theme if not already covered by global styles */
.custom-scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--primary-focus-hsl)/0.4) transparent; /* Or accent if preferred */
}
.custom-scrollbar-thin::-webkit-scrollbar { @apply w-1.5 h-1.5; }
.custom-scrollbar-thin::-webkit-scrollbar-track { @apply bg-transparent; }
.custom-scrollbar-thin::-webkit-scrollbar-thumb { background-color: hsl(var(--primary-focus-hsl)/0.4); @apply rounded-full; }
.custom-scrollbar-thin::-webkit-scrollbar-thumb:hover { background-color: hsl(var(--primary-focus-hsl)/0.6); }
</style>