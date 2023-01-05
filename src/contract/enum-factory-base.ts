import { EnumBase } from './enum-base';
import { enum_ } from '../model';

export abstract class EnumFactoryBase {
    public abstract build<T extends enum_.ItemData>(model: new () => T): EnumBase<T>;
}