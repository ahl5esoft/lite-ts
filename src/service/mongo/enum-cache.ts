import { TracerStrategy } from '../tracer';
import { CacheBase, DbFactoryBase, EnumCacheBase, ITraceable, RedisBase } from '../../contract';
import { global } from '../../model';

export class MongoEnumCache<T extends global.Enum> extends EnumCacheBase implements ITraceable<CacheBase> {
    public constructor(
        private m_DbFactory: DbFactoryBase,
        private m_Model: new () => T,
        redis: RedisBase,
        cacheKey: string,
    ) {
        super(redis, cacheKey);
    }

    public withTrace(parentSpan: any) {
        return parentSpan ? new MongoEnumCache(
            new TracerStrategy(this.m_DbFactory).withTrace(parentSpan),
            this.m_Model,
            new TracerStrategy(this.redis).withTrace(parentSpan),
            this.cacheKey,
        ) : this;
    }

    protected async find() {
        return await this.m_DbFactory.db(global.Enum).query().toArray();
    }
}