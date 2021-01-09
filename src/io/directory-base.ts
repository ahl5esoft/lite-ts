import { FileBase } from './file-base';
import { IONodeBase } from './node-base';

export abstract class DirectoryBase extends IONodeBase {
    public abstract create(): Promise<void>;
    public abstract findDirectories(): Promise<DirectoryBase[]>;
    public abstract findFiles(): Promise<FileBase[]>;
}
