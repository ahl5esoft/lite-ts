/**
 * 缓存接口
 */
export abstract class CacheBase {
    /**
     * 清空
     */
    public abstract flush(): void;
    /**
     * 获取
     * 
     * @param key 键 
     */
    public abstract get<T>(key: string): Promise<T>;
}