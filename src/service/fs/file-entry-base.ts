import { existsSync } from 'fs';
import { rename } from 'fs/promises';
import { basename, join } from 'path';

import { IFileEntry } from '../../contract';

export abstract class FsFileEntryBase implements IFileEntry {
    public name: string;

    public constructor(
        public path: string,
    ) {
        this.name = basename(path);
    }

    public async exists() {
        return existsSync(this.path);
    }

    public async moveTo(...paths: string[]) {
        await rename(
            this.path,
            join(...paths)
        );
    }

    public abstract remove(): Promise<void>;
}