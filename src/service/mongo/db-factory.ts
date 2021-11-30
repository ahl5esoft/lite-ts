import { Pool } from './pool';
import { DbRepository } from './db-repository';
import { UnitOfWork } from './unit-of-work';
import { DbFactoryBase, IUnitOfWork, IUnitOfWorkRepository } from '../../contract';

export class MongoDbFactory extends DbFactoryBase {
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
        return new DbRepository<T>(this.m_Pool, uow as IUnitOfWorkRepository, this, model.name);
    }

    public uow() {
        return new UnitOfWork(this.m_Pool);
    }
}