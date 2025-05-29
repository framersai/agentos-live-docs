// File: frontend/src/theme/themes.config.ts
/**
 * @file themes.config.ts
 * @description Defines the TypeScript interfaces, array of available theme definitions,
 * and default theme ID constants for the "Ephemeral Harmony" application.
 * This configuration is used by the ThemeManager to understand and apply themes.
 *
 * @role Provides type safety, a structured list of themes, and centralizes default theme IDs.
 * @dependencies None directly, but is imported by ThemeManager.ts and potentially UI components.
 * @assumptions Theme IDs and `isDark` properties here must align with SCSS definitions.
 * @version 3.0.2 - Ensured all DEFAULT theme IDs are exported from this file.
 */

// Define and export default theme IDs as the single source of truth.
/** @const {string} DEFAULT_OVERALL_THEME_ID - The primary default theme for the application. */
export const DEFAULT_OVERALL_THEME_ID = 'sakura-sunset'; // "Her"-inspired pink theme

/** @const {string} DEFAULT_DARK_THEME_ID - The default theme to use when system preference is dark. */
export const DEFAULT_DARK_THEME_ID = 'sakura-sunset';    // Explicit default dark

/** @const {string} DEFAULT_LIGHT_THEME_ID - The default theme to use when system preference is light. */
export const DEFAULT_LIGHT_THEME_ID = 'aurora-daybreak'; // Explicit default light


/**
 * @interface ThemeCssVariableMap
 * @description Defines the comprehensive map of CSS custom properties controlled by the theme system.
 * All HSL (Hue, Saturation, Lightness) components should be represented as strings (e.g., '270' for hue,
 * '100%' for saturation/lightness). Alpha values are also strings (e.g., '0.5').
 * Other CSS values like durations or sizes should be strings with their appropriate units (e.g., '10px', '0.5s').
 */
export interface ThemeCssVariableMap {
  // Background Colors
  '--color-bg-primary-h': string; '--color-bg-primary-s': string; '--color-bg-primary-l': string;
  '--color-bg-secondary-h': string; '--color-bg-secondary-s': string; '--color-bg-secondary-l': string;
  '--color-bg-tertiary-h': string; '--color-bg-tertiary-s': string; '--color-bg-tertiary-l': string;
  '--color-bg-quaternary-h'?: string; '--color-bg-quaternary-s'?: string; '--color-bg-quaternary-l'?: string;
  '--color-bg-quinary-h'?: string; '--color-bg-quinary-s'?: string; '--color-bg-quinary-l'?: string;
  '--color-bg-senary-h'?: string; '--color-bg-senary-s'?: string; '--color-bg-senary-l'?: string;

  '--color-bg-glass-h': string; '--color-bg-glass-s': string; '--color-bg-glass-l': string; '--color-bg-glass-a': string;
  '--color-border-glass-h': string; '--color-border-glass-s': string; '--color-border-glass-l': string; '--color-border-glass-a': string;
  '--blur-glass': string;
  '--color-bg-holographic-accent-h'?: string; '--color-bg-holographic-accent-s'?: string; '--color-bg-holographic-accent-l'?: string; '--color-bg-holographic-accent-a'?: string;

  // Text Colors
  '--color-text-primary-h': string; '--color-text-primary-s': string; '--color-text-primary-l': string;
  '--color-text-secondary-h': string; '--color-text-secondary-s': string; '--color-text-secondary-l': string;
  '--color-text-muted-h': string; '--color-text-muted-s': string; '--color-text-muted-l': string;
  '--color-text-on-primary-h': string; '--color-text-on-primary-s': string; '--color-text-on-primary-l': string;
  '--color-text-on-secondary-h': string; '--color-text-on-secondary-s': string; '--color-text-on-secondary-l': string;
  '--color-text-accent-h'?: string; '--color-text-accent-s'?: string; '--color-text-accent-l'?: string;

  // Accent Colors
  '--color-accent-primary-h': string; '--color-accent-primary-s': string; '--color-accent-primary-l': string;
  '--color-accent-primary-light-h'?: string; '--color-accent-primary-light-s'?: string; '--color-accent-primary-light-l'?: string;
  '--color-accent-primary-dark-h'?: string; '--color-accent-primary-dark-s'?: string; '--color-accent-primary-dark-l'?: string;
  '--color-accent-secondary-h': string; '--color-accent-secondary-s': string; '--color-accent-secondary-l': string;
  '--color-accent-interactive-h': string; '--color-accent-interactive-s': string; '--color-accent-interactive-l': string;
  '--color-accent-glow-h': string; '--color-accent-glow-s': string; '--color-accent-glow-l': string; '--color-accent-glow-a': string;

  // Logo Specific Accent Colors
  '--color-logo-primary-h'?: string; '--color-logo-primary-s'?: string; '--color-logo-primary-l'?: string;
  '--color-logo-secondary-h'?: string; '--color-logo-secondary-s'?: string; '--color-logo-secondary-l'?: string;
  '--color-logo-main-text-h'?: string; '--color-logo-main-text-s'?: string; '--color-logo-main-text-l'?: string;
  '--color-logo-subtitle-text-h'?: string; '--color-logo-subtitle-text-s'?: string; '--color-logo-subtitle-text-l'?: string;

