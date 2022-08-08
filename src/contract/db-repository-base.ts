import { DbFactoryBase } from './db-factory-base';
import { IDbQuery } from './i-db-query';
import { UnitOfWorkRepositoryBase } from './unit-of-work-repository-base';

type regiterAction = (model: Function, entry: any) => void;

/**
 * 表数据仓储
 */
export abstract class DbRepositoryBase<T> {
    /**
     * 是否有事务
     */
    private m_IsTx = true;

    /**
     * 工作单元
     */
    protected get uow() {
        if (!this.m_Uow) {
            this.m_Uow = this.dbFactory.uow() as UnitOfWorkRepositoryBase;
            this.m_IsTx = false;
        }

        return this.m_Uow;
    }

    /**
     * 构造函数
     * 
     * @param dbFactory 数据库工厂
     * @param model 模型
     * @param m_Uow 工作单元
     */
    public constructor(
        protected dbFactory: DbFactoryBase,
        protected model: new () => T,
        private m_Uow: UnitOfWorkRepositoryBase,
    ) { }

    /**
     * 新增
     * 
     * @param entry 实体
     */
    public async add(entry: T) {
        await this.exec(this.uow.registerAdd, entry);
    }

    /**
     * 删除
     * 
     * @param entry 实体
     */
    public async remove(entry: T) {
        await this.exec(this.uow.registerRemove, entry);
    }

    /**
     * 更新
     * 
     * @param entry 实体
     */
    public async save(entry: T) {
        await this.exec(this.uow.registerSave, entry);
    }

    /**
     * 创建表查询对象
     */
    public abstract query(): IDbQuery<T>;

    /**
     * 执行方法, 如果不存在事务则直接提交
     * 
     * @param action 方法
     * @param entry 实体
     */
    private async exec(action: regiterAction, entry: any) {
        action.bind(this.uow)(this.model, entry);
        if (this.m_IsTx)
            return;

        await this.uow.commit();
    }
}
