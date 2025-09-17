import { asJsonString } from '../util.js';
export class TokensFacade {
    constructor(sdk) {
        this.sdk = sdk;
    }
    // Queries
    async priceByContract(contractId, tokenPosition) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getTokenPriceByContract(contractId, tokenPosition);
    }
    async totalSupply(tokenId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getTokenTotalSupply(tokenId);
    }
    async totalSupplyWithProof(tokenId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getTokenTotalSupplyWithProofInfo(tokenId);
    }
    async statuses(tokenIds) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getTokenStatuses(tokenIds);
    }
    async statusesWithProof(tokenIds) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getTokenStatusesWithProofInfo(tokenIds);
    }
    async balances(identityIds, tokenId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentitiesTokenBalances(identityIds, tokenId);
    }
    async balancesWithProof(identityIds, tokenId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentitiesTokenBalancesWithProofInfo(identityIds, tokenId);
    }
    async identityTokenInfos(identityId, tokenIds, opts = {}) {
        const { limit, offset } = opts;
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityTokenInfos(identityId, tokenIds);
    }
    async identitiesTokenInfos(identityIds, tokenId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentitiesTokenInfos(identityIds, tokenId);
    }
    async identityTokenInfosWithProof(identityId, tokenIds) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentityTokenInfosWithProofInfo(identityId, tokenIds);
    }
    async identitiesTokenInfosWithProof(identityIds, tokenId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getIdentitiesTokenInfosWithProofInfo(identityIds, tokenId);
    }
    async directPurchasePrices(tokenIds) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getTokenDirectPurchasePrices(tokenIds);
    }
    async directPurchasePricesWithProof(tokenIds) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getTokenDirectPurchasePricesWithProofInfo(tokenIds);
    }
    async contractInfo(contractId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getTokenContractInfo(contractId);
    }
    async contractInfoWithProof(contractId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getTokenContractInfoWithProofInfo(contractId);
    }
    async perpetualDistributionLastClaim(identityId, tokenId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getTokenPerpetualDistributionLastClaim(identityId, tokenId);
    }
    async perpetualDistributionLastClaimWithProof(identityId, tokenId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getTokenPerpetualDistributionLastClaimWithProofInfo(identityId, tokenId);
    }
    // Transitions
    async mint(args) {
        const { contractId, tokenPosition, amount, identityId, privateKeyWif, recipientId, publicNote } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.tokenMint(contractId, tokenPosition, String(amount), identityId, privateKeyWif, recipientId ?? null, publicNote ?? null);
    }
    async burn(args) {
        const { contractId, tokenPosition, amount, identityId, privateKeyWif, publicNote } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.tokenBurn(contractId, tokenPosition, String(amount), identityId, privateKeyWif, publicNote ?? null);
    }
    async transfer(args) {
        const { contractId, tokenPosition, amount, senderId, recipientId, privateKeyWif, publicNote } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.tokenTransfer(contractId, tokenPosition, String(amount), senderId, recipientId, privateKeyWif, publicNote ?? null);
    }
    async freeze(args) {
        const { contractId, tokenPosition, identityToFreeze, freezerId, privateKeyWif, publicNote } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.tokenFreeze(contractId, tokenPosition, identityToFreeze, freezerId, privateKeyWif, publicNote ?? null);
    }
    async unfreeze(args) {
        const { contractId, tokenPosition, identityToUnfreeze, unfreezerId, privateKeyWif, publicNote } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.tokenUnfreeze(contractId, tokenPosition, identityToUnfreeze, unfreezerId, privateKeyWif, publicNote ?? null);
    }
    async destroyFrozen(args) {
        const { contractId, tokenPosition, identityId, destroyerId, privateKeyWif, publicNote } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.tokenDestroyFrozen(contractId, tokenPosition, identityId, destroyerId, privateKeyWif, publicNote ?? null);
    }
    async setPriceForDirectPurchase(args) {
        const { contractId, tokenPosition, identityId, priceType, priceData, privateKeyWif, publicNote } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.tokenSetPriceForDirectPurchase(contractId, tokenPosition, identityId, priceType, asJsonString(priceData), privateKeyWif, publicNote ?? null);
    }
    async directPurchase(args) {
        const { contractId, tokenPosition, amount, identityId, totalAgreedPrice, privateKeyWif } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.tokenDirectPurchase(contractId, tokenPosition, String(amount), identityId, totalAgreedPrice != null ? String(totalAgreedPrice) : null, privateKeyWif);
    }
    async claim(args) {
        const { contractId, tokenPosition, distributionType, identityId, privateKeyWif, publicNote } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.tokenClaim(contractId, tokenPosition, distributionType, identityId, privateKeyWif, publicNote ?? null);
    }
    async configUpdate(args) {
        const { contractId, tokenPosition, configItemType, configValue, identityId, privateKeyWif, publicNote } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.tokenConfigUpdate(contractId, tokenPosition, configItemType, asJsonString(configValue), identityId, privateKeyWif, publicNote ?? null);
    }
}
