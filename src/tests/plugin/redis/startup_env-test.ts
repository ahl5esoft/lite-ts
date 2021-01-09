import { notStrictEqual, strictEqual } from 'assert';
import Container from 'typedi';

import { RedisBase, RedisStartupHandler } from '../../../plugin/redis';
import { LockBase } from '../../../thread';

describe('src/plugin/db/mongo/startup.ts', (): void => {
    describe('.handling(ctx: IRedisStartupContext): Promise<void>', (): void => {
        it('redis', async (): Promise<void> => {
            let releaseAction: () => Promise<void>;
            await new RedisStartupHandler().handle({
                redis: {
                    host: '127.0.0.1',
                    port: 6379,
                },
                addReleaseRedis: (action: () => Promise<void>): void => {
                    releaseAction = action;
                }
            });
            if (releaseAction)
                await releaseAction();

            strictEqual(
                Container.has(RedisBase as any),
                true
            );
            Container.remove(RedisBase as any);
            notStrictEqual(releaseAction, undefined);
            strictEqual(
                Container.has(LockBase as any),
                false
            );
        });

        it('redisLock', async (): Promise<void> => {
            let releaseAction: () => Promise<void>;
            await new RedisStartupHandler().handle({
                redisLock: {
                    host: '127.0.0.1',
                    port: 6379,
                },
                addReleaseRedis: (action: () => Promise<void>): void => {
                    releaseAction = action;
                }
            });
            if (releaseAction)
                await releaseAction();

            strictEqual(
                Container.has(LockBase as any),
                true
            );
            Container.remove(LockBase as any);
            notStrictEqual(releaseAction, undefined);
            strictEqual(
                Container.has(RedisBase as any),
                false
            );
        });
    });
});