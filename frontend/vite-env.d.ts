/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHARED_PASSWORD?: string;
  // Add any other VITE_ environment variables your app uses
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}