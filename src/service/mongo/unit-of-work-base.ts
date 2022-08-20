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

        const doc = toDoc(entry);
        const index = this.m_Bulk[model.name].findIndex(r => {
            return (r as any).updateOne?.filter?._id == doc._id;
        });
        if (index != -1)
            this.m_Bulk[model.name].splice(index, 1);

        delete doc._id;
        this.m_Bulk[model.name].push({
            updateOne: {
                filter: {
                    _id: entry.id,
                },
                update: {
                    $set: doc,
                }
            }
        });
    }

    /**
     * 提交
     */
    protected async onCommit() {
        const bulks = Object.entries(this.m_Bulk);
        if (!bulks.length)
            return;

        const client = await this.pool.client;
        const session = client.startSession({
            defaultTransactionOptions: {
                writeConcern: {
                    w: 1
                }
            }
        });
        await this.commitWithSession(session, bulks);
        await session.endSession();
        this.m_Bulk = {};
    }

    /**
     * 提交
     * 
     * @param session 会话
     * @param bulks 批量操作
     */
    protected abstract commitWithSession(session: ClientSession, bulks: [string, AnyBulkWriteOperation[]][]): Promise<void>;
}
