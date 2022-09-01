import { opentracing } from 'jaeger-client';

import { JaegerDbQuery } from './db-query';
import { DbFactoryBase, DbRepositoryBase, UnitOfWorkRepositoryBase } from '../..';

/**
 * jaeger数据库仓储
 */
export class JaegerDbRepository<T> extends DbRepositoryBase<T> {
    private m_Repo: DbRepositoryBase<T>;
    /**
     * 原始仓库
     */
    protected get repo() {
        if (!this.m_Repo)
            this.m_Repo = this.m_OriginDbFactory.db(this.model, this.uow);

        return this.m_Repo;
    }

    /**
     * 构造函数
     * 
     * @param m_OriginDbFactory 原始数据工厂
     * @param m_ParentTracerSpan 父跟踪范围
     * @param uow 工作单元
     * @param jaegerDbFactory jeager数据库工厂
     * @param model 模型
     */
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
        return new JaegerDbQuery<T>(
            this.repo.query(),
            this.model.name,
            this.m_ParentTracerSpan,
        );
    }
}