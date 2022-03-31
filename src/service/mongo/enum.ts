import { EnumItem } from '../enum';
import { DbFactoryBase, IEnum, IEnumItem, IEnumItemData, ITraceable } from '../..';
import { global } from '../../model';

/**
 * mongo枚举
 */
export class MongoEnum<T extends IEnumItemData> implements IEnum<T>, ITraceable {
    private m_Items: IEnumItem<T>[];
    /**
     * 从数据库中Enum表中获取id为枚举名的数据
     * 将global.Enum.items映射成IEnumItem<T>
     */
    public get items() {
        return new Promise<IEnumItem<T>[]>(async (s, f) => {
            if (!this.m_Items) {
                try {
                    const entries = await this.m_DbFactory.db(global.Enum).query().where({
                        id: this.m_Name
                    }).toArray();
                    if (entries.length) {
                        this.m_Items = entries[0].items.map(r => {
                            return new EnumItem(r, this.m_Name, this.m_Sep);
                        });
                    } else {
                        this.m_Items = [];
                    }
                } catch (ex) {
                    return f(ex);
                }
            }

            s(this.m_Items);
        });
    }

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
     * 获取第一个满足条件的项
     * 
     * @param predicate 断言
     */
    public async get(predicate: (data: T) => boolean) {
        const items = await this.items;
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
        return new MongoEnum(
            (this.m_DbFactory as any as ITraceable)?.withTrace(parentSpan) ?? this.m_DbFactory,
            this.m_Name,
            this.m_Sep
        );
    }
}