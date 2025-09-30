import type { EvoSDK } from '../sdk.js';
export declare class GroupFacade {
    private sdk;
    constructor(sdk: EvoSDK);
    info(contractId: string, groupContractPosition: number): Promise<any>;
    infoWithProof(contractId: string, groupContractPosition: number): Promise<any>;
    infos(contractId: string, startAtInfo?: unknown, count?: number): Promise<any>;
    infosWithProof(contractId: string, startAtInfo?: unknown, count?: number): Promise<any>;
    members(contractId: string, groupContractPosition: number, opts?: {
        memberIds?: string[];
        startAt?: string;
        limit?: number;
    }): Promise<any>;
    membersWithProof(contractId: string, groupContractPosition: number, opts?: {
        memberIds?: string[];
        startAt?: string;
        limit?: number;
    }): Promise<any>;
    identityGroups(identityId: string, opts?: {
        memberDataContracts?: string[];
        ownerDataContracts?: string[];
        moderatorDataContracts?: string[];
    }): Promise<any>;
    identityGroupsWithProof(identityId: string, opts?: {
        memberDataContracts?: string[];
        ownerDataContracts?: string[];
        moderatorDataContracts?: string[];
    }): Promise<any>;
    actions(contractId: string, groupContractPosition: number, status: string, opts?: {
        startAtInfo?: unknown;
        count?: number;
    }): Promise<any>;
    actionsWithProof(contractId: string, groupContractPosition: number, status: string, opts?: {
        startAtInfo?: unknown;
        count?: number;
    }): Promise<any>;
    actionSigners(contractId: string, groupContractPosition: number, status: string, actionId: string): Promise<any>;
    actionSignersWithProof(contractId: string, groupContractPosition: number, status: string, actionId: string): Promise<any>;
    groupsDataContracts(dataContractIds: string[]): Promise<any>;
    groupsDataContractsWithProof(dataContractIds: string[]): Promise<any>;
    contestedResources(params: {
        documentTypeName: string;
        contractId: string;
        indexName: string;
        startAtValue?: Uint8Array;
        limit?: number;
        orderAscending?: boolean;
    }): Promise<any>;
    contestedResourcesWithProof(params: {
        documentTypeName: string;
        contractId: string;
        indexName: string;
        startAtValue?: Uint8Array;
        limit?: number;
        orderAscending?: boolean;
    }): Promise<any>;
    contestedResourceVotersForIdentity(params: {
        contractId: string;
        documentTypeName: string;
        indexName: string;
        indexValues: any[];
        contestantId: string;
        startAtVoterInfo?: string;
        limit?: number;
        orderAscending?: boolean;
    }): Promise<any>;
    contestedResourceVotersForIdentityWithProof(params: {
        contractId: string;
        documentTypeName: string;
        indexName: string;
        indexValues: any[];
        contestantId: string;
        startAtIdentifierInfo?: string;
        count?: number;
        orderAscending?: boolean;
    }): Promise<any>;
}
