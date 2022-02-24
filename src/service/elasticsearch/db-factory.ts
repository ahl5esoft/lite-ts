import { ClientOptions } from '@elastic/elasticsearch';

import { ElasticSearchDbRepository } from './db-repository';
import { ElasticSearchPool } from './pool';
import { ElasticSearchUnitOfWork } from './unit-of-work';
import { DbFactoryBase } from '../..';

/**
 * es数据库工厂
 */
export class ElasticSearchDbFactory extends DbFactoryBase {
    /**
     * es池
     */
    private m_Pool: ElasticSearchPool;

    /**
     * 构造函数
     * 
     * @param cfg 配置
     * @param project 项目
     */
    public constructor(
        cfg: ClientOptions,
        project: string,
    ) {
        super();

        this.m_Pool = new ElasticSearchPool(cfg, project);
    }

    /**
     * 创建数据库仓库
     * 
     * @param model 模型
     * @param uow 工作单元
     */
    public db<T>(model: new () => T, uow?: ElasticSearchUnitOfWork) {
        return new ElasticSearchDbRepository(this.m_Pool, this, uow, model);
    }

    /**
     * 创建工作单元
     */
    public uow() {
        return new ElasticSearchUnitOfWork(this.m_Pool);
    }
}