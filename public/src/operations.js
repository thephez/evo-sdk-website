import { CONTRACT_SECURITY_LEVELS, prepareTransition } from './auth.js';
import { namedArgs } from './form/collect.js';
import { DataContract, Document, Identifier, IdentitySigner } from './sdk-client.js';

export async function callEvo(client, groupKey, itemKey, defs, args, useProof, extraArgs = {}) {
  const n = { ...namedArgs(defs, args), ...(extraArgs || {}) };
  const c = client;

  const toStringArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.filter(item => item !== undefined && item !== null && item !== '');
  };

  const toNumberArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value
      .map(item => {
        const num = Number(item);
        return Number.isFinite(num) ? num : null;
      })
      .filter(item => item !== null);
  };

  const toNumber = (value, fallback = null) => {
    if (value === undefined || value === null || value === '') return fallback;
    const num = Number(value);
    return Number.isNaN(num) ? fallback : num;
  };

  const parseJson = (value, label = 'field') => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value !== 'string') return value;
    try {
      return JSON.parse(value);
    } catch (e) {
      throw new Error(`Invalid JSON in ${label}: ${e.message}`);
    }
  };

  switch (itemKey) {
    // Identity queries
    case 'getIdentity':
      return useProof ? c.identities.fetchWithProof(n.id) : c.identities.fetch(n.id);
    case 'getIdentityUnproved':
      return c.identities.fetchUnproved(n.id);
    case 'getIdentityKeys': {
      const requestType = n.requestType || n.keyRequestType || 'all';
      const specificKeyIds = toNumberArray(n.specificKeyIds);
      let purposeMap = n.purposeMap ?? n.searchPurposeMap;
      if (purposeMap !== undefined) {
        purposeMap = parseJson(purposeMap, 'Purpose Map');
      }

      let request;
      if (requestType === 'specific') {
        request = { type: 'specific', specificKeyIds };
      } else if (requestType === 'search') {
        request = { type: 'search', purposeMap: purposeMap || {} };
      } else {
        request = { type: 'all' };
      }

      const query = {
        identityId: n.identityId,
        request,
        limit: n.limit ?? undefined,
        offset: n.offset ?? undefined,
      };

      return useProof ? c.identities.getKeysWithProof(query) : c.identities.getKeys(query);
    }
    case 'getIdentitiesContractKeys': {
      const identityIds = toStringArray(n.identityIds);
      const purposes = toNumberArray(n.purposes);
      const payload = {
        identityIds,
        contractId: n.contractId,
        purposes,
      };
      return useProof ? c.identities.contractKeysWithProof(payload) : c.identities.contractKeys(payload);
    }
    case 'getIdentityNonce':
      return useProof ? c.identities.nonceWithProof(n.identityId) : c.identities.nonce(n.identityId);
    case 'getIdentityContractNonce':
      return useProof ? c.identities.contractNonceWithProof(n.identityId, n.contractId) : c.identities.contractNonce(n.identityId, n.contractId);
    case 'getIdentityBalance':
      return useProof ? c.identities.balanceWithProof(n.identityId) : c.identities.balance(n.identityId);
    case 'getIdentitiesBalances': {
      const identityIds = toStringArray(n.identityIds);
      return useProof ? c.identities.balancesWithProof(identityIds) : c.identities.balances(identityIds);
    }
    case 'getIdentityBalanceAndRevision':
      return useProof ? c.identities.balanceAndRevisionWithProof(n.identityId) : c.identities.balanceAndRevision(n.identityId);
    case 'getIdentityByPublicKeyHash':
      return useProof ? c.identities.byPublicKeyHashWithProof(n.publicKeyHash) : c.identities.byPublicKeyHash(n.publicKeyHash);
    case 'getIdentityByNonUniquePublicKeyHash': {
      const startAfter = n.startAfter || undefined;
      return useProof ? c.identities.byNonUniquePublicKeyHashWithProof(n.publicKeyHash, startAfter) : c.identities.byNonUniquePublicKeyHash(n.publicKeyHash, startAfter);
    }
    case 'getIdentityTokenBalances': {
      const tokenIds = toStringArray(n.tokenIds);
      return useProof ? c.identities.tokenBalancesWithProof(n.identityId, tokenIds) : c.identities.tokenBalances(n.identityId, tokenIds);
    }
    case 'getIdentitiesTokenBalances': {
      const identityIds = toStringArray(n.identityIds);
      return useProof ? c.tokens.balancesWithProof(identityIds, n.tokenId) : c.tokens.balances(identityIds, n.tokenId);
    }
    case 'getIdentityTokenInfos': {
      const tokenIds = toStringArray(n.tokenIds);
      return useProof
        ? c.tokens.identityTokenInfosWithProof(n.identityId, tokenIds)
        : c.tokens.identityTokenInfos(n.identityId, tokenIds);
    }
    case 'getIdentitiesTokenInfos': {
      const identityIds = toStringArray(n.identityIds);
      return useProof ? c.tokens.identitiesTokenInfosWithProof(identityIds, n.tokenId) : c.tokens.identitiesTokenInfos(identityIds, n.tokenId);
    }

    // Identity transitions
    case 'identityCreate':
      return c.identities.create({ assetLockProof: n.assetLockProof, assetLockPrivateKeyWif: n.assetLockPrivateKeyWif, publicKeys: n.publicKeys });
    case 'identityTopUp':
      return c.identities.topUp({ identityId: n.identityId, assetLockProof: n.assetLockProof, assetLockPrivateKeyWif: n.assetLockPrivateKeyWif });
    case 'identityCreditTransfer': {
      // Fetch sender identity
      const senderId = n.senderId || n.identityId;
      const identity = await c.identities.fetch(senderId);
      if (!identity) {
        throw new Error(`Identity not found: ${senderId}`);
      }

      // Create signer and add private key
      const signer = new IdentitySigner();
      signer.addKeyFromWif(n.privateKeyWif);

      // Parse amount as BigInt
      const amount = BigInt(n.amount);

      const result = await c.identities.creditTransfer({
        identity,
        recipientId: n.recipientId,
        amount,
        signer,
      });

      return {
        status: 'success',
        senderBalance: result.senderBalance?.toString(),
        recipientBalance: result.recipientBalance?.toString(),
        message: `Transferred ${amount} credits to ${n.recipientId}`
      };
    }
    case 'identityCreditWithdrawal': {
      // Fetch identity
      const identity = await c.identities.fetch(n.identityId);
      if (!identity) {
        throw new Error(`Identity not found: ${n.identityId}`);
      }

      // Create signer and add private key
      const signer = new IdentitySigner();
      signer.addKeyFromWif(n.privateKeyWif);

      // Parse amount as BigInt
      const amount = BigInt(n.amount);

      const remainingBalance = await c.identities.creditWithdrawal({
        identity,
        amount,
        toAddress: n.toAddress || undefined,
        coreFeePerByte: n.coreFeePerByte ? Number(n.coreFeePerByte) : undefined,
        signer,
      });

      return {
        status: 'success',
        remainingBalance: remainingBalance?.toString(),
        withdrawnAmount: amount.toString(),
        toAddress: n.toAddress,
        message: `Withdrew ${amount} credits. Remaining balance: ${remainingBalance}`
      };
    }
    case 'identityUpdate': {
      // Fetch identity
      const identity = await c.identities.fetch(n.identityId);
      if (!identity) {
        throw new Error(`Identity not found: ${n.identityId}`);
      }

      // Create signer and add private key
      const signer = new IdentitySigner();
      signer.addKeyFromWif(n.privateKeyWif);

      // Parse disable key IDs as numbers
      const disablePublicKeys = n.disablePublicKeyIds
        ? (Array.isArray(n.disablePublicKeyIds) ? n.disablePublicKeyIds : [n.disablePublicKeyIds]).map(Number)
        : undefined;

      await c.identities.update({
        identity,
        addPublicKeys: n.addPublicKeys || undefined,
        disablePublicKeys,
        signer,
      });

      return {
        status: 'success',
        identityId: n.identityId,
        message: 'Identity updated successfully'
      };
    }

    // Data contracts
    case 'getDataContract':
      return useProof ? c.contracts.fetchWithProof(n.id) : c.contracts.fetch(n.id);
    case 'getDataContractHistory':
      return useProof
        ? c.contracts.getHistoryWithProof({ dataContractId: n.dataContractId || n.id, limit: n.limit ?? undefined, startAtMs: n.startAtMs ?? undefined })
        : c.contracts.getHistory({ dataContractId: n.dataContractId || n.id, limit: n.limit ?? undefined, startAtMs: n.startAtMs ?? undefined });
    case 'getDataContracts':
      return useProof ? c.contracts.getManyWithProof(n.ids) : c.contracts.getMany(n.ids);
    case 'dataContractCreate': {
      const { identity, identityKey, signer } = await prepareTransition(
        c, n.ownerId, n.privateKeyWif, n.keyId, CONTRACT_SECURITY_LEVELS
      );

      // Get next identity nonce for contract creation
      const identityNonce = await c.identities.nonce(n.ownerId);
      const nextNonce = (identityNonce || 0n) + 1n;

      // Parse document schemas
      let documentSchemas;
      if (!n.documentSchemas) {
        throw new Error('Document Schemas JSON is required');
      }
      try {
        documentSchemas = typeof n.documentSchemas === 'string'
          ? JSON.parse(n.documentSchemas)
          : n.documentSchemas;
      } catch (e) {
        throw new Error(`Invalid JSON in Document Schemas field: ${e.message}`);
      }

      // Parse optional tokens
      let tokens = null;
      if (n.tokens && n.tokens !== '{}') {
        try {
          const parsedTokens = typeof n.tokens === 'string' ? JSON.parse(n.tokens) : n.tokens;
          if (Object.keys(parsedTokens).length > 0) {
            tokens = parsedTokens;
          }
        } catch (e) {
          throw new Error(`Invalid JSON in Tokens field: ${e.message}`);
        }
      }

      // Create DataContract using options object
      const dataContract = new DataContract({
        ownerId: n.ownerId,
        identityNonce: nextNonce,
        schemas: documentSchemas,
        definitions: undefined,
        tokens: tokens || undefined,
        fullValidation: false,
      });

      // Apply config settings if any are specified
      // The DataContract constructor uses default config, so we need to set it explicitly
      const hasConfigSettings = n.canBeDeleted || n.readonly || n.keepsHistory ||
        n.documentsKeepHistoryContractDefault || n.documentsMutableContractDefault === false ||
        n.documentsCanBeDeletedContractDefault === false;

      if (hasConfigSettings) {
        const config = {
          canBeDeleted: n.canBeDeleted || false,
          readonly: n.readonly || false,
          keepsHistory: n.keepsHistory || false,
          documentsKeepHistoryContractDefault: n.documentsKeepHistoryContractDefault || false,
          documentsMutableContractDefault: n.documentsMutableContractDefault !== false, // Default true
          documentsCanBeDeletedContractDefault: n.documentsCanBeDeletedContractDefault !== false, // Default true
        };
        dataContract.setConfig(config); // SDK method to set contract config
      }

      const publishedContract = await c.contracts.publish({ dataContract, identityKey, signer });

      // Return in expected format for UI/tests
      return {
        status: 'success',
        contractId: publishedContract.id?.toString() || dataContract.id?.toString(),
        ownerId: publishedContract.ownerId?.toString() || n.ownerId,
        version: publishedContract.version || 1,
        documentTypes: Object.keys(documentSchemas),
        message: `Data contract created successfully with ID: ${publishedContract.id?.toString()}`
      };
    }
    case 'dataContractUpdate': {
      // First fetch the existing contract to get its current state
      const contractId = n.dataContractId || n.contractId;
      if (!contractId) {
        throw new Error('Data Contract ID is required');
      }
      const existingContract = await c.contracts.fetch(contractId);
      if (!existingContract) {
        throw new Error(`Data contract not found: ${contractId}`);
      }

      const { identityKey, signer } = await prepareTransition(
        c, n.ownerId, n.privateKeyWif, n.keyId, CONTRACT_SECURITY_LEVELS
      );

      // Modify the existing contract directly
      // Increment version
      existingContract.version = (existingContract.version || 1) + 1;

      // Update document schemas if provided
      if (n.newDocumentSchemas) {
        let newSchemas;
        try {
          newSchemas = typeof n.newDocumentSchemas === 'string'
            ? JSON.parse(n.newDocumentSchemas)
            : n.newDocumentSchemas;
        } catch (e) {
          throw new Error(`Invalid JSON in New Document Schemas field: ${e.message}`);
        }
        // Get existing schemas and merge
        const existingSchemas = existingContract.schemas || {};
        const mergedSchemas = { ...existingSchemas, ...newSchemas };
        existingContract.setSchemas(mergedSchemas, undefined, false);
      }

      await c.contracts.update({ dataContract: existingContract, identityKey, signer });

      // Return in expected format for UI/tests
      return {
        status: 'success',
        contractId: contractId,
        version: existingContract.version,
        message: `Data contract updated successfully. New version: ${existingContract.version}`
      };
    }

    // Documents
    case 'getDocuments': {
      const payload = {
        dataContractId: n.dataContractId || n.contractId,
        documentTypeName: n.documentTypeName || n.documentType,
        where: parseJson(n.where, 'Where'),
        orderBy: parseJson(n.orderBy, 'Order By'),
        limit: n.limit ?? undefined,
        startAfter: n.startAfter ?? undefined,
        startAt: n.startAt ?? undefined,
      };
      return useProof ? c.documents.queryWithProof(payload) : c.documents.query(payload);
    }
    case 'getDocument':
      return useProof
        ? c.documents.getWithProof(n.dataContractId || n.contractId, n.documentTypeName || n.documentType, n.documentId)
        : c.documents.get(n.dataContractId || n.contractId, n.documentTypeName || n.documentType, n.documentId);
    case 'documentCreate': {
      const dynamic = (typeof n.documentFields === 'object' && n.documentFields !== null) ? n.documentFields : {};
      const data = n.data ?? dynamic.data;
      if (!data) {
        throw new Error('Document data is required. Click "Fetch Schema" and fill the document fields.');
      }

      const { identityKey, signer } = await prepareTransition(
        c, n.ownerId, n.privateKeyWif, n.keyId
      );

      const contractId = n.dataContractId || n.contractId;
      const documentTypeName = n.documentTypeName || n.documentType;

      // Create the Document object (constructor auto-generates entropy and ID)
      const document = new Document({
        dataContractId: contractId,
        ownerId: n.ownerId,
        documentTypeName,
        properties: data,
      });

      await c.documents.create({ document, identityKey, signer });

      return {
        status: 'success',
        documentId: document.id?.toString(),
        ownerId: n.ownerId,
        documentType: documentTypeName,
        message: `Document created successfully with ID: ${document.id?.toString()}`
      };
    }
    case 'documentReplace': {
      const dynamic = (typeof n.documentFields === 'object' && n.documentFields !== null) ? n.documentFields : {};
      const data = n.data ?? dynamic.data;
      if (!data) {
        throw new Error('Document data is required. Load the document and modify the fields before replacing.');
      }
      const revision = n.revision ?? dynamic.revision;
      if (revision == null) {
        throw new Error('Document revision is missing. Click "Load Document" before replacing.');
      }

      const { identityKey, signer } = await prepareTransition(
        c, n.ownerId, n.privateKeyWif, n.keyId
      );

      const contractId = n.dataContractId || n.contractId;
      const documentTypeName = n.documentTypeName || n.documentType;

      // Create the Document object with incremented revision
      const document = new Document({
        dataContractId: contractId,
        ownerId: n.ownerId,
        documentTypeName,
        properties: data,
        revision: Number(BigInt(revision) + 1n),
        id: n.documentId,
      });

      await c.documents.replace({ document, identityKey, signer });

      return {
        status: 'success',
        documentId: n.documentId,
        newRevision: (BigInt(revision) + 1n).toString(),
        message: `Document replaced successfully. New revision: ${BigInt(revision) + 1n}`
      };
    }
    case 'documentDelete': {
      const { identityKey, signer } = await prepareTransition(
        c, n.ownerId, n.privateKeyWif, n.keyId
      );

      const contractId = n.dataContractId || n.contractId;
      const documentTypeName = n.documentTypeName || n.documentType;

      // For delete, we can pass document identifiers directly
      await c.documents.delete({
        document: {
          id: n.documentId,
          ownerId: n.ownerId,
          dataContractId: contractId,
          documentTypeName: documentTypeName
        },
        identityKey,
        signer
      });

      return {
        status: 'success',
        documentId: n.documentId,
        message: `Document deleted successfully`
      };
    }
    case 'documentTransfer': {
      const { identityKey, signer } = await prepareTransition(
        c, n.ownerId, n.privateKeyWif, n.keyId
      );

      // Refresh nonce to ensure we have the latest (prevents "tx already exists in cache" errors)
      await c.wasm.refreshIdentityNonce(Identifier.fromBase58(n.ownerId));

      const contractId = n.dataContractId || n.contractId;
      const documentTypeName = n.documentTypeName || n.documentType;

      // Fetch the actual document from platform (SDK requires Document object)
      const document = await c.documents.get(contractId, documentTypeName, n.documentId);
      if (!document) {
        throw new Error(`Document not found: ${n.documentId}`);
      }

      // Increment revision for update operation (platform expects current_revision + 1)
      document.revision = BigInt(document.revision) + 1n;

      await c.documents.transfer({
        document,
        recipientId: n.recipientId,
        identityKey,
        signer
      });

      return {
        status: 'success',
        documentId: n.documentId,
        recipientId: n.recipientId,
        message: `Document transferred to ${n.recipientId}`
      };
    }
    case 'documentPurchase': {
      const { identityKey, signer } = await prepareTransition(
        c, n.buyerId, n.privateKeyWif, n.keyId
      );

      // Refresh nonce to ensure we have the latest (prevents "tx already exists in cache" errors)
      await c.wasm.refreshIdentityNonce(Identifier.fromBase58(n.buyerId));

      const contractId = n.dataContractId || n.contractId;
      const documentTypeName = n.documentTypeName || n.documentType;

      // Fetch the actual document from platform (SDK requires Document object)
      const document = await c.documents.get(contractId, documentTypeName, n.documentId);
      if (!document) {
        throw new Error(`Document not found: ${n.documentId}`);
      }

      // Increment revision for update operation (platform expects current_revision + 1)
      document.revision = BigInt(document.revision) + 1n;

      await c.documents.purchase({
        document,
        buyerId: n.buyerId,
        price: BigInt(n.price),
        identityKey,
        signer
      });

      return {
        status: 'success',
        documentId: n.documentId,
        buyerId: n.buyerId,
        price: n.price,
        message: `Document purchased for ${n.price} credits`
      };
    }
    case 'documentSetPrice': {
      const { identityKey, signer } = await prepareTransition(
        c, n.ownerId, n.privateKeyWif, n.keyId
      );

      // Refresh nonce to ensure we have the latest (prevents "tx already exists in cache" errors)
      await c.wasm.refreshIdentityNonce(Identifier.fromBase58(n.ownerId));

      const contractId = n.dataContractId || n.contractId;
      const documentTypeName = n.documentTypeName || n.documentType;

      // Fetch the actual document from platform (SDK requires Document object)
      const document = await c.documents.get(contractId, documentTypeName, n.documentId);
      if (!document) {
        throw new Error(`Document not found: ${n.documentId}`);
      }

      // Increment revision for update operation (platform expects current_revision + 1)
      document.revision = BigInt(document.revision) + 1n;

      await c.documents.setPrice({
        document,
        price: BigInt(n.price),
        identityKey,
        signer
      });

      return {
        status: 'success',
        documentId: n.documentId,
        price: n.price,
        message: `Document price set to ${n.price} credits`
      };
    }

    // DPNS
    case 'getDpnsUsername':
      return useProof ? c.dpns.usernameWithProof(n.identityId) : c.dpns.username(n.identityId);
    case 'getDpnsUsernames':
      return useProof
        ? c.dpns.usernamesWithProof({ identityId: n.identityId, limit: n.limit ?? undefined })
        : c.dpns.usernames({ identityId: n.identityId, limit: n.limit ?? undefined });
    case 'getDpnsUsernameByName':
      return useProof ? c.dpns.getUsernameByNameWithProof(n.username) : c.dpns.getUsernameByName(n.username);
    case 'dpnsResolve':
      return c.dpns.resolveName(n.name);
    case 'dpnsCheckAvailability':
      return c.dpns.isNameAvailable(n.label);
    case 'dpnsConvertToHomographSafe':
      return c.dpns.convertToHomographSafe(n.name);
    case 'dpnsIsValidUsername':
      return c.dpns.isValidUsername(n.label);
    case 'dpnsIsContestedUsername':
      return c.dpns.isContestedUsername(n.label);
    case 'dpnsRegisterName': {
      if (!n.label) {
        throw new Error('Label is required for DPNS registration.');
      }
      if (!n.identityId) {
        throw new Error('Identity ID is required for DPNS registration.');
      }
      if (!n.privateKeyWif) {
        throw new Error('Private key WIF is required for DPNS registration.');
      }
      const publicKeyId = toNumber(n.publicKeyId);
      if (publicKeyId === null) {
        throw new Error('Identity public key ID must be provided for DPNS registration.');
      }
      return c.dpns.registerName({
        label: n.label,
        identityId: n.identityId,
        publicKeyId,
        privateKeyWif: n.privateKeyWif,
      });
    }

    // Epoch
    case 'getEpochsInfo':
      return useProof
        ? c.epoch.epochsInfoWithProof({ startEpoch: n.startEpoch ?? null, count: n.count ?? null, ascending: n.ascending ?? null })
        : c.epoch.epochsInfo({ startEpoch: n.startEpoch ?? null, count: n.count ?? null, ascending: n.ascending ?? null });
    case 'getCurrentEpoch':
      return useProof ? c.epoch.currentWithProof() : c.epoch.current();
    case 'getFinalizedEpochInfos':
      return useProof
        ? c.epoch.finalizedInfosWithProof({ startEpoch: n.startEpoch ?? null, count: n.count ?? null, ascending: n.ascending ?? null })
        : c.epoch.finalizedInfos({ startEpoch: n.startEpoch ?? null, count: n.count ?? null, ascending: n.ascending ?? null });
    case 'getEvonodesProposedEpochBlocksByIds':
      return useProof ? c.epoch.evonodesProposedBlocksByIdsWithProof(n.epoch, toStringArray(n.ids)) : c.epoch.evonodesProposedBlocksByIds(n.epoch, toStringArray(n.ids));
    case 'getEvonodesProposedEpochBlocksByRange':
      return useProof
        ? c.epoch.evonodesProposedBlocksByRangeWithProof({
          epoch: n.epoch,
          limit: n.limit ?? undefined,
          startAfter: n.startAfter ?? undefined,
          orderAscending: n.orderAscending ?? undefined,
        })
        : c.epoch.evonodesProposedBlocksByRange({
          epoch: n.epoch,
          limit: n.limit ?? undefined,
          startAfter: n.startAfter ?? undefined,
          orderAscending: n.orderAscending ?? undefined,
        });

    // Protocol
    case 'getProtocolVersionUpgradeState':
      return useProof ? c.protocol.versionUpgradeStateWithProof() : c.protocol.versionUpgradeState();
    case 'getProtocolVersionUpgradeVoteStatus':
      return useProof
        ? c.protocol.versionUpgradeVoteStatusWithProof(n.startProTxHash, n.count ?? undefined)
        : c.protocol.versionUpgradeVoteStatus(n.startProTxHash, n.count ?? undefined);

    // Tokens
    case 'getTokenStatuses':
      return useProof ? c.tokens.statusesWithProof(toStringArray(n.tokenIds)) : c.tokens.statuses(toStringArray(n.tokenIds));
    case 'getTokenDirectPurchasePrices':
      return useProof ? c.tokens.directPurchasePricesWithProof(toStringArray(n.tokenIds)) : c.tokens.directPurchasePrices(toStringArray(n.tokenIds));
    case 'getTokenContractInfo': {
      const contractId = n.dataContractId || n.contractId;
      return useProof ? c.tokens.contractInfoWithProof(contractId) : c.tokens.contractInfo(contractId);
    }
    case 'getTokenPerpetualDistributionLastClaim':
      return useProof ? c.tokens.perpetualDistributionLastClaimWithProof(n.identityId, n.tokenId) : c.tokens.perpetualDistributionLastClaim(n.identityId, n.tokenId);
    case 'getTokenTotalSupply':
      return useProof ? c.tokens.totalSupplyWithProof(n.tokenId) : c.tokens.totalSupply(n.tokenId);
    case 'getTokenPriceByContract': {
      const contractId = n.dataContractId || n.contractId;
      const tokenPosition = toNumber(n.tokenPosition, 0);
      return c.tokens.priceByContract(contractId, tokenPosition);
    }
    case 'tokenMint': {
      const { identityKey, signer } = await prepareTransition(
        c, n.identityId, n.privateKeyWif, n.keyId
      );

      const result = await c.tokens.mint({
        dataContractId: n.contractId,
        tokenPosition: Number(n.tokenPosition),
        amount: BigInt(n.amount),
        identityId: n.identityId,
        recipientId: n.recipientId || undefined,
        publicNote: n.publicNote || undefined,
        identityKey,
        signer
      });

      return {
        status: 'success',
        balance: result.balance?.toString(),
        message: `Minted ${n.amount} tokens`
      };
    }
    case 'tokenBurn': {
      const { identityKey, signer } = await prepareTransition(
        c, n.identityId, n.privateKeyWif, n.keyId
      );

      const result = await c.tokens.burn({
        dataContractId: n.contractId,
        tokenPosition: Number(n.tokenPosition),
        amount: BigInt(n.amount),
        identityId: n.identityId,
        publicNote: n.publicNote || undefined,
        identityKey,
        signer
      });

      return {
        status: 'success',
        balance: result.balance?.toString(),
        message: `Burned ${n.amount} tokens`
      };
    }
    case 'tokenTransfer': {
      const senderId = n.senderId || n.identityId;
      const { identityKey, signer } = await prepareTransition(
        c, senderId, n.privateKeyWif, n.keyId
      );

      const result = await c.tokens.transfer({
        dataContractId: n.contractId,
        tokenPosition: Number(n.tokenPosition),
        amount: BigInt(n.amount),
        senderId: senderId,
        recipientId: n.recipientId,
        publicNote: n.publicNote || undefined,
        identityKey,
        signer
      });

      return {
        status: 'success',
        senderBalance: result.senderBalance?.toString(),
        recipientBalance: result.recipientBalance?.toString(),
        message: `Transferred ${n.amount} tokens to ${n.recipientId}`
      };
    }
    case 'tokenFreeze': {
      const authorityIdentityId = n.identityId || n.freezerId;
      const { identityKey, signer } = await prepareTransition(
        c, authorityIdentityId, n.privateKeyWif, n.keyId
      );

      const result = await c.tokens.freeze({
        dataContractId: n.contractId,
        tokenPosition: Number(n.tokenPosition),
        frozenIdentityId: n.identityToFreeze,
        authorityId: authorityIdentityId,
        publicNote: n.publicNote || undefined,
        identityKey,
        signer
      });

      return {
        status: 'success',
        message: `Frozen tokens for identity ${n.identityToFreeze}`
      };
    }
    case 'tokenUnfreeze': {
      const authorityIdentityId = n.identityId || n.unfreezerId;
      const { identityKey, signer } = await prepareTransition(
        c, authorityIdentityId, n.privateKeyWif, n.keyId
      );

      const result = await c.tokens.unfreeze({
        dataContractId: n.contractId,
        tokenPosition: Number(n.tokenPosition),
        frozenIdentityId: n.identityToUnfreeze,
        authorityId: authorityIdentityId,
        publicNote: n.publicNote || undefined,
        identityKey,
        signer
      });

      return {
        status: 'success',
        message: `Unfrozen tokens for identity ${n.identityToUnfreeze}`
      };
    }
    case 'tokenDestroyFrozen': {
      const authorityIdentityId = n.identityId || n.destroyerId;
      const { identityKey, signer } = await prepareTransition(
        c, authorityIdentityId, n.privateKeyWif, n.keyId
      );

      const result = await c.tokens.destroyFrozen({
        dataContractId: n.contractId,
        tokenPosition: Number(n.tokenPosition),
        frozenIdentityId: n.frozenIdentityId,
        authorityId: authorityIdentityId,
        publicNote: n.publicNote || undefined,
        identityKey,
        signer
      });

      return {
        status: 'success',
        message: `Destroyed frozen tokens for identity ${n.frozenIdentityId}`
      };
    }
    case 'tokenSetPriceForDirectPurchase': {
      const { identityKey, signer } = await prepareTransition(
        c, n.identityId, n.privateKeyWif, n.keyId
      );

      const result = await c.tokens.setPrice({
        dataContractId: n.contractId,
        tokenPosition: Number(n.tokenPosition),
        authorityId: n.identityId,
        price: n.priceData ? BigInt(n.priceData) : undefined,
        publicNote: n.publicNote || undefined,
        identityKey,
        signer
      });

      return {
        status: 'success',
        message: `Token price set successfully`
      };
    }
    case 'tokenDirectPurchase': {
      const { identityKey, signer } = await prepareTransition(
        c, n.identityId, n.privateKeyWif, n.keyId
      );

      const result = await c.tokens.directPurchase({
        dataContractId: n.contractId,
        tokenPosition: Number(n.tokenPosition),
        amount: BigInt(n.amount),
        buyerId: n.identityId,
        maxTotalCost: BigInt(n.totalAgreedPrice),
        identityKey,
        signer
      });

      return {
        status: 'success',
        balance: result.balance?.toString(),
        creditsPaid: result.creditsPaid?.toString(),
        message: `Purchased ${n.amount} tokens`
      };
    }
    case 'tokenClaim': {
      const { identityKey, signer } = await prepareTransition(
        c, n.identityId, n.privateKeyWif, n.keyId
      );

      const result = await c.tokens.claim({
        dataContractId: n.contractId,
        tokenPosition: Number(n.tokenPosition),
        distributionType: n.distributionType,
        identityId: n.identityId,
        publicNote: n.publicNote || undefined,
        identityKey,
        signer
      });

      return {
        status: 'success',
        claimedAmount: result.claimedAmount?.toString(),
        message: `Claimed tokens from distribution`
      };
    }
    case 'tokenEmergencyAction': {
      const { identityKey, signer } = await prepareTransition(
        c, n.identityId, n.privateKeyWif, n.keyId
      );

      const result = await c.tokens.emergencyAction({
        dataContractId: n.contractId,
        tokenPosition: Number(n.tokenPosition),
        action: n.actionType,
        authorityId: n.identityId,
        publicNote: n.publicNote || undefined,
        identityKey,
        signer
      });

      return {
        status: 'success',
        message: `Emergency action ${n.actionType} performed`
      };
    }

    // Group queries
    case 'getGroupInfo': {
      const contractId = n.dataContractId || n.contractId;
      const position = toNumber(n.groupContractPosition, 0);
      return useProof ? c.group.infoWithProof(contractId, position) : c.group.info(contractId, position);
    }
    case 'getGroupInfos': {
      const contractId = n.dataContractId || n.contractId;
      return useProof
        ? c.group.infosWithProof({ dataContractId: contractId, startAt: n.startAtInfo ?? undefined, limit: n.count ?? undefined })
        : c.group.infos({ dataContractId: contractId, startAt: n.startAtInfo ?? undefined, limit: n.count ?? undefined });
    }
    case 'getGroupMembers': {
      const contractId = n.dataContractId || n.contractId;
      const position = toNumber(n.groupContractPosition, 0);
      const memberIds = toStringArray(n.memberIds);
      const opts = {
        dataContractId: contractId,
        groupContractPosition: position,
        memberIds: memberIds.length ? memberIds : undefined,
        startAtMemberId: n.startAt ?? undefined,
        limit: n.limit ?? undefined,
      };
      return useProof ? c.group.membersWithProof(opts) : c.group.members(opts);
    }
    case 'getGroupActions': {
      const contractId = n.dataContractId || n.contractId;
      const position = toNumber(n.groupContractPosition, 0);
      const opts = { dataContractId: contractId, groupContractPosition: position, status: n.status, startAt: n.startAtInfo ?? undefined, limit: n.count ?? undefined };
      return useProof ? c.group.actionsWithProof(opts) : c.group.actions(opts);
    }
    case 'getGroupActionSigners': {
      const contractId = n.dataContractId || n.contractId;
      const position = toNumber(n.groupContractPosition, 0);
      const payload = { dataContractId: contractId, groupContractPosition: position, status: n.status, actionId: n.actionId };
      return useProof ? c.group.actionSignersWithProof(payload) : c.group.actionSigners(payload);
    }
    case 'getIdentityGroups': {
      const memberDataContracts = toStringArray(n.memberDataContracts);
      const ownerDataContracts = toStringArray(n.ownerDataContracts);
      const moderatorDataContracts = toStringArray(n.moderatorDataContracts);
      const opts = {
        identityId: n.identityId,
        memberDataContracts: memberDataContracts.length ? memberDataContracts : undefined,
        ownerDataContracts: ownerDataContracts.length ? ownerDataContracts : undefined,
        moderatorDataContracts: moderatorDataContracts.length ? moderatorDataContracts : undefined,
      };
      return useProof ? c.group.identityGroupsWithProof(opts) : c.group.identityGroups(opts);
    }
    case 'getGroupsDataContracts': {
      const contractIds = toStringArray(n.dataContractIds || n.contractIds);
      return useProof ? c.group.groupsDataContractsWithProof(contractIds) : c.group.groupsDataContracts(contractIds);
    }

    // Contested resources & voting
    case 'getContestedResources': {
      const contractId = n.dataContractId || n.contractId;
      const payload = {
        dataContractId: contractId,
        documentTypeName: n.documentTypeName,
        indexName: n.indexName,
        startAtValue: n.startAtValue ?? undefined,
        limit: n.limit ?? undefined,
        orderAscending: n.orderAscending ?? undefined,
      };
      return useProof ? c.group.contestedResourcesWithProof(payload) : c.group.contestedResources(payload);
    }
    case 'getContestedResourceVotersForIdentity': {
      const contractId = n.dataContractId || n.contractId;
      const payload = {
        dataContractId: contractId,
        documentTypeName: n.documentTypeName,
        indexName: n.indexName,
        indexValues: toStringArray(n.indexValues),
        contestantId: n.contestantId,
        orderAscending: n.orderAscending ?? undefined,
      };
      if (useProof) {
        return c.group.contestedResourceVotersForIdentityWithProof({
          ...payload,
          startAtVoterId: n.startAtVoterId ?? n.startAtIdentifierInfo ?? undefined,
          startAtIncluded: n.startAtIncluded ?? undefined,
          limit: n.limit ?? n.count ?? undefined,
        });
      }
      return c.group.contestedResourceVotersForIdentity({
        ...payload,
        startAtVoterId: n.startAtVoterId ?? n.startAtVoterInfo ?? undefined,
        startAtIncluded: n.startAtIncluded ?? undefined,
        limit: n.limit ?? undefined,
      });
    }
    case 'getContestedResourceVoteState': {
      const contractId = n.dataContractId || n.contractId;
      const payload = {
        dataContractId: contractId,
        documentTypeName: n.documentTypeName,
        indexName: n.indexName,
        indexValues: toStringArray(n.indexValues),
        resultType: n.resultType,
        includeLockedAndAbstaining: n.includeLockedAndAbstaining ?? n.allowIncludeLockedAndAbstainingVoteTally ?? undefined,
        startAtContenderId: n.startAtContenderId ?? n.startAtIdentifierInfo ?? undefined,
        startAtIncluded: n.startAtIncluded ?? undefined,
        limit: n.count ?? n.limit ?? undefined,
        orderAscending: n.orderAscending ?? undefined,
      };
      return useProof ? c.voting.contestedResourceVoteStateWithProof(payload) : c.voting.contestedResourceVoteState(payload);
    }
    case 'getContestedResourceIdentityVotes': {
      const query = {
        identityId: n.identityId,
        limit: n.limit ?? undefined,
        startAtVoteId: n.startAtVoteId ?? n.startAtVotePollIdInfo ?? undefined,
        startAtIncluded: n.startAtIncluded ?? undefined,
        orderAscending: n.orderAscending ?? undefined,
      };
      return useProof ? c.voting.contestedResourceIdentityVotesWithProof(query) : c.voting.contestedResourceIdentityVotes(query);
    }
    case 'getVotePollsByEndDate': {
      const query = {
        startTimeMs: n.startTimeMs ?? undefined,
        startTimeIncluded: n.startTimeMs ? (n.startTimeIncluded ?? undefined) : undefined,
        endTimeMs: n.endTimeMs ?? undefined,
        endTimeIncluded: n.endTimeMs ? (n.endTimeIncluded ?? undefined) : undefined,
        limit: n.limit ?? undefined,
        offset: n.offset ?? undefined,
        orderAscending: n.orderAscending ?? undefined,
      };
      return useProof ? c.voting.votePollsByEndDateWithProof(query) : c.voting.votePollsByEndDate(query);
    }

    case 'masternodeVote': {
      const contested = (typeof n.contestedResourceDropdown === 'object' && n.contestedResourceDropdown !== null)
        ? n.contestedResourceDropdown
        : {};
      const contractId = n.contractId || contested.contractId;
      const documentTypeName = n.documentTypeName || contested.documentTypeName;
      const indexName = n.indexName || contested.indexName;
      let indexValues = Array.isArray(n.indexValues) ? n.indexValues : contested.indexValues;
      if (!Array.isArray(indexValues) || !indexValues.length) {
        throw new Error('Index values are required. Use "Get Contested Resources" to load them.');
      }
      let voteChoice = n.voteChoice;
      if (!voteChoice) {
        throw new Error('Vote choice is required.');
      }
      if (voteChoice === 'towardsIdentity') {
        const targetIdentity = n.targetIdentity || '';
        if (!targetIdentity) {
          throw new Error('Target identity ID is required when voting towards an identity.');
        }
        voteChoice = `towardsIdentity:${targetIdentity}`;
      }
      const masternodeProTxHash = n.masternodeProTxHash || contested.masternodeProTxHash;
      if (!masternodeProTxHash) {
        throw new Error('Masternode ProTxHash is required. Enter it in the Identity ID field.');
      }
      if (!contractId || !documentTypeName || !indexName) {
        throw new Error('Contested resource details are incomplete. Fetch contested resources and select one.');
      }
      return c.voting.masternodeVote({
        masternodeProTxHash,
        contractId,
        documentTypeName,
        indexName,
        indexValues,
        voteChoice,
        votingKeyWif: n.votingKeyWif,
      });
    }

    // System
    case 'getStatus':
      return c.system.status();
    case 'getCurrentQuorumsInfo':
      return c.system.currentQuorumsInfo();
    case 'getTotalCreditsInPlatform':
      return useProof ? c.system.totalCreditsInPlatformWithProof() : c.system.totalCreditsInPlatform();
    case 'getPrefundedSpecializedBalance':
      return useProof ? c.system.prefundedSpecializedBalanceWithProof(n.identityId) : c.system.prefundedSpecializedBalance(n.identityId);
    case 'getPathElements': {
      const path = toStringArray(n.path);
      const keys = toStringArray(n.keys);
      return useProof ? c.system.pathElementsWithProof(path, keys) : c.system.pathElements(path, keys);
    }
    case 'waitForStateTransitionResult':
      return c.stateTransitions.waitForStateTransitionResult(n.stateTransitionHash);

    // Platform Address queries
    case 'getPlatformAddress':
      return useProof ? c.addresses.getWithProof(n.address) : c.addresses.get(n.address);
    case 'getPlatformAddresses': {
      const addresses = toStringArray(n.addresses);
      return useProof ? c.addresses.getManyWithProof(addresses) : c.addresses.getMany(addresses);
    }

    // Platform Address transitions
    case 'addressTransfer':
      // Note: This is a simplified implementation. Full implementation requires PlatformAddressSigner
      throw new Error('Address Transfer requires complex signer setup. Please use the SDK directly.');
    case 'addressTopUpIdentity':
      // Note: This is a simplified implementation. Full implementation requires PlatformAddressSigner
      throw new Error('Address Top Up Identity requires complex signer setup. Please use the SDK directly.');
    case 'addressWithdraw':
      // Note: This is a simplified implementation. Full implementation requires PlatformAddressSigner
      throw new Error('Address Withdraw requires complex signer setup. Please use the SDK directly.');
    case 'addressTransferFromIdentity':
      // Note: This is a simplified implementation. Full implementation requires IdentitySigner
      throw new Error('Address Transfer From Identity requires complex signer setup. Please use the SDK directly.');
    case 'addressFundFromAssetLock':
      // Note: This is a simplified implementation. Full implementation requires PlatformAddressSigner
      throw new Error('Address Fund From Asset Lock requires complex signer setup. Please use the SDK directly.');
    case 'addressCreateIdentity':
      // Note: This is a simplified implementation. Full implementation requires multiple signers
      throw new Error('Address Create Identity requires complex signer setup. Please use the SDK directly.');

    default:
      throw new Error(`Operation ${itemKey} is not supported in the demo UI.`);
  }
}
