import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { MongoConfigCache as Self } from './config-cache';
import { DbFactoryBase, DbRepositoryBase, IDbQuery } from '../../contract';
import { global } from '../../model';

describe('src/service/mongo/config-cache.ts', () => {
    describe('.load()', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockDbFactory.actual, global.Config, null, '');

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

            mockDbQuery.expectReturn(
                r => r.toArray(),
                [{
                    id: 'id-1',
                    items: 'a'
                }, {
                    id: 'id-2',
                    items: 'b'
                }]
            );

            const fn = Reflect.get(self, 'load').bind(self) as () => Promise<{ [key: string]: any }>;
            const res = await fn();
            deepStrictEqual(
                Object.keys(res),
                ['id-1', 'id-2']
            );
        });
    });
});