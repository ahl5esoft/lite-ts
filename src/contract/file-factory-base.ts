import { IDirectory } from './i-directory';
import { IFile } from './i-file';

export abstract class FileFactoryBase {
    public abstract buildDirectory(...paths: string[]): IDirectory;
    public abstract buildFile(...paths: string[]): IFile;
}