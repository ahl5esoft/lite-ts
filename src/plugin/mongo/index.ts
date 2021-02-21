export * from './string-generator';

import { Pool } from './pool';
import { Repository } from './repository';
import { UnitOfWork } from './unit-of-work';
import { DBFactoryBase } from '../../db';

export class MongoFactory extends DBFactoryBase {
    private m_Pool: Pool;

    public constructor(name: string, url: string) {
        super();

        this.m_Pool = new Pool(name, url);
    }

    public async close(): Promise<void> {
        const client = await this.m_Pool.getClient();
        await client.close();
    }

    public db<T>(model: Function, ...extra: any[]): Repository<T> {
        let isTx = true;
        let uow: UnitOfWork;
        extra.forEach(r => {
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