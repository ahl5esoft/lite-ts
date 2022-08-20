import moment from 'moment';

import { CacheBase, RedisBase } from '../../contract';

/**
 * redis缓存
 */
export class RedisCache extends CacheBase {
    /**
     * 缓存
     */
    private m_Cache: { [key: string]: any };
    /**
     * 缓存时间
     */
    private m_CacheOn = 0;
    /**
     * 当前时间
     */
    private m_Now = moment().unix();

    /**
     * 构造函数
     * 
     * @param m_Redis redis
     * @param m_CacheKey 缓存键
     * @param m_LoadFunc 加载函数
     */
    public constructor(
        private m_Redis: RedisBase,
        private m_CacheKey: string,
        private m_LoadFunc: () => Promise<{ [key: string]: any }>,
    ) {
        super();
    }

    /**
     * 刷新
     */
    public async flush() {
        await this.m_Redis.hset(
            'cache',
            this.m_CacheKey,
            moment().unix().toString()
        );
    }

    /**
     * 获取
     * 
     * @param key 键
     */
    public async get<T>(key: string) {
        const value = await this.m_Redis.hget('cache', this.m_CacheKey);
        const lastCacheOn = parseInt(value) || this.m_Now;
        if (this.m_CacheOn != lastCacheOn) {
            this.m_Cache = await this.m_LoadFunc();
            this.m_CacheOn = lastCacheOn;
        }

        return this.m_Cache[key] as T;
    }
}