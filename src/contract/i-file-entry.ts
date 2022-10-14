export interface IFileEntry {
    readonly name: string;
    readonly path: string;
    exists(): Promise<boolean>;
}