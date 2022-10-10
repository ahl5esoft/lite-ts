import { MongoPool } from './pool';
import { MongoDbRepository } from './db-repository';
import { MongoDefaultUnitOfWork } from './default-unit-of-work';
import { MongoDistributedUnitOfWork } from './distributed-unit-of-work';
import { DbFactoryBase, UnitOfWorkRepositoryBase } from '../../contract';

export class MongoDbFactory extends DbFactoryBase {
    private m_Pool: MongoPool;

    public constructor(
        private m_IsDistributed: boolean,
        name: string,
        url: string,
    ) {
        super();

        this.m_Pool = new MongoPool(name, url);
    }

    public db<T>(model: new () => T, uow?: UnitOfWorkRepositoryBase) {
        return new MongoDbRepository<T>(this.m_Pool, uow, this, model);
    }

    public uow() {
        const ctor = this.m_IsDistributed ? MongoDistributedUnitOfWork : MongoDefaultUnitOfWork;
        return new ctor(this.m_Pool);
    }
}