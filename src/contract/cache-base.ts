import { RedisBase } from './redis-base';

export abstract class CacheBase {
    protected nextCheckOn = 0;
    protected value: { [key: string]: any };

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
        this.nextCheckOn = 0;
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
        if (this.nextCheckOn < now) {
            const value = await this.redis.hget('cache', this.cacheKey);
            const lastCacheOn = parseInt(value) || now;
            if (this.updateOn != lastCacheOn) {
                this.updateOn = lastCacheOn;
                this.value = await this.load();
            }

            this.nextCheckOn = now + 5_000 + Math.floor(
                Math.random() * 55_000
            );
        }

        return this.value[key] as T;
    }

    protected abstract load(): Promise<{ [key: string]: any }>;
}