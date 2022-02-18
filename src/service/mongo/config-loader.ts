import { ConfigLoaderBase, DbFactoryBase, model } from '../..';

/**
 * mongo配置加载器
 */
export class MongoConfigLoader extends ConfigLoaderBase {
    /**
     * 所有数据
     */
    private m_Entries: model.global.Config[];

    /**
     * 构造函数
     * 
     * @param m_DbFactory 数据库工厂
     */
    public constructor(
        private m_DbFactory: DbFactoryBase
    ) {
        super();
    }

    public async load<T>(ctor: new () => T) {
        if (!this.m_Entries)
            this.m_Entries = await this.m_DbFactory.db(model.global.Config).query().toArray();

        const entry = this.m_Entries.find(r => {
            return r.id == ctor.name;
        });
        return entry?.items as T;
    }
}