import { DbFactoryBase } from '../../contract';
import { global } from '../../model';

/**
 * 加载配置数据源(mongo)
 * 
 * @param dbFactory 数据库工厂
 */
export async function loadMongoConfigDataSource(dbFactory: DbFactoryBase) {
    const entries = await dbFactory.db(global.Config).query().toArray();
    return entries.reduce((memo, r) => {
        memo[r.id] = r.items;
        return memo;
    }, {});
}