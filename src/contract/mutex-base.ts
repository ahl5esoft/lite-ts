export abstract class MutexBase {
    public abstract lock(opt?: any): Promise<() => Promise<void>>;
}