import { deepStrictEqual } from 'assert';

import { MongoDbPool } from './db-pool';
import { toEntries } from './helper';
import { MongoUnitOfWork as Self } from './unit-of-work';

const pool = new MongoDbPool('test-uow', 'mongodb://localhost:27017');

describe('src/service/mongo/unit-of-work.ts', () => {
    after(async () => {
        const db = await pool.getDb();
        await db.dropDatabase();

        const client = await pool.client;
        await client.close();
    });

    describe('.registerAdd(model: Function, entry: any): void', () => {
        class RegisterAdd {
            public id: string;
            public name: string;
        }
        it('ok', async () => {
            const self = new Self(pool);
            const entry = {
                id: `${RegisterAdd.name}-1`,
                name: 'test',
            };
            self.registerAdd(RegisterAdd, entry);
            await self.commit();

            const db = await pool.getDb();
            const res = await db.collection(RegisterAdd.name).find().toArray();
            deepStrictEqual(
                toEntries(res),
                [entry]
            );
        });
    });

    describe('.registerRemove(model: Function, entry: any): void', () => {
        class RegisterRemove {
            public id: string;
        }
        it('ok', async () => {
            const rows = [{
                _id: `${RegisterRemove.name}-1`,
            }, {
                _id: `${RegisterRemove.name}-2`,
            }];
            const db = await pool.getDb();
            const collection = db.collection(RegisterRemove.name);
            await collection.insertMany(rows);

            const self = new Self(pool);
            self.registerRemove(
                RegisterRemove,
                toEntries(rows)[0],
            );
            await self.commit();

            const res = await db.collection(RegisterRemove.name).find().toArray();
            deepStrictEqual(res, [rows[1]]);
        });
    });

    describe('.registerSave(model: Function, entry: any): void', () => {
        class RegisterSave {
            public id: string;
            public name: string;
        }
        it('ok', async () => {
            const rows = [{
                _id: `${RegisterSave.name}-1`,
                name: 'one',
            }];
            const db = await pool.getDb();
            const collection = db.collection(RegisterSave.name);
            await collection.insertMany(rows);

            const self = new Self(pool);
            let entry = toEntries(rows)[0];
            entry.name = 'two';
            self.registerSave(RegisterSave, entry);
            await self.commit();

            const res = await db.collection(RegisterSave.name).find().toArray();
            deepStrictEqual(res, [{
                _id: rows[0]._id,
                name: entry.name,
            }]);
        });
    });
});
