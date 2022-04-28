import { CacheBase, DbFactoryBase, IEnum, IEnumItemData, IReadonlyEnum, IUnitOfWork } from '../../contract';
import { global } from '../../model';

/**
 * 可编辑的Mongo枚举服务
 */
export class MongoEnum<T extends IEnumItemData> implements IEnum<T> {
    /**
     * 枚举项
     */
    public get items() {
        return this.m_ReadonlyEnum.items;
    }

    /**
     * 构造函数
     * 
     * @param m_ReadonlyEnum 只读枚举
     * @param m_Cache 缓存
     * @param m_DbFactory 数据库工厂
     * @param m_Name 枚举名
     */
    public constructor(
        private m_ReadonlyEnum: IReadonlyEnum<T>,
        private m_Cache: CacheBase,
        private m_DbFactory: DbFactoryBase,
        private m_Name: string,
    ) { }

    /**
     * 添加或者修改枚举项
     * 
     * @param uow 工作单元
     * @param itemData 枚举项数据
     */
    public async addOrSaveItem(uow: IUnitOfWork, itemData: T) {
        const enumItems = await this.items;
        const db = this.m_DbFactory.db(global.Enum, uow);
        if (enumItems?.length) {
            await db.save({
                id: this.m_Name,
                items: enumItems.reduce((memo, r) => {
                    if (r.data.value != itemData.value)
                        memo.push(r.data);

                    return memo;
                }, [itemData])
            });
        } else {
            await db.add({
                id: this.m_Name,
                items: [itemData]
            });
        }

        this.m_Cache.flush();
    }

    /**
     * 获取第一个满足条件的项
     * 
     * @param predicate 断言
     */
    public async get(predicate: (data: T) => boolean) {
        return this.m_ReadonlyEnum.get(predicate);
    }

    /**
     * 删除枚举项
     * 
     * @param uow 工作单元
     * @param predicate 断言
     */
    public async removeItem(uow: IUnitOfWork, predicate: (data: T) => boolean) {
        const enumItems = await this.items;
        if (!enumItems?.length)
            return;

        await this.m_DbFactory.db(global.Enum, uow).save({
            id: this.m_Name,
            items: enumItems.reduce((memo, r) => {
                if (!predicate(r.data))
                    memo.push(r.data);

                return memo;
            }, [])
        });

        this.m_Cache.flush();
    }
}