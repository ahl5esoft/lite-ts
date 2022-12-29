import { TracerStrategy } from '../tracer';
import { EnumCacheBase, RedisBase, RpcBase } from '../../contract';
import { global } from '../../model';

export class RpcEnumCache extends EnumCacheBase {
    public constructor(
        protected rpc: RpcBase,
        protected app: string,
        redis: RedisBase,
        cacheKey: string,
    ) {
        super(redis, cacheKey);
    }

    public withTrace(parentSpan: any) {
        return parentSpan ? new RpcEnumCache(
            new TracerStrategy(this.rpc).withTrace(parentSpan),
            this.app,
            new TracerStrategy(this.redis).withTrace(parentSpan),
            this.cacheKey,
        ) : this;
    }

    protected async find() {
        return await this.rpc.call<global.Enum[]>({
            route: `/${this.app}/find-all-enums`
        });
    }
}
