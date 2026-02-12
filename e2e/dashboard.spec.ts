import { test, expect } from '@playwright/test';

// This test assumes the dev server is running at http://localhost:3000
// It sets a dummy token and user in localStorage and navigates to the dashboard.

test('dashboard colleges page loads with saved token', async ({ page }) => {
  // Set localStorage to simulate authenticated user
  await page.addInitScript(() => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: 'user_test_001', name: 'Test User' }));
  });

  await page.goto('http://localhost:3000/dashboard/colleges');
  await expect(page.locator('text=Browse Colleges')).toBeVisible();
});
