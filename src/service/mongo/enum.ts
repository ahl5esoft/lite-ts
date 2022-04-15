import { DbFactoryBase, ICache, IEnum, IEnumItem, IEnumItemData, IUnitOfWork } from '../../contract';
import { global } from '../../model';

/**
 * 可编辑的Mongo枚举服务
 */
export class MongoEnum<T extends IEnumItemData> implements IEnum<T> {
    public get items() {
        return new Promise<IEnumItem<T>[]>(async (s, f) => {
            try {
                const res = await this.m_Cache.get<IEnumItem<T>[]>(this.m_Name);
                s(res);
            } catch (ex) {
                f(ex);
            }
        });
    }

    public constructor(
        private m_Cache: ICache,
        private m_DbFactory: DbFactoryBase,
        private m_Name: string,
    ) { }

    /**
     * 添加或者保存枚举数据
     * 
     * @param uow 工作单元
     * @param itemData 枚举数据
     */
    public async addOrSaveItem(uow: IUnitOfWork, itemData: T) {
        const enumItems = await this.items;
        const db = this.m_DbFactory.db(global.Enum, uow);
        if (enumItems) {
            const items = enumItems.map(r => r.data);
            const index = items.findIndex(r => {
                return r.value == itemData.value;
            });
            items[index] = itemData;
            await db.save({
                id: this.m_Name,
                items: items
            });
        } else {
            await db.add({
                id: this.m_Name,
                items: [itemData]
            });
        }
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
    public async removeItem(uow: IUnitOfWork, predicate: (data: T) => boolean) {
        const enumItems = await this.items;
        if (!enumItems)
            return;

        const items = enumItems.map(r => r.data);
        const index = items.findIndex(r => {
            return predicate(r);
        });
        if (index > -1) {
            items.splice(index, 1);
            await this.m_DbFactory.db(global.Enum, uow).save({
                id: this.m_Name,
                items: items
            });
        }
    }
}