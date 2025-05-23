// backend/services/user_auth/User.ts
import { User as PrismaUser } from '@prisma/client';

/**
 * @interface IUserApiKeys
 * Defines the structure for user-provided API keys, where keys are provider IDs
 * and values are the encrypted API key strings.
 */
export interface IUserApiKeys {
  [providerId: string]: string;
}

/**
 * @interface User
 * Defines the core properties of a user in the AgentOS system, mirroring the Prisma `User` model.
 * This interface represents the full data model, including sensitive fields that should not be
 * exposed directly to the client without transformation.
 */
export interface User {
  /** Unique identifier for the user (e.g., UUID). */
  id: string;
  /** User's email address (should be unique). */
  email: string;
  /** Hashed password for the user. */
  passwordHash: string;
  /** The ID of the subscription tier the user belongs to. */
  subscriptionTierId: string;
  /** Stores user-provided API keys, encrypted at rest. Key: providerId, Value: encrypted API key. */
  apiKeys?: IUserApiKeys | null; // Changed to match Prisma's `Json?` type (can be null)
  /** Timestamp of user creation. */
  createdAt: Date;
  /** Timestamp of last update to user profile. */
  updatedAt: Date;
  /** Timestamp of the user's last login. */
  lastLogin?: Date | null; // Optional and can be null
  /** Current active JWT token for revocation, if a system was implemented to store/revoke these server-side. */
  jwtToken?: string | null; // Optional and can be null

  // Added based on previous architecture discussion for GMI state and user preferences
  /** Any other user-specific preferences or metadata. */
  preferences?: Record<string, any>;
  /** Tracks if user has opted into experimental/creator modes. */
  creatorModeOptIn?: boolean;
}

/**
 * @class User
 * Represents a user in the AgentOS system. This class provides utility methods
 * for transforming Prisma `User` objects into a more accessible domain model,
 * particularly for creating public-facing versions.
 */
export class User implements User { // Implements the interface for type consistency
  public id: string;
  public email: string;
  public passwordHash: string;
  public subscriptionTierId: string;
  public apiKeys?: IUserApiKeys | null;
  public createdAt: Date;
  public updatedAt: Date;
  public lastLogin?: Date | null;
  public jwtToken?: string | null;
  public preferences?: Record<string, any>;
  public creatorModeOptIn?: boolean;


  /**
   * Creates an instance of the User class from a Prisma User model.
   * @param prismaUser The raw Prisma User object retrieved from the database.
   */
  constructor(prismaUser: PrismaUser) {
    this.id = prismaUser.id;
    this.email = prismaUser.email;
    this.passwordHash = prismaUser.passwordHash;
    this.subscriptionTierId = prismaUser.subscriptionTierId;
    // Prisma Json type for apiKeys might be null or already an object, handle gracefully
    this.apiKeys = prismaUser.apiKeys ? (prismaUser.apiKeys as unknown as IUserApiKeys) : null;
    this.createdAt = prismaUser.createdAt;
    this.updatedAt = prismaUser.updatedAt;
    this.lastLogin = prismaUser.lastLogin;
    this.jwtToken = prismaUser.jwtToken;
    this.preferences = prismaUser.preferences ? (prismaUser.preferences as Record<string, any>) : undefined;
    this.creatorModeOptIn = prismaUser.creatorModeOptIn || false; // Default to false if not set
  }

  /**
   * Creates a User instance from a Prisma User object.
   * This static factory method provides a clean way to convert database results.
   * @param prismaUser The Prisma User object.
   * @returns The User instance.
   */
  static fromPrisma(prismaUser: PrismaUser): User {
    return new User(prismaUser);
  }

  /**
   * Returns a representation of the user that can be safely sent to the client,
   * excluding sensitive information like password hash and encrypted API keys.
   * @returns A user object without the password hash and encrypted API keys.
   */
  toPublicUser(): Omit<User, 'passwordHash' | 'apiKeys' | 'jwtToken'> {
    const { passwordHash, apiKeys, jwtToken, ...publicUser } = this;
    return publicUser;
  }
}