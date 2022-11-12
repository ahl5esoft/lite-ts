import { TracerStrategy } from '../tracer';
import { ConfigLoaderBase, ITraceable } from '../../contract';

export class MultiConfigLoader extends ConfigLoaderBase implements ITraceable<ConfigLoaderBase> {
    public constructor(
        private m_ConfigLoaders: ConfigLoaderBase[]
    ) {
        super();
    }

    public async load<T>(ctor: new () => T) {
        for (const r of this.m_ConfigLoaders) {
            const v = await r.load(ctor);
            if (v)
                return v;
        }
    }

    public withTrace(parentSpan: any) {
        return parentSpan ? new MultiConfigLoader(
            this.m_ConfigLoaders.map(r => {
                return new TracerStrategy(r).withTrace(parentSpan);
            })
        ) : this;
    }
}