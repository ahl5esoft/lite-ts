import { ConfigLoaderBase } from '../../contract';

/**
 * 多配置加载器
 */
export class MultiConfigLoader extends ConfigLoaderBase {
    /**
     * 构造函数
     * 
     * @param m_ConfigLoaders 原配置加载器数组
     */
    public constructor(
        private m_ConfigLoaders: ConfigLoaderBase[]
    ) {
        super();
    }

    /**
     * 加载
     * 
     * @param ctor 构造函数
     */
    public async load<T>(ctor: new () => T) {
        for (const r of this.m_ConfigLoaders) {
            const v = await r.load(ctor);
            if (v)
                return v;
        }
    }
}