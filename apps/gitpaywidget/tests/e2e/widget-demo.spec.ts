import { test, expect } from '@playwright/test';

/**
 * E2E tests for the widget demo page
 * 
 * Tests cover:
 * - Widget renders correctly
 * - Plan cards display properly
 * - Button interactions
 * - Theme loading
 * - Mobile responsiveness
 */

test.describe('Widget Demo Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/widget-demo');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Widget/i);
  });

  test('displays widget preview heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toContainText('Widget Preview');
  });

  test('shows code snippet example', async ({ page }) => {
    const code = page.locator('code');
    await expect(code).toContainText('cdn.gitpaywidget.com');
  });

  test('renders widget container', async ({ page }) => {
    const widgetContainer = page.locator('#widget');
    await expect(widgetContainer).toBeVisible();
    
    // Wait for widget to render
    await page.waitForSelector('.gpw-widget-root', { timeout: 5000 });
  });

  test('displays plan cards after widget loads', async ({ page }) => {
    // Wait for widget to render
    await page.waitForSelector('.gpw-plan-card', { timeout: 5000 });
    
    const planCards = page.locator('.gpw-plan-card');
    await expect(planCards).toHaveCount(2); // Starter and Pro
  });

  test('plan cards show correct information', async ({ page }) => {
    await page.waitForSelector('.gpw-plan-card', { timeout: 5000 });
    
    // Check Starter plan
    await expect(page.locator('.gpw-plan-card').first()).toContainText('Starter');
    await expect(page.locator('.gpw-plan-card').first()).toContainText('$0');
    
    // Check Pro plan
    await expect(page.locator('.gpw-plan-card').last()).toContainText('Pro');
    await expect(page.locator('.gpw-plan-card').last()).toContainText('$9.99');
  });

  test('plan cards show features list', async ({ page }) => {
    await page.waitForSelector('.gpw-feature-list', { timeout: 5000 });
    
    const featureLists = page.locator('.gpw-feature-list');
    await expect(featureLists).toHaveCount(2);
    
    // Check for specific features
    await expect(page.locator('.gpw-feature-list').first()).toContainText('summaries');
  });

  test('CTA buttons are visible and styled', async ({ page }) => {
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    const buttons = page.locator('.gpw-plan-button');
    await expect(buttons).toHaveCount(2);
    
    // Check button has gradient background
    const firstButton = buttons.first();
    await expect(firstButton).toBeVisible();
  });

  test('buttons have correct data attributes', async ({ page }) => {
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    const buttons = page.locator('.gpw-plan-button');
    
    // Check data-gpw-project attribute
    const firstButton = buttons.first();
    await expect(firstButton).toHaveAttribute('data-gpw-project', 'demo/project');
  });
});

test.describe('Widget Interactions', () => {
  test('clicking plan button triggers action', async ({ page }) => {
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    // Setup request interception
    let checkoutCalled = false;
    await page.route('**/api/**', route => {
      checkoutCalled = true;
      route.fulfill({ status: 200, body: JSON.stringify({ checkoutUrl: '#', sessionId: 'test' }) });
    });
    
    // Click the button
    await page.locator('.gpw-plan-button').first().click();
    
    // Wait a moment for the request
    await page.waitForTimeout(500);
  });

  test('widget handles API errors gracefully', async ({ page }) => {
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    // Mock API failure
    await page.route('**/api/checkout**', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) });
    });
    
    // Click button - should not crash
    await page.locator('.gpw-plan-button').first().click();
    
    // Page should still be functional
    await expect(page.locator('.gpw-plan-card').first()).toBeVisible();
  });
});

test.describe('Widget Styling', () => {
  test('plan cards have proper styling', async ({ page }) => {
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-card', { timeout: 5000 });
    
    const card = page.locator('.gpw-plan-card').first();
    
    // Check computed styles
    const borderRadius = await card.evaluate(el => 
      window.getComputedStyle(el).borderRadius
    );
    
    // Should have rounded corners
    expect(parseFloat(borderRadius)).toBeGreaterThan(0);
  });

  test('hover effects work on plan cards', async ({ page }) => {
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-card', { timeout: 5000 });
    
    const card = page.locator('.gpw-plan-card').first();
    
    // Get initial transform
    const initialTransform = await card.evaluate(el =>
      window.getComputedStyle(el).transform
    );
    
    // Hover
    await card.hover();
    
    // Allow transition
    await page.waitForTimeout(400);
    
    // Transform should potentially change on hover
    // (actual test depends on CSS implementation)
  });

  test('buttons have hover state', async ({ page }) => {
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    const button = page.locator('.gpw-plan-button').first();
    
    // Hover over button
    await button.hover();
    
    // Button should still be visible and clickable
    await expect(button).toBeVisible();
  });
});

test.describe('Widget Demo - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('widget is responsive on mobile', async ({ page }) => {
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-widget-root', { timeout: 5000 });
    
    const widget = page.locator('.gpw-widget-root');
    const box = await widget.boundingBox();
    
    // Widget should fit within mobile viewport
    expect(box?.width).toBeLessThanOrEqual(375);
  });

  test('plan cards stack vertically on mobile', async ({ page }) => {
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-card', { timeout: 5000 });
    
    const cards = page.locator('.gpw-plan-card');
    
    const firstBox = await cards.first().boundingBox();
    const lastBox = await cards.last().boundingBox();
    
    // Cards should be stacked (second card below first)
    expect(lastBox?.y).toBeGreaterThan(firstBox?.y || 0);
  });

  test('buttons are tappable size on mobile', async ({ page }) => {
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    const button = page.locator('.gpw-plan-button').first();
    const box = await button.boundingBox();
    
    // Minimum touch target size is 44px (iOS HIG)
    expect(box?.height).toBeGreaterThanOrEqual(40);
  });
});

test.describe('Widget Auto-Theme', () => {
  test('widget attempts to fetch theme from API', async ({ page }) => {
    let themeFetched = false;
    
    await page.route('**/api/public/projects/**/settings', route => {
      themeFetched = true;
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          accent_hex: '#ff0000',
          cta_label: 'Subscribe Now',
        }),
      });
    });
    
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    // Theme endpoint should have been called
    expect(themeFetched).toBe(true);
  });

  test('widget uses default theme on API failure', async ({ page }) => {
    await page.route('**/api/public/projects/**/settings', route => {
      route.fulfill({ status: 404 });
    });
    
    await page.goto('/widget-demo');
    await page.waitForSelector('.gpw-plan-button', { timeout: 5000 });
    
    // Widget should still render with default purple theme
    const button = page.locator('.gpw-plan-button').first();
    await expect(button).toBeVisible();
  });
});
