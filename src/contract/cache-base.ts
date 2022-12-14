import { MutexBase } from './mutex-base';
import { RedisBase } from './redis-base';

export abstract class CacheBase {
    public static mutex: MutexBase;

    private m_NextCheckOn = 0;
    private m_Value: { [key: string]: any };

    public updateOn = 0;

    public constructor(
        protected redis: RedisBase,
        protected cacheKey: string,
    ) { }

    public async flush() {
        this.m_NextCheckOn = 0;
        await this.redis.hset(
            'cache',
            this.cacheKey,
            Date.now().toString()
        );
    }

    public async get<T>(key: string) {
        if (!CacheBase.mutex)
            throw new Error(`${this.constructor.name}.mutex: 未初始化`);
        
        const now = Date.now();
        if (this.m_NextCheckOn < now) {
            const unlock = await CacheBase.mutex.lock();
            try {
                if (this.m_NextCheckOn < now) {
                    const value = await this.redis.hget('cache', this.cacheKey);
                    const lastCacheOn = parseInt(value) || now;
                    if (this.updateOn != lastCacheOn) {
                        this.m_Value = await this.load();
                        this.updateOn = lastCacheOn;
                    }
    
                    this.m_NextCheckOn = now + 5_000 + Math.floor(
                        Math.random() * 55_000
                    );
                }
            } finally {
               await unlock();
            }
        }

        return this.m_Value[key] as T;
    }

    protected abstract load(): Promise<{ [key: string]: any }>;
}