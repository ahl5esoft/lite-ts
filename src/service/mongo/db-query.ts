import { Filter } from 'mongodb';

import { toEntries } from './helper';
import { MongoPool } from './pool';
import { IDbQuery, IDbQueryOption } from '../../contract';

export class MongoDbQuery<T> implements IDbQuery<T> {
    public constructor(
        private m_Pool: MongoPool,
        private m_Table: string
    ) { }

    public async count(where?: Filter<any>) {
        this.setID(where);

        const db = await this.m_Pool.db;
        return db.collection(this.m_Table).count(where);
    }

    public async toArray(v?: Partial<IDbQueryOption<Filter<any>>>) {
        this.setID(v?.where);

        const db = await this.m_Pool.db;
        const cursor = db.collection(this.m_Table).find(v?.where);

        const sorts = [];
        this.appendSort(1, v?.order, sorts);
        this.appendSort(-1, v?.orderByDesc, sorts);
        if (sorts.length)
            cursor.sort(sorts);

        if (v?.skip > 0)
            cursor.skip(v.skip);

        if (v?.take > 0)
            cursor.limit(v.take);

        const rows = await cursor.toArray();
        return toEntries(rows);
    }

    private appendSort(order: 1 | -1, fields: string[], sorts: [string, number][]) {
        if (!fields?.length)
            return;

        for (let r of fields) {
            if (r == 'id')
                r = '_id';

            sorts.push([r, order]);
        }
    }

    private setID(v: Filter<any>) {
        if (!v?.id)
            return;

        v._id = v.id;
        delete v.id;
    }
}
