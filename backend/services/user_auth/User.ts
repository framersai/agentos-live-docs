/**
 * @file backend/services/user_auth/User.ts
 * @module backend/services/user_auth/User
 * @version 1.2.0
 *
 * @description
 * This module defines data structures and a domain class related to users.
 * - `UserData`: Interface representing the complete data structure of a user, typically aligning with the database model.
 * - `UserApiKeyData`: Interface for user-provided API keys.
 * - `SubscriptionTierData`: Interface for subscription tier details.
 * - `PublicUser`: Interface for the publicly exposable representation of a user, omitting sensitive data.
 * - `User (class)`: A domain model class that wraps `UserData`. It provides utility methods and getters for
 * accessing user properties and can encapsulate user-related business logic. It includes a static factory
 * method `fromPrisma` to create instances from Prisma's user model.
 *
 * This separation allows for a clear distinction between raw data structures and the domain model with behavior.
 *
 * Key Dependencies: `@prisma/client` for `PrismaUser` type.
 * Key Assumptions: The `User` class is intended as a richer domain object, while interfaces define data contracts.
 */

import { User as PrismaUser, UserApiKey as PrismaUserApiKey, SubscriptionTier as PrismaSubscriptionTier } from '@prisma/client';

/**
 * @interface UserData
 * @description Defines the complete data structure for a user entity. This interface is typically used
 * internally within the application or by the `User` domain class to represent all persisted user attributes.
 * It aligns closely with the `User` model defined in the Prisma schema.
 *
 * @property {string} id - The unique UUID of the user.
 * @property {string} username - The user's chosen unique username.
 * @property {string} email - The user's unique email address.
 * @property {string | null} passwordHash - The securely hashed password. Null if the user signed up via OAuth and has no local password.
 * @property {boolean} emailVerified - Flag indicating if the user's email address has been verified.
 * @property {string | null} [emailVerificationToken] - Token used for verifying the email address. Nullified after verification.
 * @property {string | null} [resetPasswordToken] - Token used for the password reset process. Nullified after use or expiration.
 * @property {Date | null} [resetPasswordExpires] - Expiry date for the `resetPasswordToken`.
 * @property {Date} createdAt - Timestamp of when the user account was created.
 * @property {Date} updatedAt - Timestamp of the last update to the user account.
 * @property {Date | null} [lastLoginAt] - Timestamp of the user's last login.
 * @property {string | null} [subscriptionTierId] - Foreign key referencing the user's current `SubscriptionTier`.
 * @property {string | null} [lemonSqueezyCustomerId] - Customer ID from LemonSqueezy, if applicable.
 * @property {string | null} [lemonSqueezySubscriptionId] - Subscription ID from LemonSqueezy, if applicable.
 * @property {string | null} [subscriptionStatus] - Current status of the user's subscription (e.g., "active", "cancelled").
 * @property {Date | null} [subscriptionEndsAt] - Date when the current subscription period ends or grace period expires.
 */
export interface UserData {
  id: string;
  username: string;
  email: string;
  passwordHash: string | null;
  emailVerified: boolean;
  emailVerificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
  subscriptionTierId?: string | null;
  lemonSqueezyCustomerId?: string | null;
  lemonSqueezySubscriptionId?: string | null;
  subscriptionStatus?: string | null;
  subscriptionEndsAt?: Date | null;
}

/**
 * @interface UserApiKeyData
 * @description Defines the data structure for a user-provided API key for an external service.
 * This interface typically aligns with the `UserApiKey` model in the Prisma schema.
 *
 * @property {string} id - The unique UUID of the API key record.
 * @property {string} userId - The ID of the user who owns this API key.
 * @property {string} providerId - Identifier for the external service provider (e.g., "openai", "anthropic").
 * @property {string} encryptedKey - The API key, securely encrypted.
 * @property {string | null} [keyName] - An optional, user-friendly name for the key.
 * @property {boolean} isActive - Flag indicating if the key is currently active and usable.
 * @property {Date} createdAt - Timestamp of when the API key record was created.
 * @property {Date} updatedAt - Timestamp of the last update to the API key record.
 */
export interface UserApiKeyData {
  id: string;
  userId: string;
  providerId: string;
  encryptedKey: string;
  keyName?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // lastUsedAt?: Date | null; // This was in your merged Prisma schema for UserApiKey, added here for completeness.
}

