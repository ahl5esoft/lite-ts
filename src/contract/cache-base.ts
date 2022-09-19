import { ITraceable } from './i-traceable';
import { RedisBase } from './redis-base';

/**
 * redis缓存
 */
export abstract class CacheBase implements ITraceable<CacheBase> {
    /**
     * 下次检测时间
     */
    private m_NextCheckOn = 0;
    /**
     * 当前时间
     */
    private m_Now = Date.now();
    /**
     * 缓存
     */
    private m_Value: { [key: string]: any };

    /**
     * 更新时间
     */
    public updateOn = 0;

    /**
     * 构造函数
     * 
     * @param redis redis
     * @param cacheKey 缓存键
     */
    public constructor(
        protected redis: RedisBase,
        protected cacheKey: string,
    ) { }

    /**
     * 刷新
     */
    public async flush() {
        this.m_NextCheckOn = Date.now();
        await this.redis.hset(
            'cache',
            this.cacheKey,
            Date.now().toString()
        );
    }

    /**
     * 获取
     * 
     * @param key 键
     */
    public async get<T>(key: string) {
        const now = Date.now();
        if (this.m_NextCheckOn < now) {
            const value = await this.redis.hget('cache', this.cacheKey);
            const lastCacheOn = parseInt(value) || this.m_Now;
            if (this.updateOn != lastCacheOn) {
                this.m_Value = await this.load();
                this.updateOn = lastCacheOn;
            }

            this.m_NextCheckOn = now + 5_000 + Math.floor(
                Math.random() * 55_000
            );
        }

        return this.m_Value[key] as T;
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父范围
     */
    public abstract withTrace(parentSpan: any): CacheBase;

    /**
     * 加载
     */
    protected abstract load(): Promise<{ [key: string]: any }>;
}