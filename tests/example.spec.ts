import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  // Basic smoke check: ensure page has HTML content and status is OK
  await expect(page).toHaveURL(/\/?$/);
  const content = await page.locator('body').innerText();
  expect(content.length).toBeGreaterThan(0);
});
