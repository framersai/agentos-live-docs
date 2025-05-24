// File: frontend/src/types/index.ts
/**
 * @fileoverview Barrel file for exporting all shared TypeScript types and interfaces
 * used across the frontend application. This promotes easier imports and better organization.
 * @module types/index
 */

export * from './api.types';
export * from './auth.types';
export * from './config.types.ts';
export * from './i18n.types';
export * from './ui.types';
export * from './voice.types';

/**
 * Represents a generic option for select inputs or lists.
 * @interface SelectOption
 * @template T - The type of the value for the option.
 */
export interface SelectOption<T = string | number> {
  /** The value of the option. */
  value: T;
  /** The human-readable label for the option. */
  label: string;
  /** Optional: If the option is disabled. */
  disabled?: boolean;
  /** Optional: Any additional data associated with the option. */
  meta?: Record<string, any>;
}

/**
 * Represents the structure for an error object used throughout the application.
 * @interface AppError
 */
export interface AppError {
  /** A unique code identifying the type of error. */
  code: string;
  /** A human-readable message describing the error. */
  message: string;
  /** Optional: Additional details or context about the error. */
  details?: any;
  /** Optional: The HTTP status code if the error originated from an API call. */
  statusCode?: number;
}