// File: backend/middleware/ratelimiter.ts
/**
 * @file Rate Limiter Middleware
 * @description Implements IP-based rate limiting for public routes with daily reset,
 * and allows authenticated users to bypass these limits or have significantly higher limits.
 * @version 1.2.0 - Standardized daily key reset, improved Redis error handling and logging.
 */

import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __projectRoot = path.resolve(path.dirname(__filename), '../..');
dotenv.config({ path: path.join(__projectRoot, '.env') });

/**
 * @interface RateLimitConfig
 * @description Configuration for different rate limit tiers.
 */
interface RateLimitConfig {
  /** Maximum requests per day/window. */
  maxRequests: number;
  /** Window duration in seconds. */
  windowSeconds: number;
  /** Tier identifier. */
  tier: 'public' | 'unlimited'; // Simplified tiers for this implementation
}

/**
 * @interface RateLimitStore
 * @description Defines the contract for a rate limit storage mechanism.
 */
interface RateLimitStore {
  increment(key: string, windowSeconds: number): Promise<number>;
  ttl(key: string): Promise<number>;
  get(key: string): Promise<number | null>;
  disconnect?(): void; // Optional disconnect method for stores like Redis
}

/**
 * @class InMemoryRateLimitStore
 * @implements {RateLimitStore}
 * @description An in-memory store for rate limiting. Keys are structured to reset daily.
 */
class InMemoryRateLimitStore implements RateLimitStore {
  private store: Map<string, { count: number; expiresAt: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 60 * 1000); // Cleanup every hour
    console.log('InMemoryRateLimitStore initialized.');
  }

  private getDailyKey(baseKey: string): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `${baseKey}:${today}`;
  }

  async increment(baseKey: string, windowSeconds: number): Promise<number> {
    const key = this.getDailyKey(baseKey);
    const now = Date.now();
    let record = this.store.get(key);

    if (!record || record.expiresAt < now) {
      // For daily reset, windowSeconds is always 86400. Expiry is end of day.
      // More precise: calculate seconds remaining in the current day.
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const expiresInMs = endOfDay.getTime() - now;
      
      record = { count: 1, expiresAt: now + expiresInMs };
      this.store.set(key, record);
      return 1;
    }
    record.count++;
    return record.count;
  }

  async ttl(baseKey: string): Promise<number> {
    const key = this.getDailyKey(baseKey);
    const record = this.store.get(key);
    if (!record || record.expiresAt < Date.now()) {
      if(record) this.store.delete(key);
      return -2; // Key does not exist or expired
    }
    return Math.max(0, Math.floor((record.expiresAt - Date.now()) / 1000));
  }

  async get(baseKey: string): Promise<number | null> {
    const key = this.getDailyKey(baseKey);
    const record = this.store.get(key);
    if (!record || record.expiresAt < Date.now()) {
      if(record) this.store.delete(key);
      return null;
    }
    return record.count;
  }

  private cleanup(): void {
    const now = Date.now();
    let deletedCount = 0;
    for (const [key, record] of this.store.entries()) {
      if (record.expiresAt < now) {
        this.store.delete(key);
        deletedCount++;
      }
    }
    if (deletedCount > 0) {
      console.log(`InMemoryRateLimitStore: Cleaned up ${deletedCount} expired entries. Store size: ${this.store.size}`);
    }
  }

  public stopCleanup(): void {
    clearInterval(this.cleanupInterval);
    console.log('InMemoryRateLimitStore cleanup stopped.');
  }
}

/**
 * @class RedisRateLimitStore
 * @implements {RateLimitStore}
 * @description A Redis-based store for rate limiting. Keys include date for daily reset.
 */
class RedisRateLimitStore implements RateLimitStore {
  constructor(private redis: Redis) {
    console.log('RedisRateLimitStore initialized.');
  }

