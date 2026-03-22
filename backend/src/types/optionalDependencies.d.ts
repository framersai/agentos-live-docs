// Optional dependency shims for TypeScript builds.
// These modules are loaded dynamically at runtime when installed.

declare module '@xenova/transformers' {
  export const env: any;
  export const pipeline: any;
  export const AutoProcessor: any;
  export const ClapAudioModelWithProjection: any;
}

declare module '@huggingface/transformers' {
  export const env: any;
  export const pipeline: any;
  export const AutoProcessor: any;
  export const ClapAudioModelWithProjection: any;
}

// Optional native/edge/vector deps used by workspace packages (typecheck-only).
declare module 'hnswlib-node' {
  export const HierarchicalNSW: any;
  const hnswlib: any;
  export default hnswlib;
}

declare module '@capacitor-community/sqlite' {
  export type CapacitorSQLitePlugin = any;
  export type SQLiteDBConnection = any;
  export const CapacitorSQLite: any;
  export const SQLiteConnection: any;
  const defaultExport: any;
  export default defaultExport;
}

declare module 'sql.js' {
  export type SqlJsStatic = any;
  export type SqlJsConfig = any;
  export type Database = any;
  const initSqlJs: any;
  export default initSqlJs;
}

declare module 'wavefile' {
  export const WaveFile: any;
  const wavefile: any;
  export default wavefile;
}

declare module 'pdf-parse' {
  export interface PdfParseResult {
    text?: string;
    numpages?: number;
    info?: Record<string, unknown>;
    metadata?: unknown;
    version?: string;
  }

  export default function pdfParse(
    dataBuffer: Buffer | Uint8Array,
    options?: Record<string, unknown>
  ): Promise<PdfParseResult>;
}

declare module 'mammoth' {
  export interface MammothMessage {
    type?: string;
    message?: string;
  }

  export interface MammothRawTextResult {
    value?: string;
    messages?: MammothMessage[];
  }

  export function extractRawText(input: {
    buffer: Buffer | Uint8Array;
  }): Promise<MammothRawTextResult>;

  const mammoth: {
    extractRawText: typeof extractRawText;
  };

  export default mammoth;
}

// Legacy JS route modules without TS declarations.
declare module '../../features/prompts/prompt.routes.js' {
  import type { Request, Response } from 'express';
  export function GET(req: Request, res: Response): Promise<void>;
}
