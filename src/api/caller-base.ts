export abstract class APICallerBase {
    public abstract call<T>(route: string, body?: object, ms?: number): Promise<T>;
    public abstract voidCall(route: string, body?: object): Promise<void>;
}