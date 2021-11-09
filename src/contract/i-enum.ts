import { IEnumItem } from './i-enum-item';
import { global } from '../model';

export interface IEnum {
    all(): Promise<IEnumItem[]>;
    get(predicate: (data: global.IEnumItemData) => boolean): Promise<IEnumItem>;
}