import * as wasm from '../wasm.js';
import type { EvoSDK } from '../sdk.js';
export declare class IdentitiesFacade {
    private sdk;
    constructor(sdk: EvoSDK);
    fetch(identityId: string): Promise<wasm.IdentityWasm>;
    fetchWithProof(identityId: string): Promise<any>;
    fetchUnproved(identityId: string): Promise<wasm.IdentityWasm>;
    getKeys(args: {
        identityId: string;
        keyRequestType: 'all' | 'specific' | 'search';
        specificKeyIds?: number[];
        searchPurposeMap?: unknown;
        limit?: number;
        offset?: number;
    }): Promise<any>;
    getKeysWithProof(args: {
        identityId: string;
        keyRequestType: 'all' | 'specific' | 'search';
        specificKeyIds?: number[];
        limit?: number;
        offset?: number;
    }): Promise<any>;
    nonce(identityId: string): Promise<any>;
    nonceWithProof(identityId: string): Promise<any>;
    contractNonce(identityId: string, contractId: string): Promise<any>;
    contractNonceWithProof(identityId: string, contractId: string): Promise<any>;
    balance(identityId: string): Promise<any>;
    balanceWithProof(identityId: string): Promise<any>;
    balances(identityIds: string[]): Promise<any>;
    balancesWithProof(identityIds: string[]): Promise<any>;
    balanceAndRevision(identityId: string): Promise<any>;
    balanceAndRevisionWithProof(identityId: string): Promise<any>;
    byPublicKeyHash(publicKeyHash: string): Promise<wasm.IdentityWasm>;
    byPublicKeyHashWithProof(publicKeyHash: string): Promise<any>;
    byNonUniquePublicKeyHash(publicKeyHash: string, opts?: {
        startAfter?: string;
    }): Promise<any>;
    byNonUniquePublicKeyHashWithProof(publicKeyHash: string, opts?: {
        startAfter?: string;
    }): Promise<any>;
    contractKeys(args: {
        identityIds: string[];
        contractId: string;
        purposes?: number[];
    }): Promise<any>;
    contractKeysWithProof(args: {
        identityIds: string[];
        contractId: string;
        purposes?: number[];
    }): Promise<any>;
    tokenBalances(identityId: string, tokenIds: string[]): Promise<any>;
    tokenBalancesWithProof(identityId: string, tokenIds: string[]): Promise<any>;
    create(args: {
        assetLockProof: unknown;
        assetLockPrivateKeyWif: string;
        publicKeys: unknown[];
    }): Promise<any>;
    topUp(args: {
        identityId: string;
        assetLockProof: unknown;
        assetLockPrivateKeyWif: string;
    }): Promise<any>;
    creditTransfer(args: {
        senderId: string;
        recipientId: string;
        amount: number | bigint | string;
        privateKeyWif: string;
        keyId?: number;
    }): Promise<any>;
    creditWithdrawal(args: {
        identityId: string;
        toAddress: string;
        amount: number | bigint | string;
        coreFeePerByte?: number;
        privateKeyWif: string;
        keyId?: number;
    }): Promise<any>;
    update(args: {
        identityId: string;
        addPublicKeys?: unknown[];
        disablePublicKeyIds?: number[];
        privateKeyWif: string;
    }): Promise<any>;
}
