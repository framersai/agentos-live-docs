// File: frontend/src/theme/themes.config.ts
/**
 * @file themes.config.ts
 * @description Defines application themes. "Magenta Mystic" added. "Twilight Neo" improved.
 * @version 2.1.0
 */

export interface ThemeCssVariableMap {
  // Background Colors
  '--color-bg-primary-h': string; '--color-bg-primary-s': string; '--color-bg-primary-l': string;
  '--color-bg-secondary-h': string; '--color-bg-secondary-s': string; '--color-bg-secondary-l': string;
  '--color-bg-tertiary-h': string; '--color-bg-tertiary-s': string; '--color-bg-tertiary-l': string;
  // Added for more nuanced backgrounds if needed by themes
  '--color-bg-quaternary-h'?: string; '--color-bg-quaternary-s'?: string; '--color-bg-quaternary-l'?: string;

  '--color-bg-glass-h': string; '--color-bg-glass-s': string; '--color-bg-glass-l': string; '--color-bg-glass-a': string;
  '--color-border-glass-h': string; '--color-border-glass-s': string; '--color-border-glass-l': string; '--color-border-glass-a': string;
  '--blur-glass': string;

  // Text Colors
  '--color-text-primary-h': string; '--color-text-primary-s': string; '--color-text-primary-l': string;
  '--color-text-secondary-h': string; '--color-text-secondary-s': string; '--color-text-secondary-l': string;
  '--color-text-muted-h': string; '--color-text-muted-s': string; '--color-text-muted-l': string;
  '--color-text-on-primary-h': string; '--color-text-on-primary-s': string; '--color-text-on-primary-l': string;
  '--color-text-on-secondary-h': string; '--color-text-on-secondary-s': string; '--color-text-on-secondary-l': string;
  '--color-text-accent-h'?: string; '--color-text-accent-s'?: string; '--color-text-accent-l'?: string; // For general accented text

  // Accent Colors
  '--color-accent-primary-h': string; '--color-accent-primary-s': string; '--color-accent-primary-l': string;
  '--color-accent-secondary-h': string; '--color-accent-secondary-s': string; '--color-accent-secondary-l': string;
  '--color-accent-interactive-h': string; '--color-accent-interactive-s': string; '--color-accent-interactive-l': string; // For interactive elements like buttons, links
  '--color-accent-glow-h': string; '--color-accent-glow-s': string; '--color-accent-glow-l': string; '--color-accent-glow-a': string;
  
  // Logo Specific Accent Colors (new)
  '--color-logo-primary-h'?: string; '--color-logo-primary-s'?: string; '--color-logo-primary-l'?: string;
  '--color-logo-secondary-h'?: string; '--color-logo-secondary-s'?: string; '--color-logo-secondary-l'?: string;


  // Border Colors
  '--color-border-primary-h': string; '--color-border-primary-s': string; '--color-border-primary-l': string; '--color-border-primary-a'?: string;
  '--color-border-secondary-h': string; '--color-border-secondary-s': string; '--color-border-secondary-l': string; '--color-border-secondary-a'?: string;
  '--color-border-interactive-h': string; '--color-border-interactive-s': string; '--color-border-interactive-l': string; '--color-border-interactive-a'?: string;
  '--color-border-translucent-h': string; '--color-border-translucent-s': string; '--color-border-translucent-l': string; '--color-border-translucent-a': string;

  // Shadow Configuration
  '--shadow-color-h': string; '--shadow-color-s': string; '--shadow-color-l': string;
  '--shadow-highlight-modifier': string;
  '--shadow-opacity-soft': string;
  '--shadow-opacity-medium': string; // Added for more variance
  '--shadow-opacity-deep': string;

  // Voice Visualization Colors
  '--color-voice-user-h': string; '--color-voice-user-s': string; '--color-voice-user-l': string;
  '--color-voice-ai-speaking-h': string; '--color-voice-ai-speaking-s': string; '--color-voice-ai-speaking-l': string; // Renamed from --color-voice-ai-h
  '--color-voice-ai-thinking-h': string; '--color-voice-ai-thinking-s': string; '--color-voice-ai-thinking-l': string;
  '--voice-pulse-opacity': string;

