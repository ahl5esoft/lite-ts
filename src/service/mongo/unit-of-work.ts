import { ClientSession } from 'mongodb';

import { DbPool } from './db-pool';
import { toDoc } from './helper';
import { UnitOfWorkRepositoryBase } from '../..';

/**
 * 工作单元
 */
export class UnitOfWork extends UnitOfWorkRepositoryBase {
    /**
     * 队列
     */
    private m_Queue: ((session: ClientSession) => Promise<void>)[] = [];

    /**
     * 构造函数
     * 
     * @param m_Pool 连接池
     */
    public constructor(private m_Pool: DbPool) {
        super();
    }

    /**
     * 提交
     */
    public async commit() {
        const client = await this.m_Pool.getClient();
        const session = client.startSession();
        session.startTransaction();

        for (const r of this.m_Queue)
            await r(session);
        this.m_Queue = [];

        await session.commitTransaction();

        for (const r of this.afterActions)
            await r();
        this.afterActions = [];
    }

    /**
     * 注册新增
     * 
     * @param table 表
     * @param entry 实体
     */
    public registerAdd(table: string, entry: any) {
        this.m_Queue.push(async session => {
            const db = await this.m_Pool.getDb();
            await db.collection(table, {
                session: session,
            }).insertOne(toDoc(entry));
        });
    }

    /**
     * 注册删除
     * 
     * @param table 表
     * @param entry 实体
     */
    public registerRemove(table: string, entry: any) {
        this.m_Queue.push(async session => {
            const db = await this.m_Pool.getDb();
            await db.collection(table, {
                session: session,
            }).deleteOne({
                _id: entry.id,
            });
        });
    }

    /**
     * 注册更新
     * 
     * @param table 表
     * @param entry 实体
     */
    public registerSave(table: string, entry: any) {
        this.m_Queue.push(async session => {
            const db = await this.m_Pool.getDb();
            await db.collection(table, {
                session: session,
            }).updateOne({
                _id: entry.id,
            }, {
                $set: toDoc(entry),
            });
        });
    }
}
