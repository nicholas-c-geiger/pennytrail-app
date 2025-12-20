import { test, expect } from '@playwright/test';

test('nav hidden on external root', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('nav[aria-label="Main navigation"]');
  await expect(nav).toHaveCount(0);
});

test('nav visible on dashboard with Dashboard link and a button', async ({ page }) => {
  await page.goto('/dashboard');
  const nav = page.locator('nav[aria-label="Main navigation"]');
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  // Assert there's at least one button inside the nav (e.g., LogOutButton)
  await expect(nav.locator('button')).toHaveCount(1);
});
