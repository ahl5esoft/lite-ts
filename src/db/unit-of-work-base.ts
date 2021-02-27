export abstract class UnitOfWorkBase {
    public abstract commit(): Promise<void>;
}
