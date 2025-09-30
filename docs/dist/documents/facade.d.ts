import type { EvoSDK } from '../sdk.js';
export declare class DocumentsFacade {
    private sdk;
    constructor(sdk: EvoSDK);
    query(params: {
        contractId: string;
        type: string;
        where?: unknown;
        orderBy?: unknown;
        limit?: number;
        startAfter?: string;
        startAt?: string;
    }): Promise<any>;
    queryWithProof(params: {
        contractId: string;
        type: string;
        where?: unknown;
        orderBy?: unknown;
        limit?: number;
        startAfter?: string;
        startAt?: string;
    }): Promise<any>;
    get(contractId: string, type: string, documentId: string): Promise<any>;
    getWithProof(contractId: string, type: string, documentId: string): Promise<any>;
    create(args: {
        contractId: string;
        type: string;
        ownerId: string;
        data: unknown;
        entropyHex: string;
        privateKeyWif: string;
    }): Promise<any>;
    replace(args: {
        contractId: string;
        type: string;
        documentId: string;
        ownerId: string;
        data: unknown;
        revision: number | bigint;
        privateKeyWif: string;
    }): Promise<any>;
    delete(args: {
        contractId: string;
        type: string;
        documentId: string;
        ownerId: string;
        privateKeyWif: string;
    }): Promise<any>;
    transfer(args: {
        contractId: string;
        type: string;
        documentId: string;
        ownerId: string;
        recipientId: string;
        privateKeyWif: string;
    }): Promise<any>;
    purchase(args: {
        contractId: string;
        type: string;
        documentId: string;
        buyerId: string;
        price: number | bigint | string;
        privateKeyWif: string;
    }): Promise<any>;
    setPrice(args: {
        contractId: string;
        type: string;
        documentId: string;
        ownerId: string;
        price: number | bigint | string;
        privateKeyWif: string;
    }): Promise<any>;
}
