import { deepStrictEqual } from 'assert';

import { loadMongoConfigDataSource as self } from './load-config-data-source';
import { Mock } from '../assert';
import { DbFactoryBase, DbRepositoryBase, IDbQuery } from '../../contract';
import { global } from '../../model';

describe('src/service/mongo/load-config-data-source.ts', () => {
    describe('.loadConfigDataSource(dbFactory: DbFactoryBase)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();

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

            const res = await self(mockDbFactory.actual);
            deepStrictEqual(
                Object.keys(res),
                ['id-1', 'id-2']
            );
        });
    });
});