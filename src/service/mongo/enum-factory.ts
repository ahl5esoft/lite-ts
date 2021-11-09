import { Enum } from './enum';
import { DBFactoryBase, EnumFacatoryBase } from '../..';

export class EnumFactory extends EnumFacatoryBase {
    public constructor(
        private m_DbFactory: DBFactoryBase
    ) {
        super();
    }

    public build<T>(model: new () => T) {
        return new Enum(this.m_DbFactory, model.name);
    }
}