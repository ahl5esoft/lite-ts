import { compare, genSalt, hash } from 'bcryptjs';

import { CryptoBase } from '../../crypto';

export class BCrypt extends CryptoBase {
    public static errDecrypt = new Error('bcrypt不支持解密');

    public async decrypt(): Promise<string> {
        throw BCrypt.errDecrypt;
    }

    public async encrypt(plaintext: string): Promise<string> {
        const salt = await genSalt();
        return hash(plaintext, salt);
    }

    public async compare(plaintext: string, cipherText: string): Promise<boolean> {
        return compare(plaintext, cipherText);
    }
}