import { contract } from '../model';

/**
 * 枚举项接口
 */
export interface IEnumItem<T extends contract.IEnumItem> {
    /**
     * 枚举项数据
     */
    readonly data: T;

    /**
     * 多语言键, 格式为: enum-枚举名-枚举值
     */
    readonly encodingKey: string;

    /**
     * 获取多语言键, 格式为: enum-枚举名-枚举值-attr
     * 
     * @param attr 特性
     */
    getCustomEncodingKey(attr: string): string;
}