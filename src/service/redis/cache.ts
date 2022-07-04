import moment from 'moment';

import { CacheBase, RedisBase } from '../../contract';

/**
 * redis缓存
 */
export class RedisCase extends CacheBase {
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
     * redis键
     */
    private m_RedisKey: string;

    /**
     * 构造函数
     * 
     * @param m_Redis redis
     * @param m_LoadFunc 加载函数
     * @param key 缓存键
     */
    public constructor(
        private m_Redis: RedisBase,
        private m_LoadFunc: () => Promise<{ [key: string]: any }>,
        key: string,
    ) {
        super();

        this.m_RedisKey = ['cache', key].join(':');
    }

    /**
     * 刷新
     */
    public flush() {
        this.m_CacheOn = 0;
    }

    /**
     * 获取
     * 
     * @param key 键
     */
    public async get<T>(key: string) {
        const value = await this.m_Redis.get(this.m_RedisKey);
        let oldCacheOn = parseInt(value);
        if (isNaN(oldCacheOn))
            oldCacheOn = this.m_Now;
        if (this.m_CacheOn != oldCacheOn) {
            this.m_Cache = await this.m_LoadFunc();
            this.m_CacheOn = oldCacheOn;
        }

        return this.m_Cache[key] as T;
    }
}