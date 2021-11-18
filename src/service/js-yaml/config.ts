import { YamlConfigFactory } from './config-factory';
import { IConfig } from '../../contract';

export class Config<T> implements IConfig<T> {
    public constructor(
        private m_Group: string,
        private m_Factory: YamlConfigFactory,
    ) { }

    public async get() {
        const doc = await this.m_Factory.getDoc();
        return doc[this.m_Group] as T;
    }
}