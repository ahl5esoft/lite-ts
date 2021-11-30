import { Pool } from './pool';
import { DbQuery } from './db-query';
import { DbFactoryBase, DbRepositoryBase, IUnitOfWorkRepository } from '../../contract';

export class DbRepository<T> extends DbRepositoryBase<T> {
    public constructor(
        private m_Pool: Pool,
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
