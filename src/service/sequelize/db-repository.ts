import { SequelizeDbQuery } from './db-query';
import { SequelizeModelPool } from './model-pool';
import { DbFactoryBase, DbRepositoryBase, UnitOfWorkRepositoryBase } from '../..';

/**
 * Sequelize数据仓库
 */
export class SequelizeDbRepository<T> extends DbRepositoryBase<T> {
    /**
     * 构造函数
     * 
     * @param m_SqlModelPool seq模型池
     * @param dbFactory 数据库工厂
     * @param uow 工作单元
     * @param model 模型
     */
    public constructor(
        private m_SqlModelPool: SequelizeModelPool,
        dbFactory: DbFactoryBase,
        uow: UnitOfWorkRepositoryBase,
        model: new () => T,
    ) {
        super(model, uow, dbFactory);
    }

    /**
     * 创建查询
     */
    public query() {
        return new SequelizeDbQuery(this.m_SqlModelPool, this.model);
    }
}