# Evo SDK Return Type Reference

Generated from `@dashevo/evo-sdk@4.0.0` published TypeScript declarations under `dist/`.

Only named types referenced by currently documented method return values are included. Declarations are not recursively expanded.

<a id="type-contestedresourcevotestate"></a>
## `ContestedResourceVoteState`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class ContestedResourceVoteState {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    get abstainVoteTally(): number | undefined;
    set abstainVoteTally(value: number | null | undefined);
    contenders: Array<any>;
    get lockVoteTally(): number | undefined;
    set lockVoteTally(value: number | null | undefined);
    get winner(): ContestedResourceVoteWinner | undefined;
    set winner(value: ContestedResourceVoteWinner | null | undefined);
}
```

<a id="type-currentquorumsinfo"></a>
## `CurrentQuorumsInfo`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class CurrentQuorumsInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object): CurrentQuorumsInfo;
    static fromObject(obj: object): CurrentQuorumsInfo;
    toJSON(): any;
    toObject(): any;
    readonly height: bigint;
    readonly quorums: Array<any>;
}
```

<a id="type-datacontract"></a>
## `DataContract`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class DataContract {
    free(): void;
    [Symbol.dispose](): void;
    constructor(options: DataContractOptions);
    static fromBase64(base64: string, full_validation: boolean, platform_version: PlatformVersionLike): DataContract;
    static fromBytes(bytes: Uint8Array, full_validation: boolean, platform_version: PlatformVersionLike): DataContract;
    static fromHex(hex: string, full_validation: boolean, platform_version: PlatformVersionLike): DataContract;
    static fromJSON(value: DataContractJSON, full_validation: boolean, platform_version: PlatformVersionLike): DataContract;
    static fromObject(value: DataContractObject, full_validation: boolean, platform_version: PlatformVersionLike): DataContract;
    static generateId(owner_id: IdentifierLike, identity_nonce: bigint): Identifier;
    setConfig(config: DataContractConfig, platformVersion: PlatformVersionLike): void;
    setSchemas(schemas: Record<string, object>, definitions: object | null | undefined, full_validation: boolean, platform_version: PlatformVersionLike): void;
    toBase64(platformVersion: PlatformVersionLike): string;
    toBytes(platformVersion: PlatformVersionLike): Uint8Array;
    toHex(platformVersion: PlatformVersionLike): string;
    toJSON(platform_version: PlatformVersionLike): DataContractJSON;
    toObject(platformVersion: PlatformVersionLike): DataContractObject;
    readonly config: DataContractConfig;
    groups: Record<number, Group>;
    get id(): Identifier;
    set id(value: IdentifierLike);
    get ownerId(): Identifier;
    set ownerId(value: IdentifierLike);
    readonly schemas: Record<string, object>;
    get tokens(): object;
    set tokens(value: Record<number, TokenConfiguration>);
    version: number;
    static readonly __struct: string;
    readonly __type: string;
}
```

<a id="type-document"></a>
## `Document`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class Document {
    free(): void;
    [Symbol.dispose](): void;
    constructor(options: DocumentOptions);
    static fromBase64(base64: string, dataContract: DataContract, typeName: string, platformVersion: PlatformVersionLike): Document;
    static fromBytes(bytes: Uint8Array, dataContract: DataContract, typeName: string, platformVersion: PlatformVersionLike): Document;
    static fromHex(hex: string, dataContract: DataContract, typeName: string, platformVersion: PlatformVersionLike): Document;
    /**
     * Create a Document from a JSON object.
     * JSON format has identifiers as base58 strings.
     */
    static fromJSON(value: DocumentJSON, platform_version: PlatformVersionLike): Document;
    /**
     * Create a Document from a JS object.
     */
    static fromObject(value: DocumentObject, platform_version: PlatformVersionLike): Document;
    static generateId(documentTypeName: string, ownerId: IdentifierLike, dataContractId: IdentifierLike, entropy?: Uint8Array | null): Uint8Array;
    toBase64(data_contract: DataContract, platform_version: PlatformVersionLike): string;
    toBytes(data_contract: DataContract, platform_version: PlatformVersionLike): Uint8Array;
    toHex(data_contract: DataContract, platform_version: PlatformVersionLike): string;
    /**
     * Convert to a JSON-compatible JS object with binary fields as strings.
     */
    toJSON(platform_version: PlatformVersionLike): DocumentJSON;
    /**
     * Convert to a JS object with binary fields as Uint8Array.
     */
    toObject(): DocumentObject;
    get createdAt(): bigint | undefined;
    set createdAt(value: bigint | null | undefined);
    get createdAtBlockHeight(): bigint | undefined;
    set createdAtBlockHeight(value: bigint | null | undefined);
    get createdAtCoreBlockHeight(): number | undefined;
    set createdAtCoreBlockHeight(value: number | null | undefined);
    get dataContractId(): Identifier;
    set dataContractId(value: IdentifierLike);
    documentTypeName: string;
    get entropy(): Uint8Array | undefined;
    set entropy(value: Uint8Array | null | undefined);
    get id(): Identifier;
    set id(value: IdentifierLike);
    get ownerId(): Identifier;
    set ownerId(value: IdentifierLike);
    properties: Record<string, unknown>;
    get revision(): bigint | undefined;
    set revision(value: bigint | null | undefined);
    get transferredAt(): bigint | undefined;
    set transferredAt(value: bigint | null | undefined);
    get transferredAtBlockHeight(): bigint | undefined;
    set transferredAtBlockHeight(value: bigint | null | undefined);
    get transferredAtCoreBlockHeight(): number | undefined;
    set transferredAtCoreBlockHeight(value: number | null | undefined);
    get updatedAt(): bigint | undefined;
    set updatedAt(value: bigint | null | undefined);
    get updatedAtBlockHeight(): bigint | undefined;
    set updatedAtBlockHeight(value: bigint | null | undefined);
    get updatedAtCoreBlockHeight(): number | undefined;
    set updatedAtCoreBlockHeight(value: number | null | undefined);
    static readonly __struct: string;
    readonly __type: string;
}
```

