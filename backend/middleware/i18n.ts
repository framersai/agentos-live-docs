// File: backend/middleware/i18n.ts
/**
 * @fileoverview Initializes and configures i18next for internationalization (i18n)
 * within the Express application. It sets up language detection, translation
 * file loading, and provides middleware and utility functions for handling
 * translations in requests and responses.
 *
 * Key Features:
 * - Initialization of i18next with filesystem backend for loading translations.
 * - Language detection from headers, query parameters, cookies.
 * - Normalization of language codes to supported formats.
 * - Custom middleware to make specific translation functions available on Express `Request` objects.
 * - Helper functions for translating keys and retrieving translation bundles.
 *
 * @module backend/middleware/i18n
 */

import i18next, { i18n as I18nInstanceType, TFunction } from 'i18next';
import i18nextFsBackend from 'i18next-fs-backend';
// Remove LanguageDetectorModule, it's not needed for direct import here.
// The LanguageDetector class is accessed via i18nextHttpMiddleware.LanguageDetector
import i18nextHttpMiddleware from 'i18next-http-middleware';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore - Common workaround for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Defines the list of BCP 47 language tags supported by the application.
 * @constant {string[]} SUPPORTED_LANGUAGES
 */
export const SUPPORTED_LANGUAGES: readonly string[] = [
  'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT',
  'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN'
] as const;

/**
 * The default language to use if no language can be detected or if the
 * detected language is not supported.
 * @constant {string} DEFAULT_LANGUAGE
 */
export const DEFAULT_LANGUAGE: typeof SUPPORTED_LANGUAGES[0] = 'en-US';

/**
 * Maps short language codes (e.g., "en") to their full supported BCP 47 counterparts (e.g., "en-US").
 * @constant {Record<string, string>} LANGUAGE_MAP
 * @private
 */
const LANGUAGE_MAP: Record<string, typeof SUPPORTED_LANGUAGES[number]> = {
  'en': 'en-US',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'it': 'it-IT',
  'pt': 'pt-BR',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
  'zh': 'zh-CN',
};

/**
 * Asynchronously initializes the i18next instance.
 * @async
 * @private
 * @function initializeI18n
 * @returns {Promise<void>} A promise that resolves when i18next is successfully initialized.
 */
async function initializeI18n(): Promise<void> {
  if (i18next.isInitialized) {
    // console.debug('i18next is already initialized.'); // Optional: reduce noise
    return;
  }
  await i18next
    .use(i18nextFsBackend)
    .use(i18nextHttpMiddleware.LanguageDetector) // Standard language detector plugin
    .init({
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: [...SUPPORTED_LANGUAGES],
      defaultNS: 'common',
      ns: ['common', 'auth', 'errors', 'emails', 'api'],
      backend: {
        loadPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.json'),
        addPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.missing.json'),
      },
      detection: {
        order: ['querystring', 'cookie', 'header'],
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next-lng', // Default cookie name for i18next-http-middleware
        lookupHeader: 'accept-language',
        caches: ['cookie'],
        cookieOptions: {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 30 * 1000, // cookieMinutes equivalent in ms
        },
      },
      saveMissing: process.env.NODE_ENV === 'development',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false,
      },
      react: { // Shared config, harmless for backend
        useSuspense: false,
      },
    });

  console.log('✅ i18next initialized successfully with filesystem backend.');
}

/**
 * Normalizes a given language code to one of the application's supported formats.
 * @export
 * @function normalizeLanguageCode
 * @param {string} [lang] - The language code string to normalize.
 * @returns {string} The normalized, supported language code, or the default language.
 */
