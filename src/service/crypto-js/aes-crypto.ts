import cryptoJs from 'crypto-js';

import { CryptoBase } from '../../contract';

interface IConfig {
    iv: cryptoJs.lib.WordArray;
    key: cryptoJs.lib.WordArray;
    mode: any;
    padding: any;
}

export class CryptoJsAESCrypto extends CryptoBase {
    public constructor(
        private m_GetConfigFunc: () => Promise<IConfig>,
    ) {
        super();
    }

    public async compare(plaintext: string, cipherText: string) {
        const res = await this.decrypt(cipherText);
        return plaintext == res;
    }

    public async encrypt(plaintext: string) {
        const cfg = await this.m_GetConfigFunc();
        return cryptoJs.AES.encrypt(plaintext, cfg.key, {
            iv: cfg.iv,
            mode: cfg.mode,
            padding: cfg.padding
        }).toString();
    }

    public async decrypt(cipherText: string) {
        const cfg = await this.m_GetConfigFunc();
        return cryptoJs.AES.decrypt(cipherText, cfg.key, {
            iv: cfg.iv,
            mode: cfg.mode,
            padding: cfg.padding
        }).toString(cryptoJs.enc.Utf8);
    }
}