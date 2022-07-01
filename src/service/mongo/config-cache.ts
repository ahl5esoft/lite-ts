import { MemoryCache } from '../cache';
import { TracerStrategy } from '../tracer';
import { CacheBase, DbFactoryBase, ITraceable, NowTimeBase } from '../../contract';
import { global } from '../../model';

/**
 * mongo配置缓存
 */
export class MongoConfigCache extends CacheBase implements ITraceable<CacheBase> {
    private m_Cache: CacheBase;
    /**
     * 缓存
     */
    protected get cache() {
        if (!this.m_Cache) {
            this.m_Cache = new MemoryCache(this.m_NowTime, async () => {
                const entries = await this.m_DbFactory.db(global.Config).query().toArray();
                return entries.reduce((memo, r) => {
                    memo[r.id] = r.items;
                    return memo;
                }, {});
            }, this.m_CacheExpres);
        }

        return this.m_Cache;
    }

    /**
     * 构造函数
     * 
     * @param m_DbFactory 数据库工厂
     * @param m_NowTime 当前时间
     * @param m_CacheExpres 缓存过期时间
     */
    public constructor(
        private m_DbFactory: DbFactoryBase,
        private m_NowTime: NowTimeBase,
        private m_CacheExpres: number = null,
    ) {
        super();
    }

    /**
     * 清空
     */
    public flush() {
        this.cache.flush();
    }

    /**
     * 获取
     * 
     * @param key 键
     */
    public async get<T>(key: string) {
        return this.cache.get<T>(key);
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        if (!parentSpan)
            return this;

        const instance = new MongoConfigCache(
            new TracerStrategy(this.m_DbFactory).withTrace(parentSpan),
            this.m_NowTime,
        );
        instance.m_Cache = this.cache;
        return instance;
    }
}