import { asJsonString } from '../util.js';
export class DocumentsFacade {
    constructor(sdk) {
        this.sdk = sdk;
    }
    // Query many documents
    async query(params) {
        const { contractId, type, where, orderBy, limit, startAfter, startAt } = params;
        const whereJson = asJsonString(where);
        const orderJson = asJsonString(orderBy);
        const w = await this.sdk.getWasmSdkConnected();
        return w.getDocuments(contractId, type, whereJson ?? null, orderJson ?? null, limit ?? null, startAfter ?? null, startAt ?? null);
    }
    async queryWithProof(params) {
        const { contractId, type, where, orderBy, limit, startAfter, startAt } = params;
        const whereJson = asJsonString(where);
        const orderJson = asJsonString(orderBy);
        const w = await this.sdk.getWasmSdkConnected();
        return w.getDocumentsWithProofInfo(contractId, type, whereJson ?? null, orderJson ?? null, limit ?? null, startAfter ?? null, startAt ?? null);
    }
    async get(contractId, type, documentId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getDocument(contractId, type, documentId);
    }
    async getWithProof(contractId, type, documentId) {
        const w = await this.sdk.getWasmSdkConnected();
        return w.getDocumentWithProofInfo(contractId, type, documentId);
    }
    async create(args) {
        const { contractId, type, ownerId, data, entropyHex, privateKeyWif } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.documentCreate(contractId, type, ownerId, asJsonString(data), entropyHex, privateKeyWif);
    }
    async replace(args) {
        const { contractId, type, documentId, ownerId, data, revision, privateKeyWif } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.documentReplace(contractId, type, documentId, ownerId, asJsonString(data), BigInt(revision), privateKeyWif);
    }
    async delete(args) {
        const { contractId, type, documentId, ownerId, privateKeyWif } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.documentDelete(contractId, type, documentId, ownerId, privateKeyWif);
    }
    async transfer(args) {
        const { contractId, type, documentId, ownerId, recipientId, privateKeyWif } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.documentTransfer(contractId, type, documentId, ownerId, recipientId, privateKeyWif);
    }
    async purchase(args) {
        const { contractId, type, documentId, buyerId, price, privateKeyWif } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.documentPurchase(contractId, type, documentId, buyerId, BigInt(price), privateKeyWif);
    }
    async setPrice(args) {
        const { contractId, type, documentId, ownerId, price, privateKeyWif } = args;
        const w = await this.sdk.getWasmSdkConnected();
        return w.documentSetPrice(contractId, type, documentId, ownerId, BigInt(price), privateKeyWif);
    }
}
