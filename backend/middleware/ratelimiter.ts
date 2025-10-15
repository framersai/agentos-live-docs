// File: backend/middleware/ratelimiter.ts
/**
 * @file Rate Limiter Middleware
 * @description Implements IP-based rate limiting for public routes with daily reset,
 * and allows authenticated users to bypass these limits or have significantly higher limits.
 * @version 1.3.0 - Improved Redis connection error handling to reduce log spam and ensure fallback.
 */

import { Request, Response, NextFunction } from 'express';
import { Redis, RedisOptions } from 'ioredis'; // Import RedisOptions
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __projectRoot = path.resolve(path.dirname(__filename), '../..');
dotenv.config({ path: path.join(__projectRoot, '.env') });

interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
  tier: 'public' | 'unlimited';
}

interface RateLimitStore {
  initialize?(): Promise<void>; // Optional async initialization
  increment(key: string, windowSeconds: number): Promise<number>;
  ttl(key: string): Promise<number>;
  get(key: string): Promise<number | null>;
  disconnect?(): void;
}

class InMemoryRateLimitStore implements RateLimitStore {
  private store: Map<string, { count: number; expiresAt: number }> = new Map();
  private cleanupInterval!: NodeJS.Timeout; // Definite assignment in constructor

  async initialize(): Promise<void> {
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 60 * 1000);
    console.log('[RateLimiter] InMemoryRateLimitStore initialized and cleanup scheduled.');
  }

  private getDailyKey(baseKey: string): string {
    const today = new Date().toISOString().split('T')[0];
    return `${baseKey}:${today}`;
  }

  async increment(baseKey: string, windowSeconds: number): Promise<number> {
    const key = this.getDailyKey(baseKey);
    const now = Date.now();
    let record = this.store.get(key);
    if (!record || record.expiresAt < now) {
      const endOfDay = new Date();
      endOfDay.setUTCHours(23, 59, 59, 999); // Use UTC for daily reset consistency
      const expiresInMs = endOfDay.getTime() - new Date().getTime();
      record = { count: 1, expiresAt: Date.now() + (expiresInMs > 0 ? expiresInMs : 86400000) };
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
      return -2;
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
    this.store.forEach((record, key) => {
      if (record.expiresAt < now) {
        this.store.delete(key);
        deletedCount++;
      }
    });
    if (deletedCount > 0) {
      console.log(`[RateLimiter] InMemoryRateLimitStore: Cleaned up ${deletedCount} expired entries. Store size: ${this.store.size}`);
    }
  }

  public stopCleanup(): void {
    clearInterval(this.cleanupInterval);
    console.log('[RateLimiter] InMemoryRateLimitStore cleanup stopped.');
  }
}

class RedisRateLimitStore implements RateLimitStore {
  constructor(private redis: Redis) {}

  async initialize(): Promise<void> {
    // Check current status; if not connected, attempt to connect or confirm connection
    if (this.redis.status !== 'ready' && this.redis.status !== 'connect') {
        try {
            await this.redis.connect(); // Explicit connect if lazyConnect is false or to confirm
            console.log('[RateLimiter] RedisRateLimitStore: Connection to Redis established/confirmed on initialize.');
        } catch (err: any) {
            console.error(`[RateLimiter] RedisRateLimitStore: Failed to connect to Redis on initialize: ${err.message}. Further operations may fail.`);
            // Depending on strictness, you might throw here or let operations fail individually
        }
    } else {
        console.log(`[RateLimiter] RedisRateLimitStore: Already connected to Redis (status: ${this.redis.status}).`);
    }
  }


  private getDailyKey(baseKey: string): string {
    const today = new Date().toISOString().split('T')[0];
    return `${baseKey}:${today}`;
  }

  async increment(baseKey: string, windowSeconds: number): Promise<number> {
    const key = this.getDailyKey(baseKey);
    try {
      const count = await this.redis.incr(key);
      if (count === 1) {
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const secondsUntilEndOfDay = Math.floor((endOfDay.getTime() - now.getTime()) / 1000);
        if (secondsUntilEndOfDay > 0) {
          await this.redis.expire(key, secondsUntilEndOfDay);
        } else {
          await this.redis.expire(key, 86400); // Expire in 24h if already past midnight UTC
        }
      }
      return count;
    } catch (error: any) {
      console.error(`[RateLimiter] Redis increment failed for key ${key}: ${error.message}. This may indicate Redis is down.`);
      throw error; // Re-throw to be handled by the RateLimiter class, which might fallback
    }
  }

  async ttl(baseKey: string): Promise<number> {
    const key = this.getDailyKey(baseKey);
    try {
      return await this.redis.ttl(key);
    } catch (error: any) {
      console.error(`[RateLimiter] Redis TTL failed for key ${key}: ${error.message}.`);
      throw error;
    }
  }

