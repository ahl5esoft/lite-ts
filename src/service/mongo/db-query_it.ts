import { deepStrictEqual, strictEqual } from 'assert';

import { MongoPool } from './pool';
import { MongoDbQuery as Self } from './db-query';
import { toEntries } from './helper';

const pool = new MongoPool('test-query', 'mongodb://localhost:27017');

describe('src/service/mongo/db-query.ts', () => {
    after(async () => {
        const db = await pool.db;
        await db.dropDatabase();

        const client = await pool.client;
        await client.close();
    });

    describe('.count(): Promise<number>', () => {
        const table = 'test-query-count';
        it('empty', async () => {
            const count = await new Self(pool, table).count();
            strictEqual(count, 0);
        });

        it('all', async () => {
            const rows: any = [{
                _id: `${table}-1`,
            }, {
                _id: `${table}-2`,
            }];
            const db = await pool.db;
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const count = await new Self(pool, table).count();

            await collection.deleteMany(null);

            strictEqual(count, rows.length);
        });
    });

    describe('.order(...fields)', () => {
        const table = 'test-query-order';
        it('ok', async () => {
            const rows: any = [{
                _id: `${table}-3`,
                index: 1,
            }, {
                _id: `${table}-4`,
                index: 0,
            }, {
                _id: `${table}-5`,
                index: -1,
            }];
            const db = await pool.db;
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const res = await new Self(pool, table).order('index').toArray();

            await collection.deleteMany(null);

            deepStrictEqual(
                res,
                toEntries([rows[2], rows[1], rows[0]])
            );
        });
    });

    describe('.orderByDesc(...fields)', () => {
        const table = 'test-query-orderByDesc';
        it('ok', async () => {
            const rows: any = [{
                _id: `${table}-6`,
                index: 1,
            }, {
                _id: `${table}-7`,
                index: 2,
            }];
            const db = await pool.db;
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const res = await new Self(pool, table).orderByDesc('index').toArray();

            await collection.deleteMany(null);

            deepStrictEqual(
                res,
                toEntries([rows[1], rows[0]])
            );
        });
    });

    describe('.skip(skip)', () => {
        const table = 'test-query-skip';
        it('ok', async () => {
            const rows: any = [{
                _id: `${table}-8`,
            }, {
                _id: `${table}-9`,
            }];
            const db = await pool.db;
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const res = await new Self(pool, table).skip(1).toArray();

            await collection.deleteMany(null);

            deepStrictEqual(
                res,
                toEntries([rows[1]])
            );
        });
    });

    describe('.take(take)', () => {
        const table = 'test-query-take';
        it('ok', async () => {
            const rows: any = [{
                _id: `${table}-10`,
            }, {
                _id: `${table}-11`,
            }, {
                _id: `${table}-12`,
            }];
            const db = await pool.db;
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const res = await new Self(pool, table).take(1).toArray();

            await collection.deleteMany(null);

            deepStrictEqual(
                res,
                toEntries([rows[0]])
            );
        });
    });

    describe('.toArray()', () => {
        const table = 'test-query-toArray';
        it('ok', async () => {
            const rows: any = [{
                _id: `${table}-1`,
            }, {
                _id: `${table}-2`,
            }];
            const db = await pool.db;
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const res = await new Self(pool, table).toArray();

            await collection.deleteMany(null);

            deepStrictEqual(
                res,
                toEntries(rows)
            );
        });
    });

    describe('.where(selector)', () => {
        const table = 'test-query-where';
        it('ok', async () => {
            let rows: any = [{
                _id: `${table}-13`,
                type: 1,
            }, {
                _id: `${table}-14`,
                type: 2,
            }, {
                _id: `${table}-15`,
                type: 1,
            }];
            const db = await pool.db;
            let collection = db.collection(table);
            await collection.insertMany(rows);

            let res = await new Self(pool, table).where({
                type: 1,
            }).toArray();

            await collection.deleteMany(null);

            deepStrictEqual(
                res,
                toEntries([rows[0], rows[2]])
            );
        });
    });
});