  private getDailyKey(baseKey: string): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `${baseKey}:${today}`;
  }

  async increment(baseKey: string, windowSeconds: number): Promise<number> {
    const key = this.getDailyKey(baseKey);
    const count = await this.redis.incr(key);
    if (count === 1) {
      // If new key, set to expire at the end of the day (UTC)
      // More precise: calculate seconds remaining in the current day.
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setUTCHours(23, 59, 59, 999); // Expire at end of UTC day
      const secondsUntilEndOfDay = Math.floor((endOfDay.getTime() - now.getTime()) / 1000);
      if (secondsUntilEndOfDay > 0) {
         await this.redis.expire(key, secondsUntilEndOfDay);
      } else {
         // If it's already past midnight UTC, expire in 24h from now (effectively next day)
         await this.redis.expire(key, 86400);
      }
    }
    return count;
  }

  async ttl(baseKey: string): Promise<number> {
    const key = this.getDailyKey(baseKey);
    return await this.redis.ttl(key);
  }

  async get(baseKey: string): Promise<number | null> {
    const key = this.getDailyKey(baseKey);
    const value = await this.redis.get(key);
    return value ? parseInt(value, 10) : null;
  }

  async disconnect(): Promise<void> {
    await this.redis.quit();
    console.log('RedisRateLimitStore disconnected.');
  }
}

/**
 * @class RateLimiter
 * @description Manages rate limiting logic and provides middleware.
 */
export class RateLimiter {
  private store: RateLimitStore;
  private readonly configs: Record<RateLimitConfig['tier'], RateLimitConfig>;
  private readonly publicIpRateLimitPerDay: number;

  constructor(redisInstance?: Redis) {
    if (redisInstance) {
        this.store = new RedisRateLimitStore(redisInstance);
    } else {
        this.store = new InMemoryRateLimitStore();
    }
    this.publicIpRateLimitPerDay = parseInt(process.env.RATE_LIMIT_PUBLIC_DAILY || '50', 10);

    this.configs = {
      public: {
        maxRequests: this.publicIpRateLimitPerDay,
        windowSeconds: 86400, // 24 hours for daily reset
        tier: 'public'
      },
      unlimited: { // For authenticated users
        maxRequests: Number.MAX_SAFE_INTEGER, // Effectively unlimited
        windowSeconds: 86400,
        tier: 'unlimited'
      }
    };
    console.log(`RateLimiter initialized. Public daily IP limit: ${this.publicIpRateLimitPerDay}. Store: ${redisInstance ? 'Redis' : 'In-Memory'}`);
  }

