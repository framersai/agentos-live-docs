/// <reference types="vite/client" />

/**
 * Defines the structure of environment variables available through `import.meta.env`.
 * These variables are typically set in `.env` files and prefixed with `VITE_`.
 */
interface ImportMetaEnv {
  /** Shared password for accessing certain features or the application. */
  readonly VITE_SHARED_PASSWORD: string;
  /** Cost threshold for session usage, as a string (parsed to float in application). */
  readonly VITE_COST_THRESHOLD: string;
  /** Base URL for the API endpoints. */
  readonly VITE_API_URL: string;
  /** Default language for the application or AI interactions. */
  readonly VITE_DEFAULT_LANGUAGE: string;
  /** Flag to enable or disable debug mode features, as a string (parsed to boolean). */
  readonly VITE_DEBUG_MODE: string;
}

/**
 * Extends the global `ImportMeta` interface to include the typed `env` property.
 */
interface ImportMeta {
  /**
   * Provides access to Vite-specific environment variables.
   * @see {@link ImportMetaEnv} for the structure of available variables.
   */
  readonly env: ImportMetaEnv;
}