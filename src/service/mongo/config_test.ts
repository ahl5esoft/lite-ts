import { deepStrictEqual } from 'assert';

import { Config } from './config';
import { Mock } from '..';
import { DbFactoryBase, DbRepositoryBase, IDbQuery } from '../..';
import { global } from '../../model';

class ConfigData {
    public str: string;
}

describe('src/service/mongo/config.ts', () => {
    describe('.get()', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Config(mockDbFactory.actual, ConfigData);

            const mockDbRepo = new Mock<DbRepositoryBase<ConfigData>>();
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
                r => r.where({
                    id: ConfigData.name
                }),
                mockDbQuery.actual
            );

            const data: global.Config = {
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