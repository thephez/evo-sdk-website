export function formatResult(value) {
  const seen = new WeakSet();

  // Check if object is a WASM object (has __wbg_ptr)
  const isWasmObject = (val) => {
    return val && typeof val === 'object' && '__wbg_ptr' in val;
  };

  // Check if this is a ProofMetadataResponse (has data, metadata, proof properties)
  const isProofMetadataResponse = (val) => {
    return val && typeof val === 'object' &&
           'data' in val && 'metadata' in val && 'proof' in val;
  };

  // Try to extract meaningful data from WASM object
  const extractWasmData = (val) => {
    // Special handling for ProofMetadataResponse - manually construct the result
    // to properly handle Maps in the data field
    if (isProofMetadataResponse(val)) {
      return {
        data: val.data,  // Will be processed by toSerializable which handles Maps
        metadata: val.metadata,
        proof: val.proof
      };
    }
    // Try toJSON first (works for Identity, DataContract, Document, etc.)
    if (typeof val.toJSON === 'function') {
      try { return val.toJSON(); } catch (_) { }
    }
    // Try toObject
    if (typeof val.toObject === 'function') {
      try { return val.toObject(); } catch (_) { }
    }
    // WORKAROUND: Fallback for WASM objects missing toJSON/toObject
    // See: https://github.com/dashpay/platform/issues/3027
    // TODO: Remove this workaround once SDK is updated with proper toJSON() methods
    const knownGetters = [
      // TokenContractInfo
      ['contractId', 'tokenContractPosition'],
      // IdentityTokenInfo
      ['isFrozen'],
    ];
    for (const getterSet of knownGetters) {
      if (getterSet.every(prop => prop in val)) {
        const obj = {};
        for (const prop of getterSet) {
          try { obj[prop] = val[prop]; } catch (_) { }
        }
        if (Object.keys(obj).length > 0) return obj;
      }
    }
    // Fallback: try toString
    if (typeof val.toString === 'function' && val.toString !== Object.prototype.toString) {
      const str = val.toString();
      if (str && str !== '[object Object]') return str;
    }
    return null;
  };

  const toSerializable = (val) => {
    if (val === undefined) return undefined;
    if (val === null) return null;
    const t = typeof val;
    if (t === 'string' || t === 'number' || t === 'boolean') return val;
    if (t === 'bigint') return val.toString();

    if (t === 'function') return undefined;
    if (t !== 'object') return String(val);

    if (seen.has(val)) return '[Circular]';
    seen.add(val);

    // Handle WASM objects specially
    if (isWasmObject(val)) {
      const extracted = extractWasmData(val);
      if (extracted !== null) return toSerializable(extracted);
    }

    if (typeof val.toJSON === 'function') {
      try { return toSerializable(val.toJSON()); } catch (_) { /* fallthrough */ }
    }
    if (typeof val.toObject === 'function') {
      try { return toSerializable(val.toObject()); } catch (_) { /* fallthrough */ }
    }

    if (val instanceof Map) {
      const obj = {};
      for (const [k, v] of val.entries()) {
        let key;
        if (isWasmObject(k)) {
          const extracted = extractWasmData(k);
          if (typeof extracted === 'string') {
            key = extracted;
          } else if (typeof k.toHex === 'function') {
            // WASM objects like PlatformAddress use toHex() for string representation
            try { key = k.toHex(); } catch (_) { key = String(k); }
          } else {
            key = String(k);
          }
        } else if (typeof k === 'string') {
          key = k;
        } else {
          key = String(k);
        }
        obj[key] = toSerializable(v);
      }
      return obj;
    }

    if (Array.isArray(val)) {
      return val.map(item => toSerializable(item));
    }

    if (ArrayBuffer.isView(val)) {
      return Array.from(val);
    }

    const obj = {};
    for (const [k, v] of Object.entries(val)) {
      if (k === '__wbg_ptr') continue; // Skip WASM pointer
      obj[k] = toSerializable(v);
    }
    return obj;
  };

  const normalized = toSerializable(value);
  if (normalized === undefined) return 'Completed (no result returned)';
  if (normalized === null) return 'null';
  if (typeof normalized === 'string') return normalized;

  try {
    return JSON.stringify(normalized, null, 2);
  } catch (_) {
    try {
      return String(normalized);
    } catch {
      return '[Unserializable result]';
    }
  }
}
