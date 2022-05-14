import { MongoDbPool } from './db-pool';
import { MongoDbRepository } from './db-repository';
import { MongoUnitOfWork } from './unit-of-work';
import { DbFactoryBase, UnitOfWorkRepositoryBase } from '../../contract';

/**
 * mongo数据库工厂
 */
export class MongoDbFactory extends DbFactoryBase {
    /**
     * 连接池
     */
    private m_Pool: MongoDbPool;

    /**
     * 构造函数
     * 
     * @param name 数据库名
     * @param url 连接地址
     */
    public constructor(name: string, url: string) {
        super();

        this.m_Pool = new MongoDbPool(name, url);
    }

    /**
     * 创建数据库仓库
     * 
     * @param model 模型
     * @param uow 工作单元
     */
    public db<T>(model: new () => T, uow?: UnitOfWorkRepositoryBase) {
        return new MongoDbRepository<T>(this.m_Pool, uow, this, model);
    }

    /**
     * 创建工作单元
     */
    public uow() {
        return new MongoUnitOfWork(this.m_Pool);
    }
}