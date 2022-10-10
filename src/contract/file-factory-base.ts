import { IFile } from './i-file';

export abstract class FileFactoryBase {
    public abstract buildFile(...paths: string[]): IFile;
}