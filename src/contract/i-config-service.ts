export interface IConfigService {
    get<T>(key?: string): Promise<T>;
    has(key?: string): Promise<boolean>;
}