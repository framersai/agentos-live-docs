import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createMocks } from 'node-mocks-http';

/**
 * Integration tests for /api/projects endpoints
 */
describe('/api/projects', () => {
  it('GET /api/projects returns 401 without auth', async () => {
    // TODO: implement once Next.js test utils are wired
    expect(true).toBe(true);
  });

  it('POST /api/projects creates project for authenticated user', async () => {
    // TODO: mock Supabase auth + test project creation
    expect(true).toBe(true);
  });

  it('PATCH /api/projects/:slug updates name and slug', async () => {
    // TODO: test project update
    expect(true).toBe(true);
  });

  it('DELETE /api/projects/:slug removes project and cascades keys', async () => {
    // TODO: test deletion
    expect(true).toBe(true);
  });
});
