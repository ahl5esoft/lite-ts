import { ClientOptions } from '@elastic/elasticsearch';
import { deepStrictEqual } from 'assert';

import { ElasticSearchPool } from './pool';
import { ElasticSearchUnitOfWork as Self } from './unit-of-work';

class TestUnitOfWorkModel {
    public id: string;
    public no: number;
}

const clientOpts = {
    node: 'http://10.10.0.66:9200'
} as ClientOptions;
const pool = new ElasticSearchPool(clientOpts, 'test');

describe('src/service/elasticsearch/unit-of-work.ts', () => {
    afterEach(async () => {
        try {
            await pool.client.indices.delete({
                index: await pool.getIndex(TestUnitOfWorkModel)
            });
        } catch { }
    });

    describe('.commit()', async () => {
        it('新增', async () => {
            const self = new Self(pool);

            self.registerAdd(TestUnitOfWorkModel, {
                id: 'id-1',
                no: 1
            });
            self.registerAdd(TestUnitOfWorkModel, {
                id: 'id-2',
                no: 2
            });

            await self.commit();

            const res = await pool.client.search({
                index: await pool.getIndex(TestUnitOfWorkModel)
            });
            deepStrictEqual(
                res.hits.hits.map(r => {
                    return r._source;
                }),
                [{
                    id: 'id-1',
                    no: 1
                }, {
                    id: 'id-2',
                    no: 2
                }]
            );
        });

        it('更新', async () => {
            const self = new Self(pool);

            self.registerAdd(TestUnitOfWorkModel, {
                id: 'id-1',
                no: 1
            });
            self.registerSave(TestUnitOfWorkModel, {
                id: 'id-1',
                no: 2
            });

            await self.commit();

            const res = await pool.client.search({
                index: await pool.getIndex(TestUnitOfWorkModel)
            });
            deepStrictEqual(
                res.hits.hits.map(r => {
                    return r._source;
                }),
                [{
                    id: 'id-1',
                    no: 2
                }]
            )
        });

        it('删除', async () => {
            const self = new Self(pool);

            self.registerAdd(TestUnitOfWorkModel, {
                id: 'id-1',
                no: 1
            });
            self.registerRemove(TestUnitOfWorkModel, {
                id: 'id-1',
            });

            await self.commit();

            const res = await pool.client.search({
                index: await pool.getIndex(TestUnitOfWorkModel)
            });
            deepStrictEqual(
                res.hits.hits.map(r => {
                    return r._source;
                }),
                []
            )
        });
    });

    describe('.registerAdd(model: Function, entry: any)', () => {
        it('ok', async () => {
            const self = new Self(null);
            const entry = {
                id: 'id',
                no: 11
            };
            self.registerAdd(TestUnitOfWorkModel, entry);
            const res = Reflect.get(self, 'm_Items');
            deepStrictEqual(res, [{
                entry: entry,
                model: TestUnitOfWorkModel,
                op: 'index'
            }]);
        });
    });

    describe('.registerRemove(model: Function, entry: any)', () => {
        it('ok', async () => {
            const self = new Self(null);
            const entry = {
                id: 'id',
                no: 11
            };
            self.registerRemove(TestUnitOfWorkModel, entry);
            const res = Reflect.get(self, 'm_Items');
            deepStrictEqual(res, [{
                entry: entry,
                model: TestUnitOfWorkModel,
                op: 'delete'
            }]);
        });
    });

    describe('.registerSave(model: Function, entry: any)', () => {
        it('ok', async () => {
            const self = new Self(null);
            const entry = {
                id: 'id',
                no: 11
            };
            self.registerSave(TestUnitOfWorkModel, entry);
            const res = Reflect.get(self, 'm_Items');
            deepStrictEqual(res, [{
                entry: entry,
                model: TestUnitOfWorkModel,
                op: 'update'
            }]);
        });
    });
});