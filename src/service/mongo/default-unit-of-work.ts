import { AnyBulkWriteOperation, ClientSession } from 'mongodb';

import { MongoUnitOfWorkBase } from './unit-of-work-base';

/**
 * 工作单元
 */
export class MongoDefaultUnitOfWork extends MongoUnitOfWorkBase {
    /**
     * 提交
     * 
     * @param session 会话
     * @param bulks 批量
     */
    protected async commitWithSession(session: ClientSession, bulks: [string, AnyBulkWriteOperation[]][]) {
        const db = await this.pool.db;
        for (const r of bulks) {
            await db.collection(r[0]).bulkWrite(r[1], {
                ...this.bulkWriteOptions,
                session,
            });
        }
    }
}
