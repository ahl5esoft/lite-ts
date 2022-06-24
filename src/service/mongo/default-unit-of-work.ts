import { ClientSession } from 'mongodb';

import { MongoUnitOfWorkBase } from './unit-of-work-base';

/**
 * 工作单元
 */
export class MongoDefaultUnitOfWork extends MongoUnitOfWorkBase {
    /**
     * 提交
     * 
     * @param session 会话
     */
    protected async onCommit(session: ClientSession) {
        for (const r of this.queue)
            await r(session);
    }
}