<a id="type-dpnsusernameinfo"></a>
## `DpnsUsernameInfo`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class DpnsUsernameInfo {
    free(): void;
    [Symbol.dispose](): void;
    constructor(username: string, identity_id: Identifier, document_id: Identifier);
    static fromJSON(js: object): DpnsUsernameInfo;
    static fromObject(obj: object): DpnsUsernameInfo;
    toJSON(): any;
    toObject(): any;
    documentId: Identifier;
    identityId: Identifier;
    username: string;
}
```

<a id="type-extendedepochinfo"></a>
## `ExtendedEpochInfo`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class ExtendedEpochInfo {
    free(): void;
    [Symbol.dispose](): void;
    constructor(options: ExtendedEpochInfoOptions);
    static fromJSON(js: ExtendedEpochInfoJSON): ExtendedEpochInfo;
    static fromObject(obj: ExtendedEpochInfoObject): ExtendedEpochInfo;
    toJSON(): ExtendedEpochInfoJSON;
    toObject(): ExtendedEpochInfoObject;
    readonly feeMultiplier: number;
    feeMultiplierPermille: bigint;
    firstBlockHeight: bigint;
    firstBlockTime: bigint;
    firstCoreBlockHeight: number;
    index: number;
    protocolVersion: number;
    static readonly __struct: string;
    readonly __type: string;
}
```

