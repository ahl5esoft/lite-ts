import { FileBase } from './file-base';
import { NodeBase } from './node-base';

export abstract class DirectoryBase extends NodeBase {
    public abstract create(): Promise<void>;
    public abstract findDirectories(): Promise<DirectoryBase[]>;
    public abstract findFiles(): Promise<FileBase[]>;
}
