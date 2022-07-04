import { strictEqual } from 'assert';

import { RedisCase as Self } from './cache';
import { Mock } from '../assert';
import { RedisBase } from '../../contract';

describe('src/service/redis/cache.ts', () => {
    describe('.get<T>(key: string)', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            let loadCount = 0;
            const self = new Self(mockRedis.actual, async () => {
                loadCount++;
                return { a: 1 };
            }, 'test');

            mockRedis.expectReturn(
                r => r.get('cache:test'),
                ''
            );

            mockRedis.expectReturn(
                r => r.get('cache:test'),
                ''
            );

            const res = await self.get<number>('a');
            await self.get<number>('a');
            strictEqual(res, 1);
            strictEqual(loadCount, 1);

            const now = Reflect.get(self, 'm_Now');
            const cacheOn = Reflect.get(self, 'm_CacheOn');
            strictEqual(now, cacheOn);
        });
    });
});