// File: frontend/src/theme/ThemeManager.ts
/**
 * Central theme controller for Ephemeral Harmony.
 *  - Persists the selected theme to localStorage
 *  - Falls back to the user’s system dark-mode preference if they’ve never picked
 *  - Exposes a tiny API the rest of the app can consume.
 * v2.2.0  (2025-05-27)
 */
import { ref, readonly, watch, type Ref } from 'vue';
import { useStorage, usePreferredDark } from '@vueuse/core';
import { availableThemes, type ThemeDefinition } from './themes.config';
export type { ThemeDefinition } from './themes.config';
// ---------------------------------------------------------------------------
// “Constants” the whole app may import
// (⚠️  IDs **must** match the SCSS maps: $theme-twilight-neo, etc.)
// ---------------------------------------------------------------------------
export const DEFAULT_THEME_ID       = 'warm-embrace';
export const DEFAULT_DARK_THEME_ID  = 'twilight-neo';
export const DEFAULT_LIGHT_THEME_ID = 'aurora-daybreak';

// ---------------------------------------------------------------------------
// Local reactive state
// ---------------------------------------------------------------------------
const THEME_STORAGE_KEY = 'vca-ephemeral-harmony-theme-v2';

const isSystemDark    = usePreferredDark();
const storedThemeId   = useStorage<string | null>(THEME_STORAGE_KEY, null);

const _currentThemeId: Ref<string>                    = ref(DEFAULT_THEME_ID);
const _currentTheme : Ref<ThemeDefinition | undefined> = ref(
  availableThemes.find(t => t.id === DEFAULT_THEME_ID),
);

const _userHasManuallySelected = ref(storedThemeId.value !== null);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function applyTheme(themeId: string, isUserChoice = false) {
  const match = availableThemes.find(t => t.id === themeId);

  if (!match) {
    console.warn(
      `[ThemeManager] Unknown theme “${themeId}”. Falling back to “${DEFAULT_THEME_ID}”.`,
    );
    return applyTheme(DEFAULT_THEME_ID, isUserChoice);
  }

  document.documentElement.setAttribute('data-theme', match.id);
  document.documentElement.style.colorScheme = match.isDark ? 'dark' : 'light';

  _currentThemeId.value  = match.id;
  _currentTheme.value    = match;

  if (isUserChoice) {
    storedThemeId.value           = match.id;
    _userHasManuallySelected.value = true;
  }

  console.log(
    `[ThemeManager] Applied theme: ${match.name}${isUserChoice ? ' (user)' : ''}`,
  );
}

// ---------------------------------------------------------------------------
// Public actions
// ---------------------------------------------------------------------------
function setTheme(id: string) {
  applyTheme(id, true);
}

/** Accepts 'dark' | 'light' or a real theme ID */
function setThemeFlexible(idOrMode: string) {
  if (idOrMode === 'dark')  return setTheme(DEFAULT_DARK_THEME_ID);
  if (idOrMode === 'light') return setTheme(DEFAULT_LIGHT_THEME_ID);
  setTheme(idOrMode);
}

// ---------------------------------------------------------------------------
// One-time initialise (call from main.ts / App.vue)
// ---------------------------------------------------------------------------
function initialize() {
  if (storedThemeId.value && availableThemes.some(t => t.id === storedThemeId.value)) {
    applyTheme(storedThemeId.value, true); // user’s previous choice
  } else {
    applyTheme(isSystemDark.value ? DEFAULT_DARK_THEME_ID : DEFAULT_LIGHT_THEME_ID);
  }

  // Auto-switch with the OS – but ONLY if the user hasn’t made a choice yet
  watch(isSystemDark, prefersDark => {
    if (!_userHasManuallySelected.value) {
      applyTheme(prefersDark ? DEFAULT_DARK_THEME_ID : DEFAULT_LIGHT_THEME_ID);
    }
  });

  console.log(`[ThemeManager] Ready. Active theme = ${_currentThemeId.value}`);
}

// ---------------------------------------------------------------------------
// Read-only getters the UI can use
// ---------------------------------------------------------------------------
const getCurrentTheme    = (): Readonly<Ref<ThemeDefinition | undefined>> => readonly(_currentTheme);
const getCurrentThemeId  = (): Readonly<Ref<string>>                      => readonly(_currentThemeId);
const getAvailableThemes = (): ReadonlyArray<ThemeDefinition>             => readonly(availableThemes);

// ---------------------------------------------------------------------------
// Export the singleton
// ---------------------------------------------------------------------------
export const themeManager = {
  initialize,
  setTheme,              // explicit choice
  setThemeFlexible,      // quick helper (“dark” / “light” / id)
  getCurrentTheme,
  getCurrentThemeId,
  getAvailableThemes,
  isSystemDark: readonly(isSystemDark),
  hasUserManuallySelectedTheme: readonly(_userHasManuallySelected),
};
