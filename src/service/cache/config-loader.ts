import { TracerStrategy } from '../tracer';
import { CacheBase, ConfigLoaderBase, ITraceable } from '../../contract';

/**
 * 配置加载器(缓存)
 */
export class CacheConfigLoader extends ConfigLoaderBase implements ITraceable<ConfigLoaderBase> {
    /**
     * 构造函数
     * 
     * @param m_Cache 缓存
     */
    public constructor(
        private m_Cache: CacheBase
    ) {
        super();
    }

    /**
     * 加载
     * 
     * @param ctor 配置构造函数
     */
    public async load<T>(ctor: new () => T) {
        return this.m_Cache.get<T>(ctor.name);
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        return new CacheConfigLoader(
            new TracerStrategy(this.m_Cache).withTrace(parentSpan),
        );
    }
}