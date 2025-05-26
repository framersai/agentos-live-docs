// File: backend/middleware/i18n.ts
/**
 * @fileoverview Initializes and configures i18next for internationalization (i18n)
 * within the Express application.
 * @module backend/middleware/i18n
 * @version 1.0.3 - Corrected i18next-http-middleware import.
 */

import i18next, { i18n as I18nInstanceType, TFunction } from 'i18next';
import i18nextFsBackend from 'i18next-fs-backend';
import * as i18nextHttpMiddleware from 'i18next-http-middleware'; // Corrected import
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SUPPORTED_LANGUAGES: readonly string[] = [
  'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT',
  'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN'
] as const;

export const DEFAULT_LANGUAGE: typeof SUPPORTED_LANGUAGES[0] = 'en-US';

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

async function initializeI18n(): Promise<void> {
  if (i18next.isInitialized) {
    return;
  }
  const localesBasePath = path.resolve(__dirname, '../../locales');

  await i18next
    .use(i18nextFsBackend)
    .use(i18nextHttpMiddleware.LanguageDetector) // Now correctly references the namespace
    .init({
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: [...SUPPORTED_LANGUAGES],
      defaultNS: 'common',
      ns: ['common', 'auth', 'errors', 'emails', 'api'],
      backend: {
        loadPath: path.join(localesBasePath, '{{lng}}/{{ns}}.json'),
        addPath: path.join(localesBasePath, '{{lng}}/{{ns}}.missing.json'),
      },
      detection: {
        order: ['querystring', 'cookie', 'header'],
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next-lng',
        lookupHeader: 'accept-language',
        caches: ['cookie'],
        cookieOptions: {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60 * 1000, 
        },
      },
      saveMissing: process.env.NODE_ENV === 'development',
      debug: process.env.NODE_ENV === 'development' && (process.env.LOG_LEVEL === 'debug' || process.env.LOG_LEVEL === 'trace'),
      interpolation: {
        escapeValue: false, 
      },
    });

  console.log('✅ i18next initialized successfully with filesystem backend.');
  if (process.env.NODE_ENV === 'development') {
    console.log(`i18n: Loading translations from: ${localesBasePath}`);
  }
}

export function normalizeLanguageCode(lang?: string): typeof SUPPORTED_LANGUAGES[number] {
  if (!lang) return DEFAULT_LANGUAGE;
  const lowerLang = lang.toLowerCase().trim();

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

export const customLanguageHandlerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  let languageToSet: string | undefined = req.lng; 

  if (req.query.force_lang && typeof req.query.force_lang === 'string') {
    languageToSet = req.query.force_lang;
  }

  const normalizedLang = normalizeLanguageCode(languageToSet);
  req.customLanguage = normalizedLang; 

  const i18nInstanceForRequest = req.i18n; 

  if (!i18nInstanceForRequest) {
    console.error(`i18n Critical Error: req.i18n is not available in customLanguageHandlerMiddleware for request to ${req.originalUrl}. This indicates a problem with i18nextHttpMiddleware setup or order. Language may not be correctly request-scoped.`);
    res.setHeader('Content-Language', normalizedLang);
    if (!req.lng) req.lng = normalizedLang;
    return next();
  }

  if (i18nInstanceForRequest.language !== normalizedLang) {
    i18nInstanceForRequest.changeLanguage(normalizedLang, (err: Error | null) => {
      if (err) {
        console.error(`i18n: Error changing language to '${normalizedLang}' on req.i18n:`, err);
      }
      req.lng = normalizedLang; 
      res.setHeader('Content-Language', normalizedLang);
      next();
    });
  } else {
    if (req.lng !== normalizedLang) req.lng = normalizedLang;
    res.setHeader('Content-Language', normalizedLang);
    next();
  }
};

export function t(key: string, options?: any, language?: string): string {
  const lngToUse = language || (i18next.isInitialized ? i18next.language : DEFAULT_LANGUAGE);
  const resolvedOptions = { ...options, lng: lngToUse };
  
  if (!i18next.isInitialized) {
      console.warn(`i18n (global t): i18next not initialized. Called for key '${key}'. Returning key.`);
      return key;
  }

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

export function getTranslations(namespace: string, language?: string): Record<string, any> {
  if (!i18next.isInitialized) {
    console.warn(`i18n (getTranslations): i18next not initialized. Called for namespace '${namespace}'. Returning empty object.`);
    return {};
  }
  const langToUse = normalizeLanguageCode(language || i18next.language || DEFAULT_LANGUAGE);
  try {
    const bundle = i18next.getResourceBundle(langToUse, namespace);
    return bundle || {};
  } catch (error) {
    console.warn(`i18n: Failed to get translations for namespace '${namespace}' in language '${langToUse}'.`, error);
    return {};
  }
}

export const customTranslationHelpersMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const userLanguage = req.customLanguage || req.lng || DEFAULT_LANGUAGE;

  const tForRequest = req.i18n ? req.i18n.t : (keyFromT: string, optionsFromT?: any) => {
      console.warn(`i18n (req.translate): req.i18n missing, falling back to global i18next for key '${keyFromT}'. This may not use correct request language if global language differs.`);
      return i18next.t(keyFromT, {...(optionsFromT || {}), lng: userLanguage });
  };

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

export async function setupI18nMiddleware(): Promise<Array<(req: Request, res: Response, next: NextFunction) => void>> {
  if (!i18next.isInitialized) {
    await initializeI18n();
  }

  return [
    i18nextHttpMiddleware.handle(i18next, { }), // Now correctly references the namespace
    customLanguageHandlerMiddleware,
    customTranslationHelpersMiddleware,
  ];
}

declare global {
  namespace Express {
    interface Request {
      i18n?: I18nInstanceType;
      lng?: string; 
      languages?: string[]; 
      t: TFunction; 
      
      customLanguage?: string; 
      translate?: (key: string, options?: any) => string; 
      getLocaleBundles?: (namespace: string) => Record<string, any>;
    }
  }
}

export default i18next;