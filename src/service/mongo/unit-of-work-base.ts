import { AnyBulkWriteOperation, ClientSession } from 'mongodb';

import { MongoPool } from './pool';
import { toDoc } from './helper';
import { UnitOfWorkRepositoryBase } from '../../contract';

/**
 * mongo工作单元
 */
export abstract class MongoUnitOfWorkBase extends UnitOfWorkRepositoryBase {
    /**
     * 批量
     */
    private m_Bulk: { [model: string]: AnyBulkWriteOperation[] } = {};

    /**
     * 构造函数
     * 
     * @param pool 连接池
     */
    public constructor(
        protected pool: MongoPool,
    ) {
        super();
    }

    /**
     * 提交
     */
    public async commit() {
        const bulks = Object.entries(this.m_Bulk);
        if (!bulks.length)
            return;

        const client = await this.pool.client;
        const session = client.startSession();
        await this.onCommit(session, bulks);
        await session.endSession();
        this.m_Bulk = {};

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
        this.m_Bulk[model.name] ??= [];
        this.m_Bulk[model.name].push({
            insertOne: {
                document: toDoc(entry)
            }
        });
    }

    /**
     * 注册删除
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerRemove(model: Function, entry: any) {
        this.m_Bulk[model.name] ??= [];
        this.m_Bulk[model.name].push({
            deleteOne: {
                filter: {
                    _id: entry.id,
                }
            }
        });
    }

    /**
     * 注册更新
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerSave(model: Function, entry: any) {
        this.m_Bulk[model.name] ??= [];
        this.m_Bulk[model.name].push({
            updateOne: {
                filter: {
                    _id: entry.id,
                },
                update: {
                    $set: toDoc(entry),
                }
            }
        });
    }

    /**
     * 提交
     * 
     * @param session 会话
     * @param bulks 批量操作
     */
    protected abstract onCommit(session: ClientSession, bulks: [string, AnyBulkWriteOperation[]][]): Promise<void>;
}
