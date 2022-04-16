import { deepStrictEqual } from 'assert';

import { MongoEnum as Self } from './enum';
import { Mock, mockAny } from '../assert';
import { DbFactoryBase, DbRepositoryBase, ICache, IReadonlyEnum } from '../../contract';
import { enum_, global } from '../../model';

describe('src/service/cache/enum.ts', () => {
    describe('.items', () => {
        it('ok', async () => {
            const mockReadonlyEnum = new Mock<IReadonlyEnum<enum_.ValueTypeData>>({
                items: []
            });
            const self = new Self(null, mockReadonlyEnum.actual, null, null);

            const res = await self.items;
            deepStrictEqual(res, []);
        });
    });

    describe('.addOrSaveItem(uow: IUnitOfWork, itemData: global.IEnumItemData)', () => {
        it('add', async () => {
            const mockCache = new Mock<ICache>();
            const mockReadonlyEnum = new Mock<IReadonlyEnum<enum_.ValueTypeData>>({
                items: null
            });
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockCache.actual, mockReadonlyEnum.actual, mockDbFactory.actual, enum_.ValueTypeData.name);

            const mockDbRepository = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Enum, null),
                mockDbRepository.actual
            );

            const enumItem = {
                key: '',
                value: 1,
                text: '',
            } as enum_.ValueTypeData;
            mockDbRepository.expected.add({
                id: enum_.ValueTypeData.name,
                items: [enumItem]
            });

            mockCache.expected.flush();

            await self.addOrSaveItem(null, enumItem);
        });

        it('save(增加项)', async () => {
            const mockCache = new Mock<ICache>();
            const mockReadonlyEnum = new Mock<IReadonlyEnum<enum_.ValueTypeData>>({
                items: [{
                    data: {}
                }]
            });
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockCache.actual, mockReadonlyEnum.actual, mockDbFactory.actual, enum_.ValueTypeData.name);

            const mockDbRepository = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Enum, null),
                mockDbRepository.actual
            );

            const enumItem = {
                key: '',
                value: 1,
                text: '',
            } as enum_.ValueTypeData;
            mockDbRepository.expected.save({
                id: enum_.ValueTypeData.name,
                items: [enumItem, {}]
            });

            mockCache.expected.flush();

            await self.addOrSaveItem(null, enumItem);
        });

        it('save(修改项)', async () => {
            const mockCache = new Mock<ICache>();
            const mockReadonlyEnum = new Mock<IReadonlyEnum<enum_.ValueTypeData>>({
                items: [{
                    data: {
                        value: 1
                    }
                }]
            });
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockCache.actual, mockReadonlyEnum.actual, mockDbFactory.actual, enum_.ValueTypeData.name);

            const mockDbRepository = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Enum, null),
                mockDbRepository.actual
            );

            const enumItem = {
                key: '',
                value: 1,
                text: '',
            } as enum_.ValueTypeData;
            mockDbRepository.expected.save({
                id: enum_.ValueTypeData.name,
                items: [enumItem]
            });

            mockCache.expected.flush();

            await self.addOrSaveItem(null, enumItem);
        });
    });

    describe('.get(predicate: (data: T) => boolean)', () => {
        it('ok', async () => {
            const mockReadonlyEnum = new Mock<IReadonlyEnum<enum_.ValueTypeData>>();
            const self = new Self(null, mockReadonlyEnum.actual, null, null);

            mockReadonlyEnum.expectReturn(
                r => r.get(mockAny),
                {}
            );

            const res = await self.get(r => {
                return r.key == '';
            });
            deepStrictEqual(res, {});
        });
    });

    describe('.removeItem(uow: IUnitOfWork, predicate: (data: global.IEnumItemData) => boolean)', () => {
        it('存在', async () => {
            const mockCache = new Mock<ICache>();
            const mockReadonlyEnum = new Mock<IReadonlyEnum<enum_.ValueTypeData>>({
                items: [{
                    data: {
                        value: 1
                    }
                }]
            });
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockCache.actual, mockReadonlyEnum.actual, mockDbFactory.actual, enum_.ValueTypeData.name);

            const mockDbRepository = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Enum, null),
                mockDbRepository.actual
            );

            mockDbRepository.expected.save({
                id: enum_.ValueTypeData.name,
                items: []
            });

            mockCache.expected.flush();

            await self.removeItem(null, r => {
                return r.value == 1;
            });
        });

        it('不存在', async () => {
            const mockCache = new Mock<ICache>();
            const mockReadonlyEnum = new Mock<IReadonlyEnum<enum_.ValueTypeData>>({
                items: [{
                    data: {
                        value: 1
                    }
                }]
            });
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockCache.actual, mockReadonlyEnum.actual, mockDbFactory.actual, enum_.ValueTypeData.name);

            const mockDbRepository = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Enum, null),
                mockDbRepository.actual
            );

            mockDbRepository.expected.save({
                id: enum_.ValueTypeData.name,
                items: [{
                    value: 1
                }]
            });

            mockCache.expected.flush();

            await self.removeItem(null, r => {
                return r.value == 2;
            });
        });
    });
});