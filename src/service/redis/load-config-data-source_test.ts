import { deepStrictEqual } from 'assert';

import { loadRedisConfigDataSource as self } from './load-config-data-source';
import { Mock } from '../assert';
import { RedisBase } from '../../contract';

describe('src/service/redis/load-config-data-source.ts', () => {
    describe('.loadRedisConfigDataSource(redis: RedisBase, redisKey: string)', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();

            mockRedis.expectReturn(
                r => r.hgetall('redis-key'),
                {
                    a: JSON.stringify({
                        a1: 1,
                        a2: 2
                    }),
                    b: JSON.stringify({
                        b1: 'b',
                        b2: 'bb'
                    })
                }
            );

            const res = await self(mockRedis.actual, 'redis-key');
            deepStrictEqual(res, {
                a: {
                    a1: 1,
                    a2: 2
                },
                b: {
                    b1: 'b',
                    b2: 'bb'
                }
            });
        });
    });
});