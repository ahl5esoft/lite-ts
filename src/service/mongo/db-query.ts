import { FilterQuery } from 'mongodb';

import { MongoDbPool } from './db-pool';
import { toEntries } from './helper';
import { IDbQuery } from '../../contract';

/**
 * mongo数据表查询
 */
export class MongoDbQuery<T> implements IDbQuery<T> {
    /**
     * 跳过
     */
    private m_Skip: number;
    /**
     * 排序
     */
    private m_Sorts: [string, 1 | -1][] = [];
    /**
     * 获取行数
     */
    private m_Take: number;
    /**
     * 条件
     */
    private m_Where: FilterQuery<any>;

    /**
     * 构造函数
     * 
     * @param m_Pool 池
     * @param m_Table 表
     */
    public constructor(
        private m_Pool: MongoDbPool,
        private m_Table: string
    ) { }

    /**
     * 查询数量
     */
    public async count() {
        const cursor = await this.getCursor();
        return await cursor.count();
    }

    /**
     * 排序(正序)
     * 
     * @param fields 字段数组
     */
    public order(...fields: string[]) {
        return this.sort(1, ...fields);
    }

    /**
     * 排序(倒序)
     * 
     * @param fields 字段数组
     */
    public orderByDesc(...fields: string[]) {
        return this.sort(-1, ...fields);
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
     * 设置限制行数
     * 
     * @param value 行数
     */
    public take(value: number) {
        this.m_Take = value;
        return this;
    }

    /**
     * 查询行数据
     */
    public async toArray(): Promise<T[]> {
        const cursor = await this.getCursor();
        const rows = await cursor.toArray();
        return toEntries(rows);
    }

    /**
     * 设置条件
     * 
     * @param filter 条件
     */
    public where(filter: any) {
        this.m_Where = 'id' in filter ? Object.keys(filter).reduce((memo, r): any => {
            memo[r == 'id' ? '_id' : r] = filter[r];
            return memo;
        }, {}) : filter;
        return this;
    }

    /**
     * 获取游标
     */
    private async getCursor() {
        const db = await this.m_Pool.getDb();
        const cursor = db.collection(this.m_Table).find(this.m_Where);
        this.m_Where = null;

        if (this.m_Sorts.length) {
            cursor.sort(this.m_Sorts);
            this.m_Sorts = [];
        }

        if (this.m_Skip > 0) {
            cursor.skip(this.m_Skip);
            this.m_Skip = 0;
        }

        if (this.m_Take > 0) {
            cursor.limit(this.m_Take);
            this.m_Take = 0;
        }

        return cursor;
    }

    /**
     * 排序
     * 
     * @param order 排序
     * @param fields 字段数组
     */
    private sort(order: 1 | -1, ...fields: string[]): this {
        for (let r of fields) {
            if (r == 'id')
                r = '_id';

            this.m_Sorts.push([r, order]);
        }
        return this;
    }
}
