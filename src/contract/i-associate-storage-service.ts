export interface IAssociateStorageService {
    add<T>(model: new () => T, associateID: string, entry: T): void;
    clear<T>(model: new () => T, associateID: string): void;
    find<T>(model: new () => T, column: string, associateID: string): Promise<T[]>;
}