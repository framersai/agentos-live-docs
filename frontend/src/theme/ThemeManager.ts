// File: frontend/src/theme/ThemeManager.ts
/**
 * @file ThemeManager.ts
 * @description Manages application themes: initializing to a default ("Warm Embrace"),
 * respecting system preferences (light/dark), allowing user selection, and persisting choices.
 * @version 2.1.0 - Sets "Warm Embrace" as initial default, refines system preference logic.
 */

import { ref, readonly, watch, onMounted, type Ref } from 'vue';
import { useStorage, usePreferredDark } from '@vueuse/core';
import { availableThemes, type ThemeDefinition } from './themes.config';

const THEME_STORAGE_KEY = 'vca-ephemeral-harmony-theme-v2'; // Updated key
const DEFAULT_THEME_ID = 'warm-embrace';
const DEFAULT_DARK_THEME_ID = 'twilight-neo';
const DEFAULT_LIGHT_THEME_ID = 'aurora-daybreak';

// Reactive state
const isSystemDark = usePreferredDark();
const storedThemeId = useStorage<string | null>(THEME_STORAGE_KEY, null);

const _currentThemeId: Ref<string> = ref(DEFAULT_THEME_ID);
const _currentThemeDefinition: Ref<ThemeDefinition | undefined> = ref(
  availableThemes.find(t => t.id === DEFAULT_THEME_ID)
);

// Internal flag to know if user has explicitly chosen a theme
const _userHasManuallySelectedTheme = ref(storedThemeId.value !== null);

/**
 * @function applyTheme
 * @description Applies the specified theme to the document and updates reactive state.
 * @param {string} themeId - The ID of the theme to apply.
 * @param {boolean} [isUserSelection=false] - Whether this change is a direct user selection.
 * @private
 */
const _applyThemeToDocument = (themeId: string, isUserSelection: boolean = false): void => {
  const themeToApply = availableThemes.find(t => t.id === themeId);

  if (themeToApply) {
    document.documentElement.setAttribute('data-theme', themeToApply.id);
    document.documentElement.style.colorScheme = themeToApply.isDark ? 'dark' : 'light';
    _currentThemeId.value = themeToApply.id;
    _currentThemeDefinition.value = themeToApply;

    if (isUserSelection) {
      storedThemeId.value = themeToApply.id;
      _userHasManuallySelectedTheme.value = true;
    }
    console.log(`[ThemeManager] Theme applied: ${themeToApply.name}${isUserSelection ? ' (User Choice)' : ''}`);
  } else {
    console.warn(`[ThemeManager] Theme with ID "${themeId}" not found. Applying default '${DEFAULT_THEME_ID}'.`);
    _applyThemeToDocument(DEFAULT_THEME_ID, isUserSelection); // Fallback to absolute default
  }
};

/**
 * @function setTheme
 * @description Public method to set a theme, explicitly chosen by the user.
 * @param {string} themeId - The ID of the theme to set.
 */
const setTheme = (themeId: string): void => {
  _applyThemeToDocument(themeId, true);
};

/**
 * @function initializeTheme
 * @description Initializes the theme based on stored preference, then system preference, then application default.
 * Should be called once when the application mounts.
 */
const initialize = (): void => {
  if (storedThemeId.value && availableThemes.some(t => t.id === storedThemeId.value)) {
    // User has a previously stored valid theme
    _applyThemeToDocument(storedThemeId.value, true);
  } else {
    // No valid stored theme, check system preference
    _userHasManuallySelectedTheme.value = false; // Reset this flag
    const systemPrefersDark = isSystemDark.value;
    _applyThemeToDocument(systemPrefersDark ? DEFAULT_DARK_THEME_ID : DEFAULT_LIGHT_THEME_ID, false);
    // If you want "Warm Embrace" to be the absolute first-time default regardless of system:
    // _applyThemeToDocument(DEFAULT_THEME_ID, false);
    // Then the watcher below will adjust if the user *hasn't* manually picked one.
    // For now, let's try system preference first if no stored choice.
  }

  // Watch for system dark mode changes to automatically switch if user hasn't manually selected a theme
  watch(isSystemDark, (prefersDarkNow) => {
    if (!_userHasManuallySelectedTheme.value) { // Only auto-switch if user hasn't made a choice
      console.log(`[ThemeManager] System preference changed. User has not manually selected a theme. Switching...`);
      _applyThemeToDocument(prefersDarkNow ? DEFAULT_DARK_THEME_ID : DEFAULT_LIGHT_THEME_ID, false);
    }
  });
  console.log(`[ThemeManager] Initialized. Current theme: ${_currentThemeId.value}`);
};

/**
 * @function getCurrentTheme
 * @description Provides read-only access to the current theme definition.
 * @returns {Readonly<Ref<ThemeDefinition | undefined>>}
 */
const getCurrentTheme = (): Readonly<Ref<ThemeDefinition | undefined>> => readonly(_currentThemeDefinition);

/**
 * @function getCurrentThemeId
 * @description Provides read-only access to the current theme ID.
 * @returns {Readonly<Ref<string>>}
 */
const getCurrentThemeId = (): Readonly<Ref<string>> => readonly(_currentThemeId);

/**
 * @function getAvailableThemes
 * @description Provides a read-only list of all available themes.
 * @returns {ReadonlyArray<ThemeDefinition>}
 */
const getAvailableThemes = (): ReadonlyArray<ThemeDefinition> => readonly(availableThemes) as ReadonlyArray<ThemeDefinition>;


// Singleton instance of the ThemeManager
export const themeManager = {
  initialize,
  setTheme,
  getCurrentTheme,
  getCurrentThemeId,
  getAvailableThemes,
  isSystemDark: readonly(isSystemDark), // Expose for UI to indicate system preference
  hasUserManuallySelectedTheme: readonly(_userHasManuallySelectedTheme) // Expose for UI logic
};