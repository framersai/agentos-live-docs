// File: backend/src/features/auth/auth.service.ts
/**
 * @file auth.service.ts
 * @description Business logic for authentication flows, token issuance, and validation.
 */

import bcrypt from 'bcryptjs';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { appConfig, type AuthTokenPayload, type AuthTier, type AuthRole, type AuthModeType } from '../../config/appConfig.js';
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
import { createSupabaseUserAccount, supabaseAuthEnabled } from './supabaseAuth.service.js';

const SALT_ROUNDS = 10;

type LoginResult = {
  token: string;
  user: {
    id: string;
    email?: string;
    role: AuthTokenPayload['role'];
    tier: AuthTokenPayload['tier'];
    mode: AuthModeType;
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
  const options: SignOptions = { expiresIn: appConfig.auth.jwtExpiresIn as StringValue };
  return jwt.sign(payload, appConfig.auth.jwtSecret as Secret, options);
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
    const attempts = await countGlobalAccessAttempts(ip, Date.now() - windowMs);
    if (attempts >= appConfig.rateLimits.globalLoginMaxAttempts) {
      throw new Error('GLOBAL_LOGIN_RATE_LIMIT');
    }
  }

  if (password !== appConfig.auth.globalPassword) {
    await recordLoginEvent({ mode: 'global-denied', ip: context.ip, userAgent: context.userAgent });
    throw new Error('INVALID_GLOBAL_PASSWORD');
  }

  await logGlobalAccess({ ip: context.ip, userAgent: context.userAgent });
  await recordLoginEvent({ mode: 'global', ip: context.ip, userAgent: context.userAgent });

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
  mode?: AuthModeType;
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
  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    await recordLoginEvent({ mode: 'standard-denied', ip: context.ip, userAgent: context.userAgent });
    throw new Error('USER_NOT_FOUND');
  }

  const passwordMatches = await verifyPassword(password, user.password_hash);
  if (!passwordMatches) {
    await recordLoginEvent({ userId: user.id, mode: 'standard-denied', ip: context.ip, userAgent: context.userAgent });
    throw new Error('INVALID_CREDENTIALS');
  }

  ensureUserIsActive(user);

  await updateLastLogin(user.id, context.ip);
  await recordLoginEvent({ userId: user.id, mode: 'standard', ip: context.ip, userAgent: context.userAgent });

  const role: AuthTokenPayload['role'] = 'subscriber';
  const tier = (user.subscription_tier as AuthTokenPayload['tier']) || 'metered';

  return createSessionForUser(user, { mode: 'standard', tierOverride: tier, roleOverride: role });
};

export const createSessionForUser = (user: AppUser, options?: { mode?: AuthModeType; tierOverride?: AuthTier; roleOverride?: AuthRole }) => {
  const sessionUser = toSessionUserPayload(user, options);
  const token = issueToken({
    sub: user.id,
    role: sessionUser.role,
    tier: sessionUser.tier,
    mode: sessionUser.mode,
    type: 'session',
    email: user.email,
  });
  return { token, user: sessionUser };
};

export const registerAccount = async (data: { email: string; password: string }): Promise<LoginResult> => {
  const email = data.email.trim().toLowerCase();
  if (!email || !data.password) {
    throw new Error('MISSING_CREDENTIALS');
  }
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('USER_ALREADY_EXISTS');
  }

  let supabaseUserId: string | null = null;
  if (supabaseAuthEnabled) {
    const supabaseUser = await createSupabaseUserAccount(email, data.password);
    supabaseUserId = supabaseUser?.id ?? null;
  }

  const passwordHash = await hashPassword(data.password);
  const newUser = await createUser({
    email,
    passwordHash,
    subscriptionStatus: 'pending',
    subscriptionTier: 'metered',
    supabaseUserId,
    metadata: { registrationStage: 'pending-checkout' },
  });

  await recordLoginEvent({ userId: newUser.id, mode: 'registration' });

  return createSessionForUser(newUser, {
    mode: 'registration',
    tierOverride: 'metered',
    roleOverride: 'subscriber',
  });
};

export const upsertUserFromSubscription = async (data: {
  email: string;
  passwordHash?: string;
  subscriptionStatus: string;
  subscriptionTier?: string;
  lemonCustomerId?: string;
  lemonSubscriptionId?: string;
  renewsAt?: number | null;
  expiresAt?: number | null;
}): Promise<AppUser> => {
  const normalizedEmail = data.email.trim().toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (!existing) {
    const passwordHash = data.passwordHash ?? bcrypt.hashSync(Math.random().toString(36), SALT_ROUNDS);
    const newUser = await createUser({
      email: normalizedEmail,
      passwordHash,
      subscriptionStatus: data.subscriptionStatus,
      subscriptionTier: data.subscriptionTier ?? 'unlimited',
      lemonCustomerId: data.lemonCustomerId,
      lemonSubscriptionId: data.lemonSubscriptionId,
      metadata: {},
    });
    await updateUserSubscription(newUser.id, {
      status: data.subscriptionStatus,
      tier: data.subscriptionTier ?? 'unlimited',
      lemonCustomerId: data.lemonCustomerId ?? null,
      lemonSubscriptionId: data.lemonSubscriptionId ?? null,
      renewsAt: data.renewsAt ?? null,
      expiresAt: data.expiresAt ?? null,
    });
    return (await findUserById(newUser.id)) as AppUser;
  }

  await updateUserSubscription(existing.id, {
    status: data.subscriptionStatus,
    tier: data.subscriptionTier ?? existing.subscription_tier,
    lemonCustomerId: data.lemonCustomerId ?? existing.lemon_customer_id ?? null,
    lemonSubscriptionId: data.lemonSubscriptionId ?? existing.lemon_subscription_id ?? null,
    renewsAt: data.renewsAt ?? existing.subscription_renews_at ?? null,
    expiresAt: data.expiresAt ?? existing.subscription_expires_at ?? null,
  });
  return (await findUserById(existing.id)) as AppUser;
};






