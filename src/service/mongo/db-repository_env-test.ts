import { deepStrictEqual } from 'assert';

import { MongoDbFactory } from './db-factory';
import { DbPool } from './db-pool';
import { DbRepository as Self } from './db-repository';
import { toEntries } from './helper';
import { UnitOfWork } from './unit-of-work';

const dbFactory = new MongoDbFactory('test-repository', 'mongodb://localhost:27017');
const pool = new DbPool('test-repository', 'mongodb://localhost:27017');

describe('src/service/mongo/db-repository.ts', () => {
    after(async () => {
        const db = await pool.getDb();
        await db.dropDatabase();

        const client = await pool.getClient();
        await client.close();

        await dbFactory.close();
    });

    describe('.add(entry: any): Promise<void>', () => {
        const table = 'add';
        it('m_IsTx = true', async () => {
            const uow = new UnitOfWork(pool);
            const self = new Self(pool, uow, dbFactory, table);
            const entry = {
                id: `${table}-1`,
                name: 'test',
            };
            await self.add(entry);

            const db = await pool.getDb();
            const res = await db.collection(table).find().toArray();
            deepStrictEqual(res, []);
        });

        it('m_IsTx = false', async () => {
            const self = new Self(pool, null, dbFactory, table);
            const entry = {
                id: `${table}-2`,
                name: 'test',
            };
            await self.add(entry);

            const db = await pool.getDb();
            const res = await db.collection(table).find().toArray();
            deepStrictEqual(
                toEntries(res),
                [entry]
            );
        });
    });

    describe('.query(): IQuery', () => {
        const table = 'test-query-toArray';
        it('ok', async () => {
            const rows = [{
                _id: `${table}-1`,
            }, {
                _id: `${table}-2`,
            }];
            const db = await pool.getDb();
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const res = await new Self(pool, null, dbFactory, table).query().toArray();

            await collection.deleteMany(null);

            deepStrictEqual(
                res,
                toEntries(rows)
            );
        });

        it('where', async () => {
            const rows = [{
                _id: `${table}-3`,
            }, {
                _id: `${table}-4`,
            }];
            const db = await pool.getDb();
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const res = await new Self(pool, null, dbFactory, table).query().where({
                id: rows[0]._id
            }).toArray();

            await collection.deleteMany(null);

            deepStrictEqual(
                res,
                toEntries([rows[0]])
            );
        });
    });

    describe('.remove(entry: any): Promise<void>', () => {
        const table = 'remove';
        it('m_IsTx = true', async () => {
            const rows = [{
                _id: `${table}-1`,
            }];
            const db = await pool.getDb();
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const uow = new UnitOfWork(pool);
            const self = new Self(pool, uow, dbFactory, table);
            await self.remove({
                id: rows[0]._id,
            });

            const res = await db.collection(table).find().toArray();
            deepStrictEqual(res, rows);

            await collection.deleteMany(null);
        });

        it('m_IsTx = false', async () => {
            const rows = [{
                _id: `${table}-1`,
            }];
            const db = await pool.getDb();
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const self = new Self(pool, null, dbFactory, table);
            await self.remove({
                id: rows[0]._id,
            });

            const res = await db.collection(table).find().toArray();
            deepStrictEqual(res, []);
        });
    });

    describe('.save(entry: any): Promise<void>', () => {
        const table = 'save';
        it('m_IsTx = true', async () => {
            const rows = [{
                _id: `${table}-1`,
                name: 'one',
            }];
            const db = await pool.getDb();
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const uow = new UnitOfWork(pool);
            const self = new Self(pool, uow, dbFactory, table);
            let entry = toEntries(rows)[0];
            entry.name = 'two';
            await self.save(entry);

            const res = await db.collection(table).find().toArray();
            deepStrictEqual(res, rows);

            await collection.deleteMany(null);
        });

        it('m_IsTx = false', async () => {
            const rows = [{
                _id: `${table}-2`,
                name: 'one',
            }];
            const db = await pool.getDb();
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const self = new Self(pool, null, dbFactory, table);
            let entry = toEntries(rows)[0];
            entry.name = 'two';
            await self.save(entry);

            const res = await db.collection(table).find().toArray();
            deepStrictEqual(res, [{
                _id: rows[0]._id,
                name: entry.name,
            }]);

            await collection.deleteMany(null);
        });
    });
});
