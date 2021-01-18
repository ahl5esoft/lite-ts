import { ok } from 'assert';

import { Pool as Self } from '../../../../plugin/db/mongo/pool';

const dbName = 'test-db-pool';
const url = 'mongodb://localhost:27017';

describe('src/plugin/db/mongo/pool.ts', (): void => {
    describe('.getClient(): Promise<MongoClient>', (): void => {
        it('ok', async (): Promise<void> => {
            const client = await new Self(dbName, url).getClient();
            const isConnected = client.isConnected();
            await client.close();
            ok(isConnected);
        });
    });

    describe('.get(): Promise<Db>', (): void => {
        it('ok', async (): Promise<void> => {
            const self = new Self(dbName, url);
            const db = await self.getDb();
            const client = await self.getClient();
            await client.close();

            ok(db);
        });
    });
});
