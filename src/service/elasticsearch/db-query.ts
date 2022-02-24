import { ElasticSearchPool } from './pool';
import { IDbQuery } from '../..';

/**
 * es数据库查询
 */
export class ElasticSearchDbQuery<T> implements IDbQuery<T> {
    /**
     * 跳过
     */
    private m_Skip: number;
    /**
     * 排序
     */
    private m_Sorts: any[] = [];
    /**
     * 限制
     */
    private m_Take: number;
    /**
     * 条件
     */
    private m_Where: any;

    /**
     * 数据库查询
     * 
     * @param m_Pool es池
     * @param m_Model 模型
     */
    public constructor(
        private m_Pool: ElasticSearchPool,
        private m_Model: new () => T
    ) { }

    /**
     * 查询数量
     */
    public async count() {
        const res = await this.m_Pool.client.count({
            query: this.m_Where,
            index: await this.m_Pool.getIndex(this.m_Model)
        });
        this.m_Where = null;
        return res.count || 0;
    }

    /**
     * 正序
     * 
     * @param fields 字段数组
     */
    public order(...fields: string[]) {
        for (const r of fields) {
            this.m_Sorts.push({
                [r]: {
                    order: 'asc'
                }
            });
        }
        return this;
    }

    /**
     * 倒序
     * 
     * @param fields 字段数组
     */
    public orderByDesc(...fields: string[]) {
        for (const r of fields) {
            this.m_Sorts.push({
                [r]: {
                    order: 'desc'
                }
            });
        }
        return this;
    }

    /**
     * 跳过
     * 
     * @param value 行数
     */
    public skip(value: number) {
        this.m_Skip = value;
        return this;
    }

    /**
     * 限制
     * 
     * @param value 行数
     */
    public take(value: number) {
        this.m_Take = value;
        return this;
    }

    /**
     * 查询结果
     */
    public async toArray() {
        const res = await this.m_Pool.client.search({
            from: this.m_Skip || 0,
            index: await this.m_Pool.getIndex(this.m_Model),
            query: this.m_Where,
            size: this.m_Take,
            sort: this.m_Sorts,
        });
        this.m_Skip = this.m_Take = this.m_Where = null;
        this.m_Sorts = [];
        return res.hits.hits.map(r => r._source as T);
    }

    /**
     * 设置条件
     * 
     * @param selector 条件
     */
    public where(selector: any) {
        this.m_Where = selector;
        return this;
    }
}