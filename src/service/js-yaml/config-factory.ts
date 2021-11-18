import { load } from 'js-yaml';

import { Config } from './config';
import { ConfigFactoryBase, IOFileBase } from '../../contract';

export class YamlConfigFactory extends ConfigFactoryBase {
    private m_Doc: any;

    public constructor(private m_File: IOFileBase) {
        super();
    }

    public build<T>(ctor: new () => T) {
        return new Config<T>(ctor.name, this);
    }

    public async getDoc() {
        if (!this.m_Doc) {
            const yml = await this.m_File.readString();
            this.m_Doc = load(yml);
        }

        return this.m_Doc;
    }
}