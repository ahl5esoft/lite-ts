import { FileBase } from './file-base';
import { IONodeBase } from './node-base';

export abstract class DirectoryBase extends IONodeBase {
    public abstract childDirectories(): Promise<DirectoryBase[]>;
    public abstract childFiles(): Promise<FileBase[]>;
    public abstract mk(): Promise<void>;
}
