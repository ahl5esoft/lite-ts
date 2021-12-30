/**
 * 配置接口
 */
export interface IConfig<T> {
    /**
     * 获取配置数据
     * 
     * @example
     * ```typescript
     *  class Default {
     *      public name: string;
     *  }
     * 
     *  const configFactory: ConfigFactoryBase;
     *  const defaultConfig = await configFactory.build(Default).get();
     *  // defaultConfig = Defualt配置数据
     * ```
     */
    get(): Promise<T>;
}