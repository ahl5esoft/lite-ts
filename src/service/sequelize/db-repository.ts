import { SequelizeDbQuery } from './db-query';
import { SequelizeModelPool } from './model-pool';
import { DbFactoryBase, DbRepositoryBase, UnitOfWorkRepositoryBase } from '../../contract';

export class SequelizeDbRepository<T> extends DbRepositoryBase<T> {
    public constructor(
        private m_SqlModelPool: SequelizeModelPool,
        dbFactory: DbFactoryBase,
        uow: UnitOfWorkRepositoryBase,
        model: new () => T,
    ) {
        super(dbFactory, model, uow);
    }

    public query() {
        return new SequelizeDbQuery(this.m_SqlModelPool, this.model);
    }
}