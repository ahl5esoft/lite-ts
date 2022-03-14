import { Options, Sequelize } from 'sequelize';

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
            this.m_ModelPool = new SequelizeModelPool(this.seq);

        return this.m_ModelPool;
    }

    private m_Seq: Sequelize;
    /**
     * Sequelize实例
     */
    protected get seq() {
        if (!this.m_Seq)
            this.m_Seq = new Sequelize(this.m_Connection, this.m_Options);

        return this.m_Seq;
    }

    /**
     * 构造函数
     * 
     * @param m_Connection 连接字符串
     * @param m_Options 选项
     */
    public constructor(
        private m_Connection: string,
        private m_Options?: Options
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
        return new SequelizeUnitOfWork(this.seq, this.modelPool);
    }
}