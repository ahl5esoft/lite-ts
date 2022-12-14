import { enum_ } from '../model';

export interface IEnumItem<T extends enum_.ItemData> {
    readonly entry: T;
    readonly langKey: string;
    getCustomLangKey(attr: string): string;
}