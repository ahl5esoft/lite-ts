import { IEnumItem, IEnumItemData } from '.';

export interface IEnum<T extends IEnumItemData> {
    all(): Promise<IEnumItem<T>[]>;
    get(predicate: (data: T) => boolean): Promise<IEnumItem<T>>;
}