import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { MongoEnumCache as Self } from './enum-cache';
import { DbFactoryBase, DbRepositoryBase, EnumCacheBase, IDbQuery } from '../../contract';
import { enum_, global } from '../../model';

class AbEnum extends global.Enum { }

describe('src/service/mongo/enum-cache.ts', () => {
    describe('.load()', () => {
        it('ok', async () => {
            EnumCacheBase.buildItemFunc = () => {
                return null;
            }

            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockDbFactory.actual, AbEnum, null, '');

            const mockDbRepo = new Mock<DbRepositoryBase<AbEnum>>();
            mockDbFactory.expectReturn(
                r => r.db(AbEnum),
                mockDbRepo.actual
            );

            const mockDbQuery = new Mock<IDbQuery<AbEnum>>();
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
            }] as enum_.ItemData[]
            mockDbQuery.expectReturn(
                r => r.toArray(),
                [{
                    id: 'test',
                    items: items
                }]
            );

            const fn = Reflect.get(self, 'load').bind(self) as () => Promise<{ [key: string]: any }>;
            const res = await fn();
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