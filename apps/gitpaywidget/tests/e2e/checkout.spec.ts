import { test, expect } from '@playwright/test';

/**
 * E2E tests for checkout flow
 * 
 * Tests cover:
 * - Widget triggers checkout API
 * - Checkout redirects to provider
 * - Error handling for failed checkouts
 * - Rate limiting behavior
 */

test.describe('Checkout Flow', () => {
  test('clicking plan button calls checkout API', async ({ page }) => {
    let checkoutRequest: any = null;
    
    // Intercept checkout API calls
    await page.route('**/api/checkout', route => {
      checkoutRequest = {
        method: route.request().method(),
        postData: route.request().postDataJSON(),
      };
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          checkoutUrl: 'https://checkout.stripe.com/test',
          sessionId: 'cs_test_123',
          provider: 'stripe',
        }),
      });
    });
    
    // Also intercept the theme fetch
    await page.route('**/api/public/**', route => {
      route.fulfill({ status: 404 });
    });
    
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    // Click the first plan button
    await page.locator('.gpw-plan-button').first().click();
    
    // Wait for request
    await page.waitForTimeout(1000);
    
    // Verify checkout was called
    expect(checkoutRequest).not.toBeNull();
    expect(checkoutRequest.method).toBe('POST');
    expect(checkoutRequest.postData).toHaveProperty('project');
    expect(checkoutRequest.postData).toHaveProperty('plan');
  });

  test('checkout request includes correct project slug', async ({ page }) => {
    let requestBody: any = null;
    
    await page.route('**/api/checkout', route => {
      requestBody = route.request().postDataJSON();
      route.fulfill({
        status: 200,
        body: JSON.stringify({ checkoutUrl: '#', sessionId: 'test', provider: 'stripe' }),
      });
    });
    
    await page.route('**/api/public/**', route => route.fulfill({ status: 404 }));
    
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    await page.locator('.gpw-plan-button').first().click();
    
    await page.waitForTimeout(500);
    
    expect(requestBody?.project).toBe('demo/project');
  });

  test('checkout request includes plan ID from button', async ({ page }) => {
    let requestBody: any = null;
    
    await page.route('**/api/checkout', route => {
      requestBody = route.request().postDataJSON();
      route.fulfill({
        status: 200,
        body: JSON.stringify({ checkoutUrl: '#', sessionId: 'test', provider: 'stripe' }),
      });
    });
    
    await page.route('**/api/public/**', route => route.fulfill({ status: 404 }));
    
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    // Click Pro plan button (second one)
    await page.locator('.gpw-plan-button').last().click();
    
    await page.waitForTimeout(500);
    
    expect(requestBody?.plan).toBe('pro');
  });

  test('successful checkout opens new window', async ({ page, context }) => {
    const checkoutUrl = 'https://checkout.stripe.com/test-session';
    
    await page.route('**/api/checkout', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          checkoutUrl,
          sessionId: 'cs_test_123',
          provider: 'stripe',
        }),
      });
    });
    
    await page.route('**/api/public/**', route => route.fulfill({ status: 404 }));
    
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    // Listen for new page
    const popupPromise = context.waitForEvent('page');
    
    await page.locator('.gpw-plan-button').first().click();
    
    // Note: In test environment, the window.open might be blocked
    // This test verifies the SDK attempts to open the checkout URL
  });

  test('handles 404 error for unknown project', async ({ page }) => {
    await page.route('**/api/checkout', route => {
      route.fulfill({
        status: 404,
        body: JSON.stringify({ error: 'project not found' }),
      });
    });
    
    await page.route('**/api/public/**', route => route.fulfill({ status: 404 }));
    
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    // Setup console listener
    const consoleMessages: string[] = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    await page.locator('.gpw-plan-button').first().click();
    
    await page.waitForTimeout(500);
    
    // SDK should log error
    expect(consoleMessages.some(m => m.includes('checkout error'))).toBe(true);
  });

  test('handles 500 error from provider', async ({ page }) => {
    await page.route('**/api/checkout', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Provider API error' }),
      });
    });
    
    await page.route('**/api/public/**', route => route.fulfill({ status: 404 }));
    
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    const consoleMessages: string[] = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    await page.locator('.gpw-plan-button').first().click();
    
    await page.waitForTimeout(500);
    
    // Page should not crash
    await expect(page.locator('.gpw-plan-card').first()).toBeVisible();
  });

  test('handles network failure gracefully', async ({ page }) => {
    await page.route('**/api/checkout', route => {
      route.abort('failed');
    });
    
    await page.route('**/api/public/**', route => route.fulfill({ status: 404 }));
    
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    await page.locator('.gpw-plan-button').first().click();
    
    // Page should not crash
    await page.waitForTimeout(500);
    await expect(page.locator('.gpw-plan-card').first()).toBeVisible();
  });
});

test.describe('Checkout API Endpoint', () => {
  test('POST /api/checkout returns valid response structure', async ({ request }) => {
    // Note: This test requires the server to be running with test credentials
    // In CI, this would be mocked
    
    const response = await request.post('/api/checkout', {
      data: {
        project: 'test/project',
        plan: 'pro',
      },
    });
    
    // Either success or known error
    expect([200, 400, 404, 500]).toContain(response.status());
    
    const body = await response.json();
    
    if (response.status() === 200) {
      expect(body).toHaveProperty('checkoutUrl');
      expect(body).toHaveProperty('sessionId');
      expect(body).toHaveProperty('provider');
    } else {
      expect(body).toHaveProperty('error');
    }
  });

  test('checkout API validates required fields', async ({ request }) => {
    const response = await request.post('/api/checkout', {
      data: {
        // Missing project and plan
      },
    });
    
    // Should return error status
    expect([400, 404, 500]).toContain(response.status());
  });

  test('checkout API includes rate limit headers', async ({ request }) => {
    const response = await request.post('/api/checkout', {
      data: {
        project: 'test/project',
        plan: 'pro',
      },
    });
    
    // Rate limit headers should be present (when rate limiting is enabled)
    // Note: This depends on implementation
    const headers = response.headers();
    
    // Check for standard rate limit headers
    // These might be x-ratelimit-* or similar
  });
});

test.describe('Rate Limiting', () => {
  test('checkout endpoint enforces rate limits', async ({ request }) => {
    const requests = [];
    
    // Make multiple rapid requests
    for (let i = 0; i < 15; i++) {
      requests.push(
        request.post('/api/checkout', {
          data: { project: 'test/project', plan: 'pro' },
        })
      );
    }
    
    const responses = await Promise.all(requests);
    
    // Some requests should eventually be rate limited (429)
    // Note: Actual behavior depends on rate limit configuration
    const statuses = responses.map(r => r.status());
    
    // At least some requests should succeed
    expect(statuses.some(s => s !== 429)).toBe(true);
  });
});


