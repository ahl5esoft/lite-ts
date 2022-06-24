import { ClientSession, ReadPreference } from 'mongodb';

import { MongoUnitOfWorkBase } from './unit-of-work-base';

/**
 * 分布式工作单元
 */
export class MongoDistributedUnitOfWork extends MongoUnitOfWorkBase {
    /**
     * 提交
     * 
     * @param session 会话
     */
    protected async onCommit(session: ClientSession) {
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

            for (const r of this.queue)
                await r(session);

            await session.commitTransaction();
        } catch (ex) {
            console.log(ex);

            await session.abortTransaction();
        }
    }
}