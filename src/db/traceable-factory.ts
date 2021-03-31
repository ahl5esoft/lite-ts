import { DBFactoryBase } from './factory-base';
import { DBRepositoryBase } from './repository-base';
import { TraceableDBRepository } from './traceable-repository';
import { TraceableUnitOfWork } from './traceable-unit-of-work';
import { UnitOfWorkBase } from './unit-of-work-base';
import { ITraceable, TraceFactoryBase } from '../runtime';

export class TraceableDBFactory extends DBFactoryBase implements ITraceable {
    public traceID = '';

    public traceSpanID = '';

    public constructor(private m_DBFactory: DBFactoryBase, private m_TraceFactory: TraceFactoryBase) {
        super();
    }

    public db<T>(model: Function, uow?: UnitOfWorkBase): DBRepositoryBase<T> {
        return new TraceableDBRepository(
            this.m_DBFactory.db<T>(model, uow),
            this.m_TraceFactory.build(this.traceID),
            this.traceSpanID,
            this,
            model.name,
            uow
        );
    }

    public uow(): UnitOfWorkBase {
        return new TraceableUnitOfWork(
            this.m_TraceFactory.build(this.traceID),
            this.traceSpanID,
            this.m_DBFactory.uow()
        );
    }
}