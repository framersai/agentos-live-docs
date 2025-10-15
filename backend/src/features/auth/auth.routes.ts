// File: backend/src/features/auth/auth.routes.ts
/**
 * @file Authentication API route handlers.
 * @description Handles global access login, standard login, status checks, and logout.
 */

import type { Request, Response } from 'express';
import { appConfig } from '../../config/appConfig.js';
import { globalPasswordLogin, standardLogin } from './auth.service.js';

const getClientIp = (req: Request): string | null => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string') return realIp;
  if (Array.isArray(realIp) && realIp.length > 0) return realIp[0];
  return req.ip || req.socket.remoteAddress || null;
};

const setRememberMeCookie = (res: Response, token: string, rememberMe: boolean): void => {
  if (!rememberMe) return;
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });
};

const mapAuthErrorToStatus = (error: Error): number => {
  switch (error.message) {
    case 'GLOBAL_LOGIN_DISABLED':
      return 503;
    case 'INVALID_GLOBAL_PASSWORD':
    case 'INVALID_CREDENTIALS':
      return 401;
    case 'USER_NOT_FOUND':
      return 404;
    case 'USER_INACTIVE':
    case 'SUBSCRIPTION_INACTIVE':
      return 403;
    case 'GLOBAL_LOGIN_RATE_LIMIT':
      return 429;
    default:
      return 500;
  }
};

export const postGlobalLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password, rememberMe = false } = req.body as { password?: string; rememberMe?: boolean };

    if (!password) {
      res.status(400).json({ message: 'Global password is required.', error: 'MISSING_PASSWORD' });
      return;
    }

    if (!appConfig.auth.globalPassword) {
      res.status(503).json({ message: 'Global access password not configured.', error: 'GLOBAL_LOGIN_DISABLED' });
      return;
    }

    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] ?? null;
    const result = await globalPasswordLogin(password, { ip, userAgent: typeof userAgent === 'string' ? userAgent : null });

    setRememberMeCookie(res, result.token, rememberMe);

    res.status(200).json({
      message: 'Global access granted.',
      token: result.token,
      user: result.user,
      rememberMe,
      tokenProvider: 'global',
    });
  } catch (error: any) {
    const status = mapAuthErrorToStatus(error);
    const message = error.message === 'GLOBAL_LOGIN_RATE_LIMIT'
      ? 'Too many global access attempts. Try again later.'
      : 'Global access denied.';
    res.status(status).json({
      message,
      error: error.message,
    });
  }
};

export const postStandardLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, rememberMe = false } = req.body as { email?: string; password?: string; rememberMe?: boolean };

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.', error: 'MISSING_CREDENTIALS' });
      return;
    }

    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] ?? null;
    const result = await standardLogin(email, password, { ip, userAgent: typeof userAgent === 'string' ? userAgent : null });

    setRememberMeCookie(res, result.token, rememberMe);

    res.status(200).json({
      message: 'Authentication successful.',
      token: result.token,
      user: result.user,
      rememberMe,
      tokenProvider: 'standard',
    });
  } catch (error: any) {
    const status = mapAuthErrorToStatus(error);
    const message = error.message === 'SUBSCRIPTION_INACTIVE'
      ? 'Subscription inactive or expired.'
      : error.message === 'USER_NOT_FOUND'
        ? 'Account not found.'
        : 'Authentication failed.';
    res.status(status).json({
      message,
      error: error.message,
    });
  }
};

export const getStatus = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ authenticated: false, message: 'User is not authenticated.' });
    return;
  }
  res.status(200).json({
    authenticated: true,
    user,
    tokenProvider: user.tokenProvider || 'global',
  });
};

export const deleteSession = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.status(200).json({ message: 'Logout successful.' });
};
