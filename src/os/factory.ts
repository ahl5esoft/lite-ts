import { existsSync, stat } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { OSDirectory } from './directory';
import { OSFile } from './file';
import { IOFactoryBase } from '../factory-base';
import { IONodeBase } from '../node-base';

const statFunc = promisify(stat);

export class OSFactory extends IOFactoryBase {
    public async build(...pathArgs: string[]): Promise<IONodeBase> {
        const nodePath = join(...pathArgs);
        const isExist = existsSync(nodePath);
        if (isExist) {
            const stats = await statFunc(nodePath);
            const isDir = stats.isDirectory();
            if (isDir) {
                return new OSDirectory(nodePath);
            }
        }

        return new OSFile(nodePath);
    }

    public buildDirectory(...pathArgs: string[]): OSDirectory {
        return new OSDirectory(...pathArgs);
    }

    public buildFile(...pathArgs: string[]): OSFile {
        return new OSFile(...pathArgs);
    }
}