<a id="type-finalizedepochinfo"></a>
## `FinalizedEpochInfo`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class FinalizedEpochInfo {
    free(): void;
    [Symbol.dispose](): void;
    constructor(options: FinalizedEpochInfoOptions);
    static fromJSON(js: FinalizedEpochInfoJSON): FinalizedEpochInfo;
    static fromObject(obj: FinalizedEpochInfoObject): FinalizedEpochInfo;
    toJSON(): FinalizedEpochInfoJSON;
    toObject(): FinalizedEpochInfoObject;
    blockProposers: BlockProposersMap;
    coreBlockRewards: bigint;
    readonly feeMultiplier: number;
    feeMultiplierPermille: bigint;
    firstBlockHeight: bigint;
    firstBlockTime: bigint;
    firstCoreBlockHeight: number;
    nextEpochStartCoreBlockHeight: number;
    protocolVersion: number;
    totalBlocksInEpoch: bigint;
    totalCreatedStorageFees: bigint;
    totalDistributedStorageFees: bigint;
    totalProcessingFees: bigint;
    static readonly __struct: string;
    readonly __type: string;
}
```

<a id="type-group"></a>
## `Group`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class Group {
    free(): void;
    [Symbol.dispose](): void;
    constructor(members: GroupMembersMap, requiredPower: number);
    static fromJSON(object: GroupJSON): Group;
    static fromObject(value: GroupObject): Group;
    setMemberRequiredPower(member: IdentifierLike, memberRequiredPower: number): void;
    toJSON(): GroupJSON;
    toObject(): GroupObject;
    members: GroupMembersMap;
    requiredPower: number;
    static readonly __struct: string;
    readonly __type: string;
}
```

<a id="type-groupaction"></a>
## `GroupAction`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class GroupAction {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: GroupActionJSON): GroupAction;
    static fromObject(obj: GroupActionObject): GroupAction;
    toJSON(): GroupActionJSON;
    toObject(): GroupActionObject;
    readonly contractId: Identifier;
    readonly event: GroupActionEvent;
    readonly proposerId: Identifier;
    static readonly __struct: string;
    readonly tokenContractPosition: number;
    readonly __type: string;
}
```

<a id="type-identifier"></a>
## `Identifier`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class Identifier {
    free(): void;
    [Symbol.dispose](): void;
    constructor(identifier: IdentifierLike);
    static fromBase58(base58: string): Identifier;
    static fromBase64(base64: string): Identifier;
    static fromBytes(bytes: Uint8Array): Identifier;
    static fromHex(hex: string): Identifier;
    toBase58(): string;
    toBase64(): string;
    toBytes(): Uint8Array;
    toHex(): string;
    /**
     * Returns the identifier as a Base58 string for JSON serialization.
     * This method is called automatically when the object is serialized to JSON.
     */
    toJSON(): string;
    /**
     * Returns the identifier as a Base58 string.
     * This is the default string representation for JavaScript.
     */
    toString(): string;
    static readonly __struct: string;
    readonly __type: string;
}
```

<a id="type-identity"></a>
## `Identity`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class Identity {
    free(): void;
    [Symbol.dispose](): void;
    addPublicKey(publicKey: IdentityPublicKey): void;
    constructor(id: IdentifierLike);
    static fromBase64(base64: string): Identity;
    static fromBytes(bytes: Uint8Array): Identity;
    static fromHex(hex: string): Identity;
    static fromJSON(value: IdentityJSON): Identity;
    static fromObject(value: IdentityObject, platform_version: PlatformVersionLike): Identity;
    getPublicKeyById(keyId: number): IdentityPublicKey | undefined;
    toBase64(): string;
    toBytes(): Uint8Array;
    toHex(): string;
    toJSON(): IdentityJSON;
    toObject(): IdentityObject;
    balance: bigint;
    get id(): Identifier;
    set id(value: IdentifierLike);
    readonly publicKeys: IdentityPublicKey[];
    revision: bigint;
    static readonly __struct: string;
    readonly __type: string;
}
```

<a id="type-identitybalanceandrevision"></a>
## `IdentityBalanceAndRevision`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class IdentityBalanceAndRevision {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object): IdentityBalanceAndRevision;
    static fromObject(obj: object): IdentityBalanceAndRevision;
    toJSON(): any;
    toObject(): any;
    readonly balance: bigint;
    readonly revision: bigint;
}
```

