/**
 * 加解密基类
 */
export abstract class CryptBase {
    /**
     * 
     * @param cipherText 密文
     * 
     * @returns 明文
     */
    public abstract decrypt(cipherText: string): Promise<string>;

    /**
     * @param plaintext 明文
     * 
     * @returns 密文
     */
    public abstract encrypt(plaintext: string): Promise<string>;

    /**
     * 
     * @param plaintext 明文
     * @param cipherText 密文
     * 
     * @returns 是否匹配
     */
    public abstract compare(plaintext: string, cipherText: string): Promise<boolean>;
}