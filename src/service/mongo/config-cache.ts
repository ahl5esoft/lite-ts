import { TracerStrategy } from '../tracer';
import { CacheBase, DbFactoryBase, RedisBase } from '../../contract';
import { global } from '../../model';

/**
 * mongo配置缓存
 */
export class MongoConfigCache<T extends global.Config> extends CacheBase {
    /**
     * 构造函数
     * 
     * @param m_DbFactory 数据库工厂
     * @param m_Model 模型
     * @param redis redis
     * @param cacheKey redis键
     */
    public constructor(
        private m_DbFactory: DbFactoryBase,
        private m_Model: new () => T,
        redis: RedisBase,
        cacheKey: string,
    ) {
        super(redis, cacheKey);
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父范围
     */
    public withTrace(parentSpan: any) {
        return parentSpan ? new MongoConfigCache(
            new TracerStrategy(this.m_DbFactory).withTrace(parentSpan),
            this.m_Model,
            new TracerStrategy(this.redis).withTrace(parentSpan),
            this.cacheKey
        ) : this;
    }

    /**
     * 加载
     */
    protected async load() {
        const entries = await this.m_DbFactory.db(this.m_Model).query().toArray();
        return entries.reduce((memo, r) => {
            memo[r.id] = r.items;
            return memo;
        }, {});
    }
}

/**
 * 加载配置数据源(mongo)
 * 
 * @param dbFactory 数据库工厂
 * @param model 模型
 */
export async function loadMongoConfigDataSource<T extends global.Config>(dbFactory: DbFactoryBase, model: new () => T) {
    const entries = await dbFactory.db(model).query().toArray();
    return entries.reduce((memo, r) => {
        memo[r.id] = r.items;
        return memo;
    }, {});
}