import { JaegerDbQuery } from './db-query';
import { DbFactoryBase, DbRepositoryBase, UnitOfWorkRepositoryBase } from '../..';
import { opentracing } from 'jaeger-client';

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
     * @param m_ParentSpan 父跟踪范围
     * @param uow 工作单元
     * @param jaegerDbFactory jeager数据库工厂
     * @param model 模型
     */
    public constructor(
        private m_OriginDbFactory: DbFactoryBase,
        private m_ParentSpan: opentracing.Span,
        uow: UnitOfWorkRepositoryBase,
        jaegerDbFactory: DbFactoryBase,
        model: new () => T,
    ) {
        super(model, uow, jaegerDbFactory);
    }

    /**
     * 创建数据库查询
     */
    public query() {
        return new JaegerDbQuery<T>(
            this.repo.query(),
            this.m_ParentSpan,
            this.model.name
        );
    }
}