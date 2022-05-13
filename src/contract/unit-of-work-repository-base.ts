import { IUnitOfWork } from './i-unit-of-work';

/**
 * 工作单元仓储
 */
export abstract class UnitOfWorkRepositoryBase implements IUnitOfWork {
    /**
     * 提交后函数数组
     */
    protected afterActions: (() => Promise<void>)[] = [];

    /**
     * 提交
     */
    public abstract commit(): Promise<void>;

    /**
     * 注册新增
     * 
     * @param model 模型
     * @param entry 实体
     */
    public abstract registerAdd<T>(model: new () => T, entry: T): void;

    /**
     * 注册提交后函数
     * 
     * @param action 函数
     */
    public registerAfter(action: () => Promise<void>) {
        this.afterActions.push(action);
    }

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
}