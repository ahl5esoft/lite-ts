import { ok } from 'assert';

import { MongoPool as Self } from './pool';

const dbName = 'test-db-pool';
const url = 'mongodb://localhost:27017';

describe('src/service/mongo/pool.ts', () => {
    describe('.client', () => {
        it('ok', async () => {
            const client = await new Self(dbName, url).client;
            await client.close();
        });
    });

    describe('.db', () => {
        it('ok', async () => {
            const self = new Self(dbName, url);
            const db = await self.db;
            ok(db);

            const client = await self.client;
            await client.close();
        });
    });
});
