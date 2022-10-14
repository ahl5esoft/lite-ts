import { existsSync, stat } from 'fs';
import { promisify } from 'util';

import { IODirectory } from './io-directory';
import { IOFile } from './io-file';
import { FileFactoryBase, IOFactoryBase } from '../../contract';

const statFunc = promisify(stat);

export class FSIOFactory extends IOFactoryBase {
    public constructor(
        private m_FileFactory: FileFactoryBase,
    ) {
        super();
    }

    public async build(...paths: string[]) {
        const fileEntry = this.m_FileFactory.buildFile(...paths);
        const isExist = existsSync(fileEntry.path);
        if (isExist) {
            const stats = await statFunc(fileEntry.path);
            const isDir = stats.isDirectory();
            if (isDir)
                return new IODirectory(this, fileEntry);
        }

        return new IOFile(this, fileEntry);
    }

    public buildDirectory(...paths: string[]) {
        return new IODirectory(
            this,
            this.m_FileFactory.buildFile(...paths),
        );
    }

    public buildFile(...paths: string[]) {
        return new IOFile(
            this,
            this.m_FileFactory.buildFile(...paths),
        );
    }
}
