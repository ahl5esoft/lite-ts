import { IEnum } from './i-enum';
import { IEnumItemData } from './i-enum-item-data';

/**
 * 枚举工厂
 */
export abstract class EnumFacatoryBase {
    /**
     * 创建枚举对象
     * 
     * @param model 枚举模型函数
     */
    public abstract build<T extends IEnumItemData>(model: new () => T): IEnum<T>;
}