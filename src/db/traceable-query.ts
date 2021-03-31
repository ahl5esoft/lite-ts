import { DBQueryBase } from '.';
import { TraceBase, TraceSpanBase } from '../runtime';

export class TraceableDBQuery<T> extends DBQueryBase<T> {
    private m_Labels: { [key: string]: any; } = {};

    public constructor(
        private m_Query: DBQueryBase<T>,
        private m_TableName: string,
        private m_Trace: TraceBase,
        private m_TraceSpanID: string
    ) {
        super();
    }

    public async count(): Promise<number> {
        const traceSpan = await this.createTraceSpan('count');
        return this.m_Query.count().finally(() => {
            traceSpan.end().catch(console.log);
        });
    }

    public order(...fields: string[]): this {
        this.m_Labels.order = fields;
        this.m_Query.order(...fields);
        return this;
    }

    public orderByDesc(...fields: string[]): this {
        this.m_Labels.orderByDesc = fields;
        this.m_Query.orderByDesc(...fields);
        return this;
    }

    public skip(value: number): this {
        this.m_Labels.skip = value;
        this.m_Query.skip(value);
        return this;
    }

    public take(value: number): this {
        this.m_Labels.take = value;
        this.m_Query.take(value);
        return this;
    }

    public async toArray(): Promise<T[]> {
        const traceSpan = await this.createTraceSpan('toArray');
        return this.m_Query.toArray().finally(() => {
            traceSpan.end().catch(console.log);
        });
    }

    public where(filter: any): this {
        this.m_Labels.where = filter;
        this.m_Query.where(filter);
        return this;
    }

    private async createTraceSpan(action: string): Promise<TraceSpanBase> {
        const traceSpan = this.m_Trace.createSpan(this.m_TraceSpanID);
        await traceSpan.begin('db');
        traceSpan.addLabel('query', action);
        traceSpan.addLabel('table', this.m_TableName);
        Object.keys(this.m_Labels).forEach(r => {
            traceSpan.addLabel(r, this.m_Labels[r]);
        });
        this.m_Labels = {};
        return traceSpan;
    }
}