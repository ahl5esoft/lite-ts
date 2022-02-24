import { ClientOptions } from '@elastic/elasticsearch';
import { deepStrictEqual, strictEqual } from 'assert';

import { ElasticSearchDbFactory as Self } from './db-factory';
import { ElasticSearchPool } from './pool';
import { DbFactoryBase } from '../..';

class TestDbFactoryModel {
    public id: string;
    public no: number;
}

const clientOpts = {
    node: 'http://10.10.0.66:9200'
} as ClientOptions;
const self: DbFactoryBase = new Self(clientOpts, 'test');

describe('src/service/elasticsearch/db-factory.ts', () => {
    afterEach(async () => {
        try {
            const pool = Reflect.get(self, 'm_Pool') as ElasticSearchPool;
            await pool.client.indices.delete({
                index: await pool.getIndex(TestDbFactoryModel)
            });
        } catch { }
    });

    describe('.db<T>(model: new () => T, uow: ElasticSearchUnitOfWork)', () => {
        it('query.count', async () => {
            const rows = [];
            for (let i = 0; i < 3; i++) {
                rows.push({
                    id: `id-${i}`,
                    no: i
                });
            }
            const pool = Reflect.get(self, 'm_Pool') as ElasticSearchPool;
            const index = await pool.getIndex(TestDbFactoryModel);
            await pool.client.bulk({
                operations: rows.reduce((memo, r) => {
                    memo.push({
                        index: {
                            _index: index
                        }
                    }, r);
                    return memo;
                }, []),
                refresh: true
            });

            const res = await self.db(TestDbFactoryModel).query().count();
            strictEqual(res, 3);
        });

        it('query.toArray', async () => {
            const rows = [];
            for (let i = 0; i < 3; i++) {
                rows.push({
                    id: `id-${i}`,
                    no: i
                });
            }
            const pool = Reflect.get(self, 'm_Pool') as ElasticSearchPool;
            const index = await pool.getIndex(TestDbFactoryModel);
            await pool.client.bulk({
                operations: rows.reduce((memo, r) => {
                    memo.push({
                        index: {
                            _id: r.id,
                            _index: index,
                        }
                    }, r);
                    return memo;
                }, []),
                refresh: true
            });

            const res = await self.db(TestDbFactoryModel).query().toArray();
            deepStrictEqual(res, rows);
        });
    });

    describe('.uow()', () => {
        it('ok', async () => {
            const uow = self.uow();
            const db = self.db(TestDbFactoryModel, uow);
            db.add({
                id: 'id-1',
                no: 1
            });
            db.add({
                id: 'id-2',
                no: 2
            });

            const resCount = await db.query().count();
            strictEqual(resCount, 0);

            await uow.commit();

            const res = await db.query().toArray();
            deepStrictEqual(res, [{
                id: 'id-1',
                no: 1
            }, {
                id: 'id-2',
                no: 2
            }]);
        });
    });
});