import { Config } from './config';
import { ConfigFactoryBase, DbFactoryBase } from '../..';

export class MongoConfigFactory extends ConfigFactoryBase {
    public constructor(
        private m_DbFactory: DbFactoryBase
    ) {
        super();
    }

    public build<T>(ctor: new () => T) {
        return new Config<T>(this.m_DbFactory, ctor);
    }
}