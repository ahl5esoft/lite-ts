import { Pool } from './pool';
import { Query } from './query';
import { UnitOfWork } from './unit-of-work';
import { DBQueryBase, DBRepositoryBase } from '../../db';

export class Repository<T> extends DBRepositoryBase<T> {
    public constructor(
        private m_Pool: Pool,
        tableName: string,
        isTx: boolean,
        uow: UnitOfWork
    ) {
        super(tableName, isTx, uow);
    }

    public query(): DBQueryBase<T> {
        return new Query<T>(this.m_Pool, this.tableName);
    }
}
