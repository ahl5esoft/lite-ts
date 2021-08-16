export abstract class ConfigServiceBase {
    public abstract get<T>(key?: string): Promise<T>;
    public abstract has(key?: string): Promise<boolean>;
}