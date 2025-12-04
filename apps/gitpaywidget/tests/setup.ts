/**
 * Vitest Global Test Setup
 * 
 * This file runs before all tests and sets up:
 * - Environment variables
 * - Global mocks
 * - Test utilities
 */

import { vi, beforeAll, afterAll, afterEach } from 'vitest';

// Mock environment variables
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.KEY_ENCRYPTION_SECRET = 'test-encryption-secret-32-chars!!';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_mock';
process.env.LEMONSQUEEZY_API_KEY = 'test-lemon-key';
process.env.RESEND_API_KEY = 're_test_mock';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.NODE_ENV = 'test';

// Mock Supabase client
vi.mock('@/lib/supabaseServer', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  },
}));

// Mock Resend
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null }),
    },
  })),
}));

// Global test lifecycle hooks
beforeAll(() => {
  // Setup before all tests
});

afterEach(() => {
  // Clear all mocks between tests
  vi.clearAllMocks();
});

afterAll(() => {
  // Cleanup after all tests
  vi.resetAllMocks();
});

// Test utilities
export const mockSupabaseResponse = <T>(data: T, error: any = null) => ({
  data,
  error,
});

export const createMockProject = (overrides = {}) => ({
  id: 'test-project-id',
  slug: 'test-org/test-site',
  name: 'Test Project',
  owner_id: 'test-user-id',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockProviderKey = (overrides = {}) => ({
  id: 'test-key-id',
  project_id: 'test-project-id',
  provider: 'stripe',
  key: 'encrypted-key-data',
  metadata: {},
  is_test_mode: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockWebhookEvent = (overrides = {}) => ({
  id: 'test-event-id',
  project_id: 'test-project-id',
  provider: 'stripe',
  event_type: 'checkout.completed',
  session_id: 'cs_test_123',
  payload: {},
  processed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  ...overrides,
});


