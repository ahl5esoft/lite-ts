import { EnumDataSourceBase } from '../enum';
import { DbFactoryBase } from '../../contract';
import { global } from '../../model';

/**
 * 枚举数据源(mongo)
 */
export class MongoEnumDataSource extends EnumDataSourceBase {
    /**
     * 构造函数
     * 
     * @param m_DbFactory 数据库工厂
     * @param sep 分隔符
     */
    public constructor(
        private m_DbFactory: DbFactoryBase,
        sep: string,
    ) {
        super(sep);
    }

    protected async load() {
        return await this.m_DbFactory.db(global.Enum).query().toArray();
    }
}