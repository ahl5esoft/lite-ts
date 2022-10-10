import { opentracing } from 'jaeger-client';

import { UnitOfWorkRepositoryBase } from '../../contract';

enum Action {
    delete = 'remove',
    insert = 'add',
    update = 'save',
}

export class JaegerClientUnitOfWork extends UnitOfWorkRepositoryBase {
    private m_Queue: {
        action: Action;
        entry: any;
        model: new () => any;
    }[] = [];

    public constructor(
        private m_Uow: UnitOfWorkRepositoryBase,
        private m_ParentTracerSpan: opentracing.Span,
    ) {
        super();
    }

    public registerAdd<T>(model: new () => T, entry: T) {
        this.m_Queue.push({
            action: Action.insert,
            entry,
            model
        });
    }

    public registerRemove<T>(model: new () => T, entry: T) {
        this.m_Queue.push({
            action: Action.delete,
            entry,
            model
        });
    }

    public registerSave<T>(model: new () => T, entry: T) {
        this.m_Queue.push({
            action: Action.update,
            entry,
            model
        });
    }

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