  // Semantic Colors
  '--color-info-h': string; '--color-info-s': string; '--color-info-l': string;
  '--color-success-h': string; '--color-success-s': string; '--color-success-l': string;
  '--color-warning-h': string; '--color-warning-s': string; '--color-warning-l': string;
  '--color-error-h': string; '--color-error-s': string; '--color-error-l': string;
  '--color-error-text-h'?: string; '--color-error-text-s'?: string; '--color-error-text-l'?: string; // For text on error backgrounds

  // Code Block Theming
  '--color-bg-code-block-h'?: string; '--color-bg-code-block-s'?: string; '--color-bg-code-block-l'?: string;
  '--color-text-code-block-h'?: string; '--color-text-code-block-s'?: string; '--color-text-code-block-l'?: string;

  // Background Patterns/Effects (Opacity, Size) - For Tailwind config to reference if needed
  '--bg-holo-grid-opacity'?: string;
  '--bg-holo-grid-size'?: string;
  // Add other UI element specific variables if they need to be themed
  // e.g. '--header-height', '--footer-height' are in SCSS variables for now
}

export interface ThemeDefinition {
  id: string;
  name: string;
  isDark: boolean;
  cssVariables: Partial<ThemeCssVariableMap>; // Use Partial as not all themes might override every single variable
}

