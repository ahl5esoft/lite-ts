import { YamlConfigFactory } from './config-factory';
import { IConfigService } from '../../contract';

export class ConfigSerivce implements IConfigService {
    public constructor(private m_Factory: YamlConfigFactory, private m_Group: string) { }

    public async get(key?: string) {
        const doc = await this.m_Factory.getDoc();
        let value = doc[this.m_Group];
        if (key && value)
            value = value[key];
        return value;
    }

    public async has(key?: string) {
        const doc = await this.m_Factory.getDoc();
        let value = doc[this.m_Group];
        if (key)
            return value ? key in value : false;

        return !!value;
    }
}