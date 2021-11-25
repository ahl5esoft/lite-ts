export interface ITargetStorageService {
    addAssociate<T>(model: new () => T, associateID: string, entry: T): void;
    clear<T>(model: new () => T, associateID: string): void;
    findAssociates<T>(model: new () => T, column: string, associateID: string): Promise<T[]>;
}