import { IEnum } from './i-enum';
import { contract } from '../model';

/**
 * 枚举工厂
 */
export abstract class EnumFactoryBase {
    /**
     * 创建枚举对象
     * 
     * @param model 枚举模型函数
     */
    public abstract build<T extends contract.IEnumItem>(model: new () => T): IEnum<T>;
}