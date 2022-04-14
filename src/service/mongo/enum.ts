import { TracerStrategy } from '../tracer';
import { DbFactoryBase, ICache, IEnum, IEnumItem, IEnumItemData, ITraceable, IUnitOfWork } from '../../contract';
import { global } from '../../model';

/**
 * mongo枚举
 */
export class MongoEnum<T extends IEnumItemData> implements IEnum<T>, ITraceable<IEnum<T>> {
    /**
     * 所有枚举项
     */
    public get items() {
        return new Promise<IEnumItem<T>[]>(async (s, f) => {
            try {
                const res = await this.m_Cache.get<IEnumItem<T>[]>(this.m_Name);
                s(res ?? []);
            } catch (ex) {
                f(ex);
            }
        });
    }

    /**
     * 构造函数
     * 
     * @param m_Cache 缓存
     * @param m_Name 枚举名
     */
    public constructor(
        private m_Cache: ICache,
        private m_DbFactory: DbFactoryBase,
        private m_Name: string,
    ) { }

    /**
     * 添加或者更新枚举数据
     * 
     * @param uow 工作单元
     * @param itemData 更新的数据
     */
    public async addOrSaveItem(uow: IUnitOfWork, dataItem: T) {
        const db = this.m_DbFactory.db(global.Enum, uow);
        const enums = await db.query().where({
            id: this.m_Name
        }).toArray();
        if (enums.length) {
            const index = enums[0].items.findIndex(r => r.value == dataItem.value);
            if (index > -1)
                enums[0].items[index] = dataItem;
            else
                enums[0].items.push(dataItem);
            await db.save(enums[0]);
        } else {
            enums.push({
                id: this.m_Name,
                items: [dataItem]
            });
            await db.add(enums[0]);
        }
        this.m_Cache.flush();
    }

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
     * 移除枚举数据
     * 
     * @param uow 工作单元
     * @param predicate 断言
     */
    public async removeItem(uow: IUnitOfWork, predicate: (data: T) => boolean): Promise<void> {
        const item = await this.get(predicate);
        if (item) {
            const db = this.m_DbFactory.db(global.Enum, uow);
            const enums = await db.query().where({
                id: this.m_Name
            }).toArray();
            const index = enums[0].items.findIndex(predicate);
            enums[0].items.splice(index, 1);
            await db.save(enums[0]);
        }
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        return new MongoEnum(
            new TracerStrategy(this.m_Cache).withTrace(parentSpan),
            this.m_DbFactory,
            this.m_Name,
        ) as IEnum<T>;
    }
}