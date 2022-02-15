import { EnumItem } from '../enum';
import { DbFactoryBase, IEnum, IEnumItem, IEnumItemData, ITraceable, model } from '../..';

/**
 * mongo枚举
 */
export class MongoEnum<T extends IEnumItemData> implements IEnum<T>, ITraceable {
    /**
     * 所有项
     */
    private m_Items: IEnumItem<T>[];

    /**
     * 构造函数
     * 
     * @param m_DbFactory 数据库工厂
     * @param m_Name 枚举名
     * @param m_Sep 分隔符(default: -)
     */
    public constructor(
        private m_DbFactory: DbFactoryBase,
        private m_Name: string,
        private m_Sep = '-'
    ) { }

    /**
     * 从数据库中Enum表中获取id为枚举名的数据
     * 将global.Enum.items映射成IEnumItem<T>
     */
    public async all() {
        if (!this.m_Items) {
            const rows = await this.m_DbFactory.db(model.global.Enum).query().where({
                id: this.m_Name
            }).toArray();
            if (rows.length) {
                this.m_Items = rows[0].items.map(r => {
                    return new EnumItem(r, this.m_Name, this.m_Sep);
                });
            } else {
                this.m_Items = [];
            }
        }

        return this.m_Items;
    }

    /**
     * 获取第一个满足条件的项
     * 
     * @param predicate 断言
     */
    public async get(predicate: (data: T) => boolean) {
        const items = await this.all();
        return items.find(r => {
            return predicate(r.data);
        });
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        let dbFactory = this.m_DbFactory;
        const dbFactoryTracer = dbFactory as any as ITraceable;
        if (dbFactoryTracer.withTrace)
            dbFactory = dbFactoryTracer.withTrace(parentSpan);
        return new MongoEnum(dbFactory, this.m_Name, this.m_Sep);
    }
}