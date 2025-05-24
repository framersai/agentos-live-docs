// File: backend/services/user_auth/User.ts
/**
 * @fileoverview Defines the User domain model and related types for AgentOS.
 * This model represents a user in the system, encapsulating their core attributes
 * and providing utility methods for data transformation (e.g., for public presentation).
 * It is designed to align with the Prisma schema for the User entity.
 *
 * @module backend/services/user_auth/User
 */

import { User as PrismaUserType, UserApiKey as PrismaUserApiKeyType, SubscriptionTier as PrismaSubscriptionTierType } from '@prisma/client';

/**
 * Represents the structure for user-provided API keys.
 * Keys are provider IDs (e.g., "openai"), and values are the encrypted API key strings.
 * This interface is used internally and not directly exposed with decrypted keys.
 *
 * @interface IUserApiKeys
 */
export interface IUserApiKeys {
  [providerId: string]: string;
}

/**
 * Defines the public-facing representation of a User, excluding sensitive information.
 * This type is suitable for sending user data to clients.
 *
 * @type PublicUser
 * @property {string} id - The unique identifier of the user.
 * @property {string} username - The user's chosen username.
 * @property {string} email - The user's email address (consider if this should always be public).
 * @property {string | null} subscriptionTierId - The ID of the user's current subscription tier.
 * @property {Date} createdAt - The timestamp of when the user account was created.
 * @property {Date} updatedAt - The timestamp of the last update to the user's account.
 * @property {Date | null} lastLoginAt - The timestamp of the user's last login, if available.
 * @property {Record<string, any>} [preferences] - User-specific preferences.
 * @property {boolean} [creatorModeOptIn] - Indicates if the user has opted into creator/experimental modes.
 * @property {boolean} emailVerified - Indicates if the user's email address has been verified.
 */
export type PublicUser = Pick<
  User,
  'id' | 'username' | 'email' | 'subscriptionTierId' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'preferences' | 'creatorModeOptIn' | 'emailVerified'
>;

/**
 * Represents a user in the AgentOS system.
 * This class mirrors the Prisma `User` model and provides methods for data transformation
 * and consistent handling of user objects within the application.
 *
 * @class User
 */
export class User {
  public readonly id: string;
  public username: string;
  public email: string;
  public readonly passwordHash: string; // Readonly after construction for security
  public subscriptionTierId: string | null;
  // UserApiKeys are managed via AuthService, not directly held here in decrypted form
  public readonly createdAt: Date;
  public updatedAt: Date;
  public lastLoginAt: Date | null;
  public emailVerified: boolean;
  public emailVerificationToken: string | null;
  public resetPasswordToken: string | null;
  public resetPasswordExpires: Date | null;
  public lemonSqueezyCustomerId: string | null;
  public lemonSqueezySubscriptionId: string | null;
  public subscriptionStatus: string | null;
  public subscriptionEndsAt: Date | null;
  public preferences?: Record<string, any>; // Matches conceptual User interface
  public creatorModeOptIn?: boolean;     // Matches conceptual User interface

  /**
   * Constructs a User instance. It's recommended to use `User.fromPrisma` for creation.
   * @param {PrismaUserType} prismaUser - The Prisma user object.
   */
  private constructor(prismaUser: PrismaUserType) {
    this.id = prismaUser.id;
    this.username = prismaUser.username;
    this.email = prismaUser.email;
    this.passwordHash = prismaUser.passwordHash;
    this.subscriptionTierId = prismaUser.subscriptionTierId;
    this.createdAt = prismaUser.createdAt;
    this.updatedAt = prismaUser.updatedAt;
    this.lastLoginAt = prismaUser.lastLoginAt;
    this.emailVerified = prismaUser.emailVerified;
    this.emailVerificationToken = prismaUser.emailVerificationToken;
    this.resetPasswordToken = prismaUser.resetPasswordToken;
    this.resetPasswordExpires = prismaUser.resetPasswordExpires;
    this.lemonSqueezyCustomerId = prismaUser.lemonSqueezyCustomerId;
    this.lemonSqueezySubscriptionId = prismaUser.lemonSqueezySubscriptionId;
    this.subscriptionStatus = prismaUser.subscriptionStatus;
    this.subscriptionEndsAt = prismaUser.subscriptionEndsAt;
    // Assuming preferences & creatorModeOptIn might not be in PrismaUser directly,
    // or require casting if they are Json. For now, they are not standard in the provided PrismaUser.
    // This part of User model might need to be reconciled with Prisma schema if these fields are intended.
    this.preferences = {}; // Default to empty or load if part of PrismaUser via Json type
    this.creatorModeOptIn = false; // Default
  }

  /**
   * Static factory method to create a User instance from a Prisma User object.
   * This is the preferred way to instantiate User objects from database records.
   *
   * @static
   * @param {PrismaUserType} prismaUser - The Prisma User object retrieved from the database.
   * @returns {User} A new User instance populated with data from the Prisma object.
   */
  public static fromPrisma(prismaUser: PrismaUserType): User {
    return new User(prismaUser);
  }

  /**
   * Returns a public representation of the user, suitable for sending to clients.
   * This method omits sensitive fields like `passwordHash` and any raw token data.
   *
   * @public
   * @returns {PublicUser} A user object stripped of sensitive information.
   */
  public toPublicUser(): PublicUser {
    return {
      id: this.id,
      username: this.username,
      email: this.email, // Consider if email should always be public or context-dependent
      subscriptionTierId: this.subscriptionTierId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLoginAt: this.lastLoginAt,
      emailVerified: this.emailVerified,
      preferences: this.preferences,
      creatorModeOptIn: this.creatorModeOptIn,
    };
  }
}