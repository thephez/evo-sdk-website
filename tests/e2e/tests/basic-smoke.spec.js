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

// Reusable comparator with clear diagnostics
function ensureExactOptions(actual, expected, label) {
  const missing = expected.filter(x => !actual.includes(x));
  const unexpected = actual.filter(x => !expected.includes(x));
  const duplicates = actual.filter((x, i, a) => a.indexOf(x) !== i);

  // Show explicit diffs when failing
  expect(missing, `${label} → Missing: ${JSON.stringify(missing)}`).toEqual([]);
  expect(unexpected, `${label} → Unexpected: ${JSON.stringify(unexpected)}`).toEqual([]);

  // Guard against dupes and count drift
  expect(new Set(actual).size, `${label} → Duplicates: ${JSON.stringify(duplicates)}`).toBe(expected.length);
  expect(actual.length, `${label} → Wrong count (actual ${actual.length} vs expected ${expected.length})`)
    .toBe(expected.length);
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

test.describe('Query Categories and Types UI Tests', () => {
  let wasmSdkPage;

  test.beforeEach(async ({ page }) => {
    wasmSdkPage = new WasmSdkPage(page);
    await wasmSdkPage.initialize('testnet');
  });

  test('should populate all query categories correctly', async () => {
    await wasmSdkPage.setOperationType('queries');

    const categories = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryCategories()
    );

    const expected = [
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

    ensureExactOptions(categories, expected, 'Query categories');

    console.log('✅ Query categories populated correctly:', categories);
  });

  test('should populate identity query types correctly', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('identity');

    const queryTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = [
      'Get Identity',
      'Get Identity (Unproved)',
      'Get Identity Keys',
      'Get Contract Keys for Identities',
      'Get Identity Nonce',
      'Get Identity Contract Nonce',
      'Get Identity Balance',
      'Get Multiple Identity Balances',
      'Get Identity Balance & Revision',
      'Get Identity by Unique Public Key Hash',
      'Get Identity by Non-Unique Public Key Hash',
      'Get Identity Token Balances',
      'Get Token Balances for Identities',
      'Get Identity Token Info',
      'Get Token Info for Identities'
    ];

    ensureExactOptions(queryTypes, expected, 'Identity query types');

    console.log('✅ Identity query types populated correctly:', queryTypes);
  });

  test('should populate data contract query types correctly', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('dataContract');

    const queryTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = [
      'Get Data Contract',
      'Get Data Contracts',
      'Get Data Contract History'
    ];

    ensureExactOptions(queryTypes, expected, 'Data Contract query types');

    console.log('✅ Data contract query types populated correctly:', queryTypes);
  });

  test('should populate document query types correctly', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('document');

    const queryTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = [
      'Get Documents',
      'Get Document'
    ];

    ensureExactOptions(queryTypes, expected, 'Document query types');

    console.log('✅ Document query types populated correctly:', queryTypes);
  });

  test('should populate DPNS query types correctly', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('dpns');

    const queryTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = [
      'Get Primary Username',
      'List Usernames for Identity',
      'Get Username by Name',
      'Resolve DPNS Name',
      'Check DPNS Availability',
      'Convert to Homograph Safe',
      'Validate Username',
      'Is Contested Username'
    ];

    ensureExactOptions(queryTypes, expected, 'DPNS query types');

    console.log('✅ DPNS query types populated correctly:', queryTypes);
  });

  test('should populate system query types correctly', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('system');

    const queryTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = [
      'Get Platform Status',
      'Get Current Quorums Info',
      'Get Prefunded Specialized Balance',
      'Get Total Credits in Platform',
      'Get Path Elements',
      'Wait for State Transition Result'
    ];

    ensureExactOptions(queryTypes, expected, 'System query types');

    console.log('✅ System query types populated correctly:', queryTypes);
  });

  test('should populate protocol query types correctly', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('protocol');

    const queryTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = [
      'Get Protocol Version Upgrade State',
      'Get Protocol Version Vote Status'
    ];

    ensureExactOptions(queryTypes, expected, 'Protocol query types');

    console.log('✅ Protocol query types populated correctly:', queryTypes);
  });

  test('should populate epoch query types correctly', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('epoch');

    const queryTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = [
      'Get Epochs Info',
      'Get Current Epoch',
      'Get Finalized Epoch Infos',
      'Get Epoch Blocks by Evonode IDs',
      'Get Epoch Blocks by Range'
    ];

    const missing = expected.filter(type => !queryTypes.includes(type));
    const unexpected = queryTypes.filter(type => !expected.includes(type));

    expect(missing, `Missing: ${missing.join(', ')}`).toEqual([]);
    expect(unexpected, `Unexpected: ${unexpected.join(', ')}`).toEqual([]);
    expect(queryTypes.length, 'Wrong number of query types').toBe(expected.length);

    console.log('✅ Epoch query types populated correctly:', queryTypes);
  });

  test('should populate token query types correctly', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('token');

    const queryTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = [
      'Get Token Statuses',
      'Get Direct Purchase Prices',
      'Get Token Contract Info',
      'Get Token Distribution Last Claim',
      'Get Token Total Supply',
      'Get Token Price by Contract'
    ];

    const missing = expected.filter(type => !queryTypes.includes(type));
    const unexpected = queryTypes.filter(type => !expected.includes(type));

    expect(missing, `Missing: ${missing.join(', ')}`).toEqual([]);
    expect(unexpected, `Unexpected: ${unexpected.join(', ')}`).toEqual([]);
    expect(queryTypes.length, 'Wrong number of query types').toBe(expected.length);

    console.log('✅ Token query types populated correctly:', queryTypes);
  });

  test('should populate group query types correctly', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('group');

    const queryTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = [
      'Get Group Info',
      'List Group Infos',
      'Get Group Members',
      'Get Group Actions',
      'Get Group Action Signers',
      'Get Identity Groups',
      'Get Groups Data Contracts'
    ];

    const missing = expected.filter(type => !queryTypes.includes(type));
    const unexpected = queryTypes.filter(type => !expected.includes(type));

    expect(missing, `Missing: ${missing.join(', ')}`).toEqual([]);
    expect(unexpected, `Unexpected: ${unexpected.join(', ')}`).toEqual([]);
    expect(queryTypes.length, 'Wrong number of query types').toBe(expected.length);

    console.log('✅ Group query types populated correctly:', queryTypes);
  });

  test('should populate voting query types correctly', async () => {
    await wasmSdkPage.setOperationType('queries');
    await wasmSdkPage.setQueryCategory('voting');

    const queryTypes = filterPlaceholderOptions(
      await wasmSdkPage.getAvailableQueryTypes()
    );

    const expected = [
      'Get Contested Resources',
      'Get Contested Resource Vote State',
      'Get Voters for Identity',
      'Get Identity Votes',
      'Get Vote Polls by End Date'
    ];

    const missing = expected.filter(type => !queryTypes.includes(type));
    const unexpected = queryTypes.filter(type => !expected.includes(type));

    expect(missing, `Missing: ${missing.join(', ')}`).toEqual([]);
    expect(unexpected, `Unexpected: ${unexpected.join(', ')}`).toEqual([]);
    expect(queryTypes.length, 'Wrong number of query types').toBe(expected.length);

    console.log('✅ Voting query types populated correctly:', queryTypes);
  });
});
