import { TracerStrategy } from '../tracer';
import { CacheBase, RedisBase, RpcBase } from '../../contract';

export class RpcConfigCache extends CacheBase {

    public constructor(
        private m_App: string,
        private m_CacheKey: string,
        private m_Redis: RedisBase,
        private m_Rpc: RpcBase,
    ) {
        super(m_Redis, m_CacheKey);
    }

    public withTrace(parentSpan: any): CacheBase {
        if (!parentSpan)
            return this;

        const cache = new RpcConfigCache(
            this.m_App,
            this.m_CacheKey,
            new TracerStrategy(this.m_Redis).withTrace(parentSpan),
            new TracerStrategy(this.m_Rpc).withTrace(parentSpan),
        );
        cache.updateOn = this.updateOn;
        cache.nextCheckOn = this.nextCheckOn;
        cache.value = this.value;
        return cache;
    }

    protected async load() {
        const res = await this.m_Rpc.call<{ id: string; items: any; }[]>(`/${this.m_App}/find-all-config`);
        return res.data.reduce((memo, r) => {
            memo[r.id] = r.items;
            return memo;
        }, {});
    }
}