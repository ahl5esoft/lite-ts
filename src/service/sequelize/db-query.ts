import { FindOptions, WhereOptions } from 'sequelize';

import { SequelizeModelPool } from './model-pool';
import { IDbQuery, IDbQueryOption } from '../../contract';

export class SequelizeDbQuery<T> implements IDbQuery<T> {
    public constructor(
        private m_SeqModelPool: SequelizeModelPool,
        private m_Model: new () => T,
    ) { }

    public async count(where?: WhereOptions<any>) {
        return await this.m_SeqModelPool.get(this.m_Model.name).count({
            where
        });
    }

    public async toArray(v?: Partial<IDbQueryOption<WhereOptions<any>>>) {
        const opt: FindOptions<any> = {};
        if (v.skip)
            opt.offset = v.skip;
        if (v.order) {
            opt.order = v.order.map(r => {
                return [r, 'ASC'];
            });
        }
        if (v.orderByDesc) {
            opt.order = v.orderByDesc.map(r => {
                return [r, 'DESC'];
            });
        }
        if (v.take)
            opt.limit = v.take;
        if (v.where)
            opt.where = v.where;
        const res = await this.m_SeqModelPool.get(this.m_Model.name).findAll(opt);
        return res.map((r: any) => {
            return r.dataValues;
        });
    }
}