import { IODirectoryBase } from './io-directory-base';
import { IOFileBase } from './io-file-base';
import { IONodeBase } from './io-node-base';

export abstract class IOFactoryBase {
    public abstract build(...paths: string[]): Promise<IONodeBase>;
    public abstract buildDirectory(...paths: string[]): IODirectoryBase;
    public abstract buildFile(...paths: string[]): IOFileBase;
}
