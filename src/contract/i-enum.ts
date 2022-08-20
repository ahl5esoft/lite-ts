import { IEnumItem } from './i-enum-item';
import { contract } from '../model';

/**
 * 枚举接口
 */
export interface IEnum<T extends contract.IEnumItem> {
    /**
     * 所有枚举项
     */
    readonly items: Promise<{ [value: number]: IEnumItem<T> }>;
    /**
     * 获取满足条件的单个枚举项
     * 
     * @param predicate 断言
     */
    get(predicate: (data: T) => boolean): Promise<IEnumItem<T>>;
}