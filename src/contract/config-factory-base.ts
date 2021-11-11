import { IConfig } from './i-config';

export abstract class ConfigFactoryBase {
    public abstract build(model: Function): IConfig;
}