import { basename } from 'path';

import { IFileEntry } from '../../contract';

export class QiniuFileEntry implements IFileEntry {
    public name: string;

    public constructor(
        public path: string,
    ) {
        this.name = basename(path);
    }
}