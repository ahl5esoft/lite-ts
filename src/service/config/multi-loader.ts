import { ConfigLoaderBase, ITraceable } from '../../contract';
import { TracerStrategy } from '../tracer';

/**
 * 多配置加载器
 */
export class MultiConfigLoader extends ConfigLoaderBase implements ITraceable<ConfigLoaderBase> {
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

    /**
     * 跟踪
     * 
     * @param parentSpan 父范围
     */
    public withTrace(parentSpan: any) {
        return parentSpan ? new MultiConfigLoader(
            this.m_ConfigLoaders.map(r => {
                return new TracerStrategy(r).withTrace(parentSpan);
            })
        ) : this;
    }
}