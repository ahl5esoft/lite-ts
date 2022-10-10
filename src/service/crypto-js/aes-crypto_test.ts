import { strictEqual } from 'assert';
import cryptoJs from 'crypto-js';

import { CryptoJsAESCrypto as Self } from './aes-crypto';

const cfg = {
    iv: cryptoJs.enc.Utf8.parse('iv12345678901234'),
    key: cryptoJs.enc.Utf8.parse('key1234567890123'),
    mode: cryptoJs.mode.CBC,
    padding: cryptoJs.pad.Pkcs7
};

describe('src/service/crypto-js/aes-crypt.ts', () => {
    describe('.compare(plaintext: string, cipherText: string)', () => {
        it('ok', async () => {
            const self = new Self(async () => {
                return cfg;
            });

            const res = await self.compare(
                'hello',
                cryptoJs.AES.encrypt('hello', cfg.key, {
                    iv: cfg.iv,
                    mode: cfg.mode,
                    padding: cfg.padding
                }).toString(),
            );
            strictEqual(res, true);
        });
    });

    describe('.encrypt(plaintext: string)', () => {
        it('ok', async () => {
            const self = new Self(async () => {
                return cfg;
            });

            const res = await self.encrypt('hello');
            strictEqual(
                res,
                cryptoJs.AES.encrypt('hello', cfg.key, {
                    iv: cfg.iv,
                    mode: cfg.mode,
                    padding: cfg.padding
                }).toString(),
            );
        });
    });

    describe('.decrypt(cipherText: string)', () => {
        it('ok', async () => {
            const self = new Self(async () => {
                return cfg;
            });

            const res = await self.decrypt(
                cryptoJs.AES.encrypt('hello', cfg.key, {
                    iv: cfg.iv,
                    mode: cfg.mode,
                    padding: cfg.padding
                }).toString(),
            );
            strictEqual(res, 'hello');
        });
    });
});