export const availableThemes: ThemeDefinition[] = [
  {
    id: 'magenta-mystic', // New Default Dark Theme (Her movie inspired)
    name: 'Magenta Mystic',
    isDark: true,
    cssVariables: {
      '--color-bg-primary-h': '280', '--color-bg-primary-s': '25%', '--color-bg-primary-l': '10%', // Deep indigo/purple
      '--color-bg-secondary-h': '280', '--color-bg-secondary-s': '20%', '--color-bg-secondary-l': '15%', // Slightly lighter for cards
      '--color-bg-tertiary-h': '280', '--color-bg-tertiary-s': '18%', '--color-bg-tertiary-l': '18%',
      '--color-bg-glass-h': '280', '--color-bg-glass-s': '20%', '--color-bg-glass-l': '15%', '--color-bg-glass-a': '0.1', // Very subtle glass
      '--color-border-glass-h': '310', '--color-border-glass-s': '70%', '--color-border-glass-l': '60%', '--color-border-glass-a': '0.15', // Faint magenta tint for glass border

      '--color-text-primary-h': '310', '--color-text-primary-s': '80%', '--color-text-primary-l': '92%', // Bright, slightly desaturated pink/lavender for primary text
      '--color-text-secondary-h': '280', '--color-text-secondary-s': '40%', '--color-text-secondary-l': '80%', // Lighter purple/blue for secondary
      '--color-text-muted-h': '280', '--color-text-muted-s': '30%', '--color-text-muted-l': '65%',
      '--color-text-on-primary-h': '310', '--color-text-on-primary-s': '10%', '--color-text-on-primary-l': '95%', // For text on magenta accent
      '--color-text-on-secondary-h': '200', '--color-text-on-secondary-s': '10%', '--color-text-on-secondary-l': '15%',

      '--color-accent-primary-h': '320', '--color-accent-primary-s': '100%', '--color-accent-primary-l': '70%', // Vibrant Magenta/Hot Pink
      '--color-accent-secondary-h': '25', '--color-accent-secondary-s': '100%', '--color-accent-secondary-l': '65%', // Warm Coral/Orange as secondary
      '--color-accent-interactive-h': '320', '--color-accent-interactive-s': '100%', '--color-accent-interactive-l': '75%', // Slightly brighter magenta for interaction
      '--color-accent-glow-h': '320', '--color-accent-glow-s': '100%', '--color-accent-glow-l': '75%', '--color-accent-glow-a': '0.5',
      
      '--color-logo-primary-h': '320', '--color-logo-primary-s': '100%', '--color-logo-primary-l': '70%', // Magenta for logo
      '--color-logo-secondary-h': '25', '--color-logo-secondary-s': '100%', '--color-logo-secondary-l': '65%', // Coral for logo accent

      '--color-border-primary-h': '280', '--color-border-primary-s': '20%', '--color-border-primary-l': '25%', '--color-border-primary-a': '0.7',
      '--color-border-secondary-h': '280', '--color-border-secondary-s': '15%', '--color-border-secondary-l': '30%', '--color-border-secondary-a': '0.5',
      '--color-border-interactive-h': '320', '--color-border-interactive-s': '80%', '--color-border-interactive-l': '70%', '--color-border-interactive-a': '0.6',
      '--color-border-translucent-h': '310', '--color-border-translucent-s': '60%', '--color-border-translucent-l': '50%', '--color-border-translucent-a': '0.1',

      '--shadow-color-h': '280', '--shadow-color-s': '40%', '--shadow-color-l': '5%', // Deep purple shadow base
      '--shadow-highlight-modifier': '+8%', // Very subtle highlight for dark theme
      '--shadow-opacity-soft': '0.3',
      '--shadow-opacity-medium': '0.4',
      '--shadow-opacity-deep': '0.5',

      '--color-voice-user-h': '25', '--color-voice-user-s': '100%', '--color-voice-user-l': '70%', // User voice: Warm Coral
      '--color-voice-ai-speaking-h': '320', '--color-voice-ai-speaking-s': '100%', '--color-voice-ai-speaking-l': '75%', // AI voice: Bright Magenta
      '--color-voice-ai-thinking-h': '280', '--color-voice-ai-thinking-s': '50%', '--color-voice-ai-thinking-l': '60%', // Thinking: Muted Indigo
      '--voice-pulse-opacity': '0.8',

      '--color-info-h': '190', '--color-info-s': '90%', '--color-info-l': '70%', // Bright cyan/blue for info
      '--color-success-h': '140', '--color-success-s': '80%', '--color-success-l': '65%', // Vibrant green
      '--color-warning-h': '35', '--color-warning-s': '100%', '--color-warning-l': '65%', // Bright orange
      '--color-error-h': '0', '--color-error-s': '90%', '--color-error-l': '70%', // Bright red
      '--color-error-text-h': '0', '--color-error-text-s': '100%', '--color-error-text-l': '80%',

      '--color-bg-code-block-h': '280', '--color-bg-code-block-s': '15%', '--color-bg-code-block-l': '8%', // Very dark purple for code
      '--color-text-code-block-h': '280', '--color-text-code-block-s': '20%', '--color-text-code-block-l': '80%', // Light text for code
      
      '--blur-glass': '8px', // More subtle blur for this theme
    },
  },
  {
    id: 'twilight-neo', // Improved "Midnight Dark"
    name: 'Twilight Neo',
    isDark: true,
    cssVariables: {
      '--color-bg-primary-h': '225', '--color-bg-primary-s': '25%', '--color-bg-primary-l': '10%', // Darker, slightly less saturated blue/purple
      '--color-bg-secondary-h': '225', '--color-bg-secondary-s': '20%', '--color-bg-secondary-l': '15%',
      '--color-bg-tertiary-h': '225', '--color-bg-tertiary-s': '18%', '--color-bg-tertiary-l': '19%',
      '--color-bg-glass-h': '225', '--color-bg-glass-s': '20%', '--color-bg-glass-l': '15%', '--color-bg-glass-a': '0.25', // More subtle glass
      '--color-border-glass-h': '210', '--color-border-glass-s': '35%', '--color-border-glass-l': '40%', '--color-border-glass-a': '0.25',

      '--color-text-primary-h': '210', '--color-text-primary-s': '40%', '--color-text-primary-l': '95%', // Brighter primary text
      '--color-text-secondary-h': '210', '--color-text-secondary-s': '30%', '--color-text-secondary-l': '80%', // Brighter secondary
      '--color-text-muted-h': '210', '--color-text-muted-s': '25%', '--color-text-muted-l': '70%', // Brighter muted
      '--color-text-on-primary-h': '180', '--color-text-on-primary-s': '5%', '--color-text-on-primary-l': '15%', // Dark text for cyan accents
      '--color-text-on-secondary-h': '300', '--color-text-on-secondary-s': '10%', '--color-text-on-secondary-l': '10%',// Dark text for magenta accents

      '--color-accent-primary-h': '180', '--color-accent-primary-s': '100%', '--color-accent-primary-l': '55%', // Vivid Cyan
      '--color-accent-secondary-h': '300', '--color-accent-secondary-s': '100%', '--color-accent-secondary-l': '60%', // Vivid Magenta
      '--color-accent-interactive-h': '190', '--color-accent-interactive-s': '100%', '--color-accent-interactive-l': '60%', // Bright Teal for interactions
      '--color-accent-glow-h': '180', '--color-accent-glow-s': '100%', '--color-accent-glow-l': '60%', '--color-accent-glow-a': '0.5',
      
      '--color-logo-primary-h': '180', '--color-logo-primary-s': '100%', '--color-logo-primary-l': '55%', // Cyan for logo
      '--color-logo-secondary-h': '300', '--color-logo-secondary-s': '100%', '--color-logo-secondary-l': '60%', // Magenta for logo

      '--color-border-primary-h': '210', '--color-border-primary-s': '25%', '--color-border-primary-l': '30%', '--color-border-primary-a': '0.8',
      '--color-border-secondary-h': '210', '--color-border-secondary-s': '20%', '--color-border-secondary-l': '35%', '--color-border-secondary-a': '0.6',
      '--color-border-interactive-h': '190', '--color-border-interactive-s': '80%', '--color-border-interactive-l': '60%', '--color-border-interactive-a': '0.7',
      '--color-border-translucent-h': '210', '--color-border-translucent-s': '30%', '--color-border-translucent-l': '60%', '--color-border-translucent-a': '0.1',

      '--shadow-color-h': '225', '--shadow-color-s': '40%', '--shadow-color-l': '3%', // Very dark shadow base
      '--shadow-highlight-modifier': '+6%',
      '--shadow-opacity-soft': '0.3',
      '--shadow-opacity-medium': '0.45',
      '--shadow-opacity-deep': '0.6',

      '--color-voice-user-h': '270', '--color-voice-user-s': '95%', '--color-voice-user-l': '70%', // Vivid Purple
      '--color-voice-ai-speaking-h': '180', '--color-voice-ai-speaking-s': '100%', '--color-voice-ai-speaking-l': '58%', // Vivid Cyan
      '--color-voice-ai-thinking-h': '225', '--color-voice-ai-thinking-s': '60%', '--color-voice-ai-thinking-l': '65%',
      '--voice-pulse-opacity': '0.8',

      '--color-info-h': '200', '--color-info-s': '90%', '--color-info-l': '70%',
      '--color-success-h': '140', '--color-success-s': '80%', '--color-success-l': '60%',
      '--color-warning-h': '40', '--color-warning-s': '100%', '--color-warning-l': '60%',
      '--color-error-h': '0', '--color-error-s': '90%', '--color-error-l': '65%',
      '--color-error-text-h': '0', '--color-error-text-s': '100%', '--color-error-text-l': '85%',

      '--color-bg-code-block-h': '225', '--color-bg-code-block-s': '20%', '--color-bg-code-block-l': '9%',
      '--color-text-code-block-h': '210', '--color-text-code-block-s': '25%', '--color-text-code-block-l': '85%',
      
      '--blur-glass': '10px',
    },
  },
  {
    id: 'aurora-daybreak', // Existing Light Theme
    name: 'Aurora Daybreak',
    isDark: false,
    cssVariables: { /* ... existing values ... */
      '--color-bg-primary-h': '210', '--color-bg-primary-s': '60%', '--color-bg-primary-l': '98%',
      '--color-bg-secondary-h': '200', '--color-bg-secondary-s': '50%', '--color-bg-secondary-l': '95%',
      '--color-bg-tertiary-h': '190', '--color-bg-tertiary-s': '40%', '--color-bg-tertiary-l': '92%',
      '--color-bg-glass-h': '200', '--color-bg-glass-s': '50%', '--color-bg-glass-l': '95%', '--color-bg-glass-a': '0.6',
      '--color-border-glass-h': '200', '--color-border-glass-s': '40%', '--color-border-glass-l': '90%', '--color-border-glass-a': '0.4',
      '--blur-glass': '8px',
      '--color-text-primary-h': '220', '--color-text-primary-s': '30%', '--color-text-primary-l': '25%',
      '--color-text-secondary-h': '220', '--color-text-secondary-s': '25%', '--color-text-secondary-l': '45%',
      '--color-text-muted-h': '220', '--color-text-muted-s': '20%', '--color-text-muted-l': '60%',
      '--color-text-on-primary-h': '330', '--color-text-on-primary-s': '20%', '--color-text-on-primary-l': '15%',
      '--color-text-on-secondary-h': '260', '--color-text-on-secondary-s': '15%', '--color-text-on-secondary-l': '20%',
      '--color-accent-primary-h': '330', '--color-accent-primary-s': '85%', '--color-accent-primary-l': '72%', // Soft Pink, slightly adjusted
      '--color-accent-secondary-h': '260', '--color-accent-secondary-s': '75%', '--color-accent-secondary-l': '78%', // Soft Lavender, slightly adjusted
      '--color-accent-interactive-h': '330', '--color-accent-interactive-s': '90%', '--color-accent-interactive-l': '70%',
      '--color-accent-glow-h': '330', '--color-accent-glow-s': '85%', '--color-accent-glow-l': '78%', '--color-accent-glow-a': '0.4',
      '--color-logo-primary-h': '330', '--color-logo-primary-s': '85%', '--color-logo-primary-l': '72%',
      '--color-logo-secondary-h': '260', '--color-logo-secondary-s': '75%', '--color-logo-secondary-l': '78%',
      '--color-border-primary-h': '210', '--color-border-primary-s': '30%', '--color-border-primary-l': '85%', '--color-border-primary-a': '0.9',
      '--color-border-secondary-h': '200', '--color-border-secondary-s': '25%', '--color-border-secondary-l': '90%', '--color-border-secondary-a': '0.7',
      '--color-border-interactive-h': '330', '--color-border-interactive-s': '70%', '--color-border-interactive-l': '65%', '--color-border-interactive-a': '0.8',
      '--color-border-translucent-h': '210', '--color-border-translucent-s': '40%', '--color-border-translucent-l': '80%', '--color-border-translucent-a': '0.25',
      '--shadow-color-h': '210', '--shadow-color-s': '35%', '--shadow-color-l': '55%',
      '--shadow-highlight-modifier': '+35%',
      '--shadow-opacity-soft': '0.07',
      '--shadow-opacity-medium': '0.1',
      '--shadow-opacity-deep': '0.14',
      '--color-voice-user-h': '260', '--color-voice-user-s': '75%', '--color-voice-user-l': '75%',
      '--color-voice-ai-speaking-h': '170', '--color-voice-ai-speaking-s': '70%', '--color-voice-ai-speaking-l': '68%', // Soft Teal for AI voice
      '--color-voice-ai-thinking-h': '200', '--color-voice-ai-thinking-s': '50%', '--color-voice-ai-thinking-l': '70%',
      '--voice-pulse-opacity': '0.55',
      '--color-info-h': '195', '--color-info-s': '80%', '--color-info-l': '60%',
      '--color-success-h': '130', '--color-success-s': '65%', '--color-success-l': '58%',
      '--color-warning-h': '40', '--color-warning-s': '90%', '--color-warning-l': '60%',
      '--color-error-h': '0', '--color-error-s': '80%', '--color-error-l': '65%',
      '--color-error-text-h': '0', '--color-error-text-s': '100%', '--color-error-text-l': '95%',
      '--color-bg-code-block-h': '210', '--color-bg-code-block-s': '20%', '--color-bg-code-block-l': '94%', // Light bg for code
      '--color-text-code-block-h': '220', '--color-text-code-block-s': '25%', '--color-text-code-block-l': '30%',// Dark text for code
    },
  },
  { // Keep Warm Embrace as an option
    id: 'warm-embrace',
    name: 'Warm Embrace',
    isDark: false,
    cssVariables: { /* ... existing values ... */
      '--color-bg-primary-h': '35', '--color-bg-primary-s': '70%', '--color-bg-primary-l': '96%',
      '--color-bg-secondary-h': '30', '--color-bg-secondary-s': '60%', '--color-bg-secondary-l': '92%',
      '--color-bg-tertiary-h': '25', '--color-bg-tertiary-s': '50%', '--color-bg-tertiary-l': '88%',
      '--color-bg-glass-h': '30', '--color-bg-glass-s': '60%', '--color-bg-glass-l': '92%', '--color-bg-glass-a': '0.7',
      '--color-border-glass-h': '30', '--color-border-glass-s': '50%', '--color-border-glass-l': '85%', '--color-border-glass-a': '0.5',
      '--blur-glass': '10px',
      '--color-text-primary-h': '30', '--color-text-primary-s': '20%', '--color-text-primary-l': '25%',
      '--color-text-secondary-h': '30', '--color-text-secondary-s': '15%', '--color-text-secondary-l': '40%',
      '--color-text-muted-h': '30', '--color-text-muted-s': '12%', '--color-text-muted-l': '55%',
      '--color-text-on-primary-h': '30', '--color-text-on-primary-s': '30%', '--color-text-on-primary-l': '15%',
      '--color-text-on-secondary-h': '25', '--color-text-on-secondary-s': '25%', '--color-text-on-secondary-l': '20%',
      '--color-accent-primary-h': '25', '--color-accent-primary-s': '75%', '--color-accent-primary-l': '65%',
      '--color-accent-secondary-h': '45', '--color-accent-secondary-s': '70%', '--color-accent-secondary-l': '60%',
      '--color-accent-interactive-h': '30', '--color-accent-interactive-s': '80%', '--color-accent-interactive-l': '60%',
      '--color-accent-glow-h': '25', '--color-accent-glow-s': '80%', '--color-accent-glow-l': '70%', '--color-accent-glow-a': '0.4',
      '--color-logo-primary-h': '25', '--color-logo-primary-s': '75%', '--color-logo-primary-l': '65%',
      '--color-logo-secondary-h': '45', '--color-logo-secondary-s': '70%', '--color-logo-secondary-l': '60%',
      '--color-border-primary-h': '30', '--color-border-primary-s': '30%', '--color-border-primary-l': '80%', '--color-border-primary-a': '0.9',
      '--color-border-secondary-h': '30', '--color-border-secondary-s': '25%', '--color-border-secondary-l': '85%', '--color-border-secondary-a': '0.7',
      '--color-border-interactive-h': '30', '--color-border-interactive-s': '70%', '--color-border-interactive-l': '55%', '--color-border-interactive-a': '0.8',
      '--color-border-translucent-h': '30', '--color-border-translucent-s': '30%', '--color-border-translucent-l': '50%', '--color-border-translucent-a': '0.15',
      '--shadow-color-h': '30', '--shadow-color-s': '20%', '--shadow-color-l': '40%',
      '--shadow-highlight-modifier': '+35%',
      '--shadow-opacity-soft': '0.07',
      '--shadow-opacity-medium': '0.1',
      '--shadow-opacity-deep': '0.12',
      '--color-voice-user-h': '170', '--color-voice-user-s': '60%', '--color-voice-user-l': '65%',
      '--color-voice-ai-speaking-h': '40', '--color-voice-ai-speaking-s': '80%', '--color-voice-ai-speaking-l': '70%',
      '--color-voice-ai-thinking-h': '30', '--color-voice-ai-thinking-s': '60%', '--color-voice-ai-thinking-l': '75%',
      '--voice-pulse-opacity': '0.6',
      '--color-info-h': '190', '--color-info-s': '70%', '--color-info-l': '60%',
      '--color-success-h': '100', '--color-success-s': '50%', '--color-success-l': '55%',
      '--color-warning-h': '35', '--color-warning-s': '80%', '--color-warning-l': '60%',
      '--color-error-h': '5', '--color-error-s': '70%', '--color-error-l': '60%',
      '--color-error-text-h': '5', '--color-error-text-s': '100%', '--color-error-text-l': '95%',
      '--color-bg-code-block-h': '30', '--color-bg-code-block-s': '30%', '--color-bg-code-block-l': '90%', // Warm light code bg
      '--color-text-code-block-h': '30', '--color-text-code-block-s': '20%', '--color-text-code-block-l': '30%', // Dark text for code
    },
  },
];