import { strictEqual } from 'assert';

import { RedisCache as Self } from './cache';
import { Mock } from '../assert';
import { RedisBase } from '../../contract';

describe('src/service/redis/cache.ts', () => {
    describe('.flush()', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const self = new Self(mockRedis.actual, 'test', null);

            mockRedis.expected.hset(
                'cache',
                'test',
                Date.now().toString()
            );

            await self.flush();
        });
    });

    describe('.get<T>(key: string)', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            let loadCount = 0;
            const self = new Self(mockRedis.actual, 'test', async () => {
                loadCount++;
                return { a: 1 };
            });

            mockRedis.expectReturn(
                r => r.hget('cache', 'test'),
                ''
            );

            mockRedis.expectReturn(
                r => r.hget('cache', 'test'),
                ''
            );

            const res = await self.get<number>('a');
            await self.get<number>('a');
            strictEqual(res, 1);
            strictEqual(loadCount, 1);

            const now = Reflect.get(self, 'm_Now');
            strictEqual(now, self.updateOn);
        });
    });
});