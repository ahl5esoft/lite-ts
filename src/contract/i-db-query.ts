export interface IDBQuery<T> {
    count(): Promise<number>;
    order(...fields: string[]): this;
    orderByDesc(...fields: string[]): this;
    skip(value: number): this;
    take(value: number): this;
    toArray(): Promise<T[]>;
    where(selecor: any): this;
}
