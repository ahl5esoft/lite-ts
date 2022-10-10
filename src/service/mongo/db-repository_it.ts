import { deepStrictEqual } from 'assert';

import { MongoDbFactory } from './db-factory';
import { MongoDbRepository as Self } from './db-repository';
import { MongoDefaultUnitOfWork } from './default-unit-of-work';
import { toEntries } from './helper';
import { MongoPool } from './pool';

const dbFactory = new MongoDbFactory(false, 'test-repository', 'mongodb://localhost:27017');
const pool = new MongoPool('test-repository', 'mongodb://localhost:27017');

describe('src/service/mongo/db-repository.ts', () => {
    after(async () => {
        const db = await pool.db;
        await db.dropDatabase();
    });

    describe('.add(entry: any): Promise<void>', () => {
        class TestAdd { }
        it('m_IsTx = true', async () => {
            const uow = new MongoDefaultUnitOfWork(pool);
            const self = new Self(pool, uow, dbFactory, TestAdd);
            const entry = {
                id: `${TestAdd.name}-1`,
                name: 'test',
            };
            await self.add(entry);

            const db = await pool.db;
            const res = await db.collection(TestAdd.name).find().toArray();
            deepStrictEqual(res, []);
        });

        it('m_IsTx = false', async () => {
            const self = new Self(pool, null, dbFactory, TestAdd);
            const entry = {
                id: `${TestAdd.name}-2`,
                name: 'test',
            };
            await self.add(entry);

            const db = await pool.db;
            const res = await db.collection(TestAdd.name).find().toArray();
            deepStrictEqual(
                toEntries(res),
                [entry]
            );
        });
    });

    describe('.query(): IQuery', () => {
        class TestQuery { }
        it('ok', async () => {
            const rows: any = [{
                _id: `${TestQuery.name}-1`,
            }, {
                _id: `${TestQuery.name}-2`,
            }];
            const db = await pool.db;
            const collection = db.collection(TestQuery.name);
            await collection.insertMany(rows);

            const res = await new Self(pool, null, dbFactory, TestQuery).query().toArray();

            await collection.deleteMany(null);

            deepStrictEqual(
                res,
                toEntries(rows)
            );
        });

        it('where', async () => {
            const rows: any = [{
                _id: `${TestQuery.name}-3`,
            }, {
                _id: `${TestQuery.name}-4`,
            }];
            const db = await pool.db;
            const collection = db.collection(TestQuery.name);
            await collection.insertMany(rows);

            const res = await new Self(pool, null, dbFactory, TestQuery).query().toArray({
                where: {
                    id: rows[0]._id
                }
            });

            await collection.deleteMany(null);

            deepStrictEqual(
                res,
                toEntries([rows[0]])
            );
        });
    });

    describe('.remove(entry: any): Promise<void>', () => {
        class TestRemove { }
        it('m_IsTx = true', async () => {
            const rows: any = [{
                _id: `${TestRemove.name}-1`,
            }];
            const db = await pool.db;
            const collection = db.collection(TestRemove.name);
            await collection.insertMany(rows);

            const uow = new MongoDefaultUnitOfWork(pool);
            const self = new Self(pool, uow, dbFactory, TestRemove);
            await self.remove({
                id: rows[0]._id,
            });

            const res = await db.collection(TestRemove.name).find().toArray();
            deepStrictEqual(res, rows);

            await collection.deleteMany(null);
        });

        it('m_IsTx = false', async () => {
            const rows: any = [{
                _id: `${TestRemove.name}-1`,
            }];
            const db = await pool.db;
            const collection = db.collection(TestRemove.name);
            await collection.insertMany(rows);

            const self = new Self(pool, null, dbFactory, TestRemove);
            await self.remove({
                id: rows[0]._id,
            });

            const res = await db.collection(TestRemove.name).find().toArray();
            deepStrictEqual(res, []);
        });
    });

    describe('.save(entry: any): Promise<void>', () => {
        class TestSave { }
        it('m_IsTx = true', async () => {
            const rows: any = [{
                _id: `${TestSave.name}-1`,
                name: 'one',
            }];
            const db = await pool.db;
            const collection = db.collection(TestSave.name);
            await collection.insertMany(rows);

            const uow = new MongoDefaultUnitOfWork(pool);
            const self = new Self(pool, uow, dbFactory, TestSave);
            let entry = toEntries(rows)[0];
            entry.name = 'two';
            await self.save(entry);

            const res = await db.collection(TestSave.name).find().toArray();
            deepStrictEqual(res, rows);

            await collection.deleteMany(null);
        });

        it('m_IsTx = false', async () => {
            const rows: any = [{
                _id: `${TestSave.name}-2`,
                name: 'one',
            }];
            const db = await pool.db;
            const collection = db.collection(TestSave.name);
            await collection.insertMany(rows);

            const self = new Self(pool, null, dbFactory, TestSave);
            let entry = toEntries(rows)[0];
            entry.name = 'two';
            await self.save(entry);

            const res = await db.collection(TestSave.name).find().toArray();
            deepStrictEqual(res, [{
                _id: rows[0]._id,
                name: entry.name,
            }]);

            await collection.deleteMany(null);
        });
    });
});
