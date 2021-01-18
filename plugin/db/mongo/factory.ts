import { Pool } from './pool';
import { Repository } from './repository';
import { UnitOfWork } from './unit-of-work';
import { DbExtraType, DbFactoryBase } from '../factory-base';
import { DbRepositoryBase } from '../repository-base';
import { IUnitOfWork } from '../unit-of-work-base';

export class MongoFactory extends DbFactoryBase {
    private m_Pool: Pool;

    public constructor(name: string, url: string) {
        super();

        this.m_Pool = new Pool(name, url);
    }

    public async close(): Promise<void> {
        const client = await this.m_Pool.getClient();
        await client.close();
    }

    public db<T>(model: Function, ...extra: DbExtraType[]): DbRepositoryBase<T> {
        let isTx = true;
        let uow: UnitOfWork;
        extra.forEach((r): void => {
            if (r instanceof UnitOfWork)
                uow = r;
        });

        if (!uow) {
            isTx = false;
            uow = this.uow() as UnitOfWork;
        }

        return new Repository<T>(this.m_Pool, model.name, isTx, uow);
    }

    public uow(): IUnitOfWork {
        return new UnitOfWork(this.m_Pool);
    }
}