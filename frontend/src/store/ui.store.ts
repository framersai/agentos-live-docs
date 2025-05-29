// File: frontend/src/store/ui.store.ts
/**
 * @file ui.store.ts
 * @description Pinia store for UI state management, including theme, fullscreen,
 * screen size breakpoints, etc. Interacts with ThemeManager for theme changes.
 * @version 2.2.1 - Integrated screen size breakpoints and ensured correct ThemeManager delegation.
 */
import { defineStore } from 'pinia';
import { ref, readonly, computed, watch, type Ref } from 'vue';
import { usePreferredDark, useBreakpoints, type Breakpoints } from '@vueuse/core';
import {
  themeManager, // themeManager now exports the default IDs via re-export or direct definition
  DEFAULT_DARK_THEME_ID,
  DEFAULT_LIGHT_THEME_ID,
  DEFAULT_OVERALL_THEME_ID, // Added for clarity if needed, though ThemeManager handles this
  type ThemeDefinition,
} from '@/theme/ThemeManager';

/**
 * @const {Breakpoints} breakpoints - Breakpoint definitions mirroring Tailwind CSS configuration.
 * Used by `@vueuse/core`'s `useBreakpoints` for reactive screen size checks.
 */
const breakpointsConfig: Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
const vueUseBreakpointsState = useBreakpoints(breakpointsConfig);

/**
 * @typedef {ThemeDefinition | undefined} ThemeObjectType - Type alias for the theme object.
 */
type ThemeObjectType = ThemeDefinition | undefined;

/**
 * @interface UiState
 * @description Defines the reactive state properties managed by the UI store.
 */
export interface UiState {
  isFullscreen: Readonly<Ref<boolean>>;
  showHeaderInFullscreenMinimal: Readonly<Ref<boolean>>;
  isBrowserFullscreenActive: Readonly<Ref<boolean>>;
  isCurrentThemeDark: Readonly<Ref<boolean>>;
  currentThemeId: Readonly<Ref<string>>;
  theme: Readonly<Ref<ThemeObjectType>>;
  isDarkMode: Readonly<Ref<boolean>>;
  isLightMode: Readonly<Ref<boolean>>;
  isSmallScreen: Readonly<Ref<boolean>>; // e.g., < md
  isMediumScreenOrSmaller: Readonly<Ref<boolean>>; // e.g., <= md
  // Add more specific breakpoint refs if needed, e.g., isLargeScreen: vueUseBreakpointsState.lg
}

/**
 * @interface UiActions
 * @description Defines the actions (methods) available in the UI store.
 */
export interface UiActions {
  initializeUiState: () => void;
  toggleFullscreen: () => void;
  setFullscreen: (value: boolean) => void;
  toggleShowHeaderInFullscreenMinimal: () => void;
  setShowHeaderInFullscreenMinimal: (value: boolean) => void;
  toggleBrowserFullscreen: () => Promise<void>;
  setTheme: (id: string) => void;
  setDarkMode: (flag: boolean) => void;
  setThemeFlexible: (idOrMode: string) => void;
}

/**
 * @typedef {UiState & UiActions} FullUiStore - Complete type for the UI store.
 */
type FullUiStore = UiState & UiActions;

export const useUiStore = defineStore('ui', (): FullUiStore => {
  const _isFullscreen = ref(false);
  const _showHeaderInFullscreenMinimal = ref(false);
  const _isBrowserFullscreenActive = ref<boolean>(typeof document !== 'undefined' && !!document.fullscreenElement);

  const preferredDark = usePreferredDark();
  const isSystemDarkLocal = ref(preferredDark.value); // Local reactive copy

  // Screen size computeds
  const isSmallScreen = vueUseBreakpointsState.smaller('md');
  const isMediumScreenOrSmaller = vueUseBreakpointsState.smallerOrEqual('md');

  // Theme state directly from ThemeManager's reactive properties
  const theme = computed<ThemeObjectType>(() => themeManager.getCurrentTheme().value);
  const currentThemeId = computed<string>(() => themeManager.getCurrentThemeId().value);
  const isCurrentThemeDark = computed<boolean>(() => theme.value?.isDark ?? isSystemDarkLocal.value);

  const isDarkMode = computed<boolean>(() => isCurrentThemeDark.value);
  const isLightMode = computed<boolean>(() => !isCurrentThemeDark.value);

  const setFullscreen = (val: boolean) => {
    if (_isFullscreen.value !== val) {
      _isFullscreen.value = val;
      if (!val) _showHeaderInFullscreenMinimal.value = false;
    }
  };
  const toggleFullscreen = () => setFullscreen(!_isFullscreen.value);

  const toggleShowHeaderInFullscreenMinimal = () => {
    if (_isFullscreen.value) _showHeaderInFullscreenMinimal.value = !_showHeaderInFullscreenMinimal.value;
  };
  const setShowHeaderInFullscreenMinimal = (v: boolean) => {
    if (_isFullscreen.value) _showHeaderInFullscreenMinimal.value = v;
  };

  const toggleBrowserFullscreen = async () => {
    if (typeof document === 'undefined') return;
    const el = document.documentElement as HTMLElement & {
      mozRequestFullScreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };
    try {
      if (!document.fullscreenElement) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen) await el.mozRequestFullScreen();
        else if (el.msRequestFullscreen) await el.msRequestFullscreen();
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('[UiStore] Browser fullscreen toggle error:', err);
    }
  };

  const _handleFsChange = () => {
    _isBrowserFullscreenActive.value = typeof document !== 'undefined' && !!document.fullscreenElement;
  };

  const initializeUiState = () => {
    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', _handleFsChange);
      document.addEventListener('webkitfullscreenchange', _handleFsChange);
      document.addEventListener('mozfullscreenchange', _handleFsChange);
      document.addEventListener('MSFullscreenChange', _handleFsChange);
    }
    // ThemeManager.initialize() is called in App.vue onMounted.
    watch(preferredDark, (newVal: boolean) => {
      isSystemDarkLocal.value = newVal; // Update local ref
      // ThemeManager's internal watch will handle applying system preference if no user choice.
    }, { immediate: true });
  };

  const setTheme = (id: string) => themeManager.setTheme(id);
  const setDarkMode = (flag: boolean) => themeManager.setThemeFlexible(flag ? 'dark' : 'light');
  const setThemeFlexible = (idOrMode: string) => themeManager.setThemeFlexible(idOrMode);

  return {
    isFullscreen: readonly(_isFullscreen),
    showHeaderInFullscreenMinimal: readonly(_showHeaderInFullscreenMinimal),
    isBrowserFullscreenActive: readonly(_isBrowserFullscreenActive),
    isCurrentThemeDark,
    currentThemeId,
    theme, // Already readonly from computed if `themeManager.getCurrentTheme()` is readonly
    isDarkMode,
    isLightMode,
    isSmallScreen: readonly(isSmallScreen),
    isMediumScreenOrSmaller: readonly(isMediumScreenOrSmaller),

    initializeUiState,
    toggleFullscreen,
    setFullscreen,
    toggleShowHeaderInFullscreenMinimal,
    setShowHeaderInFullscreenMinimal,
    toggleBrowserFullscreen,
    setTheme,
    setDarkMode,
    setThemeFlexible,
  };
});