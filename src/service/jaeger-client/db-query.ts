import { opentracing } from 'jaeger-client';

import { IDbQuery, IDbQueryOption } from '../../contract';

export class JaegerClientDbQuery<T> implements IDbQuery<T> {
    private m_TracerSpan: opentracing.Span;

    public constructor(
        private m_DbQuery: IDbQuery<T>,
        private m_Table: string,
        parentTracerSpan: opentracing.Span,
    ) {
        this.m_TracerSpan = parentTracerSpan ? opentracing.globalTracer().startSpan('db.query', {
            childOf: parentTracerSpan,
            tags: {
                table: this.m_Table
            }
        }) : null;
    }

    public async count(where?: any) {
        try {
            if (where) {
                this.m_TracerSpan?.log?.({
                    where
                });
            }

            const res = await this.m_DbQuery.count();

            this.m_TracerSpan?.log?.({
                result: res
            });

            return res;
        } catch (ex) {
            this.m_TracerSpan?.log?.({
                err: ex
            })?.setTag?.(opentracing.Tags.ERROR, true);

            throw ex;
        } finally {
            this.m_TracerSpan?.setTag?.(opentracing.Tags.DB_STATEMENT, 'count')?.finish?.();
        }
    }

    public async toArray(v?: Partial<IDbQueryOption<any>>) {
        try {
            if (v)
                this.m_TracerSpan?.log?.(v);

            const res = await this.m_DbQuery.toArray(v);

            this.m_TracerSpan?.log?.({
                result: res
            });

            return res;
        } catch (ex) {
            this.m_TracerSpan?.log?.({
                err: ex
            })?.setTag?.(opentracing.Tags.ERROR, true);

            throw ex;
        } finally {
            this.m_TracerSpan?.setTag?.(opentracing.Tags.DB_STATEMENT, 'toArray')?.finish?.();
        }
    }
}