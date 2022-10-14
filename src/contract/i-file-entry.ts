export interface IFileEntry {
    readonly name: string;
    readonly path: string;
    exists(): Promise<boolean>;
    moveTo(...paths: string[]): Promise<void>;
    remove(): Promise<void>;
}