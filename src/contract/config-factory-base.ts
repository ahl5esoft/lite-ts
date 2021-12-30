import { IConfig } from './i-config';

/**
 * 配置工厂
 */
export abstract class ConfigFactoryBase {
    /**
     * 创建配置对象
     * 
     * @param ctor 配置类构造函数
     */
    public abstract build<T>(ctor: new () => T): IConfig<T>;
}