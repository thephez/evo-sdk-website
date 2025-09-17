import { asJsonString } from '../util.js';
export class ContractsFacade {
    constructor(sdk) {
        this.sdk = sdk;
    }
    async fetch(contractId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getDataContract(contractId);
    }
    async fetchWithProof(contractId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getDataContractWithProofInfo(contractId);
    }
    async getHistory(args) {
        const { contractId, limit, startAtMs } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.getDataContractHistory(contractId, limit ?? null, null, startAtMs != null ? BigInt(startAtMs) : null);
    }
    async getHistoryWithProof(args) {
        const { contractId, limit, startAtMs } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.getDataContractHistoryWithProofInfo(contractId, limit ?? null, null, startAtMs != null ? BigInt(startAtMs) : null);
    }
    async getMany(contractIds) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getDataContracts(contractIds);
    }
    async getManyWithProof(contractIds) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getDataContractsWithProofInfo(contractIds);
    }
    async create(args) {
        const { ownerId, definition, privateKeyWif, keyId } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.contractCreate(ownerId, asJsonString(definition), privateKeyWif, keyId ?? null);
    }
    async update(args) {
        const { contractId, ownerId, updates, privateKeyWif, keyId } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.contractUpdate(contractId, ownerId, asJsonString(updates), privateKeyWif, keyId ?? null);
    }
}
