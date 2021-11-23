import { DbFactoryBase, IConfig } from '../..';
import { global } from '../../model';

export class Config<T> implements IConfig<T> {
    public constructor(
        private m_DbFactory: DbFactoryBase,
        private m_Ctor: new () => T
    ) { }

    public async get() {
        const rows = await this.m_DbFactory.db(global.Config).query().where({
            id: this.m_Ctor.name
        }).toArray();
        return rows[0]?.items as T;
    }
}