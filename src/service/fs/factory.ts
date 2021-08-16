import { existsSync, stat } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { FSDirectory } from './directory';
import { FSFile } from './file';
import { IODirectoryBase, IOFactoryBase, IOFileBase, IONodeBase } from '../../contract';

const statFunc = promisify(stat);

export class FSFactory extends IOFactoryBase {
    public async build(...paths: string[]): Promise<IONodeBase> {
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

    public buildDirectory(...paths: string[]): IODirectoryBase {
        return new FSDirectory(...paths);
    }

    public buildFile(...paths: string[]): IOFileBase {
        return new FSFile(...paths);
    }
}
