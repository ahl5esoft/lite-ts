import { JaegerDbRepository } from './db-repository';
import { JaegerUnitOfWork } from './unit-of-work';
import { DbFactoryBase, ITraceable, UnitOfWorkRepositoryBase } from '../..';
import { opentracing } from 'jaeger-client';

/**
 * jaeger数据库工厂
 */
export class JaegerDbFactory extends DbFactoryBase implements ITraceable {
    /**
     * 数据库工厂
     * 
     * @param m_DbFactory 数据库工厂
     * @param m_ParentSpan 父跟踪范围
     */
    public constructor(
        private m_DbFactory: DbFactoryBase,
        private m_ParentSpan?: opentracing.Span
    ) {
        super();
    }

    /**
     * 创建数据库仓储
     * 
     * @param model 模型
     * @param uow 工作单元
     */
    public db<T>(model: new () => T, uow?: UnitOfWorkRepositoryBase) {
        return new JaegerDbRepository<T>(
            this.m_DbFactory,
            this.m_ParentSpan,
            uow,
            this,
            model
        );
    }

    /**
     * 创建工作单元
     */
    public uow() {
        return new JaegerUnitOfWork(
            this.m_DbFactory.uow() as UnitOfWorkRepositoryBase,
            this.m_ParentSpan,
        );
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        return new JaegerDbFactory(this.m_DbFactory, parentSpan);
    }
}