// File: frontend/src/composables/useI18n.ts
/**
 * @fileoverview Composable for managing internationalization (i18n) in the Vue application.
 * It leverages vue-i18n to provide robust translation capabilities, language switching,
 * and localized formatting utilities.
 * @module composables/useI18n
 */
import { ref, computed, watch, App as VueAppInstance } from 'vue';
import { createI18n, I18n, Composer, VueI18n, UseI18nOptions } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, SupportedLanguage, LocaleMessages, LanguageCode } from '../types/i18n.types';
import { seoService } from '../services/seoService';

// Ensure SUPPORTED_LANGUAGES and DEFAULT_LANGUAGE are correctly typed based on LanguageCode
const typedSupportedLanguages: ReadonlyArray<SupportedLanguage> = SUPPORTED_LANGUAGES;
const typedDefaultLanguage: LanguageCode = DEFAULT_LANGUAGE;

/**
 * Reactive reference for the current language code, persisted in localStorage.
 * @type {import('@vueuse/core').StorageSerializers<LanguageCode>}
 */
const currentLanguageCode = useStorage<LanguageCode>(
  'app-language',
  typedDefaultLanguage,
  undefined, // Uses browser localStorage by default
  {
    serializer: { // Ensure value is always a valid LanguageCode
      read: (v: any) => typedSupportedLanguages.some(l => l.code === v) ? v as LanguageCode : typedDefaultLanguage,
      write: (v: LanguageCode) => v,
    },
  }
);

let globalI18nComposer: Composer | null = null;
let i18nInstanceRef: VueI18n | null = null;

/**
 * Detects the initial language for the application based on persisted preference,
 * browser settings, or default.
 * @returns {LanguageCode} The detected language code.
 */
function detectInitialLanguage(): LanguageCode {
  const storedLang = currentLanguageCode.value;
  if (typedSupportedLanguages.some(lang => lang.code === storedLang)) {
    return storedLang;
  }

  if (typeof navigator !== 'undefined') {
    const browserLangs = navigator.languages || [navigator.language];
    for (const langStr of browserLangs) {
      if (!langStr) continue;
      const browserLangCode = langStr.split('-')[0];
      const matchedLang = typedSupportedLanguages.find(
        lang => lang.code.toLowerCase() === langStr.toLowerCase() || lang.code.split('-')[0].toLowerCase() === browserLangCode.toLowerCase()
      );
      if (matchedLang) {
        return matchedLang.code;
      }
    }
  }
  return typedDefaultLanguage;
}

/**
 * Asynchronously loads translation messages for a given locale.
 * Assumes locale files are located in `src/locales/[langCode].json`.
 * @param {LanguageCode} locale - The language code for which to load translations.
 * @returns {Promise<LocaleMessages>} A promise resolving with the translation messages.
 * @throws {Error} If translations cannot be loaded and it's not the default language.
 */
async function loadLocaleMessages(locale: LanguageCode): Promise<LocaleMessages> {
  try {
    const messagesModule = await import(`../locales/${locale}.json`);
    return messagesModule.default || messagesModule;
  } catch (error) {
    console.warn(`[i18n] Failed to load translations for locale "${locale}". Error: ${(error as Error).message}`);
    if (locale !== typedDefaultLanguage) {
      console.warn(`[i18n] Falling back to default language "${typedDefaultLanguage}" for messages.`);
      return loadLocaleMessages(typedDefaultLanguage);
    }
    return {}; // Return empty for default if it also fails, to prevent app crash.
  }
}

/**
 * Sets up and installs the vue-i18n plugin.
 * This function should be called once during application initialization.
 * @param {VueAppInstance} app - The Vue application instance.
 * @returns {Promise<I18n<LocaleMessages, LanguageCode>>} The configured vue-i18n instance.
 */
