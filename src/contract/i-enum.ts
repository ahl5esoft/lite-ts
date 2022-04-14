import { IEnumItem } from './i-enum-item';
import { IEnumItemData } from './i-enum-item-data';
import { IUnitOfWork } from './i-unit-of-work';

/**
 * 枚举接口
 */
export interface IEnum<T extends IEnumItemData> {
    /**
     * 所有枚举项
     */
    readonly items: Promise<IEnumItem<T>[]>;

    /**
     * 添加或者更新枚举数据
     * 
     * @param uow 工作单元
     * @param itemData 更新的数据
     */
    addOrSaveItem(uow: IUnitOfWork, itemData: T): Promise<void>;

    /**
     * 获取满足条件的单个枚举项
     * 
     * @param predicate 断言
     */
    get(predicate: (data: T) => boolean): Promise<IEnumItem<T>>;

    /**
     * 移除枚举数据
     * 
     * @param uow 工作单元
     * @param predicate 断言
     */
    removeItem(uow: IUnitOfWork, predicate: (data: T) => boolean): Promise<void>;
}