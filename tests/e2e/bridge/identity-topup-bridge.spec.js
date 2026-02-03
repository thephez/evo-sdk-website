const { test, expect } = require('@playwright/test');
const { EvoSdkPage } = require('../utils/sdk-page');

// Configuration
const BRIDGE_URL = 'https://bridge.thepasta.org/';
const BALANCE_THRESHOLD = 1_000_000_000_000; // Skip topup if balance exceeds this (in credits)

// Primary test identity - matches test-data-pasta.js
const TEST_IDENTITY_PRIMARY = process.env.TEST_IDENTITY_PRIMARY || '7XcruVSsGQVSgTcmPewaE4tXLutnW1F6PXxwMbo8GYQC';

/**
 * Parse balance from SDK query result
 * @param {string} resultStr - The raw result string from getIdentityBalance
 * @returns {bigint} - The balance as a BigInt
 */
function parseBalance(resultStr) {
  try {
    const parsed = JSON.parse(resultStr);
    // Result can be { data: number, metadata: {...} } or just a quoted number
    if (parsed && typeof parsed === 'object' && 'data' in parsed) {
      return BigInt(parsed.data);
    }
    // Fallback: plain number or string
    return BigInt(parsed);
  } catch {
    // If not JSON, try direct conversion
    const cleaned = resultStr.replace(/"/g, '').trim();
    return BigInt(cleaned);
  }
}

test.describe('Bridge Identity Topup', () => {
  test('should topup primary identity via bridge faucet if balance is low', async ({ page }) => {
    // Extended timeout for bridge transactions
    test.setTimeout(120000);

    let currentBalance;
    let needsTopup = false;

    // Step 1: Check current identity balance using SDK website
    await test.step('Check identity balance', async () => {
      const evoSdkPage = new EvoSdkPage(page);

      await evoSdkPage.initialize('testnet');
      await evoSdkPage.setupQuery('identity', 'getIdentityBalance');

      // Fill the identity ID directly instead of using parameter injector
      await evoSdkPage.fillParameterByName('identityId', TEST_IDENTITY_PRIMARY);

      const result = await evoSdkPage.executeQueryAndGetResult();
      expect(result.success).toBe(true);

      currentBalance = parseBalance(result.result);
      console.log(`Current balance for ${TEST_IDENTITY_PRIMARY}: ${currentBalance} credits`);

      needsTopup = currentBalance < BigInt(BALANCE_THRESHOLD);
      if (!needsTopup) {
        console.log(`Balance ${currentBalance} exceeds threshold ${BALANCE_THRESHOLD}, skipping topup`);
      }
    });

    // Skip remaining steps if balance is sufficient
    if (!needsTopup) {
      test.skip(true, `Balance ${currentBalance} exceeds threshold ${BALANCE_THRESHOLD}`);
      return;
    }

    // Step 2: Navigate to bridge and request topup
    await test.step('Request topup from bridge faucet', async () => {
      console.log('Navigating to bridge faucet...');
      await page.goto(BRIDGE_URL);

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Select testnet network (if not already selected)
      const testnetBtn = page.locator('.network-btn.testnet');
      if (await testnetBtn.count() > 0) {
        await testnetBtn.click();
        console.log('Selected testnet network');
      }

      // Click "Top Up Existing Identity" button to get to the identity input screen
      const topUpBtn = page.locator('button', { hasText: 'Top Up Existing Identity' });
      await topUpBtn.waitFor({ state: 'visible', timeout: 10000 });
      await topUpBtn.click();
      console.log('Clicked Top Up Existing Identity button');

      // Enter identity ID
      const identityInput = page.locator('.identity-id-input');
      await identityInput.waitFor({ state: 'visible', timeout: 10000 });
      await identityInput.fill(TEST_IDENTITY_PRIMARY);
      console.log(`Entered identity ID: ${TEST_IDENTITY_PRIMARY}`);

      // Click Continue button
      const continueBtn = page.locator('button', { hasText: 'Continue' });
      await continueBtn.waitFor({ state: 'visible', timeout: 10000 });
      await continueBtn.click();
      console.log('Clicked Continue button');

      // Click "Request Testnet Funds" button
      const requestFundsBtn = page.locator('button', { hasText: 'Request Testnet Funds' });
      await requestFundsBtn.waitFor({ state: 'visible', timeout: 10000 });
      await requestFundsBtn.click();
      console.log('Clicked Request Testnet Funds button');
    });

    // Step 3: Wait for transaction completion
    await test.step('Wait for topup completion', async () => {
      // Wait for success or error state
      const successIndicator = page.locator('.identity-status.success, .complete-step');
      const errorIndicator = page.locator('.identity-status.error, .error-step');

      // Wait for either success or error (with extended timeout for blockchain transactions)
      const result = await Promise.race([
        successIndicator.waitFor({ state: 'visible', timeout: 90000 }).then(() => 'success'),
        errorIndicator.waitFor({ state: 'visible', timeout: 90000 }).then(() => 'error')
      ]);

      if (result === 'error') {
        const errorMsg = await page.locator('.error-message').textContent().catch(() => 'Unknown error');
        console.error(`Faucet request failed: ${errorMsg}`);
        // Don't fail the test on faucet errors (could be rate limiting)
        console.log('Faucet error may be due to rate limiting or other temporary issues');
      } else {
        console.log('Topup transaction completed successfully');
      }
    });
  });
});
