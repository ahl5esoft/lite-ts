import * as IORedis from 'ioredis';
import Container from 'typedi';

import { RedisBase } from './base';
import { IORedisAdapter } from './ioredis';
import { CORHandlerBase } from '../../dp/cor';

export class RedisStartupHandler extends CORHandlerBase {
    protected async handling(ctx: IRedisStartupContext): Promise<void> {
        if (ctx.redis) {
            const redis = new IORedisAdapter(ctx.redis);
            Container.set(RedisBase, redis);

            ctx.addReleaseRedis(async (): Promise<void> => {
                redis.close();
            });
        }
    }
}

export interface IRedisStartupContext {
    redis?: IORedis.RedisOptions | IORedis.ClusterNode[];
    addReleaseRedis(action: () => Promise<void>): void;
} 