import { DbFactoryBase, ITargetStorageService } from '../..';

export class MongoTargetStorageService implements ITargetStorageService {
    private m_Associates: { [key: string]: any } = {};

    public constructor(
        private m_DbFactory: DbFactoryBase,
        private m_TaskIDs: string[]
    ) {
        if (!this.m_TaskIDs?.length)
            return;

        this.m_TaskIDs = this.m_TaskIDs.filter(r => {
            return r;
        });
        this.m_TaskIDs = [...new Set(this.m_TaskIDs)];
    }

    public addAssociate<T>(model: new () => T, column: string, entry: T) {
        if (!this.m_Associates[model.name])
            this.m_Associates[model.name] = {};

        const associateID = entry[column];
        if (!this.m_Associates[model.name][associateID])
            this.m_Associates[model.name][associateID] = [];

        this.m_Associates[model.name][associateID].push(entry);
    }

    public clear<T>(model: new () => T, associateID: string) {
        if (this.m_Associates[model.name] && this.m_Associates[model.name][associateID])
            this.m_Associates[model.name][associateID] = [];
    }

    public async findAssociates<T>(model: new () => T, column: string, associateID: string) {
        if (!this.m_Associates[model.name]) {
            const rows = await this.m_DbFactory.db(model).query().where({
                [column]: {
                    $in: this.m_TaskIDs
                }
            }).toArray();
            this.m_Associates[model.name] = rows.reduce((memo, r) => {
                if (!memo[r[column]])
                    memo[r[column]] = [];

                memo[r[column]].push(r);
                return memo;
            }, {});
        }

        return this.m_Associates[model.name][associateID] || [];
    }
}