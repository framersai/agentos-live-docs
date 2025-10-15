// File: backend/src/features/auth/auth.service.ts
/**
 * @file auth.service.ts
 * @description Business logic for authentication flows, token issuance, and validation.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { appConfig, type AuthTokenPayload, type AuthTier, type AuthRole } from '../../config/appConfig.js';
import {
  findUserByEmail,
  updateLastLogin,
  recordLoginEvent,
  logGlobalAccess,
  countGlobalAccessAttempts,
  createUser,
  updateUserSubscription,
  findUserById,
  type AppUser,
} from './user.repository.js';

const SALT_ROUNDS = 10;

type LoginResult = {
  token: string;
  user: {
    id: string;
    email?: string;
    role: AuthTokenPayload['role'];
    tier: AuthTokenPayload['tier'];
    mode: AuthTokenPayload['mode'];
    subscriptionStatus?: string;
  };
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

const issueToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, appConfig.auth.jwtSecret, { expiresIn: appConfig.auth.jwtExpiresIn });
};

export const verifyToken = (token: string): AuthTokenPayload | null => {
  try {
    return jwt.verify(token, appConfig.auth.jwtSecret) as AuthTokenPayload;
  } catch (error) {
    return null;
  }
};

export const globalPasswordLogin = async (password: string, context: { ip?: string | null; userAgent?: string | null }): Promise<LoginResult> => {
  if (!appConfig.auth.globalPassword) {
    throw new Error('GLOBAL_LOGIN_DISABLED');
  }

  const ip = context.ip ?? undefined;
  if (ip) {
    const windowMs = appConfig.rateLimits.globalLoginWindowMinutes * 60 * 1000;
    const attempts = countGlobalAccessAttempts(ip, Date.now() - windowMs);
    if (attempts >= appConfig.rateLimits.globalLoginMaxAttempts) {
      throw new Error('GLOBAL_LOGIN_RATE_LIMIT');
    }
  }

  if (password !== appConfig.auth.globalPassword) {
    recordLoginEvent({ mode: 'global-denied', ip: context.ip, userAgent: context.userAgent });
    throw new Error('INVALID_GLOBAL_PASSWORD');
  }

  logGlobalAccess({ ip: context.ip, userAgent: context.userAgent });
  recordLoginEvent({ mode: 'global', ip: context.ip, userAgent: context.userAgent });

  const token = issueToken({
    sub: 'global-access',
    role: 'global',
    tier: 'unlimited',
    mode: 'global',
    type: 'session',
  });

  return {
    token,
    user: {
      id: 'global-access',
      role: 'global',
      tier: 'unlimited',
      mode: 'global',
      subscriptionStatus: 'unlimited',
    },
  };
};

const ensureUserIsActive = (user: AppUser): void => {
  if (!user.is_active) {
    throw new Error('USER_INACTIVE');
  }
  if (user.subscription_status !== 'active' && user.subscription_status !== 'trialing') {
    throw new Error('SUBSCRIPTION_INACTIVE');
  }
};

export const toSessionUserPayload = (user: AppUser, options?: {
  mode?: 'standard' | 'global';
  tierOverride?: AuthTier;
  roleOverride?: AuthRole;
}) => {
  const tier = options?.tierOverride ?? ((user.subscription_tier as AuthTier) || 'metered');
  const role: AuthRole = options?.roleOverride ?? (tier === 'unlimited' ? 'global' : 'subscriber');
  return {
    id: user.id,
    email: user.email,
    role,
    tier,
    mode: options?.mode ?? (role === 'global' ? 'global' : 'standard'),
    subscriptionStatus: user.subscription_status,
  };
};

export const standardLogin = async (email: string, password: string, context: { ip?: string | null; userAgent?: string | null }): Promise<LoginResult> => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = findUserByEmail(normalizedEmail);
  if (!user) {
    recordLoginEvent({ mode: 'standard-denied', ip: context.ip, userAgent: context.userAgent });
    throw new Error('USER_NOT_FOUND');
  }

  const passwordMatches = await verifyPassword(password, user.password_hash);
  if (!passwordMatches) {
    recordLoginEvent({ userId: user.id, mode: 'standard-denied', ip: context.ip, userAgent: context.userAgent });
    throw new Error('INVALID_CREDENTIALS');
  }

  ensureUserIsActive(user);

  updateLastLogin(user.id, context.ip);
  recordLoginEvent({ userId: user.id, mode: 'standard', ip: context.ip, userAgent: context.userAgent });

  const role: AuthTokenPayload['role'] = 'subscriber';
  const tier = (user.subscription_tier as AuthTokenPayload['tier']) || 'metered';

  const token = issueToken({
    sub: user.id,
    role,
    tier,
    mode: 'standard',
    type: 'session',
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role,
      tier,
      mode: 'standard',
      subscriptionStatus: user.subscription_status,
    },
  };
};

export const upsertUserFromSubscription = (data: {
  email: string;
  passwordHash?: string;
  subscriptionStatus: string;
  subscriptionTier?: string;
  lemonCustomerId?: string;
  lemonSubscriptionId?: string;
  renewsAt?: number | null;
  expiresAt?: number | null;
}): AppUser => {
  const normalizedEmail = data.email.trim().toLowerCase();
  const existing = findUserByEmail(normalizedEmail);
  if (!existing) {
    const passwordHash = data.passwordHash ?? bcrypt.hashSync(Math.random().toString(36), SALT_ROUNDS);
    const newUser = createUser({
      email: normalizedEmail,
      passwordHash,
      subscriptionStatus: data.subscriptionStatus,
      subscriptionTier: data.subscriptionTier ?? 'unlimited',
      lemonCustomerId: data.lemonCustomerId,
      lemonSubscriptionId: data.lemonSubscriptionId,
      metadata: {},
    });
    updateUserSubscription(newUser.id, {
      status: data.subscriptionStatus,
      tier: data.subscriptionTier ?? 'unlimited',
      lemonCustomerId: data.lemonCustomerId ?? null,
      lemonSubscriptionId: data.lemonSubscriptionId ?? null,
      renewsAt: data.renewsAt ?? null,
      expiresAt: data.expiresAt ?? null,
    });
    return findUserById(newUser.id) as AppUser;
  }

  updateUserSubscription(existing.id, {
    status: data.subscriptionStatus,
    tier: data.subscriptionTier ?? existing.subscription_tier,
    lemonCustomerId: data.lemonCustomerId ?? existing.lemon_customer_id ?? null,
    lemonSubscriptionId: data.lemonSubscriptionId ?? existing.lemon_subscription_id ?? null,
    renewsAt: data.renewsAt ?? existing.subscription_renews_at ?? null,
    expiresAt: data.expiresAt ?? existing.subscription_expires_at ?? null,
  });
  return findUserById(existing.id) as AppUser;
};






