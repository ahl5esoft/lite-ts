import { load } from 'js-yaml';

import { ConfigBase } from '../conf';
import { FileBase } from '../../io';

export class YmlConfig extends ConfigBase {
    private m_Doc: any;

    public constructor(private m_File: FileBase) {
        super();
    }

    public async get<T>(group: string, key?: string): Promise<T> {
        if (!this.m_Doc) {
            const yml = await this.m_File.readString();
            this.m_Doc = load(yml);
        }

        let value = this.m_Doc[group];
        if (key && value)
            value = value[key];

        return value;
    }
}