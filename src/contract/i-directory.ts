import { IFile } from './i-file';
import { IFileEntry } from './i-file-entry';

export interface IDirectory extends IFileEntry {
    create(): Promise<void>;
    findDirectories(): Promise<IDirectory[]>;
    findFiles(): Promise<IFile[]>;
}