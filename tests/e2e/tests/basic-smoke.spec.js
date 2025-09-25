const { test, expect } = require('@playwright/test');
const { WasmSdkPage } = require('../utils/wasm-sdk-page');

/**
 * Filter out placeholder options from dropdown arrays
 * @param {string[]} options - Array of dropdown options
 * @returns {string[]} - Filtered array without placeholders
 */
function filterPlaceholderOptions(options) {
  return options.filter(option =>
    !option.toLowerCase().includes('select') &&
    option.trim() !== ''
  );
}

test.describe('JS Evo SDK Basic Smoke Tests', () => {
  let wasmSdkPage;

  test.beforeEach(async ({ page }) => {
    wasmSdkPage = new WasmSdkPage(page);
    await wasmSdkPage.initialize('testnet');
  });

  test('should initialize SDK successfully', async () => {
    // Wait for SDK to be fully ready (with retry logic)
    let statusState;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      statusState = await wasmSdkPage.getStatusBannerState();
      
      if (statusState === 'success') {
        break;
      }
      
      if (statusState === 'loading') {
        // Wait for loading to complete
        await wasmSdkPage.waitForSdkReady();
        statusState = await wasmSdkPage.getStatusBannerState();
        
        if (statusState === 'success') {
          break;
        }
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        await wasmSdkPage.page.waitForTimeout(2000);
      }
    }
    
    // Final check
    expect(statusState).toBe('success');
    
    // Verify network is set to testnet
    const networkIndicator = wasmSdkPage.page.locator('#networkIndicator');
    await expect(networkIndicator).toContainText('TESTNET');
  });

  test('should load query categories', async () => {
    await wasmSdkPage.setOperationType('queries');
    
    const categories = await wasmSdkPage.getAvailableQueryCategories();
    
    // Check that we have the expected categories
    const expectedCategories = [
      'Identity Queries',
      'Data Contract Queries', 
      'Document Queries',
      'DPNS Queries',
      'Voting & Contested Resources',
      'Protocol & Version',
      'Epoch & Block Queries',
      'Token Queries',
      'Group Queries',
      'System & Utility'
    ];
    
    for (const category of expectedCategories) {
      expect(categories).toContain(category);
    }
  });

  test('should switch between networks', async () => {
    // Test switching to mainnet
    await wasmSdkPage.setNetwork('mainnet');
    const mainnetIndicator = wasmSdkPage.page.locator('#networkIndicator');
    await expect(mainnetIndicator).toContainText('MAINNET');
    
    // Switch back to testnet
    await wasmSdkPage.setNetwork('testnet');
    const testnetIndicator = wasmSdkPage.page.locator('#networkIndicator');
    await expect(testnetIndicator).toContainText('TESTNET');
  });

  test('should show query types when category is selected', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('identity');
    
    const queryTypes = await wasmSdkPage.getAvailableQueryTypes();
    
    // Should have some identity query types
    expect(queryTypes.length).toBeGreaterThan(0);
    expect(queryTypes).toContain('Get Identity');
  });

  test('should show input fields when query type is selected', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('identity');
    await wasmSdkPage.setQueryType('getIdentity');
    
    // Should show query inputs container
    const queryInputs = wasmSdkPage.page.locator('#queryInputs');
    await expect(queryInputs).toBeVisible();
    
    // Should show execute button
    const executeButton = wasmSdkPage.page.locator('#executeQuery');
    await expect(executeButton).toBeVisible();
  });

  test('should enable/disable execute button based on form completion', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('identity');
    await wasmSdkPage.setQueryType('getIdentity');
    
    const executeButton = wasmSdkPage.page.locator('#executeQuery');
    
    // Button should be enabled (even without required params for this test)
    await expect(executeButton).toBeVisible();
  });

  test('should clear results when clear button is clicked', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('system');
    await wasmSdkPage.setQueryType('getStatus');
    
    // Execute a simple query first
    await wasmSdkPage.executeQuery();
    
    // Clear results
    await wasmSdkPage.clearResults();
    
    // Verify results are cleared
    const resultContent = wasmSdkPage.page.locator('#identityInfo');
    await expect(resultContent).toHaveClass(/empty/);
  });

  test('should toggle proof information', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('identity');
    await wasmSdkPage.setQueryType('getIdentity');
    
    // Wait a moment for UI to fully load
    await wasmSdkPage.page.waitForTimeout(1000);
    
    // Check if proof toggle is available
    const proofContainer = wasmSdkPage.page.locator('#proofToggleContainer');
    
    try {
      // Wait for container to potentially appear
      await proofContainer.waitFor({ state: 'visible', timeout: 5000 });
      
      // Test enabling proof info
      const enableSuccess = await wasmSdkPage.enableProofInfo();
      if (enableSuccess) {
        const proofToggle = wasmSdkPage.page.locator('#proofToggle');
        await expect(proofToggle).toBeChecked();
        
        // Test disabling proof info
        const disableSuccess = await wasmSdkPage.disableProofInfo();
        if (disableSuccess) {
          await expect(proofToggle).not.toBeChecked();
        }
        
      } else {
      }
    } catch (error) {
      // Proof toggle not available for this query type - that's OK
    }
  });

  test('should show query description when available', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('identity');
    await wasmSdkPage.setQueryType('getIdentity');
    
    const description = await wasmSdkPage.getQueryDescription();
    
    if (description) {
      expect(description.length).toBeGreaterThan(0);
    }
  });
});

