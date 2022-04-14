import { deepStrictEqual, strictEqual } from 'assert';

import { MongoConfigCache as Self } from './config-cache';
import { Mock } from '../assert';
import { DbFactoryBase, DbRepositoryBase, ICache, IDbQuery } from '../../contract';
import { global } from '../../model';

describe('src/service/mongo/config-cache.ts', () => {
    describe('.cache[protected]', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockDbFactory.actual, null);

            const mockDb = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Config),
                mockDb.actual
            );

            const mockDbQuery = new Mock<IDbQuery<global.Config>>();
            mockDb.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.toArray(),
                []
            );

            const resPromsie = Reflect.get(self, 'cache') as Promise<ICache>;
            const res = await resPromsie;
            strictEqual(!!res.flush, true);
            strictEqual(!!res.get, true);
        });
    });

    describe('.flush()', () => {
        it('ok', () => {
            const self = new Self(null, null);

            const mockCache = new Mock<ICache>();
            Reflect.set(self, 'm_Cache', mockCache.actual);

            mockCache.expected.flush();

            self.flush();
        });
    });

    describe('.get<T>(key: string)', () => {
        it('ok', async () => {
            const self = new Self(null, null);

            const mockCache = new Mock<ICache>();
            Reflect.set(self, 'm_Cache', mockCache.actual);

            mockCache.expectReturn(
                r => r.get('test'),
                []
            );

            const res = await self.get<string[]>('test');
            deepStrictEqual(res, []);
        });
    });
});