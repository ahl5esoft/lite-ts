import { TracerStrategy } from '../tracer';
import { CacheBase, ITraceable, RedisBase } from '../../contract';
import { opentracing } from 'jaeger-client';

export class RedisConfigCache extends CacheBase implements ITraceable<CacheBase> {
    public constructor(
        protected redisKey: string,
        redis: RedisBase,
        cacheKey: string,
    ) {
        super(redis, cacheKey);
    }

    public withTrace(parentSpan: opentracing.Span) {
        if (!parentSpan)
            return this;

        const self = new RedisConfigCache(
            this.redisKey,
            new TracerStrategy(this.redis).withTrace(parentSpan),
            this.cacheKey,
        );
        self.nextCheckOn = this.nextCheckOn;
        self.updateOn = this.updateOn;
        self.value = this.value;
        return self;
    }

    protected async load() {
        const v = await this.redis.hgetall(this.redisKey);
        return Object.entries(v).reduce((memo, [ck, cv]) => {
            memo[ck] = JSON.parse(cv);
            return memo;
        }, {});
    }
}