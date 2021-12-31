import { compare, genSalt, hash } from 'bcryptjs';

import { CryptBase } from '../../contract';

/**
 * bcrypt加解密
 */
export class BCrypt extends CryptBase {
    public static errDecrypt = new Error('bcrypt不支持解密');

    /**
     * 对比
     * 
     * @param plaintext 明文
     * @param cipherText 密文
     * 
     * @returns 是否匹配
     * 
     * @example
     * ```typescript
     *  import { hash } from 'bcryptjs';
     * 
     *  const plaintext = '12345';
     *  const cipherText = await hash(plaintext, 8);
     *  const crypt: CryptBase
     *  const res = await crypt.compare(plaintext, cipherText);
     *  // res = true
     * ```
     */
    public async compare(plaintext: string, cipherText: string): Promise<boolean> {
        return compare(plaintext, cipherText);
    }

    /**
     * 解密(不支持)
     */
    public async decrypt(): Promise<string> {
        throw BCrypt.errDecrypt;
    }

    /**
     * 加密
     * 
     * @param plaintext 明文
     * 
     * @returns 密文
     * 
     * @example
     * ```typescript
     *  import { compare } from 'bcryptjs';
     * 
     *  const crypt: CryptBase
     *  cosnt res = crypt.encrypt(plaintext);
     *  const res2 = await compare(plaintext, res);
     *  // res2 = true
     * ```
     */
    public async encrypt(plaintext: string): Promise<string> {
        const salt = await genSalt();
        return hash(plaintext, salt);
    }
}