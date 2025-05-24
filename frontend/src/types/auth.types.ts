// File: frontend/src/types/auth.types.ts (Ensure these are defined)

/**
 * Represents a user API key for an external service.
 * This should align with the `UserApiKey` model in `prisma.schema`.
 * @interface ApiKey
 */
export interface ApiKey {
  id: string;
  userId: string;
  providerId: string; // e.g., "openai", "openrouter", "custom_service"
  keyName?: string; // User-friendly name for the key
  maskedKey?: string; // e.g., "sk-xxxxxxxxxxxxxxXT4k" - DO NOT STORE FULL KEY ON CLIENT AFTER INITIAL SETUP
  encryptedKey?: string; // If backend sends it this way for some reason (usually not)
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  // Add any other relevant fields like 'lastUsedAt', 'scopes'
}


/**
 * Represents a user subscription tier.
 * This should align with the `SubscriptionTier` model in `prisma.schema`.
 * @interface SubscriptionTier
 */
export interface SubscriptionTier {
  id: string;
  name: string;
  description?: string;
  level: number;
  maxGmiInstances: number;
  maxApiKeys: number;
  maxConversationHistoryTurns: number;
  maxContextWindowTokens: number;
  dailyCostLimitUsd: number;
  monthlyCostLimitUsd: number;
  isPublic: boolean;
  features: string[]; // Array of feature flags or capability strings
  lemonSqueezyProductId?: string;
  lemonSqueezyVariantId?: string;
  priceMonthlyUsd?: number;
  priceYearlyUsd?: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Represents a user in the application.
 * This should align with the `User` model in `prisma.schema`.
 * @interface User
 */
export interface User {
  id: string; // uuid
  username: string;
  email: string;
  emailVerified: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  lastLoginAt?: string | null; // ISO date string
  subscriptionTierId?: string | null;
  // For security, passwordHash and sensitive tokens should NOT be sent to the client.
  // The backend should provide a DTO (Data Transfer Object) for the user profile.
  // Frontend `User` type should reflect this client-safe DTO.

  // Optional, if backend populates this relation in /auth/me response
  subscriptionTier?: SubscriptionTier | null;
  settings?: UserSettings; // User-specific application settings
}

/**
 * Represents user-specific application settings.
 * Could be a separate model or a JSON field on the User model.
 * @interface UserSettings
 */
export interface UserSettings {
  preferredTheme?: AppTheme; // from ui.types
  defaultVoiceLanguage?: string; // BCP 47 language code
  speechRecognitionEngine?: 'whisper' | 'webspeech';
  // Add other user-configurable settings
}


/**
 * Credentials for user login.
 * @interface LoginCredentials
 */
export interface LoginCredentials {
  email: string;
  passwordPlainText: string; // Name emphasizes it's plaintext before sending (over HTTPS)
}

/**
 * Data for user registration.
 * @interface RegistrationData
 */
export interface RegistrationData {
  username: string;
  email: string;
  passwordPlainText: string;
  // Optional: agreeToTerms: boolean;
}

/**
 * Expected response from successful authentication (login/register).
 * @interface AuthResponse
 */
export interface AuthResponse {
  user: User;
  token: string; // JWT
  subscription?: SubscriptionTier | null; // Optionally include subscription tier
  // Add any other relevant data, like feature flags specific to the user
}