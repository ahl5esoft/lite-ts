import { existsSync, stat } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { OSDirectory } from './directory';
import { OSFile } from './file';
import { IOFactoryBase } from '../io/factory-base';
import { IONodeBase } from '../io/node-base';

const statFunc = promisify(stat);

export class OSFactory extends IOFactoryBase {
    public async build(...paths: string[]): Promise<IONodeBase> {
        const nodePath = join(...paths);
        const isExist = existsSync(nodePath);
        if (isExist) {
            const stats = await statFunc(nodePath);
            const isDir = stats.isDirectory();
            if (isDir)
                return new OSDirectory(nodePath);
        }

        return new OSFile(nodePath);
    }

    public buildDirectory(...paths: string[]): OSDirectory {
        return new OSDirectory(...paths);
    }

    public buildFile(...paths: string[]): OSFile {
        return new OSFile(...paths);
    }
}
