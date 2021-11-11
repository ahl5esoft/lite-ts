import { Pool } from './pool';
import { Query } from './query';
import { DbFactoryBase, DbRepositoryBase, IUnitOfWorkRepository } from '../../contract';

export class Repository<T> extends DbRepositoryBase<T> {
    public constructor(
        private m_Pool: Pool,
        uow: IUnitOfWorkRepository,
        dbFactory: DbFactoryBase,
        tableName: string,
    ) {
        super(tableName, uow, dbFactory);
    }

    public query() {
        return new Query<T>(this.m_Pool, this.tableName);
    }
}
