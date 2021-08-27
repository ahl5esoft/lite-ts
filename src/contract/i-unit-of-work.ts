export interface IUnitOfWork {
    commit(): Promise<void>;
}
