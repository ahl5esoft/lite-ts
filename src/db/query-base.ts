export abstract class DBQueryBase<T> {
    public abstract count(): Promise<number>;
    public abstract order(...fields: string[]): this;
    public abstract orderByDesc(...fields: string[]): this;
    public abstract skip(value: number): this;
    public abstract take(value: number): this;
    public abstract toArray(): Promise<T[]>;
    public abstract where(selecor: any): this;
}
