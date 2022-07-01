import { opentracing } from 'jaeger-client';

import { IDbQuery } from '../..';

/**
 * jaeger数据库查询
 */
export class JaegerDbQuery<T> implements IDbQuery<T> {
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
            this.m_Span = this.m_Tracer.startSpan('db.query', {
                childOf: this.m_ParentSpan,
                tags: {
                    table: this.m_Table
                }
            });
        }

        return this.m_Span;
    }

    /**
     * 构造函数
     * 
     * @param m_DbQuery 数据库查询
     * @param m_ParentSpan 父跟踪范围
     * @param m_Table 模型名
     */
    public constructor(
        private m_DbQuery: IDbQuery<T>,
        private m_ParentSpan: opentracing.Span,
        private m_Table: string
    ) { }

    /**
     * 查询数量
     * 
     * @returns 行数
     */
    public async count() {
        try {
            const res = await this.m_DbQuery.count();
            this.span.log({
                result: res
            });
            return res;
        } catch (ex) {
            this.span.log({
                err: ex
            }).setTag(opentracing.Tags.ERROR, true);
            throw ex;
        } finally {
            this.span.setTag(opentracing.Tags.DB_STATEMENT, 'count').finish();
        }
    }

    /**
     * 排序(正序)
     * 
     * @param fields 字段数组
     */
    public order(...fields: string[]) {
        this.span.log({
            order: fields
        });
        this.m_DbQuery.order(...fields);
        return this;
    }

    /**
     * 排序(倒序)
     * 
     * @param fields 字段数组
     */
    public orderByDesc(...fields: string[]) {
        this.span.log({
            orderByDesc: fields
        });
        this.m_DbQuery.orderByDesc(...fields);
        return this;
    }

    /**
     * 跳过行数
     * 
     * @param value 行数
     */
    public skip(value: number): this {
        this.span.log({
            skip: value
        });
        this.m_DbQuery.skip(value);
        return this;
    }

    /**
     * 限制行数
     * 
     * @param value 行数
     */
    public take(value: number): this {
        this.span.log({
            take: value
        });
        this.m_DbQuery.take(value);
        return this;
    }

    /**
     * 查询数据集
     * 
     * @returns 数据行数, 无结果则返回空数组
     */
    public async toArray() {
        try {
            const res = await this.m_DbQuery.toArray();
            this.span.log({
                result: res
            });
            return res;
        } catch (ex) {
            this.span.log({
                err: ex
            }).setTag(opentracing.Tags.ERROR, true);
            throw ex;
        } finally {
            this.span.setTag(opentracing.Tags.DB_STATEMENT, 'toArray').finish();
        }
    }

    /**
     * 条件
     * 
     * @param selecor 筛选
     */
    public where(selecor: any) {
        this.span.log({
            where: selecor
        });
        this.m_DbQuery.where(selecor);
        return this;
    }
}