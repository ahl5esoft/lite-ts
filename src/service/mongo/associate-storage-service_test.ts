import { deepStrictEqual } from 'assert';

import { MongoAssociateStorageService as Self } from './associate-storage-service';
import { Mock } from '../assert';
import { DbFactoryBase, DbRepositoryBase, IDbQuery } from '../../contract';
import { global } from '../../model';

describe('src/service/mongo/associate-storage-service.ts', () => {
    describe('.add(associateID: string, entry: any)', () => {
        it('ok', () => {
            const self = new Self();

            const entry = {
                id: 'enum-id'
            } as global.Enum;
            Reflect.set(self, 'm_Associates', {
                [global.Enum.name]: {
                    [entry.id]: [{
                        id: 'id'
                    }]
                }
            });

            self.add(global.Enum, 'id', entry);

            const res = Reflect.get(self, 'm_Associates');
            deepStrictEqual(res, {
                [global.Enum.name]: {
                    [entry.id]: [{
                        id: 'id'
                    }, entry]
                }
            });
        });

        it('model缓存不存在', () => {
            const self = new Self();

            const entry = {
                id: 'enum-id'
            } as global.Enum;
            const associateID = 'id';
            self.add(global.Enum, associateID, entry);

            const res = Reflect.get(self, 'm_Associates');
            deepStrictEqual(res, {
                [global.Enum.name]: {
                    [entry.id]: [entry]
                }
            });
        });
    });

    describe('.clear<T>(model: new () => T, associateID: string)', () => {
        it('ok', () => {
            const self = new Self();
            Reflect.set(self, 'm_Associates', {
                [global.Enum.name]: {
                    'id': {}
                }
            });

            self.clear(global.Enum, 'id');

            deepStrictEqual(
                Reflect.get(self, 'm_Associates')[global.Enum.name]['id'],
                []
            );
        });

        it('model不存在', () => {
            new Self().clear(global.Enum, 'id');
        });
    });

    describe('.find<T>(model: Function, column: string, associateID: string)', () => {
        it('ok', async () => {
            const self = new Self();

            const mockDbFactory = new Mock<DbFactoryBase>();
            self.dbFactory = mockDbFactory.actual;

            const mockDbRepo = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db<global.Enum>(global.Enum),
                mockDbRepo.actual
            );

            const mockDbQuery = new Mock<IDbQuery<global.Enum>>();
            mockDbRepo.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            const associateIDs = ['enum-id-1', 'enum-id-2'];
            self.targetIDs = associateIDs;

            mockDbQuery.expectReturn(
                r => r.where({
                    id: {
                        $in: associateIDs
                    }
                }),
                mockDbQuery.actual
            );

            const entry = {
                id: associateIDs[0]
            } as global.Enum;
            mockDbQuery.expectReturn(
                r => r.toArray(),
                [entry]
            );

            const res = await self.find(global.Enum, 'id', associateIDs[0]);
            deepStrictEqual(res, [entry]);
        });

        it('不存在', async () => {
            const self = new Self();

            const mockDbFactory = new Mock<DbFactoryBase>();
            self.dbFactory = mockDbFactory.actual;

            const mockDbRepo = new Mock<DbRepositoryBase<global.Enum>>();
            mockDbFactory.expectReturn(
                r => r.db<global.Enum>(global.Enum),
                mockDbRepo.actual
            );

            const mockDbQuery = new Mock<IDbQuery<global.Enum>>();
            mockDbRepo.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            const associateIDs = ['id-1', 'id-2'];
            self.targetIDs = associateIDs;

            mockDbQuery.expectReturn(
                r => r.where({
                    id: {
                        $in: associateIDs
                    }
                }),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.toArray(),
                []
            );

            const res = await self.find(global.Enum, 'id', '');
            deepStrictEqual(res, []);
        });
    });
});