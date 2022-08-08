import { AnyBulkWriteOperation, ClientSession, ReadPreference } from 'mongodb';

import { MongoUnitOfWorkBase } from './unit-of-work-base';

/**
 * 分布式工作单元
 */
export class MongoDistributedUnitOfWork extends MongoUnitOfWorkBase {
    /**
     * 提交
     * 
     * @param session 会话
     * @param bulks 批量
     */
    protected async commitWithSession(session: ClientSession, bulks: [string, AnyBulkWriteOperation[]][]) {
        try {
            session.startTransaction({
                readPreference: ReadPreference.primary,
                readConcern: {
                    level: 'local'
                },
                writeConcern: {
                    w: 'majority'
                },
                maxCommitTimeMS: 1000
            });

            const db = await this.pool.db;
            for (const r of bulks)
                await db.collection(r[0]).bulkWrite(r[1], { session });

            await session.commitTransaction();
        } catch (ex) {
            console.log(ex);

            await session.abortTransaction();
        }
    }
}