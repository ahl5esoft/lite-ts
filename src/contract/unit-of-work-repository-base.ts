import { IUnitOfWork } from './i-unit-of-work';

/**
 * 工作单元仓储
 */
export abstract class UnitOfWorkRepositoryBase implements IUnitOfWork {
    /**
     * 提交后函数
     */
    private m_AfterAction: { [key: string]: () => Promise<void>; } = {};

    /**
     * 注册提交后函数
     * 
     * @param action 函数
     * @param key 键
     */
    public registerAfter(action: () => Promise<void>, key?: string) {
        key ??= `key-${Object.keys(this.m_AfterAction).length}`;
        this.m_AfterAction[key] = action;
    }

    /**
     * 提交
     */
    public async commit() {
        try {
            await this.onCommit();
        } finally {
            const tasks = Object.values(this.m_AfterAction).map(r => {
                return r();
            });
            await Promise.all(tasks);
        }
    }

    /**
     * 注册新增
     * 
     * @param model 模型
     * @param entry 实体
     */
    public abstract registerAdd<T>(model: new () => T, entry: T): void;
    /**
     * 注册删除
     * 
     * @param model 模型
     * @param entry 实体
     */
    public abstract registerRemove<T>(model: new () => T, entry: T): void;
    /**
     * 注册更新
     * 
     * @param model 模型
     * @param entry 实体
     */
    public abstract registerSave<T>(model: new () => T, entry: T): void;
    /**
     * 提交
     */
    protected abstract onCommit(): Promise<void>;
}