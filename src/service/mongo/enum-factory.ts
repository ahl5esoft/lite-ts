import { Enum } from './enum';
import { DbFactoryBase, EnumFacatoryBase } from '../..';

export class EnumFactory extends EnumFacatoryBase {
    public constructor(
        private m_DbFactory: DbFactoryBase
    ) {
        super();
    }

    public build<T>(model: new () => T) {
        return new Enum<T>(this.m_DbFactory, model.name);
    }
}