import { strictEqual } from 'assert';
import cryptoJs from 'crypto-js';

import { CryptoJsAESCrypto as Self } from './aes-crypto';

const secretKey = '12345678901234567890123456789012';

describe('src/service/crypto-js/aes-crypt.ts', () => {
    describe('.compare(plaintext: string, cipherText: string)', () => {
        it('ok', async () => {
            const self = new Self(secretKey);

            const res = await self.compare(
                'hello',
                cryptoJs.AES.encrypt('hello', secretKey).toString(),
            );
            strictEqual(res, true);
        });
    });

    describe('.encrypt(plaintext: string)', () => {
        it('ok', async () => {
            const self = new Self(secretKey);

            const res = await self.encrypt('hello');
            strictEqual(
                cryptoJs.AES.decrypt(res, secretKey).toString(cryptoJs.enc.Utf8),
                'hello',
            );
        });
    });

    describe('.decrypt(cipherText: string)', () => {
        it('ok', async () => {
            const self = new Self(secretKey);

            const res = await self.decrypt(
                cryptoJs.AES.encrypt('hello', secretKey).toString(),
            );
            strictEqual(res, 'hello');
        });
    });
});