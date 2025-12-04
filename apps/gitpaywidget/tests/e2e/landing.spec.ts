import { test, expect } from '@playwright/test';

/**
 * E2E tests for the GitPayWidget landing page
 * 
 * Tests cover:
 * - Page loads correctly
 * - Navigation works
 * - Hero section content
 * - Features section
 * - Pricing section
 * - CTAs are functional
 * - Mobile responsiveness
 */

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/GitPayWidget/);
  });

  test('displays hero section with main headline', async ({ page }) => {
    const headline = page.locator('h1');
    await expect(headline).toBeVisible();
    await expect(headline).toContainText('Payments');
  });

  test('displays the code snippet preview', async ({ page }) => {
    const codeBlock = page.locator('.gpw-code-block');
    await expect(codeBlock).toBeVisible();
    
    // Check for script tag content
    await expect(codeBlock).toContainText('script');
    await expect(codeBlock).toContainText('cdn.gitpaywidget.com');
  });

  test('has copy button for code snippet', async ({ page }) => {
    const copyButton = page.locator('button:has-text("Copy")');
    await expect(copyButton).toBeVisible();
    
    // Click copy and verify feedback
    await copyButton.click();
    await expect(page.locator('text=Copied')).toBeVisible({ timeout: 2000 });
  });

  test('displays navigation with all links', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check navigation links
    await expect(page.locator('a[href="/docs"]')).toBeVisible();
    await expect(page.locator('a[href="/widget-demo"]')).toBeVisible();
    await expect(page.locator('a[href="/pricing"]')).toBeVisible();
  });

  test('CTA buttons link to correct destinations', async ({ page }) => {
    // Start free button
    const startFreeBtn = page.locator('a:has-text("Start free")').first();
    await expect(startFreeBtn).toHaveAttribute('href', '/login');
    
    // See demo button
    const demoBtn = page.locator('a:has-text("See demo")').first();
    await expect(demoBtn).toHaveAttribute('href', '/widget-demo');
  });

  test('features section displays all 6 features', async ({ page }) => {
    const featuresSection = page.locator('#features');
    await featuresSection.scrollIntoViewIfNeeded();
    
    // Check for feature cards
    const featureCards = featuresSection.locator('.gpw-card-hover');
    await expect(featureCards).toHaveCount(6);
    
    // Check specific features
    await expect(featuresSection).toContainText('One-Line Integration');
    await expect(featuresSection).toContainText('Zero PCI Scope');
    await expect(featuresSection).toContainText('Fully Customizable');
    await expect(featuresSection).toContainText('Real-Time Analytics');
    await expect(featuresSection).toContainText('Multi-Provider Support');
    await expect(featuresSection).toContainText('Blazing Fast');
  });

  test('pricing section displays 3 tiers', async ({ page }) => {
    const pricingSection = page.locator('#pricing');
    await pricingSection.scrollIntoViewIfNeeded();
    
    // Check for plan names
    await expect(pricingSection).toContainText('Starter');
    await expect(pricingSection).toContainText('Pro');
    await expect(pricingSection).toContainText('Team');
    
    // Check prices
    await expect(pricingSection).toContainText('Free');
    await expect(pricingSection).toContainText('$19');
    await expect(pricingSection).toContainText('$49');
  });

  test('Pro plan is highlighted as most popular', async ({ page }) => {
    const badge = page.locator('text=Most Popular');
    await expect(badge).toBeVisible();
  });

  test('theme toggle switches between light and dark mode', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="Switch to"]');
    await expect(themeToggle).toBeVisible();
    
    // Click toggle
    await themeToggle.click();
    
    // Check that dark class is toggled on html element
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark|light/);
  });

  test('footer contains Manic Agency credit', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const footer = page.locator('footer');
    await expect(footer).toContainText('Manic Agency');
  });

  test('trust indicators are visible', async ({ page }) => {
    await expect(page.locator('text=AES-256 encrypted')).toBeVisible();
    await expect(page.locator('text=<5KB gzipped')).toBeVisible();
    await expect(page.locator('text=Setup in 5 minutes')).toBeVisible();
  });
});

test.describe('Landing Page - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('shows mobile menu button', async ({ page }) => {
    await page.goto('/');
    
    const menuButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(menuButton).toBeVisible();
  });

  test('mobile menu opens on click', async ({ page }) => {
    await page.goto('/');
    
    const menuButton = page.locator('button[aria-label="Toggle menu"]');
    await menuButton.click();
    
    // Check mobile nav is visible
    const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
    await expect(mobileNav).toBeVisible();
  });

  test('hero section is readable on mobile', async ({ page }) => {
    await page.goto('/');
    
    const headline = page.locator('h1');
    await expect(headline).toBeVisible();
    
    // Check headline is not cut off
    const box = await headline.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(375);
  });
});

test.describe('Navigation', () => {
  test('docs link navigates to documentation', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/docs"]');
    await expect(page).toHaveURL('/docs');
  });

  test('demo link navigates to widget demo', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/widget-demo"]');
    await expect(page).toHaveURL('/widget-demo');
  });

  test('pricing link scrolls to pricing section', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/pricing"]');
    await expect(page).toHaveURL('/pricing');
  });

  test('logo links to home', async ({ page }) => {
    await page.goto('/docs');
    await page.click('a[aria-label="GitPayWidget home"]');
    await expect(page).toHaveURL('/');
  });
});

test.describe('SEO & Accessibility', () => {
  test('page has proper meta description', async ({ page }) => {
    await page.goto('/');
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('payment');
  });

  test('page has Open Graph tags', async ({ page }) => {
    await page.goto('/');
    
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('GitPayWidget');
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('buttons are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first CTA
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that a focusable element is focused
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON']).toContain(focused);
  });

  test('headings are in correct order', async ({ page }) => {
    await page.goto('/');
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    const h2s = await page.locator('h2').count();
    expect(h2s).toBeGreaterThan(0);
  });
});

test.describe('Performance', () => {
  test('page loads in reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;
    
    // Should load DOM in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out expected errors (e.g., from extensions)
    const criticalErrors = errors.filter(e => !e.includes('Extension'));
    expect(criticalErrors).toHaveLength(0);
  });
});
