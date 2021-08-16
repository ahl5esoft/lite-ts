import { ConfigServiceBase } from './config-service-base';

export abstract class ConfigFactoryBase {
    public abstract build(group: string): ConfigServiceBase;
}