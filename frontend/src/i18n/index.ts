import { createI18n } from 'vue-i18n';
import type { I18n, I18nOptions } from 'vue-i18n';

// Import locale messages
import en from './locales/en';
import esES from './locales/es-ES';
import frFR from './locales/fr-FR';
import deDE from './locales/de-DE';
import itIT from './locales/it-IT';
import ptBR from './locales/pt-BR';
import jaJP from './locales/ja-JP';
import koKR from './locales/ko-KR';
import zhCN from './locales/zh-CN';

// Define available locales
export const AVAILABLE_LOCALES = {
  'en': 'English',
  'es-ES': 'Español',
  'fr-FR': 'Français',
  'de-DE': 'Deutsch',
  'it-IT': 'Italiano',
  'pt-BR': 'Português',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'zh-CN': '中文'
} as const;

export type AvailableLocale = keyof typeof AVAILABLE_LOCALES;

// Get browser language or default to en
function getDefaultLocale(): AvailableLocale {
  const savedLocale = localStorage.getItem('preferred-locale') as AvailableLocale;
  if (savedLocale && savedLocale in AVAILABLE_LOCALES) {
    return savedLocale;
  }

  const browserLang = navigator.language || 'en';

  // Try exact match first
  if (browserLang in AVAILABLE_LOCALES) {
    return browserLang as AvailableLocale;
  }

  // Try to match language code (e.g., 'en' from 'en-GB')
  const langCode = browserLang.split('-')[0];
  const matchedLocale = Object.keys(AVAILABLE_LOCALES).find(
    locale => locale.startsWith(langCode)
  ) as AvailableLocale | undefined;

  return matchedLocale || 'en';
}

const messages = {
  'en': en,
  'es-ES': esES,
  'fr-FR': frFR,
  'de-DE': deDE,
  'it-IT': itIT,
  'pt-BR': ptBR,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'zh-CN': zhCN
};

const i18nOptions: I18nOptions = {
  legacy: false, // Use Composition API
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
  missingWarn: process.env.NODE_ENV === 'development',
  fallbackWarn: process.env.NODE_ENV === 'development'
};

const i18n: I18n = createI18n(i18nOptions);

// Helper function to change locale
export function setLocale(locale: AvailableLocale): void {
  console.log('[i18n] setLocale called with:', locale);
  if (locale in AVAILABLE_LOCALES) {
    const previousLocale = i18n.global.locale.value;
    console.log('[i18n] Changing locale from', previousLocale, 'to', locale);

    i18n.global.locale.value = locale;
    localStorage.setItem('preferred-locale', locale);
    document.documentElement.setAttribute('lang', locale);

    console.log('[i18n] Locale changed successfully. Current locale:', i18n.global.locale.value);
    console.log('[i18n] Available messages for locale:', Object.keys(messages[locale] || {}).slice(0, 5), '...');

    // Special logging for CJK languages
    if (locale === 'ja-JP' || locale === 'zh-CN' || locale === 'ko-KR') {
      console.log('[i18n] CJK locale detected. Testing translations:');
      console.log('[i18n] Welcome message:', i18n.global.t('common.welcome'));
      console.log('[i18n] Login text:', i18n.global.t('common.login'));
      console.log('[i18n] Settings text:', i18n.global.t('common.settings'));
      console.log('[i18n] Messages object exists?', !!messages[locale]);
      console.log('[i18n] Sample message keys:', Object.keys(messages[locale].common || {}).slice(0, 10));
    }
  } else {
    console.warn('[i18n] Invalid locale:', locale, 'Available locales:', Object.keys(AVAILABLE_LOCALES));
  }
}

// Helper function to get current locale
export function getCurrentLocale(): AvailableLocale {
  return i18n.global.locale.value as AvailableLocale;
}

// Export both as named export and default
export { i18n };
export default i18n;