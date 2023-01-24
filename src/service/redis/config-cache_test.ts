import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { RedisConfigCache as Self } from './config-cache';
import { RedisBase } from '../../contract';

describe('src/service/redis/config-cache.ts', () => {
    describe('.load()', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const self = new Self('redis-key', mockRedis.actual, 'cache-key');

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

            const fn = Reflect.get(self, 'load').bind(self) as () => Promise<{ [key: string]: any }>;
            const res = await fn();
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