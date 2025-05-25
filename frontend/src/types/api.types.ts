// File: frontend/src/types/api.types.ts
/**
 * @fileoverview Complete API types including missing definitions
 * @module types/api
 */

/**
 * Standardized error response from backend API
 */
export interface ApiErrorResponse {
  message: string;
  error?: string;
  details?: any;
  timestamp?: string;
}

/**
 * Application error class for consistent error handling
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Generic paginated response
 */
export interface PaginatedApiResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

/**
 * Generic success response for mutations
 */
export interface MutationSuccessResponse {
  success: boolean;
  message: string;
  id?: string | number;
  data?: any;
}

/**
 * User object from auth responses
 */
export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  subscriptionTierId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  passwordPlainText: string;
  rememberMe?: boolean;
}

/**
 * Registration data
 */
export interface RegistrationData {
  username: string;
  email: string;
  passwordPlainText: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
  tokenExpiresAt?: string;
  subscription?: SubscriptionTier;
}

/**
 * Subscription tier information
 */
export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  level: number;
  maxGmiInstances: number;
  maxApiKeys: number;
  maxConversationHistoryTurns: number;
  maxContextWindowTokens: number;
  dailyCostLimitUsd: number;
  monthlyCostLimitUsd: number;
  features: string[];
  priceMonthlyUsd: number;
  priceYearlyUsd: number;
  isPublic: boolean;
}

/**
 * API key information
 */
export interface ApiKey {
  id: string;
  userId: string;
  providerId: string;
  keyName?: string;
  encryptedApiKey: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}