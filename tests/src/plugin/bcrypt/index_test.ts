import { ok, strictEqual } from 'assert';
import { compare, hash } from 'bcryptjs';

import { BCrypt as Self, CryptBase } from '../../../../src';

describe('src/plugin/bcrypt/index.ts', () => {
    describe('.decrypt(): Promise<string>', () => {
        it('ok', async () => {
            let err: Error;
            try {
                await (new Self() as CryptBase).decrypt('cipher-text');
            } catch (ex) {
                err = ex;
            } finally {
                strictEqual(err, Self.errDecrypt);
            }
        });
    });

    describe('.encrypt(plaintext: string): Promise<string>', () => {
        it('ok', async () => {
            const plaintext = '123456';
            let res1 = await new Self().encrypt(plaintext);
            let res2 = await compare(plaintext, res1);
            ok(res2);
        });
    });

    describe('.compare(plaintext: string, cipherText: string): Promise<boolean>', () => {
        it('ok', async () => {
            const plaintext = '12345';
            const cipherText = await hash(plaintext, 8);
            const res = await new Self().compare(plaintext, cipherText);
            ok(res);
        });
    });
});