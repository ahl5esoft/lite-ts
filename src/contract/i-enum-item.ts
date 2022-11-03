import { contract } from '../model';

export interface IEnumItem<T extends contract.IEnumItem> {
    readonly entry: T;
    readonly langKey: string;
    getCustomLangKey(attr: string): string;
}