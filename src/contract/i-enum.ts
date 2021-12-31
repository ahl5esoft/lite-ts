import { IEnumItem } from './i-enum-item';
import { IEnumItemData } from './i-enum-item-data';

/**
 * 枚举接口
 */
export interface IEnum<T extends IEnumItemData> {
    /**
     * 获取所有枚举项
     */
    all(): Promise<IEnumItem<T>[]>;

    /**
     * 获取满足条件的枚举项
     * 
     * @param predicate 断言
     */
    get(predicate: (data: T) => boolean): Promise<IEnumItem<T>>;
}