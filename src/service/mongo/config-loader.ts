import { MemoryCache } from '../cache';
import { ConfigLoaderBase, DbFactoryBase, ICache, NowTimeBase } from '../../contract';
import { global } from '../../model';

/**
 * mongo配置加载器
 */
export class MongoConfigLoader extends ConfigLoaderBase {
    /**
     * 缓存实例
     */
    protected get cache() {
        if (!this.m_Cache) {
            this.m_Cache = new MemoryCache(this.m_NowTime, async () => {
                const entries = await this.m_DbFactory.db(global.Config).query().toArray();
                return entries.reduce((memo, r) => {
                    memo[r.id] = r.items;
                    return memo;
                }, {});
            });
        }

        return this.m_Cache;
    }

    /**
     * 构造函数
     * 
     * @param m_DbFactory 数据库工厂
     * @param m_NowTime 当前时间
     * @param m_Cache 缓存
     */
    public constructor(
        private m_DbFactory: DbFactoryBase,
        private m_NowTime: NowTimeBase,
        private m_Cache?: ICache,
    ) {
        super();
    }

    /**
     * 加载配置
     * 
     * @param ctor 构造函数
     */
    public async load<T>(ctor: new () => T) {
        return this.cache.get<T>(ctor.name);
    }
}