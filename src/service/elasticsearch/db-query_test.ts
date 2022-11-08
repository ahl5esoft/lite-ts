import { ClientOptions } from '@elastic/elasticsearch';
import { deepStrictEqual, strictEqual } from 'assert';

import { ElasticSearchDbQuery as Self } from './db-query';
import { ElasticSearchPool } from './pool';

class TestDbQueryModel {
    public id: string;
    public no: number;
}

const clientOpts = {
    node: 'http://10.10.0.66:9200'
} as ClientOptions;
const pool = new ElasticSearchPool(clientOpts, 'test');

describe('src/service/elasticsearch/db-query.ts', () => {
    afterEach(async () => {
        try {
            await pool.client.indices.delete({
                index: await pool.getIndex(TestDbQueryModel)
            });
        } catch { }
    });

    describe('.count()', () => {
        it.only('ok', async () => {
            const index = await pool.getIndex(TestDbQueryModel);
            await pool.client.bulk({
                operations: [{
                    index: {
                        _index: index
                    },
                }, {
                    id: 'id-1',
                    no: 1
                } as TestDbQueryModel, {
                    index: {
                        _index: index
                    },
                }, {
                    id: 'id-2',
                    no: 2
                } as TestDbQueryModel],
                refresh: true
            });

            const res = await new Self(pool, TestDbQueryModel).count();
            strictEqual(res, 2);
        });

        it('where', async () => {
            const rows = [];
            for (let i = 0; i < 10; i++) {
                rows.push({
                    id: `id-${i}`,
                    no: i % 3
                });
            }
            const index = await pool.getIndex(TestDbQueryModel);
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

            const res = await new Self(pool, TestDbQueryModel).count({
                match: {
                    no: 0
                }
            });
            strictEqual(res, 4);
        });
    });

    describe('.toArray(v?: Partial<IDbQueryOption<any>>)', () => {
        it('ok', async () => {
            const rows = [];
            for (let i = 0; i < 3; i++) {
                rows.push({
                    id: `id-${i}`,
                    no: i
                });
            }
            const index = await pool.getIndex(TestDbQueryModel);
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

            const res = await new Self(pool, TestDbQueryModel).toArray();
            deepStrictEqual(res, rows);
        });

        it('order', async () => {
            const rows = [];
            const max = 3;
            for (let i = 0; i < max; i++) {
                rows.push({
                    id: `id-${i}`,
                    no: max - i
                });
            }
            const index = await pool.getIndex(TestDbQueryModel);
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

            const res = await new Self(pool, TestDbQueryModel).toArray({
                order: ['no']
            });
            deepStrictEqual(
                res,
                [
                    rows[2],
                    rows[1],
                    rows[0]
                ]
            );
        });

        it('orderByDesc', async () => {
            const rows = [];
            const max = 3;
            for (let i = 0; i < max; i++) {
                rows.push({
                    id: `id-${i}`,
                    no: i
                });
            }
            const index = await pool.getIndex(TestDbQueryModel);
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

            const res = await new Self(pool, TestDbQueryModel).toArray({
                orderByDesc: ['no']
            });
            deepStrictEqual(
                res,
                [
                    rows[2],
                    rows[1],
                    rows[0]
                ]
            );
        });

        it('skip', async () => {
            const rows = [];
            const max = 3;
            for (let i = 0; i < max; i++) {
                rows.push({
                    id: `id-${i}`,
                    no: i
                });
            }
            const index = await pool.getIndex(TestDbQueryModel);
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

            const res = await new Self(pool, TestDbQueryModel).toArray({
                skip: 2
            });
            deepStrictEqual(
                res,
                [
                    rows[2]
                ]
            );
        });

        it('take', async () => {
            const rows = [];
            const max = 3;
            for (let i = 0; i < max; i++) {
                rows.push({
                    id: `id-${i}`,
                    no: i
                });
            }
            const index = await pool.getIndex(TestDbQueryModel);
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

            const res = await new Self(pool, TestDbQueryModel).toArray({
                take: 1
            });
            deepStrictEqual(
                res,
                [
                    rows[0]
                ]
            );
        });

        it('where', async () => {
            const rows = [];
            for (let i = 0; i < 10; i++) {
                rows.push({
                    id: `id-${i}`,
                    no: i % 3
                });
            }
            const index = await pool.getIndex(TestDbQueryModel);
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

            const res = await new Self(pool, TestDbQueryModel).toArray({
                where: {
                    match: {
                        no: 1
                    }
                }
            });
            deepStrictEqual(
                res,
                [
                    rows[1],
                    rows[4],
                    rows[7]
                ]
            );
        });
    });
});