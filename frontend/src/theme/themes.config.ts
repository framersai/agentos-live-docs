// File: frontend/src/theme/themes.config.ts
/**
 * @file themes.config.ts
 * @description Defines the structure and CSS custom property values for all available application themes.
 * This configuration is used by the ThemeManager to dynamically apply themes and can inform
 * SCSS theme maps for a unified design token strategy.
 * @version 2.0.0
 */

/**
 * @interface ThemeCssVariableMap
 * @description A comprehensive map of all CSS custom properties that can be controlled by a theme.
 * Each property name should start with '--color-' for colors, '--font-' for typography, etc.
 * This ensures consistency and helps in managing theme overrides.
 */
export interface ThemeCssVariableMap {
  // Background Colors
  '--color-bg-primary-h': string; '--color-bg-primary-s': string; '--color-bg-primary-l': string;
  '--color-bg-secondary-h': string; '--color-bg-secondary-s': string; '--color-bg-secondary-l': string;
  '--color-bg-tertiary-h': string; '--color-bg-tertiary-s': string; '--color-bg-tertiary-l': string;
  '--color-bg-glass-h': string; '--color-bg-glass-s': string; '--color-bg-glass-l': string; '--color-bg-glass-a': string;
  '--color-border-glass-h': string; '--color-border-glass-s': string; '--color-border-glass-l': string; '--color-border-glass-a': string;
  '--blur-glass': string;

  // Text Colors
  '--color-text-primary-h': string; '--color-text-primary-s': string; '--color-text-primary-l': string;
  '--color-text-secondary-h': string; '--color-text-secondary-s': string; '--color-text-secondary-l': string;
  '--color-text-muted-h': string; '--color-text-muted-s': string; '--color-text-muted-l': string;
  '--color-text-on-primary-h': string; '--color-text-on-primary-s': string; '--color-text-on-primary-l': string; // For text on primary accent bg
  '--color-text-on-secondary-h': string; '--color-text-on-secondary-s': string; '--color-text-on-secondary-l': string; // For text on secondary accent bg

  // Accent Colors
  '--color-accent-primary-h': string; '--color-accent-primary-s': string; '--color-accent-primary-l': string;
  '--color-accent-secondary-h': string; '--color-accent-secondary-s': string; '--color-accent-secondary-l': string;
  '--color-accent-glow-h': string; '--color-accent-glow-s': string; '--color-accent-glow-l': string; '--color-accent-glow-a': string;

  // Border Colors
  '--color-border-primary-h': string; '--color-border-primary-s': string; '--color-border-primary-l': string;
  '--color-border-translucent-h': string; '--color-border-translucent-s': string; '--color-border-translucent-l': string; '--color-border-translucent-a': string;

  // Shadow Configuration (Opacity and base color for neomorphism)
  '--shadow-color-h': string; '--shadow-color-s': string; '--shadow-color-l': string; // Base color for shadows
  '--shadow-highlight-modifier': string; // e.g., '+20%' for lightness of highlight part of neo shadow
  '--shadow-opacity-soft': string; // For soft neomorphic effect
  '--shadow-opacity-deep': string; // For deeper neomorphic effect or standard depth shadows

  // Voice Visualization Colors
  '--color-voice-user-h': string; '--color-voice-user-s': string; '--color-voice-user-l': string;
  '--color-voice-ai-h': string; '--color-voice-ai-s': string; '--color-voice-ai-l': string;
  '--voice-pulse-opacity': string;

  // Semantic Colors
  '--color-info-h': string; '--color-info-s': string; '--color-info-l': string;
  '--color-success-h': string; '--color-success-s': string; '--color-success-l': string;
  '--color-warning-h': string; '--color-warning-s': string; '--color-warning-l': string;
  '--color-error-h': string; '--color-error-s': string; '--color-error-l': string;

  // Font specific to theme (optional overrides)
  // '--font-display-theme'?: string;
}

/**
 * @interface ThemeDefinition
 * @description Defines the structure for a single theme.
 * @property {string} id - A unique machine-readable identifier for the theme (e.g., "warm-embrace").
 * @property {string} name - A human-readable name for the theme (e.g., "Warm Embrace").
 * @property {boolean} isDark - Indicates if the theme is predominantly dark.
 * @property {Partial<ThemeCssVariableMap>} cssVariables - An object containing key-value pairs for CSS custom properties.
 * HSL components are provided separately for H, S, and L.
 */
export interface ThemeDefinition {
  id: string;
  name: string;
  isDark: boolean;
  cssVariables: Partial<ThemeCssVariableMap>;
}