<a id="type-identitycontractkeys"></a>
## `IdentityContractKeys`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class IdentityContractKeys {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    identityId: Identifier;
    keys: IdentityPublicKey[];
}
```

<a id="type-identitycreatefromaddressesresult"></a>
## `IdentityCreateFromAddressesResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class IdentityCreateFromAddressesResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Map of addresses to their updated info after the identity creation.
     */
    readonly addressInfos: Map<any, any>;
    /**
     * The newly created identity.
     */
    readonly identity: Identity;
}
```

<a id="type-identitycredittransferresult"></a>
## `IdentityCreditTransferResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class IdentityCreditTransferResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Balance of the recipient identity after the transfer.
     */
    readonly recipientBalance: bigint;
    /**
     * Balance of the sender identity after the transfer.
     */
    readonly senderBalance: bigint;
}
```

<a id="type-identitygroupinfo"></a>
## `IdentityGroupInfo`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class IdentityGroupInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    dataContractId: string;
    groupContractPosition: number;
    role: string;
    readonly power: bigint | undefined;
}
```

<a id="type-identitypublickey"></a>
## `IdentityPublicKey`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class IdentityPublicKey {
    free(): void;
    [Symbol.dispose](): void;
    base64(): string;
    constructor(options: IdentityPublicKeyOptions);
    static fromBase64(hex: string): IdentityPublicKey;
    static fromBytes(bytes: Uint8Array): IdentityPublicKey;
    static fromHex(hex: string): IdentityPublicKey;
    /**
     * Deserialize from JSON-compatible JS object (human-readable).
     *
     * Uses serde_json conversion which properly handles the tagged enum
     * and deserializes base64 strings to binary data.
     */
    static fromJSON(value: IdentityPublicKeyJSON, platform_version: PlatformVersionLike): IdentityPublicKey;
    /**
     * Deserialize from JS object (non-human-readable).
     *
     * Uses platform_value conversion which properly handles the tagged enum.
     */
    static fromObject(value: IdentityPublicKeyObject, platform_version: PlatformVersionLike): IdentityPublicKey;
    getPublicKeyHash(): string;
    hex(): string;
    toBytes(): Uint8Array;
    /**
     * Serialize to JSON-compatible JS object (human-readable).
     *
     * Uses serde_json conversion which properly handles the tagged enum
     * and serializes binary data as base64 strings.
     */
    toJSON(): IdentityPublicKeyJSON;
    /**
     * Serialize to JS object (non-human-readable).
     *
     * Uses platform_value conversion which properly handles the tagged enum
     * and removes None fields like disabledAt.
     */
    toObject(): IdentityPublicKeyObject;
    validatePrivateKey(private_key_bytes_input: Uint8Array, network: NetworkLike): boolean;
    readonly contractBounds: ContractBounds | undefined;
    data: string;
    get disabledAt(): bigint | undefined;
    set disabledAt(value: any);
    readonly isMaster: boolean;
    isReadOnly: boolean;
    get keyId(): number;
    set keyId(value: any);
    get keyType(): string;
    set keyType(value: KeyTypeLike);
    readonly keyTypeNumber: KeyType;
    get purpose(): string;
    set purpose(value: PurposeLike);
    readonly purposeNumber: Purpose;
    get securityLevel(): string;
    set securityLevel(value: SecurityLevelLike);
    readonly securityLevelNumber: SecurityLevel;
    static readonly __struct: string;
    readonly __type: string;
}
```

<a id="type-identitytokeninfo"></a>
## `IdentityTokenInfo`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class IdentityTokenInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly isFrozen: boolean;
    static readonly __struct: string;
    readonly __type: string;
}
```

