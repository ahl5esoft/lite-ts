export abstract class LockBase {
    public abstract lock(key: string, seconds: number): Promise<() => Promise<void>>;
}