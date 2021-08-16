import { IOFileBase } from './io-file-base';
import { IONodeBase } from './io-node-base';

export abstract class IODirectoryBase extends IONodeBase {
    public abstract create(): Promise<void>;
    public abstract findDirectories(): Promise<IODirectoryBase[]>;
    public abstract findFiles(): Promise<IOFileBase[]>;
}
