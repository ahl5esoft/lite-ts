import { join } from 'path';

import { FsDirectory } from './directory';
import { FsFile } from './file';
import { FileFactoryBase } from '../../contract';

export class FsFileFactory extends FileFactoryBase {
    public buildDirectory(...paths: string[]) {
        return new FsDirectory(
            this,
            join(...paths)
        );
    }

    public buildFile(...paths: string[]) {
        return new FsFile(
            this,
            join(...paths)
        );
    }
}