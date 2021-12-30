import { deepStrictEqual, strictEqual } from 'assert';

import { MongoEnum as Self } from './enum';
import { EnumItem, Mock } from '..';
import { DbFactoryBase, DbRepositoryBase, IDbQuery, IEnumItemData } from '../..';
import { global } from '../../model';

interface ITestGetEnumItemData extends IEnumItemData {
    key: string;
}

describe('src/service/mongo/enum.ts', () => {
    describe('.all(): Promise<IEnumItem[]>', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const name = 'test';
            const self = new Self(mockDbFactory.actual, name);

            const mockDbRepo = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Enum),
                mockDbRepo.actual
            );

            const mockDbQuery = new Mock<IDbQuery<global.Enum>>();
            mockDbRepo.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.where({
                    id: name
                }),
                mockDbQuery.actual
            );

            const data = {
                key: 'k',
                value: 1
            };
            mockDbQuery.expectReturn(
                r => r.toArray(),
                [{
                    items: [data]
                } as global.Enum]
            );

            const res = await self.all();
            deepStrictEqual(res, [
                new EnumItem(data, name)
            ]);

            const items = Reflect.get(self, 'm_Items');
            deepStrictEqual(res, items);
        });

        it('不存在', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const name = 'test';
            const self = new Self(mockDbFactory.actual, name);

            const mockDbRepo = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Enum),
                mockDbRepo.actual
            );

            const mockDbQuery = new Mock<IDbQuery<global.Enum>>();
            mockDbRepo.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.where({
                    id: name
                }),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.toArray(),
                []
            );

            const res = await self.all();
            deepStrictEqual(res, []);
        });
    });

    describe('.get(predicate: (data: global.IEnumItemData) => boolean)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const name = 'test';
            const self = new Self<ITestGetEnumItemData>(mockDbFactory.actual, name);

            const mockDbRepo = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Enum),
                mockDbRepo.actual
            );

            const mockDbQuery = new Mock<IDbQuery<global.Enum>>();
            mockDbRepo.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.where({
                    id: name
                }),
                mockDbQuery.actual
            );

            const data = {
                key: 'k',
                value: 1
            };
            mockDbQuery.expectReturn(
                r => r.toArray(),
                [{
                    items: [data]
                } as global.Enum]
            );

            const res = await self.get(r => {
                return r.key == data.key;
            });
            const items = Reflect.get(self, 'm_Items');
            strictEqual(res, items[0]);
        });

        it('不存在', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const name = 'test';
            const self = new Self<ITestGetEnumItemData>(mockDbFactory.actual, name);

            const mockDbRepo = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db(global.Enum),
                mockDbRepo.actual
            );

            const mockDbQuery = new Mock<IDbQuery<global.Enum>>();
            mockDbRepo.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.where({
                    id: name
                }),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.toArray(),
                []
            );

            const res = await self.get(r => {
                return r.key == 'not-exists';
            });
            strictEqual(
                res,
                undefined,
            );
        });
    });
});