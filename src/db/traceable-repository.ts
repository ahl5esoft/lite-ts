import { DBFactoryBase } from './factory-base';
import { DBQueryBase } from './query-base';
import { DBRepositoryBase } from './repository-base';
import { TraceableDBQuery } from './traceable-query';
import { UnitOfWorkBase } from './unit-of-work-base';
import { Trace } from '../runtime';

export class TraceableDBRepository<T> extends DBRepositoryBase<T> {
    public constructor(
        private m_Repository: DBRepositoryBase<T>,
        private m_Trace: Trace,
        private m_TraceSpanID: string,
        dbFactory: DBFactoryBase,
        tableName: string,
        uow: UnitOfWorkBase
    ) {
        super(tableName, dbFactory, uow);
    }

    public query(): DBQueryBase<T> {
        const query = this.m_Repository.query();
        return new TraceableDBQuery(query, this.tableName, this.m_Trace, this.m_TraceSpanID);
    }
}