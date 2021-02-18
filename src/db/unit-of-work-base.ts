export abstract class DBUnitOfWorkBase {
    public abstract commit(): Promise<void>;
}
