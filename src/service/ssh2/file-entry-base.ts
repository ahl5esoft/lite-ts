import { basename } from 'path';

import { Ssh2FileFactory } from './file-factory';
import { IFileEntry } from '../../contract';

export abstract class Ssh2FileEntryBase implements IFileEntry {
    public static errNotImplemented = new Error('未实现');

    public name: string;

    public constructor(
        public factory: Ssh2FileFactory,
        public path: string,
    ) {
        this.name = basename(this.path);
    }

    public async exists() {
        return this.factory.invokeSftp<boolean>(r => r.exists, this.path);
    }

    public abstract moveTo(v: any): Promise<void>;
    public abstract remove(): Promise<void>;
}