  async get(baseKey: string): Promise<number | null> {
    const key = this.getDailyKey(baseKey);
    try {
      const value = await this.redis.get(key);
      return value ? parseInt(value, 10) : null;
    } catch (error: any) {
      console.error(`[RateLimiter] Redis GET failed for key ${key}: ${error.message}.`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.redis && this.redis.status !== 'end') {
      try {
        await this.redis.quit();
        console.log('[RateLimiter] RedisRateLimitStore disconnected.');
      } catch (error) {
        console.error('[RateLimiter] Error disconnecting from Redis:', error);
        // If quit fails, force close
        this.redis.disconnect(false);
      }
    }
  }
}

export class RateLimiter {
  private store!: RateLimitStore; // Definite assignment in initialize
  private readonly configs: Record<RateLimitConfig['tier'], RateLimitConfig>;
  private readonly publicIpRateLimitPerDay: number;
  private isRedisAvailable: boolean = false;
  private redisClient?: Redis; // Store the client if using Redis

  constructor() {
    this.publicIpRateLimitPerDay = parseInt(process.env.RATE_LIMIT_PUBLIC_DAILY || '100', 10); // Default to 100 if not set
    this.configs = {
      public: { maxRequests: this.publicIpRateLimitPerDay, windowSeconds: 86400, tier: 'public' },
      unlimited: { maxRequests: Number.MAX_SAFE_INTEGER, windowSeconds: 86400, tier: 'unlimited' }
    };
    // Initialization of store is deferred to an async method
  }

  /**
   * Asynchronously initializes the RateLimiter, attempting to connect to Redis if configured.
   * Falls back to InMemoryStore if Redis is not configured or fails to connect.
   */
  public async initialize(): Promise<void> {
    if (process.env.REDIS_URL) {
      console.log(`[RateLimiter] REDIS_URL found. Attempting to connect to Redis: ${process.env.REDIS_URL}`);
      const redisOptions: RedisOptions = {
        maxRetriesPerRequest: 2, // Reduce retries for faster fallback
        connectTimeout: 3000,    // Shorter timeout
        lazyConnect: false,      // Attempt connection on initialize
        showFriendlyErrorStack: process.env.NODE_ENV === 'development',
        enableOfflineQueue: false, // Don't queue commands if not connected
        retryStrategy: (times) => { // Custom retry strategy
          if (times > 3) { // Give up after 3 retries
            return null; // Returning null stops retrying
          }
          return Math.min(times * 200, 1000); // Wait 200ms, 400ms, 600ms
        }
      };
      this.redisClient = new Redis(process.env.REDIS_URL, redisOptions);

      this.redisClient.on('error', (err) => {
        // This will catch subsequent errors after initial connection attempt
        if (this.isRedisAvailable) { // Only log if we thought Redis was available
            console.error(`[RateLimiter] Global Redis Client Error: ${err.message}. May fallback if persistent.`);
            // Potentially set isRedisAvailable to false here after a few persistent errors.
        }
      });

      this.redisClient.on('connect', () => {
        console.log('[RateLimiter] Global Redis Client connected.');
        this.isRedisAvailable = true;
      });
       this.redisClient.on('close', () => {
        if (this.isRedisAvailable) { // Log only if we thought it was connected
            console.warn('[RateLimiter] Redis connection closed. May attempt reconnect or fallback.');
        }
        this.isRedisAvailable = false;
      });
       this.redisClient.on('reconnecting', () => {
        console.log('[RateLimiter] Redis client is reconnecting...');
      });


      try {
        await this.redisClient.ping(); // Test connection
        console.log('[RateLimiter] Successfully pinged Redis. Using RedisRateLimitStore.');
        this.store = new RedisRateLimitStore(this.redisClient);
        this.isRedisAvailable = true;
      } catch (e: any) {
        console.warn(`[RateLimiter] Failed to connect to Redis or ping: ${e.message}. Falling back to InMemoryRateLimitStore.`);
        this.isRedisAvailable = false;
        if (this.redisClient && typeof this.redisClient.disconnect === 'function') {
          this.redisClient.disconnect(); // Prevent further ioredis connection attempts
        }
        this.redisClient = undefined; // Clear the client
        this.store = new InMemoryRateLimitStore();
      }
    } else {
      console.log("[RateLimiter] REDIS_URL not found. Using InMemoryRateLimitStore.");
      this.store = new InMemoryRateLimitStore();
    }
    if (this.store.initialize) {
        await this.store.initialize();
    }
    console.log(`[RateLimiter] Initialized. Public daily IP limit: ${this.publicIpRateLimitPerDay}. Store: ${this.isRedisAvailable ? 'Redis' : 'In-Memory'}`);
  }


  private getClientIp(req: Request): string {
    // ... (same as before)
    const forwardedFor = req.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string') return forwardedFor.split(',')[0].trim();
    if (typeof forwardedFor === 'object') return forwardedFor[0].split(',')[0].trim(); // Handle array case
    const realIp = req.headers['x-real-ip'];
    if (typeof realIp === 'string') return realIp;
    if (typeof realIp === 'object') return realIp[0]; // Handle array case
    return req.ip || req.socket?.remoteAddress || 'unknown';
  }

  private generateBaseKeyForIp(ip: string, tier: string): string {
    return `rate_limit:${tier}:${ip}`;
  }

  public resolveClientIp(req: Request): string {
    return this.getClientIp(req);
  }

