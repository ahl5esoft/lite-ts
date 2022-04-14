import { deepStrictEqual, strictEqual } from 'assert';

import { MongoEnum as Self } from './enum';
import { Mock, mockAny } from '../assert';
import { DbFactoryBase, DbRepositoryBase, ICache, IDbQuery, IUnitOfWork } from '../../contract';
import { enum_, global } from '../../model';

describe('src/service/mongo/enum.ts', () => {
    describe('.items', () => {
        it('ok', async () => {
            const mockCache = new Mock<ICache>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockCache.actual, mockDbFactory.actual, enum_.ValueTypeData.name);

            mockCache.expectReturn(
                r => r.get(enum_.ValueTypeData.name),
                []
            );

            const res = await self.items;
            deepStrictEqual(res, []);
        });
    });

    describe('.get(predicate: (data: global.IEnumItemData) => boolean)', () => {
        it('ok', async () => {
            const mockCache = new Mock<ICache>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockCache.actual, mockDbFactory.actual, enum_.ValueTypeData.name);

            mockCache.expectReturn(
                r => r.get(enum_.ValueTypeData.name),
                []
            );

            const res = await self.get(r => {
                return r.key == '';
            });
            strictEqual(res, undefined);
        });
    });

    describe('.update(data: global.IEnumItemData) => void)', () => {
        it('ok', async () => {
            const mockCache = new Mock<ICache>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockUow = new Mock<IUnitOfWork>();
            const self = new Self(mockCache.actual, mockDbFactory.actual, enum_.ValueTypeData.name);

            mockCache.expectReturn(
                r => r.get(enum_.ValueTypeData.name),
                []
            );
            mockCache.expectReturn(
                r => r.flush(),
                null
            );

            const mockDbRepository = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Enum, mockUow.actual),
                mockDbRepository.actual
            );

            const mockDbQuery = new Mock<IDbQuery<global.Enum>>();
            mockDbRepository.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.where(mockAny),
                mockDbQuery.actual
            );
            mockDbQuery.expectReturn(
                r => r.toArray(),
                []
            );

            await self.update({ value: 1, key: '', text: '' }, mockUow.actual);
        });
    });
});