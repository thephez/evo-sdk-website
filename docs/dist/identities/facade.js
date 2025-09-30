import { asJsonString } from '../util.js';
export class IdentitiesFacade {
    constructor(sdk) {
        this.sdk = sdk;
    }
    async fetch(identityId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentity(identityId);
    }
    async fetchWithProof(identityId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityWithProofInfo(identityId);
    }
    async fetchUnproved(identityId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityUnproved(identityId);
    }
    async getKeys(args) {
        const { identityId, keyRequestType, specificKeyIds, searchPurposeMap, limit, offset } = args;
        const mapJson = asJsonString(searchPurposeMap);
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityKeys(identityId, keyRequestType, specificKeyIds ? Uint32Array.from(specificKeyIds) : null, mapJson ?? null, limit ?? null, offset ?? null);
    }
    async getKeysWithProof(args) {
        const { identityId, keyRequestType, specificKeyIds, limit, offset } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityKeysWithProofInfo(identityId, keyRequestType, specificKeyIds ? Uint32Array.from(specificKeyIds) : null, limit ?? null, offset ?? null);
    }
    async nonce(identityId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityNonce(identityId);
    }
    async nonceWithProof(identityId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityNonceWithProofInfo(identityId);
    }
    async contractNonce(identityId, contractId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityContractNonce(identityId, contractId);
    }
    async contractNonceWithProof(identityId, contractId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityContractNonceWithProofInfo(identityId, contractId);
    }
    async balance(identityId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityBalance(identityId);
    }
    async balanceWithProof(identityId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityBalanceWithProofInfo(identityId);
    }
    async balances(identityIds) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentitiesBalances(identityIds);
    }
    async balancesWithProof(identityIds) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentitiesBalancesWithProofInfo(identityIds);
    }
    async balanceAndRevision(identityId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityBalanceAndRevision(identityId);
    }
    async balanceAndRevisionWithProof(identityId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityBalanceAndRevisionWithProofInfo(identityId);
    }
    async byPublicKeyHash(publicKeyHash) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityByPublicKeyHash(publicKeyHash);
    }
    async byPublicKeyHashWithProof(publicKeyHash) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityByPublicKeyHashWithProofInfo(publicKeyHash);
    }
    async byNonUniquePublicKeyHash(publicKeyHash, opts = {}) {
        const { startAfter } = opts;
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityByNonUniquePublicKeyHash(publicKeyHash, startAfter ?? null);
    }
    async byNonUniquePublicKeyHashWithProof(publicKeyHash, opts = {}) {
        const { startAfter } = opts;
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityByNonUniquePublicKeyHashWithProofInfo(publicKeyHash, startAfter ?? null);
    }
    async contractKeys(args) {
        const { identityIds, contractId, purposes } = args;
        const purposesArray = purposes && purposes.length > 0 ? Uint32Array.from(purposes) : null;
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentitiesContractKeys(identityIds, contractId, purposesArray);
    }
    async contractKeysWithProof(args) {
        const { identityIds, contractId, purposes } = args;
        const purposesArray = purposes && purposes.length > 0 ? Uint32Array.from(purposes) : null;
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentitiesContractKeysWithProofInfo(identityIds, contractId, purposesArray);
    }
    async tokenBalances(identityId, tokenIds) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityTokenBalances(identityId, tokenIds);
    }
    async tokenBalancesWithProof(identityId, tokenIds) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityTokenBalancesWithProofInfo(identityId, tokenIds);
    }
    async create(args) {
        const { assetLockProof, assetLockPrivateKeyWif, publicKeys } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.identityCreate(asJsonString(assetLockProof), assetLockPrivateKeyWif, asJsonString(publicKeys));
    }
    async topUp(args) {
        const { identityId, assetLockProof, assetLockPrivateKeyWif } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.identityTopUp(identityId, asJsonString(assetLockProof), assetLockPrivateKeyWif);
    }
    async creditTransfer(args) {
        const { senderId, recipientId, amount, privateKeyWif, keyId } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.identityCreditTransfer(senderId, recipientId, BigInt(amount), privateKeyWif, keyId ?? null);
    }
    async creditWithdrawal(args) {
        const { identityId, toAddress, amount, coreFeePerByte = 1, privateKeyWif, keyId } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.identityCreditWithdrawal(identityId, toAddress, BigInt(amount), coreFeePerByte ?? null, privateKeyWif, keyId ?? null);
    }
    async update(args) {
        const { identityId, addPublicKeys, disablePublicKeyIds, privateKeyWif } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.identityUpdate(identityId, addPublicKeys ? asJsonString(addPublicKeys) : null, disablePublicKeyIds ? Uint32Array.from(disablePublicKeyIds) : null, privateKeyWif);
    }
}
