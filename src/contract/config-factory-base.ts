import { IConfigService } from './i-config-service';

export abstract class ConfigFactoryBase {
    public abstract build(model: Function): IConfigService;
}