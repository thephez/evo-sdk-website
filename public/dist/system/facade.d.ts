import type { EvoSDK } from '../sdk.js';
export declare class SystemFacade {
    private sdk;
    constructor(sdk: EvoSDK);
    status(): Promise<any>;
    currentQuorumsInfo(): Promise<any>;
    totalCreditsInPlatform(): Promise<any>;
    totalCreditsInPlatformWithProof(): Promise<any>;
    prefundedSpecializedBalance(identityId: string): Promise<any>;
    prefundedSpecializedBalanceWithProof(identityId: string): Promise<any>;
    waitForStateTransitionResult(stateTransitionHash: string): Promise<any>;
    pathElements(path: string[], keys: string[]): Promise<any>;
    pathElementsWithProof(path: string[], keys: string[]): Promise<any>;
}
