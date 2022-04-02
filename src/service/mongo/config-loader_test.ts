import { deepStrictEqual } from 'assert';
import moment from 'moment';

import { MongoConfigLoader as Self } from './config-loader';
import { Mock } from '../assert';
import { DbFactoryBase, DbRepositoryBase, ICache, IDbQuery, NowTimeBase } from '../../contract';
import { global } from '../../model';

class Test { }

describe('src/service/mongo/config-loader.ts', () => {
    describe('.load<T>(ctor: new () => T)', () => {
        it('默认缓存', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(mockDbFactory.actual, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                moment().unix()
            );

            const mockDbRepo = new Mock<DbRepositoryBase<global.Config>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Config),
                mockDbRepo.actual
            );

            const mockDbQuery = new Mock<IDbQuery<global.Config>>();
            mockDbRepo.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            const entry = {
                id: Test.name,
                items: {
                    a: 1
                }
            } as global.Config;
            mockDbQuery.expectReturn(
                r => r.toArray(),
                [entry]
            );

            const res = await self.load(Test);
            deepStrictEqual(res, {
                a: 1
            });
        });

        it('ok', async () => {
            const mockCache = new Mock<ICache>();
            const self = new Self(null, null, mockCache.actual);

            mockCache.expectReturn(
                r => r.get(Test.name),
                []
            );

            const res = await self.load(Test);
            deepStrictEqual(res, []);
        });
    });
});