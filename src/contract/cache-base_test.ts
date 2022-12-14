import { notStrictEqual, strictEqual } from 'assert';

import { CacheBase } from './cache-base';
import { RedisBase } from './redis-base';
import { Mock } from '../service';

class Self extends CacheBase {
    public constructor(
        private m_LoadFunc: () => Promise<any>,
        redis: RedisBase,
        cacheKey: string,
    ) {
        super(redis, cacheKey);
    }

    public withTrace() {
        return this;
    }

    protected async load() {
        return this.m_LoadFunc();
    }
}

describe('src/contract/redis-cache-base.ts', () => {
    describe('.flush()', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const self = new Self(null, mockRedis.actual, 'test');

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
            const self = new Self(async () => {
                loadCount++;
                return { a: 1 };
            }, mockRedis.actual, 'test');

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

            const nextCheckOn = Reflect.get(self, 'm_NextCheckOn');
            notStrictEqual(nextCheckOn, 0);
        });
    });
});