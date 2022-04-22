import { strictEqual } from 'assert';

import { MongoEnumCache as Self } from './enum-cache';
import { Mock } from '../assert';
import { CacheBase, DbFactoryBase, DbRepositoryBase, IDbQuery, NowTimeBase } from '../../contract';
import { global } from '../../model';

describe('src/service/mongo/enum-cache.ts', () => {
    describe('.cache[protected]', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(mockDbFactory.actual, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                999
            );

            const mockDb = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Enum),
                mockDb.actual
            );

            const mockDbQuery = new Mock<IDbQuery<global.Enum>>();
            mockDb.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.toArray(),
                []
            );

            const res = Reflect.get(self, 'cache') as CacheBase;
            await res.get('');
        });
    });

    describe('.flush()', () => {
        it('ok', () => {
            const self = new Self(null, null);

            const mockCache = new Mock<CacheBase>();
            Reflect.set(self, 'm_Cache', mockCache.actual);

            mockCache.expected.flush();

            self.flush();
        });
    });

    describe('.get<T>(key: string)', () => {
        it('ok', async () => {
            const self = new Self(null, null);

            const mockCache = new Mock<CacheBase>();
            Reflect.set(self, 'm_Cache', mockCache.actual);

            mockCache.expectReturn(
                r => r.get<string>(''),
                1
            );

            const res = await self.get<string>('');
            strictEqual(res, 1);
        });
    });
});