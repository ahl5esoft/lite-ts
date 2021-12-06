import { EnumItem } from '.';
import { IEnum, IEnumItem, IEnumItemData } from '../..';

export class DefaultEnum<T extends IEnumItemData> implements IEnum<T> {
    private m_Items: IEnumItem<T>[];

    public constructor(enumName: string, itemDatas: T[]) {
        this.m_Items = itemDatas.map(r => {
            return new EnumItem(r, enumName);
        });
    }

    public async all() {
        return this.m_Items;
    }

    public async get(predicate: (data: T) => boolean) {
        return this.m_Items.find(r => {
            return predicate(r.data);
        });
    }
}