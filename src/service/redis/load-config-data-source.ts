import { RedisBase } from '../../contract';

/**
 * 加载配置数据源(redis)
 * 
 * @param redis redis
 * @param redisKey redis键
 */
export async function loadRedisConfigDataSource(redis: RedisBase, redisKey: string) {
    const v = await redis.hgetall(redisKey);
    return Object.entries(v).reduce((memo, [ck, cv]) => {
        memo[ck] = JSON.parse(cv);
        return memo;
    }, {});
}