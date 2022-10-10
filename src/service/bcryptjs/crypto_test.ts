import { ok, strictEqual } from 'assert';
import { compare, hash } from 'bcryptjs';

import { BcryptjsCrypto as Self } from './crypto';
import { CryptoBase } from '../../contract';

describe('src/service/bcryptjs/crypto.ts', () => {
    describe('.compare(plaintext: string, cipherText: string)', () => {
        it('ok', async () => {
            const plaintext = '12345';
            const cipherText = await hash(plaintext, 8);
            const res = await new Self().compare(plaintext, cipherText);
            ok(res);
        });
    });

    describe('.decrypt()', () => {
        it('ok', async () => {
            let err: Error;
            try {
                await (new Self() as CryptoBase).decrypt('cipher-text');
            } catch (ex) {
                err = ex;
            } finally {
                strictEqual(err, Self.errDecrypt);
            }
        });
    });

    describe('.encrypt(plaintext: string)', () => {
        it('ok', async () => {
            const plaintext = '123456';
            let res1 = await new Self().encrypt(plaintext);
            let res2 = await compare(plaintext, res1);
            ok(res2);
        });
    });
});