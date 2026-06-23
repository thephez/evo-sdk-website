export function normalizeContract(contract) {
  if (!contract) return null;
  let value = contract;
  if (typeof value.toJSON === 'function') {
    try {
      value = value.toJSON();
    } catch (_) { /* ignore */ }
  } else if (typeof value.toObject === 'function') {
    try {
      value = value.toObject();
    } catch (_) { /* ignore */ }
  } else if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (_) {
      return null;
    }
  }
  if (value && typeof value === 'object') {
    if (value.documentSchemas) return value;
    if (value.definition && value.definition.documentSchemas) return value.definition;
  }
  return value;
}

export function normalizeDocument(document) {
  if (!document) return null;

  // Extract revision from the original Document object BEFORE calling toJSON/toObject
  // The WASM SDK Document class has a `revision` getter that returns bigint | undefined
  // This getter may not be preserved after serialization
  let originalRevision = null;
  if (document && typeof document === 'object' && 'revision' in document) {
    try {
      const rev = document.revision;
      if (rev != null) {
        originalRevision = Number(rev);
      }
    } catch (_) { /* ignore */ }
  }

  let value = document;
  if (typeof value.toJSON === 'function') {
    try {
      value = value.toJSON();
    } catch (_) { /* ignore */ }
  } else if (typeof value.toObject === 'function') {
    try {
      value = value.toObject();
    } catch (_) { /* ignore */ }
  } else if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (_) {
      return null;
    }
  }

  if (value && typeof value === 'object') {
    if (value.result && value.result.document) {
      value = value.result.document;
    }
    if (value.document) {
      value = value.document;
    }
  }

  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (_) {
      return null;
    }
  }

  if (!value || typeof value !== 'object') return null;

  const data = value.data ?? value.value ?? {};
  // Use original revision from Document object getter, fallback to serialized value
  const revisionRaw = originalRevision ?? value.revision ?? value.$revision ?? null;
  const revision = revisionRaw != null ? Number(revisionRaw) : null;

  return { data, revision: Number.isNaN(revision) ? null : revision };
}

export function buildContractDefinition(params) {
  // Get document schemas JSON
  if (!params.documentSchemas) {
    throw new Error('Document Schemas JSON is required');
  }

  let documentSchemas;
  try {
    documentSchemas = typeof params.documentSchemas === 'string'
      ? JSON.parse(params.documentSchemas)
      : params.documentSchemas;
  } catch (e) {
    throw new Error(`Invalid JSON in Document Schemas field: ${e.message}`);
  }

  // Get optional JSON fields
  let groups = {};
  let tokens = {};

  if (params.groups) {
    try {
      groups = typeof params.groups === 'string'
        ? JSON.parse(params.groups)
        : params.groups;
    } catch (e) {
      throw new Error(`Invalid JSON in Groups field: ${e.message}`);
    }
  }

  if (params.tokens) {
    try {
      tokens = typeof params.tokens === 'string'
        ? JSON.parse(params.tokens)
        : params.tokens;
    } catch (e) {
      throw new Error(`Invalid JSON in Tokens field: ${e.message}`);
    }
  }

  // Get keywords
  const keywords = params.keywords ? params.keywords.split(',').map(k => k.trim()).filter(k => k) : [];

  // Build the contract object
  const contractData = {
    "$format_version": "1",
    "id": "11111111111111111111111111111111", // Will be replaced by SDK
    "config": {
      "$format_version": "1",
      "canBeDeleted": params.canBeDeleted || false,
      "readonly": params.readonly || false,
      "keepsHistory": params.keepsHistory || false,
      "documentsKeepHistoryContractDefault": params.documentsKeepHistoryContractDefault || false,
      "documentsMutableContractDefault": params.documentsMutableContractDefault !== false, // Default true
      "documentsCanBeDeletedContractDefault": params.documentsCanBeDeletedContractDefault !== false, // Default true
      "requiresIdentityEncryptionBoundedKey": params.requiresIdentityEncryptionBoundedKey || null,
      "requiresIdentityDecryptionBoundedKey": params.requiresIdentityDecryptionBoundedKey || null,
      "sizedIntegerTypes": true
    },
    "version": 1,
    "ownerId": params.ownerId,
    "schemaDefs": null,
    "documentSchemas": documentSchemas,
    "createdAt": null,
    "updatedAt": null,
    "createdAtBlockHeight": null,
    "updatedAtBlockHeight": null,
    "createdAtEpoch": null,
    "updatedAtEpoch": null,
    "groups": groups,
    "tokens": tokens,
    "keywords": keywords,
    "description": params.description || null
  };

  return JSON.stringify(contractData);
}

export function buildContractUpdates(params) {
  // Start with the complete existing contract
  let contractData = { ...params.existingContract };

  // Increment the version for updates
  contractData.version = (contractData.version || 1) + 1;

  // Update document schemas if provided
  if (params.newDocumentSchemas) {
    let newSchemas;
    try {
      newSchemas = typeof params.newDocumentSchemas === 'string'
        ? JSON.parse(params.newDocumentSchemas)
        : params.newDocumentSchemas;
    } catch (e) {
      throw new Error(`Invalid JSON in New Document Schemas field: ${e.message}`);
    }
    // Merge new schemas with existing ones (new ones override existing)
    contractData.documentSchemas = {
      ...contractData.documentSchemas,
      ...newSchemas
    };
  }

  // Update groups if provided
  if (params.newGroups) {
    let newGroups;
    try {
      newGroups = typeof params.newGroups === 'string'
        ? JSON.parse(params.newGroups)
        : params.newGroups;
    } catch (e) {
      throw new Error(`Invalid JSON in New Groups field: ${e.message}`);
    }
    contractData.groups = {
      ...contractData.groups,
      ...newGroups
    };
  }

  // Update tokens if provided
  if (params.newTokens) {
    let newTokens;
    try {
      newTokens = typeof params.newTokens === 'string'
        ? JSON.parse(params.newTokens)
        : params.newTokens;
    } catch (e) {
      throw new Error(`Invalid JSON in New Tokens field: ${e.message}`);
    }
    contractData.tokens = {
      ...contractData.tokens,
      ...newTokens
    };
  }

  return JSON.stringify(contractData);
}
