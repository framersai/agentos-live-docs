// File: frontend/src/theme/ThemeManager.ts
/**
 * Central theme controller for Ephemeral Harmony.
 * @version 2.3.0 - Default theme set to Magenta Mystic.
 */
import { ref, readonly, watch, type Ref } from 'vue';
import { useStorage, usePreferredDark } from '@vueuse/core';
import { availableThemes, type ThemeDefinition } from './themes.config';
export type { ThemeDefinition } from './themes.config';

// New Default Theme ID
export const DEFAULT_THEME_ID = 'magenta-mystic'; // <-- UPDATED
export const DEFAULT_DARK_THEME_ID = 'magenta-mystic'; // <-- UPDATED (as Magenta Mystic is dark)
export const DEFAULT_LIGHT_THEME_ID = 'aurora-daybreak'; // Stays as the default light option

const THEME_STORAGE_KEY = 'vca-ephemeral-harmony-theme-v2.1'; // Incremented key for fresh start if needed

const isSystemDark = usePreferredDark();
const storedThemeId = useStorage<string | null>(THEME_STORAGE_KEY, null);

const _currentThemeId: Ref<string> = ref(DEFAULT_THEME_ID);
const _currentTheme : Ref<ThemeDefinition | undefined> = ref(
  availableThemes.find(t => t.id === DEFAULT_THEME_ID),
);
const _userHasManuallySelected = ref(storedThemeId.value !== null);

function applyTheme(themeId: string, isUserChoice = false) {
  const match = availableThemes.find(t => t.id === themeId);
  const fallbackId = isSystemDark.value ? DEFAULT_DARK_THEME_ID : DEFAULT_LIGHT_THEME_ID;
  const themeToApply = match || availableThemes.find(t => t.id === fallbackId) || availableThemes.find(t => t.id === DEFAULT_THEME_ID)!;


  if (!match && themeId !== fallbackId) {
     console.warn(
       `[ThemeManager] Unknown theme “${themeId}”. Falling back to system preference or default: "${themeToApply.id}".`,
     );
  }
  
  document.documentElement.setAttribute('data-theme', themeToApply.id);
  document.documentElement.style.colorScheme = themeToApply.isDark ? 'dark' : 'light';

  _currentThemeId.value = themeToApply.id;
  _currentTheme.value   = themeToApply;

  if (isUserChoice) {
    storedThemeId.value = themeToApply.id;
    _userHasManuallySelected.value = true;
  }
  console.log(`[ThemeManager] Applied theme: ${themeToApply.name}${isUserChoice ? ' (user choice)' : ''}`);
}

function setTheme(id: string) {
  applyTheme(id, true);
}

function setThemeFlexible(idOrMode: string) {
  if (idOrMode === 'dark')  return setTheme(DEFAULT_DARK_THEME_ID);
  if (idOrMode === 'light') return setTheme(DEFAULT_LIGHT_THEME_ID);
  // Check if idOrMode is a valid theme ID from availableThemes
  if (availableThemes.some(theme => theme.id === idOrMode)) {
    setTheme(idOrMode);
  } else {
    console.warn(`[ThemeManager] setThemeFlexible: Unknown theme ID or mode "${idOrMode}". Applying default.`);
    // Fallback to default if idOrMode is not 'dark', 'light', or a known theme id
    applyTheme(DEFAULT_THEME_ID, true);
  }
}

function initialize() {
  let initialThemeId = DEFAULT_THEME_ID; // Start with the new default

  if (storedThemeId.value && availableThemes.some(t => t.id === storedThemeId.value)) {
    initialThemeId = storedThemeId.value; // User's previous choice
    _userHasManuallySelected.value = true;
  } else {
    initialThemeId = isSystemDark.value ? DEFAULT_DARK_THEME_ID : DEFAULT_LIGHT_THEME_ID;
    _userHasManuallySelected.value = false;
  }
  applyTheme(initialThemeId, _userHasManuallySelected.value);

  watch(isSystemDark, prefersDark => {
    if (!_userHasManuallySelected.value) {
      applyTheme(prefersDark ? DEFAULT_DARK_THEME_ID : DEFAULT_LIGHT_THEME_ID);
    }
  });
  console.log(`[ThemeManager] Initialized. Active theme = ${_currentThemeId.value}`);
}

const getCurrentTheme = (): Readonly<Ref<ThemeDefinition | undefined>> => readonly(_currentTheme);
const getCurrentThemeId = (): Readonly<Ref<string>> => readonly(_currentThemeId);
const getAvailableThemes = (): ReadonlyArray<ThemeDefinition> => readonly(availableThemes);

export const themeManager = {
  initialize,
  setTheme,
  setThemeFlexible,
  getCurrentTheme,
  getCurrentThemeId,
  getAvailableThemes,
  isSystemDark: readonly(isSystemDark),
  hasUserManuallySelectedTheme: readonly(_userHasManuallySelected),
};