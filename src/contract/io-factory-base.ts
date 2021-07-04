import { DirectoryBase } from './directory-base';
import { FileBase } from './file-base';
import { IONodeBase } from './io-node-base';

export abstract class IOFactoryBase {
    public abstract build(...paths: string[]): Promise<IONodeBase>;
    public abstract buildDirectory(...paths: string[]): DirectoryBase;
    public abstract buildFile(...paths: string[]): FileBase;
}
