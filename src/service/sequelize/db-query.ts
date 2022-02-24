import { FindOptions, OrderItem, WhereOptions } from 'sequelize';

import { SequelizeModelPool } from './model-pool';
import { IDbQuery } from '../..';

/**
 * sequelize数据查询
 */
export class SequelizeDbQuery<T> implements IDbQuery<T> {
    /**
     * 条件
     */
    private m_Where: WhereOptions<any>;
    /**
     * 跳过
     */
    private m_Skip: number;
    /**
     * 排序
     */
    private m_Sorts: OrderItem[] = [];
    /**
     * 限制
     */
    private m_Take: number;

    /**
     * 构造函数
     * 
     * @param m_SeqModelPool seq模型池
     * @param m_Model 模型
     */
    public constructor(
        private m_SeqModelPool: SequelizeModelPool,
        private m_Model: new () => T,
    ) { }

    /**
     * 查询数量
     */
    public async count() {
        const res = await this.m_SeqModelPool.get(this.m_Model).count({
            where: this.m_Where
        });
        this.m_Where = null;
        return res;
    }

    /**
     * 排序
     * 
     * @param fields 字段数组
     */
    public order(...fields: string[]) {
        for (const r of fields)
            this.m_Sorts.push([r, 'ASC']);
        return this;
    }

    /**
     * 倒序
     * 
     * @param fields 字段数组
     */
    public orderByDesc(...fields: string[]) {
        for (const r of fields)
            this.m_Sorts.push([r, 'DESC']);
        return this;
    }

    /**
     * 跳过
     * 
     * @param value 跳过行数
     */
    public skip(value: number) {
        this.m_Skip = value;
        return this;
    }

    /**
     * 限制
     * 
     * @param value 限制行数
     */
    public take(value: number) {
        this.m_Take = value;
        return this;
    }

    /**
     * 查询结果
     */
    public async toArray() {
        const opt: FindOptions<any> = {};
        if (this.m_Skip) {
            opt.offset = this.m_Skip;
            this.m_Skip = null;
        }
        if (this.m_Sorts) {
            opt.order = this.m_Sorts;
            this.m_Sorts = [];
        }
        if (this.m_Take) {
            opt.limit = this.m_Take;
            this.m_Take = null;
        }
        if (this.m_Where) {
            opt.where = this.m_Where;
            this.m_Where = null;
        }
        const res = await this.m_SeqModelPool.get(this.m_Model).findAll(opt);
        return res.map((r: any) => {
            return r.dataValues;
        });
    }

    /**
     * 
     * 
     * @param selector 条件
     */
    public where(selector: WhereOptions<any>) {
        this.m_Where = selector;
        return this;
    }
}