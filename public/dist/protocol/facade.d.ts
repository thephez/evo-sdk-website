import type { EvoSDK } from '../sdk.js';
export declare class ProtocolFacade {
    private sdk;
    constructor(sdk: EvoSDK);
    versionUpgradeState(): Promise<any>;
    versionUpgradeStateWithProof(): Promise<any>;
    versionUpgradeVoteStatus(params: {
        startProTxHash: string;
        count: number;
    }): Promise<any>;
    versionUpgradeVoteStatusWithProof(params: {
        startProTxHash: string;
        count: number;
    }): Promise<any>;
}