export const availableThemes: ThemeDefinition[] = [
  {
    id: 'warm-embrace', // DEFAULT THEME
    name: 'Warm Embrace',
    isDark: false, // Or could be a warm dark theme, let's start with light-ish warm
    cssVariables: {
      // Backgrounds: Warm off-whites, soft peach/creams
      '--color-bg-primary-h': '35', '--color-bg-primary-s': '70%', '--color-bg-primary-l': '96%', // Very light peach
      '--color-bg-secondary-h': '30', '--color-bg-secondary-s': '60%', '--color-bg-secondary-l': '92%', // Soft cream for cards
      '--color-bg-tertiary-h': '25', '--color-bg-tertiary-s': '50%', '--color-bg-tertiary-l': '88%', // Slightly deeper cream
      '--color-bg-glass-h': '30', '--color-bg-glass-s': '60%', '--color-bg-glass-l': '92%', '--color-bg-glass-a': '0.7',
      '--color-border-glass-h': '30', '--color-border-glass-s': '50%', '--color-border-glass-l': '85%', '--color-border-glass-a': '0.5',
      '--blur-glass': '10px',

      // Text: Dark, warm grays or desaturated browns
      '--color-text-primary-h': '30', '--color-text-primary-s': '20%', '--color-text-primary-l': '25%', // Dark warm gray
      '--color-text-secondary-h': '30', '--color-text-secondary-s': '15%', '--color-text-secondary-l': '40%',
      '--color-text-muted-h': '30', '--color-text-muted-s': '12%', '--color-text-muted-l': '55%',
      '--color-text-on-primary-h': '30', '--color-text-on-primary-s': '30%', '--color-text-on-primary-l': '15%', // For text on warm accent
      '--color-text-on-secondary-h': '25', '--color-text-on-secondary-s': '25%', '--color-text-on-secondary-l': '20%',

      // Accents: Soft terracotta, muted gold, gentle teal
      '--color-accent-primary-h': '25', '--color-accent-primary-s': '75%', '--color-accent-primary-l': '65%', // Muted terracotta/coral
      '--color-accent-secondary-h': '45', '--color-accent-secondary-s': '70%', '--color-accent-secondary-l': '60%', // Muted gold
      '--color-accent-glow-h': '25', '--color-accent-glow-s': '80%', '--color-accent-glow-l': '70%', '--color-accent-glow-a': '0.4',

      // Borders
      '--color-border-primary-h': '30', '--color-border-primary-s': '30%', '--color-border-primary-l': '80%',
      '--color-border-translucent-h': '30', '--color-border-translucent-s': '30%', '--color-border-translucent-l': '50%', '--color-border-translucent-a': '0.15',

      // Shadows
      '--shadow-color-h': '30', '--shadow-color-s': '20%', '--shadow-color-l': '40%', // Base for neomorphic shadows
      '--shadow-highlight-modifier': '+35%', // How much lighter the highlight part of neomorphism is
      '--shadow-opacity-soft': '0.1',
      '--shadow-opacity-deep': '0.15',

      // Voice Visualization
      '--color-voice-user-h': '170', '--color-voice-user-s': '60%', '--color-voice-user-l': '65%', // Soft Teal
      '--color-voice-ai-h': '40', '--color-voice-ai-s': '80%', '--color-voice-ai-l': '70%',   // Soft Gold/Amber
      '--voice-pulse-opacity': '0.6',

      // Semantic Colors (warm-toned)
      '--color-info-h': '190', '--color-info-s': '70%', '--color-info-l': '60%', // Soft blue
      '--color-success-h': '100', '--color-success-s': '50%', '--color-success-l': '55%', // Muted green
      '--color-warning-h': '35', '--color-warning-s': '80%', '--color-warning-l': '60%', // Orange
      '--color-error-h': '5', '--color-error-s': '70%', '--color-error-l': '60%', // Soft red
    },
  },
  {
    id: 'twilight-neo',
    name: 'Twilight Neo',
    isDark: true,
    cssVariables: {
      '--color-bg-primary-h': '225', '--color-bg-primary-s': '30%', '--color-bg-primary-l': '7%',
      '--color-bg-secondary-h': '225', '--color-bg-secondary-s': '25%', '--color-bg-secondary-l': '12%',
      '--color-bg-tertiary-h': '225', '--color-bg-tertiary-s': '20%', '--color-bg-tertiary-l': '16%',
      '--color-bg-glass-h': '225', '--color-bg-glass-s': '25%', '--color-bg-glass-l': '12%', '--color-bg-glass-a': '0.55',
      '--color-border-glass-h': '210', '--color-border-glass-s': '30%', '--color-border-glass-l': '30%', '--color-border-glass-a': '0.3',
      '--blur-glass': '12px',

      '--color-text-primary-h': '210', '--color-text-primary-s': '30%', '--color-text-primary-l': '92%',
      '--color-text-secondary-h': '210', '--color-text-secondary-s': '25%', '--color-text-secondary-l': '75%',
      '--color-text-muted-h': '210', '--color-text-muted-s': '20%', '--color-text-muted-l': '60%',
      '--color-text-on-primary-h': '210', '--color-text-on-primary-s': '50%', '--color-text-on-primary-l': '95%',
      '--color-text-on-secondary-h': '220', '--color-text-on-secondary-s': '20%', '--color-text-on-secondary-l': '15%',

      '--color-accent-primary-h': '180', '--color-accent-primary-s': '90%', '--color-accent-primary-l': '60%', // Cyan
      '--color-accent-secondary-h': '300', '--color-accent-secondary-s': '90%', '--color-accent-secondary-l': '65%', // Magenta
      '--color-accent-glow-h': '180', '--color-accent-glow-s': '90%', '--color-accent-glow-l': '60%', '--color-accent-glow-a': '0.45',

      '--color-border-primary-h': '210', '--color-border-primary-s': '20%', '--color-border-primary-l': '28%',
      '--color-border-translucent-h': '210', '--color-border-translucent-s': '25%', '--color-border-translucent-l': '70%', '--color-border-translucent-a': '0.08',

      '--shadow-color-h': '225', '--shadow-color-s': '30%', '--shadow-color-l': '5%',
      '--shadow-highlight-modifier': '+10%', // Dark themes need less aggressive highlights for neomorphism
      '--shadow-opacity-soft': '0.25', // Shadows can be more pronounced on dark
      '--shadow-opacity-deep': '0.35',

      '--color-voice-user-h': '270', '--color-voice-user-s': '90%', '--color-voice-user-l': '70%', // Purple
      '--color-voice-ai-h': '180', '--color-voice-ai-s': '90%', '--color-voice-ai-l': '60%',   // Cyan
      '--voice-pulse-opacity': '0.75',

      '--color-info-h': '190', '--color-info-s': '80%', '--color-info-l': '65%',
      '--color-success-h': '145', '--color-success-s': '70%', '--color-success-l': '55%',
      '--color-warning-h': '40', '--color-warning-s': '95%', '--color-warning-l': '60%',
      '--color-error-h': '0', '--color-error-s': '85%', '--color-error-l': '62%',
    },
  },
  {
    id: 'aurora-daybreak',
    name: 'Aurora Daybreak',
    isDark: false,
    cssVariables: {
      '--color-bg-primary-h': '210', '--color-bg-primary-s': '60%', '--color-bg-primary-l': '98%',
      '--color-bg-secondary-h': '200', '--color-bg-secondary-s': '50%', '--color-bg-secondary-l': '95%', // e.g. cards
      '--color-bg-tertiary-h': '190', '--color-bg-tertiary-s': '40%', '--color-bg-tertiary-l': '92%',
      '--color-bg-glass-h': '200', '--color-bg-glass-s': '50%', '--color-bg-glass-l': '95%', '--color-bg-glass-a': '0.6',
      '--color-border-glass-h': '200', '--color-border-glass-s': '40%', '--color-border-glass-l': '90%', '--color-border-glass-a': '0.4',
      '--blur-glass': '8px',

      '--color-text-primary-h': '220', '--color-text-primary-s': '30%', '--color-text-primary-l': '25%', // Dark desaturated blue
      '--color-text-secondary-h': '220', '--color-text-secondary-s': '25%', '--color-text-secondary-l': '45%',
      '--color-text-muted-h': '220', '--color-text-muted-s': '20%', '--color-text-muted-l': '60%',
      '--color-text-on-primary-h': '220', '--color-text-on-primary-s': '40%', '--color-text-on-primary-l': '15%',
      '--color-text-on-secondary-h': '220', '--color-text-on-secondary-s': '30%', '--color-text-on-secondary-l': '20%',

      // Accents: Pastel holographic - soft pink, lavender, mint
      '--color-accent-primary-h': '330', '--color-accent-primary-s': '80%', '--color-accent-primary-l': '75%', // Soft Pink
      '--color-accent-secondary-h': '260', '--color-accent-secondary-s': '70%', '--color-accent-secondary-l': '80%', // Soft Lavender
      '--color-accent-glow-h': '330', '--color-accent-glow-s': '80%', '--color-accent-glow-l': '80%', '--color-accent-glow-a': '0.35',

      '--color-border-primary-h': '210', '--color-border-primary-s': '30%', '--color-border-primary-l': '85%',
      '--color-border-translucent-h': '210', '--color-border-translucent-s': '30%', '--color-border-translucent-l': '70%', '--color-border-translucent-a': '0.2',

      '--shadow-color-h': '210', '--shadow-color-s': '30%', '--shadow-color-l': '50%',
      '--shadow-highlight-modifier': '+40%',
      '--shadow-opacity-soft': '0.08',
      '--shadow-opacity-deep': '0.12',

      '--color-voice-user-h': '260', '--color-voice-user-s': '70%', '--color-voice-user-l': '75%', // Soft Lavender for user
      '--color-voice-ai-h': '160', '--color-voice-ai-s': '60%', '--color-voice-ai-l': '70%',   // Soft Mint for AI
      '--voice-pulse-opacity': '0.5',

      '--color-info-h': '190', '--color-info-s': '75%', '--color-info-l': '65%',
      '--color-success-h': '140', '--color-success-s': '60%', '--color-success-l': '60%',
      '--color-warning-h': '40', '--color-warning-s': '85%', '--color-warning-l': '65%',
      '--color-error-h': '0', '--color-error-s': '75%', '--color-error-l': '68%',
    },
  },
  // Add more themes like "Nebula", "Cyberpunk Glow", etc. here later
];