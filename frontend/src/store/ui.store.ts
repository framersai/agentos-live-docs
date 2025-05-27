// File: frontend/src/store/ui.store.ts
/**
 * @file ui.store.ts
 * @version 2.0.0
 * @description Pinia store for managing global UI state, primarily fullscreen and other non-theme specific UI states.
 * Theme management (current theme ID, isDark status) is now primarily handled by ThemeManager.ts.
 * This store can subscribe to ThemeManager for convenience if needed.
 */
import { defineStore } from 'pinia';
import { ref, watch, readonly, computed, onMounted, type Ref } from 'vue'; // Corrected: onMounted is used
import { themeManager } from '@/theme/ThemeManager'; // Import the central theme manager

/**
 * @interface UiState
 * @description Defines the reactive state properties for the UI store.
 */
export interface UiState {
  /** Indicates if the application is currently in its internal fullscreen mode. */
  isFullscreen: Readonly<Ref<boolean>>;
  /** Controls visibility of a minimal header when in application fullscreen mode. */
  showHeaderInFullscreenMinimal: Readonly<Ref<boolean>>;
  /** Indicates if the browser's actual fullscreen API is active. */
  isBrowserFullscreenActive: Readonly<Ref<boolean>>;
  /** A computed ref indicating if the current theme (from ThemeManager) is dark. For convenience. */
  isCurrentThemeDark: Readonly<Ref<boolean>>;
  /** Holds the ID of the current theme from ThemeManager. */
  currentThemeId: Readonly<Ref<string>>;
}

/**
 * @interface UiActions
 * @description Defines the actions available in the UI store to manipulate the state.
 */
export interface UiActions {
  /** Initializes UI store-specific states, like fullscreen listeners. Theme initialization is separate. */
  initializeUiState: () => void;
  toggleFullscreen: () => void;
  setFullscreen: (value: boolean) => void;
  toggleShowHeaderInFullscreenMinimal: () => void;
  setShowHeaderInFullscreenMinimal: (value: boolean) => void;
  toggleBrowserFullscreen: () => Promise<void>;
}

type FullUiStore = UiState & UiActions;

export const useUiStore = defineStore('ui', (): FullUiStore => {
  // --- State for Fullscreen & UI visibility ---
  const _isFullscreen = ref<boolean>(false);
  const _showHeaderInFullscreenMinimal = ref<boolean>(false);
  const _isBrowserFullscreenActive = ref<boolean>(!!(typeof document !== 'undefined' && document.fullscreenElement));

  // --- State derived from ThemeManager ---
  const _currentThemeDefFromManager = themeManager.getCurrentTheme();
  const isCurrentThemeDark = computed(() => _currentThemeDefFromManager.value?.isDark || false);
  const currentThemeId = computed(() => _currentThemeDefFromManager.value?.id || 'ephemeral-holo-dark'); // Fallback theme ID

  // --- Public Actions ---
  const initializeUiState = () => {
    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', _handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', _handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', _handleFullscreenChange);
      document.addEventListener('MSFullscreenChange', _handleFullscreenChange);
    }
    // ThemeManager.initialize() should be called from App.vue or main.ts to set up the theme initially.
    console.log('[UiStore] UI state initialized (fullscreen listeners set up).');
  };

  const setFullscreen = (value: boolean) => {
    if (_isFullscreen.value !== value) {
      _isFullscreen.value = value;
      if (!value) {
        _showHeaderInFullscreenMinimal.value = false; // Reset header visibility when exiting internal fullscreen
      }
      console.log(`[UiStore] Application internal fullscreen state set to: ${value}`);
    }
  };

  const toggleFullscreen = () => {
    setFullscreen(!_isFullscreen.value);
  };

  const toggleShowHeaderInFullscreenMinimal = () => {
    if (_isFullscreen.value) { // Only toggle if internal fullscreen is active
      _showHeaderInFullscreenMinimal.value = !_showHeaderInFullscreenMinimal.value;
    } else {
      _showHeaderInFullscreenMinimal.value = false; // Ensure it's false if not in internal fullscreen
    }
  };

  const setShowHeaderInFullscreenMinimal = (value: boolean) => {
    if (_isFullscreen.value) {
      _showHeaderInFullscreenMinimal.value = value;
    } else {
      _showHeaderInFullscreenMinimal.value = false;
    }
  };

  const toggleBrowserFullscreen = async (): Promise<void> => {
    if (typeof document === 'undefined') return;
    const elem = document.documentElement;
    try {
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) await elem.requestFullscreen();
        // @ts-ignore - vendor prefixes for older browser compatibility
        else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
        // @ts-ignore
        else if (elem.mozRequestFullScreen) await elem.mozRequestFullScreen();
        // @ts-ignore
        else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
      }
    } catch (err: any) {
      console.error('[UiStore] Error toggling browser fullscreen:', err.message);
    }
    // State update for _isBrowserFullscreenActive is handled by _handleFullscreenChange
  };

  const _handleFullscreenChange = () => {
    const isCurrentlyFullscreen = !!(typeof document !== 'undefined' && document.fullscreenElement);
    if (_isBrowserFullscreenActive.value !== isCurrentlyFullscreen) {
      _isBrowserFullscreenActive.value = isCurrentlyFullscreen;
      // Sync internal app fullscreen state if browser fullscreen drives it
      // This behavior might need adjustment based on desired UX (e.g., should internal FS always match browser FS?)
      setFullscreen(isCurrentlyFullscreen);
      console.log(`[UiStore] Browser fullscreen state changed to: ${isCurrentlyFullscreen}`);
    }
  };

  // No onMounted here as initializeUiState should be called from App.vue
  // No direct theme watchers here; themeManager handles its own state and persistence.
  // Components should react to themeManager.getCurrentTheme() or uiStore.isCurrentThemeDark.

  return {
    isFullscreen: readonly(_isFullscreen),
    showHeaderInFullscreenMinimal: readonly(_showHeaderInFullscreenMinimal),
    isBrowserFullscreenActive: readonly(_isBrowserFullscreenActive),
    isCurrentThemeDark, // Expose the computed value directly from ThemeManager
    currentThemeId,     // Expose the computed theme ID from ThemeManager

    initializeUiState,
    toggleFullscreen,
    setFullscreen,
    toggleShowHeaderInFullscreenMinimal,
    setShowHeaderInFullscreenMinimal,
    toggleBrowserFullscreen,
  };
});