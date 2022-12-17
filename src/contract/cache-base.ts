import { RedisBase } from './redis-base';

export abstract class CacheBase {
    private m_NextCheckOn = 0;
    private m_Value: { [key: string]: any };

    public updateOn = 0;

    public constructor(
        protected redis: RedisBase,
        protected cacheKey: string,
    ) { }

    /**
     * 清空
     * 
     * @example
     * ```typescript
     *  const cache: CacheBase;
     *  await cache.flush();
     * ```
     */
    public async flush() {
        this.m_NextCheckOn = 0;
        await this.redis.hset(
            'cache',
            this.cacheKey,
            Date.now().toString()
        );
    }

    /**
     * 获取
     * 
     * @example
     * ```typescript
     *  const cache: CacheBase;
     *  const res = await cache.get<T>('key');
     * ```
     */
    public async get<T>(key: string) {
        const now = Date.now();
        if (this.m_NextCheckOn < now) {
            const value = await this.redis.hget('cache', this.cacheKey);
            const lastCacheOn = parseInt(value) || now;
            if (this.updateOn != lastCacheOn) {
                this.updateOn = lastCacheOn;
                this.m_Value = await this.load();
            }

            this.m_NextCheckOn = now + 5_000 + Math.floor(
                Math.random() * 55_000
            );
        }

        return this.m_Value[key] as T;
    }

    protected abstract load(): Promise<{ [key: string]: any }>;
}