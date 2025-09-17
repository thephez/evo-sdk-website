import type { EvoSDK } from '../sdk.js';
export declare class VotingFacade {
    private sdk;
    constructor(sdk: EvoSDK);
    contestedResourceVoteState(params: {
        contractId: string;
        documentTypeName: string;
        indexName: string;
        indexValues: any[];
        resultType: string;
        allowIncludeLockedAndAbstainingVoteTally?: boolean;
        startAtIdentifierInfo?: string;
        count?: number;
        orderAscending?: boolean;
    }): Promise<any>;
    contestedResourceVoteStateWithProof(params: {
        contractId: string;
        documentTypeName: string;
        indexName: string;
        indexValues: any[];
        resultType: string;
        allowIncludeLockedAndAbstainingVoteTally?: boolean;
        startAtIdentifierInfo?: string;
        count?: number;
        orderAscending?: boolean;
    }): Promise<any>;
    contestedResourceIdentityVotes(identityId: string, opts?: {
        limit?: number;
        startAtVotePollIdInfo?: string;
        orderAscending?: boolean;
    }): Promise<any>;
    contestedResourceIdentityVotesWithProof(identityId: string, opts?: {
        limit?: number;
        offset?: number;
        orderAscending?: boolean;
    }): Promise<any>;
    votePollsByEndDate(opts?: {
        startTimeInfo?: string;
        endTimeInfo?: string;
        limit?: number;
        orderAscending?: boolean;
    }): Promise<any>;
    votePollsByEndDateWithProof(opts?: {
        startTimeMs?: number | bigint | null;
        endTimeMs?: number | bigint | null;
        limit?: number;
        offset?: number;
        orderAscending?: boolean;
    }): Promise<any>;
    masternodeVote(args: {
        masternodeProTxHash: string;
        contractId: string;
        documentTypeName: string;
        indexName: string;
        indexValues: string | any[];
        voteChoice: string;
        votingKeyWif: string;
    }): Promise<any>;
}