  private getClientIp(req: Request): string {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string') {
      return forwardedFor.split(',')[0].trim();
    }
    const realIp = req.headers['x-real-ip'];
    if (typeof realIp === 'string') {
      return realIp;
    }
    return req.ip || req.socket?.remoteAddress || 'unknown';
  }

  private generateBaseKeyForIp(ip: string, tier: string): string {
    // The daily component is handled by the store's getDailyKey method
    return `rate_limit:${tier}:${ip}`;
  }

  /**
   * Middleware for enforcing rate limits.
   * Authenticated users (identified by `req.user`) bypass public IP-based limits.
   */
  public middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      // @ts-ignore - req.user is custom property set by auth middleware
      if (req.user && req.user.id) {
        res.setHeader('X-RateLimit-Status', 'AuthenticatedUser-BypassedIpLimit');
        return next(); // Authenticated users bypass this IP-based public rate limiter
      }

      const config = this.configs.public;
      const ip = this.getClientIp(req);

      if (ip === 'unknown' && process.env.NODE_ENV !== 'development') { // Allow 'unknown' IP in dev for easier testing
        console.warn('RateLimiter: Unknown IP address in non-development environment. Blocking request.');
        return res.status(403).json({ error: 'FORBIDDEN', message: 'Could not determine your IP address.'});
      }
      if (ip === 'unknown' && process.env.NODE_ENV === 'development') {
        console.warn('RateLimiter: Unknown IP address in development. Allowing request.');
        return next();
      }

      const baseKey = this.generateBaseKeyForIp(ip, config.tier);

      try {
        const currentCount = await this.store.increment(baseKey, config.windowSeconds);
        const ttl = await this.store.ttl(baseKey); // TTL is for the daily key

        res.setHeader('X-RateLimit-Limit-Day-IP', config.maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining-Day-IP', Math.max(0, config.maxRequests - currentCount).toString());
        if (ttl >= 0) {
          res.setHeader('X-RateLimit-Reset-Day-IP', new Date(Date.now() + ttl * 1000).toISOString());
        } else {
           // If TTL is -2 (key expired/deleted), means limit reset. Show approx reset for next window.
           const endOfDay = new Date(); endOfDay.setHours(23,59,59,999);
           res.setHeader('X-RateLimit-Reset-Day-IP', endOfDay.toISOString());
        }


        if (currentCount > config.maxRequests) {
          console.warn(`RateLimiter: IP ${ip} exceeded public daily limit. Count: ${currentCount}/${config.maxRequests}`);
          res.status(429).json({
            error: 'RATE_LIMIT_EXCEEDED',
            message: `Public daily request limit of ${config.maxRequests} exceeded for your IP address. Please try again after the reset period or log in for unlimited access.`,
            retryAfterSeconds: ttl >=0 ? ttl : 86400,
            limitType: 'public-daily-ip'
          });
          return;
        }
        next();
      } catch (error: any) {
        console.error('RateLimiter: Error during rate limiting process:', error.message, error.stack);
        next(); // Fail open
      }
    };
  }
  
  public async getPublicUsage(ip: string): Promise<{
    used: number;
    limit: number;
    remaining: number;
    resetAt: Date | string | null; // Can be ISO string or Date
  }> {
    const config = this.configs.public;
    const baseKey = this.generateBaseKeyForIp(ip, config.tier);
    
    const count = await this.store.get(baseKey) || 0;
    const ttl = await this.store.ttl(baseKey);
    
    let resetAtDate: Date | string | null = null;
    if (ttl >= 0) { // ttl is positive or 0 (about to expire)
      resetAtDate = new Date(Date.now() + ttl * 1000);
    } else { // ttl is -2 (key does not exist, meaning it's reset for today or never used)
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999); // Reset at end of current day
      resetAtDate = endOfDay.toISOString();
    }

    return {
      used: count,
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - count),
      resetAt: resetAtDate
    };
  }

  public async disconnectStore(): Promise<void> {
    if (this.store.disconnect) {
        await this.store.disconnect();
    } else if (this.store instanceof InMemoryRateLimitStore) {
        this.store.stopCleanup();
    }
  }
}

let redisClientInstance: Redis | undefined;
if (process.env.REDIS_URL) {
  try {
    redisClientInstance = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        connectTimeout: 5000,
        lazyConnect: true, // Important: connect on first command
        showFriendlyErrorStack: process.env.NODE_ENV === 'development',
    });

    redisClientInstance.on('error', (err) => console.error('RateLimiter: Global Redis Client Error:', err.message));
    redisClientInstance.on('connect', () => console.log('RateLimiter: Global Redis Client connected.'));
    // Attempt an explicit connection if not lazyConnect, or rely on first command
    if (!redisClientInstance.options.lazyConnect) {
        redisClientInstance.connect().catch(err => {
            console.error('RateLimiter: Failed to connect Redis client on init:', err.message);
            // Potentially fallback to InMemory if connection fails critically at startup
        });
    }

  } catch (e: any) {
    console.error("RateLimiter: Failed to initialize Redis client from URL. Falling back to InMemoryStore.", e.message);
    redisClientInstance = undefined;
  }
} else {
  console.log("RateLimiter: REDIS_URL not found. Using InMemoryRateLimitStore for rate limiting.");
}

export const rateLimiter = new RateLimiter(redisClientInstance);

// Graceful shutdown
async function gracefulShutdown() {
  console.log('RateLimiter: Initiating graceful shutdown...');
  await rateLimiter.disconnectStore();
  console.log('RateLimiter: Shutdown complete.');
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);