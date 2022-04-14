import { IEnumItem } from './i-enum-item';
import { IEnumItemData } from './i-enum-item-data';

/**
 * 只读枚举接口
 */
export interface IReadonlyEnum<T extends IEnumItemData> {
    /**
     * 所有枚举项
     */
    readonly items: Promise<IEnumItem<T>[]>;

    /**
     * 获取满足条件的单个枚举项
     * 
     * @param predicate 断言
     */
    get(predicate: (data: T) => boolean): Promise<IEnumItem<T>>;
}