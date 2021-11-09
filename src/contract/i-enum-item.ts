import { global } from '../model';

export interface IEnumItem {
    readonly data: global.IEnumItemData;
    readonly encodingKey: string;
    getCustomEncodingKey(attr: string): string;
}