<a id="type-identitytopupfromaddressesresult"></a>
## `IdentityTopUpFromAddressesResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class IdentityTopUpFromAddressesResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Map of addresses to their updated info after the top up.
     */
    readonly addressInfos: Map<any, any>;
    /**
     * New balance of the identity after top up.
     */
    readonly newBalance: bigint;
}
```

<a id="type-identitytransfertoaddressesresult"></a>
## `IdentityTransferToAddressesResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class IdentityTransferToAddressesResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Map of addresses to their updated info after the transfer.
     */
    readonly addressInfos: Map<any, any>;
    /**
     * New balance of the identity after transfer.
     */
    readonly newBalance: bigint;
}
```

<a id="type-pathelement"></a>
## `PathElement`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class PathElement {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object): PathElement;
    static fromObject(obj: object): PathElement;
    toJSON(): any;
    toObject(): any;
    get value(): string | undefined;
    set value(value: string | null | undefined);
    readonly elementType: GroveElementType | undefined;
    readonly key: Uint8Array;
    readonly path: Array<any>;
    readonly pathBytes: Uint8Array[];
    readonly referenceTarget: Uint8Array[] | undefined;
    readonly referenceTargetError: string | undefined;
    readonly sum: bigint | undefined;
    readonly valueBytes: Uint8Array | undefined;
}
```

<a id="type-platformaddressinfo"></a>
## `PlatformAddressInfo`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class PlatformAddressInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object): PlatformAddressInfo;
    static fromObject(obj: object): PlatformAddressInfo;
    toJSON(): any;
    toObject(): any;
    /**
     * Returns the platform address.
     */
    readonly address: PlatformAddress;
    /**
     * Returns the balance stored for the address in credits.
     */
    readonly balance: bigint;
    /**
     * Returns the nonce associated with the address.
     */
    readonly nonce: bigint;
}
```

<a id="type-prefundedspecializedbalance"></a>
## `PrefundedSpecializedBalance`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class PrefundedSpecializedBalance {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object): PrefundedSpecializedBalance;
    static fromObject(obj: object): PrefundedSpecializedBalance;
    toJSON(): any;
    toObject(): any;
    readonly balance: bigint;
    readonly identityId: Identifier;
}
```

<a id="type-protocolversionupgradestate"></a>
## `ProtocolVersionUpgradeState`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class ProtocolVersionUpgradeState {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object): ProtocolVersionUpgradeState;
    static fromObject(obj: object): ProtocolVersionUpgradeState;
    toJSON(): any;
    toObject(): any;
    readonly activationHeight: bigint | undefined;
    readonly currentProtocolVersion: number;
    readonly isThresholdReached: boolean;
    readonly nextProtocolVersion: number | undefined;
    readonly voteCount: number | undefined;
}
```

<a id="type-protocolversionupgradevotestatus"></a>
## `ProtocolVersionUpgradeVoteStatus`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class ProtocolVersionUpgradeVoteStatus {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly proTxHash: ProTxHash;
    readonly version: number;
}
```

<a id="type-registerdpnsnameresult"></a>
## `RegisterDpnsNameResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class RegisterDpnsNameResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object): RegisterDpnsNameResult;
    static fromObject(obj: object): RegisterDpnsNameResult;
    toJSON(): any;
    toObject(): any;
    domainDocumentId: Identifier;
    fullDomainName: string;
    preorderDocumentId: Identifier;
}
```

<a id="type-resourcevote"></a>
## `ResourceVote`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class ResourceVote {
    free(): void;
    [Symbol.dispose](): void;
    constructor(poll: VotePoll, choice: ResourceVoteChoice);
    static fromJSON(js: ResourceVoteJSON): ResourceVote;
    static fromObject(obj: ResourceVoteObject): ResourceVote;
    toJSON(): ResourceVoteJSON;
    toObject(): ResourceVoteObject;
    choice: ResourceVoteChoice;
    poll: VotePoll;
    static readonly __struct: string;
    readonly __type: string;
}
```

