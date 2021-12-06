import { IEnumItemData } from '.';
import { IEnum } from './i-enum';

export abstract class EnumFacatoryBase {
    public abstract build<T extends IEnumItemData>(model: new () => T): IEnum<T>;
}