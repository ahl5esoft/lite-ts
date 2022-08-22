/**
 * 缓存接口
 */
export abstract class CacheBase {
    /**
     * 是否过期
     */
    public abstract get isExpired(): Promise<[boolean, number]>;
    /**
     * 清空
     */
    public abstract flush(): Promise<void>;
    /**
     * 获取
     * 
     * @param key 键 
     */
    public abstract get<T>(key: string): Promise<T>;
}