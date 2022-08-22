/**
 * 数值类型服务基类
 */
export abstract class ValueTypeServiceBase {
    /**
     * 获取
     * 
     * @param key 键
     */
    public abstract get<T>(key: string): Promise<T>;
}