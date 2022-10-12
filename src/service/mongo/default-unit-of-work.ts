import { AnyBulkWriteOperation, ClientSession } from 'mongodb';

import { MongoUnitOfWorkBase } from './unit-of-work-base';

export class MongoDefaultUnitOfWork extends MongoUnitOfWorkBase {
    protected async commitWithSession(session: ClientSession, bulks: [string, AnyBulkWriteOperation[]][]) {
        const db = await this.pool.db;
        for (const r of bulks) {
            await db.collection(r[0]).bulkWrite(r[1], {
                ...this.blukWriteOptions,
                session,
            });
        }
    }
}
