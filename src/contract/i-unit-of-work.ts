export interface IUnitOfWork {
    commit(): Promise<void>;
    registerAfter(action: () => Promise<void>): void;
}
