import { TracerStrategy } from '../tracer';
import { CacheBase, RedisBase } from '../../contract';

/**
 * 配置缓存
 */
export class RedisConfigCache extends CacheBase {
    /**
     * 构造函数
     * 
     * @param m_RedisKey redis键
     * @param redis redis
     * @param cacheKey 缓存键
     */
    public constructor(
        private m_RedisKey: string,
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
        return parentSpan ? new RedisConfigCache(
            this.m_RedisKey,
            new TracerStrategy(this.redis).withTrace(parentSpan),
            this.cacheKey
        ) : this;
    }

    /**
     * 加载
     */
    protected async load() {
        const v = await this.redis.hgetall(this.m_RedisKey);
        return Object.entries(v).reduce((memo, [ck, cv]) => {
            memo[ck] = JSON.parse(cv);
            return memo;
        }, {});
    }
}