/**
 * 锁接口
 */
export abstract class LockBase {
    /**
     * 加锁
     * 
     * @param key 键
     * @param seconds 锁过期时间
     * 
     * @returns 解锁函数
     */
    public abstract lock(key: string, seconds: number): Promise<() => Promise<void>>;
}