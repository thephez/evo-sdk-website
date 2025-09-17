import * as wasm from '../wasm.js';
import type { EvoSDK } from '../sdk.js';
export declare class ContractsFacade {
    private sdk;
    constructor(sdk: EvoSDK);
    fetch(contractId: string): Promise<wasm.DataContractWasm>;
    fetchWithProof(contractId: string): Promise<any>;
    getHistory(args: {
        contractId: string;
        limit?: number;
        startAtMs?: number | bigint;
    }): Promise<any>;
    getHistoryWithProof(args: {
        contractId: string;
        limit?: number;
        startAtMs?: number | bigint;
    }): Promise<any>;
    getMany(contractIds: string[]): Promise<any>;
    getManyWithProof(contractIds: string[]): Promise<any>;
    create(args: {
        ownerId: string;
        definition: unknown;
        privateKeyWif: string;
        keyId?: number;
    }): Promise<any>;
    update(args: {
        contractId: string;
        ownerId: string;
        updates: unknown;
        privateKeyWif: string;
        keyId?: number;
    }): Promise<any>;
}
