import { opentracing } from 'jaeger-client';

import { UnitOfWorkRepositoryBase } from '../../contract';

/**
 * jaeger工作单元
 */
export class JaegerUnitOfWork extends UnitOfWorkRepositoryBase {
    /**
     * 空
     */
    private m_IsEmpty = true;
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
     * @param m_ParentSpan 父跟踪范围
     */
    public constructor(
        private m_Uow: UnitOfWorkRepositoryBase,
        private m_ParentSpan: opentracing.Span,
    ) {
        super();
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
        this.m_IsEmpty = false;
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
        this.m_IsEmpty = false;
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
        this.m_IsEmpty = false;
    }

    /**
     * 提交事务
     */
    protected async onCommit() {
        if (this.m_IsEmpty)
            return;

        this.span.setTag(opentracing.Tags.DB_STATEMENT, 'commit');

        try {
            await this.m_Uow.commit();
        } catch (ex) {
            this.span.log({
                err: ex
            });
            throw ex;
        } finally {
            this.span.finish();
            this.reset();
        }
    }

    /**
     * 重置
     */
    private reset() {
        this.m_IsEmpty = true;
        this.m_Span = null;
    }
}