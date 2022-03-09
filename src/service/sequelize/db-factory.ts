import { Sequelize } from 'sequelize';

import { SequelizeDbRepository } from './db-repository';
import { SequelizeModelPool } from './model-pool';
import { SequelizeUnitOfWork } from './unit-of-work';
import { DbFactoryBase, UnitOfWorkRepositoryBase } from '../..';

/**
 * Sequelize数据工厂
 */
export class SequelizeDbFactory extends DbFactoryBase {
    private m_ModelPool: SequelizeModelPool;
    /**
     * 模型管理
     */
    public get modelPool() {
        if (!this.m_ModelPool)
            this.m_ModelPool = new SequelizeModelPool(this.m_Seq);

        return this.m_ModelPool;
    }

    /**
     * 构造函数
     */
    public constructor(
        private m_Seq: Sequelize
    ) {
        super();
    }

    /**
     * 创建数据库仓储
     * 
     * @param model 模型
     * @param uow 工作单元
     */
    public db<T>(model: new () => T, uow?: UnitOfWorkRepositoryBase) {
        return new SequelizeDbRepository(this.modelPool, this, uow, model);
    }

    /**
     * 创建工作单元
     */
    public uow() {
        return new SequelizeUnitOfWork(this.m_Seq, this.modelPool);
    }
}