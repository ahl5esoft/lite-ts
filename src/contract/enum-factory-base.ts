import { IEnum } from './i-enum';

export abstract class EnumFacatoryBase {
    public abstract build<T>(model: new () => T): IEnum;
}