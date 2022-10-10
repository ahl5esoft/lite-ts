import { IFileEntry } from './i-file-entry';

export interface IFile extends IFileEntry {
    write(v: any): Promise<void>;
}