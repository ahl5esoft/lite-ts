import { deepStrictEqual, strictEqual } from 'assert';

import { MongoEnum as Self } from './enum';
import { Mock, mockAny } from '../assert';
import { DbFactoryBase, DbRepositoryBase, ICache, IUnitOfWork } from '../../contract';
import { enum_, global } from '../../model';

describe('src/service/cache/enum.ts', () => {
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

    describe('.addOrSaveItem(uow: IUnitOfWork, itemData: global.IEnumItemData)', () => {
        it('ok', async () => {
            const mockCache = new Mock<ICache>();
            const mockUow = new Mock<IUnitOfWork>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockCache.actual, mockDbFactory.actual, enum_.ValueTypeData.name);

            mockCache.expectReturn(
                r => r.get(enum_.ValueTypeData.name),
                null
            );

            const mockDbRepository = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Enum, mockUow.actual),
                mockDbRepository.actual
            );

            mockDbRepository.expectReturn(
                r => r.add(mockAny),
                null
            );

            await self.addOrSaveItem(mockUow.actual, {
                key: '',
                value: 1,
                text: '',
            });
        });
    });

    describe('.removeItem(uow: IUnitOfWork, predicate: (data: global.IEnumItemData) => boolean)', () => {
        it('ok', async () => {
            const mockCache = new Mock<ICache>();
            const mockUow = new Mock<IUnitOfWork>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockCache.actual, mockDbFactory.actual, enum_.ValueTypeData.name);

            mockCache.expectReturn(
                r => r.get(enum_.ValueTypeData.name),
                []
            );

            await self.removeItem(mockUow.actual, r => r.value == 1);
        });
    });
});