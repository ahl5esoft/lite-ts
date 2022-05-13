import { opentracing } from 'jaeger-client';

import { UnitOfWorkRepositoryBase } from '../..';

/**
 * jaeger工作单元
 */
export class JaegerUnitOfWork extends UnitOfWorkRepositoryBase {
    /**
     * 跟踪
     */
    private m_Tracer = opentracing.globalTracer();

    private m_Span: opentracing.Span;
    /**
     * 跟踪范围
     */
    protected get span() {
        if (!this.m_Span) {
            this.m_Span = this.m_Tracer.startSpan('db.uow', {
                childOf: this.m_ParentSpan
            });
        }

        return this.m_Span;
    }

    /**
     * 构造函数
     * 
     * @param m_Uow 原工作单元
     * @param m_Tracer 跟踪
     */
    public constructor(
        private m_Uow: UnitOfWorkRepositoryBase,
        private m_ParentSpan: opentracing.Span,
    ) {
        super();
    }

    /**
     * 提交事务
     */
    public async commit() {
        this.span.setTag(opentracing.Tags.DB_STATEMENT, 'commit');

        await this.m_Uow.commit();

        for (const r of this.afterActions)
            await r();

        this.span.finish();
        this.reset();
    }

    /**
     * 注册新增
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerAdd<T>(model: new () => T, entry: T) {
        this.m_Uow.registerAdd(model, entry);
        this.span.log({
            action: 'add',
            entry: entry,
            table: model.name
        });
    }

    /**
     * 注册删除
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerRemove<T>(model: new () => T, entry: T) {
        this.m_Uow.registerRemove(model, entry);
        this.span.log({
            action: 'remove',
            entry: entry,
            table: model.name
        });
    }

    /**
     * 注册更新
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerSave<T>(model: new () => T, entry: T) {
        this.m_Uow.registerSave(model, entry);
        this.span.log({
            action: 'save',
            entry: entry,
            table: model.name
        });
    }

    /**
     * 重置
     */
    private reset() {
        this.afterActions = [];
        this.m_Span = null;
    }
}