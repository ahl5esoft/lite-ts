import { IFileEntryMoveToOption } from './i-file-entry-move-to-option';

export interface IFileEntry {
    readonly name: string;
    readonly path: string;
    exists(): Promise<boolean>;
    moveTo(v: IFileEntryMoveToOption): Promise<void>;
    remove(): Promise<void>;
}