import { opentracing } from 'jaeger-client';

import { TracerStrategy } from '../tracer';
import { CacheBase, DbFactoryBase, ITraceable, RedisBase } from '../../contract';
import { global } from '../../model';

export class MongoConfigCache<T extends global.Config> extends CacheBase implements ITraceable<CacheBase> {
    public constructor(
        private m_DbFactory: DbFactoryBase,
        private m_Model: new () => T,
        redis: RedisBase,
        cacheKey: string,
    ) {
        super(redis, cacheKey);
    }

    public withTrace(parentSpan: opentracing.Span) {
        if (!parentSpan)
            return this;

        const self = new MongoConfigCache(
            new TracerStrategy(this.m_DbFactory).withTrace(parentSpan),
            this.m_Model,
            new TracerStrategy(this.redis).withTrace(parentSpan),
            this.cacheKey
        );
        self.nextCheckOn = this.nextCheckOn;
        self.updateOn = this.updateOn;
        self.value = this.value;
        return self;
    }

    protected async load() {
        const entries = await this.m_DbFactory.db(this.m_Model).query().toArray();
        return entries.reduce((memo, r) => {
            memo[r.id] = r.items;
            return memo;
        }, {});
    }
}