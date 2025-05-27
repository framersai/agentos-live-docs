/**
 * @file Header.vue
 * @description Global application header, redesigned for "Ephemeral Harmony" theme.
 * Provides navigation, mode/language selection, quick access to voice/other settings,
 * cost display, and UI toggles, featuring holographic visuals and tactile analog-style buttons.
 * @version 5.0.1 - TypeScript error fixes and icon handling improvements.
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
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { useUiStore } from '@/store/ui.store';
import { useAgentStore } from '@/store/agent.store';
import { agentService, type AgentId, type IAgentDefinition } from '@/services/agent.service'; // Assuming IAgentDefinition is here

// Extend IAgentDefinition locally to include showLanguageSelector if not present in the original type
declare module '@/services/agent.service' {
  interface IAgentDefinition {
    showLanguageSelector?: boolean;
    supportsAutoClear?: boolean;
  }
}
import { useChatStore } from '@/store/chat.store';

const VoiceControlsDropdown = defineAsyncComponent(() => import('./header/VoiceControlsDropdown.vue'));

import {
  ChevronDownIcon, Bars3Icon, XMarkIcon, Cog8ToothIcon,
  PhotoIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon, SunIcon, MoonIcon,
  ArrowRightOnRectangleIcon, ClockIcon,
  LanguageIcon, AdjustmentsHorizontalIcon,
  TrashIcon as TrashIconOutline, CpuChipIcon, // Renamed TrashIcon to avoid conflict if a filled version is used
  SpeakerWaveIcon, MicrophoneIcon
} from '@heroicons/vue/24/outline';

// TODO: Define or import these types properly if they are more complex
// For IAgentDefinition, ensure it includes:
// showLanguageSelector?: boolean;
// supportsAutoClear?: boolean;

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
  name: 'AppHeaderEphemeral',
  components: {
    RouterLink,
    VoiceControlsDropdown,
    // Icons listed here are registered for the component
    ChevronDownIcon, Bars3Icon, XMarkIcon, Cog8ToothIcon,
    ArrowsPointingOutIcon, ArrowsPointingInIcon, SunIcon, MoonIcon,
    ArrowRightOnRectangleIcon, ClockIcon, // Using ClockIcon consistently
    LanguageIcon, PhotoIcon, AdjustmentsHorizontalIcon,
    TrashIconOutline, CpuChipIcon, SpeakerWaveIcon, MicrophoneIcon,
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
        icon: agent.icon as VueComponent, // Assuming agent.icon is a VueComponent
        iconClass: agent.iconClass || 'default-icon-bg',
      }))
    );

    const activeAgentDisplay = computed(() => {
      const currentAgent = agentStore.activeAgent || agentService.getDefaultAgent();
      return {
        label: currentAgent.label,
        icon: currentAgent.icon as VueComponent,
        iconClass: currentAgent.iconClass || 'default-icon-bg',
      };
    });

    const programmingLanguages: LanguageOption[] = [
      { label: 'Python', value: 'python', icon: '🐍' }, { label: 'JavaScript', value: 'javascript', icon: '⚡' },
      { label: 'TypeScript', value: 'typescript', icon: '🔷' }, { label: 'Java', value: 'java', icon: '☕️' },
      { label: 'C++', value: 'cpp', icon: '🅲+' }, { label: 'Go', value: 'go', icon: '🐹' },
      { label: 'Rust', value: 'rust', icon: '🦀' }, { label: 'PHP', value: 'php', icon: '🐘' },
    ];

    const currentLanguageDisplay = computed(() =>
      programmingLanguages.find(l => l.value === appSettings.preferredCodingLanguage) ||
      programmingLanguages.find(l => l.value === voiceSettingsManager.defaultSettings.preferredCodingLanguage) ||
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
    const handleToggleFullscreenEmit = () => { emit('toggle-fullscreen'); closeMobileNav(); };
    const handleToggleTheme = () => {
      uiStore.toggleTheme();
      closeMobileNav();
    };
    const handleLogout = () => { emit('logout'); closeMobileNav(); };
    const handleShowPriorChatLog = () => { emit('show-prior-chat-log'); closeMobileNav(); };

    const handleClickOutside = (event: MouseEvent) => {
      if (modeDropdownRef.value && !modeDropdownRef.value.contains(event.target as Node)) showModeDropdown.value = false;
      if (languageDropdownRef.value && !languageDropdownRef.value.contains(event.target as Node)) showLanguageDropdown.value = false;
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside, true);
    });

    onUnmounted(() => document.removeEventListener('click', handleClickOutside, true));

    const toggleShowHeaderInFullscreen = () => uiStore.toggleShowHeaderInFullscreenMinimal();
    
    const navLinks = ref([
      { name: 'Settings', path: '/settings', icon: Cog8ToothIcon },
    ]);
    
    const isAiActive = computed(() => props.isAssistantSpeaking || chatStore.isMainContentStreaming);
    const isUserActive = computed(() => props.isUserListening);

    // Make icons directly available to the template
    // This can help with some TypeScript plugin resolution issues for <component :is="...">
    return {
      appSettings, isDarkMode, isFullscreenActive, showHeaderInFullscreen, toggleShowHeaderInFullscreen,
      isMobileNavOpen, toggleMobileNav, closeMobileNav, showModeDropdown, modeDropdownRef,
      showLanguageDropdown, languageDropdownRef, toggleDropdown, selectAppMode, activeAgentDisplay,
      modePresets, selectCodingLanguage, currentLanguageDisplay, programmingLanguages,
      handleClearChatAndSession, 
      handleToggleFullscreen: handleToggleFullscreenEmit,
      handleToggleTheme, 
      handleLogout, handleShowPriorChatLog,
      navLinks, uiStore, agentStore,
      isAiActive, isUserActive,

      // Icons for direct use or as fallbacks in <component :is="">
      CpuChipIcon, LanguageIcon, AdjustmentsHorizontalIcon, PhotoIcon, TrashIconOutline,
      ClockIcon, ArrowsPointingInIcon, ArrowsPointingOutIcon, SunIcon, MoonIcon,
      ArrowRightOnRectangleIcon, XMarkIcon, Bars3Icon, SpeakerWaveIcon, MicrophoneIcon,
      ChevronDownIcon, Cog8ToothIcon,
    };
  },
});
</script>
<template>
  <header
    class="app-header-ephemeral" :class="{
      'fullscreen-hidden': isFullscreenActive && !showHeaderInFullscreen && !isMobileNavOpen,
      'ai-active-glow': isAiActive,
      'user-active-glow': isUserActive && !isAiActive,
    }"
  >
    <div class="header-content-wrapper-ephemeral">
      <div class="header-main-row-ephemeral">
        <div class="header-logo-section-ephemeral">
          <RouterLink to="/" class="logo-link-ephemeral" @click="closeMobileNav" aria-label="Go to Dashboard">
            <img src="@/assets/logo.svg" alt="VCA Logo" class="logo-image-ephemeral" />
            <h1 class="app-title-full-ephemeral md:flex hidden"> Voice Chat <span class="app-title-accent-ephemeral">Assistant</span></h1>
            <span class="app-title-short-ephemeral md:hidden">VCA</span>
          </RouterLink>
          <div class="activity-indicator-wrapper-ephemeral">
            <div v-if="isAiActive" class="activity-indicator-ephemeral ai-speaking" title="Assistant is active">
              <SpeakerWaveIcon class="icon-xs" />
            </div>
            <div v-else-if="isUserActive" class="activity-indicator-ephemeral user-listening" title="Listening to you">
              <MicrophoneIcon class="icon-xs" />
            </div>
          </div>
        </div>

        <nav class="desktop-nav-ephemeral" aria-label="Main desktop navigation">
          <div class="relative" ref="modeDropdownRef">
            <button @click="toggleDropdown('mode')" class="nav-button-ephemeral group" id="mode-button-desktop" aria-haspopup="true" :aria-expanded="showModeDropdown ? 'true' : 'false'">
              <component :is="activeAgentDisplay.icon || CpuChipIcon" class="icon-sm nav-button-icon" :class="activeAgentDisplay.iconClass" />
              <span class="nav-button-text-ephemeral xl:inline hidden">{{ activeAgentDisplay.label }}</span>
              <ChevronDownIcon class="icon-xs nav-chevron-ephemeral" :class="{ 'rotate-180': showModeDropdown }" />
            </button>
            <transition name="dropdown-transition-ephemeral">
              <div v-show="showModeDropdown" class="dropdown-menu-ephemeral w-80 origin-top-right md:origin-top-left" role="menu" aria-orientation="vertical" aria-labelledby="mode-button-desktop">
                <div class="dropdown-header-ephemeral"><h3 class="dropdown-title-ephemeral">Select Assistant Mode</h3></div>
                <div class="dropdown-content-ephemeral custom-scrollbar">
                  <button v-for="preset in modePresets" :key="preset.value" @click="selectAppMode(preset.value)"
                    class="dropdown-item-ephemeral group" :class="{ 'active': agentStore.activeAgentId === preset.value }" role="menuitemradio" :aria-checked="agentStore.activeAgentId === preset.value ? 'true' : 'false'">
                    <div class="dropdown-item-icon-ephemeral" :class="preset.iconClass"><component :is="preset.icon" class="icon-base" /></div>
                    <div class="dropdown-item-text-wrapper-ephemeral">
                      <div class="dropdown-item-label-ephemeral">{{ preset.label }}</div>
                      <div class="dropdown-item-desc-ephemeral">{{ preset.description }}</div>
                    </div>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <div v-if="agentStore.activeAgent?.showLanguageSelector" class="relative" ref="languageDropdownRef">
            <button @click="toggleDropdown('language')" class="nav-button-ephemeral group" id="language-button-desktop" aria-haspopup="true" :aria-expanded="showLanguageDropdown ? 'true' : 'false'">
              <LanguageIcon class="icon-sm nav-button-icon"/>
              <span class="nav-button-text-ephemeral xl:inline hidden">{{ currentLanguageDisplay.label }}</span>
              <ChevronDownIcon class="icon-xs nav-chevron-ephemeral" :class="{ 'rotate-180': showLanguageDropdown }" />
            </button>
            <transition name="dropdown-transition-ephemeral">
              <div v-show="showLanguageDropdown" class="dropdown-menu-ephemeral w-64 origin-top-right md:origin-top-left" role="menu" aria-orientation="vertical" aria-labelledby="language-button-desktop">
                <div class="dropdown-header-ephemeral"><h3 class="dropdown-title-ephemeral">Programming Language</h3></div>
                <div class="dropdown-content-ephemeral custom-scrollbar">
                  <button v-for="lang in programmingLanguages" :key="lang.value" @click="selectCodingLanguage(lang.value)"
                    class="dropdown-item-ephemeral group" :class="{ 'active': appSettings.preferredCodingLanguage === lang.value }" role="menuitemradio" :aria-checked="appSettings.preferredCodingLanguage === lang.value ? 'true' : 'false'">
                    <span class="dropdown-item-icon-emoji-ephemeral" aria-hidden="true">{{ lang.icon }}</span>
                    <span class="dropdown-item-label-ephemeral">{{ lang.label }}</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <Suspense>
            <VoiceControlsDropdown
              button-class="nav-button-ephemeral"
              text-class="nav-button-text-ephemeral xl:inline hidden"
              icon-class="icon-sm nav-button-icon"
              chevron-class="icon-xs nav-chevron-ephemeral"
            />
            <template #fallback>
              <button class="nav-button-ephemeral opacity-50 cursor-default" disabled>
                <AdjustmentsHorizontalIcon class="icon-sm nav-button-icon" />
                <span class="nav-button-text-ephemeral xl:inline hidden">Voice...</span>
              </button>
            </template>
          </Suspense>
          
          <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path" class="nav-button-ephemeral group" active-class="active">
            <component v-if="link.icon" :is="link.icon" class="icon-sm nav-button-icon" />
            <span class="nav-button-text-ephemeral xl:inline hidden">{{ link.name }}</span>
          </RouterLink>
        </nav>

        <div class="header-actions-section-ephemeral">
          <div class="quick-toggles-group-ephemeral sm:flex hidden">
            <div class="quick-toggle-item-ephemeral" title="Toggle Diagram Generation">
              <label class="toggle-switch-analog">
                <input id="diagramToggleDesktop" type="checkbox" v-model="appSettings.generateDiagrams" class="toggle-switch-input sr-only peer" />
                <span class="toggle-switch-track"></span><span class="toggle-switch-knob"></span>
              </label>
              <label for="diagramToggleDesktop" class="quick-toggle-label-icon-ephemeral"><PhotoIcon class="icon-sm" /></label>
            </div>
            <div v-if="agentStore.activeAgent?.supportsAutoClear"
                 class="quick-toggle-item-ephemeral" title="Toggle Auto-Clear Input">
              <label class="toggle-switch-analog">
                <input id="autoClearToggleDesktop" type="checkbox" v-model="appSettings.autoClearChat" class="toggle-switch-input sr-only peer" />
                <span class="toggle-switch-track"></span><span class="toggle-switch-knob"></span>
              </label>
              <label for="autoClearToggleDesktop" class="quick-toggle-label-icon-ephemeral"><TrashIconOutline class="icon-sm" /></label>
            </div>
          </div>

          <div class="cost-display-ephemeral sm:flex hidden" title="Current session estimated cost">
            <span class="cost-label-ephemeral">Cost: </span>
            <span class="cost-value-ephemeral">${{ sessionCost.toFixed(4) }}</span>
          </div>

          <div class="desktop-action-buttons-ephemeral md:flex hidden">
            <button @click="handleShowPriorChatLog" class="action-btn-ephemeral" title="View Chat History Log"><ClockIcon class="icon-base" /></button>
            <button @click="handleClearChatAndSession" class="action-btn-ephemeral" title="Clear Chat & Session"><TrashIconOutline class="icon-base" /></button>
            <button @click="handleToggleFullscreen" class="action-btn-ephemeral" :title="isFullscreenActive ? 'Exit Fullscreen' : 'Enter Fullscreen'">
              <component :is="isFullscreenActive ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="icon-base" />
            </button>
            <button @click="handleToggleTheme" class="action-btn-ephemeral" title="Toggle Theme">
              <component :is="isDarkMode ? SunIcon : MoonIcon" class="icon-base" />
            </button>
            <button @click="handleLogout" class="action-btn-ephemeral logout" title="Logout">
              <ArrowRightOnRectangleIcon class="icon-base"/>
            </button>
          </div>

          <button @click="toggleMobileNav" class="mobile-nav-toggle-ephemeral lg:hidden" aria-label="Toggle mobile menu" :aria-expanded="isMobileNavOpen ? 'true' : 'false'">
            <component :is="isMobileNavOpen ? XMarkIcon : Bars3Icon" class="icon-base" />
          </button>
        </div>
      </div>
    </div>

    <transition name="mobile-nav-transition-ephemeral">
      <div v-show="isMobileNavOpen && (!isFullscreenActive || showHeaderInFullscreen)" class="mobile-nav-panel-ephemeral lg:hidden" role="dialog" aria-modal="true">
        <div class="mobile-nav-content-ephemeral custom-scrollbar">
          <section class="mobile-nav-section-ephemeral">
            <h3 class="mobile-nav-section-title-ephemeral">Assistant Mode</h3>
            <div class="mobile-mode-grid-ephemeral">
              <button v-for="preset in modePresets" :key="preset.value" @click="selectAppMode(preset.value)"
                class="mobile-mode-card-ephemeral" :class="{ 'active': agentStore.activeAgentId === preset.value }">
                <div class="dropdown-item-icon-ephemeral p-2.5" :class="preset.iconClass"><component :is="preset.icon" class="icon-xl" /></div>
                <span class="mobile-mode-label-ephemeral">{{ preset.label }}</span>
              </button>
            </div>
          </section>

          <section v-if="agentStore.activeAgent?.showLanguageSelector" class="mobile-nav-section-ephemeral">
            <h3 class="mobile-nav-section-title-ephemeral">Programming Language</h3>
            <select :value="appSettings.preferredCodingLanguage" @change="selectCodingLanguage(($event.target as HTMLSelectElement).value)" class="form-select-analog w-full text-base">
              <option v-for="lang in programmingLanguages" :key="lang.value" :value="lang.value">
                {{ lang.icon }} {{ lang.label }}
              </option>
            </select>
          </section>
          
          <section class="mobile-nav-section-ephemeral">
            <h3 class="mobile-nav-section-title-ephemeral">Quick Toggles</h3>
            <div class="mobile-toggles-wrapper-ephemeral">
              <div class="mobile-toggle-item-ephemeral">
                <PhotoIcon class="icon-base mobile-toggle-icon-ephemeral"/>
                <label for="diagramToggleMobile" class="mobile-toggle-label-ephemeral">Generate Diagrams</label>
                <label class="toggle-switch-analog ml-auto">
                  <input id="diagramToggleMobile" type="checkbox" v-model="appSettings.generateDiagrams" class="toggle-switch-input sr-only peer" />
                  <span class="toggle-switch-track"></span><span class="toggle-switch-knob"></span>
                </label>
              </div>
              <div v-if="agentStore.activeAgent?.supportsAutoClear" class="mobile-toggle-item-ephemeral">
                <TrashIconOutline class="icon-base mobile-toggle-icon-ephemeral"/>
                <label for="autoClearToggleMobile" class="mobile-toggle-label-ephemeral">Auto-Clear Input</label>
                <label class="toggle-switch-analog ml-auto">
                  <input id="autoClearToggleMobile" type="checkbox" v-model="appSettings.autoClearChat" class="toggle-switch-input sr-only peer" />
                  <span class="toggle-switch-track"></span><span class="toggle-switch-knob"></span>
                </label>
              </div>
            </div>
          </section>

          <nav class="mobile-main-nav-ephemeral">
            <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path" @click="closeMobileNav" class="mobile-nav-link-ephemeral" active-class="active">
              <component v-if="link.icon" :is="link.icon" class="icon-base mobile-nav-link-icon-ephemeral" />
              {{ link.name }}
            </RouterLink>
          </nav>

          <div class="mobile-action-buttons-ephemeral">
            <button @click="handleShowPriorChatLog" class="btn-secondary mobile-full-width-btn-ephemeral"><ClockIcon class="icon-base"/> Chat History</button>
            <button @click="handleClearChatAndSession" class="btn-secondary mobile-full-width-btn-ephemeral"><TrashIconOutline class="icon-base"/> Clear Chat & Cost</button>
            <button @click="handleToggleTheme" class="btn-secondary mobile-full-width-btn-ephemeral">
              <component :is="isDarkMode ? SunIcon : MoonIcon" class="icon-base" /> Toggle Theme
            </button>
            <button @click="handleToggleFullscreen" class="btn-secondary mobile-full-width-btn-ephemeral">
              <component :is="isFullscreenActive ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="icon-base" />
              {{ isFullscreenActive ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
            </button>
            <button @click="handleLogout" class="btn-error mobile-full-width-btn-ephemeral">
              <ArrowRightOnRectangleIcon class="icon-base"/> Logout
            </button>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="isFullscreenActive && !showHeaderInFullscreen" class="fullscreen-controls-ephemeral">
      <button @click="toggleShowHeaderInFullscreen" class="fullscreen-control-btn-ephemeral" title="Show Menu"><Bars3Icon class="icon-base" /></button>
      <button @click="handleToggleFullscreen" class="fullscreen-control-btn-ephemeral" title="Exit Fullscreen"><ArrowsPointingInIcon class="icon-base" /></button>
    </div>
    <div v-if="isFullscreenActive && showHeaderInFullscreen" class="fullscreen-close-header-btn-ephemeral">
      <button @click="toggleShowHeaderInFullscreen" class="fullscreen-control-btn-ephemeral" title="Hide Menu"><XMarkIcon class="icon-base" /></button>
    </div>
  </header>
</template>

<style lang="scss">
/*
  All styles for AppHeader are now primarily handled by:
  - src/styles/layout/_header.scss (for specific .app-header-ephemeral, .nav-button-ephemeral, etc.)
  - src/styles/components/_buttons.scss (for .btn, .btn-primary, etc.)
  - src/styles/components/_forms.scss (for .toggle-switch-analog, .form-select-analog)
  - src/styles/abstracts/* for variables, mixins.
  - Tailwind utility classes.

  This <style> block can be removed or used for highly specific, one-off overrides
  that don't make sense to include in the global SCSS system.
  For now, it's empty.
*/
</style>