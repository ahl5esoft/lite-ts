import { IEnumItem } from './i-enum-item';

export interface IEnum<T> {
    all(): Promise<IEnumItem<T>[]>;
    get(predicate: (data: T) => boolean): Promise<IEnumItem<T>>;
}