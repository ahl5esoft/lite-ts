import { Pool } from './pool';
import { Repository } from './repository';
import { UnitOfWork } from './unit-of-work';
import { DBFactoryBase, UnitOfWorkBase } from '../../db';

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

    public db<T>(model: Function, uow?: UnitOfWorkBase): Repository<T> {
        return new Repository<T>(this.m_Pool, this, model.name, uow);
    }

    public uow(): UnitOfWork {
        return new UnitOfWork(this.m_Pool);
    }
}