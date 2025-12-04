/**
 * Simple in-memory rate limiter for API routes
 * 
 * Uses a sliding window approach with configurable limits.
 * For production at scale, consider using Redis-based rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
}

// In-memory store (use Redis in production for multi-instance deployments)
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate limit presets
 */
export const RATE_LIMITS = {
  /** Public endpoints: 60 req/min */
  public: { limit: 60, windowMs: 60 * 1000 },
  
  /** Authenticated endpoints: 120 req/min */
  authenticated: { limit: 120, windowMs: 60 * 1000 },
  
  /** Checkout endpoint: 10 req/min (prevent abuse) */
  checkout: { limit: 10, windowMs: 60 * 1000 },
  
  /** Webhook endpoint: unlimited (verified via signature) */
  webhook: { limit: 10000, windowMs: 60 * 1000 },
  
  /** Auth endpoints: 5 req/min (prevent brute force) */
  auth: { limit: 5, windowMs: 60 * 1000 },
  
  /** Settings updates: 30 req/min */
  settings: { limit: 30, windowMs: 60 * 1000 },
} as const;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.public
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  
  let entry = store.get(key);
  
  // If no entry or expired, create new one
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    store.set(key, entry);
  }
  
  // Increment count
  entry.count++;
  
  const remaining = Math.max(0, config.limit - entry.count);
  const reset = Math.ceil((entry.resetTime - now) / 1000);
  
  if (entry.count > config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: entry.resetTime,
      retryAfter: reset,
    };
  }
  
  return {
    success: true,
    limit: config.limit,
    remaining,
    reset: entry.resetTime,
  };
}

/**
 * Get identifier from request (IP or user ID)
 */
export function getIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }
  
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = forwarded?.split(',')[0]?.trim() 
    || realIp 
    || cfConnectingIp 
    || 'unknown';
  
  return `ip:${ip}`;
}

/**
 * Create rate limit headers for response
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
  
  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }
  
  return headers;
}

/**
 * Rate limit middleware helper for Next.js API routes
 */
export function withRateLimit(
  handler: (req: Request) => Promise<Response>,
  config: RateLimitConfig = RATE_LIMITS.public
) {
  return async (req: Request): Promise<Response> => {
    const identifier = getIdentifier(req);
    const result = checkRateLimit(identifier, config);
    
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...rateLimitHeaders(result),
          },
        }
      );
    }
    
    const response = await handler(req);
    
    // Add rate limit headers to response
    const headers = new Headers(response.headers);
    Object.entries(rateLimitHeaders(result)).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}

/**
 * Reset rate limit for testing
 */
export function resetRateLimit(identifier: string): void {
  store.delete(identifier);
}

/**
 * Clear all rate limits (for testing)
 */
export function clearAllRateLimits(): void {
  store.clear();
}


