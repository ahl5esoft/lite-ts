import { deepStrictEqual, strictEqual } from 'assert';

import { MongoConfigLoader as Self } from './config-loader';
import { Mock } from '..';
import { DbFactoryBase, DbRepositoryBase, IDbQuery, model } from '../..';

class Test { }

describe('src/service/mongo/config-loader.ts', () => {
    describe('.load<T>(ctor: new () => T)', () => {
        it('延迟加载', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockDbFactory.actual);

            const mockDbRepo = new Mock<DbRepositoryBase<model.global.Config>>();
            mockDbFactory.expectReturn(
                r => r.db(model.global.Config),
                mockDbRepo.actual
            );

            const mockDbQuery = new Mock<IDbQuery<model.global.Config>>();
            mockDbRepo.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.toArray(),
                [{
                    id: Test.name,
                    items: {
                        a: 1
                    }
                } as model.global.Config]
            );

            const res = await self.load(Test);
            deepStrictEqual(res, {
                a: 1
            });
        });

        it('不存在', async () => {
            const self = new Self(null);

            Reflect.set(self, 'm_Entries', []);

            const res = await self.load(Test);
            strictEqual(res, undefined);
        });
    });
});