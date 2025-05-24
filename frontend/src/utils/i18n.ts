// File: frontend/src/utils/i18n.ts

import { createI18n } from 'vue-i18n';
import { ref, computed } from 'vue';

/**
 * Supported languages configuration
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
];

export const DEFAULT_LANGUAGE = 'en-US';

/**
 * Language detection from various sources
 */
function detectLanguage(): string {
  // 1. Check localStorage
  const stored = localStorage.getItem('voice-chat-language');
  if (stored && SUPPORTED_LANGUAGES.some(lang => lang.code === stored)) {
    return stored;
  }

  // 2. Check browser language
  const browserLang = navigator.language || navigator.languages?.[0];
  if (browserLang) {
    // Try exact match first
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === browserLang)) {
      return browserLang;
    }
    
    // Try language without region (en-GB -> en-US)
    const shortCode = browserLang.split('-')[0];
    const match = SUPPORTED_LANGUAGES.find(lang => lang.code.startsWith(shortCode));
    if (match) return match.code;
  }

  // 3. Default language
  return DEFAULT_LANGUAGE;
}

/**
 * Lazy load translation messages
 */
async function loadTranslations(locale: string) {
  try {
    const messages = await import(`../locales/${locale}.json`);
    return messages.default || messages;
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}`, error);
    // Fallback to English
    if (locale !== DEFAULT_LANGUAGE) {
      return await loadTranslations(DEFAULT_LANGUAGE);
    }
    return {};
  }
}

/**
 * Create and configure Vue i18n instance
 */
async function createI18nInstance() {
  const locale = detectLanguage();
  const messages = {
    [locale]: await loadTranslations(locale)
  };

  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: DEFAULT_LANGUAGE,
    messages,
    globalInjection: true,
    warnHtmlMessage: false,
  });
}

// Global reactive language state
export const currentLanguage = ref(detectLanguage());

/**
 * Language management composable
 */
export function useLanguage() {
  const setLanguage = async (newLanguage: string) => {
    if (!SUPPORTED_LANGUAGES.some(lang => lang.code === newLanguage)) {
      console.warn(`Unsupported language: ${newLanguage}`);
      return;
    }

    currentLanguage.value = newLanguage;
    localStorage.setItem('voice-chat-language', newLanguage);
    
    // Update document language
    document.documentElement.lang = newLanguage;
    
    // Update i18n locale if instance exists
    if (window.i18n) {
      window.i18n.global.locale.value = newLanguage;
      
      // Load translations if not already loaded
      if (!window.i18n.global.messages.value[newLanguage]) {
        const messages = await loadTranslations(newLanguage);
        window.i18n.global.setLocaleMessage(newLanguage, messages);
      }
    }
  };

  const getCurrentLanguage = computed(() => currentLanguage.value);
  
  const getCurrentLanguageInfo = computed(() => 
    SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage.value) || 
    SUPPORTED_LANGUAGES.find(lang => lang.code === DEFAULT_LANGUAGE)
  );

  return {
    currentLanguage: getCurrentLanguage,
    currentLanguageInfo: getCurrentLanguageInfo,
    supportedLanguages: SUPPORTED_LANGUAGES,
    setLanguage,
  };
}

/**
 * Initialize i18n for the application
 */
export async function setupI18n() {
  const i18n = await createI18nInstance();
  
  // Make i18n globally available for language switching
  (window as any).i18n = i18n;
  
  // Set initial document language
  document.documentElement.lang = currentLanguage.value;
  
  return i18n;
}

/**
 * Format date/time according to current locale
 */
export function useLocalizedDate() {
  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = currentLanguage.value;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    
    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(dateObj);
  };

  const formatRelative = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(dateObj, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return {
    formatDate,
    formatRelative,
  };
}

/**
 * Number and currency formatting
 */
export function useLocalizedNumbers() {
  const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(currentLanguage.value, options).format(number);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat(currentLanguage.value, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat(currentLanguage.value, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value);
  };

  return {
    formatNumber,
    formatCurrency,
    formatPercentage,
  };
}