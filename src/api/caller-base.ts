export abstract class APICallerBase {
    protected body: { [key: string]: any; } = {};
    protected headers: { [key: string]: any; } = {};

    public setBody(value: { [key: string]: any; }): this {
        this.body = value;
        return this;
    }

    public setHeaders(value: { [key: string]: any; }): this {
        this.headers = value;
        return this;
    }

    public abstract call<T>(route: string, ms?: number): Promise<T>;
    public abstract voidCall(route: string): Promise<void>;
}