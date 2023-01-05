import { opentracing } from 'jaeger-client';

import { TracerStrategy } from '../tracer';
import { EnumCacheBase, RedisBase, RpcBase } from '../../contract';
import { global } from '../../model';

export class RpcEnumCache extends EnumCacheBase {
    public constructor(
        protected rpc: RpcBase,
        protected app: string,
        protected rpcBody: any,
        redis: RedisBase,
        cacheKey: string,
    ) {
        super(redis, cacheKey);
    }

    public withTrace(parentSpan: opentracing.Span) {
        if (!parentSpan)
            return this;

        const self = new RpcEnumCache(
            new TracerStrategy(this.rpc).withTrace(parentSpan),
            this.app,
            this.rpcBody,
            new TracerStrategy(this.redis).withTrace(parentSpan),
            this.cacheKey,
        );
        self.nextCheckOn = this.nextCheckOn;
        self.updateOn = this.updateOn;
        self.value = this.value;
        return self;
    }

    protected async find() {
        return await this.rpc.call<global.Enum[]>({
            body: this.rpcBody,
            route: `/${this.app}/find-all-enums`
        });
    }
}
