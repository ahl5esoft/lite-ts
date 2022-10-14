import { join } from 'path';

import { FsFile } from './file';
import { FileFactoryBase } from '../../contract';

export class FsFileFactory extends FileFactoryBase {
    public buildFile(...paths: string[]) {
        return new FsFile(
            join(...paths)
        );
    }
}