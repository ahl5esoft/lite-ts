import { existsSync, stat } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { FSDirectory } from './directory';
import { FSFile } from './file';
import { IOFactoryBase } from '../../contract';

const statFunc = promisify(stat);

export class FSFactory extends IOFactoryBase {
    public async build(...paths: string[]) {
        const nodePath = join(...paths);
        const isExist = existsSync(nodePath);
        if (isExist) {
            const stats = await statFunc(nodePath);
            const isDir = stats.isDirectory();
            if (isDir)
                return new FSDirectory(nodePath);
        }

        return new FSFile(nodePath);
    }

    public buildDirectory(...paths: string[]) {
        return new FSDirectory(...paths);
    }

    public buildFile(...paths: string[]) {
        return new FSFile(...paths);
    }
}