/**
 * @interface SubscriptionTierData
 * @description Defines the data structure for a subscription tier, outlining its features and limits.
 * This interface typically aligns with the `SubscriptionTier` model in the Prisma schema.
 * (Note: This duplicates `ISubscriptionTier` from `ISubscriptionService`. Consider consolidating into a common types file.)
 *
 * @property {string} id - The unique UUID of the subscription tier.
 * @property {string} name - The name of the tier (e.g., "Free", "Pro").
 * @property {string | null} [description] - A brief description of the tier.
 * @property {number} level - A numerical level for the tier, used for comparison and ordering.
 * @property {number} maxGmiInstances - Maximum number of concurrent GMI instances allowed.
 * @property {number} maxApiKeys - Maximum number of user-provided API keys allowed.
 * @property {number} maxConversationHistoryTurns - Limit on conversation history.
 * @property {number} maxContextWindowTokens - Maximum context window size for LLMs under this tier.
 * @property {number} dailyCostLimitUsd - Daily spending cap in USD.
 * @property {number} monthlyCostLimitUsd - Monthly spending cap in USD.
 * @property {boolean} isPublic - Whether this tier's features can be accessed by unauthenticated users.
 * @property {string[]} features - An array of feature flags or capability identifiers enabled for this tier.
 * @property {string | null} [lemonSqueezyProductId] - Product ID from LemonSqueezy, if applicable.
 * @property {string | null} [lemonSqueezyVariantId] - Variant ID from LemonSqueezy, if applicable.
 * @property {number | null} [priceMonthlyUsd] - Monthly price in USD.
 * @property {number | null} [priceYearlyUsd] - Yearly price in USD.
 * @property {Date} createdAt - Timestamp of when the tier was created.
 * @property {Date} updatedAt - Timestamp of the last update to the tier.
 */
export interface SubscriptionTierData {
  id: string;
  name: string;
  description?: string | null;
  level: number;
  maxGmiInstances: number;
  maxApiKeys: number;
  maxConversationHistoryTurns: number;
  maxContextWindowTokens: number;
  dailyCostLimitUsd: number;
  monthlyCostLimitUsd: number;
  isPublic: boolean;
  features: string[];
  lemonSqueezyProductId?: string | null;
  lemonSqueezyVariantId?: string | null;
  priceMonthlyUsd?: number | null;
  priceYearlyUsd?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface PublicUser
 * @description Defines the publicly accessible representation of a user.
 * This structure is safe to return in API responses as it excludes sensitive information
 * such as password hashes, verification tokens, etc.
 *
 * @property {string} id - The unique UUID of the user.
 * @property {string} username - The user's username.
 * @property {string} email - The user's email address.
 * @property {boolean} emailVerified - Indicates if the user's email has been verified.
 * @property {Date} createdAt - Timestamp of account creation.
 * @property {Date} updatedAt - Timestamp of the last profile update.
 * @property {Date | null} [lastLoginAt] - Timestamp of the last login.
 * @property {string | null} [subscriptionTierId] - ID of the user's current subscription tier.
 */
export interface PublicUser {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
  subscriptionTierId?: string | null;
}

/**
 * @class User
 * @implements {UserData}
 * @description
 * A domain model class representing a user. It wraps the raw `UserData` (which aligns with Prisma's User model)
 * and provides convenient getters for accessing user properties and methods for user-related logic.
 * This class should be used when you need to work with a user object that has behavior,
 * as opposed to just a plain data structure.
 *
 * @example
 * // Creating a User instance from a Prisma object
 * const prismaUserFromDb = await prisma.user.findUnique({ where: { id: userId } });
 * if (prismaUserFromDb) {
 * const userDomainObject = User.fromPrisma(prismaUserFromDb);
 * console.log(userDomainObject.username);
 * const publicView = userDomainObject.toPublicUser();
 * }
 */
export class User implements UserData {
  // To satisfy UserData, these properties must be public or have public getters.
  // The getters below will fulfill this if the private `_data` matches UserData.
  public readonly id: string;
  public readonly username: string;
  public readonly email: string;
  public readonly passwordHash: string | null;
  public readonly emailVerified: boolean;
  public readonly emailVerificationToken?: string | null;
  public readonly resetPasswordToken?: string | null;
  public readonly resetPasswordExpires?: Date | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly lastLoginAt?: Date | null;
  public readonly subscriptionTierId?: string | null;
  public readonly lemonSqueezyCustomerId?: string | null;
  public readonly lemonSqueezySubscriptionId?: string | null;
  public readonly subscriptionStatus?: string | null;
  public readonly subscriptionEndsAt?: Date | null;

  /**
   * Private constructor to enforce creation via the static `fromPrisma` factory method.
   * This ensures that User domain objects are always created from a valid data source (PrismaUser).
   *
   * @private
   * @constructor
   * @param {UserData} data - The raw data for this user instance, conforming to the `UserData` interface.
   */
  private constructor(data: UserData) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.emailVerified = data.emailVerified;
    this.emailVerificationToken = data.emailVerificationToken;
    this.resetPasswordToken = data.resetPasswordToken;
    this.resetPasswordExpires = data.resetPasswordExpires;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.lastLoginAt = data.lastLoginAt;
    this.subscriptionTierId = data.subscriptionTierId;
    this.lemonSqueezyCustomerId = data.lemonSqueezyCustomerId;
    this.lemonSqueezySubscriptionId = data.lemonSqueezySubscriptionId;
    this.subscriptionStatus = data.subscriptionStatus;
    this.subscriptionEndsAt = data.subscriptionEndsAt;
  }

