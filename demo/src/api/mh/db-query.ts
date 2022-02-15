import { Min } from 'class-validator';
import { Inject, Service } from 'typedi';

import { DbFactoryBase, IApi, model } from '../../../../src';

/**
 * 数据库查询
 */
@Service()
export default class DbQueryApi implements IApi {
    /**
     * 数据库工厂
     */
    @Inject()
    public dbFactory: DbFactoryBase;

    /**
     * 跳过
     */
    @Min(0)
    public skip: number;

    /**
     * 限制行数
     */
    @Min(1)
    public take: number;

    public async call() {
        return this.dbFactory.db(model.global.Enum).query().where({
            id: 'enum-name'
        }).skip(this.skip).take(this.take).toArray();
    }
}