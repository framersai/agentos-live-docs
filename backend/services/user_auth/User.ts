// File: backend/services/user_auth/User.ts
/**
 * @fileoverview User class and types with proper exports
 * FIXES: Export User, UserApiKey, and SubscriptionTier types properly
 */

import { User as PrismaUser, UserApiKey as PrismaUserApiKey, SubscriptionTier as PrismaSubscriptionTier } from '@prisma/client';

// FIXED: Export User interface
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
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

// FIXED: Export UserApiKey interface
export interface UserApiKey {
  id: string;
  userId: string;
  providerId: string;
  encryptedKey: string;
  keyName?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// FIXED: Export SubscriptionTier interface
export interface SubscriptionTier {
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
 * Public user representation (excludes sensitive data like password hash).
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
 * User class with utility methods for working with user data.
 */
export class User {
  private constructor(private data: User) {}

  /**
   * Creates a User instance from Prisma user data.
   */
  static fromPrisma(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      username: prismaUser.username,
      email: prismaUser.email,
      passwordHash: prismaUser.passwordHash,
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
    });
  }

  /**
   * Converts the user to a public representation (excludes sensitive data).
   */
  toPublicUser(): PublicUser {
    return {
      id: this.data.id,
      username: this.data.username,
      email: this.data.email,
      emailVerified: this.data.emailVerified,
      createdAt: this.data.createdAt,
      updatedAt: this.data.updatedAt,
      lastLoginAt: this.data.lastLoginAt,
      subscriptionTierId: this.data.subscriptionTierId,
    };
  }

  /**
   * Gets the full user data (including sensitive fields).
   */
  getFullUser(): User {
    return { ...this.data };
  }

  /**
   * Gets the user ID.
   */
  get id(): string {
    return this.data.id;
  }

  /**
   * Gets the username.
   */
  get username(): string {
    return this.data.username;
  }

  /**
   * Gets the email.
   */
  get email(): string {
    return this.data.email;
  }

  /**
   * Checks if the user's email is verified.
   */
  get isEmailVerified(): boolean {
    return this.data.emailVerified;
  }

  /**
   * Gets the subscription tier ID.
   */
  get subscriptionTierId(): string | null {
    return this.data.subscriptionTierId;
  }

  /**
   * Checks if the user has a subscription.
   */
  hasSubscription(): boolean {
    return !!this.data.subscriptionTierId && this.data.subscriptionTierId !== 'free';
  }

  /**
   * Gets the LemonSqueezy customer ID.
   */
  get lemonSqueezyCustomerId(): string | null {
    return this.data.lemonSqueezyCustomerId;
  }

  /**
   * Gets the current subscription status.
   */
  get subscriptionStatus(): string | null {
    return this.data.subscriptionStatus;
  }

  /**
   * Checks if the subscription is active.
   */
  isSubscriptionActive(): boolean {
    return this.data.subscriptionStatus === 'active';
  }

  /**
   * Checks if the subscription is cancelled.
   */
  isSubscriptionCancelled(): boolean {
    return this.data.subscriptionStatus === 'cancelled';
  }

  /**
   * Gets when the subscription ends.
   */
  get subscriptionEndsAt(): Date | null {
    return this.data.subscriptionEndsAt;
  }

  /**
   * Checks if the subscription has expired.
   */
  isSubscriptionExpired(): boolean {
    if (!this.data.subscriptionEndsAt) {
      return false;
    }
    return new Date() > this.data.subscriptionEndsAt;
  }

  /**
   * Gets the last login timestamp.
   */
  get lastLoginAt(): Date | null {
    return this.data.lastLoginAt;
  }

  /**
   * Gets the account creation timestamp.
   */
  get createdAt(): Date {
    return this.data.createdAt;
  }

  /**
   * Gets the last account update timestamp.
   */
  get updatedAt(): Date {
    return this.data.updatedAt;
  }
}