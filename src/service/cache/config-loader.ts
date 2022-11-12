import { TracerStrategy } from '../tracer';
import { CacheBase, ConfigLoaderBase, ITraceable } from '../../contract';

export class CacheConfigLoader extends ConfigLoaderBase implements ITraceable<ConfigLoaderBase> {
    public constructor(
        private m_Cache: CacheBase
    ) {
        super();
    }

    public async load<T>(ctor: new () => T) {
        return this.m_Cache.get<T>(ctor.name);
    }

    public withTrace(parentSpan: any) {
        return parentSpan ? new CacheConfigLoader(
            new TracerStrategy(this.m_Cache).withTrace(parentSpan),
        ) : this;
    }
}