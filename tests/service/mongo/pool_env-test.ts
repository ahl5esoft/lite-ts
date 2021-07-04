import { ok } from 'assert';

import { Pool as Self } from '../../../src/service/mongo/pool';

const dbName = 'test-db-pool';
const url = 'mongodb://localhost:27017';

describe('src/service/mongo/pool.ts', (): void => {
    describe('.getClient(): Promise<MongoClient>', (): void => {
        it('ok', async (): Promise<void> => {
            const client = await new Self(dbName, url).getClient();
            ok(client.isConnected());
            await client.close();
        });
    });

    describe('.get(): Promise<Db>', (): void => {
        it('ok', async (): Promise<void> => {
            const self = new Self(dbName, url);
            const db = await self.getDb();
            ok(db);

            const client = await self.getClient();
            await client.close();
        });
    });
});
