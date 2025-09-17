export class GroupFacade {
    constructor(sdk) { this.sdk = sdk; }
    async contestedResources(params) {
        const { documentTypeName, contractId, indexName, startAtValue, limit, orderAscending } = params;
        const w = await this.sdk.getWasmSdkConnected();
        return w.getContestedResources(documentTypeName, contractId, indexName, startAtValue ?? null, limit ?? null, null, orderAscending ?? null);
    }
    async contestedResourcesWithProof(params) {
        const { documentTypeName, contractId, indexName, startAtValue, limit, orderAscending } = params;
        const w = await this.sdk.getWasmSdkConnected();
        return w.getContestedResourcesWithProofInfo(documentTypeName, contractId, indexName, startAtValue ?? null, limit ?? null, null, orderAscending ?? null);
    }
    async contestedResourceVotersForIdentity(params) {
        const { contractId, documentTypeName, indexName, indexValues, contestantId, startAtVoterInfo, limit, orderAscending } = params;
        const w = await this.sdk.getWasmSdkConnected();
        return w.getContestedResourceVotersForIdentity(contractId, documentTypeName, indexName, indexValues, contestantId, startAtVoterInfo ?? null, limit ?? null, orderAscending ?? null);
    }
    async contestedResourceVotersForIdentityWithProof(params) {
        const { contractId, documentTypeName, indexName, indexValues, contestantId, startAtIdentifierInfo, count, orderAscending } = params;
        const w = await this.sdk.getWasmSdkConnected();
        return w.getContestedResourceVotersForIdentityWithProofInfo(contractId, documentTypeName, indexName, indexValues, contestantId, startAtIdentifierInfo ?? null, count ?? null, orderAscending ?? null);
    }
}
