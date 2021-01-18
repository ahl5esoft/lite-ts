export abstract class UnitOfWorkBase implements IUnitOfWork {
    public abstract commit(): Promise<void>;
    public abstract registerAdd(table: string, entry: any): void;
    public abstract registerRemove(table: string, entry: any): void;
    public abstract registerSave(table: string, entry: any): void;
}

export interface IUnitOfWork {
    commit(): Promise<void>;
}