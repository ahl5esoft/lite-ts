import { DbPool } from './db-pool';
import { DbQuery } from './db-query';
import { DbFactoryBase, DbRepositoryBase, IUnitOfWorkRepository } from '../../contract';

export class DbRepository<T> extends DbRepositoryBase<T> {
    public constructor(
        private m_Pool: DbPool,
        uow: IUnitOfWorkRepository,
        dbFactory: DbFactoryBase,
        tableName: string,
    ) {
        super(tableName, uow, dbFactory);
    }

    public query() {
        return new DbQuery<T>(this.m_Pool, this.tableName);
    }
}
