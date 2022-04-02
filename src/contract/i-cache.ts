/**
 * 缓存接口
 */
export interface ICache {
    /**
     * 清空
     */
    flush(): void;
    /**
     * 获取
     * 
     * @param key 键 
     */
    get<T>(key: string): Promise<T>;
}