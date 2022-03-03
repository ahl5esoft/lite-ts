import { existsSync, stat } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { IODirectory } from './io-directory';
import { IOFile } from './io-file';
import { IODirectoryBase, IOFactoryBase, IOFileBase, IONodeBase } from '../..';

const statFunc = promisify(stat);

export class FSIOFactory extends IOFactoryBase {
    public async build(...paths: string[]): Promise<IONodeBase> {
        const nodePath = join(...paths);
        const isExist = existsSync(nodePath);
        if (isExist) {
            const stats = await statFunc(nodePath);
            const isDir = stats.isDirectory();
            if (isDir)
                return new IODirectory(this, paths);
        }

        return new IOFile(this, paths);
    }

    public buildDirectory(...paths: string[]): IODirectoryBase {
        return new IODirectory(this, paths);
    }

    public buildFile(...paths: string[]): IOFileBase {
        return new IOFile(this, paths);
    }
}
