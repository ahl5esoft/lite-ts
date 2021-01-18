import { Pool } from './pool';
import { Query } from './query';
import { UnitOfWork } from './unit-of-work';
import { DbQueryBase } from '../query-base';
import { DbRepositoryBase } from '../repository-base';

export class Repository<T> extends DbRepositoryBase<T> {
    public constructor(private m_Pool: Pool, table: string, isTx: boolean, uow: UnitOfWork) {
        super(table, isTx, uow);
    }

    public query(): DbQueryBase<T> {
        return new Query<T>(this.m_Pool, this.table);
    }
}
