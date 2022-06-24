import { ClientSession } from 'mongodb';

import { MongoPool } from './pool';
import { toDoc } from './helper';
import { UnitOfWorkRepositoryBase } from '../../contract';

/**
 * mongo工作单元
 */
export abstract class MongoUnitOfWorkBase extends UnitOfWorkRepositoryBase {
    /**
     * 队列
     */
    protected queue: ((session: ClientSession) => Promise<void>)[] = [];

    /**
     * 构造函数
     * 
     * @param m_Pool 连接池
     */
    public constructor(
        private m_Pool: MongoPool,
    ) {
        super();
    }

    /**
     * 提交
     */
    public async commit() {
        if (!this.queue.length)
            return;

        const client = await this.m_Pool.client;
        const session = client.startSession();
        await this.onCommit(session);
        await session.endSession();
        this.queue = [];

        try {
            for (const r of Object.values(this.afterAction))
                await r();
        } catch { } finally {
            this.afterAction = {};
        }
    }

    /**
     * 注册新增
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerAdd(model: Function, entry: any) {
        this.queue.push(async session => {
            const db = await this.m_Pool.db;
            await db.collection(model.name).insertOne(
                toDoc(entry),
                {
                    session,
                }
            );
        });
    }

    /**
     * 注册删除
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerRemove(model: Function, entry: any) {
        this.queue.push(async session => {
            const db = await this.m_Pool.db;
            await db.collection(model.name).deleteOne({
                _id: entry.id,
            }, {
                session,
            });
        });
    }

    /**
     * 注册更新
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerSave(model: Function, entry: any) {
        this.queue.push(async session => {
            const db = await this.m_Pool.db;
            await db.collection(model.name).updateOne({
                _id: entry.id,
            }, {
                $set: toDoc(entry),
            }, {
                session,
            });
        });
    }

    /**
     * 提交
     * 
     * @param session 会话
     */
    protected abstract onCommit(session: ClientSession): Promise<void>;
}
