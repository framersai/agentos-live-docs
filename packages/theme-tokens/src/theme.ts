/**
 * @file src/theme.ts
 * @description Cross-app theme helper for AgentOS surfaces. Applies a theme by setting
 * the html[data-theme] attribute, toggling the dark class, and updating the color-scheme
 * property. This integrates cleanly with Tailwind (darkMode: 'class') and with SCSS/CSS
 * variable token contracts across frameworks.
 *
 * Internal-only: This package is private to the monorepo and must not be published
 * to npm or mirrored to public repositories.
 */

/**
 * Theme identifier used across AgentOS apps.
 * Examples: 'sakura-sunset', 'twilight-neo', 'aurora-daybreak', 'warm-embrace', 'terminus-dark', 'terminus-light'
 */
export type ThemeId = string;

/**
 * Describes minimal metadata needed to apply a theme consistently.
 */
export interface ThemeMeta {
  /**
   * Whether this theme is considered dark for system features like color-scheme,
   * and Tailwind's dark variant via the html.dark class.
   */
  isDark: boolean;
}

/**
 * Applies theme semantics in a framework-agnostic way.
 *
 * - Sets html[data-theme="<id>"] so CSS variables can be provided per theme
 * - Toggles html.dark class for Tailwind (darkMode: 'class')
 * - Updates html.style.colorScheme for native form controls and UA styling
 *
 * This does NOT mutate any CSS variables directly; token values should come from CSS rules
 * bound to [data-theme="<id>"] or app-specific SCSS that defines the same custom properties.
 *
 * @param id - The canonical theme identifier
 * @param meta - Minimal theme metadata (isDark)
 */
export function applyThemeAttributes(id: ThemeId, meta: ThemeMeta): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', id);

  const shouldUseDark = !!meta?.isDark;
  root.classList.toggle('dark', shouldUseDark);
  root.style.colorScheme = shouldUseDark ? 'dark' : 'light';
}

/**
 * Reads a stored theme id from localStorage.
 * @param storageKey - The key used to persist the theme id
 */
export function getStoredThemeId(storageKey: string): string | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

/**
 * Persists the current theme id to localStorage.
 * @param storageKey - The key used to persist the theme id
 * @param id - The theme id to store
 */
export function storeThemeId(storageKey: string, id: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(storageKey, id);
  } catch {
    // ignore
  }
}

/**
 * Returns true if the system prefers a dark color scheme.
 */
export function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Applies a theme immediately and optionally persists it.
 * @param id - Theme id
 * @param meta - Theme metadata
 * @param storageKey - Optional storage key to persist user selection
 */
export function setTheme(id: ThemeId, meta: ThemeMeta, storageKey?: string): void {
  applyThemeAttributes(id, meta);
  if (storageKey) storeThemeId(storageKey, id);
}

/**
 * Initializes theme on first load:
 * - Tries stored id
 * - Else falls back to provided dark/light defaults based on system preference
 * - Applies attributes accordingly
 *
 * @param options - Initialization options
 * @returns The applied theme id
 */
export function initializeTheme(options: {
  storageKey?: string;
  defaults: { dark: { id: ThemeId }, light: { id: ThemeId } };
  registry: Record<ThemeId, ThemeMeta>;
}): ThemeId {
  const { storageKey, defaults, registry } = options;
  const stored = storageKey ? getStoredThemeId(storageKey) : null;
  const preferredId =
    (stored && registry[stored] ? stored : (systemPrefersDark() ? defaults.dark.id : defaults.light.id));
  const meta = registry[preferredId] ?? { isDark: systemPrefersDark() };
  applyThemeAttributes(preferredId, meta);
  return preferredId;
}

/**
 * Convenience helper to update only the dark class and color-scheme based on a ThemeId.
 * Useful if your CSS variables are already being set elsewhere (e.g., SCSS theme engine).
 */
export function syncDarkClassFromRegistry(id: ThemeId, registry: Record<ThemeId, ThemeMeta>): void {
  const meta = registry[id];
  if (!meta) return;
  applyThemeAttributes(id, meta);
}

