// File: frontend/src/store/ui.store.ts
/**
 * @file ui.store.ts
 * @description Pinia store for UI state management, including theme, fullscreen, etc.
 * @version 2.1.2 - Added setThemeFlexible action.
 */
import { defineStore } from 'pinia';
import { ref, readonly, computed, type Ref } from 'vue';
import {
  themeManager,
  DEFAULT_DARK_THEME_ID,
  DEFAULT_LIGHT_THEME_ID,
  type ThemeDefinition, // Ensure ThemeDefinition is exported from ThemeManager or themes.config
} from '@/theme/ThemeManager';

// Interface for the actual theme object if needed, assuming ThemeDefinition is correct
type ThemeObjectType = ThemeDefinition | undefined;

// Interfaces
export interface UiState {
  isFullscreen: Readonly<Ref<boolean>>;
  showHeaderInFullscreenMinimal: Readonly<Ref<boolean>>;
  isBrowserFullscreenActive: Readonly<Ref<boolean>>;
  isCurrentThemeDark: Readonly<Ref<boolean>>;
  currentThemeId: Readonly<Ref<string>>;
  theme: Readonly<Ref<ThemeObjectType>>; // Use ThemeObjectType
  isDarkMode: Readonly<Ref<boolean>>;
  isLightMode: Readonly<Ref<boolean>>;
}

export interface UiActions {
  initializeUiState: () => void;
  toggleFullscreen: () => void;
  setFullscreen: (value: boolean) => void;
  toggleShowHeaderInFullscreenMinimal: () => void;
  setShowHeaderInFullscreenMinimal: (value: boolean) => void;
  toggleBrowserFullscreen: () => Promise<void>;
  setTheme: (id: string) => void;
  setDarkMode: (flag: boolean) => void;
  setThemeFlexible: (idOrMode: string) => void; // Added
}

type FullUiStore = UiState & UiActions;

export const useUiStore = defineStore('ui', (): FullUiStore => {
  const _isFullscreen = ref(false);
  const _showHeaderInFullscreenMinimal = ref(false);
  const _isBrowserFullscreenActive = ref<boolean>(typeof document !== 'undefined' && !!document.fullscreenElement);

  const themeRefInternal = themeManager.getCurrentTheme(); // This is Ref<ThemeDefinition | undefined>
  
  // Explicitly type theme to match what getCurrentTheme returns
  const theme = computed(() => themeRefInternal.value);

  const isCurrentThemeDark = computed(() => theme.value?.isDark ?? false);
  const currentThemeId     = computed(() => theme.value?.id ?? DEFAULT_DARK_THEME_ID); // Fallback consistent with ThemeManager

  const isDarkMode  = computed(() => isCurrentThemeDark.value);
  const isLightMode = computed(() => !isCurrentThemeDark.value);

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
    const el = document.documentElement as any;
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
      console.error('[UiStore] Browser FS error', err);
    }
  };

  const _handleFsChange = () => {
    const active = typeof document !== 'undefined' && !!document.fullscreenElement;
    _isBrowserFullscreenActive.value = active;
    setFullscreen(active); // Keep internal fullscreen in sync
  };

  const initializeUiState = () => {
    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', _handleFsChange);
      document.addEventListener('webkitfullscreenchange', _handleFsChange);
      document.addEventListener('mozfullscreenchange', _handleFsChange);
      document.addEventListener('MSFullscreenChange', _handleFsChange);
    }
    // ThemeManager.initialize() is called in App.vue, which sets the initial document attributes.
    // This store then reads from ThemeManager.
  };

  const setTheme = (id: string) => {
    themeManager.setTheme(id); // Delegate to ThemeManager to apply and persist
  };

  const setDarkMode = (flag: boolean) => {
    // Use themeManager's logic for default dark/light themes
    const targetThemeId = flag ? DEFAULT_DARK_THEME_ID : DEFAULT_LIGHT_THEME_ID;
    themeManager.setTheme(targetThemeId);
  };

  // Added setThemeFlexible
  const setThemeFlexible = (idOrMode: string) => {
    if (idOrMode === 'dark')  themeManager.setTheme(DEFAULT_DARK_THEME_ID);
    else if (idOrMode === 'light') themeManager.setTheme(DEFAULT_LIGHT_THEME_ID);
    else themeManager.setTheme(idOrMode);
  };

  return {
    isFullscreen: readonly(_isFullscreen),
    showHeaderInFullscreenMinimal: readonly(_showHeaderInFullscreenMinimal),
    isBrowserFullscreenActive: readonly(_isBrowserFullscreenActive),
    isCurrentThemeDark,
    currentThemeId,
    theme: readonly(theme) as Readonly<Ref<ThemeObjectType>>, // Ensure the exposed type matches
    isDarkMode,
    isLightMode,

    initializeUiState,
    toggleFullscreen,
    setFullscreen,
    toggleShowHeaderInFullscreenMinimal,
    setShowHeaderInFullscreenMinimal,
    toggleBrowserFullscreen,
    setTheme,
    setDarkMode,
    setThemeFlexible, // Expose new action
  };
});