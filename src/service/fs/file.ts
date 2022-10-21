import { readFile, unlink, writeFile } from 'fs/promises';
import { load } from 'js-yaml';
import { extname } from 'path';

import { FsFileEntryBase } from './file-entry-base';
import { IFile } from '../../contract';

export class FsFile extends FsFileEntryBase implements IFile {
    private m_Ext: string;
    public get ext() {
        this.m_Ext ??= extname(this.path);
        return this.m_Ext;
    }

    public async read<T>() {
        const res = await this.readString();
        return JSON.parse(res) as T;
    }

    public async readString() {
        return readFile(this.path, 'utf-8');
    }

    public async readYaml<T>() {
        const res = await this.readString();
        return load(res) as T;
    }

    public async remove() {
        await unlink(this.path);
    }

    public async write(v: any) {
        if (typeof v == 'string')
            await writeFile(this.path, v);
    }
}