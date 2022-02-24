import { ElasticSearchPool } from './pool';
import { UnitOfWorkRepositoryBase } from '../..';

/**
 * 操作项
 */
interface IOperationItem {
    /**
     * 实体
     */
    entry: any;
    /**
     * 模型
     */
    model: Function;
    /**
     * 操作
     */
    op: 'delete' | 'index' | 'update';
}

/**
 * es工作单元
 */
export class ElasticSearchUnitOfWork extends UnitOfWorkRepositoryBase {
    /**
     * 项数组
     */
    private m_Items: IOperationItem[] = [];

    /**
     * 构造函数
     * 
     * @param m_Pool 池
     */
    public constructor(
        private m_Pool: ElasticSearchPool
    ) {
        super();
    }

    /**
     * 提交
     */
    public async commit() {
        const operations = [];
        for (const r of this.m_Items) {
            const index = await this.m_Pool.getIndex(r.model);
            const opEntry = {
                _id: r.entry.id,
                _index: index,
            };
            if (r.op == 'index') {
                operations.push({
                    [r.op]: opEntry
                }, r.entry);
            } else if (r.op == 'delete') {
                operations.push({
                    [r.op]: opEntry
                });
            } else {
                operations.push({
                    [r.op]: opEntry
                }, {
                    doc: r.entry
                });
            }
        }
        this.m_Items = [];

        await this.m_Pool.client.bulk({
            operations: operations,
            refresh: true
        }, {
            ignore: [400]
        });
    }

    /**
     * 注册新增
     * 
     * @param model 模型
     * @param entry 
     */
    public registerAdd(model: Function, entry: any) {
        this.m_Items.push({
            entry: entry,
            model: model,
            op: 'index',
        });
    }

    /**
     * 注册删除
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerRemove(model: Function, entry: any) {
        this.m_Items.push({
            entry: entry,
            model: model,
            op: 'delete',
        });
    }

    /**
     * 注册更新
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerSave(model: Function, entry: any) {
        this.m_Items.push({
            entry: entry,
            model: model,
            op: 'update',
        });
    }
}