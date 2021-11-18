export interface IConfig<T> {
    get(): Promise<T>;
}