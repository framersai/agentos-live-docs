// File: frontend/src/store/ui.store.ts
/**
 * @file ui.store.ts
 * @version 1.1.2
 * @description Pinia store for managing global UI state, such as fullscreen mode and theme.
 * V1.1.2: Added missing Vue imports (computed, onMounted).
 */
import { defineStore } from 'pinia';
import { ref, watch, readonly, computed, onMounted, type Ref } from 'vue'; // Added computed, onMounted
import { useStorage } from '@vueuse/core';

/**
 * @type {'light' | 'dark'} Theme
 * @description Represents the possible UI themes.
 */
export type Theme = 'light' | 'dark';

/**
 * @interface UiState
 * @description Defines the reactive state properties for the UI store.
 * These are the refs that hold the current UI state values.
 */
export interface UiState {
  /** Current application theme ('light' or 'dark'). Directly reflects the internal state. */
  theme: Ref<Theme>;
  /** A computed ref indicating if the current theme is dark. For convenience. */
  isDarkMode: Ref<boolean>; // This is a ComputedRef<boolean> but typed as Ref<boolean> for simplicity in return type
  /** Indicates if the application is currently in its internal fullscreen mode. */
  isFullscreen: Ref<boolean>;
  /** Controls visibility of a minimal header when in application fullscreen mode. */
  showHeaderInFullscreenMinimal: Ref<boolean>;
  /** Indicates if the browser's actual fullscreen API is active. */
  isBrowserFullscreenActive: Ref<boolean>;
}

/**
 * @interface UiActions
 * @description Defines the actions available in the UI store to manipulate the state.
 */
export interface UiActions {
  toggleTheme: () => void;
  setTheme: (newTheme: Theme) => void;
  initializeTheme: () => void;
  toggleFullscreen: () => void; // Toggles internal application fullscreen state
  setFullscreen: (value: boolean) => void; // Sets internal application fullscreen state
  toggleShowHeaderInFullscreenMinimal: () => void;
  setShowHeaderInFullscreenMinimal: (value: boolean) => void;
  toggleBrowserFullscreen: () => Promise<void>; // Toggles actual browser fullscreen
}

// Type for the entire store returned by defineStore setup function
type FullUiStore = UiState & UiActions;


export const useUiStore = defineStore('ui', (): FullUiStore => {
  // --- State ---
  const storedTheme = useStorage<Theme>('vca-theme_v2.1', 'light'); // Updated key for fresh start, default 'light'
  const _theme = ref<Theme>(storedTheme.value);
  const _isFullscreen = ref<boolean>(false);
  const _showHeaderInFullscreenMinimal = ref<boolean>(false);
  const _isBrowserFullscreenActive = ref<boolean>(!!(typeof document !== 'undefined' && document.fullscreenElement));

  /** @inheritdoc */
  const isDarkMode = computed<boolean>(() => _theme.value === 'dark');

  // --- Private Helper Actions ---
  const _applyThemeToDocument = (newThemeValue: Theme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark'); // Remove any existing theme class
      root.classList.add(newThemeValue);       // Add the new theme class
      root.setAttribute('data-theme', newThemeValue);
    }
  };

  // --- Public Actions ---

  /** @inheritdoc */
  const initializeTheme = () => {
    let initialTheme: Theme;
    const currentStoredValue = storedTheme.value;

    if (currentStoredValue === 'dark' || currentStoredValue === 'light') {
      initialTheme = currentStoredValue;
    } else {
      initialTheme = (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
        ? 'dark'
        : 'light';
      storedTheme.value = initialTheme; // Persist determined theme if storage was invalid
    }
    _theme.value = initialTheme;
    _applyThemeToDocument(initialTheme);
    console.log(`[UiStore] Theme initialized to: ${initialTheme}`);
  };

  /** @inheritdoc */
  const setTheme = (newTheme: Theme) => {
    if (_theme.value !== newTheme) {
      _theme.value = newTheme;
      storedTheme.value = newTheme;
      _applyThemeToDocument(newTheme);
      console.log(`[UiStore] Theme explicitly set to: ${newTheme}`);
    }
  };

  /** @inheritdoc */
  const toggleTheme = () => {
    setTheme(_theme.value === 'light' ? 'dark' : 'light');
  };

  /** @inheritdoc */
  const setFullscreen = (value: boolean) => {
    if (_isFullscreen.value !== value) {
      _isFullscreen.value = value;
      if (!value) {
        _showHeaderInFullscreenMinimal.value = false;
      }
      console.log(`[UiStore] Application internal fullscreen state set to: ${value}`);
    }
  };

  /** @inheritdoc */
  const toggleFullscreen = () => {
    setFullscreen(!_isFullscreen.value);
  };

  /** @inheritdoc */
  const toggleShowHeaderInFullscreenMinimal = () => {
    if (_isFullscreen.value) {
      _showHeaderInFullscreenMinimal.value = !_showHeaderInFullscreenMinimal.value;
    } else {
      _showHeaderInFullscreenMinimal.value = false;
    }
  };

  /** @inheritdoc */
  const setShowHeaderInFullscreenMinimal = (value: boolean) => {
    if (_isFullscreen.value) {
      _showHeaderInFullscreenMinimal.value = value;
    } else {
      _showHeaderInFullscreenMinimal.value = false;
    }
  };

  /** @inheritdoc */
  const toggleBrowserFullscreen = async (): Promise<void> => {
    if (typeof document === 'undefined') return;
    const elem = document.documentElement;
    try {
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) await elem.requestFullscreen();
        // @ts-ignore
        else if (elem.mozRequestFullScreen) await elem.mozRequestFullScreen();
        // @ts-ignore
        else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
        // @ts-ignore
        else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
      }
    } catch (err: any) {
      console.error('[UiStore] Error toggling browser fullscreen:', err.message);
    }
    // Browser fullscreen state will be updated by the event listener
  };

  const _handleFullscreenChange = () => {
    const isCurrentlyFullscreen = !!(typeof document !== 'undefined' && document.fullscreenElement);
    if (_isBrowserFullscreenActive.value !== isCurrentlyFullscreen) {
      _isBrowserFullscreenActive.value = isCurrentlyFullscreen;
      setFullscreen(isCurrentlyFullscreen); // Sync internal app state
      console.log(`[UiStore] Browser fullscreen state changed to: ${isCurrentlyFullscreen}`);
    }
  };

  onMounted(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', _handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', _handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', _handleFullscreenChange);
      document.addEventListener('MSFullscreenChange', _handleFullscreenChange);
    }
    initializeTheme(); // Ensure theme is set on mount
  });

  // Watch for direct changes to storedTheme (e.g., from another tab via useStorage)
  watch(storedTheme, (newVal) => {
    if (newVal && newVal !== _theme.value) {
      setTheme(newVal);
    }
  });

  return {
    theme: _theme, // Expose the internal ref, consumers should preferably use isDarkMode
    isDarkMode,   // Expose the computed for boolean checks
    isFullscreen: readonly(_isFullscreen),
    showHeaderInFullscreenMinimal: readonly(_showHeaderInFullscreenMinimal),
    isBrowserFullscreenActive: readonly(_isBrowserFullscreenActive),
    toggleTheme,
    setTheme,
    initializeTheme,
    toggleFullscreen,
    setFullscreen,
    toggleShowHeaderInFullscreenMinimal,
    setShowHeaderInFullscreenMinimal,
    toggleBrowserFullscreen,
  };
});