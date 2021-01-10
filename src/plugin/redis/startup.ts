import * as IORedis from 'ioredis';
import Container from 'typedi';

import { RedisBase } from './base';
import { RedisLock } from './lock';
import { IORedisAdapter } from './ioredis-adapter';
import { CORHandlerBase } from '../../dp/cor';
import { LockBase } from '../../thread';

export class RedisStartupHandler extends CORHandlerBase {
    protected async handling(ctx: IRedisStartupContext): Promise<void> {
        if (ctx.redis) {
            const redis = new IORedisAdapter(ctx.redis);
            Container.set(RedisBase, redis);

            ctx.addReleaseRedis(async (): Promise<void> => {
                redis.close();
            });
        }

        if (ctx.redisLock) {
            const redis = new IORedisAdapter(ctx.redisLock);
            Container.set(
                LockBase,
                new RedisLock(redis)
            );

            ctx.addReleaseRedis(async (): Promise<void> => {
                redis.close();
            });
        }
    }
}

export interface IRedisStartupContext {
    redis?: IORedis.RedisOptions | IORedis.ClusterNode[];
    redisLock?: IORedis.RedisOptions | IORedis.ClusterNode[];
    addReleaseRedis(action: () => Promise<void>): void;
} 