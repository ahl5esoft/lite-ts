import { EnumDataSourceBase } from '../enum';
import { DbFactoryBase } from '../../contract';
import { global } from '../../model';

/**
 * 枚举数据源(mongo)
 */
export class MongoEnumDataSource<T extends global.Enum> extends EnumDataSourceBase {
    /**
     * 构造函数
     * 
     * @param m_DbFactory 数据库工厂
     * @param sep 分隔符
     * @param m_Model 模型
     */
    public constructor(
        private m_DbFactory: DbFactoryBase,
        sep: string,
        private m_Model: new () => T,
    ) {
        super(sep);
    }

    protected async load() {
        return await this.m_DbFactory.db(this.m_Model).query().toArray();
    }
}