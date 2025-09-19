import { test, expect } from '@playwright/test';

test('docs page renders heading', async ({ page }) => {
  await page.goto('/docs.html', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Evo JS SDK Documentation|Dash Platform Evo JS SDK/);
  await expect(page.locator('h1')).toContainText(/Dash Platform Evo JS SDK/);
});

test('index loads and renders sidebar', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('#preloader')).toBeHidden({ timeout: 15_000 });
  const categorySelect = page.locator('#queryCategory');
  await expect(categorySelect).toBeVisible();
  await expect(page.locator('#queryCategory option[value="system"]')).toHaveCount(1);
});

test('run simple query (getStatus)', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('#preloader')).toBeHidden({ timeout: 15_000 });

  await page.waitForSelector('#queryCategory option[value="system"]', { timeout: 15_000, state: 'attached' });
  await page.selectOption('#queryCategory', 'system');

  const queryType = page.locator('#queryType');
  await expect(queryType).toBeVisible();

  await page.waitForSelector('#queryType option[value="getStatus"]', { timeout: 15_000, state: 'attached' });
  await page.selectOption('#queryType', 'getStatus');

  const executeButton = page.locator('#executeQuery');
  await expect(executeButton).toBeVisible();
  await executeButton.click();

  const result = page.locator('#identityInfo');
  await expect(result).toContainText('{', { timeout: 30_000 });
});
