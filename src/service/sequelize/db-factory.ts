import { Options, Sequelize } from 'sequelize';

import { SequelizeDbRepository } from './db-repository';
import { SequelizeModelPool } from './model-pool';
import { SequelizeUnitOfWork } from './unit-of-work';
import { DbFactoryBase, UnitOfWorkRepositoryBase } from '../../contract';

export class SequelizeDbFactory extends DbFactoryBase {
    private m_ModelPool: SequelizeModelPool;
    public get modelPool() {
        this.m_ModelPool ??= new SequelizeModelPool(this.seq);
        return this.m_ModelPool;
    }

    private m_Seq: Sequelize;
    protected get seq() {
        this.m_Seq ??= new Sequelize(this.m_Connection, this.m_Options);
        return this.m_Seq;
    }

    public constructor(
        private m_Connection: string,
        private m_Options?: Options
    ) {
        super();
    }

    public db<T>(model: new () => T, uow?: UnitOfWorkRepositoryBase) {
        return new SequelizeDbRepository(this.modelPool, this, uow, model);
    }

    public uow() {
        return new SequelizeUnitOfWork(this.seq, this.modelPool);
    }
}