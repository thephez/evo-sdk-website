export declare namespace wallet {
    function generateMnemonic(wordCount?: number, languageCode?: string): string;
    function validateMnemonic(mnemonic: string, languageCode?: string): boolean;
    function mnemonicToSeed(mnemonic: string, passphrase?: string): Uint8Array;
    function deriveKeyFromSeedPhrase(mnemonic: string, passphrase: string | null | undefined, network: string): any;
    function deriveKeyFromSeedWithPath(mnemonic: string, passphrase: string | null | undefined, path: string, network: string): any;
    function deriveKeyFromSeedWithExtendedPath(mnemonic: string, passphrase: string | null | undefined, path: string, network: string): any;
    function deriveDashpayContactKey(mnemonic: string, passphrase: string | null | undefined, senderIdentityId: string, receiverIdentityId: string, account: number, addressIndex: number, network: string): any;
    function derivationPathBip44Mainnet(account: number, change: number, index: number): any;
    function derivationPathBip44Testnet(account: number, change: number, index: number): any;
    function derivationPathDip9Mainnet(featureType: number, account: number, index: number): any;
    function derivationPathDip9Testnet(featureType: number, account: number, index: number): any;
    function derivationPathDip13Mainnet(account: number): any;
    function derivationPathDip13Testnet(account: number): any;
    function deriveChildPublicKey(xpub: string, index: number, hardened: boolean): string;
    function xprvToXpub(xprv: string): string;
    function generateKeyPair(network: string): any;
    function generateKeyPairs(network: string, count: number): any[];
    function keyPairFromWif(privateKeyWif: string): any;
    function keyPairFromHex(privateKeyHex: string, network: string): any;
    function pubkeyToAddress(pubkeyHex: string, network: string): string;
    function validateAddress(address: string, network: string): boolean;
    function signMessage(message: string, privateKeyWif: string): string;
}
