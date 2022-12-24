import { EnumCacheBase } from '../enum';
import { TracerStrategy } from '../tracer';
import { DbFactoryBase, RedisBase } from '../../contract';
import { global } from '../../model';

export class MongoEnumCache<T extends global.Enum> extends EnumCacheBase {
    /**
     * 构造函数
     * 
     * @param m_DbFactory 数据库工厂
     * @param redis redis
     * @param cacheKey 缓存键
     */
    public constructor(
        private m_DbFactory: DbFactoryBase,
        private m_Model: new () => T,
        redis: RedisBase,
        cacheKey: string,
        sep: string,
    ) {
        super(sep, redis, cacheKey);
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父范围
     */
    public withTrace(parentSpan: any) {
        if (!parentSpan)
            return this;

        const cache = new MongoEnumCache(
            new TracerStrategy(this.m_DbFactory).withTrace(parentSpan),
            this.m_Model,
            new TracerStrategy(this.redis).withTrace(parentSpan),
            this.cacheKey,
            this.sep,
        );
        cache.updateOn = this.updateOn;
        cache.nextCheckOn = this.nextCheckOn;
        cache.value = this.value;
        return cache;
    }

    /**
     * 获取枚举数据
     */
    protected async find() {
        return await this.m_DbFactory.db(global.Enum).query().toArray();
    }
}