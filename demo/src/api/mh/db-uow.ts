import { Inject, Service } from 'typedi';

import { DbFactoryBase, IApi, model } from '../../../../src';

/**
 * 数据库事务
 */
@Service()
export default class DbUowApi implements IApi {
    /**
     * 数据库仓库
     */
    @Inject()
    public dbFactory: DbFactoryBase;

    public async call() {
        const entry = {
            id: 'single',
            items: [{
                text: 'A',
                value: 1
            }, {
                text: 'B',
                value: 2
            }]
        };
        await this.dbFactory.db(model.global.Enum).add(entry);

        const uow = this.dbFactory.uow();
        await this.dbFactory.db(model.global.Enum, uow).remove(entry);
        await uow.commit();
    }
}