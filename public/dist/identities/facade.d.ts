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
