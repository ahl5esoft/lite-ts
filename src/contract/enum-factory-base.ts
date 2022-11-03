import { EnumBase } from './enum-base';
import { contract } from '../model';

export abstract class EnumFactoryBase {
    public abstract build<T extends contract.IEnumItem>(model: new () => T): EnumBase<T>;
}