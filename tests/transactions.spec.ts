import { test, expect } from '@playwright/test';

test.describe('Transactions Page', () => {
  test('should render the transactions page and show the title', async ({ page }) => {
    await page.goto('/transactions');
    await expect(page.getByRole('heading', { name: 'Transactions' })).toBeVisible();
  });
});
