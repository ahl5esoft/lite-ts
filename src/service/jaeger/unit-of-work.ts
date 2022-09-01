import { opentracing } from 'jaeger-client';

import { UnitOfWorkRepositoryBase } from '../../contract';

/**
 * 动作类型
 */
enum Action {
    /**
     * 删除
     */
    delete = 'remove',
    /**
     * 插入
     */
    insert = 'add',
    /**
     * 更新
     */
    update = 'save',
}

/**
 * jaeger工作单元
 */
export class JaegerUnitOfWork extends UnitOfWorkRepositoryBase {
    /**
     * 队列
     */
    private m_Queue: {
        /**
         * 动作
         */
        action: Action;
        /**
         * 实体
         */
        entry: any;
        /**
         * 模型
         */
        model: new () => any;
    }[] = [];

    /**
     * 构造函数
     * 
     * @param m_Uow 原工作单元
     * @param m_ParentTracerSpan 父跟踪范围
     */
    public constructor(
        private m_Uow: UnitOfWorkRepositoryBase,
        private m_ParentTracerSpan: opentracing.Span,
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
        this.m_Queue.push({
            action: Action.insert,
            entry,
            model
        });
    }

    /**
     * 注册删除
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerRemove<T>(model: new () => T, entry: T) {
        this.m_Queue.push({
            action: Action.delete,
            entry,
            model
        });
    }

    /**
     * 注册更新
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerSave<T>(model: new () => T, entry: T) {
        this.m_Queue.push({
            action: Action.update,
            entry,
            model
        });
    }

    /**
     * 提交事务
     */
    protected async onCommit() {
        if (!this.m_Queue.length)
            return;

        const tracerSpan = this.m_ParentTracerSpan ? opentracing.globalTracer().startSpan('db.uow', {
            childOf: this.m_ParentTracerSpan
        }) : null;

        tracerSpan?.setTag?.(opentracing.Tags.DB_STATEMENT, 'commit');

        try {
            for (const r of this.m_Queue) {
                switch (r.action) {
                    case Action.delete:
                        this.m_Uow.registerRemove(r.model, r.entry);
                        break;
                    case Action.insert:
                        this.m_Uow.registerAdd(r.model, r.entry);
                        break;
                    case Action.update:
                        this.m_Uow.registerSave(r.model, r.entry);
                        break;
                }

                tracerSpan?.log?.({
                    action: 'save',
                    entry: r.entry,
                    table: r.model.name
                });
            }

            await this.m_Uow.commit();
        } catch (ex) {
            tracerSpan?.log?.({
                err: ex
            })?.setTag?.(opentracing.Tags.ERROR, true);

            throw ex;
        } finally {
            this.m_Queue = [];
            tracerSpan?.finish?.();
        }
    }
}