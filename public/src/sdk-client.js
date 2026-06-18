import { EvoSDK, wallet, DataContract, Document, IdentitySigner, Identifier } from '../dist/evo-sdk.module.js';
import { elements, state } from './state.js';
import { setStatus } from './ui.js';

export function updateNetworkIndicator() {
  const selected = elements.networkRadios.find(r => r.checked)?.value || 'testnet';
  if (!elements.networkIndicator) return;
  elements.networkIndicator.textContent = selected.toUpperCase();
  elements.networkIndicator.classList.toggle('mainnet', selected === 'mainnet');
  elements.networkIndicator.classList.toggle('testnet', selected !== 'mainnet');
}

export function buildClientOptions() {
  const selectedNetwork = elements.networkRadios.find(r => r.checked)?.value || 'mainnet';
  const opts = {
    network: selectedNetwork,
    trusted: !!(elements.trustedMode && elements.trustedMode.checked),
    proofs: true,
  };
  const { advancedOptions } = state;
  // TODO: pinned to protocol_version 11 (Platform v3.0.x) because rs-sdk
  // seeds protocol_version from PlatformVersion::latest() and only ratchets
  // upward, so an unpinned SDK sends V1-wire GetDocumentsRequest to a v3.0.x
  // network and fails to decode. Applies to both mainnet and testnet — revisit
  // (remove or bump) once the target networks are on Platform v3.1+
  // (protocol_version 12). If mainnet and testnet ever sit on different active
  // protocol versions, this will need to be gated on selectedNetwork instead.
  opts.version = advancedOptions.platformVersion ?? 11;
  const settings = {};
  if (advancedOptions.connectTimeout) settings.connectTimeoutMs = advancedOptions.connectTimeout;
  if (advancedOptions.requestTimeout) settings.timeoutMs = advancedOptions.requestTimeout;
  if (advancedOptions.retries) settings.retries = advancedOptions.retries;
  if (typeof advancedOptions.banFailedAddress === 'boolean') {
    settings.banFailedAddress = advancedOptions.banFailedAddress;
  }
  if (Object.keys(settings).length) {
    opts.settings = settings;
  }
  return opts;
}

export async function ensureClient(force = false) {
  const options = buildClientOptions();
  const newKey = JSON.stringify(options);
  if (!force && state.client && state.clientKey === newKey && state.client.isConnected) {
    return state.client;
  }
  if (state.client && typeof state.client.disconnect === 'function') {
    try { await state.client.disconnect(); } catch (_) { /* ignore */ }
  }
  const client = new EvoSDK(options);
  await client.connect();
  state.client = client;
  state.clientKey = newKey;
  return client;
}

export function applyAdvancedConfig() {
  const options = {};
  const platformVersion = parseInt(elements.platformVersion?.value || '', 10);
  if (!Number.isNaN(platformVersion)) options.platformVersion = platformVersion;
  const connectTimeout = parseInt(elements.connectTimeout?.value || '', 10);
  if (!Number.isNaN(connectTimeout)) options.connectTimeout = connectTimeout;
  const requestTimeout = parseInt(elements.requestTimeout?.value || '', 10);
  if (!Number.isNaN(requestTimeout)) options.requestTimeout = requestTimeout;
  const retries = parseInt(elements.retries?.value || '', 10);
  if (!Number.isNaN(retries)) options.retries = retries;
  if (elements.banFailedAddress) options.banFailedAddress = elements.banFailedAddress.checked;
  state.advancedOptions = options;
  state.clientKey = null;
  setStatus('Configuration applied. Reconnect on next request.', 'success');
}

export async function loadVersionInfo() {
  try {
    const response = await fetch('version-info.json');
    if (!response.ok) {
      console.warn('Version info not available');
      return;
    }
    const versionInfo = await response.json();
    const versionElement = document.getElementById('versionInfo');
    if (versionElement && versionInfo) {
      const sdkVersion = versionInfo.sdkVersion || 'unknown';
      const commitHash = versionInfo.commitHash || 'unknown';
      const buildTime = versionInfo.buildTime || '';

      // Format the build time if available
      let buildDisplay = '';
      if (buildTime) {
        const d = new Date(buildTime);
        buildDisplay = buildTime && !Number.isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : '';
      }

      // Create the version display with clickable links
      const githubUrl = `https://github.com/dashpay/evo-sdk-website/commit/${commitHash}`;
      const sdkUrl = 'https://www.npmjs.com/package/@dashevo/evo-sdk';

      const linkStyle = 'color: inherit; text-decoration: underline;';
      versionElement.innerHTML = [
        `<a href="${sdkUrl}" target="_blank" style="${linkStyle}">v${sdkVersion}↗</a>`,
        '•',
        `<a href="${githubUrl}" target="_blank" style="${linkStyle}">${commitHash}↗</a>`,
        '•',
        buildDisplay
      ].join(' ');
      versionElement.title = `SDK Version: ${sdkVersion}\nWebsite Commit: ${commitHash}\nBuild Time: ${buildTime}`;
    }
  } catch (error) {
    console.warn('Could not load version info:', error);
  }
}

export { EvoSDK, wallet, DataContract, Document, IdentitySigner, Identifier };
