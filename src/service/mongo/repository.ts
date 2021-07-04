import { Pool } from './pool';
import { Query } from './query';
import { DBFactoryBase, DBQueryBase, DBRepositoryBase, UnitOfWorkBase } from '../../contract';

export class Repository<T> extends DBRepositoryBase<T> {
    public constructor(
        private m_Pool: Pool,
        dbFactory: DBFactoryBase,
        tableName: string,
        uow: UnitOfWorkBase
    ) {
        super(tableName, dbFactory, uow);
    }

    public query(): DBQueryBase<T> {
        return new Query<T>(this.m_Pool, this.tableName);
    }
}
