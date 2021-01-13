import * as IORedis from 'ioredis';
import Container from 'typedi';

import { IORedisAdapter } from './ioredis';
import { RedisLock } from './lock';
import { LockBase } from '../../thread';
import { CORHandlerBase } from '../../dp/cor';

export class RedisLockStartupHandler extends CORHandlerBase {
    protected async handling(ctx: IRedisLockStartupContext): Promise<void> {
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

export interface IRedisLockStartupContext {
    redisLock?: IORedis.RedisOptions | IORedis.ClusterNode[];
    addReleaseRedis(action: () => Promise<void>): void;
}