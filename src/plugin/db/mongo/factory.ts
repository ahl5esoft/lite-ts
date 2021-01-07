import { Pool } from './pool';
import { Repository } from './repository';
import { UnitOfWork } from './unit-of-work';
import { DbExtraType, FactoryBase } from '../factory-base';

export class Factory extends FactoryBase {
    private m_Pool: Pool;

    public constructor(name: string, url: string) {
        super();

        this.m_Pool = new Pool(name, url);
    }

    public async close(): Promise<void> {
        const client = await this.m_Pool.getClient();
        await client.close();
    }

    public db<T>(model: Function, ...extra: DbExtraType[]): Repository<T> {
        let isTx = true;
        let uow: UnitOfWork;
        extra.forEach((r): void => {
            if (r instanceof UnitOfWork)
                uow = r;
        });

        if (!uow) {
            isTx = false;
            uow = this.uow();
        }

        return new Repository<T>(this.m_Pool, model.name, isTx, uow);
    }

    public uow(): UnitOfWork {
        return new UnitOfWork(this.m_Pool);
    }
}