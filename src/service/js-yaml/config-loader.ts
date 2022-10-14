import { load } from 'js-yaml';

import { ConfigLoaderBase, IFile } from '../../contract';

export class JsYamlConfigLoader extends ConfigLoaderBase {
    private m_Doc: any;

    public constructor(
        private m_File: IFile,
    ) {
        super();
    }

    public async load<T>(ctor: new () => T) {
        if (!this.m_Doc) {
            const yml = await this.m_File.readString();
            this.m_Doc = load(yml);
        }

        return this.m_Doc[ctor.name] as T;
    }
}