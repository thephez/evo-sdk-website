import { test, expect } from '@playwright/test';

test('docs page renders heading', async ({ page }) => {
  await page.goto('/docs.html', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Evo JS SDK Documentation|Dash Platform Evo JS SDK/);
  await expect(page.locator('h1')).toContainText(/Dash Platform Evo JS SDK/);
});

test('index loads and renders sidebar', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('.category').first()).toBeVisible();
});

test.skip(process.env.EVO_WEBSITE_E2E !== '1', 'Network-backed e2e disabled by default');
test('run simple query (getStatus)', async ({ page }) => {
  await page.goto('/index.html');
  // Click first category then find an op containing Status
  const sidebar = page.locator('#sidebarList');
  await expect(sidebar).toBeVisible();
  const op = sidebar.getByText(/Status/i).first();
  await op.click();
  await page.getByRole('button', { name: 'Run' }).click();
  await expect(page.locator('#result')).toContainText('{', { timeout: 30_000 });
});
