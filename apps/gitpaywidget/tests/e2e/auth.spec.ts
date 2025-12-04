import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should redirect unauthenticated users from dashboard', async ({ page }) => {
    // Try to access dashboard without being logged in
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Check page content
    await expect(page.getByRole('heading')).toContainText(/sign in|log in|welcome/i);
    
    // Check GitHub OAuth button exists
    const githubButton = page.getByRole('button', { name: /github|sign in/i });
    await expect(githubButton).toBeVisible();
  });

  test('should protect admin routes', async ({ page }) => {
    // Try to access admin without auth
    await page.goto('/admin');
    
    // Should redirect
    await expect(page).toHaveURL(/.*login|.*dashboard/);
  });

  test('should protect projects page', async ({ page }) => {
    await page.goto('/projects');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Login Page Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should be usable on mobile', async ({ page }) => {
    await page.goto('/login');
    
    // GitHub button should be visible and tappable
    const githubButton = page.getByRole('button', { name: /github|sign in/i });
    await expect(githubButton).toBeVisible();
    
    // Check button is large enough to tap
    const box = await githubButton.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44); // Minimum touch target
  });
});





