import * as wasm from './wasm.js';
import { DocumentsFacade } from './documents/facade.js';
import { IdentitiesFacade } from './identities/facade.js';
import { ContractsFacade } from './contracts/facade.js';
import { TokensFacade } from './tokens/facade.js';
import { DpnsFacade } from './dpns/facade.js';
import { EpochFacade } from './epoch/facade.js';
import { ProtocolFacade } from './protocol/facade.js';
import { SystemFacade } from './system/facade.js';
import { GroupFacade } from './group/facade.js';
import { VotingFacade } from './voting/facade.js';
export interface ConnectionOptions {
    version?: number;
    proofs?: boolean;
    logs?: string;
    settings?: {
        connectTimeoutMs?: number;
        timeoutMs?: number;
        retries?: number;
        banFailedAddress?: boolean;
    };
}
export interface EvoSDKOptions extends ConnectionOptions {
    network?: 'testnet' | 'mainnet';
    trusted?: boolean;
}
export declare class EvoSDK {
    private wasmSdk?;
    private options;
    documents: DocumentsFacade;
    identities: IdentitiesFacade;
    contracts: ContractsFacade;
    tokens: TokensFacade;
    dpns: DpnsFacade;
    epoch: EpochFacade;
    protocol: ProtocolFacade;
    system: SystemFacade;
    group: GroupFacade;
    voting: VotingFacade;
    constructor(options?: EvoSDKOptions);
    get wasm(): wasm.WasmSdk;
    get isConnected(): boolean;
    getWasmSdkConnected(): Promise<wasm.WasmSdk>;
    connect(): Promise<void>;
    static fromWasm(wasmSdk: wasm.WasmSdk): EvoSDK;
    static testnet(options?: ConnectionOptions): EvoSDK;
    static mainnet(options?: ConnectionOptions): EvoSDK;
    static testnetTrusted(options?: ConnectionOptions): EvoSDK;
    static mainnetTrusted(options?: ConnectionOptions): EvoSDK;
}
export { DocumentsFacade } from './documents/facade.js';
export { IdentitiesFacade } from './identities/facade.js';
export { ContractsFacade } from './contracts/facade.js';
export { TokensFacade } from './tokens/facade.js';
export { DpnsFacade } from './dpns/facade.js';
export { EpochFacade } from './epoch/facade.js';
export { ProtocolFacade } from './protocol/facade.js';
export { SystemFacade } from './system/facade.js';
export { GroupFacade } from './group/facade.js';
export { VotingFacade } from './voting/facade.js';
