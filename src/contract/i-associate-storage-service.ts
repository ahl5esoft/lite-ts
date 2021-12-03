export interface IAssociateStorageService {
    add<T>(model: new () => T, entry: T): void;
    clear<T>(model: new () => T, filterFunc: (r: T) => boolean): void;
    find<T>(model: new () => T, filterFunc: (r: T) => boolean): Promise<T[]>;
}