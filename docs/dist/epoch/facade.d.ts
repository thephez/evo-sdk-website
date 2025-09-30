import type { EvoSDK } from '../sdk.js';
export declare class EpochFacade {
    private sdk;
    constructor(sdk: EvoSDK);
    epochsInfo(params?: {
        startEpoch?: number;
        count?: number;
        ascending?: boolean;
    }): Promise<any>;
    epochsInfoWithProof(params?: {
        startEpoch?: number;
        count?: number;
        ascending?: boolean;
    }): Promise<any>;
    finalizedInfos(params?: {
        startEpoch?: number;
        count?: number;
        ascending?: boolean;
    }): Promise<any>;
    finalizedInfosWithProof(params?: {
        startEpoch?: number;
        count?: number;
        ascending?: boolean;
    }): Promise<any>;
    current(): Promise<any>;
    currentWithProof(): Promise<any>;
    evonodesProposedBlocksByIds(epoch: number, ids: string[]): Promise<any>;
    evonodesProposedBlocksByIdsWithProof(epoch: number, ids: string[]): Promise<any>;
    evonodesProposedBlocksByRange(epoch: number, opts?: {
        limit?: number;
        startAfter?: string;
        orderAscending?: boolean;
    }): Promise<any>;
    evonodesProposedBlocksByRangeWithProof(epoch: number, opts?: {
        limit?: number;
        startAfter?: string;
        orderAscending?: boolean;
    }): Promise<any>;
}
