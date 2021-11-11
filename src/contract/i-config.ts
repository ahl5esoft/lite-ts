export interface IConfig {
    get<T>(key?: string): Promise<T>;
    has(key?: string): Promise<boolean>;
}