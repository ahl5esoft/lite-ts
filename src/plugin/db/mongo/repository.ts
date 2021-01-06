import { Pool } from './pool';
import { Query } from './query';
import { UnitOfWork } from './unit-of-work';
import { RepositoryBase } from '../repository-base';
import { QueryBase } from '../query-base';

export class Repository<T> extends RepositoryBase<T> {
    public constructor(private m_Pool: Pool, table: string, isTx: boolean, uow: UnitOfWork) {
        super(table, isTx, uow);
    }

    public query(): QueryBase<T> {
        return new Query<T>(this.m_Pool, this.table);
    }
}
