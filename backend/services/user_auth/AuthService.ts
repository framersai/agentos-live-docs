// backend/services/user_auth/User.ts

/**
 * @typedef {Object} UserApiKeys
 * @property {string} providerId - The ID of the LLM provider (e.g., "openai", "openrouter").
 * @property {string} apiKey - The actual API key (should be handled securely in the backend, not directly exposed here).
 */

/**
 * Represents a user in the AgentOS system.
 * This class mirrors the Prisma `User` model but provides a cleaner interface
 * for services to interact with, ensuring sensitive data like passwordHash is not
 * directly exposed or passed around unnecessarily.
 */
export class User {
  /**
   * Unique identifier for the user.
   * @type {string}
   */
  public id: string;

  /**
   * The user's unique username.
   * @type {string}
   */
  public username: string;

  /**
   * The user's unique email address.
   * @type {string}
   */
  public email: string;

  /**
   * The hashed password for authentication.
   * @type {string}
   */
  public passwordHash: string;

  /**
   * The date and time when the user account was created.
   * @type {Date}
   */
  public createdAt: Date;

  /**
   * The date and time when the user account was last updated.
   * @type {Date}
   */
  public updatedAt: Date;

  /**
   * The date and time of the user's last login.
   * @type {Date | null}
   */
  public lastLoginAt: Date | null;

  /**
   * The ID of the subscription tier the user belongs to.
   * @type {string | null}
   */
  public subscriptionTierId: string | null;

  /**
   * Constructor for the User class.
   * @param {Object} params - The parameters to initialize the user.
   * @param {string} params.id - The user's ID.
   * @param {string} params.username - The user's username.
   * @param {string} params.email - The user's email.
   * @param {string} params.passwordHash - The user's hashed password.
   * @param {Date} [params.createdAt=new Date()] - The creation timestamp.
   * @param {Date} [params.updatedAt=new Date()] - The last update timestamp.
   * @param {Date | null} [params.lastLoginAt=null] - The last login timestamp.
   * @param {string | null} [params.subscriptionTierId=null] - The ID of the subscription tier.
   */
  constructor(params: {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastLoginAt?: Date | null;
    subscriptionTierId?: string | null;
  }) {
    this.id = params.id;
    this.username = params.username;
    this.email = params.email;
    this.passwordHash = params.passwordHash;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.lastLoginAt = params.lastLoginAt || null;
    this.subscriptionTierId = params.subscriptionTierId || null;
  }

  /**
   * Creates a User instance from a Prisma User object.
   * @param {import('@prisma/client').User} prismaUser - The Prisma User object.
   * @returns {User} The User instance.
   */
  static fromPrisma(prismaUser: {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
    subscriptionTierId: string | null;
  }): User {
    return new User({
      id: prismaUser.id,
      username: prismaUser.username,
      email: prismaUser.email,
      passwordHash: prismaUser.passwordHash,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      lastLoginAt: prismaUser.lastLoginAt,
      subscriptionTierId: prismaUser.subscriptionTierId,
    });
  }

  /**
   * Returns a representation of the user that can be safely sent to the client,
   * excluding sensitive information like password hash.
   * @returns {Omit<User, 'passwordHash'>} A user object without the password hash.
   */
  toPublicUser(): Omit<User, 'passwordHash'> {
    const { passwordHash, ...publicUser } = this;
    return publicUser;
  }
}

/**
 * @typedef {Omit<User, 'passwordHash'>} PublicUser
 * A type representing the public-facing user object, without sensitive details.
 */
export type PublicUser = Omit<User, 'passwordHash' | 'email' | 'passwordHash'>; // Exclude email as well if it's sensitive in public context