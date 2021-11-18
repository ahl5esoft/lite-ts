import { IConfig } from './i-config';

export abstract class ConfigFactoryBase {
    public abstract build<T>(ctor: new () => T): IConfig<T>;
}