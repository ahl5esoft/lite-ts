import { Config } from './config';
import { DbFactoryBase, DbRepositoryBase, IDbQuery, model, service } from '../..';
import { deepStrictEqual } from 'assert';

class ConfigData {
    public str: string;
}

describe('src/service/mongo/config.ts', () => {
    describe('.get()', () => {
        it('ok', async () => {
            const mockDbFactory = new service.Mock<DbFactoryBase>();
            const self = new Config(mockDbFactory.actual, ConfigData);

            const mockDbRepo = new service.Mock<DbRepositoryBase<ConfigData>>();
            mockDbFactory.expectReturn(
                r => r.db(model.global.Config),
                mockDbRepo.actual
            );

            const mockDbQuery = new service.Mock<IDbQuery<model.global.Config>>();
            mockDbRepo.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.where({
                    id: ConfigData.name
                }),
                mockDbQuery.actual
            );

            const data: model.global.Config = {
                id: '',
                items: {
                    str: 's'
                }
            };
            mockDbQuery.expectReturn(
                r => r.toArray(),
                [data]
            );

            const res = await self.get();
            deepStrictEqual(res, data.items);
        });
    });
});