/**
 * 配置接口
 */
export interface IConfig<T> {
    /**
     * 获取配置数据
     */
    get(): Promise<T>;
}