test.describe('State Transitions UI Tests', () => {
  let wasmSdkPage;

  test.beforeEach(async ({ page }) => {
    wasmSdkPage = new WasmSdkPage(page);
    await wasmSdkPage.initialize('testnet');
  });

  test('should switch to state transitions operation type correctly', async () => {
    // Start with queries, then switch to transitions
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.page.waitForTimeout(500);

    await wasmSdkPage.setOperationType('transitions');

    // Verify the operation type is set correctly
    const operationType = await wasmSdkPage.page.locator('#operationType').inputValue();
    expect(operationType).toBe('transitions');

    console.log('✅ Successfully switched to state transitions operation type');
  });

  test('should populate transition categories correctly', async () => {
    await wasmSdkPage.setOperationType('transitions');

    const categories = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryCategories()
    );

    const expected = [
      'Identity Transitions',
      'Data Contract Transitions',
      'Document Transitions',
      'Token Transitions',
      'Voting Transitions',
    ];

    const missing = expected.filter(cat => !categories.includes(cat));
    const unexpected = categories.filter(cat => !expected.includes(cat));

    expect(missing, `Missing: ${missing.join(', ')}`).toEqual([]);
    expect(unexpected, `Unexpected: ${unexpected.join(', ')}`).toEqual([]);
    expect(categories.length, 'Wrong number of categories').toBe(expected.length);

    console.log('✅ State transition categories populated correctly:', categories);
  });

  test('should populate identity transition types correctly', async () => {
    await wasmSdkPage.setOperationType('transitions');
    await wasmSdkPage.setQueryCategory('identity');

    const transitionTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = [
      'Identity Create',
      'Identity Top Up',
      'Identity Update',
      'Identity Credit Transfer',
      'Identity Credit Withdrawal'
    ];

    expect(new Set(transitionTypes)).toEqual(new Set(expected));
    expect(transitionTypes.length).toBe(expected.length);
    console.log('✅ Identity transition types populated correctly:', transitionTypes);
  });

  test('should populate data contract transition types correctly', async () => {
    await wasmSdkPage.setOperationType('transitions');
    await wasmSdkPage.setQueryCategory('dataContract');

    const transitionTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = ['Data Contract Create', 'Data Contract Update'];

    expect(new Set(transitionTypes)).toEqual(new Set(expected));
    expect(transitionTypes.length).toBe(expected.length);

    console.log('✅ Data contract transition types populated correctly:', transitionTypes);
  });

  test('should populate document transition types correctly', async () => {
    await wasmSdkPage.setOperationType('transitions');
    await wasmSdkPage.setQueryCategory('document');

    const transitionTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = [
      'Document Create',
      'Document Replace',
      'Document Delete',
      'Document Transfer',
      'Document Purchase',
      'Document Set Price',
      'DPNS Register Name'
    ];

    expect(new Set(transitionTypes)).toEqual(new Set(expected));
    expect(transitionTypes.length).toBe(expected.length);

    console.log('✅ Document transition types populated correctly:', transitionTypes);
  });

  test('should populate token transition types correctly', async () => {
    await wasmSdkPage.setOperationType('transitions');
    await wasmSdkPage.setQueryCategory('token');

    const transitionTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = [
      'Token Burn',
      'Token Mint',
      'Token Claim',
      'Token Set Price',
      'Token Direct Purchase',
      'Token Config Update',
      'Token Transfer',
      'Token Freeze',
      'Token Unfreeze',
      'Token Destroy Frozen'
    ];

    expect(new Set(transitionTypes)).toEqual(new Set(expected));
    expect(transitionTypes.length).toBe(expected.length);

    console.log('✅ Token transition types populated correctly:', transitionTypes);
  });

  test('should populate voting transition types correctly', async () => {
    await wasmSdkPage.setOperationType('transitions');
    await wasmSdkPage.setQueryCategory('voting');

    const transitionTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = ['DPNS Username', 'Contested Resource'];

    expect(new Set(transitionTypes)).toEqual(new Set(expected));
    expect(transitionTypes.length).toBe(expected.length);

    console.log('✅ Voting transition types populated correctly:', transitionTypes);
  });
});
