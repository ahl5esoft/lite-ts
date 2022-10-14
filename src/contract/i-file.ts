import { IFileEntry } from './i-file-entry';

export interface IFile extends IFileEntry {
    read<T>(): Promise<T>;
    readString(): Promise<string>;
    readYaml<T>(): Promise<T>;
    write(v: any): Promise<void>;
}