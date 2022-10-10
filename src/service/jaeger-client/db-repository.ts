import { opentracing } from 'jaeger-client';

import { JaegerClientDbQuery } from './db-query';
import { DbFactoryBase, DbRepositoryBase, UnitOfWorkRepositoryBase } from '../..';

export class JaegerClientDbRepository<T> extends DbRepositoryBase<T> {
    private m_Repo: DbRepositoryBase<T>;
    protected get repo() {
        if (!this.m_Repo)
            this.m_Repo = this.m_OriginDbFactory.db(this.model, this.uow);

        return this.m_Repo;
    }

    public constructor(
        private m_OriginDbFactory: DbFactoryBase,
        private m_ParentTracerSpan: opentracing.Span,
        jaegerDbFactory: DbFactoryBase,
        uow: UnitOfWorkRepositoryBase,
        model: new () => T,
    ) {
        super(jaegerDbFactory, model, uow);
    }

    /**
     * 创建数据库查询
     */
    public query() {
        return new JaegerClientDbQuery<T>(
            this.repo.query(),
            this.model.name,
            this.m_ParentTracerSpan,
        );
    }
}