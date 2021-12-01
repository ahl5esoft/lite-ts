import { Inject, Service } from 'typedi';

import { DbFactoryBase, IAssociateStorageService } from '../../contract';

@Service()
export class MongoAssociateStorageService implements IAssociateStorageService {
    private m_Associates: { [key: string]: any } = {};

    @Inject()
    public dbFactory: DbFactoryBase;

    private m_TargetIDs: string[]
    public set targetIDs(v: string[]) {
        v = v.filter(r => {
            return r;
        });
        this.m_TargetIDs = [...new Set(v)];;
    }

    public add<T>(model: new () => T, column: string, entry: T) {
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

    public async find<T>(model: new () => T, column: string, associateID: string) {
        if (!this.m_Associates[model.name]) {
            const rows = await this.dbFactory.db(model).query().where({
                [column]: {
                    $in: this.m_TargetIDs
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