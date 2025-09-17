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
