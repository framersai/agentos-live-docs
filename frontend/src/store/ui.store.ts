

/* =============================================================================
 *  FILE: frontend/src/store/ui.store.ts   –  Version 2.1.1 (2025‑05‑27)
 * =============================================================================*/
import { defineStore } from 'pinia';
import { ref, readonly, computed, type Ref } from 'vue';
import {
  themeManager,
  DEFAULT_DARK_THEME_ID,
  DEFAULT_LIGHT_THEME_ID,
} from '@/theme/ThemeManager';

// -----------------------------------------------------------------------------
//  Interfaces
// -----------------------------------------------------------------------------
export interface UiState {
  isFullscreen: Readonly<Ref<boolean>>;
  showHeaderInFullscreenMinimal: Readonly<Ref<boolean>>;
  isBrowserFullscreenActive: Readonly<Ref<boolean>>;
  isCurrentThemeDark: Readonly<Ref<boolean>>;
  currentThemeId: Readonly<Ref<string>>;
  theme: Readonly<Ref<ReturnType<typeof themeManager.getCurrentTheme> extends Ref<infer T> ? T : unknown>>; // legacy
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
}

type FullUiStore = UiState & UiActions;

export const useUiStore = defineStore('ui', (): FullUiStore => {
  // -------------------------------------------------------------------------
  // Fullscreen state
  // -------------------------------------------------------------------------
  const _isFullscreen = ref(false);
  const _showHeaderInFullscreenMinimal = ref(false);
  const _isBrowserFullscreenActive = ref<boolean>(typeof document !== 'undefined' && !!document.fullscreenElement);

  // -------------------------------------------------------------------------
  // Theme derived state
  // -------------------------------------------------------------------------
  const theme = themeManager.getCurrentTheme(); // ← expose directly
  const isCurrentThemeDark = computed(() => theme.value?.isDark ?? false);
  const currentThemeId     = computed(() => theme.value?.id ?? DEFAULT_DARK_THEME_ID);

  const isDarkMode  = computed(() => isCurrentThemeDark.value);
  const isLightMode = computed(() => !isCurrentThemeDark.value);

  // -------------------------------------------------------------------------
  // Fullscreen helpers (unchanged)
  // -------------------------------------------------------------------------
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
    setFullscreen(active);
  };

  const initializeUiState = () => {
    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', _handleFsChange);
      document.addEventListener('webkitfullscreenchange', _handleFsChange);
      document.addEventListener('mozfullscreenchange', _handleFsChange);
      document.addEventListener('MSFullscreenChange', _handleFsChange);
    }
  };

  // -------------------------------------------------------------------------
  // Theme helpers
  // -------------------------------------------------------------------------
  const setTheme = (id: string) => {
    if (id === 'dark')       themeManager.setTheme(DEFAULT_DARK_THEME_ID);
    else if (id === 'light') themeManager.setTheme(DEFAULT_LIGHT_THEME_ID);
    else                     themeManager.setTheme(id);
  };
  const setDarkMode = (flag: boolean) => setTheme(flag ? 'dark' : 'light');

  // -------------------------------------------------------------------------
  return {
    isFullscreen: readonly(_isFullscreen),
    showHeaderInFullscreenMinimal: readonly(_showHeaderInFullscreenMinimal),
    isBrowserFullscreenActive: readonly(_isBrowserFullscreenActive),
    isCurrentThemeDark,
    currentThemeId,
    theme: readonly(theme), // legacy getter so Settings.vue compiles
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
  };
});