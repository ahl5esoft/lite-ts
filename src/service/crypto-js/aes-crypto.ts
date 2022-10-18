import cryptoJs from 'crypto-js';

import { CryptoBase } from '../../contract';

export class CryptoJsAESCrypto extends CryptoBase {
    public constructor(private m_SecretKey: string) {
        super();
    }

    public async compare(plaintext: string, cipherText: string) {
        const res = await this.decrypt(cipherText);
        return plaintext == res;
    }

    public async encrypt(plaintext: string) {
        return cryptoJs.AES.encrypt(plaintext, this.m_SecretKey).toString();
    }

    public async decrypt(cipherText: string) {
        return cryptoJs.AES.decrypt(cipherText, this.m_SecretKey).toString(cryptoJs.enc.Utf8);
    }
}