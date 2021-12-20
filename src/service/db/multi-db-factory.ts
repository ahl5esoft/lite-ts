import { MultiUnitOfWork } from './multi-unit-of-work';
import { DbFactoryBase } from '../..';

export class MultiDbFactory extends DbFactoryBase {
    public constructor(
        private m_DbFactories: { [dbType: string]: DbFactoryBase },
    ) {
        super();
    }

    public db<T>(model: new () => T, ...extra: any[]) {
        let uow: MultiUnitOfWork;
        let dbType: string;
        for (const r of extra) {
            if (r instanceof MultiUnitOfWork)
                uow = r;
            else if (typeof r == 'string')
                dbType = r;
        }

        if (!this.m_DbFactories[dbType])
            throw new Error(`无效DbFactoryBase: ${dbType}`);

        return this.m_DbFactories[dbType].db(model, uow?.uows[dbType]);
    }

    public uow() {
        const uows = Object.keys(this.m_DbFactories).reduce((memo, r) => {
            memo[r] = this.m_DbFactories[r].uow();
            return memo;
        }, {});
        return new MultiUnitOfWork(uows);
    }
}