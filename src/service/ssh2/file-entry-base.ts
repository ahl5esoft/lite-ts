import { basename } from 'path';

import { Ssh2FileFactory } from './file-factory';
import { IFileEntry, IFileEntryMoveToOption } from '../../contract';

export abstract class Ssh2FileEntryBase implements IFileEntry {
    public static errNotImplemented = new Error('未实现');

    public name: string;

    public constructor(
        public path: string,
        protected fileFactory: Ssh2FileFactory,
    ) {
        this.name = basename(this.path);
    }

    public async exists() {
        return this.fileFactory.invokeSftp<boolean>(r => r.exists, this.path);
    }

    public abstract moveTo(v: IFileEntryMoveToOption): Promise<void>;
    public abstract remove(): Promise<void>;
}