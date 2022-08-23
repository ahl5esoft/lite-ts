/**
 * 缓存接口
 */
export abstract class CacheBase {
    /**
     * 更新时间
     */
    public abstract get updateOn(): number;
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