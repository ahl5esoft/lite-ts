import { FileFactoryBase } from './file-factory-base';

export interface IFileEntry {
    readonly factory: FileFactoryBase,
    readonly name: string;
    readonly path: string;
    exists(): Promise<boolean>;
    moveTo(v: any): Promise<void>;
    remove(): Promise<void>;
}