export async function setupI18nPlugin(app: VueAppInstance): Promise<I18n<LocaleMessages, LanguageCode>> {
  const initialLocale = detectInitialLanguage();
  currentLanguageCode.value = initialLocale; // Ensure useStorage is updated

  const messages = await loadLocaleMessages(initialLocale);

  const i18n = createI18n<[LocaleMessages], LanguageCode>({
    legacy: false, // Crucial for Composition API
    locale: initialLocale,
    fallbackLocale: typedDefaultLanguage,
    messages: {
      [initialLocale]: messages,
    } as Record<LanguageCode, LocaleMessages>, // Type assertion
    missingWarn: import.meta.env.DEV,
    fallbackWarn: import.meta.env.DEV,
    silentTranslationWarn: !import.meta.env.DEV,
  });

  app.use(i18n);
  globalI18nComposer = i18n.global;
  i18nInstanceRef = i18n.global as unknown as VueI18n; // Store the instance for direct access if needed

  seoService.updateHtmlLang(initialLocale);

  // Watch for changes in currentLanguageCode to update HTML lang attribute
  watch(currentLanguageCode, (newLangCode) => {
    seoService.updateHtmlLang(newLangCode);
  }, { immediate: false }); // false because initial set is done above

  return i18n;
}

/**
 * Composable function `useI18n` to access internationalization features within Vue components.
 * Provides reactive language state, methods to change language, and localized formatting utilities.
 *
 * @returns {{
 * t: Composer['t'],
 * locale: import('vue').WritableComputedRef<LanguageCode>,
 * currentLanguage: import('vue').ComputedRef<SupportedLanguage>,
 * supportedLanguages: ReadonlyArray<SupportedLanguage>,
 * setLanguage: (newLangCode: LanguageCode) => Promise<void>,
 * formatDate: (date: Date | number | string, options?: Intl.DateTimeFormatOptions) => string,
 * formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string,
 * formatCurrency: (value: number, currency: string, options?: Intl.NumberFormatOptions) => string,
 * }} The i18n composable API.
 * @throws {Error} If `setupI18nPlugin` has not been called before using this composable.
 */
export function useI18n() {
  if (!globalI18nComposer || !i18nInstanceRef) {
    throw new Error('[useI18n] i18n plugin not properly initialized. Call setupI18nPlugin in main.ts first.');
  }

  const { t, locale: i18nLocaleRef, availableLocales, setLocaleMessage, getLocaleMessage } = globalI18nComposer;

  const currentLanguage = computed<SupportedLanguage>(() => {
    return typedSupportedLanguages.find(lang => lang.code === currentLanguageCode.value) ||
           typedSupportedLanguages.find(lang => lang.code === typedDefaultLanguage)!;
  });

  const setLanguage = async (newLangCode: LanguageCode): Promise<void> => {
    if (!typedSupportedLanguages.some(lang => lang.code === newLangCode)) {
      console.warn(`[i18n] Attempted to set unsupported language: "${newLangCode}".`);
      return;
    }

    // Check if messages for the new language are already loaded by vue-i18n
    // This is a bit tricky as `availableLocales` might not be immediately updated
    // A more direct way is to check `getLocaleMessage`.
    if (Object.keys(getLocaleMessage(newLangCode)).length === 0) {
      try {
        const messages = await loadLocaleMessages(newLangCode);
        setLocaleMessage(newLangCode, messages);
      } catch (error) {
        console.error(`[i18n] Error loading messages for "${newLangCode}": ${(error as Error).message}`);
        return; // Do not switch language if messages fail to load
      }
    }

    currentLanguageCode.value = newLangCode; // Update persisted storage
    i18nLocaleRef.value = newLangCode;       // Update vue-i18n's reactive locale
  };

  const formatDate = (date: Date | number | string, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat(currentLanguageCode.value, options).format(dateObj);
  };

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat(currentLanguageCode.value, options).format(value);
  };

  const formatCurrency = (value: number, currency: string, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat(currentLanguageCode.value, {
      style: 'currency',
      currency,
      ...options,
    }).format(value);
  };

  return {
    t,
    locale: i18nLocaleRef as import('vue').WritableComputedRef<LanguageCode>, // Explicitly type vue-i18n's locale
    currentLanguage,
    supportedLanguages: typedSupportedLanguages,
    setLanguage,
    formatDate,
    formatNumber,
    formatCurrency,
  };
}