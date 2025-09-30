// ESM wrapper around @dashevo/wasm-sdk with one-time init
import initWasmSdk, * as wasm from './sdk.compressed.js';
let initPromise;
export async function ensureInitialized() {
    if (!initPromise) {
        initPromise = initWasmSdk().then(() => wasm);
    }
    return initPromise;
}
// Re-export all wasm SDK symbols for convenience
export * from './sdk.compressed.js';
export { default } from './sdk.compressed.js';
