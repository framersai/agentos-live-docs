import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkRateLimit,
  getIdentifier,
  rateLimitHeaders,
  RATE_LIMITS,
  resetRateLimit,
  clearAllRateLimits,
} from '@/lib/rateLimit';

/**
 * Unit tests for rate limiting utilities
 * 
 * Tests cover:
 * - Basic rate limit checking
 * - Window expiration
 * - Different rate limit presets
 * - Identifier extraction
 * - Header generation
 */

describe('Rate limiting', () => {
  beforeEach(() => {
    // Clear all rate limits before each test
    clearAllRateLimits();
  });

  describe('checkRateLimit', () => {
    it('allows requests under limit', () => {
      const config = { limit: 5, windowMs: 60000 };
      
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit('test-user', config);
        expect(result.success).toBe(true);
        expect(result.remaining).toBe(4 - i);
      }
    });

    it('blocks requests over limit', () => {
      const config = { limit: 3, windowMs: 60000 };
      
      // Use up the limit
      for (let i = 0; i < 3; i++) {
        checkRateLimit('test-user-2', config);
      }
      
      // Next request should be blocked
      const result = checkRateLimit('test-user-2', config);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('tracks different identifiers separately', () => {
      const config = { limit: 2, windowMs: 60000 };
      
      // User A makes 2 requests
      checkRateLimit('user-a', config);
      checkRateLimit('user-a', config);
      
      // User B should still have full quota
      const resultB = checkRateLimit('user-b', config);
      expect(resultB.success).toBe(true);
      expect(resultB.remaining).toBe(1);
      
      // User A should be blocked
      const resultA = checkRateLimit('user-a', config);
      expect(resultA.success).toBe(false);
    });

    it('returns correct limit value', () => {
      const config = { limit: 100, windowMs: 60000 };
      const result = checkRateLimit('test-user-3', config);
      
      expect(result.limit).toBe(100);
    });

    it('returns reset time in the future', () => {
      const config = { limit: 10, windowMs: 60000 };
      const result = checkRateLimit('test-user-4', config);
      
      expect(result.reset).toBeGreaterThan(Date.now());
    });
  });

  describe('Rate limit presets', () => {
    it('has public preset at 60 req/min', () => {
      expect(RATE_LIMITS.public.limit).toBe(60);
      expect(RATE_LIMITS.public.windowMs).toBe(60 * 1000);
    });

    it('has authenticated preset at 120 req/min', () => {
      expect(RATE_LIMITS.authenticated.limit).toBe(120);
      expect(RATE_LIMITS.authenticated.windowMs).toBe(60 * 1000);
    });

    it('has checkout preset at 10 req/min', () => {
      expect(RATE_LIMITS.checkout.limit).toBe(10);
      expect(RATE_LIMITS.checkout.windowMs).toBe(60 * 1000);
    });

    it('has auth preset at 5 req/min', () => {
      expect(RATE_LIMITS.auth.limit).toBe(5);
      expect(RATE_LIMITS.auth.windowMs).toBe(60 * 1000);
    });

    it('has webhook preset with high limit', () => {
      expect(RATE_LIMITS.webhook.limit).toBe(10000);
    });
  });

  describe('getIdentifier', () => {
    it('prefers user ID when available', () => {
      const mockRequest = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
      });
      
      const identifier = getIdentifier(mockRequest, 'user-123');
      expect(identifier).toBe('user:user-123');
    });

    it('extracts IP from x-forwarded-for', () => {
      const mockRequest = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        },
      });
      
      const identifier = getIdentifier(mockRequest);
      expect(identifier).toBe('ip:192.168.1.1');
    });

    it('extracts IP from x-real-ip', () => {
      const mockRequest = new Request('http://localhost', {
        headers: {
          'x-real-ip': '10.0.0.5',
        },
      });
      
      const identifier = getIdentifier(mockRequest);
      expect(identifier).toBe('ip:10.0.0.5');
    });

    it('extracts IP from cf-connecting-ip (Cloudflare)', () => {
      const mockRequest = new Request('http://localhost', {
        headers: {
          'cf-connecting-ip': '172.16.0.1',
        },
      });
      
      const identifier = getIdentifier(mockRequest);
      expect(identifier).toBe('ip:172.16.0.1');
    });

    it('returns unknown for requests without IP', () => {
      const mockRequest = new Request('http://localhost');
      
      const identifier = getIdentifier(mockRequest);
      expect(identifier).toBe('ip:unknown');
    });
  });

  describe('rateLimitHeaders', () => {
    it('includes standard rate limit headers', () => {
      const result = {
        success: true,
        limit: 100,
        remaining: 95,
        reset: Date.now() + 60000,
      };
      
      const headers = rateLimitHeaders(result);
      
      expect(headers['X-RateLimit-Limit']).toBe('100');
      expect(headers['X-RateLimit-Remaining']).toBe('95');
      expect(headers['X-RateLimit-Reset']).toBeDefined();
    });

    it('includes Retry-After when blocked', () => {
      const result = {
        success: false,
        limit: 100,
        remaining: 0,
        reset: Date.now() + 60000,
        retryAfter: 60,
      };
      
      const headers = rateLimitHeaders(result);
      
      expect(headers['Retry-After']).toBe('60');
    });

    it('excludes Retry-After when not blocked', () => {
      const result = {
        success: true,
        limit: 100,
        remaining: 50,
        reset: Date.now() + 60000,
      };
      
      const headers = rateLimitHeaders(result);
      
      expect(headers['Retry-After']).toBeUndefined();
    });
  });

  describe('resetRateLimit', () => {
    it('clears rate limit for specific identifier', () => {
      const config = { limit: 1, windowMs: 60000 };
      
      // Use up the limit
      checkRateLimit('reset-test', config);
      
      // Should be blocked
      let result = checkRateLimit('reset-test', config);
      expect(result.success).toBe(false);
      
      // Reset
      resetRateLimit('reset-test');
      
      // Should be allowed again
      result = checkRateLimit('reset-test', config);
      expect(result.success).toBe(true);
    });
  });

  describe('clearAllRateLimits', () => {
    it('clears all rate limits', () => {
      const config = { limit: 1, windowMs: 60000 };
      
      // Use up limits for multiple users
      checkRateLimit('clear-test-1', config);
      checkRateLimit('clear-test-1', config);
      checkRateLimit('clear-test-2', config);
      checkRateLimit('clear-test-2', config);
      
      // Both should be blocked
      expect(checkRateLimit('clear-test-1', config).success).toBe(false);
      expect(checkRateLimit('clear-test-2', config).success).toBe(false);
      
      // Clear all
      clearAllRateLimits();
      
      // Both should be allowed again
      expect(checkRateLimit('clear-test-1', config).success).toBe(true);
      expect(checkRateLimit('clear-test-2', config).success).toBe(true);
    });
  });
});

describe('Rate limit edge cases', () => {
  beforeEach(() => {
    clearAllRateLimits();
  });

  it('handles rapid sequential requests', () => {
    const config = { limit: 100, windowMs: 60000 };
    
    for (let i = 0; i < 100; i++) {
      const result = checkRateLimit('rapid-test', config);
      expect(result.success).toBe(true);
    }
    
    // 101st request should fail
    const result = checkRateLimit('rapid-test', config);
    expect(result.success).toBe(false);
  });

  it('handles limit of 1', () => {
    const config = { limit: 1, windowMs: 60000 };
    
    const first = checkRateLimit('limit-1-test', config);
    expect(first.success).toBe(true);
    expect(first.remaining).toBe(0);
    
    const second = checkRateLimit('limit-1-test', config);
    expect(second.success).toBe(false);
  });

  it('handles very short window', () => {
    const config = { limit: 100, windowMs: 1 }; // 1ms window
    
    const result = checkRateLimit('short-window', config);
    expect(result.success).toBe(true);
  });
});


