import { DbPool } from './db-pool';
import { DbQuery } from './db-query';
import { DbFactoryBase, DbRepositoryBase, IUnitOfWorkRepository } from '../../contract';

/**
 * mongo文档数据仓储
 */
export class DbRepository<T> extends DbRepositoryBase<T> {
    /**
     * 构造函数
     * 
     * @param m_Pool 数据池
     * @param uow 工作单元仓储
     * @param dbFactory 数据库工厂
     * @param table 表明
     */
    public constructor(
        private m_Pool: DbPool,
        uow: IUnitOfWorkRepository,
        dbFactory: DbFactoryBase,
        table: string,
    ) {
        super(table, uow, dbFactory);
    }

    /**
     * 创建表查询对象
     */
    public query() {
        return new DbQuery<T>(this.m_Pool, this.table);
    }
}