export function normalizeLanguageCode(lang?: string): typeof SUPPORTED_LANGUAGES[number] {
  if (!lang) return DEFAULT_LANGUAGE;
  const lowerLang = lang.toLowerCase().trim();

  // Prioritize exact match from SUPPORTED_LANGUAGES after normalizing case
  const supportedLangMatch = SUPPORTED_LANGUAGES.find(sl => sl.toLowerCase() === lowerLang);
  if (supportedLangMatch) {
    return supportedLangMatch;
  }

  if (LANGUAGE_MAP[lowerLang]) {
    return LANGUAGE_MAP[lowerLang];
  }

  const shortCode = lowerLang.split('-')[0];
  if (LANGUAGE_MAP[shortCode]) {
    return LANGUAGE_MAP[shortCode];
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Custom Express middleware for refining language detection and ensuring i18next state.
 * This middleware should run AFTER `i18nextHttpMiddleware.handle` to leverage its detection
 * and then apply any specific overrides or ensure custom request properties are set.
 *
 * @export
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
export const customLanguageHandlerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // req.lng and req.languages should be populated by i18nextHttpMiddleware.handle()
  let languageToSet: string | undefined = req.lng; // Start with what the standard detector found

  // --- Begin Custom Override Logic ---
  // Example: Prioritize a language from a JWT claim (if you implement this)
  // const jwtPayload = decodeJwtFromRequest(req); // Your function to get payload
  // if (jwtPayload && jwtPayload.languagePreference) {
  //   languageToSet = jwtPayload.languagePreference;
  // }

  // Example: Allow a specific query parameter 'force_lang' to override everything else
  if (req.query.force_lang && typeof req.query.force_lang === 'string') {
    languageToSet = req.query.force_lang;
  }
  // --- End Custom Override Logic ---

  const normalizedLang = normalizeLanguageCode(languageToSet);

  // Set our custom property on the request
  req.customLanguage = normalizedLang;

  // Ensure the i18next instance for the current request reflects this language.
  // `req.i18n` is added by `i18nextHttpMiddleware.handle`.
  // `i18next.language` is the global instance's language, `req.i18n.language` is request-scoped.
  const i18nInstanceForRequest = req.i18n || i18next;

  if (i18nInstanceForRequest.language !== normalizedLang) {
    i18nInstanceForRequest.changeLanguage(normalizedLang, (err) => {
      if (err) {
        console.error(`i18n: Error changing language to '${normalizedLang}' on i18next instance for request:`, err);
      }
      // Update req.lng as well to be consistent, if i18n.changeLanguage doesn't do it on req.
      req.lng = normalizedLang;
      res.setHeader('Content-Language', normalizedLang);
      next();
    });
  } else {
    // Language is already correct, ensure req.lng matches if it somehow diverged
    if(req.lng !== normalizedLang) req.lng = normalizedLang;
    res.setHeader('Content-Language', normalizedLang);
    next();
  }
};

/**
 * A global translation helper function that wraps `i18next.t`.
 * Ensures a string return type, falling back to the key if a string translation is not found.
 *
 * @export
 * @function t
 * @param {string} key - The translation key.
 * @param {any} [options] - Options for i18next.t (e.g., interpolation values).
 * @param {string} [language] - Optional. Specific language code. Defaults to current i18next language.
 * @returns {string} The translated string, or the key as a fallback.
 */
export function t(key: string, options?: any, language?: string): string {
  const lngToUse = language || i18next.language || DEFAULT_LANGUAGE;
  const resolvedOptions = { ...options, lng: lngToUse };
  const translation = i18next.t(key, resolvedOptions);

  if (typeof translation === 'string') {
    return translation;
  }

  if (process.env.NODE_ENV === 'development') {
    const valueType = typeof translation;
    const valueStr = valueType === 'object' ? JSON.stringify(translation) : String(translation);
    console.warn(
      `i18n (global t): Expected string for key '${key}' (lang: '${lngToUse}'), received ${valueType}. Value: ${valueStr.substring(0, 100)}. Returning key.`
    );
  }
  return key;
}

/**
 * Retrieves the entire translation resource bundle for a specific namespace and language.
 *
 * @export
 * @function getTranslations
 * @param {string} namespace - The namespace for which to retrieve translations.
 * @param {string} [language] - Optional. The language code. Defaults to current i18next language.
 * @returns {Record<string, any>} Translations for the namespace and language. Empty object on failure.
 */
export function getTranslations(namespace: string, language?: string): Record<string, any> {
  const langToUse = normalizeLanguageCode(language || i18next.language || DEFAULT_LANGUAGE);
  try {
    const bundle = i18next.getResourceBundle(langToUse, namespace);
    return bundle || {};
  } catch (error) {
    console.warn(`i18n: Failed to get translations for namespace '${namespace}' in language '${langToUse}'.`, error);
    return {};
  }
}

/**
 * Express middleware that attaches custom, type-safe i18n helper functions
 * (`translate` and `getLocaleBundles`) to the Express `Request` object.
 * These helpers use the request's detected language.
 *
 * @export
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
export const customTranslationHelpersMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Use req.customLanguage (set by our customLanguageHandlerMiddleware)
  // or req.lng (set by i18nextHttpMiddleware), or fallback.
  const userLanguage = req.customLanguage || req.lng || DEFAULT_LANGUAGE;

  // Use req.i18n (the request-scoped i18next instance) if available for translations.
  // This instance already has the correct language set by previous middleware.
  const tForRequest = req.i18n ? req.i18n.t : (keyFromT: string, optionsFromT: any) => i18next.t(keyFromT, {...optionsFromT, lng: userLanguage});

  req.translate = (key: string, options?: any): string => {
    const translation = tForRequest(key, options);
    if (typeof translation === 'string') {
        return translation;
    }
    if (process.env.NODE_ENV === 'development') {
        const valueType = typeof translation;
        const valueStr = valueType === 'object' ? JSON.stringify(translation) : String(translation);
        console.warn(
        `i18n (req.translate): Expected string for key '${key}' (lang: '${userLanguage}'), received ${valueType}. Value: ${valueStr.substring(0,100)}. Returning key.`
        );
    }
    return key;
  };

  req.getLocaleBundles = (namespace: string): Record<string, any> => {
    return getTranslations(namespace, userLanguage);
  };

  next();
};

/**
 * Sets up and configures all i18n-related middleware for the Express application.
 *
 * @export
 * @async
 * @function setupI18nMiddleware
 * @returns {Promise<Array<Function>>} A promise resolving to an array of Express middleware functions.
 */
export async function setupI18nMiddleware(): Promise<Array<(req: Request, res: Response, next: NextFunction) => void>> {
  await initializeI18n();

  return [
    i18nextHttpMiddleware.handle(i18next),         // 1. Standard i18next middleware: detects lang, adds req.i18n, req.lng, req.languages, req.t (TFunction)
    customLanguageHandlerMiddleware,               // 2. Our custom logic: refines language, sets req.customLanguage, ensures i18next instance uses this lang
    customTranslationHelpersMiddleware,            // 3. Our helpers: adds req.translate (string-returning) and req.getLocaleBundles
  ];
}

// Type augmentation for the Express Request object.
// This adds all relevant properties set by i18next-http-middleware and our custom middleware.
declare global {
  namespace Express {
    interface Request {
      /**
       * The i18next instance specific to the current request, or the global instance.
       * Added by `i18nextHttpMiddleware`. This instance's `t` method is a full `TFunction`.
       */
      i18n?: I18nInstanceType;
      /**
       * The detected and normalized primary language code for the current request (e.g., "en-US").
       * Initially set by `i18nextHttpMiddleware`, potentially refined by `customLanguageHandlerMiddleware`.
       */
      lng?: string;
      /**
       * An array of language codes detected for the current request, in order of preference.
       * Set by `i18nextHttpMiddleware`.
       */
      languages?: string[];
       /**
       * The standard translation function provided by `i18next-http-middleware`, typed as `TFunction`.
       * It can return strings, objects, or arrays based on the key and options.
       */
      t: TFunction; // This 't' is from i18next-http-middleware
      /**
       * Our custom property for the final, normalized language code for the request.
       * Set by `customLanguageHandlerMiddleware`.
       */
      customLanguage?: string;
      /**
       * Custom request-specific translation function that *ensures* a string is returned.
       * Translates a key using the detected language for the request (`req.customLanguage`).
       * Falls back to the key if a string translation isn't available.
       * Added by `customTranslationHelpersMiddleware`.
       * @param key The translation key.
       * @param options Optional i18next translation options (e.g., for interpolation).
       * @returns The translated string.
       */
      translate?: (key: string, options?: any) => string;
      /**
       * Custom request-specific function to get an entire namespace of translations
       * for the detected user language (`req.customLanguage`).
       * Added by `customTranslationHelpersMiddleware`.
       * @param namespace The i18next namespace.
       * @returns A record object containing all translations for that namespace and language.
       */
      getLocaleBundles?: (namespace: string) => Record<string, any>;
    }
  }
}

/**
 * Exports the initialized i18next instance for direct use if needed elsewhere.
 * @default i18next
 */
export default i18next;