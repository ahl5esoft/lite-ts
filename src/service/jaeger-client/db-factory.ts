import { opentracing } from 'jaeger-client';

import { JaegerClientDbRepository } from './db-repository';
import { JaegerClientUnitOfWork } from './unit-of-work';
import { DbFactoryBase, ITraceable, UnitOfWorkRepositoryBase } from '../../contract';

export class JaegerClientDbFactory extends DbFactoryBase implements ITraceable<DbFactoryBase> {
    public constructor(
        private m_DbFactory: DbFactoryBase,
        private m_ParentSpan?: opentracing.Span
    ) {
        super();
    }

    public db<T>(model: new () => T, uow?: UnitOfWorkRepositoryBase) {
        return new JaegerClientDbRepository<T>(
            this.m_DbFactory,
            this.m_ParentSpan,
            this,
            uow,
            model
        );
    }

    public uow() {
        return new JaegerClientUnitOfWork(
            this.m_DbFactory.uow() as UnitOfWorkRepositoryBase,
            this.m_ParentSpan,
        );
    }

    public withTrace(parentSpan: any) {
        return parentSpan ? new JaegerClientDbFactory(this.m_DbFactory, parentSpan) : this.m_DbFactory;
    }
}