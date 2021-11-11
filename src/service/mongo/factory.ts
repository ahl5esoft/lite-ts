import { Pool } from './pool';
import { Repository } from './repository';
import { UnitOfWork } from './unit-of-work';
import { DbFactoryBase, IUnitOfWork, IUnitOfWorkRepository } from '../../contract';

export class MongoFactory extends DbFactoryBase {
    private m_Pool: Pool;

    public constructor(name: string, url: string) {
        super();

        this.m_Pool = new Pool(name, url);
    }

    public async close() {
        const client = await this.m_Pool.getClient();
        await client.close();
    }

    public db<T>(model: new () => T, uow?: IUnitOfWork) {
        return new Repository<T>(this.m_Pool, uow as IUnitOfWorkRepository, this, model.name);
    }

    public uow() {
        return new UnitOfWork(this.m_Pool);
    }
}