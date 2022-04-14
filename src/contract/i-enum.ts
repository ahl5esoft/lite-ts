import { IEnumItemData } from './i-enum-item-data';
import { IReadonlyEnum } from './i-readonly-enum';
import { IUnitOfWork } from './i-unit-of-work';

/**
 * 枚举接口
 */
export interface IEnum<T extends IEnumItemData> extends IReadonlyEnum<T> {
    /**
     * 添加或者保存枚举数据
     * 
     * @param uow 工作单元
     * @param itemData 枚举数据
     */
    addOrSaveItem(uow: IUnitOfWork, itemData: T): Promise<void>;

    /**
     * 移除枚举数据
     * 
     * @param uow 工作单元
     * @param predicate 断言
     */
    removeItem(uow: IUnitOfWork, predicate: (data: T) => boolean): Promise<void>;
}