  // Border Colors
  '--color-border-primary-h': string; '--color-border-primary-s': string; '--color-border-primary-l': string; '--color-border-primary-a'?: string;
  '--color-border-secondary-h': string; '--color-border-secondary-s': string; '--color-border-secondary-l': string; '--color-border-secondary-a'?: string;
  '--color-border-interactive-h': string; '--color-border-interactive-s': string; '--color-border-interactive-l': string; '--color-border-interactive-a'?: string;
  '--color-border-translucent-h': string; '--color-border-translucent-s': string; '--color-border-translucent-l': string; '--color-border-translucent-a': string;

  // Shadow Configuration
  '--shadow-color-h': string; '--shadow-color-s': string; '--shadow-color-l': string;
  '--shadow-highlight-modifier': string;
  '--shadow-opacity-soft': string;
  '--shadow-opacity-medium': string;
  '--shadow-opacity-strong'?: string;
  '--shadow-opacity-deep': string;

  // Voice Visualization Colors
  '--color-voice-user-h': string; '--color-voice-user-s': string; '--color-voice-user-l': string;
  '--color-voice-ai-speaking-h': string; '--color-voice-ai-speaking-s': string; '--color-voice-ai-speaking-l': string;
  '--color-voice-ai-h'?: string; '--color-voice-ai-s'?: string; '--color-voice-ai-l'?: string;
  '--color-voice-ai-thinking-h': string; '--color-voice-ai-thinking-s': string; '--color-voice-ai-thinking-l': string;
  '--voice-pulse-opacity': string;

  // Semantic Colors
  '--color-info-h': string; '--color-info-s': string; '--color-info-l': string;
  '--color-success-h': string; '--color-success-s': string; '--color-success-l': string;
  '--color-warning-h': string; '--color-warning-s': string; '--color-warning-l': string;
  '--color-error-h': string; '--color-error-s': string; '--color-error-l': string;
  '--color-error-text-h'?: string; '--color-error-text-s'?: string; '--color-error-text-l'?: string;

  // Code Block Theming
  '--color-bg-code-block-h'?: string; '--color-bg-code-block-s'?: string; '--color-bg-code-block-l'?: string;
  '--color-text-code-block-h'?: string; '--color-text-code-block-s'?: string; '--color-text-code-block-l'?: string;

  // Background Patterns/Effects
  '--bg-holo-grid-pattern'?: string;
  '--bg-holo-grid-size'?: string;
  '--bg-holo-grid-opacity'?: string;
  '--bg-noise-texture'?: string;
  '--bg-noise-size'?: string;
  '--bg-noise-opacity'?: string;
  '--bg-main-content-pattern'?: string;
  '--bg-main-content-pattern-size'?: string;
  '--bg-main-content-pattern-repeat'?: string;
  '--bg-main-content-opacity'?: string;

  // Specific Agent Accent Colors
  '--agent-interviewer-accent-hue'?: string;
  '--agent-interviewer-accent-saturation'?: string;
  '--agent-interviewer-accent-lightness'?: string;
  '--agent-nerf-accent-hue'?: string;
  '--agent-nerf-accent-saturation'?: string;
  '--agent-nerf-accent-lightness'?: string;
  '--agent-nerf-accent-color'?: string;
  '--agent-architecton-accent-hue'?: string;
  '--agent-architecton-accent-saturation'?: string;
  '--agent-architecton-accent-lightness'?: string;
  '--agent-architecton-accent-color'?: string;
}

/**
 * @interface ThemeDefinition
 * @description Defines the structure for a theme object within the application.
 */
export interface ThemeDefinition {
  /** @property {string} id - Unique identifier for the theme. */
  id: string;
  /** @property {string} name - Display name for the theme. */
  name: string;
  /** @property {boolean} isDark - Indicates if the theme is a dark theme. */
  isDark: boolean;
  /** @property {Partial<ThemeCssVariableMap>} cssVariables - A partial map of CSS custom properties for JS reference. */
  cssVariables: Partial<ThemeCssVariableMap>;
}

/**
 * @const availableThemes
 * @description Array of all available theme definitions for the application.
 */
export const availableThemes: readonly ThemeDefinition[] = [
  {
    id: 'sakura-sunset',
    name: 'Sakura Sunset',
    isDark: true,
    cssVariables: {
      '--color-accent-primary-h': '0', '--color-accent-primary-s': '85%', '--color-accent-primary-l': '70%',
    },
  },
  {
    id: 'twilight-neo',
    name: 'Twilight Neo',
    isDark: true,
    cssVariables: {
      '--color-accent-primary-h': '180', '--color-accent-primary-s': '95%', '--color-accent-primary-l': '60%',
    },
  },
  {
    id: 'aurora-daybreak',
    name: 'Aurora Daybreak',
    isDark: false,
    cssVariables: {
      '--color-accent-primary-h': '330', '--color-accent-primary-s': '85%', '--color-accent-primary-l': '72%',
    },
  },
  {
    id: 'warm-embrace',
    name: 'Warm Embrace',
    isDark: false,
    cssVariables: {
      '--color-accent-primary-h': '25', '--color-accent-primary-s': '75%', '--color-accent-primary-l': '65%',
    },
  },
];