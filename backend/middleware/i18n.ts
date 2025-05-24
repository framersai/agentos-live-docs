// File: backend/middleware/i18n.ts

import i18next from 'i18next';
import i18nextFsBackend from 'i18next-fs-backend';
import i18nextHttpMiddleware from 'i18next-http-middleware';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Supported languages configuration
 */
export const SUPPORTED_LANGUAGES = [
  'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 
  'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN'
];

export const DEFAULT_LANGUAGE = 'en-US';

/**
 * Language code mapping for shorter codes
 */
const LANGUAGE_MAP: Record<string, string> = {
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
 * Initialize i18next with backend resources
 */
async function initializeI18n(): Promise<void> {
  await i18next
    .use(i18nextFsBackend)
    .use(i18nextHttpMiddleware.LanguageDetector)
    .init({
      // Language settings
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: SUPPORTED_LANGUAGES,
      
      // Namespace settings
      defaultNS: 'common',
      ns: ['common', 'auth', 'errors', 'emails', 'api'],
      
      // Backend configuration
      backend: {
        loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
        addPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json'),
      },
      
      // Detection settings
      detection: {
        order: ['header', 'querystring', 'cookie', 'session'],
        lookupHeader: 'accept-language',
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        lookupSession: 'lng',
        caches: ['cookie'],
        cookieMinutes: 60 * 24 * 30, // 30 days
        cookieOptions: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        },
      },
      
      // Development settings
      saveMissing: process.env.NODE_ENV === 'development',
      debug: process.env.NODE_ENV === 'development',
      
      // Interpolation settings
      interpolation: {
        escapeValue: false, // React already does escaping
      },
      
      // React settings (for consistency with frontend)
      react: {
        useSuspense: false,
      },
    });

  console.log('✅ i18next initialized successfully');
}

/**
 * Normalize language code to supported format
 */
export function normalizeLanguageCode(lang?: string): string {
  if (!lang) return DEFAULT_LANGUAGE;
  
  // Handle short codes (en -> en-US)
  if (LANGUAGE_MAP[lang]) {
    return LANGUAGE_MAP[lang];
  }
  
  // Handle full codes (en-US)
  if (SUPPORTED_LANGUAGES.includes(lang)) {
    return lang;
  }
  
  // Handle partial matches (en-GB -> en-US)
  const shortCode = lang.split('-')[0];
  if (LANGUAGE_MAP[shortCode]) {
    return LANGUAGE_MAP[shortCode];
  }
  
  return DEFAULT_LANGUAGE;
}

/**
 * Custom language detection middleware
 */
export const languageDetectionMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Try to detect language from various sources
  let detectedLang = DEFAULT_LANGUAGE;
  
  // 1. Check Authorization header for user preference (from JWT)
  if (req.headers.authorization) {
    try {
      // This would be implemented with JWT decoding
      // const token = req.headers.authorization.split(' ')[1];
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // detectedLang = decoded.language || DEFAULT_LANGUAGE;
    } catch (error) {
      // Ignore JWT errors for language detection
    }
  }
  
  // 2. Check query parameter
  if (req.query.lang) {
    detectedLang = normalizeLanguageCode(req.query.lang as string);
  }
  
  // 3. Check Accept-Language header
  if (!req.query.lang && req.headers['accept-language']) {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLang = acceptLanguage.split(',')[0].split(';')[0];
    detectedLang = normalizeLanguageCode(preferredLang);
  }
  
  // 4. Check cookie
  if (req.cookies?.i18next) {
    detectedLang = normalizeLanguageCode(req.cookies.i18next);
  }
  
  // Set the language for this request
  req.language = detectedLang;
  
  // Set response header for frontend
  res.setHeader('Content-Language', detectedLang);
  
  next();
};

/**
 * Translation helper function for use in routes
 */
export function t(key: string, options?: any, language?: string): string {
  const lng = language || DEFAULT_LANGUAGE;
  return i18next.t(key, { ...options, lng });
}

/**
 * Get translations for a specific namespace and language
 */
export function getTranslations(namespace: string, language: string = DEFAULT_LANGUAGE): Record<string, any> {
  const normalizedLang = normalizeLanguageCode(language);
  
  try {
    return i18next.getResourceBundle(normalizedLang, namespace) || {};
  } catch (error) {
    console.warn(`Failed to get translations for ${namespace}:${normalizedLang}`, error);
    return {};
  }
}

/**
 * Middleware to add translation helpers to request
 */
export const translationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const userLanguage = req.language || DEFAULT_LANGUAGE;
  
  // Add translation function to request
  req.t = (key: string, options?: any) => t(key, options, userLanguage);
  
  // Add function to get full translation bundle
  req.getTranslations = (namespace: string) => getTranslations(namespace, userLanguage);
  
  next();
};

/**
 * Express middleware setup for i18n
 */
export async function setupI18nMiddleware() {
  await initializeI18n();
  
  return [
    i18nextHttpMiddleware.handle(i18next),
    languageDetectionMiddleware,
    translationMiddleware,
  ];
}

// Type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      language?: string;
      t?: (key: string, options?: any) => string;
      getTranslations?: (namespace: string) => Record<string, any>;
    }
  }
}

export default i18next;