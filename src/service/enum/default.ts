import { EnumItem } from './item';
import { IEnum, IEnumItem, IEnumItemData } from '../..';

/**
 * 默认枚举
 */
export class DefaultEnum<T extends IEnumItemData> implements IEnum<T> {
    private m_Items: IEnumItem<T>[];

    /**
     * 构造函数
     * 
     * @param enumName 枚举名
     * @param itemDatas 枚举项数据
     */
    public constructor(enumName: string, itemDatas: T[], sep: string) {
        this.m_Items = itemDatas.map(r => {
            return new EnumItem(r, enumName, sep);
        });
    }

    /**
     * 所有项
     */
    public async all() {
        return this.m_Items;
    }

    /**
     * 获取符合条件的第一项
     * 
     * @param predicate 断言
     */
    public async get(predicate: (data: T) => boolean) {
        return this.m_Items.find(r => {
            return predicate(r.data);
        });
    }
}