<a id="type-rewarddistributionmoment"></a>
## `RewardDistributionMoment`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class RewardDistributionMoment {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Returns the block height (only valid when type is "block")
     */
    readonly blockHeight: bigint | undefined;
    /**
     * Returns the epoch index (only valid when type is "epoch")
     */
    readonly epochIndex: number | undefined;
    /**
     * Returns the type: "block", "time", or "epoch"
     */
    readonly type: string;
    /**
     * Returns the timestamp in ms (only valid when type is "time")
     */
    readonly timestampMs: bigint | undefined;
}
```

<a id="type-statetransitionresult"></a>
## `StateTransitionResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class StateTransitionResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object): StateTransitionResult;
    static fromObject(obj: object): StateTransitionResult;
    toJSON(): any;
    toObject(): any;
    get error(): string | undefined;
    set error(value: string | null | undefined);
    state_transition_hash: string;
    status: string;
}
```

<a id="type-statusresponse"></a>
## `StatusResponse`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class StatusResponse {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object): StatusResponse;
    static fromObject(obj: object): StatusResponse;
    toJSON(): any;
    toObject(): any;
    chain: StatusChain;
    network: StatusNetwork;
    node: StatusNode;
    state_sync: StatusStateSync;
    time: StatusTime;
    version: StatusVersion;
}
```

<a id="type-tokenburnresult"></a>
## `TokenBurnResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenBurnResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object, platform_version: PlatformVersionLike): TokenBurnResult;
    static fromObject(obj: object, platform_version: PlatformVersionLike): TokenBurnResult;
    toJSON(platform_version: PlatformVersionLike): any;
    toObject(): any;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    get document(): Document | undefined;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    set document(value: Document | null | undefined);
    get groupActionStatus(): string | undefined;
    set groupActionStatus(value: string | null | undefined);
    /**
     * For group actions
     */
    get groupPower(): number | undefined;
    /**
     * For group actions
     */
    set groupPower(value: number | null | undefined);
    /**
     * For TokenBalance result
     */
    get ownerId(): Identifier | undefined;
    /**
     * For TokenBalance result
     */
    set ownerId(value: Identifier | null | undefined);
    /**
     * The remaining token balance after burning.
     */
    readonly remainingBalance: bigint | undefined;
}
```

<a id="type-tokenclaimresult"></a>
## `TokenClaimResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenClaimResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object, platform_version: PlatformVersionLike): TokenClaimResult;
    static fromObject(obj: object, platform_version: PlatformVersionLike): TokenClaimResult;
    toJSON(platform_version: PlatformVersionLike): any;
    toObject(): any;
    /**
     * The document
     */
    get document(): Document | undefined;
    /**
     * The document
     */
    set document(value: Document | null | undefined);
    /**
     * For group actions
     */
    get groupPower(): number | undefined;
    /**
     * For group actions
     */
    set groupPower(value: number | null | undefined);
}
```

<a id="type-tokencontractinfo"></a>
## `TokenContractInfo`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenContractInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: TokenContractInfoJSON): TokenContractInfo;
    static fromObject(obj: TokenContractInfoObject): TokenContractInfo;
    toJSON(): TokenContractInfoJSON;
    toObject(): TokenContractInfoObject;
    readonly contractId: Identifier;
    static readonly __struct: string;
    readonly tokenContractPosition: number;
    readonly __type: string;
}
```

