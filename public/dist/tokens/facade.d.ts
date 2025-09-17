import type { EvoSDK } from '../sdk.js';
export declare class TokensFacade {
    private sdk;
    constructor(sdk: EvoSDK);
    priceByContract(contractId: string, tokenPosition: number): Promise<any>;
    totalSupply(tokenId: string): Promise<any>;
    totalSupplyWithProof(tokenId: string): Promise<any>;
    statuses(tokenIds: string[]): Promise<any>;
    statusesWithProof(tokenIds: string[]): Promise<any>;
    balances(identityIds: string[], tokenId: string): Promise<any>;
    balancesWithProof(identityIds: string[], tokenId: string): Promise<any>;
    identityTokenInfos(identityId: string, tokenIds: string[], opts?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    identitiesTokenInfos(identityIds: string[], tokenId: string): Promise<any>;
    identityTokenInfosWithProof(identityId: string, tokenIds: string[]): Promise<any>;
    identitiesTokenInfosWithProof(identityIds: string[], tokenId: string): Promise<any>;
    directPurchasePrices(tokenIds: string[]): Promise<any>;
    directPurchasePricesWithProof(tokenIds: string[]): Promise<any>;
    contractInfo(contractId: string): Promise<any>;
    contractInfoWithProof(contractId: string): Promise<any>;
    perpetualDistributionLastClaim(identityId: string, tokenId: string): Promise<any>;
    perpetualDistributionLastClaimWithProof(identityId: string, tokenId: string): Promise<any>;
    mint(args: {
        contractId: string;
        tokenPosition: number;
        amount: number | string | bigint;
        identityId: string;
        privateKeyWif: string;
        recipientId?: string;
        publicNote?: string;
    }): Promise<any>;
    burn(args: {
        contractId: string;
        tokenPosition: number;
        amount: number | string | bigint;
        identityId: string;
        privateKeyWif: string;
        publicNote?: string;
    }): Promise<any>;
    transfer(args: {
        contractId: string;
        tokenPosition: number;
        amount: number | string | bigint;
        senderId: string;
        recipientId: string;
        privateKeyWif: string;
        publicNote?: string;
    }): Promise<any>;
    freeze(args: {
        contractId: string;
        tokenPosition: number;
        identityToFreeze: string;
        freezerId: string;
        privateKeyWif: string;
        publicNote?: string;
    }): Promise<any>;
    unfreeze(args: {
        contractId: string;
        tokenPosition: number;
        identityToUnfreeze: string;
        unfreezerId: string;
        privateKeyWif: string;
        publicNote?: string;
    }): Promise<any>;
    destroyFrozen(args: {
        contractId: string;
        tokenPosition: number;
        identityId: string;
        destroyerId: string;
        privateKeyWif: string;
        publicNote?: string;
    }): Promise<any>;
    setPriceForDirectPurchase(args: {
        contractId: string;
        tokenPosition: number;
        identityId: string;
        priceType: string;
        priceData: unknown;
        privateKeyWif: string;
        publicNote?: string;
    }): Promise<any>;
    directPurchase(args: {
        contractId: string;
        tokenPosition: number;
        amount: number | string | bigint;
        identityId: string;
        totalAgreedPrice?: number | string | bigint | null;
        privateKeyWif: string;
    }): Promise<any>;
    claim(args: {
        contractId: string;
        tokenPosition: number;
        distributionType: string;
        identityId: string;
        privateKeyWif: string;
        publicNote?: string;
    }): Promise<any>;
    configUpdate(args: {
        contractId: string;
        tokenPosition: number;
        configItemType: string;
        configValue: unknown;
        identityId: string;
        privateKeyWif: string;
        publicNote?: string;
    }): Promise<any>;
}
