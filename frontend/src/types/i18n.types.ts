// File: frontend/src/types/i18n.types.ts
/**
 * @fileoverview TypeScript types and interfaces related to internationalization (i18n).
 * @module types/i18n
 */

/**
 * Represents a supported language in the application.
 * This interface is used for configuring and managing available languages.
 * @interface SupportedLanguage
 */
export interface SupportedLanguage {
  /** The BCP 47 language code (e.g., "en-US", "es-ES"). */
  code: string;
  /** The human-readable name of the language (e.g., "English (US)", "Español"). */
  name: string;
  /** Optional: An emoji flag representing the language/country (e.g., "🇺🇸", "🇪🇸"). */
  flag?: string;
  /**
   * Optional: Specifies the text direction for the language.
   * Defaults to 'ltr' (left-to-right).
   * @type {('ltr' | 'rtl')}
   */
  dir?: 'ltr' | 'rtl';
}

/**
 * Defines the structure for translation messages.
 * This is typically a nested object where keys are translation keys and values are strings.
 * @example
 * {
 * "greeting": "Hello, {name}!",
 * "page": {
 * "title": "Welcome"
 * }
 * }
 * @typedef {Record<string, any | string>} LocaleMessages
 */
export type LocaleMessages = Record<string, any | string>;