<a id="type-tokendestroyfrozenresult"></a>
## `TokenDestroyFrozenResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenDestroyFrozenResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object, platform_version: PlatformVersionLike): TokenDestroyFrozenResult;
    static fromObject(obj: object, platform_version: PlatformVersionLike): TokenDestroyFrozenResult;
    toJSON(platform_version: PlatformVersionLike): any;
    toObject(): any;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    get document(): Document | undefined;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    set document(value: Document | null | undefined);
    /**
     * For group actions
     */
    get groupPower(): number | undefined;
    /**
     * For group actions
     */
    set groupPower(value: number | null | undefined);
}
```

<a id="type-tokendirectpurchaseresult"></a>
## `TokenDirectPurchaseResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenDirectPurchaseResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object, platform_version: PlatformVersionLike): TokenDirectPurchaseResult;
    static fromObject(obj: object, platform_version: PlatformVersionLike): TokenDirectPurchaseResult;
    toJSON(platform_version: PlatformVersionLike): any;
    toObject(): any;
    /**
     * For TokenBalance result
     */
    get buyerId(): Identifier | undefined;
    /**
     * For TokenBalance result
     */
    set buyerId(value: Identifier | null | undefined);
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    get document(): Document | undefined;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    set document(value: Document | null | undefined);
    /**
     * For group actions
     */
    get groupPower(): number | undefined;
    /**
     * For group actions
     */
    set groupPower(value: number | null | undefined);
    /**
     * The buyer's new balance after purchase.
     */
    readonly newBalance: bigint | undefined;
}
```

<a id="type-tokenemergencyactionresult"></a>
## `TokenEmergencyActionResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenEmergencyActionResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object, platform_version: PlatformVersionLike): TokenEmergencyActionResult;
    static fromObject(obj: object, platform_version: PlatformVersionLike): TokenEmergencyActionResult;
    toJSON(platform_version: PlatformVersionLike): any;
    toObject(): any;
    /**
     * The document
     */
    get document(): Document | undefined;
    /**
     * The document
     */
    set document(value: Document | null | undefined);
    /**
     * For group actions
     */
    get groupPower(): number | undefined;
    /**
     * For group actions
     */
    set groupPower(value: number | null | undefined);
}
```

<a id="type-tokenfreezeresult"></a>
## `TokenFreezeResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenFreezeResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object, platform_version: PlatformVersionLike): TokenFreezeResult;
    static fromObject(obj: object, platform_version: PlatformVersionLike): TokenFreezeResult;
    toJSON(platform_version: PlatformVersionLike): any;
    toObject(): any;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    get document(): Document | undefined;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    set document(value: Document | null | undefined);
    /**
     * For IdentityInfo result
     */
    get frozenIdentityId(): Identifier | undefined;
    /**
     * For IdentityInfo result
     */
    set frozenIdentityId(value: Identifier | null | undefined);
    /**
     * For group actions
     */
    get groupPower(): number | undefined;
    /**
     * For group actions
     */
    set groupPower(value: number | null | undefined);
}
```

<a id="type-tokenmintresult"></a>
## `TokenMintResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenMintResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object, platform_version: PlatformVersionLike): TokenMintResult;
    static fromObject(obj: object, platform_version: PlatformVersionLike): TokenMintResult;
    toJSON(platform_version: PlatformVersionLike): any;
    toObject(): any;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    get document(): Document | undefined;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    set document(value: Document | null | undefined);
    /**
     * For GroupActionWithBalance - action status
     */
    get groupActionStatus(): string | undefined;
    /**
     * For GroupActionWithBalance - action status
     */
    set groupActionStatus(value: string | null | undefined);
    /**
     * For group actions - accumulated group power
     */
    get groupPower(): number | undefined;
    /**
     * For group actions - accumulated group power
     */
    set groupPower(value: number | null | undefined);
    /**
     * For TokenBalance result - recipient identity ID
     */
    get recipientId(): Identifier | undefined;
    /**
     * For TokenBalance result - recipient identity ID
     */
    set recipientId(value: Identifier | null | undefined);
    /**
     * The new token balance after minting.
     */
    readonly newBalance: bigint | undefined;
}
```

<a id="type-tokenpriceinfo"></a>
## `TokenPriceInfo`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenPriceInfo {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object): TokenPriceInfo;
    static fromObject(obj: object): TokenPriceInfo;
    toJSON(): any;
    toObject(): any;
    basePrice: string;
    currentPrice: string;
    tokenId: Identifier;
}
```

