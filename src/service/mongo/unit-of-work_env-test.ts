import { deepStrictEqual } from 'assert';

import { toEntries } from './helper';
import { Pool } from './pool';
import { UnitOfWork as Self } from './unit-of-work';

const pool = new Pool('test-uow', 'mongodb://localhost:27017');

describe('src/service/mongo/unit-of-work.ts', () => {
    after(async () => {
        const db = await pool.getDb();
        await db.dropDatabase();

        const client = await pool.getClient();
        await client.close();
    });

    describe('.registerAdd(table: string, entry: any): void', () => {
        const table = 'registerAdd';
        it('ok', async () => {
            const self = new Self(pool);
            const entry = {
                id: `${table}-1`,
                name: 'test',
            };
            self.registerAdd(table, entry);
            await self.commit();

            const db = await pool.getDb();
            const res = await db.collection(table).find().toArray();
            deepStrictEqual(
                toEntries(res),
                [entry]
            );
        });
    });

    describe('.registerAfter(action: () => Promise<void>)', () => {
        it('ok', () => {
            const self = new Self(null);
            const action = async () => { };
            self.registerAfter(action);

            const actions = Reflect.get(self, 'm_AfterActions');
            deepStrictEqual(actions, [action]);
        });
    });

    describe('.registerRemove(table: string, entry: any): void', () => {
        const table = 'registerRemove';
        it('ok', async () => {
            const rows = [{
                _id: `${table}-1`,
            }, {
                _id: `${table}-2`,
            }];
            const db = await pool.getDb();
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const self = new Self(pool);
            self.registerRemove(
                table,
                toEntries(rows)[0],
            );
            await self.commit();

            const res = await db.collection(table).find().toArray();
            deepStrictEqual(res, [rows[1]]);
        });
    });

    describe('.registerSave(table: string, entry: any): void', () => {
        const table = 'registerSave';
        it('ok', async () => {
            const rows = [{
                _id: `${table}-1`,
                name: 'one',
            }];
            const db = await pool.getDb();
            const collection = db.collection(table);
            await collection.insertMany(rows);

            const self = new Self(pool);
            let entry = toEntries(rows)[0];
            entry.name = 'two';
            self.registerSave(table, entry);
            await self.commit();

            const res = await db.collection(table).find().toArray();
            deepStrictEqual(res, [{
                _id: rows[0]._id,
                name: entry.name,
            }]);
        });
    });
});
