import { load } from 'js-yaml';

import { ConfigSerivce } from './config-service';
import { ConfigFactoryBase, IOFileBase } from '../../contract';

export class YamlConfigFactory extends ConfigFactoryBase {
    private m_Doc: any;

    public constructor(private m_File: IOFileBase) {
        super();
    }

    public build(model: Function) {
        return new ConfigSerivce(this, model.name);
    }

    public async getDoc() {
        if (!this.m_Doc) {
            const yml = await this.m_File.readString();
            this.m_Doc = load(yml);
        }

        return this.m_Doc;
    }
}