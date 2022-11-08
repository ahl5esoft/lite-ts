import { ElasticSearchPool } from './pool';
import { IDbQuery, IDbQueryOption } from '../../contract';

export class ElasticSearchDbQuery<T> implements IDbQuery<T> {
    public constructor(
        private m_Pool: ElasticSearchPool,
        private m_Model: new () => T
    ) { }

    public async count(where?: any) {
        const res = await this.m_Pool.client.count({
            query: where,
            index: await this.m_Pool.getIndex(this.m_Model)
        });
        return res.count || 0;
    }

    public async toArray(v?: Partial<IDbQueryOption<any>>) {
        const sorts = [];
        for (const r of v.order) {
            sorts.push({
                [r]: {
                    order: 'asc'
                }
            });
        }
        for (const r of v.orderByDesc) {
            sorts.push({
                [r]: {
                    order: 'desc'
                }
            });
        }
        const res = await this.m_Pool.client.search({
            from: v.skip || 0,
            index: await this.m_Pool.getIndex(this.m_Model),
            query: v.where,
            size: v.take,
            sort: sorts,
        });
        return res.hits.hits.map(r => r._source as T);
    }
}