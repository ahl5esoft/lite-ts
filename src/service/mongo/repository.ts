import { Pool } from './pool';
import { Query } from './query';
import { DBFactoryBase, DBRepositoryBase, IUnitOfWorkRepository } from '../../contract';

export class Repository<T> extends DBRepositoryBase<T> {
    public constructor(
        private m_Pool: Pool,
        dbFactory: DBFactoryBase,
        tableName: string,
        uow: IUnitOfWorkRepository
    ) {
        super(tableName, dbFactory, uow);
    }

    public query() {
        return new Query<T>(this.m_Pool, this.tableName);
    }
}
