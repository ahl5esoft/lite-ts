import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { basename } from 'path';

import { IFile } from '../../contract';

export class FsFile implements IFile {
    public name: string;

    public constructor(
        public path: string,
    ) {
        this.name = basename(this.path);
    }

    public async exists() {
        return existsSync(this.path);
    }

    public async write(v: any) {
        if (typeof v == 'string')
            await writeFile(this.path, v);
    }
}