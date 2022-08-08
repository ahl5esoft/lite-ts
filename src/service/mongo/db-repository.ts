import { MongoDbQuery } from './db-query';
import { MongoPool } from './pool';
import { DbFactoryBase, DbRepositoryBase, UnitOfWorkRepositoryBase } from '../../contract';

/**
 * mongo文档数据仓储
 */
export class MongoDbRepository<T> extends DbRepositoryBase<T> {
    /**
     * 构造函数
     * 
     * @param m_Pool 数据池
     * @param uow 工作单元仓储
     * @param dbFactory 数据库工厂
     * @param model 模型
     */
    public constructor(
        private m_Pool: MongoPool,
        uow: UnitOfWorkRepositoryBase,
        dbFactory: DbFactoryBase,
        model: new () => T,
    ) {
        super(dbFactory, model, uow);
    }

    /**
     * 创建表查询对象
     */
    public query() {
        return new MongoDbQuery<T>(this.m_Pool, this.model.name);
    }
}
