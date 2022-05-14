import { ok } from 'assert';

import { MongoDbPool as Self } from './db-pool';

const dbName = 'test-db-pool';
const url = 'mongodb://localhost:27017';

describe('src/service/mongo/db-pool.ts', () => {
    describe('.getClient(): Promise<MongoClient>', () => {
        it('ok', async () => {
            const client = await new Self(dbName, url).client;
            ok(client.isConnected());
            await client.close();
        });
    });

    describe('.get(): Promise<Db>', () => {
        it('ok', async () => {
            const self = new Self(dbName, url);
            const db = await self.getDb();
            ok(db);

            const client = await self.client;
            await client.close();
        });
    });
});
