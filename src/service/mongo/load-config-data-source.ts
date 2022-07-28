import { DbFactoryBase } from '../../contract';
import { global } from '../../model';

/**
 * 加载配置数据源(mongo)
 * 
 * @param dbFactory 数据库工厂
 * @param model 模型
 */
export async function loadMongoConfigDataSource<T extends global.Config>(dbFactory: DbFactoryBase, model: new () => T) {
    const entries = await dbFactory.db(model).query().toArray();
    return entries.reduce((memo, r) => {
        memo[r.id] = r.items;
        return memo;
    }, {});
}