  public middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!this.store) {
        console.error("[RateLimiter] CRITICAL: Store not initialized. Rate limiting disabled. Call initialize().");
        return next();
      }
      // @ts-ignore
      if (req.user && req.user.id) {
        res.setHeader('X-RateLimit-Status', 'AuthenticatedUser-BypassedIpLimit');
        return next();
      }
      const config = this.configs.public;
      const ip = this.getClientIp(req);
      if (ip === 'unknown' && process.env.NODE_ENV !== 'development') {
        return res.status(403).json({ error: 'FORBIDDEN', message: 'Could not determine your IP address.'});
      }
      if (ip === 'unknown' && process.env.NODE_ENV === 'development') return next();

      const baseKey = this.generateBaseKeyForIp(ip, config.tier);
      try {
        const currentCount = await this.store.increment(baseKey, config.windowSeconds);
        const ttl = await this.store.ttl(baseKey);
        res.setHeader('X-RateLimit-Limit-Day-IP', config.maxRequests.toString());
        res.setHeader('X-RateLimit-Remaining-Day-IP', Math.max(0, config.maxRequests - currentCount).toString());
        if (ttl >= 0) {
          res.setHeader('X-RateLimit-Reset-Day-IP', new Date(Date.now() + ttl * 1000).toISOString());
        } else {
           const endOfDay = new Date(); endOfDay.setUTCHours(23,59,59,999);
           res.setHeader('X-RateLimit-Reset-Day-IP', endOfDay.toISOString());
        }
        if (currentCount > config.maxRequests) {
          console.warn(`[RateLimiter] IP ${ip} exceeded public daily limit. Count: ${currentCount}/${config.maxRequests}`);
          return res.status(429).json({
            error: 'RATE_LIMIT_EXCEEDED',
            message: `Public daily request limit of ${config.maxRequests} exceeded for your IP. Try again after reset or log in.`,
            retryAfterSeconds: ttl >=0 ? ttl : 86400,
            limitType: 'public-daily-ip'
          });
        }
        next();
      } catch (error: any) {
        // If Redis fails here, we should ideally use the InMemoryStore as a fallback for THIS request,
        // but the main `this.store` would have already been set to InMemory if Redis failed at init.
        // If it was an intermittent Redis error during the operation:
        console.warn(`[RateLimiter] Error during rate limiting store operation (IP: ${ip}): ${error.message}. Failing open for this request.`);
        next(); // Fail open if store operations error out
      }
    };
  }
  
  public async getPublicUsage(ip: string): Promise<{ used: number; limit: number; remaining: number; resetAt: Date | string | null; storeType: string }> {
    if (!this.store) {
        console.error("[RateLimiter] CRITICAL: Store not initialized for getPublicUsage.");
        return { used: 0, limit: this.configs.public.maxRequests, remaining: this.configs.public.maxRequests, resetAt: new Date(Date.now() + 86400000).toISOString(), storeType: 'uninitialized' };
    }
    const config = this.configs.public;
    const baseKey = this.generateBaseKeyForIp(ip, config.tier);
    let count = 0;
    let ttl = -2;
    let storeType = this.store instanceof RedisRateLimitStore ? 'Redis' : 'In-Memory';

    try {
        count = (await this.store.get(baseKey)) || 0;
        ttl = await this.store.ttl(baseKey);
    } catch (error: any) {
        console.warn(`[RateLimiter] Error fetching public usage from store for IP ${ip}: ${error.message}. Assuming 0 usage.`);
        // If store fails, assume 0 usage to not block unnecessarily, but log it.
        // This could happen if Redis goes down *after* successful initialization.
        storeType += ' (Error - Fallback View)';
    }
    
    let resetAtDate: Date | string | null = null;
    if (ttl >= 0) {
      resetAtDate = new Date(Date.now() + ttl * 1000);
    } else { 
      const endOfDay = new Date();
      endOfDay.setUTCHours(23, 59, 59, 999);
      resetAtDate = endOfDay.toISOString();
    }

    return {
      used: count,
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - count),
      resetAt: resetAtDate,
      storeType
    };
  }

  public async disconnectStore(): Promise<void> {
    if (this.store && this.store.disconnect) {
      await this.store.disconnect();
    } else if (this.store instanceof InMemoryRateLimitStore) {
      this.store.stopCleanup();
    }
    // Also disconnect the main redisClient if it was created
    if (this.redisClient && typeof this.redisClient.disconnect === 'function') {
        console.log('[RateLimiter] Disconnecting shared Redis client.');
        this.redisClient.disconnect();
    }
  }
}

// Export an instance that needs to be initialized
export const rateLimiter = new RateLimiter();

// Modify server.ts to initialize rateLimiter
// Example in server.ts:
// async function startServer() {
//   await initializeLlmServices();
//   await rateLimiter.initialize(); // Add this
//   const i18nHandlers = await setupI18nMiddleware();
//   // ... rest of server setup
// }
// startServer();

// Graceful shutdown needs to be handled in server.ts or a central place
// process.on('SIGINT', async () => { await rateLimiter.disconnectStore(); process.exit(0); });
// process.on('SIGTERM', async () => { await rateLimiter.disconnectStore(); process.exit(0); });
