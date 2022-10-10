import { compare, genSalt, hash } from 'bcryptjs';

import { CryptoBase } from '../../contract';

export class BcryptjsCrypto extends CryptoBase {
    public static errDecrypt = new Error('bcrypt不支持解密');

    /**
     * @example
     * ```typescript
     *  const crypt: CryptBase
     *  const res = await crypt.compare(明文, 密文);
     *  // res = true
     * ```
     */
    public async compare(plaintext: string, cipherText: string): Promise<boolean> {
        return compare(plaintext, cipherText);
    }

    public async decrypt(): Promise<string> {
        throw BcryptjsCrypto.errDecrypt;
    }

    /**
     * @example
     * ```typescript
     *  cosnt res = crypt.encrypt(明文);
     *  const res2 = await compare(明文, res);
     *  // res2 = true
     * ```
     */
    public async encrypt(plaintext: string): Promise<string> {
        const salt = await genSalt();
        return hash(plaintext, salt);
    }
}