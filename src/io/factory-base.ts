import { DirectoryBase } from './directory-base';
import { FileBase } from './file-base';
import { IONodeBase } from './node-base';

export abstract class IOFactoryBase {
    public abstract build(...pathArgs: string[]): Promise<IONodeBase>;
    public abstract buildDirectory(...pathArgs: string[]): DirectoryBase;
    public abstract buildFile(...pathArgs: string[]): FileBase;
}
