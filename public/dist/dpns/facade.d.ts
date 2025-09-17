import type { EvoSDK } from '../sdk.js';
export declare class DpnsFacade {
    private sdk;
    constructor(sdk: EvoSDK);
    convertToHomographSafe(input: string): string;
    isValidUsername(label: string): boolean;
    isContestedUsername(label: string): boolean;
    isNameAvailable(label: string): Promise<boolean>;
    resolveName(name: string): Promise<any>;
    registerName(args: {
        label: string;
        identityId: string;
        publicKeyId: number;
        privateKeyWif: string;
        onPreorder?: Function;
    }): Promise<any>;
    usernames(identityId: string, opts?: {
        limit?: number;
    }): Promise<any>;
    username(identityId: string): Promise<any>;
    usernamesWithProof(identityId: string, opts?: {
        limit?: number;
    }): Promise<any>;
    usernameWithProof(identityId: string): Promise<any>;
    getUsernameByName(username: string): Promise<any>;
    getUsernameByNameWithProof(username: string): Promise<any>;
}
