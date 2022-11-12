import { TracerStrategy } from '../tracer';
import { EnumCacheBase, RedisBase, RpcBase } from '../../contract';
import { global } from '../../model';

export class RpcEnumCache extends EnumCacheBase {
    public constructor(
        private m_Rpc: RpcBase,
        private m_App: string,
        redis: RedisBase,
        cacheKey: string,
        sep: string,
    ) {
        super(sep, redis, cacheKey);
    }

    public withTrace(parentSpan: any) {
        return parentSpan ? new RpcEnumCache(
            new TracerStrategy(this.m_Rpc).withTrace(parentSpan),
            this.m_App,
            new TracerStrategy(this.redis).withTrace(parentSpan),
            this.cacheKey,
            this.sep
        ) : this;
    }

    protected async find() {
        return await this.m_Rpc.call<global.Enum[]>({
            route: `/${this.m_App}/find-all-enums`
        });
    }
}
