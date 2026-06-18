// Pure assembly of the EvoSDK constructor options from already-resolved inputs.
// Kept free of DOM/state/SDK imports so it can be unit-tested in plain Node;
// buildClientOptions in sdk-client.js reads the network/trusted/advancedOptions
// from the page and delegates here.
export function assembleClientOptions(network, trusted, advancedOptions = {}) {
  const opts = {
    network,
    trusted: !!trusted,
    proofs: true,
  };
  // TODO: pinned to protocol_version 11 (Platform v3.0.x) because rs-sdk
  // seeds protocol_version from PlatformVersion::latest() and only ratchets
  // upward, so an unpinned SDK sends V1-wire GetDocumentsRequest to a v3.0.x
  // network and fails to decode. Applies to both mainnet and testnet — revisit
  // (remove or bump) once the target networks are on Platform v3.1+
  // (protocol_version 12). If mainnet and testnet ever sit on different active
  // protocol versions, this will need to be gated on network instead.
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
