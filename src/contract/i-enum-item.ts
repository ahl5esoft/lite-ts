import { IEnumItemData } from '.';

export interface IEnumItem<T extends IEnumItemData> {
    readonly data: T;
    readonly encodingKey: string;
    getCustomEncodingKey(attr: string): string;
}