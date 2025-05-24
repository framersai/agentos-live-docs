// File: frontend/src/types/api.types.ts
/**
 * @fileoverview TypeScript types and interfaces related to API interactions.
 * This includes request payloads, response structures, and error formats.
 * @module types/api
 */

/**
 * Represents the standardized structure of an error response from the backend API.
 * @interface ApiErrorResponse
 */
export interface ApiErrorResponse {
  /** A human-readable message describing the error. */
  message: string;
  /**
   * An optional error code or short string identifier for the error type.
   * This can be used for more specific error handling on the client-side.
   * @example "VALIDATION_FAILED", "RESOURCE_NOT_FOUND"
   */
  error?: string;
  /**
   * Optional: Additional details or context about the error.
   * This could be an object containing validation errors, or other relevant information.
   * @example { "field": "email", "issue": "Email is already taken" }
   */
  details?: any;
}

/**
 * Represents a generic successful API response structure, often used for paginated data.
 * @template T - The type of the data items in the payload.
 * @interface PaginatedApiResponse
 */
export interface PaginatedApiResponse<T> {
  /** The array of data items for the current page. */
  items: T[];
  /** The total number of items available across all pages. */
  totalItems: number;
  /** The current page number. */
  currentPage: number;
  /** The number of items per page. */
  itemsPerPage: number;
  /** The total number of pages. */
  totalPages: number;
}

/**
 * Represents a generic success response from an API mutation (POST, PUT, DELETE).
 * @interface MutationSuccessResponse
 */
export interface MutationSuccessResponse {
  /** Indicates if the operation was successful. */
  success: boolean;
  /** A human-readable message confirming the success of the operation. */
  message: string;
  /** Optional: The ID of the created or affected resource. */
  id?: string | number;
  /** Optional: The newly created or updated resource data. */
  data?: any;
}

// Add other shared API types as needed, for example:
// export interface UserProfileResponse { ... }
// export interface SettingsUpdateRequest { ... }