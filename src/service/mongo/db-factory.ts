import { BulkWriteOptions } from 'mongodb';

import { MongoDbRepository } from './db-repository';
import { MongoDefaultUnitOfWork } from './default-unit-of-work';
import { MongoDistributedUnitOfWork } from './distributed-unit-of-work';
import { MongoPool } from './pool';
import { DbFactoryBase, UnitOfWorkRepositoryBase } from '../../contract';

/**
 * mongo数据库工厂
 */
export class MongoDbFactory extends DbFactoryBase {
    /**
     * 连接池
     */
    private m_Pool: MongoPool;

    /**
     * 构造函数
     * 
     * @param m_IsDistributed 是否分布式
     * @param name 数据库名
     * @param url 连接地址
     * @param bulkWriteOptions 批量写入配置
     */
    public constructor(
        private m_IsDistributed: boolean,
        name: string,
        url: string,
        private bulkWriteOptions?: BulkWriteOptions,
    ) {
        super();

        this.m_Pool = new MongoPool(name, url);
        this.bulkWriteOptions ??= {
            ordered: false,
        };
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
        const ctor = this.m_IsDistributed ? MongoDistributedUnitOfWork : MongoDefaultUnitOfWork;
        return new ctor(this.m_Pool, this.bulkWriteOptions);
    }
}