<a id="type-tokensetpriceresult"></a>
## `TokenSetPriceResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenSetPriceResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object, platform_version: PlatformVersionLike): TokenSetPriceResult;
    static fromObject(obj: object, platform_version: PlatformVersionLike): TokenSetPriceResult;
    toJSON(platform_version: PlatformVersionLike): any;
    toObject(): any;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    get document(): Document | undefined;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    set document(value: Document | null | undefined);
    /**
     * Group action status
     */
    get groupActionStatus(): string | undefined;
    /**
     * Group action status
     */
    set groupActionStatus(value: string | null | undefined);
    /**
     * For group actions
     */
    get groupPower(): number | undefined;
    /**
     * For group actions
     */
    set groupPower(value: number | null | undefined);
    /**
     * For PricingSchedule - the identity that set the price
     */
    get ownerId(): Identifier | undefined;
    /**
     * For PricingSchedule - the identity that set the price
     */
    set ownerId(value: Identifier | null | undefined);
    /**
     * For PricingSchedule or GroupActionWithPricingSchedule - the pricing schedule
     */
    get pricingSchedule(): TokenPricingSchedule | undefined;
    /**
     * For PricingSchedule or GroupActionWithPricingSchedule - the pricing schedule
     */
    set pricingSchedule(value: TokenPricingSchedule | null | undefined);
}
```

<a id="type-tokenstatus"></a>
## `TokenStatus`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenStatus {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly isPaused: boolean;
    static readonly __struct: string;
    readonly __type: string;
}
```

<a id="type-tokentotalsupply"></a>
## `TokenTotalSupply`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenTotalSupply {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object): TokenTotalSupply;
    static fromObject(obj: object): TokenTotalSupply;
    toJSON(): any;
    toObject(): any;
    readonly totalSupply: bigint;
}
```

<a id="type-tokentransferresult"></a>
## `TokenTransferResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenTransferResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object, platform_version: PlatformVersionLike): TokenTransferResult;
    static fromObject(obj: object, platform_version: PlatformVersionLike): TokenTransferResult;
    toJSON(platform_version: PlatformVersionLike): any;
    toObject(): any;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    get document(): Document | undefined;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    set document(value: Document | null | undefined);
    /**
     * For group actions
     */
    get groupPower(): number | undefined;
    /**
     * For group actions
     */
    set groupPower(value: number | null | undefined);
    /**
     * The recipient's new balance after transfer.
     */
    readonly recipientBalance: bigint | undefined;
    /**
     * The sender's new balance after transfer.
     */
    readonly senderBalance: bigint | undefined;
}
```

<a id="type-tokenunfreezeresult"></a>
## `TokenUnfreezeResult`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class TokenUnfreezeResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static fromJSON(js: object, platform_version: PlatformVersionLike): TokenUnfreezeResult;
    static fromObject(obj: object, platform_version: PlatformVersionLike): TokenUnfreezeResult;
    toJSON(platform_version: PlatformVersionLike): any;
    toObject(): any;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    get document(): Document | undefined;
    /**
     * For HistoricalDocument or GroupActionWithDocument - the document
     */
    set document(value: Document | null | undefined);
    /**
     * For group actions
     */
    get groupPower(): number | undefined;
    /**
     * For group actions
     */
    set groupPower(value: number | null | undefined);
    /**
     * For IdentityInfo result
     */
    get unfrozenIdentityId(): Identifier | undefined;
    /**
     * For IdentityInfo result
     */
    set unfrozenIdentityId(value: Identifier | null | undefined);
}
```

<a id="type-votepollsbyenddateentry"></a>
## `VotePollsByEndDateEntry`

Source declaration: `wasm-sdk/dist/raw/wasm_sdk.d.ts`

```typescript
export class VotePollsByEndDateEntry {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly timestampMs: bigint;
    readonly votePolls: Array<any>;
}
```
