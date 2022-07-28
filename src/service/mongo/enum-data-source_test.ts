import { deepStrictEqual } from 'assert';

import { MongoEnumDataSource as Self } from './enum-data-source';
import { Mock } from '../assert';
import { DbFactoryBase, DbRepositoryBase, IDbQuery } from '../../contract';
import { contract, global } from '../../model';

class TestEnum extends global.Enum { }

describe('src/service/mongo/load-enum-data-source.ts', () => {
    describe('.loadEnumDataSource(dbFactory: DbFactoryBase)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockDbFactory.actual, '-', TestEnum);

            const mockDbRepo = new Mock<DbRepositoryBase<TestEnum>>();
            mockDbFactory.expectReturn(
                r => r.db(TestEnum),
                mockDbRepo.actual
            );

            const mockDbQuery = new Mock<IDbQuery<TestEnum>>();
            mockDbRepo.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            const items = [{
                text: 'a',
                value: 1,
            }, {
                text: 'b',
                value: 2
            }] as contract.IEnumItem[]
            mockDbQuery.expectReturn(
                r => r.toArray(),
                [{
                    id: 'test',
                    items: items
                }]
            );

            const res = await self.findEnums();
            deepStrictEqual(
                Object.keys(res),
                ['test']
            );
            deepStrictEqual(
                Object.keys(res['test']),
                items.map(r => {
                    return r.value.toString();
                })
            );
        });
    });
});