import * as wasm from '../wasm.js';
export var wallet;
(function (wallet) {
    function generateMnemonic(wordCount, languageCode) {
        return wasm.WasmSdk.generateMnemonic(wordCount ?? null, languageCode ?? null);
    }
    wallet.generateMnemonic = generateMnemonic;
    function validateMnemonic(mnemonic, languageCode) {
        return wasm.WasmSdk.validateMnemonic(mnemonic, languageCode ?? null);
    }
    wallet.validateMnemonic = validateMnemonic;
    function mnemonicToSeed(mnemonic, passphrase) {
        return wasm.WasmSdk.mnemonicToSeed(mnemonic, passphrase ?? null);
    }
    wallet.mnemonicToSeed = mnemonicToSeed;
    function deriveKeyFromSeedPhrase(mnemonic, passphrase, network) {
        return wasm.WasmSdk.deriveKeyFromSeedPhrase(mnemonic, passphrase ?? null, network);
    }
    wallet.deriveKeyFromSeedPhrase = deriveKeyFromSeedPhrase;
    function deriveKeyFromSeedWithPath(mnemonic, passphrase, path, network) {
        return wasm.WasmSdk.deriveKeyFromSeedWithPath(mnemonic, passphrase ?? null, path, network);
    }
    wallet.deriveKeyFromSeedWithPath = deriveKeyFromSeedWithPath;
    function deriveKeyFromSeedWithExtendedPath(mnemonic, passphrase, path, network) {
        return wasm.WasmSdk.deriveKeyFromSeedWithExtendedPath(mnemonic, passphrase ?? null, path, network);
    }
    wallet.deriveKeyFromSeedWithExtendedPath = deriveKeyFromSeedWithExtendedPath;
    function deriveDashpayContactKey(mnemonic, passphrase, senderIdentityId, receiverIdentityId, account, addressIndex, network) {
        return wasm.WasmSdk.deriveDashpayContactKey(mnemonic, passphrase ?? null, senderIdentityId, receiverIdentityId, account, addressIndex, network);
    }
    wallet.deriveDashpayContactKey = deriveDashpayContactKey;
    function derivationPathBip44Mainnet(account, change, index) {
        return wasm.WasmSdk.derivationPathBip44Mainnet(account, change, index);
    }
    wallet.derivationPathBip44Mainnet = derivationPathBip44Mainnet;
    function derivationPathBip44Testnet(account, change, index) {
        return wasm.WasmSdk.derivationPathBip44Testnet(account, change, index);
    }
    wallet.derivationPathBip44Testnet = derivationPathBip44Testnet;
    function derivationPathDip9Mainnet(featureType, account, index) {
        return wasm.WasmSdk.derivationPathDip9Mainnet(featureType, account, index);
    }
    wallet.derivationPathDip9Mainnet = derivationPathDip9Mainnet;
    function derivationPathDip9Testnet(featureType, account, index) {
        return wasm.WasmSdk.derivationPathDip9Testnet(featureType, account, index);
    }
    wallet.derivationPathDip9Testnet = derivationPathDip9Testnet;
    function derivationPathDip13Mainnet(account) {
        return wasm.WasmSdk.derivationPathDip13Mainnet(account);
    }
    wallet.derivationPathDip13Mainnet = derivationPathDip13Mainnet;
    function derivationPathDip13Testnet(account) {
        return wasm.WasmSdk.derivationPathDip13Testnet(account);
    }
    wallet.derivationPathDip13Testnet = derivationPathDip13Testnet;
    function deriveChildPublicKey(xpub, index, hardened) {
        return wasm.WasmSdk.deriveChildPublicKey(xpub, index, hardened);
    }
    wallet.deriveChildPublicKey = deriveChildPublicKey;
    function xprvToXpub(xprv) {
        return wasm.WasmSdk.xprvToXpub(xprv);
    }
    wallet.xprvToXpub = xprvToXpub;
    function generateKeyPair(network) {
        return wasm.WasmSdk.generateKeyPair(network);
    }
    wallet.generateKeyPair = generateKeyPair;
    function generateKeyPairs(network, count) {
        return wasm.WasmSdk.generateKeyPairs(network, count);
    }
    wallet.generateKeyPairs = generateKeyPairs;
    function keyPairFromWif(privateKeyWif) {
        return wasm.WasmSdk.keyPairFromWif(privateKeyWif);
    }
    wallet.keyPairFromWif = keyPairFromWif;
    function keyPairFromHex(privateKeyHex, network) {
        return wasm.WasmSdk.keyPairFromHex(privateKeyHex, network);
    }
    wallet.keyPairFromHex = keyPairFromHex;
    function pubkeyToAddress(pubkeyHex, network) {
        return wasm.WasmSdk.pubkeyToAddress(pubkeyHex, network);
    }
    wallet.pubkeyToAddress = pubkeyToAddress;
    function validateAddress(address, network) {
        return wasm.WasmSdk.validateAddress(address, network);
    }
    wallet.validateAddress = validateAddress;
    function signMessage(message, privateKeyWif) {
        return wasm.WasmSdk.signMessage(message, privateKeyWif);
    }
    wallet.signMessage = signMessage;
})(wallet || (wallet = {}));
