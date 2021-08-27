import { Pool } from './pool';
import { Repository } from './repository';
import { UnitOfWork } from './unit-of-work';
import { DBFactoryBase, IUnitOfWork, IUnitOfWorkRepository } from '../../contract';

export class MongoFactory extends DBFactoryBase {
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
        return new Repository<T>(this.m_Pool, this, model.name, uow as IUnitOfWorkRepository);
    }

    public uow() {
        return new UnitOfWork(this.m_Pool);
    }
}