  /**
   * Creates a `User` domain instance from a `PrismaUser` object (the type generated by Prisma).
   * This factory method is the preferred way to instantiate `User` objects.
   *
   * @static
   * @method fromPrisma
   * @param {PrismaUser} prismaUser - The user object fetched from the database via Prisma.
   * @returns {User} A new `User` domain instance populated with data from `prismaUser`.
   */
  public static fromPrisma(prismaUser: PrismaUser): User {
    // Explicitly map all fields from PrismaUser to the UserData structure required by the constructor
    const userData: UserData = {
      id: prismaUser.id,
      username: prismaUser.username,
      email: prismaUser.email,
      passwordHash: prismaUser.passwordHash, // PrismaUser.passwordHash is String, so direct assignment is fine.
      emailVerified: prismaUser.emailVerified,
      emailVerificationToken: prismaUser.emailVerificationToken,
      resetPasswordToken: prismaUser.resetPasswordToken,
      resetPasswordExpires: prismaUser.resetPasswordExpires,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      lastLoginAt: prismaUser.lastLoginAt,
      subscriptionTierId: prismaUser.subscriptionTierId,
      lemonSqueezyCustomerId: prismaUser.lemonSqueezyCustomerId,
      lemonSqueezySubscriptionId: prismaUser.lemonSqueezySubscriptionId,
      subscriptionStatus: prismaUser.subscriptionStatus,
      subscriptionEndsAt: prismaUser.subscriptionEndsAt,
    };
    return new User(userData);
  }

  /**
   * Converts the `User` domain instance to its public representation (`PublicUser`),
   * which excludes sensitive information like password hashes and internal tokens.
   * This method is suitable for preparing user data to be sent to clients or displayed in non-admin contexts.
   *
   * @method toPublicUser
   * @returns {PublicUser} The public representation of this user.
   */
  public toPublicUser(): PublicUser {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      emailVerified: this.emailVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLoginAt: this.lastLoginAt,
      subscriptionTierId: this.subscriptionTierId,
    };
  }

  /**
   * Gets the full underlying `UserData` object.
   * This method provides access to all properties of the user, including potentially sensitive ones.
   * It should be used with caution, primarily for internal operations where the complete data set is required.
   * Consider whether `toPublicUser()` is more appropriate for the use case.
   *
   * @method getFullUserData
   * @returns {UserData} A copy of the complete internal user data object.
   */
  public getFullUserData(): UserData {
    // Return a copy to maintain immutability of the internal `data` object if desired,
    // though the class properties are already direct mappings.
    return {
        id: this.id,
        username: this.username,
        email: this.email,
        passwordHash: this.passwordHash,
        emailVerified: this.emailVerified,
        emailVerificationToken: this.emailVerificationToken,
        resetPasswordToken: this.resetPasswordToken,
        resetPasswordExpires: this.resetPasswordExpires,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        lastLoginAt: this.lastLoginAt,
        subscriptionTierId: this.subscriptionTierId,
        lemonSqueezyCustomerId: this.lemonSqueezyCustomerId,
        lemonSqueezySubscriptionId: this.lemonSqueezySubscriptionId,
        subscriptionStatus: this.subscriptionStatus,
        subscriptionEndsAt: this.subscriptionEndsAt,
    };
  }

  // Getters are now implicitly defined by the public readonly properties from the constructor.
  // Additional behavioral methods can be added below.

  /**
   * Checks if the user has an active, non-free subscription.
   * The definition of "free" might be based on tier name, level, or a specific ID.
   * This example assumes a tier named "Free" or a tier ID commonly associated with free plans.
   *
   * @method hasActivePaidSubscription
   * @returns {boolean} True if the user has an active paid subscription, false otherwise.
   * @example
   * if (user.hasActivePaidSubscription()) {
   * // Grant access to premium features
   * }
   */
  public hasActivePaidSubscription(): boolean {
    // Example logic: refine based on how "free" vs "paid" tiers are defined.
    // This assumes 'subscriptionStatus' accurately reflects payment and 'free' is a specific tier ID or name convention.
    const freeTierId = "ID_OF_YOUR_FREE_TIER"; // This should be a constant or configurable
    return (
        this.subscriptionStatus === 'active' &&
        this.subscriptionTierId !== null &&
        this.subscriptionTierId !== undefined &&
        this.subscriptionTierId !== freeTierId // Compare against your actual free tier ID or criteria
    );
  }

  /**
   * Checks if the user's subscription (if any) has expired.
   *
   * @method isSubscriptionExpired
   * @returns {boolean} True if the subscription end date has passed, false otherwise or if no end date.
   */
  public isSubscriptionExpired(): boolean {
    if (!this.subscriptionEndsAt) {
      return false; // No end date typically means ongoing or not applicable.
    }
    return new Date() > this.subscriptionEndsAt;
  }
}